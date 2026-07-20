(function () {
  /* MOBILE NAV TOGGLE */
  const toggle = document.querySelector(".navToggle");
  const menu = document.querySelector(".menuWrap");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
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

  /* LIGHTBOX (gallery images) */
  const lb = document.getElementById("lightbox");
  const lbImg = lb ? lb.querySelector("img") : null;
  function openLightbox(src, alt) {
    if (!lb || !lbImg) return;
    lbImg.src = src;
    lbImg.alt = alt || "Project photo";
    lb.style.display = "flex";
    lb.setAttribute("aria-hidden", "false");
  }
  function closeLightbox() {
    if (!lb || !lbImg) return;
    lb.style.display = "none";
    lbImg.src = "";
    lb.setAttribute("aria-hidden", "true");
  }
  if (lb) {
    lb.addEventListener("click", closeLightbox);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
    });
    document.querySelectorAll(".gItem img").forEach((img) => {
      img.addEventListener("click", () => {
        openLightbox(img.getAttribute("data-full") || img.src, img.alt);
      });
      img.addEventListener("keydown", (e) => {
        if (e.key === "Enter") openLightbox(img.getAttribute("data-full") || img.src, img.alt);
      });
    });
  }

  /* WORK PAGE FILTERS */
  const filterBtns = document.querySelectorAll(".filterBtn");
  const galleryItems = document.querySelectorAll(".gallery .gItem");
  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const cat = btn.getAttribute("data-filter");
        galleryItems.forEach((item) => {
          const match = cat === "all" || item.getAttribute("data-cat") === cat;
          item.style.display = match ? "" : "none";
        });
      });
    });
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
