---
name: add-kismet-sandbox-booking
description: Build and test Kismet request-to-book behavior safely on a TEST installation, including signed-in guest attachment and the Kismet booking Fixture boundary.
---

# Add sandbox booking

1. Fetch `sandbox-booking-request` and, for an authenticated flow, `signed-in-booking` with `get_recipe`.
2. Fetch `createVacationRentalBookingRequest` with `get_operation`.
3. Use a TEST server credential. Send stay and guest intent, never a browser-computed price as authority.
4. Preserve idempotency and the returned `SBX-` confirmation. Verify the row appears only in Developer mode.
5. Treat `SANDBOX_ONLY` as a terminal contract boundary. LIVE payment and booking use Kismet's trusted Booking Drawer and payment rails, not a reimplementation.
6. Inspect the booking Fixture with `get_fixture_plan`; do not claim a commercial action its manifest marks missing.
7. Run integration validation and the end-to-end TEST flow.
