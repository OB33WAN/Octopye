const revealElements = document.querySelectorAll('.reveal');
const floatingCta = document.getElementById('floatingCta');
const navToggle = document.getElementById('navToggle');
const mainNav = document.querySelector('.main-nav');
const teardownForm = document.getElementById('teardownForm');
const formStatus = document.getElementById('formStatus');
const formInputs = teardownForm ? teardownForm.querySelectorAll('input') : [];
const bookingForm = document.getElementById('bookingForm');
const bookingStatus = document.getElementById('bookingStatus');
const bookingDate = document.getElementById('bookingDate');
const auditPreview = document.getElementById('auditPreview');
const auditPreviewList = document.getElementById('auditPreviewList');
const auditFallback = document.getElementById('auditFallback');
const seoItDownloadLink = document.getElementById('seoItDownloadLink');
const isThisSafeDownloadLink = document.getElementById('isThisSafeDownloadLink');
const leadMagnetForm = document.getElementById('leadMagnetForm');
const leadMagnetStatus = document.getElementById('leadMagnetStatus');
const projectEnquiryForms = document.querySelectorAll('.project-enquiry-form');
const availabilityChip = document.getElementById('availabilityChip');
const roiForm = document.getElementById('roiForm');
const roiVisitors = document.getElementById('roiVisitors');
const roiCurrent = document.getElementById('roiCurrent');
const roiTarget = document.getElementById('roiTarget');
const roiDeal = document.getElementById('roiDeal');
const roiResult = document.getElementById('roiResult');
const ctaElements = document.querySelectorAll('[data-event="cta_click"], [data-event="form_submit_click"]');
const toggleButtons = document.querySelectorAll('.toggle-btn');
const priceCards = document.querySelectorAll('.price-card');
const faqButtons = document.querySelectorAll('.faq-item button');
const yearNode = document.getElementById('year');
const runtimeConfig = window.OCTOPYE_CONFIG || {};
const seoItPlayStoreUrl = String(runtimeConfig.seoItPlayStoreUrl || 'https://play.google.com/store/apps/details?id=com.seoit.app');
const isThisSafePlayStoreUrl = String(runtimeConfig.isThisSafePlayStoreUrl || 'https://play.google.com/store/apps/details?id=com.isthissafe');
let formStartedTracked = false;
const estimateForm = document.getElementById('estimateForm');
const estimateSteps = document.querySelectorAll('.estimate-step');
const estimateBackButton = document.getElementById('estimateBack');
const estimateNextButton = document.getElementById('estimateNext');
const estimateSubmitButton = document.getElementById('estimateSubmit');
const estimateStatus = document.getElementById('estimateStatus');
const estimateProgress = document.getElementById('estimatorProgress');
const estimateOffer = document.getElementById('estimateOffer');
const estimatePrice = document.getElementById('estimatePrice');
const estimateSummary = document.getElementById('estimateSummary');
const estimateBreakdown = document.getElementById('estimateBreakdown');
const estimateCta = document.getElementById('estimateCta');
const estimateRetainer = document.getElementById('estimateRetainer');
const proposalClientName = document.getElementById('proposalClientName');
const proposalClientEmail = document.getElementById('proposalClientEmail');
const proposalClientCompany = document.getElementById('proposalClientCompany');
const proposalStatus = document.getElementById('proposalStatus');
let currentEstimateStep = 1;
let latestEstimateDetails = null;
const web3FormsEndpoint = 'https://api.web3forms.com/submit';
const web3FormsAccessKey = String(runtimeConfig.web3FormsAccessKey || '');
const magneticTargets = document.querySelectorAll('.btn, .filter-btn, .toggle-btn');
const parallaxTargets = document.querySelectorAll('.hero-card, .hero-showcase-card, .detail-hero-image');

const trackEvent = (eventName, payload = {}) => {
  const eventPayload = {
    event: eventName,
    timestamp: new Date().toISOString(),
    page_path: window.location.pathname,
    ...payload
  };

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(eventPayload);
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, payload);
  }

  if (typeof window.plausible === 'function') {
    window.plausible(eventName, { props: payload });
  }

  if (runtimeConfig.analyticsDebug) {
    console.info('[Analytics event]', eventPayload);
  }
};

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((element) => revealObserver.observe(element));

parallaxTargets.forEach((element) => {
  element.classList.add('is-parallax');
  if (element.classList.contains('detail-hero-image')) {
    element.classList.add('is-floating');
  }
});

magneticTargets.forEach((element) => {
  element.classList.add('magnetic');

  element.addEventListener('mousemove', (event) => {
    const rect = element.getBoundingClientRect();
    const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
    const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
    element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  });

  element.addEventListener('mouseleave', () => {
    element.style.transform = '';
  });
});

if (parallaxTargets.length) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxTargets.forEach((element, index) => {
      const depth = element.classList.contains('detail-hero-image') ? 0.035 : 0.02;
      const offset = Math.max(-18, Math.min(18, scrollY * depth * (index % 2 === 0 ? 1 : 0.75)));
      element.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
  }, { passive: true });
}

if (seoItDownloadLink) {
  seoItDownloadLink.href = seoItPlayStoreUrl;
}

if (isThisSafeDownloadLink) {
  isThisSafeDownloadLink.href = isThisSafePlayStoreUrl;
}

if (bookingDate) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  bookingDate.min = `${yyyy}-${mm}-${dd}`;
}

