# Kismet Platform Plugins

The official plugin marketplace for building on and operating
[Kismet](https://kismet.travel). It contains two deliberately separate
plugins:

- `kismet-operators` connects authenticated collection operators to Kismet.
- `kismet-developer` gives coding agents public, build-time guidance for the
  Developer API, SDK, Fixtures, and integration validation.

Both plugins work in Claude and Codex. Lovable connects directly to the same
Developer MCP because it does not install repository-backed plugin bundles.

## Kismet for Operators

Operate your Kismet portfolio from your AI assistant. Installing the operator
plugin configures the authenticated Kismet connection and adds task-ready
skills for the day-to-day jobs of running direct bookings, so you can ask for
outcomes ("fill my empty August nights") instead of driving tools one call at
a time.

## What you get

- **The Kismet connection**, configured automatically. Sign in
  with your Kismet manager account when prompted; everything is scoped to the
  collections you manage.
- **Operating skills.** The [installed skill directory](plugins/kismet-operators/skills) contains the customer workflows for demand, advertising, journey analysis, catalog, guest CRM, reporting, sender setup, webhooks and ICND pages. Sender setup verifies readiness. Customer campaign authoring depends on the operations available to the signed-in account.

## Test an operator workflow

Run the [isolated Operator evaluations](evals/operators/README.md) to see how a general-purpose chat model handles real operator questions using synthetic data. Contributors can run the deterministic checks without a model or an account.

## Install

- **claude.ai**: Settings → Directory → Plugins → **Add marketplace** →
  `kismet-tech/kismet-platform-plugin`, then install `kismet-operators`.
- **Claude Code**: `/plugin marketplace add kismet-tech/kismet-platform-plugin`,
  then `/plugin install kismet-operators@kismet-platform`.
- **ChatGPT / Codex**:
  `codex plugin marketplace add kismet-tech/kismet-platform-plugin`, then
  `codex plugin add kismet-operators@kismet-platform`. You will be prompted to
  authenticate the first time the plugin needs collection data.

## Safety model

Skills read before they propose, and preview before they write: any change to
your catalog, campaigns, or automations is shown to you first and only applied
after your explicit approval. Your credentials stay with Kismet's OAuth
sign-in — the plugin never handles passwords or API keys.

## Support

Questions or requests: [engineering@makekismet.com](mailto:engineering@makekismet.com)
· [kismet.travel](https://kismet.travel)

## Kismet for Developers

The same marketplace also contains `kismet-developer`, a public build-time
plugin for coding agents. It connects to the Developer MCP, reads the canonical
Developer API and Fixture contracts, and supplies workflows for SDK sites,
semantic search, branded guest accounts, TEST booking, fixture-backed builds,
partner-page fixture installs through the staging proxy, and pre-deployment
validation. It contains no developer credential and does not
expose runtime guest data.

### Codex

Install the full plugin from the official marketplace:

```sh
codex plugin marketplace add kismet-tech/kismet-platform-plugin
codex plugin add kismet-developer@kismet-platform
```

### Claude

In Claude, open **Customize → Plugins → Personal plugins → + → Add
marketplace**, add `https://github.com/kismet-tech/kismet-platform-plugin`,
then install **Kismet Developer**.

In Claude Code, run:

```text
/plugin marketplace add kismet-tech/kismet-platform-plugin
/plugin install kismet-developer@kismet-platform
```

### Lovable

Lovable uses the public MCP directly. Open **Connectors → Chat connectors**,
add a custom MCP server named `Kismet Developer`, and use:

```text
https://mcp.kismet.travel/developer-mcp
```

The Lovable connection includes the canonical tools, recipes, prompts, and
resources exposed by the MCP. The eleven local workflow skills bundled with the
Codex and Claude plugin are not installed in Lovable, so begin by asking the
agent to call `list_recipes` or `plan_integration`.

The Developer MCP is public and read-only. Installing this plugin does not
require a Kismet account or a Developer API credential. Credentials belong in
the application being built, never in the plugin configuration.

---

## About this repository

The public Operator package lives in `plugins/kismet-operators/`. Submit customer-facing skills and their synthetic regression cases here after the infrastructure publisher cutover. Until the upstream mirror has been retired, submit changes to mirrored skill files through the infrastructure publisher. The existing `.sync` is the provenance of the last imported release.

For a customer release, review the skills, run the Operator evals, and update the Operator version in its Claude and Codex plugin manifests and its Claude marketplace entry together. Use the reviewed public commit as the downstream pin for bundled downloads and shared internal skills. The developer plugin has its own release and guidance.
