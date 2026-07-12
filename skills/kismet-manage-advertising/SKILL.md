---
name: kismet-manage-advertising
description: Analyze and safely manage Kismet advertising campaigns and Meta audiences. Use for attribution, performance, search-term analysis, campaign listing, Google campaign creation or updates, budget changes, pausing, enabling, archiving, audience recipes, custom audiences, and lookalikes through the authenticated User MCP.
---

# Kismet Advertising

Read [references/advertising.md](references/advertising.md) before any ad or audience mutation.
Follow the shared precedence, handoff, and approval rules in [../../references/routing-architecture.md](../../references/routing-architecture.md).

Own only paid Google, paid ChatGPT/OpenAI, and paid Meta/audience actions. Route Google organic, ChatGPT organic, Meta organic, and Direct/unattributed diagnosis to traffic/performance or Generate Demand.

## Workflow

1. Establish collection scope and current state with `list_ad_campaigns`.
2. Diagnose using `get_ads_attribution`, `get_ads_performance`, and, for Google, `get_ads_search_terms`.
3. Tie recommendations to observed data, dates, channel, and objective.
4. For a write, show the proposed status, budget, destination group, dates, and guardrail effects.
5. Call the write without `confirm`; present the returned preview, including clamps or billing constraints.
6. Require explicit approval before `confirm: true`.
7. Re-read state and report the audit/manage link when returned.

Never enable spend, raise a budget, archive a campaign, upload an audience, or create a lookalike without specific user approval.
