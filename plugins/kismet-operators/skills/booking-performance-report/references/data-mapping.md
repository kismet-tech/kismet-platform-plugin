# Data mapping — report-data.js ⇄ Kismet MCP

Every field in `report-data.js`, where it comes from, and how it is derived. Two tool surfaces:

- **User MCP (canonical, target)** — the 7 tenant-scoped tools specced in the collection-performance skill (`get_collection_overview`, `get_booking_performance`, `get_traffic_and_funnel`, `get_group_performance`, `get_journey_sources`, `get_demand_signals`, `get_ads_readiness`). When these exist, one tool call feeds each section and the judgment calls (funnel health, buckets, themes) arrive precomputed.
- **Operator MCP (interim, proven 2026-07-11 on Juniper)** — `run_readonly_sql` over `mgr_insight_v_*` + `list_groups`/`get_group` + `get_journey` on the catalog-management MCP. Everything below is written against this surface; the User-MCP tool that replaces each pull is noted. All aggregation and derivation here is implemented by `scripts/assemble_report_data.py` from the saved `pulls/` files — this doc explains the mapping so you can review and judge, not so you re-compute by hand.

Shared basis (state in `meta.period` and apply everywhere): window = last 30 days on **`booked_at`** (never `created_at` — that is sync time); statuses `confirmed|converted|reserved|closed`; `NOT is_owner_stay`; money = `host_payout_cents` (whole dollars in report-data.js — divide by 100 and round).

## meta
- `client` — operator display name (blank shows placeholder). `site` — primary domain from the collection record. `logoUrl` — `get_collection_overview.branding.logoUrl` (prefer `squareLogoUrl`; interim guest fallback in the recipe; or `flags.logo:false`). `period`/`periodShort`/`generated` — set per run. `preparedBy` — the run's signature: operator + agent, collected in SKILL.md step 5 ("Jordan Ellis · Example Vacation Co, with Claude"; unattended → "Claude, for Example Vacation Co"). Never a tool default — the lint rejects "Aurora"/blank. `reportName`/`reportUrl` — the report's title and its hosted-page URL from `publish_report` (step 7): the footer hyperlinks the name; before publishing (or if the tool is absent) → name set, url empty (unlinked footer).

## channels[] — bookings / payout / share by channel
Replaced by: `get_booking_performance({groupBy:"channel"})`.
Operator SQL: group reservations by `channel` with the shared basis; map `DIRECT→Direct, VRBO→Vrbo, AIRBNB→Airbnb, BOOKING_COM→Booking.com, OTHER→Other`. `share` = channel payout ÷ total payout, rounded to whole %. Also pull the excluded tallies (cancelled — status is `canceled`, one L — inquiries, expired, declined, owner stays). No template slot renders these counts: they inform the basis sentence you write into the intro (`meta.period` renders mid-sentence, so phrase it as a fragment) and they stay in `pulls/` as provenance if a number is challenged.

## directLinked / directTotal / directSources[]
Replaced by: `get_journey_sources({channel:"DIRECT"})`.
- `directTotal` = DIRECT bookings; `directLinked` = those with `kid_sid IS NOT NULL`.
- **Per-booking bucket MUST come from `get_journey(kid_sid).acquisition`** (`source` + `bucket`). Do not classify from event referrers: ~70% of AI-delivered visits arrive referrer-stripped, mid-session events carry internal referrers mislabeled as organic, and only the server's `ai_cited` audit (citation bot fetched the same property ≤24h before a direct-looking landing) catches hidden AI journeys. Verified 2026-07-11: naive event-referrer classification produced 22 "organic"/0 AI; `get_journey` produced 8 ai/chatgpt — and matched the prior canonical run to the cent.
- Report rows by `source` (ai/chatgpt · referral · direct "Typed-in direct" · organic google · kismet_storefront), each with bookings + payout. The assembler orders by bookings, then payout — the table's "relative payout" bars make the $-per-booking contrast visible even when a high-payout source ranks below a high-count one.

## Inferred AI overlap (the "AI assistants" trend-box caveat line)
Replaced by: `get_journey_sources(...).inferred.aiCited14dPreBooking`.
Operator SQL: DIRECT bookings (shared basis) joined to citation-bot events (`is_bot AND bot_category='citation'`) on the same `vacation_rental_slug` with `cite_ts` in the 14 days before `booked_at`; count DISTINCT reservations + payout. **Never blend into directSources rows** — it is an upper bound, labeled "inferred — not attribution".

