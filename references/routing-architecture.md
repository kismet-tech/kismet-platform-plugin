# Kismet Platform skill routing architecture

## Purpose

Route manager intent into a small number of job-focused skills while keeping the 44-tool MCP composable. Skills own judgment and sequencing; tools own stable capabilities and enforcement.

## Global workflow contract

Every operational skill follows this state machine:

1. **Orient** — establish accessible collections, roles, and the requested business outcome.
2. **Inspect** — read current state before proposing changes.
3. **Analyze** — use purpose-built reads first; use custom SQL only when necessary.
4. **Propose** — explain evidence, scope, assumptions, tradeoffs, and the exact intended effect.
5. **Preview** — call consequential tools without confirmation and surface the server preview.
6. **Approve** — obtain explicit approval for the exact preview. Approval for analysis is not approval to mutate.
7. **Confirm** — send `confirm: true` only for the approved payload.
8. **Verify** — re-read state or inspect returned durable state; report partial failures clearly.

Skills may stop after any read-only stage. They must not skip directly from intent to confirmation.

## Precedence

Use the first matching rule. When a request contains multiple independent jobs, announce the primary skill and sequence secondary handoffs.

1. **Published report requested** → server-hosted booking-performance/report skill (`#41 Skills & Reports`).
2. **Demand/revenue outcome with no predetermined tactic** → stimulate demand orchestrator.
3. **Catalog structure, groups, properties, content, FAQs, or publication** → catalog management.
4. **Traffic, attribution, funnel, journey, pricing exposure, booking, or performance question** → traffic and performance.
5. **Member newsletter, email content, scheduling, or campaign results** → Insiders email.
6. **Named paid channel, campaign, budget, creative, search terms, or audience** → advertising and audiences.
7. **Google/ChatGPT/Meta organic visibility or Direct/unattributed source question** → traffic and performance; use Generate Demand if an intervention is also requested.
8. **Alert, webhook, destination, scheduled rule, or delivery failure** → alerts and automation.
9. **Tracking install, canonical URL, tracked link, or attribution setup** → tracking and attribution.
10. **Platform concept or “how does this work?”** → guide/orientation route.

Explicit tactics override the broad demand orchestrator. Example: “raise this Google campaign budget” routes directly to advertising; “help me get more bookings next month” routes to stimulate demand.

Platform names alone do not imply paid media. “Improve Google visibility,” “grow ChatGPT traffic,” or “understand Meta referrals” remain organic/source questions unless the user names ads, spend, campaigns, paid targeting, or audiences.

## Skill contracts

### Traffic and performance

**Positive triggers**

- Report or explain traffic, acquisition, channel mix, attribution, funnels, journeys, bookings, revenue, lead time, pricing exposure, quote behavior, or conversion signals.
- Compare periods, properties, groups, collections, or channels.
- Investigate a de-identified guest journey.

**Negative triggers**

- Do not own a durable designed report; hand that to the reporting skill.
- Do not create or modify campaigns merely because performance is weak.
- Do not infer live availability from reservations for specific dates.
- Do not return or reconstruct PII.

**Required first moves**

- Establish scope with `list_my_collections` if scope is not already established.
- Call `get_data_dictionary` before custom SQL.
- Prefer ads performance/attribution tools for their native questions.

**Handoffs**

- Durable report → reporting.
- Open inventory/demand intervention → stimulate demand.
- Paid-channel action → advertising.
- Catalog conversion issue → catalog.

### Catalog management

**Positive triggers**

- Audit or manage collections, groups, properties, membership, descriptions, hero images, FAQs, serving pages, or publication state.
- Build a landing page or curated property set.

**Negative triggers**

- Do not own canonical serving URL configuration; hand off to tracking.
- Do not create a group merely to satisfy an exploratory recommendation.
- Do not publish as a side effect of content editing.
- Do not treat guest-saved groups as manager merchandising without explicit intent.

**Required first moves**

- Establish collection and role.
- Inspect existing groups and property state before proposing creation.
- Use ranked property search before membership changes when selection is intent-based.

**Handoffs**

- Demand diagnosis → stimulate demand.
- Performance evidence → traffic and performance.
- Campaign destination → advertising after catalog state is ready.
- Serving URL → tracking.

### Stimulate demand

**Positive triggers**

- “Get more bookings,” “fill empty nights,” “increase demand,” “what should we promote,” “where should we spend,” or other outcome-first growth requests.
- Requests spanning inventory, merchandising, email, and paid channels.

**Negative triggers**

- Do not trigger when the user already specified a narrow catalog, email, or advertising action.
- Do not default to paid advertising.
- Do not recommend spend before checking conversion readiness and destination quality.
- Do not call range-wide reservation math “live availability.”

**Required sequence**

1. Define collection, stay window, geography/property scope, target guest, and desired outcome.
2. Diagnose demand, bookings, revenue, and conversion signals.
3. Enumerate listings from the roster so zero-booking properties remain visible.
4. Use live `search_properties` date windows to validate specific-date bookability for shortlisted properties.
5. Choose among fix-first, catalog merchandising, Insiders, paid acquisition, or tracking repair.
6. Hand off execution to the owning skill.

**Handoffs**

