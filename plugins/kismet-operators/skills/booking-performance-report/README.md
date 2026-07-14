# Booking Channel & Group Performance Report

**What this produces:** a designed, client-branded, paginated performance report
for a vacation-rental collection — where bookings come from (channel mix), what
drives direct (journey-linked first touch), how curated groups perform
(demand × conversion quadrants), property spotlights, and prioritized
opportunities — with tracking caveats labeled honestly so the document can be
forwarded to an owner and acted on with real money. The finished report is
published to the Kismet platform as a durable, hosted page and appears in the
collection's account dashboard under **Commerce → Reports**.

This README orients a person. The agent-facing instructions live in
[SKILL.md](SKILL.md) — that file is what the agent actually follows.

## Who this is for

- An **operator or property manager** who wants their own AI to produce the
  monthly report from their live Kismet data.
- An **agency or Kismet team member** producing the report on a client's
  behalf.
- A developer wiring up an agent that runs this on a schedule.

## Prerequisites

1. **An agent that can run skills**: Claude (web/desktop), Claude Code, or any
   client that loads skill files. ChatGPT has no user-uploadable skill
   artifact — there, the Kismet connector's tool descriptions carry a reduced
   version of this workflow.
2. **The Kismet User MCP connected**, signed in as a user with an
   **admin or member role** on the target collection. The connect link lives at
   `https://kismet.travel/account/collections/{slug}/mcp-endpoints`.
3. A working directory the agent can write to (it saves every MCP pull as
   provenance).

## Install

- **Plugin marketplace (recommended):** this skill ships in the Kismet plugin —
  install the plugin and the skill loads with it.
- **Direct download:** `GET https://api.ksmt.app/v1/public/skills` lists
  downloadable skills with per-client install steps;
  `.../booking-performance-report/download` fetches the packaged `.skill` file
  (Claude: Settings → Capabilities → Skills → upload).

## Run it

One prompt is enough:

> Build this month's booking performance report for {collection} and publish it
> to the platform.

The agent then works the cycle in [SKILL.md](SKILL.md):

| Step | What happens | Where it's specified |
|---|---|---|
| 1. Pull | Ordered MCP calls (branding, channels, groups, journeys, ads); every result saved to `pulls/` verbatim | `references/mcp-queries.md` |
| 2. Judge | Dry-run the assembler; write `judgment.json` (group types, quadrant calls, highlights) | SKILL.md step 2 |
| 3. Assemble | `scripts/assemble_report_data.py` validates and writes `report-data.js` — every number traces to a pull | SKILL.md step 3 |
| 4. Prose | Opportunities (evidence → mechanism → action), fix-first list, bottom line — written into the instance HTML | SKILL.md step 4 |
| 5. Sign | The operator's own callouts + the `preparedBy` signature | SKILL.md step 5 |
| 6. Verify | Budget lint, local render check (light mode!), optional PDF export | SKILL.md step 6 |
| 7. Publish | Flatten to one self-contained HTML file → `publish_report` MCP tool → hosted URL | SKILL.md step 7 |

## Where the report lands

`publish_report` stores the finished HTML as a durable object and returns an
**unlisted hosted URL** (the uuid in the path is the access key — shareable by
link, never enumerable, noindex). The collection's team sees it in the account
dashboard at `/account/collections/{slug}/reports`: inline viewer, notes with
@-mention tagging (tagged teammates get one digest email after the thread has
been quiet for 5 minutes), Download HTML, print-to-PDF, and copy-link. Other
agents rediscover it via `list_reports` / `get_report` (the structured data
payload rides along for context pulls).

## The platform pieces behind it

- **MCP tools:** `list_my_collections` (branding comes from here, never a guest
  surface) · `publish_report` · `list_reports` · `get_report` · `list_skills`.
- **Hosted rendering assets:** published reports can reference the shared
  Aurora runtime and theme served same-origin at
  `https://api.ksmt.app/v1/public/report-assets/` (versioned, immutable) —
  this keeps a published report at ~64KB of instance content instead of a
  ~500KB fully-inlined bundle. The fully-inlined `report.html` from
  `flatten_instance.py` remains the correct portable artifact for file
  delivery.

## Troubleshooting

- **The local preview looks washed out / invisible** — you're in a dark-mode
  browser window; the design system follows `prefers-color-scheme`. Check in a
  light-mode window. PDF export is unaffected.
- **The instance renders blank from `file://`** — it loads `report-data.js` as
  an ES module; serve the instance directory over local HTTP.
- **Group traffic reads zero** — the site's group/listing path conventions
  differ; re-run the path probe in `references/mcp-queries.md`. Zeros almost
  always mean the path filter is wrong, not dead pages.
- **Direct sources look too organic** — first-touch must come from
  `get_journey`, not referrer heuristics; AI-delivered visits arrive
  referrer-stripped.
- **`publish_report` missing on the MCP surface** — the fallback in SKILL.md
  step 7 applies: deliver the flattened `report.html` and note that platform
  hosting is pending.

## Maintaining this skill

The source of truth is `api/hotels-api-ts/skills-src/booking-performance-report/`
in `kismet-tech/kismet-infrastructure`. The plugin repositories are **mirrors**,
overwritten by the "Sync plugin marketplaces" workflow on every skills-src
change — edit the source, never the mirror. `MAINTAINERS.md` (regression
invariants, provenance) and `evals/` exist only in the source; the sync and the
`.skill` distribution build both strip them.
