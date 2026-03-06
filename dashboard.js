// Greenbay Investor Intelligence Deck
// Slide-based pitch deck with canonical data layer

(function() {
"use strict";

try {

var React = window.React;
var ReactDOM = window.ReactDOM;
var Recharts = window.Recharts;

var useState = React.useState;
var useEffect = React.useEffect;
var useCallback = React.useCallback;
var createElement = React.createElement;

// Recharts components
var LineChart = Recharts.LineChart;
var BarChart = Recharts.BarChart;
var AreaChart = Recharts.AreaChart;
var PieChart = Recharts.PieChart;
var Line = Recharts.Line;
var Bar = Recharts.Bar;
var Area = Recharts.Area;
var Pie = Recharts.Pie;
var XAxis = Recharts.XAxis;
var YAxis = Recharts.YAxis;
var CartesianGrid = Recharts.CartesianGrid;
var Tooltip = Recharts.Tooltip;
var Legend = Recharts.Legend;
var ResponsiveContainer = Recharts.ResponsiveContainer;
var Cell = Recharts.Cell;

// ============ COLOR PALETTE ============
var COLORS = {
  primary: "#00d4aa",
  secondary: "#6366f1",
  accent: "#f59e0b",
  danger: "#ef4444",
  success: "#22c55e",
  info: "#3b82f6",
  purple: "#a855f7",
  pink: "#ec4899",
  cyan: "#06b6d4",
  orange: "#f97316",
  lime: "#84cc16",
  emerald: "#10b981",
  background: "#050B18",
  card: "#0d1525",
  cardHover: "#1a2744",
  border: "#1e3a5f",
  text: "#e5e7eb",
  textMuted: "#9ca3af",
  textDim: "#6b7280"
};

var CHART_COLORS = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.info, COLORS.purple, COLORS.pink, COLORS.cyan, COLORS.orange];

// ============ LOAD CANONICAL DATA ============
var DATA = window.__GREENBAY_CANONICAL__ || {};
var ms = DATA.market_sizing || {};
var fleet = DATA.fleet_stats || {};
var arr = DATA.arr_scenarios || {};
var comp = DATA.competitive_landscape || {};
var ue = DATA.unit_economics || {};
var gartner = DATA.gartner || {};
var sources = DATA.sources || {};
var meta = DATA.meta || {};

function findMethodology(id) {
  if (!ms.methodologies) return {};
  return ms.methodologies.find(function(m) { return m.id === id; }) || {};
}

var bottomUp = findMethodology('bottom_up_orchestration');
var topDown = findMethodology('top_down_fleet_mgmt');

// ============ FORMAT HELPERS ============
function fmt(n, prefix, suffix) {
  if (n == null) return '\u2014';
  prefix = prefix || '';
  suffix = suffix || '';
  if (n >= 1000) return prefix + (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K' + suffix;
  if (n >= 1 && n < 1000) return prefix + n.toLocaleString() + suffix;
  return prefix + n + suffix;
}

function fmtM(n) {
  if (n == null) return '\u2014';
  if (n >= 1000) return '$' + (n / 1000).toFixed(1).replace(/\.0$/, '') + 'B';
  return '$' + n + 'M';
}

function fmtB(n) {
  if (n == null) return '\u2014';
  return '$' + n + 'B';
}

// ============ ICON SYSTEM ============
var ICON_PATHS = {
  satellite: "M3 12h2m14 0h2M12 3v2m0 14v2M5.6 5.6l1.4 1.4m10 10l1.4 1.4M5.6 18.4l1.4-1.4m10-10l1.4-1.4M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0",
  plug: "M12 2v4m-4-2v4m8-4v4M8 8h8v4a4 4 0 0 1-4 4 4 4 0 0 1-4-4V8zm4 8v6",
  bolt: "M13 2L4.5 12.5h6L9 22l9.5-11.5h-6L13 2z",
  "cloud-sun": "M6 19a4 4 0 0 1-.8-7.9A5.5 5.5 0 0 1 16.8 10 3 3 0 0 1 18 16H6zM17 6l1-2m-1 8h2M7 3l-1 2",
  calendar: "M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6zm4-4v4m8-4v4M4 10h16",
  wrench: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
  "bar-chart": "M4 20h16M4 20V10m0 10h4V4h4v16h4v-8h4v8",
  bell: "M10 5a2 2 0 1 1 4 0 7 7 0 0 1 4 6v3l2 2H4l2-2v-3a7 7 0 0 1 4-6m-1.5 14a2.5 2.5 0 0 0 5 0",
  "map-pin": "M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6",
  lightbulb: "M9 18h6m-5 2h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z",
  "trending-up": "M22 7l-8.5 8.5-5-5L2 17m20-10h-6m6 0v6",
  link: "M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7.1-7.1l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7.1 7.1l1.7-1.7",
  "shield-check": "M12 2l8 4v5c0 5.5-3.8 10.7-8 12-4.2-1.3-8-6.5-8-12V6l8-4zm-2 10l2 2 4-4",
  cpu: "M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6zm4 2h8v8H8V8zm1-6v2m6-2v2M9 22v-2m6 2v-2M2 9h2m0 6H2m20-6h-2m2 6h-2",
  truck: "M1 3h15v13H1V3zm15 8h4l3 3v5h-7v-8zM5.5 18a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm13 0a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
  globe: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 0c2.5 0 4 4.5 4 10s-1.5 10-4 10-4-4.5-4-10 1.5-10 4-10zM2 12h20",
  users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m7-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm11 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  target: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4",
  layers: "M2 12l10 6 10-6M2 17l10 6 10-6M12 2l10 6-10 6L2 8l10-6z",
  rocket: "M4.5 16.5c-1.5 1.3-2 4.1-2 4.1s2.8-.5 4.1-2M12 15l-3-3m3 3c3-3.3 5.5-9.5 9-13-3.5 3.5-9.7 6-13 9m3 3l-3 3m6-6l3-3M6 12l-3 3",
  "dollar-sign": "M12 2v20m5-17c-1-1.3-3-2-5-2s-5 1.5-5 4c0 5 10 3 10 8 0 2.5-3 4-5 4s-4-.7-5-2",
  briefcase: "M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8zm5-4h6v2H9V4zm-5 8h16",
  zap: "M13 2L4.5 12.5h6L9 22l9.5-11.5h-6L13 2z",
  handshake: "M2 14l4-4 4 4m8-4l-4 4-4-4M7 10h10M4 18l3-4m13 4l-3-4",
  "external-link": "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m4-3h6v6m-11 5L21 3"
};

function Icon(name, size, color) {
  var s = size || 24;
  var c = color || COLORS.text;
  var p = ICON_PATHS[name];
  if (!p) return null;
  return createElement("svg", {
    width: s, height: s, viewBox: "0 0 24 24",
    fill: "none", stroke: c, strokeWidth: 1.8,
    strokeLinecap: "round", strokeLinejoin: "round",
    style: { flexShrink: 0 }
  }, createElement("path", { d: p }));
}

// ============ SLIDE TITLES ============
var SLIDE_TITLES = [
  "Greenbay",
  "The Problem",
  "The Solution",
  "Why Now",
  "Market Opportunity",
  "Why Greenbay Wins",
  "Traction",
  "Team",
  "Business Model",
  "Vision",
  "The Ask",
  "Appendix"
];

var TOTAL_SLIDES = SLIDE_TITLES.length;

// ============ PITCH DECK STYLES ============
var S = {
  app: {
    fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
    background: COLORS.background,
    color: COLORS.text,
    minHeight: "100vh",
    overflow: "hidden",
    position: "relative"
  },
  slide: {
    minHeight: "100vh",
    padding: "60px 80px 80px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: 1280,
    margin: "0 auto",
    opacity: 1,
    transition: "opacity 0.3s ease"
  },
  slideTitle: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: 42,
    color: COLORS.text,
    margin: "0 0 12px",
    letterSpacing: "-1px"
  },
  slideSubtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
    marginBottom: 40,
    lineHeight: 1.6,
    maxWidth: 700
  },
  heroMetric: {
    background: COLORS.card,
    borderRadius: 16,
    border: "1px solid " + COLORS.border,
    padding: "32px 24px",
    textAlign: "center",
    flex: 1
  },
  heroValue: {
    fontSize: 48,
    fontWeight: 700,
    letterSpacing: "-2px",
    margin: "8px 0 6px"
  },
  heroLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontWeight: 600
  },
  heroSub: {
    fontSize: 12,
    color: COLORS.textDim,
    marginTop: 8
  },
  metricCard: {
    background: COLORS.card,
    borderRadius: 16,
    border: "1px solid " + COLORS.border,
    padding: "24px 20px",
    textAlign: "center"
  },
  metricValue: {
    fontSize: 36,
    fontWeight: 700,
    letterSpacing: "-1px",
    margin: "8px 0 4px"
  },
  metricLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontWeight: 600
  },
  metricSub: {
    fontSize: 11,
    color: COLORS.textDim,
    marginTop: 6
  },
  chartCard: {
    background: COLORS.card,
    borderRadius: 16,
    border: "1px solid " + COLORS.border,
    padding: "28px 24px"
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: COLORS.text,
    marginBottom: 4
  },
  chartSubtitle: {
    fontSize: 11,
    color: COLORS.textDim,
    marginBottom: 20,
    fontFamily: "'DM Mono', monospace"
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 24,
    marginBottom: 32
  },
  grid5: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: 20,
    marginBottom: 32
  },
  card: {
    background: COLORS.card,
    borderRadius: 16,
    border: "1px solid " + COLORS.border,
    padding: 28,
    transition: "border-color 0.2s"
  },
  tag: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: 8,
    fontSize: 10,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  tagGreen: { background: "rgba(34,197,94,0.15)", color: COLORS.success },
  tagBlue: { background: "rgba(59,130,246,0.15)", color: COLORS.info },
  tagYellow: { background: "rgba(245,158,11,0.15)", color: COLORS.accent },
  tagRed: { background: "rgba(239,68,68,0.15)", color: COLORS.danger },
  // Navigation
  navDots: {
    position: "fixed",
    right: 28,
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    zIndex: 100
  },
  navDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    border: "2px solid " + COLORS.border,
    background: "transparent",
    cursor: "pointer",
    padding: 0,
    transition: "all 0.2s"
  },
  navDotActive: {
    background: COLORS.primary,
    border: "2px solid " + COLORS.primary,
    transform: "scale(1.3)"
  },
  slideCounter: {
    position: "fixed",
    bottom: 28,
    left: 36,
    fontSize: 12,
    color: COLORS.textDim,
    fontFamily: "'DM Mono', monospace",
    zIndex: 100
  },
  navArrow: {
    position: "fixed",
    bottom: 28,
    background: "none",
    border: "1px solid " + COLORS.border,
    borderRadius: 8,
    color: COLORS.textMuted,
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    transition: "all 0.2s",
    zIndex: 100
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    display: "inline-block"
  }
};

var tooltipStyle = {
  backgroundColor: '#0d1525',
  border: '1px solid #1e3a5f',
  borderRadius: 8,
  fontSize: 12,
  fontFamily: "'DM Mono', monospace"
};

// ============ SLIDE 1: TITLE ============
function SlideTitle() {
  // Inject keyframes
  var styleTag = createElement("style", null,
    // Breathing green glow on logo
    "@keyframes titleLogoGlow { 0%, 100% { filter: drop-shadow(0 0 20px rgba(0,212,170,0.3)); } 50% { filter: drop-shadow(0 0 40px rgba(0,212,170,0.6)) drop-shadow(0 0 80px rgba(0,212,170,0.2)); } } " +
    // Subtle text-shadow breathing on title
    "@keyframes titleTextGlow { 0%, 100% { text-shadow: 0 0 30px rgba(0,212,170,0.08); } 50% { text-shadow: 0 0 50px rgba(0,212,170,0.2), 0 0 100px rgba(0,212,170,0.08); } }"
  );

  return createElement("div", {
    style: Object.assign({}, S.slide, {
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center"
    })
  },
    styleTag,
    createElement("img", {
      src: "assets/greenbay-logo.png",
      alt: "Greenbay",
      style: {
        width: 140,
        height: 140,
        objectFit: "contain",
        marginBottom: 32,
        filter: "drop-shadow(0 0 20px rgba(0,212,170,0.3))",
        animation: "titleLogoGlow 3.5s ease-in-out infinite"
      }
    }),
    createElement("h1", {
      style: {
        fontFamily: "'DM Serif Display', serif",
        fontSize: 72,
        color: COLORS.text,
        margin: "0 0 16px",
        letterSpacing: "-2px",
        animation: "titleTextGlow 4s ease-in-out infinite"
      }
    }, "Greenbay"),
    createElement("p", {
      style: {
        fontSize: 22,
        color: COLORS.primary,
        fontWeight: 500,
        marginBottom: 32,
        maxWidth: 600,
        lineHeight: 1.5
      }
    }, "The Orchestration Layer for Modern Fleets"),
    createElement("div", {
      style: {
        color: COLORS.textDim,
        fontSize: 12,
        opacity: 0.6
      }
    },
      createElement("span", { style: { marginRight: 8 } }, "\u2192"),
      "Press arrow keys or click dots to navigate"
    )
  );
}

