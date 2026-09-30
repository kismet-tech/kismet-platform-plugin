# Self-serve activation: Guesty and Connect your Stripe

Status: proposed implementation acceptance, September 30, 2026.

A new operator can build a preview, connect Guesty, configure payments and see
what remains before live bookings are enabled. Any assisted live review has a
visible status and resume path. This is a separate delivery workstream consumed
by the Developer 1.0 release.

## Starter pricing and dashboard

No upfront charge and no monthly SaaS subscription in this version. Proposed
Kismet fees: 0.9% for normal checkout and 2.9% for Agent Checkout, with
credit-card processing fees passed through separately. The rates correspond
to separate channels; do not add the normal rate to the agent rate.
Normal-checkout fees are proposed to be billed monthly. Define the precise fee
base, refund treatment and agent billing cadence before implementing billing.

| Surface | Starter treatment |
| --- | --- |
| Direct storefront | Enabled |
| Telemetry, Guestbook and checkout | Included |
| Integrations and payment setup | Accessible to authorized collection roles |
| Funnels | Visible, grayed out |
| Email | Visible, grayed out |
| Every storefront other than Direct | Visible, grayed out |
| Website module | Omitted from the sidebar |

Gray styling must remain readable and have a text explanation such as "Not
included in Starter". Avoid upgrade buttons that imply a monthly subscription
for this version. Apply plan access consistently to direct routes and APIs;
sidebar appearance alone is not entitlement enforcement. Preserve other
plans' existing access. Website creation and deployment stay in the plugin
journey, with required domain and setup controls still reachable.

This treatment is distinct from other PMS cards: those retain active
**Contact support** actions in Integrations.

## Integrations experience

Expose **Integrations** to authorized collection users. Visibility does not
grant write permission: collection administrators connect or change services;
other roles receive only their permitted read access.

- Guesty has **Connect Guesty**, resume/import progress and honest readiness.
- Every other PMS advertised on the website has a professional card and an
  active **Contact support** action for new connections.
- Support actions open the established channel with relevant collection and
  provider context. Sending a message remains the customer's action.
- Preserve existing connections, their status and authorized management.
- Reconcile the marketing and dashboard catalogs before acceptance.

## Payment setup

Stripe onboarding is being delivered by its existing workstream. Consume that
release and verify the integrated journey; do not duplicate its implementation
in this cleanup workstream.

**Connect your Stripe** must work for a collection administrator without
platform-admin intervention. The owner can start, leave, return and resume
without creating duplicate accounts. Existing accounts are never replaced
implicitly. The server owns account eligibility and environment policy.

Use Stripe's supported surfaces to collect identity and bank information.
Keep secrets and onboarding links out of chat and issue setup links within the
authenticated application. Prove the selected surface supports the intended
existing-login reuse; do not infer it from a component being available.

Show setup required, verification pending, payments enabled, payouts
pending/enabled, restricted, unavailable and disconnected accurately. Browser
return, component exit and retry exhaustion must never imply success.

Refresh authoritative state on return and reconcile account updates. Delayed
or repeated events must not create duplicate accounts or false readiness.
Loss of charge capability must stop new Agent Pay checkout. Display payout
readiness separately from payment and booking readiness.

## Delivery slices

1. **Starter cleanup and Integrations:** scoped navigation, feature access,
   pricing disclosure, provider catalog, Guesty connect/resume, support actions
   and collection permissions.
2. **Payment setup dependency:** consume the existing onboarding release and
   verify authorized access and its readiness states within Starter.
3. **Activation:** a persistent inventory, payment and checkout checklist.
   Returning later resumes the same setup.
4. **External acceptance:** a fresh non-staff account deploys a preview,
   connects Guesty and completes TEST checkout, then follows the disclosed
   live-activation process. Keep TEST and LIVE evidence distinct.

## Acceptance cases

- Starter has no upfront or monthly SaaS charge; checkout rates and passed-through
  card fees are disclosed consistently. Billing terms are resolved before activation.
- Direct remains enabled; Funnels, Email and other storefronts are grayed out
  with readable explanations. Website is absent from the sidebar. Required
  setup remains reachable and other plans retain their existing access.

- A collection administrator connects Guesty and starts Stripe setup without
  global access; viewers, anonymous users and other collections cannot mutate it.
- Every advertised PMS appears, support actions work and existing connections
  remain accessible to authorized users.
- Import interruption resumes safely; imported but unavailable inventory does
  not pass checkout readiness.
- New Stripe users and existing-login owners complete supported onboarding.
- Cancellation, expired links, verification delay and status failure show the
  correct next action. No timeout or exit can show unverified success.
- Reloads, retries and double-clicks do not create duplicate accounts.
- Payments and payouts show distinct authoritative statuses.
- TEST checkout produces both a verified payment and reservation outcome.
  Payment alone is never presented as a confirmed reservation.
- Assisted activation has an explicit owner, status and resume path.
- Separate authorized LIVE acceptance verifies the production journey.

The accompanying plugin proposal does not implement these application changes.
The [1.0 release gates](developer-1.0-launch.md#release-gates) remain open until
implementation and end-to-end evidence satisfy them.
