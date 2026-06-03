// POPUP — кнопка из hero
const heroBtn = document.getElementById("heroBtn");
const heroFormOverlay = document.getElementById("heroFormOverlay");
const heroFormPopup = document.getElementById("heroFormPopup");
const heroFormClose = document.getElementById("heroFormClose");

if (heroBtn) {
    setTimeout(() => {
        heroBtn.classList.add("is-pulsing");

        setTimeout(() => {
            heroBtn.classList.remove("is-pulsing");
            triggerHeroPop();
        }, 2100);
    }, 800);
}

function triggerHeroPop() {
    heroBtn.classList.add("is-popping");

    // Блокируем скролл
    document.body.classList.add("modal-open");

    // Показываем оверлей
    heroFormOverlay.style.display = "block";
    requestAnimationFrame(() => heroFormOverlay.classList.add("is-visible"));

    // После анимации хлопка — прячем кнопку навсегда
    setTimeout(() => {
        heroBtn.style.display = "none";
    }, 400);

    // Открываем форму
    setTimeout(() => {
        heroFormPopup.style.display = "block";
        requestAnimationFrame(() => heroFormPopup.classList.add("is-open"));
    }, 350);
}

function closeHeroPopup() {
    heroFormOverlay.classList.remove("is-visible");
    heroFormPopup.classList.remove("is-open");

    // Разблокируем скролл
    document.body.classList.remove("modal-open");

    setTimeout(() => {
        heroFormOverlay.style.display = "none";
        heroFormPopup.style.display = "none";
        // Кнопку НЕ восстанавливаем — она исчезла навсегда
        heroBtn.classList.remove("is-popping");
        heroBtn.style.display = "block";
    }, 300);
}

if (heroFormClose) {
    heroFormClose.addEventListener("click", closeHeroPopup);
}

if (heroFormOverlay) {
    heroFormOverlay.addEventListener("click", closeHeroPopup);
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && heroFormPopup?.classList.contains("is-open")) {
        closeHeroPopup();
    }
});
