# Analytics contracts

- Discovery: `get_data_dictionary` returns the allowed views and columns.
- Shape checks: `view_stats` summarizes a view, `profile_view` profiles columns, and `peek` returns a small safe sample.
- Queries: `run_readonly_sql` accepts one `SELECT` or `WITH` query, positional parameters, a row cap, and optional dry run.
- Drill-in: `get_journey` returns a de-identified journey.
- Ads reads: `get_ads_attribution`, `get_ads_performance`, `get_ads_search_terms`, and `list_ad_campaigns` may answer channel questions without SQL.
- Access is automatically collection-scoped and PII-filtered. Treat rejection as a boundary, not an obstacle.
- Use bounded dates and explicit limits. Avoid `SELECT *` except a small `peek`-style exploration.
- Open rate is a soft signal because privacy proxies can inflate it; clicks and clicked-to-session are stronger campaign signals.
- Reservation `channel = 'DIRECT'` is a booking outcome, not proof of Direct acquisition. Report acquisition source and organic/paid/owned mode separately.
- Google, ChatGPT, and Meta each have distinct organic and paid lanes. Paid provider tools cover paid performance; content events, booking sessions, journeys, quote exposures, and reservations supply organic/Direct evidence.
