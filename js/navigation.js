/* ==================================================
   WAL PAKH - NAVIGATION
   Handles: navbar scroll state, mobile menu toggle,
   and closing the mobile menu after navigation.
   ================================================== */

const navbar = document.querySelector(".navbar");
const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector("nav");
const menuClose = document.querySelector(".menu-close");

window.addEventListener("scroll", () => {
  navbar?.classList.toggle("scrolled", window.scrollY > 80);
});

if (menuBtn && nav) {
  function setMenuState(isOpen) {
    nav.classList.toggle("active", isOpen);
    navbar?.classList.toggle("menu-open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  }

  menuBtn.addEventListener("click", () => {
    setMenuState(!nav.classList.contains("active"));
  });

  menuClose?.addEventListener("click", () => setMenuState(false));

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  document.addEventListener("click", (event) => {
    const clickedInsideNav = nav.contains(event.target) || menuBtn.contains(event.target);
    if (!clickedInsideNav && nav.classList.contains("active")) setMenuState(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("active")) setMenuState(false);
  });
}
