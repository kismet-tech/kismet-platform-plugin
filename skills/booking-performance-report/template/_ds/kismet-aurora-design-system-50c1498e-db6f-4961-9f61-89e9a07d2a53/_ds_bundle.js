/* @ds-bundle: {"format":4,"namespace":"KismetAuroraDesignSystem_50c149","components":[{"name":"CtaBanner","sourcePath":"components/blocks/CtaBanner.jsx"},{"name":"FeatureGrid","sourcePath":"components/blocks/FeatureGrid.jsx"},{"name":"Hero","sourcePath":"components/blocks/Hero.jsx"},{"name":"PressWall","sourcePath":"components/blocks/PressWall.jsx"},{"name":"Quote","sourcePath":"components/blocks/Quote.jsx"},{"name":"SiteFooter","sourcePath":"components/blocks/SiteFooter.jsx"},{"name":"StatBand","sourcePath":"components/blocks/StatBand.jsx"},{"name":"BarChart","sourcePath":"components/charts/BarChart.jsx"},{"name":"AURORA_STOPS","sourcePath":"components/charts/BarChart.jsx"},{"name":"LineChart","sourcePath":"components/charts/LineChart.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"Headline","sourcePath":"components/core/Headline.jsx"},{"name":"Section","sourcePath":"components/core/Section.jsx"},{"name":"Subhead","sourcePath":"components/core/Subhead.jsx"},{"name":"Wordmark","sourcePath":"components/core/Wordmark.jsx"},{"name":"BigStatSlide","sourcePath":"components/deck/BigStatSlide.jsx"},{"name":"BulletsSlide","sourcePath":"components/deck/BulletsSlide.jsx"},{"name":"ChartSlide","sourcePath":"components/deck/ChartSlide.jsx"},{"name":"CompareSlide","sourcePath":"components/deck/CompareSlide.jsx"},{"name":"DividerSlide","sourcePath":"components/deck/DividerSlide.jsx"},{"name":"QuoteSlide","sourcePath":"components/deck/QuoteSlide.jsx"},{"name":"TitleSlide","sourcePath":"components/deck/TitleSlide.jsx"},{"name":"SFoot","sourcePath":"components/deck/TitleSlide.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"EmailCapture","sourcePath":"components/forms/EmailCapture.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"GlobalHeader","sourcePath":"components/header/GlobalHeader.jsx"},{"name":"KnockoutWindow","sourcePath":"components/signature/KnockoutWindow.jsx"}],"sourceHashes":{"components/blocks/CtaBanner.jsx":"da3c52d4a57f","components/blocks/FeatureGrid.jsx":"ab8266bd672f","components/blocks/Hero.jsx":"9684d7892a10","components/blocks/PressWall.jsx":"7a2f6b43ff70","components/blocks/Quote.jsx":"bc4abb120d98","components/blocks/SiteFooter.jsx":"33d624bed958","components/blocks/StatBand.jsx":"f37cec743365","components/charts/BarChart.jsx":"8db7fab93755","components/charts/LineChart.jsx":"0d759e280064","components/core/Button.jsx":"536eb79503e0","components/core/Eyebrow.jsx":"5675cfb65217","components/core/Headline.jsx":"59daaeb44b1a","components/core/Section.jsx":"68a9a054bf02","components/core/Subhead.jsx":"e4d975a567a6","components/core/Wordmark.jsx":"19eabe7e3d34","components/deck/BigStatSlide.jsx":"0d265a2b8447","components/deck/BulletsSlide.jsx":"1188fa5e4986","components/deck/ChartSlide.jsx":"b3159e47e8c2","components/deck/CompareSlide.jsx":"782d75c6a2ec","components/deck/DividerSlide.jsx":"07996b09f7f8","components/deck/QuoteSlide.jsx":"5ebd81f7aa8c","components/deck/TitleSlide.jsx":"dcd800cda261","components/forms/Checkbox.jsx":"d1fdfa9cae92","components/forms/EmailCapture.jsx":"3cb28aa5aa93","components/forms/Field.jsx":"fd8e5c05eef9","components/forms/Input.jsx":"4a8270e8ee0d","components/forms/Select.jsx":"18cb0c965a93","components/forms/Textarea.jsx":"28645b6dc968","components/header/GlobalHeader.jsx":"07907d1b5a60","components/signature/KnockoutWindow.jsx":"7dc6baa7e09d","ui_kits/marketing-site/fixtures-page.app.jsx":"6ef159a3742c","ui_kits/marketing-site/fixtures-visuals.jsx":"0fe553bb888d","ui_kits/pitch-deck/deck-app.jsx":"89500460808d"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.KismetAuroraDesignSystem_50c149 = window.KismetAuroraDesignSystem_50c149 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/blocks/FeatureGrid.jsx
try { (() => {
/**
 * 3-up feature grid with numbered mono marks and mono titles.
 * items: [{ mark?, title, body }] — mark defaults to 01/02/03…
 */
function FeatureGrid({
  items = [],
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "feat",
    style: style
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    className: "card",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "mk"
  }, it.mark ?? String(i + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("h3", null, it.title), /*#__PURE__*/React.createElement("p", null, it.body))));
}
Object.assign(__ds_scope, { FeatureGrid });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/blocks/FeatureGrid.jsx", error: String((e && e.message) || e) }); }

// components/blocks/PressWall.jsx
try { (() => {
/**
 * Press / logo wall: grayscale mono wordmarks with an uppercase label above.
 */
function PressWall({
  label = 'As seen in',
  names = [],
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: style
  }, label ? /*#__PURE__*/React.createElement("p", {
    className: "press-lab"
  }, label) : null, /*#__PURE__*/React.createElement("div", {
    className: "press"
  }, names.map((n, i) => /*#__PURE__*/React.createElement("span", {
    key: i
  }, n))));
}
Object.assign(__ds_scope, { PressWall });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/blocks/PressWall.jsx", error: String((e && e.message) || e) }); }

// components/blocks/Quote.jsx
try { (() => {
/**
 * Centered editorial pull-quote — Playfair Display 500 with mono uppercase attribution.
 */
function Quote({
  children,
  by,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "quote",
    style: style
  }, /*#__PURE__*/React.createElement("p", null, children), by ? /*#__PURE__*/React.createElement("div", {
    className: "by"
  }, by) : null);
}
Object.assign(__ds_scope, { Quote });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/blocks/Quote.jsx", error: String((e && e.message) || e) }); }

// components/blocks/StatBand.jsx
try { (() => {
/**
 * Stat band: aurora-gradient mono numerals with short labels.
 * stats: [{ value, label }]
 */
function StatBand({
  stats = [],
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "stats",
    style: style
  }, stats.map((s, i) => /*#__PURE__*/React.createElement("div", {
    className: "stat",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "num"
  }, s.value), /*#__PURE__*/React.createElement("p", {
    className: "lab"
  }, s.label))));
}
Object.assign(__ds_scope, { StatBand });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/blocks/StatBand.jsx", error: String((e && e.message) || e) }); }

// components/charts/BarChart.jsx
try { (() => {
const AURORA_STOPS = [{
  offset: '0%',
  color: '#8B5CF6'
}, {
  offset: '46%',
  color: '#4F46E5'
}, {
  offset: '100%',
  color: '#10B981'
}];

/**
 * Aurora bar chart (div-based). Primary bars = aurora gradient; optional
 * value2 renders a gray comparison bar beside each (OTAs vs Kismet pattern).
 * Mono tabular value labels above bars, mono axis labels below.
 */
function BarChart({
  data = [],
  series,
  height = 200,
  formatValue,
  style
}) {
  const fmt = formatValue || (v => String(v));
  const hasSecond = data.some(d => d.value2 != null);
  const max = Math.max(1, ...data.map(d => Math.max(d.value || 0, d.value2 || 0)));
  const bar = (v, primary, key) => /*#__PURE__*/React.createElement("div", {
    key: key,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: '.35rem',
      width: hasSecond ? '36%' : '46%',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '.64rem',
      fontVariantNumeric: 'tabular-nums',
      fontWeight: 600,
      color: primary ? 'var(--tx)' : 'var(--tx-faint)'
    }
  }, fmt(v)), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: `${v / max * 80}%`,
      minHeight: 2,
      borderRadius: '2px 2px 0 0',
      background: primary ? 'var(--aurora)' : 'var(--line-strong)'
    }
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      ...style
    }
  }, series && series.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '1.1rem',
      marginBottom: '.7rem',
      fontSize: '.62rem',
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: 'var(--tx-faint)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '.4rem'
    }
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: '.5rem',
      height: '.5rem',
      borderRadius: '50%',
      background: 'var(--aurora)'
    }
  }), series[0]), hasSecond && series[1] ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '.4rem'
    }
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: '.5rem',
      height: '.5rem',
      borderRadius: '50%',
      background: 'var(--line-strong)'
    }
  }), series[1]) : null) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: `repeat(${data.length}, 1fr)`,
      gap: '.9rem',
      alignItems: 'end',
      height,
      borderBottom: '1px solid var(--line-strong)'
    }
  }, data.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: '.35rem',
      alignItems: 'flex-end',
      justifyContent: 'center',
      height: '100%'
    }
  }, bar(d.value || 0, true, 'a'), hasSecond ? bar(d.value2 || 0, false, 'b') : null))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: `repeat(${data.length}, 1fr)`,
      gap: '.9rem',
      paddingTop: '.45rem'
    }
  }, data.map((d, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      textAlign: 'center',
      fontSize: '.62rem',
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: 'var(--tx-faint)'
    }
  }, d.label))));
}
Object.assign(__ds_scope, { BarChart, AURORA_STOPS });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/charts/BarChart.jsx", error: String((e && e.message) || e) }); }

