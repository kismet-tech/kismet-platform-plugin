---
name: import-kismet-site-content
description: Inventory and migrate an existing website's copy, media and page structure into Kismet CMS. Use for Bubble or WordPress migrations, source sitemaps, content-type and field mapping, redirect plans, draft imports and embedded-editor handoffs. This skill does not replace inventory synchronization or transactional application flows.
---

# Import existing site content

Read [../../references/contract-boundaries.md](../../references/contract-boundaries.md).

Fetch the canonical Developer MCP recipe with `get_recipe` using
`id: "site-content-migration"`, or read
`kismet://recipes/site-content-migration`. Read its status before acting.
Check each phase against the current deployed operations: a shipped generic
CMS draft writer does not imply support for canonical Articles or fixed-route
bindings. An unavailable recipe does not prevent the read-only inventory and
local mapping work below, but is not permission to substitute another writer.

For WordPress with authorized SSH/WP-CLI or a supplied WXR export, read
[WordPress source capture](references/wordpress-source.md). Prefer structured
source content plus rendered-page comparisons. The bundled
`scripts/wordpress_inventory.py` converts local WXR files into a private,
review-only inventory; it does not connect to a server or import into Kismet.
For Bubble or crawl-only sources, follow the generic phases below.

1. Reuse the task's existing captures and decisions. Establish source domains,
   target collection, locale, destination and content authorities. Call
   `describe_capabilities` and inspect connected tools and current operation
   references; never infer write access from the presence of this skill.
2. Follow the recipe's ordered phases: **source URL inventory → representative
   pages and content types → field dictionary and naming → target page tree,
   routes and redirects → complete capture and normalization → dry-run/pilot
   drafts → embedded editing and exact preview → authorized publication and
   output verification**. The public sitemap is generated from published
   target routes at the end. The existing sitemap is discovery evidence at
   the beginning.
3. Keep one review package with source/capture coverage, types/templates,
   fields and ownership, keep/rewrite/merge/exclude decisions, verified entity
   IDs, proposed routes, media provenance and unresolved items. Label local
   manifests as review artifacts, not public API schemas. URL-only records
   are not captured or imported content.
4. Keep editable copy in the canonical CMS contract, rendered by the site
   and edited by the authenticated manager editor. Reference catalog facts
   by ID; keep inventory, prices, membership and account flows in their
   existing systems. Do not choose a new CMS vendor as a side effect.
   Include staging-domain content preview in the contract: View published /
   Preview changes should select a pinned baseline or reviewed draft release
   in the real site renderer. Editors can save and share a scoped preview
   without changing production. Preview access and caches stay isolated;
   publication promotes the exact reviewed revisions after conflict checks.
   Content preview is separate from TEST/LIVE transaction credentials and
   requires verified authorization and delivery operations for the destination.
5. Only invoke operations actually exposed and authorized for the destination.
   `plan_integration` and `validate_integration` are not evidence of an
   executable import when this recipe is planned. Do not invent CMS methods
   or substitute owner-only legacy article writes: those can activate serving
   routes even with DRAFT status.
6. If the recipe is unavailable or authoring is unshipped, continue the source
   inventory and review package, identify the missing contract, and stop before
   CMS writes. A missing recipe must not silently fall back to a live importer.
   Once a supported authoring path exists, follow the canonical recipe for
   idempotent drafts, revision conflicts, editor preview and publication.

End with links to the review package and any actual import manifest. Separate
captured, mapped, drafted, edited and published counts. Name remaining blockers
and the next supported action; never call a sitemap inventory a migrated site.
