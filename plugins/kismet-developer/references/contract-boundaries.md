# Kismet developer contract boundaries

- Use `list_recipes` and `get_recipe` before implementation. Only an `available` recipe is an invitation to ship.
- Use `get_operation` for request, response, capability, error, pagination, and versioning details. Do not infer missing fields or operations.
- Keep Kismet API calls behind one adapter boundary. The SDK and generated contracts own wire parsing.
- `kismet_pk_` credentials are publishable and origin-bound. `kismet_sk_` credentials are server-only.
- TEST and LIVE are separate installations. Fixture mode is a third, explicit local data plane, never an environment inferred from a key string.
- A fixture is usable only to the extent its registry manifest says so. A visual mockup is not proof of an installable or commercially enabled Fixture.
- The Developer API and SDK remain the runtime source of truth. This plugin's MCP is build-time guidance and validation.
- Custom data objects are pending the #77 reference implementation and #46 contract review. Do not invent generic object CRUD.
