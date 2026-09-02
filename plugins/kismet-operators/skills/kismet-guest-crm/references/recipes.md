# Guest CRM query recipes

Every recipe is a `search_guests` call. The filter grammar is the audience rule
grammar — anything here can become a saved audience by passing the identical
`filters` to `save_audience`, and rolling windows keep it evergreen.

All filters combine with AND. Money is in cents. Rolling windows resolve
against today at every evaluation (`fromDays`/`toDays` offsets, negative =
past; `yearsBack` shifts whole years).

## Relationship questions

**Who has stayed more than once?**

```json
{ "filters": { "minStays": 2 }, "sort": "stays" }
```

**Whales — $5,000+ lifetime.**

```json
{ "filters": { "minSpendCents": 500000 }, "sort": "spend" }
```

**Best guests by per-stay value (big spenders, few stays).**

```json
{ "filters": { "minSpendCents": 200000, "spendBasis": "perStay" }, "sort": "spend" }
```

## Win-back and timing

**Lapsed: has stayed, but not in the last year.** Rolling, so it stays true
as time passes; `notBookedSince` also excludes anyone with an upcoming stay.

```json
{
    "filters": {
        "minStays": 1,
        "windows": [
            { "kind": "none", "event": "stay", "window": { "fromDays": -365, "toDays": 0 } }
        ],
        "notBookedSince": true
    }
}
```

(`lastStayBefore: "YYYY-MM-DD"` is the absolute-date variant — fine for a
one-off look, **wrong for a saved audience**: the "lapsed" horizon then grows
one day per day and the audience silently sheds everyone who lapses after save
day. Three live audiences were found frozen this way on 2026-08-17 and repaired
— `save_audience` / `update_audience` now return `warnings[]` when a DYNAMIC
rule carries a fixed date. If you see that warning, use the rolling form above
unless the operator explicitly wants a one-time cohort.)

**Rewarming — booked about a year ago, has not rebooked.** Anchor on the
BOOKING date, not the stay date; this is the grammar's own canonical pair:

```json
{
    "filters": {
        "windows": [
            { "kind": "has", "event": "booked", "window": { "fromDays": -364, "toDays": -343 } },
            { "kind": "none", "event": "booked", "window": { "fromDays": -343, "toDays": 0 } }
        ],
        "notBookedSince": true
    }
}
```

**Stayed in a season last year, hasn't rebooked (season warm-up).**

```json
{
    "filters": {
        "windows": [
            {
                "kind": "has",
                "event": "stay",
                "window": { "fromDays": 60, "toDays": 90, "yearsBack": 1 }
            }
        ],
        "notBookedSince": true
    }
}
```

## Home- and party-shaped

**Group leaders — stayed at big houses.**

```json
{ "filters": { "minBedrooms": 6 }, "sort": "spend" }
```

**Guests of one specific home** (e.g. before a renovation announcement):

```json
{ "filters": { "vrSlugs": "sunny-dunes-retreat-pool-hot-tub-golf-carts-grand-beach" } }
```

**Direct bookers only** (the relationship is already ours):

```json
{ "filters": { "channel": "DIRECT" } }
```

**OTA-acquired guests** (the displacement opportunity — they booked through
Airbnb/Vrbo/Booking.com and the win is moving them direct):

```json
{ "filters": { "channel": "AIRBNB,VRBO,BOOKING_COM", "minStays": 1 } }
```

## Demand right now — `list_shoppers`

Not a `search_guests` call: this reads active JOURNEYS, not the guestbook.

**Who is in the funnel this week?**

```json
{ "recency": "7d" }
```

**High-intent only — planning or showing intent, last 30 days.**

```json
{ "recency": "30d", "stages": ["planning", "intent"], "limit": 25 }
```

Read `stageCounts` for the funnel picture (they cover the full window even
when rows are capped), each shopper's estimated trip value as basket intent
(the prices they were shown — NOT relationship value), and `guestId` when the
shopper is identified — that is the bridge to `get_guest` and to the guestbook.
The demand story pairs with the relationship story: a guest in `list_shoppers`
AND in a `search_guests` repeat-guest match is a returning guest shopping you
right now — the highest-value moment the CDP can name.

## Forward value — the two questions marketers actually ask

**Who is worth winning back?** High observed value + lapsing is the money that
is leaking. The model's own verdict is a filter now — ask for it directly:

```json
{ "filters": { "minSpendCents": 500000, "clvModifier": ["lapsing"] }, "sort": "spend", "limit": 15 }
```

`clvModifier: ["lapsing"]` = last paying stay >14 months ago and nothing booked
(rolling by construction — nothing to drift). `clvBand: ["likely","possible","low"]`
filters on the band after that modifier. Both are scored per row by the SAME
scorer as the guestbook chip and `get_guest.stats.clv`, so a saved "Lapsing
whales" audience can never disagree with the chips on its rows. Rows the model
cannot score match no band. To make it a standing audience:

