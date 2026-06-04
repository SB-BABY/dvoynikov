document.addEventListener("DOMContentLoaded", () => {
    /* =============================================
       ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
    ============================================= */

    function formatPhone(value) {
        let digits = value.replace(/\D/g, "");
        if (digits.startsWith("8")) digits = "7" + digits.slice(1);
        if (!digits.startsWith("7")) digits = "7" + digits;
        digits = digits.substring(0, 11);
        return "+" + digits;
    }

    /**
     * Подсвечивает поле как ошибочное
     * Ищет ближайший .form__error и показывает сообщение
     */
    function showFieldError(input, message) {
        input.style.outline = "2px solid red";
        const errorEl = input
            .closest(".form__group, .services__form-group, .form__check")
            ?.querySelector(".form__error");
        if (errorEl) {
            errorEl.textContent = message || "Заполните поле";
            errorEl.style.display = "block";
        }
    }

    function clearFieldError(input) {
        input.style.outline = "";
        const errorEl = input
            .closest(".form__group, .services__form-group, .form__check")
            ?.querySelector(".form__error");
        if (errorEl) {
            errorEl.textContent = "";
            errorEl.style.display = "none";
        }
    }

    /* =============================================
       ИНИЦИАЛИЗАЦИЯ ТЕЛЕФОННЫХ ПОЛЕЙ
    ============================================= */

    document.querySelectorAll('input[name="phone"]').forEach((phoneInput) => {
        phoneInput.addEventListener("input", () => {
            phoneInput.value = formatPhone(phoneInput.value);
            clearFieldError(phoneInput);
        });
        phoneInput.addEventListener("blur", () => {
            phoneInput.value = formatPhone(phoneInput.value);
        });
        phoneInput.addEventListener("paste", () => {
            setTimeout(() => {
                phoneInput.value = formatPhone(phoneInput.value);
            }, 0);
        });
    });

    /* =============================================
       КНОПКА «ГДЕ УДОБНО СВЯЗАТЬСЯ»
       Тогл блока с соцсетями в основной форме
    ============================================= */

    const socialToggleBtn = document.getElementById("socialToggleBtn");
    const socialChecksBlock = document.getElementById("socialChecksBlock");

    if (socialToggleBtn && socialChecksBlock) {
        // Скрываем блок изначально
        socialChecksBlock.style.display = "none";

        socialToggleBtn.addEventListener("click", () => {
            const isOpen = socialChecksBlock.style.display !== "none";
            socialChecksBlock.style.display = isOpen ? "none" : "grid";
            socialToggleBtn.classList.toggle("active", !isOpen);
        });

        // Снимаем ошибку при выборе соцсети
        socialChecksBlock
            .querySelectorAll('input[type="checkbox"]')
            .forEach((cb) => {
                cb.addEventListener("change", () => {
                    const socialError = document.getElementById("socialError");
                    const anyChecked = [
                        ...socialChecksBlock.querySelectorAll(
                            'input[type="checkbox"]',
                        ),
                    ].some((c) => c.checked);
                    if (anyChecked && socialError) {
                        socialError.style.display = "none";
                        socialToggleBtn.style.outline = "";
                    }
                });
            });
    }

    /* =============================================
       ОБЩАЯ ОБРАБОТКА ВСЕХ ФОРМ
    ============================================= */

    const forms = document.querySelectorAll(".js-contact-form");

    forms.forEach((form) => {
        const phoneInput = form.querySelector('input[name="phone"]');

        // Очищаем ошибки при вводе
        form.querySelectorAll("input, select, textarea").forEach((input) => {
            input.addEventListener("input", () => clearFieldError(input));
            input.addEventListener("change", () => clearFieldError(input));
        });

        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            // --- Honeypot ---
            const honeypot1 = form.querySelector(
                'input[name="qwerty123"]',
            )?.value;
            const honeypot2 = form.querySelector(
                'input[name="123qwerty"]',
            )?.value;
            if (honeypot1 || honeypot2) return;

            // --- Форматируем телефон ---
            if (phoneInput) phoneInput.value = formatPhone(phoneInput.value);

            // --- Кастомная валидация ---
            let hasErrors = false;

            // 1. Текстовые/телефонные поля (required)
            form.querySelectorAll(
                'input[required]:not([type="checkbox"]):not([type="radio"])',
            ).forEach((input) => {
                if (!input.value.trim()) {
                    showFieldError(input, "Заполните поле");
                    hasErrors = true;
                } else {
                    clearFieldError(input);
                }
            });

            // 2. Телефон — минимум 12 символов (+7XXXXXXXXXX)
            if (phoneInput) {
                const digits = phoneInput.value.replace(/\D/g, "");
                if (digits.length < 11) {
                    showFieldError(phoneInput, "Введите корректный номер");
                    hasErrors = true;
                }
            }

            // 3. Радио-кнопки (selector) — попап/модалка
            const radioGroup = form.querySelector('input[name="selector"]');
            if (radioGroup) {
                const anyRadioChecked = [
                    ...form.querySelectorAll('input[name="selector"]'),
                ].some((r) => r.checked);
                if (!anyRadioChecked) {
                    // Подсвечиваем весь блок радио-кнопок
                    const radioContainer = form.querySelector(
                        ".services__form-radio-group",
                    );
                    if (radioContainer) {
                        radioContainer.style.outline = "2px solid red";
                        radioContainer.style.borderRadius = "8px";
                        radioContainer.style.padding = "6px";
                        // Убираем подсветку при первом выборе
                        form.querySelectorAll('input[name="selector"]').forEach(
                            (r) => {
                                r.addEventListener(
                                    "change",
                                    () => {
                                        radioContainer.style.outline = "";
                                        radioContainer.style.padding = "";
                                    },
                                    { once: true },
                                );
                            },
                        );
                    }
                    hasErrors = true;
                }
            }

            // 4. Соцсети (только в основной форме #form)
            const mainForm = form.closest("#form");
            if (mainForm) {
                const socialBlock = form.querySelector("#socialChecksBlock");
                const socialError = form.querySelector("#socialError");
                const socialVisible =
                    socialBlock && socialBlock.style.display !== "none";

                if (socialVisible) {
                    const anyChecked = [
                        ...form.querySelectorAll(
                            '#socialChecksBlock input[type="checkbox"]',
                        ),
                    ].some((c) => c.checked);
                    if (!anyChecked) {
                        if (socialError) socialError.style.display = "block";
                        if (socialToggleBtn)
                            socialToggleBtn.style.outline = "2px solid red";
                        hasErrors = true;
                    }
                }
            }

            // 5. Чекбоксы политики (required)
            form.querySelectorAll('input[type="checkbox"][required]').forEach(
                (cb) => {
                    if (!cb.checked) {
                        hasErrors = true;

                        // Подсвечиваем круглую метку (label идёт следующим после input)
                        const label = cb.nextElementSibling;
                        if (label && label.tagName === "LABEL") {
                            label.style.boxShadow = "0 0 0 2px red";
                            cb.addEventListener(
                                "change",
                                () => {
                                    label.style.boxShadow = "";
                                    clearFieldError(cb);
                                },
                                { once: true },
                            );
                        }

                        // Показываем текстовую ошибку — ищем ближайший .form__check-tip
                        const wrap = cb.closest(".form__check-wrap");
                        if (wrap) {
                            let errEl = wrap.querySelector(
                                ".form__check-inline-error",
                            );
                            if (!errEl) {
                                errEl = document.createElement("span");
                                errEl.className = "form__check-inline-error";
                                errEl.style.cssText =
                                    "display:block;font-size:11px;color:red;margin-top:4px;white-space:nowrap;";
                                wrap.appendChild(errEl);
                            }
                            errEl.textContent = "Обязательно";
                            cb.addEventListener(
                                "change",
                                () => {
                                    errEl.textContent = "";
                                },
                                { once: true },
                            );
                        }
                    } else {
                        clearFieldError(cb);
                    }
                },
            );

            if (hasErrors) return;

            // --- Блокируем кнопку ---
            const submitBtn = form.querySelector('[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = "Отправка...";

            const formData = new FormData(form);

            try {
                const response = await fetch("./php/send-form.php", {
                    method: "POST",
                    body: formData,
                });

                const text = await response.text();
                let result;

                try {
                    result = JSON.parse(text);
                } catch {
                    throw new Error("Invalid JSON");
                }

                if (result.success) {
                    alert("Заявка успешно отправлена!");
                    form.reset();

                    // Сбрасываем соцсети
                    const socialBlock =
                        form.querySelector("#socialChecksBlock");
                    if (socialBlock) socialBlock.style.display = "none";
                    if (socialToggleBtn)
                        socialToggleBtn.classList.remove("active");

                    // Закрываем модалку если отправка из неё
                    const modal = form.closest(".modal");
                    if (modal) {
                        modal.classList.remove("active");
                        document.body.classList.remove("modal-open");
                    }

                    // Закрываем hero-попап если отправка из него
                    const heroPopup = form.closest("#heroFormPopup");
                    if (heroPopup) {
                        heroPopup.classList.remove("active");
                        document
                            .getElementById("heroFormOverlay")
                            ?.classList.remove("active");
                        document.body.classList.remove("modal-open");
                    }
                } else {
                    alert("Ошибка отправки. Попробуйте ещё раз.");
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            } catch (error) {
                alert("Ошибка соединения. Попробуйте ещё раз.");
                console.error(error);
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    });

    /* =============================================
       МОДАЛКИ (открытие по data-modal)
    ============================================= */

    document.querySelectorAll(".open-modal-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const modalId = btn.dataset.modal;
            const modal = document.getElementById(modalId);
            if (!modal) return;

            // Найти текущую открытую модалку
            const currentModal = btn.closest(".modal");

            if (currentModal) {
                currentModal.classList.remove("active");
            }

            // Открыть новую
            modal.classList.add("active");
            document.body.classList.add("modal-open");

            modal.classList.add("active");
            document.body.classList.add("modal-open");

            const closeBtn = modal.querySelector(".modal__close");
            const overlay = modal.querySelector(".modal__overlay");

            function closeModal() {
                modal.classList.remove("active");
                document.body.classList.remove("modal-open");
                document.removeEventListener("keydown", escHandler);
            }

            function escHandler(e) {
                if (e.key === "Escape") closeModal();
            }

            closeBtn?.addEventListener("click", closeModal);
            overlay?.addEventListener("click", closeModal);
            document.addEventListener("keydown", escHandler);
        });
    });

    /* =============================================
       HERO POPUP
    ============================================= */

    const heroBtn = document.getElementById("heroBtn");
    const heroPopup = document.getElementById("heroFormPopup");
    const heroOverlay = document.getElementById("heroFormOverlay");
    const heroClose = document.getElementById("heroFormClose");

    function openHeroPopup() {
        heroPopup?.classList.add("active");
        heroOverlay?.classList.add("active");
        document.body.classList.add("modal-open");
    }

    function closeHeroPopup() {
        heroPopup?.classList.remove("active");
        heroOverlay?.classList.remove("active");
        document.body.classList.remove("modal-open");
    }

    heroBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        openHeroPopup();
    });
    heroClose?.addEventListener("click", closeHeroPopup);
    heroOverlay?.addEventListener("click", closeHeroPopup);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && heroPopup?.classList.contains("active"))
            closeHeroPopup();
    });

    /* =============================================
       АВТОПОПАП через 15 секунд
    ============================================= */

    setTimeout(() => {
        const modal5 = document.getElementById("modal-5");
        if (!modal5 || document.body.classList.contains("modal-open")) return;

        modal5.classList.add("active");
        document.body.classList.add("modal-open");

        const closeBtn = modal5.querySelector(".modal__close");
        const overlay = modal5.querySelector(".modal__overlay");

        function closeModal() {
            modal5.classList.remove("active");
            document.body.classList.remove("modal-open");
            document.removeEventListener("keydown", escHandler);
        }

        function escHandler(e) {
            if (e.key === "Escape") closeModal();
        }

        closeBtn?.addEventListener("click", closeModal);
        overlay?.addEventListener("click", closeModal);
        document.addEventListener("keydown", escHandler);
    }, 15000);
});
