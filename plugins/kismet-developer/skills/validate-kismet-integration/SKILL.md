---
name: validate-kismet-integration
description: Review a Kismet SDK or Developer API integration before deployment. Use for credential safety, fixture-to-live promotion, API operation coverage, problem handling, and conformance checks.
---

# Validate a Kismet integration

1. Identify the recipe and target data mode.
2. Call `validate_integration` with the relevant source and configuration content, never filesystem paths or secrets.
3. Resolve every error. Review warnings against SDK wrappers and generated clients, since operation names may not appear literally.
4. Use `explain_problem` for stable API codes and `search_docs` for codes without a curated explanation.
5. Confirm no server credential enters browser code, repositories, logs, build artifacts, or cache keys.
6. Confirm a live build fails closed if fixtures remain enabled.
7. Run typecheck, package tests, a current-corpus semantic smoke, and `npx kismet check <deployed-url>`.
8. Record any silent contract gap instead of coding around it.
