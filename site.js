
(function () {
  /* MOBILE NAV TOGGLE (full-screen overlay) */
  const toggle = document.querySelector(".navToggle");
  const menu = document.querySelector(".menuWrap");
  const closeBtn = document.querySelector(".navClose");

  function setMenu(open) {
    if (!menu || !toggle) return;
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      setMenu(!menu.classList.contains("open"));
    });
    if (closeBtn) {
      closeBtn.addEventListener("click", () => setMenu(false));
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenu(false);
    });
    menu.querySelectorAll("a:not(.drop > a)").forEach((a) => {
      a.addEventListener("click", () => setMenu(false));
    });
    document.querySelectorAll(".drop > a").forEach((a) => {
      a.addEventListener("click", (e) => {
        if (window.innerWidth <= 980) {
          e.preventDefault();
          a.parentElement.classList.toggle("open");
        }
      });
    });
  }

  /* ACTIVE NAV LINK */
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav a[href]").forEach((a) => {
    const href = a.getAttribute("href").split("/").pop();
    if (href === path) a.classList.add("active");
  });

  /* LIGHTBOX (gallery images) — accessible: aria-modal, focus trap, focus return */
  const lb = document.getElementById("lightbox");
  const lbImg = lb ? lb.querySelector("img") : null;
  let lbTrigger = null; // element that opened the lightbox, for focus return

  function getFocusable(container) {
    return Array.from(
      container.querySelectorAll('a[href], area[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable=true]')
    ).filter((el) => el.offsetParent !== null || el === lbImg);
  }

  function openLightbox(src, alt) {
    if (!lb || !lbImg) return;
    lbTrigger = document.activeElement;
    lbImg.src = src;
    lbImg.alt = alt || "Project photo";
    lb.style.display = "flex";
    lb.setAttribute("aria-hidden", "false");
    lb.setAttribute("aria-modal", "true");
    lbImg.setAttribute("tabindex", "0");
    // Move focus into the dialog
    setTimeout(() => lbImg.focus(), 0);
  }

  function closeLightbox() {
    if (!lb || !lbImg) return;
    lb.style.display = "none";
    lbImg.src = "";
    lb.setAttribute("aria-hidden", "true");
    lb.removeAttribute("aria-modal");
    // Return focus to the triggering element
    if (lbTrigger && typeof lbTrigger.focus === "function") {
      lbTrigger.focus();
      lbTrigger = null;
    }
  }

  if (lb) {
    // Close on backdrop click (not on the image itself)
    lb.addEventListener("click", (e) => {
      if (e.target === lb) closeLightbox();
    });
    // Escape + focus trap
    lb.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeLightbox();
        return;
      }
      if (e.key === "Tab") {
        const f = getFocusable(lb);
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
    // Wire up gallery triggers
    document.querySelectorAll(".gItem img").forEach((img) => {
      img.addEventListener("click", () => {
        openLightbox(img.getAttribute("data-full") || img.src, img.alt);
      });
      img.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(img.getAttribute("data-full") || img.src, img.alt);
        }
      });
    });
  }

  /* WORK PAGE FILTERS */
  const filterBtns = document.querySelectorAll(".filterBtn");
  const galleryItems = document.querySelectorAll(".gallery .gItem");
  function applyFilter(cat) {
    filterBtns.forEach((b) => b.classList.toggle("active", b.getAttribute("data-filter") === cat));
    galleryItems.forEach((item) => {
      const match = cat === "all" || item.getAttribute("data-cat") === cat;
      item.style.display = match ? "" : "none";
    });
  }
  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => applyFilter(btn.getAttribute("data-filter")));
    });
    const validCats = Array.from(filterBtns).map((b) => b.getAttribute("data-filter"));
    const initialCat = new URLSearchParams(window.location.search).get("cat");
    if (initialCat && validCats.includes(initialCat)) {
      applyFilter(initialCat);
    }
  }

  /* BEFORE / AFTER SLIDER */
  const wrap = document.querySelector(".ba-wrap");
  if (wrap) {
    const after = wrap.querySelector(".ba-after");
    const slider = wrap.querySelector(".ba-slider");
    if (after && slider) {
      function setFromClientX(clientX) {
        const rect = wrap.getBoundingClientRect();
        let x = clientX - rect.left;
        if (x < 0) x = 0;
        if (x > rect.width) x = rect.width;
        const pct = (x / rect.width) * 100;
        after.style.width = pct + "%";
        slider.style.left = pct + "%";
      }
      const r = wrap.getBoundingClientRect();
      setFromClientX(r.left + r.width / 2);
      wrap.addEventListener("mousemove", (e) => setFromClientX(e.clientX));
      wrap.addEventListener("click", (e) => setFromClientX(e.clientX));
      wrap.addEventListener(
        "touchmove",
        (e) => {
          if (e.touches && e.touches[0]) setFromClientX(e.touches[0].clientX);
        },
        { passive: true }
      );
    }
  }

  /* STAT COUNTERS */
  const statEls = document.querySelectorAll(".statNum[data-count]");
  function animateCount(el) {
    const target = parseInt(el.getAttribute("data-count"), 10) || 0;
    const suffix = el.getAttribute("data-suffix") || "";
    const dur = 1400;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (statEls.length && "IntersectionObserver" in window) {
    const statIo = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            animateCount(en.target);
            obs.unobserve(en.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    statEls.forEach((el) => statIo.observe(el));
  } else {
    statEls.forEach((el) => {
      el.textContent = (el.getAttribute("data-count") || "0") + (el.getAttribute("data-suffix") || "");
    });
  }

  /* REVEAL ON SCROLL */
  const els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) en.target.classList.add("show");
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
  } else {
    els.forEach((el) => el.classList.add("show"));
  }
})();

