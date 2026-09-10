---
name: kismet-manage-icnd-pages
description: Create or update native collection landing pages on a client's ICND/AXIS website from Kismet groups or property slugs. Use when the page must retain the client's native search, filters, property cards, map, property links, and checkout.
---

# Manage ICND collection pages

Build the page on the client's ICND site. Use the Kismet User MCP for collection content and
membership. Use ICND's native Booking configuration for search, filters, cards, map, property
links, and checkout. ContentBuilder owns editorial text and images only.

Support both operation paths:

- Prefer direct authenticated, same-origin requests for repeatable work after proving the target
  client's current HTTP contract.
- Use the native ICND UI when browser JavaScript owns ContentBuilder serialization or image
  upload, as a safe fallback, and for final visual verification.

## Required inputs

Obtain the client ICND origin, Kismet collection slug, requested page path, and either a Kismet
group slug or an explicit list of Kismet property slugs. The user must log in to that ICND origin
in the browser. Never ask for, copy, or store the password.

## Discover each client's contract

Run discovery before the first write on every client. ICND deployments can differ in endpoints,
field names, option values, property IDs, page IDs, URL schemes, and content lifecycle.

1. Confirm the active origin is the intended ICND/AXIS client and the user is authenticated.
2. Open one working native collection page and inspect its settings and ContentBuilder forms
   without saving.
3. Record a redacted request profile:
   - current add/edit URL and response status;
   - resolved form action, method, and encoding;
   - successful controls, hidden controls, and the actual submitter name and value;
   - page identity and create-versus-update behavior;
   - repeated property field name and native property IDs;
   - submitted values for layout, placement, visibility, indexing, filters, and SEO;
   - draft and live controls, serializer, image upload, and post target.
4. Confirm that the client supports a native results layout, exact property selection,
   ContentBuilder editing, and draft saving. Missing publication support still permits a draft.
   Missing unpublish support must be reported.
5. Prove an adapted API contract with a no-change replay on a client-approved page. Require a
   normal success response and a fresh GET that preserves every protected setting.

Do not call a Juniper route or send a Juniper field because another ICND page looks similar. Never
reuse another client's endpoint, submitter, option values, page IDs, property IDs, or lifecycle
behavior. If a required form meaning is unclear, compare one current page with its rendered output
instead of guessing.

## Resolve Kismet membership to ICND properties

1. Call `list_my_collections` and confirm the requested collection is in scope.
2. In group mode, call `get_group` and use the exact `members[].slug` list. In explicit mode,
   call `get_property` for every requested slug.
3. Fetch `https://kismet.travel/api/infrastructure/public/vrm/<collection-slug>` and join each
   requested Kismet slug to its client `servingUrl`.
4. Normalize the host and path, preserve meaningful path segments, and treat one trailing slash
   as equivalent. Join each normalized URL to the ICND property inventory.
5. Require exactly one native ICND property ID for every requested property. Never match by
   display name or fabricate `/rentals/<slug>`.

Stop before writing when a serving URL is missing, points at another host, is duplicated, or does
not match exactly one ICND property. Show every unresolved or ambiguous record.

## Compose the native collection page

Map the Kismet source into the current client's proven controls:

| Kismet source | ICND destination |
|---|---|
| Group label | Page name and H1 |
| Group region and description | Native editorial blocks |
| Group hero image | Client image workflow or header-image field |
| Group members | Exact native property selection |
| Requested page path | Client-format URL slug |
| Approved SEO copy | Title, description, canonical, and indexing controls |

Use specific-property selection for arbitrary Kismet groups. Use a native amenity or destination
filter only when a read-only simulation proves that its exact property set equals the requested
Kismet membership.

Clone only proven native headings, paragraphs, rows, and image blocks from the same client. Do not
build cards, filters, maps, or checkout in ContentBuilder. Do not add scripts, iframes, `embed.js`,
`k.js`, custom-code blocks, or custom checkout markup.

## Preview and approval

Before every write, present one bounded preview containing:

- client origin, page path, create/update operation, and current public status;
- settings, placement, visibility, indexing, and SEO changes;
- ordered editorial block summary;
- each Kismet slug, serving URL, and uniquely matched ICND property ID;
- current members, additions, removals, unresolved records, and final count;
- selected API or UI write path and why it is valid for this client.

Do not write while any mapping is unresolved. Require explicit approval of the preview for create,
membership replacement, settings changes, publication, visibility changes, or deletion. Approval
for one operation does not authorize another.

## Write through the approved path

### Direct API path

Build the request from the current form's successful controls and hidden values. Include the
current submitter field. Use browser-held, same-origin credentials. Preserve every untouched
control so an update cannot clear unrelated settings. After the response, re-read the settings and
compare the saved values with the approved preview.

Do not export cookies, authorization headers, anti-forgery values, session IDs, or raw authenticated
HAR files. Keep temporary captures outside the repository. Retain only redacted method, path,
content type, field names, response status, and redirect behavior.

### Native UI path

Use the current client's native submit control. For ContentBuilder, use its own draft/live save
functions so managed images upload and the builder serializes its HTML correctly. Reopen the editor
after saving and confirm its content and controls still work.

Treat settings and editorial drafts as separate writes. ICND settings can affect the public page
immediately; a draft-only request does not authorize a settings submission.

## Verify rendered behavior

A successful response, saved property IDs, or editor screenshot does not prove that ICND rendered
the collection. Open the client's supported rendered preview and verify:

- expected result count and at least one real native property card;
- native search, filters, and map;
- sampled card links remain on the client origin;
- the existing client checkout journey remains unchanged;
- no duplicate results section, script rewrite, iframe, or console error appears.

Save rendered evidence that visibly shows the result count and a property card. If the client has
no private rendered preview and the user forbids a reachable public route, keep the task open and
report the blocked visual check.

Publication is a separate operation. Publish only after explicit approval, then reopen the public
URL and repeat the rendered checks. `clearDraft=1` is not unpublish. Never claim unpublish support
until the target client exposes a real visibility control that has been verified.

## Completion report

Return the client page URL, ICND page ID, draft/public state, Kismet source, matched property count,
chosen write path, no-change API proof when applicable, and rendered-card verification. Name any
capability that remains unavailable on that client.