if (availabilityChip) {
  const now = new Date();
  const day = now.getDay();
  const daysUntilMonday = day === 0 ? 1 : Math.max(1, 8 - day);
  const nextSlot = new Date(now);
  nextSlot.setDate(now.getDate() + daysUntilMonday);
  const slotsLeft = Math.max(1, 8 - day);
  const label = nextSlot.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });
  availabilityChip.textContent = `${slotsLeft} strategy slots left this week | Next available: ${label}`;
}

if (floatingCta) {
  const hideFloatingCtaOnPath = ['/booking.html', '/booking'];
  if (hideFloatingCtaOnPath.includes(window.location.pathname.toLowerCase())) {
    floatingCta.style.display = 'none';
  }

  window.addEventListener('scroll', () => {
    const isSuppressed = hideFloatingCtaOnPath.includes(window.location.pathname.toLowerCase());
    const show = !isSuppressed && window.scrollY > 500;
    floatingCta.classList.toggle('is-visible', show);
  });
}

// Mobile nav hamburger toggle
if (navToggle && mainNav) {
  if (!mainNav.id) {
    mainNav.id = 'primaryNav';
  }
  navToggle.setAttribute('aria-controls', mainNav.id);

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('nav-open', isOpen);
  });

  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !mainNav.contains(e.target)) {
      mainNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
      mainNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
      navToggle.focus();
    }
  });

  // Close nav on link click (for in-page anchors or same page)
  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) {
      mainNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    }
  });
}

// Project filter
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card[data-type]');

if (filterButtons.length && projectCards.length) {
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      projectCards.forEach((card) => {
        const type = card.dataset.type || '';
        card.style.display = filter === 'all' || type.includes(filter) ? '' : 'none';
      });
    });
  });
}

ctaElements.forEach((element) => {
  element.addEventListener('click', () => {
    trackEvent(element.dataset.event, {
      cta_label: element.dataset.ctaLabel || element.textContent.trim(),
      cta_location: element.dataset.ctaLocation || 'unknown'
    });
  });
});

formInputs.forEach((input) => {
  input.addEventListener('focus', () => {
    if (formStartedTracked) {
      return;
    }

    formStartedTracked = true;
    trackEvent('form_start', {
      form_id: 'teardownForm'
    });
  });
});

const saveLocalLeadCopy = (payload) => {
  const storageKey = 'octopye_leads_backup';
  const existingLeads = JSON.parse(localStorage.getItem(storageKey) || '[]');
  existingLeads.push(payload);
  localStorage.setItem(storageKey, JSON.stringify(existingLeads.slice(-50)));
};

const postJson = async (url, payload) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.ok === false) {
    const reason = body.error || `Request failed (${response.status})`;
    throw new Error(reason);
  }

  return body;
};

const sendViaWeb3Forms = async (payload) => {
  if (!web3FormsAccessKey) {
    throw new Error('Web3Forms access key is not configured.');
  }

  const requestBody = {
    access_key: web3FormsAccessKey,
    ...payload
  };

  const body = await postJson(web3FormsEndpoint, requestBody);
  if (!body.success) {
    throw new Error(body.message || 'Web3Forms submission failed.');
  }

  return body;
};

