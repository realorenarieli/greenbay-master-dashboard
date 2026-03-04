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
  "Market Opportunity",
  "Why Greenbay Wins",
  "Traction",
  "Team",
  "Unit Economics",
  "Growth Trajectory",
  "Validation & Tailwinds",
  "Dashboards & Sources"
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
    createElement("div", {
      style: {
        width: 64,
        height: 64,
        borderRadius: 16,
        background: "linear-gradient(135deg, " + COLORS.primary + ", " + COLORS.secondary + ")",
        marginBottom: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 28,
        fontWeight: 700,
        color: COLORS.background
      }
    }, "G"),
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
      }, "Canonical v" + (meta.version || '?')),
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
      icon: "\u{1F50C}",
      title: "Fragmented Tool Chaos",
      description: "Fleet operators juggle 5-8 separate tools for telematics, charging, routing, maintenance, and compliance. Data silos create blind spots and inefficiency."
    },
    {
      icon: "\u{1F6E2}\uFE0F",
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

// ============ SLIDE 3: MARKET OPPORTUNITY ============
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

// ============ SLIDE 4: WHY GREENBAY WINS ============
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

// ============ SLIDE 5: TRACTION ============
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

  var milestones = [
    { period: "Q1 2026", event: "2 paid pilots kickoff", status: "active" },
    { period: "Q2 2026", event: "First US pilot, commercial agreements", status: "upcoming" },
    { period: "Q3\u2013Q4 2026", event: "First recurring revenue, 7 POs secured", status: "upcoming" }
  ];

  return createElement("div", { style: S.slide },
    createElement("h2", { style: S.slideTitle }, "Traction"),
    createElement("p", { style: S.slideSubtitle },
      "2 paid pilots agreed. Real operator feedback from depot-level testing."
    ),
    // Traction metrics row
    createElement("div", {
      style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 36 }
    },
      tractionMetrics.map(function(m, i) {
        return createElement("div", {
          key: i,
          style: {
            background: "linear-gradient(135deg, " + COLORS.card + ", " + COLORS.cardHover + ")",
            borderRadius: 16,
            padding: "36px 28px",
            textAlign: "center",
            border: "1px solid " + m.color + "33"
          }
        },
          createElement("div", {
            style: { fontSize: 28, marginBottom: 8 }
          }, m.icon),
          createElement("div", {
            style: {
              fontSize: 48,
              fontWeight: 700,
              fontFamily: "'DM Serif Display', serif",
              color: m.color,
              lineHeight: 1.1,
              marginBottom: 8
            }
          }, m.value),
          createElement("div", {
            style: { fontSize: 16, fontWeight: 600, color: COLORS.text, marginBottom: 6 }
          }, m.label),
          createElement("div", {
            style: { fontSize: 13, color: COLORS.textMuted }
          }, m.desc)
        );
      })
    ),
    // Testimonials
    createElement("div", {
      style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 36 }
    },
      testimonials.map(function(t, i) {
        return createElement("div", {
          key: i,
          style: {
            background: COLORS.card,
            borderRadius: 12,
            padding: "24px 22px",
            borderLeft: "3px solid " + COLORS.primary,
            position: "relative"
          }
        },
          createElement("div", {
            style: {
              fontSize: 36,
              color: COLORS.primary,
              opacity: 0.3,
              position: "absolute",
              top: 12,
              left: 18,
              fontFamily: "Georgia, serif",
              lineHeight: 1
            }
          }, "\u201C"),
          createElement("div", {
            style: {
              fontSize: 14,
              fontStyle: "italic",
              color: COLORS.text,
              lineHeight: 1.6,
              marginBottom: 14,
              paddingTop: 8
            }
          }, "\u201C" + t.quote + "\u201D"),
          createElement("div", {
            style: { fontSize: 13, fontWeight: 600, color: COLORS.primary }
          }, t.author),
          createElement("div", {
            style: { fontSize: 12, color: COLORS.textMuted }
          }, t.role)
        );
      })
    ),
    // Milestones timeline
    createElement("div", {
      style: {
        background: COLORS.card,
        borderRadius: 12,
        padding: "24px 32px"
      }
    },
      createElement("div", {
        style: { fontSize: 14, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 20 }
      }, "24-Month Milestones"),
      createElement("div", {
        style: { display: "flex", gap: 0, position: "relative" }
      },
        // Connecting line
        createElement("div", {
          style: {
            position: "absolute",
            top: 10,
            left: 10,
            right: 10,
            height: 2,
            background: "linear-gradient(90deg, " + COLORS.primary + ", " + COLORS.secondary + ")",
            zIndex: 0
          }
        }),
        milestones.map(function(m, i) {
          var isActive = m.status === "active";
          return createElement("div", {
            key: i,
            style: {
              flex: 1,
              textAlign: "center",
              position: "relative",
              zIndex: 1
            }
          },
            createElement("div", {
              style: {
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: isActive ? COLORS.primary : COLORS.card,
                border: "2px solid " + (isActive ? COLORS.primary : COLORS.secondary),
                margin: "0 auto 12px",
                boxShadow: isActive ? "0 0 12px " + COLORS.primary + "66" : "none"
              }
            }),
            createElement("div", {
              style: {
                fontSize: 14,
                fontWeight: 700,
                color: isActive ? COLORS.primary : COLORS.text,
                fontFamily: "'DM Mono', monospace",
                marginBottom: 4
              }
            }, m.period),
            createElement("div", {
              style: { fontSize: 13, color: COLORS.textMuted, maxWidth: 200, margin: "0 auto" }
            }, m.event)
          );
        })
      )
    )
  );
}

