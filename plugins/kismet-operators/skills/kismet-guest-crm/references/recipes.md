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
    "windows": [{ "kind": "none", "event": "stay", "window": { "fromDays": -365, "toDays": 0 } }],
    "notBookedSince": true
  }
}
```
(`lastStayBefore: "YYYY-MM-DD"` is the absolute-date variant — fine for a
one-off look, wrong for a saved audience, which should roll.)

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
      { "kind": "has", "event": "stay", "window": { "fromDays": 60, "toDays": 90, "yearsBack": 1 } }
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

## Reading the result

- `reach.matched` — everyone the rule matched.
- `reach.mailable` — matched AND holding a real (non-relay) email. An
  OTA-heavy guestbook has a wide matched/mailable gap: relay addresses
  (`@guest.booking.com`, `@guest.airbnb.com`) expire and are not mailable.
- `reach.adMatchable` — email or phone; the customer-list ceiling.
- Lead with these three numbers. A 500-guest match with 40 mailable is a very
  different plan from 500/450 — often the right recommendation is capture
  (WiFi splash, trip link) before campaign.

## From search to action

| Goal | Move |
| --- | --- |
| Look at one person | `get_guest` with their `guestId` |
| Email the whole set | `save_audience` (same filters) → campaign tooling |
| Keep the set fresh | rolling windows in the saved rule; never absolute dates |
| Remember something | `add_guest_note` on the person |
