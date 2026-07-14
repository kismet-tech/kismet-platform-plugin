# Catalog contracts

- Hierarchy: Collection → Group (`VRGroup`) → Property (`VacationRental`).
- Reads: `list_my_collections`, `describe_schema`, `get_guide`, `list_groups`, `get_group`, `list_properties`, `get_property`, `search_properties`.
- Writes: `create_group`, `update_group`, `set_group_properties`, `set_group_faqs`.
- Writes require an ADMIN or MEMBER role and use preview → explicit confirmation.
- `set_group_properties` supports `set`, `add`, and `remove`. State which operation is proposed.
- `set_group_faqs` replaces the full FAQ set. Preserve desired existing entries and use `PROPERTY` or `PROPERTY_GROUP` entity references by slug.
- `update_group` can change label, region, description, hero image, and publication state. Treat `publish: true` and `publish: false` as consequential actions.
- Out-of-scope identifiers must never be worked around.

Recommended creation sequence: search candidates → create draft group → curate properties → add FAQs/content → preview publication → publish after approval.
