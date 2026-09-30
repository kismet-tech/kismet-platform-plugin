# Self-serve activation: Guesty and Connect your Stripe

Status: proposed implementation acceptance, September 30, 2026.

A new operator can build a preview, connect Guesty, configure payments and see
what remains before live bookings are enabled. Any assisted live review has a
visible status and resume path. This is a separate delivery workstream consumed
by the Developer 1.0 release.

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

1. **Integrations:** customer navigation, professional provider catalog, Guesty
   connect/resume, support actions and collection permissions.
2. **Payment setup:** authorized start/resume/status, secure onboarding and
   truthful pending/restricted/error states.
3. **Activation:** a persistent inventory, payment and checkout checklist.
   Returning later resumes the same setup.
4. **External acceptance:** a fresh non-staff account deploys a preview,
   connects Guesty and completes TEST checkout, then follows the disclosed
   live-activation process. Keep TEST and LIVE evidence distinct.

## Acceptance cases

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
