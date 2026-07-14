---
name: kismet-manage-webhooks
description: Configure and inspect Kismet outbound webhooks, alerts, destinations, scheduled rules, and delivery history. Use for Slack, Zapier, HubSpot, generic webhook, or email integrations and collection-scoped alert automation through the authenticated User MCP.
---

# Kismet Webhook Automation

Read [references/webhooks.md](references/webhooks.md) before changing a destination or rule.
Follow the shared precedence, handoff, and approval rules in [../../references/routing-architecture.md](../../references/routing-architecture.md).

## Workflow

1. Establish collection scope.
2. Use `manage_webhooks` list operations to inspect destinations, rules, and deliveries before proposing changes.
3. Choose fixed-event real-time rules when they satisfy the need. Use scheduled SQL rules only when aggregation is required.
4. For scheduled SQL, follow the same dictionary, parameterization, PII, and allowlist boundaries as journey analytics.
5. Preview every create, update, delete, enable, or disable operation without `confirm`.
6. Present destination, event/rule, schedule, enabled state, and data exposure implications.
7. Call with `confirm: true` only after explicit approval.
8. Verify by re-listing state; never trigger a test notification unless the user asks.
