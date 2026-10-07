---
name: add-kismet-agent-discoverability
description: Put the doors to a Kismet collection where an AI agent finds them on a site built on the Kismet SDK, so the site says the same thing a Kismet-rendered page says. One resolved agent entry feeds the Muse, ChatGPT and Instinct marks beside share and save, the footer entry row, llms.txt, robots.txt, the MCP server card at /.well-known/mcp.json and the Organization node, with the briefs from the first byte. Use when an SDK site has no agent marks, when an agent that fetched the site found no way to connect, when llms.txt or robots.txt should name the collection's connector, or before a kismet check that must pass site/agent-entry.
---

# Add Kismet agent discoverability

Read the guide first: https://developers.kismet.travel/sdk/agent-discoverability/ (its Markdown twin is at the same address with `.md`). The SDK is `@kismet-tech/sdk` at the version that carries `resolveAgentEntry` (the `beta` tag from 2026-10 onward); the Kismet Next.js starter is the worked example (`src/lib/kismet/agent-entry.ts` and the files it feeds).

Every address below is decided by Kismet, never by the site. Which brief a host names for each agent, whether it is the collection's own brand brief or the shared Kismet one, comes from the connector authority. The SDK asks it once and caches the answer for the five minutes Kismet advertises.

1. **Resolve the entry where the site already fetches its data.** In the data layer, a route handler or a build step, never inside a component's render:
   ```ts
   import { resolveAgentEntry } from '@kismet-tech/sdk/server';
   const entry = await resolveAgentEntry({ host, collectionSlug, collectionName });
   ```
   `host` is the site's own host. `collectionSlug` is the collection the site is built for (the live key's collection). With sample data or no collection, the answer is `null`: print nothing for every surface below rather than a guess. Wrap it in your framework's per-request cache (React `cache`, or equivalent).
2. **The marks beside share and save**, on the property page and in the results and group toolbars:
   ```tsx
   import { AgentMarks } from '@kismet-tech/sdk/react';
   <AgentMarks kind="property" collectionSlug={entry.slug} collectionName={entry.name} briefs={entry.briefs} homeName={home.name} />
   ```
   `kind` is `property`, `collection` or `group`. `briefs={entry.briefs}` is what puts the brand briefs in the server HTML from the first byte; without it an agent that only fetches the page sees the For AI agents link instead. For a template that is not React, `agentMarksHtml` from `/server` or the served fragment; the agent-marks guide lists the four ways.
3. **The footer entry row** under the place the footer names Kismet: `<AgentEntryRow entry={entry} />` from `/react`, or `renderAgentEntryRowHtml(entry)` from `/server` for a string. Stacked, in the footer's muted colour.
4. **llms.txt and robots.txt from the entry.** Tell the site which collection it is and hand the entry to the page adapter:
   ```ts
   const site = defineSite({ name, origin, pages, collectionSlug: entry?.slug });
   const adapter = createKismetNextPageAdapter(site, { agentEntry: entry });
   // app/llms.txt/route.ts:            adapter.llmsTxt()
   // app/robots.txt/route.ts:          adapter.robots()
   // app/.well-known/mcp.json/route.ts: adapter.mcpServerCard()
   ```
   Without the adapter: `llmsTxt({ ..., agentEntry: entry })`, `aiRobots({ ..., connectorBriefUrl: entry.marks.find((m) => m.agent === 'muse')?.briefUrl ?? null })`, `mcpServerCardResponse(entry.slug)`.
5. **The card's pointer on every page**: `<link rel="mcp-server" href="/.well-known/mcp.json">` (`MCP_SERVER_LINK_TAG` from `/server`) in the document head, or the `Link` header `MCP_SERVER_LINK_HEADER`.
6. **The Organization node** needs nothing more: with `collectionSlug` on `defineSite` and the site passed to `<Kismet.Page site>` or `jsonLdForPage(page, site)`, every page's Organization carries the For AI agents page as `subjectOf`.
7. **Check it.** `npx kismet check <url> --env production` must report no `site/agent-entry` and no `site/agent-connector` finding, and a plain fetch of a property page must show the marks with brief hrefs in the server HTML.

Never:
- a block of text inside the page's main content telling a guest how to connect an assistant (it was tried on partner sites and removed);
- a link to the guest MCP endpoint (it answers POST only; print it as text in llms.txt and the card, never as an anchor);
- a brief address written by hand, or a marked endpoint (`?src=`) anywhere a page prints;
- an infra call on a component's render path;
- hidden text or an sr-only link that carries an address a person cannot see.
