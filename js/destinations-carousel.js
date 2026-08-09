/* Home-page destination carousel. Moves by the number of visible cards. */
(function destinationCarousel() {
  const carousel = document.querySelector('[data-destination-carousel]');
  if (!carousel) return;

  const viewport = carousel.querySelector('.destination-carousel__viewport');
  const track = carousel.querySelector('.destination-carousel__track');
  const cards = Array.from(carousel.querySelectorAll('.destination-carousel__card'));
  const previous = carousel.querySelector('.destination-carousel__arrow--prev');
  const next = carousel.querySelector('.destination-carousel__arrow--next');
  let index = 0;

  function measurements() {
    const card = cards[0];
    if (!card) return { visible: 1, step: 0, max: 0 };
    const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;
    const step = card.getBoundingClientRect().width + gap;
    const visible = Math.max(1, Math.round((viewport.clientWidth + gap) / step));
    return { visible, step, max: Math.max(0, cards.length - visible) };
  }

  function update() {
    const { step, max } = measurements();
    index = Math.min(index, max);
    track.style.transform = `translateX(${-index * step}px)`;
    previous.disabled = index === 0;
    next.disabled = index >= max;
  }

  previous.addEventListener('click', () => {
    const { visible } = measurements();
    index = Math.max(0, index - visible);
    update();
  });

  next.addEventListener('click', () => {
    const { visible, max } = measurements();
    index = Math.min(max, index + visible);
    update();
  });

  window.addEventListener('resize', update);
  update();
}());
