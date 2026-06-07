const heroSection = document.querySelector(".hero__container"); // секция
const heroBtn = document.getElementById("heroBtn");
const heroFormOverlay = document.getElementById("heroFormOverlay");
const heroFormPopup = document.getElementById("heroFormPopup");
const heroFormClose = document.getElementById("heroFormClose");

let heroCooldown = false;
let hoverTimer = null;

if (heroBtn) {
    heroBtn.pause();
    heroBtn.currentTime = 0;
}

if (heroSection) {
    heroSection.addEventListener("mouseenter", () => {
        if (heroCooldown) return;
        if (hoverTimer) return; // уже запущен — не перезапускаем

        heroBtn.currentTime = 0;
        heroBtn.play();

        hoverTimer = setTimeout(() => {
            hoverTimer = null;
            heroBtn.pause();
            triggerHeroPop();
        }, 4000);
    });
}

function triggerHeroPop() {
    heroCooldown = true;

    document.body.classList.add("modal-open");

    heroFormOverlay.style.display = "block";
    requestAnimationFrame(() => heroFormOverlay.classList.add("is-visible"));

    setTimeout(() => {
        heroFormPopup.style.display = "block";
        requestAnimationFrame(() => heroFormPopup.classList.add("is-open"));
    }, 350);
}

function closeHeroPopup() {
    heroFormOverlay.classList.remove("is-visible");
    heroFormPopup.classList.remove("is-open");
    document.body.classList.remove("modal-open");

    setTimeout(() => {
        heroFormOverlay.style.display = "none";
        heroFormPopup.style.display = "none";

        heroBtn.currentTime = 0;
        heroBtn.pause();

        setTimeout(() => {
            heroCooldown = false;
        }, 5000);
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