// ============ SLIDE 2: THE PROBLEM ============
function SlideProblem() {
  // Alarm metric cards data
  var alarmMetrics = [
    { value: "5\u20138", label: "Siloed Tools Per Operator" },
    { value: "40%", label: "Time Lost to Manual Bridging" },
    { value: "0", label: "Unified Platforms" }
  ];

  // Tool chaos chips (spread across full width)
  var chaosTools = [
    { label: "Telematics", top: 10, left: 5, rot: -6 },
    { label: "Charging Mgmt", top: 6, left: 38, rot: 4 },
    { label: "Routing", top: 8, left: 72, rot: -5 },
    { label: "Maintenance", top: 38, left: 15, rot: 5 },
    { label: "Compliance", top: 40, left: 55, rot: -3 },
    { label: "ELD", top: 36, left: 82, rot: 6 },
    { label: "Billing", top: 70, left: 35, rot: -4 }
  ];
  var chaosColors = ["#ef4444", "#f97316", "#d97706", "#b45309", "#dc2626", "#c2410c", "#ef4444"];

  // Tangled lines between tool chips (wider spread)
  var tangledLines = [
    { x1: 10, y1: 16, x2: 44, y2: 12, color: "rgba(239,68,68,0.15)" },
    { x1: 44, y1: 12, x2: 78, y2: 14, color: "rgba(249,115,22,0.15)" },
    { x1: 20, y1: 44, x2: 60, y2: 46, color: "rgba(249,115,22,0.12)" },
    { x1: 60, y1: 46, x2: 88, y2: 42, color: "rgba(217,119,6,0.12)" },
    { x1: 10, y1: 16, x2: 20, y2: 44, color: "rgba(239,68,68,0.1)" },
    { x1: 78, y1: 14, x2: 88, y2: 42, color: "rgba(220,38,38,0.1)" },
    { x1: 20, y1: 44, x2: 78, y2: 14, color: "rgba(194,65,12,0.08)" },
    { x1: 40, y1: 76, x2: 20, y2: 44, color: "rgba(239,68,68,0.08)" },
    { x1: 40, y1: 76, x2: 60, y2: 46, color: "rgba(217,119,6,0.08)" }
  ];

  // Inject keyframes
  var styleTag = createElement("style", null,
    // Alarm pulse — red glow breathing on metric cards
    "@keyframes alarmPulse { 0%, 100% { box-shadow: 0 0 20px rgba(239,68,68,0.08), 0 0 40px rgba(239,68,68,0.04); } 50% { box-shadow: 0 0 35px rgba(239,68,68,0.2), 0 0 70px rgba(239,68,68,0.08); } } " +
    // Chaos drift per tool chip
    "@keyframes alarmDrift0 { 0%,100% { transform: translate(0,0) rotate(-6deg); } 33% { transform: translate(3px,-4px) rotate(-5deg); } 66% { transform: translate(-2px,3px) rotate(-7deg); } } " +
    "@keyframes alarmDrift1 { 0%,100% { transform: translate(0,0) rotate(4deg); } 33% { transform: translate(-3px,3px) rotate(5deg); } 66% { transform: translate(4px,-2px) rotate(3deg); } } " +
    "@keyframes alarmDrift2 { 0%,100% { transform: translate(0,0) rotate(-8deg); } 33% { transform: translate(2px,4px) rotate(-7deg); } 66% { transform: translate(-3px,-2px) rotate(-9deg); } } " +
    "@keyframes alarmDrift3 { 0%,100% { transform: translate(0,0) rotate(5deg); } 33% { transform: translate(-4px,-3px) rotate(6deg); } 66% { transform: translate(3px,2px) rotate(4deg); } } " +
    "@keyframes alarmDrift4 { 0%,100% { transform: translate(0,0) rotate(-3deg); } 33% { transform: translate(3px,3px) rotate(-2deg); } 66% { transform: translate(-2px,-4px) rotate(-4deg); } } " +
    "@keyframes alarmDrift5 { 0%,100% { transform: translate(0,0) rotate(6deg); } 33% { transform: translate(-3px,4px) rotate(7deg); } 66% { transform: translate(4px,-3px) rotate(5deg); } } " +
    "@keyframes alarmDrift6 { 0%,100% { transform: translate(0,0) rotate(-4deg); } 33% { transform: translate(2px,-3px) rotate(-3deg); } 66% { transform: translate(-3px,2px) rotate(-5deg); } } " +
    // Red streaming dots along tangled lines
    "@keyframes alarmStream { 0% { left: -4px; opacity: 0; } 10% { opacity: 0.8; } 85% { opacity: 0.8; } 100% { left: calc(100% + 4px); opacity: 0; } }"
  );

  // Alarm metric cards row
  var metricCards = createElement("div", {
    style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 32 }
  },
    alarmMetrics.map(function(m, i) {
      return createElement("div", {
        key: "alarm-" + i,
        style: {
          background: COLORS.card,
          borderRadius: 16,
          border: "1px solid rgba(239,68,68,0.25)",
          padding: "28px 24px",
          textAlign: "center",
          animation: "alarmPulse 3s ease-in-out infinite",
          animationDelay: (i * 0.4) + "s"
        }
      },
        createElement("div", {
          style: {
            fontSize: 44,
            fontWeight: 700,
            color: COLORS.danger,
            letterSpacing: "-2px",
            lineHeight: 1,
            marginBottom: 10,
            fontFamily: "'DM Mono', monospace"
          }
        }, m.value),
        createElement("div", {
          style: {
            fontSize: 13,
            fontWeight: 700,
            color: COLORS.text,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: 6
          }
        }, m.label),
        null
      );
    })
  );

  // Tool Chaos visual (full width)
  var chaosVisual = createElement("div", {
    style: {
      position: "relative",
      height: 320,
      background: "radial-gradient(ellipse at 50% 50%, rgba(239,68,68,0.05) 0%, transparent 70%)",
      borderRadius: 16,
      border: "1px solid rgba(239,68,68,0.1)",
      overflow: "hidden"
    }
  },
    // Zone label
    createElement("div", {
      style: {
        position: "absolute",
        top: 12,
        left: 0,
        right: 0,
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "2px",
        color: COLORS.danger,
        opacity: 0.4,
        textAlign: "center",
        zIndex: 3
      }
    }, "Today\u2019s Fleet Tech Stack"),
    // Tangled lines
    tangledLines.map(function(line, i) {
      var dx = line.x2 - line.x1;
      var dy = line.y2 - line.y1;
      var len = Math.sqrt(dx * dx + dy * dy);
      var angle = Math.atan2(dy, dx) * 180 / Math.PI;
      return createElement("div", {
        key: "tl-" + i,
        style: {
          position: "absolute",
          top: line.y1 + "%",
          left: line.x1 + "%",
          width: len + "%",
          height: 1,
          background: line.color,
          transformOrigin: "0 0",
          transform: "rotate(" + angle + "deg)",
          pointerEvents: "none"
        }
      },
        // Streaming dot
        createElement("div", {
          key: "adot-" + i,
          style: {
            position: "absolute",
            top: -2,
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: COLORS.danger,
            opacity: 0.6,
            animation: "alarmStream " + (2.2 + i * 0.15).toFixed(1) + "s linear infinite",
            animationDelay: (i * 0.35).toFixed(1) + "s"
          }
        })
      );
    }),
    // Scattered tool chips
    chaosTools.map(function(tool, i) {
      var driftDuration = [4.5, 5.2, 3.8, 4.8, 5.5, 4.1, 4.4][i];
      return createElement("div", {
        key: "tool-" + i,
        style: {
          position: "absolute",
          top: tool.top + "%",
          left: tool.left + "%",
          animation: "alarmDrift" + i + " " + driftDuration + "s ease-in-out infinite",
          background: "rgba(30,20,15,0.75)",
          border: "1px solid " + chaosColors[i] + "44",
          borderRadius: 10,
          padding: "6px 12px",
          fontSize: 10,
          fontWeight: 600,
          color: chaosColors[i],
          opacity: 0.85,
          whiteSpace: "nowrap",
          zIndex: 2
        }
      }, tool.label);
    })
  );

  return createElement("div", { style: S.slide },
    styleTag,
    createElement("h2", { style: S.slideTitle }, "The Problem"),
    createElement("p", { style: S.slideSubtitle },
      "Disconnected. Fragmented. Broken."
    ),
    metricCards,
    chaosVisual
  );
}

