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
