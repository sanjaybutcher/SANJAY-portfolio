/* =========================================================
   SANJAY P — PORTFOLIO SCRIPTS
   Handles: mobile nav, active link highlighting, scroll reveal,
   animated KPI counters, back-to-top, contact form validation.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close mobile menu after clicking a link
    navMenu.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Active link highlighting on scroll ---------- */
  const sections = document.querySelectorAll("main section[id], main[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const highlightNav = () => {
    let currentId = "home";
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const targetId = link.getAttribute("href").replace("#", "");
      link.classList.toggle("active", targetId === currentId);
    });
  };

  window.addEventListener("scroll", highlightNav, { passive: true });
  highlightNav();

  /* ---------- Scroll reveal animations ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: reveal everything immediately
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------- Animated KPI counters in hero ---------- */
  const kpiValues = document.querySelectorAll(".kpi-value");

  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 900;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };
    requestAnimationFrame(step);
  };

  if (kpiValues.length) {
    if ("IntersectionObserver" in window) {
      const kpiObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      kpiValues.forEach((el) => kpiObserver.observe(el));
    } else {
      kpiValues.forEach(animateCount);
    }
  }

  /* ---------- Back to top button ---------- */
  const backToTop = document.getElementById("backToTop");

  if (backToTop) {
    window.addEventListener(
      "scroll",
      () => {
        backToTop.classList.toggle("visible", window.scrollY > 500);
      },
      { passive: true }
    );

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById("contactForm");

  if (form) {
    const fields = {
      name: {
        input: document.getElementById("name"),
        error: document.getElementById("nameError"),
        validate: (v) => v.trim().length >= 2,
        message: "Please enter your name (at least 2 characters).",
      },
      email: {
        input: document.getElementById("email"),
        error: document.getElementById("emailError"),
        validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
        message: "Please enter a valid email address.",
      },
      subject: {
        input: document.getElementById("subject"),
        error: document.getElementById("subjectError"),
        validate: (v) => v.trim().length >= 3,
        message: "Please enter a subject (at least 3 characters).",
      },
      message: {
        input: document.getElementById("message"),
        error: document.getElementById("messageError"),
        validate: (v) => v.trim().length >= 10,
        message: "Please enter a message (at least 10 characters).",
      },
    };

    const validateField = (field) => {
      const value = field.input.value;
      const valid = field.validate(value);
      field.input.classList.toggle("invalid", !valid);
      field.error.textContent = valid ? "" : field.message;
      field.input.setAttribute("aria-invalid", String(!valid));
      return valid;
    };

    Object.values(fields).forEach((field) => {
      field.input.addEventListener("blur", () => validateField(field));
      field.input.addEventListener("input", () => {
        if (field.input.classList.contains("invalid")) validateField(field);
      });
    });

    const statusEl = document.getElementById("formStatus");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      let allValid = true;
      Object.values(fields).forEach((field) => {
        if (!validateField(field)) allValid = false;
      });

      if (!allValid) {
        statusEl.textContent = "Please fix the highlighted fields above.";
        statusEl.style.color = "#f87171";
        return;
      }

      // No backend is connected — this is where a real submission would go.
      // Example integration point:
      // fetch("https://formspree.io/f/yourFormId", { method: "POST", body: new FormData(form) });

      statusEl.textContent = "Thanks! This form isn't connected to a backend yet, so nothing was actually sent — see the note above.";
      statusEl.style.color = "var(--accent-2)";
      form.reset();
      Object.values(fields).forEach((field) => {
        field.input.classList.remove("invalid");
        field.error.textContent = "";
      });
    });
  }

});