- Landing page/group repair → catalog.
- Member campaign → Insiders email.
- Paid activation → advertising.
- Measurement gap → tracking.
- Durable opportunity brief → reporting.

### Insiders email

**Positive triggers**

- Member newsletter, campaign copy, template, property-card email, scheduling, sending, or campaign results.

**Negative triggers**

- Do not claim that auto-enrolled bookers are marketing-consented.
- Do not own list import, Drops, or Offers when those remain dashboard-only actions.
- Do not accept raw HTML or arbitrary URLs.
- Do not treat campaign creation approval as send approval.

**Required sequence**

- Validate collection and property slugs.
- Create/preview template only if needed.
- Preview campaign content and recipient count.
- Confirm creation after approval.
- Preview schedule/send and obtain a second explicit approval.
- Measure clicks and clicked-to-session as stronger signals than opens.

### Advertising and audiences

**Positive triggers**

- Named Google, ChatGPT/OpenAI, or Meta campaign.
- Budget, status, creative, search terms, attribution, audience recipe, custom audience, or lookalike.

**Negative triggers**

- Do not own tactic-agnostic growth requests; use stimulate demand.
- Do not enable spend, raise budgets, archive, change creative, or upload audiences without exact approval.
- Do not expose booker PII.
- Do not send arbitrary destination URLs when the server derives or locks destinations.

**Required sequence**

- Read campaign state and performance.
- Confirm destination readiness and publication state.
- Surface channel-specific constraints, billing gates, review state, clamps, and caps.
- Preview → approve → confirm → re-list.

### Alerts and automation

**Positive triggers**

- “Tell me when,” Slack/Zapier/HubSpot/generic webhook destination, scheduled rule, real-time event, or failed delivery.

**Negative triggers**

- Do not use for a one-time report.
- Do not create scheduled SQL when a fixed event exists.
- Do not echo destination secrets or tokens.
- Do not send a test notification unless explicitly requested.

**Required sequence**

- List targets, rules, and relevant deliveries.
- Prefer fixed events.
- For scheduled rules, use the dictionary and require a stable `dedup_key`.
- Preview and verify all configuration changes.

### Tracking and attribution

**Positive triggers**

- Tracking installation, canonical serving URLs, tracked links, collection/property/group attribution setup, WordPress or white-label diagnostics.

**Negative triggers**

- Do not own analytics interpretation after data is flowing.
- Do not change canonical URLs during diagnosis without explicit approval.
- Do not conflate tracking setup with advertising activation.

**Required sequence**

- Inspect current tracking and serving state.
- Identify entity scope and deployment type.
- Preview configuration changes.
- Verify events/links after application and hand off measurement to traffic/performance.

### Reporting

**Positive triggers**

- A designed, durable, shareable, downloadable, or published report.

**Negative triggers**

- Do not publish an exploratory analysis automatically.
- Do not duplicate the report-generation implementation inside another skill.

**Required sequence**

- Use the server-hosted report skill method.
- Pull scoped data with the traffic/performance rules.
- Apply collection branding.
- Validate narrative and totals.
- Preview the artifact; publish only after approval.

## Cross-skill examples

| User request | Primary route | Secondary route |
| --- | --- | --- |
| “Why did direct bookings fall last month?” | Traffic/performance | Reporting if a durable deliverable is requested. |
| “Fill our empty Mt. Hood nights next month.” | Stimulate demand | Catalog, email, advertising, or tracking based on diagnosis. |
| “Increase this Google campaign to $25/day.” | Advertising | None unless destination readiness is suspect. |
| “Create a pet-friendly landing page and promote it.” | Catalog | Advertising after draft, content, and publication approval. |
| “Email members about these three homes Friday.” | Insiders email | Catalog read to validate slugs; no demand orchestration needed. |
| “Slack me when traffic drops sharply.” | Alerts/automation | Traffic dictionary for a scheduled rule only if fixed event is insufficient. |
| “Produce our monthly owner report.” | Reporting | Traffic/performance supplies data method. |
| “Why is ChatGPT traffic missing?” | Tracking/attribution | Traffic/performance after instrumentation is verified. |

## Approval semantics

Approval must bind to a concrete preview:

- Collection and entity identifiers
- Exact fields or operation
- Publication/send/status state
- Audience or recipients
- Budget and dates where money is involved
- Destination/delivery targets
- Server clamps, caps, or substitutions

“Go ahead,” “do it,” or equivalent approves only the most recently presented complete preview. A changed payload requires a new preview and approval.

## Partial failures

- Do not retry a consequential write with changed arguments silently.
- Reuse idempotency semantics for the same logical request when supported.
- Report which stage succeeded, which failed, and the observed durable state.
- Verify before suggesting a retry.
- Never compensate by performing a second mutation unless the user approves the recovery action.

## Evaluation requirements

Each skill needs:

- At least five positive prompts.
- At least three negative-trigger prompts.
- At least two ambiguous cross-skill prompts.
- One no-data case.
- One permission/scope failure.
- One schema-validation failure.
- One preview-only write case proving no mutation.
- One partial-failure or stale-state case where relevant.

Routing passes when the skill selects the correct job, correct initial read, correct handoff, and correct approval boundary—not merely when the final answer sounds plausible.
