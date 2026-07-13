# MCP recipe — how to pull a report from live Kismet data

The exact, ordered tool calls that produce one report, proven end-to-end on Juniper Holiday + Home (2026-07-11). Copy each call, swap the collection identifiers, run it. **Save each result to `pulls/<name>.json` under the filename marked `→ save as` below** — `scripts/assemble_report_data.py` reads those exact names, and the untouched files are your provenance. Saving the full `run_readonly_sql` result envelope (`{sql_executed, row_count, rows, …}`) or just its `rows` array both work — the assembler unwraps envelopes. Two MCP surfaces are used today:

- **Operator/catalog MCP** (`mcp__…__run_readonly_sql`, `list_my_collections`, `list_groups`, `get_group`, `get_property`, `get_journey`, `list_ad_campaigns`) — tenant-scoped analytics + catalog. **The skill's single surface**: everything, branding included, comes from the collection's own MCP (`get_collection_overview.branding` once live; Phase 0 notes the temporary guest-surface fallback until then).

When the User MCP tools from [mcp-tool-spec.md](mcp-tool-spec.md) ship, each phase below collapses to one call (noted per phase). Until then, this is the working path.

Conventions carried in every SQL call: `params: [collectionId]` (a UUID, cast `::uuid` in the query) OR `[collectionSlug]` where the query filters `collection_slug`; window = last 30 days on **`booked_at`**; booked statuses `confirmed|converted|reserved|closed`; `NOT is_owner_stay`. The analytics views are auto-scoped to your collections — never add a collection filter you weren't given, and a 0-row result usually means "no data in your scope," not an error.

---

## Phase 0 — identity + branding  → `meta`, image slots, accent

```
list_my_collections()
```
Pick the target row → gives `slug`, `id` (UUID), `name`, `propertyCount`. Use `id` for the SQL `::uuid` params and `slug` for the `collection_slug` params and catalog calls.

**Branding — comes with the portfolio call you already made:** `list_my_collections` returns `branding` per collection:
- `branding.logoUrl` (prefer `branding.squareLogoUrl` when present) → `meta.logoUrl`.
- `branding.ctaColor` (hex) → the client brand accent. Set `:root{--accent:<ctaColor>;--aurora:<ctaColor>}` in the instance `<helmet>` `<style>` (see [data-mapping.md](data-mapping.md) → Branding). Also derive a soft tint for `--accent-soft` (a ~10% version) for the stat-callout pills.
- Collection `name` → `meta.client`; the collection's primary domain → `meta.site`.
- Also set `meta.mcpInstallUrl = https://kismet.travel/account/collections/{slug}/mcp-endpoints` now — it renders the report's "Install Kismet User MCP" viewer CTA (`publish_report` returns the same value as `mcpInstallUrl`).

> **Temporary fallback (only while the branding field is deploying):** if `list_my_collections` doesn't return `branding` on your surface yet, `get_collection_content({section:"about", collections:[slug]})` on the federated guest MCP carries the same values in `_widgetConfig` (`logoUrl`, `ctaColor`) plus `data.url`/`data.name`. If neither is reachable, set `flags.logo:false`, keep the default accent, and note it in delivery.

## Phase 1 — channels, exclusions, funnel  → `channels`, headline basis, `trendIntent`

**Channel mix** (→ `channels[]`, headline totals) — save as `pulls/channel_mix.json`. One call, `params:[collectionId]`:
```sql
SELECT channel, count(*)::int AS bookings,
       sum(host_payout_cents)::bigint AS host_payout_cents,
       sum(fare_accommodation_cents)::bigint AS fare_cents,
       count(*) FILTER (WHERE kid_sid IS NOT NULL)::int AS kid_linked
FROM mgr_insight_v_vr_reservations
WHERE collection_id = $1::uuid AND booked_at >= now() - interval '30 days'
  AND status IN ('confirmed','converted','reserved','closed') AND NOT is_owner_stay
GROUP BY channel ORDER BY host_payout_cents DESC;
```
Map keys → labels (`DIRECT→Direct, VRBO→Vrbo, AIRBNB→Airbnb, BOOKING_COM→Booking.com, OTHER→Other`); `share` = payout ÷ total, whole %.

**Excluded tallies** (basis footnote) — save as `pulls/excluded.json`. `params:[collectionId]`:
```sql
SELECT count(*) FILTER (WHERE status='canceled')::int  AS cancelled,   -- one L
       count(*) FILTER (WHERE status='inquiry')::int    AS inquiries,
       count(*) FILTER (WHERE status='expired')::int    AS expired,
       count(*) FILTER (WHERE is_owner_stay AND status IN ('confirmed','converted','reserved','closed'))::int AS owner_stays
FROM mgr_insight_v_vr_reservations
WHERE collection_id = $1::uuid AND booked_at >= now() - interval '30 days';
```

