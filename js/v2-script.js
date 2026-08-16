const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function showToast(message) {
  const toast = $('.toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 3300);
}

/* Mobile navigation */
const navToggle = $('.nav-toggle');
const nav = $('.primary-nav');
navToggle?.addEventListener('click', () => {
  const open = nav?.classList.toggle('open') ?? false;
  navToggle.setAttribute('aria-expanded', String(open));
});
$$('.primary-nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

/* Homepage trip planner */
const plannerTabs = $$('.planner-tab');
const plannerForm = $('#planner-form');
let plannerMode = 'Packages';

plannerTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    plannerTabs.forEach(item => {
      item.classList.remove('active');
      item.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    plannerMode = tab.dataset.mode || 'Packages';
    const plannerTitle = $('.planner-card h2');
    const plannerSubmit = $('.planner-card button[type="submit"]');
    if (plannerTitle) plannerTitle.textContent = `Plan Your ${plannerMode === 'Packages' ? 'Journey' : plannerMode}`;
    if (plannerSubmit) plannerSubmit.textContent = plannerMode === 'Packages' ? 'Search Packages' : `Search ${plannerMode}`;
  });
});

const checkIn = $('#checkin');
const checkOut = $('#checkout');
const toISODate = date => date.toISOString().split('T')[0];
if (checkIn && checkOut) {
  const today = new Date();
  checkIn.min = toISODate(today);
  checkOut.min = toISODate(today);
  checkIn.addEventListener('change', () => {
    if (!checkIn.value) return;
    const selected = new Date(`${checkIn.value}T00:00:00`);
    selected.setDate(selected.getDate() + 1);
    checkOut.min = toISODate(selected);
    if (!checkOut.value || new Date(checkOut.value) <= new Date(checkIn.value)) {
      checkOut.value = toISODate(selected);
    }
  });
}

/* Package links can pre-select homepage planner budget */
if (plannerForm) {
  const params = new URLSearchParams(window.location.search);
  const budgetParam = params.get('budget');
  const budgetSelect = $('#budget');
  if (budgetParam && budgetSelect && ['economy', 'premium', 'luxury'].includes(budgetParam)) {
    budgetSelect.value = budgetParam;
  }

  plannerForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!plannerForm.reportValidity()) return;

    const destination = $('#destination')?.value.trim() || 'Kashmir';
    const travellers = $('#travellers')?.value || '';
    const budget = $('#budget')?.value || '';
    const packageCards = $$('.package-card');

    if (plannerMode === 'Packages') {
      packageCards.forEach(card => card.classList.toggle('is-dimmed', Boolean(budget) && card.dataset.tier !== budget));
      $('#packages')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      showToast(`Showing ${budget || 'matching'} options for ${destination}${travellers ? ` · ${travellers}` : ''}. Live inventory will connect to the booking backend.`);
    } else {
      packageCards.forEach(card => card.classList.remove('is-dimmed'));
      showToast(`${plannerMode} search prepared for ${destination}. Live availability will connect to the backend.`);
    }
  });
}

/* Homepage destination carousel */
const destinationTrack = $('#destination-track');
$('.slider-btn--prev')?.addEventListener('click', () => destinationTrack?.scrollBy({ left: -420, behavior: 'smooth' }));
$('.slider-btn--next')?.addEventListener('click', () => destinationTrack?.scrollBy({ left: 420, behavior: 'smooth' }));

/* Shop product filtering, wish list and demo cart */
const productTrack = $('#product-track');
const productCards = $$('.product-card');
const categoryButtons = $$('.shop-category');
const shopSearch = $('#shop-search');
let currentCategory = 'all';
let wishlistOnly = false;

function applyProductFilters() {
  if (!productCards.length) return;
  const term = (shopSearch?.value || '').trim().toLowerCase();
  let visible = 0;
  productCards.forEach(card => {
    const categoryMatch = currentCategory === 'all' || card.dataset.category === currentCategory;
    const searchMatch = !term || (card.dataset.name || '').toLowerCase().includes(term) || (card.dataset.category || '').toLowerCase().includes(term);
    const favoriteMatch = !wishlistOnly || Boolean($('.wish-btn.active', card));
    const show = categoryMatch && searchMatch && favoriteMatch;
    card.hidden = !show;
    if (show) visible += 1;
  });
  if (!visible && (term || currentCategory !== 'all' || wishlistOnly)) {
    showToast('No matching products in this demo catalog yet.');
  }
}