// components/charts/LineChart.jsx
try { (() => {
/**
 * Aurora line chart (SVG, 600-wide viewBox scaling to its container).
 * First series = aurora-gradient stroke, second = cool gray. Mono axis labels,
 * hairline gridlines, white-filled dots.
 */
function LineChart({
  labels = [],
  series = [],
  height = 210,
  formatValue,
  showDots = true,
  style
}) {
  const uid = React.useId().replace(/[:]/g, '');
  const fmt = formatValue || (v => String(v));
  const W = 600;
  const H = height;
  const padL = 46;
  const padR = 14;
  const padT = 14;
  const padB = 26;
  const all = series.flatMap(s => s.values || []);
  const rawMax = Math.max(1, ...all);
  const step = Math.pow(10, Math.floor(Math.log10(rawMax)));
  const max = Math.ceil(rawMax / (step / 2)) * (step / 2);
  const n = Math.max(2, labels.length);
  const x = i => padL + i * (W - padL - padR) / (n - 1);
  const y = v => padT + (1 - v / max) * (H - padT - padB);
  const ticks = [0, 0.5, 1].map(t => t * max);
  const colors = ['url(#aurora-' + uid + ')', '#8892A3'];
  const dotStroke = ['#4F46E5', '#8892A3'];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      ...style
    }
  }, series.some(s => s.name) ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '1.1rem',
      marginBottom: '.6rem',
      fontSize: '.62rem',
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: 'var(--tx-faint)'
    }
  }, series.map((s, si) => /*#__PURE__*/React.createElement("span", {
    key: si,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '.4rem'
    }
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: '.5rem',
      height: '.5rem',
      borderRadius: '50%',
      background: si === 0 ? 'var(--aurora)' : 'var(--line-strong)'
    }
  }), s.name))) : null, /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} ${H}`,
    style: {
      width: '100%',
      height: 'auto',
      display: 'block'
    },
    role: "img"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: `aurora-${uid}`,
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "0"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#8B5CF6"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "46%",
    stopColor: "#4F46E5"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#10B981"
  }))), ticks.map((t, i) => /*#__PURE__*/React.createElement("g", {
    key: i
  }, /*#__PURE__*/React.createElement("line", {
    x1: padL,
    x2: W - padR,
    y1: y(t),
    y2: y(t),
    stroke: "var(--line)",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("text", {
    x: padL - 8,
    y: y(t) + 3.5,
    textAnchor: "end",
    fontSize: "11",
    fontFamily: "var(--mono)",
    fill: "var(--tx-faint)"
  }, fmt(t)))), labels.map((l, i) => /*#__PURE__*/React.createElement("text", {
    key: i,
    x: x(i),
    y: H - 6,
    textAnchor: "middle",
    fontSize: "11",
    fontFamily: "var(--mono)",
    fill: "var(--tx-faint)"
  }, l)), series.map((s, si) => /*#__PURE__*/React.createElement("g", {
    key: si
  }, /*#__PURE__*/React.createElement("polyline", {
    points: (s.values || []).map((v, i) => `${x(i)},${y(v)}`).join(' '),
    fill: "none",
    stroke: colors[si % 2],
    strokeWidth: si === 0 ? 2.5 : 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), showDots ? (s.values || []).map((v, i) => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: x(i),
    cy: y(v),
    r: "3.5",
    fill: "var(--ground)",
    stroke: dotStroke[si % 2],
    strokeWidth: "2"
  })) : null))));
}
Object.assign(__ds_scope, { LineChart });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/charts/LineChart.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Full-pill Aurora button. Primary = aurora gradient; secondary = ink outline (inverts on .dark / .aurorabg grounds). */
function Button({
  variant = 'primary',
  href,
  children,
  style,
  ...rest
}) {
  const cls = `mkt-btn mkt-btn-${variant}`;
  if (href) {
    return /*#__PURE__*/React.createElement("a", _extends({
      className: cls,
      href: href,
      style: style
    }, rest), children);
  }
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: cls,
    style: style
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
/** Uppercase tracked kicker above headlines. Indigo on light, emerald-300 on dark (via .dark). */
function Eyebrow({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("p", {
    className: "mkt-eyebrow h-eb",
    style: style
  }, children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/Headline.jsx
try { (() => {
/** Hero headline — DM Sans 600, tight leading, balanced wrap. Use `as` to change heading level. */
function Headline({
  as = 'h2',
  children,
  style
}) {
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, {
    className: "mkt-h1 h-title",
    style: style
  }, children);
}
Object.assign(__ds_scope, { Headline });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Headline.jsx", error: String((e && e.message) || e) }); }

// components/core/Section.jsx
try { (() => {
/**
 * Marketing section ground. Variants map to source classes:
 * white -> .canvas · mist -> .canvas.mist · dark -> .canvas.dark · aurorabg -> .canvas.dark.aurorabg
 * Pass `mesh` to lay a celestial aurora cloud (+ film grain) under the content.
 */
function Section({
  variant = 'white',
  mesh = null,
  grain = true,
  container = true,
  className = '',
  style,
  children
}) {
  const map = {
    white: '',
    mist: 'mist',
    dark: 'dark',
    aurorabg: 'dark aurorabg'
  };
  const v = map[variant] ?? '';
  const s = variant === 'mist' ? {
    '--mist-fixed': '#EEF1F9',
    ...style
  } : style;
  return /*#__PURE__*/React.createElement("section", {
    className: `canvas ${v} ${className}`.trim(),
    style: s
  }, mesh ? /*#__PURE__*/React.createElement("div", {
    className: `mesh m-${mesh}`,
    style: {
      position: 'absolute',
      inset: 0
    }
  }) : null, mesh && grain ? /*#__PURE__*/React.createElement("div", {
    className: "grain",
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'var(--grain)',
      backgroundSize: '190px',
      opacity: 0.4,
      mixBlendMode: 'soft-light'
    }
  }) : null, container ? /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, children) : children);
}
Object.assign(__ds_scope, { Section });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Section.jsx", error: String((e && e.message) || e) }); }

// components/blocks/CtaBanner.jsx
try { (() => {
/**
 * Celestial CTA band: headline left, inverted white pill right, on an aurora cloud.
 */
function CtaBanner({
  title = 'Make your hotel AI-operable.',
  buttonLabel = 'Book a demo',
  mesh = 'aurora',
  onClick,
  href,
  style
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Section, {
    variant: "aurorabg",
    mesh: mesh,
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "cta"
  }, /*#__PURE__*/React.createElement("h3", null, title), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    href: href,
    onClick: onClick
  }, buttonLabel)));
}
Object.assign(__ds_scope, { CtaBanner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/blocks/CtaBanner.jsx", error: String((e && e.message) || e) }); }

// components/core/Subhead.jsx
try { (() => {
/** Supporting subhead under a Headline. Soft slate on light, #C9CDDA on dark. */
function Subhead({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("p", {
    className: "mkt-sub h-sub",
    style: style
  }, children);
}
Object.assign(__ds_scope, { Subhead });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Subhead.jsx", error: String((e && e.message) || e) }); }

// components/blocks/Hero.jsx
try { (() => {
/**
 * Marketing hero. dark=celestial with aurora mesh + grain; light=clean white.
 */
function Hero({
  dark = true,
  mesh = 'aurora',
  eyebrow,
  title,
  sub,
  primaryLabel = 'Book a demo',
  secondaryLabel = 'See how it works',
  onPrimary,
  onSecondary,
  primaryHref,
  secondaryHref,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Section, {
    variant: dark ? 'dark' : 'white',
    mesh: dark ? mesh : null,
    style: style
  }, eyebrow ? /*#__PURE__*/React.createElement(__ds_scope.Eyebrow, null, eyebrow) : null, /*#__PURE__*/React.createElement(__ds_scope.Headline, {
    as: "h1"
  }, title), sub ? /*#__PURE__*/React.createElement(__ds_scope.Subhead, null, sub) : null, /*#__PURE__*/React.createElement("div", {
    className: "h-acts"
  }, primaryLabel ? /*#__PURE__*/React.createElement(__ds_scope.Button, {
    href: primaryHref,
    onClick: onPrimary
  }, primaryLabel) : null, secondaryLabel ? /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    href: secondaryHref,
    onClick: onSecondary
  }, secondaryLabel) : null), children);
}
Object.assign(__ds_scope, { Hero });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/blocks/Hero.jsx", error: String((e && e.message) || e) }); }

// components/core/Wordmark.jsx
try { (() => {
/** Kismet typographic wordmark: IBM Plex Mono 600 + aurora-gradient dot. No logo asset exists — this IS the mark. */
function Wordmark({
  text = 'kismet.travel',
  light = false,
  style
}) {
  const s = light ? {
    color: '#fff',
    ...style
  } : style;
  return /*#__PURE__*/React.createElement("div", {
    className: "word",
    style: s
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), text);
}
Object.assign(__ds_scope, { Wordmark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Wordmark.jsx", error: String((e && e.message) || e) }); }

// components/blocks/SiteFooter.jsx
try { (() => {
/**
 * Dark site footer: brand column (wordmark + tagline + mono address) and link columns.
 * columns: [{ title, links: [{ label, href? }] }]
 */
function SiteFooter({
  tagline = 'The direct-booking layer for independent stays.',
  address,
  columns = [],
  mesh = null,
  style
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Section, {
    variant: "dark",
    mesh: mesh,
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "ft"
  }, /*#__PURE__*/React.createElement("div", {
    className: "brand"
  }, /*#__PURE__*/React.createElement(__ds_scope.Wordmark, {
    text: "kismet.travel",
    light: true
  }), /*#__PURE__*/React.createElement("p", {
    className: "tag2"
  }, tagline), address ? /*#__PURE__*/React.createElement("p", {
    className: "addr"
  }, address) : null), columns.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("h4", null, c.title), c.links.map((l, j) => /*#__PURE__*/React.createElement("a", {
    key: j,
    href: l.href ?? '#'
  }, l.label))))));
}
Object.assign(__ds_scope, { SiteFooter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/blocks/SiteFooter.jsx", error: String((e && e.message) || e) }); }

// components/deck/TitleSlide.jsx
try { (() => {
/** Shared slide footer: aurora dot + brand left, meta right. */
function SFoot({
  brand = 'KISMET',
  meta
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sfoot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "smark"
  }, /*#__PURE__*/React.createElement("i", null), brand), /*#__PURE__*/React.createElement("span", null, meta));
}

/**
 * Celestial title slide (16:9): wordmark top, big DM Sans title bottom, aurora cloud + grain.
 */
function TitleSlide({
  wordmark = 'kismet.travel',
  title,
  sub,
  mesh = 'aurora',
  brand = 'KISMET',
  meta,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "slide title",
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: `mesh m-${mesh}`,
    style: {
      position: 'absolute',
      inset: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "grain",
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'var(--grain)',
      backgroundSize: '190px',
      opacity: 0.4,
      mixBlendMode: 'soft-light'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "word",
    style: {
      fontSize: '.9rem',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), wordmark), /*#__PURE__*/React.createElement("h3", null, title), sub ? /*#__PURE__*/React.createElement("p", {
    className: "tsub"
  }, sub) : null, /*#__PURE__*/React.createElement(SFoot, {
    brand: brand,
    meta: meta
  }));
}
Object.assign(__ds_scope, { TitleSlide, SFoot });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/deck/TitleSlide.jsx", error: String((e && e.message) || e) }); }

// components/deck/BigStatSlide.jsx
try { (() => {
/**
 * White slide with a huge aurora-gradient mono numeral.
 */
function BigStatSlide({
  eyebrow,
  value,
  caption,
  brand = 'KISMET',
  meta,
  style,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "slide bigstat",
    style: style
  }, eyebrow ? /*#__PURE__*/React.createElement("p", {
    className: "s-eb"
  }, eyebrow) : null, /*#__PURE__*/React.createElement("div", {
    className: "num"
  }, value ?? children), caption ? /*#__PURE__*/React.createElement("p", {
    className: "cap2"
  }, caption) : null, /*#__PURE__*/React.createElement(__ds_scope.SFoot, {
    brand: brand,
    meta: meta
  }));
}
Object.assign(__ds_scope, { BigStatSlide });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/deck/BigStatSlide.jsx", error: String((e && e.message) || e) }); }

// components/deck/BulletsSlide.jsx
try { (() => {
/**
 * Content/bullets slide: eyebrow + title + aurora-dot bullet list, optional
 * celestial media panel right (square-edged knockout, mesh + grain).
 * Items are strings or { lead, text } — lead renders bold ink, "Lead — text".
 */
function BulletsSlide({
  eyebrow,
  title,
  items = [],
  media,
  brand = 'KISMET',
  meta,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "slide bullets",
    style: style
  }, eyebrow ? /*#__PURE__*/React.createElement("p", {
    className: "s-eb"
  }, eyebrow) : null, title ? /*#__PURE__*/React.createElement("h3", null, title) : null, /*#__PURE__*/React.createElement("div", {
    className: `blwrap${media ? ' split' : ''}`
  }, /*#__PURE__*/React.createElement("ul", {
    className: "bl"
  }, items.map((it, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, typeof it === 'string' ? it : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", null, it.lead), it.lead && it.text ? ' — ' : '', it.text)))), media ? /*#__PURE__*/React.createElement("div", {
    className: "blmedia"
  }, /*#__PURE__*/React.createElement("div", {
    className: `mesh m-${media}`
  }), /*#__PURE__*/React.createElement("div", {
    className: "grain"
  })) : null), /*#__PURE__*/React.createElement(__ds_scope.SFoot, {
    brand: brand,
    meta: meta
  }));
}
Object.assign(__ds_scope, { BulletsSlide });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/deck/BulletsSlide.jsx", error: String((e && e.message) || e) }); }

// components/deck/ChartSlide.jsx
try { (() => {
/**
 * Chart slide (16:9): eyebrow + title, chart area filling the middle
 * (pass a BarChart/LineChart as children), optional mono source note.
 */
function ChartSlide({
  eyebrow,
  title,
  note,
  children,
  brand = 'KISMET',
  meta,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "slide chart",
    style: style
  }, eyebrow ? /*#__PURE__*/React.createElement("p", {
    className: "s-eb"
  }, eyebrow) : null, title ? /*#__PURE__*/React.createElement("h3", null, title) : null, /*#__PURE__*/React.createElement("div", {
    className: "charea"
  }, children), note ? /*#__PURE__*/React.createElement("p", {
    className: "chnote"
  }, note) : null, /*#__PURE__*/React.createElement(__ds_scope.SFoot, {
    brand: brand,
    meta: meta
  }));
}
Object.assign(__ds_scope, { ChartSlide });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/deck/ChartSlide.jsx", error: String((e && e.message) || e) }); }

// components/deck/CompareSlide.jsx
try { (() => {
/**
 * Two-column comparison slide (gray "them" column vs accent-soft "Kismet" column).
 */
function CompareSlide({
  eyebrow = 'OTAs vs Kismet',
  title,
  left = {
    title: 'OTAs',
    items: []
  },
  right = {
    title: 'Kismet',
    items: []
  },
  brand = 'KISMET',
  meta,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "slide compare",
    style: style
  }, /*#__PURE__*/React.createElement("p", {
    className: "s-eb"
  }, eyebrow), title ? /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.05rem',
      marginTop: '.4rem'
    }
  }, title) : null, /*#__PURE__*/React.createElement("div", {
    className: "cmp"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col ota"
  }, /*#__PURE__*/React.createElement("h5", null, left.title), /*#__PURE__*/React.createElement("ul", null, left.items.map((it, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, it)))), /*#__PURE__*/React.createElement("div", {
    className: "col kis"
  }, /*#__PURE__*/React.createElement("h5", null, right.title), /*#__PURE__*/React.createElement("ul", null, right.items.map((it, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, it))))), /*#__PURE__*/React.createElement(__ds_scope.SFoot, {
    brand: brand,
    meta: meta
  }));
}
Object.assign(__ds_scope, { CompareSlide });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/deck/CompareSlide.jsx", error: String((e && e.message) || e) }); }

// components/deck/DividerSlide.jsx
try { (() => {
/**
 * Celestial section-divider slide: big emerald-300 mono number + title, centered.
 */
function DividerSlide({
  no,
  title,
  mesh = 'aurora',
  brand = 'KISMET',
  meta,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "slide divider",
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: `mesh m-${mesh}`,
    style: {
      position: 'absolute',
      inset: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "grain",
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'var(--grain)',
      backgroundSize: '190px',
      opacity: 0.4,
      mixBlendMode: 'soft-light'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "no"
  }, no), /*#__PURE__*/React.createElement("h3", null, title), /*#__PURE__*/React.createElement(__ds_scope.SFoot, {
    brand: brand,
    meta: meta
  }));
}
Object.assign(__ds_scope, { DividerSlide });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/deck/DividerSlide.jsx", error: String((e && e.message) || e) }); }

// components/deck/QuoteSlide.jsx
try { (() => {
/**
 * Mist-ground quote slide: Playfair pull-quote + mono attribution.
 */
function QuoteSlide({
  quote,
  by,
  brand = 'KISMET',
  meta,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "slide quote2",
    style: style
  }, /*#__PURE__*/React.createElement("p", null, quote), by ? /*#__PURE__*/React.createElement("div", {
    className: "by"
  }, by) : null, /*#__PURE__*/React.createElement(__ds_scope.SFoot, {
    brand: brand,
    meta: meta
  }));
}
Object.assign(__ds_scope, { QuoteSlide });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/deck/QuoteSlide.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Checkbox — 4px-radius square; checked = aurora gradient + white lucide check. */
function Checkbox({
  label,
  dark,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: `fm-check${dark ? ' fm-on-dark' : ''}`,
    style: style
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox"
  }, rest)), /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
/**
 * Form field scaffold: label row (+ OPTIONAL tag), the control, then an
 * error or hint line. Error wins over hint. dark = on celestial grounds.
 */
function Field({
  label,
  optional,
  hint,
  error,
  dark,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `fm-field${dark ? ' fm-on-dark' : ''}`,
    style: style
  }, label ? /*#__PURE__*/React.createElement("span", {
    className: "fm-label"
  }, label, optional ? /*#__PURE__*/React.createElement("span", {
    className: "fm-opt"
  }, "Optional") : null) : null, children, error ? /*#__PURE__*/React.createElement("span", {
    className: "fm-msg err"
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    className: "fm-msg"
  }, hint) : null);
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Text input — DM Sans, .5rem radius, 1.5px cool border; focus = accent ring. */
function Input({
  dark,
  invalid,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("input", _extends({
    className: `fm-input${dark ? ' fm-dark' : ''}`,
    "aria-invalid": invalid || undefined,
    style: style
  }, rest));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/EmailCapture.jsx
try { (() => {
/**
 * Inline lead-capture: email input + aurora-gradient CTA in one row.
 * Swaps to an emerald confirmation line on submit. dark = celestial grounds.
 */
function EmailCapture({
  placeholder = 'you@yourhotel.com',
  ctaLabel = 'Get Fixtures',
  onSubmit,
  hint,
  dark,
  style
}) {
  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);
  return /*#__PURE__*/React.createElement("form", {
    className: dark ? 'fm-on-dark' : undefined,
    style: {
      margin: 0,
      ...style
    },
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
      if (onSubmit) onSubmit(email);
    }
  }, sent ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--sans)',
      fontSize: '.98rem',
      color: dark ? '#6EE7B7' : '#10B981'
    }
  }, "Thanks \u2014 we\u2019ll be in touch.") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '.6rem',
      flexWrap: 'wrap',
      alignItems: 'stretch'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Input, {
    type: "email",
    required: true,
    dark: dark,
    placeholder: placeholder,
    value: email,
    onChange: e => setEmail(e.target.value),
    "aria-label": "Work email",
    style: {
      flex: '1 1 220px',
      width: 'auto'
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    type: "submit"
  }, ctaLabel)), hint && !sent ? /*#__PURE__*/React.createElement("p", {
    className: "fm-msg",
    style: {
      marginTop: '.5rem'
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { EmailCapture });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/EmailCapture.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Select — Input treatment + chevron; options as strings or {value, label}. */
function Select({
  options = [],
  placeholder,
  dark,
  invalid,
  style,
  ...rest
}) {
  const extra = {};
  if (placeholder && rest.value === undefined && rest.defaultValue === undefined) extra.defaultValue = '';
  return /*#__PURE__*/React.createElement("select", _extends({
    className: `fm-input fm-select${dark ? ' fm-dark' : ''}`,
    "aria-invalid": invalid || undefined,
    style: style
  }, extra, rest), placeholder ? /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder) : null, options.map(o => {
    const value = typeof o === 'string' ? o : o.value;
    const label = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: value,
      value: value
    }, label);
  }));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Multiline input — same treatment as Input, vertical resize. */
function Textarea({
  dark,
  invalid,
  rows = 4,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("textarea", _extends({
    className: `fm-input${dark ? ' fm-dark' : ''}`,
    "aria-invalid": invalid || undefined,
    rows: rows,
    style: style
  }, rest));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/header/GlobalHeader.jsx
try { (() => {
/* Lucide `menu` / `x` geometry (the same icons lucide-react ships on the live site). */
const IconMenu = /*#__PURE__*/React.createElement("svg", {
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("line", {
  x1: "4",
  x2: "20",
  y1: "6",
  y2: "6"
}), /*#__PURE__*/React.createElement("line", {
  x1: "4",
  x2: "20",
  y1: "12",
  y2: "12"
}), /*#__PURE__*/React.createElement("line", {
  x1: "4",
  x2: "20",
  y1: "18",
  y2: "18"
}));
const IconX = /*#__PURE__*/React.createElement("svg", {
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M18 6 6 18"
}), /*#__PURE__*/React.createElement("path", {
  d: "m6 6 12 12"
}));

/**
 * Global site header + full-screen dropdown menu, ported from the live
 * kismet.travel GlobalHeader.tsx. Black over dark bands, white over light —
 * theme="auto" watches [data-dark-nav] zones on scroll like the live site;
 * "light"/"dark" pin it. The "Talk to us" pill stays white in both themes.
 * Pass logoSrc (copy assets/kismet_logo_512.png) — never approximate the mark.
 */
function GlobalHeader({
  theme = 'auto',
  links = ['Fixtures', 'Learn', 'Pricing', 'News', 'Blog'],
  logoSrc,
  brand = 'Kismet',
  loginLabel = 'Login',
  loginHref = '#',
  ctaLabel = 'Talk to us',
  onCta,
  fixed = true,
  style
}) {
  const [onLight, setOnLight] = React.useState(theme !== 'dark');
  const [menuOpen, setMenuOpen] = React.useState(false);
  React.useEffect(() => {
    if (theme !== 'auto') return undefined;
    const HEADER_H = 72;
    let raf = 0;
    const check = () => {
      raf = 0;
      const overDark = Array.from(document.querySelectorAll('[data-dark-nav]')).some(z => {
        const r = z.getBoundingClientRect();
        return r.top <= HEADER_H && r.bottom >= HEADER_H;
      });
      setOnLight(!overDark);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [theme]);
  const dark = theme === 'dark' || theme === 'auto' && !onLight;
  const mode = dark ? 'dark' : 'light';
  const header = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", {
    className: `gh ${mode}`,
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "gh-bar"
  }, /*#__PURE__*/React.createElement("a", {
    className: "gh-logo",
    href: "#"
  }, logoSrc ? /*#__PURE__*/React.createElement("img", {
    src: logoSrc,
    alt: "",
    width: "32",
    height: "32"
  }) : null, /*#__PURE__*/React.createElement("span", {
    className: "gh-name"
  }, brand)), /*#__PURE__*/React.createElement("div", {
    className: "gh-actions"
  }, /*#__PURE__*/React.createElement("a", {
    className: "gh-login",
    href: loginHref
  }, loginLabel), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "gh-cta",
    onClick: onCta
  }, ctaLabel), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "gh-burger",
    "aria-label": "Toggle menu",
    "aria-expanded": menuOpen,
    onClick: () => setMenuOpen(!menuOpen)
  }, menuOpen ? IconX : IconMenu)))), /*#__PURE__*/React.createElement("div", {
    className: `gh-menu ${mode}${menuOpen ? ' open' : ''}`,
    "aria-hidden": !menuOpen
  }, /*#__PURE__*/React.createElement("div", {
    className: "gh-menu-inner"
  }, /*#__PURE__*/React.createElement("nav", null, /*#__PURE__*/React.createElement("ul", null, links.map(l => {
    const label = typeof l === 'string' ? l : l.label;
    const href = typeof l === 'string' ? '#' : l.href || '#';
    return /*#__PURE__*/React.createElement("li", {
      key: label
    }, /*#__PURE__*/React.createElement("a", {
      href: href,
      onClick: () => setMenuOpen(false)
    }, label));
  }))))));
  return fixed ? header : /*#__PURE__*/React.createElement("div", {
    className: "gh-wrap"
  }, header);
}
Object.assign(__ds_scope, { GlobalHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/header/GlobalHeader.jsx", error: String((e && e.message) || e) }); }

// components/signature/KnockoutWindow.jsx
try { (() => {
/**
 * Signature motif: a square, sharp-edged window onto a grainy celestial aurora cloud.
 * Square edges (2px radius) are intentional brand language — do not round them.
 */
function KnockoutWindow({
  mesh = 'aurora',
  big = false,
  label,
  chip,
  style,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `kw${big ? ' big' : ''}`,
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: `mesh m-${mesh}`
  }), /*#__PURE__*/React.createElement("div", {
    className: "grain"
  }), chip ? /*#__PURE__*/React.createElement("div", {
    className: "chip"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cdot"
  }), chip) : null, label ? /*#__PURE__*/React.createElement("span", {
    className: "lab"
  }, label) : null, children);
}
Object.assign(__ds_scope, { KnockoutWindow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/signature/KnockoutWindow.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/fixtures-page.app.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* kismet.travel/fixtures — page composition, ported from app/(marketing)/fixtures/page.tsx,
   components/fixtures/*, components/GlobalHeader.tsx, and the marketing layout footer. */

const {
  Lucide,
  BookingFlowPhone,
  FixtureDataBox,
  DeviceShowcase,
  AiChannelsScan,
  FIXTURES_ASSETS
} = window;
const KISMET_ASSETS = '../../assets/';

/* ── Calendly modal (stub of components/CalendlyModal — real one embeds Calendly) ── */
function CalendlyModal({
  isOpen,
  onClose,
  title,
  description
}) {
  if (!isOpen) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(0,0,0,.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      background: '#fff',
      borderRadius: 12,
      maxWidth: 480,
      width: '100%',
      padding: '28px 28px 24px',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,.35)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose,
    "aria-label": "Close",
    style: {
      position: 'absolute',
      top: 14,
      right: 14,
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      color: '#6B7280',
      padding: 4
    }
  }, /*#__PURE__*/React.createElement(Lucide, {
    name: "x",
    size: 20
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#474747'
    }
  }, title || 'Talk to us'), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 10,
      marginBottom: 0,
      fontSize: '.9rem',
      lineHeight: 1.6,
      color: '#4B5563'
    }
  }, description || 'Grab 30 minutes with the Kismet team.'), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      border: '1px dashed #E5E7EB',
      borderRadius: 8,
      padding: '28px 16px',
      textAlign: 'center',
      color: '#9CA3AF',
      fontSize: '.8rem'
    }
  }, "Calendly scheduling embed")));
}

/* ── DemoCTA (components/home/DemoCTA) ── */
function DemoCTA({
  label = 'Book a demo',
  title,
  description
}) {
  const [open, setOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setOpen(true),
    className: "mkt-btn mkt-btn-primary"
  }, label), /*#__PURE__*/React.createElement(CalendlyModal, {
    isOpen: open,
    onClose: () => setOpen(false),
    title: title,
    description: description
  }));
}

/* ── GlobalHeader — transparent black over [data-dark-nav] zones, white over the light band ── */
function GlobalHeader() {
  const [onLight, setOnLight] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [talkOpen, setTalkOpen] = React.useState(false);
  React.useEffect(() => {
    const HEADER_H = 72;
    let raf = 0;
    const check = () => {
      raf = 0;
      const overDark = Array.from(document.querySelectorAll('[data-dark-nav]')).some(z => {
        const r = z.getBoundingClientRect();
        return r.top <= HEADER_H && r.bottom >= HEADER_H;
      });
      setOnLight(!overDark);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  const dark = !onLight;
  const menuLinks = ['Fixtures', 'Learn', 'Pricing', 'News', 'Blog'];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      transition: 'background-color .3s, color .3s',
      background: dark ? '#000' : '#fff',
      borderBottom: dark ? 'none' : '1px solid #E5E7EB',
      boxShadow: dark ? 'none' : '0 1px 2px rgba(0,0,0,0.03)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mkt-container",
    style: {
      paddingTop: '1rem',
      paddingBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: KISMET_ASSETS + 'kismet_logo_512.png',
    alt: "Kismet",
    width: "32",
    height: "32",
    style: {
      width: 32,
      height: 32
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '1.5rem',
      fontWeight: 500,
      letterSpacing: '-.025em',
      color: dark ? '#F5F5F5' : '#474747'
    }
  }, "Kismet")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontSize: '.95rem',
      color: dark ? '#D4D4D4' : '#4B5563',
      textDecoration: 'none'
    }
  }, "Login"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setTalkOpen(true),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: 999,
      background: '#fff',
      border: '2px solid #474747',
      padding: '.75rem 1.5rem',
      fontSize: '1rem',
      fontWeight: 500,
      color: '#474747',
      cursor: 'pointer',
      fontFamily: 'inherit',
      transition: 'background-color .15s'
    }
  }, "Talk to us"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setMenuOpen(!menuOpen),
    "aria-label": "Toggle menu",
    "aria-expanded": menuOpen,
    style: {
      margin: '-8px -8px -8px 0',
      padding: 8,
      borderRadius: 8,
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      color: dark ? '#F5F5F5' : '#474747'
    }
  }, /*#__PURE__*/React.createElement(Lucide, {
    name: menuOpen ? 'x' : 'menu',
    size: 24
  }))))), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": !menuOpen,
    style: {
      position: 'fixed',
      left: 0,
      right: 0,
      top: 64,
      bottom: 0,
      zIndex: 40,
      overflowY: 'auto',
      transition: 'transform .3s',
      transform: menuOpen ? 'translateY(0)' : 'translateY(-100%)',
      pointerEvents: menuOpen ? 'auto' : 'none',
      background: dark ? '#000' : '#fff',
      color: dark ? '#fff' : '#474747'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mkt-container",
    style: {
      display: 'flex',
      minHeight: '100%',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '2.5rem 2rem'
    }
  }, /*#__PURE__*/React.createElement("nav", null, /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0
    }
  }, menuLinks.map(label => /*#__PURE__*/React.createElement("li", {
    key: label
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      setMenuOpen(false);
    },
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: '1rem 0',
      fontSize: '1.75rem',
      letterSpacing: '-.025em',
      fontWeight: 330,
      color: 'inherit',
      textDecoration: 'none',
      borderBottom: '1px solid color-mix(in srgb, currentColor 14%, transparent)'
    }
  }, label))))))), /*#__PURE__*/React.createElement(CalendlyModal, {
    isOpen: talkOpen,
    onClose: () => setTalkOpen(false)
  }));
}

/* ── Hero — full-bleed dark, copy left, knockout window + BookingFlowPhone right ── */
function FixturesHero() {
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "Hero",
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: '#000',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mkt-container",
    style: {
      position: 'relative',
      paddingTop: '9rem',
      paddingBottom: '6rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mkt-grid",
    style: {
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-copy"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mkt-heading-group mkt-on-dark"
  }, /*#__PURE__*/React.createElement("p", {
    className: "mkt-eyebrow"
  }, "Kismet Fixtures"), /*#__PURE__*/React.createElement("h1", {
    className: "mkt-h1"
  }, "Built for artificial intelligence. Honed for human experience."), /*#__PURE__*/React.createElement("p", {
    className: "mkt-subhead"
  }, "Fixtures makes your homes AI Bookable \u2014 a drop-in kit that turns guests from AI channels into direct bookings on the website you already run. No replatforming."), /*#__PURE__*/React.createElement("div", {
    className: "mkt-actions"
  }, /*#__PURE__*/React.createElement(DemoCTA, {
    label: "Get Fixtures",
    title: "Help with install",
    description: "A 30-minute walkthrough to help install and get you set up to run Fixtures on your website. We'll cover how the drop-in kit connects to your booking engine or PMS, how your homes start showing up as direct bookings inside AI assistants, what going live takes (days, not a replatform), and the economics for your portfolio."
  }), /*#__PURE__*/React.createElement("a", {
    href: "#how",
    className: "mkt-btn mkt-btn-secondary"
  }, "See how it works")))), /*#__PURE__*/React.createElement("div", {
    className: "hero-visual"
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    className: "celestial-fixed hero-knockout"
  }), /*#__PURE__*/React.createElement(BookingFlowPhone, null)))));
}

/* ── AiCommerceTrio (components/fixtures/AiCommerceTrio) ── */
const TRIO = [{
  title: 'Be the answer when travelers ask',
  body: 'Every Fixture emits schema.org JSON-LD on your own URL, so ChatGPT, Claude, and Perplexity can read, cite, and book your homes — not the marketplaces’.'
}, {
  title: 'An experience optimized for the devices AI searchers use',
  body: '70%+ of AI traffic arrives by phone. Deliver the mobile shopping experience and checkout flow guests expect, so they book with you instead of bouncing to an OTA.'
}, {
  title: 'See the demand you’ve been missing',
  body: 'First-party demand intelligence understands each guest’s journey — from Google AI Mode and Meta to ChatGPT and Claude, both paid and organic. See the channel that hides in “direct.”'
}];
function AiCommerceTrio() {
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "AI commerce trio",
    style: {
      position: 'relative',
      zIndex: 10,
      overflow: 'hidden',
      background: '#000',
      color: '#fff',
      boxShadow: '0 34px 44px -16px rgba(0,0,0,0.55)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mkt-container",
    style: {
      paddingTop: '7rem',
      paddingBottom: '7rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      columnGap: '1.5rem',
      rowGap: '1.5rem',
      marginBottom: '4rem'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      gridColumn: 'span 7',
      margin: 0,
      fontSize: '3rem',
      fontWeight: 600,
      letterSpacing: '-.025em',
      lineHeight: 1.05,
      color: '#fff'
    }
  }, "The AI channel is already here."), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '9 / span 4',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      paddingTop: '.5rem'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: '1.125rem',
      color: 'rgba(255,255,255,.7)',
      lineHeight: 1.625
    }
  }, "Get your homes picked and booked direct \u2014 on your own site and in chat."), /*#__PURE__*/React.createElement("a", {
    href: "#how",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: '.875rem',
      fontWeight: 600,
      color: '#A5B4FC',
      textDecoration: 'none',
      alignSelf: 'flex-start'
    }
  }, "See how it works ", /*#__PURE__*/React.createElement(Lucide, {
    name: "arrow-right",
    size: 16
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      columnGap: '1.5rem',
      rowGap: '3rem'
    }
  }, TRIO.map(({
    title,
    body
  }, i) => /*#__PURE__*/React.createElement("article", {
    key: title,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem'
    }
  }, i === 0 ? /*#__PURE__*/React.createElement(FixtureDataBox, null) : i === 1 ? /*#__PURE__*/React.createElement(DeviceShowcase, null) : /*#__PURE__*/React.createElement(AiChannelsScan, null), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '-.025em',
      color: '#fff'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: '.875rem',
      color: 'rgba(255,255,255,.65)',
      lineHeight: 1.625
    }
  }, body))))));
}

/* ── FixturePillars (components/fixtures/FixturePillars) — the one WHITE band ── */
const PILLAR_ROWS = [{
  icon: 'package-plus',
  title: 'Plug-ins, drop-ins, and scripts',
  body: 'Install the way that fits. Designed for agencies and in-house teams to work the way they already do.'
}, {
  icon: 'fingerprint',
  title: 'Stays unmistakably yours',
  body: 'Your design, your brand, your voice. Fixtures sits alongside them, adding the guest-experience and conversion tools that drive direct bookings.'
}, {
  icon: 'network',
  title: 'Sits on top of the Kismet platform',
  body: 'AI distribution, MCP, and agentic commerce — Fixtures is your first surface on the platform built for all of it.'
}];
function FixturePillars() {
  return /*#__PURE__*/React.createElement("section", {
    id: "how",
    "data-screen-label": "Pillars",
    style: {
      scrollMarginTop: 96
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 3.5rem',
      fontSize: '3rem',
      fontWeight: 600,
      letterSpacing: '-.025em',
      lineHeight: 1.05,
      color: '#474747',
      textWrap: 'balance',
      maxWidth: '56rem'
    }
  }, "Easy to install. Unmistakably yours. Built for what\u2019s next."), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid #E5E7EB'
    }
  }, PILLAR_ROWS.map(({
    icon,
    title,
    body
  }) => /*#__PURE__*/React.createElement("div", {
    key: title,
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      columnGap: '2rem',
      rowGap: '1rem',
      borderBottom: '1px solid #E5E7EB',
      padding: '2.5rem 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 6',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1.25rem'
    }
  }, /*#__PURE__*/React.createElement(Lucide, {
    name: icon,
    size: 40,
    strokeWidth: 1.5,
    style: {
      flexShrink: 0,
      color: '#474747'
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: '1.875rem',
      fontWeight: 600,
      letterSpacing: '-.025em',
      color: '#474747',
      textWrap: 'balance'
    }
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 6',
      alignSelf: 'center'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: '1.125rem',
      color: '#4B5563',
      lineHeight: 1.625,
      maxWidth: '36rem'
    }
  }, body))))));
}

/* ── ManagersMarquee (components/fixtures/ManagersMarquee) — real operator branding ── */
const GCS = 'https://storage.googleapis.com/kismet-generic-images/collections';
const MANAGERS = [{
  name: 'Cascadia Getaways',
  url: 'https://www.cascadiagetaways.com',
  image: 'https://kismet.travel/vrm/cascadia-getaways/images/vacation-rentals/cascadia-getaways/zigzag-basecamp-hot-tub-forest-views-rhododendron/gallery/11986a60-c70c-48ca-b7ad-9cf4635ac0d3.jpg',
  logo: `${GCS}/cascadia-getaways/primary/primary-logo-1.png`
}, {
  name: 'Juniper Holiday + Home',
  url: 'https://juniperholidayandhome.com',
  image: 'https://kismet.travel/vrm/juniper-holiday-home/images/vacation-rentals/juniper-holiday-home/fennville-stay-fire-pit-near-saugatuck-lake/gallery/685f9eb6-15aa-48f8-86e4-40bb3d9f1487.jpg',
  logo: `${GCS}/juniper-holiday-home/primary/primary-logo-1.png`
}, {
  name: 'Upstay',
  url: 'https://upstay.com',
  image: 'https://storage.googleapis.com/kismet-generic-images/vacation-rentals/upstay/queens-gambit-7-minutes-from-downtown-sleeps-16-austin/gallery/f88ac656-70af-4bb7-9f21-08096bd75bc7.jpg',
  logo: `${GCS}/upstay/primary/primary-logo-3.png`,
  lightLogo: true
}, {
  name: 'Hallson',
  url: 'https://hallson.co',
  image: 'https://kismet.travel/vrm/hallson/images/vacation-rentals/hallson/the-hubb-house-relaxing-rooftop-hot-tub-nashville/gallery/88af81f0-f98f-4b42-81d2-050db75d7d61.jpg',
  logo: 'https://kismet.travel/vrm/hallson/images/vacation-rentals/hallson/branding/32b07446-d98c-4846-a203-5cda4a7b194f.png'
}, {
  name: 'Arrival Getaways',
  url: 'https://arrivalgetaways.com',
  image: 'https://storage.googleapis.com/kismet-generic-images/vacation-rentals/arrival-getaways/sunset-house-at-pacific-city-cloverdale/gallery/2ad3629f-2328-4328-b1f3-075d1fbd9770.jpg',
  logo: `${GCS}/arrival-getaways/primary/primary-logo-1.webp`
}, {
  name: 'Host & Stay',
  url: 'https://hostandstay.co.uk',
  image: 'https://assets.guesty.com/image/upload/v1756387747/production/5bd8d8862dad180087d61bd6/osarc3y4gpnbcftfnhyh.jpg',
  logo: `${GCS}/host-stay/primary/primary-logo-1.png`
}, {
  name: 'Red Cottage',
  url: 'https://redcottage.com',
  image: 'https://kismet.travel/vrm/red-cottage/images/vacation-rentals/red-cottage/birch-buck-stunning-views-near-hudson-hunter-leeds/gallery/6b197f99-e258-4d4c-b77f-b63dac381362.jpg',
  logo: 'https://redcottage.com/wp-content/uploads/red-cottage-textonly.svg'
}, {
  name: 'Miami Vacation Rentals',
  url: 'https://miamivacationrentals.com',
  image: 'https://storage.googleapis.com/kismet-generic-images/vacation-rentals/miami-vacation-rentals/mvr-brand-new-miami-escape-like-no-otherbook-now/gallery/773e8c42-a503-479f-b636-8f5af975962d.jpg',
  logo: 'https://kismet.travel/vrm/miami-vacation-rentals/images/vacation-rentals/miami-vacation-rentals/branding/cfcc8775-915e-4cc5-af22-2f6b19baf6be.png'
}, {
  name: 'Luxe Maui Properties',
  url: 'https://www.luxemauiproperties.com',
  image: 'https://storage.googleapis.com/kismet-generic-images/vacation-rentals/luxe-maui-properties/historic-maui-estate-weddings-groups-wailuku/gallery/c38bb80b-0bec-47a3-8b25-1de7455d64bb.jpg',
  logo: `${GCS}/luxe-maui-properties/primary/primary-logo-1.png`
}, {
  name: 'Scenic Stays',
  url: 'https://myscenicstays.com',
  image: 'https://storage.googleapis.com/kismet-generic-images/vacation-rentals/scenic-stays/283-lakeview-drive-santa-rosa-beach/gallery/22c8df24-87c3-47fa-a87b-679a960dd7a1.jpg',
  logo: `${GCS}/scenic-stays/primary/primary-logo-1.png`
}, {
  name: 'and more…',
  more: true
}];
const MARQUEE_CSS = `
@keyframes mgr-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.mgr-track { animation: mgr-marquee 50s linear infinite; }
.mgr-marquee:hover .mgr-track { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) { .mgr-track { animation: none; } }
`;
function ManagerTile({
  name,
  url,
  image,
  logo,
  lightLogo,
  more
}) {
  if (more) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginRight: 16,
        display: 'block',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        aspectRatio: '3 / 2',
        height: 192,
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        padding: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '.875rem',
        fontWeight: 600,
        letterSpacing: '-.025em',
        color: '#9CA3AF'
      }
    }, name)));
  }
  const card = /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '3 / 2',
      height: 192,
      overflow: 'hidden',
      borderRadius: 4,
      border: '1px solid rgba(255,255,255,.1)',
      background: 'linear-gradient(to bottom right, #262626, #171717)'
    }
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: name,
    loading: "lazy",
    style: {
      height: '100%',
      width: '100%',
      objectFit: 'cover'
    }
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 8,
      right: 8,
      display: 'flex',
      maxWidth: '80%',
      alignItems: 'center',
      borderRadius: 6,
      padding: '4px 8px',
      backdropFilter: 'blur(4px)',
      background: lightLogo ? 'rgba(23,23,23,.85)' : 'rgba(255,255,255,.9)',
      boxShadow: lightLogo ? '0 1px 2px rgba(0,0,0,.05), 0 0 0 1px rgba(255,255,255,.1)' : '0 1px 2px rgba(0,0,0,.05), 0 0 0 1px rgba(0,0,0,.05)'
    }
  }, logo ? /*#__PURE__*/React.createElement("img", {
    src: logo,
    alt: name,
    loading: "lazy",
    style: {
      height: 24,
      width: 'auto',
      maxWidth: 120,
      objectFit: 'contain'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: 'nowrap',
      fontSize: 11,
      fontWeight: 600,
      lineHeight: 1,
      letterSpacing: '-.025em',
      color: '#474747'
    }
  }, name)));
  const cls = {
    display: 'block',
    flexShrink: 0,
    marginRight: 16,
    textDecoration: 'none'
  };
  return url ? /*#__PURE__*/React.createElement("a", {
    href: url,
    target: "_blank",
    rel: "noopener noreferrer",
    style: cls,
    "aria-label": name
  }, card) : /*#__PURE__*/React.createElement("div", {
    style: cls
  }, card);
}
function ManagersMarquee() {
  const items = [...MANAGERS, ...MANAGERS];
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "Managers marquee",
    style: {
      marginBottom: '8rem'
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow-xs",
    style: {
      marginBottom: '1rem',
      color: '#818CF8'
    }
  }, "Running on Kismet"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 3rem',
      maxWidth: '42rem',
      fontSize: '2.25rem',
      fontWeight: 600,
      letterSpacing: '-.025em',
      color: '#fff'
    }
  }, "Join the managers already powered by Kismet\u2019s direct booking platform."), /*#__PURE__*/React.createElement("div", {
    className: "mgr-marquee",
    style: {
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("style", {
    dangerouslySetInnerHTML: {
      __html: MARQUEE_CSS
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "mgr-track",
    style: {
      display: 'flex',
      width: 'max-content'
    }
  }, items.map((m, i) => /*#__PURE__*/React.createElement(ManagerTile, _extends({
    key: `${m.name}-${i}`
  }, m)))), /*#__PURE__*/React.createElement("div", {
    style: {
      pointerEvents: 'none',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      width: 96,
      background: 'linear-gradient(to right, #000, transparent)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      pointerEvents: 'none',
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      width: 96,
      background: 'linear-gradient(to left, #000, transparent)'
    }
  })));
}

/* ── Footer — the /fixtures dark variant of the marketing layout footer ── */
function SiteFooterDark() {
  return /*#__PURE__*/React.createElement("footer", {
    "data-dark-nav": "",
    style: {
      background: '#0A0A0A',
      borderTop: '1px solid rgba(255,255,255,.1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mkt-container",
    style: {
      paddingTop: '1rem',
      paddingBottom: '1rem',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '2rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '.875rem',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", null, "\xA9 2026 Kismet."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontSize: '.75rem',
      color: '#9CA3AF'
    }
  }, "Tourist Products, Inc."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '.75rem',
      color: '#9CA3AF',
      whiteSpace: 'pre-line'
    }
  }, '33 W 17th Street, Floor 6\nNew York, NY 10011')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '2rem'
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      fontSize: '.875rem'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://www.linkedin.com/company/makekismet/",
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": "LinkedIn",
    style: {
      color: '#D1D5DB'
    }
  }, /*#__PURE__*/React.createElement(Lucide, {
    name: "linkedin",
    size: 16
  })), /*#__PURE__*/React.createElement("a", {
    href: "#",
    "aria-label": "Kismet MCP connector",
    style: {
      color: '#D1D5DB',
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: KISMET_ASSETS + 'Model_Context_Protocol_logo.svg',
    alt: "MCP",
    style: {
      height: 16,
      width: 16,
      filter: 'invert(1)'
    }
  }))), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      fontSize: '.875rem'
    }
  }, ['Fixtures', 'Learn', 'Pricing', 'News', 'Blog'].map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      color: '#D1D5DB',
      textDecoration: 'none'
    }
  }, l))), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      fontSize: '.875rem'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://kismet.travel/privacy",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      color: '#D1D5DB',
      textDecoration: 'none'
    }
  }, "Privacy"), /*#__PURE__*/React.createElement("a", {
    href: "https://kismet.travel/terms",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      color: '#D1D5DB',
      textDecoration: 'none'
    }
  }, "Terms")))));
}

/* ── Page (app/(marketing)/fixtures/page.tsx) ── */
function FixturesLandingPage() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement(GlobalHeader, null), /*#__PURE__*/React.createElement("main", {
    style: {
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-dark-nav": ""
  }, /*#__PURE__*/React.createElement(FixturesHero, null), /*#__PURE__*/React.createElement(AiCommerceTrio, null)), /*#__PURE__*/React.createElement("div", {
    className: "mkt-container",
    style: {
      paddingTop: '7rem',
      paddingBottom: '7rem'
    }
  }, /*#__PURE__*/React.createElement(FixturePillars, null)), /*#__PURE__*/React.createElement("section", {
    "data-dark-nav": "",
    "data-screen-label": "Dark close",
    style: {
      position: 'relative',
      zIndex: 10,
      background: '#000',
      color: '#fff',
      boxShadow: '0 -34px 44px -16px rgba(0,0,0,0.55)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mkt-container",
    style: {
      paddingTop: '7rem',
      paddingBottom: '7rem'
    }
  }, /*#__PURE__*/React.createElement(ManagersMarquee, null), /*#__PURE__*/React.createElement("section", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 auto 1.5rem',
      fontSize: '3rem',
      fontWeight: 600,
      letterSpacing: '-.025em',
      color: '#fff',
      maxWidth: '48rem'
    }
  }, "Turn AI into a direct channel."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 auto 2.5rem',
      fontSize: '1.125rem',
      color: '#D1D5DB',
      maxWidth: '36rem'
    }
  }, "Pick your install method. Direct bookings start the day you go live."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(DemoCTA, {
    label: "Talk to us"
  })))))), /*#__PURE__*/React.createElement(SiteFooterDark, null));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(FixturesLandingPage, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/fixtures-page.app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/fixtures-visuals.jsx
try { (() => {
/* Visual layer for the /fixtures recreation — ported 1:1 from the kismet.travel repo:
   components/fixtures/BookingFlowPhone.tsx, FixtureDataBox.tsx, DeviceShowcase.tsx, AiChannelsScan.tsx.
   Icons: real Lucide SVGs fetched from lucide-static (same set the site imports from lucide-react);
   AI channel logos: real brand glyphs via Simple Icons CDN (site uses react-icons/si). */

const FIXTURES_ASSETS = '../../assets/fixtures/';

/* ── Lucide icon (fetch + inline, so currentColor & stroke-width behave like lucide-react) ── */
const lucideSvgCache = {};
function Lucide({
  name,
  size = 24,
  strokeWidth,
  fill,
  style,
  className
}) {
  const [svg, setSvg] = React.useState(lucideSvgCache[name] || null);
  React.useEffect(() => {
    if (lucideSvgCache[name]) {
      setSvg(lucideSvgCache[name]);
      return;
    }
    let live = true;
    fetch(`https://unpkg.com/lucide-static@0.462.0/icons/${name}.svg`).then(r => r.text()).then(t => {
      lucideSvgCache[name] = t;
      if (live) setSvg(t);
    });
    return () => {
      live = false;
    };
  }, [name]);
  const box = {
    display: 'inline-flex',
    lineHeight: 0,
    width: size,
    height: size,
    ...style
  };
  if (!svg) return /*#__PURE__*/React.createElement("span", {
    className: className,
    style: box
  });
  let out = svg.replace('width="24"', `width="${size}"`).replace('height="24"', `height="${size}"`);
  if (strokeWidth != null) out = out.replace('stroke-width="2"', `stroke-width="${strokeWidth}"`);
  if (fill) out = out.replace('fill="none"', 'fill="currentColor"');
  return /*#__PURE__*/React.createElement("span", {
    className: className,
    style: box,
    dangerouslySetInnerHTML: {
      __html: out
    }
  });
}

