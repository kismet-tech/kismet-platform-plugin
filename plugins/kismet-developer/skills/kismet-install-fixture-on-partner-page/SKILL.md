---
name: kismet-install-fixture-on-partner-page
description: Mount a Kismet fixture (property-detail, results-page, checkout-panel, booking-cta, rate-calendar, search-bar) into a partner's existing page through worker fixture rules and theme CSS, iterate on the staging host, then publish to production. Use after the staging proxy resolves and before the smoke.
---

# Install a fixture on a partner page

A fixture rule tells the vrm-injection-worker which partner page to touch, which element on that page to anchor to, and which Kismet fixture to mount there. Rules are one set per collection with a DRAFT (served on staging) and a PUBLISHED state (served on production). CSS has one source, the collection's deployment stylesheet; the worker, the WordPress push, and the embed runtime all read it.

The write tools live on the operator MCP (the authenticated Kismet connection from the `kismet-operators` plugin), gated by a manage role on the collection. Every write is preview then confirm: call once without `confirm`, show the returned preview to the user, and call again with `confirm: true` only after they approve. The preview is the user's chance to catch a wrong anchor before it hits staging; do not skip it.

Prerequisite: `kismet-staging-proxy-setup` is done and the staging URL resolves through the worker.

## 1. Discover the anchor in the browser

1. Open the staging host at a page of the target type, for example `https://staging-<slug>.kismet.travel/listing/<nickname>` for a property page, or `/destinations/<city>` for a results page.
2. Find the element the fixture should replace or sit next to. For a property-detail body swap this is the block holding the native description, amenities, and gallery. For a results page it is the native list or grid of units.
3. Read its most specific stable class. Run in the page: `document.querySelector('<candidate>').className` and confirm `document.querySelectorAll('<candidate>').length === 1`. A selector that matches more than one element mounts once and hides the wrong one.
4. On Bubble sites the per-element classes look like `.bubble-element.Group.cmaMly` (the listing body on the Sosuite site) and `.bubble-element.Group.cmaSje0` (the destinations scroll box). Bubble keeps them stable per element within a deploy. Stability across partner deploys is unverified: a partner redesign or a re-published Bubble version can rename them, so recheck every anchor in the browser after each partner release and before every demo.
5. Note the anchor's box: `getBoundingClientRect()` width and height, and whether a parent has a fixed height or `overflow` clipping (walk `parentElement` and read `getComputedStyle(el).height` and `.overflow`). A fixed-height scroll box means the fixture needs `growAncestors`.
6. Note the partner's fixed header height if one exists (`getComputedStyle(header).position === 'fixed'`, then its height). The fixture's sticky toolbar needs that offset.

## 2. Compose the rules

One rule per page type. Shape:

```json
{
  "match": "/listing/*",
  "element": "property-detail",
  "anchor": ".bubble-element.Group.cmaMly",
  "position": "replace",
  "props": { "data-slug": "{vrSlug}", "data-collection": "{collectionSlug}" },
  "requires": ["vrSlug"],
  "width": "100%",
  "minHeight": "600px",
  "growAncestors": 3
}
```

- `match`: a path pattern, an exact path or a prefix ending in `*`, starting with `/`, only `[A-Za-z0-9/_\-.*%]`, 1 to 200 characters.
- `element`: one of the fixture element ids the worker knows: `property-detail`, `results-page`, `checkout-panel`, `booking-cta`, `rate-calendar`, `search-bar`.
- `anchor`: the CSS selector from step 1, 1 to 300 characters, no `<`, `{`, or `}`.
- `position`: `replace` for a body swap (the anchor is hidden through an injected stylesheet, not an inline style, because Bubble rewrites inline styles on every layout pass); `before` or `after` to insert next to the anchor and keep it; `prepend` or `append` to insert inside it.
- `props`: keys must start with `data-`, values are strings up to 500 characters. Placeholders the worker resolves: `{vrSlug}`, `{collectionSlug}`, `{defaultCheckIn}`, `{defaultCheckOut}`. A results page can also carry `data-all-properties-url` pointing at the partner's own listing index, for example `"/listing"`.
- `requires`: `["vrSlug"]` on property rules so a listing page without a synced route is skipped rather than mounted empty.
- `width` and `minHeight`: CSS lengths matching `^\d+(px|%|vh|rem|em)$`. The mount copies the anchor's flex slot (order, margin, min and max width, flex, align-self), so `width: "100%"` fills that slot rather than the viewport. Set `minHeight` to roughly the fixture's rendered height so the page does not jump: around `1200px` for property-detail, `900px` for results-page.
- `growAncestors`: integer 0 to 8, the number of ancestors to release from fixed height and overflow clipping. On Sosuite, `.bubble-element.Group.cmaMly` needed `3` and the fixed-height scroll box `.bubble-element.Group.cmaSje0` needed `6` before the results page could extend past the box. Start with the count you walked in step 1.5 and lower it until the page clips.
- At most 20 rules per collection.

