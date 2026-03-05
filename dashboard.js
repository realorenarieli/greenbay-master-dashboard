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
  "The Ask"
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
  return createElement("div", {
    style: Object.assign({}, S.slide, {
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center"
    })
  },
    createElement("img", {
      src: "assets/greenbay-logo.png",
      alt: "Greenbay",
      style: {
        width: 80,
        height: 80,
        objectFit: "contain",
        marginBottom: 32,
        filter: "drop-shadow(0 0 20px rgba(0,212,170,0.3))"
      }
    }),
    createElement("h1", {
      style: {
        fontFamily: "'DM Serif Display', serif",
        fontSize: 64,
        color: COLORS.text,
        margin: "0 0 16px",
        letterSpacing: "-2px"
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
    }, "The Orchestration Layer for Electric & Autonomous Fleets"),
    createElement("div", {
      style: {
        display: "flex",
        gap: 24,
        alignItems: "center",
        marginBottom: 48
      }
    },
      createElement("span", {
        style: {
          padding: "6px 16px",
          borderRadius: 20,
          background: "rgba(0,212,170,0.1)",
          border: "1px solid rgba(0,212,170,0.3)",
          color: COLORS.primary,
          fontSize: 12,
          fontFamily: "'DM Mono', monospace"
        }
      }, "Seed Round \u2014 $3M"),
      createElement("span", {
        style: { color: COLORS.textDim, fontSize: 13 }
      }, "Data as of " + (meta.data_as_of || ''))
    ),
    createElement("div", {
      style: {
        color: COLORS.textDim,
        fontSize: 12,
        animation: "pulse 2s ease-in-out infinite"
      }
    },
      createElement("span", { style: { marginRight: 8 } }, "\u2192"),
      "Press arrow keys or click dots to navigate"
    )
  );
}

// ============ SLIDE 2: THE PROBLEM ============
function SlideProblem() {
  var fleetSeries = fleet.global_series || [];

  var painPoints = [
    {
      icon: "\u26A1",
      title: "5M+ Commercial EVs by 2030",
      description: "Electric bus stock growing 12x. Truck electrification accelerating. No unified system to orchestrate charging, routing, and grid costs across mixed depots."
    },
    {
      icon: "\uD83D\uDD0C",
      title: "Fragmented Tool Chaos",
      description: "Fleet operators juggle 5-8 separate tools for telematics, charging, routing, maintenance, and compliance. Data silos create blind spots and inefficiency."
    },
    {
      icon: "\uD83D\uDEE2\uFE0F",
      title: "Incumbents Built for Diesel",
      description: "Samsara, Geotab, and Trimble were built for ICE fleets. They're adding EV as a feature \u2014 not building EV-native orchestration from the ground up."
    }
  ];

  return createElement("div", { style: S.slide },
    createElement("h2", { style: S.slideTitle }, "The Problem"),
    createElement("p", { style: S.slideSubtitle },
      "The commercial fleet industry is in the middle of the largest technology transition since GPS tracking \u2014 and there's no orchestration layer."
    ),
    createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 36 } },
      painPoints.map(function(p, i) {
        return createElement("div", {
          key: i,
          style: Object.assign({}, S.card, {
            borderTop: "3px solid " + CHART_COLORS[i]
          })
        },
          createElement("div", { style: { fontSize: 28, marginBottom: 12 } }, p.icon),
          createElement("h3", { style: { fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 10 } }, p.title),
          createElement("p", { style: { fontSize: 13, color: COLORS.textMuted, lineHeight: 1.7 } }, p.description)
        );
      })
    ),
    createElement("div", { style: S.chartCard },
      createElement("div", { style: S.chartTitle }, "Fleet Electrification Explosion (2021\u20132030)"),
      createElement("div", { style: S.chartSubtitle }, "EV bus stock, truck sales, autonomous heavy vehicles, managed LCVs (thousands)"),
      createElement(ResponsiveContainer, { width: "100%", height: 320 },
        createElement(AreaChart, { data: fleetSeries, margin: { top: 10, right: 30, left: 10, bottom: 0 } },
          createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1e3a5f", opacity: 0.5 }),
          createElement(XAxis, { dataKey: "year", stroke: COLORS.textDim, fontSize: 11 }),
          createElement(YAxis, { stroke: COLORS.textDim, fontSize: 11, tickFormatter: function(v) { return v + 'K'; } }),
          createElement(Tooltip, { contentStyle: tooltipStyle, formatter: function(v, name) { return [v + 'K', name]; } }),
          createElement(Legend, { wrapperStyle: { fontSize: 11 } }),
          createElement(Area, { type: "monotone", dataKey: "ev_bus_stock_k", stroke: COLORS.primary, fill: COLORS.primary, fillOpacity: 0.2, strokeWidth: 2, name: "EV Bus Stock" }),
          createElement(Area, { type: "monotone", dataKey: "ev_truck_sales_k", stroke: COLORS.secondary, fill: COLORS.secondary, fillOpacity: 0.2, strokeWidth: 2, name: "EV Truck Sales" }),
          createElement(Area, { type: "monotone", dataKey: "ahv_commercial_k", stroke: COLORS.accent, fill: COLORS.accent, fillOpacity: 0.2, strokeWidth: 2, name: "AHV (L4+)" }),
          createElement(Area, { type: "monotone", dataKey: "lcv_managed_stock_k", stroke: COLORS.cyan, fill: COLORS.cyan, fillOpacity: 0.2, strokeWidth: 2, name: "Managed LCVs" })
        )
      )
    )
  );
}