// ============ SLIDE 6: TEAM ============
function SlideTeam() {
  var team = [
    {
      name: "Oren Arieli",
      role: "CEO",
      initials: "OA",
      color: COLORS.primary,
      background: "10+ years in mobility operations software",
      prev: "Ex-Optibus & Via",
      expertise: "Fleet operations, product strategy, market development"
    },
    {
      name: "Shira Golan",
      role: "Co-CEO",
      initials: "SG",
      color: COLORS.secondary,
      background: "2 successful exits, R&D scaling expert",
      prev: "Fortune 500 partnerships",
      expertise: "Business development, enterprise sales, strategic partnerships"
    },
    {
      name: "Daniel Odesser",
      role: "CTO",
      initials: "DO",
      color: COLORS.accent,
      background: "Second-time founder, high-reliability platforms",
      prev: "Ex-Optibus & Auto Fleet",
      expertise: "Platform architecture, real-time systems, infrastructure"
    }
  ];

  var investmentAlloc = [
    { label: "R&D & Product", pct: 65, color: COLORS.primary },
    { label: "Operations & Overhead", pct: 18, color: COLORS.secondary },
    { label: "Buffer", pct: 9, color: COLORS.textDim },
    { label: "Sales & BD", pct: 8, color: COLORS.accent }
  ];

  return createElement("div", { style: S.slide },
    createElement("h2", { style: S.slideTitle }, "Team"),
    createElement("p", { style: S.slideSubtitle },
      "Deep domain expertise in fleet operations, mobility software, and enterprise scale."
    ),
    // Team cards
    createElement("div", {
      style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28, marginBottom: 40 }
    },
      team.map(function(t, i) {
        return createElement("div", {
          key: i,
          style: {
            background: "linear-gradient(135deg, " + COLORS.card + ", " + COLORS.cardHover + ")",
            borderRadius: 16,
            padding: "36px 28px",
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
          // Avatar circle with initials
          createElement("div", {
            style: {
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: t.color + "22",
              border: "2px solid " + t.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: 24,
              fontWeight: 700,
              fontFamily: "'DM Serif Display', serif",
              color: t.color
            }
          }, t.initials),
          createElement("div", {
            style: { fontSize: 20, fontWeight: 700, color: COLORS.text, marginBottom: 4 }
          }, t.name),
          createElement("div", {
            style: {
              fontSize: 13,
              fontWeight: 600,
              color: t.color,
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              marginBottom: 16
            }
          }, t.role),
          createElement("div", {
            style: {
              fontSize: 14,
              color: COLORS.text,
              marginBottom: 8,
              lineHeight: 1.5
            }
          }, t.background),
          createElement("div", {
            style: {
              fontSize: 13,
              color: COLORS.primary,
              fontWeight: 600,
              marginBottom: 10,
              fontFamily: "'DM Mono', monospace"
            }
          }, t.prev),
          createElement("div", {
            style: {
              fontSize: 12,
              color: COLORS.textMuted,
              lineHeight: 1.5,
              borderTop: "1px solid " + COLORS.border,
              paddingTop: 12,
              marginTop: 4
            }
          }, t.expertise)
        );
      })
    ),
    // Investment allocation
    createElement("div", {
      style: {
        background: COLORS.card,
        borderRadius: 12,
        padding: "28px 32px"
      }
    },
      createElement("div", {
        style: { fontSize: 14, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 20 }
      }, "Use of Funds \u2014 $3M Raise"),
      // Stacked bar
      createElement("div", {
        style: { display: "flex", borderRadius: 8, overflow: "hidden", height: 32, marginBottom: 20 }
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
              fontSize: 11,
              fontWeight: 700,
              color: "#fff",
              transition: "opacity 0.2s"
            },
            title: a.label + ": " + a.pct + "%"
          }, a.pct >= 12 ? a.pct + "%" : "");
        })
      ),
      // Legend
      createElement("div", {
        style: { display: "flex", gap: 28, flexWrap: "wrap" }
      },
        investmentAlloc.map(function(a, i) {
          return createElement("div", {
            key: i,
            style: { display: "flex", alignItems: "center", gap: 8 }
          },
            createElement("div", {
              style: { width: 10, height: 10, borderRadius: 2, background: a.color }
            }),
            createElement("span", {
              style: { fontSize: 13, color: COLORS.text }
            }, a.label),
            createElement("span", {
              style: { fontSize: 13, color: COLORS.textMuted, fontFamily: "'DM Mono', monospace" }
            }, a.pct + "%")
          );
        })
      )
    )
  );
}

