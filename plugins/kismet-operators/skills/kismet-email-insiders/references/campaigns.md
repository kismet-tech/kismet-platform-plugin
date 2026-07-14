# Insiders campaign contracts

- Flow: `create_email_template` → `create_email_campaign` → `send_email_campaign` → `get_campaign_stats`.
- Every write uses preview → explicit confirmation and requires ADMIN or MEMBER access.
- Audience is the collection's consented members. Auto-enrolled bookers without marketing consent are excluded server-side.
- Allowed ProseMirror blocks: `paragraph`, level 2/3 `heading`, `bulletList` / `listItem`, `propertyCard` with an in-collection property slug, and `ctaButton` with destination `STOREFRONT`.
- Text marks: bold and italic. Raw HTML, scripts, arbitrary links, and arbitrary CTA URLs are not representable.
- Omit `scheduled_at` to send on the next campaign cron tick. Describe this as effectively immediate, not synchronous.
- Sending deserves its own approval even if creation was already approved.
