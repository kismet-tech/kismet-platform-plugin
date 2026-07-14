# Demand stimulation playbook

## Diagnostic lenses

### Inventory

- Use `mgr_insight_v_vacation_rentals` as the roster and denominator.
- Resolve the requested collection UUID with `list_my_collections` and filter every multi-collection insight query on `collection_id = $n::uuid`. Automatic tenant scope limits access to all managed collections; it does not choose the requested one.
- Eligible listings should be active and have a live rates vendor with healthy rate sync.
- Left join reservations; a reservation-only aggregation silently excludes zero-booking properties.
- Confirm `count(*) = count(DISTINCT vacation_rental_slug)` for the filtered roster. If not, deduplicate before joining.
- Use `search_properties` date windows for true bookability on specific dates, including owner/maintenance blocks.
- `search_properties` has no exact-slug filter. Narrow by collection plus locality/region/capacity/persona and only claim validation for named candidates present in the returned result. Record unreturned candidates as unverified.

### Demand and conversion

- Traffic without property views suggests discovery/navigation weakness.
- Property views without CTA clicks suggest content, fit, price, or availability friction.
- CTA clicks without bookings require journey/checkout investigation; do not assume a single cause.
- Wishlists are high-intent signals suitable for warm retargeting.
- Availability misses may indicate date/inventory mismatch and deserve alternative-property merchandising.
- Low recorded traffic can mean low demand, missing distribution, new onboarding, or broken/stale tracking. Check the latest event, serving setup, and catalog exposure before choosing among them.

### Revenue

- Use `host_payout_cents` for cross-channel host revenue.
- Exclude owner stays (`NOT is_owner_stay`) from guest/revenue analysis.
- Anchor booking-time analysis on `booked_at`, never reservation `created_at`.
- Separate stay window from booking window.
- Treat provider-reported conversion value and ROAS as channel metrics whose attribution/definition must be inspected. Sanity-check surprising values against scoped reservations before recommending budget increases.

### Pricing

- Website displayed price: content-event `stay_*` / `displayed_nightly_rate_cents`.
- AI-surface dated price exposure: quote-token `total_amount` and dates.
- Do not compute quote-to-booking conversion from quote-token status; historical linkage is incomplete.

## Intervention matrix

| Observed constraint | Primary response | Guardrail |
| --- | --- | --- |
| Tracking absent or inconsistent | Repair tracking/serving URLs | Do not interpret missing traffic as zero demand. |
| Unpublished or incomplete destination | Catalog fix | Do not buy traffic to a weak destination. |
| Zero/low booking listings with valid live inventory | Merchandise or promote | Validate specific-date availability before naming properties. |
| Strong views, weak CTA | Improve content/fit/price presentation | Diagnose by property/group before channel spend. |
| Strong warm intent, weak return | Insiders or retargeting audience | Respect consent and PII boundaries. |
| Ready destination, insufficient qualified traffic | Paid acquisition | Bound channel, budget, dates, and success metric. |
| Repeated operational signal | Alert automation | Prefer a fixed event over scheduled SQL. |

## Channel selection

- **Direct/unattributed**: diagnose brand/return demand separately from attribution loss; it is not a paid platform.
- **Google organic**: improve search visibility, landing pages, structured data, content, and destination conversion.
- **Google paid**: manage search campaigns, search terms, spend, and conversion outcomes.
- **ChatGPT organic**: improve AI-readable catalog coverage, citations, MCP discovery, clickouts, and destination readiness.
- **ChatGPT paid**: manage OpenAI/ChatGPT Ads creative, targeting, spend, review state, and tracked outcomes.
- **Meta organic**: improve social referral, content/shareability, and landing experience.
- **Meta paid**: use paid social campaigns, retargeting, audiences, and lookalikes.
- **Owned/Insiders**: activate a consented known audience for relevant, timely inventory.

Do not recommend a channel solely because its tools exist.

The absence of an ad account is not evidence that an ad account should be created. Require a ready destination, trustworthy measurement, a defined audience/intent, and a bounded economic test. Never route an organic-source problem directly to its same-named paid platform without evidence that paid acquisition is the right mechanism.

Do not recommend scaling solely from an aggregate ROAS. Confirm the conversion definition, attribution window, campaign scope, and consistency with reservation outcomes.

## Minimum recommendation evidence

- Collection and property/group scope
- Analysis and stay periods
- Eligible listing count
- Booking/revenue/traffic indicators used
- Live availability check for named property/date recommendations
- Existing campaign or audience state if paid/retargeting is proposed
- Destination publication and content readiness

## Opportunity buckets

Classify before recommending:

- **Invisible** — eligible inventory with no meaningful recent property exposure. Improve discovery, groups, tracking, or acquisition.
- **Seen, not engaged** — property views with weak CTA/wishlist behavior. Fix fit, merchandising, content, price presentation, or unavailable dates before buying more traffic.
- **Engaged, not booked** — meaningful CTA/wishlist activity with weak bookings. Validate live availability/pricing and investigate checkout/journey friction; consider warm reactivation.
- **Underfilled but converting** — some bookings with substantial live inventory remaining. Scale the working message/channel carefully.
- **Not eligible** — inactive, missing rates, unhealthy sync, or unavailable for the target dates. Exclude from promotion.

Avoid hard universal thresholds. Compare properties within the same collection, market, capacity class, and period. Always show raw component metrics.

## Intervention selection rules

- **Invisible + trustworthy tracking:** improve catalog discovery or acquire qualified traffic.
- **Invisible + untrustworthy tracking:** repair measurement first.
- **Invisible + no groups/destinations:** establish a useful published destination before considering paid acquisition.
- **Seen, not engaged:** fix destination, positioning, content, price presentation, or audience fit.
- **Engaged, not booked + live availability:** investigate price/checkout/journey friction; use warm reactivation before broad acquisition.
- **Engaged, not booked + unavailable:** merchandise available substitutes; do not promote the unavailable listing.
- **Underfilled but converting:** scale the proven message/channel with a bounded experiment.
- **Not eligible:** repair rates/sync/status or exclude.

Prefer owned and known-audience interventions before paid acquisition when the evidence supports them. This is a decision rule, not a universal channel hierarchy.

## Recommendation structure

1. **Goal and scope** — collection, stay window, analysis window, guest/use case.
2. **What is observed** — raw inventory, booking, traffic, engagement, and availability evidence.
3. **What is inferred** — likely constraint with confidence and alternatives.
4. **Ranked opportunities** — bucket, evidence, live validation state, and expected mechanism.
5. **Fix-first list** — tracking, eligibility, destination, content, or checkout blockers.
6. **Activation options** — owned, known-audience, retargeting, and paid choices with tradeoffs.
7. **Measurement plan** — leading/lagging indicators and attribution caveats.
8. **Next preview** — one bounded action owned by the appropriate execution skill.

## Success measures

Define leading indicators (qualified views, CTA clicks, wishlists, clickouts) and lagging indicators (bookings, booked nights, host payout). Attribution limitations must be included when linkage is incomplete.

Use a pre/post measurement window and record the intervention start. For paid actions, add spend, CPC/CTR, attributed conversion definition, and destination-level bookings. For catalog/email actions, add exposure, engagement, and booked-night outcomes appropriate to the mechanism.
