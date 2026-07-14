#!/usr/bin/env python3
"""Assemble an instance's report-data.js from verbatim MCP pulls.

Usage:
  python3 assemble_report_data.py <workspace_dir> <instance_dirname>

<workspace_dir> layout (see references/mcp-queries.md for the pull that feeds
each file — save every MCP result VERBATIM, one file per pull):
  pulls/channel_mix.json              Phase 1 channel-mix SQL rows
  pulls/excluded.json                 Phase 1 excluded-tallies SQL (1 row)
  pulls/traffic_misc.json             Phase 1 traffic+funnel SQL (1 row)
  pulls/roster.json                   Phase 1 active-roster SQL (1 row, 1 count)
  pulls/groups_list.json              Phase 2 list_groups output (verbatim)
  pulls/group_members*.json           Phase 2 get_group results; one or many files,
                                      each {"<group_slug>": ["<vr_slug>", ...], ...}
                                      or {"slug": "...", "members": [...]}
  pulls/per_property_direct.json      Phase 2 per-property DIRECT funnel SQL rows
  pulls/per_property_views.json       Phase 2 per-property human views SQL rows
  pulls/journeys_direct_linked.json   Phase 3 get_journey rollup: {"rows":[{kid_sid,
                                      payout_cents, source}, ...]} (extra keys fine)
  pulls/ai_overlap.json               Phase 3 inferred-overlap SQL (1 row)
  pulls/intent_by_checkin_month.json  Phase 3 date-pressure SQL rows
  pulls/geo.json                      Phase 3 geo SQL rows (context print only)
  pulls/group_page_paths.json         optional path-probe rows (context print only)

Two-step flow:
  1. DRY RUN (no judgment.json yet): prints the working table with strict
     quadrant suggestions plus every rollup you need. Review it, then write
     judgment.json and final_overrides.json in <workspace_dir>.
  2. ASSEMBLE (both files present): validates and writes
     <workspace_dir>/<instance_dirname>/report-data.js.

judgment.json — analyst judgment per included group slug:
  { "<group_slug>": { "type": "region"|"theme",        REQUIRED per included group
                      "quadrant": "expand|fix|fuel|hold|baseline",  optional override
                                                       (stay within ~±12% of a median
                                                       when overriding a strict call)
                      "note": "one line, <=95 chars",  REQUIRED for highlighted rows
                      "name": "display override",      optional (defaults to label)
                      "highlight": true },             the 5-7 rows readers must see
    "_include": ["slug", ...],   force-include below-floor groups (traffic outliers)
    "_exclude": ["slug", ...] }  force-exclude despite passing the floor

final_overrides.json — the hand-written blocks, exactly as they land in
report-data.js: meta, headlineStats, longTail, trends (labels are lookup keys —
keep them verbatim), and optional flags {anatomy, opp5, logo, outlier: false to
suppress that block}.

Basis (must match the SQL you ran): 30d on booked_at, statuses
confirmed|converted|reserved|closed, NOT owner stays, money = host payout.
"""
import glob
import json
import os
import statistics
import sys

CH_LABEL = {"DIRECT": "Direct", "VRBO": "Vrbo", "AIRBNB": "Airbnb",
            "BOOKING_COM": "Booking.com", "OTHER": "Other"}
SRC_LABEL = {"referral": "Referral", "chatgpt": "AI assistant (ChatGPT)",
             "claude": "AI assistant (Claude)", "perplexity": "AI assistant (Perplexity)",
             "direct": "Typed-in direct", "google": "Organic Google",
             "bing": "Organic Bing", "kismet_storefront": "Kismet storefront (referral)"}
AI_SOURCES = {"chatgpt", "claude", "perplexity", "gemini", "copilot"}
QUADRANTS = {"expand", "fix", "fuel", "hold", "baseline"}


def die(msg):
    sys.exit(f"assemble_report_data: {msg}")


def load(path, required=True):
    if not os.path.exists(path):
        if required:
            die(f"missing pull: {path} (see references/mcp-queries.md)")
        return None
    with open(path) as f:
        return json.load(f)


