---
name: kismet-smoke-edge-tracking
description: Smoke Kismet edge tracking on a partner site served through a staging host, before the edge worker goes live on the production host. Walks a real guest journey in the browser and proves every tracking write in the database by session id, covering injection, the session cookie, consent, the agent surface, booking-engine passthrough, and parity with the live page. Produces a pass or fail report table with evidence. Use before a first production route, after a worker or config change, and whenever someone asks whether tracking is writing.
---

# Smoke edge tracking on a staging host

A page that loads proves nothing. Tracking is proven when the rows exist, under the right session, for the right property, with the right dates. This skill is the definition of done for putting the Kismet edge worker in front of a partner site: nothing reaches a production route on a partial pass.

Run it against the staging host from `kismet-staging-proxy-setup`. The staging host serves the partner's real pages through the same worker and the same config the production host will use, stamps every response `X-Robots-Tag: noindex`, rewrites origin links to itself, and rebinds origin cookies. This skill writes nothing: every check is a browser read, a read-only request, or a read-only query on the operator MCP (`run_readonly_sql`, `get_journey`).

## Two rules

1. **Browse and price only.** The staging host proxies the partner's live site, so a submitted booking form reaches the partner's live booking backend. Load the booking page once, by clicking the button a guest would click, and stop. If your tooling refuses a scripted load of a booking page, do not work around it: hand that one click to the person you are working for.
2. **Keep the volume small and say what it touched.** Requests to the staging host reach the partner's origin as ordinary page views, and the partner's own analytics tags run in the page. State both in the report.

## 0. Prepare

1. Record the staging host, the production domain, the collection slug the staging config reports (`window.Kismet._config` or the `c=` parameter on the k.js URL), and the booking path prefix.
2. Pick the journey: the homepage with UTM parameters, one content page, the results page, one property page with a synced serving URL, the same property with a date range at least a month out.
3. Clear cookies for the staging host, including cookies set with a `Domain` attribute. A plain delete leaves those behind and the "cold" visit silently adopts an old session. Delete with each domain variant (none, the host, the dotted host, the dotted parent).

## 1. Cold visit mints one session

Open the homepage with `?utm_source=smoke&utm_medium=lab&utm_campaign=<tag>`. Read `document.cookie`. Expected: one `_kid_sid` value, a k.js script tag whose `c=` parameter is the expected collection slug, and `window.Kismet` defined. Evidence: the session id. Carry it through every later check.

## 2. The session holds across page classes

Visit the content page, the results page, the property page and the dated property page. Expected: the same `_kid_sid` on every page and k.js present on every page. A changed id mid-journey is a fail. Evidence: the id read on each page.

## 3. Structured data where a page is mapped

On the property page run:

```js
[...document.querySelectorAll('script[type="application/ld+json"]')].map(s => {
  try { const j = JSON.parse(s.textContent); return j['@type'] || (j['@graph'] || []).map(g => g['@type']).join('+'); }
  catch (e) { return 'unparseable'; }
})
```

Expected: exactly one block, naming the rental, when the collection strips the host's own schema; an `unparseable` entry is a fail. Evidence: the array.

## 4. Parity with the live page, modulo injection

Fetch the same property page from the staging host and from the live host with the same browser user agent. Replace the staging host with the live host in the staging copy, then compare script sources and the booking engine's own markers. Expected: the only added script is k.js, none removed, engine marker counts equal. The size difference is the injected JSON-LD and the off-screen agent storefront block. Evidence: the added and removed lists and the marker counts. Anything else added or removed is a fail.

## 5. Paths that must stay untouched

Request the CMS login page, its REST root, an admin ajax call the theme makes, a theme asset, the booking engine's ajax path and an unknown path. Expected: no k.js, no `_kid_sid` `Set-Cookie`. Test the admin root with AND without its trailing slash: a bypass list that holds `/wp-admin/` can miss the exact path once the worker normalizes the slash. Evidence: one line per path.

## 6. Booking engine passthrough

On the dated property page, list network requests under the booking prefix. Expected: the engine's price request returns 200 through the staging host and the page shows a total; the engine's scripts still load from the engine's own host. Then click the book button once. Expected: the booking page loads with the property and dates in its URL, k.js present, the same session id. Do not submit. Evidence: the request line, the total shown, the booking URL.

