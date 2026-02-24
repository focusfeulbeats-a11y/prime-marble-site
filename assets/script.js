<script>
(function () {
  /* =========================
     LIGHTBOX (gallery images)
     ========================= */
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
    });
  }

  /* =========================
     BEFORE / AFTER SLIDER
     Requires:
     - .ba-wrap
     - img.ba-after
     - .ba-slider
     ========================= */
  const wrap = document.querySelector(".ba-wrap");
  if (wrap) {
    const after = wrap.querySelector(".ba-after");
    const slider = wrap.querySelector(".ba-slider");

    // If missing required elements, do nothing
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

      // Start at middle
      const r = wrap.getBoundingClientRect();
      setFromClientX(r.left + r.width / 2);

      // Mouse move
      wrap.addEventListener("mousemove", (e) => setFromClientX(e.clientX));

      // Touch drag
      wrap.addEventListener(
        "touchmove",
        (e) => {
          if (e.touches && e.touches[0]) setFromClientX(e.touches[0].clientX);
        },
        { passive: true }
      );

      // Click / tap to jump
      wrap.addEventListener("click", (e) => setFromClientX(e.clientX));
    }
  }

  /* =========================
     REVEAL ON SCROLL
     ========================= */
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
    // Fallback for older browsers
    els.forEach((el) => el.classList.add("show"));
  }
})();
</script>