const fetchWithTimeout = async (url, options = {}, timeoutMs = 20000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

const normalizeTargetUrl = (url) => {
  const trimmed = String(url || '').trim();
  if (!trimmed) {
    return '';
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
};

const runPageSpeed = async (targetUrl, strategy) => {
  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo`;
  const response = await fetchWithTimeout(endpoint, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  }, 35000);

  if (!response.ok) {
    throw new Error(`PageSpeed ${strategy} failed (${response.status})`);
  }

  return response.json();
};

const extractCategoryScore = (data, key) => {
  const score = data?.lighthouseResult?.categories?.[key]?.score;
  if (typeof score !== 'number') {
    return null;
  }
  return Math.round(score * 100);
};

const extractTopOpportunities = (data) => {
  const audits = data?.lighthouseResult?.audits || {};
  const opportunities = Object.values(audits)
    .filter((audit) => audit?.details?.type === 'opportunity' && typeof audit?.details?.overallSavingsMs === 'number')
    .sort((a, b) => b.details.overallSavingsMs - a.details.overallSavingsMs)
    .slice(0, 3)
    .map((audit) => `${audit.title} (~${Math.round(audit.details.overallSavingsMs)}ms saving)`);

  return opportunities;
};

const fetchTextViaProxy = async (url) => {
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
  const response = await fetchWithTimeout(proxyUrl, {
    method: 'GET',
    headers: {
      Accept: 'text/plain,text/html,application/xml'
    }
  }, 16000);

  if (!response.ok) {
    throw new Error(`Proxy fetch failed (${response.status})`);
  }

  return response.text();
};

const runQuickCrawl = async (targetUrl) => {
  const target = new URL(targetUrl);
  const origin = target.origin;
  const crawl = {
    pagesDiscovered: 0,
    pagesSampled: 0,
    hasRobots: false,
    hasSitemap: false,
    titlePresent: false,
    metaDescriptionPresent: false,
    h1Count: 0
  };

  try {
    const robots = await fetchTextViaProxy(`${origin}/robots.txt`);
    crawl.hasRobots = /user-agent|sitemap/i.test(robots);
  } catch (error) {
    crawl.hasRobots = false;
  }

  try {
    const sitemap = await fetchTextViaProxy(`${origin}/sitemap.xml`);
    crawl.hasSitemap = /<urlset|<sitemapindex/i.test(sitemap);
  } catch (error) {
    crawl.hasSitemap = false;
  }

  try {
    const homepage = await fetchTextViaProxy(targetUrl);
    crawl.titlePresent = /<title>[^<]+<\/title>/i.test(homepage);
    crawl.metaDescriptionPresent = /<meta[^>]+name=["']description["']/i.test(homepage);
    crawl.h1Count = (homepage.match(/<h1\b/gi) || []).length;

    const links = Array.from(homepage.matchAll(/<a[^>]+href=["']([^"'#]+)["']/gi))
      .map((m) => m[1])
      .map((href) => {
        try {
          return new URL(href, origin);
        } catch (e) {
          return null;
        }
      })
      .filter((u) => u && u.origin === origin)
      .map((u) => u.pathname)
      .filter((pathname) => pathname && pathname !== '/')
      .slice(0, 30);

    const uniquePaths = Array.from(new Set(links));
    crawl.pagesDiscovered = uniquePaths.length + 1;
    crawl.pagesSampled = Math.min(crawl.pagesDiscovered, 6);
  } catch (error) {
    // Crawl data is optional and can fail on strict anti-bot setups.
  }

  return crawl;
};

const generateAutomatedAudit = async (rawUrl) => {
  const targetUrl = normalizeTargetUrl(rawUrl);
  if (!targetUrl) {
    throw new Error('No valid website URL provided.');
  }

  // allSettled: crawl or one PageSpeed call being blocked will not kill the other results
  const [mobileResult, desktopResult, crawlResult] = await Promise.allSettled([
    runPageSpeed(targetUrl, 'mobile'),
    runPageSpeed(targetUrl, 'desktop'),
    runQuickCrawl(targetUrl)
  ]);

  const mobile = mobileResult.status === 'fulfilled' ? mobileResult.value : null;
  const desktop = desktopResult.status === 'fulfilled' ? desktopResult.value : null;

  // If PageSpeed failed entirely there is nothing useful to return
  if (!mobile && !desktop) {
    throw new Error('PageSpeed API could not reach this URL. The site may block automated scanning.');
  }

  const crawl = crawlResult.status === 'fulfilled' ? crawlResult.value : {
    pagesDiscovered: 0, pagesSampled: 0, hasRobots: false, hasSitemap: false,
    titlePresent: false, metaDescriptionPresent: false, h1Count: 0
  };

  const scores = {
    mobilePerformance: mobile ? extractCategoryScore(mobile, 'performance') : null,
    desktopPerformance: desktop ? extractCategoryScore(desktop, 'performance') : null,
    seo: mobile ? extractCategoryScore(mobile, 'seo') : null,
    accessibility: mobile ? extractCategoryScore(mobile, 'accessibility') : null,
    bestPractices: mobile ? extractCategoryScore(mobile, 'best-practices') : null
  };

  const opportunities = mobile
    ? extractTopOpportunities(mobile)
    : (desktop ? extractTopOpportunities(desktop) : []);

  const highlights = [
    scores.mobilePerformance !== null ? `Mobile Performance: ${scores.mobilePerformance}/100` : 'Mobile Performance: unavailable',
    scores.desktopPerformance !== null ? `Desktop Performance: ${scores.desktopPerformance}/100` : 'Desktop Performance: unavailable',
    scores.seo !== null ? `SEO Score: ${scores.seo}/100` : 'SEO Score: unavailable',
    scores.accessibility !== null ? `Accessibility Score: ${scores.accessibility}/100` : 'Accessibility Score: unavailable',
    scores.bestPractices !== null ? `Best Practices Score: ${scores.bestPractices}/100` : 'Best Practices Score: unavailable',
    `Crawl: ${crawl.pagesDiscovered || 1} pages discovered, ${crawl.pagesSampled || 1} sampled`,
    `Robots.txt: ${crawl.hasRobots ? 'Found' : 'Not found'}`,
    `Sitemap.xml: ${crawl.hasSitemap ? 'Found' : 'Not found'}`,
    `Homepage <title>: ${crawl.titlePresent ? 'Present' : 'Missing'}`,
    `Homepage meta description: ${crawl.metaDescriptionPresent ? 'Present' : 'Missing'}`,
    `Homepage H1 count: ${crawl.h1Count}`
  ];

  return {
    targetUrl,
    scores,
    opportunities,
    crawl,
    highlights
  };
};

const renderAuditPreview = (audit) => {
  if (!auditPreview || !auditPreviewList) {
    return;
  }

  const items = [...audit.highlights];
  if (audit.opportunities.length) {
    items.push(`Top opportunities: ${audit.opportunities.join(' | ')}`);
  }

  auditPreviewList.innerHTML = items.map((item) => `<li>${item}</li>`).join('');
  auditPreview.hidden = false;
};

const setAuditFallbackVisible = (isVisible) => {
  if (!auditFallback) {
    return;
  }

  auditFallback.hidden = !isVisible;
};

const formatGBP = (amount) => `GBP ${Number(amount).toLocaleString('en-GB')}`;
const formatRange = (min, max, monthly = false) => `${formatGBP(min)} - ${formatGBP(max)}${monthly ? '/mo' : ''}`;

const formatRecurringList = (items) => {
  if (!items.length) {
    return 'None selected';
  }

  return items.map((item) => `${item.name} (${formatRange(item.min, item.max, true)})`).join(', ');
};

const getEstimateDetails = (data) => {
  const solution = String(data.get('solution') || data.get('projectType') || 'website');
  const industry = String(data.get('industry') || 'general');
  const pageCount = String(data.get('pageCount') || data.get('complexity') || '5');
  const timeline = String(data.get('timeline') || 'standard');
  const retainer = String(data.get('retainer') || 'none');
  const integrations = data.getAll('integrations').length ? data.getAll('integrations') : data.getAll('addons');

  const offerMatrix = {
    'ai-site': { offerName: 'AI Web Design', min: 1500, max: 2500, ctaHref: 'https://octopye.com/quote?service=ai-web-design' },
    website: { offerName: 'Custom Web Design', min: 2999, max: 5999, ctaHref: 'https://octopye.com/quote?service=web-design' },
    'web-app': { offerName: 'Web Application Development', min: 4999, max: 12000, ctaHref: 'https://octopye.com/book' },
    'mobile-app': { offerName: 'Mobile App Design & Development', min: 2500, max: 9999, ctaHref: 'https://octopye.com/quote?service=mobile-app-design' },
    seo: { offerName: 'SEO Services', min: 450, max: 1750, ctaHref: 'https://octopye.com/quote?service=seo' },
    social: { offerName: 'Social Media Management', min: 300, max: 850, ctaHref: 'https://octopye.com/quote?service=social-media' }
  };

  const base = offerMatrix[solution] || offerMatrix.website;
  let min = base.min;
  let max = base.max;

  const pageMap = {
    '5': { min: 0, max: 0, label: 'Up to 5 pages' },
    '10': { min: 900, max: 1800, label: 'Up to 10 pages' },
    '15': { min: 1800, max: 3200, label: 'Up to 15 pages' },
    '20+': { min: 3000, max: 5500, label: '20+ pages' },
    starter: { min: 0, max: 0, label: 'Starter scope' },
    growth: { min: 900, max: 1800, label: 'Growth scope' },
    advanced: { min: 2000, max: 4500, label: 'Advanced scope' }
  };

  const selectedPage = pageMap[pageCount] || pageMap['5'];
  if (solution === 'website' || solution === 'ai-site' || solution === 'web-app') {
    min += selectedPage.min;
    max += selectedPage.max;
  }

  const integrationMap = {
    booking: { label: 'Booking system', min: 400, max: 900 },
    payments: { label: 'Payments integration', min: 600, max: 1500 },
    crm: { label: 'CRM integration', min: 500, max: 1200 },
    portal: { label: 'Client portal', min: 1200, max: 2500 },
    marketplace: { label: 'Marketplace workflow', min: 2500, max: 6000 },
    ai: { label: 'AI-assisted feature', min: 900, max: 2200 },
    seo: { label: 'SEO setup and optimization', min: 450, max: 1250 },
    branding: { label: 'Brand and content support', min: 150, max: 850 }
  };

  const recurringAddonMap = {
    ads: { name: 'Google Ads Management', min: 200, max: 200 },
    social: { name: 'Social Media Management', min: 300, max: 300 }
  };

  const integrationLabels = [];
  const recurringAddons = [];
  integrations.forEach((key) => {
    const recurringItem = recurringAddonMap[key];
    if (recurringItem) {
      recurringAddons.push(recurringItem);
      integrationLabels.push(`${recurringItem.name} (${formatRange(recurringItem.min, recurringItem.max, true)})`);
      return;
    }

    const item = integrationMap[key];
    if (!item) {
      return;
    }

    min += item.min;
    max += item.max;
    integrationLabels.push(item.label);
  });

  const regulatedIndustries = ['healthcare', 'solicitors', 'accountants', 'government', 'airlines', 'finance'];
  if (regulatedIndustries.includes(industry)) {
    min = Math.round(min * 1.15);
    max = Math.round(max * 1.2);
  }

  if (timeline === 'accelerated') {
    min += 500;
    max += 1200;
  }

  const retainerMap = {
    none: null,
    seo: { name: 'SEO Retainer', min: 450, max: 1750 },
    social: { name: 'Social Media Management', min: 300, max: 300 },
    ads: { name: 'Google Ads Management', min: 200, max: 200 },
    'social-ads': { name: 'Social Media + Google Ads', min: 500, max: 500 },
    'seo-social': { name: 'SEO + Social Retainer', min: 750, max: 2050 },
    'full-growth': { name: 'SEO + Social + Google Ads', min: 950, max: 2250 }
  };

  const retainerRec = retainerMap[retainer] || null;

  const summaryCore = timeline === 'accelerated'
    ? 'This estimate includes a priority delivery uplift and compressed timeline planning.'
    : 'This estimate follows a standard delivery timeline with best-value implementation.';
  const summary = recurringAddons.length
    ? `${summaryCore} Monthly growth services are shown separately from the one-time build estimate.`
    : summaryCore;

  return {
    offerName: base.offerName,
    min,
    max,
    summary,
    integrations: integrationLabels,
    ctaHref: base.ctaHref,
    projectType: solution,
    industry,
    pageCount: selectedPage.label,
    timeline,
    retainer: retainerRec,
    recurringAddons
  };
};

const setEstimateStep = (step) => {
  currentEstimateStep = Math.min(Math.max(step, 1), estimateSteps.length);
  estimateSteps.forEach((fieldSet, index) => {
    fieldSet.classList.toggle('is-active', index + 1 === currentEstimateStep);
  });

  if (estimateProgress) {
    const progressPercent = (currentEstimateStep / estimateSteps.length) * 100;
    estimateProgress.style.width = `${progressPercent}%`;
  }

  if (estimateBackButton) {
    estimateBackButton.style.display = currentEstimateStep === 1 ? 'none' : 'inline-flex';
  }

  if (estimateNextButton && estimateSubmitButton) {
    const isLastStep = currentEstimateStep === estimateSteps.length;
    estimateNextButton.style.display = isLastStep ? 'none' : 'inline-flex';
    estimateSubmitButton.style.display = isLastStep ? 'inline-flex' : 'none';
  }
};

const validateEstimateStep = (step) => {
  const activeStep = document.querySelector(`.estimate-step[data-step="${step}"]`);
  if (!activeStep) {
    return true;
  }

  const requiredInputs = activeStep.querySelectorAll('input[required]');
  if (!requiredInputs.length) {
    return true;
  }

  const groups = {};
  requiredInputs.forEach((input) => {
    if (input.type === 'radio') {
      groups[input.name] = groups[input.name] || false;
      if (input.checked) {
        groups[input.name] = true;
      }
    } else if (input.value.trim()) {
      groups[input.name] = true;
    }
  });

  return Object.values(groups).every(Boolean);
};

const showEstimateResult = (details) => {
  if (!estimateOffer || !estimatePrice || !estimateSummary || !estimateBreakdown || !estimateCta) {
    return;
  }

  estimateOffer.textContent = details.offerName;
  estimatePrice.textContent = formatRange(details.min, details.max);
  estimateSummary.textContent = details.summary;
  estimateCta.href = '#proposalCapture';
  estimateCta.target = '';
  estimateCta.rel = '';
  estimateCta.textContent = 'Get Detailed Proposal';

  const lines = [
    `Industry: ${details.industry}`,
    `Scope: ${details.pageCount}`,
    `Timeline: ${details.timeline === 'accelerated' ? 'Accelerated (2-4 weeks)' : 'Standard (4-6+ weeks)'}`,
    details.integrations.length ? `Integrations/Add-ons: ${details.integrations.join(', ')}` : 'Integrations/Add-ons: none selected',
    details.recurringAddons.length ? `Monthly growth add-ons: ${formatRecurringList(details.recurringAddons)}` : 'Monthly growth add-ons: none selected'
  ];

  estimateBreakdown.innerHTML = lines.map((line) => `<li>${line}</li>`).join('');

  if (estimateRetainer) {
    estimateRetainer.textContent = details.retainer
      ? `${details.retainer.name} recommended: ${formatRange(details.retainer.min, details.retainer.max, true)}`
      : details.recurringAddons.length
        ? `Selected monthly growth add-ons: ${formatRecurringList(details.recurringAddons)}`
        : 'No monthly retainer selected. One-off project estimate only.';
  }

  latestEstimateDetails = details;
  if (proposalStatus) {
    proposalStatus.textContent = 'Enter your details, then click Get Detailed Proposal.';
    proposalStatus.style.color = '#3d5963';
  }
};

const sendDetailedProposal = async () => {
  if (!latestEstimateDetails) {
    if (proposalStatus) {
      proposalStatus.textContent = 'Generate an estimate first.';
      proposalStatus.style.color = '#b91c1c';
    }
    return;
  }

  if (!proposalClientName || !proposalClientEmail) {
    return;
  }

  const clientName = proposalClientName.value.trim();
  const clientEmail = proposalClientEmail.value.trim();
  const clientCompany = proposalClientCompany ? proposalClientCompany.value.trim() : '';

  if (!clientName || !clientEmail) {
    if (proposalStatus) {
      proposalStatus.textContent = 'Name and email are required to send your proposal.';
      proposalStatus.style.color = '#b91c1c';
    }
    return;
  }

  const emailOkay = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail);
  if (!emailOkay) {
    if (proposalStatus) {
      proposalStatus.textContent = 'Please enter a valid email address.';
      proposalStatus.style.color = '#b91c1c';
    }
    return;
  }

  const proposalPayload = {
    name: clientName,
    email: clientEmail,
    replyto: clientEmail,
    company: clientCompany,
    subject: `Detailed Proposal Request - ${latestEstimateDetails.offerName}`,
    from_name: 'Octopye Estimator',
    message: [
      `Client: ${clientName}`,
      `Email: ${clientEmail}`,
      `Company: ${clientCompany || 'N/A'}`,
      '',
      `Offer: ${latestEstimateDetails.offerName}`,
      `Estimate: ${formatRange(latestEstimateDetails.min, latestEstimateDetails.max)}`,
      `Industry: ${latestEstimateDetails.industry}`,
      `Scope: ${latestEstimateDetails.pageCount}`,
      `Timeline: ${latestEstimateDetails.timeline === 'accelerated' ? 'Accelerated (2-4 weeks)' : 'Standard (4-6+ weeks)'}`,
      `Integrations/Add-ons: ${latestEstimateDetails.integrations.length ? latestEstimateDetails.integrations.join(', ') : 'None selected'}`,
      `Monthly add-ons: ${formatRecurringList(latestEstimateDetails.recurringAddons || [])}`,
      latestEstimateDetails.retainer
        ? `Monthly recommendation: ${latestEstimateDetails.retainer.name} (${formatRange(latestEstimateDetails.retainer.min, latestEstimateDetails.retainer.max, true)})`
        : 'Monthly recommendation: none',
      '',
      `Accept: mailto:designs@octopye.com?subject=${encodeURIComponent(`Proposal Accepted - ${clientName}`)}`,
      `Reject: mailto:designs@octopye.com?subject=${encodeURIComponent(`Proposal Rejected - ${clientName}`)}`,
      '',
      `Source page: ${window.location.href}`,
      `Submitted at: ${new Date().toISOString()}`
    ].join('\n')
  };

  if (estimateCta) {
    estimateCta.setAttribute('aria-disabled', 'true');
    estimateCta.style.pointerEvents = 'none';
    estimateCta.textContent = 'Sending proposal...';
  }

  if (proposalStatus) {
    proposalStatus.textContent = 'Sending your detailed proposal...';
    proposalStatus.style.color = '#0f766e';
  }

  try {
    await sendViaWeb3Forms(proposalPayload);
    if (proposalStatus) {
      proposalStatus.textContent = 'Proposal request sent. Our team will review and follow up by email.';
      proposalStatus.style.color = '#065f46';
    }
    trackEvent('proposal_email_sent', {
      project_type: latestEstimateDetails.projectType,
      industry: latestEstimateDetails.industry,
      min_estimate: latestEstimateDetails.min,
      max_estimate: latestEstimateDetails.max
    });
  } catch (error) {
    if (proposalStatus) {
      proposalStatus.textContent = `Could not send proposal: ${error.message}`;
      proposalStatus.style.color = '#b91c1c';
    }
    trackEvent('proposal_email_error', {
      reason: error.message
    });
  } finally {
    if (estimateCta) {
      estimateCta.removeAttribute('aria-disabled');
      estimateCta.style.pointerEvents = '';
      estimateCta.textContent = 'Get Detailed Proposal';
    }
  }
};

if (teardownForm) {
  teardownForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(teardownForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const url = String(formData.get('url') || '').trim();
    const goal = String(formData.get('goal') || '').trim();
    const submitButton = teardownForm.querySelector('button[type="submit"]');
    if (!name || !email || !url) {
      formStatus.textContent = 'Please fill in name, email, and website URL.';
      formStatus.style.color = '#b91c1c';
      trackEvent('form_submit_error', {
        reason: 'missing_fields',
        form_id: 'teardownForm'
      });
      return;
    }

    const emailOkay = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOkay) {
      formStatus.textContent = 'Please use a valid email address.';
      formStatus.style.color = '#b91c1c';
      trackEvent('form_submit_error', {
        reason: 'invalid_email',
        form_id: 'teardownForm'
      });
      return;
    }

    if (auditPreview) {
      auditPreview.hidden = true;
    }
    setAuditFallbackVisible(false);

    formStatus.textContent = 'Running automated crawl and performance audit (20-40s)...';
    formStatus.style.color = '#0f766e';

    let audit = null;
    let auditSucceeded = false;
    try {
      audit = await generateAutomatedAudit(url);
      auditSucceeded = true;
      renderAuditPreview(audit);
    } catch (error) {
      audit = {
        targetUrl: normalizeTargetUrl(url),
        highlights: [`Automated audit unavailable: ${error.message}`],
        opportunities: []
      };
      setAuditFallbackVisible(true);
    }

    const payload = {
      name,
      email,
      // replyto lets designs@octopye.com hit Reply and reach the client directly.
      // For Web3Forms to also auto-email the client, enable the Autoresponder at:
      // web3forms.com → Access Keys → your key → Enable Autoresponder
      replyto: email,
      subject: `New Conversion Teardown Request - ${name}`,
      from_name: 'Octopye Site',
      message: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Website URL: ${url}`,
        `Growth Goal: ${goal || 'Not provided'}`,
        '',
        'Automated Audit Summary:',
        ...(audit?.highlights || []),
        ...(audit?.opportunities?.length ? ['Top Opportunities:', ...audit.opportunities] : []),
        '',
        `Source: ${String(formData.get('source') || 'Octopye Conversion Landing Page')}`,
        `Page: ${window.location.href}`,
        `Submitted at: ${new Date().toISOString()}`
      ].join('\n')
    };

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    formStatus.textContent = auditSucceeded
      ? 'Audit complete. Sending your request...'
      : 'Audit unavailable for this URL. Sending your request anyway...';
    formStatus.style.color = '#0f766e';

    try {
      await sendViaWeb3Forms(payload);

      saveLocalLeadCopy(payload);
      formStatus.textContent = 'Request received. Your teardown request is logged and our team will follow up shortly.';
      formStatus.style.color = '#065f46';
      teardownForm.reset();
      formStartedTracked = false;
      trackEvent('form_submit_success', {
        form_id: 'teardownForm',
        destination: 'web3forms'
      });
    } catch (error) {
      formStatus.textContent = `Submission failed: ${error.message}`;
      formStatus.style.color = '#b91c1c';
      trackEvent('form_submit_error', {
        reason: 'web3forms_failed',
        form_id: 'teardownForm'
      });
      console.error(error);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Send My Teardown Request';
      }
    }
  });
}

