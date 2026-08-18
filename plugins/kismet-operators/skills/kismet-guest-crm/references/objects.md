# The object model — what the words mean

The CRM is built on three objects and the edges between them. Getting the
vocabulary right is what keeps an agent's claims honest, so read this before
interpreting any tool result.

## Person · Trip · Home

- **Person** — the human, durable across years. One human resolves to one
  profile; the same person may appear under several addresses (see
  identifiers, below). `search_guests` and `get_guest` operate here.
- **Trip** — one stay, bounded in time. A trip has a party: the **booker**
  (who transacted), possibly a **primary guest** (whose stay it is, when
  someone books on another's behalf), and **companions**. `get_guest.trips`
  lists the trips this person booked.
- **Home** — the place, durable across guests. Tools return the home's
  **curated name** (the title the manager publishes), which often differs
  from the PMS listing headline. Use the curated name in anything a manager
  or guest will read.

A journey (browsing session) is not a fourth object — it is behavioral record
attached to a Person, and its job is to end in a Trip.

## Identifiers — every address that reaches a person

`get_guest.identifiers` is the index of emails and phones that resolve to
this human: the address they booked with, the one they logged in with, the
one captured at the WiFi splash.

- `verified: true` means an identity provider vouched for it (they signed in
  with it). Prefer verified addresses when writing to someone.
- OTA **relay addresses** (`…@guest.booking.com`, `…@guest.airbnb.com`)
  expire and are excluded from mailable counts. A guest whose only address
  is a relay is a **capture opportunity**, not a contact.
- The index never merges two people. If two profiles share an address the
  platform flags it for review rather than guessing — so treat two similar
  rows as two people until the platform says otherwise.

## Money rules

- A guest's lifetime value counts only stays **they booked**. A companion on
  someone else's trip was present, not paying — attributing that revenue to
  them would count one booking against two people.
- Spend figures are host payout, in whole dollars on tool output (cents in
  filter inputs — `minSpendCents: 500000` is $5,000).
- `stats.nextStay` is a real future reservation. There is no predicted next
  stay anywhere in these tools; do not invent one.
- Only **paying** stays count as stays anywhere (owner blocks and maintenance
  holds sync as $0-payout reservations and are excluded from every count).

## Forward value — `stats.clv` on `get_guest`, `stats.clv` on audiences

`get_guest` may carry `stats.clv` (null when the collection's history is too
thin to say anything — say nothing). It is **not a prediction of what a guest
will spend**. It is a reading of the operator's OWN booking history for guests
like this one, in three parts:

- `likelihood` — `{ band: strong | moderate | low, modifier, label }`. The band
  is the share of guests in the same cell (same stay count, same first channel)
  who booked again within a year. `modifier: 'lapsing'` means the band was
  lowered because the last stay is over 14 months old and nothing is booked.
  `modifier: 'returning_booked'` means a future stay is on file — that is a
  **fact**, not a probability; say "returning" and stop.
- `ifReturnUsd` — `{ low, high }`: **if** this guest returns, a next-year stay
  is worth this range — the guest's OWN average stay scaled by what returning
  guests in their cell spent. Always say "if they return"; never drop the if.
- `basis` — `'collection'` (their own history) or `'portfolio'` (their sample
  was too thin, so the cross-portfolio rate was used — say so).

**There is no per-guest expected value in the payload, on purpose.** Probability
× value on one person is a floor dragged down by everyone who never returns; it
reads as an insult next to their history. Do not compute one. The set-level
expectation exists only on an **audience** (`clv.expectedNextYearCents` and the
`ifTwentyPctReturnCents` scenario) where it is honest and large — say "expected"
and "if 20% return", never "will earn".

## Audience membership — member vs mailable

`get_guest.audiences` reports, per audience, both:

- `member` — the rule matches them, by the same evaluator the Audiences
  screen and the campaign send use.
- `mailable` — a campaign to that audience would actually reach them.

They differ on purpose. A member is not mailable when they unsubscribed, or
when their enrollment came from booking alone (auto-enrollment is not
marketing consent). The `reason` field is a closed vocabulary:

| reason             | meaning                                     | what to do                                       |
| ------------------ | ------------------------------------------- | ------------------------------------------------ |
| `in_rule`          | matches, consented, reachable               | a real target                                    |
| `opted_out`        | in the audience, but a send would skip them | never present as a target; do not work around it |
| `not_in_rule`      | the rule excludes them (e.g. they rebooked) | often good news — say why                        |
| `not_consented`    | no active membership                        | capture/consent opportunity                      |
| `not_in_list`      | curated list they were never added to       | add via the audience tools if appropriate        |
| `vendor_evaluated` | pixel audience owned by the ad platform     | we cannot answer for it; don't claim either way  |

The distinction between `not_in_rule` and `opted_out` matters: "out of
Rewarming because they already rebooked" is a success story; "unsubscribed"
is a stop sign. Never collapse them.

## Notes

Notes are internal to the collection's team: they render on the guest's page
under the author's name, they are never guest-facing, and they are never
used in sends. Good notes are operational facts a PMS loses — "ground
floor only", "dog named Biscuit", "anniversary in June", "prefers text over
email". Since trip-scoped notes don't exist yet, name the stay in the text
when the fact is stay-specific.

Never put guest-supplied secrets (card numbers, government IDs, passwords)
in a note, and never paste a guest's private message wholesale — summarize
the operational fact.

## Consent posture, in one paragraph

Enrollment is consent to be _known_; marketing consent is separate and
explicit; auto-enrollment by booking is neither. Saving an audience contacts
nobody. Sends resolve consent downstream and drop non-mailable members
silently — which is why these tools surface `mailable` up front: so you stop
before the send does.
