/**
 * ReviewGuard AI - Core Interactive Controller & Simulated NLP Engine
 * Built for College Project Presentation Demonstration
 */

// Global State
const ReviewGuard = {
  currentScreen: 'dashboard',
  charts: {},
  demoStats: {
    totalAnalyzed: 1482,
    genuineCount: 984,
    suspiciousCount: 498,
    accuracy: 94.2,
    f1Score: 93.8
  },
  bulkResults: [],
  modelMetrics: {
    lr: { accuracy: 94.2, precision: 93.8, recall: 94.6, f1: 94.2, tn: 485, fp: 25, fn: 28, tp: 462 },
    nb: { accuracy: 89.5, precision: 87.2, recall: 91.0, f1: 89.0, tn: 460, fp: 50, fn: 45, tp: 445 }
  }
};

// Preset Demonstration Reviews for Instant Viva Testing
const DEMO_SAMPLES = [
  {
    type: 'genuine',
    label: 'Genuine Tech Review',
    product: 'Sony WH-1000XM5 Headphones',
    rating: 4,
    text: "I've been using these headphones for about three weeks now. The noise cancellation is impressive for commuter trains, though wind noise can occasionally bleed through. Battery life averages around 26 hours on a single charge. Ear cushions get slightly warm after 2 hours of continuous use, but overall well worth the price."
  },
  {
    type: 'genuine',
    label: 'Genuine Kitchen Review',
    product: 'Ninja 4-in-1 Air Fryer Max',
    rating: 4,
    text: "Solid kitchen appliance for everyday cooking. The basket is easy to wipe clean and comfortably fits enough fries for two people. It does get fairly loud when operating at 400 degrees, but it cooks evenly and the nonstick coating holds up well after a month of hand washing."
  },
  {
    type: 'suspicious',
    label: 'Hyperbolic Bot Hype',
    product: 'Ultra Glow Skin Serum',
    rating: 5,
    text: "AMAZING PRODUCT!! BEST SERUM EVER CREATED IN HUMAN HISTORY! It erased all my wrinkles in 2 hours! A true miracle from heaven! You MUST buy this right now do not hesitate! 1000% satisfaction guaranteed buy buy buy five stars A++++++!"
  },
  {
    type: 'suspicious',
    label: 'Generic 5-Star Fluff',
    product: 'Smart Sleep Tracker Watch',
    rating: 5,
    text: "Very good product. Nice quality. Fast shipping. Good seller. Five stars. Highly recommend to everyone. Works good thank you seller."
  },
  {
    type: 'suspicious',
    label: 'Fake 1-Star Competitor Attack',
    product: 'ProSpeed Running Shoes',
    rating: 1,
    text: "TOTAL SCAM DO NOT BUY!! CHEAP PLASTIC TRASH DESTROYED MY FEET IN 5 MINUTES! WORST COMPANY EVER REPORT TO POLICE FRAUD! STOLE MY MONEY!"
  }
];

// 20 Pre-packaged Demonstration Records for Bulk Analysis
const PRELOADED_BULK_DATA = [
  { id: 1, product: 'Sony WH-1000XM5 Headphones', category: 'Electronics', text: "I've used these for two weeks on daily train commutes. Noise cancellation is fantastic at cutting low rumble, though wind occasionally whistles through. Battery lasts about 28 hours." },
  { id: 2, product: 'Ultra Glow Skin Serum', category: 'Beauty', text: "AMAZING PRODUCT!! BEST SERUM EVER CREATED IN HUMAN HISTORY! It erased all wrinkles in 2 hours! Miraculous! Buy buy buy five stars 1000% recommend!" },
  { id: 3, product: 'Ninja 4-in-1 Air Fryer', category: 'Home & Kitchen', text: "Solid kitchen appliance. The basket is easy to wipe clean and fits enough fries for two people. It does get fairly loud when operating at 400 degrees, but cooks evenly." },
  { id: 4, product: 'ProSpeed Running Shoes', category: 'Footwear', text: "TOTAL SCAM DO NOT BUY!! CHEAP PLASTIC TRASH DESTROYED MY FEET IN 5 MINUTES! WORST COMPANY EVER REPORT TO POLICE FRAUD!!" },
  { id: 5, product: 'Keychron K2 Mechanical Keyboard', category: 'Electronics', text: "Gateron Brown switches have a nice subtle bump. Bluetooth switching between Mac and PC works without lag. The front edge is slightly tall, so a wrist rest is recommended." },
  { id: 6, product: 'Smart Sleep Tracker Watch', category: 'Health', text: "Very good product. Nice quality. Fast shipping. Good seller. Five stars. Highly recommend to everyone." },
  { id: 7, product: 'HydroFlow 32oz Insulated Flask', category: 'Sports', text: "Keeps ice water cold through an entire hot summer gym session. The lid seal is completely watertight. Exterior coating hasn't scratched despite multiple drops." },
  { id: 8, product: 'Turbo Charge 65W GaN Charger', category: 'Electronics', text: "INCREDIBLE! Charged my dead laptop to 100% in 3 seconds flat! Life changing magic technology! Best purchase of my entire existence! A++++++" },
  { id: 9, product: 'Cast Iron 12-inch Skillet', category: 'Home & Kitchen', text: "Heavy pan that retains heat exceptionally well for searing steaks. Pre-seasoning was decent, though adding a layer of canola oil improved non-stick performance." },
  { id: 10, product: 'Pure Collagen Peptides', category: 'Beauty', text: "I received this product for free. Best product on Earth! Cured all joint pain and hair loss overnight! Zero flaws perfection buy now!" },
  { id: 11, product: 'Logitech MX Master 3S Mouse', category: 'Electronics', text: "The electromagnetic scroll wheel is whisper-quiet and very fast. Ergonomics fit my medium-sized palm comfortably. The thumb gesture button requires a firm press." },
  { id: 12, product: 'Breathable Cotton T-Shirt 3-Pack', category: 'Clothing', text: "Fabric is 100% combed cotton and feels soft against skin. Shrank about half an inch in length after warm machine wash, so consider sizing up." },
  { id: 13, product: 'Quantum LED 4K 27 Monitor', category: 'Electronics', text: "SUPER DUPER GREATEST MONITOR IN HUMAN HISTORY! Zero ghosting, god tier colors, cured my eyesight! 100 stars buy immediately!" },
  { id: 14, product: 'Cold Brew Coffee Maker 1L', category: 'Home & Kitchen', text: "Fine mesh stainless filter prevents grounds from slipping into the brew. Fits nicely in refrigerator door shelf. Glass carafe feels slightly thin, handle with care." },
  { id: 15, product: 'FastSlim Keto Detox Tea', category: 'Health', text: "WORST FRAUDULENT PRODUCT EVER! POISON TRASH! BROKE MY STOMACH SCAM ARTISTS NEVER BUY REPORT TO AUTHORITIES!" },
  { id: 16, product: 'Anker 20000mAh Power Bank', category: 'Electronics', text: "Heavier than smaller battery packs, but provides 4 full charges for my iPhone 15. The digital percentage screen is clear. Takes about 5 hours to recharge from empty." },
  { id: 17, product: 'Bamboo Memory Foam Pillow', category: 'Bedding', text: "Contour supports neck curvature well. Initial chemical scent dissipated after 24 hours of airing out by an open window. Keeps relatively cool overnight." },
  { id: 18, product: 'Wireless Gaming Earbuds', category: 'Electronics', text: "Great product works good fast delivery. Very nice 5 stars." },
  { id: 19, product: 'Professional Chef Knife 8-inch', category: 'Kitchen', text: "Balanced weight in hand with sharp factory bevel. Chopped onions and squash cleanly. Hand wash and dry immediately to preserve blade finish." },
  { id: 20, product: 'Super Miracle Car Scratch Remover', category: 'Automotive', text: "THIS IS A TRUE MIRACLE! One wipe and a huge dent disappeared like magic! Best seller ever 1000% satisfaction guaranteed!" }
];

