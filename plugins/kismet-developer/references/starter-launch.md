# Build a Starter site

This workflow guides use of shipped contracts. It does not add API capabilities
or certify the proposed 1.0 release.

1. Establish whether this is a new website or an existing site. For a new site,
   begin with the supported starter and explicit fixture data. For an existing
   site, inspect the staging-proxy and Fixture-install skills before suggesting
   routing changes. Do not require a worker on a new site that already includes
   the SDK telemetry and guest account integration.
2. Discover current capabilities and available recipes. Build a branded preview
   with listing/detail pages, search and supported guest account components.
   Label sample data and TEST behavior. Do not present a sample reservation as
   real, or silently substitute fixtures when live data fails.
3. Keep a visible readiness list: site preview, inventory, deployment, guest
   account, telemetry, payment setup and checkout. Mark missing, pending,
   unsupported and verified separately. Never infer live readiness from package
   installation, an import completing or a successful build.
4. The first proposed live path is Guesty. Use an available authorized setup
   surface; if self-serve setup is unavailable, explain the exact activation
   dependency. Other PMSes use Contact support for new connections. Preserve
   existing authorized integrations. Do not invent PMS setup endpoints or grants.
5. Use the user's supported host. Vercel is the proposed first new-site path;
   Cloudflare is the proposed existing-site edge path. They are separate
   authorizations, not prerequisites for one another. Neither connector is
   bundled by the current Kismet MCP configuration. Do not claim it is connected
   before the host confirms it. Put server credentials directly into the approved
   deployment secret store; stop credential issuance if that cannot be done.
6. To enable payments, guide the collection administrator to the supported
   Kismet payment setup surface. The requested CTA is **Connect your Stripe**.
   Explain that Agent Pay uses a Kismet-connected account; Stripe may let the
   owner reuse business details from an existing login. Never collect identity
   or bank details in chat, create accounts through an internal admin endpoint,
   replace an existing account implicitly, or disable a readiness gate.
7. Obtain the supported Kismet Checkout handoff contract and preserve its quote,
   payment authorization and reservation authority. A TEST booking request is
   not production checkout. If the supported handoff is unavailable, leave live
   booking disabled with the specific blocker and finish the independent preview.
8. Validate the deployed preview through the actual builder-host combination.
   Verify login, inventory mapping, telemetry receipt and the approved TEST
   checkout flow, including authoritative reservation outcome. If live activation
   needs a person, state what they review and how the operator resumes. A TEST
   pass does not authorize a real charge or production publication.

Keep payment readiness, payout readiness and checkout readiness distinct.
An onboarding return, timeout or browser event cannot turn any of them green.