/* ═══════════════ BookingFlowPhone — hero visual (CSS + keyframes verbatim from repo) ═══════════════ */

const PHONE_LISTING = {
  title: 'The Chestnut + Linden',
  loc: 'Nashville, Tennessee',
  beds: '8 bedrooms · 24 beds · 9 bathrooms · Sleeps 24',
  badges: ['house', 'fireplace'],
  desc: 'Welcome to The Chestnut + The Linden, two brand-new luxury townhomes hosted by Hallson Hospitality, located side by side in Nashville’s vibrant Wedgewood-Houston neighborhood. Ideal for large groups, this dual-home retreat features 8 bedrooms, 8 full bathrooms, and two private rooftop lounges with skyline views.',
  price: '$854',
  dates: 'Oct 19 – 22 · 3 nights',
  img1: FIXTURES_ASSETS + 'chestnut-linden-1.jpg',
  img2: FIXTURES_ASSETS + 'linden-rooftop-2.jpg'
};
const PHONE_PINS = [[22, 30, '$410'], [40, 40, '$488'], [30, 50, '$506'], [16, 62, '$487'], [72, 34, '$775'], [50, 64, '$846'], [60, 56, '$854', true]];
const PHONE_CLUSTERS = [[44, 22, 7], [73, 44, 10], [26, 80, 4]];
const PHONE_CSS = `
.ph{position:relative;width:264px;height:548px;border-radius:42px;background:#0b0b12;padding:8px;box-shadow:0 36px 64px -26px rgba(99,102,241,.5),0 0 0 1px rgba(255,255,255,.06);flex:0 0 auto;}
.ph-scr{position:relative;width:100%;height:100%;border-radius:34px;overflow:hidden;background:#e6e7e9;}
.ph-notch{position:absolute;top:0;left:50%;transform:translateX(-50%);width:88px;height:15px;background:#0b0b12;border-radius:0 0 11px 11px;z-index:30;}
.ph-map{position:absolute;inset:-12%;transform-origin:60% 56%;animation:ph-map 10s cubic-bezier(.5,0,.12,1) infinite;}
.ph-map svg{width:100%;height:100%;display:block;}
.ph-pin{position:absolute;transform:translate(-50%,-50%);background:#fff;border:1px solid #e5e7eb;border-radius:6px;padding:3px 6px;font:600 8.5px/1 system-ui;color:#111827;box-shadow:0 1px 3px rgba(0,0,0,.1),0 2px 8px rgba(0,0,0,.06);white-space:nowrap;letter-spacing:-.01em;}
.ph-pin.sel{background:#111827;border-color:#111827;color:#fff;z-index:4;transform:translate(-50%,-50%) scale(1.05);box-shadow:0 2px 8px rgba(0,0,0,.2);}
.ph-cluster{position:absolute;transform:translate(-50%,-50%);width:22px;height:22px;border-radius:50%;background:#fff;border:1.5px solid #111827;color:#111827;display:flex;align-items:center;justify-content:center;font:600 9px/1 system-ui;box-shadow:0 1px 4px rgba(0,0,0,.12);}
.ph-ripple{position:absolute;left:60%;top:56%;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;border:1.5px solid rgba(17,17,17,.65);z-index:5;animation:ph-ripple 10s ease-out infinite;}
.ph-ctl{position:absolute;z-index:8;background:#fff;border-radius:13px;box-shadow:0 2px 8px rgba(0,0,0,.16);display:flex;align-items:center;gap:8px;padding:7px 10px;color:#111827;}
.ph-ctl.tl{top:12px;left:12px;}
.ph-ctl.tr{top:12px;right:12px;gap:5px;font:600 11px/1 system-ui;}
.ph-ctl svg{display:block;}
.ph-prev{position:absolute;left:2px;right:2px;bottom:7px;z-index:19;background:#fff;border-radius:20px;box-shadow:0 10px 26px rgba(0,0,0,.17),0 2px 7px rgba(0,0,0,.08);padding:9px 9px 50px;opacity:0;animation:ph-prev 10s cubic-bezier(.34,1.3,.5,1) infinite;}
.ph-prev-row{display:flex;align-items:center;gap:9px;}
.ph-prev img{width:74px;aspect-ratio:4/3;border-radius:13px;object-fit:cover;flex:0 0 auto;}
.ph-prev-i{min-width:0;flex:1 1 auto;display:flex;flex-direction:column;justify-content:center;}
.ph-prev-t{font:700 10px/1.2 system-ui;color:#1a1a1a;letter-spacing:-.01em;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.ph-prev-s{font:400 7.5px/1.3 system-ui;color:#6b7280;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.ph-prev-p{font:400 8px/1.2 system-ui;color:#6b7280;margin-top:3px;}
.ph-prev-p b{font-weight:700;color:#1a1a1a;}
.ph-prev-c{font:600 7.5px/1 system-ui;color:#8a8a5c;margin-top:4px;display:inline-flex;align-items:center;gap:2px;}
.ph-drawer{position:absolute;left:0;right:0;bottom:0;height:90%;background:#fff;border-radius:20px 20px 0 0;box-shadow:0 -14px 36px -12px rgba(0,0,0,.28);z-index:14;display:flex;flex-direction:column;overflow:hidden;transform:translateY(101%);animation:ph-drawer 10s cubic-bezier(.34,1.25,.5,1) infinite;}
.ph-drawer::after{content:"";position:absolute;left:0;right:0;bottom:0;height:74px;background:linear-gradient(transparent,#fff 70%);z-index:5;pointer-events:none;}
.ph-car{position:relative;height:150px;flex:0 0 auto;overflow:hidden;background:#111;}
.ph-track{display:flex;width:200%;height:100%;animation:ph-car 10s cubic-bezier(.45,0,.18,1) infinite;}
.ph-track img{width:50%;height:100%;object-fit:cover;}
.ph-handle{position:absolute;top:7px;left:50%;transform:translateX(-50%);width:32px;height:4px;border-radius:2px;background:rgba(255,255,255,.85);z-index:3;}
.ph-cartop{position:absolute;top:11px;left:9px;right:9px;display:flex;justify-content:space-between;z-index:3;}
.ph-ic{width:24px;height:24px;border-radius:50%;background:rgba(0,0,0,.42);display:flex;align-items:center;justify-content:center;color:#fff;}
.ph-ics{display:flex;gap:7px;}
.ph-dots{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);display:flex;gap:4px;z-index:3;}
.ph-dot{width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.55);}
.ph-dot.a{background:#fff;animation:ph-dot1 10s step-end infinite;}
.ph-dot.b{animation:ph-dot2 10s step-end infinite;}
.ph-body{padding:12px 14px 0;flex:1 1 auto;}
.ph-t{font:600 13px/1.3 system-ui;color:#1a1a1a;letter-spacing:-.01em;}
.ph-l{font:400 11px/1.3 system-ui;color:#4b5563;margin-top:3px;}
.ph-b{font:400 10px/1.4 system-ui;color:#4b5563;margin-top:9px;}
.ph-tag{display:inline-block;margin-top:9px;margin-right:6px;background:#f3f4f6;color:#4b5563;border-radius:999px;padding:3px 10px;font:500 9px/1 system-ui;}
.ph-d{font:400 9px/1.7 system-ui;color:#4b5563;margin-top:11px;border-top:1px solid #e5e7eb;padding-top:10px;}
.ph-bar{position:absolute;left:6px;right:6px;bottom:13px;height:42px;z-index:20;}
.ph-ctrl{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;animation:ph-ctrl 10s ease infinite;}
.ph-abar{display:flex;align-items:center;height:40px;max-width:calc(100% - 14px);border-radius:999px;padding:0 5px;gap:4px;
  background:linear-gradient(180deg,rgba(255,255,255,.82),rgba(255,255,255,.66));
  -webkit-backdrop-filter:blur(16px) saturate(1.7);backdrop-filter:blur(16px) saturate(1.7);
  border:1px solid rgba(255,255,255,.6);
  box-shadow:0 10px 30px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.85),inset 0 -1px 2px rgba(0,0,0,.06);}
.ph-toggle{display:flex;align-items:center;border-radius:999px;background:rgba(120,120,120,.12);padding:2.5px;gap:2px;flex:0 0 auto;}
.ph-tg{padding:3px 7px;border-radius:999px;font:600 8px/1 system-ui;color:#1a1a1a;}
.ph-tg.on{background:#8a8a5c;color:#fff;}
.ph-aseg{padding:4px 7px;border-radius:999px;font:600 8px/1 system-ui;color:#1a1a1a;white-space:nowrap;}
.ph-adiv{width:1px;align-self:stretch;margin:7px 0;background:rgba(120,120,120,.18);flex:0 0 auto;}
.ph-price{position:absolute;inset:0;display:flex;align-items:center;gap:6px;border-radius:999px;padding:0 5px 0 11px;opacity:0;
  background:linear-gradient(180deg,rgba(255,255,255,.92),rgba(255,255,255,.82));
  -webkit-backdrop-filter:blur(16px) saturate(1.7);backdrop-filter:blur(16px) saturate(1.7);
  border:1px solid rgba(255,255,255,.6);
  box-shadow:0 10px 30px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.85),inset 0 -1px 2px rgba(0,0,0,.06);
  animation:ph-price 10s ease infinite;}
.ph-bar-i{flex:1 1 auto;min-width:0;}
.ph-bar-p{font:400 8px/1 system-ui;color:#6b7280;white-space:nowrap;display:flex;align-items:baseline;gap:2px;}
.ph-bar-p b{font:700 13px/1 system-ui;color:#1a1a1a;}
.ph-bar-d{font:500 7.5px/1.3 system-ui;color:#9ca3af;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.ph-bar-ext{width:27px;height:27px;border-radius:50%;border:1px solid rgba(0,0,0,.10);display:flex;align-items:center;justify-content:center;color:#9ca3af;flex:0 0 auto;}
.ph-slot{position:relative;width:78px;height:31px;flex:0 0 auto;perspective:340px;}
.ph-face{position:absolute;inset:0;border-radius:999px;display:flex;align-items:center;justify-content:center;gap:5px;backface-visibility:hidden;}
.ph-view{background:#8a8a5c;color:#fff;font:700 11px/1 system-ui;animation:ph-view 10s ease infinite;}
.ph-reserve{background:#8a8a5c;color:#fff;font:700 11px/1 system-ui;animation:ph-reserve 10s cubic-bezier(.5,0,.3,1) infinite;}
.ph-pay{background:#000;color:#fff;font:600 13px/1 -apple-system,system-ui;animation:ph-pay 10s cubic-bezier(.5,0,.3,1) infinite;}
@keyframes ph-map{0%,3%{transform:scale(1)}13%,90%{transform:scale(1.34)}96%,100%{transform:scale(1)}}
@keyframes ph-ripple{0%,8%{transform:scale(.2);opacity:0}12%{opacity:.5}23%,100%{transform:scale(2.4);opacity:0}}
@keyframes ph-prev{0%,14%{opacity:0;transform:translateY(14px) scale(.97)}18%,35%{opacity:1;transform:translateY(0) scale(1)}39%,100%{opacity:0;transform:translateY(14px) scale(.97)}}
@keyframes ph-ctrl{0%,15%{opacity:1}19%,90%{opacity:0}95%,100%{opacity:1}}
@keyframes ph-price{0%,15%{opacity:0}19%,90%{opacity:1}95%,100%{opacity:0}}
@keyframes ph-drawer{0%,35%{transform:translateY(101%)}39%,90%{transform:translateY(4%)}95%,100%{transform:translateY(101%)}}
@keyframes ph-view{0%,16%{opacity:0}19%,36%{opacity:1}39%,100%{opacity:0}}
@keyframes ph-car{0%,52%{transform:translateX(0)}58%,90%{transform:translateX(-50%)}95%,100%{transform:translateX(0)}}
@keyframes ph-dot1{0%,52%{background:#fff}58%,100%{background:rgba(255,255,255,.55)}}
@keyframes ph-dot2{0%,52%{background:rgba(255,255,255,.55)}58%,90%{background:#fff}95%,100%{background:rgba(255,255,255,.55)}}
@keyframes ph-reserve{0%,38%{opacity:0;transform:rotateX(0)}41%,70%{opacity:1;transform:rotateX(0)}74%,100%{opacity:0;transform:rotateX(90deg)}}
@keyframes ph-pay{0%,70%{opacity:0;transform:rotateX(-90deg)}74%,90%{opacity:1;transform:rotateX(0)}95%,100%{opacity:0;transform:rotateX(0)}}
@media (prefers-reduced-motion: reduce){.ph-map,.ph-ripple,.ph-prev,.ph-ctrl,.ph-price,.ph-drawer,.ph-track,.ph-dot,.ph-view,.ph-reserve,.ph-pay{animation:none!important}.ph-drawer{transform:translateY(4%)}.ph-price{opacity:1}.ph-ctrl{opacity:0}.ph-prev{opacity:0}.ph-reserve{opacity:1}.ph-view,.ph-pay{opacity:0}}
`;
function NashvilleMap() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 236 470",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("rect", {
    width: "236",
    height: "470",
    fill: "#e6e7e9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M150 0 C140 90 175 150 165 240 C158 320 185 380 175 470 L236 470 L236 0 Z",
    fill: "#dfe0e3"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "200",
    cy: "300",
    rx: "34",
    ry: "44",
    fill: "#e0e1e3"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "44",
    cy: "120",
    rx: "30",
    ry: "26",
    fill: "#e0e1e3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M120 -10 C150 110 110 180 150 300 C175 380 150 430 170 480",
    stroke: "#ccced2",
    strokeWidth: "9",
    fill: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M-10 200 C70 180 120 220 236 150",
    stroke: "#ccced2",
    strokeWidth: "8",
    fill: "none"
  }), /*#__PURE__*/React.createElement("g", {
    stroke: "#d9dadd",
    strokeWidth: "2",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0 60 H236 M0 110 H236 M0 165 H236 M0 220 H236 M0 280 H236 M0 340 H236 M0 400 H236"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M40 0 V470 M80 0 V470 M120 0 V470 M160 0 V470 M200 0 V470"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0 0 L120 90 M0 470 L120 330",
    stroke: "#d2d3d6"
  })), /*#__PURE__*/React.createElement("text", {
    x: "30",
    y: "200",
    fontSize: "7",
    fill: "#abadb2",
    fontFamily: "system-ui",
    fontWeight: "700",
    letterSpacing: "1"
  }, "MUSIC ROW"), /*#__PURE__*/React.createElement("text", {
    x: "118",
    y: "100",
    fontSize: "7",
    fill: "#abadb2",
    fontFamily: "system-ui",
    fontWeight: "700",
    letterSpacing: "1"
  }, "THE GULCH"), /*#__PURE__*/React.createElement("text", {
    x: "150",
    y: "330",
    fontSize: "7",
    fill: "#abadb2",
    fontFamily: "system-ui",
    fontWeight: "700",
    letterSpacing: "1"
  }, "WEDGEWOOD"));
}
function BookingFlowPhone() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", {
    dangerouslySetInnerHTML: {
      __html: PHONE_CSS
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "ph",
    "aria-label": "Animated demo: browse a map of homes, open a listing, and check out with Apple Pay"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ph-notch"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ph-scr"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ph-map"
  }, /*#__PURE__*/React.createElement(NashvilleMap, null), PHONE_CLUSTERS.map(([x, y, n]) => /*#__PURE__*/React.createElement("span", {
    key: `c${n}-${x}`,
    className: "ph-cluster",
    style: {
      left: `${x}%`,
      top: `${y}%`
    }
  }, n)), PHONE_PINS.map(([x, y, label, sel]) => /*#__PURE__*/React.createElement("span", {
    key: label,
    className: `ph-pin${sel ? ' sel' : ''}`,
    style: {
      left: `${x}%`,
      top: `${y}%`
    }
  }, label))), /*#__PURE__*/React.createElement("span", {
    className: "ph-ripple"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ph-ctl tl"
  }, /*#__PURE__*/React.createElement(Lucide, {
    name: "list-filter",
    size: 14
  }), /*#__PURE__*/React.createElement(Lucide, {
    name: "calendar",
    size: 14
  })), /*#__PURE__*/React.createElement("div", {
    className: "ph-ctl tr"
  }, /*#__PURE__*/React.createElement(Lucide, {
    name: "heart",
    size: 13,
    fill: true
  }), /*#__PURE__*/React.createElement("span", null, "3")), /*#__PURE__*/React.createElement("div", {
    className: "ph-prev",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ph-prev-row"
  }, /*#__PURE__*/React.createElement("img", {
    src: PHONE_LISTING.img1,
    alt: ""
  }), /*#__PURE__*/React.createElement("div", {
    className: "ph-prev-i"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ph-prev-t"
  }, PHONE_LISTING.title), /*#__PURE__*/React.createElement("div", {
    className: "ph-prev-s"
  }, PHONE_LISTING.beds), /*#__PURE__*/React.createElement("div", {
    className: "ph-prev-p"
  }, /*#__PURE__*/React.createElement("b", null, PHONE_LISTING.price), " / night"), /*#__PURE__*/React.createElement("div", {
    className: "ph-prev-c"
  }, "Tap or swipe up for details ", /*#__PURE__*/React.createElement(Lucide, {
    name: "chevron-up",
    size: 9,
    strokeWidth: 2.5
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "ph-drawer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ph-car"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ph-track"
  }, /*#__PURE__*/React.createElement("img", {
    src: PHONE_LISTING.img1,
    alt: ""
  }), /*#__PURE__*/React.createElement("img", {
    src: PHONE_LISTING.img2,
    alt: ""
  })), /*#__PURE__*/React.createElement("span", {
    className: "ph-handle"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ph-cartop"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ph-ic"
  }, /*#__PURE__*/React.createElement(Lucide, {
    name: "x",
    size: 13,
    strokeWidth: 2.5
  })), /*#__PURE__*/React.createElement("span", {
    className: "ph-ics"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ph-ic"
  }, /*#__PURE__*/React.createElement(Lucide, {
    name: "share",
    size: 12
  })), /*#__PURE__*/React.createElement("span", {
    className: "ph-ic"
  }, /*#__PURE__*/React.createElement(Lucide, {
    name: "heart",
    size: 12
  })))), /*#__PURE__*/React.createElement("div", {
    className: "ph-dots"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ph-dot a"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ph-dot b"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ph-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ph-t"
  }, PHONE_LISTING.title), /*#__PURE__*/React.createElement("div", {
    className: "ph-l"
  }, PHONE_LISTING.loc), /*#__PURE__*/React.createElement("div", {
    className: "ph-b"
  }, PHONE_LISTING.beds), PHONE_LISTING.badges.map(b => /*#__PURE__*/React.createElement("span", {
    key: b,
    className: "ph-tag"
  }, b)), /*#__PURE__*/React.createElement("div", {
    className: "ph-d"
  }, PHONE_LISTING.desc))), /*#__PURE__*/React.createElement("div", {
    className: "ph-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ph-ctrl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ph-abar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ph-toggle"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ph-tg"
  }, "Grid"), /*#__PURE__*/React.createElement("span", {
    className: "ph-tg on"
  }, "Map")), /*#__PURE__*/React.createElement("span", {
    className: "ph-adiv"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ph-aseg"
  }, "Oct 19 \u2013 22"), /*#__PURE__*/React.createElement("span", {
    className: "ph-adiv"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ph-aseg"
  }, "8 guests"))), /*#__PURE__*/React.createElement("div", {
    className: "ph-price"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ph-bar-i"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ph-bar-p"
  }, /*#__PURE__*/React.createElement("b", null, PHONE_LISTING.price), " / night"), /*#__PURE__*/React.createElement("div", {
    className: "ph-bar-d"
  }, PHONE_LISTING.dates)), /*#__PURE__*/React.createElement("span", {
    className: "ph-bar-ext"
  }, /*#__PURE__*/React.createElement(Lucide, {
    name: "external-link",
    size: 12
  })), /*#__PURE__*/React.createElement("div", {
    className: "ph-slot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ph-face ph-view"
  }, "View"), /*#__PURE__*/React.createElement("div", {
    className: "ph-face ph-reserve"
  }, "Reserve"), /*#__PURE__*/React.createElement("div", {
    className: "ph-face ph-pay"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "15",
    viewBox: "0 0 384 512",
    fill: "#fff",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
  })), "Pay")))))));
}