// ============ SLIDE 7: UNIT ECONOMICS ============
function SlideUnitEcon() {
  var cm = ue.core_metrics || {};
  var benchmarks = ue.benchmarks || {};

  var metrics = [
    { label: "ACV", value: "$" + (cm.acv_usd || 0).toLocaleString(), color: COLORS.primary, benchmark: null, benchLabel: "Annual contract value", gbVal: null, medVal: null },
    { label: "Gross Margin", value: (cm.gross_margin_pct || 0) + "%", color: COLORS.success, benchmark: benchmarks.saas_median_gross_margin_pct, benchLabel: "SaaS median: " + (benchmarks.saas_median_gross_margin_pct || 75) + "%", gbVal: cm.gross_margin_pct, medVal: benchmarks.saas_median_gross_margin_pct },
    { label: "LTV:CAC", value: (cm.ltv_cac_ratio || 0) + "x", color: COLORS.accent, benchmark: benchmarks.saas_median_ltv_cac, benchLabel: "SaaS median: " + (benchmarks.saas_median_ltv_cac || 3) + "x", gbVal: cm.ltv_cac_ratio, medVal: benchmarks.saas_median_ltv_cac },
    { label: "CAC Payback", value: (cm.cac_payback_months || 0) + " mo", color: COLORS.info, benchmark: benchmarks.saas_median_cac_payback_months, benchLabel: "SaaS median: " + (benchmarks.saas_median_cac_payback_months || 18) + "mo", gbVal: null, medVal: null, inverted: true },
    { label: "NRR", value: (cm.nrr_pct || 0) + "%", color: COLORS.purple, benchmark: benchmarks.saas_median_nrr_pct, benchLabel: "SaaS median: " + (benchmarks.saas_median_nrr_pct || 110) + "%", gbVal: cm.nrr_pct, medVal: benchmarks.saas_median_nrr_pct }
  ];

  return createElement("div", { style: S.slide },
    createElement("h2", { style: S.slideTitle }, "Unit Economics"),
    createElement("p", { style: S.slideSubtitle },
      "Enterprise SaaS economics with $375K ACV. 5.6-month CAC payback recycles sales spend into product investment immediately."
    ),
    createElement("div", { style: S.grid5 },
      metrics.map(function(m, i) {
        return createElement("div", {
          key: i,
          style: Object.assign({}, S.metricCard, { borderTop: "4px solid " + m.color })
        },
          createElement("div", { style: S.metricLabel }, m.label),
          createElement("div", { style: Object.assign({}, S.metricValue, { color: m.color }) }, m.value),
          createElement("div", { style: S.metricSub }, m.benchLabel)
        );
      })
    ),
    // Benchmark comparison bars
    createElement("div", { style: S.chartCard },
      createElement("div", { style: S.chartTitle }, "Greenbay vs SaaS Benchmarks"),
      createElement("div", { style: S.chartSubtitle }, "Source: OpenView SaaS Benchmarks 2024, Bessemer Cloud Index"),
      createElement("div", { style: { display: "flex", flexDirection: "column", gap: 20, padding: "8px 0" } },
        [
          { label: "LTV:CAC Ratio", gb: cm.ltv_cac_ratio || 0, med: benchmarks.saas_median_ltv_cac || 3, top: benchmarks.saas_top_quartile_ltv_cac || 5, unit: "x", max: 25 },
          { label: "CAC Payback (months)", gb: cm.cac_payback_months || 0, med: benchmarks.saas_median_cac_payback_months || 18, top: null, unit: "mo", max: 20, inverted: true },
          { label: "Gross Margin", gb: cm.gross_margin_pct || 0, med: benchmarks.saas_median_gross_margin_pct || 75, top: null, unit: "%", max: 100 },
          { label: "Net Revenue Retention", gb: cm.nrr_pct || 0, med: benchmarks.saas_median_nrr_pct || 110, top: null, unit: "%", max: 130 }
        ].map(function(b, i) {
          var gbPct = (b.gb / b.max) * 100;
          var medPct = (b.med / b.max) * 100;
          return createElement("div", { key: i },
            createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 6 } },
              createElement("span", { style: { fontSize: 12, color: COLORS.text, fontWeight: 500 } }, b.label),
              createElement("span", { style: { fontSize: 12, color: COLORS.primary, fontWeight: 700 } }, b.gb + b.unit)
            ),
            createElement("div", { style: { position: "relative", height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 4 } },
              // SaaS median marker
              createElement("div", {
                style: {
                  position: "absolute",
                  left: medPct + "%",
                  top: -2,
                  width: 2,
                  height: 12,
                  background: COLORS.textDim,
                  borderRadius: 1
                }
              }),
              // Greenbay bar
              createElement("div", {
                style: {
                  width: Math.min(gbPct, 100) + "%",
                  height: "100%",
                  borderRadius: 4,
                  background: b.inverted
                    ? "linear-gradient(90deg, " + COLORS.primary + ", " + COLORS.success + ")"
                    : "linear-gradient(90deg, " + COLORS.primary + ", " + COLORS.secondary + ")"
                }
              })
            ),
            createElement("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 4 } },
              createElement("span", { style: { fontSize: 10, color: COLORS.textDim } }, ""),
              createElement("span", { style: { fontSize: 10, color: COLORS.textDim } }, "SaaS median: " + b.med + b.unit)
            )
          );
        })
      )
    )
  );
}

