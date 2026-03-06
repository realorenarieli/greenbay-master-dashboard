#!/usr/bin/env node
/**
 * E2E test for Greenbay Investor Pitch Deck
 * Renders all 11 slides, screenshots each, validates content & navigation.
 * Run: node test-e2e.js
 */

const { chromium } = require('playwright');
const { execSync } = require('child_process');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 9876;
const BASE = __dirname;
const SCREENSHOT_DIR = path.join(BASE, 'test-screenshots');
const TOTAL_SLIDES = 12;

const SLIDE_NAMES = [
  'Greenbay', 'The Problem', 'The Solution', 'Why Now', 'Market Opportunity',
  'Why Greenbay Wins', 'Traction', 'Team', 'Business Model', 'Vision', 'The Ask', 'Appendix'
];

// Simple static file server
function startServer() {
  return new Promise(function(resolve) {
    var server = http.createServer(function(req, res) {
      var url = req.url === '/' ? '/index.html' : req.url;
      var filePath = path.join(BASE, url);
      var ext = path.extname(filePath).toLowerCase();
      var mimeTypes = {
        '.html': 'text/html', '.js': 'application/javascript',
        '.json': 'application/json', '.png': 'image/png',
        '.jpg': 'image/jpeg', '.css': 'text/css'
      };
      fs.readFile(filePath, function(err, data) {
        if (err) {
          res.writeHead(404);
          res.end('Not found: ' + url);
        } else {
          res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
          res.end(data);
        }
      });
    });
    server.listen(PORT, function() { resolve(server); });
  });
}

// ── TESTS ──
var results = { pass: 0, fail: 0, errors: [] };

function assert(condition, msg) {
  if (condition) {
    results.pass++;
    console.log('  ✓ ' + msg);
  } else {
    results.fail++;
    results.errors.push(msg);
    console.log('  ✗ FAIL: ' + msg);
  }
}

// Helper: click a navigation dot by slide title
async function clickDot(page, slideTitle) {
  await page.click('button[title="' + slideTitle + '"]');
  await page.waitForTimeout(600); // Wait for fade (200ms) + chart animation (400ms)
}

// Helper: wait for slide to be active by checking counter text
async function waitForSlide(page, slideNum) {
  var expected = slideNum + ' / ' + TOTAL_SLIDES;
  await page.waitForFunction(
    function(text) { return document.getElementById('root').textContent.includes(text); },
    expected,
    { timeout: 3000 }
  ).catch(function() {
    // fallback — just wait
  });
  await page.waitForTimeout(100);
}

