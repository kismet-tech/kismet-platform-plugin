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

## Install in Claude

In Claude, open **Customize → Plugins → Personal plugins → + → Add
marketplace**, add `https://github.com/kismet-tech/kismet-platform-plugin`,
then install **Kismet Developer**.

In Claude Code, run:

```text
/plugin marketplace add kismet-tech/kismet-platform-plugin
/plugin install kismet-developer@kismet-platform
```

Open a new conversation after installation so Claude loads the plugin skills
and the Kismet Developer MCP.

## Connect from Lovable

Lovable connects to the Developer MCP rather than installing the repository
plugin. Open **Connectors → Chat connectors**, add a custom MCP server named
`Kismet Developer`, and enter:

```text
https://mcp.kismet.travel/developer-mcp
```

The connection provides the canonical MCP tools, recipes, prompts, and
resources. It does not install the plugin's six local workflow skills, so ask
Lovable to call `list_recipes` or `plan_integration` before it starts changing
the application.