**Traffic + funnel** (→ `trendIntent`, AI-citation context) — save as `pulls/traffic_misc.json`. `params:[collectionSlug]`:
```sql
SELECT count(DISTINCT client_session_id) FILTER (WHERE is_bot=false)::int AS human_sessions,
       count(*) FILTER (WHERE is_bot=false AND action_type='property_view')::int AS property_views,
       count(DISTINCT client_session_id) FILTER (WHERE is_bot=false AND action_type='cta_click')::int AS intent_sessions,
       count(*) FILTER (WHERE is_bot=true AND bot_category='citation')::int AS citation_hits,
       count(DISTINCT vacation_rental_slug) FILTER (WHERE is_bot=true AND bot_category='citation' AND vacation_rental_slug IS NOT NULL)::int AS properties_cited
FROM mgr_insight_v_content_events
WHERE collection_slug = $1 AND timestamp >= now() - interval '30 days';
```
Funnel-health gate: `intent_sessions` ≪ `human_sessions` → capture is degraded; mark journey-based numbers as floors and lead with it in Fix-first.

**Active roster** (denominator for inventory-share prose) — save as `pulls/roster.json`. `params:[collectionId]`:
```sql
SELECT count(*) FILTER (WHERE status='ACTIVE' AND active_rates_vendor IS NOT NULL)::int AS ad_eligible
FROM mgr_insight_v_vacation_rentals WHERE collection_id = $1::uuid;
```

## Phase 2 — groups (demand × conversion)  → `groups`, `groupMedians`, `longTail`

> Replaced by one `get_group_performance` call in the User MCP. Today it is list + N + 2 SQL:

```
list_groups({ collection_slug: slug })     → group slugs, labels, memberCount
get_group({ collection_slug: slug, group_slug: g })   → members[].slug   (per group; groups OVERLAP — never sum group rows)
```
Save the verbatim `list_groups` output as `pulls/groups_list.json`. Collect the member lists into one or more `pulls/group_members*.json` files shaped `{"<group_slug>": ["<vr_slug>", ...], ...}` (splitting across files is fine — big `get_group` responses may arrive chunked). ⚠️ This is the error-prone pull: most `get_group` responses arrive as inline text you transcribe by hand, and a dropped slug silently shrinks a group's stats. The assembler cross-checks your list lengths against `list_groups.memberCount` and warns on any mismatch — treat every warning as a transcription bug until proven otherwise.

**Per-property DIRECT funnel** (bookings/payout — group pages drive the direct site, so the group table reads DIRECT only; OTA lives in the channel mix) — save as `pulls/per_property_direct.json`. `params:[collectionId]`:
```sql
SELECT vacation_rental_slug, count(*)::int AS direct_bookings,
       sum(host_payout_cents)::bigint AS direct_payout_cents
FROM mgr_insight_v_vr_reservations
WHERE collection_id = $1::uuid AND booked_at >= now() - interval '30 days'
  AND status IN ('confirmed','converted','reserved','closed') AND NOT is_owner_stay AND channel='DIRECT'
GROUP BY vacation_rental_slug;
```
**Per-property human property-views** (demand proxy = `sessions` in report-data.js) — save as `pulls/per_property_views.json`. `params:[collectionSlug]`:
```sql
SELECT vacation_rental_slug, count(*)::int AS property_views
FROM mgr_insight_v_content_events
WHERE collection_slug=$1 AND timestamp >= now() - interval '30 days'
  AND is_bot=false AND action_type='property_view' AND vacation_rental_slug IS NOT NULL
GROUP BY vacation_rental_slug;
```
`scripts/assemble_report_data.py` does the aggregation (per-group over member slugs, inclusion rule `members ≥ 5 AND direct_bookings ≥ 3`, `demand = views/members`, `conv = bookings/views*1000`, median cuts → suggested quadrant, ~whole-portfolio group → `baseline`) — don't hand-compute.

