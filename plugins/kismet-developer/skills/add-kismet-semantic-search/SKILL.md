---
name: add-kismet-semantic-search
description: Add free-form natural-language search over Kismet bookable products. Use when building an AI-assisted search bar, ranked results, search interpretation chips, or a fixture-backed search demo.
---

# Add Kismet semantic search

1. Fetch `semantic-bookable-product-search` with `get_recipe`.
2. Fetch `searchBookableProducts` with `get_operation`.
3. Preserve API ranking and the returned interpretation, relaxation, availability, evidence, and verified-feature signals.
4. Never reinterpret the score as a probability or create a second score scale.
5. In fixture mode, call `get_fixture_plan` for the lane #54 semantic-search Fixture. Use it only when the manifest reports supported coverage. Otherwise disable the live control and label the local demonstration honestly.
6. Validate the integration and smoke exact, relaxed, locality, no-result, and availability-unchecked cases.
