// POPUP — кнопка из hero
const heroBtn = document.getElementById('heroBtn');
const heroFormOverlay = document.getElementById('heroFormOverlay');
const heroFormPopup = document.getElementById('heroFormPopup');
const heroFormClose = document.getElementById('heroFormClose');

if (heroBtn) {
    setTimeout(() => {
        heroBtn.classList.add('is-pulsing');

        setTimeout(() => {
            heroBtn.classList.remove('is-pulsing');
            triggerHeroPop();
        }, 2100);
    }, 800);
}

function triggerHeroPop() {
    heroBtn.classList.add('is-popping');

    heroFormOverlay.style.display = 'block';
    requestAnimationFrame(() => heroFormOverlay.classList.add('is-visible'));

    setTimeout(() => {
        heroFormPopup.style.display = 'block';
        requestAnimationFrame(() => heroFormPopup.classList.add('is-open'));
    }, 350);
}

function closeHeroPopup() {
    heroFormOverlay.classList.remove('is-visible');
    heroFormPopup.classList.remove('is-open');

    setTimeout(() => {
        heroFormOverlay.style.display = 'none';
        heroFormPopup.style.display = 'none';
        heroBtn.classList.remove('is-popping');
        heroBtn.style.opacity = '1';
        heroBtn.style.transform = 'scale(1)';
    }, 300);
}

if (heroFormClose) {
    heroFormClose.addEventListener('click', closeHeroPopup);
}

if (heroFormOverlay) {
    heroFormOverlay.addEventListener('click', closeHeroPopup);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && heroFormPopup?.classList.contains('is-open')) {
        closeHeroPopup();
    }
});