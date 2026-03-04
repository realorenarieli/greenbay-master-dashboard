// Greenbay Master Intelligence Dashboard
// Entry point: dashboard directory, executive summary, market deep dive, sources

(function() {
"use strict";

try {

var React = window.React;
var ReactDOM = window.ReactDOM;
var Recharts = window.Recharts;

var useState = React.useState;
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

// Helper to find methodology
function findMethodology(id) {
  if (!ms.methodologies) return {};
  return ms.methodologies.find(function(m) { return m.id === id; }) || {};
}

var bottomUp = findMethodology('bottom_up_orchestration');

// ============ STYLES ============
var styles = {
  app: {
    fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
    background: COLORS.background,
    color: COLORS.text,
    minHeight: "100vh"
  },
  header: {
    padding: "32px 48px 0",
    borderBottom: "1px solid " + COLORS.border,
    paddingBottom: 24
  },
  headerTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16
  },
  title: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: 32,
    color: COLORS.primary,
    margin: 0,
    letterSpacing: "-0.5px"
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontFamily: "'DM Mono', monospace"
  },
  versionBadge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: 12,
    background: "rgba(0,212,170,0.1)",
    border: "1px solid rgba(0,212,170,0.3)",
    color: COLORS.primary,
    fontSize: 11,
    fontFamily: "'DM Mono', monospace"
  },
  tabBar: {
    display: "flex",
    gap: 0,
    padding: "0 48px"
  },
  tab: {
    padding: "12px 24px",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    color: COLORS.textMuted,
    borderBottom: "2px solid transparent",
    transition: "all 0.2s",
    background: "none",
    border: "none",
    fontFamily: "'Plus Jakarta Sans', sans-serif"
  },
  tabActive: {
    color: COLORS.primary,
    borderBottom: "2px solid " + COLORS.primary
  },
  content: {
    padding: "32px 48px 48px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: 24,
    marginBottom: 32
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
    gap: 16,
    marginBottom: 32
  },
  card: {
    background: COLORS.card,
    borderRadius: 12,
    border: "1px solid " + COLORS.border,
    padding: 24,
    transition: "border-color 0.2s"
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: COLORS.text,
    margin: 0
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: COLORS.text,
    marginBottom: 20,
    display: "flex",
    alignItems: "center",
    gap: 10
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    display: "inline-block"
  },
  metricCard: {
    background: COLORS.card,
    borderRadius: 12,
    border: "1px solid " + COLORS.border,
    padding: "20px 24px",
    textAlign: "center"
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 700,
    margin: "8px 0 4px",
    letterSpacing: "-1px"
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
    marginTop: 4
  },
  chartCard: {
    background: COLORS.card,
    borderRadius: 12,
    border: "1px solid " + COLORS.border,
    padding: 24,
    marginBottom: 24
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: COLORS.text,
    marginBottom: 4
  },
  chartSubtitle: {
    fontSize: 11,
    color: COLORS.textDim,
    marginBottom: 16,
    fontFamily: "'DM Mono', monospace"
  },
  tag: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 6,
    fontSize: 10,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  tagGreen: {
    background: "rgba(34,197,94,0.15)",
    color: COLORS.success
  },
  tagBlue: {
    background: "rgba(59,130,246,0.15)",
    color: COLORS.info
  },
  tagYellow: {
    background: "rgba(245,158,11,0.15)",
    color: COLORS.accent
  },
  tagRed: {
    background: "rgba(239,68,68,0.15)",
    color: COLORS.danger
  }
};

// ============ TOOLTIP STYLES ============
var tooltipStyle = {
  backgroundColor: '#0d1525',
  border: '1px solid #1e3a5f',
  borderRadius: 8,
  fontSize: 12,
  fontFamily: "'DM Mono', monospace"
};