// ============ SLIDE 3: THE SOLUTION ============
function SlideSolution() {
  var inputs = [
    { svgIcon: "satellite", label: "Telematics & GPS" },
    { svgIcon: "plug", label: "EV Chargers" },
    { svgIcon: "bolt", label: "Grid & Energy" },
    { svgIcon: "cloud-sun", label: "Weather & Traffic" },
    { svgIcon: "calendar", label: "Fleet Schedules" },
    { svgIcon: "wrench", label: "Vehicle Health" }
  ];

  var capabilities = [
    { title: "Charge Orchestration", color: COLORS.primary },
    { title: "Route Intelligence", color: COLORS.secondary },
    { title: "Energy Management", color: COLORS.accent },
    { title: "Fleet Analytics", color: COLORS.info }
  ];

  var outputs = [
    { svgIcon: "bar-chart", label: "Real-time Dashboards" },
    { svgIcon: "bell", label: "Automated Alerts" },
    { svgIcon: "map-pin", label: "Route Recommendations" },
    { svgIcon: "lightbulb", label: "Energy Optimization" },
    { svgIcon: "trending-up", label: "Performance Reports" },
    { svgIcon: "link", label: "API Integrations" }
  ];

  // Scattered positions for chaos particles (left zone, percentages of zone)
  var chaosPositions = [
    { top: 8, left: 12, rot: -6 },
    { top: 2, left: 58, rot: 4 },
    { top: 30, left: 4, rot: -8 },
    { top: 26, left: 52, rot: 5 },
    { top: 52, left: 18, rot: -3 },
    { top: 56, left: 60, rot: 6 }
  ];

  // Muted chaos colors
  var chaosColors = ["#ef4444", "#f97316", "#d97706", "#b45309", "#dc2626", "#c2410c"];

  // Container height for the visual area
  var vizHeight = 420;

  // Inject keyframes for all animations
  var styleTag = createElement("style", null,
    // Prism glow breathing
    "@keyframes prismPulse { 0%, 100% { box-shadow: 0 0 30px rgba(0,212,170,0.12), 0 0 60px rgba(0,212,170,0.06); } 50% { box-shadow: 0 0 50px rgba(0,212,170,0.25), 0 0 90px rgba(0,212,170,0.1); } } " +
    // Chaos particle drift — subtle floating wobble
    "@keyframes chaosDrift0 { 0%,100% { transform: translate(0,0) rotate(-6deg); } 33% { transform: translate(3px,-4px) rotate(-5deg); } 66% { transform: translate(-2px,3px) rotate(-7deg); } } " +
    "@keyframes chaosDrift1 { 0%,100% { transform: translate(0,0) rotate(4deg); } 33% { transform: translate(-3px,3px) rotate(5deg); } 66% { transform: translate(4px,-2px) rotate(3deg); } } " +
    "@keyframes chaosDrift2 { 0%,100% { transform: translate(0,0) rotate(-8deg); } 33% { transform: translate(2px,4px) rotate(-7deg); } 66% { transform: translate(-3px,-2px) rotate(-9deg); } } " +
    "@keyframes chaosDrift3 { 0%,100% { transform: translate(0,0) rotate(5deg); } 33% { transform: translate(-4px,-3px) rotate(6deg); } 66% { transform: translate(3px,2px) rotate(4deg); } } " +
    "@keyframes chaosDrift4 { 0%,100% { transform: translate(0,0) rotate(-3deg); } 33% { transform: translate(3px,3px) rotate(-2deg); } 66% { transform: translate(-2px,-4px) rotate(-4deg); } } " +
    "@keyframes chaosDrift5 { 0%,100% { transform: translate(0,0) rotate(6deg); } 33% { transform: translate(-3px,4px) rotate(7deg); } 66% { transform: translate(4px,-3px) rotate(5deg); } } " +
    // Streaming dots flowing along lines
    "@keyframes streamFlow { 0% { left: -4px; opacity: 0; } 10% { opacity: 1; } 85% { opacity: 1; } 100% { left: calc(100% + 4px); opacity: 0; } } " +
    // Prism inner orbit rotation
    "@keyframes prismOrbit { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } " +
    // Output card pulse — staggered glow
    "@keyframes outputPulse { 0%, 100% { border-color: rgba(0,212,170,0.12); box-shadow: none; } 50% { border-color: rgba(0,212,170,0.35); box-shadow: 0 0 12px rgba(0,212,170,0.08); } }"
  );

  // ── ZONE 1: CHAOS (left) ──
  var chaosZone = createElement("div", {
    style: {
      position: "relative",
      width: "28%",
      height: vizHeight,
      flexShrink: 0
    }
  },
    // Zone label
    createElement("div", {
      style: {
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "2px",
        color: "#ef4444",
        opacity: 0.5,
        textAlign: "center",
        marginBottom: 4
      }
    }, "IN"),
    // Background tint
    createElement("div", {
      style: {
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "radial-gradient(ellipse at 50% 50%, rgba(239,68,68,0.04) 0%, transparent 70%)",
        borderRadius: 16,
        pointerEvents: "none"
      }
    }),
    // Tangled lines between particles (decorative crossing lines)
    [
      { x1: 18, y1: 14, x2: 64, y2: 8, color: "rgba(239,68,68,0.12)" },
      { x1: 10, y1: 36, x2: 58, y2: 32, color: "rgba(249,115,22,0.1)" },
      { x1: 24, y1: 58, x2: 66, y2: 62, color: "rgba(217,119,6,0.1)" },
      { x1: 64, y1: 8, x2: 10, y2: 36, color: "rgba(239,68,68,0.08)" },
      { x1: 58, y1: 32, x2: 24, y2: 58, color: "rgba(249,115,22,0.08)" },
      { x1: 18, y1: 14, x2: 24, y2: 58, color: "rgba(220,38,38,0.06)" },
      { x1: 64, y1: 8, x2: 66, y2: 62, color: "rgba(194,65,12,0.06)" }
    ].map(function(line, i) {
      var dx = line.x2 - line.x1;
      var dy = line.y2 - line.y1;
      var len = Math.sqrt(dx * dx + dy * dy);
      var angle = Math.atan2(dy, dx) * 180 / Math.PI;
      return createElement("div", {
        key: "tl-" + i,
        style: {
          position: "absolute",
          top: line.y1 + "%",
          left: line.x1 + "%",
          width: len + "%",
          height: 1,
          background: line.color,
          transformOrigin: "0 0",
          transform: "rotate(" + angle + "deg)",
          pointerEvents: "none"
        }
      });
    }),
    // Scattered particles with drift animation
    inputs.map(function(item, i) {
      var pos = chaosPositions[i];
      var driftDuration = [4.5, 5.2, 3.8, 4.8, 5.5, 4.1][i];
      return createElement("div", {
        key: "chaos-" + i,
        style: {
          position: "absolute",
          top: pos.top + "%",
          left: pos.left + "%",
          animation: "chaosDrift" + i + " " + driftDuration + "s ease-in-out infinite",
          background: "rgba(30,20,15,0.7)",
          border: "1px solid " + chaosColors[i] + "44",
          borderRadius: 10,
          padding: "7px 12px",
          display: "flex",
          alignItems: "center",
          gap: 7,
          whiteSpace: "nowrap",
          zIndex: 2
        }
      },
        Icon(item.svgIcon, 14, chaosColors[i]),
        createElement("span", {
          style: { fontSize: 10, fontWeight: 600, color: chaosColors[i], opacity: 0.8 }
        }, item.label)
      );
    })
  );

  // ── CONVERGENCE LINES (chaos → prism) with streaming dots ──
  var convergenceLines = createElement("div", {
    style: {
      position: "relative",
      width: "6%",
      height: vizHeight,
      flexShrink: 0,
      overflow: "hidden"
    }
  },
    // Static lines
    inputs.map(function(item, i) {
      var pos = chaosPositions[i];
      var startY = pos.top + 5;
      var endY = 42;
      var dy = endY - startY;
      var angle = Math.atan2(dy, 100) * 180 / Math.PI;
      return createElement("div", {
        key: "conv-" + i,
        style: {
          position: "absolute",
          top: startY + "%",
          left: 0,
          width: "100%",
          height: 1,
          background: "linear-gradient(to right, " + chaosColors[i] + "33, " + COLORS.primary + "22)",
          transformOrigin: "0 50%",
          transform: "rotate(" + (angle * 0.5) + "deg)",
          pointerEvents: "none"
        }
      });
    }),
    // Streaming dots along convergence lines
    inputs.map(function(item, i) {
      var pos = chaosPositions[i];
      var startY = pos.top + 5;
      var endY = 42;
      var dy = endY - startY;
      var angle = Math.atan2(dy, 100) * 180 / Math.PI;
      // 2 dots per line, staggered
      return [0, 1].map(function(d) {
        var delay = (i * 0.6 + d * 1.8).toFixed(1);
        var duration = (2.5 + i * 0.2).toFixed(1);
        return createElement("div", {
          key: "cdot-" + i + "-" + d,
          style: {
            position: "absolute",
            top: "calc(" + startY + "% - 2px)",
            left: -4,
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: chaosColors[i],
            opacity: 0.7,
            transformOrigin: "0 50%",
            transform: "rotate(" + (angle * 0.5) + "deg)",
            animation: "streamFlow " + duration + "s " + delay + "s linear infinite",
            pointerEvents: "none",
            boxShadow: "0 0 6px " + chaosColors[i] + "88"
          }
        });
      });
    })
  );

  // ── ZONE 2: THE PRISM (center) ──
  var prismZone = createElement("div", {
    style: {
      position: "relative",
      width: "30%",
      height: vizHeight,
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }
  },
    // Prism diamond shape
    createElement("div", {
      style: {
        position: "relative",
        width: 220,
        height: 260,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    },
      // Diamond background
      createElement("div", {
        style: {
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "linear-gradient(135deg, rgba(0,212,170,0.08) 0%, rgba(0,212,170,0.02) 50%, rgba(99,102,241,0.04) 100%)",
          border: "2px solid rgba(0,212,170,0.3)",
          borderRadius: 20,
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          animation: "prismPulse 3s ease-in-out infinite"
        }
      }),
      // Inner glow ring
      createElement("div", {
        style: {
          position: "absolute",
          top: 20, left: 20, right: 20, bottom: 20,
          border: "1px solid rgba(0,212,170,0.15)",
          borderRadius: 14,
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          pointerEvents: "none"
        }
      }),
      // Rotating orbit ring — processing indicator
      createElement("div", {
        style: {
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 160,
          height: 160,
          marginTop: -80,
          marginLeft: -80,
          borderRadius: "50%",
          border: "1px solid transparent",
          borderTopColor: "rgba(0,212,170,0.25)",
          borderRightColor: "rgba(99,102,241,0.15)",
          animation: "prismOrbit 8s linear infinite",
          pointerEvents: "none",
          zIndex: 1
        }
      }),
      // Second counter-rotating orbit (smaller, slower)
      createElement("div", {
        style: {
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 120,
          height: 120,
          marginTop: -60,
          marginLeft: -60,
          borderRadius: "50%",
          border: "1px solid transparent",
          borderBottomColor: "rgba(245,158,11,0.15)",
          borderLeftColor: "rgba(0,212,170,0.1)",
          animation: "prismOrbit 12s linear infinite reverse",
          pointerEvents: "none",
          zIndex: 1
        }
      }),
      // Content inside prism
      createElement("div", {
        style: {
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          padding: "0 10px"
        }
      },
        createElement("div", {
          style: {
            fontSize: 18,
            fontWeight: 700,
            color: COLORS.primary,
            letterSpacing: "-0.3px",
            marginBottom: 14
          }
        }, "Greenbay"),
        // Capability items stacked
        capabilities.map(function(c, i) {
          return createElement("div", {
            key: "prism-cap-" + i,
            style: {
              fontSize: 9,
              fontWeight: 600,
              color: c.color,
              padding: "3px 0",
              letterSpacing: "0.3px",
              opacity: 0.9
            }
          }, c.title);
        })
      )
    )
  );

  // ── DIVERGENCE LINES (prism → harmony) with streaming dots ──
  var divergenceLines = createElement("div", {
    style: {
      position: "relative",
      width: "6%",
      height: vizHeight,
      flexShrink: 0,
      overflow: "hidden"
    }
  },
    // Static lines
    outputs.map(function(item, i) {
      var endY = 8 + i * 14.5;
      var startY = 42;
      var dy = endY - startY;
      var angle = Math.atan2(dy, 100) * 180 / Math.PI;
      return createElement("div", {
        key: "div-" + i,
        style: {
          position: "absolute",
          top: startY + "%",
          left: 0,
          width: "100%",
          height: 2,
          background: "linear-gradient(to right, " + COLORS.primary + "44, " + COLORS.primary + "18)",
          transformOrigin: "0 50%",
          transform: "rotate(" + (angle * 0.5) + "deg)",
          borderRadius: 1,
          pointerEvents: "none"
        }
      });
    }),
    // Streaming green dots along divergence lines
    outputs.map(function(item, i) {
      var endY = 8 + i * 14.5;
      var startY = 42;
      var dy = endY - startY;
      var angle = Math.atan2(dy, 100) * 180 / Math.PI;
      return [0, 1].map(function(d) {
        var delay = (i * 0.5 + d * 2.0).toFixed(1);
        var duration = (2.2 + i * 0.15).toFixed(1);
        return createElement("div", {
          key: "ddot-" + i + "-" + d,
          style: {
            position: "absolute",
            top: "calc(" + startY + "% - 3px)",
            left: -5,
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: COLORS.primary,
            opacity: 0.8,
            transformOrigin: "0 50%",
            transform: "rotate(" + (angle * 0.5) + "deg)",
            animation: "streamFlow " + duration + "s " + delay + "s linear infinite",
            pointerEvents: "none",
            boxShadow: "0 0 8px " + COLORS.primary + "66"
          }
        });
      });
    })
  );

  // ── ZONE 3: HARMONY (right) ──
  var harmonyZone = createElement("div", {
    style: {
      position: "relative",
      width: "28%",
      height: vizHeight,
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      paddingTop: 20
    }
  },
    // Zone label
    createElement("div", {
      style: {
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "2px",
        color: COLORS.primary,
        textAlign: "center",
        marginBottom: 10
      }
    }, "OUT"),
    // Background tint
    createElement("div", {
      style: {
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "radial-gradient(ellipse at 50% 50%, rgba(0,212,170,0.03) 0%, transparent 70%)",
        borderRadius: 16,
        pointerEvents: "none"
      }
    }),
    // Clean aligned output cards with staggered pulse
    outputs.map(function(item, i) {
      var pulseDelay = (i * 0.8).toFixed(1);
      return createElement("div", {
        key: "harmony-" + i,
        style: {
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "9px 14px",
          background: "rgba(0,212,170,0.04)",
          border: "1px solid rgba(0,212,170,0.12)",
          borderRadius: 10,
          marginBottom: 7,
          animation: "outputPulse 4.8s " + pulseDelay + "s ease-in-out infinite"
        }
      },
        Icon(item.svgIcon, 16, COLORS.primary),
        createElement("span", {
          style: { fontSize: 11, fontWeight: 600, color: COLORS.text }
        }, item.label)
      );
    })
  );

  return createElement("div", { style: S.slide },
    styleTag,
    createElement("h2", { style: S.slideTitle }, "The Solution"),
    // Main visual: Chaos → Prism → Harmony
    createElement("div", {
      style: {
        display: "flex",
        alignItems: "stretch",
        justifyContent: "center",
        gap: 0,
        position: "relative"
      }
    },
      chaosZone,
      convergenceLines,
      prismZone,
      divergenceLines,
      harmonyZone
    ),
    null
  );
}

// ============ SLIDE 4: WHY NOW ============
function SlideWhyNow() {
  var spas = gartner.spas || [];

  // Build SPA chart data (kept from original)
  var spaYears = [];
  spas.forEach(function(spa) {
    (spa.series || []).forEach(function(pt) {
      if (spaYears.indexOf(pt.year) === -1) spaYears.push(pt.year);
    });
  });
  spaYears.sort();

  var spaChartData = spaYears.map(function(year) {
    var row = { year: year };
    spas.forEach(function(spa) {
      var pt = (spa.series || []).find(function(p) { return p.year === year; });
      row[spa.id] = pt ? pt.value_pct : null;
    });
    return row;
  });

  // ── 4 mega-forces ──
  var forces = [
    { svgIcon: "shield-check", title: "Regulatory Mandates", stat: "100% ZEV trucks by 2036", color: COLORS.info },
    { svgIcon: "bolt", title: "Fleet Electrification", stat: "93K \u2192 370K EV trucks/yr", color: COLORS.primary },
    { svgIcon: "cpu", title: "Agentic AI Wave", stat: "2% \u2192 25% T&L adoption", color: COLORS.accent },
    { svgIcon: "truck", title: "Autonomous Vehicles", stat: "2.7K \u2192 475K L4+", color: COLORS.purple }
  ];

  // Force card positions: [top-left, top-right, bottom-left, bottom-right]
  var forcePos = [
    { top: 8, left: 2 },
    { top: 8, left: 72 },
    { top: 62, left: 2 },
    { top: 62, left: 72 }
  ];

  // Beam endpoints (from force card edge → center node)
  // Each beam: { x1, y1, x2, y2 } in % of the convergence container
  var centerX = 50, centerY = 44;
  var beamDefs = [
    { x1: 24, y1: 20, x2: centerX, y2: centerY },
    { x1: 76, y1: 20, x2: centerX, y2: centerY },
    { x1: 24, y1: 74, x2: centerX, y2: centerY },
    { x1: 76, y1: 74, x2: centerX, y2: centerY }
  ];

  var vizHeight = 320;

  // ── Keyframes ──
  var styleTag = createElement("style", null,
    // Central node breathing glow
    "@keyframes convergePulse { 0%, 100% { box-shadow: 0 0 30px rgba(0,212,170,0.15), 0 0 60px rgba(0,212,170,0.06); } 50% { box-shadow: 0 0 50px rgba(0,212,170,0.35), 0 0 90px rgba(0,212,170,0.12); } } " +
    // Dashed orbit ring rotation
    "@keyframes convergeOrbit { 0% { transform: translate(-50%,-50%) rotate(0deg); } 100% { transform: translate(-50%,-50%) rotate(360deg); } } " +
    // Streaming dots toward center — horizontal flow
    "@keyframes convergeStreamLR { 0% { left: 0%; opacity: 0; } 10% { opacity: 0.9; } 85% { opacity: 0.9; } 100% { left: 100%; opacity: 0; } } " +
    "@keyframes convergeStreamRL { 0% { left: 100%; opacity: 0; } 10% { opacity: 0.9; } 85% { opacity: 0.9; } 100% { left: 0%; opacity: 0; } } " +
    // Force card drift — subtle float per card
    "@keyframes forceDrift0 { 0%,100% { transform: translate(0,0); } 33% { transform: translate(2px,-3px); } 66% { transform: translate(-2px,2px); } } " +
    "@keyframes forceDrift1 { 0%,100% { transform: translate(0,0); } 33% { transform: translate(-3px,2px); } 66% { transform: translate(2px,-2px); } } " +
    "@keyframes forceDrift2 { 0%,100% { transform: translate(0,0); } 33% { transform: translate(3px,3px); } 66% { transform: translate(-2px,-3px); } } " +
    "@keyframes forceDrift3 { 0%,100% { transform: translate(0,0); } 33% { transform: translate(-2px,-2px); } 66% { transform: translate(3px,2px); } } " +
    // Stat card border glow
    "@keyframes statGlow { 0%, 100% { border-color: rgba(255,255,255,0.06); box-shadow: none; } 50% { border-color: var(--glow-color, rgba(0,212,170,0.35)); box-shadow: 0 0 14px var(--glow-color, rgba(0,212,170,0.12)); } }"
  );

  // ── ZONE B: Convergence Visual ──
  // Central pulsing "2026 / WINDOW" node
  var centralNode = createElement("div", {
    style: {
      position: "absolute",
      top: centerY + "%",
      left: centerX + "%",
      transform: "translate(-50%, -50%)",
      width: 90,
      height: 90,
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(0,212,170,0.18) 0%, rgba(0,212,170,0.04) 70%)",
      border: "2px solid rgba(0,212,170,0.5)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      animation: "convergePulse 3s ease-in-out infinite",
      zIndex: 10
    }
  },
    createElement("div", {
      style: { fontSize: 22, fontWeight: 800, color: COLORS.primary, letterSpacing: "-1px", lineHeight: 1 }
    }, "2026"),
    createElement("div", {
      style: { fontSize: 9, fontWeight: 700, color: COLORS.primary, letterSpacing: "2px", textTransform: "uppercase", marginTop: 3, opacity: 0.8 }
    }, "WINDOW")
  );

  // Rotating dashed orbit ring
  var orbitRing = createElement("div", {
    style: {
      position: "absolute",
      top: centerY + "%",
      left: centerX + "%",
      width: 120,
      height: 120,
      borderRadius: "50%",
      border: "1.5px dashed rgba(0,212,170,0.2)",
      animation: "convergeOrbit 12s linear infinite",
      pointerEvents: "none",
      zIndex: 5
    }
  });

  // 4 beam lines + streaming dots
  var beams = beamDefs.map(function(b, i) {
    var dx = b.x2 - b.x1;
    var dy = b.y2 - b.y1;
    var len = Math.sqrt(dx * dx + dy * dy);
    var angle = Math.atan2(dy, dx) * 180 / Math.PI;
    var fc = forces[i].color;
    // Direction: left cards stream right, right cards stream left
    var streamAnim = (i === 0 || i === 2) ? "convergeStreamLR" : "convergeStreamRL";
    return createElement("div", { key: "beam-group-" + i },
      // Static beam line
      createElement("div", {
        style: {
          position: "absolute",
          top: b.y1 + "%",
          left: b.x1 + "%",
          width: len + "%",
          height: 1.5,
          background: "linear-gradient(to right, " + fc + "55, " + fc + "18)",
          transformOrigin: "0 50%",
          transform: "rotate(" + angle + "deg)",
          pointerEvents: "none",
          zIndex: 3
        }
      }),
      // 2 streaming dots per beam
      [0, 1].map(function(d) {
        var delay = (i * 0.5 + d * 1.8).toFixed(1);
        var duration = (2.8 + i * 0.15).toFixed(1);
        return createElement("div", {
          key: "bdot-" + i + "-" + d,
          style: {
            position: "absolute",
            top: "calc(" + b.y1 + "% - 2px)",
            left: b.x1 + "%",
            width: len + "%",
            height: 4,
            pointerEvents: "none",
            zIndex: 4
          }
        },
          createElement("div", {
            style: {
              position: "absolute",
              top: 0,
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: fc,
              opacity: 0.8,
              boxShadow: "0 0 8px " + fc + "88",
              animation: streamAnim + " " + duration + "s " + delay + "s linear infinite",
              transform: "rotate(" + angle + "deg)",
              transformOrigin: "0 50%"
            }
          })
        );
      })
    );
  });

  // 4 force cards at their positions
  var forceCards = forces.map(function(f, i) {
    var p = forcePos[i];
    var driftDuration = [4.5, 5.0, 4.2, 4.8][i];
    return createElement("div", {
      key: "force-" + i,
      style: {
        position: "absolute",
        top: p.top + "%",
        left: p.left + "%",
        width: "24%",
        background: "rgba(13,21,37,0.85)",
        border: "1px solid " + f.color + "44",
        borderRadius: 12,
        padding: "14px 16px",
        animation: "forceDrift" + i + " " + driftDuration + "s ease-in-out infinite",
        zIndex: 8
      }
    },
      createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 } },
        Icon(f.svgIcon, 18, f.color),
        createElement("span", { style: { fontSize: 12, fontWeight: 700, color: f.color } }, f.title)
      ),
      createElement("div", { style: { fontSize: 15, fontWeight: 800, color: COLORS.text } }, f.stat)
    );
  });

  // Full convergence visual container
  var convergenceVisual = createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      height: vizHeight,
      marginBottom: 24
    }
  },
    // Radial glow background
    createElement("div", {
      style: {
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "radial-gradient(ellipse at 50% 45%, rgba(0,212,170,0.04) 0%, transparent 60%)",
        pointerEvents: "none"
      }
    }),
    centralNode,
    orbitRing,
    beams,
    forceCards
  );

  // ── ZONE C: Bottom Split ──
  var statCards = [
    { value: "4x", label: "EV Truck Sales Growth", color: COLORS.primary, glowColor: "rgba(0,212,170,0.35)" },
    { value: "176x", label: "Autonomous Fleet Scale", color: COLORS.purple, glowColor: "rgba(168,85,247,0.35)" },
    { value: "-15%", label: "Diesel Fleet Decline", color: COLORS.danger, glowColor: "rgba(239,68,68,0.35)" }
  ];

  var bottomSection = createElement("div", {
    style: { display: "grid", gridTemplateColumns: "3fr 2fr", gap: 24 }
  },
    // Left: Gartner SPAs LineChart
    createElement("div", { style: S.chartCard },
      createElement("div", { style: S.chartTitle }, "Gartner Strategic Planning Assumptions"),
      createElement(ResponsiveContainer, { width: "100%", height: 240 },
        createElement(LineChart, { data: spaChartData, margin: { top: 10, right: 30, left: 10, bottom: 0 } },
          createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1e3a5f", opacity: 0.5 }),
          createElement(XAxis, { dataKey: "year", stroke: COLORS.textDim, fontSize: 11 }),
          createElement(YAxis, { stroke: COLORS.textDim, fontSize: 11, tickFormatter: function(v) { return v + '%'; } }),
          createElement(Tooltip, { contentStyle: tooltipStyle, formatter: function(v) { return [v + '%']; } }),
          createElement(Legend, { wrapperStyle: { fontSize: 10 } }),
          spas.map(function(spa, i) {
            return createElement(Line, {
              key: spa.id,
              type: "monotone",
              dataKey: spa.id,
              stroke: CHART_COLORS[i % CHART_COLORS.length],
              strokeWidth: 2,
              dot: false,
              name: spa.title.length > 25 ? spa.title.substring(0, 23) + '...' : spa.title,
              connectNulls: true
            });
          })
        )
      )
    ),
    // Right: 3 stacked stat cards
    createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12, justifyContent: "center" } },
      statCards.map(function(sc, i) {
        var pulseDelay = (i * 1.2).toFixed(1);
        return createElement("div", {
          key: "stat-" + i,
          style: {
            background: COLORS.card,
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.06)",
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            "--glow-color": sc.glowColor,
            animation: "statGlow 4s " + pulseDelay + "s ease-in-out infinite"
          }
        },
          createElement("div", {
            style: { fontSize: 32, fontWeight: 800, color: sc.color, letterSpacing: "-1px", minWidth: 70, lineHeight: 1 }
          }, sc.value),
          createElement("div", {
            style: { fontSize: 13, fontWeight: 700, color: COLORS.text }
          }, sc.label)
        );
      })
    )
  );

  return createElement("div", { style: S.slide },
    styleTag,
    // Zone A: Title
    createElement("h2", { style: S.slideTitle }, "Why Now"),
    // Zone B: Convergence Visual
    convergenceVisual,
    // Zone C: Bottom Split
    bottomSection
  );
}

