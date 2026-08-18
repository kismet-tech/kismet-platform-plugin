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

| Tool                                                                        | What it does                                                                                                                                                                                                                                                                                                                    |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `search_guests`                                                             | The guestbook query. Same rule grammar and same evaluator as the Audiences tab, so a count here always equals the screen. Every result also carries **whole-match aggregates** (repeat rate, avg stays, observed lifetime value, channel mix, booker/companion overlap) — the set-level story.                                  |
| `list_shoppers`                                                             | **Who is shopping us right now** — the demand side. Active journeys from the storefront and AI surfaces (ChatGPT, Claude) with funnel stage, estimated trip value from prices shown, homes compared, dates. Reads the same pipeline as the Guests page stage cards. Masked names; `get_guest` an identified shopper for detail. |
| `get_guest`                                                                 | One person's full record: addresses, trips, stats, live audience membership, notes.                                                                                                                                                                                                                                             |
| `add_guest_note`                                                            | Append a team note to a guest — optionally scoped to one trip (`reservation_id` from `get_guest.trips`) — with `usage`: `STAFF` (default; operations only, never a targeting input) or `MARKETING` (the author says marketing may use it). Ask before choosing MARKETING; never infer it.                                        |
| `list_audiences` / `preview_audience` / `save_audience` / `update_audience` | The audience family — a search becomes a durable, rolling audience by saving the same filters.                                                                                                                                                                                                                                  |

## Workflow

1. Establish the collection (`collection_slug`).
2. Answer relationship questions with `search_guests` — see the recipes. Lead
   with the reach line (matched / mailable / ad-matchable): it tells the
   manager what the result is worth before anyone reads rows. Then tell the
   set-level story from `aggregates` — the rows are a truncated sample; **never
   recompute repeat rate, lifetime value, or channel mix from them**.
   Answer demand questions ("who is shopping us right now?", "what is in the
   funnel this week?") with `list_shoppers` — it is the same pipeline the
   Guests page stage cards read, so its counts match the screen too.
3. Drill into one person with `get_guest` before drafting anything addressed
   to them. Check `audiences[]` on the result: `member: true, mailable: false`
   means a campaign would skip them — surface that, never work around it.
4. To act on a search repeatedly, save it: `save_audience` with the same
   filters (rolling windows keep it evergreen). Preview → confirm, per the
   audience tools' own two-step.
5. Record what you learned with `add_guest_note` — scope it to the trip when it
   is about one stay (`reservation_id`), and leave `usage` at STAFF unless the
   operator explicitly says marketing may use it. Notes are internal to the
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
- **Three kinds of value, never blended.** `list_shoppers` estimated trip value
  is basket INTENT (prices a shopper was shown); `search_guests` lifetime value
  is observed, booked RELATIONSHIP value; `stats.clv.ifReturnUsd` is a
  conditional FORWARD range ("if they return"). Label each as what it is.
- **Lapsing is the signal.** When a high-value guest reads `likelihood.modifier:
'lapsing'`, that is the first thing to surface — it is the revenue leaking.
  A `'returning_booked'` guest is a fact, not a target: serve them, don't
  market to them. See [references/objects.md](references/objects.md) § Forward
  value for the exact vocabulary.
- **The verdict is a filter.** `clvBand` (`likely` / `possible` / `low`) and
  `clvModifier` (`lapsing` / `returning_booked` / `none`) work in
  `search_guests`, `preview_audience`, `save_audience`, `update_audience`.
  `{ minSpendCents: 500000, clvModifier: ["lapsing"] }` IS the win-back
  audience — rolling by construction, scored by the same scorer as the
  guestbook chip. Add `"none"` to keep a send away from people who already
  booked; never a second model.

## Email-connected agents

When this MCP is installed alongside the user's email, the intended flow for
writing to ONE guest is: `get_guest` → pick the address (prefer a `verified`
identifier) → draft in the user's email client for THEIR review and send.
Never send bulk email through the user's mailbox — that is what campaigns are
for, with consent and unsubscribe handled by the platform. After any
meaningful exchange, record the outcome with `add_guest_note`.

## Coming, not yet available
- **Travel-party reads over MCP** — companions are visible on the guest page
  but not yet returned by `get_guest`.