if (leadMagnetForm && leadMagnetStatus) {
  leadMagnetForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const data = new FormData(leadMagnetForm);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const submitButton = leadMagnetForm.querySelector('button[type="submit"]');

    if (!name || !email) {
      leadMagnetStatus.textContent = 'Please enter your name and email.';
      leadMagnetStatus.style.color = '#b91c1c';
      return;
    }

    const emailOkay = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOkay) {
      leadMagnetStatus.textContent = 'Please use a valid email address.';
      leadMagnetStatus.style.color = '#b91c1c';
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    leadMagnetStatus.textContent = 'Sending your checklist request...';
    leadMagnetStatus.style.color = '#0f766e';

    const payload = {
      name,
      email,
      replyto: email,
      subject: `Checklist Request - ${name}`,
      from_name: 'Octopye Lead Magnet',
      message: [
        `Name: ${name}`,
        `Email: ${email}`,
        'Requested asset: 7-point Homepage Conversion Checklist',
        `Source: ${String(data.get('source') || 'Homepage Lead Magnet')}`,
        `Page: ${window.location.href}`,
        `Submitted at: ${new Date().toISOString()}`
      ].join('\n')
    };

    try {
      await sendViaWeb3Forms(payload);
      leadMagnetStatus.textContent = 'Checklist requested. We will send it to your email shortly.';
      leadMagnetStatus.style.color = '#065f46';
      leadMagnetForm.reset();
      trackEvent('lead_magnet_requested', {
        source: 'homepage_checklist'
      });
    } catch (error) {
      leadMagnetStatus.textContent = `Could not send request: ${error.message}`;
      leadMagnetStatus.style.color = '#b91c1c';
      trackEvent('lead_magnet_error', {
        reason: error.message
      });
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Get Conversion Checklist';
      }
    }
  });
}

