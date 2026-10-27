# Advertising contracts

This skill covers paid media. Do not treat all Google, ChatGPT, or Meta demand as advertising: each platform also has an organic lane measured through traffic, session, journey, and reservation evidence.

- Reads: `list_ad_campaigns`, `get_ads_attribution`, `get_ads_performance`, `get_ads_search_terms`, `get_ads_account_health` (channel `google` or `meta`; every field carries status and remedy, `overall` is the worst).
- Google writes: `create_ad_campaign`, `update_ad_campaign`, `archive_ad_campaign`, `adopt_ad_campaign`.
- Client-built campaigns (`managedBy: client`, numeric Google id) accept only `daily_budget_usd` in `update_ad_campaign`. To manage every field, take the campaign over with `adopt_ad_campaign` (preview, then `confirm: true`); nothing on Google changes at adoption, the campaign gains a Kismet uuid and reads as Kismet-optimized since that date. Never pause a client campaign as part of a takeover; pausing and enabling stay separate, deliberate calls.
- New campaigns are paused by construction. Enabling starts spend and is billing-gated.
- Destinations are server-derived from published Kismet groups; do not provide arbitrary final URLs.
- Budget floors, clamps, aggregate caps, rate limits, idempotency, and audit records are enforced server-side. Surface preview adjustments clearly.
- Meta audience flow: `list_audience_recipes`, `add_audience_recipe`, `create_custom_audience`.
- Custom audiences use server-side booker data and hashed upload; the model should receive counts, never booker PII.
- Audience and campaign writes use preview → explicit confirmation.

## Conversion tracking setup (Google), required, live-learned 2026-09-19

- Google's bidding learns from whatever is PRIMARY in a goal a campaign bids on. Connecting an existing account can adopt the client's own purchase action (a GA4 import). Juniper ran that way for weeks: enabled, primary, uploads reading EXCELLENT, zero `UPLOAD` conversions, 10.9 conversions against 18 measured bookings.
- `get_ads_account_health` blocks on it: `conversionAction.kismetOwned: false`, remedy `setup_ads_conversion_tracking`. `update_ad_campaign { status: "ENABLED" }` is refused while it blocks.
- `setup_ads_conversion_tracking` steps: `status`, `mint`, `backfill`, `demote`. Structured refusals: `CONVERSION_ACTION_TOO_RECENT` (backfill inside six hours of the mint), `BACKFILL_NOT_LANDED` (demote before Google shows `UPLOAD` conversions), `CONVERSION_ACTION_NOT_KISMET_OWNED` (backfill or demote before the mint).
- Secondary is the rollback. Nothing is ever removed. The mint's audit row keeps the previous link target.
- `status` also lists campaigns that bid on more than PURCHASE (`offGoalCampaigns`): a booking campaign bidding on store visits or lead forms is optimising toward them. Cascadia's did, at eleven times the purchase count.

## Meta link readiness, live-learned 2026-09-22

- `get_ads_account_health { channel: "meta" }` returns `checks.{adAccount, billing, page, instagram, pixel, catalog, productSet, scopes, campaigns}`, each `{ status: ok|warn|block, detail, remedy }`, plus `overall`, `blockers` and `warnings`. Same read as `GET /v1/meta-managed/readiness`.
- Blocks: no ad account or partner access PENDING; billing not ready (no funding source on a self-billed account, an empty Kismet wallet otherwise); no Facebook Page or Page not assigned to Kismet; no pixel; no catalog, an empty catalog, or a catalog whose newest sync is older than 48 hours; no product set on the catalog.
- Warns: no Instagram identity anywhere (ads serve Facebook-only); ViewContent under 5 percent of PageView or zero Purchase over seven days; a missing OAuth scope on an Advanced connection; campaigns that cannot deliver, with the reason (NO_ADS, CAMPAIGN_PAUSED, ALL_ADS_PAUSED_OR_REJECTED).
- A Meta read failure reads as warn with the error in `detail`, never as ok. Juniper's link on 2026-09-22 read green on every single-field surface while this read blocks on page and productSet.

## ChatGPT Ads (OpenAI), live-learned 2026-09-15 to 09-18

The whole channel is young and its defaults are unsafe. Every rule below cost real money.