// Document Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initDashboard();
  initDetector();
  initBulkAnalysis();
  initModelComparison();
  handleUrlRouting();
});

/* ==========================================================================
   NAVIGATION & ROUTING
   ========================================================================== */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link-custom');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetScreen = link.getAttribute('data-screen');
      navigateTo(targetScreen);
    });
  });

  // Mobile sidebar toggle
  const toggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebar = document.querySelector('.app-sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('show');
    });

    // Close when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 992 && !sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
        sidebar.classList.remove('show');
      }
    });
  }

  // Quick Action Buttons
  document.querySelectorAll('[data-goto]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(btn.getAttribute('data-goto'));
    });
  });
}

function navigateTo(screenId) {
  if (!screenId) return;

  // Update nav links active state
  document.querySelectorAll('.nav-link-custom').forEach(link => {
    if (link.getAttribute('data-screen') === screenId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Switch visible screen
  document.querySelectorAll('.page-screen').forEach(screen => {
    screen.classList.remove('active');
  });

  const targetScreenElem = document.getElementById(`${screenId}-screen`);
  if (targetScreenElem) {
    targetScreenElem.classList.add('active');
    ReviewGuard.currentScreen = screenId;
    window.location.hash = screenId;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update Header Breadcrumb Title
    updateHeaderTitle(screenId);

    // Trigger chart resize if needed
    if (screenId === 'dashboard' && ReviewGuard.charts.authenticityDonut) {
      ReviewGuard.charts.authenticityDonut.resize();
      ReviewGuard.charts.categoryBar.resize();
    } else if (screenId === 'models' && ReviewGuard.charts.modelCompareBar) {
      ReviewGuard.charts.modelCompareBar.resize();
    }

    // Close mobile sidebar if open
    const sidebar = document.querySelector('.app-sidebar');
    if (sidebar && window.innerWidth <= 992) {
      sidebar.classList.remove('show');
    }
  }
}

function updateHeaderTitle(screenId) {
  const titleMap = {
    'dashboard': { title: 'Analytics Dashboard', subtitle: 'Overview of product review authenticity and detection signals' },
    'detect': { title: 'Single Review Detective', subtitle: 'Analyze individual customer reviews with simulated NLP explainability' },
    'bulk': { title: 'Bulk CSV Review Analysis', subtitle: 'Upload and process batch review datasets with downloadable reports' },
    'models': { title: 'Model Comparison & Metrics', subtitle: 'Comparative evaluation of Logistic Regression vs Naive Bayes' },
    'about': { title: 'Project Overview & Viva Guide', subtitle: 'System architecture, NLP pipeline, and academic presentation details' }
  };

  const meta = titleMap[screenId] || titleMap['dashboard'];
  const titleElem = document.getElementById('headerPageTitle');
  const subElem = document.getElementById('headerPageSubtitle');
  if (titleElem) titleElem.textContent = meta.title;
  if (subElem) subElem.textContent = meta.subtitle;
}

function handleUrlRouting() {
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(`${hash}-screen`)) {
    navigateTo(hash);
  } else {
    navigateTo('dashboard');
  }
}

/* ==========================================================================
   SIMULATED NLP & HEURISTIC ENGINE (Vanilla JS)
   Evaluates lexical signals, TF-IDF proxy weights, and heuristic indicators
   ========================================================================== */
function analyzeReviewText(text, productName = '', rating = 5) {
  if (!text || text.trim().length === 0) {
    return null;
  }

  const cleanText = text.trim();
  const lowerText = cleanText.toLowerCase();
  const words = cleanText.match(/\b[A-Za-z0-9'-]+\b/g) || [];
  const wordCount = words.length;
  const charCount = cleanText.length;

  // 1. Check ALL-CAPS screaming ratio
  const uppercaseLetters = (cleanText.match(/[A-Z]/g) || []).length;
  const totalLetters = (cleanText.match(/[A-Za-z]/g) || []).length;
  const capsRatio = totalLetters > 0 ? (uppercaseLetters / totalLetters) : 0;

  // 2. Check Exclamation and Question density
  const exclamations = (cleanText.match(/!/g) || []).length;
  const questions = (cleanText.match(/\?/g) || []).length;

  // 3. Astroturfing & Bot-like Superlatives (Strong Suspicious Indicators)
  const suspiciousTriggers = [
    { phrase: 'best ever', weight: 2.2 },
    { phrase: 'miracle', weight: 2.5 },
    { phrase: 'greatest ever', weight: 2.3 },
    { phrase: '1000%', weight: 2.6 },
    { phrase: '10/10', weight: 1.5 },
    { phrase: '100 stars', weight: 2.4 },
    { phrase: 'buy buy buy', weight: 2.8 },
    { phrase: 'must buy', weight: 1.8 },
    { phrase: 'do not hesitate', weight: 2.1 },
    { phrase: 'life changing', weight: 2.0 },
    { phrase: 'cured', weight: 2.2 },
    { phrase: 'flawless', weight: 1.7 },
    { phrase: 'perfection', weight: 1.8 },
    { phrase: 'scam', weight: 2.5 },
    { phrase: 'fraud', weight: 2.5 },
    { phrase: 'trash', weight: 2.2 },
    { phrase: 'garbage', weight: 2.3 },
    { phrase: 'destroyed my', weight: 2.2 },
    { phrase: 'report to police', weight: 2.6 },
    { phrase: 'report to authorities', weight: 2.6 },
    { phrase: 'stole my money', weight: 2.5 },
    { phrase: 'free product', weight: 2.2 },
    { phrase: 'for free in exchange', weight: 2.8 },
    { phrase: 'honest review', weight: 1.6 },
    { phrase: 'five stars', weight: 1.2 },
    { phrase: 'works good', weight: 1.4 },
    { phrase: 'good seller', weight: 1.3 },
    { phrase: 'fast shipping', weight: 1.1 },
    { phrase: 'nice quality', weight: 1.1 },
    { phrase: 'a++++++', weight: 2.8 }
  ];

  // 4. Genuine Nuance & Contextual Words (Strong Genuine Indicators)
  const genuineTriggers = [
    { phrase: 'however', weight: 2.2 },
    { phrase: 'although', weight: 2.1 },
    { phrase: 'though', weight: 1.6 },
    { phrase: 'downside', weight: 2.0 },
    { phrase: 'compromise', weight: 2.0 },
    { phrase: 'battery', weight: 1.5 },
    { phrase: 'battery life', weight: 2.2 },
    { phrase: 'hours', weight: 1.4 },
    { phrase: 'weeks', weight: 1.6 },
    { phrase: 'months', weight: 1.7 },
    { phrase: 'daily use', weight: 1.8 },
    { phrase: 'shrank', weight: 2.2 },
    { phrase: 'cable', weight: 1.5 },
    { phrase: 'comfortable', weight: 1.4 },
    { phrase: 'sound quality', weight: 1.6 },
    { phrase: 'packaging', weight: 1.4 },
    { phrase: 'setup', weight: 1.5 },
    { phrase: 'wrist rest', weight: 2.0 },
    { phrase: 'ear cups', weight: 1.8 },
    { phrase: 'slightly', weight: 1.7 },
    { phrase: 'not 100%', weight: 2.1 },
    { phrase: 'for the price', weight: 1.6 },
    { phrase: 'minor', weight: 1.6 },
    { phrase: 'overall', weight: 1.3 },
    { phrase: 'arrived', weight: 1.1 }
  ];

  let suspiciousScore = 0;
  let genuineScore = 0;
  let matchedSuspicious = [];
  let matchedGenuine = [];

  // Evaluate suspicious matches
  suspiciousTriggers.forEach(item => {
    if (lowerText.includes(item.phrase)) {
      suspiciousScore += item.weight;
      matchedSuspicious.push(item.phrase);
    }
  });

  // Evaluate genuine matches
  genuineTriggers.forEach(item => {
    if (lowerText.includes(item.phrase)) {
      genuineScore += item.weight;
      matchedGenuine.push(item.phrase);
    }
  });

  // Structural heuristics
  if (capsRatio > 0.35 && totalLetters > 20) {
    suspiciousScore += 3.2;
    matchedSuspicious.push('EXCESSIVE_CAPS');
  }

  if (exclamations >= 4) {
    suspiciousScore += 2.4;
    matchedSuspicious.push('EXCESSIVE_EXCLAMATIONS');
  }

  if (wordCount < 12 && (lowerText.includes('good') || lowerText.includes('nice') || lowerText.includes('stars'))) {
    suspiciousScore += 2.0;
    matchedSuspicious.push('GENERIC_SHORT_FLUFF');
  }

  if (wordCount >= 25 && matchedGenuine.length >= 1) {
    genuineScore += 1.8;
  }

  // Base balance calculation
  const totalScore = suspiciousScore + genuineScore;
  let isSuspicious = false;
  let confidence = 85.0;

  if (totalScore === 0) {
    // Default neutral heuristic based on length and punctuation
    if (capsRatio > 0.2 || exclamations > 2) {
      isSuspicious = true;
      confidence = 74.5;
    } else {
      isSuspicious = false;
      confidence = 78.2;
    }
  } else {
    if (suspiciousScore > genuineScore) {
      isSuspicious = true;
      const ratio = suspiciousScore / totalScore;
      confidence = Math.min(98.8, Math.max(72.0, 70 + (ratio * 28)));
    } else {
      isSuspicious = false;
      const ratio = genuineScore / totalScore;
      confidence = Math.min(97.5, Math.max(75.0, 72 + (ratio * 25)));
    }
  }

  // Determine Primary Risk Level
  let riskLevel = 'Low';
  if (isSuspicious) {
    riskLevel = confidence > 88 ? 'High Suspicion' : 'Moderate Caution';
  } else {
    riskLevel = confidence > 85 ? 'High Authenticity' : 'Standard Verified';
  }

  // Feature tokens with simulated TF-IDF influence weights
  const topFeatures = [];
  matchedSuspicious.slice(0, 5).forEach(token => {
    topFeatures.push({
      token: token.replace(/_/g, ' ').toLowerCase(),
      impact: 'suspicious',
      weight: (Math.random() * 0.4 + 0.45).toFixed(2)
    });
  });

  matchedGenuine.slice(0, 5).forEach(token => {
    topFeatures.push({
      token: token.toLowerCase(),
      impact: 'genuine',
      weight: (Math.random() * 0.35 + 0.40).toFixed(2)
    });
  });

  // Fallback tokens if none matched
  if (topFeatures.length === 0) {
    if (isSuspicious) {
      topFeatures.push({ token: 'repetitive tone', impact: 'suspicious', weight: '0.52' });
      topFeatures.push({ token: 'low lexical variety', impact: 'suspicious', weight: '0.44' });
    } else {
      topFeatures.push({ token: 'balanced phrasing', impact: 'genuine', weight: '0.48' });
      topFeatures.push({ token: 'natural syntax', impact: 'genuine', weight: '0.42' });
    }
  }

  // Detailed Signal breakdown
  const signals = {
    wordCount,
    charCount,
    capsPercent: Math.round(capsRatio * 100),
    exclamationCount: exclamations,
    sentimentTone: isSuspicious
      ? (lowerText.includes('scam') || lowerText.includes('trash') ? 'Extremely Hostile / Smear' : 'Overhyped Superlatives')
      : 'Balanced & Contextual',
    lexicalVariety: wordCount > 25 ? 'Rich Product Context' : 'Brief / Generic',
    botPatternRisk: isSuspicious ? (matchedSuspicious.length >= 2 ? 'High Probability Pattern' : 'Flagged Anomaly') : 'Normal Human Syntax'
  };

  return {
    prediction: isSuspicious ? 'Potentially Suspicious' : 'Genuine Review',
    isSuspicious,
    confidence: confidence.toFixed(1),
    riskLevel,
    signals,
    matchedSuspicious,
    matchedGenuine,
    topFeatures,
    explanation: isSuspicious
      ? `Flagged due to ${matchedSuspicious.slice(0, 3).join(', ')} patterns, high polarity phrasing, and lack of balanced experiential feedback.`
      : `Classified as genuine based on realistic product usage details, balanced contextual tone, and normal linguistic structure.`
  };
}

/* ==========================================================================
   DASHBOARD INITIALIZATION & CHARTS
   ========================================================================== */
function initDashboard() {
  // Render Authenticity Donut Chart
  const donutCtx = document.getElementById('authenticityDonutChart');
  if (donutCtx) {
    ReviewGuard.charts.authenticityDonut = new Chart(donutCtx, {
      type: 'doughnut',
      data: {
        labels: ['Genuine Reviews', 'Suspicious Reviews'],
        datasets: [{
          data: [984, 498],
          backgroundColor: ['#10b981', '#ef4444'],
          borderColor: ['#ffffff', '#ffffff'],
          borderWidth: 3,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 14,
              padding: 16,
              font: { family: 'Plus Jakarta Sans', weight: '600', size: 12 }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const total = 984 + 498;
                const value = context.parsed;
                const pct = ((value / total) * 100).toFixed(1);
                return ` ${context.label}: ${value.toLocaleString()} (${pct}%)`;
              }
            }
          }
        },
        cutout: '72%'
      }
    });
  }

  // Render Category Breakdown Bar Chart
  const barCtx = document.getElementById('categoryBarChart');
  if (barCtx) {
    ReviewGuard.charts.categoryBar = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['Electronics', 'Home & Kitchen', 'Beauty & Health', 'Fashion', 'Sports'],
        datasets: [
          {
            label: 'Genuine',
            data: [320, 240, 185, 142, 97],
            backgroundColor: '#10b981',
            borderRadius: 6
          },
          {
            label: 'Suspicious',
            data: [165, 95, 128, 64, 46],
            backgroundColor: '#ef4444',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' } }
          },
          y: {
            grid: { color: '#f1f5f9' },
            ticks: { font: { family: 'Plus Jakarta Sans', size: 11 } }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 14,
              padding: 16,
              font: { family: 'Plus Jakarta Sans', weight: '600', size: 12 }
            }
          }
        }
      }
    });
  }

  // Populate Recent Activities Feed
  populateRecentActivitiesTable();
}