// ============ FORMAT HELPERS ============
function fmt(n, prefix, suffix) {
  if (n == null) return '—';
  prefix = prefix || '';
  suffix = suffix || '';
  if (n >= 1000) return prefix + (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K' + suffix;
  if (n >= 1 && n < 1000) return prefix + n.toLocaleString() + suffix;
  return prefix + n + suffix;
}

function fmtM(n) {
  if (n == null) return '—';
  if (n >= 1000) return '$' + (n / 1000).toFixed(1).replace(/\.0$/, '') + 'B';
  return '$' + n + 'M';
}

function fmtB(n) {
  if (n == null) return '—';
  return '$' + n + 'B';
}

// ============ TAB 1: DASHBOARD DIRECTORY ============
function DashboardDirectory() {
  var dashboards = [
    {
      name: "Market Intelligence Dashboard",
      path: "../greenbay-market-dashboard/",
      description: "Bottom-up TAM/SAM/SOM analysis, segment sizing, ARR trajectory scenarios, fleet transition time series, and Gartner SPA adoption curves.",
      color: COLORS.primary,
      metrics: [
        { label: "TAM 2030", value: fmtM(bottomUp.tam_2030_usd_m) },
        { label: "SAM", value: fmtM(bottomUp.sam_2030_usd_m) },
        { label: "SOM Base", value: fmtM(bottomUp.som_base_2030_usd_m) }
      ]
    },
    {
      name: "Fleet Orchestration Intelligence",
      path: "../greenbay-fleet-orchestration/",
      description: "Top-down fleet management market, competitive landscape, unit economics, customer-based ARR model, and technology stack positioning.",
      color: COLORS.secondary,
      metrics: [
        { label: "Fleet Mgmt TAM", value: fmtB(findMethodology('top_down_fleet_mgmt').tam_2030_usd_b) },
        { label: "ACV", value: "$" + ((ue.core_metrics || {}).acv_usd || 0).toLocaleString() },
        { label: "LTV:CAC", value: ((ue.core_metrics || {}).ltv_cac_ratio || 0) + "x" }
      ]
    },
    {
      name: "Fleet Electrification Intel",
      path: "../fleet-electrification-intel/",
      description: "EV bus stock trajectories, truck electrification sales, regional breakdowns (NA vs EU), regulatory drivers, and autonomous vehicle projections.",
      color: COLORS.accent,
      metrics: [
        { label: "EV Buses 2024", value: fmt((fleet.global_series || [])[3] ? fleet.global_series[3].ev_bus_stock_k : null) + "K" },
        { label: "EV Trucks 2030", value: fmt((fleet.global_series || [])[9] ? fleet.global_series[9].ev_truck_sales_k : null) + "K/yr" },
        { label: "AHV 2030", value: fmt((fleet.global_series || [])[9] ? fleet.global_series[9].ahv_commercial_k : null) + "K" }
      ]
    }
  ];

  var generated = DATA._generated ? new Date(DATA._generated).toLocaleString() : 'unknown';

  return createElement("div", null,
    createElement("div", { style: { marginBottom: 24, display: "flex", alignItems: "center", gap: 12 } },
      createElement("h2", { style: styles.sectionTitle },
        createElement("span", { style: Object.assign({}, styles.sectionDot, { background: COLORS.primary }) }),
        "Dashboard Directory"
      ),
      createElement("span", { style: Object.assign({}, styles.tag, styles.tagGreen) }, "3 dashboards")
    ),
    createElement("p", { style: { color: COLORS.textMuted, fontSize: 13, marginBottom: 24, lineHeight: 1.6 } },
      "All dashboards read from the canonical data layer (v" + (meta.version || '?') + "). Last synced: " + generated + "."
    ),
    createElement("div", { style: styles.grid3 },
      dashboards.map(function(d, i) {
        return createElement("div", {
          key: i,
          style: Object.assign({}, styles.card, {
            borderTop: "3px solid " + d.color,
            display: "flex",
            flexDirection: "column"
          })
        },
          createElement("h3", { style: { fontSize: 16, fontWeight: 700, color: d.color, marginBottom: 12 } }, d.name),
          createElement("p", { style: { fontSize: 12, color: COLORS.textMuted, lineHeight: 1.6, marginBottom: 20, flex: 1 } }, d.description),
          createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 } },
            d.metrics.map(function(m, j) {
              return createElement("div", { key: j, style: { textAlign: "center", padding: "8px 4px", background: "rgba(255,255,255,0.03)", borderRadius: 8 } },
                createElement("div", { style: { fontSize: 14, fontWeight: 700, color: COLORS.text } }, m.value),
                createElement("div", { style: { fontSize: 9, color: COLORS.textDim, textTransform: "uppercase", marginTop: 2 } }, m.label)
              );
            })
          ),
          createElement("a", {
            href: d.path,
            target: "_blank",
            rel: "noopener noreferrer",
            style: {
              display: "block",
              textAlign: "center",
              padding: "10px 16px",
              borderRadius: 8,
              background: "rgba(" + (d.color === COLORS.primary ? "0,212,170" : d.color === COLORS.secondary ? "99,102,241" : "245,158,11") + ",0.15)",
              color: d.color,
              fontSize: 12,
              fontWeight: 600,
              textDecoration: "none",
              border: "1px solid " + d.color + "33",
              transition: "background 0.2s"
            }
          }, "Open Dashboard")
        );
      })
    )
  );
}

