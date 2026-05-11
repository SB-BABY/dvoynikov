// const scrollBtn = document.querySelector(".scroll-top");

// window.addEventListener("scroll", () => {

//     if (window.scrollY > 400) {
//         scrollBtn.classList.add("show");
//     } else {
//         scrollBtn.classList.remove("show");
//     }

// });

// scrollBtn.addEventListener("click", () => {

//     window.scrollTo({
//         top: 0,
//         behavior: "smooth"
//     });

// });

// JS
const fabPill = document.getElementById('fabPill');
const fabToggle = document.getElementById('fabPillToggle');
let open = false;

fabToggle.addEventListener('click', () => {
  open = !open;
  fabPill.classList.toggle('open', open);
});

// Закрытие по клику вне кнопки
document.addEventListener('click', (e) => {
  if (open && !fabPill.contains(e.target)) {
    open = false;
    fabPill.classList.remove('open');
  }
});