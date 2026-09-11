---
name: build-kismet-site
description: Build or extend a branded site using the Kismet Developer API and SDK. Use for new starter sites, page-level data integrations, API adapters, or moving a fixture-backed build to live Kismet data.
---

# Build a Kismet site

Read [../../references/contract-boundaries.md](../../references/contract-boundaries.md).

1. Call `describe_capabilities` to establish the shipped surface and, when a credential is presented, its environment and positive grants.
2. Call `list_recipes` and choose the smallest available recipe that covers the requested page or behavior.
3. Call `plan_integration` with the framework and explicit `fixtures` or `live` mode.
4. Call `get_operation` for every operation in the plan before writing the adapter.
5. Keep product primitives generic. Vertical names may be aliases, but do not leak a customer's branding into SDK or Fixture contracts.
6. Implement through one server-safe adapter boundary. Keep server credentials out of client bundles.
7. Call `validate_integration` with the relevant source and configuration text.
8. Run typecheck, tests, and `npx kismet check <url>` locally.

Where the contract is silent, stop and flag the missing contract.
