# Demand diagnostic queries

Use these as patterns after calling `get_data_dictionary`. Resolve the requested collection UUID with `list_my_collections`. Use positional parameters for all values.

Before a source comparison, read `channel-attribution.md`. Do not equate reservation `channel = 'DIRECT'` with Direct acquisition.

## Verify collection roster

```sql
SELECT count(*)::int AS roster_rows,
       count(DISTINCT vacation_rental_slug)::int AS distinct_slugs
FROM mgr_insight_v_vacation_rentals
WHERE collection_id = $1::uuid
```

If the counts differ, deduplicate the roster by slug before joining. Do not rely on global auto-scope to select a collection.

## Property opportunity spine

Parameters: `$1` collection UUID, `$2` stay-window start, `$3` stay-window end, `$4` analysis-window start.

```sql
WITH roster AS (
  SELECT vacation_rental_slug, vr_name, city, region, bedrooms,
         status, active_rates_vendor, rates_sync_status
  FROM mgr_insight_v_vacation_rentals
  WHERE collection_id = $1::uuid
), booked AS (
  SELECT vacation_rental_slug,
         count(*) FILTER (
           WHERE status IN ('confirmed','converted','closed')
         )::int AS bookings,
         COALESCE(sum(nights_count) FILTER (
           WHERE status IN ('confirmed','converted','closed')
         ), 0)::int AS booked_nights,
         COALESCE(sum(host_payout_cents) FILTER (
           WHERE status IN ('confirmed','converted','closed')
             AND NOT is_owner_stay
         ), 0)::bigint AS payout_cents
  FROM mgr_insight_v_vr_reservations
  WHERE collection_id = $1::uuid
    AND check_in < $3::date
    AND check_out > $2::date
  GROUP BY vacation_rental_slug
), traffic AS (
  SELECT vacation_rental_slug,
         count(*) FILTER (WHERE action_type = 'property_view')::int AS property_views,
         count(*) FILTER (WHERE action_type = 'cta_click')::int AS cta_clicks,
         count(*) FILTER (WHERE action_type = 'add_to_wishlist')::int AS wishlists,
         count(*) FILTER (WHERE action_type = 'availability_miss')::int AS availability_misses
  FROM mgr_insight_v_content_events
  WHERE collection_slug = $5
    AND is_bot = false
    AND timestamp >= $4::timestamptz
  GROUP BY vacation_rental_slug
)
SELECT r.*,
       COALESCE(b.bookings, 0) AS bookings,
       COALESCE(b.booked_nights, 0) AS booked_nights,
       COALESCE(b.payout_cents, 0) AS payout_cents,
       COALESCE(t.property_views, 0) AS property_views,
       COALESCE(t.cta_clicks, 0) AS cta_clicks,
       COALESCE(t.wishlists, 0) AS wishlists,
       COALESCE(t.availability_misses, 0) AS availability_misses
FROM roster r
LEFT JOIN booked b USING (vacation_rental_slug)
LEFT JOIN traffic t USING (vacation_rental_slug)
ORDER BY booked_nights, property_views DESC
```

`mgr_insight_v_content_events` uses `collection_slug`, while roster/reservation views expose `collection_id`. Bind both from the selected `list_my_collections` record.

## Interpretation

- Filter promotional candidates to active listings with a live rates vendor and healthy sync.
- Treat booked nights as a demand/occupancy proxy, not true availability.
- Use recent human property views, CTA clicks, wishlists, and availability misses as component signals.
- Validate named candidates with `search_properties({ collection_slug, locality/region, dateWindows: [{ checkIn, checkOut }] })` before recommending promotion. Because the tool cannot filter by exact slug, only mark candidates returned by the ranked search as validated.
- Compare like with like by market, capacity, property type, and period when possible.

## Acquisition evidence inventory

Inspect source/mode evidence before aggregating it into named channels:

```sql
SELECT referrer_source, utm_source, utm_medium,
       count(*)::int AS events,
       count(DISTINCT client_session_id)::int AS sessions
FROM mgr_insight_v_content_events
WHERE collection_slug = $1
  AND is_bot = false
  AND timestamp >= $2::timestamptz
GROUP BY referrer_source, utm_source, utm_medium
ORDER BY sessions DESC
```

Keep null/unknown rows visible. Then use booking sessions and reservations to inspect click IDs, source labels, booking outcome channel, and revenue. Apply explicit paid evidence before referrer inference, and use Direct only as the fallback bucket.
