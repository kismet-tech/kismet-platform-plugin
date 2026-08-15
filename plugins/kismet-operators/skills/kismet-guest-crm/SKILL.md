---
name: kismet-guest-crm
description: Work a collection's guest CRM/CDP through the authenticated Kismet User MCP — find repeat guests, whales, and win-back candidates; read one guest's full record (addresses, trips, live audience membership); write internal team notes; and turn any search into a saved, targetable audience. Use for guest lookups, relationship questions ("who has stayed more than once?"), pre-send audience checks, and CRM note-keeping.
---

# Kismet Guest CRM

The guestbook is a CDP built on three objects: the **Person** (durable across
years), the **Trip** (a stay, bounded in time), and the **Home** (the place).
These tools read and act on that graph. Follow the shared precedence, handoff,
and approval rules in [../../references/routing-architecture.md](../../references/routing-architecture.md).

Read [references/recipes.md](references/recipes.md) for the query patterns
before improvising filters, and [references/objects.md](references/objects.md)
for what the vocabulary means (identifiers, member vs mailable, money rules)
before interpreting results.

## The tools

| Tool | What it does |
| --- | --- |
| `search_guests` | The guestbook query. Same rule grammar and same evaluator as the Audiences tab, so a count here always equals the screen. |
| `get_guest` | One person's full record: addresses, trips, stats, live audience membership, notes. |
| `add_guest_note` | Append an internal team note to a guest. |
| `list_audiences` / `preview_audience` / `save_audience` / `update_audience` | The audience family — a search becomes a durable, rolling audience by saving the same filters. |

## Workflow

1. Establish the collection (`collection_slug`).
2. Answer relationship questions with `search_guests` — see the recipes. Lead
   with the reach line (matched / mailable / ad-matchable): it tells the
   manager what the result is worth before anyone reads rows.
3. Drill into one person with `get_guest` before drafting anything addressed
   to them. Check `audiences[]` on the result: `member: true, mailable: false`
   means a campaign would skip them — surface that, never work around it.
4. To act on a search repeatedly, save it: `save_audience` with the same
   filters (rolling windows keep it evergreen). Preview → confirm, per the
   audience tools' own two-step.
5. Record what you learned with `add_guest_note` — notes are internal to the
   team, never guest-facing.

## Rules that are not optional

- **PII flows one person at a time.** `search_guests` returns names and stats,
  never emails or phones — addressability appears as counts and booleans. Full
  contact detail comes from `get_guest`, one guest per call. Do not enumerate
  `get_guest` over a search result to rebuild a contact list; if the goal is
  to reach many people, that is an audience + campaign, not a loop.
- **Member is not mailable.** A guest can match an audience rule while being
  someone a campaign would drop (unsubscribed, or auto-enrolled by booking
  and never explicitly consented). `get_guest` and the audience tools report
  both. Never present a `mailable: false` member as a send target.
- **Search counts are the audience counts.** Both run one evaluator. If a
  number here disagrees with the screen, something is wrong — say so rather
  than averaging.
- **Notes are internal.** They render on the team's guest page under your
  name. Never write anything you would not want read aloud to the team, and
  never put guest-supplied secrets (card numbers, passwords) in a note.
- **Next stay is a fact, not a forecast.** `stats.nextStay` is a real future
  booking. Do not infer or promise predicted stay timing; the predictive
  layer is deliberately out of scope.

## Email-connected agents

When this MCP is installed alongside the user's email, the intended flow for
writing to ONE guest is: `get_guest` → pick the address (prefer a `verified`
identifier) → draft in the user's email client for THEIR review and send.
Never send bulk email through the user's mailbox — that is what campaigns are
for, with consent and unsubscribe handled by the platform. After any
meaningful exchange, record the outcome with `add_guest_note`.

## Coming, not yet available

- **Trip-scoped notes** — today a note lives on the person; name the stay in
  the note text ("Aug 2026, Sunny Dunes: …").
- **Travel-party reads over MCP** — companions are visible on the guest page
  but not yet returned by `get_guest`.