// ============ SLIDE 3: THE SOLUTION ============
function SlideSolution() {
  var capabilities = [
    {
      icon: "\uD83D\uDD0B",
      title: "Smart Charge Orchestration",
      description: "Optimizes when, where, and how much each vehicle charges based on route demand, grid tariffs, and battery health.",
      color: COLORS.primary
    },
    {
      icon: "\uD83D\uDDFA\uFE0F",
      title: "Route & Dispatch Intelligence",
      description: "EV-aware routing that accounts for state-of-charge, charging stops, payload weight, and real-time depot constraints.",
      color: COLORS.secondary
    },
    {
      icon: "\u26A1",
      title: "Grid & Energy Management",
      description: "Demand-response integration, peak shaving, and energy cost optimization across depot infrastructure.",
      color: COLORS.accent
    },
    {
      icon: "\uD83D\uDCCA",
      title: "Unified Fleet Analytics",
      description: "Single pane of glass across mixed EV/ICE/AV fleets. Real-time operational insights replacing 5-8 fragmented tools.",
      color: COLORS.info
    }
  ];

  var productFlow = [
    { label: "Data Ingestion", sub: "Telematics, chargers, grid, weather", icon: "\u2193" },
    { label: "Orchestration Engine", sub: "AI-powered optimization layer", icon: "\u2699\uFE0F" },
    { label: "Operator Interface", sub: "Dashboards, alerts, recommendations", icon: "\u2191" }
  ];

  return createElement("div", { style: S.slide },
    createElement("h2", { style: S.slideTitle }, "The Solution"),
    createElement("p", { style: S.slideSubtitle },
      "Greenbay is a software platform that sits between fleet assets and fleet strategy \u2014 orchestrating charging, routing, and energy across electric and autonomous fleets."
    ),
    // Product architecture flow
    createElement("div", {
      style: {
        display: "flex",
        gap: 0,
        marginBottom: 36,
        alignItems: "stretch"
      }
    },
      productFlow.map(function(step, i) {
        return createElement("div", { key: i, style: { display: "flex", alignItems: "center", flex: 1 } },
          createElement("div", {
            style: {
              flex: 1,
              background: i === 1 ? "rgba(0,212,170,0.08)" : COLORS.card,
              border: i === 1 ? "2px solid " + COLORS.primary : "1px solid " + COLORS.border,
              borderRadius: 14,
              padding: "28px 24px",
              textAlign: "center"
            }
          },
            createElement("div", {
              style: { fontSize: 24, marginBottom: 8 }
            }, step.icon),
            createElement("div", {
              style: {
                fontSize: 15,
                fontWeight: 700,
                color: i === 1 ? COLORS.primary : COLORS.text,
                marginBottom: 6
              }
            }, step.label),
            createElement("div", {
              style: { fontSize: 12, color: COLORS.textMuted }
            }, step.sub)
          ),
          i < productFlow.length - 1 ? createElement("div", {
            style: {
              padding: "0 12px",
              fontSize: 20,
              color: COLORS.primary
            }
          }, "\u2192") : null
        );
      })
    ),
    // Product UI + Capability cards side by side
    createElement("div", {
      style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, alignItems: "start" }
    },
      // Left: Product UI screenshot
      createElement("div", {
        style: {
          background: COLORS.card,
          borderRadius: 16,
          border: "1px solid " + COLORS.border,
          padding: 16,
          position: "relative",
          overflow: "hidden"
        }
      },
        createElement("div", {
          style: {
            fontSize: 11,
            fontWeight: 600,
            color: COLORS.primary,
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            marginBottom: 10
          }
        }, "Product Interface"),
        createElement("img", {
          src: "assets/product-ui.png",
          alt: "Greenbay Platform UI",
          style: {
            width: "100%",
            borderRadius: 10,
            border: "1px solid " + COLORS.border
          }
        })
      ),
      // Right: Capability cards in 2x2 grid
      createElement("div", {
        style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }
      },
        capabilities.map(function(c, i) {
          return createElement("div", {
            key: i,
            style: {
              background: COLORS.card,
              borderRadius: 14,
              border: "1px solid " + COLORS.border,
              padding: "20px 16px",
              borderTop: "3px solid " + c.color
            }
          },
            createElement("div", { style: { fontSize: 24, marginBottom: 8 } }, c.icon),
            createElement("div", {
              style: { fontSize: 13, fontWeight: 700, color: c.color, marginBottom: 6 }
            }, c.title),
            createElement("div", {
              style: { fontSize: 11, color: COLORS.textMuted, lineHeight: 1.6 }
            }, c.description)
          );
        })
      )
    )
  );
}