**Always optimize. Never bid on clicks alone.** A campaign with no `optimization_event` tells OpenAI to buy the cheapest clicks anywhere on earth, and it does: Juniper's first day bought 104 sessions, 3 from the United States. Pass `optimization_event` on create, and pick the deepest rung of the guest funnel Kismet has actually been sending: `contents_viewed` (a home opened, densest on a fresh campaign), `items_added` (a guest picked dates on a home, or saved one; dates are the best booking predictor Kismet sends, about 1 booking per 22 to 29 on Juniper mobile against 1 per 90 to 116 home openers, but sparse on ChatGPT traffic, so check the send record before choosing it), `checkout_started` (the Book tap), `order_created` (a booking). Also `lead_created` (homeowner form) and `registration_completed` (accounts). The create preview carries `goal_recommendation` from the send record and a `bidding_warning` when a campaign would bid on clicks. The goal is FIXED at create. OpenAI's reference says "You cannot update `bidding_type`" and "You cannot change the campaign objective or selected conversion event after creation", and both in-place shapes were tried live on 2026-09-19: `bidding_type` is refused as an unknown parameter, and `conversion_event_setting_ids` alone returns 200 and is silently dropped. `update_ad_campaign` refuses `optimization_event` with `GOAL_FIXED_AT_CREATE` before calling OpenAI. To graduate, or to move a click-bidding campaign onto a goal, create a replacement toward the rung with the same creatives, locations and budget, and once it is approved pause the old one and enable the replacement in the same sitting. The replacement goes back through ad review and starts learning from zero, and it carries its own `utm_campaign`, so reports show two campaign keys for one flight. `max_bid_usd` then means cost per conversion, not a click cap.

**Locations are required at create and are not optional in practice.** A campaign with no `targeting.locations` serves everywhere OpenAI sells ads. Juniper ran three days that way (38 of 68 paid sessions from India, for homes in Michigan); Cascadia's Mt. Hood campaign ran a month (1 in 12 sessions from the US, $476). Create now refuses without `geo_targets` and defaults to the country the collection's homes are addressed in. Unlike Google, "United States" resolves correctly here through OpenAI's own geo lookup, so pass country, region or "City, State" names. Locations ARE editable after create: `update_ad_campaign { channel: 'openai', geo_targets: [...] }` or the card's Edit, preview then confirm. Check the audience panel's country mix before and after.

**Contextual hints are the only other steering lever.** `context_hints` on create, or `update_ad_campaign { channel: 'openai', context_hints: [...] }` after. Topics and intents the conversation is matched against ("mt hood cabin trip planning"), never keywords. Up to 25; they live on the ad group; an empty array clears them. Juniper launched with none.

**Everything is created PAUSED, at three levels.** The campaign, its ad group, and every ad. Enabling the campaign now cascades to the group and ads, EXCEPT ads an operator deliberately paused (those are stamped and stay paused; the result reports `ads_skipped_operator_paused`). Ads are reviewed by OpenAI individually. `set_chatgpt_ad_status` with `ENABLE_ON_APPROVAL` plus a notify address enables an ad the hour its review passes and mails whoever asked.

**Kismet's copy of a campaign can lag Ads Manager.** Anything the operator changes in OpenAI's own UI (status, locations, new ads) reaches us on the daily sync at 08:15 UTC, not immediately. Before advising on a campaign, prefer `list_ad_campaigns` after a sync, and treat a surprising status as possibly stale. Cascadia's Mt. Hood campaign read PAUSED in Kismet for three weeks while it was spending.

**Reporting from OpenAI is impressions, clicks and spend, and nothing else.** No device, no place, no age, no per-ad outcome. Everything else on the dashboard is Kismet's own measurement of the landing: `get_ads_performance { channel: 'openai' }` carries `audience` (device, OS, browser, country, hour, and a funnel per device) and the delivery record of what Kismet told OpenAI. `get_ads_demand_window { channel: 'openai' }` carries the dates and prices people checked. Say which side a number came from.

**The audience is a phone audience.** Roughly nine in ten ad sessions across both accounts are phones, and phone visitors pick dates or click book far less often than desktop visitors. When a ChatGPT campaign underperforms, look at the mobile booking flow before the creative.

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