// ============ TAB 2: EXECUTIVE SUMMARY ============
function ExecutiveSummary() {
  var coreMetrics = ue.core_metrics || {};

  // ARR trajectory data
  var arrSeries = (arr.tam_based_scenarios || {}).series || [];

  // Fleet transition data
  var fleetSeries = fleet.global_series || [];

  // Competitors for revenue chart
  var competitors = (comp.competitors || []).filter(function(c) { return c.revenue_usd_m; });
  competitors.sort(function(a, b) { return b.revenue_usd_m - a.revenue_usd_m; });

  return createElement("div", null,
    // ── Market Opportunity ──
    createElement("h2", { style: styles.sectionTitle },
      createElement("span", { style: Object.assign({}, styles.sectionDot, { background: COLORS.primary }) }),
      "Market Opportunity"
    ),
    createElement("div", { style: styles.grid3 },
      createElement("div", { style: Object.assign({}, styles.metricCard, { borderTop: "3px solid " + COLORS.primary }) },
        createElement("div", { style: styles.metricLabel }, "Total Addressable Market 2030"),
        createElement("div", { style: Object.assign({}, styles.metricValue, { color: COLORS.primary }) }, fmtM(bottomUp.tam_2030_usd_m)),
        createElement("div", { style: styles.metricSub }, "Bottom-up fleet orchestration (global)")
      ),
      createElement("div", { style: Object.assign({}, styles.metricCard, { borderTop: "3px solid " + COLORS.secondary }) },
        createElement("div", { style: styles.metricLabel }, "Serviceable Addressable Market"),
        createElement("div", { style: Object.assign({}, styles.metricValue, { color: COLORS.secondary }) }, fmtM(bottomUp.sam_2030_usd_m)),
        createElement("div", { style: styles.metricSub }, "83% of TAM — EU+NA primary, APAC emerging")
      ),
      createElement("div", { style: Object.assign({}, styles.metricCard, { borderTop: "3px solid " + COLORS.accent }) },
        createElement("div", { style: styles.metricLabel }, "Serviceable Obtainable Market"),
        createElement("div", { style: Object.assign({}, styles.metricValue, { color: COLORS.accent }) }, fmtM(bottomUp.som_base_2030_usd_m)),
        createElement("div", { style: styles.metricSub }, "5% SAM penetration — ~45 operator deployments")
      )
    ),

    // ── ARR Trajectory ──
    createElement("div", { style: styles.chartCard },
      createElement("div", { style: styles.chartTitle }, "ARR Trajectory — 5 Scenarios (2025–2030)"),
      createElement("div", { style: styles.chartSubtitle }, "Anchored: 2026=$0.8M, 2027=$3.0M | TAM-based penetration models"),
      createElement(ResponsiveContainer, { width: "100%", height: 340 },
        createElement(LineChart, { data: arrSeries, margin: { top: 10, right: 30, left: 10, bottom: 0 } },
          createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1e3a5f", opacity: 0.5 }),
          createElement(XAxis, { dataKey: "year", stroke: COLORS.textDim, fontSize: 11 }),
          createElement(YAxis, { stroke: COLORS.textDim, fontSize: 11, tickFormatter: function(v) { return '$' + v + 'M'; } }),
          createElement(Tooltip, { contentStyle: tooltipStyle, formatter: function(v) { return ['$' + v + 'M']; } }),
          createElement(Legend, { wrapperStyle: { fontSize: 11 } }),
          createElement(Line, { type: "monotone", dataKey: "bear", stroke: COLORS.danger, strokeWidth: 2, dot: false, name: "Bear" }),
          createElement(Line, { type: "monotone", dataKey: "bottoms_up", stroke: COLORS.orange, strokeWidth: 2, dot: false, name: "Bottoms-Up" }),
          createElement(Line, { type: "monotone", dataKey: "tam_conservative", stroke: COLORS.accent, strokeWidth: 2, dot: false, name: "TAM Conservative" }),
          createElement(Line, { type: "monotone", dataKey: "tam_base", stroke: COLORS.primary, strokeWidth: 3, dot: false, name: "TAM Base" }),
          createElement(Line, { type: "monotone", dataKey: "tam_upside", stroke: COLORS.success, strokeWidth: 2, dot: false, name: "TAM Upside" })
        )
      )
    ),

    // ── Unit Economics ──
    createElement("h2", { style: styles.sectionTitle },
      createElement("span", { style: Object.assign({}, styles.sectionDot, { background: COLORS.secondary }) }),
      "Unit Economics"
    ),
    createElement("div", { style: styles.grid5 },
      [
        { label: "ACV", value: "$" + (coreMetrics.acv_usd || 0).toLocaleString(), color: COLORS.primary, sub: "Annual contract value" },
        { label: "Gross Margin", value: (coreMetrics.gross_margin_pct || 0) + "%", color: COLORS.success, sub: "vs 75% SaaS median" },
        { label: "LTV:CAC", value: (coreMetrics.ltv_cac_ratio || 0) + "x", color: COLORS.accent, sub: "vs 3.0x SaaS median" },
        { label: "CAC Payback", value: (coreMetrics.cac_payback_months || 0) + " mo", color: COLORS.info, sub: "vs 18mo SaaS median" },
        { label: "Net Revenue Retention", value: (coreMetrics.nrr_pct || 0) + "%", color: COLORS.purple, sub: "vs 110% SaaS median" }
      ].map(function(m, i) {
        return createElement("div", { key: i, style: Object.assign({}, styles.metricCard, { borderTop: "3px solid " + m.color }) },
          createElement("div", { style: styles.metricLabel }, m.label),
          createElement("div", { style: Object.assign({}, styles.metricValue, { color: m.color, fontSize: 24 }) }, m.value),
          createElement("div", { style: styles.metricSub }, m.sub)
        );
      })
    ),

    // ── Fleet Transition + Competitive Revenue side by side ──
    createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 } },
      // Fleet Transition AreaChart
      createElement("div", { style: styles.chartCard },
        createElement("div", { style: styles.chartTitle }, "Fleet Transition — Key Metrics (2021–2030)"),
        createElement("div", { style: styles.chartSubtitle }, "EV bus stock, truck sales, AHV, managed LCVs (thousands)"),
        createElement(ResponsiveContainer, { width: "100%", height: 300 },
          createElement(AreaChart, { data: fleetSeries, margin: { top: 10, right: 30, left: 10, bottom: 0 } },
            createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1e3a5f", opacity: 0.5 }),
            createElement(XAxis, { dataKey: "year", stroke: COLORS.textDim, fontSize: 11 }),
            createElement(YAxis, { stroke: COLORS.textDim, fontSize: 11, tickFormatter: function(v) { return v + 'K'; } }),
            createElement(Tooltip, { contentStyle: tooltipStyle, formatter: function(v, name) { return [v + 'K', name]; } }),
            createElement(Legend, { wrapperStyle: { fontSize: 11 } }),
            createElement(Area, { type: "monotone", dataKey: "ev_bus_stock_k", stroke: COLORS.primary, fill: COLORS.primary, fillOpacity: 0.15, strokeWidth: 2, name: "EV Bus Stock" }),
            createElement(Area, { type: "monotone", dataKey: "ev_truck_sales_k", stroke: COLORS.secondary, fill: COLORS.secondary, fillOpacity: 0.15, strokeWidth: 2, name: "EV Truck Sales" }),
            createElement(Area, { type: "monotone", dataKey: "ahv_commercial_k", stroke: COLORS.accent, fill: COLORS.accent, fillOpacity: 0.15, strokeWidth: 2, name: "AHV (L4+)" }),
            createElement(Area, { type: "monotone", dataKey: "lcv_managed_stock_k", stroke: COLORS.cyan, fill: COLORS.cyan, fillOpacity: 0.15, strokeWidth: 2, name: "Managed LCVs" })
          )
        )
      ),
      // Competitive Revenue BarChart
      createElement("div", { style: styles.chartCard },
        createElement("div", { style: styles.chartTitle }, "Competitive Revenue Comparison"),
        createElement("div", { style: styles.chartSubtitle }, "Annual revenue ($M) — latest reported"),
        createElement(ResponsiveContainer, { width: "100%", height: 300 },
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

// ============ TAB 3: MARKET DEEP DIVE ============
function MarketDeepDive() {
  // TAM Segments data
  var segments = ms.segments_2030 || [];
  var segmentData = segments.map(function(s) {
    return {
      name: s.name.replace(' Fleet Orchestration', '').replace(' (mixed depot)', ''),
      exChina: s.revenue_ex_china_usd_m,
      china: s.revenue_china_usd_m,
      total: s.total_usd_m
    };
  });

  // Regional SAM data (exclude TOTAL row)
  var samRegions = (ms.sam_by_region || []).filter(function(r) { return r.region !== 'TOTAL SAM' && r.region !== 'All segments (full)'; });

  // Gartner SPAs
  var spas = (gartner.spas || []);

  // Build unified SPA series for chart — normalize to longest series
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

  // AHV Fleet Projection
  var ahvData = gartner.ahv_fleet_baseline || [];

  return createElement("div", null,
    // ── TAM Segments ──
    createElement("div", { style: styles.chartCard },
      createElement("div", { style: styles.chartTitle }, "TAM Segments 2030 — Ex-China vs China ($M)"),
      createElement("div", { style: styles.chartSubtitle }, "Bottom-up: vehicles x ARPU across 6 fleet segments"),
      createElement(ResponsiveContainer, { width: "100%", height: 320 },
        createElement(BarChart, {
          data: segmentData,
          layout: "vertical",
          margin: { top: 10, right: 30, left: 120, bottom: 0 }
        },
          createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1e3a5f", opacity: 0.5, horizontal: false }),
          createElement(XAxis, { type: "number", stroke: COLORS.textDim, fontSize: 11, tickFormatter: function(v) { return '$' + v + 'M'; } }),
          createElement(YAxis, { type: "category", dataKey: "name", stroke: COLORS.textDim, fontSize: 11, width: 115 }),
          createElement(Tooltip, { contentStyle: tooltipStyle, formatter: function(v) { return ['$' + v + 'M']; } }),
          createElement(Legend, { wrapperStyle: { fontSize: 11 } }),
          createElement(Bar, { dataKey: "exChina", stackId: "a", fill: COLORS.primary, name: "Ex-China", radius: [0, 0, 0, 0] }),
          createElement(Bar, { dataKey: "china", stackId: "a", fill: COLORS.accent, name: "China", radius: [0, 4, 4, 0] })
        )
      )
    ),

    // ── Regional SAM + Gartner SPAs side by side ──
    createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 } },
      // Regional SAM PieChart
      createElement("div", { style: styles.chartCard },
        createElement("div", { style: styles.chartTitle }, "SAM by Region — $4.6B Total"),
        createElement("div", { style: styles.chartSubtitle }, "EU + NA primary markets | APAC emerging | China 30% accessible"),
        createElement(ResponsiveContainer, { width: "100%", height: 300 },
          createElement(PieChart, null,
            createElement(Pie, {
              data: samRegions,
              dataKey: "sam_usd_m",
              nameKey: "region",
              cx: "50%",
              cy: "50%",
              outerRadius: 110,
              innerRadius: 50,
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
      ),
      // Gartner SPAs LineChart
      createElement("div", { style: styles.chartCard },
        createElement("div", { style: styles.chartTitle }, "Gartner Strategic Planning Assumptions"),
        createElement("div", { style: styles.chartSubtitle }, "Adoption curves from Predicts 2026: Transportation (G00841141)"),
        createElement(ResponsiveContainer, { width: "100%", height: 300 },
          createElement(LineChart, { data: spaChartData, margin: { top: 10, right: 30, left: 10, bottom: 0 } },
            createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1e3a5f", opacity: 0.5 }),
            createElement(XAxis, { dataKey: "year", stroke: COLORS.textDim, fontSize: 11 }),
            createElement(YAxis, { stroke: COLORS.textDim, fontSize: 11, tickFormatter: function(v) { return v + '%'; } }),
            createElement(Tooltip, { contentStyle: tooltipStyle, formatter: function(v) { return [v + '%']; } }),
            createElement(Legend, { wrapperStyle: { fontSize: 11 } }),
            spas.map(function(spa, i) {
              return createElement(Line, {
                key: spa.id,
                type: "monotone",
                dataKey: spa.id,
                stroke: CHART_COLORS[i % CHART_COLORS.length],
                strokeWidth: 2,
                dot: false,
                name: spa.title.length > 30 ? spa.title.substring(0, 28) + '...' : spa.title,
                connectNulls: true
              });
            })
          )
        )
      )
    ),

    // ── AHV Fleet Projection ──
    createElement("div", { style: styles.chartCard },
      createElement("div", { style: styles.chartTitle }, "Autonomous Heavy Vehicle Fleet Projection (2024–2035)"),
      createElement("div", { style: styles.chartSubtitle }, "Commercially deployed L4+ vehicles (thousands) by region"),
      createElement(ResponsiveContainer, { width: "100%", height: 320 },
        createElement(AreaChart, { data: ahvData, margin: { top: 10, right: 30, left: 10, bottom: 0 } },
          createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1e3a5f", opacity: 0.5 }),
          createElement(XAxis, { dataKey: "year", stroke: COLORS.textDim, fontSize: 11 }),
          createElement(YAxis, { stroke: COLORS.textDim, fontSize: 11, tickFormatter: function(v) { return v + 'K'; } }),
          createElement(Tooltip, { contentStyle: tooltipStyle, formatter: function(v) { return [v + 'K']; } }),
          createElement(Legend, { wrapperStyle: { fontSize: 11 } }),
          createElement(Area, { type: "monotone", dataKey: "na_eu_k", stackId: "1", stroke: COLORS.primary, fill: COLORS.primary, fillOpacity: 0.3, name: "NA + EU" }),
          createElement(Area, { type: "monotone", dataKey: "apac_k", stackId: "1", stroke: COLORS.accent, fill: COLORS.accent, fillOpacity: 0.3, name: "APAC" }),
          createElement(Area, { type: "monotone", dataKey: "china_k", stackId: "1", stroke: COLORS.danger, fill: COLORS.danger, fillOpacity: 0.3, name: "China" })
        )
      )
    )
  );
}

// ============ TAB 4: SOURCES & METHODOLOGY ============
function SourcesMethodology() {
  var categories = sources.categories || [];

  var statusColors = {
    "200": { bg: "rgba(34,197,94,0.15)", color: COLORS.success, label: "Verified" },
    "202": { bg: "rgba(34,197,94,0.15)", color: COLORS.success, label: "Verified" },
    "503_bot_protected": { bg: "rgba(245,158,11,0.15)", color: COLORS.accent, label: "Bot-Protected" }
  };

  var methodologies = [
    {
      title: "Bottom-Up TAM ($5.6B)",
      description: "Segment-level vehicle counts multiplied by annual revenue per unit (ARPU). Six segments: Transit, Freight, Legacy Buses, Legacy Trucks, AHV, and LCV. Validated against IEA fleet data and ACEA total fleet sizes.",
      tag: "Canonical",
      tagStyle: styles.tagGreen
    },
    {
      title: "Top-Down Fleet Management ($70B)",
      description: "Total fleet management software market from MarketsandMarkets. SAM = HD trucking segment (45% of TAM = $32B). Broader than orchestration — includes telematics, routing, and maintenance. Used as denominator for market share analysis.",
      tag: "Reference",
      tagStyle: styles.tagBlue
    },
    {
      title: "ARR Anchoring (2026=$0.8M, 2027=$3.0M)",
      description: "All 5 ARR scenarios are pinned at the same anchors: $0 in 2025 (funded, no revenue), $0.8M in 2026 (first commercial), $3.0M in 2027 (product maturity). Scenarios diverge from 2028 based on different SAM penetration rates (bear 50% CAGR to upside 7% SAM).",
      tag: "Assumption",
      tagStyle: styles.tagYellow
    }
  ];

  return createElement("div", null,
    // ── Methodology Explainers ──
    createElement("h2", { style: styles.sectionTitle },
      createElement("span", { style: Object.assign({}, styles.sectionDot, { background: COLORS.secondary }) }),
      "Methodology"
    ),
    createElement("div", { style: styles.grid3 },
      methodologies.map(function(m, i) {
        return createElement("div", { key: i, style: styles.card },
          createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 } },
            createElement("h3", { style: { fontSize: 14, fontWeight: 700, color: COLORS.text } }, m.title),
            createElement("span", { style: Object.assign({}, styles.tag, m.tagStyle) }, m.tag)
          ),
          createElement("p", { style: { fontSize: 12, color: COLORS.textMuted, lineHeight: 1.6 } }, m.description)
        );
      })
    ),

    // ── Source Registry ──
    createElement("h2", { style: Object.assign({}, styles.sectionTitle, { marginTop: 16 }) },
      createElement("span", { style: Object.assign({}, styles.sectionDot, { background: COLORS.primary }) }),
      "Source Registry — " + (sources.total_sources || 0) + " Sources"
    ),
    createElement("div", { style: { color: COLORS.textDim, fontSize: 12, marginBottom: 24, fontFamily: "'DM Mono', monospace" } },
      "Last verified: " + (sources.last_verified || 'unknown')
    ),
    categories.map(function(cat, ci) {
      return createElement("div", { key: ci, style: { marginBottom: 24 } },
        createElement("h3", { style: { fontSize: 14, fontWeight: 600, color: CHART_COLORS[ci % CHART_COLORS.length], marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid " + COLORS.border } },
          cat.category + " (" + cat.items.length + ")"
        ),
        createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: 12 } },
          cat.items.map(function(item, ii) {
            var statusInfo = statusColors[item.status] || { bg: "rgba(107,114,128,0.15)", color: COLORS.textDim, label: item.status || "No URL" };
            return createElement("div", { key: ii, style: {
              padding: "12px 16px",
              background: "rgba(255,255,255,0.02)",
              borderRadius: 8,
              border: "1px solid " + COLORS.border,
              display: "flex",
              alignItems: "flex-start",
              gap: 12
            } },
              createElement("div", { style: { flex: 1, minWidth: 0 } },
                item.url
                  ? createElement("a", {
                      href: item.url,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      style: { color: COLORS.text, fontSize: 12, fontWeight: 600, textDecoration: "none", display: "block", marginBottom: 2 }
                    }, item.name)
                  : createElement("span", { style: { color: COLORS.text, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 2 } }, item.name),
                createElement("span", { style: { color: COLORS.textDim, fontSize: 11 } }, item.org || ''),
                item.note ? createElement("div", { style: { color: COLORS.textMuted, fontSize: 10, marginTop: 4, fontStyle: "italic" } }, item.note) : null
              ),
              createElement("span", { style: Object.assign({}, styles.tag, { background: statusInfo.bg, color: statusInfo.color, whiteSpace: "nowrap" }) }, statusInfo.label)
            );
          })
        )
      );
    })
  );
}

