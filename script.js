(function () {
  const body = document.body;
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  document.querySelectorAll(".main-nav a").forEach((link) => {
    const current = window.location.pathname.replace(/\/$/, "") || "/index.html";
    const href = new URL(link.getAttribute("href"), window.location.href).pathname.replace(/\/$/, "");
    if (current === href || current === `${href}.html`) {
      link.setAttribute("aria-current", "page");
    }
  });

  const params = new URLSearchParams(window.location.search);
  const requestedPackage = params.get("package");
  if (requestedPackage) {
    document.querySelectorAll("[name='package']").forEach((field) => {
      field.value = requestedPackage;
    });
  }

  const requestedWebsite = params.get("website");
  if (requestedWebsite) {
    document.querySelectorAll("[name='website']").forEach((field) => {
      field.value = requestedWebsite;
    });
  }

  const requestedSummary = params.get("summary");
  if (requestedSummary) {
    document.querySelectorAll("textarea[name='message']").forEach((field) => {
      if (!field.value) {
        field.value = requestedSummary;
      }
    });
  }

  const bookingDate = document.querySelector("[name='preferred_date']");
  if (bookingDate && bookingDate.type === "date") {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    bookingDate.min = date.toISOString().slice(0, 10);
  }

  const setStatus = (form, message, type) => {
    const status = form.querySelector(".form-status");
    if (!status) return;
    status.textContent = message;
    status.className = `form-status ${type || ""}`.trim();
  };

  document.querySelectorAll(".js-lead-form").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const submit = form.querySelector("[type='submit']");
      const originalText = submit ? submit.textContent : "";
      const data = new FormData(form);

      if (data.get("botcheck")) {
        return;
      }

      if (submit) {
        submit.disabled = true;
        submit.textContent = "Sending...";
      }

      setStatus(form, "Sending your enquiry...", "");

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" }
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || result.success === false) {
          throw new Error(result.message || "The form could not be submitted.");
        }
        form.reset();
        setStatus(form, "Request received. Octopye will reply with next steps.", "success");
      } catch (error) {
        setStatus(form, "Form issue. Email designs@octopye.com and mention the launch offer.", "error");
      } finally {
        if (submit) {
          submit.disabled = false;
          submit.textContent = originalText;
        }
      }
    });
  });

  const auditForm = document.querySelector("#audit-estimator-form");

  if (auditForm) {
    const auditUrl = auditForm.querySelector("#audit-url");
    const platformInput = auditForm.querySelector("#audit-platform");
    const goalInput = auditForm.querySelector("#audit-goal");
    const pagesInput = auditForm.querySelector("#audit-pages");
    const supportInput = auditForm.querySelector("#audit-support");
    const runAuditButton = auditForm.querySelector("#run-audit");
    const estimateOnlyButton = auditForm.querySelector("#estimate-only");
    const auditStatus = document.querySelector("#audit-status");
    const auditSummary = document.querySelector("#audit-summary");
    const estimateOutput = document.querySelector("#estimate-output");
    const platformOutput = document.querySelector("#platform-output");
    const scoreGrid = document.querySelector("#score-grid");
    const priorityList = document.querySelector("#priority-list");
    const recommendationList = document.querySelector("#recommendation-list");
    const bookingLink = document.querySelector("#audit-booking-link");
    const copyButton = document.querySelector("#copy-audit-summary");
    const copyStatus = document.querySelector("#copy-status");
    let lastSummary = "";
    let lastAuditContext = null;

    const platformLabels = {
      auto: "Auto-detect",
      static: "Static HTML/CSS/JS",
      wordpress: "WordPress",
      react: "React or SPA",
      builder: "Website builder",
      shop: "Shopify or ecommerce",
      unknown: "Unknown setup"
    };

    const goalLabels = {
      more_enquiries: "More enquiries or bookings",
      new_static_site: "New HTML/CSS/JS website",
      redesign: "Fix or redesign current website",
      seo: "SEO and organic visibility",
      hosting: "Hosting, care and support",
      app: "App design or prototype"
    };

    const bookingPackageLabels = {
      "App design prototype": "App Design Prototype",
      "Conversion landing page": "HTML/CSS/JS Landing Page",
      "Conversion website rebuild": "Static Small Business Website",
      "Hosting and website care": "Hosting and Website Care",
      "HTML/CSS/JS landing page": "HTML/CSS/JS Landing Page",
      "SEO foundations": "Local SEO Foundations",
      "Static growth website": "Static Small Business Website",
      "Static small business website": "Static Small Business Website",
      "Website redesign sprint": "Website Redesign"
    };

    const formatMoney = (value) => new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0
    }).format(Math.max(0, Math.round(value)));

    const setAuditStatus = (message, type) => {
      if (!auditStatus) return;
      auditStatus.textContent = message;
      auditStatus.className = `form-status ${type || ""}`.trim();
    };

    const setBusy = (isBusy) => {
      [runAuditButton, estimateOnlyButton].forEach((button) => {
        if (button) {
          button.disabled = isBusy;
        }
      });
      if (runAuditButton) {
        runAuditButton.textContent = isBusy ? "Running audit..." : "Run audit and estimate";
      }
    };

    const normalizeAuditUrl = (rawValue, allowEmpty) => {
      let value = rawValue.trim();
      if (!value && allowEmpty) {
        return "";
      }
      if (!value) {
        throw new Error("Add a website URL before running the audit.");
      }
      if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) {
        value = `https://${value}`;
      }
      const parsed = new URL(value);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error("Use a public http or https website URL.");
      }
      return parsed.href;
    };

    const readAuditInputs = (allowEmptyUrl) => ({
      url: normalizeAuditUrl(auditUrl ? auditUrl.value : "", allowEmptyUrl),
      selectedPlatform: platformInput ? platformInput.value : "auto",
      goal: goalInput ? goalInput.value : "more_enquiries",
      pages: pagesInput ? Number(pagesInput.value) : 5,
      support: supportInput ? supportInput.value : "none",
      addons: Array.from(auditForm.querySelectorAll("[name='addon']:checked")).map((field) => field.value)
    });

    const fetchPageSpeed = async (url, strategy) => {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 45000);
      const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
      endpoint.searchParams.set("url", url);
      endpoint.searchParams.set("strategy", strategy);
      ["performance", "accessibility", "best-practices", "seo"].forEach((category) => {
        endpoint.searchParams.append("category", category);
      });

      try {
        const response = await fetch(endpoint.toString(), { signal: controller.signal });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || payload.error) {
          throw new Error(payload.error && payload.error.message ? payload.error.message : "Scan failed.");
        }
        return payload.lighthouseResult;
      } finally {
        window.clearTimeout(timer);
      }
    };

    const runRenderedAudit = async (url) => {
      const [mobile, desktop] = await Promise.allSettled([
        fetchPageSpeed(url, "mobile"),
        fetchPageSpeed(url, "desktop")
      ]);
      const mobileResult = mobile.status === "fulfilled" ? mobile.value : null;
      const desktopResult = desktop.status === "fulfilled" ? desktop.value : null;
      if (!mobileResult && !desktopResult) {
        const reason = mobile.status === "rejected" ? mobile.reason.message : "The scan was blocked.";
        throw new Error(reason || "The scan was blocked.");
      }
      return {
        mobile: mobileResult,
        desktop: desktopResult,
        partial: !mobileResult || !desktopResult,
        error: mobile.status === "rejected" ? mobile.reason.message : desktop.status === "rejected" ? desktop.reason.message : ""
      };
    };

    const scoreFrom = (result, category) => {
      const categoryData = result && result.categories ? result.categories[category] : null;
      return categoryData && typeof categoryData.score === "number" ? Math.round(categoryData.score * 100) : null;
    };

    const collectAuditText = (audit) => {
      if (!audit) return "";
      const payloads = [audit.mobile, audit.desktop].filter(Boolean).map((result) => {
        const networkItems = result.audits && result.audits["network-requests"] && result.audits["network-requests"].details
          ? result.audits["network-requests"].details.items || []
          : [];
        return {
          finalUrl: result.finalDisplayedUrl || result.finalUrl || "",
          stackPacks: result.stackPacks || [],
          requests: networkItems.slice(0, 80).map((item) => item.url || "")
        };
      });
      return JSON.stringify(payloads);
    };

    const detectPlatform = (inputs, audit) => {
      if (inputs.selectedPlatform && inputs.selectedPlatform !== "auto") {
        return {
          key: inputs.selectedPlatform,
          label: platformLabels[inputs.selectedPlatform] || "Manual platform choice",
          source: "Selected manually"
        };
      }

      const text = collectAuditText(audit);
      if (/wp-content|wp-includes|wordpress/i.test(text)) {
        return { key: "wordpress", label: platformLabels.wordpress, source: "Detected from public files and requests" };
      }
      if (/cdn\.shopify|myshopify|shopify/i.test(text)) {
        return { key: "shop", label: platformLabels.shop, source: "Detected from ecommerce assets" };
      }
      if (/wixstatic|squarespace|webflow|weebly|framerusercontent/i.test(text)) {
        return { key: "builder", label: platformLabels.builder, source: "Detected from builder assets" };
      }
      if (/__NEXT_DATA__|\/_next\/|react|gatsby|nuxt|vite|webpack|\/static\/js\/|angular|vue/i.test(text)) {
        return { key: "react", label: platformLabels.react, source: "Detected from rendered JavaScript assets" };
      }
      if (audit && (audit.mobile || audit.desktop)) {
        return { key: "static", label: platformLabels.static, source: "No CMS or SPA signal found in the public scan" };
      }
      return { key: "unknown", label: platformLabels.unknown, source: "Manual estimate only" };
    };

    const scoreClass = (value) => {
      if (value === null) return "score-empty";
      if (value < 50) return "score-low";
      if (value < 85) return "score-mid";
      return "score-good";
    };

    const renderScores = (audit) => {
      if (!scoreGrid) return;
      const mobileSource = audit && audit.mobile ? audit.mobile : null;
      const desktopSource = audit && audit.desktop ? audit.desktop : null;
      const metrics = [
        ["Mobile performance", scoreFrom(mobileSource, "performance")],
        ["Desktop performance", scoreFrom(desktopSource, "performance")],
        ["SEO", scoreFrom(mobileSource || desktopSource, "seo")],
        ["Accessibility", scoreFrom(mobileSource || desktopSource, "accessibility")]
      ];
      scoreGrid.replaceChildren(...metrics.map(([label, value]) => {
        const item = document.createElement("div");
        item.className = `stat ${scoreClass(value)}`;
        const strong = document.createElement("strong");
        strong.textContent = value === null ? "--" : String(value);
        const copy = document.createElement("p");
        copy.textContent = label;
        item.append(strong, copy);
        return item;
      }));
    };

    const renderList = (element, items) => {
      if (!element) return;
      const cleanItems = items.filter(Boolean).slice(0, 8);
      element.replaceChildren(...cleanItems.map((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        return li;
      }));
    };

    const addPlatformCost = (estimate, platformKey, goal) => {
      if (platformKey === "wordpress") {
        estimate.min += 150;
        estimate.max += 500;
        estimate.reasons.push("WordPress plugin, theme and speed review");
      }
      if (platformKey === "react") {
        estimate.min += goal === "app" ? 0 : 300;
        estimate.max += goal === "app" ? 0 : 900;
        estimate.reasons.push("Rendered SEO and JavaScript performance checks");
      }
      if (platformKey === "builder") {
        estimate.min += 200;
        estimate.max += 600;
        estimate.reasons.push("Builder cleanup or migration planning");
      }
      if (platformKey === "shop") {
        estimate.min += 400;
        estimate.max += 1200;
        estimate.reasons.push("Ecommerce template, product and tracking review");
      }
      if (platformKey === "unknown") {
        estimate.max += 250;
        estimate.reasons.push("Manual technical discovery");
      }
    };

    const baseEstimate = (goal, pages) => {
      if (goal === "app") {
        return { label: "App design prototype", min: 799, max: 2499, monthlyMin: 0, monthlyMax: 0, reasons: ["UX screens, clickable prototype and build planning"] };
      }
      if (goal === "hosting") {
        return { label: "Hosting and website care", min: 0, max: 149, monthlyMin: 49, monthlyMax: 99, reasons: ["Hosting move, backups, updates and uptime checks"] };
      }
      if (goal === "seo") {
        return { label: "SEO foundations", min: 149, max: 499, monthlyMin: 149, monthlyMax: 349, reasons: ["Metadata, technical checks and service page plan"] };
      }
      if (goal === "redesign") {
        return pages <= 3
          ? { label: "Website redesign sprint", min: 399, max: 799, monthlyMin: 0, monthlyMax: 0, reasons: ["Rewrite the offer and rebuild the main conversion path"] }
          : { label: "Website redesign sprint", min: 599, max: 1299, monthlyMin: 0, monthlyMax: 0, reasons: ["Redesign key pages, forms, SEO basics and tracking"] };
      }
      if (goal === "new_static_site") {
        if (pages <= 1) {
          return { label: "HTML/CSS/JS landing page", min: 249, max: 449, monthlyMin: 0, monthlyMax: 0, reasons: ["Fast single page build with enquiry form"] };
        }
        if (pages <= 5) {
          return { label: "Static small business website", min: 599, max: 1199, monthlyMin: 0, monthlyMax: 0, reasons: ["Fast HTML/CSS/JS website built for enquiries"] };
        }
        return { label: "Static growth website", min: 899, max: 2499, monthlyMin: 0, monthlyMax: 0, reasons: ["Multi-page static website with service pages and SEO structure"] };
      }
      return pages <= 1
        ? { label: "Conversion landing page", min: 249, max: 449, monthlyMin: 0, monthlyMax: 0, reasons: ["Sharper offer, direct CTA and enquiry form"] }
        : { label: "Conversion website rebuild", min: 599, max: 1499, monthlyMin: 0, monthlyMax: 0, reasons: ["Clear services, lower-friction enquiry path and tracking"] };
    };

    const applyAddons = (estimate, inputs) => {
      inputs.addons.forEach((addon) => {
        if (addon === "copywriting") {
          estimate.min += 180;
          estimate.max += 360;
          estimate.reasons.push("Conversion copywriting help");
        }
        if (addon === "forms") {
          estimate.min += 99;
          estimate.max += 220;
          estimate.reasons.push("Booking or enquiry form setup");
        }
        if (addon === "tracking") {
          estimate.min += 99;
          estimate.max += 220;
          estimate.reasons.push("Analytics and conversion tracking");
        }
        if (addon === "seo_pages") {
          estimate.min += 149;
          estimate.max += 447;
          estimate.reasons.push("Extra SEO service page content");
        }
        if (addon === "hosting") {
          estimate.min += 0;
          estimate.max += 99;
          estimate.monthlyMin = Math.max(estimate.monthlyMin, 49);
          estimate.monthlyMax = Math.max(estimate.monthlyMax, 99);
          estimate.reasons.push("Hosting move or care setup");
        }
        if (addon === "app_design") {
          estimate.min += 799;
          estimate.max += 2499;
          estimate.reasons.push("App design prototype");
        }
      });

      if (inputs.support === "care") {
        estimate.monthlyMin = Math.max(estimate.monthlyMin, 49);
        estimate.monthlyMax = Math.max(estimate.monthlyMax, 79);
        estimate.reasons.push("Monthly hosting and care");
      }
      if (inputs.support === "growth") {
        estimate.monthlyMin = Math.max(estimate.monthlyMin, 99);
        estimate.monthlyMax = Math.max(estimate.monthlyMax, 179);
        estimate.reasons.push("Monthly growth support");
      }
      if (inputs.support === "seo") {
        estimate.monthlyMin = Math.max(estimate.monthlyMin, 149);
        estimate.monthlyMax = Math.max(estimate.monthlyMax, 349);
        estimate.reasons.push("Monthly SEO foundations");
      }
    };

    const estimateFromContext = (inputs, platform, audit) => {
      const estimate = baseEstimate(inputs.goal, inputs.pages);
      addPlatformCost(estimate, platform.key, inputs.goal);
      applyAddons(estimate, inputs);

      const mobilePerf = scoreFrom(audit && audit.mobile, "performance");
      const desktopPerf = scoreFrom(audit && audit.desktop, "performance");
      const seoScore = scoreFrom((audit && (audit.mobile || audit.desktop)), "seo");
      const worstPerf = [mobilePerf, desktopPerf].filter((value) => value !== null).sort((a, b) => a - b)[0];

      if (worstPerf !== undefined && worstPerf < 50) {
        estimate.min += 150;
        estimate.max += 500;
        estimate.reasons.push("Urgent performance repair");
      } else if (worstPerf !== undefined && worstPerf < 80) {
        estimate.min += 99;
        estimate.max += 250;
        estimate.reasons.push("Image, script and page speed optimisation");
      }

      if (seoScore !== null && seoScore < 80) {
        estimate.min += 99;
        estimate.max += 299;
        estimate.reasons.push("SEO metadata and indexability fixes");
      }

      return estimate;
    };

    const getPriorities = (inputs, platform, audit, blockedMessage) => {
      const priorities = [];
      const mobilePerf = scoreFrom(audit && audit.mobile, "performance");
      const desktopPerf = scoreFrom(audit && audit.desktop, "performance");
      const seoScore = scoreFrom((audit && (audit.mobile || audit.desktop)), "seo");
      const accessibilityScore = scoreFrom((audit && (audit.mobile || audit.desktop)), "accessibility");
      const worstPerf = [mobilePerf, desktopPerf].filter((value) => value !== null).sort((a, b) => a - b)[0];

      if (blockedMessage) {
        priorities.push("Automated scan was blocked or unavailable, so use a manual review before final scope.");
      }
      if (worstPerf !== undefined && worstPerf < 50) {
        priorities.push("Speed is likely costing enquiries; reduce scripts, heavy images and layout delay first.");
      } else if (worstPerf !== undefined && worstPerf < 80) {
        priorities.push("Improve page speed with image compression, script cleanup and lighter page sections.");
      }
      if (seoScore !== null && seoScore < 85) {
        priorities.push("Fix SEO basics: titles, descriptions, headings, crawlability and service page targeting.");
      }
      if (accessibilityScore !== null && accessibilityScore < 85) {
        priorities.push("Resolve accessibility issues so forms, buttons, contrast and labels work properly.");
      }
      if (platform.key === "wordpress") {
        priorities.push("Review plugins, theme weight, caching and form reliability.");
      }
      if (platform.key === "react") {
        priorities.push("Check rendered route metadata, crawlable content and JavaScript bundle weight.");
      }
      if (platform.key === "builder") {
        priorities.push("Decide whether to keep the builder or rebuild as a faster static site.");
      }
      if (inputs.goal === "more_enquiries") {
        priorities.push("Make the enquiry path obvious above the fold and track every form or booking click.");
      }
      if (!priorities.length) {
        priorities.push("Audit looks healthy at top level; focus on offer clarity, page copy and lead capture.");
      }
      return priorities;
    };

    const getRecommendations = (inputs, platform, estimate, audit, blockedMessage) => {
      const recommendations = [];
      if (blockedMessage) {
        recommendations.push("Start with the free manual website audit so Octopye can check what the scanner could not access.");
      }
      recommendations.push(`${estimate.label}: ${formatMoney(estimate.min)} - ${formatMoney(estimate.max)} guide range.`);
      if (estimate.monthlyMin || estimate.monthlyMax) {
        recommendations.push(`Optional support: ${formatMoney(estimate.monthlyMin)} - ${formatMoney(estimate.monthlyMax)} per month.`);
      }
      if (platform.key === "static" && inputs.goal !== "app") {
        recommendations.push("Best fit: a fast HTML/CSS/JS build with direct enquiry forms and service pages.");
      }
      if (platform.key === "wordpress") {
        recommendations.push("Best fit: either a lean WordPress cleanup or a static rebuild if speed and maintenance are the problem.");
      }
      if (platform.key === "react") {
        recommendations.push("Best fit: rendered SEO checks, route metadata, performance cleanup and conversion-focused page templates.");
      }
      if (inputs.goal === "app" || inputs.addons.includes("app_design")) {
        recommendations.push("App work should begin with a clickable prototype before any build budget is committed.");
      }
      if (audit && audit.partial) {
        recommendations.push("Only part of the automated audit returned, so final pricing should include a manual confirmation.");
      }
      recommendations.push("Send the summary to Octopye for a fixed recommendation before paying for any build.");
      return recommendations;
    };

    const renderEstimate = (estimate) => {
      if (!estimateOutput) return;
      const monthly = estimate.monthlyMin || estimate.monthlyMax
        ? `<p class="muted">Support option: ${formatMoney(estimate.monthlyMin)} - ${formatMoney(estimate.monthlyMax)} per month.</p>`
        : "";
      estimateOutput.innerHTML = `<span>${estimate.label}</span><strong>${formatMoney(estimate.min)} - ${formatMoney(estimate.max)}</strong>${monthly}<p class="muted">Guide price only. Octopye should confirm a fixed scope after checking the site and goals.</p>`;
    };

    const buildSummary = (inputs, platform, estimate, priorities, blockedMessage) => {
      const urlLine = inputs.url ? `Website: ${inputs.url}` : "Website: not supplied";
      const scanLine = blockedMessage ? `Scan status: blocked or unavailable (${blockedMessage})` : "Scan status: automated audit completed";
      const monthlyLine = estimate.monthlyMin || estimate.monthlyMax
        ? `Monthly support: ${formatMoney(estimate.monthlyMin)} - ${formatMoney(estimate.monthlyMax)} per month`
        : "Monthly support: not included";
      return [
        "Octopye audit and estimate summary",
        urlLine,
        scanLine,
        `Goal: ${goalLabels[inputs.goal] || inputs.goal}`,
        `Detected setup: ${platform.label} (${platform.source})`,
        `Recommended package: ${estimate.label}`,
        `Guide range: ${formatMoney(estimate.min)} - ${formatMoney(estimate.max)}`,
        monthlyLine,
        `Priority work: ${priorities.slice(0, 4).join(" | ")}`
      ].join("\n");
    };

    const updateBookingLink = (inputs, estimate) => {
      if (!bookingLink) return;
      const url = new URL("booking.html", window.location.href);
      url.searchParams.set("package", bookingPackageLabels[estimate.label] || "Free Website Audit");
      if (inputs.url) {
        url.searchParams.set("website", inputs.url);
      }
      url.searchParams.set("summary", lastSummary.slice(0, 1400));
      url.hash = "booking-form";
      bookingLink.href = `${url.pathname.split("/").pop()}${url.search}${url.hash}`;
    };

    const renderAuditContext = (inputs, audit, blockedMessage) => {
      const platform = detectPlatform(inputs, audit);
      const estimate = estimateFromContext(inputs, platform, audit);
      const priorities = getPriorities(inputs, platform, audit, blockedMessage);
      const recommendations = getRecommendations(inputs, platform, estimate, audit, blockedMessage);

      renderScores(audit);
      renderEstimate(estimate);
      renderList(priorityList, priorities);
      renderList(recommendationList, recommendations);

      if (platformOutput) {
        platformOutput.textContent = `${platform.label}. ${platform.source}.`;
      }

      lastSummary = buildSummary(inputs, platform, estimate, priorities, blockedMessage);
      if (auditSummary) {
        auditSummary.textContent = blockedMessage
          ? "The automated scan could not complete, so this estimate uses your manual answers and flags the site for review."
          : "Audit completed. The guide price is based on detected platform signals, Lighthouse-style scores, pages, goals and selected extras.";
      }
      updateBookingLink(inputs, estimate);
      lastAuditContext = { inputs, audit, blockedMessage };
    };

    const runManualEstimate = (message) => {
      try {
        const inputs = readAuditInputs(true);
        renderAuditContext(inputs, null, message || "Manual estimate requested without an automated scan.");
        setAuditStatus("Manual estimate ready. Add or keep the URL before sending the summary.", "success");
      } catch (error) {
        setAuditStatus(error.message, "error");
      }
    };

    auditForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!auditForm.reportValidity()) return;
      let inputs;
      try {
        inputs = readAuditInputs(false);
      } catch (error) {
        setAuditStatus(error.message, "error");
        return;
      }

      setBusy(true);
      setAuditStatus("Running rendered mobile and desktop checks. This can take up to a minute...", "");

      try {
        const audit = await runRenderedAudit(inputs.url);
        renderAuditContext(inputs, audit, audit.partial ? audit.error || "Only part of the scan returned." : "");
        setAuditStatus(audit.partial ? "Partial audit ready. Manual confirmation is recommended." : "Audit and estimate ready.", audit.partial ? "" : "success");
      } catch (error) {
        renderAuditContext(inputs, null, error.message || "The scan was blocked.");
        setAuditStatus("Scanner blocked or unavailable. Manual estimate created instead.", "error");
      } finally {
        setBusy(false);
      }
    });

    if (estimateOnlyButton) {
      estimateOnlyButton.addEventListener("click", () => {
        runManualEstimate("Manual estimate requested without an automated scan.");
      });
    }

    auditForm.addEventListener("change", () => {
      if (lastAuditContext) {
        try {
          const inputs = readAuditInputs(true);
          renderAuditContext(inputs, lastAuditContext.audit, lastAuditContext.blockedMessage);
          setAuditStatus("Estimate updated from your latest options.", "success");
        } catch (error) {
          setAuditStatus(error.message, "error");
        }
      }
    });

    if (copyButton) {
      copyButton.addEventListener("click", async () => {
        if (!lastSummary) {
          runManualEstimate("Manual estimate requested before copying.");
        }
        try {
          if (!lastSummary) {
            throw new Error("No summary is available yet.");
          }
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(lastSummary);
          } else {
            const area = document.createElement("textarea");
            area.value = lastSummary;
            area.setAttribute("readonly", "");
            area.style.position = "fixed";
            area.style.left = "-9999px";
            document.body.append(area);
            area.select();
            document.execCommand("copy");
            area.remove();
          }
          if (copyStatus) {
            copyStatus.textContent = "Audit summary copied.";
            copyStatus.className = "form-status success";
          }
        } catch (error) {
          if (copyStatus) {
            copyStatus.textContent = "Copy failed. Use the booking link instead.";
            copyStatus.className = "form-status error";
          }
        }
      });
    }
  }

  const estimateForm = document.querySelector("#estimate-form");
  const estimateOutput = document.querySelector("#estimate-output");

  if (estimateForm && estimateOutput) {
    const prices = {
      rescue: { min: 0, max: 99, label: "Free audit or GBP 99 rescue check" },
      fix: { min: 99, max: 149, label: "Form or Tracking Fix" },
      lead: { min: 249, max: 449, label: "HTML/CSS/JS Landing Page" },
      redesign: { min: 399, max: 699, label: "Website Redesign Sprint" },
      growth: { min: 599, max: 1199, label: "Static Small Business Website" },
      app: { min: 799, max: 2499, label: "App Design Prototype" },
      seo: { min: 149, max: 349, label: "SEO Foundations" }
    };

    const addOns = {
      extra_pages: 240,
      copywriting: 180,
      booking: 160,
      tracking: 90,
      logo: 150
    };

    const format = (value) => new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0
    }).format(value);

    const updateEstimate = () => {
      const selected = estimateForm.querySelector("[name='estimate_package']").value;
      const base = prices[selected] || prices.lead;
      let min = base.min;
      let max = base.max;
      estimateForm.querySelectorAll("[name='addon']:checked").forEach((checkbox) => {
        min += addOns[checkbox.value] || 0;
        max += addOns[checkbox.value] || 0;
      });
      estimateOutput.innerHTML = `<span>${base.label}</span><strong>${format(min)} - ${format(max)}</strong><p class="muted">This is a guide price. The fastest route is to send the form and get a fixed recommendation.</p>`;
    };

    estimateForm.addEventListener("change", updateEstimate);
    updateEstimate();
  }
})();