// ============ SLIDE 4: WHY NOW ============
function SlideWhyNow() {
  var spas = gartner.spas || [];
  var ahvData = gartner.ahv_fleet_baseline || [];

  // Build SPA chart data
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

  var tailwinds = [
    { icon: "\uD83C\uDDEA\uD83C\uDDFA", title: "EU Clean Vehicle Directive", description: "Mandates zero-emission procurement for public fleets. Forced adoption timeline.", color: COLORS.primary },
    { icon: "\uD83C\uDDFA\uD83C\uDDF8", title: "NA ZEV Mandates", description: "CA + 15 states require zero-emission truck sales by 2035.", color: COLORS.info },
    { icon: "\uD83E\uDD16", title: "Agentic AI Wave", description: "Gartner: 25% of T&L firms will use agentic AI by 2030. Greenbay is the agentic layer.", color: COLORS.accent },
    { icon: "\uD83D\uDE9B", title: "AV Fleet Explosion", description: "475K L4+ vehicles by 2030 need the same depot orchestration infrastructure.", color: COLORS.purple }
  ];

  return createElement("div", { style: S.slide },
    createElement("h2", { style: S.slideTitle }, "Why Now"),
    createElement("p", { style: S.slideSubtitle },
      "Regulatory mandates, technology inflections, and Gartner-validated adoption curves create a narrow window for a platform player to own the orchestration layer."
    ),
    // Tailwind cards
    createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 } },
      tailwinds.map(function(t, i) {
        return createElement("div", {
          key: i,
          style: Object.assign({}, S.card, { padding: 20, borderTop: "3px solid " + t.color })
        },
          createElement("div", { style: { fontSize: 24, marginBottom: 8 } }, t.icon),
          createElement("div", { style: { fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 6 } }, t.title),
          createElement("div", { style: { fontSize: 11, color: COLORS.textMuted, lineHeight: 1.6 } }, t.description)
        );
      })
    ),
    // Charts side by side
    createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 } },
      // Gartner SPAs
      createElement("div", { style: S.chartCard },
        createElement("div", { style: S.chartTitle }, "Gartner Strategic Planning Assumptions"),
        createElement("div", { style: S.chartSubtitle }, "Adoption curves \u2014 Predicts 2026: Transportation"),
        createElement(ResponsiveContainer, { width: "100%", height: 260 },
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
      // AHV Fleet Projection
      createElement("div", { style: S.chartCard },
        createElement("div", { style: S.chartTitle }, "Autonomous Fleet Projection (2024\u20132035)"),
        createElement("div", { style: S.chartSubtitle }, "L4+ commercially deployed vehicles (thousands) by region"),
        createElement(ResponsiveContainer, { width: "100%", height: 260 },
          createElement(AreaChart, { data: ahvData, margin: { top: 10, right: 30, left: 10, bottom: 0 } },
            createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1e3a5f", opacity: 0.5 }),
            createElement(XAxis, { dataKey: "year", stroke: COLORS.textDim, fontSize: 11 }),
            createElement(YAxis, { stroke: COLORS.textDim, fontSize: 11, tickFormatter: function(v) { return v + 'K'; } }),
            createElement(Tooltip, { contentStyle: tooltipStyle, formatter: function(v) { return [v + 'K']; } }),
            createElement(Legend, { wrapperStyle: { fontSize: 10 } }),
            createElement(Area, { type: "monotone", dataKey: "na_eu_k", stackId: "1", stroke: COLORS.primary, fill: COLORS.primary, fillOpacity: 0.3, name: "NA + EU" }),
            createElement(Area, { type: "monotone", dataKey: "apac_k", stackId: "1", stroke: COLORS.accent, fill: COLORS.accent, fillOpacity: 0.3, name: "APAC" }),
            createElement(Area, { type: "monotone", dataKey: "china_k", stackId: "1", stroke: COLORS.danger, fill: COLORS.danger, fillOpacity: 0.3, name: "China" })
          )
        )
      )
    )
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

  return createElement("div", { style: S.slide },
    createElement("h2", { style: S.slideTitle }, "Market Opportunity"),
    createElement("p", { style: S.slideSubtitle },
      "Bottom-up TAM built on segment-level vehicle counts \u00D7 ARPU. Validated against IEA fleet data and ACEA registrations."
    ),
    // Hero metrics
    createElement("div", { style: { display: "flex", gap: 24, marginBottom: 36 } },
      createElement("div", { style: Object.assign({}, S.heroMetric, { borderTop: "4px solid " + COLORS.primary }) },
        createElement("div", { style: S.heroLabel }, "Total Addressable Market 2030"),
        createElement("div", { style: Object.assign({}, S.heroValue, { color: COLORS.primary }) }, fmtM(bottomUp.tam_2030_usd_m)),
        createElement("div", { style: S.heroSub }, "6 fleet segments, global scope")
      ),
      createElement("div", { style: { display: "flex", alignItems: "center", color: COLORS.textDim, fontSize: 24 } }, "\u2192"),
      createElement("div", { style: Object.assign({}, S.heroMetric, { borderTop: "4px solid " + COLORS.secondary }) },
        createElement("div", { style: S.heroLabel }, "Serviceable Addressable Market"),
        createElement("div", { style: Object.assign({}, S.heroValue, { color: COLORS.secondary }) }, fmtM(bottomUp.sam_2030_usd_m)),
        createElement("div", { style: S.heroSub }, "83% of TAM \u2014 EU + NA primary")
      ),
      createElement("div", { style: { display: "flex", alignItems: "center", color: COLORS.textDim, fontSize: 24 } }, "\u2192"),
      createElement("div", { style: Object.assign({}, S.heroMetric, { borderTop: "4px solid " + COLORS.accent }) },
        createElement("div", { style: S.heroLabel }, "Serviceable Obtainable Market"),
        createElement("div", { style: Object.assign({}, S.heroValue, { color: COLORS.accent }) }, fmtM(bottomUp.som_base_2030_usd_m)),
        createElement("div", { style: S.heroSub }, "5% SAM penetration (Samsara precedent)")
      )
    ),
    // Charts side by side
    createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 } },
      // TAM Segments
      createElement("div", { style: S.chartCard },
        createElement("div", { style: S.chartTitle }, "TAM by Segment \u2014 Ex-China vs China ($M)"),
        createElement("div", { style: S.chartSubtitle }, "Vehicles \u00D7 ARPU across 6 fleet segments"),
        createElement(ResponsiveContainer, { width: "100%", height: 280 },
          createElement(BarChart, {
            data: segmentData,
            layout: "vertical",
            margin: { top: 10, right: 20, left: 100, bottom: 0 }
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
      ),
      // Regional SAM
      createElement("div", { style: S.chartCard },
        createElement("div", { style: S.chartTitle }, "SAM by Region \u2014 $4.6B Total"),
        createElement("div", { style: S.chartSubtitle }, "EU + NA primary | APAC emerging | China 30% accessible"),
        createElement(ResponsiveContainer, { width: "100%", height: 280 },
          createElement(PieChart, null,
            createElement(Pie, {
              data: samRegions,
              dataKey: "sam_usd_m",
              nameKey: "region",
              cx: "50%",
              cy: "50%",
              outerRadius: 100,
              innerRadius: 45,
              paddingAngle: 2,
              label: function(entry) { return entry.region + ' $' + entry.sam_usd_m + 'M'; },
              labelLine: true
            },
              samRegions.map(function(r, i) {
                return createElement(Cell, { key: i, fill: CHART_COLORS[i % CHART_COLORS.length] });
              })
            ),
            createElement(Tooltip, { contentStyle: tooltipStyle, formatter: function(v) { return ['$' + v + 'M']; } })
          )
        )
      )
    )
  );
}