// ============ SLIDE 5: MARKET OPPORTUNITY ============
function SlideMarket() {
  var segments = ms.segments_2030 || [];
  var segmentData = segments.map(function(s) {
    return {
      name: s.name.replace(' Fleet Orchestration', '').replace(' (mixed depot)', ''),
      exChina: s.revenue_ex_china_usd_m,
      china: s.revenue_china_usd_m,
      total: s.total_usd_m
    };
  });

  var samRegions = (ms.sam_by_region || []).filter(function(r) {
    return r.region !== 'TOTAL SAM' && r.region !== 'All segments (full)';
  });

  // Growth stats
  var tamGrowth = bottomUp.tam_2035_usd_m && bottomUp.tam_2030_usd_m
    ? (bottomUp.tam_2035_usd_m / bottomUp.tam_2030_usd_m).toFixed(1) + "x"
    : "2.2x";
  var tdCagr = topDown.cagr_pct ? topDown.cagr_pct + "%" : "13.3%";
  var tdTam = topDown.tam_2030_usd_b ? "$" + topDown.tam_2030_usd_b + "B" : "$70B";

  // ── Keyframes ──
  var styleTag = createElement("style", null,
    "@keyframes funnelGlow0 { 0%, 100% { box-shadow: 0 0 20px rgba(0,212,170,0.06); } 50% { box-shadow: 0 0 30px rgba(0,212,170,0.15), 0 0 60px rgba(0,212,170,0.06); } } " +
    "@keyframes funnelGlow1 { 0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.06); } 50% { box-shadow: 0 0 30px rgba(99,102,241,0.18), 0 0 60px rgba(99,102,241,0.08); } } " +
    "@keyframes funnelGlow2 { 0%, 100% { box-shadow: 0 0 20px rgba(245,158,11,0.1); } 50% { box-shadow: 0 0 40px rgba(245,158,11,0.3), 0 0 70px rgba(245,158,11,0.12); } } " +
    "@keyframes funnelStreamDown { 0% { top: -4px; opacity: 0; } 10% { opacity: 0.8; } 85% { opacity: 0.8; } 100% { top: calc(100% + 4px); opacity: 0; } } " +
    "@keyframes funnelDrift { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } } " +
    "@keyframes funnelChartGlow { 0%, 100% { border-color: " + COLORS.border + "; box-shadow: none; } 50% { border-color: rgba(0,212,170,0.2); box-shadow: 0 0 10px rgba(0,212,170,0.05); } } " +
    "@keyframes funnelPillGlow { 0%, 100% { border-color: rgba(255,255,255,0.06); box-shadow: none; } 50% { border-color: var(--glow-color, rgba(0,212,170,0.3)); box-shadow: 0 0 12px var(--glow-color, rgba(0,212,170,0.1)); } } " +
    "@keyframes funnelSomPulse { 0%, 100% { border-color: rgba(245,158,11,0.25); } 50% { border-color: rgba(245,158,11,0.6); } }"
  );

  // ── Funnel tier builder ──
  // Each tier: full-width row with colored left accent, label, big value, sub-text
  // Widths via inner colored bar rather than card width (so text never gets cramped)
  var tierData = [
    { label: "Total Addressable Market", value: fmtM(bottomUp.tam_2030_usd_m), color: COLORS.primary, rgb: "0,212,170", barWidth: "100%", glow: "funnelGlow0", fontSize: 42 },
    { label: "Serviceable Addressable Market", value: fmtM(bottomUp.sam_2030_usd_m), color: COLORS.secondary, rgb: "99,102,241", barWidth: "83%", glow: "funnelGlow1", fontSize: 38 },
    { label: "Serviceable Obtainable Market", value: fmtM(bottomUp.som_base_2030_usd_m), color: COLORS.accent, rgb: "245,158,11", barWidth: "38%", glow: "funnelGlow2", fontSize: 36 }
  ];

  var funnelRows = [];
  tierData.forEach(function(t, i) {
    // Tier row
    funnelRows.push(
      createElement("div", {
        key: "tier-" + i,
        style: {
          position: "relative",
          background: COLORS.card,
          borderRadius: 12,
          border: "1px solid rgba(" + t.rgb + ",0.2)",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          gap: 20,
          animation: t.glow + " 3s ease-in-out infinite",
          animationDelay: (i * 0.3) + "s",
          overflow: "hidden"
        }
      },
        // Background bar showing relative width
        createElement("div", {
          style: {
            position: "absolute",
            top: 0, left: 0, bottom: 0,
            width: t.barWidth,
            background: "linear-gradient(90deg, rgba(" + t.rgb + ",0.08) 0%, rgba(" + t.rgb + ",0.02) 100%)",
            borderRadius: 12,
            pointerEvents: "none"
          }
        }),
        // Label column
        createElement("div", { style: { flex: "0 0 240px", position: "relative", zIndex: 1 } },
          createElement("div", {
            style: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: t.color }
          }, t.label)
        ),
        // Big value
        createElement("div", {
          style: {
            fontSize: t.fontSize,
            fontWeight: 800,
            color: t.color,
            letterSpacing: "-2px",
            fontFamily: "'DM Mono', monospace",
            lineHeight: 1,
            position: "relative",
            zIndex: 1
          }
        }, t.value)
      )
    );

    // Connector dots between tiers (not after last)
    if (i < tierData.length - 1) {
      funnelRows.push(
        createElement("div", {
          key: "conn-" + i,
          style: { display: "flex", justifyContent: "center", gap: 32, height: 18 }
        },
          [0, 1].map(function(d) {
            return createElement("div", {
              key: "dl-" + d,
              style: { position: "relative", width: 1, height: "100%", background: "rgba(" + tierData[i + 1].rgb + ",0.12)" }
            },
              createElement("div", {
                style: {
                  position: "absolute", left: -2, width: 5, height: 5, borderRadius: "50%",
                  background: tierData[i + 1].color, opacity: 0.6,
                  animation: "funnelStreamDown 1.8s linear infinite",
                  animationDelay: (d * 0.9) + "s"
                }
              })
            );
          })
        )
      );
    }
  });

  // ── Growth pills (inline row) ──
  var growthPills = [
    { value: tamGrowth, label: "TAM Growth to 2035", color: COLORS.primary, rgb: "0,212,170" },
    { value: tdCagr, label: "Top-Down CAGR", color: COLORS.info, rgb: "59,130,246" },
    { value: tdTam, label: "Top-Down TAM 2030", color: COLORS.purple, rgb: "168,85,247" }
  ];

  var pillsRow = createElement("div", {
    style: { display: "flex", gap: 10, marginTop: 16 }
  },
    growthPills.map(function(p, i) {
      return createElement("div", {
        key: "pill-" + i,
        style: {
          flex: 1,
          background: COLORS.card,
          borderRadius: 10,
          border: "1px solid rgba(" + p.rgb + ",0.15)",
          padding: "10px 10px",
          textAlign: "center",
          animation: "funnelPillGlow 4s ease-in-out infinite, funnelDrift 4.5s ease-in-out infinite",
          animationDelay: (i * 0.5) + "s",
          "--glow-color": "rgba(" + p.rgb + ",0.3)"
        }
      },
        createElement("div", {
          style: { fontSize: 20, fontWeight: 800, color: p.color, letterSpacing: "-1px", lineHeight: 1, marginBottom: 4, fontFamily: "'DM Mono', monospace" }
        }, p.value),
        createElement("div", {
          style: { fontSize: 9, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }
        }, p.label)
      );
    })
  );

  // ── Charts ──
  var segmentChart = createElement("div", {
    style: Object.assign({}, S.chartCard, { animation: "funnelChartGlow 5s ease-in-out infinite" })
  },
    createElement("div", { style: S.chartTitle }, "TAM by Segment ($M)"),
    createElement(ResponsiveContainer, { width: "100%", height: 220 },
      createElement(BarChart, {
        data: segmentData,
        layout: "vertical",
        margin: { top: 5, right: 20, left: 100, bottom: 0 }
      },
        createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1e3a5f", opacity: 0.5, horizontal: false }),
        createElement(XAxis, { type: "number", stroke: COLORS.textDim, fontSize: 10, tickFormatter: function(v) { return '$' + v + 'M'; } }),
        createElement(YAxis, { type: "category", dataKey: "name", stroke: COLORS.textDim, fontSize: 10, width: 95 }),
        createElement(Tooltip, { contentStyle: tooltipStyle, formatter: function(v) { return ['$' + v + 'M']; } }),
        createElement(Legend, { wrapperStyle: { fontSize: 10 } }),
        createElement(Bar, { dataKey: "exChina", stackId: "a", fill: COLORS.primary, name: "Ex-China" }),
        createElement(Bar, { dataKey: "china", stackId: "a", fill: COLORS.accent, name: "China", radius: [0, 4, 4, 0] })
      )
    )
  );

  var regionalDonut = createElement("div", {
    style: Object.assign({}, S.chartCard, { animation: "funnelChartGlow 5s ease-in-out infinite", animationDelay: "1s" })
  },
    createElement("div", { style: S.chartTitle }, "SAM by Region \u2014 " + fmtM(bottomUp.sam_2030_usd_m)),
    createElement(ResponsiveContainer, { width: "100%", height: 220 },
      createElement(PieChart, null,
        createElement(Pie, {
          data: samRegions,
          dataKey: "sam_usd_m",
          nameKey: "region",
          cx: "50%",
          cy: "48%",
          outerRadius: 70,
          innerRadius: 32,
          paddingAngle: 2,
          label: function(entry) { return '$' + entry.sam_usd_m + 'M'; },
          labelLine: true
        },
          samRegions.map(function(r, i) {
            return createElement(Cell, { key: i, fill: CHART_COLORS[i % CHART_COLORS.length] });
          })
        ),
        createElement(Tooltip, { contentStyle: tooltipStyle, formatter: function(v, name) { return ['$' + v + 'M', name]; } }),
        createElement(Legend, { wrapperStyle: { fontSize: 10, paddingTop: 4 }, formatter: function(value) { return value; } })
      )
    )
  );

  // ── Assemble Slide ──
  return createElement("div", { style: S.slide },
    styleTag,
    // Title
    createElement("h2", { style: S.slideTitle }, "Market Opportunity"),
    // Funnel tiers (stacked full-width rows)
    createElement("div", { style: { marginBottom: 20 } }, funnelRows),
    // Evidence: charts side by side + pills underneath
    createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 } },
      segmentChart,
      regionalDonut
    ),
    pillsRow
  );
}