/* ═══════════════ FixtureDataBox — trio box 1 (photo → offer.json, orange connector) ═══════════════ */

const FDB_ORANGE = '#fb923c';
const FDB_LINE_SHADOW = '0 0 3px rgba(0,0,0,0.5)';
const FDB_MONO = '"IBM Plex Mono", ui-monospace, monospace';
const FDB_PULSE_CSS = `
@keyframes fdb-pulse {
  0%   { left: 43%; top: calc(91.2% - var(--p)); opacity: 0; }
  12%  { left: 43%; top: calc(91.2% - var(--p)); opacity: 1; }
  45%  { left: 32%; top: calc(91.2% - var(--p)); }
  88%  { left: 32%; top: 64.6%; opacity: 1; }
  100% { left: 32%; top: 64.6%; opacity: 0; }
}
.fdb-pulse { left: 43%; top: calc(91.2% - var(--p)); opacity: 0; }
@media (prefers-reduced-motion: no-preference) {
  .fdb-card:hover .fdb-pulse { animation: fdb-pulse 1.5s ease-in-out infinite; }
}
`;
const FdbK = ({
  children
}) => /*#__PURE__*/React.createElement("span", {
  style: {
    color: '#fdba74'
  }
}, children);
const FdbS = ({
  children
}) => /*#__PURE__*/React.createElement("span", {
  style: {
    color: '#6ee7b7'
  }
}, children);
const FdbN = ({
  children
}) => /*#__PURE__*/React.createElement("span", {
  style: {
    color: '#fde68a'
  }
}, children);
const FdbP = ({
  children
}) => /*#__PURE__*/React.createElement("span", {
  style: {
    color: 'rgba(255,255,255,.55)'
  }
}, children);
function FixtureDataBox() {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const progress = (vh - rect.top) / (vh + rect.height);
      const clamped = Math.max(0, Math.min(1, progress));
      el.style.setProperty('--p', (clamped * 12).toFixed(2) + 'px');
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  const jsonLine = {
    whiteSpace: 'pre'
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: "fdb-card celestial-fixed",
    style: {
      position: 'relative',
      aspectRatio: '4 / 3',
      overflow: 'hidden',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.1)',
      '--p': '0px'
    }
  }, /*#__PURE__*/React.createElement("style", {
    dangerouslySetInnerHTML: {
      __html: FDB_PULSE_CSS
    }
  }), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    className: "fdb-pulse",
    style: {
      position: 'absolute',
      pointerEvents: 'none',
      height: 8,
      width: 8,
      transform: 'translate(-50%,-50%)',
      borderRadius: '50%',
      background: FDB_ORANGE,
      boxShadow: '0 0 9px 3px rgba(251,146,60,0.8)',
      zIndex: 5
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      overflow: 'hidden',
      borderRadius: 8,
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.15), 0 10px 15px -3px rgba(0,0,0,.4)',
      left: '2%',
      top: '7%',
      width: '60%',
      height: '64%'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: FIXTURES_ASSETS + 'forrest-lodge-mt-hood.jpg',
    alt: "Forrest Lodge at Mt. Hood",
    style: {
      height: '100%',
      width: '100%',
      objectFit: 'cover'
    }
  })), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      left: '32%',
      top: '64.6%',
      width: '1.5px',
      height: 'calc(26.6% - var(--p))',
      background: FDB_ORANGE,
      boxShadow: FDB_LINE_SHADOW
    }
  }), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      left: '32%',
      top: 'calc(91.2% - var(--p))',
      height: '1.5px',
      width: '11%',
      background: FDB_ORANGE,
      boxShadow: FDB_LINE_SHADOW
    }
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      height: 6,
      width: 6,
      transform: 'translate(-50%,-50%)',
      borderRadius: '50%',
      left: '32%',
      top: '64.6%',
      background: FDB_ORANGE,
      boxShadow: '0 0 0 3px rgba(251,146,60,0.25), 0 0 4px rgba(0,0,0,0.5)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      overflow: 'hidden',
      borderRadius: 8,
      background: 'rgba(0,0,0,.9)',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.1), 0 25px 50px -12px rgba(0,0,0,.6)',
      backdropFilter: 'blur(4px)',
      right: '2%',
      top: '47%',
      width: '56%',
      transform: 'translateY(calc(-1 * var(--p)))'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(255,255,255,.1)',
      padding: '4px 10px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '7.5px',
      fontWeight: 500,
      letterSpacing: '.025em',
      color: 'rgba(253,186,116,.9)',
      fontFamily: FDB_MONO
    }
  }, "offer.json"), /*#__PURE__*/React.createElement("span", {
    style: {
      borderRadius: 2,
      background: 'rgba(52,211,153,.15)',
      padding: '1px 4px',
      fontSize: '7px',
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '.05em',
      color: '#6ee7b7'
    }
  }, "bookable")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 10px',
      fontSize: '7.5px',
      lineHeight: 1.6,
      fontFamily: FDB_MONO
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: jsonLine
  }, /*#__PURE__*/React.createElement(FdbP, null, '{')), /*#__PURE__*/React.createElement("div", {
    style: jsonLine
  }, '  ', /*#__PURE__*/React.createElement(FdbK, null, "\"name\""), /*#__PURE__*/React.createElement(FdbP, null, ": "), /*#__PURE__*/React.createElement(FdbS, null, "\"Forrest Lodge \xB7 at Mt. Hood\""), /*#__PURE__*/React.createElement(FdbP, null, ",")), /*#__PURE__*/React.createElement("div", {
    style: jsonLine
  }, '  ', /*#__PURE__*/React.createElement(FdbK, null, "\"brand\""), /*#__PURE__*/React.createElement(FdbP, null, ": "), /*#__PURE__*/React.createElement(FdbS, null, "\"Cascadia Getaways\""), /*#__PURE__*/React.createElement(FdbP, null, ",")), /*#__PURE__*/React.createElement("div", {
    style: jsonLine
  }, '  ', /*#__PURE__*/React.createElement(FdbK, null, "\"dates\""), /*#__PURE__*/React.createElement(FdbP, null, ": "), /*#__PURE__*/React.createElement(FdbS, null, "\"Oct 3\u20138\""), /*#__PURE__*/React.createElement(FdbP, null, ",")), /*#__PURE__*/React.createElement("div", {
    style: jsonLine
  }, '  ', /*#__PURE__*/React.createElement(FdbK, null, "\"total\""), /*#__PURE__*/React.createElement(FdbP, null, ": "), /*#__PURE__*/React.createElement(FdbN, null, "\"$2,342\""), /*#__PURE__*/React.createElement(FdbP, null, ",")), /*#__PURE__*/React.createElement("div", {
    style: jsonLine
  }, '  ', /*#__PURE__*/React.createElement(FdbK, null, "\"checkout\""), /*#__PURE__*/React.createElement(FdbP, null, ": "), /*#__PURE__*/React.createElement(FdbS, null, "\"direct\""), /*#__PURE__*/React.createElement(FdbP, null, ",")), /*#__PURE__*/React.createElement("div", {
    style: jsonLine
  }, '  ', /*#__PURE__*/React.createElement(FdbK, null, "\"book_url\""), /*#__PURE__*/React.createElement(FdbP, null, ": "), /*#__PURE__*/React.createElement(FdbS, null, "\"cascadia.com/forrest-lodge\"")), /*#__PURE__*/React.createElement("div", {
    style: jsonLine
  }, /*#__PURE__*/React.createElement(FdbP, null, '}')))));
}