## 3. Hide native elements with CSS, not rules

Native blocks that fight the fixture (a second map column, a duplicate booking box, a native filter bar) are hidden through `set_fixture_css`, never through a rule with no fixture behind it. The same stylesheet carries the theme tokens and layout fixes. A worked example from the Sosuite install, one string:

```css
.kismet-scope.kismet-fixture-mount{--vr-bg:transparent!important;--vr-brand-accent:#242f4e!important;--vr-accent:#242f4e!important}
.kismet-fixture-mount .kismet-property-detail{background:transparent!important}
.kismet-fixture-mount .rp-toolbar{top:60px!important}
.bubble-element.Group.cmaSgd0{display:none!important}
.bubble-element.Group.cmaPaAn{width:100%!important;max-width:none!important;flex:1 1 100%!important}
```

- Theme tokens are scoped under `.kismet-scope.kismet-fixture-mount`: `--vr-bg` (the fixture's page background; `transparent` lets the partner page show through), `--vr-brand-accent` and `--vr-accent` (buttons, links, active states) set to the partner's brand color read from their own stylesheet or from `list_my_collections` branding.
- The sticky toolbar offset: the results-page toolbar is `position: sticky; top: 0` by default. Under a fixed partner header it slides underneath, so set `.kismet-fixture-mount .rp-toolbar{top:<header height>px!important}` with the height measured in step 1.6 (60px on Sosuite).
- Hiding a native column (`.bubble-element.Group.cmaSgd0{display:none!important}` was the native map column) usually leaves its sibling at a partial width; let the sibling grow (`.bubble-element.Group.cmaPaAn` above).
- `set_fixture_css` strips every `<`, refuses `@import`, and refuses `url(` to anything other than https. Its preview returns the byte size, content hash, and the lint warning list; read the warnings before confirming.
- This stylesheet is also pushed to the collection's WordPress install and pulled by the embed runtime. Selectors that target partner-page elements are inert there, but keep the file free of anything that would break the Kismet-hosted pages.

## 4. Write the draft and iterate on staging

1. `get_fixture_status { collection_slug }` first. Note the current draft hash and count so the diff in the next preview is legible.
2. `set_fixture_rules { collection_slug, rules: [ ...all rules for the collection... ] }` without `confirm`. The preview returns the validated rules, the diff against the current draft, and the staging URL. The rules array replaces the whole draft; include every rule you want to keep.
3. Show the preview to the user. Confirm with `set_fixture_rules { collection_slug, rules, confirm: true }` only after approval. This writes the draft and syncs the staging config only; production is untouched.
4. `set_fixture_css { collection_slug, css }` without `confirm`, show byte size, hash, and warnings, then confirm. This writes the collection's deployment stylesheet and syncs staging, production, and the WordPress push targets, because CSS has one source. Say so in the preview you show.
5. Reload the staging page and look: the mount `[data-kismet-element="<element>"]` is present exactly once, the anchor is hidden (a `<style data-kismet-fixtures="hide">` exists in `head` and the anchor's computed `display` is `none`), the fixture renders at the slot width, nothing clips, the toolbar sits under the header. Take a screenshot at 1440 and at 390 wide.
6. Adjust `growAncestors`, `minHeight`, CSS, and repeat from step 2. Each iteration is a fresh preview and confirm.

## 5. Publish

1. Run `kismet-smoke-fixture-install` on the staging host and get a full pass.
2. `publish_fixtures { collection_slug }` without `confirm`. The preview is the diff between draft and published; show it to the user together with the production domains it will sync.
3. `publish_fixtures { collection_slug, confirm: true }` after approval. This copies draft to published, stamps `publishedAt`, and syncs the production domain config.
4. `get_fixture_status { collection_slug }`: draft and published hashes now match and the drift flags are clear. Report the status output.

## Done

The install is done when the draft has been approved rule by rule on staging, the smoke passes, the publish diff has been approved, and `get_fixture_status` shows draft equal to published with no drift. Record the anchors you used and the partner release they were read against, because they must be rechecked after the partner's next deploy.
