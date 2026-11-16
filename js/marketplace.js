const marketNames = ['Walnuts', 'Almonds', 'Raisins', 'Pistachio', 'Cashew', 'Mix Dry Fruits', 'Saffron', 'Kashmiri Kehwa', 'Nun Chai', 'Apricots', 'Pashmina Shawls', 'Pherans', 'Coats', 'Papier Mache', 'Copper Samovar', 'Gifting Collection'];
const marketGroups = ['Dry Fruits', 'Dry Fruits', 'Dry Fruits', 'Dry Fruits', 'Dry Fruits', 'Dry Fruits', 'Foods', 'Foods', 'Foods', 'Dry Fruits', 'Apparel', 'Apparel', 'Apparel', 'Handicrafts', 'Handicrafts', 'Gifts'];
const marketTitles = ['Kashmiri Walnuts', 'Kashmiri Almonds', 'Kashmiri Raisins', 'Kashmiri Pistachios', 'Premium Cashews', 'Mixed Dry Fruits', 'Kashmiri Saffron', 'Kashmiri Kehwa', 'Kashmiri Nun Chai', 'Dried Apricots', 'Pashmina Shawl', 'Embroidered Pheran', 'Kashmiri Wool Coat', 'Papier Mache Vase', 'Copper Samovar', 'Kashmiri Gift Hamper'];

const marketProducts = document.querySelector('#market-products');
const marketNav = document.querySelector('#market-nav');
const marketMenuToggle = document.querySelector('.market-menu-toggle');
const marketDrawer = document.querySelector('#market-drawer');
const marketShade = document.querySelector('#market-shade');
let marketCart = {};
let marketWishes = [];
let marketDrawerMode = 'cart';
let marketLastFocus;

try {
  marketCart = JSON.parse(localStorage.getItem('walpakh-market-cart') || '{}');
  marketWishes = JSON.parse(localStorage.getItem('walpakh-market-wishes') || '[]');
  if (!marketCart || Array.isArray(marketCart) || typeof marketCart !== 'object') marketCart = {};
  if (!Array.isArray(marketWishes)) marketWishes = [];
} catch (_) { marketCart = {}; marketWishes = []; }

