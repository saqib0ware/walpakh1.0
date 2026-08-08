/* ==================================================
   WAL PAKH — ANIMATIONS
   Handles: scroll-reveal ([data-reveal] elements),
   button ripple effect, testimonial auto-slider,
   gallery lightbox.
   ================================================== */

/* ---------- Scroll reveal ---------- */
(function scrollReveal() {
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  revealEls.forEach((el) => observer.observe(el));
})();

/* ---------- Button ripple effect ---------- */
(function buttonRipple() {
  const selector =
    ".primary-btn, .secondary-btn, .book-btn, .package-info button, .hotel-btn, .search-card button, .contact-form button, .newsletter-form button";

  document.querySelectorAll(selector).forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height);

      ripple.classList.add("ripple");
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 620);
    });
  });
})();

/* ---------- Testimonial auto-slider ---------- */
(function testimonialSlider() {
  const cards = document.querySelectorAll(".testimonial-card");
  const dots = document.querySelectorAll(".testimonial-dots button");
  if (!cards.length) return;

  let current = 0;
  let timer;

  function show(index) {
    cards.forEach((c, i) => c.classList.toggle("active", i === index));
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
    current = index;
  }

  function next() {
    show((current + 1) % cards.length);
  }

  function start() {
    timer = setInterval(next, 5500);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      clearInterval(timer);
      show(i);
      start();
    });
  });

  show(0);
  start();
})();

/* ---------- Gallery lightbox ---------- */
(function galleryLightbox() {
  const items = document.querySelectorAll(".gallery-item img");
  const lightbox = document.querySelector(".lightbox");
  if (!items.length || !lightbox) return;

  const lightboxImg = lightbox.querySelector("img");
  const closeBtn = lightbox.querySelector(".lightbox-close");

  items.forEach((img) => {
    img.addEventListener("click", () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add("active");
    });
  });

  function closeLightbox() {
    lightbox.classList.remove("active");
  }

  closeBtn?.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
})();
