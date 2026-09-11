---
name: use-kismet-fixtures
description: Build against Kismet Fixtures and committed data while preserving a fail-closed path to live Developer API data. Use for starter templates, demos, design work, or development before credentials and content are ready.
---

# Use Kismet Fixtures

1. Set the data plane explicitly to `KISMET_DATA_MODE=fixtures`.
2. Call `get_fixture_plan` for each requested Fixture. Respect its status, dependencies, install methods, data coverage, settings, and commercial-action gaps.
3. Keep fixture payloads behind the same typed adapter used by live SDK calls.
4. Label the build non-production and do not let fixture data resemble an unlabeled live response.
5. Add a promotion gate that fails while fixture mode is enabled or required live operations lack a semantic smoke.
6. Call `validate_integration` in `fixtures` mode during development and again in `live` mode before promotion.

Do not equate the internal `kismet-elements` source repository with the public Kismet Fixtures product name.