function populateRecentActivitiesTable() {
  const tbody = document.getElementById('recentReviewsTableBody');
  if (!tbody) return;

  const sampleRecent = PRELOADED_BULK_DATA.slice(0, 6);
  tbody.innerHTML = '';

  sampleRecent.forEach(item => {
    const analysis = analyzeReviewText(item.text, item.product);
    const row = document.createElement('tr');
    
    const badgeHtml = analysis.isSuspicious
      ? `<span class="status-pill suspicious"><i class="fa-solid fa-triangle-exclamation"></i> Suspicious</span>`
      : `<span class="status-pill genuine"><i class="fa-solid fa-circle-check"></i> Genuine</span>`;

    row.innerHTML = `
      <td>
        <div class="fw-bold">${escapeHtml(item.product)}</div>
        <div class="text-muted small">${escapeHtml(item.category)}</div>
      </td>
      <td>
        <span class="text-truncate d-inline-block" style="max-width: 380px;" title="${escapeHtml(item.text)}">
          ${escapeHtml(item.text.length > 80 ? item.text.substring(0, 80) + '...' : item.text)}
        </span>
      </td>
      <td>${badgeHtml}</td>
      <td>
        <div class="d-flex align-items-center gap-2">
          <div class="progress flex-grow-1" style="height: 6px; width: 60px;">
            <div class="progress-bar ${analysis.isSuspicious ? 'bg-danger' : 'bg-success'}" style="width: ${analysis.confidence}%;"></div>
          </div>
          <span class="small fw-bold">${analysis.confidence}%</span>
        </div>
      </td>
      <td>
        <button class="btn btn-sm btn-outline-primary py-1 px-2" onclick="inspectSingleReviewFromRecent('${escapeJs(item.product)}', '${escapeJs(item.text)}')">
          <i class="fa-solid fa-eye me-1"></i> Inspect
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function inspectSingleReviewFromRecent(product, text) {
  navigateTo('detect');
  const prodInput = document.getElementById('detectProductName');
  const textInput = document.getElementById('detectReviewText');
  if (prodInput) prodInput.value = product;
  if (textInput) textInput.value = text;
  updateCharCounter();
  executeReviewAnalysis();
}

/* ==========================================================================
   SINGLE REVIEW DETECT SCREEN
   ========================================================================== */
function initDetector() {
  const textInput = document.getElementById('detectReviewText');
  const analyzeBtn = document.getElementById('analyzeReviewBtn');
  const clearBtn = document.getElementById('clearReviewBtn');

  if (textInput) {
    textInput.addEventListener('input', updateCharCounter);
  }

  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', () => {
      executeReviewAnalysis();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      resetDetectorForm();
    });
  }

  // Preset Sample Pills
  const sampleContainer = document.getElementById('samplePillContainer');
  if (sampleContainer) {
    sampleContainer.innerHTML = '';
    DEMO_SAMPLES.forEach(sample => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = `sample-pill ${sample.type === 'genuine' ? 'sample-genuine' : 'sample-suspicious'}`;
      pill.innerHTML = `
        <i class="fa-solid ${sample.type === 'genuine' ? 'fa-circle-check text-success' : 'fa-triangle-exclamation text-danger'}"></i>
        <span>${sample.label}</span>
      `;
      pill.addEventListener('click', () => {
        document.getElementById('detectProductName').value = sample.product;
        document.getElementById('detectReviewText').value = sample.text;
        const ratingSelect = document.getElementById('detectStarRating');
        if (ratingSelect) ratingSelect.value = sample.rating;
        updateCharCounter();
        executeReviewAnalysis();
        showToast('Sample Loaded', `Loaded preset: "${sample.label}"`, 'info');
      });
      sampleContainer.appendChild(pill);
    });
  }
}

function updateCharCounter() {
  const text = document.getElementById('detectReviewText').value;
  const count = text.length;
  const words = (text.trim().match(/\b[A-Za-z0-9'-]+\b/g) || []).length;
  const counterElem = document.getElementById('charCountDisplay');
  if (counterElem) {
    counterElem.textContent = `${count} characters · ${words} words`;
  }
}

function resetDetectorForm() {
  document.getElementById('detectProductName').value = '';
  document.getElementById('detectReviewText').value = '';
  document.getElementById('detectStarRating').value = '5';
  updateCharCounter();

  // Reset Result view to placeholder
  document.getElementById('detectionPlaceholderState').style.display = 'block';
  document.getElementById('detectionLoadingState').style.display = 'none';
  document.getElementById('detectionResultState').style.display = 'none';
}

function executeReviewAnalysis() {
  const text = document.getElementById('detectReviewText').value.trim();
  const product = document.getElementById('detectProductName').value.trim();
  const rating = parseInt(document.getElementById('detectStarRating').value || '5', 10);

  if (!text) {
    showToast('Input Required', 'Please enter or select a review to analyze.', 'warning');
    document.getElementById('detectReviewText').focus();
    return;
  }

  // Show Loading Animation
  const placeholder = document.getElementById('detectionPlaceholderState');
  const loader = document.getElementById('detectionLoadingState');
  const result = document.getElementById('detectionResultState');
  const analyzeBtn = document.getElementById('analyzeReviewBtn');

  if (placeholder) placeholder.style.display = 'none';
  if (result) result.style.display = 'none';
  if (loader) loader.style.display = 'block';
  if (analyzeBtn) {
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<span class="spinner-ai me-2"></span> Analyzing NLP Tokens...';
  }

  // Simulate AI Processing Delay (650ms for realistic presentation feel)
  setTimeout(() => {
    const analysis = analyzeReviewText(text, product, rating);
    renderDetectionResult(analysis, text);

    if (loader) loader.style.display = 'none';
    if (result) result.style.display = 'block';
    if (analyzeBtn) {
      analyzeBtn.disabled = false;
      analyzeBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles me-2"></i> Analyze Review';
    }

    showToast('Analysis Complete', `Review classified as ${analysis.prediction}`, analysis.isSuspicious ? 'warning' : 'success');
  }, 650);
}

function renderDetectionResult(analysis, originalText) {
  const banner = document.getElementById('predResultBanner');
  const icon = document.getElementById('predResultIcon');
  const title = document.getElementById('predResultTitle');
  const subtitle = document.getElementById('predResultSubtitle');
  const scoreNum = document.getElementById('predScoreNum');
  const scoreBar = document.getElementById('predProgressBarFill');

  if (analysis.isSuspicious) {
    banner.className = 'prediction-badge-banner suspicious';
    icon.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
    title.textContent = 'Potentially Suspicious Review';
    subtitle.textContent = `High probability of promotional bias, bot astroturfing, or non-authentic pattern (${analysis.riskLevel})`;
    scoreBar.className = 'progress-bar-fill suspicious-fill';
  } else {
    banner.className = 'prediction-badge-banner genuine';
    icon.innerHTML = '<i class="fa-solid fa-shield-check"></i>';
    title.textContent = 'Genuine Customer Review';
    subtitle.textContent = `High probability of organic consumer purchase and authentic linguistic balance (${analysis.riskLevel})`;
    scoreBar.className = 'progress-bar-fill genuine-fill';
  }

  scoreNum.textContent = `${analysis.confidence}%`;
  scoreBar.style.width = `${analysis.confidence}%`;

  // Signals Values
  document.getElementById('sigSentiment').textContent = analysis.signals.sentimentTone;
  document.getElementById('sigLexical').textContent = analysis.signals.lexicalVariety;
  document.getElementById('sigCaps').textContent = `${analysis.signals.capsPercent}% Caps (${analysis.signals.exclamationCount} Exclamations)`;
  document.getElementById('sigBotRisk').textContent = analysis.signals.botPatternRisk;

  // Feature Importance Tags
  const tagContainer = document.getElementById('featureTagsContainer');
  if (tagContainer) {
    tagContainer.innerHTML = '';
    analysis.topFeatures.forEach(feat => {
      const tag = document.createElement('span');
      tag.className = `feature-tag ${feat.impact === 'suspicious' ? 'tag-suspicious' : 'tag-genuine'}`;
      tag.innerHTML = `
        <i class="fa-solid ${feat.impact === 'suspicious' ? 'fa-arrow-up' : 'fa-arrow-down'} small"></i>
        <span>"${escapeHtml(feat.token)}"</span>
        <span class="opacity-75">(${feat.weight})</span>
      `;
      tagContainer.appendChild(tag);
    });
  }

  // Summary Explanation text
  const explanationElem = document.getElementById('summaryExplanationText');
  if (explanationElem) {
    explanationElem.textContent = analysis.explanation;
  }
}

/* ==========================================================================
   BULK CSV REVIEW ANALYSIS
   ========================================================================== */
function initBulkAnalysis() {
  const loadDemoBtn = document.getElementById('loadPreloadedBulkBtn');
  const downloadSampleBtn = document.getElementById('downloadSampleCsvBtn');
  const exportAnalyzedBtn = document.getElementById('exportAnalyzedCsvBtn');
  const fileInput = document.getElementById('bulkCsvFileInput');
  const dropzone = document.getElementById('bulkUploadDropzone');
  const filterSelect = document.getElementById('bulkFilterSelect');
  const searchInput = document.getElementById('bulkSearchInput');

  // Load Demonstration Samples button
  if (loadDemoBtn) {
    loadDemoBtn.addEventListener('click', () => {
      processBulkRecords(PRELOADED_BULK_DATA, 'Demonstration Sample Dataset (20 Reviews)');
    });
  }

  // Download Empty/Sample Template CSV
  if (downloadSampleBtn) {
    downloadSampleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      downloadDemonstrationCsv();
    });
  }

  // Export Analyzed Results CSV
  if (exportAnalyzedBtn) {
    exportAnalyzedBtn.addEventListener('click', () => {
      exportAnalyzedResultsCsv();
    });
  }

  // File Input Change
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) handleUploadedFile(file);
    });
  }

  // Dropzone Events
  if (dropzone) {
    dropzone.addEventListener('click', () => {
      if (fileInput) fileInput.click();
    });

    ['dragenter', 'dragover'].forEach(event => {
      dropzone.addEventListener(event, (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(event => {
      dropzone.addEventListener(event, (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const file = e.dataTransfer.files[0];
      if (file) handleUploadedFile(file);
    });
  }

  // Filtering & Search
  if (filterSelect) {
    filterSelect.addEventListener('change', filterBulkResultsTable);
  }
  if (searchInput) {
    searchInput.addEventListener('input', filterBulkResultsTable);
  }
}

function handleUploadedFile(file) {
  if (!file.name.endsWith('.csv')) {
    showToast('Invalid File Type', 'Please upload a valid .csv file.', 'danger');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target.result;
      const records = parseCsv(content);
      if (records.length === 0) {
        showToast('Empty File', 'No valid rows found in the uploaded CSV.', 'warning');
        return;
      }
      processBulkRecords(records, file.name);
    } catch (err) {
      console.error(err);
      showToast('Parse Error', 'Could not parse the CSV file. Please check format.', 'danger');
    }
  };
  reader.readAsText(file);
}

function parseCsv(csvText) {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  // Parse header
  const headers = parseCsvLine(lines[0]).map(h => h.trim().toLowerCase());
  const reviewIdx = headers.findIndex(h => h.includes('review') || h.includes('text') || h.includes('comment'));
  const productIdx = headers.findIndex(h => h.includes('product') || h.includes('item') || h.includes('title'));
  const categoryIdx = headers.findIndex(h => h.includes('category') || h.includes('genre'));

  const parsedRecords = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.length === 0) continue;

    const reviewText = reviewIdx !== -1 && cols[reviewIdx] ? cols[reviewIdx] : (cols[1] || cols[0]);
    const productName = productIdx !== -1 && cols[productIdx] ? cols[productIdx] : `Product Item #${i}`;
    const category = categoryIdx !== -1 && cols[categoryIdx] ? cols[categoryIdx] : 'General';

    if (reviewText && reviewText.trim()) {
      parsedRecords.push({
        id: i,
        product: productName.trim(),
        category: category.trim(),
        text: reviewText.trim()
      });
    }
  }
  return parsedRecords;
}

function parseCsvLine(line) {
  const values = [];
  let inQuotes = false;
  let currentValue = '';

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        currentValue += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(currentValue);
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  values.push(currentValue);
  return values;
}

function processBulkRecords(records, filename = 'Uploaded CSV') {
  ReviewGuard.bulkResults = [];
  let genuineCount = 0;
  let suspiciousCount = 0;
  let totalConfidence = 0;

  records.forEach((item, idx) => {
    const analysis = analyzeReviewText(item.text, item.product);
    if (analysis.isSuspicious) suspiciousCount++;
    else genuineCount++;
    totalConfidence += parseFloat(analysis.confidence);

    ReviewGuard.bulkResults.push({
      id: idx + 1,
      product: item.product || `Item #${idx + 1}`,
      category: item.category || 'General',
      text: item.text,
      prediction: analysis.prediction,
      isSuspicious: analysis.isSuspicious,
      confidence: analysis.confidence,
      riskLevel: analysis.riskLevel,
      flags: analysis.matchedSuspicious.length > 0 ? analysis.matchedSuspicious.slice(0, 2).join(', ') : 'Standard Syntax',
      analysis
    });
  });

  // Reveal Bulk Results Container
  const resultsContainer = document.getElementById('bulkResultsSection');
  if (resultsContainer) {
    resultsContainer.style.display = 'block';
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
  }

  // Update Summary Metrics
  const total = ReviewGuard.bulkResults.length;
  const avgConf = (totalConfidence / total).toFixed(1);
  const flaggedPct = ((suspiciousCount / total) * 100).toFixed(1);

  document.getElementById('bulkTotalCount').textContent = total;
  document.getElementById('bulkGenuineCount').textContent = `${genuineCount} (${((genuineCount / total) * 100).toFixed(0)}%)`;
  document.getElementById('bulkSuspiciousCount').textContent = `${suspiciousCount} (${flaggedPct}%)`;
  document.getElementById('bulkAvgConfidence').textContent = `${avgConf}%`;
  document.getElementById('bulkLoadedFileName').textContent = filename;

  // Render / Update Bulk Mini Donut Chart
  renderBulkDonutChart(genuineCount, suspiciousCount);

  // Populate Table
  filterBulkResultsTable();

  showToast('Batch Processed', `Analyzed ${total} reviews successfully from "${filename}".`, 'success');
}

function renderBulkDonutChart(genuine, suspicious) {
  const chartCanvas = document.getElementById('bulkDonutChart');
  if (!chartCanvas) return;

  if (ReviewGuard.charts.bulkDonut) {
    ReviewGuard.charts.bulkDonut.destroy();
  }

  ReviewGuard.charts.bulkDonut = new Chart(chartCanvas, {
    type: 'doughnut',
    data: {
      labels: ['Genuine', 'Suspicious'],
      datasets: [{
        data: [genuine, suspicious],
        backgroundColor: ['#10b981', '#ef4444'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 11 } } }
      },
      cutout: '70%'
    }
  });
}