```json
{
    "name": "Lapsing whales",
    "type": "DYNAMIC",
    "filters": { "minSpendCents": 500000, "clvModifier": ["lapsing"] }
}
```

Exclude people who are already coming back from any win-back send with
`clvModifier: ["lapsing","none"]` (i.e. not `returning_booked`).

then `get_guest` on the top rows and lead with `stats.clv.likelihood` (look for
`modifier: 'lapsing'`) and `stats.clv.ifReturnUsd`. Present as: _"$36k
historic · low, lapsing (8% of guests like her rebook) · a return stay is worth
$34k–$66k."_ Nobody is re-marketing to this person today; that is the finding.

**What is this audience worth?** `list_audiences` returns per-audience
`stats.clv`: `expectedNextYearCents` (Σ over members) and
`ifTwentyPctReturnCents`. Present both, labeled: _"expected next-year value
$X · if 20% return, $Y"_ — beside the observed revenue, never blended with it.
This is how a campaign gets sized before it is sent.

**Do not** rank individual guests by a computed expected value (there isn't
one), and do not describe `ifReturnUsd` as what they will spend.

## Thin slices — timing habit + live signals

The broad recipes above find the SET; these find the MOMENT. Three predicates
make them possible: `minLeadDays`/`maxLeadDays` (how far ahead this guest
books, per qualifying stay), `shopperDays`/`shopperStages` (an active journey
now — the audience-composable form of `list_shoppers`), and
`emailEngagedDays` (opened/clicked a campaign email recently). All rolling by
construction.

**Long-lead planners whose booking window is opening.** The canonical thin
slice. A guest who books 180+ days ahead does their booking work around the
anniversary of their LAST booking — the rewarming nudge lands then, not in
spring. (Real case: a guest booked Aug 31 for the following July — 322 days of
lead, committed two weeks after checking out. His window is now, every year.)

```json
{
    "name": "Long-lead planners due to book",
    "type": "DYNAMIC",
    "filters": {
        "minLeadDays": 180,
        "windows": [
            { "kind": "has", "event": "booked", "window": { "fromDays": -420, "toDays": -300 } },
            { "kind": "none", "event": "booked", "window": { "fromDays": -300, "toDays": 0 } }
        ],
        "notBookedSince": true
    }
}
```

Read it as: books far ahead AND last booked roughly a year ago AND nothing
since AND nothing on the books. The `windows` pair times the send; the lead
band explains WHY now is the moment.

**Spontaneous bookers — the gap-fill audience.** Booked within 30 days of
check-in at least once; these are the people a last-minute-opening flash offer
actually converts. Add a season window to match the gap you are filling.

```json
{ "filters": { "maxLeadDays": 30, "minStays": 1 }, "sort": "spend" }
```

**Repeat guests shopping you RIGHT NOW.** The highest-value moment the CDP can
name, as a standing audience instead of a manual `list_shoppers` cross-check:

```json
{
    "name": "Returning guests in the funnel",
    "type": "DYNAMIC",
    "filters": { "minStays": 2, "shopperDays": 7 }
}
```

Narrow to serious shoppers with `"shopperStages": ["planning", "intent"]`.
An identified shopper with stay history is warm on BOTH axes — mention the
homes they have stayed in, not a generic pitch.

**Warm but not booked.** Opened or clicked a campaign email in the last two
weeks and still has nothing on the books — the follow-up audience, and the
honest measure of whether a campaign moved anyone:

```json
{ "filters": { "emailEngagedDays": 14, "notBookedSince": true } }
```

**Composing the axes** is the point. "Lapsing whales who opened the win-back
email but still haven't booked" is one rule:
`{ "minSpendCents": 500000, "clvModifier": ["lapsing"], "emailEngagedDays": 14, "notBookedSince": true }`
— value × model verdict × live signal × timing, each predicate from a
different part of the grammar, all AND.

## An audience is a set of rules — build with PARTS

Think of every audience as a stack of small, legible rules ANDed together.
The job most thin slices exist for: **when someone ENTERS the audience,
something happens** (a perk drops into their account, an email lands) to fill
specific dates. Design the rule so entry IS the moment.

**Always decompose into named `parts`** when a rule has more than one idea.
Each part carries a `name` and a `description` YOU write in clear language a
marketer understands — the description becomes the hover card on the
audience chip, and the operator toggles each part on/off without touching
the others. One flat filter blob is a black box; three named parts are a
story:

```json
{
    "name": "New Year's regulars worth a nudge",
    "type": "DYNAMIC",
    "parts": [
        {
            "name": "Stayed over New Year's",
            "description": "Their paying stay covered the New Year holiday week last season.",
            "filters": {
                "windows": [
                    {
                        "kind": "has",
                        "event": "stay",
                        "window": { "from": "2025-12-26", "to": "2026-01-04" }
                    }
                ]
            }
        },
        {
            "name": "In their booking window",
            "description": "They booked that trip roughly this week last year, so this is when they decide. Rolls weekly - a fresh cohort enters every week.",
            "filters": {
                "windows": [
                    {
                        "kind": "has",
                        "event": "booked",
                        "window": { "fromDays": -378, "toDays": -364 }
                    }
                ]
            }
        },
        {
            "name": "Not rebooked yet",
            "description": "Nothing booked since, and nothing on the books - the nudge still has a job to do.",
            "filters": { "notBookedSince": true }
        }
    ]
}
```