categoryButtons.forEach(button => {
  button.addEventListener('click', () => {
    currentCategory = button.dataset.category || 'all';
    categoryButtons.forEach(item => item.classList.toggle('active', item === button));
    wishlistOnly = false;
    $('#wishlist-toggle')?.classList.remove('active');
    applyProductFilters();
    productTrack?.scrollTo({ left: 0, behavior: 'smooth' });
  });
});

shopSearch?.addEventListener('input', applyProductFilters);
$('#clear-shop-filter')?.addEventListener('click', () => {
  currentCategory = 'all';
  wishlistOnly = false;
  if (shopSearch) shopSearch.value = '';
  categoryButtons.forEach(button => button.classList.toggle('active', button.dataset.category === 'all'));
  $('#wishlist-toggle')?.classList.remove('active');
  applyProductFilters();
  productTrack?.scrollTo({ left: 0, behavior: 'smooth' });
});

$$('.wish-btn').forEach(button => {
  button.addEventListener('click', () => {
    button.classList.toggle('active');
    const icon = $('i', button);
    icon?.classList.toggle('fa-regular', !button.classList.contains('active'));
    icon?.classList.toggle('fa-solid', button.classList.contains('active'));
    const name = button.closest('.product-card')?.dataset.name || 'Product';
    showToast(button.classList.contains('active') ? `${name} saved to wishlist.` : `${name} removed from wishlist.`);
    if (wishlistOnly) applyProductFilters();
  });
});

$('#wishlist-toggle')?.addEventListener('click', event => {
  wishlistOnly = !wishlistOnly;
  event.currentTarget.classList.toggle('active', wishlistOnly);
  applyProductFilters();
  if (wishlistOnly && !$$('.wish-btn.active').length) showToast('Your wishlist is empty. Tap a heart on any product to save it.');
});

$('.product-nav--prev')?.addEventListener('click', () => productTrack?.scrollBy({ left: -540, behavior: 'smooth' }));
$('.product-nav--next')?.addEventListener('click', () => productTrack?.scrollBy({ left: 540, behavior: 'smooth' }));

const cart = new Map();
const cartCount = $('#cart-count');
const miniCart = $('#mini-cart');
const miniCartItems = $('#mini-cart-items');
const cartBackdrop = $('#cart-backdrop');

function updateCartUI() {
  const totalItems = [...cart.values()].reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) cartCount.textContent = String(totalItems);
  if (!miniCartItems) return;
  if (!cart.size) {
    miniCartItems.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }
  miniCartItems.innerHTML = [...cart.entries()].map(([name, item]) => `
    <div class="mini-cart-item">
      <div><strong>${name}</strong><span>Quantity: ${item.quantity}</span></div>
      <button type="button" data-remove-cart="${name}">Remove</button>
    </div>`).join('');
  $$('[data-remove-cart]', miniCartItems).forEach(button => {
    button.addEventListener('click', () => {
      cart.delete(button.dataset.removeCart);
      updateCartUI();
    });
  });
}

$$('.add-cart').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.product-card');
    const name = card?.dataset.name || 'Product';
    const existing = cart.get(name) || { quantity: 0 };
    existing.quantity += 1;
    cart.set(name, existing);
    updateCartUI();
    showToast(`${name} added to cart.`);
  });
});

function setCartOpen(open) {
  miniCart?.classList.toggle('open', open);
  cartBackdrop?.classList.toggle('show', open);
  miniCart?.setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
}
$('#cart-button')?.addEventListener('click', () => setCartOpen(true));
$('#mini-cart-close')?.addEventListener('click', () => setCartOpen(false));
cartBackdrop?.addEventListener('click', () => setCartOpen(false));