function filterBulkResultsTable() {
  const tbody = document.getElementById('bulkTableBody');
  const filterVal = document.getElementById('bulkFilterSelect').value;
  const searchVal = (document.getElementById('bulkSearchInput').value || '').toLowerCase().trim();

  if (!tbody) return;
  tbody.innerHTML = '';

  const filtered = ReviewGuard.bulkResults.filter(item => {
    // Status filter
    if (filterVal === 'genuine' && item.isSuspicious) return false;
    if (filterVal === 'suspicious' && !item.isSuspicious) return false;

    // Search filter
    if (searchVal) {
      const matchProd = item.product.toLowerCase().includes(searchVal);
      const matchText = item.text.toLowerCase().includes(searchVal);
      const matchCat = item.category.toLowerCase().includes(searchVal);
      return matchProd || matchText || matchCat;
    }
    return true;
  });

  document.getElementById('bulkFilteredCountLabel').textContent = `Showing ${filtered.length} of ${ReviewGuard.bulkResults.length} records`;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted"><i class="fa-solid fa-filter me-2"></i> No reviews match your filter criteria.</td></tr>`;
    return;
  }

  filtered.forEach(item => {
    const tr = document.createElement('tr');
    const badge = item.isSuspicious
      ? `<span class="status-pill suspicious"><i class="fa-solid fa-triangle-exclamation"></i> Suspicious</span>`
      : `<span class="status-pill genuine"><i class="fa-solid fa-circle-check"></i> Genuine</span>`;

    tr.innerHTML = `
      <td><span class="text-muted fw-bold">#${item.id}</span></td>
      <td>
        <div class="fw-bold text-dark">${escapeHtml(item.product)}</div>
        <div class="small text-muted">${escapeHtml(item.category)}</div>
      </td>
      <td>
        <span class="text-truncate d-inline-block" style="max-width: 320px;" title="${escapeHtml(item.text)}">
          ${escapeHtml(item.text)}
        </span>
      </td>
      <td>${badge}</td>
      <td>
        <span class="fw-bold ${item.isSuspicious ? 'text-danger' : 'text-success'}">${item.confidence}%</span>
      </td>
      <td><span class="badge bg-light text-dark border">${escapeHtml(item.flags)}</span></td>
      <td>
        <button class="btn btn-sm btn-outline-primary py-1 px-2" onclick="openBulkDetailModal(${item.id})">
          <i class="fa-solid fa-circle-info"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openBulkDetailModal(itemId) {
  const item = ReviewGuard.bulkResults.find(r => r.id === itemId);
  if (!item) return;

  document.getElementById('modalDetailProduct').textContent = item.product;
  document.getElementById('modalDetailCategory').textContent = item.category;
  document.getElementById('modalDetailReviewText').textContent = item.text;
  
  const statusElem = document.getElementById('modalDetailStatus');
  if (item.isSuspicious) {
    statusElem.className = 'status-pill suspicious';
    statusElem.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Potentially Suspicious (${item.confidence}%)`;
  } else {
    statusElem.className = 'status-pill genuine';
    statusElem.innerHTML = `<i class="fa-solid fa-circle-check"></i> Genuine Review (${item.confidence}%)`;
  }

  document.getElementById('modalDetailExplanation').textContent = item.analysis.explanation;
  
  // Highlighted tags
  const tagsContainer = document.getElementById('modalDetailTags');
  tagsContainer.innerHTML = '';
  item.analysis.topFeatures.forEach(feat => {
    const tag = document.createElement('span');
    tag.className = `feature-tag ${feat.impact === 'suspicious' ? 'tag-suspicious' : 'tag-genuine'}`;
    tag.textContent = `${feat.token} (${feat.weight})`;
    tagsContainer.appendChild(tag);
  });

  const modal = new bootstrap.Modal(document.getElementById('bulkDetailModal'));
  modal.show();
}