Rules for parts: 2-4 small parts beat one big one; every description is 1-3
plain sentences (what it matches, why it is here) with NO counts (they go
stale — the surface shows live numbers); `preview_audience`/`save_audience`
report each part's standalone `matchedAlone` count next to the combined
match, so you can tell the operator which part does the narrowing. Toggle
without resending: `update_audience` with `toggle_parts: {"p2": false}`
parks a part (kept in the rule, skipped at evaluation — never delete a part
to disable it). One caution: parts intersect as SEPARATE evaluations, so
two parts may be satisfied by different reservations; keep criteria that
must hold on the SAME stay inside one part (or one windows clause with
`match`/`booked`).

**Personal booking-anniversary (the New Year's pattern).** A `stay` clause
can carry a second `booked` window on the SAME reservation. Fixed stay dates

- a rolling booked window = each week, exactly the guests who booked that
  week last year enter the audience — so an always-on send reaches every guest
  in their own booking week. Shift the offsets back a week to be proactive:

```json
{
    "name": "New Year's 2026 — book-your-week nudge",
    "type": "DYNAMIC",
    "filters": {
        "windows": [
            {
                "kind": "has",
                "event": "stay",
                "window": { "from": "2025-12-26", "to": "2026-01-04" },
                "booked": { "fromDays": -378, "toDays": -364 }
            },
            { "kind": "none", "event": "booked", "window": { "fromDays": -364, "toDays": 0 } }
        ],
        "notBookedSince": true
    }
}
```

Read it as: stayed over New Year's last season, AND that stay was booked
roughly this week last year (minus one week, to fire early), AND nothing
booked since. Membership rolls weekly; nobody gets the send twice because
they exit the window as it moves.

## Custom filters — the SQL escape hatch

When the grammar cannot say the slice, create a named, DESCRIBED, SQL-backed
rule with `create_custom_filter` and reference it from any audience via
`filters.customFilterIds`. Rules of the road:

- **Grammar first.** Check the fields and `windows` clauses above before
  writing SQL; check `list_custom_filters` before writing a duplicate.
- **Description is the product.** It renders on the audience chip; write 1-3
  sentences an operator understands. No counts (they go stale).
- The SQL is ONE `SELECT`/`WITH` returning `guest_id` (vr_guests.id), scoped
  by `$1` (collection id), and mirrors the qualifying-stay hygiene
  (`status IN ('confirmed','checked_in','checked_out') AND
host_payout_cents > 0 AND NOT is_sandbox`) unless the rule deliberately
  reads other rows. It executes read-only with a timeout and can only NARROW
  the audience — the evaluator intersects its matches with the other rules.

Example — "families who stayed over a school holiday with children in the
party":

```json
{
    "name": "School-holiday families",
    "description": "Guests whose paying stay overlapped a school-holiday week and whose party included children — the audience for next year's holiday pre-open.",
    "sql": "SELECT DISTINCT g.id AS guest_id FROM vr_guests g JOIN vr_reservations r ON r.guest_id = g.id WHERE g.collection_id = $1::uuid AND r.status IN ('confirmed','checked_in','checked_out') AND r.host_payout_cents > 0 AND NOT r.is_sandbox AND r.children_count > 0 AND (r.check_in, r.check_out) OVERLAPS (DATE '2026-02-14', DATE '2026-02-22')"
}
```

## Reading the result

- `aggregates` — computed over EVERY matched guest, server-side. Rows are a
  truncated sample (`limit`), so set-level numbers (repeat rate, avg stays,
  observed lifetime value, channel mix, booker/companion overlap) come from
  here and never from re-adding the rows.
- `reach.matched` — everyone the rule matched.
- `reach.mailable` — matched AND holding a real (non-relay) email. An
  OTA-heavy guestbook has a wide matched/mailable gap: relay addresses
  (`@guest.booking.com`, `@guest.airbnb.com`) expire and are not mailable.
- `reach.adMatchable` — email or phone; the customer-list ceiling.
- Lead with these three numbers. A 500-guest match with 40 mailable is a very
  different plan from 500/450 — often the right recommendation is capture
  (WiFi splash, trip link) before campaign.

## From search to action

| Goal                | Move                                                    |
| ------------------- | ------------------------------------------------------- |
| Look at one person  | `get_guest` with their `guestId`                        |
| Email the whole set | `save_audience` (same filters) → campaign tooling       |
| Keep the set fresh  | rolling windows in the saved rule; never absolute dates |
| Remember something  | `add_guest_note` on the person                          |
