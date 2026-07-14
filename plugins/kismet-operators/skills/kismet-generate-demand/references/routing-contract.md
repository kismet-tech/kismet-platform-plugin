# Generate Demand routing contract

Use Generate Demand only for outcome-first growth requests that may span multiple interventions. If the user already names one bounded tactic, route directly to its owning workflow.

## Precedence

- Durable designed report → reporting skill.
- Outcome-first booking/demand goal → Generate Demand.
- Catalog/group/property/content action → catalog skill.
- Traffic, source, attribution, funnel, or performance question without requested activation → traffic/performance skill.
- Member email action → Insiders email skill.
- Named paid campaign, spend, creative, bid, or audience → advertising skill.
- Organic Google/ChatGPT/Meta or Direct/unattributed question → traffic/performance; return to Generate Demand only when selecting an intervention.
- Alert/webhook → automation skill.
- Tracking/serving URL setup → tracking workflow.

Platform names do not imply paid media. Treat Google, ChatGPT, and Meta as organic or paid according to evidence and user intent.

## Safety sequence

Orient → inspect → analyze → propose → preview → approve → confirm → verify.

- Never inherit approval across a handoff.
- Bind approval to the exact server preview: collection, entities, fields, audience, destination, budget, dates, status, and server adjustments.
- Changed arguments require a new preview and approval.
- Never retry a consequential write with changed arguments silently.
- Verify durable state before proposing recovery from a partial failure.

Generate Demand normally stops at a Demand Plan and activation brief. The owning execution skill performs the preview and confirmation workflow.
