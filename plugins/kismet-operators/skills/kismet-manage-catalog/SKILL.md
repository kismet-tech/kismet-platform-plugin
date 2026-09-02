---
name: kismet-manage-catalog
description: Manage Kismet Platform collections, property groups, properties, FAQs, SEO content, and publishing. Use for catalog audits, property discovery, creating or curating group landing pages, updating group content, editing a collection's own identity and branding (name, logo, square logo, brand colors, public contact, HQ address), or publishing and unpublishing Kismet groups through the authenticated User MCP.
---

# Kismet Catalog Management

Use the Kismet User MCP as the source of truth. Read [references/workflow.md](references/workflow.md) before a catalog write.
Follow the shared precedence, handoff, and approval rules in [../../references/routing-architecture.md](../../references/routing-architecture.md).

## Workflow

1. Call `list_my_collections` to establish the user's accessible scope and role.
2. Use `describe_schema` when object relationships are unclear; use `get_guide` with `managing-your-catalog` for detailed platform guidance.
3. Inspect current state with `list_groups`, `get_group`, `list_properties`, and `get_property`.
4. Use `search_properties` to rank candidates before proposing group membership.
5. Explain the proposed change, including collection, group, affected properties, publication state, and SEO/content implications.
6. Call the relevant write tool without `confirm` and present its preview.
7. Call again with `confirm: true` only after the user explicitly approves that preview.
8. Report the result and return `manageUrl` when available.

## Collection branding

The collection's own identity — name, description, website, logo, square logo, brand colors, public contact, managing entity, HQ address — is edited with `update_collection` (same preview-then-confirm rule as above). `create_collection` is create-only: it returns an existing collection unchanged and never overwrites its fields, so it is never the tool for a branding change.

Pass only the fields that change; an empty string clears one; `address` replaces the stored HQ address wholesale. The slug and the collection's canonical `url` are not editable — route those to Kismet.

Never substitute raw URLs for FAQ entity links. Never publish as a side effect of an unrelated edit.
