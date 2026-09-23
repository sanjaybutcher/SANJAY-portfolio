document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const navItems = document.querySelectorAll(".nav-link");
  const siteHeader = document.getElementById("siteHeader");
  const backToTop = document.getElementById("backToTop");
  const currentYear = document.getElementById("currentYear");

  /* ================= CURRENT YEAR ================= */

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* ================= MOBILE NAVIGATION ================= */

  function closeNavigation() {
    navToggle.classList.remove("open");
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navItems.forEach((link) => {
    link.addEventListener("click", closeNavigation);
  });

  document.addEventListener("click", (event) => {
    const clickedInsideNav =
      navLinks.contains(event.target) ||
      navToggle.contains(event.target);

    if (!clickedInsideNav) {
      closeNavigation();
    }
  });

  /* ================= HEADER SCROLL STATE ================= */

  function updateHeader() {
    siteHeader.classList.toggle("scrolled", window.scrollY > 20);
    backToTop.classList.toggle("visible", window.scrollY > 500);
  }

  window.addEventListener("scroll", updateHeader);
  updateHeader();

  /* ================= ACTIVE NAV LINK ================= */

  const sections = document.querySelectorAll("main section[id]");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navItems.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`
            );
          });
        }
      });
    },
    {
      rootMargin: "-35% 0px -55% 0px",
      threshold: 0
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  /* ================= SCROLL REVEAL ================= */

  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));

  /* ================= COUNTER ANIMATION ================= */

  const counters = document.querySelectorAll("[data-count]");

  function animateCounter(element) {
    const target = Number(element.dataset.count);
    const suffix = element.dataset.suffix || "";
    const prefix = element.dataset.prefix || "";
    const pad = Number(element.dataset.pad || 0);
    const duration = 1100;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress =
        1 - Math.pow(1 - progress, 3);

      const currentValue = Math.floor(target * easedProgress);
      const formattedValue = String(currentValue).padStart(pad, "0");

      element.textContent =
        `${prefix}${formattedValue}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent =
          `${prefix}${String(target).padStart(pad, "0")}${suffix}`;
      }
    }

    requestAnimationFrame(updateCounter);
  }

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.6
    }
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  /* ================= PROJECT FILTERS ================= */

  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter;

      filterButtons.forEach((item) => {
        item.classList.toggle("active", item === button);
      });

      projectCards.forEach((card) => {
        const categories = card.dataset.category || "";
        const shouldShow =
          selectedFilter === "all" ||
          categories.includes(selectedFilter);

        card.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });

  /* ================= BACK TO TOP ================= */

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  /* ================= CONTACT FORM ================= */

  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const subject = document.getElementById("subject");
    const message = document.getElementById("message");

    const fields = [name, email, subject, message];
    let isValid = true;

    fields.forEach((field) => {
      const value = field.value.trim();
      const invalid = value.length === 0;

      field.classList.toggle("invalid", invalid);

      if (invalid) {
        isValid = false;
      }
    });

    if (!isValid) {
      formStatus.textContent = "Please fill in all fields.";
      formStatus.style.color = "#ff7a9c";
      return;
    }

    const recipient = "sanjayp.analytics@gmail.com";

    const emailSubject =
      `Portfolio enquiry from ${name.value.trim()} — ${subject.value.trim()}`;

    const emailBody =
      `Hello Sanjay,%0D%0A%0D%0A` +
      `Name: ${encodeURIComponent(name.value.trim())}%0D%0A` +
      `Email: ${encodeURIComponent(email.value.trim())}%0D%0A%0D%0A` +
      `${encodeURIComponent(message.value.trim())}`;

    const mailtoUrl =
      `mailto:${recipient}` +
      `?subject=${encodeURIComponent(emailSubject)}` +
      `&body=${emailBody}`;

    formStatus.textContent =
      "Your email application is opening...";

    formStatus.style.color = "#c5f36b";

    window.location.href = mailtoUrl;
  });

  fieldsRemoveInvalidState();

  function fieldsRemoveInvalidState() {
    const formFields = contactForm.querySelectorAll("input, textarea");

    formFields.forEach((field) => {
      field.addEventListener("input", () => {
        if (field.value.trim() !== "") {
          field.classList.remove("invalid");
        }
      });
    });
  }
});
