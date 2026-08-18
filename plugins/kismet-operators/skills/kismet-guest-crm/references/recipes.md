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
is leaking. Search for lifetime value with no recent stay, then read the top
rows one at a time:

```json
{ "filters": { "minSpendCents": 500000, "notBookedSince": true }, "sort": "spend", "limit": 15 }
```

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