// ============ SLIDE 6: WHY GREENBAY WINS ============
function SlideCompetitive() {
  var techLayers = comp.tech_stack_layers || [];
  var competitors = (comp.competitors || []).filter(function(c) { return c.revenue_usd_m; });
  competitors.sort(function(a, b) { return b.revenue_usd_m - a.revenue_usd_m; });
  var gbPos = comp.greenbay_positioning || {};
  var advantages = gbPos.competitive_advantages || {};

  return createElement("div", { style: S.slide },
    createElement("h2", { style: S.slideTitle }, "Why Greenbay Wins"),
    createElement("p", { style: S.slideSubtitle },
      "Greenbay owns Layer 2 \u2014 the only orchestration layer in a 4-layer stack. Competitors are point-solutions or legacy platforms."
    ),
    createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 32 } },
      // Left: Tech stack layers
      createElement("div", null,
        createElement("div", { style: { fontSize: 14, fontWeight: 600, color: COLORS.text, marginBottom: 16 } }, "Fleet Technology Stack"),
        techLayers.map(function(layer, i) {
          var isGB = layer.is_greenbay_layer;
          return createElement("div", {
            key: i,
            style: {
              display: "flex",
              alignItems: "center",
              padding: "16px 20px",
              marginBottom: 8,
              borderRadius: 12,
              background: isGB ? "rgba(0,212,170,0.08)" : COLORS.card,
              border: isGB ? "2px solid " + COLORS.primary : "1px solid " + COLORS.border,
              transition: "all 0.2s"
            }
          },
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
                flexShrink: 0
              }
            }, "L" + layer.layer),
            createElement("div", { style: { flex: 1 } },
              createElement("div", {
                style: {
                  fontWeight: isGB ? 700 : 500,
                  fontSize: 14,
                  color: isGB ? COLORS.primary : COLORS.text,
                  marginBottom: 2
                }
              }, layer.name + (isGB ? " \u2190 GREENBAY" : "")),
              createElement("div", {
                style: { fontSize: 11, color: COLORS.textDim }
              }, layer.examples.join(", "))
            )
          );
        }),
        // Differentiator callouts
        createElement("div", { style: { display: "flex", gap: 12, marginTop: 20 } },
          [
            { label: "EV-Native", desc: advantages.vs_samsara },
            { label: "Hardware-Agnostic", desc: advantages.vs_einride },
            { label: "Full Orchestration", desc: advantages.vs_driivz }
          ].map(function(d, i) {
            return createElement("div", {
              key: i,
              style: {
                flex: 1,
                padding: "12px 14px",
                borderRadius: 10,
                background: "rgba(0,212,170,0.06)",
                border: "1px solid rgba(0,212,170,0.2)"
              }
            },
              createElement("div", { style: { fontSize: 12, fontWeight: 700, color: COLORS.primary, marginBottom: 4 } }, d.label),
              createElement("div", { style: { fontSize: 10, color: COLORS.textMuted, lineHeight: 1.5 } }, d.desc || '')
            );
          })
        )
      ),
      // Right: Competitive revenue chart
      createElement("div", { style: S.chartCard },
        createElement("div", { style: S.chartTitle }, "Competitor Revenue ($M)"),
        createElement("div", { style: S.chartSubtitle }, "Annual revenue \u2014 latest reported | All execution-layer players"),
        createElement(ResponsiveContainer, { width: "100%", height: 320 },
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
      )
    )
  );
}

