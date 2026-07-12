# Demand activation briefs

Use one brief to hand an approved strategy into the owning execution skill. A brief is not approval to write.

## Required fields

- **Owner skill**: catalog, Insiders email, advertising, tracking, alerts, or reporting.
- **Business outcome**: the booking/demand result sought.
- **Scope**: collection, market/group/properties, guest/use case.
- **Stay window** and **measurement window**.
- **Observed evidence**: raw component metrics and live-validation state.
- **Constraint**: failed gate or opportunity bucket.
- **Proposed action**: one bounded intervention.
- **Excluded actions**: tempting actions not supported by evidence.
- **Success measures**: leading and lagging indicators.
- **Approval fields**: every value the downstream preview must make explicit.

## Catalog brief

Use for a new/improved group, membership, hero, description, FAQ, or publication action.

Approval fields: collection, group, property slugs, content changes, full FAQ replacement state, hero URL, and publish/unpublish state.

Do not request publication in the same approval as exploratory content drafting unless the server preview makes both effects explicit.

## Insiders email brief

Use when a consented known audience fits the inventory and timing.

Approval fields: collection, template, subject, content summary, property slugs, recipient count, exact schedule, and whether the action creates or sends.

Campaign creation and scheduling/send require separate approvals.

## Advertising brief

Use only after destination and measurement gates pass.

Approval fields: collection, channel, objective, destination, audience, creative/message, budget, bid where applicable, start/end dates, initial status, server clamps/caps, and success metric.

Default a new campaign to paused unless the user explicitly approves activation. Treat an audience upload as a consequential write even when no campaign starts.

## Tracking brief

Use when measurement or canonical routing is the first failed gate.

Approval fields: collection/entity, deployment type, current and proposed serving URL/configuration, affected pages, validation method, and rollback path.

## Alert brief

Use for durable monitoring after the desired signal is defined.

Approval fields: collection, event or scheduled condition, deduplication key, schedule, destination IDs, enabled state, and whether a test delivery is requested.

Prefer a fixed event over scheduled SQL when it expresses the need.

## Reporting brief

Use when the user wants a durable decision artifact rather than immediate activation.

Approval fields: collection, report period, audience, report type, branding, title/slug, included analyses, and public publication state.

Exploratory analysis is not implicit approval to publish.
