# Kismet User MCP — Collection-Performance Tool Contracts

> **Mostly background context.** Tools 1-7 are the target User-MCP contracts this skill's recipe migrates to (see MAINTAINERS.md for the phase-by-tool migration map) — until they ship, `references/mcp-queries.md` is the working path. The one contract a report run uses directly is **§8 `publish_report`** (SKILL.md step 7).

Note: §8 `publish_report` is the exception to "all tools are read-only" below — it creates the hosted report object (a write), still tenant-scoped, publish-once per finalized report.

This file is both the **contract the skill consumes** and the **build spec** for the tools while they are being implemented (kismet-infrastructure; the per-collection MCP server at `kismet.travel/c/{slug}/mcp` is the natural host). All tools are **read-only** and **tenant-scoped**: the authenticated user's collection membership decides what they can see — implement over the membership-scoped `mgr_insight_v_*` views / `enforceTenantAccess`, never raw tables keyed by a caller-supplied collection id.

Shared conventions:
- `window`: `"30d" | "90d" | {from, to}` — booked-date basis (`COALESCE(vendor_created_at, created_at)`) unless `basis: "checkin"` is passed.
- Money is integer **cents** with a `currency` field; the skill reports host payout as headline.
- Booked statuses = `confirmed|converted|reserved|closed`. Owner stays (`fare=0 AND payout=0`, or owner source labels) are excluded from booking counts and returned in `excluded` tallies instead.
- Every response includes `basis: {window, dateBasis, ownerStaysExcluded, statuses}` so reports can state it.

---

## 1. `get_collection_overview`
**Params:** none (tenant-resolved).
**Returns:**
```jsonc
{
  "collection": {"slug": "...", "name": "...", "propertyCount": 103},
  "domains": ["www.example.com"],
  "branding": {                     // REQUIRED for the report skill (Jason 2026-07-11:
    "logoUrl": "https://...",       // branding comes from the COLLECTION surface, never
    "squareLogoUrl": null,          // the guest MCP). Same values that feed _widgetConfig;
    "ctaColor": "#194d5d",          // squareLogoUrl when a square mark exists (masthead
    "ctaTextColor": "#ffffff"       // prefers it).
  },
  "groups": {"total": 37, "pageEnabled": 37},
  "channelsWired": {"direct": true, "airbnb": true, "vrbo": true, "bookingCom": true},
  "adChannelsConnected": ["google", "meta"]   // mirror of WIRED_AD_CHANNELS
}
```

## 2. `get_booking_performance`
**Params:** `{window, groupBy: "channel" | "property" | "group" | "month", basis?: "booked" | "checkin"}`
**Returns:** rows of
```jsonc
{
  "key": "DIRECT",              // channel name, property slug, group slug, or YYYY-MM
  "label": "Direct",
  "bookings": 100,
  "hostPayoutCents": 42259800,
  "fareCents": 32550700,
  "nights": 412,
  "kidLinkedBookings": 31,       // journey-linked (kid_sid present)
  "attributionTiers": {"recognized": 31, "none": 69}
}
```
plus `"excluded": {"cancelled": 22, "inquiries": 13, "expired": 93, "ownerStays": 66}` and `basis`.
`groupBy: "group"` attributes a booking to every group its property belongs to and returns `"overlapping": true` so the skill never sums group rows into a total.

## 3. `get_traffic_and_funnel`
**Params:** `{window, groupBy?: "property" | "group"}`
**Returns:**
```jsonc
{
  "humanSessions": 21266,
  "propertyViews": 36028,
  "checkoutIntentSessions": 35,       // server cta_click sessions
  "linkedCoverage": {"directBookings": 133, "kidLinked": 31, "rate": 0.23},
  "funnelHealth": "DEGRADED",         // OK | DEGRADED | DARK — server-computed from
                                       // intent/session ratio vs fleet baseline
  "aiExposure": {"citationBotHits": 1489, "propertiesCited": 95, "of": 103},
  "rows": [ {"key": "...", "sessions": 0, "propertyViews": 0, "intents": 0} ]
}
```
`funnelHealth` exists so the skill's Phase-1 gate doesn't depend on the model knowing fleet baselines: the server compares the collection's intent rate to healthy same-engine collections.

## 4. `get_group_performance`
**Params:** `{window}`
**Returns:** rows of
```jsonc
{
  "slug": "hot-tub-vacation-rentals", "label": "Hot Tub",
  "members": 43, "pageEnabled": true, "landingUrl": "https://.../groups/hot-tub-vacation-rentals",
  "sessions": 1240, "propertyViews": 3020, "intents": 4,
  "bookings": 18, "hostPayoutCents": 9200000, "kidLinkedBookings": 5
}
```
plus `"ungroupedProperties": [{"slug": "...", "bookings": 3, "hostPayoutCents": 0}]`.
Group traffic = group-page traffic **plus member-property page traffic** (two fields if both are available: `groupPageSessions`, `memberSessions`) — the skill needs both to tell "nobody visits the page" from "nobody visits the theme".