ENVELOPE_KEYS = {"rows", "row_count", "sql_executed", "truncated", "query"}


def unwrap(data):
    """run_readonly_sql results may be saved as the full envelope
    ({sql_executed, row_count, rows: [...]}) — reduce to the rows."""
    if isinstance(data, dict) and isinstance(data.get("rows"), list) and \
            len(ENVELOPE_KEYS & set(data)) >= 2:
        return data["rows"]
    return data


def one_row(data, name):
    data = unwrap(data)
    if isinstance(data, list):
        if len(data) != 1:
            die(f"{name}: expected exactly 1 row, got {len(data)}")
        return data[0]
    if isinstance(data, dict):
        if ENVELOPE_KEYS & set(data):
            die(f"{name}: looks like a result envelope without usable rows")
        return data
    die(f"{name}: expected a row object or 1-row list")


def rows_of(data, name):
    """Tolerate a bare list or a wrapper object with the list under a common key."""
    data = unwrap(data)
    if isinstance(data, list):
        return data
    if isinstance(data, dict):
        for key in ("rows", "groups", "results", "data", "items"):
            if isinstance(data.get(key), list):
                return data[key]
    die(f"{name}: could not find the row list (bare list or rows/groups/results key)")


def group_meta(groups_list):
    """slug -> {label, memberCount?} from a verbatim list_groups payload."""
    out = {}
    for g in rows_of(groups_list, "groups_list.json"):
        if not isinstance(g, dict):
            continue
        slug = g.get("slug") or g.get("group_slug") or g.get("groupSlug")
        if not slug:
            continue
        label = g.get("label") or g.get("name") or g.get("title") or slug
        out[slug] = {"label": label, "memberCount": g.get("memberCount")}
    if not out:
        die("groups_list.json: parsed zero groups — save the verbatim list_groups output")
    return out