## 7. Consent

With the consent manager's cookie set to analytics denied, request one page of EACH class (home, content, results, property). Expected on every one: no `_kid_sid` `Set-Cookie`, the page seed carries `window.Kismet._sidPending=1`, and a pre-existing `_kid_sid` carrier is not adopted. With analytics granted: the cookie is set. With no cookie at all the result depends on the collection's consent mode and the visitor's country; record which you observed and do not claim the other. The country header cannot be spoofed through Cloudflare, so a region you are not in rests on the unit tests: say so. A consent manager registered to the production domain will not render on a staging host, so set its cookie by hand in the real format.

Run these loops under `bash`. Under zsh, `${k:+-H "cookie: $k"}` does not word-split: the cookie header is silently dropped and a working gate reads as a failure.

## 8. Agent surface

Expected: `/llms.txt`, `<property>.md` and `<property>/rates.md` answer 200 as `text/markdown`; `robots.txt` carries the appended `LLMs-Txt` line; crawler and AI agent user agents (GPTBot, ClaudeBot, PerplexityBot, ChatGPT-User, Googlebot) get 200 on the page and the twin and receive NO `_kid_sid` cookie. Evidence: a status row per agent.

## 9. The writes, proven

Wait a minute, then read the journey back on the operator MCP. `timestamp` is a reserved word and must be quoted.

```sql
SELECT to_char("timestamp",'HH24:MI:SS') t, tracking_mode, action_type, resource_class,
       vacation_rental_slug, client_session_id, utm_source, utm_campaign,
       stay_check_in, stay_check_out, response_status,
       regexp_replace(page_url,'^https://[^/]+','') AS path
FROM mgr_insight_v_content_events
WHERE client_session_id = $1
ORDER BY "timestamp";
```

Expected, all under the session id from check 1:

| Row | Must show |
|---|---|
| Every human page view | one `server` row and one `client` row |
| Landing | `utm_source` and `utm_campaign` from the URL |
| Property page | `property_view` on `content_vr` with the right `vacation_rental_slug` |
| Dated property page | `stay_check_in` and `stay_check_out` |
| Book button | `cta_click` with the property slug |
| Agent requests | session-less rows, `is_bot` true, the right `bot_name` |
| Consent-denied requests | rows present, session-less |

Then `SELECT session_id, landing_url, collection_slug FROM mgr_insight_v_booking_sessions WHERE session_id = $1` and `get_journey { kid_sid }`. Expected: one booking session with the landing URL, a journey whose acquisition carries the UTM source and campaign, and the dated stay on the shortlist.

Two readings that are not failures. Price totals are not written to `content_events`; `stay_total_cents` empty is normal, and the dated columns are the signal. And before calling any zero a defect, run the same count for a collection already live on the edge worker: parity with a working site is a pass.

A book click that lands as a plain `view` is a real finding. The worker resolves the property from a page entry keyed by the engine's property id, and falls back to a same-host referer. A staging host never matches the production domain, so without those id-keyed entries the click degrades on staging always, and in production on any reload, date edit or stripped referer. Report it; the fix is in the catalog's routes, not in the page.

## 10. Report

Lead with the verdict and what could not be tested here. Then one table: check, pass or fail, evidence. Then the session id so the reader can open the journey, the side effects incurred (partner origin hits, partner analytics tags fired), and anything that needs a human click. File findings as you find them rather than at the end.

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Cold visit mints one session | | |
| 2 | Session holds across page classes | | |
| 3 | Structured data on mapped pages | | |
| 4 | Parity with the live page | | |
| 5 | Untouched paths | | |
| 6 | Booking engine passthrough | | |
| 7 | Consent, every page class | | |
| 8 | Agent surface | | |
| 9 | Writes proven by session | | |

## Reading the results

- A 5xx on a path the worker does not own is the staging origin, not the worker. Confirm who answered before blaming injection.
- Worker config is read from KV and takes up to a minute to propagate. Wait after any config change before the first probe.
- Rows land within about a minute. An empty read at ten seconds is not a failure.
- A staging pass does not prove route precedence on the production zone. That is proven by the deploy's dry run and a canary at deploy time, not by this skill.
