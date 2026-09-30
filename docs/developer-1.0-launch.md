# Kismet Developer 1.0: website to agent checkout

Status: draft release proposal, September 30, 2026.

This proposal defines the target experience and corrects the current plugin's
capability descriptions. Versions remain 0.1.3 until the release gates pass.
This document is not a release notice.

## Product direction

Lead with **Build your own vacation rental website with agent checkout.**
The Developer plugin helps builders create, configure and maintain their site.
Kismet Checkout is the transaction product, Agent Checkout the channel, and
Agent Pay the payment rail.

Starter includes telemetry, Guestbook and checkout access with no upfront
charge and no monthly SaaS subscription in this version. The proposed Kismet
fees are 0.9% for normal checkout and 2.9% for Agent Checkout, with credit-card
processing fees passed through separately. Present these as the respective
channel rates, not additive platform fees.

Normal-checkout fees are proposed to be billed monthly; the precise fee base,
refund treatment and Agent Checkout billing cadence must be specified before
billing implementation. This proposal does not change live prices or billing.

Keep the Starter dashboard focused on the Direct storefront, telemetry,
Guestbook, checkout and setup. Gray out Funnels, Email and every storefront
other than Direct, with a readable explanation that they are not included in
this version. Omit the Website module from the sidebar. Building and deploying
a website remains part of the plugin journey.

Start with one supported starter, one hosting path, Guesty and one supported
checkout implementation. Vercel is the proposed first new-site deployment path.
Cloudflare is a separate existing-site path. The current plugin configuration
bundles neither hosting connector; each provider requires its own authorization.

## What exists and what remains

An installed plugin or an available management tool does not prove a new
customer's permissions or an end-to-end production workflow.

| Area | Current evidence | Required for 1.0 |
| --- | --- | --- |
| Plugin | Version 0.1.3 includes Codex and Claude manifests, ten skills and the Developer MCP connection. | Validate a fresh installation in every claimed coding host. |
| MCP | Public contract discovery and authorized management capabilities extend beyond read-only guidance. | Verify signed-out discovery and signed-in permissions separately; align recipes with shipped behavior. |
| Building | Workflows cover catalog, search, guest accounts, Fixtures and TEST booking. | A supported public starter and dependencies that a new customer can install and deploy. |
| Signup | Fresh-account acceptance remains to be completed. | Account, collection and TEST setup without staff workarounds; explicit assisted LIVE activation if needed. |
| Guesty | Connection and import must be accepted as part of the full customer journey. | Honest import progress, safe resumption and separate quote/reservation readiness. |
| Integrations | Customer-facing setup is a launch dependency. | Guesty setup; Contact support for other website-advertised PMSes; preserve existing connections and collection permissions. |
| Stripe | A verified collection-admin onboarding journey is a release dependency. | Start, resume and authoritative status for new and existing Stripe users; no false success after browser return. |
| Checkout | TEST booking requests and live Kismet Checkout are distinct capabilities. | One supported checkout handoff with authoritative payment and reservation outcomes, including recovery. |
| Hosting | Only Kismet MCP is configured in this package. | Prove deployment, secret delivery, preview, domain and rollback before claiming a bundled connector. |
| Distribution | Repository packaging exists. | Fresh external installation and verification of any public-directory claims. |

## First journey

1. Install Kismet Developer and ask for a vacation rental website with agent checkout.
2. Build a branded preview with labeled demo data, supported search and property
   pages, guest account, saves and telemetry before connecting a PMS or payments.
3. Sign into Kismet, create the collection and connect Guesty. Show which
   properties are imported and which are ready to book.
4. Deploy to the first supported host. Deliver server credentials directly to
   its authorized secret store. The customer owns the source and project.
5. A collection administrator selects **Connect your Stripe**, completes or
   resumes setup, and sees authoritative payment and payout status.
6. Exercise the supported checkout in TEST. Complete any disclosed live review
   and verify activation separately from the TEST result.
7. Show the resulting guest, journey and booking using authorized records from
   the correct environment.

