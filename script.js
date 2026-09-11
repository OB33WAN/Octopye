(function () {
  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  body.classList.add("js-enabled");

  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const open = body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  const current = (window.location.pathname.split("/").pop() || "index.html").replace(/\.html$/, "");
  document.querySelectorAll(".main-nav a").forEach((link) => {
    const href = (link.getAttribute("href") || "").replace(/\.html.*$/, "");
    if ((current || "index") === href || (current === "index" && href === "index")) link.setAttribute("aria-current", "page");
  });

  const stickyCta = document.querySelector(".sticky-mobile-cta");
  if (stickyCta) {
    const syncSticky = () => stickyCta.classList.toggle("is-visible", window.scrollY > 420);
    syncSticky();
    window.addEventListener("scroll", syncSticky, { passive: true });
  }

  const reveal = document.querySelectorAll(".section, .card, .journey-step, .process-step, .system-map, .decision-row, .signal-item, .route-row");
  reveal.forEach((node) => node.classList.add("reveal"));
  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px 18% 0px", threshold: 0.03 });
    reveal.forEach((node) => observer.observe(node));
  } else {
    reveal.forEach((node) => node.classList.add("is-visible"));
  }

  const columns = Array.from(document.querySelectorAll("[data-map-column]"));
  if (columns.length && !reduceMotion.matches) {
    let index = 0;
    columns[0].classList.add("is-active");
    window.setInterval(() => {
      index = (index + 1) % columns.length;
      columns.forEach((node, nodeIndex) => node.classList.toggle("is-active", nodeIndex === index));
    }, 1800);
  }

  const journeySteps = Array.from(document.querySelectorAll("[data-journey-step]"));
  journeySteps.forEach((button) => {
    button.addEventListener("click", () => {
      journeySteps.forEach((item) => item.classList.toggle("is-active", item === button));
    });
  });
  if (journeySteps.length && !reduceMotion.matches) {
    let stepIndex = 0;
    window.setInterval(() => {
      stepIndex = (stepIndex + 1) % journeySteps.length;
      journeySteps.forEach((item, index) => item.classList.toggle("is-active", index === stepIndex));
    }, 2400);
  }

  const priceCards = Array.from(document.querySelectorAll("[data-price-card]"));
  priceCards.forEach((card) => {
    card.addEventListener("pointerenter", () => {
      priceCards.forEach((item) => item.classList.toggle("is-selected", item === card));
    });
    card.addEventListener("focusin", () => {
      priceCards.forEach((item) => item.classList.toggle("is-selected", item === card));
    });
  });

  const projectFilters = Array.from(document.querySelectorAll("[data-project-filter]"));
  const projectCards = Array.from(document.querySelectorAll("[data-project-card]"));
  if (projectFilters.length && projectCards.length) {
    const count = document.createElement("p");
    count.className = "filter-count";
    projectFilters[0].closest(".filter-bar").after(count);
    const update = (filter) => {
      let visible = 0;
      projectCards.forEach((card) => {
        const text = card.dataset.type || "";
        const show = filter === "all" || text.includes(filter);
        card.hidden = !show;
        if (show) visible += 1;
      });
      count.textContent = visible + " work example" + (visible === 1 ? "" : "s") + " shown.";
    };
    projectFilters.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));
      button.addEventListener("click", () => {
        projectFilters.forEach((item) => {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        update(button.dataset.projectFilter || "all");
      });
    });
    update("all");
  }

  const estimator = document.querySelector("[data-estimator]");
  const estimateOutput = document.querySelector("#estimate-output");
  if (estimator && estimateOutput) {
    const base = {
      landing: [249, 449, "HTML/CSS/JS landing page"],
      website: [599, 1199, "Static small business website"],
      redesign: [399, 899, "Website redesign sprint"],
      app: [799, 2499, "App design prototype"],
      seo: [149, 349, "SEO foundations per month"],
      care: [49, 149, "Website care per month"],
      custom: [799, 3500, "Discovery-led custom system"]
    };
    const addons = { forms: 160, tracking: 99, copy: 180, integration: 420 };
    const format = (value) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(value);
    const update = () => {
      const data = new FormData(estimator);
      const selected = base[data.get("type")] || base.website;
      const size = Number(data.get("size") || 5);
      let min = selected[0];
      let max = selected[1];
      if (size > 5 && !["seo", "care"].includes(data.get("type"))) {
        min += (size - 5) * 120;
        max += (size - 5) * 220;
      }
      estimator.querySelectorAll("[name='addon']:checked").forEach((field) => {
        min += addons[field.value] || 0;
        max += addons[field.value] || 0;
      });
      estimateOutput.innerHTML = '<span class="tagline">Recommended starting route</span><h2>' + selected[2] + '</h2><strong>' + format(min) + ' - ' + format(max) + '</strong><p>Guide only. Send the problem to Octopye for a fixed recommendation before development starts.</p><a class="button" href="contact.html?estimate=' + encodeURIComponent(selected[2]) + '">Send estimate</a>';
    };
    estimator.addEventListener("change", update);
    update();
  }

  document.querySelectorAll(".contact-form").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const status = form.querySelector(".form-status");
      const submit = form.querySelector("[type='submit']");
      const original = submit ? submit.innerHTML : "";
      const data = new FormData(form);
      if (data.get("botcheck")) return;
      if (submit) { submit.disabled = true; submit.textContent = "Sending..."; }
      if (status) { status.textContent = "Sending your enquiry..."; status.className = "form-status"; }
      try {
        const response = await fetch(form.action, { method: "POST", body: data, headers: { Accept: "application/json" } });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || result.success === false) throw new Error(result.message || "Submission failed");
        form.reset();
        if (status) { status.textContent = "Enquiry sent. Octopye will review the details and reply with a practical next step."; status.className = "form-status success"; }
      } catch (error) {
        if (status) { status.textContent = "The form could not send. Email designs@octopye.com with your project details."; status.className = "form-status error"; }
      } finally {
        if (submit) { submit.disabled = false; submit.innerHTML = original; }
      }
    });
  });

  const params = new URLSearchParams(window.location.search);
  const service = params.get("service") || params.get("estimate") || params.get("industry") || params.get("project");
  if (service) {
    document.querySelectorAll("[name='service_interest']").forEach((field) => {
      const match = Array.from(field.options).find((option) => option.textContent.toLowerCase().includes(service.toLowerCase()));
      if (match) field.value = match.textContent;
    });
  }
})();