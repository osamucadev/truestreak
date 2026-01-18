// ============================================================================
// METODOLOGIA TRUESTREAK - JAVASCRIPT
// ============================================================================

(function () {
  "use strict";

  // ============================================================================
  // TABLE OF CONTENTS TOGGLE (Mobile)
  // ============================================================================

  function initTOCToggle() {
    const tocToggle = document.querySelector(".toc-toggle");
    const tocList = document.querySelector(".toc-list");

    if (!tocToggle || !tocList) return;

    tocToggle.addEventListener("click", function () {
      const isExpanded = this.getAttribute("aria-expanded") === "true";
      const newState = !isExpanded;

      this.setAttribute("aria-expanded", newState);
      tocList.classList.toggle("collapsed", !newState);
    });

    // Initialize collapsed state on mobile
    function checkTOCState() {
      if (window.innerWidth < 768) {
        tocList.classList.add("collapsed");
        tocToggle.setAttribute("aria-expanded", "false");
      } else {
        tocList.classList.remove("collapsed");
        tocToggle.setAttribute("aria-expanded", "true");
      }
    }

    checkTOCState();
    window.addEventListener("resize", checkTOCState);
  }

  // ============================================================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================================================

  function initSmoothScroll() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");

        // Ignore empty anchors
        if (href === "#" || href === "#!") return;

        const target = document.querySelector(href);

        if (target) {
          e.preventDefault();

          const offsetTop = target.offsetTop - 20;

          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });

          // Update focus for accessibility
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });

          // Update URL without jumping
          if (history.pushState) {
            history.pushState(null, null, href);
          }
        }
      });
    });
  }

  // ============================================================================
  // BACK TO TOP BUTTON
  // ============================================================================

  function initBackToTop() {
    const backToTopButton = document.querySelector(".back-to-top");

    if (!backToTopButton) return;

    // Show/hide button based on scroll position
    function toggleBackToTop() {
      if (window.scrollY > 300) {
        backToTopButton.classList.add("visible");
      } else {
        backToTopButton.classList.remove("visible");
      }
    }

    // Throttle scroll events
    let ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          toggleBackToTop();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Click handler
    backToTopButton.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });

    // Initial check
    toggleBackToTop();
  }

  // ============================================================================
  // HIGHLIGHT ACTIVE TOC LINK ON SCROLL
  // ============================================================================

  function initTOCHighlight() {
    const tocLinks = document.querySelectorAll(".toc-list a");
    const sections = document.querySelectorAll(".section");

    if (!tocLinks.length || !sections.length) return;

    function highlightTOC() {
      let currentSection = "";
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          currentSection = section.getAttribute("id");
        }
      });

      tocLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentSection}`) {
          link.classList.add("active");
        }
      });
    }

    // Throttle scroll events
    let ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          highlightTOC();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Initial check
    highlightTOC();
  }

  // ============================================================================
  // KEYBOARD NAVIGATION ENHANCEMENT
  // ============================================================================

  function initKeyboardNav() {
    // Allow keyboard users to close TOC on mobile
    const tocToggle = document.querySelector(".toc-toggle");

    if (tocToggle) {
      tocToggle.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.click();
        }
      });
    }

    // Escape key to close TOC on mobile
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        const tocList = document.querySelector(".toc-list");
        if (tocList && window.innerWidth < 768) {
          tocList.classList.add("collapsed");
          tocToggle.setAttribute("aria-expanded", "false");
        }
      }
    });
  }

  // ============================================================================
  // INITIALIZE ON DOM READY
  // ============================================================================

  function init() {
    initTOCToggle();
    initSmoothScroll();
    initBackToTop();
    initTOCHighlight();
    initKeyboardNav();
  }

  // Run when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
