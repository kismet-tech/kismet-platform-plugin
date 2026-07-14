// ============================================================================
// BOOKING CHANNEL & GROUP PERFORMANCE REPORT — DATA
// ----------------------------------------------------------------------------
// This is the SINGLE SOURCE OF TRUTH for every number in the report.
// ⚠️ TEMPLATE COPY — the values below are a SYNTHETIC EXAMPLE for a fictional
// collection, present only so the template renders in preview. Replace EVERY
// value from a live MCP pull before sharing anything (see SKILL.md and
// references/data-mapping.md). Real runs: copy template/ to
// {collection-slug}-{YYYY-MM}/ and fill there.
//
// Conventions:
//   payout      = host payout in whole US dollars (no separators)
//   share       = percent of the column total (already computed)
//   Groups: demand & conversion are DERIVED at render time from
//           sessions / members / bookings — you only maintain the raw counts.
// ============================================================================

export const data = {
  meta: {
    client: "",                       // ← client display name (blank = placeholder in report)
    site: "example-vacation-co.com",
    logoUrl: "",                      // ← _widgetConfig.logoUrl; renders frameless at its own aspect. Empty = dashed preview slot (never deliver); no logo → flags.logo:false
    period: "30-day window · confirmed bookings only",
    periodShort: "Last 30 days",
    generated: "Month 20XX",
    // Signature line — the operator and the agent sign the report at creation
    // (SKILL.md step 5), e.g. "Jordan Ellis · Example Vacation Co, with Claude".
    // Unattended runs sign as the agent for the team. Never ship a tool default.
    preparedBy: "",
    // Report publishing (SKILL.md step 7): publish_report(title, slug, description,
    // html) hosts the flattened report and returns its URL — put it here and the
    // footer hyperlinks the name. Not published yet → leave reportUrl "".
    reportName: "",                   // e.g. "Booking performance — July 2026"
    reportUrl: "",
    // Deep link to the collection's MCP page on the account route — renders the
    // "Install Kismet User MCP" viewer CTA at the end of the report. Set it at
    // Phase 0: https://kismet.travel/account/collections/{slug}/mcp-endpoints
    // (publish_report also returns it as mcpInstallUrl). Empty = CTA hidden.
    mcpInstallUrl: "",
  },

  // ── Headline stat callouts (top of report) ────────────────────────────────
  headlineStats: [
    { value: "$100,000", label: "Total host payout", context: "Across 100 confirmed bookings, all channels" },
    { value: "40%", label: "Direct share of payout", context: "Example context line — replace from live pull" },
    { value: "20%", label: "Linked direct via AI assistants", context: "Example — replace from get_journey_sources", tag: "Emerging channel" },
    { value: "50%", label: "Direct bookings journey-linked", context: "Example — linked-coverage rate; below ~50% every source figure is a floor", tag: "Fix first" },
  ],

  // ── Where bookings come from — by channel ─────────────────────────────────
  channels: [
    { name: "Direct",       bookings: 40, payout: 40000, share: 40 },
    { name: "Vrbo",         bookings: 30, payout: 30000, share: 30 },
    { name: "Airbnb",       bookings: 25, payout: 25000, share: 25 },
    { name: "Booking.com",  bookings: 3,  payout: 3000,  share: 3 },
    { name: "Other",        bookings: 2,  payout: 2000,  share: 2 },
  ],

  // ── Direct bookings, first-touch source (journey-linked only) ─────────────
  directLinked: 20,
  directTotal: 40,
  directSources: [
    { source: "Referral",                     bookings: 10, payout: 10000 },
    { source: "AI assistant (ChatGPT)",        bookings: 4,  payout: 8000 },
    { source: "Typed-in direct",               bookings: 4,  payout: 4000 },
    { source: "Organic Google",                bookings: 1,  payout: 1000 },
    { source: "Kismet storefront (referral)",  bookings: 1,  payout: 1000 },
  ],

  // ── Group performance ─────────────────────────────────────────────────────
  // type: "region" (captures existing search intent) | "theme" (creates demand)
  // quadrant: "expand" | "fix" | "fuel" | "hold" | "baseline"
  // Include groups with >= 4-5 bookings (plus high-traffic outliers, labeled);
  // summarise the long tail below.
  groupMedians: { sessionsPerHome: 300, conversionPer1k: 3.0 },
  groups: [
    { name: "All Properties",  type: "region", members: 50, sessions: 15000, bookings: 40, payout: 40000, quadrant: "baseline", note: "Baseline — it's ~the whole portfolio" },
    { name: "Theme A",         type: "theme",  members: 20, sessions: 7000,  bookings: 20, payout: 25000, quadrant: "expand",   note: "Example expand-quadrant group", highlight: true },
    { name: "Theme B",         type: "theme",  members: 15, sessions: 6000,  bookings: 10, payout: 12000, quadrant: "fix",      note: "Example fix-quadrant group (high demand, low conversion)", highlight: true },
    { name: "Town A",          type: "region", members: 12, sessions: 3000,  bookings: 12, payout: 10000, quadrant: "fuel",     note: "Example fuel-quadrant group (proven conversion, thin traffic)", highlight: true },
    { name: "Theme C",         type: "theme",  members: 8,  sessions: 2400,  bookings: 6,  payout: 6000,  quadrant: "hold",     note: "Example hold-quadrant group" },
  ],

  // ── Long tail / hygiene notes ─────────────────────────────────────────────
  longTail: {
    pageCount: 10,
    towns: "Town B, Town C, Town D",
    note: "~10 town pages with 0–3 bookings each — samples too small to rank. Replace from live pull.",
    ungrouped: "No ungrouped properties — good hygiene.",
    outlier: { name: "Town E", bookings: 3, payout: 9000, note: "Example single-home outlier page." },
  },

  // ── Property spotlights ───────────────────────────────────────────────────
  // 2-4 individual homes whose stories the group numbers hide. imageUrl from
  // get_property; eyebrow names the story (Top direct earner / Premium outlier /
  // Traffic, no conversion / Dark horse); fact = one candid, quantified sentence.
  spotlights: [
    { name: "Example Estate", eyebrow: "Top direct earner", stats: "$40,000 direct · 4 bookings · $10.0k/bk",
      imageUrl: "", fact: "Example. One home carrying a fifth of direct payout — say what that means for where effort goes next." },
    { name: "Example Cottage", eyebrow: "Traffic, no conversion", stats: "600 views · 0 direct bookings · 30 days",
      imageUrl: "", fact: "Example. The most-viewed home with zero direct bookings — name the audit (rates, min-stays) before paid traffic." },
  ],

  // ── Element-suppression flags ─────────────────────────────────────────────
  // Optional blocks render unless set to false here (omit the object entirely
  // to show everything): spotlights = the Property-spotlights section, opp5 =
  // Opportunity 5 + its TrendBox, logo = masthead logo, outlier = the long-tail
  // single-home outlier line.
  flags: { spotlights: true, opp5: true, logo: true, outlier: true },

  // ── Trend / signal boxes ──────────────────────────────────────────────────
  // status: "positive" | "watch" | "risk"   direction: "up" | "down" | "flat"
  // ⚠️ Labels are lookup keys — keep them EXACTLY as below.
  trends: [
    {
      label: "AI assistants",
      status: "positive", direction: "up",
      value: "20%", unit: "of linked direct",
      note: "Example. Include: share of linked direct, payout multiple vs referral, properties cited by AI crawlers, and the INFERRED pre-booking-exposure upper bound labeled 'inferred — not attribution'.",
    },
    {
      label: "Organic Google",
      status: "risk", direction: "down",
      value: "1", unit: "linked booking",
      note: "Example. Linked organic is almost always a floor — say so, then point at the headroom (paid search + SEO on group pages).",
    },
    {
      label: "Quote pressure",
      status: "watch", direction: "up",
      value: "60%", unit: "target next 60 days",
      note: "Example. Source from checkout-intent sessions by target check-in month; name far-out months with real counts. Small samples stay humble.",
    },
    {
      label: "Checkout-intent capture",
      status: "risk", direction: "flat",
      value: "N", unit: "intents / M sessions",
      note: "Example. Compare intent sessions to human sessions; if capture is degraded or recently fixed, say which and when to re-check.",
    },
  ],
};

if (typeof window !== "undefined") window.ReportData = data;
