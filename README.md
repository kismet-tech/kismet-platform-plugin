# Kismet Platform Plugins

The official plugin marketplace for building on and operating
[Kismet](https://kismet.travel). It contains two deliberately separate
plugins:

- `kismet-operators` connects authenticated collection operators to Kismet.
- `kismet-developer` gives coding agents public, build-time guidance for the
  Developer API, SDK, Fixtures, and integration validation.

Both plugins work in Claude and ChatGPT / Codex.

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
- **Operating skills:**
  - `kismet-generate-demand` — diagnose inventory, traffic, conversion, and
    channel opportunities, then build a bounded cross-channel demand plan.
  - `kismet-analyze-journeys` — analyze guest journeys and booking performance.
  - `kismet-manage-catalog` — curate collections, groups, and property
    merchandising.
  - `kismet-manage-advertising` — plan and manage ad campaigns and audiences.
  - `kismet-email-insiders` — plan and operate Insiders email campaigns.
  - `kismet-manage-webhooks` — configure webhooks and outbound automations.

New skills land here automatically as Kismet ships them.

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

Skill content in this repository is published automatically from Kismet's
source repository; versions here always match what the Kismet platform serves.

## Kismet for Developers

The same marketplace also contains `kismet-developer`, a public build-time
plugin for coding agents. It connects to the Developer MCP, reads the canonical
Developer API and Fixture contracts, and supplies workflows for SDK sites,
semantic search, branded guest accounts, TEST booking, fixture-backed builds,
and pre-deployment validation. It contains no developer credential and does not
expose runtime guest data.

Install it in Codex with:

```sh
codex plugin marketplace add kismet-tech/kismet-platform-plugin
codex plugin add kismet-developer@kismet-platform
```

The Developer MCP is public and read-only. Installing this plugin does not
require a Kismet account or a Developer API credential. Credentials belong in
the application being built, never in the plugin configuration.

---

## About this repository

Skill content under `plugins/kismet-operators/skills/` is maintained in
Kismet's internal source repository and published here by an automated sync
(see the `.sync` stamp for provenance). Pull requests that edit operator skill
files directly will be overwritten by the next sync. The developer plugin is
reviewed against the canonical Developer MCP recipe and operation registry.