// ============ SLIDE 7: TRACTION ============
function SlideTraction() {
  var tractionMetrics = [
    { label: "Revenue Impact", value: "+13%", desc: "Revenue increase for pilot operators", color: COLORS.primary, icon: "\u2197" },
    { label: "On-Time Performance", value: "+21%", desc: "Improvement in schedule adherence", color: COLORS.success, icon: "\u2713" },
    { label: "Issue Awareness", value: "54 min", desc: "Earlier detection of operational issues", color: COLORS.accent, icon: "\u26A1" }
  ];

  var testimonials = [
    { quote: "First time the screen shows something that makes sense", author: "Mark", role: "Depot Engineer" },
    { quote: "After few minutes of use I managed to find issues that I had no chance identifying", author: "Ian", role: "Performance Manager" },
    { quote: "This is what charging companies should give us if they ever listened", author: "Alistair", role: "Bus Operations Owner" }
  ];

  var pipeline = [
    { label: "Paid Pilots Active", value: "2", color: COLORS.primary },
    { label: "POs in Pipeline", value: "7", color: COLORS.success },
    { label: "Stage", value: "Q1 2026", color: COLORS.accent }
  ];

  return createElement("div", { style: S.slide },
    createElement("h2", { style: S.slideTitle }, "Traction"),
    createElement("p", { style: S.slideSubtitle },
      "2 paid pilots agreed. Real operator feedback from depot-level testing. 7 purchase orders in pipeline."
    ),
    // Pipeline badges
    createElement("div", {
      style: { display: "flex", gap: 16, marginBottom: 28 }
    },
      pipeline.map(function(p, i) {
        return createElement("div", {
          key: i,
          style: {
            padding: "12px 24px",
            borderRadius: 12,
            background: p.color + "15",
            border: "1px solid " + p.color + "44",
            display: "flex",
            alignItems: "center",
            gap: 12
          }
        },
          createElement("span", {
            style: { fontSize: 28, fontWeight: 700, color: p.color, fontFamily: "'DM Serif Display', serif" }
          }, p.value),
          createElement("span", {
            style: { fontSize: 13, color: COLORS.textMuted }
          }, p.label)
        );
      })
    ),
    // Traction metrics row
    createElement("div", {
      style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 28 }
    },
      tractionMetrics.map(function(m, i) {
        return createElement("div", {
          key: i,
          style: {
            background: "linear-gradient(135deg, " + COLORS.card + ", " + COLORS.cardHover + ")",
            borderRadius: 16,
            padding: "28px 24px",
            textAlign: "center",
            border: "1px solid " + m.color + "33"
          }
        },
          createElement("div", {
            style: { fontSize: 24, marginBottom: 6 }
          }, m.icon),
          createElement("div", {
            style: {
              fontSize: 40,
              fontWeight: 700,
              fontFamily: "'DM Serif Display', serif",
              color: m.color,
              lineHeight: 1.1,
              marginBottom: 6
            }
          }, m.value),
          createElement("div", {
            style: { fontSize: 14, fontWeight: 600, color: COLORS.text, marginBottom: 4 }
          }, m.label),
          createElement("div", {
            style: { fontSize: 12, color: COLORS.textMuted }
          }, m.desc)
        );
      })
    ),
    // Partner logos section
    createElement("div", {
      style: {
        background: COLORS.card,
        borderRadius: 16,
        border: "1px solid " + COLORS.border,
        padding: "20px 28px",
        marginBottom: 20
      }
    },
      createElement("div", {
        style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, alignItems: "center" }
      },
        // Design Partner
        createElement("div", { style: { textAlign: "center" } },
          createElement("div", {
            style: { fontSize: 10, fontWeight: 600, color: COLORS.primary, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 10 }
          }, "Design Partner"),
          createElement("img", {
            src: "assets/logo-transport-uk.png",
            alt: "Transport UK",
            style: { height: 44, objectFit: "contain" }
          })
        ),
        // LOIs
        createElement("div", { style: { textAlign: "center" } },
          createElement("div", {
            style: { fontSize: 10, fontWeight: 600, color: COLORS.accent, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 10 }
          }, "2 LOIs \u2014 Q1 2026"),
          createElement("img", {
            src: "assets/logo-alvarada.png",
            alt: "Alvarada",
            style: { height: 44, objectFit: "contain" }
          })
        ),
        // Channel Partner
        createElement("div", { style: { textAlign: "center" } },
          createElement("div", {
            style: { fontSize: 10, fontWeight: 600, color: COLORS.info, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 10 }
          }, "Channel Partner"),
          createElement("img", {
            src: "assets/logo-solaredge.png",
            alt: "SolarEdge",
            style: { height: 36, objectFit: "contain" }
          })
        )
      )
    ),
    // Engaged Pipeline logos
    createElement("div", {
      style: {
        background: COLORS.card,
        borderRadius: 16,
        border: "1px solid " + COLORS.border,
        padding: "16px 28px"
      }
    },
      createElement("div", {
        style: { fontSize: 10, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 14, textAlign: "center" }
      }, "Engaged Pipeline \u2014 12 Accounts, 19,000 Buses"),
      createElement("div", {
        style: { display: "flex", justifyContent: "center", alignItems: "center", gap: 36 }
      },
        [
          { src: "assets/logo-stagecoach.png", alt: "Stagecoach", h: 36 },
          { src: "assets/logo-kcata.png", alt: "KC ATA", h: 32 },
          { src: "assets/logo-bvg.png", alt: "BVG", h: 36 },
          { src: "assets/logo-firstbus.png", alt: "First Bus", h: 32 }
        ].map(function(logo, i) {
          return createElement("img", {
            key: i,
            src: logo.src,
            alt: logo.alt,
            style: { height: logo.h, objectFit: "contain" }
          });
        })
      )
    ),
    // Testimonials
    createElement("div", {
      style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 20 }
    },
      testimonials.map(function(t, i) {
        return createElement("div", {
          key: i,
          style: {
            background: COLORS.card,
            borderRadius: 12,
            padding: "20px 18px",
            borderLeft: "3px solid " + COLORS.primary,
            position: "relative"
          }
        },
          createElement("div", {
            style: {
              fontSize: 32,
              color: COLORS.primary,
              opacity: 0.3,
              position: "absolute",
              top: 8,
              left: 14,
              fontFamily: "Georgia, serif",
              lineHeight: 1
            }
          }, "\u201C"),
          createElement("div", {
            style: {
              fontSize: 13,
              fontStyle: "italic",
              color: COLORS.text,
              lineHeight: 1.6,
              marginBottom: 12,
              paddingTop: 6
            }
          }, "\u201C" + t.quote + "\u201D"),
          createElement("div", {
            style: { fontSize: 12, fontWeight: 600, color: COLORS.primary }
          }, t.author),
          createElement("div", {
            style: { fontSize: 11, color: COLORS.textMuted }
          }, t.role)
        );
      })
    )
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
      photo: null,
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
      "Enterprise SaaS with $375K ACV. Land-and-expand model: start with one depot, grow across the fleet. 5.6-month CAC payback."
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
    { period: "Q1 2026", event: "2 paid pilots kickoff", status: "active" },
    { period: "Q2 2026", event: "First US pilot, commercial agreements", status: "upcoming" },
    { period: "Q3\u2013Q4 2026", event: "First recurring revenue, 7 POs secured", status: "upcoming" },
    { period: "2027", event: "$3M ARR milestone, Series A readiness", status: "future" }
  ];

  return createElement("div", { style: S.slide },
    createElement("h2", { style: S.slideTitle }, "The Ask"),
    createElement("p", { style: S.slideSubtitle },
      "Raising $3M seed to convert pipeline into revenue, expand platform capabilities, and reach Series A milestone of $3M ARR by 2027."
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
      }, "Seed Round"),
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
      createElement("span", { style: { fontSize: 14, color: COLORS.textMuted } }, "oren@greenbay.tech"),
      createElement("span", { style: { margin: "0 16px", color: COLORS.border } }, "|"),
      createElement("span", { style: { fontSize: 14, color: COLORS.textMuted } }, "greenbay.tech")
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
    SlideAsk
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