// ============ SLIDE 6: WHY GREENBAY WINS ============
function SlideCompetitive() {
  var techLayers = comp.tech_stack_layers || [];
  var competitors = (comp.competitors || []).filter(function(c) { return c.revenue_usd_m; });
  competitors.sort(function(a, b) { return b.revenue_usd_m - a.revenue_usd_m; });
  var gbPos = comp.greenbay_positioning || {};
  var advantages = gbPos.competitive_advantages || {};

  // Layer color mapping
  var layerMeta = [
    { color: COLORS.info, rgb: "59,130,246", borderW: 1 },
    { color: COLORS.primary, rgb: "0,212,170", borderW: 2 },
    { color: COLORS.secondary, rgb: "99,102,241", borderW: 1 },
    { color: COLORS.accent, rgb: "245,158,11", borderW: 1 }
  ];

  // ── Keyframes ──
  var styleTag = createElement("style", null,
    "@keyframes compLayerGlow { 0%, 100% { box-shadow: 0 0 25px rgba(0,212,170,0.1), 0 0 50px rgba(0,212,170,0.05); } 50% { box-shadow: 0 0 45px rgba(0,212,170,0.3), 0 0 90px rgba(0,212,170,0.12); } } " +
    "@keyframes compStreamDown { 0% { top: -4px; opacity: 0; } 10% { opacity: 0.8; } 85% { opacity: 0.8; } 100% { top: calc(100% + 4px); opacity: 0; } } " +
    "@keyframes compDrift { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } } " +
    "@keyframes compChartGlow { 0%, 100% { border-color: " + COLORS.border + "; box-shadow: none; } 50% { border-color: rgba(0,212,170,0.2); box-shadow: 0 0 10px rgba(0,212,170,0.05); } } " +
    "@keyframes compPillGlow { 0%, 100% { border-color: rgba(255,255,255,0.06); box-shadow: none; } 50% { border-color: var(--glow-color, rgba(0,212,170,0.3)); box-shadow: 0 0 12px var(--glow-color, rgba(0,212,170,0.1)); } } " +
    "@keyframes compLabelPulse { 0%, 100% { text-shadow: 0 0 8px rgba(0,212,170,0.3); } 50% { text-shadow: 0 0 18px rgba(0,212,170,0.7), 0 0 30px rgba(0,212,170,0.3); } }"
  );

  // ── Zone B: Tech stack rows with streaming connectors ──
  var stackRows = [];
  techLayers.forEach(function(layer, i) {
    var isGB = layer.is_greenbay_layer;
    var meta = layerMeta[i] || layerMeta[0];

    stackRows.push(
      createElement("div", {
        key: "layer-" + i,
        style: {
          position: "relative",
          display: "flex",
          alignItems: "center",
          padding: "12px 20px",
          borderRadius: 12,
          background: COLORS.card,
          border: meta.borderW + "px solid rgba(" + meta.rgb + "," + (isGB ? "0.4" : "0.2") + ")",
          overflow: "hidden",
          animation: isGB
            ? "compLayerGlow 3s ease-in-out infinite"
            : "compDrift 4.5s ease-in-out infinite",
          animationDelay: isGB ? "0s" : (i * 0.3) + "s"
        }
      },
        // L2 inner gradient bar
        isGB ? createElement("div", {
          style: {
            position: "absolute",
            top: 0, left: 0, bottom: 0, right: 0,
            background: "linear-gradient(90deg, rgba(0,212,170,0.08) 0%, rgba(0,212,170,0.02) 100%)",
            borderRadius: 12,
            pointerEvents: "none"
          }
        }) : null,
        // Badge
        createElement("div", {
          style: {
            width: 32,
            height: 32,
            borderRadius: 8,
            background: isGB ? COLORS.primary : COLORS.border,
            color: isGB ? COLORS.background : COLORS.textDim,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 13,
            marginRight: 16,
            flexShrink: 0,
            position: "relative",
            zIndex: 1
          }
        }, "L" + layer.layer),
        // Name + examples
        createElement("div", { style: { flex: 1, position: "relative", zIndex: 1 } },
          createElement("div", {
            style: {
              fontWeight: isGB ? 700 : 500,
              fontSize: 14,
              color: isGB ? COLORS.primary : COLORS.text,
              marginBottom: 2
            }
          }, layer.name + (isGB ? " \u2190 " : ""),
            isGB ? createElement("span", {
              style: {
                fontWeight: 800,
                letterSpacing: "1px",
                animation: "compLabelPulse 2.5s ease-in-out infinite"
              }
            }, "GREENBAY") : null
          ),
          createElement("div", {
            style: { fontSize: 11, color: COLORS.textDim }
          }, layer.examples.join(", "))
        ),
        // Right context for L2
        isGB ? createElement("div", {
          style: {
            fontSize: 11,
            fontWeight: 600,
            color: COLORS.primary,
            textTransform: "uppercase",
            letterSpacing: "1px",
            position: "relative",
            zIndex: 1,
            whiteSpace: "nowrap"
          }
        }, "Orchestration Layer") : null
      )
    );

    // Streaming connectors between layers (not after last)
    if (i < techLayers.length - 1) {
      var connColor = (i < 2) ? COLORS.primary : COLORS.textDim;
      var connRgb = (i < 2) ? "0,212,170" : "107,114,128";
      stackRows.push(
        createElement("div", {
          key: "conn-" + i,
          style: { display: "flex", justifyContent: "center", gap: 32, height: 18 }
        },
          [0, 1].map(function(d) {
            return createElement("div", {
              key: "dl-" + d,
              style: { position: "relative", width: 1, height: "100%", background: "rgba(" + connRgb + ",0.12)" }
            },
              createElement("div", {
                style: {
                  position: "absolute", left: -2, width: 5, height: 5, borderRadius: "50%",
                  background: connColor, opacity: 0.6,
                  animation: "compStreamDown 1.8s linear infinite",
                  animationDelay: (d * 0.9) + "s"
                }
              })
            );
          })
        )
      );
    }
  });

  // ── Zone C: Evidence layer ──
  var diffCards = [
    { label: "EV-Native", rgb: "0,212,170" },
    { label: "Hardware-Agnostic", rgb: "0,212,170" },
    { label: "Full Orchestration", rgb: "0,212,170" }
  ];

  var chartCard = createElement("div", {
    style: Object.assign({}, S.chartCard, { animation: "compChartGlow 5s ease-in-out infinite" })
  },
    createElement("div", { style: S.chartTitle }, "Competitor Revenue ($M)"),
    createElement(ResponsiveContainer, { width: "100%", height: 200 },
      createElement(BarChart, {
        data: competitors,
        layout: "vertical",
        margin: { top: 10, right: 30, left: 80, bottom: 0 }
      },
        createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1e3a5f", opacity: 0.5, horizontal: false }),
        createElement(XAxis, { type: "number", stroke: COLORS.textDim, fontSize: 11, tickFormatter: function(v) { return '$' + v + 'M'; } }),
        createElement(YAxis, { type: "category", dataKey: "name", stroke: COLORS.textDim, fontSize: 11, width: 75 }),
        createElement(Tooltip, { contentStyle: tooltipStyle, formatter: function(v) { return ['$' + v + 'M']; } }),
        createElement(Bar, { dataKey: "revenue_usd_m", fill: COLORS.secondary, radius: [0, 4, 4, 0], name: "Revenue" },
          competitors.map(function(c, i) {
            return createElement(Cell, { key: i, fill: CHART_COLORS[i % CHART_COLORS.length] });
          })
        )
      )
    )
  );

  var diffColumn = createElement("div", {
    style: { display: "flex", flexDirection: "column", gap: 10 }
  },
    diffCards.map(function(d, i) {
      return createElement("div", {
        key: "diff-" + i,
        style: {
          flex: 1,
          padding: "12px 14px",
          borderRadius: 10,
          background: COLORS.card,
          border: "1px solid rgba(" + d.rgb + ",0.15)",
          animation: "compPillGlow 4s ease-in-out infinite, compDrift 4.5s ease-in-out infinite",
          animationDelay: (i * 0.4) + "s",
          "--glow-color": "rgba(" + d.rgb + ",0.3)"
        }
      },
        createElement("div", {
          style: { fontSize: 12, fontWeight: 700, color: COLORS.primary, textTransform: "uppercase", letterSpacing: "0.5px" }
        }, d.label)
      );
    })
  );

  // ── Assemble slide ──
  return createElement("div", { style: S.slide },
    styleTag,
    // Zone A: Title
    createElement("h2", { style: S.slideTitle }, "Why Greenbay Wins"),
    // Zone B: Tech stack hero
    createElement("div", { style: { marginBottom: 20 } }, stackRows),
    // Zone C: Evidence layer
    createElement("div", { style: { display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20 } },
      chartCard,
      diffColumn
    )
  );
}

// ============ SLIDE 7: TRACTION ============
function SlideTraction() {
  // 6 keyframe animations
  var styleTag = createElement("style", null,
    // Breathing glow on completed nodes
    "@keyframes tractionNodeGlow { 0%, 100% { box-shadow: 0 0 12px rgba(0,212,170,0.25), 0 0 24px rgba(0,212,170,0.1); } 50% { box-shadow: 0 0 20px rgba(0,212,170,0.45), 0 0 40px rgba(0,212,170,0.2); } } " +
    // Brighter pulse on active node
    "@keyframes tractionActiveGlow { 0%, 100% { box-shadow: 0 0 16px rgba(0,212,170,0.4), 0 0 32px rgba(0,212,170,0.2), 0 0 60px rgba(0,212,170,0.08); } 50% { box-shadow: 0 0 28px rgba(0,212,170,0.7), 0 0 56px rgba(0,212,170,0.35), 0 0 90px rgba(0,212,170,0.12); } } " +
    // Subtle secondary pulse on upcoming node
    "@keyframes tractionUpcomingGlow { 0%, 100% { box-shadow: 0 0 8px rgba(99,102,241,0.2), 0 0 16px rgba(99,102,241,0.08); } 50% { box-shadow: 0 0 14px rgba(99,102,241,0.35), 0 0 28px rgba(99,102,241,0.15); } } " +
    // Green dots streaming along connector
    "@keyframes tractionStream { 0% { left: 3%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { left: 97%; opacity: 0; } } " +
    // Subtle vertical float on detail cards
    "@keyframes tractionDrift { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } } " +
    // Text-shadow pulse on active value
    "@keyframes tractionValueGlow { 0%, 100% { text-shadow: 0 0 8px rgba(0,212,170,0.3); } 50% { text-shadow: 0 0 20px rgba(0,212,170,0.6), 0 0 40px rgba(0,212,170,0.2); } }"
  );

  // Milestone data — Q4 2025 through Q4 2026
  var milestones = [
    {
      period: "Q4 2025", label: "Design Partnership", status: "completed",
      subs: [
        { value: "+13%", sublabel: "Revenue Uplift" },
        { value: "+21%", sublabel: "On-Time Perf." },
        { value: "1st", sublabel: "Transport UK" }
      ]
    },
    {
      period: "Q1 2026", label: "Pipeline & Partners", status: "active",
      subs: [
        { value: "200+", sublabel: "Qualified Accounts" },
        { value: "2", sublabel: "Partnerships\nSolarEdge, EdgeControl" },
        { value: "2", sublabel: "LOIs for Pilots" }
      ]
    },
    { period: "Q2 2026", label: "Europe Expansion", value: "EU", status: "upcoming" },
    { period: "Q3 2026", label: "US Expansion", value: "US", status: "upcoming" },
    { period: "Q4 2026", label: "Signed POs", value: "2", status: "upcoming" }
  ];

  var nodePositions = [8, 34, 62, 80, 95];

  // Circle style per status (no positioning — caller adds that)
  function circleStyle(status, size) {
    var base = {
      width: size, height: size, borderRadius: "50%",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "default",
      background: "radial-gradient(circle at 30% 30%, " + COLORS.cardHover + ", " + COLORS.card + ")"
    };
    if (status === "completed") {
      base.border = "2px solid " + COLORS.primary;
      base.animation = "tractionNodeGlow 3s ease-in-out infinite";
    } else if (status === "active") {
      base.border = "3px solid " + COLORS.primary;
      base.animation = "tractionActiveGlow 3s ease-in-out infinite";
    } else {
      base.border = "2px solid " + COLORS.secondary + "66";
      base.animation = "tractionUpcomingGlow 3s ease-in-out infinite";
    }
    return base;
  }

  return createElement("div", { style: S.slide },
    styleTag,
    createElement("h2", { style: S.slideTitle }, "Traction"),
    createElement("p", { style: S.slideSubtitle },
      "2 LOIs | 200+ Accounts | 20 product trials"
    ),

    // Testimonial (compact, top)
    createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: COLORS.card,
        borderRadius: 10,
        padding: "10px 20px",
        borderLeft: "3px solid " + COLORS.primary,
        maxWidth: 580,
        marginBottom: 10
      }
    },
      createElement("div", {
        style: { fontSize: 13, fontStyle: "italic", color: COLORS.text, lineHeight: 1.5 }
      }, "\u201CAfter few minutes of use I managed to find issues that I had no chance identifying\u201D"),
      createElement("div", {
        style: { fontSize: 11, fontWeight: 600, color: COLORS.primary, whiteSpace: "nowrap" }
      }, "\u2014 Ian, Performance Mgr")
    ),

    // Timeline container
    createElement("div", {
      style: {
        position: "relative",
        height: 530,
        margin: "10px 0 16px",
        background: "radial-gradient(ellipse at 50% 50%, rgba(0,212,170,0.04) 0%, transparent 70%)"
      }
    },
      // Horizontal connector line
      createElement("div", {
        style: {
          position: "absolute",
          top: "40%",
          left: "3%",
          right: "3%",
          height: 2,
          background: "linear-gradient(90deg, " + COLORS.primary + "55, " + COLORS.primary + " 20%, " + COLORS.primary + " 38%, " + COLORS.secondary + "55 60%, " + COLORS.secondary + "33)",
          transform: "translateY(-50%)",
          zIndex: 1
        }
      }),

      // Streaming dots (4 staggered)
      [0, 1, 2, 3].map(function(i) {
        return createElement("div", {
          key: "dot-" + i,
          style: {
            position: "absolute",
            top: "40%",
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: COLORS.primary,
            boxShadow: "0 0 6px " + COLORS.primary,
            transform: "translateY(-50%)",
            animation: "tractionStream 3.5s linear infinite",
            animationDelay: (i * 0.8) + "s",
            zIndex: 3,
            opacity: 0
          }
        });
      }),

      // Milestone nodes
      milestones.map(function(m, i) {
        var left = nodePositions[i];
        var valueColor = m.status === "active" ? COLORS.primary : m.status === "completed" ? COLORS.primary : COLORS.secondary;
        var valueAnim = m.status === "active" ? "tractionValueGlow 3s ease-in-out infinite" : "none";
        var periodColor = m.status === "upcoming" ? COLORS.secondary : COLORS.primary;

        if (m.subs) {
          // ── Branch & Leaf milestone ──
          // Alternating: even index fans UP, odd index fans DOWN
          var fanDown = i % 2 === 1;
          var branchColor = m.status === "active" ? COLORS.primary : COLORS.primary + "99";
          var glowColor = m.status === "active" ? COLORS.primary + "30" : COLORS.primary + "18";

          var leafY = fanDown ? 115 : -115;
          var fanSpreadX = fanDown ? 148 : 116;
          var fanLeaves = [
            { x: -fanSpreadX, y: leafY },
            { x: 0,           y: leafY },
            { x: fanSpreadX,  y: leafY }
          ];
          var leafSize = 56;
          var halfLeaf = leafSize / 2;

          // SVG paths: fan up or fan down from anchor
          // Down fan uses wider 340px SVG, up fan uses 280px
          var svgPaths = fanDown
            ? [
                "M 170 10 C 120 45 42 70 22 92",
                "M 170 10 C 170 40 170 70 170 92",
                "M 170 10 C 220 45 298 70 318 92"
              ]
            : [
                "M 140 230 C 100 195 46 170 24 148",
                "M 140 230 C 140 200 140 170 140 148",
                "M 140 230 C 180 195 234 170 256 148"
              ];
          var svgW = fanDown ? 340 : 280;
          var svgTop = fanDown ? -10 : -230;

          return createElement("div", { key: i },

            createElement("div", {
              style: {
                position: "absolute",
                left: left + "%",
                top: "40%",
                zIndex: 3
              }
            },

              // Anchor dot on the timeline
              createElement("div", {
                style: {
                  position: "absolute",
                  left: 0, top: 0,
                  width: 14, height: 14,
                  borderRadius: "50%",
                  background: m.status === "active" ? COLORS.primary : COLORS.primary + "cc",
                  border: "2px solid " + COLORS.primary,
                  transform: "translate(-50%, -50%)",
                  zIndex: 6,
                  boxShadow: m.status === "active"
                    ? "0 0 14px " + COLORS.primary + "88, 0 0 28px " + COLORS.primary + "33"
                    : "0 0 10px " + COLORS.primary + "55"
                }
              }),

              // SVG curved branch lines
              createElement("svg", {
                width: svgW, height: 240,
                style: {
                  position: "absolute",
                  left: -(svgW / 2), top: svgTop,
                  pointerEvents: "none",
                  overflow: "visible"
                }
              },
                svgPaths.map(function(d, pi) {
                  return createElement("path", {
                    key: "glow-" + pi,
                    d: d, fill: "none",
                    stroke: branchColor,
                    strokeWidth: 5,
                    opacity: 0.12
                  });
                }),
                svgPaths.map(function(d, pi) {
                  return createElement("path", {
                    key: "line-" + pi,
                    d: d, fill: "none",
                    stroke: branchColor,
                    strokeWidth: 1.5,
                    opacity: 0.7
                  });
                })
              ),

              // Period + label title
              createElement("div", {
                style: {
                  position: "absolute",
                  left: 0,
                  top: fanDown ? 205 : -195,
                  transform: "translateX(-50%)",
                  textAlign: "center",
                  width: 270
                }
              },
                createElement("div", {
                  style: {
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11,
                    fontWeight: 600,
                    color: periodColor,
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    marginBottom: 5
                  }
                }, m.period),
                createElement("div", {
                  style: { fontSize: 14, fontWeight: 700, color: COLORS.text }
                }, m.label)
              ),

              // 3 leaf circles with labels below each circle
              m.subs.map(function(sub, si) {
                var leaf = fanLeaves[si];
                return createElement("div", {
                  key: si,
                  style: {
                    position: "absolute",
                    left: leaf.x,
                    top: leaf.y - halfLeaf,
                    transform: "translateX(-50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    zIndex: 4
                  }
                },
                  // Leaf circle
                  createElement("div", {
                    style: circleStyle(m.status, leafSize)
                  },
                    createElement("span", {
                      style: {
                        fontFamily: "'DM Serif Display', serif",
                        fontSize: 18,
                        fontWeight: 700,
                        color: valueColor,
                        animation: valueAnim
                      }
                    }, sub.value)
                  ),
                  // Label below circle
                  createElement("div", {
                    style: {
                      fontSize: 11,
                      fontWeight: 500,
                      color: COLORS.textMuted,
                      textAlign: "center",
                      lineHeight: 1.3,
                      marginTop: 6,
                      maxWidth: 110,
                      whiteSpace: "pre-line"
                    }
                  }, sub.sublabel)
                );
              })
            )
          );

        } else {
          // ── Single node ──
          return createElement("div", { key: i },
            // Circle
            createElement("div", {
              style: Object.assign({}, circleStyle(m.status, 54), {
                position: "absolute",
                left: left + "%",
                top: "40%",
                transform: "translate(-50%, -50%)",
                zIndex: 2
              })
            },
              createElement("span", {
                style: {
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: valueColor,
                  animation: valueAnim
                }
              }, m.value)
            ),

            // Detail card (below timeline)
            createElement("div", {
              style: {
                position: "absolute",
                left: left + "%",
                transform: "translateX(-50%)",
                top: "calc(40% + 42px)",
                width: 140,
                textAlign: "left",
                zIndex: 2
              }
            },
              createElement("div", {
                style: {
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  fontWeight: 600,
                  color: COLORS.secondary,
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  marginBottom: 4
                }
              }, m.period),
              createElement("div", {
                style: { fontSize: 14, fontWeight: 600, color: COLORS.text, marginBottom: 3 }
              }, m.label),
              createElement("div", {
                style: { fontSize: 11, color: COLORS.textMuted, lineHeight: 1.4 }
              }, m.detail)
            )
          );
        }
      })
    ),

  );
}

