# Kismet for Operators

Operate your [Kismet](https://kismet.travel) portfolio from your AI assistant.
This plugin works in **Claude** (claude.ai and Claude Code) and **ChatGPT /
Codex**: installing it configures the authenticated Kismet
connection and adds task-ready skills for the day-to-day jobs of running
direct bookings — so you can ask for outcomes ("fill my empty August nights")
instead of driving tools one call at a time.

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

- **claude.ai** — Settings → Directory → Plugins → **Add marketplace** →
  `kismet-tech/kismet-platform-plugin`, then install **kismet-platform**.
- **Claude Code** — `/plugin marketplace add kismet-tech/kismet-platform-plugin`,
  then `/plugin install kismet-platform@kismet`.
- **ChatGPT / Codex** — add this repository as a plugin marketplace and
  install **kismet-platform**. You'll be prompted to authenticate with the
  Kismet the first time a skill needs your data.

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
