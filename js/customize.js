const customForm = document.querySelector('#custom-trip-form');
const choices = document.querySelectorAll('.choice-card[data-choice]');
const summaryChoices = document.querySelector('#summary-choices');
const summaryDates = document.querySelector('#summary-dates');
const summaryTravellers = document.querySelector('#summary-travellers');
const summaryArrival = document.querySelector('#summary-arrival');
const summaryStay = document.querySelector('#summary-stay');
const summaryTransport = document.querySelector('#summary-transport');
const toast = document.querySelector('.toast');

function showToast(message) { if (!toast) return; toast.textContent = message; toast.classList.add('show'); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('show'), 3600); }
function selectedChoiceText() { const values = [...document.querySelectorAll('.choice-card.is-selected')].map(button => button.dataset.choice); summaryChoices.textContent = values.length ? values.join(' · ') : 'Choose places and experiences to see them here.'; }
choices.forEach(button => button.addEventListener('click', () => { button.classList.toggle('is-selected'); selectedChoiceText(); }));
document.querySelectorAll('[data-single-choice]').forEach(group => {
  group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
    group.querySelectorAll('button').forEach(item => item.classList.toggle('is-selected', item === button));
    const type = group.dataset.singleChoice;
    if (type === 'stay-level' || type === 'stay-type') {
      const level = document.querySelector('[data-single-choice="stay-level"] .is-selected')?.textContent.trim() || '';
      const stay = document.querySelector('[data-single-choice="stay-type"] .is-selected span')?.textContent.trim() || '';
      summaryStay.textContent = `${level} ${stay}`;
    }
    if (type === 'transport') summaryTransport.textContent = button.textContent.trim();
  }));
});
document.querySelector('[name="dates"]')?.addEventListener('input', event => { summaryDates.textContent = event.target.value || 'Dates to be decided'; });
document.querySelector('[name="travellers"]')?.addEventListener('change', event => { summaryTravellers.textContent = event.target.value; });
document.querySelector('[name="arrival"]')?.addEventListener('change', event => { summaryArrival.textContent = `${event.target.value} arrival`; });
customForm?.addEventListener('submit', event => { event.preventDefault(); showToast('Your custom trip request is ready. A WALPAKH travel planner will contact you to confirm the journey.'); });
document.querySelector('.nav-toggle')?.addEventListener('click', event => { const nav = document.querySelector('.primary-nav'); const open = nav.classList.toggle('open'); event.currentTarget.setAttribute('aria-expanded', String(open)); });