// ============ SLIDE 8: TEAM ============
function SlideTeam() {
  var team = [
    {
      name: "Oren Arieli",
      role: "CEO",
      initials: "OA",
      photo: "assets/oren-arieli.jpg",
      color: COLORS.primary,
      prev: "Ex-Optibus & Via"
    },
    {
      name: "Shira Golan",
      role: "Co-CEO",
      initials: "SG",
      photo: "assets/shira-golan.jpg",
      color: COLORS.secondary,
      prev: "Fortune 500 partnerships"
    },
    {
      name: "Daniel Odesser",
      role: "CTO",
      initials: "DO",
      photo: "assets/daniel-odesser.jpg",
      color: COLORS.accent,
      prev: "Ex-Optibus & Auto Fleet"
    }
  ];

  var whyUs = [
    { label: "Domain Depth", icon: "briefcase", short: "Built fleet-tech at scale", color: COLORS.primary },
    { label: "Technical Edge", icon: "zap", short: "Real-time EV platforms", color: COLORS.secondary },
    { label: "Market Access", icon: "handshake", short: "EU & NA operator networks", color: COLORS.accent }
  ];

  return createElement("div", { style: S.slide },
    createElement("h2", { style: S.slideTitle }, "Team"),
    // Team cards
    createElement("div", {
      style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28, marginBottom: 32 }
    },
      team.map(function(t, i) {
        return createElement("div", {
          key: i,
          style: {
            background: "linear-gradient(135deg, " + COLORS.card + ", " + COLORS.cardHover + ")",
            borderRadius: 16,
            padding: "32px 24px",
            textAlign: "center",
            border: "1px solid " + t.color + "33",
            position: "relative",
            overflow: "hidden"
          }
        },
          // Decorative gradient top bar
          createElement("div", {
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: "linear-gradient(90deg, transparent, " + t.color + ", transparent)"
            }
          }),
          // Avatar: photo or initials fallback
          t.photo ?
            createElement("img", {
              src: t.photo,
              alt: t.name,
              style: {
                width: 72,
                height: 72,
                borderRadius: "50%",
                objectFit: "cover",
                objectPosition: "center 20%",
                border: "3px solid " + t.color,
                margin: "0 auto 14px",
                display: "block"
              }
            }) :
            createElement("div", {
              style: {
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: t.color + "22",
                border: "3px solid " + t.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 14px",
                fontSize: 22,
                fontWeight: 700,
                fontFamily: "'DM Serif Display', serif",
                color: t.color
              }
            }, t.initials),
          createElement("div", {
            style: { fontSize: 18, fontWeight: 700, color: COLORS.text, marginBottom: 4 }
          }, t.name),
          createElement("div", {
            style: {
              fontSize: 12,
              fontWeight: 600,
              color: t.color,
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              marginBottom: 14
            }
          }, t.role),
          createElement("div", {
            style: {
              fontSize: 12,
              color: COLORS.primary,
              fontWeight: 600,
              marginBottom: 8,
              fontFamily: "'DM Mono', monospace"
            }
          }, t.prev),
          null
        );
      })
    ),
    // Why us cards
    createElement("div", {
      style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }
    },
      whyUs.map(function(w, i) {
        return createElement("div", {
          key: i,
          style: {
            background: w.color + "08",
            border: "1px solid " + w.color + "33",
            borderRadius: 12,
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            gap: 14
          }
        },
          Icon(w.icon, 28, w.color),
          createElement("div", null,
            createElement("div", {
              style: { fontSize: 13, fontWeight: 700, color: w.color, marginBottom: 3 }
            }, w.label),
            createElement("div", {
              style: { fontSize: 12, color: COLORS.textMuted }
            }, w.short)
          )
        );
      })
    )
  );
}

// ============ SLIDE 9: BUSINESS MODEL ============
function SlideBusinessModel() {
  var cm = ue.core_metrics || {};
  var benchmarks = ue.benchmarks || {};
  var arrSeries = (arr.tam_based_scenarios || {}).series || [];

  var keyMetrics = [
    { label: "ACV", value: "$" + (cm.acv_usd || 0).toLocaleString(), color: COLORS.primary },
    { label: "Gross Margin", value: (cm.gross_margin_pct || 0) + "%", color: COLORS.success },
    { label: "LTV:CAC", value: (cm.ltv_cac_ratio || 0) + "x", color: COLORS.accent },
    { label: "CAC Payback", value: (cm.cac_payback_months || 0) + " mo", color: COLORS.info },
    { label: "NRR", value: (cm.nrr_pct || 0) + "%", color: COLORS.purple }
  ];

  return createElement("div", { style: S.slide },
    createElement("h2", { style: S.slideTitle }, "Business Model"),
    null,
    // Key metrics row
    createElement("div", { style: S.grid5 },
      keyMetrics.map(function(m, i) {
        return createElement("div", {
          key: i,
          style: Object.assign({}, S.metricCard, { borderTop: "4px solid " + m.color })
        },
          createElement("div", { style: S.metricLabel }, m.label),
          createElement("div", { style: Object.assign({}, S.metricValue, { color: m.color }) }, m.value)
        );
      })
    ),
    // ARR Chart
    createElement("div", { style: S.chartCard },
      createElement("div", { style: S.chartTitle }, "ARR Trajectory \u2014 5 Scenarios (2025\u20132030)"),
      null,
      createElement(ResponsiveContainer, { width: "100%", height: 300 },
        createElement(LineChart, { data: arrSeries, margin: { top: 10, right: 30, left: 10, bottom: 0 } },
          createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1e3a5f", opacity: 0.5 }),
          createElement(XAxis, { dataKey: "year", stroke: COLORS.textDim, fontSize: 11 }),
          createElement(YAxis, { stroke: COLORS.textDim, fontSize: 11, tickFormatter: function(v) { return '$' + v + 'M'; } }),
          createElement(Tooltip, { contentStyle: tooltipStyle, formatter: function(v) { return ['$' + v + 'M']; } }),
          createElement(Legend, { wrapperStyle: { fontSize: 11 } }),
          createElement(Line, { type: "monotone", dataKey: "bear", stroke: COLORS.danger, strokeWidth: 1.5, dot: false, name: "Bear", strokeDasharray: "5 3" }),
          createElement(Line, { type: "monotone", dataKey: "bottoms_up", stroke: COLORS.orange, strokeWidth: 2, dot: false, name: "Bottoms-Up" }),
          createElement(Line, { type: "monotone", dataKey: "tam_conservative", stroke: COLORS.accent, strokeWidth: 2, dot: false, name: "TAM Conservative" }),
          createElement(Line, { type: "monotone", dataKey: "tam_base", stroke: COLORS.primary, strokeWidth: 3, dot: false, name: "TAM Base" }),
          createElement(Line, { type: "monotone", dataKey: "tam_upside", stroke: COLORS.success, strokeWidth: 2, dot: false, name: "TAM Upside" })
        )
      )
    )
  );
}