if (projectEnquiryForms.length) {
  projectEnquiryForms.forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const company = String(data.get('company') || '').trim();
      const website = String(data.get('website') || '').trim();
      const budgetRange = String(data.get('budgetRange') || '').trim();
      const timeline = String(data.get('timeline') || '').trim();
      const goal = String(data.get('goal') || '').trim();
      const notes = String(data.get('notes') || '').trim();
      const projectName = String(data.get('projectName') || 'Project Case Study').trim();
      const source = String(data.get('source') || `${projectName} Case Study`).trim();
      const submitButton = form.querySelector('button[type="submit"]');
      const status = form.querySelector('.form-status');

      if (!name || !email || !budgetRange || !timeline || !goal) {
        if (status) {
          status.textContent = 'Please complete all required fields.';
          status.style.color = '#b91c1c';
        }
        return;
      }

      const emailOkay = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOkay) {
        if (status) {
          status.textContent = 'Please enter a valid email address.';
          status.style.color = '#b91c1c';
        }
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending request...';
      }

      if (status) {
        status.textContent = 'Submitting your enquiry...';
        status.style.color = '#0f766e';
      }

      const payload = {
        name,
        email,
        replyto: email,
        subject: `Case Study Enquiry - ${projectName} - ${name}`,
        from_name: 'Octopye Case Study Enquiry',
        message: [
          `Project of interest: ${projectName}`,
          `Name: ${name}`,
          `Email: ${email}`,
          `Company: ${company || 'N/A'}`,
          `Website: ${website || 'N/A'}`,
          `Budget range: ${budgetRange}`,
          `Preferred timeline: ${timeline}`,
          `Goal: ${goal}`,
          `Notes: ${notes || 'N/A'}`,
          `Source: ${source}`,
          `Page: ${window.location.href}`,
          `Submitted at: ${new Date().toISOString()}`
        ].join('\n')
      };

      try {
        await sendViaWeb3Forms(payload);
        form.reset();
        if (status) {
          status.textContent = 'Thanks, your enquiry has been sent. We will respond shortly.';
          status.style.color = '#065f46';
        }
        trackEvent('project_enquiry_submitted', {
          project_name: projectName,
          budget_range: budgetRange,
          timeline
        });
      } catch (error) {
        if (status) {
          status.textContent = `Could not send enquiry: ${error.message}`;
          status.style.color = '#b91c1c';
        }
        trackEvent('project_enquiry_error', {
          project_name: projectName,
          reason: error.message
        });
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Request a Similar Build';
        }
      }
    });
  });
}