/* ═══════════════ DeviceShowcase — trio box 2 (MacBook + phone; scroll swing-in) ═══════════════
   Port note: the repo also has a cursor-driven hover "orbit" easter egg; this recreation keeps
   the scroll swing-in and resting layout, and omits the orbit. */

function DeviceShowcase() {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty('--p', '1');
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const raw = (vh - rect.top) / vh;
      const p = Math.max(0, Math.min(1, raw / 0.6));
      el.style.setProperty('--p', p.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: "celestial-fixed",
    style: {
      position: 'relative',
      aspectRatio: '4 / 3',
      overflow: 'hidden',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.1)',
      '--p': '1'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '13%',
      top: '12%',
      width: '74%',
      zIndex: 10,
      transformOrigin: 'bottom left',
      transform: 'translate(calc(-16% * (1 - var(--p))), calc(22% * (1 - var(--p)))) rotate(calc(-7deg * (1 - var(--p)))) scale(calc(1 + 0.04 * (1 - var(--p))))'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderRadius: 8,
      background: '#0a0a0a',
      padding: 3,
      boxShadow: '0 25px 50px -12px rgba(0,0,0,.5), inset 0 0 0 1px rgba(255,255,255,.2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      top: 3,
      zIndex: 10,
      height: 4,
      width: '15%',
      transform: 'translateX(-50%)',
      borderRadius: '0 0 3px 3px',
      background: '#0a0a0a'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'hidden',
      borderRadius: 5,
      aspectRatio: '16 / 10'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: FIXTURES_ASSETS + 'desktop-booking.png',
    alt: "The booking experience on desktop",
    style: {
      height: '100%',
      width: '100%',
      objectFit: 'cover',
      objectPosition: 'top'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      margin: '0 auto',
      height: 8,
      width: '106%',
      marginLeft: '-3%',
      borderRadius: '0 0 6px 6px',
      background: 'linear-gradient(to bottom, #d4d4d4, #a3a3a3, #737373)',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,.4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      top: 0,
      height: 3,
      width: '15%',
      transform: 'translateX(-50%)',
      borderRadius: '0 0 3px 3px',
      background: 'rgba(115,115,115,.7)'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: '8%',
      bottom: '7%',
      width: '21%',
      zIndex: 30,
      transformOrigin: 'top right',
      transform: 'translate(calc(10% * (1 - var(--p))), calc(-58% * (1 - var(--p)))) rotate(calc(11deg * (1 - var(--p)))) scale(calc(1 - 0.12 * (1 - var(--p))))'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderRadius: 15,
      background: '#0a0a0a',
      padding: 3,
      boxShadow: '0 25px 50px -12px rgba(0,0,0,.6), inset 0 0 0 1px rgba(255,255,255,.2)',
      aspectRatio: '9 / 19'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      top: 5,
      zIndex: 10,
      height: 4,
      width: '30%',
      transform: 'translateX(-50%)',
      borderRadius: 999,
      background: '#000'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      borderRadius: 12
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: FIXTURES_ASSETS + 'chestnut-linden-1.jpg',
    alt: "The booking experience on mobile",
    style: {
      height: '100%',
      width: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 5,
      right: 5,
      bottom: 5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 6,
      background: 'rgba(255,255,255,.95)',
      padding: '4px 6px',
      boxShadow: '0 1px 3px rgba(0,0,0,.1)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 6,
      fontWeight: 700,
      lineHeight: 1,
      color: '#171717'
    }
  }, "$315"), /*#__PURE__*/React.createElement("span", {
    style: {
      borderRadius: 999,
      background: '#171717',
      padding: '2px 6px',
      fontSize: '5.5px',
      fontWeight: 600,
      lineHeight: 1,
      color: '#fff'
    }
  }, "Book"))))));
}

