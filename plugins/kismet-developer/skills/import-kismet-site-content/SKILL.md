---
name: import-kismet-site-content
description: Inventory and migrate an existing website's copy, media and page structure into Kismet CMS. Use for Bubble or WordPress migrations, source sitemaps, content-type and field mapping, redirect plans, draft imports and embedded-editor handoffs. This skill does not replace inventory synchronization or transactional application flows.
---

# Import existing site content

Read [../../references/contract-boundaries.md](../../references/contract-boundaries.md).

Fetch the canonical Developer MCP recipe with `get_recipe` using
`id: "site-content-migration"`, or read
`kismet://recipes/site-content-migration`. Read its status before acting.
The full draft-import/editor workflow is **planned** until its authoring
operations ship. This does not prevent the read-only inventory and local
mapping work below.

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
