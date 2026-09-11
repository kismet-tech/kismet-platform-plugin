# Kismet Developer

Build branded sites and applications on Kismet's Developer API, TypeScript SDK, and Fixtures.

The plugin connects to the public, build-time Developer MCP. It can read canonical operation references, select and apply integration recipes, inspect Fixture coverage, explain stable API problems, and validate supplied source or configuration before promotion. It does not fetch guest or booking data at runtime and it never stores a Kismet credential.

## Start here

1. Use `build-kismet-site` for a new SDK site or data-plane integration.
2. Use `use-kismet-fixtures` when live credentials or content are not ready.
3. Add bounded surfaces with the semantic-search, guest-account, or sandbox-booking skills.
4. Run `validate-kismet-integration` before deployment.

The MCP recipe registry is canonical. Skills fetch recipes and operation references at use time so package guidance cannot silently drift from the shipped API.

## Install in Codex

```sh
codex plugin marketplace add kismet-tech/kismet-platform-plugin
codex plugin add kismet-developer@kismet-platform
```

Open a new task after installation and ask Codex to use Kismet Developer to
plan or validate an integration. The build-time MCP is public and read-only;
no Kismet credential is required to install or use the plugin.