The deployed site uses supported APIs and trusted components after the builder
chat ends. Agent-readable content does not guarantee discovery in every AI product.

For an existing site, regression resistance is an acceptance requirement, not
an absolute promise. Start with telemetry on supported HTML routes, preserve
origin responses when injection fails, exclude admin/API/asset paths and verify
caching, content security policy and existing authentication. Add guest login
through an explicit isolated mount. Require staging checks and a one-action
disable path before broad routing.

## Proposed 1.0 listing language

Use this language only when its corresponding release gates pass.

**Display name:** Kismet Developer

**Short description:** Build your vacation rental website with agent checkout.

**Long description:** Build and publish a branded vacation rental website with
your AI coding assistant. Start with a preview, connect Guesty, add guest login
and telemetry, and set up Kismet Checkout. Kismet guides deployment and payment
setup and shows what remains before your site can accept bookings.

**Starter prompts:**

- Build my vacation rental website with agent checkout.
- Connect Guesty and prepare my website to accept bookings.
- Help me connect Stripe and check my checkout setup.

**Activation qualification, if needed:** Build your preview yourself. We review
your inventory and checkout setup before activating live bookings.

**Proposed pricing copy:** No upfront cost. No monthly subscription. 0.9% on
normal checkout. 2.9% on Agent Checkout. Credit-card processing fees are passed
through separately.

Show the agreed fee basis and billing cadence before activation. Prefer
"Start with no upfront cost" over an unqualified "free checkout" claim.

## Connect your Stripe

**Heading:** Connect your Stripe

**Body:** Set up payments for Kismet Checkout. If you already use Stripe, sign
in during setup to reuse eligible business information. Agent Pay uses a
Kismet-connected account, with payment and payout details available in Kismet.

**Primary action:** Continue to Stripe

**Resume action:** Continue Stripe setup

**Checking:** Checking your payment setup.

**Incomplete:** Stripe needs more information before you can accept payments.

**Review pending:** Stripe is reviewing your information. You can return here to
check progress.

**Payments ready:** Payments enabled.

Show payout status separately. Only show **Ready to accept bookings** when
inventory and checkout readiness also pass.

**Temporary failure:** We could not check your payment setup. Try again.

Reusing an existing Stripe login and eligible business information does not
mean attaching or converting an arbitrary existing Stripe account. Verify the
selected onboarding surface supports the intended reuse before promising it.
Stripe's [hosted onboarding documentation](https://docs.stripe.com/connect/hosted-onboarding)
describes networked onboarding and why returning to the application is not
proof of completion.

See the [activation acceptance brief](self-serve-activation.md) for required
permissions, resumption, state handling and checkout evidence.

## Release gates

- [ ] A new customer builds a preview without staff access or a payment account.
- [ ] Supported starter and dependencies install from public release artifacts.
- [ ] Guesty connects with honest import and bookability status.
- [ ] Other advertised PMSes have working Contact support actions; existing connections survive.
- [ ] A collection admin completes Stripe setup; existing-login reuse is verified.
- [ ] Guest account, telemetry and Guestbook respect consent and environment boundaries.
- [ ] Supported TEST checkout confirms payment and reservation, including recovery.
- [ ] Assisted activation, if needed, has a visible status, owner and resume path.
- [ ] An approved LIVE pilot verifies the actual activation and booking path.
- [ ] Fresh-host installation, provider authorization, deployment and rollback pass.
- [ ] Public docs, recipes and plugin claims agree with shipped capabilities.
- [ ] Starter navigation enables Direct, grays out Funnels, Email and other
  storefronts, and omits the Website module without breaking setup access.
- [ ] Pricing disclosure and billing agree on channel rate, fee base, cadence,
  refund treatment and passed-through card fees; no monthly SaaS subscription.
- [ ] Both plugin manifests and the Claude marketplace developer entry move to
  1.0.0 together; validate, publish and verify a fresh installation.

Keep plugin identifiers, marketplace names and the MCP URL stable throughout
this release. Preserve installed-client compatibility.
