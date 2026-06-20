/**
 * cookie-banner.js
 *
 * Логика показа/скрытия баннера cookie.
 * Согласие хранится в localStorage на N дней (берём из data-days кнопки).
 *
 * Подключать ПОСЛЕДНИМ в списке скриптов (после всех остальных).
 */

(function () {
    'use strict';

    var STORAGE_KEY = 'dvoynikov_cookies_accepted';

    // ── Helpers ─────────────────────────────────────────────────────────────

    /**
     * Проверяем, не истёк ли срок согласия.
     * Храним: { accepted: true, expires: <timestamp ms> }
     */
    function isAccepted() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return false;
            var data = JSON.parse(raw);
            if (!data || !data.accepted) return false;
            // Если expires не задан — считаем бессрочным
            if (data.expires && Date.now() > data.expires) {
                localStorage.removeItem(STORAGE_KEY);
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Сохраняем согласие на days дней.
     */
    function setAccepted(days) {
        try {
            var expires = days > 0
                ? Date.now() + days * 24 * 60 * 60 * 1000
                : null;
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                accepted: true,
                expires:  expires,
                date:     new Date().toISOString(),
            }));
        } catch (e) {
            // localStorage недоступен (приватный режим) — молча игнорируем
        }
    }

    // ── Основная логика ──────────────────────────────────────────────────────

    document.addEventListener('DOMContentLoaded', function () {
        var banner    = document.getElementById('cookieBanner');
        var acceptBtn = document.getElementById('cookieBannerAccept');

        // Баннера нет в DOM (шаблон не подключён) — выходим
        if (!banner || !acceptBtn) return;

        // Согласие уже дано — баннер не показываем вообще
        if (isAccepted()) {
            banner.style.display = 'none';
            return;
        }

        // Читаем количество дней из data-атрибута кнопки (задаётся в PHP из ACF)
        var days = parseInt(acceptBtn.dataset.days, 10) || 365;

        // Показываем баннер с небольшой задержкой,
        // чтобы не конкурировать с другими анимациями при загрузке страницы
        setTimeout(function () {
            banner.classList.add('is-visible');
        }, 1200);

        // ── Принятие ────────────────────────────────────────────────────────
        acceptBtn.addEventListener('click', function () {
            setAccepted(days);
            hideBanner();
        });

        // ── Скрытие с анимацией ──────────────────────────────────────────────
        function hideBanner() {
            banner.classList.remove('is-visible');
            banner.classList.add('is-hiding');

            // После завершения CSS-перехода убираем из потока
            banner.addEventListener('transitionend', function onEnd() {
                banner.removeEventListener('transitionend', onEnd);
                banner.style.display = 'none';
            });

            // Страховка: если transitionend не сработал (display:none до анимации)
            setTimeout(function () {
                banner.style.display = 'none';
            }, 500);
        }
    });
})();