// ============ SLIDE 10: VISION ============
function SlideVision() {
  // Vision pillars
  var pillars = [
    { svgIcon: "cpu", title: "AI-Native Intelligence", color: COLORS.primary },
    { svgIcon: "truck", title: "Autonomous-Ready", color: COLORS.purple },
    { svgIcon: "bolt", title: "Full Electrification", color: COLORS.accent },
    { svgIcon: "globe", title: "Sustainable Operations", color: COLORS.success }
  ];

  // Card positions: NW, NE, SW, SE
  var cardPos = [
    { top: 6, left: 2 },
    { top: 6, left: 72 },
    { top: 62, left: 2 },
    { top: 62, left: 72 }
  ];

  var vizHeight = 390;
  var centerX = 50;
  var centerY = 45;

  // Style tag with AI chip keyframes
  var styleTag = createElement("style", null,
    // 1. Nucleus pulse — chip die glow
    "@keyframes visionNucleusPulse { 0%, 100% { box-shadow: 0 0 20px rgba(0,212,170,0.12), 0 0 50px rgba(0,212,170,0.05), inset 0 0 15px rgba(0,212,170,0.06); } 50% { box-shadow: 0 0 35px rgba(0,212,170,0.35), 0 0 80px rgba(0,212,170,0.1), inset 0 0 25px rgba(0,212,170,0.1); } } " +
    // 2. Data pulse traveling along traces
    "@keyframes visionTracePulse { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } } " +
    // 3. Pin glow cycle
    "@keyframes visionPinGlow { 0%, 100% { opacity: 0.3; box-shadow: none; } 50% { opacity: 1; box-shadow: 0 0 6px var(--pin-color, rgba(0,212,170,0.6)); } } " +
    // 4. Card drift (4 variants)
    "@keyframes visionCardDrift0 { 0%,100% { transform: translate(0,0); } 33% { transform: translate(2px,-3px); } 66% { transform: translate(-2px,2px); } } " +
    "@keyframes visionCardDrift1 { 0%,100% { transform: translate(0,0); } 33% { transform: translate(-3px,2px); } 66% { transform: translate(2px,-2px); } } " +
    "@keyframes visionCardDrift2 { 0%,100% { transform: translate(0,0); } 33% { transform: translate(3px,3px); } 66% { transform: translate(-2px,-3px); } } " +
    "@keyframes visionCardDrift3 { 0%,100% { transform: translate(0,0); } 33% { transform: translate(-2px,-2px); } 66% { transform: translate(3px,2px); } } " +
    // 5. Tagline text-shadow glow
    "@keyframes visionTaglineGlow { 0%, 100% { text-shadow: 0 0 8px rgba(0,212,170,0.1); } 50% { text-shadow: 0 0 20px rgba(0,212,170,0.35), 0 0 40px rgba(0,212,170,0.12); } } " +
    //
    // 7. Ring border shimmer
    "@keyframes visionRingShimmer { 0% { border-color: rgba(0,212,170,0.08); } 50% { border-color: rgba(0,212,170,0.22); } 100% { border-color: rgba(0,212,170,0.08); } } "
  );

  // Central nucleus — chip die (square with rounded corners)
  var centralNode = createElement("div", {
    style: {
      position: "absolute",
      top: centerY + "%",
      left: centerX + "%",
      transform: "translate(-50%, -50%)",
      width: 110,
      height: 110,
      borderRadius: 14,
      background: "linear-gradient(135deg, rgba(0,212,170,0.12) 0%, rgba(5,11,24,0.95) 40%, rgba(0,212,170,0.08) 100%)",
      border: "2px solid rgba(0,212,170,0.45)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      animation: "visionNucleusPulse 3s ease-in-out infinite",
      zIndex: 10
    }
  },
    // Die seal ring (outer)
    createElement("div", {
      style: {
        position: "absolute", top: 4, left: 4, right: 4, bottom: 4,
        borderRadius: 10,
        border: "1px solid rgba(0,212,170,0.18)",
        pointerEvents: "none"
      }
    }),
    // Die seal ring (inner)
    createElement("div", {
      style: {
        position: "absolute", top: 8, left: 8, right: 8, bottom: 8,
        borderRadius: 8,
        border: "1px solid rgba(0,212,170,0.08)",
        pointerEvents: "none"
      }
    }),
    // Cross-hair routing channels
    createElement("div", {
      style: {
        position: "absolute", top: "50%", left: 14, right: 14, height: 1,
        background: "rgba(0,212,170,0.06)", pointerEvents: "none"
      }
    }),
    createElement("div", {
      style: {
        position: "absolute", left: "50%", top: 14, bottom: 14, width: 1,
        background: "rgba(0,212,170,0.06)", pointerEvents: "none"
      }
    }),
    // Corner bond pads
    createElement("div", { style: { position: "absolute", top: 10, left: 10, width: 4, height: 4, borderRadius: 1, background: "rgba(0,212,170,0.12)" } }),
    createElement("div", { style: { position: "absolute", top: 10, right: 10, width: 4, height: 4, borderRadius: 1, background: "rgba(0,212,170,0.12)" } }),
    createElement("div", { style: { position: "absolute", bottom: 10, left: 10, width: 4, height: 4, borderRadius: 1, background: "rgba(0,212,170,0.12)" } }),
    createElement("div", { style: { position: "absolute", bottom: 10, right: 10, width: 4, height: 4, borderRadius: 1, background: "rgba(0,212,170,0.12)" } }),
    createElement("div", {
      style: { fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 700, color: COLORS.primary, letterSpacing: "3px", lineHeight: 1, zIndex: 1 }
    }, "GREENBAY"),
    createElement("div", {
      style: { fontSize: 9, fontWeight: 700, color: COLORS.primary, letterSpacing: "2px", textTransform: "uppercase", marginTop: 5, opacity: 0.6, fontFamily: "'DM Mono', monospace", zIndex: 1 }
    }, "FLEET OS"),
    // Die revision indicator
    createElement("div", {
      style: { position: "absolute", bottom: 3, right: 6, fontSize: 5, color: COLORS.primary, opacity: 0.2, fontFamily: "'DM Mono', monospace" }
    }, "rev2.0")
  );

  // 3 concentric chip trace rings (rounded squares)
  var rings = [
    { size: 300, radius: 36, color: COLORS.primary, opacity: 0.12, label: "AI", shimDur: 6 },
    { size: 224, radius: 26, color: COLORS.purple, opacity: 0.12, label: "AUTONOMOUS", shimDur: 4.5 },
    { size: 158, radius: 18, color: COLORS.accent, opacity: 0.12, label: "ELECTRIC", shimDur: 3.5 }
  ];

  // Pin positions: 4 pins per ring (top, right, bottom, left) — small square "chip pins"
  var pinPositions = [
    { top: -3, left: "30%", ml: -3 },   // top-left
    { top: -3, left: "50%", ml: -3 },   // top-center
    { top: -3, left: "70%", ml: -3 },   // top-right
    { top: "30%", right: -3, mt: -3 },  // right-top
    { top: "50%", right: -3, mt: -3 },  // right-center
    { top: "70%", right: -3, mt: -3 },  // right-bottom
    { bottom: -3, left: "70%", ml: -3 },// bottom-right
    { bottom: -3, left: "50%", ml: -3 },// bottom-center
    { bottom: -3, left: "30%", ml: -3 },// bottom-left
    { left: -3, top: "70%", mt: -3 },   // left-bottom
    { left: -3, top: "50%", mt: -3 },   // left-center
    { left: -3, top: "30%", mt: -3 }    // left-top
  ];

  var orbitElements = rings.map(function(r, i) {
    var shimDelay = (i * 1.5).toFixed(1);
    return createElement("div", { key: "ring-" + i },
      // Static trace ring (rounded square)
      createElement("div", {
        style: {
          position: "absolute",
          top: centerY + "%",
          left: centerX + "%",
          width: r.size,
          height: r.size,
          marginTop: -(r.size / 2),
          marginLeft: -(r.size / 2),
          borderRadius: r.radius,
          border: "1.5px solid " + r.color,
          opacity: r.opacity,
          animation: "visionRingShimmer " + r.shimDur + "s " + shimDelay + "s ease-in-out infinite",
          pointerEvents: "none",
          zIndex: 5
        }
      },
        // 4 chip pins per ring
        pinPositions.map(function(pp, pi) {
          var pinStyle = {
            position: "absolute",
            width: 6,
            height: 6,
            borderRadius: 1,
            background: r.color,
            "--pin-color": r.color + "99",
            animation: "visionPinGlow 3s " + (pi * 0.8 + i * 0.3).toFixed(1) + "s ease-in-out infinite"
          };
          if (pp.top !== undefined) pinStyle.top = pp.top;
          if (pp.bottom !== undefined) pinStyle.bottom = pp.bottom;
          if (pp.left !== undefined) pinStyle.left = pp.left;
          if (pp.right !== undefined) pinStyle.right = pp.right;
          if (pp.ml) pinStyle.marginLeft = pp.ml;
          if (pp.mt) pinStyle.marginTop = pp.mt;
          return createElement("div", { key: "pin-" + i + "-" + pi, style: pinStyle });
        })
      ),
      // Data pulse trace overlay (animated gradient traveling along border)
      createElement("div", {
        style: {
          position: "absolute",
          top: centerY + "%",
          left: centerX + "%",
          width: r.size - 4,
          height: r.size - 4,
          marginTop: -((r.size - 4) / 2),
          marginLeft: -((r.size - 4) / 2),
          borderRadius: r.radius - 1,
          border: "1px solid transparent",
          backgroundImage: "linear-gradient(" + COLORS.background + ", " + COLORS.background + "), linear-gradient(90deg, transparent 0%, " + r.color + "44 30%, " + r.color + "88 50%, " + r.color + "44 70%, transparent 100%)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          backgroundSize: "100% 100%, 300% 100%",
          animation: "visionTracePulse " + (8 + i * 2) + "s " + shimDelay + "s linear infinite",
          pointerEvents: "none",
          zIndex: 5
        }
      }),
      // Static label on ring edge
      createElement("div", {
        style: Object.assign({
          position: "absolute",
          top: centerY + "%",
          left: centerX + "%",
          fontSize: 8,
          fontWeight: 700,
          letterSpacing: "2px",
          fontFamily: "'DM Mono', monospace",
          color: r.color,
          opacity: 0.5,
          pointerEvents: "none",
          zIndex: 6
        }, (function() {
          if (i === 0) return { marginTop: -(r.size / 2) - 14, marginLeft: -6 };
          if (i === 1) return { marginTop: -5, marginLeft: (r.size / 2) + 8 };
          return { marginTop: (r.size / 2) + 4, marginLeft: -18 };
        })())
      }, r.label)
    );
  });

  // Circuit trace lines extending from outer ring edges (decorative short traces)
  var traceLines = [];
  var traceConfigs = [
    // Horizontal traces extending from left/right of outer ring
    { top: centerY, left: centerX - 22, width: 6, height: 0, color: COLORS.primary },
    { top: centerY, left: centerX + 16, width: 6, height: 0, color: COLORS.primary },
    // Vertical traces from top/bottom
    { top: centerY - 20, left: centerX, width: 0, height: 5, color: COLORS.primary },
    { top: centerY + 15, left: centerX, width: 0, height: 5, color: COLORS.primary },
    // Diagonal accents at corners
    { top: centerY - 15, left: centerX - 18, width: 4, height: 0, color: COLORS.purple },
    { top: centerY - 15, left: centerX + 14, width: 4, height: 0, color: COLORS.purple },
    { top: centerY + 10, left: centerX - 18, width: 4, height: 0, color: COLORS.accent },
    { top: centerY + 10, left: centerX + 14, width: 4, height: 0, color: COLORS.accent }
  ];
  traceLines = traceConfigs.map(function(t, i) {
    return createElement("div", {
      key: "trace-" + i,
      style: {
        position: "absolute",
        top: t.top + "%",
        left: t.left + "%",
        width: t.width + "%",
        height: t.height > 0 ? t.height + "%" : "1px",
        minHeight: t.height === 0 ? 1 : undefined,
        minWidth: t.width === 0 ? 1 : undefined,
        background: t.color,
        opacity: 0.15,
        pointerEvents: "none",
        zIndex: 4
      }
    });
  });

  // SVG circuit traces with right-angle bends and flowing electrons
  // Paths from each card edge to the center nucleus, with L-shaped bends
  var tracePaths = [
    // NW: right from card → bend down → bend right to center
    { d: "M 26 16 H 37 V 45 H 50", color: pillars[0].color },
    // NE: left from card → bend down → bend left to center
    { d: "M 72 16 H 63 V 45 H 50", color: pillars[1].color },
    // SW: right from card → bend up → bend right to center
    { d: "M 26 68 H 37 V 45 H 50", color: pillars[2].color },
    // SE: left from card → bend up → bend left to center
    { d: "M 72 68 H 63 V 45 H 50", color: pillars[3].color }
  ];

  // Junction dot positions (at the bends)
  var junctions = [
    [{ x: 37, y: 16 }, { x: 37, y: 45 }],
    [{ x: 63, y: 16 }, { x: 63, y: 45 }],
    [{ x: 37, y: 68 }, { x: 37, y: 45 }],
    [{ x: 63, y: 68 }, { x: 63, y: 45 }]
  ];

  var beams = createElement("svg", {
    viewBox: "0 0 100 100",
    preserveAspectRatio: "none",
    style: {
      position: "absolute",
      top: 0, left: 0, width: "100%", height: "100%",
      pointerEvents: "none",
      zIndex: 3,
      overflow: "visible"
    }
  },
    // Render each trace path + electrons
    tracePaths.map(function(tp, i) {
      var dur1 = (2.5 + i * 0.2).toFixed(1);
      var dur2 = (3.0 + i * 0.15).toFixed(1);
      return createElement("g", { key: "trace-" + i },
        // Static trace line
        createElement("path", {
          d: tp.d,
          stroke: tp.color,
          strokeWidth: 0.3,
          strokeOpacity: 0.25,
          fill: "none",
          vectorEffect: "non-scaling-stroke"
        }),
        // Junction dots at each bend
        junctions[i].map(function(j, ji) {
          return createElement("rect", {
            key: "junc-" + ji,
            x: j.x - 0.5,
            y: j.y - 0.5,
            width: 1,
            height: 1,
            fill: tp.color,
            opacity: 0.4,
            rx: 0.15
          });
        }),
        // Electron 1 — flowing toward center
        createElement("circle", {
          r: 0.6,
          fill: tp.color,
          opacity: 0.9,
          filter: "url(#electronGlow" + i + ")"
        },
          createElement("animateMotion", {
            dur: dur1 + "s",
            repeatCount: "indefinite",
            path: tp.d
          })
        ),
        // Electron 2 — staggered
        createElement("circle", {
          r: 0.4,
          fill: tp.color,
          opacity: 0.7
        },
          createElement("animateMotion", {
            dur: dur2 + "s",
            begin: (i * 0.4 + 1.2).toFixed(1) + "s",
            repeatCount: "indefinite",
            path: tp.d
          })
        ),
        // Electron 3 — slower, fainter
        createElement("circle", {
          r: 0.35,
          fill: tp.color,
          opacity: 0.5
        },
          createElement("animateMotion", {
            dur: (parseFloat(dur2) + 0.8).toFixed(1) + "s",
            begin: (i * 0.3 + 0.6).toFixed(1) + "s",
            repeatCount: "indefinite",
            path: tp.d
          })
        )
      );
    }),
    // Trace bus labels (chip-style signal names)
    createElement("text", { x: 31, y: 14, fill: pillars[0].color, fontSize: "1.6", fontFamily: "monospace", opacity: 0.2, textAnchor: "middle" }, "D0"),
    createElement("text", { x: 69, y: 14, fill: pillars[1].color, fontSize: "1.6", fontFamily: "monospace", opacity: 0.2, textAnchor: "middle" }, "CLK"),
    createElement("text", { x: 31, y: 72, fill: pillars[2].color, fontSize: "1.6", fontFamily: "monospace", opacity: 0.2, textAnchor: "middle" }, "PWR"),
    createElement("text", { x: 69, y: 72, fill: pillars[3].color, fontSize: "1.6", fontFamily: "monospace", opacity: 0.2, textAnchor: "middle" }, "IO"),
    // SVG filter definitions for electron glow
    createElement("defs", null,
      tracePaths.map(function(tp, i) {
        return createElement("filter", { key: "f-" + i, id: "electronGlow" + i, x: "-100%", y: "-100%", width: "300%", height: "300%" },
          createElement("feGaussianBlur", { stdDeviation: "0.4", result: "blur" }),
          createElement("feFlood", { floodColor: tp.color, floodOpacity: "0.6", result: "color" }),
          createElement("feComposite", { in2: "blur", operator: "in", result: "glow" }),
          createElement("feMerge", null,
            createElement("feMergeNode", { "in": "glow" }),
            createElement("feMergeNode", { "in": "SourceGraphic" })
          )
        );
      })
    )
  );

  // 4 vision pillar cards
  var driftDurations = [4.2, 4.6, 4.4, 5.0];
  var pillarCards = pillars.map(function(p, i) {
    var pos = cardPos[i];
    return createElement("div", {
      key: "vpillar-" + i,
      style: {
        position: "absolute",
        top: pos.top + "%",
        left: pos.left + "%",
        width: "24%",
        background: "rgba(13,21,37,0.9)",
        borderLeft: "4px solid " + p.color,
        borderRadius: 12,
        padding: "16px 18px",
        animation: "visionCardDrift" + i + " " + driftDurations[i] + "s ease-in-out infinite",
        zIndex: 8
      }
    },
      createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
        Icon(p.svgIcon, 20, p.color),
        createElement("span", { style: { fontSize: 13, fontWeight: 700, color: p.color } }, p.title)
      )
    );
  });

  // Full chip visual container
  var orbitalVisual = createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      height: vizHeight,
      marginBottom: 16
    }
  },
    // Subtle circuit grid background
    createElement("div", {
      style: {
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: "linear-gradient(rgba(0,212,170,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,170,0.03) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        pointerEvents: "none"
      }
    }),
    // Radial glow at center
    createElement("div", {
      style: {
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "radial-gradient(ellipse at 50% 45%, rgba(0,212,170,0.06) 0%, transparent 50%)",
        pointerEvents: "none"
      }
    }),
    // IC Package outline (outermost dashed border)
    createElement("div", {
      style: {
        position: "absolute",
        top: centerY + "%",
        left: centerX + "%",
        width: 370,
        height: 370,
        marginTop: -185,
        marginLeft: -185,
        borderRadius: 6,
        border: "1px dashed rgba(0,212,170,0.06)",
        pointerEvents: "none",
        zIndex: 1
      }
    },
      // Pin 1 indicator (dot in top-left corner)
      createElement("div", {
        style: {
          position: "absolute", top: 6, left: 6, width: 6, height: 6,
          borderRadius: "50%", background: COLORS.primary, opacity: 0.15
        }
      }),
      // Package part number
      createElement("div", {
        style: {
          position: "absolute", bottom: 4, right: 8, fontSize: 6,
          fontFamily: "'DM Mono', monospace", color: COLORS.primary, opacity: 0.1, letterSpacing: "1px"
        }
      }, "GB-FOS-2030")
    ),
    // Corner registration marks
    createElement("div", { style: { position: "absolute", top: 4, left: 4, width: 14, height: 14, borderTop: "1px solid rgba(0,212,170,0.12)", borderLeft: "1px solid rgba(0,212,170,0.12)", pointerEvents: "none", zIndex: 1 } }),
    createElement("div", { style: { position: "absolute", top: 4, right: 4, width: 14, height: 14, borderTop: "1px solid rgba(0,212,170,0.12)", borderRight: "1px solid rgba(0,212,170,0.12)", pointerEvents: "none", zIndex: 1 } }),
    createElement("div", { style: { position: "absolute", bottom: 4, left: 4, width: 14, height: 14, borderBottom: "1px solid rgba(0,212,170,0.12)", borderLeft: "1px solid rgba(0,212,170,0.12)", pointerEvents: "none", zIndex: 1 } }),
    createElement("div", { style: { position: "absolute", bottom: 4, right: 4, width: 14, height: 14, borderBottom: "1px solid rgba(0,212,170,0.12)", borderRight: "1px solid rgba(0,212,170,0.12)", pointerEvents: "none", zIndex: 1 } }),
    centralNode,
    orbitElements,
    traceLines,
    beams,
    pillarCards
  );

  return createElement("div", { style: S.slide },
    styleTag,
    createElement("h2", { style: S.slideTitle }, "The Vision"),
    createElement("p", {
      style: Object.assign({}, S.slideSubtitle, {
        fontFamily: "'DM Serif Display', serif",
        fontSize: 20,
        fontStyle: "italic",
        maxWidth: 700,
        marginBottom: 16
      })
    }, "The operating system for autonomous fleets"),
    orbitalVisual,
    // Opportunity size numbers
    createElement("div", {
      style: {
        display: "flex",
        justifyContent: "center",
        gap: 16,
        padding: "10px 0 6px"
      }
    },
      [
        { value: fmtB(topDown.tam_2030_usd_b), label: "Fleet Tech Market 2030", color: COLORS.primary },
        { value: (topDown.cagr_pct || 13.3) + "%", label: "Market CAGR", color: COLORS.purple },
        { value: "10x", label: "EV Truck Growth", color: COLORS.accent },
        { value: fmtM(bottomUp.tam_2035_usd_m), label: "Orchestration TAM 2035", color: COLORS.success }
      ].map(function(stat, i) {
        return createElement("div", {
          key: "opp-" + i,
          style: {
            textAlign: "center",
            padding: "10px 20px",
            background: "rgba(13,21,37,0.85)",
            border: "1px solid " + stat.color + "18",
            borderTop: "2px solid " + stat.color,
            borderRadius: 8,
            minWidth: 115
          }
        },
          createElement("div", {
            style: {
              fontFamily: "'DM Mono', monospace",
              fontSize: 24,
              fontWeight: 700,
              color: stat.color,
              letterSpacing: "1px"
            }
          }, stat.value),
          createElement("div", {
            style: {
              fontSize: 9,
              color: COLORS.textMuted,
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginTop: 4
            }
          }, stat.label)
        );
      })
    ),
    // Closing statement
    createElement("div", {
      style: {
        textAlign: "center",
        padding: "8px 0 0"
      }
    },
      createElement("p", {
        style: {
          fontFamily: "'DM Serif Display', serif",
          fontSize: 16,
          color: COLORS.text,
          animation: "visionTaglineGlow 4s ease-in-out infinite",
          margin: 0
        }
      }, "The fleet brain for 2030.")
    )
  );
}

