---
name: kismet-staging-proxy-setup
description: Stand up a Kismet staging proxy for a partner's existing website so Kismet fixtures can be mounted into their pages with no change on the partner's side. Use before the first fixture install on a partner page, when a staging host does not resolve through the worker, or when deciding between a Kismet-zone staging host and a partner-zone CNAME.
---

# Set up a Kismet staging proxy

The staging proxy is the vrm-injection-worker serving a partner's own pages at a Kismet-controlled host. Staging shows the collection's DRAFT fixture rules; production shows the PUBLISHED set. Both proxy the same partner pages, so rules are host-agnostic and publish is the only promotion step.

The write tool in this skill lives on the operator MCP (the authenticated Kismet connection from the `kismet-operators` plugin), not on the public Developer MCP. It requires an admin or member role on the collection. It is preview then confirm: call it once without `confirm`, show the preview to the user, and call again with `confirm: true` only after the user approves. Never confirm on the user's behalf.

## 1. Choose the rung

- **Rung zero, Kismet zone, pre-contract.** Host is `staging-<collectionSlug>.kismet.travel`, DNS and worker route on Kismet's Cloudflare account, resolved through `vrm_staging:<slug>` in Kismet's global KV namespace. Nothing is asked of the partner. Use this for demos, evaluation, and every install before the partner has connected their zone.
- **Rung one, partner zone, after connection.** The partner adds a single CNAME (for example `staging.<partner-domain>`) to Kismet, and kv-sync writes `vrm_staging_host:<host>` from the collection's `cloudflareConfig.stagingHosts`. Use this once the partner has connected and wants staging on their own domain. `provision_staging_proxy` does not create rung one; it is configured through the collection's Cloudflare config and the partner's DNS.

This skill provisions rung zero. The fixture rules, CSS, and smoke are identical on both rungs.

## 2. Check prerequisites

1. `list_my_collections`: the collection exists and the caller's role can manage it. Note the exact `slug`.
2. `list_properties` on the collection: properties are imported and published. A staging host with no published properties renders empty fixtures.
3. Routes are synced: every partner page you intend to mount on has a serving URL on the partner domain (`set_property_serving_urls` for listing pages, `set_page_serving_url` for collection pages). The worker resolves `{vrSlug}` from these routes; a rule with `requires: ["vrSlug"]` silently skips a page whose route is missing.
4. `get_fixture_status { collection_slug }`: read the current state before touching anything. It reports whether `vrm_staging` already exists in KV, the staging host, production domains, and drift flags. If a staging entry already exists, stop and tell the user; do not provision twice.

## 3. Provision the staging host

1. Call `provision_staging_proxy { collection_slug: "<slug>", origin_domain: "<partner-domain>" }` with no `confirm`. `origin_domain` is the partner's live host without scheme, for example `staysosuite.com`.
2. Show the preview to the user verbatim: the DNS record it will create (`staging-<slug>` on the kismet.travel zone, proxied), the worker route it will add (`staging-<slug>.kismet.travel/*` on the staging worker script), and the `vrm_staging:<slug>` value it will write (`domain`, `origin`, `rewriteOriginHost: true`).
3. Only after the user approves, call `provision_staging_proxy { collection_slug, origin_domain, confirm: true }`. Record the returned smoke URL.
4. If the tool fails closed with a missing environment message, report it and stop. The zone id, staging script name, and account token are read from the API's environment by name; do not ask for, paste, or guess them.

## 4. Google Maps browser key referrers

The worker injects a browser Maps key on the fixture config (`fixtures.mapsKey`). Google restricts that key by HTTP referrer, so a host that is not on the referrer list gets a grey map and `RefererNotAllowedMapError` in the console.

1. Both hosts must be on the key's referrer list: the staging host (`https://staging-<slug>.kismet.travel/*`) and the partner's production host (`https://<partner-domain>/*`), because production will later serve the same rules.
2. There are two keys. The loader key is the one the drop-in loader uses; the results-page map uses the render-service key delivered in the render-service payload. Both need the referrers, or the property-detail map will work while the results map fails.
3. Updating the referrer list is a Google Cloud console change made by the user. Tell them exactly which two referrers to add and to which two keys, then wait. Do not attempt this yourself.

## 5. Confirm the host resolves through the worker

Open the smoke URL in the browser tool with a normal browser user agent and check, in order:

1. Response headers on the document: `X-Kismet-Staging-Host: staging-<slug>.kismet.travel` and `X-Kismet-Injected` present (value `tracking` before any rule matches, `tracking+fixtures` on a page where a draft rule matched). If both are absent and you see the partner page unchanged, DNS is serving the record without the proxy; the record must be proxied (orange cloud), not DNS only.
2. Injected markers in the DOM: run `document.querySelectorAll('[data-kismet-fixtures]').length` in the page. Expect at least `config` and `mounter` script elements on a page with a matching rule, plus `theme` when the collection has CSS and `hide` after a `replace` rule has fired. Zero markers on a page that should match means the draft rules are empty or the path pattern does not match; read `get_fixture_status` before editing anything.
3. The page still renders the partner's own content around the mount. A blank page or a Cloudflare error page means the origin is refusing the proxied request; report the status code.

## 6. Cookie rebinding and origin-leak checks

1. Cookies: on the document response, no `Set-Cookie` header may carry `domain=<partner-domain>`. The worker strips the `Domain` attribute so cookies bind to the staging host. If one slips through, the partner's session cookies land on the wrong host and sign-in on staging breaks.
2. Origin leak: list network requests filtered by the partner domain. The count must be zero. Bubble-style client-rendered sites emit absolute URLs to their own origin; `rewriteOriginHost: true` on `vrm_staging:<slug>` makes the worker rewrite them to the staging host. A non-zero count means that flag is missing or the requests are built at runtime from a value the rewrite does not see; capture the first three request URLs as evidence.
3. Bypass paths: API and asset paths on the partner's `bypassPaths` and `bypassExtensions` still pass through the worker untouched. Confirm one asset request returns 200 from the staging host.

## Done

The staging host is done when the document carries `X-Kismet-Staging-Host`, the partner page renders, Maps referrers are confirmed added by the user, no request reaches the partner origin from the staging page, and no `Set-Cookie` carries the partner domain. Report the smoke URL, the `get_fixture_status` output, and whether the draft rule set is still empty. Continue with `kismet-install-fixture-on-partner-page`.
