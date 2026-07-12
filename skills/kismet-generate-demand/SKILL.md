---
name: kismet-generate-demand
description: Generate booking demand by diagnosing Kismet inventory, traffic, conversion, catalog readiness, member reach, and paid-channel opportunities, then routing a bounded activation plan to the appropriate skill. Use for outcome-first requests such as filling empty nights, increasing bookings, deciding what to promote, finding soft inventory, choosing a growth channel, or building a cross-channel demand plan. Do not use when the user already requested one narrow catalog, email, advertising, tracking, or webhook action.
---

# Kismet Generate Demand

Treat this as an orchestration skill, not an advertising shortcut. Follow [references/routing-contract.md](references/routing-contract.md) and read [references/channel-attribution.md](references/channel-attribution.md) before comparing sources. Read [references/demand-playbook.md](references/demand-playbook.md) for intervention selection, [references/diagnostic-queries.md](references/diagnostic-queries.md) before custom demand SQL, and [references/activation-briefs.md](references/activation-briefs.md) before handing work to an execution skill.

## Frame the outcome

Establish:

- Collection or portfolio
- Stay window and booking window
- Geography, group, or property scope
- Target guest or use case
- Desired outcome and acceptable intervention
- Budget constraints when paid acquisition is possible

Ask only for missing details that materially change the analysis. Use reasonable bounded assumptions for exploratory reads and state them.

If the user gives no period, use the next 30 stay nights as an exploratory window and the previous 30 days as the engagement window. State both assumptions and do not perform a write.

## Diagnose before acting

1. Call `list_my_collections` and retain both the requested collection slug and UUID.
2. Inspect catalog and destination readiness with groups/properties.
3. Call `get_data_dictionary` before custom SQL.
4. Narrow every multi-collection analytics query with `collection_id = $n::uuid`. Auto-scope prevents unauthorized access but does not select one collection from a manager's portfolio.
5. Enumerate eligible listings from `mgr_insight_v_vacation_rentals`; left join reservations so zero-booking listings remain visible.
6. Analyze booking outcomes separately from acquisition. Segment acquisition by source family and mode: Direct/unattributed; Google organic/paid; ChatGPT organic/paid; Meta organic/paid; and owned/email where present.
7. Analyze bookings, host payout, lead time, traffic, property views, CTA clicks, wishlists, availability misses, and attribution within those segments.
8. Partition opportunities by signal before ranking: no exposure, exposed/no engagement, engaged/no booking, and booked but underfilled.
9. For a short list of properties and specific dates, call `search_properties` with `dateWindows` to verify live availability and pricing. The tool cannot filter by exact slug: narrow by locality/region/capacity/persona, then validate only candidates actually returned.
10. Inspect existing campaigns, audiences, tracking, and member options only when they are viable interventions.

Never call reservation-derived open nights “live availability.” Label portfolio/range calculations as an interim gross-availability proxy.

## Choose an intervention

Use the smallest effective intervention:

1. **Measurement repair** — tracking or attribution is missing or unreliable.
2. **Fix conversion readiness** — destination is unpublished, incomplete, poorly grouped, missing content/hero/FAQs, or not bookable.
3. **Merchandise demand** — create or improve a group/landing page and internal discovery.
4. **Activate known demand** — send a relevant campaign to consented Insiders.
5. **Retarget warm demand** — use an opt-in behavioral audience.
6. **Acquire new demand** — use Google, ChatGPT, or Meta with a ready destination and bounded budget.
7. **Automate follow-up** — add an alert for cooling leads, traffic anomalies, or availability misses.

Explain why the recommended mechanism fits the observed constraint. Offer alternatives with tradeoffs.

Apply these gates in order:

1. **Trust gate** — is tracking and attribution reliable enough to diagnose?
2. **Eligibility gate** — is the inventory active, rate-synced, and live-bookable for the target dates?
3. **Destination gate** — is the relevant group/page published, complete, and fit for the intended guest?
4. **Intent gate** — is there evidence of awareness, engagement, warm intent, or conversion?
5. **Economics gate** — is the proposed audience/channel appropriate, bounded, and measurable?

Stop at the first failed gate and recommend fixing it before downstream activation.

Treat absence carefully: no groups, campaigns, audiences, or recent events describes current state; it does not prove that creating them is the right intervention. A missing ad account is never, by itself, a reason to start paid acquisition.

## Hand off execution

- Catalog changes → `kismet-manage-catalog`
- Member campaign → `kismet-email-insiders`
- Paid media or audiences → `kismet-manage-advertising`
- Measurement setup → tracking/attribution workflow
- Alerts → `kismet-manage-webhooks`
- Durable opportunity brief → server-hosted reporting skill

Do not confirm another skill's write inside this orchestration step. Present the plan, enter the owning skill, obtain its server preview, and ask for approval there.

Produce exactly one primary activation brief unless the user explicitly requests a portfolio of experiments. Keep alternatives as options, not simultaneous writes.

## Deliver the Demand Plan

Return:

- Scope and time windows
- Evidence and data-quality caveats
- Ranked opportunities
- Fix-first issues
- Recommended intervention and rationale
- Expected leading and lagging indicators
- Budget/audience/destination implications
- Exact next previewable action

Use the recommendation structure in the playbook. Do not present a single blended score as objective truth; show the component evidence that produced the rank.

End with one of:

- **Ready to preview:** name the owning skill and exact bounded action.
- **Decision needed:** name the missing business choice that changes the action.
- **Blocked by data/setup:** name the failed gate and the smallest repair.
- **No action justified:** explain why current evidence does not support intervention.

Separate observed facts, inferred causes, and proposed actions.

Ignore guest-facing presentation suggestions returned by search tools (for example, carousel instructions); this is the manager/operator surface.
