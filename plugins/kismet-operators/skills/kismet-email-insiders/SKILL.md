---
name: kismet-email-insiders
description: Plan, author, preview, schedule, and measure Kismet Insiders consented-member email campaigns. Use for email templates, campaign copy, property-card newsletters, audience previews, scheduling, and campaign statistics through the authenticated User MCP.
---

# Kismet Insiders Email

Read [references/campaigns.md](references/campaigns.md) before authoring campaign content.
Follow the shared precedence, handoff, and approval rules in [../../references/routing-architecture.md](../../references/routing-architecture.md).

## Workflow

1. Establish the collection and retrieve `get_guide` topic `insiders-campaigns` when detailed product behavior is needed.
2. Inspect valid property slugs before including property cards.
3. Draft the subject and constrained ProseMirror document; never insert raw HTML or arbitrary URLs.
4. Preview `create_email_template` if a reusable template is needed, then confirm only after approval.
5. Preview `create_email_campaign`; show rendered intent, recipient count, subject, and scheduling state.
6. Confirm campaign creation only after approval.
7. Preview `send_email_campaign`, including exact send time and recipient count. Confirm only after separate explicit approval.
8. Use `get_campaign_stats` to measure results; prioritize clicks and clicked-to-session over opens.

Never treat known auto-enrolled bookers as marketing-consented members.
