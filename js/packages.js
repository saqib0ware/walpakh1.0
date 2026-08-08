/* WALPAKH package catalogue: package information is rendered only when supplied. */
(function packageCatalogue() {
  const packages = Array.isArray(window.WALPAKH_PACKAGES) ? window.WALPAKH_PACKAGES : [];
  const grid = document.getElementById('packageGrid');
  const count = document.getElementById('packageCount');
  const empty = document.getElementById('packageEmpty');
  const buttons = document.querySelectorAll('[data-package-filter]');
  if (!grid || !count || !empty) return;

  const copy = (value) => String(value)
    .replaceAll('â†’', '→')
    .replaceAll('â€™', '’')
    .replaceAll('â€œ', '“')
    .replaceAll('â€', '”')
    .replaceAll('â€“', '–')
    .replaceAll('Ã¢', 'â');

  const addText = (parent, tag, className, value) => {
    if (!value) return;
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = copy(value);
    parent.append(element);
  };

  const addList = (parent, title, values) => {
    if (!Array.isArray(values) || !values.length) return;
    const group = document.createElement('section');
    group.className = 'package-detail-group';
    addText(group, 'h3', '', title);
    const list = document.createElement('ul');
    values.forEach((item) => addText(list, 'li', '', item));
    group.append(list);
    parent.append(group);
  };

  const addFact = (parent, label, value) => {
    if (!value) return;
    const item = document.createElement('div');
    item.className = 'package-fact';
    addText(item, 'span', '', label);
    addText(item, 'strong', '', value);
    parent.append(item);
  };

  const render = (filter = 'all') => {
    const shown = packages.filter((pkg) => filter === 'all' || pkg.collection === filter);
    grid.replaceChildren();
    shown.forEach((pkg) => {
      const card = document.createElement('article');
      card.className = 'package-catalog-card';

      const top = document.createElement('div');
      top.className = 'package-catalog-top';
      addText(top, 'span', 'package-code', pkg.code);
      addText(top, 'span', 'package-collection', pkg.collection);
      card.append(top);

      addText(card, 'h2', '', pkg.name);
      const meta = document.createElement('div');
      meta.className = 'package-meta';
      addText(meta, 'span', '', pkg.duration);
      addText(meta, 'span', '', pkg.category);
      card.append(meta);

      const facts = document.createElement('div');
      facts.className = 'package-facts';
      addFact(facts, 'Destination', pkg.destination);
      addFact(facts, 'Best for', pkg.bestFor);
      addFact(facts, 'Ideal group', pkg.passengers);
      addFact(facts, 'Travel style', pkg.travelStyle);
      addFact(facts, 'Experience level', pkg.experienceLevel);
      addFact(facts, 'Best season', pkg.bestSeason);
      if (facts.childElementCount) card.append(facts);

      if (pkg.route) addText(card, 'p', 'package-route', pkg.route);

      const details = document.createElement('details');
      details.className = 'package-details';
      const summary = document.createElement('summary');
      summary.textContent = 'View package details';
      details.append(summary);
      const detailBody = document.createElement('div');
      detailBody.className = 'package-detail-body';
      addList(detailBody, 'Stay', pkg.stay);
      addList(detailBody, 'Accommodation tiers', pkg.accommodationTiers);
      addList(detailBody, 'Meals & food', pkg.mealPlan);
      addList(detailBody, 'Dietary options', pkg.dietaryOptions);
      addList(detailBody, 'Transport', pkg.transport);
      addList(detailBody, 'Sightseeing', pkg.sightseeing);
      addList(detailBody, 'Included activities', pkg.activities);
      addList(detailBody, 'Optional activities', pkg.optionalActivities);
      addList(detailBody, 'Experiences', pkg.experiences);
      addList(detailBody, 'Day-wise itinerary', pkg.itinerary);
      addList(detailBody, 'Signature experiences', pkg.signature);
      addList(detailBody, 'Inclusions', pkg.inclusions);
      addList(detailBody, 'Exclusions', pkg.exclusions);
      addList(detailBody, 'Add-ons', pkg.addOns);
      addList(detailBody, 'Permissions & accessibility', pkg.permissions);
      addList(detailBody, 'Seasonal, weather & safety notes', pkg.seasonalNotes);
      addList(detailBody, 'Important notes', pkg.notes);
      details.append(detailBody);
      card.append(details);
      grid.append(card);
    });
    count.textContent = String(shown.length);
    empty.hidden = shown.length !== 0;
  };

  const setActiveFilter = (filter, updateAddress) => {
    buttons.forEach((item) => {
      const active = item.dataset.packageFilter === filter;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    render(filter);
    if (updateAddress) {
      const url = new URL(window.location.href);
      if (filter === 'all') url.searchParams.delete('collection');
      else url.searchParams.set('collection', filter);
      window.history.replaceState({}, '', url);
    }
  };

  buttons.forEach((button) => button.addEventListener('click', () => {
    setActiveFilter(button.dataset.packageFilter || 'all', true);
  }));

  const requestedCollection = new URLSearchParams(window.location.search).get('collection');
  const initialFilter = packages.some((pkg) => pkg.collection === requestedCollection)
    ? requestedCollection
    : 'all';
  setActiveFilter(initialFilter, false);
}());