## groups[] — members / sessions / bookings / payout (+ type, quadrant, note, highlight)
Replaced by: `get_group_performance` (which should do all of this server-side — the operator path needs 1 + N calls and is the strongest argument for building the tool).
Operator path:
1. `list_groups(collection)` → slugs, labels, memberCount, published.
2. `get_group` per group → member property slugs (groups overlap; a property counts toward every group it belongs to — never sum group rows).
3. One SQL for per-property bookings/payout/kid_linked (shared basis) + one for per-property human `property_view` counts; aggregate per group over member slugs.
- `sessions` in report-data.js = **member-property views** (demand proxy; the seeded template and medians use this definition — keep it for comparability).
- **Group-page traffic is a separate, secondary signal** and is path-convention dependent: Juniper serves theme pages at `/collections/{slug}` and town pages at `/{region}-vacation-rentals/{town}` — NOT `/groups/`. Resolve the convention by listing top path segments first (`split_part` on `page_url`); an all-zero group-page read almost always means the wrong path filter. The same probe tells you the site's **individual-listing** path (Juniper: `/rentals/{slug}`, not the template's `/homes/` example) — use the real convention in the anatomy-card URL chips. Use group-page sessions in `note`s where they change the story (e.g. a development page out-drawing its member listings).
- `type`: region (place name) vs theme (amenity/occasion). `quadrant`: cut demand (`sessions/members`) and conversion (`bookings/sessions×1000`) at the collection's own medians across included groups → expand/fix/fuel/hold; the ~whole-portfolio group = `baseline`. Include groups with ≥4–5 bookings plus any high-traffic outlier worth surfacing (label small samples). `groupMedians` = the two medians you cut at, rounded (~5s).
- Long tail: groups below the booking floor → one hygiene note (count, towns, zero-member groups, ungrouped properties, single-home outliers).

## trends[] — the four labeled boxes (labels are lookup keys; keep them verbatim)
- **"AI assistants"** — linked AI share of directLinked + payout multiple vs referral; caveat line = properties cited (`bot_category='citation'`, distinct slugs of active roster) + inferred overlap from above.
- **"Organic Google"** — linked organic-google bookings (from journeys). Nearly always a floor; say so.
- **"Quote pressure"** — booking-engine quote records are NOT exposed on the operator SQL surface (`mgr_insight_v_quote_tokens` is the AI-surface exposure log — different thing; its dated rows are what AI sessions were shown, and its `booked` flip only works for post-2026-07 mints). Use **checkout-intent sessions by target check-in month** (`action_type='cta_click' AND stay_check_in IS NOT NULL`, grouped by check-in month) and label the box accordingly. Far-out months (next summer) with real counts = early pressure worth naming.
- **"Checkout-intent capture"** — intent sessions (`cta_click`, distinct human sessions) vs human sessions. There is no published healthy-collection benchmark yet: treat intent sessions ≪ ~1% of human sessions as degraded/dark, say so, and compare month-over-month once a clean month exists. If capture was recently fixed, note the ramp and re-check date rather than calling it dark.

## spotlights[] — 2-4 property cards (name / eyebrow / stats / fact / imageUrl)
Replaced by: nothing — this is pure analyst judgment over the per-property pulls.
Pick the archetypes the group table hides: top direct earner · premium $/booking outlier · most-viewed home with zero direct bookings · dark horse converting on thin traffic. `stats` = raw mono numbers ("$81,742 direct · 5 bookings · $16.3k/bk"); `fact` = one candid sentence tying the number to an action; `imageUrl` from `get_property`. Same honesty rules: direct-funnel numbers labeled as such, small samples named.

## headlineStats[] — derived from the above
Total payout + bookings · direct share of payout · the emerging-channel stat (AI share of linked direct) · the biggest caveat stat (linked coverage % — "Fix first" tag when low).

## Ads readiness
Replaced by: `get_ads_readiness`. Operator: `list_ad_campaigns(collection)` — empty = no channels connected in Kismet. Also check reservation `gclid/gbraid/wbraid` columns AND landing referrers for ad click ids: ads running **outside** Kismet show up as tagged sessions that Kismet cannot credit (`ad_click:false`) — that is a "connect your ads" recommendation, not an attribution claim.

## Geo
`content_events.country` distinct human sessions. Country-level only — say so; drive-market targeting needs PMS guest addresses.

## Sanity checklist before render
- channels payout sum = headline total; shares sum to ~100.
- directSources bookings sum = directLinked; linked + unlinked = directTotal.
- Every groups[] row: bookings ≤ member-slug bookings sum (spot-check one), sessions > 0 for plotted groups.
- Medians recomputed this run (not carried over).
- Trend labels exactly: "AI assistants" · "Organic Google" · "Quote pressure" · "Checkout-intent capture".
- No blended linked/inferred number anywhere.
