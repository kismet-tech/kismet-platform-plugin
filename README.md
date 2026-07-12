# Kismet Platform MCP

The official Codex plugin for operating Kismet through the authenticated [Kismet User MCP](https://mcp.kismet.travel/user-mcp).

It packages the MCP connection with task-oriented skills for:

- generating demand across Direct, Google, ChatGPT, Meta, and owned channels
- analyzing guest journeys and booking performance
- managing catalogs and merchandising
- managing advertising and audiences
- planning and operating Insiders email
- configuring webhooks and outbound automations

## Install in Codex

Add the repository as a plugin marketplace, then install `kismet-platform` from that marketplace. Codex will prompt you to authenticate with the Kismet User MCP when a skill needs platform data.

## Channel model

The Generate Demand skill keeps booking outcome separate from acquisition source and acquisition mode. Google, ChatGPT, and Meta can each contribute organic and paid demand; a `DIRECT` reservation is not treated as proof that the acquisition source was Direct.

## Structure

- `.codex-plugin/plugin.json` — plugin manifest and presentation metadata
- `.mcp.json` — Kismet User MCP connection
- `skills/` — task-oriented operating skills
- `references/` — capability inventory and routing architecture
- `assets/` — Kismet Platform MCP brand assets

The canonical Claude-compatible Generate Demand source and packaged `.skill` file are maintained in the Kismet infrastructure repository so they can be distributed through the User MCP skills registry.
