# Kismet Developer

Build your vacation rental website with Kismet's Developer API, TypeScript SDK, and Fixtures.

The plugin helps your coding agent build and validate a branded site. Start with
a preview, then inspect the requirements for live inventory, guest accounts and
Kismet Checkout. The deployed site uses supported APIs and trusted components;
it does not depend on keeping your builder chat open.

The Developer MCP provides public contract discovery and, for authorized Kismet
managers, scoped setup and management tools. Depending on the connection's
permissions, these include developer installations, credential lifecycle,
domains, telemetry mapping, Fixtures and CMS workflows. Some tools change
configuration or publish content. Inspect the actual capabilities and recipe
status before use, and preview and confirm changes as each tool requires.

The package contains no credentials. Runtime server secrets belong in the
authorized deployment secret store, never in chat, source or browser code.

## Proposed 1.0 experience

**Build my vacation rental website with agent checkout.**

The [1.0 release proposal](../../docs/developer-1.0-launch.md) defines the target:
a branded preview, Guesty inventory, one deployment path, guest login, telemetry,
Guestbook and supported Kismet Checkout. It includes the required **Connect your
Stripe** journey and the gates still to close. This is proposed launch scope,
not a claim that installing the current plugin completes live activation.

Kismet Checkout is the product. Agent Checkout is the channel. Agent Pay is the
payment rail enabled during setup. TEST booking requests do not activate live
checkout, and a saved payment method does not authorize spending.

## Start here

1. Use `build-kismet-site` for a new SDK site or data-plane integration.
2. Use `use-kismet-fixtures` when live credentials or content are not ready.
3. Add bounded surfaces with the semantic-search, guest-account, or sandbox-booking skills.
4. Run `validate-kismet-integration` before deployment.
5. Use `kismet-staging-proxy-setup` to stand up a staging proxy for a partner's existing site before the first fixture install.
6. Use `kismet-install-fixture-on-partner-page` to mount a fixture into a partner page with worker rules and theme CSS, then publish.
7. Use `kismet-smoke-fixture-install` to check a fixture install in the browser and produce the pass or fail report before publishing.
8. Use `kismet-smoke-edge-tracking` to walk a guest journey on the staging host and prove every tracking write by session id before the edge worker reaches a production route.

The MCP recipe registry is canonical. Skills fetch recipes and operation references at use time so package guidance cannot silently drift from the shipped API.

## Install in Codex

```sh
codex plugin marketplace add kismet-tech/kismet-platform-plugin
codex plugin add kismet-developer@kismet-platform
```

Open a new task after installation and ask Codex to use Kismet Developer to
plan or validate an integration. Discover contracts first. Sign in with your
Kismet manager account when the requested setup operation requires it.

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
resources. It does not install the plugin's ten local workflow skills, so ask
Lovable to call `list_recipes` or `plan_integration` before it starts changing
the application.