/* ═══════════════ AiChannelsScan — trio box 3 (magnifying glass sweeps the AI channels) ═══════════════ */

const AI_CHANNELS = [{
  key: 'chatgpt',
  src: 'https://unpkg.com/simple-icons@latest/icons/openai.svg'
}, {
  key: 'claude',
  src: 'https://unpkg.com/simple-icons@latest/icons/claude.svg'
}, {
  key: 'perplexity',
  src: 'https://unpkg.com/simple-icons@latest/icons/perplexity.svg'
}, {
  key: 'google',
  src: 'https://unpkg.com/simple-icons@latest/icons/googlegemini.svg'
}, {
  key: 'meta',
  src: 'https://unpkg.com/simple-icons@latest/icons/meta.svg'
}];
const AI_XS = [18, 34, 50, 66, 82];
const AI_SCAN_CSS = `
@keyframes ai-sweep {
  0%   { left: 18%; top: 50%; }
  13%  { left: 82%; top: 50%; }
  27%  { left: 18%; top: 50%; }
  40%  { left: 82%; top: 50%; }
  53%  { left: 18%; top: 50%; }
  67%  { left: 82%; top: 50%; }
  80%  { left: 18%; top: 50%; }
  100% { left: 82%; top: 80%; }
}
.ai-glass { left: 18%; top: 50%; }
.ai-glass.run { animation: ai-sweep 9s ease-in-out forwards; }
`;
function AiChannelsScan() {
  const boxRef = React.useRef(null);
  const glassRef = React.useRef(null);
  const logoRefs = React.useRef([]);
  React.useEffect(() => {
    const box = boxRef.current;
    const glass = glassRef.current;
    if (!box || !glass) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let running = false;
    const AMP = 1.0;
    const apply = () => {
      const W = box.clientWidth;
      const H = box.clientHeight;
      const lensX = parseFloat(getComputedStyle(glass).left) || W / 2;
      const lensY = parseFloat(getComputedStyle(glass).top) || H / 2;
      const rowY = H * 0.5;
      const sx = W * 0.06;
      const sy = H * 0.1;
      logoRefs.current.forEach((el, i) => {
        if (!el) return;
        const dx = lensX - AI_XS[i] / 100 * W;
        const dy = lensY - rowY;
        const mag = 1 + AMP * Math.exp(-(dx * dx) / (2 * sx * sx) - dy * dy / (2 * sy * sy));
        el.style.transform = `translate(-50%, -50%) scale(${mag.toFixed(3)})`;
        el.style.opacity = (0.5 + 0.45 * (mag - 1) / AMP).toFixed(2);
      });
    };
    const tick = () => {
      raf = 0;
      apply();
      if (running) raf = requestAnimationFrame(tick);
    };
    const onEnd = () => {
      running = false;
      apply();
      if (raf) cancelAnimationFrame(raf);
    };
    glass.addEventListener('animationend', onEnd);
    const io = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      if (reduce) {
        apply();
        return;
      }
      running = true;
      glass.classList.add('run');
      raf = requestAnimationFrame(tick);
    }, {
      threshold: 0.4
    });
    io.observe(box);
    let manual = false;
    const takeOver = () => {
      if (manual) return;
      manual = true;
      running = false;
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      glass.style.animation = 'none';
    };
    const onMove = e => {
      takeOver();
      const b = box.getBoundingClientRect();
      glass.style.transition = 'none';
      logoRefs.current.forEach(el => {
        if (el) el.style.transition = 'none';
      });
      glass.style.left = ((e.clientX - b.left) / b.width * 100).toFixed(2) + '%';
      glass.style.top = ((e.clientY - b.top) / b.height * 100).toFixed(2) + '%';
      apply();
    };
    const onLeave = () => {
      if (!manual) return;
      glass.style.transition = 'left .5s ease, top .5s ease';
      glass.style.left = '82%';
      glass.style.top = '80%';
      logoRefs.current.forEach(el => {
        if (!el) return;
        el.style.transition = 'transform .4s ease, opacity .4s ease';
        el.style.transform = 'translate(-50%, -50%) scale(1)';
        el.style.opacity = '0.55';
      });
    };
    box.addEventListener('pointermove', onMove);
    box.addEventListener('pointerleave', onLeave);
    return () => {
      io.disconnect();
      glass.removeEventListener('animationend', onEnd);
      box.removeEventListener('pointermove', onMove);
      box.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    ref: boxRef,
    className: "celestial-fixed",
    style: {
      position: 'relative',
      aspectRatio: '4 / 3',
      cursor: 'none',
      overflow: 'hidden',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.1)'
    }
  }, /*#__PURE__*/React.createElement("style", {
    dangerouslySetInnerHTML: {
      __html: AI_SCAN_CSS
    }
  }), /*#__PURE__*/React.createElement("div", {
    ref: glassRef,
    "aria-hidden": "true",
    className: "ai-glass",
    style: {
      position: 'absolute',
      pointerEvents: 'none',
      zIndex: 0,
      width: '36%',
      transform: 'translate(-37%, -34%)',
      filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.55))'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: FIXTURES_ASSETS + 'magnifying-glass.webp',
    alt: "",
    style: {
      display: 'block',
      width: '100%'
    }
  })), AI_CHANNELS.map(({
    key,
    src
  }, i) => /*#__PURE__*/React.createElement("div", {
    key: key,
    ref: el => {
      logoRefs.current[i] = el;
    },
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      top: '50%',
      zIndex: 10,
      opacity: 0.55,
      left: `${AI_XS[i]}%`,
      transform: 'translate(-50%, -50%)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: key,
    style: {
      height: 28,
      width: 28,
      display: 'block',
      filter: 'invert(1)'
    }
  }))));
}
Object.assign(window, {
  Lucide,
  BookingFlowPhone,
  FixtureDataBox,
  DeviceShowcase,
  AiChannelsScan,
  FIXTURES_ASSETS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/fixtures-visuals.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pitch-deck/deck-app.jsx
try { (() => {
const {
  TitleSlide,
  DividerSlide,
  BigStatSlide,
  CompareSlide,
  QuoteSlide
} = window.KismetAuroraDesignSystem_50c149;
function buildDeckSlides() {
  return [/*#__PURE__*/React.createElement(TitleSlide, {
    title: "The direct-booking layer for independent stays",
    sub: "How independents keep the guest, the margin, and the brand in an AI-booked world.",
    meta: "Series A \xB7 2026"
  }), /*#__PURE__*/React.createElement(DividerSlide, {
    no: "02",
    title: "Why direct wins",
    meta: "02 / 05"
  }), /*#__PURE__*/React.createElement(BigStatSlide, {
    eyebrow: "Per booking, kept",
    value: /*#__PURE__*/React.createElement(React.Fragment, null, "$300 ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#8892A3',
        fontSize: '.5em',
        WebkitTextFillColor: '#8892A3'
      }
    }, "vs"), " $240"),
    caption: "What an independent keeps on a $300 stay \u2014 direct with Kismet vs after an OTA commission.",
    meta: "03 / 05"
  }), /*#__PURE__*/React.createElement(CompareSlide, {
    title: "Same booking, different economics",
    left: {
      title: 'OTAs',
      items: ['Hide data behind JavaScript', 'Take 15–20% commission', 'Own the guest relationship']
    },
    right: {
      title: 'Kismet',
      items: ['Expose structured, AI-readable data', 'Keep your margin', 'You own the guest']
    },
    meta: "04 / 05"
  }), /*#__PURE__*/React.createElement(QuoteSlide, {
    quote: "\u201CGuests book us directly again \u2014 the margin came home.\u201D",
    by: "Maya R. \xB7 Owner, Casa Palma",
    meta: "05 / 05"
  })];
}
function DeckApp() {
  const deckSlides = React.useMemo(buildDeckSlides, []);
  const [i, setI] = React.useState(() => {
    const n = parseInt(localStorage.getItem('kismet-deck-slide') || '0', 10);
    return Number.isFinite(n) && n >= 0 && n < deckSlides.length ? n : 0;
  });
  const go = n => {
    const next = Math.max(0, Math.min(deckSlides.length - 1, n));
    setI(next);
    localStorage.setItem('kismet-deck-slide', String(next));
  };
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowRight') go(i + 1);
      if (e.key === 'ArrowLeft') go(i - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
  const navBtn = {
    fontFamily: 'var(--mono)',
    fontSize: '.72rem',
    letterSpacing: '.04em',
    color: 'var(--tx-soft)',
    background: '#fff',
    border: '1px solid var(--line-strong)',
    borderRadius: 999,
    padding: '.4rem .95rem',
    cursor: 'pointer'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 14,
      padding: '20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 'min(1100px, 94vw)'
    },
    "data-screen-label": `Slide ${String(i + 1).padStart(2, '0')}`
  }, deckSlides[i]), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: navBtn,
    onClick: () => go(i - 1)
  }, "\u2190 Prev"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: '.72rem',
      color: 'var(--tx-faint)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, String(i + 1).padStart(2, '0'), " / ", String(deckSlides.length).padStart(2, '0')), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: navBtn,
    onClick: () => go(i + 1)
  }, "Next \u2192")));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(DeckApp, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pitch-deck/deck-app.jsx", error: String((e && e.message) || e) }); }

__ds_ns.CtaBanner = __ds_scope.CtaBanner;

__ds_ns.FeatureGrid = __ds_scope.FeatureGrid;

__ds_ns.Hero = __ds_scope.Hero;

__ds_ns.PressWall = __ds_scope.PressWall;

__ds_ns.Quote = __ds_scope.Quote;

__ds_ns.SiteFooter = __ds_scope.SiteFooter;

__ds_ns.StatBand = __ds_scope.StatBand;

__ds_ns.BarChart = __ds_scope.BarChart;

__ds_ns.AURORA_STOPS = __ds_scope.AURORA_STOPS;

__ds_ns.LineChart = __ds_scope.LineChart;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Headline = __ds_scope.Headline;

__ds_ns.Section = __ds_scope.Section;

__ds_ns.Subhead = __ds_scope.Subhead;

__ds_ns.Wordmark = __ds_scope.Wordmark;

__ds_ns.BigStatSlide = __ds_scope.BigStatSlide;

__ds_ns.BulletsSlide = __ds_scope.BulletsSlide;

__ds_ns.ChartSlide = __ds_scope.ChartSlide;

__ds_ns.CompareSlide = __ds_scope.CompareSlide;

__ds_ns.DividerSlide = __ds_scope.DividerSlide;

__ds_ns.QuoteSlide = __ds_scope.QuoteSlide;

__ds_ns.TitleSlide = __ds_scope.TitleSlide;

__ds_ns.SFoot = __ds_scope.SFoot;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.EmailCapture = __ds_scope.EmailCapture;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.GlobalHeader = __ds_scope.GlobalHeader;

__ds_ns.KnockoutWindow = __ds_scope.KnockoutWindow;

})();
