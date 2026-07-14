# Demand channel and attribution model

Model three separate dimensions:

1. **Booking outcome/channel** — where/how the reservation was completed (for example, `DIRECT`, `AIRBNB`, `VRBO`, `BOOKING_COM`, `KISMET`).
2. **Acquisition source** — what brought the guest: Direct/unattributed, Google, ChatGPT, Meta, owned/email, or another source.
3. **Acquisition mode** — organic/earned, paid, or owned.

Never treat a reservation with `channel = 'DIRECT'` as proof that its acquisition source was Direct. Google, ChatGPT, Meta, email, or another source can drive a direct booking.

## Core source × mode matrix

| Acquisition source | Organic/earned | Paid |
| --- | --- | --- |
| Direct/unattributed | Typed URL, bookmark, known return, or missing/stripped attribution | Not a paid platform; paid visits with lost identifiers may fall here incorrectly. |
| Google | Organic search/referral | Google Ads/search campaigns. |
| ChatGPT | Organic AI citation, referral, MCP/assistant discovery, or attributable clickout | ChatGPT/OpenAI Ads. |
| Meta | Organic Facebook/Instagram/social referral | Meta Ads, retargeting, and paid social. |

Keep owned/email as an additional mode/source when present rather than forcing it into Direct or organic social.

## Evidence precedence

Classify with the strongest available evidence:

1. Explicit paid identifiers and campaign attribution (click IDs, paid UTMs, provider campaign linkage).
2. Explicit source plus organic/paid medium.
3. Referrer/source labels and booking-session attribution.
4. Kismet AI-citation evidence for referrer-stripped ChatGPT journeys.
5. Direct/unattributed only when stronger evidence is absent.

Do not silently convert ambiguous rows into organic. Report unknown/unattributed separately.

## Data surfaces

- `mgr_insight_v_content_events`: `referrer`, `referrer_source`, UTMs, bot/citation evidence, human browse activity, and storefront engagement.
- `mgr_insight_v_booking_sessions`: acquisition origin/source, click IDs, campaign identifiers, landing URL, and session spine.
- `mgr_insight_v_vr_reservations`: booking outcome/channel, source labels, click IDs, revenue, and Kismet attribution linkage.
- `mgr_insight_v_quote_tokens`: organic AI/MCP exposure and clickout evidence; not a complete booking-conversion ledger.
- Paid performance tools: provider spend, impressions, clicks, conversions, and campaign state for the paid lane only.

Use provider paid metrics for paid performance. Use content/session/journey/reservation evidence for organic and Direct. Do not compare a paid-only numerator with an all-source denominator.

## Source-specific interpretation

### Direct/unattributed

Treat Direct as a residual bucket, not a strategy. It can include genuine brand/return demand plus stripped ChatGPT, Meta, email, privacy-restricted, or cross-device attribution. Check UTMs, click IDs, booking sessions, landing patterns, and AI-citation evidence before claiming “brand direct.”

### Google organic

Diagnose search/referral traffic, landing pages, property/group exposure, engagement, and direct-booking outcomes. Interventions include catalog quality, SEO/AEO, structured data, content, and destination conversion—not Google Ads budget changes.

### Google paid

Use Google campaign, search-term, spend, click, conversion, and attributed reservation evidence. Verify conversion definition and destination readiness before changing spend.

### ChatGPT organic

Include attributable assistant referrals/clickouts, MCP discovery, citation-driven journeys, and hidden-AI inference where supported. Interventions include AI-readable catalog depth, MCP coverage, structured content, citations, availability, and clickout destinations.

### ChatGPT paid

Use OpenAI/ChatGPT campaign state, creative, spend/performance, tracked links, review status, and attributable downstream outcomes. Keep separate from organic AI discovery.

### Meta organic

Use Facebook/Instagram/social referrers and organic UTMs without paid evidence. Interventions concern social content, shareability, profile/link routing, and destination fit—not audience upload or paid budget.

### Meta paid

Use paid social campaign identifiers, paid UTMs, Meta campaign metrics, audiences, retargeting, and attributed outcomes. Separate audience availability from proof that paid activation is justified.

## Reporting requirements

For channel comparisons, show at least:

- Booking outcome/channel
- Acquisition source
- Acquisition mode
- Attribution confidence/evidence
- Traffic/engagement
- Bookings/booked nights/host payout
- Spend and paid efficiency only for paid segments
- Unknown/unattributed volume

When source-mode classification is incomplete, state coverage and avoid forced allocation.