async function run() {
  // Setup
  if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  var server = await startServer();
  console.log('Server running on http://localhost:' + PORT);

  var browser = await chromium.launch();
  var page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // Collect console errors
  var consoleErrors = [];
  page.on('console', function(msg) { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

  try {
    // ── 1. Page loads ──
    console.log('\n=== 1. Page Load ===');
    await page.goto('http://localhost:' + PORT, { waitUntil: 'networkidle' });

    // Loading spinner should be hidden
    var loadingDisplay = await page.$eval('#loading', function(el) { return el.style.display; });
    assert(loadingDisplay === 'none', 'Loading spinner hidden after render');

    // Root should have content
    var rootHTML = await page.$eval('#root', function(el) { return el.innerHTML; });
    assert(rootHTML.length > 100, 'Root element has rendered content (' + rootHTML.length + ' chars)');

    // ── 2. Title slide content ──
    console.log('\n=== 2. Title Slide Content ===');
    var pageText = await page.textContent('#root');
    assert(pageText.includes('Greenbay'), 'Title slide shows "Greenbay"');
    assert(pageText.includes('Orchestration Layer'), 'Tagline present');
    assert(pageText.includes('Modern Fleets'), 'Tagline says "Modern Fleets"');

    // Screenshot slide 1
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-title.png'), fullPage: false });

    // ── 3. Navigate all slides with keyboard ──
    console.log('\n=== 3. Slide Navigation ===');
    for (var i = 1; i < TOTAL_SLIDES; i++) {
      await page.keyboard.press('ArrowRight');
      await waitForSlide(page, i + 1);
      await page.waitForTimeout(200); // Extra settle time

      // Check slide counter
      var counter = await page.textContent('#root');
      var expectedCounter = (i + 1) + ' / ' + TOTAL_SLIDES;
      assert(counter.includes(expectedCounter), 'Slide ' + (i + 1) + ' counter shows "' + expectedCounter + '"');

      // Screenshot
      var num = String(i + 1).padStart(2, '0');
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, num + '-' + SLIDE_NAMES[i].toLowerCase().replace(/\s+/g, '-') + '.png'),
        fullPage: false
      });
    }

    // Navigate back to first slide
    for (var j = 0; j < TOTAL_SLIDES - 1; j++) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(300); // Respect fade transition
    }
    await waitForSlide(page, 1);
    var backText = await page.textContent('#root');
    assert(backText.includes('1 / ' + TOTAL_SLIDES), 'Keyboard nav back to slide 1 works');

    // ── 4. Dot navigation ──
    console.log('\n=== 4. Dot Navigation ===');
    // Count nav dots using title attribute matching known slide names
    var dotCount = 0;
    for (var d = 0; d < SLIDE_NAMES.length; d++) {
      var dot = await page.$('button[title="' + SLIDE_NAMES[d] + '"]');
      if (dot) dotCount++;
    }
    assert(dotCount === TOTAL_SLIDES, 'Found ' + dotCount + ' navigation dots (expected ' + TOTAL_SLIDES + ')');

    // Click dot 5 (Market Opportunity)
    await clickDot(page, 'Market Opportunity');
    var dotNavText = await page.textContent('#root');
    assert(dotNavText.includes('5 / ' + TOTAL_SLIDES), 'Dot click navigates to slide 5');
    assert(dotNavText.includes('Market Opportunity'), 'Dot click shows Market Opportunity');

    // ── 5. Data validation: canonical values on screen ──
    console.log('\n=== 5. Canonical Data Validation ===');

    // Load canonical bundle to compare
    var bundle = JSON.parse(fs.readFileSync(path.join(BASE, 'data', 'canonical-bundle.json'), 'utf8'));
    var ms = bundle.market_sizing;
    var ue = bundle.unit_economics;
    var bottomUp = ms.methodologies.find(function(m) { return m.id === 'bottom_up_orchestration'; });

    // Already on Market Opportunity slide (slide 5)
    var marketText = await page.textContent('#root');

    // TAM
    var tamStr = '$' + (bottomUp.tam_2030_usd_m / 1000).toFixed(1).replace(/\.0$/, '') + 'B';
    assert(marketText.includes(tamStr) || marketText.includes('$' + bottomUp.tam_2030_usd_m + 'M'), 'TAM value ' + tamStr + ' on Market slide');

    // SAM
    var samStr = '$' + (bottomUp.sam_2030_usd_m / 1000).toFixed(1).replace(/\.0$/, '') + 'B';
    assert(marketText.includes(samStr) || marketText.includes('$' + bottomUp.sam_2030_usd_m + 'M'), 'SAM value ' + samStr + ' on Market slide');

    // SOM
    assert(marketText.includes('$' + bottomUp.som_base_2030_usd_m + 'M'), 'SOM value $' + bottomUp.som_base_2030_usd_m + 'M on Market slide');

    // Go to Business Model slide (slide 9)
    await clickDot(page, 'Business Model');
    var bizText = await page.textContent('#root');

    // ACV
    var acvStr = '$' + ue.core_metrics.acv_usd.toLocaleString();
    assert(bizText.includes(acvStr) || bizText.includes('$375'), 'ACV value on Business Model slide');

    // Gross Margin
    assert(bizText.includes(ue.core_metrics.gross_margin_pct + '%'), 'Gross Margin ' + ue.core_metrics.gross_margin_pct + '% on Business Model');

    // LTV:CAC
    assert(bizText.includes(ue.core_metrics.ltv_cac_ratio + 'x'), 'LTV:CAC ' + ue.core_metrics.ltv_cac_ratio + 'x on Business Model');

    // NRR
    assert(bizText.includes(ue.core_metrics.nrr_pct + '%'), 'NRR ' + ue.core_metrics.nrr_pct + '% on Business Model');

    // ── 6. Traction slide checks ──
    console.log('\n=== 6. Traction Slide ===');
    await clickDot(page, 'Traction');
    var tractionText = await page.textContent('#root');

    assert(tractionText.includes('LOIs for Pilots'), 'Traction shows "LOIs for Pilots" (not "Paid Pilots")');
    assert(tractionText.includes('200+'), 'Traction shows "200+" qualified accounts');
    assert(tractionText.includes('Qualified Accounts'), 'Traction shows "Qualified Accounts"');
    assert(tractionText.includes('20'), 'Traction shows "20" engaged accounts');
    assert(!tractionText.includes('pilot operators'), 'No "pilot operators" in traction (only LOIs signed)');
    assert(tractionText.includes('product trials'), 'Traction says "product trials" not "pilot operators"');

    // ── 6b. Vision slide ──
    console.log('\n=== 6b. Vision Slide ===');
    await clickDot(page, 'Vision');
    var visionText = await page.textContent('#root');

    assert(visionText.includes('The Vision'), 'Vision slide has "The Vision" title');
    assert(visionText.includes('operating system') || visionText.includes('autonomous fleets'), 'Vision slide has subtitle');
    assert(visionText.includes('AI'), 'Vision slide mentions AI');
    assert(visionText.includes('Autonomous'), 'Vision slide mentions Autonomous');
    assert(visionText.includes('Electrification'), 'Vision slide mentions Electrification');
    assert(visionText.includes('GREENBAY'), 'Vision slide has GREENBAY nucleus');
    assert(visionText.includes('2030'), 'Vision slide has 2030 closing statement');
    assert(visionText.includes('$70B'), 'Vision slide shows $70B TAM (MarketsandMarkets)');
    assert(visionText.includes('13.3%'), 'Vision slide shows 13.3% CAGR (MarketsandMarkets)');
    assert(visionText.includes('10x'), 'Vision slide shows 10x EV truck growth (IEA GEO 2025)');
    assert(visionText.includes('$12.2B'), 'Vision slide shows $12.2B orchestration TAM 2035');

    // ── 7. The Ask slide ──
    console.log('\n=== 7. The Ask Slide ===');
    await clickDot(page, 'The Ask');
    var askText = await page.textContent('#root');

    assert(askText.includes('Pre-Seed Round'), 'The Ask shows "Pre-Seed Round"');
    assert(askText.includes('$3M'), 'The Ask shows $3M raise');
    assert(askText.includes('Pre-Seed'), 'Ask slide says "Pre-Seed" not "seed"');

    // Use of funds adds to 100%
    assert(askText.includes('65%') && askText.includes('18%') && askText.includes('9%') && askText.includes('8%'),
      'Use of funds percentages present (65+18+9+8=100)');

    // ── 8. Appendix — source links ──
    console.log('\n=== 8. Appendix Slide ===');
    await clickDot(page, 'Appendix');
    var appendixText = await page.textContent('#root');

    assert(appendixText.includes('Source Registry'), 'Appendix has Source Registry');
    assert(appendixText.includes('Market Dashboard'), 'Appendix links to Market Dashboard');
    assert(appendixText.includes('Fleet Orchestration'), 'Appendix links to Fleet Orchestration');
    assert(appendixText.includes('Fleet Electrification'), 'Appendix links to Fleet Electrification Intel');

    // ── 8b. Why Now slide content ──
    console.log('\n=== 8b. Why Now Slide Content ===');
    await clickDot(page, 'Why Now');
    var whyNowText = await page.textContent('#root');

    // Force card titles
    assert(whyNowText.includes('Regulatory Mandates'), 'Why Now has "Regulatory Mandates" force card');
    assert(whyNowText.includes('Fleet Electrification'), 'Why Now has "Fleet Electrification" force card');
    assert(whyNowText.includes('Agentic AI Wave'), 'Why Now has "Agentic AI Wave" force card');
    assert(whyNowText.includes('Autonomous Vehicles'), 'Why Now has "Autonomous Vehicles" force card');

    // Stat values
    assert(whyNowText.includes('4x'), 'Why Now has "4x" EV growth stat');
    assert(whyNowText.includes('176x'), 'Why Now has "176x" autonomous scale stat');
    assert(whyNowText.includes('-15%'), 'Why Now has "-15%" diesel decline stat');

    // Convergence year
    assert(whyNowText.includes('2026'), 'Why Now has "2026" convergence year');

    // Gartner chart renders on this slide
    var whyNowSvgs = await page.$$('svg.recharts-surface');
    assert(whyNowSvgs.length >= 1, 'Why Now slide renders Gartner chart (' + whyNowSvgs.length + ' svg found)');

    // ── 8c. Market Opportunity slide funnel ──
    console.log('\n=== 8c. Market Opportunity Funnel ===');
    await clickDot(page, 'Market Opportunity');
    var mktText = await page.textContent('#root');

    // Funnel tier labels
    assert(mktText.includes('Total Addressable Market'), 'Market slide has "Total Addressable Market" funnel tier');
    assert(mktText.includes('Serviceable Addressable Market'), 'Market slide has "Serviceable Addressable Market" funnel tier');
    assert(mktText.includes('Serviceable Obtainable Market'), 'Market slide has "Serviceable Obtainable Market" funnel tier');

    // Growth indicator text
    assert(mktText.includes('2035'), 'Market slide has "2035" growth reference');
    assert(mktText.includes('13.3%'), 'Market slide has "13.3%" CAGR stat');

    // TAM/SAM/SOM values still present
    assert(mktText.includes(tamStr) || mktText.includes('$' + bottomUp.tam_2030_usd_m + 'M'), 'Market funnel shows TAM value');
    assert(mktText.includes(samStr) || mktText.includes('$' + bottomUp.sam_2030_usd_m + 'M'), 'Market funnel shows SAM value');
    assert(mktText.includes('$' + bottomUp.som_base_2030_usd_m + 'M'), 'Market funnel shows SOM value');

    // Charts still render (2+ svg.recharts-surface)
    var mktSvgs = await page.$$('svg.recharts-surface');
    assert(mktSvgs.length >= 2, 'Market slide renders 2+ charts (' + mktSvgs.length + ' svg found)');

    // ── 8d. Why Greenbay Wins slide content ──
    console.log('\n=== 8d. Why Greenbay Wins Slide ===');
    await clickDot(page, 'Why Greenbay Wins');
    var compText = await page.textContent('#root');

    // Layer names
    assert(compText.includes('Strategy & Planning'), 'Competitive slide has "Strategy & Planning" layer');
    assert(compText.includes('Orchestration'), 'Competitive slide has "Orchestration" layer');
    assert(compText.includes('Execution & Operations'), 'Competitive slide has "Execution & Operations" layer');
    assert(compText.includes('Assets & Infrastructure'), 'Competitive slide has "Assets & Infrastructure" layer');

    // GREENBAY label
    assert(compText.includes('GREENBAY'), 'Competitive slide has "GREENBAY" label on L2');

    // Competitor chart renders
    var compSvgs = await page.$$('svg.recharts-surface');
    assert(compSvgs.length >= 1, 'Competitive slide renders competitor chart (' + compSvgs.length + ' svg found)');

    // Differentiator labels
    assert(compText.includes('EV-Native'), 'Competitive slide has "EV-Native" differentiator');
    assert(compText.includes('Hardware-Agnostic'), 'Competitive slide has "Hardware-Agnostic" differentiator');
    assert(compText.includes('Full Orchestration'), 'Competitive slide has "Full Orchestration" differentiator');

    // Execution layer examples include Samsara
    assert(compText.includes('Samsara'), 'Competitive slide has "Samsara" in execution layer examples');

    // ── 9. Charts rendered ──
    console.log('\n=== 9. Chart Rendering ===');

    // Go to Problem slide (chaos visual, no chart)
    await clickDot(page, 'The Problem');
    await page.waitForTimeout(300);
    var problemText = await page.evaluate(() => document.body.innerText.toLowerCase());
    assert(problemText.includes('siloed tools'), 'Problem slide contains "Siloed Tools" metric');

    // Go to Market slide (has BarChart + PieChart)
    await clickDot(page, 'Market Opportunity');
    await page.waitForTimeout(300);
    svgs = await page.$$('svg.recharts-surface');
    assert(svgs.length >= 2, 'Market slide renders 2+ charts (' + svgs.length + ' found)');

    // Go to Business Model (has LineChart)
    await clickDot(page, 'Business Model');
    await page.waitForTimeout(300);
    svgs = await page.$$('svg.recharts-surface');
    assert(svgs.length > 0, 'Business Model slide renders chart(s) (' + svgs.length + ' found)');

    // ── 10. No JS errors ──
    console.log('\n=== 10. Console Errors ===');
    assert(consoleErrors.length === 0, 'No console errors (found ' + consoleErrors.length + ')');
    if (consoleErrors.length > 0) {
      consoleErrors.forEach(function(e) { console.log('    error: ' + e); });
    }

    // ── 11. Deployment checks ──
    console.log('\n=== 11. Deployment Checks ===');

    // 11a. gh-pages branch must be in sync with main
    try {
      var mainSha = execSync('git rev-parse main', { cwd: BASE, encoding: 'utf8' }).trim();
      var ghPagesSha = execSync('git rev-parse gh-pages', { cwd: BASE, encoding: 'utf8' }).trim();
      assert(mainSha === ghPagesSha, 'gh-pages is in sync with main (' + mainSha.slice(0, 7) + ')');
      if (mainSha !== ghPagesSha) {
        var mainShort = mainSha.slice(0, 7);
        var ghShort = ghPagesSha.slice(0, 7);
        console.log('    main: ' + mainShort + ', gh-pages: ' + ghShort);
        var behindCount = execSync('git rev-list --count gh-pages..main', { cwd: BASE, encoding: 'utf8' }).trim();
        console.log('    gh-pages is ' + behindCount + ' commit(s) behind main');
      }
    } catch (gitErr) {
      assert(false, 'gh-pages branch sync check (git error: ' + gitErr.message + ')');
    }

    // 11b. Critical files exist on gh-pages branch
    try {
      var criticalFiles = ['index.html', 'dashboard.js', 'data/canonical-bundle.json'];
      criticalFiles.forEach(function(file) {
        try {
          execSync('git show gh-pages:' + file + ' > /dev/null 2>&1', { cwd: BASE });
          assert(true, 'gh-pages has ' + file);
        } catch (e) {
          assert(false, 'gh-pages has ' + file + ' (MISSING)');
        }
      });
    } catch (fileErr) {
      assert(false, 'gh-pages file check (error: ' + fileErr.message + ')');
    }

    // 11c. gh-pages dashboard.js matches working copy (no uncommitted drift)
    try {
      var ghPagesDash = execSync('git show gh-pages:dashboard.js', { cwd: BASE, encoding: 'utf8' });
      var localDash = fs.readFileSync(path.join(BASE, 'dashboard.js'), 'utf8');
      assert(ghPagesDash === localDash, 'gh-pages dashboard.js matches local working copy');
    } catch (diffErr) {
      assert(false, 'gh-pages dashboard.js content match (error: ' + diffErr.message + ')');
    }

    // 11d. Live GitHub Pages serves current content
    try {
      var liveContent = await new Promise(function(resolve, reject) {
        var url = 'https://realorenarieli.github.io/greenbay-master-dashboard/dashboard.js';
        https.get(url, { headers: { 'Cache-Control': 'no-cache' } }, function(res) {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            https.get(res.headers.location, function(res2) {
              var body = '';
              res2.on('data', function(chunk) { body += chunk; });
              res2.on('end', function() { resolve({ status: res2.statusCode, body: body }); });
            }).on('error', reject);
          } else {
            var body = '';
            res.on('data', function(chunk) { body += chunk; });
            res.on('end', function() { resolve({ status: res.statusCode, body: body }); });
          }
        }).on('error', reject);
      });

      assert(liveContent.status === 200, 'GitHub Pages returns 200 for dashboard.js (got ' + liveContent.status + ')');
      if (liveContent.status === 200) {
        // Check that key content from current version exists in live file
        var hasCurrentSubtitle = liveContent.body.includes('Disconnected. Fragmented. Broken.');
        assert(hasCurrentSubtitle, 'Live dashboard.js has current subtitle ("Disconnected. Fragmented. Broken.")');

        var hasSiloedMetric = liveContent.body.includes('Siloed Tools Per Operator');
        assert(hasSiloedMetric, 'Live dashboard.js has current metric ("Siloed Tools Per Operator")');

        var hasStaleChart = liveContent.body.includes('Fleet Electrification Trajectory');
        assert(!hasStaleChart, 'Live dashboard.js does NOT have removed chart ("Fleet Electrification Trajectory")');
      }
    } catch (liveErr) {
      console.log('    (Live URL check skipped: ' + liveErr.message + ')');
    }

  } catch (err) {
    results.fail++;
    results.errors.push('Unexpected error: ' + err.message);
    console.error('Test error:', err);
  } finally {
    await browser.close();
    server.close();
  }

  // ── Report ──
  console.log('\n' + '='.repeat(50));
  console.log('E2E Test Results');
  console.log('='.repeat(50));
  console.log('Passed: ' + results.pass);
  console.log('Failed: ' + results.fail);

  if (results.errors.length > 0) {
    console.log('\nFailed tests:');
    results.errors.forEach(function(e) { console.log('  ✗ ' + e); });
  }

  console.log('\nScreenshots saved to: ' + SCREENSHOT_DIR);
  process.exit(results.fail > 0 ? 1 : 0);
}

run();