**Spotlight images** (after you've picked the 2–4 spotlight properties from the working table): one call per property —
```
get_property({ collection_slug: slug, property_slug: p })   → property.imageUrl, name, beds/guests
```
The `imageUrl` feeds the spotlight card; name/capacity feed the `fact` line. No pulls/ file needed — the values land in `final_overrides.json` `spotlights[]` directly.

## Phase 3 — direct first-touch, AI overlap, date pressure  → `directSources`, `trendAI`, `trendGoogle`, `trendQuote`, geo

**Linked DIRECT kid_sids** (the journeys to classify). `params:[collectionId]`:
```sql
SELECT kid_sid, host_payout_cents FROM mgr_insight_v_vr_reservations
WHERE collection_id=$1::uuid AND booked_at >= now() - interval '30 days'
  AND status IN ('confirmed','converted','reserved','closed') AND NOT is_owner_stay
  AND channel='DIRECT' AND kid_sid IS NOT NULL ORDER BY host_payout_cents DESC;
```
**Classify each** — CRITICAL, do NOT infer from event referrers:
```
get_journey({ kid_sid })   → acquisition.bucket + acquisition.source   (+ ai_cited audit on AI rows)
```
Save the classified set as `pulls/journeys_direct_linked.json` shaped `{"rows": [{"kid_sid": "...", "payout_cents": N, "source": "<acquisition.source>"}, ...]}` — one row per linked DIRECT booking (extra context keys are fine; `host_payout_cents` carried straight from the reservations SQL is accepted as-is). The assembler rolls up by `source` → `directSources[]` (referral / chatgpt / direct / google / kismet_storefront). `trendAI` = AI share of linked + payout multiple vs referral. `trendGoogle` = organic-google linked count (a floor). Why not referrers: ~70% of AI-delivered visits are referrer-stripped and log as direct/organic; only the server's `ai_cited` audit inside `get_journey` catches them. On Juniper, event-referrer SQL gave 0 AI; `get_journey` gave 8 — matching the canonical run.

**Inferred AI-citation overlap** (the `trendAI` caveat line — kept separate, labeled "inferred, not attribution") — save as `pulls/ai_overlap.json`. `params:[collectionId, collectionSlug]`:
```sql
WITH res AS (
  SELECT id, vacation_rental_slug, booked_at, host_payout_cents FROM mgr_insight_v_vr_reservations
  WHERE collection_id=$1::uuid AND booked_at >= now() - interval '30 days'
    AND status IN ('confirmed','converted','reserved','closed') AND NOT is_owner_stay AND channel='DIRECT'),
cites AS (
  SELECT vacation_rental_slug, timestamp FROM mgr_insight_v_content_events
  WHERE collection_slug=$2 AND is_bot=true AND bot_category='citation'
    AND vacation_rental_slug IS NOT NULL AND timestamp >= now() - interval '44 days')
SELECT count(*)::int AS ai_overlap_bookings, sum(host_payout_cents)::bigint AS ai_overlap_payout_cents
FROM (SELECT DISTINCT r.id, r.host_payout_cents FROM res r JOIN cites c
      ON c.vacation_rental_slug=r.vacation_rental_slug
     AND c.timestamp < r.booked_at AND c.timestamp >= r.booked_at - interval '14 days') x;
```
**Date pressure** (`trendQuote`) — booking-engine quote records are NOT exposed; use checkout-intent sessions by target check-in month — save as `pulls/intent_by_checkin_month.json`. `params:[collectionSlug]`:
```sql
SELECT to_char(date_trunc('month', stay_check_in::date),'YYYY-MM') AS checkin_month,
       count(DISTINCT client_session_id)::int AS sessions
FROM mgr_insight_v_content_events
WHERE collection_slug=$1 AND timestamp >= now() - interval '30 days'
  AND is_bot=false AND action_type='cta_click' AND stay_check_in IS NOT NULL
GROUP BY 1 ORDER BY 1;
```
**Geo** (ad-targeting context; country-level only) — save as `pulls/geo.json`. `params:[collectionSlug]`:
```sql
SELECT country, count(DISTINCT client_session_id)::int AS sessions
FROM mgr_insight_v_content_events
WHERE collection_slug=$1 AND timestamp >= now() - interval '30 days' AND is_bot=false
GROUP BY country ORDER BY sessions DESC LIMIT 8;
```

## Phase 4 — ads readiness  → Opportunities sequencing

```
list_ad_campaigns({ collection_slug: slug })   → connected channels + campaigns (empty = none connected)
```
Also scan `gclid/gbraid/wbraid` on reservations and session referrers: a click id with **no** connected channel = ads running outside Kismet → a "connect your ads so spend reconciles" recommendation, never an attribution claim. Save the evidence as `pulls/ads_readiness.json` — e.g. `{"campaigns": [...verbatim list_ad_campaigns...], "click_id_bookings": N, "click_id_sessions": N}` — even when everything is empty. The assembler doesn't read it, but Opportunity 1's prose asserts what is and isn't connected, and a resumed run has no other evidence for that claim.

---

## Then assemble

With `pulls/` complete, run `python3 scripts/assemble_report_data.py <workspace> <instance-dir>` — dry run first (working table + rollups), then again after writing `judgment.json` + `final_overrides.json` (writes the instance `report-data.js`). SKILL.md steps 2–3 describe both files.

### Gotchas proven this run
- Group-page URLs are per-partner (Juniper: `/collections/{slug}`, `/{region}-vacation-rentals/{town}` — never `/groups/`). If a path-filtered group-page query returns 0, your path pattern is wrong, not the data. Probe top path segments first: `split_part(regexp_replace(split_part(page_url,'?',1),'^https?://[^/]+',''),'/',2)`. If you pull per-path group-page sessions, save them as `pulls/group_page_paths.json` (`[{path, human_sessions}]`) and the assembler prints them for your notes.
- `date_trunc` needs a real date: cast `stay_check_in::date` (it's stored as text).
- `mgr_insight_v_quote_tokens` is the AI-surface exposure log, NOT booking-engine quotes and NOT bookings — don't use it for conversion or date pressure.
- Large `get_group` responses can exceed the tool's inline cap and get redirected to a file; read the file and extract `group.members[].slug`.
