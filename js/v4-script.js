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

/* Custom Kashmir trip builder */
const customTripForm = $('#custom-trip-builder');
if (customTripForm) {
  const arrivalInput = $('#custom-arrival');
  const departureInput = $('#custom-departure');
  const adultsInput = $('#custom-adults');
  const childrenInput = $('#custom-children');
  const travellerTypeInput = $('#custom-traveller-type');

  const formatTripDate = value => {
    if (!value) return '';
    const date = new Date(`${value}T00:00:00`);
    return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  };

  const selectedValues = group => $$(`[data-choice-group="${group}"] .is-selected`).map(item => item.dataset.choice).filter(Boolean);
  const selectedRadio = group => $(`[data-radio-group="${group}"] .is-selected`)?.dataset.choice || '';

  function updateCustomSummary() {
    const arrival = arrivalInput?.value || '';
    const departure = departureInput?.value || '';
    let dateText = 'Choose your dates';
    if (arrival && departure) {
      const nights = Math.max(0, Math.round((new Date(`${departure}T00:00:00`) - new Date(`${arrival}T00:00:00`)) / 86400000));
      dateText = `${formatTripDate(arrival)} – ${formatTripDate(departure)}${nights ? ` · ${nights} night${nights === 1 ? '' : 's'}` : ''}`;
    } else if (arrival) {
      dateText = `From ${formatTripDate(arrival)}`;
    }

    const adults = adultsInput?.value || '2';
    const children = childrenInput?.value || '0';
    const childText = children === '0' ? '' : ` · ${children} Child${children === '1' ? '' : 'ren'}`;

    const places = selectedValues('places');
    const activities = selectedValues('activities');
    const food = selectedValues('food');
    const stay = selectedRadio('stay');
    const comfort = selectedRadio('comfort');
    const transport = selectedRadio('transport');

    if ($('#summary-dates')) $('#summary-dates').textContent = dateText;
    if ($('#summary-travellers')) $('#summary-travellers').textContent = `${adults} Adult${adults === '1' ? '' : 's'}${childText}`;
    if ($('#summary-type')) $('#summary-type').textContent = travellerTypeInput?.value || 'Choose traveller type';
    if ($('#summary-places')) $('#summary-places').textContent = places.length ? places.join(', ') : 'Choose destinations';
    if ($('#summary-activities')) $('#summary-activities').textContent = activities.length ? activities.join(', ') : 'Choose experiences';
    if ($('#summary-stay')) $('#summary-stay').textContent = [stay, comfort].filter(Boolean).join(' · ') || 'Choose stay';
    if ($('#summary-transport')) $('#summary-transport').textContent = transport || 'Choose transport';
    if ($('#summary-food')) $('#summary-food').textContent = food.length ? food.join(', ') : 'Tell us your preference';
  }

  /* Multi-select preference cards */
  $$('[data-choice-group] [data-choice]').forEach(button => {
    button.addEventListener('click', () => {
      button.classList.toggle('is-selected');
      button.setAttribute('aria-pressed', String(button.classList.contains('is-selected')));
      updateCustomSummary();
    });
  });

  /* Single-select preference cards */
  $$('[data-radio-group]').forEach(group => {
    $$('[data-choice]', group).forEach(button => {
      button.setAttribute('aria-pressed', String(button.classList.contains('is-selected')));
      button.addEventListener('click', () => {
        $$('[data-choice]', group).forEach(item => {
          item.classList.toggle('is-selected', item === button);
          item.setAttribute('aria-pressed', String(item === button));
        });
        updateCustomSummary();
      });
    });
  });

  /* Date logic */
  if (arrivalInput && departureInput) {
    const now = new Date();
    arrivalInput.min = toISODate(now);
    departureInput.min = toISODate(now);
    arrivalInput.addEventListener('change', () => {
      if (!arrivalInput.value) return updateCustomSummary();
      const nextDay = new Date(`${arrivalInput.value}T00:00:00`);
      nextDay.setDate(nextDay.getDate() + 1);
      departureInput.min = toISODate(nextDay);
      if (!departureInput.value || new Date(departureInput.value) <= new Date(arrivalInput.value)) {
        departureInput.value = toISODate(nextDay);
      }
      updateCustomSummary();
    });
    departureInput.addEventListener('change', updateCustomSummary);
  }

  [adultsInput, childrenInput, travellerTypeInput, $('#custom-arrival-point')].forEach(field => field?.addEventListener('change', updateCustomSummary));

  /* Highlight the customization step currently in view */
  const stepLinks = $$('.custom-steps a');
  const builderSections = $$('[data-step-section]');
  if ('IntersectionObserver' in window && builderSections.length) {
    const customStepObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const id = visible.target.id;
      stepLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
    }, { rootMargin: '-30% 0px -56% 0px', threshold: [0, .15, .35] });
    builderSections.forEach(section => customStepObserver.observe(section));
  }

  customTripForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!customTripForm.reportValidity()) {
      showToast('Please complete the required trip and contact details.');
      return;
    }

    if (!selectedValues('places').length) {
      showToast('Choose at least one Kashmir destination for your custom trip.');
      $('#places')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const submitButton = $('.custom-submit', customTripForm);
    const originalText = submitButton?.innerHTML || '';
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fa-solid fa-circle-check"></i> Trip Request Prepared';
    }

    const draft = {
      dates: $('#summary-dates')?.textContent || '',
      travellers: $('#summary-travellers')?.textContent || '',
      travellerType: travellerTypeInput?.value || '',
      places: selectedValues('places'),
      activities: selectedValues('activities'),
      stay: [selectedRadio('stay'), selectedRadio('comfort')].filter(Boolean),
      transport: selectedRadio('transport'),
      food: selectedValues('food'),
      extraExperience: $('#custom-extra-experience')?.value.trim() || '',
      preferredContact: $('#custom-contact-method')?.value || ''
    };
    try { sessionStorage.setItem('walpakhCustomTripDraft', JSON.stringify(draft)); } catch (error) { /* Storage is optional. */ }

    showToast('Your custom trip request is ready. We’ll connect this form to the booking backend next.');
    $('#custom-summary')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
      }
    }, 3000);
  });

  updateCustomSummary();
}
