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

## Traps (live-learned, 2026-07-31 MVR AI Max slate)

- A `confirm: true` create that errors CLIENT-SIDE (timeout, "server isn't responding") may
  still have created the campaign — the idempotency stamp is best-effort and a retry mints a
  REAL duplicate ("Idempotency key could not be stamped" warning = it happened). After any
  failed confirm, `list_ad_campaigns` FIRST; never blind-retry. Cleanup is
  `archive_ad_campaign` (irreversible on the provider; both dupes paused = no spend risk).
- `list_ad_campaigns` shows TWO rows per Google campaign (a budgeted COLLECTION-labeled row +
  a null-budget GROUP-labeled sibling seconds apart). 12 rows ≠ 12 campaigns; archive removes
  the pair (`rows_archived: 2`). Count campaigns in the Google Ads UI when in doubt.
- The final URL is baked at CREATE and `update_ad_campaign` cannot change it. Set the group's
  serving URL (`set_group_serving_url`) BEFORE confirming a group campaign, or it permanently
  lands on the kismet.travel fallback. A just-mapped client-domain URL may 404 until the WP
  plugin release serves it — keep the campaign paused until the page is live.
- Group campaigns without destination pins fall back to geo `STATE_FALLBACK` (warning:
  "no destination pins"), NOT proximity circles — verify reach covers feeder markets before
  enabling spend.
- Never geo-target "United States" by name: the resolver has landed it on a Vermont zip
  (geoTargetConstants/9003007). Explicit metro names resolve correctly.
- One collection-level create per collection per day (idempotency key is date-scoped).
- Brand image assets can fail to attach (`AD_IMAGE` → `UNSUPPORTED_FIELD_TYPE`) — cosmetic,
  campaign still creates; attach assets later.
- Campaign start/end dates ride v23's `start_date_time`/`end_date_time` (the date-only fields
  are gone from the mutate surface). If a date write fails, do not loop retries — check the
  prod log for the Google error and fix the field, not the call count.