function downloadDemonstrationCsv() {
  const csvContent = "data:text/csv;charset=utf-8," + 
    "id,product_name,category,review_text\n" +
    PRELOADED_BULK_DATA.map(e => `${e.id},"${e.product.replace(/"/g, '""')}","${e.category}","${e.text.replace(/"/g, '""')}"`).join("\n");
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "sample_product_reviews.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Download Started', 'Downloaded sample_product_reviews.csv for testing.', 'info');
}

function exportAnalyzedResultsCsv() {
  if (ReviewGuard.bulkResults.length === 0) {
    showToast('No Data', 'Please analyze a batch first before exporting.', 'warning');
    return;
  }

  let csv = "ID,Product Name,Category,Review Text,Prediction,Confidence,Risk Level,Detection Flags\n";
  ReviewGuard.bulkResults.forEach(r => {
    const cleanText = r.text.replace(/"/g, '""');
    const cleanProd = r.product.replace(/"/g, '""');
    csv += `${r.id},"${cleanProd}","${r.category}","${cleanText}","${r.prediction}","${r.confidence}%","${r.riskLevel}","${r.flags}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `reviewguard_analyzed_results_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('Export Complete', 'Exported analyzed results CSV successfully.', 'success');
}

/* ==========================================================================
   MODEL COMPARISON & METRICS
   Logistic Regression (Primary) vs Multinomial Naive Bayes (Baseline)
   ========================================================================== */
function initModelComparison() {
  const compareCtx = document.getElementById('modelComparisonChart');
  if (compareCtx) {
    ReviewGuard.charts.modelCompareBar = new Chart(compareCtx, {
      type: 'bar',
      data: {
        labels: ['Accuracy (%)', 'Precision (%)', 'Recall (%)', 'F1-Score (%)'],
        datasets: [
          {
            label: 'Logistic Regression (TF-IDF)',
            data: [
              ReviewGuard.modelMetrics.lr.accuracy,
              ReviewGuard.modelMetrics.lr.precision,
              ReviewGuard.modelMetrics.lr.recall,
              ReviewGuard.modelMetrics.lr.f1
            ],
            backgroundColor: '#4f46e5',
            borderRadius: 6
          },
          {
            label: 'Multinomial Naive Bayes (TF-IDF)',
            data: [
              ReviewGuard.modelMetrics.nb.accuracy,
              ReviewGuard.modelMetrics.nb.precision,
              ReviewGuard.modelMetrics.nb.recall,
              ReviewGuard.modelMetrics.nb.f1
            ],
            backgroundColor: '#94a3b8',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 80,
            max: 100,
            ticks: {
              callback: function(val) { return val + '%'; },
              font: { family: 'Plus Jakarta Sans', size: 11 }
            },
            grid: { color: '#f1f5f9' }
          },
          x: {
            grid: { display: false },
            ticks: { font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' } }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 14,
              padding: 16,
              font: { family: 'Plus Jakarta Sans', weight: '600', size: 12 }
            }
          }
        }
      }
    });
  }

  // Interactive Retrain Simulation Button
  const retrainBtn = document.getElementById('simulateRetrainBtn');
  if (retrainBtn) {
    retrainBtn.addEventListener('click', () => {
      simulateModelRetraining();
    });
  }
}

function simulateModelRetraining() {
  const retrainBtn = document.getElementById('simulateRetrainBtn');
  const progressBox = document.getElementById('retrainProgressBox');
  const progressBar = document.getElementById('retrainProgressBar');

  if (retrainBtn) retrainBtn.disabled = true;
  if (progressBox) progressBox.style.display = 'block';

  let progress = 0;
  const interval = setInterval(() => {
    progress += 20;
    if (progressBar) progressBar.style.width = `${progress}%`;

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        // Slightly vary simulated metrics to show dynamic updates
        const lrAcc = (94.0 + (Math.random() * 0.8)).toFixed(1);
        const lrPrec = (93.5 + (Math.random() * 0.8)).toFixed(1);
        const lrRec = (94.2 + (Math.random() * 0.8)).toFixed(1);
        const lrF1 = (94.0 + (Math.random() * 0.8)).toFixed(1);

        // Update UI
        document.getElementById('lrAccVal').textContent = `${lrAcc}%`;
        document.getElementById('lrPrecVal').textContent = `${lrPrec}%`;
        document.getElementById('lrRecVal').textContent = `${lrRec}%`;
        document.getElementById('lrF1Val').textContent = `${lrF1}%`;

        // Update Chart
        if (ReviewGuard.charts.modelCompareBar) {
          ReviewGuard.charts.modelCompareBar.data.datasets[0].data = [lrAcc, lrPrec, lrRec, lrF1];
          ReviewGuard.charts.modelCompareBar.update();
        }

        if (progressBox) progressBox.style.display = 'none';
        if (progressBar) progressBar.style.width = '0%';
        if (retrainBtn) retrainBtn.disabled = false;

        showToast('Retraining Simulation Complete', `New convergence reached: Accuracy updated to ${lrAcc}%`, 'success');
      }, 400);
    }
  }, 250);
}

/* ==========================================================================
   UI UTILITIES (Toast, Escaping)
   ========================================================================== */
function showToast(title, message, type = 'info') {
  let container = document.querySelector('.toast-container-custom');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container-custom';
    document.body.appendChild(container);
  }

  const icons = {
    'success': 'fa-circle-check text-success',
    'warning': 'fa-triangle-exclamation text-warning',
    'danger': 'fa-circle-exclamation text-danger',
    'info': 'fa-circle-info text-primary'
  };

  const toast = document.createElement('div');
  toast.className = 'toast-custom';
  toast.innerHTML = `
    <i class="fa-solid ${icons[type] || icons.info} fs-5"></i>
    <div class="flex-grow-1">
      <div class="fw-bold">${escapeHtml(title)}</div>
      <div class="small text-muted">${escapeHtml(message)}</div>
    </div>
    <button type="button" class="btn-close btn-close-sm ms-auto" aria-label="Close"></button>
  `;

  toast.querySelector('.btn-close').addEventListener('click', () => {
    toast.remove();
  });

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) toast.remove();
  }, 4200);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeJs(str) {
  if (!str) return '';
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}