if (roiForm && roiVisitors && roiCurrent && roiTarget && roiDeal && roiResult) {
  roiForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const visitors = Number(roiVisitors.value || 0);
    const current = Number(roiCurrent.value || 0) / 100;
    const target = Number(roiTarget.value || 0) / 100;
    const deal = Number(roiDeal.value || 0);

    if (!visitors || !current || !target || !deal || target <= current) {
      roiResult.textContent = 'Enter valid values where target conversion rate is higher than your current rate.';
      roiResult.style.color = '#b91c1c';
      return;
    }

    const currentLeads = visitors * current;
    const targetLeads = visitors * target;
    const extraLeads = targetLeads - currentLeads;
    const extraRevenue = extraLeads * deal;

    roiResult.textContent = `Estimated uplift: +${Math.round(extraLeads)} leads/mo and roughly GBP ${Math.round(extraRevenue).toLocaleString('en-GB')} additional monthly revenue.`;
    roiResult.style.color = '#065f46';

    trackEvent('roi_calculated', {
      visitors,
      current_rate: Number((current * 100).toFixed(2)),
      target_rate: Number((target * 100).toFixed(2)),
      deal_value: deal,
      est_extra_revenue: Math.round(extraRevenue)
    });
  });
}

if (bookingForm && bookingStatus) {
  bookingForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const data = new FormData(bookingForm);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const company = String(data.get('company') || '').trim();
    const website = String(data.get('website') || '').trim();
    const bookingType = String(data.get('bookingType') || '').trim();
    const preferredDate = String(data.get('preferredDate') || '').trim();
    const preferredTime = String(data.get('preferredTime') || '').trim();
    const timezone = String(data.get('timezone') || '').trim();
    const priority = String(data.get('priority') || '').trim();
    const meetingLength = String(data.get('meetingLength') || '').trim();
    const budgetRange = String(data.get('budgetRange') || '').trim();
    const readiness = String(data.get('readiness') || '').trim();
    const monthlyLeads = String(data.get('monthlyLeads') || '').trim();
    const questions = String(data.get('questions') || '').trim();
    const submitButton = bookingForm.querySelector('button[type="submit"]');

    if (!name || !email || !bookingType || !preferredDate || !preferredTime || !timezone || !priority || !meetingLength || !budgetRange || !readiness) {
      bookingStatus.textContent = 'Please complete all required booking fields.';
      bookingStatus.style.color = '#b91c1c';
      return;
    }

    const emailOkay = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOkay) {
      bookingStatus.textContent = 'Please use a valid email address.';
      bookingStatus.style.color = '#b91c1c';
      return;
    }

    const payload = {
      name,
      email,
      replyto: email,
      subject: `Booking Slot Request - ${name}`,
      from_name: 'Octopye Booking',
      message: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Company: ${company || 'N/A'}`,
        `Website: ${website || 'N/A'}`,
        `Booking preference: ${bookingType}`,
        `Call type: ${meetingLength}`,
        `Preferred slot: ${preferredDate} at ${preferredTime} (${timezone})`,
        `Priority: ${priority}`,
        `Budget range: ${budgetRange}`,
        `Readiness: ${readiness}`,
        `Current monthly leads: ${monthlyLeads || 'Not provided'}`,
        `Questions: ${questions || 'N/A'}`,
        `Source: ${String(data.get('source') || 'Octopye Booking Page')}`,
        `Page: ${window.location.href}`,
        `Submitted at: ${new Date().toISOString()}`
      ].join('\n')
    };

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending request...';
    }

    bookingStatus.textContent = 'Submitting your booking request...';
    bookingStatus.style.color = '#0f766e';

    try {
      await sendViaWeb3Forms(payload);
      bookingForm.reset();
      if (bookingDate) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        bookingDate.min = `${yyyy}-${mm}-${dd}`;
      }
      bookingStatus.textContent = 'Booking request sent. We will confirm by email before scheduling.';
      bookingStatus.style.color = '#065f46';
      trackEvent('booking_request_submitted', {
        booking_type: bookingType,
        meeting_length: meetingLength,
        budget_range: budgetRange,
        readiness,
        priority,
        timezone
      });
    } catch (error) {
      bookingStatus.textContent = `Booking request failed: ${error.message}`;
      bookingStatus.style.color = '#b91c1c';
      trackEvent('booking_request_error', {
        reason: error.message
      });
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Request Booking Slot';
      }
    }
  });
}

const updatePricing = (speed) => {
  priceCards.forEach((card) => {
    const key = speed === 'fast' ? 'fast' : 'base';
    const value = card.dataset[key];
    const priceNode = card.querySelector('.price span');
    if (priceNode && value) {
      priceNode.textContent = Number(value).toLocaleString('en-GB');
    }
  });
};

toggleButtons.forEach((button) => {
  button.addEventListener('click', () => {
    toggleButtons.forEach((btn) => btn.classList.remove('is-active'));
    button.classList.add('is-active');
    updatePricing(button.dataset.speed);
  });
});

faqButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const content = item.querySelector('.faq-content');
    const isOpen = button.getAttribute('aria-expanded') === 'true';

    faqButtons.forEach((otherButton) => {
      const otherItem = otherButton.closest('.faq-item');
      const otherContent = otherItem.querySelector('.faq-content');
      otherButton.setAttribute('aria-expanded', 'false');
      otherContent.style.maxHeight = '0px';
    });

    if (!isOpen) {
      button.setAttribute('aria-expanded', 'true');
      content.style.maxHeight = `${content.scrollHeight}px`;
    }
  });
});

if (estimateForm) {
  setEstimateStep(1);

  estimateCta?.addEventListener('click', async (event) => {
    if (!latestEstimateDetails) {
      return;
    }

    event.preventDefault();
    await sendDetailedProposal();
  });

  estimateNextButton?.addEventListener('click', () => {
    if (!validateEstimateStep(currentEstimateStep)) {
      estimateStatus.textContent = 'Please answer this question to continue.';
      estimateStatus.style.color = '#b91c1c';
      return;
    }

    estimateStatus.textContent = '';
    setEstimateStep(currentEstimateStep + 1);
    trackEvent('estimate_step_next', {
      step: currentEstimateStep
    });
  });

  estimateBackButton?.addEventListener('click', () => {
    estimateStatus.textContent = '';
    setEstimateStep(currentEstimateStep - 1);
    trackEvent('estimate_step_back', {
      step: currentEstimateStep
    });
  });

  estimateForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!validateEstimateStep(currentEstimateStep)) {
      estimateStatus.textContent = 'Please answer the final question to get your estimate.';
      estimateStatus.style.color = '#b91c1c';
      return;
    }

    const data = new FormData(estimateForm);
    const details = getEstimateDetails(data);
    showEstimateResult(details);
    estimateStatus.textContent = 'Estimate ready. You can now book or request a full proposal.';
    estimateStatus.style.color = '#065f46';

    trackEvent('estimate_generated', {
      project_type: details.projectType,
      industry: details.industry,
      page_scope: details.pageCount,
      timeline: details.timeline,
      min_estimate: details.min,
      max_estimate: details.max,
      integration_count: details.integrations.length,
      offer_name: details.offerName
    });
  });
}
