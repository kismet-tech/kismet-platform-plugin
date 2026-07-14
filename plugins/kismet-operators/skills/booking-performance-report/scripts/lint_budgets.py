#!/usr/bin/env python3
"""Pre-render lint for a filled report instance.

Usage: python3 lint_budgets.py <instance_dir>

Checks, against the character budgets in SKILL.md ("Layout: branding, budgets
& suppression"):
  - every budgeted field in report-data.js
  - the prose blocks that live in the instance HTML (Opportunity headlines and
    Evidence/Mechanism/Action paragraphs, Bottom-line verdict and cards)
  - leftover template placeholders: [bracket] prose, an image-slot without an
    author src, a blank meta.client

Each field has a SOFT target (aim here; WARN above it) and a HARD ceiling
(FAIL, exit 1). The ceilings are calibrated against the proven Juniper v1.1
artifact — the largest values that still rendered cleanly on US Letter. The
layout does not scale text to fit; past the ceiling copy overflows a box or
bloats an atomic block off its page.
"""
import json
import os
import re
import sys

DATA_BUDGETS = [  # (path, soft, hard)
    ("meta.client", 28, 34), ("headlineStats[].value", 10, 12),
    ("headlineStats[].label", 34, 40), ("headlineStats[].context", 70, 90),
    ("headlineStats[].tag", 16, 18), ("directSources[].source", 30, 34),
    ("groups[].name", 22, 26), ("groups[].note", 95, 130),
    ("trends[].unit", 22, 34), ("trends[].note", 200, 260),
    ("longTail.note", 200, 280), ("longTail.towns", 150, 220),
    ("spotlights[].name", 44, 52), ("spotlights[].eyebrow", 24, 30),
    ("spotlights[].stats", 44, 54), ("spotlights[].fact", 140, 175),
    ("meta.preparedBy", 44, 64), ("meta.reportName", 44, 64),
]
HTML_BUDGETS = {"opp_headline": (70, 110), "opp_para": (400, 700),
                "verdict": (110, 145), "card": (70, 90)}
OPP_BLOCK_HARD = 1400  # headline + 3 paragraphs per opportunity (atomic block)

problems = []  # (level, where, message)


def check(where, text, soft, hard):
    if text is None:
        return
    n = len(str(text))
    if n > hard:
        problems.append(("FAIL", where, f"{n} chars (target ~{soft}, ceiling {hard})"))
    elif n > soft:
        problems.append(("WARN", where, f"{n} chars (target ~{soft})"))


def get(obj, path):
    """Yield (where, value) for a path like groups[].note."""
    head, _, rest = path.partition(".")
    if head.endswith("[]"):
        for i, item in enumerate(obj.get(head[:-2], []) or []):
            yield from get(item, rest) if rest else [(f"[{i}]", item)]
    elif rest:
        child = obj.get(head)
        if isinstance(child, dict):
            for where, v in get(child, rest):
                yield f"{head}.{where}", v
    else:
        yield head, obj.get(head)


def extract_data(js):
    m = re.search(r"export\s+const\s+data\s*=\s*", js)
    if not m:
        sys.exit("lint_budgets: no `export const data =` in report-data.js")
    depth, start, in_str, esc = 0, m.end(), None, False
    for i in range(start, len(js)):
        c = js[i]
        if in_str:
            if esc:
                esc = False
            elif c == "\\":
                esc = True
            elif c == in_str:
                in_str = None
        elif c in "\"'":
            in_str = c
        elif c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                try:
                    return json.loads(js[start:i + 1])
                except json.JSONDecodeError as e:
                    sys.exit(f"lint_budgets: report-data.js is not plain JSON ({e}); "
                             "lint runs on assembled instances (see assemble_report_data.py)")
    sys.exit("lint_budgets: unbalanced braces in report-data.js")


def strip_tags(html):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", html)).strip()


