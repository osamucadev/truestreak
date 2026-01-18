// script.js
(() => {
  "use strict";

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // =========================
  // Mobile menu
  // =========================
  const mobileBtn = qs(".mobile-menu-btn");
  const navLinks = qs(".nav-links");

  const setMenuState = (isOpen) => {
    if (!mobileBtn || !navLinks) return;

    navLinks.classList.toggle("active", isOpen);
    mobileBtn.classList.toggle("active", isOpen);
    mobileBtn.setAttribute("aria-expanded", String(isOpen));
  };

  const toggleMenu = () => {
    const isOpen = navLinks?.classList.contains("active");
    setMenuState(!isOpen);
  };

  if (mobileBtn && navLinks) {
    // Ensure ARIA baseline
    mobileBtn.setAttribute("aria-expanded", "false");
    mobileBtn.setAttribute("aria-controls", navLinks.id || "navLinks");

    // If navLinks has no id, give it one so aria-controls is valid
    if (!navLinks.id) navLinks.id = "navLinks";

    mobileBtn.addEventListener("click", toggleMenu);

    // Close menu when clicking a nav link
    qsa('a[href^="#"]', navLinks).forEach((a) => {
      a.addEventListener("click", () => setMenuState(false));
    });

    // Close on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenuState(false);
    });

    // Close if user clicks outside
    document.addEventListener("click", (e) => {
      if (!navLinks.classList.contains("active")) return;
      const clickedInside =
        navLinks.contains(e.target) || mobileBtn.contains(e.target);
      if (!clickedInside) setMenuState(false);
    });
  }

  // =========================
  // Navbar "scrolled" state
  // =========================
  const header = qs(".header");

  const updateHeaderScrolled = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 50);
  };

  updateHeaderScrolled();
  window.addEventListener("scroll", updateHeaderScrolled, { passive: true });

  // =========================
  // Back-to-top
  // =========================
  const backToTopWrap = qs(".back-to-top-wrap");
  const backToTopBtn = qs(".back-to-top");

  const setBackToTopVisible = (visible) => {
    if (!backToTopWrap) return;
    backToTopWrap.classList.toggle("visible", visible);
  };

  const updateBackToTop = () => {
    setBackToTopVisible(window.scrollY > 700);
  };

  updateBackToTop();
  window.addEventListener("scroll", updateBackToTop, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // =========================
  // Optional: highlight active section in TOC
  // - Works if you use links like: .toc a[href="#sec-..."]
  // - Safe to keep even if there is no TOC on the page
  // =========================
  const toc = qs(".toc");
  const tocLinks = toc ? qsa('a[href^="#"]', toc) : [];
  const sections = tocLinks
    .map((a) => {
      const id = a.getAttribute("href")?.slice(1);
      const el = id ? document.getElementById(id) : null;
      return el ? { a, el } : null;
    })
    .filter(Boolean);

  if (sections.length) {
    const clearActive = () =>
      tocLinks.forEach((a) => a.classList.remove("active"));
    const setActive = (activeLink) => {
      clearActive();
      activeLink.classList.add("active");
    };

    const io = new IntersectionObserver(
      (entries) => {
        // Pick the most visible intersecting section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0)
          )[0];

        if (!visible) return;

        const match = sections.find((s) => s.el === visible.target);
        if (match) setActive(match.a);
      },
      {
        root: null,
        threshold: [0.2, 0.35, 0.5, 0.65],
        rootMargin: "-20% 0px -65% 0px",
      }
    );

    sections.forEach((s) => io.observe(s.el));
  }
})();
