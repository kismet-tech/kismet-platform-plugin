---
name: kismet-manage-advertising
description: Analyze and safely manage Kismet advertising campaigns and Meta audiences. Use for attribution, performance, search-term analysis, campaign listing, Google campaign creation or updates, budget changes, pausing, enabling, archiving, audience recipes, custom audiences, and lookalikes through the authenticated User MCP.
---

# Kismet Advertising

Read [references/advertising.md](references/advertising.md) before any ad or audience mutation.
Follow the shared precedence, handoff, and approval rules in [../../references/routing-architecture.md](../../references/routing-architecture.md).

Own only paid Google, paid ChatGPT/OpenAI, and paid Meta/audience actions. Route Google organic, ChatGPT organic, Meta organic, and Direct/unattributed diagnosis to traffic/performance or Generate Demand.

## Required setup: Google bids on Kismet's bookings

Before a Google campaign is enabled on an account, and before any budget, bidding or goal advice, read `get_ads_account_health`. If `conversionAction.health` is `block`, or `conversionAction.kismetOwned` is `false`, the account is learning from someone else's conversions and nothing downstream can be trusted: stop and get the setup done first.

The setup is `setup_ads_conversion_tracking`, Kismet staff only, in this order and never out of it:

1. `step: "status"` (read-only): every conversion action, the last 30 days by source, biddable goals per campaign, and `nextStep`. A row of source `UPLOAD` on the Kismet Purchase action is the only proof Kismet's bookings count for bidding.
2. `step: "mint"`: creates the Kismet Purchase action, binds the account link to it, makes it Primary. Preview, then `confirm: true` on explicit approval.
3. Wait six hours (Google rejects uploads into a fresh action), then `step: "backfill"`: 90 days of click-id bookings. The tool refuses inside the cooldown.
4. Re-run `status` until the action shows `UPLOAD` conversions, then `step: "demote"`: every other primary purchase action goes Secondary. The tool refuses before uploads land, so the goal is never left empty. `demote_all_other_primaries` widens it to forms, calls and store visits; ask the client before touching actions their own campaigns rely on.
5. Make no budget or bidding change for a week after the demote, and record the date.

A customer on the user surface cannot run these steps. Tell them what health shows and that Kismet runs the setup.

## Workflow

1. Establish collection scope and current state with `list_ad_campaigns`.
2. Diagnose using `get_ads_attribution`, `get_ads_performance`, and, for Google, `get_ads_search_terms`.
3. Tie recommendations to observed data, dates, channel, and objective.
4. For a write, show the proposed status, budget, destination group, dates, and guardrail effects.
5. Call the write without `confirm`; present the returned preview, including clamps or billing constraints.
6. Require explicit approval before `confirm: true`.
7. Re-read state and report the audit/manage link when returned.

Never enable spend, raise a budget, archive a campaign, upload an audience, or create a lookalike without specific user approval.

## Required check: the Meta link can deliver

Before any Meta campaign advice, and before a Meta launch, read `get_ads_account_health { channel: "meta" }`. It reads the whole link, not one field: ad account and partner access, billing (Meta funding for a self-billed account, the Kismet wallet otherwise), the Facebook Page assignment, Instagram identity, pixel signal over seven days, catalog freshness, product set, OAuth scopes, and campaigns that cannot deliver. `overall: "block"` means a launch on this link cannot serve or cannot be billed; `blockers` names each with a remedy. An ACTIVE campaign with no ad under it never serves and shows here as `campaigns` NO_ADS. Juniper read "everything is running" on 2026-09-22 with no Page, no product set, four ad-less campaigns and a pixel seeing 16 ViewContent against 3,800 property views; this read is what would have said so.

## ChatGPT Ads

Read the ChatGPT Ads section of [references/advertising.md](references/advertising.md) before any OpenAI campaign write. In short: always pass an `optimization_event` (never bid on clicks alone), always set `geo_targets`, add `context_hints` for steering, expect everything to be created paused at three levels, and treat Kismet's copy of a campaign as up to a day behind OpenAI's own Ads Manager.