def main():
    if len(sys.argv) != 3:
        die(__doc__.strip().splitlines()[2].strip())
    W = os.path.abspath(sys.argv[1])
    P = os.path.join(W, "pulls")
    instance = os.path.join(W, sys.argv[2])

    channel_mix = rows_of(load(os.path.join(P, "channel_mix.json")), "channel_mix.json")
    excluded = one_row(load(os.path.join(P, "excluded.json")), "excluded.json")
    traffic = one_row(load(os.path.join(P, "traffic_misc.json")), "traffic_misc.json")
    roster_row = one_row(load(os.path.join(P, "roster.json")), "roster.json")
    roster = next((v for k, v in roster_row.items()
                   if isinstance(v, (int, float)) and k not in ENVELOPE_KEYS), None)
    if not roster:
        die("roster.json: no numeric count found")
    groups = group_meta(load(os.path.join(P, "groups_list.json")))

    members = {}
    member_files = sorted(glob.glob(os.path.join(P, "group_members*.json")))
    if not member_files:
        die("no pulls/group_members*.json — save get_group member lists")
    for path in member_files:
        blob = json.load(open(path))
        if isinstance(blob, dict) and isinstance(blob.get("members"), list):
            members[blob["slug"]] = blob["members"]
        elif isinstance(blob, dict):
            for slug, mem in blob.items():
                if isinstance(mem, list):
                    members[slug] = mem
        else:
            die(f"{os.path.basename(path)}: expected slug->members map")
    unknown = sorted(set(members) - set(groups))
    if unknown:
        print(f"NOTE: member lists for slugs not in groups_list: {unknown}")
    # transcription guard: hand-collected member lists must match list_groups counts
    for slug, mem in sorted(members.items()):
        expect = groups.get(slug, {}).get("memberCount")
        if expect is not None and expect != len(mem):
            print(f"WARNING: {slug}: {len(mem)} member slugs collected but list_groups "
                  f"says memberCount={expect} — re-check the get_group transcription")

    prop_direct = {r["vacation_rental_slug"]: r for r in
                   rows_of(load(os.path.join(P, "per_property_direct.json")), "per_property_direct.json")}
    prop_views = {r["vacation_rental_slug"]: r["property_views"] for r in
                  rows_of(load(os.path.join(P, "per_property_views.json")), "per_property_views.json")}
    journeys = rows_of(load(os.path.join(P, "journeys_direct_linked.json")), "journeys_direct_linked.json")
    ai_overlap = one_row(load(os.path.join(P, "ai_overlap.json")), "ai_overlap.json")
    intent_months = rows_of(load(os.path.join(P, "intent_by_checkin_month.json")), "intent_by_checkin_month.json")
    geo = load(os.path.join(P, "geo.json"), required=False)
    paths = load(os.path.join(P, "group_page_paths.json"), required=False)

    jpath = os.path.join(W, "judgment.json")
    fpath = os.path.join(W, "final_overrides.json")
    JUDGMENT = json.load(open(jpath)) if os.path.exists(jpath) else {}
    FINAL = json.load(open(fpath)) if os.path.exists(fpath) else {}
    force_in = set(JUDGMENT.get("_include", []))
    force_out = set(JUDGMENT.get("_exclude", []))

    # ---- group stats: DIRECT funnel only (group pages drive the direct site;
    # OTA belongs to the channel mix). Groups overlap — never sum group rows.
    stats = {}
    for slug, mem in members.items():
        stats[slug] = {
            "members": len(mem),
            "bookings": sum(prop_direct.get(m, {}).get("direct_bookings", 0) for m in mem),
            "payout_cents": sum(prop_direct.get(m, {}).get("direct_payout_cents", 0) for m in mem),
            "views": sum(prop_views.get(m, 0) for m in mem),
        }

    # inclusion floor: members >= 5 AND direct bookings >= 3 (long tail otherwise);
    # judgment _include/_exclude override per slug.
    included = [s for s, v in stats.items()
                if ((v["members"] >= 5 and v["bookings"] >= 3) or s in force_in)
                and s not in force_out and v["views"] > 0]
    included.sort(key=lambda s: -stats[s]["bookings"])
    if not included:
        die("no groups pass the inclusion floor — check per-property pulls, or _include outliers")

    demands = [stats[s]["views"] / stats[s]["members"] for s in included]
    convs = [stats[s]["bookings"] / stats[s]["views"] * 1000 for s in included]
    med_d, med_c = statistics.median(demands), statistics.median(convs)

    print(f"medians: demand={med_d:.1f}/home  conversion={med_c:.2f}/1k  "
          f"(roster {roster} active; {len(included)} groups included, "
          f"{len(stats) - len(included)} long-tail)")
    print(f"{'group':36} {'mem':>4} {'views':>7} {'bk':>3} {'payout$':>9} {'dem':>5} {'conv':>5}  strict")
    strict = {}
    for s in included:
        v = stats[s]
        d = v["views"] / v["members"]
        c = v["bookings"] / v["views"] * 1000
        q = ("expand" if c >= med_c else "fix") if d >= med_d else ("fuel" if c >= med_c else "hold")
        if v["members"] >= 0.75 * roster:
            q = "baseline"  # ~whole-portfolio group
        strict[s] = q
        print(f"{s:36} {v['members']:>4} {v['views']:>7} {v['bookings']:>3} "
              f"{v['payout_cents'] / 100:>9.0f} {d:>5.0f} {c:>5.2f}  {q}")

    # ---- channel + journey rollups
    total_pay = sum(r["host_payout_cents"] for r in channel_mix)
    total_bk = sum(r["bookings"] for r in channel_mix)
    direct = next((r for r in channel_mix if r["channel"] == "DIRECT"), None)
    if direct is None:
        die("channel_mix.json has no DIRECT row")
    print(f"\ntotals: {total_bk} bookings ${total_pay / 100:,.0f} | "
          f"direct {direct['host_payout_cents'] / total_pay * 100:.1f}% of payout | "
          f"linked {direct['kid_linked']}/{direct['bookings']} "
          f"({direct['kid_linked'] / max(direct['bookings'], 1) * 100:.0f}%)")
    print(f"excluded: {excluded}")

    src = {}
    for j in journeys:
        pay = j.get("payout_cents", j.get("host_payout_cents"))
        if pay is None:
            die("journeys_direct_linked.json: rows need payout_cents "
                "(or host_payout_cents straight from the reservations SQL)")
        src.setdefault(j["source"], [0, 0])
        src[j["source"]][0] += 1
        src[j["source"]][1] += pay
    if len(journeys) != direct["kid_linked"]:
        print(f"WARNING: {len(journeys)} classified journeys != {direct['kid_linked']} "
              f"kid-linked DIRECT bookings — classify every linked booking via get_journey")
    for k, (n, p) in sorted(src.items(), key=lambda x: -x[1][1]):
        print(f"  {k:20} {n:>3}  ${p / 100:>10,.0f}  (${p / n / 100:,.0f}/bk)")
    ai_n = sum(src[k][0] for k in src if k in AI_SOURCES)
    ai_p = sum(src[k][1] for k in src if k in AI_SOURCES)
    if ai_n and "referral" in src:
        rn, rp = src["referral"]
        print(f"AI share of linked {ai_n / len(journeys) * 100:.0f}% | "
              f"AI payout/bk vs referral {(ai_p / ai_n) / (rp / rn):.1f}x")
    print(f"funnel: {traffic['intent_sessions']} intent sessions / "
          f"{traffic['human_sessions']} human | cited {traffic.get('properties_cited')} props "
          f"({traffic.get('citation_hits')} citation hits)")
    print(f"inferred AI overlap: {ai_overlap['ai_overlap_bookings']} bookings "
          f"${ai_overlap['ai_overlap_payout_cents'] / 100:,.0f} (upper bound — label 'inferred')")
    print("intent by check-in month:", {r["checkin_month"]: r["sessions"] for r in intent_months})
    if geo:
        print("geo (country):", {r["country"]: r["sessions"] for r in rows_of(geo, "geo.json")[:6]})
    if paths:
        print("top page paths:", [(r.get("path"), r.get("human_sessions")) for r in rows_of(paths, "group_page_paths.json")[:8]])

    # direct-payout index (prose fuel): group share of direct payout vs inventory share
    total_direct = sum(r["direct_payout_cents"] for r in prop_direct.values())
    if total_direct:
        print(f"\ndirect-payout index (payout share / inventory share), direct total ${total_direct / 100:,.0f}:")
        for s in included:
            v = stats[s]
            share_p = v["payout_cents"] / total_direct
            share_i = v["members"] / roster
            per_bk = v["payout_cents"] / v["bookings"] / 100 if v["bookings"] else 0
            print(f"  {s:36} {share_p * 100:4.1f}% payout on {share_i * 100:4.1f}% inventory "
                  f"→ {share_p / share_i:4.2f}x | ${per_bk:,.0f}/bk")

    long_tail = {s: stats[s]["bookings"] for s in stats if s not in included}
    print("\nlong tail (direct bk):", dict(sorted(long_tail.items(), key=lambda x: -x[1])))

    if not (JUDGMENT and FINAL):
        print("\nDRY RUN — write judgment.json + final_overrides.json in the workspace, then re-run.")
        return

    # ---- validate judgment + assemble
    errors = []
    rows = []
    for s in included:
        v = stats[s]
        j = JUDGMENT.get(s, {})
        label = groups.get(s, {}).get("label", s)
        typ = j.get("type")
        if typ not in ("region", "theme"):
            errors.append(f"judgment.{s}: type must be 'region' or 'theme' (got {typ!r})")
        quad = j.get("quadrant", strict[s])
        if quad not in QUADRANTS:
            errors.append(f"judgment.{s}: quadrant {quad!r} invalid")
        if j.get("highlight") and not j.get("note"):
            errors.append(f"judgment.{s}: highlighted rows need a note")
        if len(j.get("note", "")) > 130:
            errors.append(f"judgment.{s}: note is {len(j['note'])} chars (target ~95, ceiling 130)")
        rows.append({
            "name": j.get("name", label), "type": typ, "members": v["members"],
            "sessions": v["views"], "bookings": v["bookings"],
            "payout": round(v["payout_cents"] / 100),
            "quadrant": quad, "note": j.get("note", ""),
            **({"highlight": True} if j.get("highlight") else {}),
        })
    for key in ("meta", "headlineStats", "longTail", "trends"):
        if key not in FINAL:
            errors.append(f"final_overrides.json: missing {key}")
    if not (FINAL.get("meta", {}).get("logoUrl") or "").strip() and \
            FINAL.get("flags", {}).get("logo") is not False:
        errors.append("meta.logoUrl is empty — set it from _widgetConfig.logoUrl, "
                      "or set flags.logo:false for a collection with no logo")
    prepared = (FINAL.get("meta", {}).get("preparedBy") or "").strip()
    if not prepared or "aurora" in prepared.lower():
        errors.append("meta.preparedBy must carry the run's signature — operator + agent "
                      "(e.g. 'Jordan Ellis · Example Vacation Co, with Claude'), or the "
                      "agent for the team on unattended runs; never a tool default")
    for i, s in enumerate(FINAL.get("spotlights", [])):
        for field in ("name", "eyebrow", "stats", "fact", "imageUrl"):
            if not (s.get(field) or "").strip():
                errors.append(f"spotlights[{i}]: missing {field}")
    if not FINAL.get("spotlights") and FINAL.get("flags", {}).get("spotlights") is not False:
        print("NOTE: no spotlights[] in final_overrides — the Property-spotlights section "
              "will be suppressed; add 2-4 or set flags.spotlights:false to make it explicit")
    labels = {t.get("label") for t in FINAL.get("trends", [])}
    expected = {"AI assistants", "Organic Google", "Quote pressure", "Checkout-intent capture"}
    missing_labels = expected - labels
    if missing_labels:
        errors.append(f"trends: labels are lookup keys; missing {sorted(missing_labels)} "
                      f"(to drop a box, delete its dc-import from the instance HTML instead)")
    if errors:
        die("fix judgment/final_overrides first:\n  " + "\n  ".join(errors))

    highlights = sum(1 for r in rows if r.get("highlight"))
    if not 3 <= highlights <= 8:
        print(f"WARNING: {highlights} highlighted groups (aim for 5-7 priority reads)")

    src_sorted = sorted(src.items(), key=lambda x: (-x[1][0], -x[1][1]))
    direct_sources = [{"source": SRC_LABEL.get(k, k.replace("_", " ").title()),
                       "bookings": n, "payout": round(p / 100)} for k, (n, p) in src_sorted]

    data = {
        "meta": FINAL["meta"],
        "headlineStats": FINAL["headlineStats"],
        "channels": [{"name": CH_LABEL.get(r["channel"], r["channel"].title()),
                      "bookings": r["bookings"],
                      "payout": round(r["host_payout_cents"] / 100),
                      "share": round(r["host_payout_cents"] / total_pay * 100)}
                     for r in channel_mix],
        "directLinked": direct["kid_linked"],
        "directTotal": direct["bookings"],
        "directSources": direct_sources,
        "groupMedians": {"sessionsPerHome": round(med_d / 5) * 5,
                         "conversionPer1k": round(med_c, 1)},
        "groups": rows,
        "longTail": FINAL["longTail"],
        "trends": FINAL["trends"],
    }
    if "spotlights" in FINAL:
        data["spotlights"] = FINAL["spotlights"]
    if "flags" in FINAL:
        data["flags"] = FINAL["flags"]

    os.makedirs(instance, exist_ok=True)
    out = os.path.join(instance, "report-data.js")
    header = ("// Generated by scripts/assemble_report_data.py — every number traces to a\n"
              "// verbatim MCP pull in ../pulls/. Edit judgment.json / final_overrides.json\n"
              "// and re-run; do not hand-edit values here.\n")
    with open(out, "w") as f:
        f.write(header + "export const data = " + json.dumps(data, indent=2, ensure_ascii=False)
                + ";\n\nif (typeof window !== \"undefined\") window.ReportData = data;\n")
    print(f"\nwrote {out}")
    print("next: copy template/ into the instance (this report-data.js stays — it "
          "overwrites the synthetic one), write the prose, then run "
          "scripts/lint_budgets.py on the instance.")


if __name__ == "__main__":
    main()