// ============ SLIDE 11: THE ASK ============
function SlideAsk() {
  var investmentAlloc = [
    { label: "R&D & Product", pct: 65, color: COLORS.primary },
    { label: "Operations & Overhead", pct: 18, color: COLORS.secondary },
    { label: "Buffer", pct: 9, color: COLORS.textDim },
    { label: "Sales & BD", pct: 8, color: COLORS.accent }
  ];

  var milestones = [
    { period: "Q1 2026", event: "2 LOIs signed, deploy", status: "active" },
    { period: "Q2 2026", event: "First US pilot", status: "upcoming" },
    { period: "Q3\u2013Q4 2026", event: "First recurring revenue", status: "upcoming" },
    { period: "2027", event: "$3M ARR \u2192 Series A", status: "future" }
  ];

  return createElement("div", { style: S.slide },
    createElement("h2", { style: S.slideTitle }, "The Ask"),
    // Raise headline
    createElement("div", {
      style: {
        textAlign: "center",
        marginBottom: 36,
        padding: "36px 40px",
        background: "linear-gradient(135deg, rgba(0,212,170,0.08), rgba(99,102,241,0.08))",
        border: "2px solid " + COLORS.primary + "44",
        borderRadius: 20
      }
    },
      createElement("div", {
        style: { fontSize: 14, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 12 }
      }, "Pre-Seed Round"),
      createElement("div", {
        style: {
          fontSize: 64,
          fontWeight: 700,
          fontFamily: "'DM Serif Display', serif",
          color: COLORS.primary,
          lineHeight: 1.1,
          marginBottom: 12
        }
      }, "$3M"),
      createElement("div", {
        style: { fontSize: 16, color: COLORS.textMuted }
      }, "$3M ARR \u2192 Series A")
    ),
    // Two columns: Use of Funds + Milestones
    createElement("div", {
      style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }
    },
      // Left: Use of Funds
      createElement("div", {
        style: {
          background: COLORS.card,
          borderRadius: 14,
          padding: "24px 28px"
        }
      },
        createElement("div", {
          style: { fontSize: 14, fontWeight: 600, color: COLORS.text, marginBottom: 20 }
        }, "Use of Funds"),
        // Stacked bar
        createElement("div", {
          style: { display: "flex", borderRadius: 8, overflow: "hidden", height: 36, marginBottom: 24 }
        },
          investmentAlloc.map(function(a, i) {
            return createElement("div", {
              key: i,
              style: {
                width: a.pct + "%",
                background: a.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "#fff",
                transition: "opacity 0.2s"
              },
              title: a.label + ": " + a.pct + "%"
            }, a.pct >= 12 ? a.pct + "%" : "");
          })
        ),
        // Legend
        investmentAlloc.map(function(a, i) {
          return createElement("div", {
            key: i,
            style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }
          },
            createElement("div", {
              style: { width: 12, height: 12, borderRadius: 3, background: a.color, flexShrink: 0 }
            }),
            createElement("span", {
              style: { fontSize: 13, color: COLORS.text, flex: 1 }
            }, a.label),
            createElement("span", {
              style: { fontSize: 14, color: COLORS.textMuted, fontWeight: 700, fontFamily: "'DM Mono', monospace" }
            }, a.pct + "% \u2014 $" + Math.round(3000 * a.pct / 100) + "K")
          );
        })
      ),
      // Right: Milestones
      createElement("div", {
        style: {
          background: COLORS.card,
          borderRadius: 14,
          padding: "24px 28px"
        }
      },
        createElement("div", {
          style: { fontSize: 14, fontWeight: 600, color: COLORS.text, marginBottom: 20 }
        }, "Key Milestones"),
        milestones.map(function(m, i) {
          var isActive = m.status === "active";
          var dotColor = isActive ? COLORS.primary : m.status === "upcoming" ? COLORS.secondary : COLORS.textDim;
          return createElement("div", {
            key: i,
            style: {
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
              marginBottom: 20,
              paddingLeft: 4,
              position: "relative"
            }
          },
            // Dot + line
            createElement("div", {
              style: { display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }
            },
              createElement("div", {
                style: {
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: isActive ? dotColor : "transparent",
                  border: "2px solid " + dotColor,
                  flexShrink: 0,
                  boxShadow: isActive ? "0 0 10px " + dotColor + "66" : "none"
                }
              }),
              i < milestones.length - 1 ? createElement("div", {
                style: {
                  width: 2,
                  height: 32,
                  background: COLORS.border,
                  marginTop: 4
                }
              }) : null
            ),
            // Content
            createElement("div", { style: { flex: 1, paddingTop: 0 } },
              createElement("div", {
                style: {
                  fontSize: 13,
                  fontWeight: 700,
                  color: isActive ? COLORS.primary : COLORS.text,
                  fontFamily: "'DM Mono', monospace",
                  marginBottom: 3
                }
              }, m.period),
              createElement("div", {
                style: { fontSize: 13, color: COLORS.textMuted }
              }, m.event)
            )
          );
        })
      )
    ),
    // Contact footer
    createElement("div", {
      style: {
        textAlign: "center",
        marginTop: 32,
        padding: "16px 0",
        borderTop: "1px solid " + COLORS.border
      }
    },
      createElement("a", { href: "mailto:info@greenbay.solutions", style: { fontSize: 14, color: COLORS.textMuted, textDecoration: "none" } }, "info@greenbay.solutions"),
      createElement("span", { style: { margin: "0 16px", color: COLORS.border } }, "|"),
      createElement("a", { href: "https://greenbay.solutions", target: "_blank", rel: "noopener", style: { fontSize: 14, color: COLORS.textMuted, textDecoration: "none" } }, "greenbay.solutions"),
      createElement("span", { style: { margin: "0 16px", color: COLORS.border } }, "|"),
      createElement("span", { style: { fontSize: 14, color: COLORS.textMuted } }, "+972 (0) 52 7251714")
    )
  );
}

// ============ SLIDE 11: APPENDIX — DASHBOARDS & SOURCES ============
function SlideAppendix() {
  var dashboards = [
    {
      title: "Market Dashboard",
      desc: "Total addressable market sizing, fleet statistics, and IEA/ACEA data visualizations.",
      url: "https://realorenarieli.github.io/greenbay-market-dashboard/"
    },
    {
      title: "Fleet Orchestration",
      desc: "Unit economics, competitive landscape, and ARR growth scenario modeling.",
      url: "https://realorenarieli.github.io/greenbay-fleet-orchestration/"
    },
    {
      title: "Fleet Electrification Intel",
      desc: "EV fleet transition data, regional projections, and Gartner strategic planning assumptions.",
      url: "https://realorenarieli.github.io/fleet-electrification-intel/"
    }
  ];

  var cats = (sources.categories || []);

  var expandedState = useState({});
  var expanded = expandedState[0];
  var setExpanded = expandedState[1];

  function toggleCat(idx) {
    var next = Object.assign({}, expanded);
    next[idx] = !next[idx];
    setExpanded(next);
  }

  return createElement("div", { style: S.slide },
    createElement("h2", { style: S.slideTitle }, "Appendix"),
    createElement("p", { style: S.slideSubtitle },
      "Interactive dashboards and source registry — " + (sources.total_sources || 32) + " verified sources across " + cats.length + " categories."
    ),
    // Dashboard links
    createElement("div", {
      style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 36 }
    },
      dashboards.map(function(d, i) {
        return createElement("a", {
          key: i,
          href: d.url,
          target: "_blank",
          rel: "noopener",
          style: {
            background: COLORS.card,
            borderRadius: 14,
            padding: "24px 24px 20px",
            textDecoration: "none",
            border: "1px solid " + COLORS.border,
            transition: "border-color 0.2s, transform 0.2s",
            display: "block"
          },
          onMouseEnter: function(e) { e.currentTarget.style.borderColor = COLORS.primary; e.currentTarget.style.transform = "translateY(-2px)"; },
          onMouseLeave: function(e) { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.transform = "none"; }
        },
          createElement("div", {
            style: { fontSize: 15, fontWeight: 700, color: COLORS.primary, marginBottom: 8, fontFamily: "'DM Mono', monospace" }
          }, d.title),
          createElement("div", {
            style: { fontSize: 13, color: COLORS.textMuted, lineHeight: 1.5 }
          }, d.desc),
          createElement("div", {
            style: { fontSize: 12, color: COLORS.textDim, marginTop: 12, fontFamily: "'DM Mono', monospace" }
          }, "\u2192 Open Dashboard")
        );
      })
    ),
    // Source registry
    createElement("div", {
      style: {
        background: COLORS.card,
        borderRadius: 14,
        padding: "20px 24px",
        maxHeight: 420,
        overflowY: "auto"
      }
    },
      createElement("div", {
        style: { fontSize: 14, fontWeight: 600, color: COLORS.text, marginBottom: 16 }
      }, "Source Registry"),
      cats.map(function(cat, ci) {
        var isOpen = expanded[ci];
        var items = cat.items || [];
        return createElement("div", { key: ci, style: { marginBottom: 2 } },
          createElement("button", {
            onClick: function() { toggleCat(ci); },
            style: {
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 12px",
              background: isOpen ? COLORS.cardHover : "transparent",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              color: COLORS.text,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              textAlign: "left"
            }
          },
            createElement("span", null, cat.category),
            createElement("span", {
              style: { fontSize: 11, color: COLORS.textDim, fontFamily: "'DM Mono', monospace" }
            }, items.length + " source" + (items.length !== 1 ? "s" : "") + " " + (isOpen ? "\u25B2" : "\u25BC"))
          ),
          isOpen ? createElement("div", {
            style: { padding: "4px 12px 12px 24px" }
          },
            items.map(function(item, ii) {
              return createElement("div", {
                key: ii,
                style: { display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }
              },
                createElement("div", {
                  style: { width: 5, height: 5, borderRadius: "50%", background: COLORS.primary, flexShrink: 0, marginTop: 6 }
                }),
                createElement("div", null,
                  item.url
                    ? createElement("a", {
                        href: item.url,
                        target: "_blank",
                        rel: "noopener",
                        style: { fontSize: 12, color: COLORS.info, textDecoration: "none" }
                      }, item.name)
                    : createElement("span", { style: { fontSize: 12, color: COLORS.text } }, item.name),
                  createElement("span", {
                    style: { fontSize: 11, color: COLORS.textDim, marginLeft: 6 }
                  }, "\u2014 " + item.org),
                  item.note ? createElement("div", {
                    style: { fontSize: 11, color: COLORS.textDim, marginTop: 2, fontStyle: "italic" }
                  }, item.note) : null
                )
              );
            })
          ) : null
        );
      })
    )
  );
}

// ============ NAVIGATION COMPONENTS ============
function NavDots(props) {
  return createElement("div", { style: S.navDots },
    SLIDE_TITLES.map(function(title, i) {
      return createElement("button", {
        key: i,
        title: title,
        style: Object.assign({}, S.navDot, i === props.active ? S.navDotActive : {}),
        onClick: function() { props.onChange(i); }
      });
    })
  );
}

function NavArrows(props) {
  return createElement("div", null,
    props.active > 0 ? createElement("button", {
      style: Object.assign({}, S.navArrow, { right: 120 }),
      onClick: function() { props.onChange(props.active - 1); }
    }, "\u2190 Prev") : null,
    props.active < TOTAL_SLIDES - 1 ? createElement("button", {
      style: Object.assign({}, S.navArrow, { right: 36 }),
      onClick: function() { props.onChange(props.active + 1); }
    }, "Next \u2192") : null
  );
}

function SlideCounter(props) {
  return createElement("div", { style: S.slideCounter },
    (props.active + 1) + " / " + TOTAL_SLIDES,
    createElement("span", { style: { marginLeft: 12, color: COLORS.textDim } }, SLIDE_TITLES[props.active])
  );
}

// ============ APP COMPONENT ============
function App() {
  var slideState = useState(0);
  var activeSlide = slideState[0];
  var setActiveSlide = slideState[1];

  var fadeState = useState(true);
  var visible = fadeState[0];
  var setVisible = fadeState[1];

  var goTo = useCallback(function(index) {
    if (index < 0 || index >= TOTAL_SLIDES || index === activeSlide) return;
    setVisible(false);
    setTimeout(function() {
      setActiveSlide(index);
      setVisible(true);
    }, 200);
  }, [activeSlide]);

  // Keyboard navigation
  useEffect(function() {
    function handleKey(e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goTo(activeSlide + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goTo(activeSlide - 1);
      }
    }
    document.addEventListener('keydown', handleKey);
    return function() { document.removeEventListener('keydown', handleKey); };
  }, [activeSlide, goTo]);

  var slides = [
    SlideTitle,
    SlideProblem,
    SlideSolution,
    SlideWhyNow,
    SlideMarket,
    SlideCompetitive,
    SlideTraction,
    SlideTeam,
    SlideBusinessModel,
    SlideVision,
    SlideAsk,
    SlideAppendix
  ];

  return createElement("div", { style: S.app },
    // Slide content with fade
    createElement("div", {
      style: {
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s ease"
      }
    },
      createElement(slides[activeSlide], null)
    ),
    // Navigation
    createElement(NavDots, { active: activeSlide, onChange: goTo }),
    createElement(NavArrows, { active: activeSlide, onChange: goTo }),
    createElement(SlideCounter, { active: activeSlide })
  );
}

// ============ RENDER ============
var loading = document.getElementById('loading');
if (loading) loading.style.display = 'none';
ReactDOM.render(createElement(App, null), document.getElementById('root'));

} catch(err) {
  console.error('Dashboard error:', err);
  var errEl = document.getElementById('error-msg');
  var loadStatus = document.getElementById('load-status');
  if (errEl) { errEl.style.display = 'block'; errEl.textContent = err.message; }
  if (loadStatus) { loadStatus.textContent = 'Dashboard failed to load'; }
}

})();
