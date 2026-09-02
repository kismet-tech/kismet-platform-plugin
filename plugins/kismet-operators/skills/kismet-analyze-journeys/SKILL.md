---
name: kismet-analyze-journeys
description: Analyze Kismet manager journey and performance data using collection-scoped, PII-safe insight views. Use for funnel analysis, attribution, guest-journey investigation, conversion questions, view profiling, data exploration, and read-only SQL through the authenticated User MCP.
---

# Kismet Journey Analytics

Read [references/analytics.md](references/analytics.md) before constructing SQL.
Follow the shared precedence, handoff, and approval rules in [../../references/routing-architecture.md](../../references/routing-architecture.md).
For source/channel comparisons, read [../kismet-generate-demand/references/channel-attribution.md](../kismet-generate-demand/references/channel-attribution.md) and keep booking channel, acquisition source, and acquisition mode separate.

## Workflow

1. Establish collection scope with `list_my_collections`.
2. Call `get_data_dictionary`; do not invent view or column names.
3. Use `view_stats`, `profile_view`, or `peek` to measure data shape before writing a non-trivial query.
4. Prefer a purpose-built read tool when available. Use `run_readonly_sql` only for questions requiring custom aggregation.
5. Parameterize values with `$1`, `$2`, and `params`. Use `dry_run: true` for complex or potentially expensive SQL.
6. State the time window, denominator, filters, and collection scope with every result.
7. Separate observed facts from interpretation and flag sparse samples.

Do not request, reconstruct, or expose PII. Do not attempt to bypass the allowlisted `mgr_insight_v_*` surface.

## AI revenue and AI share: quote Landfall, not referrers

When the question is any form of "how much of our revenue / bookings / traffic is AI-driven", "is ChatGPT sending us guests", or "what is our AI share", call `get_ai_performance` first. It returns the same Landfall v0.3 figures the published AI performance report headlines: three disjoint evidence tiers (verified referrer, attributed at 2 sigma page coverage, likely at 1 sigma), the Tier 3 arrival-lift model, and the modeled point the report prints as "AI-driven revenue".

Do not answer this from `run_readonly_sql` over `first_touch_source` or `attribution_tier`. Referrers see only the verified tier; most AI-guided arrivals land referrer-less and file under direct, so a referrer share under-counts by an order of magnitude and contradicts the report the same collection already publishes.

How to present it:

- Lead with the modeled point: "~$X AI-driven revenue (modeled · Landfall v0.3), Y% of $Z journey-linked". It is already rounded; do not add precision.
- Then the split, never a blended total: verified / attributed / likely, each with bookings and dollars.
- If `modeled_revenue.guest_total.point_cents` is null, quote the influenced total and say the lift model lacked minimum evidence this window. Never present that as zero AI revenue.
- Use the `payout` basis when reconciling with the dashboard funnel's Booked / Revenue cards; the `guest_total` basis matches the report slide.
- If the tool answers `modeled: false`, the collection is not on the report's modeled set yet: report the verified tier only, label it "verified AI referrals only, not modeled", and offer `notify_kismet` (topic `ai-health`) to request modeling.
