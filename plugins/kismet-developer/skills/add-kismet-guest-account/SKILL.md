---
name: add-kismet-guest-account
description: Build a branded, same-origin guest sign-in and account experience with Kismet guest authentication, profile, memberships, bookings, saves, and saved-payment readiness.
---

# Add a branded guest account

1. Fetch `branded-sign-in` and the relevant account recipes with `get_recipe`.
2. Fetch every named guest operation with `get_operation`.
3. Use a same-origin BFF for challenge, verify, refresh, logout, self, and saves. The browser never holds a Kismet guest access or refresh token.
4. Reuse installation authorized origins. Preserve the named CSRF contract and switch on stable problem codes.
5. Never mint a replacement `kidSid` on an identity-authority miss, treat sign-in as marketing consent, or infer membership from authentication.
6. Use TEST installation semantics for deterministic test recipients and sandbox rows.
7. Validate the supplied routes, middleware, and client mount before promotion.
