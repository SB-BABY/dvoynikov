$(document).ready(function () {

    $(".hero__list").slick({
        dots: false,
        arrows: true,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1500,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                },
            },
        ],
    });

    $('.slider__list').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        speed: 500,
        autoplay: false,
        autoplaySpeed: 2000,
        centerMode: true,
        centerPadding: '0px',
        prevArrow: $('.prev'),
        nextArrow: $('.next'),
        arrows: true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    centerMode: false,
                },
            },
        ],
    });

    function moveArrows() {
        const isMobile = window.innerWidth <= 768;

        const centerSlide = document.querySelector('.slider__list .slick-center');
        const prev = document.querySelector('.prev');
        const next = document.querySelector('.next');
        const slider = document.querySelector('.slider__content');

        if (!prev || !next || !slider) return;

        // 👉 ВСЕГДА сначала возвращаем стрелки в исходное место
        slider.appendChild(prev);
        slider.appendChild(next);

        // 👉 если НЕ мобилка — дальше ничего не делаем
        if (!isMobile) return;

        if (!centerSlide) return;

        const content = centerSlide.querySelector('.slider__item-content');
        if (!content) return;

        // 👉 переносим внутрь карточки
        content.appendChild(prev);
        content.appendChild(next);
    }

    $(document).ready(function () {
        const $slider = $('.slider__list');

        $slider.on('init', moveArrows);
        $slider.on('afterChange', moveArrows);
        $slider.on('setPosition', moveArrows);

        // 👉 при ресайзе
        window.addEventListener('resize', moveArrows);
    });

    $(".documents__list").slick({
        dots: false,
        arrows: true,
        infinite: true,
        speed: 600,
        slidesToShow: 3,
        rows: 2,
        slidesToScroll: 1,
        // autoplay: true,
        // autoplaySpeed: 150000,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1.5,
                    vertical: true,
                },
            },
        ],
    });


});