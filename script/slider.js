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
        autoplay: true,
        autoplaySpeed: 2000,
        centerMode: true,
        centerPadding: '0px',
        // prevArrow: $('.prev'),
        // nextArrow: $('.next'),
        arrows: false,
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

    $(".slider__parthner-slider").slick({
        dots: false,
        arrows: false,
        infinite: true,
        speed: 600,
        slidesToShow: 7,
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

    $('.team-slider').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        infinite: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 1500,
        centerMode: false,          // на десктопе НЕТ centerMode
        cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
        responsive: [
            {
                breakpoint: 1100,
                settings: { slidesToShow: 3, centerMode: false }
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: 2, centerMode: false }
            },
            {
                breakpoint: 480,
                settings: { slidesToShow: 1, centerMode: true, centerPadding: '50px' }
            }
        ]
    });


});