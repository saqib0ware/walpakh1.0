const planDialog = document.getElementById('membership-dialog');
const dialogTitle = document.getElementById('membership-dialog-title');
const dialogPrice = document.getElementById('membership-dialog-price');
const dialogDescription = document.getElementById('membership-dialog-description');
const dialogBenefits = document.getElementById('membership-dialog-benefits');
const dialogEnquire = document.getElementById('membership-dialog-enquire');
let lastPlanButton = null;

document.querySelectorAll('.membership-tier__button').forEach((button) => {
    button.addEventListener('click', () => {
        const tier = button.closest('[data-tier]');
        const plan = button.dataset.plan;
        lastPlanButton = button;
        dialogTitle.textContent = `Walpakh ${plan}`;
        dialogPrice.textContent = `${button.dataset.price} / year`;
        dialogDescription.textContent = tier.querySelector('h3').textContent;
        dialogBenefits.replaceChildren(...[...tier.querySelectorAll('.membership-benefits b')].map((benefit) => {
            const item = document.createElement('li');
            item.textContent = benefit.textContent;
            return item;
        }));
        dialogEnquire.href = `mailto:info@walpakh.com?subject=${encodeURIComponent(`Walpakh ${plan} Membership`)}&body=${encodeURIComponent(`Hello Walpakh team,\n\nI would like to know more about the Walpakh ${plan} Membership plan.\n\nThank you.`)}`;
        planDialog.showModal();
    });
});

function closeMembershipDialog() {
    planDialog.close();
    lastPlanButton?.focus();
}

document.querySelector('.membership-dialog__close')?.addEventListener('click', closeMembershipDialog);
planDialog?.addEventListener('click', (event) => {
    const bounds = planDialog.getBoundingClientRect();
    if (event.target === planDialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) closeMembershipDialog();
});
