# Advertising contracts

This skill covers paid media. Do not treat all Google, ChatGPT, or Meta demand as advertising: each platform also has an organic lane measured through traffic, session, journey, and reservation evidence.

- Reads: `list_ad_campaigns`, `get_ads_attribution`, `get_ads_performance`, `get_ads_search_terms`.
- Google writes: `create_ad_campaign`, `update_ad_campaign`, `archive_ad_campaign`.
- New campaigns are paused by construction. Enabling starts spend and is billing-gated.
- Destinations are server-derived from published Kismet groups; do not provide arbitrary final URLs.
- Budget floors, clamps, aggregate caps, rate limits, idempotency, and audit records are enforced server-side. Surface preview adjustments clearly.
- Meta audience flow: `list_audience_recipes`, `add_audience_recipe`, `create_custom_audience`.
- Custom audiences use server-side booker data and hashed upload; the model should receive counts, never booker PII.
- Audience and campaign writes use preview → explicit confirmation.
