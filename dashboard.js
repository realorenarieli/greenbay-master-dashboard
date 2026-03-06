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
    { value: "5\u20138", label: "Siloed Tools Per Operator", context: "Telematics, charging, routing, maintenance, compliance \u2014 none connected" },
    { value: "40%", label: "Time Lost to Manual Bridging", context: "Operators re-key data across disconnected systems daily" },
    { value: "0", label: "Unified Platforms", context: "No single pane of glass for fleet orchestration exists" }
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
        createElement("div", {
          style: { fontSize: 11, color: COLORS.textDim, fontFamily: "'DM Mono', monospace" }
        }, m.context)
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
      "Fleet operators juggle disconnected tools that don\u2019t talk to each other. Accelerated by the shift to electric."
    ),
    metricCards,
    chaosVisual
  );
}

// ============ SLIDE 3: THE SOLUTION ============
function SlideSolution() {
  var inputs = [
    { icon: "\uD83D\uDCE1", label: "Telematics & GPS" },
    { icon: "\uD83D\uDD0C", label: "EV Chargers" },
    { icon: "\u26A1", label: "Grid & Energy" },
    { icon: "\uD83C\uDF24\uFE0F", label: "Weather & Traffic" },
    { icon: "\uD83D\uDCCB", label: "Fleet Schedules" },
    { icon: "\uD83D\uDD27", label: "Vehicle Health" }
  ];

  var capabilities = [
    { title: "Charge Orchestration", color: COLORS.primary },
    { title: "Route Intelligence", color: COLORS.secondary },
    { title: "Energy Management", color: COLORS.accent },
    { title: "Fleet Analytics", color: COLORS.info }
  ];

  var outputs = [
    { icon: "\uD83D\uDCCA", label: "Real-time Dashboards" },
    { icon: "\uD83D\uDD14", label: "Automated Alerts" },
    { icon: "\uD83D\uDDFA\uFE0F", label: "Route Recommendations" },
    { icon: "\uD83D\uDCA1", label: "Energy Optimization" },
    { icon: "\uD83D\uDCC8", label: "Performance Reports" },
    { icon: "\uD83D\uDD17", label: "API Integrations" }
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
    }, "Raw Data"),
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
        createElement("span", { style: { fontSize: 14 } }, item.icon),
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
    }, "Actionable Intelligence"),
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
        createElement("span", {
          style: { fontSize: 16, width: 24, textAlign: "center", flexShrink: 0 }
        }, item.icon),
        createElement("span", {
          style: { fontSize: 11, fontWeight: 600, color: COLORS.text }
        }, item.label)
      );
    })
  );

  return createElement("div", { style: S.slide },
    styleTag,
    createElement("h2", { style: S.slideTitle }, "The Solution"),
    createElement("p", { style: Object.assign({}, S.slideSubtitle, { marginBottom: 20 }) },
      "Raw, fragmented fleet data enters the Greenbay engine \u2014 and exits as unified, actionable intelligence."
    ),
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
    // Bottom tagline
    createElement("div", {
      style: {
        marginTop: 16,
        textAlign: "center",
        fontSize: 13,
        color: COLORS.textMuted,
        fontStyle: "italic"
      }
    }, "One platform replacing 5\u20138 fragmented tools \u2014 hardware-agnostic, EV-native, built for autonomy")
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
    { icon: "\uD83C\uDDEA\uD83C\uDDFA", title: "Regulatory Mandates", stat: "100% ZEV trucks by 2036", sub: "CA ACF Rule", color: COLORS.info },
    { icon: "\u26A1", title: "Fleet Electrification", stat: "93K \u2192 370K EV trucks/yr", sub: "by 2030", color: COLORS.primary },
    { icon: "\uD83E\uDD16", title: "Agentic AI Wave", stat: "2% \u2192 25% T&L adoption", sub: "Gartner", color: COLORS.accent },
    { icon: "\uD83D\uDE9B", title: "Autonomous Vehicles", stat: "2.7K \u2192 475K L4+", sub: "by 2030", color: COLORS.purple }
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
        createElement("span", { style: { fontSize: 18 } }, f.icon),
        createElement("span", { style: { fontSize: 12, fontWeight: 700, color: f.color } }, f.title)
      ),
      createElement("div", { style: { fontSize: 15, fontWeight: 800, color: COLORS.text, marginBottom: 2 } }, f.stat),
      createElement("div", { style: { fontSize: 10, color: COLORS.textMuted } }, f.sub)
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
    { value: "4x", label: "EV Truck Sales Growth", sub: "93K to 370K units/yr by 2030", color: COLORS.primary, glowColor: "rgba(0,212,170,0.35)" },
    { value: "176x", label: "Autonomous Fleet Scale", sub: "2.7K to 475K L4+ vehicles", color: COLORS.purple, glowColor: "rgba(168,85,247,0.35)" },
    { value: "-15%", label: "Diesel Fleet Decline", sub: "Accelerating fleet turnover", color: COLORS.danger, glowColor: "rgba(239,68,68,0.35)" }
  ];

  var bottomSection = createElement("div", {
    style: { display: "grid", gridTemplateColumns: "3fr 2fr", gap: 24 }
  },
    // Left: Gartner SPAs LineChart
    createElement("div", { style: S.chartCard },
      createElement("div", { style: S.chartTitle }, "Gartner Strategic Planning Assumptions"),
      createElement("div", { style: S.chartSubtitle }, "Adoption curves \u2014 Predicts 2026: Transportation"),
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
          createElement("div", null,
            createElement("div", { style: { fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 2 } }, sc.label),
            createElement("div", { style: { fontSize: 10, color: COLORS.textMuted } }, sc.sub)
          )
        );
      })
    )
  );

  return createElement("div", { style: S.slide },
    styleTag,
    // Zone A: Title
    createElement("h2", { style: S.slideTitle }, "Why Now"),
    createElement("p", { style: Object.assign({}, S.slideSubtitle, { maxWidth: 850, marginBottom: 20 }) },
      "Four mega-forces are converging on a single window. The platform that captures orchestration now owns the decade."
    ),
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
    { label: "Total Addressable Market", value: fmtM(bottomUp.tam_2030_usd_m), sub: "6 fleet segments \u00D7 ARPU, global", right: "\u2192 " + fmtM(bottomUp.tam_2035_usd_m) + " by 2035", color: COLORS.primary, rgb: "0,212,170", barWidth: "100%", glow: "funnelGlow0", fontSize: 42 },
    { label: "Serviceable Addressable Market", value: fmtM(bottomUp.sam_2030_usd_m), sub: "83% of TAM \u2014 EU + NA primary", right: "", color: COLORS.secondary, rgb: "99,102,241", barWidth: "83%", glow: "funnelGlow1", fontSize: 38 },
    { label: "Serviceable Obtainable Market", value: fmtM(bottomUp.som_base_2030_usd_m), sub: "5% penetration \u2014 Samsara precedent", right: "Our capture target", color: COLORS.accent, rgb: "245,158,11", barWidth: "38%", glow: "funnelGlow2", fontSize: 36 }
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
          }, t.label),
          createElement("div", {
            style: { fontSize: 10, color: COLORS.textDim, marginTop: 2 }
          }, t.sub)
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
        }, t.value),
        // Right context (spacer + text)
        t.right ? createElement("div", {
          style: { marginLeft: "auto", fontSize: 12, color: t.color, fontWeight: 600, fontFamily: "'DM Mono', monospace", position: "relative", zIndex: 1, whiteSpace: "nowrap" }
        }, t.right) : null
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
    createElement("div", { style: S.chartTitle }, "TAM by Segment \u2014 Ex-China vs China ($M)"),
    createElement("div", { style: S.chartSubtitle }, "Vehicles \u00D7 ARPU across 6 fleet segments"),
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
    createElement("div", { style: S.chartTitle }, "SAM by Region \u2014 " + fmtM(bottomUp.sam_2030_usd_m) + " Total"),
    createElement("div", { style: S.chartSubtitle }, "EU + NA primary | APAC emerging | China 30% accessible"),
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
    createElement("p", { style: Object.assign({}, S.slideSubtitle, { maxWidth: 850, marginBottom: 24 }) },
      fmtM(bottomUp.tam_2030_usd_m) + " addressable by 2030 \u2014 built bottom-up from 6 fleet segments \u00D7 ARPU. We capture " + fmtM(bottomUp.som_base_2030_usd_m) + " at just 5%."
    ),
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
    { label: "EV-Native", desc: advantages.vs_samsara, rgb: "0,212,170" },
    { label: "Hardware-Agnostic", desc: advantages.vs_einride, rgb: "0,212,170" },
    { label: "Full Orchestration", desc: advantages.vs_driivz, rgb: "0,212,170" }
  ];

  var chartCard = createElement("div", {
    style: Object.assign({}, S.chartCard, { animation: "compChartGlow 5s ease-in-out infinite" })
  },
    createElement("div", { style: S.chartTitle }, "Competitor Revenue ($M)"),
    createElement("div", { style: S.chartSubtitle }, "Annual revenue \u2014 latest reported | All execution-layer players"),
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
          style: { fontSize: 12, fontWeight: 700, color: COLORS.primary, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }
        }, d.label),
        createElement("div", {
          style: { fontSize: 10, color: COLORS.textMuted, lineHeight: 1.5 }
        }, d.desc || '')
      );
    })
  );

  // ── Assemble slide ──
  return createElement("div", { style: S.slide },
    styleTag,
    // Zone A: Title
    createElement("h2", { style: S.slideTitle }, "Why Greenbay Wins"),
    createElement("p", { style: Object.assign({}, S.slideSubtitle, { marginBottom: 24 }) },
      "Greenbay owns Layer 2 \u2014 the only orchestration layer in a 4-layer stack. Competitors are point-solutions or legacy platforms."
    ),
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
    { period: "Q2 2026", label: "Europe Expansion", value: "EU", detail: "Spain & Nordics", status: "upcoming" },
    { period: "Q3 2026", label: "US Expansion", value: "US", detail: "First US market entry", status: "upcoming" },
    { period: "Q4 2026", label: "Signed POs", value: "2", detail: "Purchase orders secured", status: "upcoming" }
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
      "2 LOIs secured for pilot deployments. 200+ Qualified Accounts identified, 20 engaged in product trials."
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
      background: "10+ years in mobility operations software",
      prev: "Ex-Optibus & Via",
      expertise: "Fleet operations, product strategy, market development"
    },
    {
      name: "Shira Golan",
      role: "Co-CEO",
      initials: "SG",
      photo: "assets/shira-golan.jpg",
      color: COLORS.secondary,
      background: "2 successful exits, R&D scaling expert",
      prev: "Fortune 500 partnerships",
      expertise: "Business development, enterprise sales, strategic partnerships"
    },
    {
      name: "Daniel Odesser",
      role: "CTO",
      initials: "DO",
      photo: "assets/daniel-odesser.jpg",
      color: COLORS.accent,
      background: "Second-time founder, high-reliability platforms",
      prev: "Ex-Optibus & Auto Fleet",
      expertise: "Platform architecture, real-time systems, infrastructure"
    }
  ];

  var whyUs = [
    { label: "Domain Depth", desc: "All 3 founders built fleet-tech at scale. Not tourists \u2014 operators who shipped products used by thousands of vehicles.", color: COLORS.primary },
    { label: "Technical Edge", desc: "Real-time systems, EV optimization, and hardware-agnostic platform architecture from day one.", color: COLORS.secondary },
    { label: "Market Access", desc: "Direct relationships with EU and NA fleet operators, charging OEMs, and industry regulators.", color: COLORS.accent }
  ];

  return createElement("div", { style: S.slide },
    createElement("h2", { style: S.slideTitle }, "Team"),
    createElement("p", { style: S.slideSubtitle },
      "Deep domain expertise in fleet operations, mobility software, and enterprise scale. All founders are repeat builders in the space."
    ),
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
              fontSize: 13,
              color: COLORS.text,
              marginBottom: 6,
              lineHeight: 1.5
            }
          }, t.background),
          createElement("div", {
            style: {
              fontSize: 12,
              color: COLORS.primary,
              fontWeight: 600,
              marginBottom: 8,
              fontFamily: "'DM Mono', monospace"
            }
          }, t.prev),
          createElement("div", {
            style: {
              fontSize: 11,
              color: COLORS.textMuted,
              lineHeight: 1.5,
              borderTop: "1px solid " + COLORS.border,
              paddingTop: 10,
              marginTop: 4
            }
          }, t.expertise)
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
            padding: "18px 20px"
          }
        },
          createElement("div", {
            style: { fontSize: 13, fontWeight: 700, color: w.color, marginBottom: 6 }
          }, w.label),
          createElement("div", {
            style: { fontSize: 12, color: COLORS.textMuted, lineHeight: 1.6 }
          }, w.desc)
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
    { label: "ACV", value: "$" + (cm.acv_usd || 0).toLocaleString(), color: COLORS.primary, sub: "Annual contract value" },
    { label: "Gross Margin", value: (cm.gross_margin_pct || 0) + "%", color: COLORS.success, sub: "SaaS median: " + (benchmarks.saas_median_gross_margin_pct || 75) + "%" },
    { label: "LTV:CAC", value: (cm.ltv_cac_ratio || 0) + "x", color: COLORS.accent, sub: "SaaS median: " + (benchmarks.saas_median_ltv_cac || 3) + "x" },
    { label: "CAC Payback", value: (cm.cac_payback_months || 0) + " mo", color: COLORS.info, sub: "SaaS median: " + (benchmarks.saas_median_cac_payback_months || 18) + "mo" },
    { label: "NRR", value: (cm.nrr_pct || 0) + "%", color: COLORS.purple, sub: "SaaS median: " + (benchmarks.saas_median_nrr_pct || 110) + "%" }
  ];

  return createElement("div", { style: S.slide },
    createElement("h2", { style: S.slideTitle }, "Business Model"),
    createElement("p", { style: S.slideSubtitle },
      "Enterprise SaaS with $" + ((ue.core_metrics || {}).acv_usd || 375000).toLocaleString() + " ACV. Land-and-expand model: start with one depot, grow across the fleet. " + ((ue.core_metrics || {}).cac_payback_months || 5.6) + "-month CAC payback."
    ),
    // Key metrics row
    createElement("div", { style: S.grid5 },
      keyMetrics.map(function(m, i) {
        return createElement("div", {
          key: i,
          style: Object.assign({}, S.metricCard, { borderTop: "4px solid " + m.color })
        },
          createElement("div", { style: S.metricLabel }, m.label),
          createElement("div", { style: Object.assign({}, S.metricValue, { color: m.color }) }, m.value),
          createElement("div", { style: S.metricSub }, m.sub)
        );
      })
    ),
    // ARR Chart
    createElement("div", { style: S.chartCard },
      createElement("div", { style: S.chartTitle }, "ARR Trajectory \u2014 5 Scenarios (2025\u20132030)"),
      createElement("div", { style: S.chartSubtitle }, "Anchored: 2026=$0.8M, 2027=$3.0M | TAM-based penetration models"),
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

// ============ SLIDE 10: THE ASK ============
function SlideAsk() {
  var investmentAlloc = [
    { label: "R&D & Product", pct: 65, color: COLORS.primary },
    { label: "Operations & Overhead", pct: 18, color: COLORS.secondary },
    { label: "Buffer", pct: 9, color: COLORS.textDim },
    { label: "Sales & BD", pct: 8, color: COLORS.accent }
  ];

  var milestones = [
    { period: "Q1 2026", event: "2 pilot LOIs signed, deployments begin", status: "active" },
    { period: "Q2 2026", event: "First US pilot, commercial agreements", status: "upcoming" },
    { period: "Q3\u2013Q4 2026", event: "First recurring revenue from engaged accounts", status: "upcoming" },
    { period: "2027", event: "$3M ARR milestone, Series A readiness", status: "future" }
  ];

  return createElement("div", { style: S.slide },
    createElement("h2", { style: S.slideTitle }, "The Ask"),
    createElement("p", { style: S.slideSubtitle },
      "Raising $3M pre-seed to convert pipeline into revenue, expand platform capabilities, and reach Series A milestone of $3M ARR by 2027."
    ),
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
      }, "18-month runway to $3M ARR and Series A")
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