// ============ APP COMPONENT ============
function App() {
  var tabState = useState(0);
  var activeTab = tabState[0];
  var setActiveTab = tabState[1];

  var tabs = ["Dashboard Directory", "Executive Summary", "Market Deep Dive", "Sources & Methodology"];

  return createElement("div", { style: styles.app },
    // Header
    createElement("div", { style: styles.header },
      createElement("div", { style: styles.headerTop },
        createElement("div", null,
          createElement("h1", { style: styles.title }, "Greenbay Intelligence Hub"),
          createElement("p", { style: styles.subtitle },
            "Master dashboard — canonical data v" + (meta.version || '?') + " — " + (meta.data_as_of || '')
          )
        ),
        createElement("div", { style: { textAlign: "right" } },
          createElement("span", { style: styles.versionBadge }, "v" + (meta.version || '?')),
          createElement("div", { style: { fontSize: 10, color: COLORS.textDim, marginTop: 4, fontFamily: "'DM Mono', monospace" } },
            "Synced: " + (DATA._generated ? new Date(DATA._generated).toLocaleDateString() : '—')
          )
        )
      )
    ),
    // Tab Bar
    createElement("div", { style: styles.tabBar },
      tabs.map(function(label, i) {
        var isActive = activeTab === i;
        return createElement("button", {
          key: i,
          style: Object.assign({}, styles.tab, isActive ? styles.tabActive : {}),
          onClick: function() { setActiveTab(i); }
        }, label);
      })
    ),
    // Content
    createElement("div", { style: styles.content },
      activeTab === 0 ? createElement(DashboardDirectory, null) :
      activeTab === 1 ? createElement(ExecutiveSummary, null) :
      activeTab === 2 ? createElement(MarketDeepDive, null) :
      createElement(SourcesMethodology, null)
    )
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
