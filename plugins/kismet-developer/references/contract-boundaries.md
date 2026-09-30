# Kismet developer contract boundaries

- Use `list_recipes` and `get_recipe` before implementation. Only an `available` recipe is an invitation to ship.
- Use `get_operation` for request, response, capability, error, pagination, and versioning details. Do not infer missing fields or operations.
- Keep Kismet API calls behind one adapter boundary. The SDK and generated contracts own wire parsing.
- `kismet_pk_` credentials are publishable and origin-bound. `kismet_sk_` credentials are server-only.
- TEST and LIVE are separate installations. Fixture mode is a third, explicit local data plane, never an environment inferred from a key string.
- A fixture is usable only to the extent its registry manifest says so. A visual mockup is not proof of an installable or commercially enabled Fixture.
- The Developer API and SDK remain the runtime source of truth. This plugin's MCP supplies build-time guidance, validation and authorized manager setup. It is not uniformly read-only; inspect each tool's permissions, environment, preview and confirmation requirements.
- Credential issuance is privileged. Establish an authorized server secret destination before issuing a once-only server credential. Never put that result into chat, source, logs, browser storage or plugin configuration.
- Kismet Checkout is the product, Agent Checkout the channel, and Agent Pay the rail. The TEST booking-request operation is not a production checkout adapter. Obtain the supported checkout contract; do not generate a replacement payment or reservation engine.
- Stripe onboarding exit or return is not evidence that payments are ready. Read authoritative account and checkout readiness separately. An existing Stripe login can be reused where onboarding supports it; do not promise that an arbitrary existing account can become the Agent Pay account.
- For a Starter Account request, follow [the launch workflow](starter-launch.md). The 1.0 release proposal is a target, not an available recipe or permission to use planned operations.
- Custom data objects are pending the #77 reference implementation and #46 contract review. Do not invent generic object CRUD.