## 5. `get_journey_sources`
**Params:** `{window, channel?: "DIRECT"}`
**Returns:** first-touch mix of **linked** bookings only:
```jsonc
{
  "linkedBookings": 31,
  "rows": [
    {"bucket": "ai", "source": "chatgpt", "bookings": 8, "hostPayoutCents": 4759500},
    {"bucket": "referral", "source": "referral", "bookings": 15, "hostPayoutCents": 3800000}
  ],
  "inferred": {                        // clearly separated, never merged into rows
    "aiCited14dPreBooking": {"bookings": 46, "hostPayoutCents": 27634300,
                              "caveat": "same-property citation exposure ≤14d pre-booking; upper bound, not attribution"}
  }
}
```

## 6. `get_demand_signals`
**Params:** `{window}`
**Returns:**
```jsonc
{
  "quotes": {"total": 20, "byMonth": [{"month": "2026-07", "quotes": 9, "medianNights": 4}]},
  "datePressure": [{"from": "2026-07-01", "to": "2026-07-31", "quotes": 9, "share": 0.45}],
  "themes": [{"tag": "hot tub", "propertiesBooked": 22, "shareOfDirectPayout": 0.31}],
  "geoOrigins": [{"country": "US", "region": "IL", "sessions": 6400, "bookings": 41}]
}
```
`themes` is server-derived from amenity/tag data on booked properties — the tool does the joining so results are consistent across runs.

## 7. `get_ads_readiness`
**Params:** `{window}`
**Returns:**
```jsonc
{
  "channels": [
    {"channel": "google", "connected": true, "activeCampaigns": 2,
     "spendCents": 120000, "attributedBookings": 3, "attributedPayoutCents": 900000},
    {"channel": "meta", "connected": false},
    {"channel": "chatgpt_ads", "connected": false, "eligible": true}
  ]
}
```
Rides the unified ads-read layer (union across `WIRED_AD_CHANNELS`) — one shape regardless of channel. Attributed figures are cost-accounting (platform-reported + Kismet-linked, labeled which).

---

## Implementation notes

- **Scoping is the whole game.** These tools expose revenue data; a tenant must never see another collection. Resolve the collection from the MCP session identity, not from a parameter.
- **Views first**: `mgr_insight_v_vr_reservations`, `mgr_insight_v_content_events` etc. are already membership-scoped — building on them keeps the scoping in one place. (Plain-psql access returns 0 rows from these views by design.)
- **Precompute the judgment calls** (`funnelHealth`, `themes`, owner-stay exclusion) server-side. The skill's report quality is capped by how honest and consistent these inputs are; letting each model run re-derive them from raw rows produces drift.
- **No write tools.** Group/landing-page creation and campaign launch stay in the platform UI; the skill links the operator there. If a `create_group_draft` tool is ever added, it must produce a draft requiring UI confirmation, not a live page (route-ceiling and SEO implications need human review — see `reference_kismet_travel_route_ceiling`).
- Rate/latency: every tool should answer in <5s from pre-aggregated data; these get called 5-7 at a time per report.

## 8. `publish_report` / `list_reports` / `get_report` (SHIPPED — kismet-infrastructure#1510)

The agent does all creative work through to the **finished, self-contained HTML report** (`scripts/flatten_instance.py`); the platform makes it a durable hosted object.

**`publish_report`** (WRITE — admin/member role):
`{ collection_slug, title, slug?, description, html, report_type?, period_from?, period_to?, data? }`
→ `{ reportId, slug, url, title, mcpInstallUrl }`
- Server owns slug clash resolution (`-1`, `-2`, …; never overwrites). HTML must be a complete document, ≤5 MB.
- `url` = the hosted page (`/v1/public/reports/{reportId}/{slug}` — the uuid is the access key; unlisted, noindex). Show it in chat as the deliverable.
- `data` = the report-data object; publish it so other agents can pull the numbers later.
- `mcpInstallUrl` = the collection's `/account/collections/{slug}/mcp-endpoints` deep link (the report's viewer CTA target).

**`list_reports`** `{ collection_slug?, limit? }` → newest-first metadata + hosted URLs across your scope.

**`get_report`** `{ report_id }` or `{ collection_slug, slug }` (+ `include_html?`) → metadata + the structured `data` payload into context; full HTML only on request.

Also shipped in the same PR: `list_my_collections` returns `branding` per collection (see §1) — branding never comes from a guest surface.
