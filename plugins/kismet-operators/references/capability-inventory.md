# Kismet Platform MCP capability inventory

Generated from authenticated runtime discovery on 2026-07-12. The deployed server at `https://mcp.kismet.travel/user-mcp` is the contract of record for plugin routing; repository registries are implementation evidence, not sufficient proof of the deployed surface.

## Summary

- Deployed tools: **44**
- Primary manager jobs: orient, report performance, manage catalog, stimulate demand, communicate with members, manage advertising, automate operations, configure distribution, and publish durable work.
- Default workflow: orient → inspect → analyze → propose → preview → approve → confirm → verify.
- Any write with a `confirm` argument must be called without confirmation first. Skills must never infer approval from a broad goal.

## Capability map

| Tool | Kind | Manager job | Owning skill / route | Notes |
| --- | --- | --- | --- | --- |
| `list_my_collections` | Read | Orient | Shared foundation | Establish scope, role, counts, and branding first. |
| `describe_schema` | Read | Orient | Catalog | Catalog entity model; not the analytics dictionary. |
| `get_guide` | Read | Orient | Platform guide | Load detailed mechanics only when needed. |
| `list_skills` | Read | Orient | Plugin/report routing | Discovers server-hosted skills; currently includes booking performance. |
| `list_groups` | Read | Manage catalog | Catalog | Full group inventory; large collections need summary/pagination. |
| `get_group` | Read | Manage catalog | Catalog | Group detail and member-property slugs. |
| `list_properties` | Read | Manage catalog | Catalog | Roster read; can expose duplicates/inactive listings needing audit. |
| `get_property` | Read | Manage catalog | Catalog | Property detail. |
| `search_properties` | Read | Catalog / demand | Catalog or stimulate demand | Ranked discovery and specific-date live availability/pricing. |
| `create_group` | Write | Manage catalog | Catalog | Preview → confirm; draft by default. |
| `update_group` | Write | Manage catalog | Catalog | Includes consequential publish/unpublish state. |
| `set_group_properties` | Write | Manage catalog | Catalog | Set/add/remove membership; preview exact operation. |
| `set_group_faqs` | Write | Manage catalog | Catalog | Replaces full FAQ set; entity links, not raw URLs. |
| `create_collection` | Write | Manage catalog | Advanced setup | High-impact portfolio creation; keep outside routine catalog flow. |
| `get_data_dictionary` | Read | Report performance | Traffic/performance | Required before custom SQL. |
| `view_stats` | Read | Report performance | Traffic/performance | Coverage sanity check for an insight view. |
| `profile_view` | Read | Report performance | Traffic/performance | Column distribution/profile. |
| `peek` | Read | Report performance | Traffic/performance | Small PII-safe sample. |
| `run_readonly_sql` | Read | Report performance | Traffic/performance | Argument is `query`; allowlisted, auto-scoped, PII-safe. |
| `get_journey` | Read | Report performance | Traffic/performance | De-identified journey drill-in. |
| `list_reports` | Read | Publish durable work | Reporting (#41) | Report shelf. |
| `get_report` | Read | Publish durable work | Reporting (#41) | Retrieve report metadata/data; HTML only when necessary. |
| `publish_report` | Write | Publish durable work | Reporting (#41) | Public durable artifact; explicit approval required. |
| `get_ads_attribution` | Read | Stimulate demand | Demand / advertising | Outcome-oriented channel attribution. |
| `get_ads_performance` | Read | Stimulate demand | Demand / advertising | Cross-channel performance read. |
| `get_ads_search_terms` | Read | Stimulate demand | Advertising | Google-native diagnostic. |
| `list_ad_campaigns` | Read | Manage advertising | Advertising | Google and OpenAI campaign inventory. |
| `create_ad_campaign` | Write | Manage advertising | Advertising | Google campaign creation. |
| `create_chatgpt_ad_campaign` | Write | Manage advertising | Advertising | OpenAI/ChatGPT campaign creation. |
| `update_ad_campaign` | Write | Manage advertising | Advertising | Channel-aware status, budget, and channel-specific edits. |
| `archive_ad_campaign` | Write | Manage advertising | Advertising | Consequential archival. |
| `get_chatgpt_tracked_links` | Read | Distribution / ads | Tracking or advertising | Inspect ChatGPT clickout/tracking links. |
| `list_audience_recipes` | Read | Stimulate demand | Advertising | Opt-in behavioral audience catalog. |
| `add_audience_recipe` | Write | Stimulate demand | Advertising | Dynamic audience creation; preview → confirm. |
| `create_custom_audience` | Write | Stimulate demand | Advertising | Fixed/criteria audience and optional lookalike; counts only, no PII. |
| `create_email_template` | Write | Communicate | Insiders email | Structural template; preview → confirm. |
| `create_email_campaign` | Write | Communicate | Insiders email | Constrained content and consented audience preview. |
| `send_email_campaign` | Write | Communicate | Insiders email | Separate scheduling/send approval. |
| `get_campaign_stats` | Read | Communicate | Insiders email | Prefer clicks/clicked-to-session over opens. |
| `manage_webhooks` | Mixed | Automate operations | Alerts/automation | Multi-action contract for targets, rules, tests, and deliveries. |
| `setup_tracking` | Write | Configure distribution | Tracking/attribution | Installation/configuration workflow. |
| `set_group_serving_url` | Write | Configure distribution | Tracking/attribution | Canonical group URL. |
| `set_property_serving_url` | Write | Configure distribution | Tracking/attribution | Canonical property URL. |
| `notify_kismet` | Write/open-world | Automate operations | Advanced notification route | Confirm intended recipient/effect before use. |

## Skill ownership

### Shared foundation

`list_my_collections`, `get_guide`, and `list_skills` support routing. They should not become standalone user-visible skills.

### Traffic and performance

Owns analytics orientation, safe SQL, attribution, journey drill-ins, and report handoff. It routes durable reports to the server-hosted booking-performance skill and `#41 Skills & Reports`.

### Catalog management

Owns collection/group/property reads and group/content writes. Collection creation remains an explicit advanced subflow.

### Stimulate demand

Cross-skill orchestrator. Diagnose inventory and demand first, then route to catalog merchandising, Insiders email, advertising, or tracking. Never default directly to paid spend.

### Insiders email

Owns template → campaign → schedule/send → measurement. A send requires approval distinct from content creation.

### Advertising and audiences

Owns Google/OpenAI campaign lifecycle and Meta-oriented audience tools. Channel-specific constraints remain explicit even if a future façade unifies creation.

### Alerts and automation

Owns webhook destinations, fixed and scheduled rules, delivery health, and notifications. Scheduled SQL inherits analytics safety rules.

### Tracking and attribution

Owns setup, canonical serving URLs, tracked links, and verification. It feeds traffic reporting and demand measurement.

## Runtime/repository drift

The checked main registry at `kismet-infrastructure/api/hotels-api-ts/src/user-mcp/tools/index.ts` did not enumerate the full authenticated runtime observed on 2026-07-12. The deployed surface additionally exposed:

- `create_chatgpt_ad_campaign`
- `create_collection`
- `get_chatgpt_tracked_links`
- `get_report`, `list_reports`, `publish_report`
- `list_skills`
- `notify_kismet`
- `set_group_serving_url`, `set_property_serving_url`
- `setup_tracking`

Release validation must compare deployed `tools/list` with the versioned inventory. Skill work should not assume a repository checkout and production are synchronized.

## Consolidation candidates

### High-confidence façade: inspect an analytics view

`peek`, `profile_view`, and `view_stats` describe one view at different depth. Preserve the server tools for compatibility, but expose one skill-level operation: inspect coverage → profile suspicious columns → sample rows. Consider a future `inspect_view` façade only after measuring tool-choice failures.

### High-confidence schema normalization: SQL input

`run_readonly_sql` requires `query`, while product language and some internal references say SQL. Standardize documentation and tests on `query`; optionally accept `sql` as a backward-compatible alias server-side.

### Medium-confidence façade: campaign creation

Google and ChatGPT creation are separate while list/update are channel-aware. Keep the channel implementations separate for clear schemas and guardrails, but let the advertising skill present one “create campaign” job that selects the correct tool.

### Medium-confidence consolidation: serving URL setters

Group and property setters likely share validation and confirmation behavior. A future `set_serving_url(entity_type, entity_slug, url)` could reduce surface area, provided previews remain explicit and existing tools remain compatible.

### Do not consolidate

- Group creation, group updates, membership changes, and FAQs are materially different writes with different previews.
- Email template creation, campaign creation, sending, and measurement are meaningful lifecycle stages.
- Reports list/get/publish are coherent primitives whose choice is straightforward inside the reporting skill.
- `manage_webhooks` is already over-consolidated; simplify it through the skill or split its schema, not by adding more actions.

## Advanced primitives to suppress from normal routing

- `create_collection`: only when the user explicitly wants portfolio setup.
- `run_readonly_sql`: only after dictionary/orientation and when purpose-built reads cannot answer.
- `publish_report`: only after the report artifact is complete and publication is explicitly approved.
- `notify_kismet`: only for an explicit notification workflow.
- Raw serving URL setters: normally reached through tracking/setup diagnostics.

## Release checks

1. Authenticate against the User MCP and capture `tools/list`.
2. Fail validation on unreviewed added, removed, or schema-changed tools.
3. Confirm every write tool has accurate annotations and a non-mutating preview path where applicable.
4. Run one read-only scenario per skill.
5. Run preview-only mutation scenarios and verify no state changes.
6. Verify tenant scope and PII rejection.
7. Start a new client session and confirm plugin skills and MCP tools load together.