def main():
    if len(sys.argv) != 2:
        sys.exit("usage: lint_budgets.py <instance_dir>")
    inst = os.path.abspath(sys.argv[1])
    data = extract_data(open(os.path.join(inst, "report-data.js")).read())
    html_path = os.path.join(inst, "Booking Report.dc.html")
    html = open(html_path).read() if os.path.exists(html_path) else None

    # ---- report-data.js budgets
    for path, soft, hard in DATA_BUDGETS:
        for where, value in get(data, path):
            check(path, value, soft, hard)

    if not (data.get("meta", {}).get("client") or "").strip():
        problems.append(("FAIL", "meta.client", "blank — the masthead will show a placeholder"))
    prepared = (data.get("meta", {}).get("preparedBy") or "").strip()
    if not prepared or "aurora" in prepared.lower() or "example" in prepared.lower() or "[" in prepared:
        problems.append(("FAIL", "meta.preparedBy",
                         f"{prepared!r} — the footer signature is the operator + agent who "
                         "prepared this run, not a tool default"))
    if not (data.get("meta", {}).get("logoUrl") or "").strip() and \
            data.get("flags", {}).get("logo") is not False:
        problems.append(("FAIL", "meta.logoUrl", "empty — the dashed preview slot would ship; "
                                                 "set it or set flags.logo:false"))
    for i, s in enumerate(data.get("spotlights", [])):
        if not (s.get("imageUrl") or "").strip():
            problems.append(("FAIL", f"spotlights[{i}].imageUrl", "empty — the card ships a broken image"))

    if html is None:
        problems.append(("WARN", "instance", "no Booking Report.dc.html yet — prose checks skipped"))
    else:
        body = re.sub(r"<script[\s\S]*?</script>", "", html)
        body = re.sub(r"<style[\s\S]*?</style>", "", body)

        # Opportunities: headlines + Evidence/Mechanism/Action paragraphs, plus the
        # per-opportunity total — each opportunity is an atomic block that must fit
        # on one page alongside at least some neighboring content.
        opp = re.search(r"<!-- =+ OPPORTUNITIES =+ -->([\s\S]*?)</section>", body)
        if opp:
            blocks = re.split(r"<!-- Opp \d", opp.group(1))[1:]
            for i, block in enumerate(blocks, 1):
                total = 0
                h3 = re.search(r"<h3[^>]*>([\s\S]*?)</h3>", block)
                if h3:
                    text = strip_tags(h3.group(1))
                    total += len(text)
                    check(f"Opportunity {i} headline", text, *HTML_BUDGETS["opp_headline"])
                for label, text in re.findall(
                        r">(Evidence|Mechanism|Action)</span>([\s\S]*?)</p>", block):
                    text = strip_tags(text)
                    total += len(text)
                    check(f"Opportunity {i} {label} paragraph", text, *HTML_BUDGETS["opp_para"])
                if total > OPP_BLOCK_HARD:
                    problems.append(("FAIL", f"Opportunity {i} block",
                                     f"{total} chars total (ceiling {OPP_BLOCK_HARD}; "
                                     "the atomic block will crowd its page)"))

        bottom = re.search(r"<!-- =+ BOTTOM LINE =+ -->([\s\S]*?)</section>", body)
        if bottom:
            verdict = re.search(r"font-family:var\(--serif\)[^>]*>([\s\S]*?)</p>", bottom.group(1))
            if verdict:
                check("Bottom-line verdict", strip_tags(verdict.group(1)), *HTML_BUDGETS["verdict"])
            for label, text in re.findall(
                    r"margin-bottom:\.35rem\">([^<]+)</div>\s*<div[^>]*>([\s\S]*?)</div>",
                    bottom.group(1)):
                check(f"Bottom-line card '{label.strip()}'", strip_tags(text), *HTML_BUDGETS["card"])

        # placeholder leaks: [bracket] prose in text content (not inside tags/braces)
        text_only = re.sub(r"\{\{[^}]*\}\}", "", strip_tags(body))
        for frag in sorted(set(re.findall(r"\[[^\]\[]{3,90}\]", text_only))):
            problems.append(("FAIL", "placeholder", f"bracket prose left in HTML: {frag[:70]}"))

        logo_wired = bool((data.get("meta", {}).get("logoUrl") or "").strip())
        for slot in re.findall(r"<x-import[^>]*image-slot[^>]*>", body):
            if " src=" not in slot:
                sid = re.search(r'id="([^"]+)"', slot)
                name = sid.group(1) if sid else "?"
                if name == "client-logo" and logo_wired:
                    continue  # preview slot is sc-if-suppressed once meta.logoUrl is set
                problems.append(("WARN", f"image-slot {name}",
                                 "no src — fill it, delete it, or suppress via flags"))

    for value in [s.get("value") for s in data.get("trends", [])] + \
                 [s.get("note") for s in data.get("trends", [])]:
        if value and re.search(r"\bexample\b", str(value), re.I):
            problems.append(("FAIL", "trends", f"synthetic example text left in: {str(value)[:60]}"))

    fails = [p for p in problems if p[0] == "FAIL"]
    for level, where, msg in problems:
        print(f"{level:4} {where}: {msg}")
    print(f"\n{len(fails)} fail(s), {len(problems) - len(fails)} warning(s)")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
