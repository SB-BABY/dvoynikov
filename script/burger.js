const burger = document.querySelector('.header__burger');
const header = document.querySelector('.header');
const menu = document.querySelector('.header__menu');

burger.addEventListener('click', () => {
    header.classList.toggle('menu-open');
    menu.classList.toggle('bg-liquid-glass');
});

document.querySelectorAll('.header__link').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.header')
            .classList.remove('menu-open');
    });
});