---
name: kismet-smoke-fixture-install
description: Smoke a Kismet fixture install on a partner page served through the staging or production proxy, checking proxy isolation, mounts, sizing, booking, tracking, Maps, and console health in the browser, and produce a pass or fail report table with evidence. Use before publish_fixtures, after a partner release, and after any rule or CSS change.
---

# Smoke a fixture install

Run this against the staging host before every publish and against the production host after. The checklist is the definition of done for `kismet-install-fixture-on-partner-page`; nothing publishes on a partial pass. Every item is checked in the browser tool: open the page, read the DOM, list network requests, read the console, run small read-only JavaScript, and resize the viewport. The only MCP call is the read-only `get_fixture_status` on the operator MCP; this skill writes nothing.

## 0. Prepare

1. `get_fixture_status { collection_slug }`: record the draft or published rule count (whichever the host you are smoking serves), the staging host, and any drift flags. The rule count is the expected mount count in item 3.
2. Pick one URL per rule: a property page (for example `/listing/<nickname>`) and a results page (for example `/destinations/<city>`). Prefer pages whose serving URLs are synced; a property page without a route is expected to skip a `requires: ["vrSlug"]` rule, so it is not a valid test page.
3. Note the partner domain and the fixed header height from the install.

## 1. Zero requests to the origin host

Open the staging page and list network requests filtered by the partner domain (for example `staysosuite.com`). Expected: zero entries. Requests to the staging host, `kismet.travel`, `maps.googleapis.com`, and third-party CDNs are fine. Evidence: the filtered count, and the first three offending URLs when non-zero.

## 2. Cookies rebound to the staging host

Read the response headers of the document request and of the first XHR to the staging host. Expected: no `Set-Cookie` value contains `domain=<partner-domain>` (case-insensitive). Evidence: the count of `Set-Cookie` headers inspected and the stripped domain attribute (or the offending value).

## 3. Every rule's mount present and the anchor hidden

Run in the page:

```js
({
  mounts: [...document.querySelectorAll('[data-kismet-element]')].map(m => m.getAttribute('data-kismet-element')),
  hideStyles: document.querySelectorAll('style[data-kismet-fixtures="hide"]').length,
  markers: [...document.querySelectorAll('[data-kismet-fixtures]')].map(e => e.getAttribute('data-kismet-fixtures'))
})
```

Expected: the number of mounts equals the number of rules matching this path (usually one); `markers` includes `config` and `mounter`, plus `theme` when the collection has CSS; for each `replace` rule the anchor's computed `display` is `none` (`getComputedStyle(document.querySelector('<anchor>')).display`). A page that should match but has zero mounts is a fail: the anchor probably moved with a partner release, so record the new candidate class. Evidence: the object above and the anchor display value.

## 4. Sized to the slot at 1440 and 390, no horizontal scroll

Resize the viewport to 1440 wide, then to 390 wide. At each width run:

```js
({
  scrollX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  mount: document.querySelector('[data-kismet-element]').getBoundingClientRect().toJSON(),
  parentWidth: document.querySelector('[data-kismet-element]').parentElement.getBoundingClientRect().width
})
```

Expected: `scrollX` is `false`; the mount width equals the parent slot width within a few pixels; the fixture's bottom is not clipped by an ancestor (scroll to the bottom of the fixture and confirm the last section is visible). Clipping at either width means `growAncestors` is too low. Evidence: both objects and a screenshot at each width.

## 5. Sticky toolbar offset under the partner header

On the results page, scroll down 800px and read `document.querySelector('.rp-toolbar').getBoundingClientRect().top`. Expected: equal to the partner's fixed header height (60 on the Sosuite install), so the toolbar sits directly under the header rather than behind it. A value of 0 under a fixed header means the `.kismet-fixture-mount .rp-toolbar{top:<header>px}` rule is missing from the CSS. Evidence: the measured top and the header height.

## 6. Drawer opens and a quote loads for a dated search

On the results page, set check-in and check-out dates in the fixture's date control and confirm cards refresh with nightly prices. Click one card: the property drawer opens inside the fixture. On a property page, set dates in the booking panel and confirm a quote with a total appears and Book now lists the rate plans. Expected: no error state, quote request to `kismet.travel` returns 2xx (filter network by `kismet.travel/api`). Evidence: the quote request URL and status, and a screenshot of the total.

## 7. Tracking events land in both modes

Client mode: filter network by `k.js`; `https://kismet.travel/k.js?c=<collectionSlug>` returns 200 and a following event request to `kismet.travel` returns 2xx. Server mode: the document response carries `X-Kismet-Injected` containing `tracking`, which is the edge relay writing the server-side pageview. When the operator MCP allows read-only SQL, confirm one `content_event` row for the page URL with `tracking_mode = 'server'` and one with `tracking_mode = 'client'`; otherwise report the header and the k.js status as the evidence and mark the row check as not run. Evidence: header value, k.js status, event request status, and the SQL row counts when available.

## 8. No console errors from kismet bundles

Read console messages filtered to errors. Expected: none whose source or text references `kismet.travel`, `dropins`, `embed.js`, or `kismet-`. Partner-side errors that also appear on the un-proxied partner page are recorded but do not fail the item; say which they are. Evidence: the error count and the first error text.

## 9. Maps loads without RefererNotAllowedMapError

On the property page and on the results page, the map tiles render and the console has no `RefererNotAllowedMapError` and no `InvalidKeyMapError`. The two pages use different keys: the property map uses the loader key and the results map uses the render-service key from the render-service payload, so check both pages separately. A grey map with `RefererNotAllowedMapError` means the current host is missing from that key's referrer list; name the host and which key. Evidence: presence of `.gm-style` in the mount (`document.querySelector('[data-kismet-element] .gm-style') !== null`) and the console result on each page.

## 10. Property-detail shows rules and about text without duplicated headings

On the property page, read the fixture's text and confirm the house rules and about sections render with content. Expected: each heading appears once. A duplicate heading means the partner's native block is still visible next to the fixture and needs hiding through `set_fixture_css`, or the rule position should be `replace`. Evidence: the list of headings inside the mount (`[...document.querySelectorAll('[data-kismet-element] h1, [data-kismet-element] h2, [data-kismet-element] h3')].map(h => h.textContent.trim())`).

## Report

Finish with this table, one row per item, and nothing publishes until every row reads pass. Rows marked not run must say why.

| Item | Pass or fail | Evidence |
|---|---|---|
| 1. Zero requests to origin host | | |
| 2. Cookies rebound to staging host | | |
| 3. Mounts present, anchors hidden | | |
| 4. Sized to slot at 1440 and 390, no horizontal scroll | | |
| 5. Sticky toolbar offset under header | | |
| 6. Drawer opens, quote loads | | |
| 7. Tracking lands in server and client mode | | |
| 8. No console errors from kismet bundles | | |
| 9. Maps loads without RefererNotAllowedMapError | | |
| 10. Rules and about text, no duplicated headings | | |

Above the table state the host smoked, the pages used, the `get_fixture_status` rule count and hash, and the partner release or date the anchors were last verified against. Anchor class stability across partner deploys is unverified, so a fail on item 3 after a partner release is the expected first symptom and the fix is a new anchor, not a new rule set.
