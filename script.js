(function () {
  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  body.classList.add("js-enabled");
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");

  const loader = document.createElement("div");
  loader.className = "site-loader";
  loader.setAttribute("aria-hidden", "true");
  loader.innerHTML = '<div class="loader-card"><img src="images/octopye-logo-icon-180.webp" alt="" /><strong>Octopye</strong><span>Building the conversion path</span><i></i></div>';
  document.body.prepend(loader);
  window.setTimeout(() => {
    loader.classList.add("is-done");
  }, 620);
  window.setTimeout(() => {
    loader.remove();
  }, 1250);

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

  const header = document.querySelector(".site-header");
  if (header && !document.querySelector(".site-ticker")) {
    const ticker = document.createElement("div");
    ticker.className = "site-ticker";
    ticker.innerHTML = '<div><span>HTML/CSS/JS websites from GBP 249</span><span>Static business sites from GBP 599</span><span>App prototypes from GBP 799</span><span>SEO foundations from GBP 149/mo</span><span>Instant estimator available</span><span>Book a free human audit</span><span>HTML/CSS/JS websites from GBP 249</span><span>Static business sites from GBP 599</span><span>App prototypes from GBP 799</span><span>SEO foundations from GBP 149/mo</span><span>Instant estimator available</span><span>Book a free human audit</span></div>';
    header.insertAdjacentElement("afterend", ticker);
  }

  const hero = document.querySelector(".hero");
  if (hero && !hero.querySelector(".hero-showcase")) {
    const showcase = document.createElement("aside");
    showcase.className = "hero-showcase";
    showcase.setAttribute("aria-label", "Live Octopye build preview");
    showcase.innerHTML = '<div class="showcase-window light-preview"><div class="showcase-top"><img src="images/octopye-logo-icon-180.webp" alt="" /><span>Website launch plan</span></div><div class="console-grid"><div class="console-copy"><span>Primary page</span><strong>HTML/CSS/JS build</strong><i></i><i></i><i></i></div><div class="conversion-meter"><strong>Book</strong><span>Free audit</span></div></div><div class="signal-stack"><span>SEO route mapped</span><span>Pricing visible</span><span>Form ready</span><span>Proof linked</span></div><div class="showcase-steps"><span class="is-active">Offer</span><span>Pages</span><span>Proof</span><span>Enquiry</span></div><div class="showcase-bars"><i style="--bar:92%"></i><i style="--bar:84%"></i><i style="--bar:88%"></i></div></div>';
    hero.append(showcase);
    const preview = showcase.querySelector(".light-preview");
    if (preview && !reduceMotion.matches && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      let previewFrame = 0;
      hero.addEventListener("pointermove", (event) => {
        window.cancelAnimationFrame(previewFrame);
        previewFrame = window.requestAnimationFrame(() => {
          const rect = hero.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width) - 0.5;
          const y = ((event.clientY - rect.top) / rect.height) - 0.5;
          preview.style.setProperty("--preview-x", `${x * 18}px`);
          preview.style.setProperty("--preview-y", `${y * 12}px`);
          preview.style.setProperty("--preview-rx", `${y * -2.4}deg`);
          preview.style.setProperty("--preview-ry", `${x * 3.2}deg`);
        });
      });
      hero.addEventListener("pointerleave", () => {
        window.cancelAnimationFrame(previewFrame);
        preview.style.setProperty("--preview-x", "0px");
        preview.style.setProperty("--preview-y", "0px");
        preview.style.setProperty("--preview-rx", "0deg");
        preview.style.setProperty("--preview-ry", "0deg");
      });
    }
    if (!reduceMotion.matches) {
      const showcaseSteps = Array.from(showcase.querySelectorAll(".showcase-steps span"));
      const signalNodes = Array.from(showcase.querySelectorAll(".signal-stack span"));
      const barNodes = Array.from(showcase.querySelectorAll(".showcase-bars i"));
      let showcaseIndex = 0;
      const advanceShowcase = () => {
        showcaseIndex = (showcaseIndex + 1) % showcaseSteps.length;
        showcaseSteps.forEach((step, index) => {
          step.classList.toggle("is-active", index === showcaseIndex);
        });
        signalNodes.forEach((signal, index) => {
          signal.classList.toggle("is-signal-live", index === showcaseIndex);
        });
        barNodes.forEach((bar, index) => {
          bar.classList.toggle("is-bar-live", index === showcaseIndex % barNodes.length);
        });
      };
      advanceShowcase();
      window.setInterval(advanceShowcase, 1600);
    }
  }

  const routeName = (window.location.pathname.split("/").pop() || "index.html").replace(/\.html$/, "") || "index";
  body.classList.add(`route-${routeName}`);
  const pageTitle = (document.querySelector("h1") || document.querySelector("title") || {}).textContent || "Octopye enquiry";
  const suggestedPackage = (() => {
    if (/app|project-(seo-it|octopass|cyber|family|allergen|quit|safe)/.test(routeName)) return "App Design Prototype";
    if (/seo|organic-google-reach|technical-seo|seo-content/.test(routeName)) return "Local SEO Foundations";
    if (/care|hosting/.test(routeName)) return "Hosting and Website Care";
    if (/landing/.test(routeName)) return "HTML/CSS/JS Landing Page";
    if (/redesign/.test(routeName)) return "Website Redesign";
    if (/estimate|audit|booking/.test(routeName)) return "Free Website Audit";
    return "Static Small Business Website";
  })();
  const escapeHtml = (value) => String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  const bookingSummary = `Interested after viewing: ${pageTitle.trim()} (${window.location.href})`;
  const safeSuggestedPackage = escapeHtml(suggestedPackage);
  const safeBookingSummary = escapeHtml(bookingSummary);
  const bookingPopupHasShown = () => {
    try {
      return window.sessionStorage.getItem("octopye-booking-popup-shown") === "true";
    } catch {
      return false;
    }
  };
  const rememberBookingPopup = () => {
    try {
      window.sessionStorage.setItem("octopye-booking-popup-shown", "true");
    } catch {
      // Some privacy modes block storage; the popup should still work manually.
    }
  };
  const bookingHref = (packageName, summary) => {
    if (routeName === "booking") {
      return "#booking-form";
    }
    const url = new URL("booking.html", window.location.href);
    url.searchParams.set("package", packageName || suggestedPackage);
    url.searchParams.set("summary", (summary || bookingSummary).slice(0, 1400));
    url.hash = "booking-form";
    return `${url.pathname.split("/").pop()}${url.search}${url.hash}`;
  };

  const quickTools = document.createElement("aside");
  quickTools.className = "quick-tools";
  quickTools.innerHTML = '<button class="quick-tools-toggle" type="button" aria-expanded="false"><span>Book</span></button><div class="quick-tools-panel" hidden><a href="booking.html?package=Free%20Website%20Audit#booking-form">Book free audit</a><a href="estimate.html#audit-estimator-form">Instant estimator</a><a href="packages.html">Pricing</a><a href="projects.html">Project proof</a><a href="organic-google-reach.html">Organic growth</a></div>';
  document.body.append(quickTools);
  const quickToggle = quickTools.querySelector(".quick-tools-toggle");
  const quickPanel = quickTools.querySelector(".quick-tools-panel");
  quickToggle.addEventListener("click", () => {
    const isOpen = quickPanel.hidden;
    quickPanel.hidden = !isOpen;
    quickTools.classList.toggle("is-open", isOpen);
    quickToggle.setAttribute("aria-expanded", String(isOpen));
  });
  quickTools.querySelectorAll(".quick-tools-panel a").forEach((link, index) => {
    link.style.setProperty("--quick-delay", `${index * 45}ms`);
  });

  const bookingNudge = document.createElement("aside");
  bookingNudge.className = "booking-nudge";
  bookingNudge.innerHTML = '<button class="booking-nudge-button" type="button"><span>Want bookings?</span><strong>Book free audit</strong></button>';
  document.body.append(bookingNudge);

  const bookingStrip = document.createElement("aside");
  bookingStrip.className = "booking-intent-strip";
  bookingStrip.innerHTML = '<p><strong>Need bookings, not page views?</strong><span>Get the free audit and the smallest sensible route to enquiries.</span></p><div><a class="button" href="' + bookingHref("Free Website Audit", "Free audit requested from sticky booking strip.") + '">Book audit</a><button class="button secondary" type="button" data-open-booking-popup>Quick book</button></div>';
  document.body.append(bookingStrip);

  const bookingModal = document.createElement("div");
  bookingModal.className = "booking-modal";
  bookingModal.hidden = true;
  bookingModal.innerHTML = '<div class="booking-modal-backdrop" data-close-booking-popup></div><section class="booking-modal-panel" role="dialog" aria-modal="true" aria-labelledby="booking-modal-title"><button class="booking-modal-close" type="button" aria-label="Close booking popup" data-close-booking-popup>Close</button><p class="eyebrow">Book before you browse away</p><h2 id="booking-modal-title">Get a free website audit and a clear booking route.</h2><p class="page-lead">Send the minimum details now. Octopye can reply with the quickest way to turn the site into enquiries: page, website, app prototype, SEO, forms or care.</p><div class="booking-choice-grid"><a href="' + bookingHref("Free Website Audit", "Free audit requested from booking popup.") + '"><strong>Free audit</strong><span>Best first step</span></a><a href="' + bookingHref(suggestedPackage, "Fixed quote requested from booking popup.") + '"><strong>Fixed quote</strong><span>' + safeSuggestedPackage + '</span></a><a href="estimate.html#audit-estimator-form"><strong>Use estimator</strong><span>Work out cost first</span></a></div><form class="popup-booking-form js-lead-form" action="https://api.web3forms.com/submit" method="POST"><input type="hidden" name="access_key" value="def6e6ac-11ac-4b24-9c11-6238ea733b58" /><input type="hidden" name="subject" value="New Octopye quick booking request" /><input type="hidden" name="from_name" value="Octopye quick booking popup" /><input type="checkbox" name="botcheck" class="hidden" tabindex="-1" autocomplete="off" /><div class="form-grid compact"><label class="field">Name<input name="name" autocomplete="name" required /></label><label class="field">Email<input type="email" name="email" autocomplete="email" required /></label><label class="field">Website, optional<input name="website" inputmode="url" placeholder="https://..." /></label><label class="field">Need<select name="package"><option>' + safeSuggestedPackage + '</option><option>Free Website Audit</option><option>HTML/CSS/JS Landing Page</option><option>Static Small Business Website</option><option>Website Redesign</option><option>App Design Prototype</option><option>Local SEO Foundations</option><option>Hosting and Website Care</option></select></label><label class="field full">What do you want more of?<textarea name="message" required>More bookings/enquiries. ' + safeBookingSummary + '</textarea></label></div><button class="button full" type="submit">Send quick booking request</button><p class="form-status" role="status" aria-live="polite"></p></form><p class="muted booking-modal-email">Prefer email? <a href="mailto:designs@octopye.com?subject=Octopye%20booking%20request">designs@octopye.com</a></p></section>';
  document.body.append(bookingModal);

  const bookingModalPanel = bookingModal.querySelector(".booking-modal-panel");
  const openBookingPopup = (manual) => {
    if (routeName === "booking" && manual) {
      const form = document.querySelector("#booking-form");
      if (form) form.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" });
      return;
    }
    if (!manual && (routeName === "booking" || routeName === "estimate")) return;
    if (!manual && bookingPopupHasShown()) return;
    bookingModal.hidden = false;
    body.classList.add("booking-modal-open");
    rememberBookingPopup();
    const firstField = bookingModal.querySelector("input[name='name']") || bookingModalPanel;
    window.setTimeout(() => firstField.focus(), 60);
  };

  const closeBookingPopup = () => {
    bookingModal.hidden = true;
    body.classList.remove("booking-modal-open");
  };

  bookingNudge.querySelector("button").addEventListener("click", () => openBookingPopup(true));
  bookingModal.querySelectorAll("[data-close-booking-popup]").forEach((control) => {
    control.addEventListener("click", closeBookingPopup);
  });
  document.querySelectorAll("[data-open-booking-popup]").forEach((control) => {
    control.addEventListener("click", () => openBookingPopup(true));
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !bookingModal.hidden) {
      closeBookingPopup();
    }
  });
  document.addEventListener("mousemove", (event) => {
    if (event.clientY <= 8 && window.scrollY > 260 && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      openBookingPopup(false);
    }
  });
  window.setTimeout(() => openBookingPopup(false), 26000);

  const progress = document.createElement("span");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.append(progress);

  let scrollPrompted = false;
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
    progress.style.width = `${percent}%`;
    if (!scrollPrompted && percent > 68) {
      scrollPrompted = true;
      openBookingPopup(false);
    }
  };

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();
  window.requestAnimationFrame(() => body.classList.add("is-ready"));

  const heroes = document.querySelectorAll(".hero");
  const updateHeroMotion = () => {
    if (reduceMotion.matches) return;
    heroes.forEach((hero) => {
      const rect = hero.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const shift = Math.max(-26, Math.min(26, rect.top * -0.04));
      hero.style.setProperty("--hero-shift", `${shift}px`);
    });
  };

  window.addEventListener("scroll", updateHeroMotion, { passive: true });
  window.addEventListener("resize", updateHeroMotion);
  updateHeroMotion();

  const revealTargets = document.querySelectorAll(".section, .offer-strip, .card, .price-card, .work-card, .step, .faq-item, .stat, .calculator-result, .service-band, .interactive-panel, .filter-panel");
  revealTargets.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.setProperty("--reveal-delay", `${Math.min((index % 6) * 55, 275)}ms`);
  });

  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach((element) => observer.observe(element));
  } else {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
  }

  const animateNumbers = (root) => {
    if (reduceMotion.matches) return;
    const numbers = (root || document).querySelectorAll("[data-count-to], .score-grid .stat strong");
    numbers.forEach((node) => {
      const finalValue = Number(node.dataset.countTo || node.textContent);
      if (!Number.isFinite(finalValue) || node.dataset.counted === "true") return;
      node.dataset.counted = "true";
      const duration = 700;
      const start = performance.now();
      const tick = (now) => {
        const progressValue = Math.min(1, (now - start) / duration);
        node.textContent = String(Math.round(finalValue * progressValue));
        if (progressValue < 1) {
          window.requestAnimationFrame(tick);
        }
      };
      window.requestAnimationFrame(tick);
    });
  };

  const bindButtonPress = (button) => {
    if (button.dataset.pressBound === "true") return;
    button.dataset.pressBound = "true";
    button.addEventListener("pointerdown", (event) => {
      const rect = button.getBoundingClientRect();
      button.style.setProperty("--press-x", `${event.clientX - rect.left}px`);
      button.style.setProperty("--press-y", `${event.clientY - rect.top}px`);
      button.classList.remove("is-pressing");
      void button.offsetWidth;
      button.classList.add("is-pressing");
    });
    button.addEventListener("animationend", () => {
      button.classList.remove("is-pressing");
    });
  };

  document.querySelectorAll(".button").forEach((button) => {
    bindButtonPress(button);
  });

  const flashElement = (element, className) => {
    if (!element || reduceMotion.matches) return;
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
    window.setTimeout(() => element.classList.remove(className), 620);
  };

  const motionSurfaces = document.querySelectorAll(".card, .price-card, .work-card, .step, .faq-item, .form-panel, .calculator-result, .interactive-panel, .filter-panel");
  motionSurfaces.forEach((surface) => {
    surface.classList.add("motion-surface");
    if (reduceMotion.matches || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let frame = 0;
    surface.addEventListener("pointermove", (event) => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const rect = surface.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        const rotateY = ((x - 50) / 50) * 2.6;
        const rotateX = ((50 - y) / 50) * 2.2;
        surface.style.setProperty("--mx", `${x}%`);
        surface.style.setProperty("--my", `${y}%`);
        surface.style.setProperty("--rx", `${rotateX}deg`);
        surface.style.setProperty("--ry", `${rotateY}deg`);
      });
    });
    surface.addEventListener("pointerleave", () => {
      window.cancelAnimationFrame(frame);
      surface.style.setProperty("--rx", "0deg");
      surface.style.setProperty("--ry", "0deg");
    });
  });

  const priceCards = Array.from(document.querySelectorAll(".price-card"));
  if (priceCards.length) {
    const selectPriceCard = (card) => {
      priceCards.forEach((item) => {
        item.classList.toggle("is-selected-price", item === card);
      });
    };
    selectPriceCard(document.querySelector(".price-card.featured") || priceCards[0]);
    priceCards.forEach((card) => {
      card.addEventListener("pointerenter", () => selectPriceCard(card));
      card.addEventListener("focusin", () => selectPriceCard(card));
      card.addEventListener("click", (event) => {
        selectPriceCard(card);
        if (!event.target.closest("a, button")) {
          flashElement(card, "is-card-pulse");
        }
      });
    });
  }

  const sections = Array.from(document.querySelectorAll("main > section"));
  if (sections.length > 3) {
    const sectionRail = document.createElement("nav");
    sectionRail.className = "section-rail";
    sectionRail.setAttribute("aria-label", "Page section navigation");
    sections.forEach((section, index) => {
      if (!section.id) {
        section.id = `section-${index + 1}`;
      }
      const label = section.querySelector("h2, h1, .eyebrow");
      const button = document.createElement("a");
      button.href = `#${section.id}`;
      button.className = "section-rail-dot";
      button.dataset.label = label ? label.textContent.trim().slice(0, 52) : `Section ${index + 1}`;
      button.setAttribute("aria-label", button.dataset.label);
      sectionRail.append(button);
    });
    document.body.append(sectionRail);

    if ("IntersectionObserver" in window) {
      const railLinks = Array.from(sectionRail.querySelectorAll("a"));
      const railObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            sections.forEach((section) => {
              section.classList.toggle("is-current", section === entry.target);
            });
            railLinks.forEach((link) => {
              link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
            });
          }
        });
      }, { rootMargin: "-38% 0px -52% 0px", threshold: 0.01 });
      sections.forEach((section) => railObserver.observe(section));
    }
  }

  const processSteps = Array.from(document.querySelectorAll(".process .step"));
  if (processSteps.length && !reduceMotion.matches) {
    let activeStep = 0;
    processSteps[activeStep].classList.add("is-active-step");
    window.setInterval(() => {
      activeStep = (activeStep + 1) % processSteps.length;
      processSteps.forEach((step, index) => {
        step.classList.toggle("is-active-step", index === activeStep);
      });
    }, 2200);
  }

  const projectFilters = Array.from(document.querySelectorAll("[data-project-filter]"));
  const projectCards = Array.from(document.querySelectorAll("[data-project-card]"));
  if (projectFilters.length && projectCards.length) {
    const filterHost = projectFilters[0].closest(".filter-bar") || projectFilters[0].parentElement;
    const filterCount = document.createElement("p");
    filterCount.className = "filter-result-count";
    filterCount.setAttribute("aria-live", "polite");
    if (filterHost) {
      filterHost.insertAdjacentElement("afterend", filterCount);
    }
    const updateProjectCount = (filter) => {
      let visible = 0;
      projectCards.forEach((card) => {
        const type = card.dataset.type || "";
        const isVisible = filter === "all" || type.includes(filter);
        card.hidden = !isVisible;
        card.classList.toggle("is-filtered-in", isVisible);
        if (isVisible) visible += 1;
      });
      filterCount.textContent = `${visible} project${visible === 1 ? "" : "s"} shown.`;
    };
    projectFilters.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));
      button.addEventListener("click", () => {
        const filter = button.dataset.projectFilter;
        projectFilters.forEach((item) => {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        flashElement(button, "is-choice-flash");
        updateProjectCount(filter);
      });
    });
    const activeProjectFilter = projectFilters.find((button) => button.classList.contains("is-active")) || projectFilters[0];
    updateProjectCount(activeProjectFilter.dataset.projectFilter || "all");
  }

  const industrySearch = document.querySelector("#industry-search");
  const industryCards = document.querySelectorAll("[data-industry-card]");
  const industryCount = document.querySelector("#industry-count");
  if (industrySearch && industryCards.length) {
    industrySearch.addEventListener("input", () => {
      const query = industrySearch.value.trim().toLowerCase();
      let visible = 0;
      industryCards.forEach((card) => {
        const match = !query || (card.dataset.search || "").includes(query);
        card.hidden = !match;
        if (match) visible += 1;
      });
      if (industryCount) {
        industryCount.textContent = `${visible} industry page${visible === 1 ? "" : "s"} matched.`;
      }
    });
  }

  const pathChoices = document.querySelectorAll("[data-path-choice]");
  const pathOutput = document.querySelector("#path-choice-output");
  const routeContent = {
    website: {
      title: "Static HTML/CSS/JS Website",
      copy: "Best when the business needs clearer services, faster loading, SEO basics and an enquiry path from day one.",
      primary: ["Estimate website", "estimate.html#audit-estimator-form"],
      secondary: ["View web design", "web-design.html"]
    },
    app: {
      title: "App Design Prototype",
      copy: "Best when the idea needs screens, user journeys and scope before spending on a full app build.",
      primary: ["Estimate app", "estimate.html#audit-estimator-form"],
      secondary: ["View app design", "app-design.html"]
    },
    seo: {
      title: "SEO Foundations",
      copy: "Best when the website exists but needs service pages, metadata, technical fixes and organic search structure.",
      primary: ["Estimate SEO", "estimate.html#audit-estimator-form"],
      secondary: ["View SEO", "seo.html"]
    },
    care: {
      title: "Hosting and Website Care",
      copy: "Best when the site needs hosting, SSL, form checks, uptime checks and small monthly improvements.",
      primary: ["Estimate care", "estimate.html#audit-estimator-form"],
      secondary: ["View hosting", "website-care.html"]
    }
  };

  pathChoices.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));
    button.addEventListener("click", () => {
      const content = routeContent[button.dataset.pathChoice] || routeContent.website;
      pathChoices.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      flashElement(button, "is-choice-flash");
      if (pathOutput) {
        pathOutput.classList.remove("is-swapping");
        void pathOutput.offsetWidth;
        pathOutput.classList.add("is-swapping");
        pathOutput.innerHTML = `<span>Recommended first step</span><strong>${content.title}</strong><p class="muted">${content.copy}</p><div class="hero-actions"><a class="button" href="${content.primary[1]}">${content.primary[0]}</a><a class="button secondary" href="${content.secondary[1]}">${content.secondary[0]}</a></div>`;
        flashElement(pathOutput, "is-output-pulse");
        pathOutput.querySelectorAll(".button").forEach((newButton) => bindButtonPress(newButton));
      }
    });
  });

  document.querySelectorAll(".faq-item").forEach((item, index) => {
    const heading = item.querySelector("h3");
    if (!heading || item.dataset.faqReady === "true") return;
    item.dataset.faqReady = "true";
    const panelId = `faq-panel-${index + 1}`;
    const trigger = document.createElement("button");
    trigger.className = "faq-trigger";
    trigger.type = "button";
    trigger.setAttribute("aria-expanded", index === 0 ? "true" : "false");
    trigger.setAttribute("aria-controls", panelId);
    trigger.innerHTML = `<span>${heading.textContent}</span><span class="faq-symbol" aria-hidden="true">+</span>`;
    heading.textContent = "";
    heading.append(trigger);
    const panel = document.createElement("div");
    panel.className = "faq-panel";
    panel.id = panelId;
    while (heading.nextSibling) {
      panel.append(heading.nextSibling);
    }
    item.append(panel);
    item.classList.toggle("is-open", index === 0);
    panel.hidden = index !== 0;
    trigger.addEventListener("click", () => {
      const isOpen = item.classList.toggle("is-open");
      item.classList.add("is-opening");
      window.setTimeout(() => item.classList.remove("is-opening"), 360);
      trigger.setAttribute("aria-expanded", String(isOpen));
      panel.hidden = !isOpen;
    });
  });

  document.querySelectorAll("input, select, textarea").forEach((field) => {
    const wrapper = field.closest(".field");
    const updateFieldState = () => {
      if (!wrapper) return;
      const hasValue = field.type === "checkbox" ? field.checked : Boolean(field.value && field.value.trim ? field.value.trim() : field.value);
      wrapper.classList.toggle("is-filled", hasValue);
      wrapper.classList.toggle("is-focused", document.activeElement === field);
    };
    field.addEventListener("focus", updateFieldState);
    field.addEventListener("blur", updateFieldState);
    field.addEventListener("input", updateFieldState);
    field.addEventListener("change", updateFieldState);
    updateFieldState();
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
    const businessInput = auditForm.querySelector("#audit-business");
    const goalInput = auditForm.querySelector("#audit-goal");
    const budgetInput = auditForm.querySelector("#audit-budget");
    const urgencyInput = auditForm.querySelector("#audit-urgency");
    const pagesInput = auditForm.querySelector("#audit-pages");
    const contentInput = auditForm.querySelector("#audit-content");
    const supportInput = auditForm.querySelector("#audit-support");
    const runAuditButton = auditForm.querySelector("#run-audit");
    const estimateOnlyButton = auditForm.querySelector("#estimate-only");
    const wizardSteps = Array.from(auditForm.querySelectorAll("[data-wizard-step]"));
    const wizardPrev = auditForm.querySelector("#wizard-prev");
    const wizardNext = auditForm.querySelector("#wizard-next");
    const wizardStepLabel = auditForm.querySelector("#wizard-step-label");
    const wizardProgressBar = auditForm.querySelector("#wizard-progress-bar");
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
    let wizardIndex = 0;
    let lastSummary = "";
    let lastAuditContext = null;
    let wizardMarkers = [];

    if (wizardSteps.length) {
      const wizardProgress = auditForm.querySelector(".wizard-progress");
      const markerWrap = document.createElement("div");
      markerWrap.className = "wizard-markers";
      wizardMarkers = wizardSteps.map((step, index) => {
        const marker = document.createElement("button");
        marker.type = "button";
        marker.className = "wizard-marker";
        marker.setAttribute("aria-label", `Go to estimator step ${index + 1}`);
        marker.addEventListener("click", () => {
          if (index <= wizardIndex || validateWizardStep()) {
            wizardIndex = index;
            updateWizard();
          }
        });
        markerWrap.append(marker);
        return marker;
      });
      if (wizardProgress) {
        wizardProgress.append(markerWrap);
      }
    }

    const platformLabels = {
      auto: "Not sure yet",
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

    const businessLabels = {
      service: "Local service business",
      trade: "Trade or contractor",
      health: "Health, wellbeing or beauty",
      food: "Restaurant, cafe or hospitality",
      professional: "Professional services",
      ecommerce: "Ecommerce or product brand",
      app: "App, SaaS or digital product",
      charity: "Charity or community project"
    };

    const budgetLabels = {
      starter: "Smallest sensible option",
      standard: "Strong small-business build",
      growth: "Growth site or app prototype",
      not_sure: "Need advice"
    };

    const urgencyLabels = {
      normal: "Normal launch",
      fast: "Fast launch",
      urgent: "Urgent repair or launch"
    };

    const contentLabels = {
      ready: "Usable copy and images ready",
      rough: "Rough notes ready",
      none: "Copywriting help needed"
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
      [runAuditButton, estimateOnlyButton, wizardPrev, wizardNext].forEach((button) => {
        if (button) {
          button.disabled = isBusy;
        }
      });
      if (runAuditButton) {
        runAuditButton.textContent = isBusy ? "Generating estimate..." : "Generate detailed estimate";
      }
    };

    const updateWizard = () => {
      if (!wizardSteps.length) return;
      wizardSteps.forEach((step, index) => {
        step.hidden = index !== wizardIndex;
        step.classList.toggle("is-current-step", index === wizardIndex);
        step.classList.toggle("is-complete-step", index < wizardIndex);
      });
      const isFirst = wizardIndex === 0;
      const isLast = wizardIndex === wizardSteps.length - 1;
      if (wizardPrev) {
        wizardPrev.hidden = isFirst;
      }
      if (wizardNext) {
        wizardNext.hidden = isLast;
      }
      if (runAuditButton) {
        runAuditButton.hidden = !isLast;
      }
      if (estimateOnlyButton) {
        estimateOnlyButton.hidden = !isLast;
      }
      if (wizardStepLabel) {
        wizardStepLabel.textContent = `Step ${wizardIndex + 1} of ${wizardSteps.length}`;
      }
      if (wizardProgressBar) {
        wizardProgressBar.style.width = `${((wizardIndex + 1) / wizardSteps.length) * 100}%`;
      }
      wizardMarkers.forEach((marker, index) => {
        marker.classList.toggle("is-active", index === wizardIndex);
        marker.classList.toggle("is-complete", index < wizardIndex);
        marker.setAttribute("aria-current", index === wizardIndex ? "step" : "false");
      });
      flashElement(wizardSteps[wizardIndex], "is-card-pulse");
    };

    const validateWizardStep = () => {
      if (!wizardSteps.length) return true;
      const fields = wizardSteps[wizardIndex].querySelectorAll("input, select, textarea");
      return Array.from(fields).every((field) => field.reportValidity());
    };

    if (wizardNext) {
      wizardNext.addEventListener("click", () => {
        if (!validateWizardStep()) return;
        wizardIndex = Math.min(wizardSteps.length - 1, wizardIndex + 1);
        updateWizard();
      });
    }

    if (wizardPrev) {
      wizardPrev.addEventListener("click", () => {
        wizardIndex = Math.max(0, wizardIndex - 1);
        updateWizard();
      });
    }

    updateWizard();

    const normalizeAuditUrl = (rawValue, allowEmpty) => {
      let value = rawValue.trim();
      if (!value && allowEmpty) {
        return "";
      }
      if (!value) {
        throw new Error("Add a website URL or leave it blank and use the quick estimate.");
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
      businessType: businessInput ? businessInput.value : "service",
      goal: goalInput ? goalInput.value : "more_enquiries",
      budget: budgetInput ? budgetInput.value : "starter",
      urgency: urgencyInput ? urgencyInput.value : "normal",
      pages: pagesInput ? Number(pagesInput.value) : 5,
      content: contentInput ? contentInput.value : "ready",
      support: supportInput ? supportInput.value : "none",
      addons: Array.from(auditForm.querySelectorAll("[name='addon']:checked")).map((field) => field.value)
    });

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
      if (audit.basic) {
        payloads.push(audit.basic);
      }
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
        return { key: "static", label: platformLabels.static, source: "No CMS or SPA signal selected" };
      }
      if (audit && audit.basic) {
        return { key: "static", label: platformLabels.static, source: "No CMS or SPA signal selected" };
      }
      return { key: "unknown", label: platformLabels.unknown, source: "Guided estimate" };
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
      animateNumbers(scoreGrid);
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
        estimate.reasons.push("SPA route, metadata and JavaScript performance planning");
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
      if (inputs.content === "rough" && !inputs.addons.includes("copywriting")) {
        estimate.min += 90;
        estimate.max += 220;
        estimate.reasons.push("Copy cleanup from rough notes");
      }

      if (inputs.content === "none" && !inputs.addons.includes("copywriting")) {
        estimate.min += 180;
        estimate.max += 420;
        estimate.reasons.push("Conversion copywriting from scratch");
      }

      if (inputs.urgency === "fast") {
        estimate.min += 120;
        estimate.max += 320;
        estimate.reasons.push("Fast launch scheduling");
      }

      if (inputs.urgency === "urgent") {
        estimate.min += 250;
        estimate.max += 650;
        estimate.reasons.push("Urgent repair or launch priority");
      }

      if (inputs.businessType === "ecommerce") {
        estimate.min += 250;
        estimate.max += 900;
        estimate.reasons.push("Product, checkout and tracking complexity");
      }

      if (inputs.businessType === "app" && inputs.goal !== "app" && !inputs.addons.includes("app_design")) {
        estimate.min += 299;
        estimate.max += 799;
        estimate.reasons.push("Product landing page and app scope planning");
      }

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

      if (inputs.budget === "starter" && inputs.goal !== "app" && estimate.max > 999) {
        estimate.reasons.push("Starter budget selected, so scope should be phased before build.");
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
        priorities.push("Use the free human review before final scope so Octopye can confirm the fastest route.");
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
      if (inputs.content === "none") {
        priorities.push("Create conversion copy before design so the page can sell the right offer.");
      }
      if (inputs.urgency === "urgent") {
        priorities.push("Separate urgent fixes from nice-to-have improvements so the first launch stays focused.");
      }
      if (inputs.goal === "more_enquiries") {
        priorities.push("Make the enquiry path obvious above the fold and track every form or booking click.");
      }
      if (!priorities.length) {
        priorities.push("Focus on offer clarity, page copy and lead capture before spending on wider marketing.");
      }
      return priorities;
    };

    const getRecommendations = (inputs, platform, estimate, audit, blockedMessage) => {
      const recommendations = [];
      if (blockedMessage) {
        recommendations.push("Start with the free human website review so Octopye can confirm the scope before you pay.");
      }
      recommendations.push(`${estimate.label}: ${formatMoney(estimate.min)} - ${formatMoney(estimate.max)} guide range.`);
      if (estimate.monthlyMin || estimate.monthlyMax) {
        recommendations.push(`Optional support: ${formatMoney(estimate.monthlyMin)} - ${formatMoney(estimate.monthlyMax)} per month.`);
      }
      if (inputs.budget === "starter" && estimate.min > 599) {
        recommendations.push("Because you chose the smallest sensible option, phase the work into audit, lead page, then wider website.");
      }
      if (inputs.budget === "growth") {
        recommendations.push("Growth budget selected, so include SEO pages, tracking and support instead of only a visual refresh.");
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
      const methodLine = `Estimate method: guided questions${blockedMessage ? ` (${blockedMessage})` : ""}`;
      const monthlyLine = estimate.monthlyMin || estimate.monthlyMax
        ? `Monthly support: ${formatMoney(estimate.monthlyMin)} - ${formatMoney(estimate.monthlyMax)} per month`
        : "Monthly support: not included";
      return [
        "Octopye project estimate summary",
        urlLine,
        methodLine,
        `Business type: ${businessLabels[inputs.businessType] || inputs.businessType}`,
        `Goal: ${goalLabels[inputs.goal] || inputs.goal}`,
        `Budget comfort: ${budgetLabels[inputs.budget] || inputs.budget}`,
        `Timeline: ${urgencyLabels[inputs.urgency] || inputs.urgency}`,
        `Content readiness: ${contentLabels[inputs.content] || inputs.content}`,
        `Selected setup: ${platform.label} (${platform.source})`,
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
        auditSummary.textContent = "Guided estimate ready. The guide price is based on platform choice, pages, goals, timeline, content readiness and selected extras.";
      }
      updateBookingLink(inputs, estimate);
      lastAuditContext = { inputs, audit, blockedMessage };
    };

    const runManualEstimate = (message) => {
      try {
        const inputs = readAuditInputs(true);
        renderAuditContext(inputs, null, message || "Generated from guided questions.");
        setAuditStatus("Estimate ready. You can send it to Octopye for a fixed recommendation.", "success");
      } catch (error) {
        setAuditStatus(error.message, "error");
      }
    };

    auditForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!auditForm.reportValidity()) return;
      setBusy(true);
      setAuditStatus("Building your estimate from the project details...", "");
      window.setTimeout(() => {
        runManualEstimate("Generated from guided questions.");
        setBusy(false);
      }, reduceMotion.matches ? 0 : 260);
    });

    if (estimateOnlyButton) {
      estimateOnlyButton.addEventListener("click", () => {
        runManualEstimate("Quick estimate generated from guided questions.");
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
          runManualEstimate("Generated before copying.");
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
            copyStatus.textContent = "Estimate summary copied.";
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
