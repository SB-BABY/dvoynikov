const themeBtn = document.querySelector(".theme-toggle");
const images = document.querySelectorAll(".theme-img");

function updateImages(theme) {
    images.forEach(img => {
        if (theme === "dark") {
            img.src = img.dataset.dark;
        } else {
            img.src = img.dataset.light;
        }
    });
}

// проверяем тему при загрузке
let currentTheme = localStorage.getItem("theme") || "light";

if (currentTheme === "dark") {
    document.documentElement.classList.add("dark-theme");
}

updateImages(currentTheme);

// переключение темы
themeBtn.addEventListener("click", () => {

    document.documentElement.classList.toggle("dark-theme");

    if (document.documentElement.classList.contains("dark-theme")) {
        currentTheme = "dark";
    } else {
        currentTheme = "light";
    }

    localStorage.setItem("theme", currentTheme);

    updateImages(currentTheme);
});