// ============ SLIDE 6: GROWTH TRAJECTORY ============
function SlideGrowth() {
  var arrSeries = (arr.tam_based_scenarios || {}).series || [];
  var custScenarios = (arr.customer_based_scenarios || {}).scenarios || {};
  var baseCustomers = custScenarios.base || [];

  return createElement("div", { style: S.slide },
    createElement("h2", { style: S.slideTitle }, "Growth Trajectory"),
    createElement("p", { style: S.slideSubtitle },
      "All scenarios anchored at 2026=$0.8M and 2027=$3.0M. Divergence from 2028 based on SAM penetration and sales velocity."
    ),
    // ARR Chart
    createElement("div", { style: Object.assign({}, S.chartCard, { marginBottom: 28 }) },
      createElement("div", { style: S.chartTitle }, "ARR Trajectory \u2014 5 Scenarios (2025\u20132030)"),
      createElement("div", { style: S.chartSubtitle }, "Anchored: 2026=$0.8M, 2027=$3.0M | TAM-based penetration models"),
      createElement(ResponsiveContainer, { width: "100%", height: 340 },
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
    ),
    // Customer model table
    createElement("div", { style: S.chartCard },
      createElement("div", { style: S.chartTitle }, "Customer-Based Model (Base Case)"),
      createElement("div", { style: S.chartSubtitle }, "Avg ACV: $375K | 5-10% annual churn | 6-12mo enterprise sales cycle"),
      createElement("div", { style: { overflowX: "auto" } },
        createElement("table", {
          style: {
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 13,
            fontFamily: "'DM Mono', monospace"
          }
        },
          createElement("thead", null,
            createElement("tr", null,
              ["Year", "New Customers", "Churn", "Total Customers", "ARR ($M)", "Growth"].map(function(h, i) {
                return createElement("th", {
                  key: i,
                  style: {
                    textAlign: i === 0 ? "left" : "right",
                    padding: "10px 16px",
                    borderBottom: "1px solid " + COLORS.border,
                    color: COLORS.textMuted,
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }
                }, h);
              })
            )
          ),
          createElement("tbody", null,
            baseCustomers.map(function(row, i) {
              var isHighlight = row.year === 2030;
              return createElement("tr", {
                key: i,
                style: {
                  background: isHighlight ? "rgba(0,212,170,0.06)" : "transparent"
                }
              },
                createElement("td", { style: { padding: "10px 16px", fontWeight: 600, color: COLORS.text } }, row.year),
                createElement("td", { style: { padding: "10px 16px", textAlign: "right", color: COLORS.success } }, "+" + row.new_customers),
                createElement("td", { style: { padding: "10px 16px", textAlign: "right", color: row.churn > 0 ? COLORS.danger : COLORS.textDim } }, "-" + row.churn),
                createElement("td", { style: { padding: "10px 16px", textAlign: "right", color: COLORS.text, fontWeight: 600 } }, row.customers),
                createElement("td", { style: { padding: "10px 16px", textAlign: "right", color: COLORS.primary, fontWeight: 700 } }, "$" + row.arr + "M"),
                createElement("td", { style: { padding: "10px 16px", textAlign: "right", color: row.growth_pct ? COLORS.accent : COLORS.textDim } },
                  row.growth_pct ? row.growth_pct + "%" : "\u2014"
                )
              );
            })
          )
        )
      )
    )
  );
}

// ============ SLIDE 7: VALIDATION & TAILWINDS ============
function SlideValidation() {
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
    { icon: "\u{1F1EA}\u{1F1FA}", title: "EU Clean Vehicle Directive", description: "Mandates zero-emission vehicle procurement for public fleets. Creates forced adoption timeline." },
    { icon: "\u{1F1FA}\u{1F1F8}", title: "NA ZEV Mandates", description: "California, New York, and 15+ states require zero-emission truck sales targets by 2035." },
    { icon: "\u{1F916}", title: "Agentic AI (25% by 2030)", description: "Gartner: 25% of T&L firms will use agentic AI for operations. Greenbay is the agentic layer for EV depots." },
    { icon: "\u{1F69B}", title: "AV Fleet Scale (475K by 2030)", description: "Autonomous vehicle fleets require the same depot orchestration infrastructure. 475K L4+ vehicles by 2030." }
  ];

  return createElement("div", { style: S.slide },
    createElement("h2", { style: S.slideTitle }, "Validation & Tailwinds"),
    createElement("p", { style: S.slideSubtitle },
      "Gartner validates that Greenbay\u2019s product categories are not speculative \u2014 they\u2019re official analyst predictions with quantified adoption curves."
    ),
    // Tailwind cards
    createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 } },
      tailwinds.map(function(t, i) {
        return createElement("div", {
          key: i,
          style: Object.assign({}, S.card, { padding: 20, borderTop: "3px solid " + CHART_COLORS[i] })
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
        createElement(ResponsiveContainer, { width: "100%", height: 280 },
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
        createElement(ResponsiveContainer, { width: "100%", height: 280 },
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

// ============ SLIDE 8: DASHBOARDS & SOURCES ============
function SlideSources() {
  var categories = sources.categories || [];
  var expandedState = useState({});
  var expanded = expandedState[0];
  var setExpanded = expandedState[1];

  var statusColors = {
    "200": { bg: "rgba(34,197,94,0.15)", color: COLORS.success, label: "Verified" },
    "202": { bg: "rgba(34,197,94,0.15)", color: COLORS.success, label: "Verified" },
    "503_bot_protected": { bg: "rgba(245,158,11,0.15)", color: COLORS.accent, label: "Bot-Protected" }
  };

  var dashboards = [
    {
      name: "Market Intelligence",
      path: "../greenbay-market-dashboard/",
      description: "TAM/SAM/SOM, segment sizing, ARR scenarios, fleet time series",
      color: COLORS.primary,
      metrics: [
        { label: "TAM", value: fmtM(bottomUp.tam_2030_usd_m) },
        { label: "SAM", value: fmtM(bottomUp.sam_2030_usd_m) },
        { label: "SOM", value: fmtM(bottomUp.som_base_2030_usd_m) }
      ]
    },
    {
      name: "Fleet Orchestration",
      path: "../greenbay-fleet-orchestration/",
      description: "Competitive landscape, unit economics, customer-based ARR model",
      color: COLORS.secondary,
      metrics: [
        { label: "Fleet TAM", value: fmtB(topDown.tam_2030_usd_b) },
        { label: "ACV", value: "$" + ((ue.core_metrics || {}).acv_usd || 0).toLocaleString() },
        { label: "LTV:CAC", value: ((ue.core_metrics || {}).ltv_cac_ratio || 0) + "x" }
      ]
    },
    {
      name: "Electrification Intel",
      path: "../fleet-electrification-intel/",
      description: "EV trajectories, regional breakdowns, regulatory drivers, AV projections",
      color: COLORS.accent,
      metrics: [
        { label: "EV Buses", value: fmt((fleet.global_series || [])[3] ? fleet.global_series[3].ev_bus_stock_k : null) + "K" },
        { label: "Trucks 2030", value: fmt((fleet.global_series || [])[9] ? fleet.global_series[9].ev_truck_sales_k : null) + "K" },
        { label: "AHV 2030", value: fmt((fleet.global_series || [])[9] ? fleet.global_series[9].ahv_commercial_k : null) + "K" }
      ]
    }
  ];

  var methodologies = [
    { title: "Bottom-Up TAM ($5.6B)", description: "6 segments \u00D7 ARPU, validated vs IEA/ACEA", tag: "Canonical", tagStyle: S.tagGreen },
    { title: "Top-Down Fleet Mgmt ($70B)", description: "MarketsandMarkets total market, HD trucking SAM = $32B", tag: "Reference", tagStyle: S.tagBlue },
    { title: "ARR Anchoring", description: "2026=$0.8M, 2027=$3.0M, diverges per scenario from 2028", tag: "Assumption", tagStyle: S.tagYellow }
  ];

  function toggleCategory(ci) {
    setExpanded(function(prev) {
      var next = Object.assign({}, prev);
      next[ci] = !next[ci];
      return next;
    });
  }

  return createElement("div", { style: Object.assign({}, S.slide, { justifyContent: "flex-start", paddingTop: 48 }) },
    createElement("h2", { style: S.slideTitle }, "Dashboards & Sources"),

    // Dashboard cards
    createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 32 } },
      dashboards.map(function(d, i) {
        return createElement("div", {
          key: i,
          style: Object.assign({}, S.card, {
            borderTop: "3px solid " + d.color,
            padding: 20
          })
        },
          createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 } },
            createElement("h3", { style: { fontSize: 14, fontWeight: 700, color: d.color, margin: 0 } }, d.name),
            createElement("a", {
              href: d.path,
              target: "_blank",
              rel: "noopener noreferrer",
              style: {
                fontSize: 11,
                color: d.color,
                textDecoration: "none",
                padding: "4px 10px",
                borderRadius: 6,
                border: "1px solid " + d.color + "44",
                fontWeight: 600
              }
            }, "Open \u2192")
          ),
          createElement("p", { style: { fontSize: 11, color: COLORS.textMuted, lineHeight: 1.5, marginBottom: 12 } }, d.description),
          createElement("div", { style: { display: "flex", gap: 8 } },
            d.metrics.map(function(m, j) {
              return createElement("div", { key: j, style: { flex: 1, textAlign: "center", padding: "6px 4px", background: "rgba(255,255,255,0.03)", borderRadius: 6 } },
                createElement("div", { style: { fontSize: 13, fontWeight: 700, color: COLORS.text } }, m.value),
                createElement("div", { style: { fontSize: 8, color: COLORS.textDim, textTransform: "uppercase", marginTop: 2 } }, m.label)
              );
            })
          )
        );
      })
    ),

    // Methodology cards
    createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 } },
      methodologies.map(function(m, i) {
        return createElement("div", { key: i, style: Object.assign({}, S.card, { padding: 16 }) },
          createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 } },
            createElement("span", { style: { fontSize: 12, fontWeight: 700, color: COLORS.text } }, m.title),
            createElement("span", { style: Object.assign({}, S.tag, m.tagStyle) }, m.tag)
          ),
          createElement("p", { style: { fontSize: 11, color: COLORS.textMuted, lineHeight: 1.5, margin: 0 } }, m.description)
        );
      })
    ),

    // Source registry (collapsible)
    createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: COLORS.text,
        marginBottom: 12,
        display: "flex",
        alignItems: "center",
        gap: 10
      }
    },
      createElement("span", { style: Object.assign({}, S.sectionDot, { background: COLORS.primary }) }),
      "Source Registry \u2014 " + (sources.total_sources || 0) + " Sources",
      createElement("span", { style: { fontSize: 11, color: COLORS.textDim, fontFamily: "'DM Mono', monospace", marginLeft: 8 } },
        "Last verified: " + (sources.last_verified || 'unknown')
      )
    ),
    createElement("div", { style: { maxHeight: 280, overflowY: "auto", paddingRight: 8 } },
      categories.map(function(cat, ci) {
        var isExpanded = expanded[ci];
        return createElement("div", { key: ci, style: { marginBottom: 8 } },
          createElement("button", {
            onClick: function() { toggleCategory(ci); },
            style: {
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 14px",
              background: COLORS.card,
              border: "1px solid " + COLORS.border,
              borderRadius: isExpanded ? "10px 10px 0 0" : 10,
              cursor: "pointer",
              color: CHART_COLORS[ci % CHART_COLORS.length],
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }
          },
            createElement("span", null, cat.category + " (" + cat.items.length + ")"),
            createElement("span", { style: { color: COLORS.textDim, fontSize: 10 } }, isExpanded ? "\u25B2" : "\u25BC")
          ),
          isExpanded ? createElement("div", {
            style: {
              background: COLORS.card,
              border: "1px solid " + COLORS.border,
              borderTop: "none",
              borderRadius: "0 0 10px 10px",
              padding: "8px 14px 14px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
              gap: 8
            }
          },
            cat.items.map(function(item, ii) {
              var statusInfo = statusColors[item.status] || { bg: "rgba(107,114,128,0.15)", color: COLORS.textDim, label: item.status || "No URL" };
              return createElement("div", {
                key: ii,
                style: {
                  padding: "8px 12px",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  gap: 10
                }
              },
                createElement("div", { style: { flex: 1, minWidth: 0 } },
                  item.url
                    ? createElement("a", {
                        href: item.url,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        style: { color: COLORS.text, fontSize: 11, fontWeight: 600, textDecoration: "none" }
                      }, item.name)
                    : createElement("span", { style: { color: COLORS.text, fontSize: 11, fontWeight: 600 } }, item.name),
                  createElement("span", { style: { color: COLORS.textDim, fontSize: 10, marginLeft: 6 } }, item.org || '')
                ),
                createElement("span", { style: Object.assign({}, S.tag, { background: statusInfo.bg, color: statusInfo.color, whiteSpace: "nowrap", fontSize: 9 }) }, statusInfo.label)
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
    SlideMarket,
    SlideCompetitive,
    SlideTraction,
    SlideTeam,
    SlideUnitEcon,
    SlideGrowth,
    SlideValidation,
    SlideSources
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
