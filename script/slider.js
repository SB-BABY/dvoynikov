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

    var $slider = $('.slider__list');
    var DOT_SIZES = { 0: 28, 1: 20, 2: 14, 3: 10 };
    var GAP = 8;
    var VISIBLE = 3;

    function renderDots(slick) {
        var $dots = $(slick.$dots);
        var $items = $dots.find('li');
        var current = slick.currentSlide;
        var total = slick.slideCount;

        // 1. Скрываем/показываем и задаём размеры
        $items.each(function (i) {
            var d = Math.abs(i - current);
            d = Math.min(d, total - d);
            var sz = DOT_SIZES[d] !== undefined ? DOT_SIZES[d] : 7;

            $(this)
                .attr('data-dist', d)
                .css('display', d <= VISIBLE ? 'block' : 'none')
                .find('button').css({ width: sz + 'px', height: sz + 'px' });
        });

        // 2. Считаем offset ТОЛЬКО по видимым точкам в порядке их отображения
        //    Строим массив: offset от -VISIBLE до +VISIBLE → реальный индекс → размер
        var segments = []; // { sz, isActive }
        for (var offset = -VISIBLE; offset <= VISIBLE; offset++) {
            var idx = ((current + offset) % total + total) % total;
            var d = Math.abs(offset);
            var sz = DOT_SIZES[d] !== undefined ? DOT_SIZES[d] : 7;
            segments.push({ sz: sz, isActive: offset === 0 });
        }

        // 3. Позиция центра активной точки внутри трека
        var activeCenterInTrack = 0;
        for (var j = 0; j < segments.length; j++) {
            if (segments[j].isActive) {
                activeCenterInTrack += segments[j].sz / 2;
                break;
            }
            activeCenterInTrack += segments[j].sz + GAP;
        }

        // 4. Сдвиг: центр активной = центр враппера
        var $wrap = $dots.closest('.my-dots-wrap');
        var vpHalf = $wrap.outerWidth() / 2;
        var shift = vpHalf - activeCenterInTrack;

        $dots.css('transform', 'translateX(' + Math.round(shift) + 'px)');
    }

    $slider.on('init', function (e, slick) {
        // Оборачиваем ПОСЛЕ того как slick создал ul.my-dots
        // и ВЫТАСКИВАЕМ его ИЗ ul.slider__list наружу
        var $dots = $(slick.$dots);
        $dots.appendTo($slider.closest('.slider__lists'));
        $dots.wrap('<div class="my-dots-wrap"></div>');
        renderDots(slick);
    });

    $slider.on('afterChange', function (e, slick) {
        renderDots(slick);
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
        dots: true,
        dotsClass: "my-dots",
        customPaging: function () {
            return '<button type="button"></button>';
        },
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
        const slider = document.querySelector('.slider__lists');

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
                breakpoint: 1024,
                settings: {
                    slidesToShow: 5,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 425,
                settings: {
                    slidesToShow: 1,
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
                settings: { slidesToShow: 1, centerMode: false }
            }
        ]
    });


});