const productImage = index => `assets/images/market/product-${index}.webp`;
const marketToast = message => {
  const toast = document.querySelector('#market-toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(marketToast.timer);
  marketToast.timer = window.setTimeout(() => toast.classList.remove('show'), 3000);
};

const updateMarketCounts = () => {
  const cartCount = Object.values(marketCart).reduce((total, quantity) => total + Number(quantity || 0), 0);
  document.querySelector('#market-cart-count').textContent = String(cartCount);
  const wishCount = document.querySelector('#market-wish-count');
  wishCount.textContent = String(marketWishes.length);
  wishCount.classList.toggle('is-hidden', marketWishes.length === 0);
  try {
    localStorage.setItem('walpakh-market-cart', JSON.stringify(marketCart));
    localStorage.setItem('walpakh-market-wishes', JSON.stringify(marketWishes));
  } catch (_) { /* Demo remains usable without storage. */ }
};

const productCard = index => `
  <article class="market-product">
    <img class="market-product__photo" src="${productImage(index)}" alt="${marketTitles[index]}" loading="lazy" />
    <button class="market-product__wish" type="button" data-wish="${index}" aria-label="Save ${marketTitles[index]}" aria-pressed="${marketWishes.includes(index)}"><i class="${marketWishes.includes(index) ? 'fa-solid' : 'fa-regular'} fa-heart"></i></button>
    <div class="market-product__info"><h3>${marketTitles[index]}</h3><button class="market-add-button" type="button" data-add="${index}"><i class="fa-solid fa-cart-plus"></i> Add to Cart</button></div>
  </article>`;

const renderMarketProducts = (indexes = [0, 1, 6, 7, 10, 14]) => {
  marketProducts.innerHTML = indexes.length ? indexes.map(productCard).join('') : '<p class="market-empty">No products found. Try “saffron”, “shawl” or “nuts”.</p>';
};

const closeMarketNav = () => {
  marketNav.classList.remove('open');
  marketMenuToggle?.setAttribute('aria-expanded', 'false');
};

const filterMarketProducts = group => {
  const all = group === 'all';
  document.querySelector('#market-product-heading').textContent = all ? 'Explore Our Products' : group === 'Foods' ? 'Kashmiri Foods & Beverages' : group === 'Apparel' ? 'Pashmina & Apparel' : group === 'Gifts' ? 'Kashmiri Gift Hampers' : group;
  document.querySelector('#market-product-subtitle').textContent = all ? 'Handpicked favourites from the Valley of Kashmir' : 'Discover a little piece of Kashmir';
  document.querySelector('#market-search-input').value = '';
  renderMarketProducts(marketNames.map((_, index) => index).filter(index => all || marketGroups[index] === group));
  closeMarketNav();
};

const openMarketDrawer = (title, html) => {
  marketLastFocus = document.activeElement;
  document.querySelector('#market-drawer-title').textContent = title;
  document.querySelector('#market-drawer-body').innerHTML = html;
  marketDrawer.classList.add('open');
  marketDrawer.inert = false;
  marketDrawer.setAttribute('aria-hidden', 'false');
  marketShade.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.querySelector('#market-drawer-close').focus();
};

const closeMarketDrawer = () => {
  marketDrawer.classList.remove('open');
  marketDrawer.inert = true;
  marketDrawer.setAttribute('aria-hidden', 'true');
  marketShade.classList.remove('open');
  document.body.style.overflow = '';
  marketLastFocus?.focus();
};

const renderMarketDrawer = () => {
  const ids = marketDrawerMode === 'cart' ? Object.keys(marketCart).map(Number).filter(index => marketCart[index] > 0) : marketWishes;
  const title = marketDrawerMode === 'cart' ? 'Your Shopping Cart' : 'Your Wishlist';
  const content = ids.length ? `${ids.map(index => `
    <div class="market-cart-row"><img src="${productImage(index)}" alt="${marketTitles[index]}" /><div><strong>${marketTitles[index]}</strong><p>${marketDrawerMode === 'cart' ? `Quantity: ${marketCart[index]}` : 'Saved to your wishlist'}</p></div><button type="button" data-remove="${index}" aria-label="Remove ${marketTitles[index]}"><i class="fa-solid fa-xmark"></i></button></div>`).join('')}
    <p class="market-drawer-note">${marketDrawerMode === 'cart' ? 'Your cart is saved on this device. Checkout will be connected when the store backend is ready.' : 'Your favourites are saved on this device. Add any favourite to your cart whenever you are ready.'}</p>` : `<p class="market-drawer-note">${marketDrawerMode === 'cart' ? 'Your cart is waiting for a little Kashmir. Add a favourite to get started.' : 'Save the things you love using the heart on any product.'}</p>`;
  openMarketDrawer(title, content);
};

const renderMarketCategories = () => {
  const category = index => `<button class="market-category" type="button" data-product="${index}" aria-label="Shop ${marketNames[index]}"><img src="${productImage(index)}" alt="${marketNames[index]}" loading="lazy" /><span>${marketNames[index]}</span></button>`;
  document.querySelector('#market-category-first').innerHTML = marketNames.slice(0, 10).map((_, index) => category(index)).join('');
  document.querySelector('#market-category-second').innerHTML = marketNames.slice(10).map((_, index) => category(index + 10)).join('');
};

document.addEventListener('click', event => {
  const add = event.target.closest('[data-add]');
  if (add) {
    const index = Number(add.dataset.add);
    marketCart[index] = (marketCart[index] || 0) + 1;
    updateMarketCounts();
    marketToast(`${marketTitles[index]} added to your cart.`);
    return;
  }
  const wish = event.target.closest('[data-wish]');
  if (wish) {
    const index = Number(wish.dataset.wish);
    marketWishes = marketWishes.includes(index) ? marketWishes.filter(item => item !== index) : [...marketWishes, index];
    updateMarketCounts();
    wish.setAttribute('aria-pressed', String(marketWishes.includes(index)));
    wish.querySelector('i').className = `${marketWishes.includes(index) ? 'fa-solid' : 'fa-regular'} fa-heart`;
    return;
  }
  const filter = event.target.closest('[data-filter]');
  if (filter) {
    event.preventDefault();
    filterMarketProducts(filter.dataset.filter);
    document.querySelector('#bestsellers')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  const category = event.target.closest('[data-product]');
  if (category) {
    const index = Number(category.dataset.product);
    document.querySelector('#market-product-heading').textContent = marketNames[index];
    document.querySelector('#market-product-subtitle').textContent = 'Handpicked from the Valley of Kashmir';
    renderMarketProducts([index]);
    document.querySelector('#bestsellers')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  const remove = event.target.closest('[data-remove]');
  if (remove) {
    const index = Number(remove.dataset.remove);
    if (marketDrawerMode === 'cart') delete marketCart[index];
    else marketWishes = marketWishes.filter(item => item !== index);
    updateMarketCounts();
    renderMarketDrawer();
    return;
  }
  if (event.target.closest('[data-show-all]')) {
    filterMarketProducts('all');
    document.querySelector('#bestsellers')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  const info = event.target.closest('[data-info]');
  if (info) {
    event.preventDefault();
    const messages = {
      'Our story': 'Walpakh Marketplace brings the warmth of Kashmir into your home through dry fruits, fragrant teas, woven apparel and traditional crafts made with care.',
      FAQs: 'Browse by category or use search to find a product. Use the heart to save a favourite and Add to Cart to build your selection.',
      'Shipping Policy': 'Pan-India delivery is planned for marketplace orders. Final shipping rates and timelines will be displayed when the delivery service is connected.',
      'Returns & Refunds': 'Marketplace return and refund details will be published before checkout is enabled.',
      'Terms & Conditions': 'This marketplace currently demonstrates the collection and cart experience. Payments and live ordering are not connected yet.',
      'Privacy Policy': 'Your cart and wishlist are saved only in this browser. Newsletter sign-up is a front-end demo and does not submit your email.'
    };
    openMarketDrawer(info.dataset.info, `<p class="market-drawer-note">${messages[info.dataset.info] || 'More information will be available here soon.'}</p>`);
  }
});

document.querySelector('#market-view-all')?.addEventListener('click', () => filterMarketProducts('all'));
marketMenuToggle?.addEventListener('click', () => {
  const open = marketNav.classList.toggle('open');
  marketMenuToggle.setAttribute('aria-expanded', String(open));
});
document.querySelector('.market-nav__close')?.addEventListener('click', closeMarketNav);
document.querySelector('#market-cart-toggle')?.addEventListener('click', () => { marketDrawerMode = 'cart'; renderMarketDrawer(); });
document.querySelector('#market-wishlist-toggle')?.addEventListener('click', () => { marketDrawerMode = 'wishlist'; renderMarketDrawer(); });
document.querySelector('#market-drawer-close')?.addEventListener('click', closeMarketDrawer);
marketShade?.addEventListener('click', closeMarketDrawer);
document.querySelector('#market-search')?.addEventListener('submit', event => {
  event.preventDefault();
  const query = document.querySelector('#market-search-input').value.trim().toLowerCase();
  document.querySelector('#market-product-heading').textContent = query ? 'Search Results' : 'Explore Our Products';
  document.querySelector('#market-product-subtitle').textContent = query ? `Products matching “${query}”` : 'Handpicked favourites from the Valley of Kashmir';
  renderMarketProducts(marketNames.map((_, index) => index).filter(index => `${marketTitles[index]} ${marketNames[index]} ${marketGroups[index]}`.toLowerCase().includes(query)));
  document.querySelector('#bestsellers')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
document.querySelector('#market-newsletter-form')?.addEventListener('submit', event => { event.preventDefault(); marketToast('Thank you for your interest! Newsletter delivery will be connected soon.'); event.currentTarget.reset(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeMarketNav(); if (marketDrawer.classList.contains('open')) closeMarketDrawer(); } });

renderMarketCategories();
renderMarketProducts();
updateMarketCounts();