/* Newsletter */
$$('#newsletter-form').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    showToast('Thanks for subscribing! This will be connected to the Walpakh mailing backend.');
    form.reset();
  });
});

/* Detailed collection package cards */
const collectionSettings = {
  'economy-page': { tier: 'essence', prefix: 'E', selector: '.economy-trip', grid: '.economy-grid', amenities: [['fa-bed', 'Comfort Stay'], ['fa-utensils', 'Breakfast & Dinner'], ['fa-car-side', 'Private Transport'], ['fa-headset', 'Local Support']], eyebrow: 'A gentle introduction to Kashmir' },
  'premium-page': { tier: 'signature', prefix: 'S', selector: '.premium-trip', grid: '.premium-grid', amenities: [['fa-hotel', 'Handpicked Stay'], ['fa-utensils', 'Kashmiri Dining'], ['fa-car-side', 'Private Transfers'], ['fa-headset', 'Local Concierge']], eyebrow: 'An elevated Kashmir escape' },
  'honeymoon-packages-page': { tier: 'honeymoon', prefix: 'H', selector: '.honeymoon-package-card', grid: '.honeymoon-package-grid', amenities: [['fa-bed', 'Romantic Stay'], ['fa-utensils', 'Dining'], ['fa-car-side', 'Private Transfers'], ['fa-headset', '24/7 Care']], eyebrow: 'A Kashmir memory, made for two' },
  'offbeat-packages-page': { tier: 'offbeat', prefix: 'OB', selector: '.offbeat-package-card', grid: '.offbeat-package-grid', amenities: [['fa-campground', 'Homestay & Camps'], ['fa-bowl-food', 'Flexible Meals'], ['fa-car-side', '4×4 Transport'], ['fa-person-hiking', 'Local Guide']], eyebrow: 'Remote routes and real Kashmir' }
};

function formatCollectionPlans() {
  const config = Object.entries(collectionSettings).map(([name, value]) => ({ name, ...value })).find(item => document.body.classList.contains(item.name));
  if (!config) return;

  const sourceCards = $$(config.selector);
  sourceCards.forEach((card, index) => {
    const header = $('header', card);
    const isOffbeat = config.tier === 'offbeat';
    const image = $('img', card);
    const title = $('h2', isOffbeat ? card : header)?.textContent.trim() || 'Kashmir journey';
    const sourceCode = $(isOffbeat ? ':scope > span' : 'header > span', card)?.textContent.trim() || String(index + 1).padStart(2, '0');
    const code = `${config.prefix}${sourceCode.replace(/^[A-Z]+/, '').padStart(2, '0')}`;
    const duration = (isOffbeat ? $('.offbeat-package-card > div b', card) : config.tier === 'honeymoon' ? $('header b', card) : $('header p', card))?.textContent.trim() || 'Custom duration';
    const destination = isOffbeat ? $('.offbeat-package-card > div p', card)?.textContent.trim() : config.tier === 'essence' ? $('header small', card)?.textContent.trim() : config.tier === 'honeymoon' ? $('.honeymoon-package-card__route', card)?.textContent.trim() : $(':scope > b', card)?.textContent.trim();
    const sourceEyebrow = $('header em', card)?.textContent.trim();
    const itinerary = isOffbeat ? ['Arrive in Srinagar and begin the selected scenic route', `Explore ${title} with a local guide`, 'Return through Kashmir’s mountain landscapes'] : $$('ul li', card).map(item => item.textContent.trim());
    const twist = isOffbeat ? 'Remote valleys, quiet camps and an authentic local pace' : (config.tier === 'honeymoon' ? $('.honeymoon-package-card__details aside span', card) : $('footer', card))?.textContent.replace(/^\s*Twist:\s*/i, '').trim() || 'A thoughtful local moment';
    const imageSrc = image?.getAttribute('src') || 'assets/images/package-economy.jpg';
    const imageAlt = image?.alt || title;
    const amenities = config.amenities.map(([icon, label]) => `<span><i class="fa-solid ${icon}"></i>${label}</span>`).join('');
    const itineraryList = itinerary.map(item => `<li>${item.replace(/^Day\s*\d+\s*:\s*/i, '')}</li>`).join('');
    const twistIcon = config.tier === 'honeymoon' ? 'fa-heart' : isOffbeat ? 'fa-mountain' : 'fa-leaf';

    card.className = `collection-card collection-card--${config.tier} reveal`;
    card.setAttribute('data-package-card', '');
    card.innerHTML = `<div class="collection-card__media"><img src="${imageSrc}" alt="${imageAlt}" loading="lazy" /><span class="collection-card__number">${code}</span><span class="collection-card__duration">${duration}</span></div><div class="collection-card__content"><p class="collection-card__eyebrow">${sourceEyebrow || config.eyebrow}</p><h3>${title}</h3><p class="collection-card__dest"><i class="fa-solid fa-location-dot"></i> ${destination || 'Kashmir'}</p><div class="collection-card__twist"><i class="fa-solid ${twistIcon}"></i><div><strong>Walpakh Twist</strong><span>${twist}</span></div></div><div class="collection-card__amenities">${amenities}</div><button class="collection-itinerary-toggle" type="button" aria-expanded="false"><span>View day-wise itinerary</span><i class="fa-solid fa-chevron-down"></i></button><ol class="collection-itinerary">${itineraryList}</ol></div>`;
  });

  const grid = $(config.grid);
  grid?.classList.add('collection-plan-grid');
}

