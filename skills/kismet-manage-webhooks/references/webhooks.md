# Webhook contracts

- `manage_webhooks` is a multi-operation tool for destinations, rules, and delivery history.
- Destinations may include Slack, Zapier, HubSpot, generic webhooks, and email, subject to server-supported enums.
- Prefer fixed event rules for real-time notifications.
- Scheduled rules may use validated read-only SQL over the same allowlisted, collection-scoped, PII-safe analytics surface.
- Writes require preview → explicit confirmation and appropriate collection management access.
- Treat destination URLs and secrets as sensitive. Do not echo credentials into summaries.
- Disabling and deleting are materially different; state which is proposed.
- A successful configuration does not prove external delivery. Use delivery-list operations to diagnose failures.
