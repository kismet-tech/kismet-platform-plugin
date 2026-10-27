# Catalog contracts

- Hierarchy: Collection → Group (`VRGroup`) → Property (`VacationRental`).
- Reads: `list_my_collections`, `describe_schema`, `get_guide`, `list_groups`, `get_group`, `list_properties`, `get_property`, `search_properties`.
- Writes: `create_group`, `update_group`, `set_group_properties`, `set_group_faqs`.
- Partner-page fixtures (Kismet fixtures mounted by the edge worker into a client-rendered partner site): `set_fixture_rules` (draft, shows on `staging-<slug>.kismet.travel`), `set_fixture_css` (the one Elements stylesheet, live on every consumer), `publish_fixtures` (draft to production), `get_fixture_status` (read). Same preview then confirm pattern.
- Writes require an ADMIN or MEMBER role and use preview → explicit confirmation.
- `set_group_properties` supports `set`, `add`, and `remove`. State which operation is proposed.
- `set_group_faqs` replaces the full FAQ set. Preserve desired existing entries and use `PROPERTY` or `PROPERTY_GROUP` entity references by slug.
- `update_group` can change label, region, description, hero image, and publication state. Treat `publish: true` and `publish: false` as consequential actions.
- Out-of-scope identifiers must never be worked around.

Recommended creation sequence: search candidates → create draft group → curate properties → add FAQs/content → preview publication → publish after approval.
