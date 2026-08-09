/* Mobile-only package tier carousel. */
(function packageTierCarousel() {
  const carousel = document.querySelector('[data-package-tier-carousel]');
  if (!carousel) return;

  const viewport = carousel.querySelector('.package-tier-carousel__viewport');
  const track = carousel.querySelector('.package-tier-grid');
  const cards = Array.from(track.querySelectorAll('.package-tier'));
  const previous = carousel.querySelector('.package-tier-carousel__arrow--prev');
  const next = carousel.querySelector('.package-tier-carousel__arrow--next');
  const mobileQuery = window.matchMedia('(max-width:600px)');
  let index = 0;
  let touchStartX = 0;

  function update() {
    if (!mobileQuery.matches) {
      track.style.transform = '';
      previous.disabled = true;
      next.disabled = false;
      return;
    }

    const card = cards[0];
    const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;
    const step = card.getBoundingClientRect().width + gap;
    const max = cards.length - 1;
    index = Math.min(index, max);
    track.style.transform = `translateX(${-index * step}px)`;
    previous.disabled = index === 0;
    next.disabled = index === max;
  }

  previous.addEventListener('click', () => { index = Math.max(0, index - 1); update(); });
  next.addEventListener('click', () => { index = Math.min(cards.length - 1, index + 1); update(); });
  viewport.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
  }, { passive: true });
  viewport.addEventListener('touchend', (event) => {
    if (!mobileQuery.matches) return;
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) < 35) return;
    index = distance < 0 ? Math.min(cards.length - 1, index + 1) : Math.max(0, index - 1);
    update();
  }, { passive: true });
  mobileQuery.addEventListener('change', update);
  window.addEventListener('resize', update);
  update();
}());
