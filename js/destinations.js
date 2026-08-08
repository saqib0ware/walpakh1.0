/* WAL PAKH - DESTINATION FILTERS */
(function destinationFilters() {
  const buttons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll(".journey-card");
  const count = document.getElementById("journeyCount");
  const empty = document.getElementById("journeyEmpty");
  if (!buttons.length || !cards.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      let visible = 0;

      buttons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      cards.forEach((card) => {
        const matches = filter === "all" || card.dataset.category.split(" ").includes(filter);
        card.hidden = !matches;
        if (matches) visible += 1;
      });

      count.textContent = visible;
      empty.hidden = visible !== 0;
    });
  });
})();