formatCollectionPlans();

/* Offbeat destination guide numbering */
if (document.body.classList.contains('offbeat-page')) {
  $$('.offbeat-grid > article > b').forEach((badge, index) => {
    badge.textContent = `OB${String(index + 1).padStart(2, '0')}`;
  });
}

$$('.collection-itinerary-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.collection-card');
    const expanded = card?.classList.toggle('is-itinerary-open') ?? false;
    button.setAttribute('aria-expanded', String(expanded));
    $('span', button).textContent = expanded ? 'Hide day-wise itinerary' : 'View day-wise itinerary';
  });
});

/* Experience planner shortcuts */
$$('.experience-card button, .experience-list button').forEach(button => {
  button.addEventListener('click', () => {
    const experience = $('h3', button.closest('article'))?.textContent || 'Experience';
    button.classList.toggle('is-added');
    button.innerHTML = button.classList.contains('is-added') ? 'Added to journey <i class="fa-solid fa-check"></i>' : 'Add to journey <i class="fa-solid fa-plus"></i>';
    showToast(button.classList.contains('is-added') ? `${experience} added to your trip ideas.` : `${experience} removed from your trip ideas.`);
  });
});

/* Back to top */
const backToTop = $('.back-to-top');
window.addEventListener('scroll', () => {
  backToTop?.classList.toggle('visible', window.scrollY > 650);
}, { passive: true });
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* Reveal animation */
const revealElements = $$('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach(element => revealObserver.observe(element));
} else {
  revealElements.forEach(element => element.classList.add('is-visible'));
}

/* Homepage active section nav */
const navLinks = $$('.primary-nav a[href^="#"]');
const sections = $$('main section[id]');
if (navLinks.length && 'IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-38% 0px -55% 0px', threshold: 0 });
  sections.forEach(section => sectionObserver.observe(section));
}

/* Homepage transport cards */
$$('.vehicle-card__link').forEach(link => {
  link.addEventListener('click', () => {
    const transportTab = $('.planner-tab[data-mode="Transport"]');
    transportTab?.click();
    window.setTimeout(() => showToast('Transport mode selected. Tell us your destination and travel dates for a vehicle quote.'), 350);
  });
});

/* VIP membership advertisement */
$('#join-membership')?.addEventListener('click', () => {
  showToast('VIP membership registration will be connected to your customer database. For now, contact Walpakh to join.');
  window.setTimeout(() => {
    window.location.href = 'mailto:info@walpakh.com?subject=Walpakh%20VIP%20Membership%20Request';
  }, 900);
});

/* Home hero quick explorer */
$('#hero-explorer-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const destination = $('#hero-explorer-destination')?.value || 'Kashmir';
  showToast(`Curated ${destination} journeys are ready to explore.`);
  $('#packages')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
