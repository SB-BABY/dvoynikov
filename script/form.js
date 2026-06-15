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

    /** Определяет, является ли строка email */
    function isEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    }

    /** Определяет, является ли строка телефоном (содержит только цифры/+/пробелы/скобки/дефисы) */
    function looksLikePhone(value) {
        return /^[\d\s\+\(\)\-]+$/.test(value.trim()) && value.replace(/\D/g, "").length >= 3;
    }

    /**
     * Подсвечивает поле как ошибочное
     * Ищет ближайший .form__error и показывает сообщение
     */
    function showFieldError(input, message) {
        input.style.outline = "2px solid red";
        const errorEl = input
            .closest(".form__group, .services__form-group, .services__form-second-radio-group, .form__check, .hh__group")
            ?.querySelector(".form__error");
        if (errorEl) {
            errorEl.textContent = message || "Заполните поле";
            errorEl.style.display = "block";
        }
    }

    function clearFieldError(input) {
        input.style.outline = "";
        const errorEl = input
            .closest(".form__group, .services__form-group, .services__form-second-radio-group, .form__check, .hh__group")
            ?.querySelector(".form__error");
        if (errorEl) {
            errorEl.textContent = "";
            errorEl.style.display = "none";
        }
    }

    function showTextareaError(textarea, message) {
        textarea.style.outline = "2px solid red";
        // Ищем или создаём span.form__error рядом с textarea
        let errorEl = textarea.parentElement?.querySelector(".form__error");
        if (!errorEl) {
            errorEl = document.createElement("span");
            errorEl.className = "form__error";
            errorEl.style.cssText = "display:block;font-size:12px;color:red;margin-top:4px;";
            textarea.insertAdjacentElement("afterend", errorEl);
        }
        errorEl.textContent = message || "Заполните поле";
        errorEl.style.display = "block";
    }

    function clearTextareaError(textarea) {
        textarea.style.outline = "";
        const errorEl = textarea.parentElement?.querySelector(".form__error");
        if (errorEl) {
            errorEl.textContent = "";
            errorEl.style.display = "none";
        }
    }

    /* =============================================
       ИНИЦИАЛИЗАЦИЯ ПОЛЕЙ «ТЕЛЕФОН ИЛИ EMAIL»
       Применяется к формам: heroFormPopup, modal-1
    ============================================= */

    const PHONE_OR_EMAIL_FORMS = ["heroFormPopup", "modal-1"];

    PHONE_OR_EMAIL_FORMS.forEach((formContainerId) => {
        const container = document.getElementById(formContainerId);
        if (!container) return;

        container.querySelectorAll('input[name="phone"]').forEach((input) => {
            // Меняем placeholder
            input.placeholder = "Телефон или Email";
            // Убираем ограничение maxlength (для email нужно больше)
            input.removeAttribute("maxlength");
            // Убираем inputmode="tel" — будет определяться динамически
            input.removeAttribute("inputmode");
            // Убираем type="tel", чтобы не мешало вводу email
            input.type = "text";
            // Переименовываем, чтобы различать при отправке
            input.dataset.phoneOrEmail = "true";

            input.addEventListener("input", () => {
                clearFieldError(input);
                // Если похоже на телефон — форматируем
                if (looksLikePhone(input.value) && !input.value.includes("@")) {
                    input.value = formatPhone(input.value);
                }
            });

            input.addEventListener("blur", () => {
                if (looksLikePhone(input.value) && !input.value.includes("@")) {
                    input.value = formatPhone(input.value);
                }
            });
        });
    });

    /* =============================================
       ИНИЦИАЛИЗАЦИЯ ОБЫЧНЫХ ТЕЛЕФОННЫХ ПОЛЕЙ
       (всех остальных форм, кроме PHONE_OR_EMAIL_FORMS)
    ============================================= */

    document.querySelectorAll('input[name="phone"]').forEach((phoneInput) => {
        // Пропускаем поля, которые уже обработаны как phoneOrEmail
        if (phoneInput.dataset.phoneOrEmail) return;

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
    ============================================= */

    document.querySelectorAll(".js-contact-form").forEach((form) => {
        const socialToggleBtn = form.querySelector(".form__group-btn");
        const socialChecksBlock = form.querySelector(".form__group-social");
        const socialError = form.querySelector(".social-error");

        if (!socialToggleBtn || !socialChecksBlock) return;

        socialChecksBlock.style.display = "none";

        socialToggleBtn.addEventListener("click", () => {
            const isOpen = socialChecksBlock.style.display !== "none";
            socialChecksBlock.style.display = isOpen ? "none" : "grid";
            socialToggleBtn.classList.toggle("active", !isOpen);
        });

        socialChecksBlock.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
            cb.addEventListener("change", () => {
                const anyChecked = [...socialChecksBlock.querySelectorAll('input[type="checkbox"]')].some((c) => c.checked);
                if (anyChecked) {
                    if (socialError) socialError.style.display = "none";
                    socialToggleBtn.style.outline = "";
                }
            });
        });
    });

    // Инициализация .hh__group-social (modal-100) — без кнопки-тоггла, всегда видим
    document.querySelectorAll(".hh__group-social").forEach((socialBlock) => {
        const socialError = socialBlock.closest("form")?.querySelector(".social-error");
        socialBlock.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
            cb.addEventListener("change", () => {
                const anyChecked = [...socialBlock.querySelectorAll('input[type="checkbox"]')].some((c) => c.checked);
                if (anyChecked) {
                    socialBlock.style.outline = "";
                    socialBlock.style.borderRadius = "";
                    socialBlock.style.padding = "";
                    if (socialError) socialError.style.display = "none";
                }
            });
        });
    });

    /* =============================================
       TEXTAREA — автовысота и очистка ошибки
    ============================================= */

    document.querySelectorAll(".hh__textarea").forEach((ta) => {
        ta.addEventListener("input", () => {
            ta.style.height = "auto";
            ta.style.height = ta.scrollHeight + "px";
            clearTextareaError(ta);
        });
    });

    /* =============================================
       ОБЩАЯ ОБРАБОТКА ВСЕХ ФОРМ
    ============================================= */

    const forms = document.querySelectorAll(".js-contact-form");

    forms.forEach((form) => {
        const formContainer = form.closest(
            "#heroFormPopup, #modal-1, #modal-100, .modal, .form"
        );
        const containerId = formContainer?.id || "";

        // Определяем, является ли форма «телефон или email»
        const isPhoneOrEmailForm = PHONE_OR_EMAIL_FORMS.includes(containerId);
        // Определяем, является ли форма модалкой HH
        const isHHForm = containerId === "modal-100";

        const phoneInput = form.querySelector('input[name="phone"]');

        // Очищаем ошибки при вводе
        form.querySelectorAll("input, select, textarea").forEach((input) => {
            input.addEventListener("input", () => clearFieldError(input));
            input.addEventListener("change", () => clearFieldError(input));
        });

        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            // --- Honeypot ---
            const honeypot1 = form.querySelector('input[name="qwerty123"]')?.value;
            const honeypot2 = form.querySelector('input[name="123qwerty"]')?.value;
            if (honeypot1 || honeypot2) return;

            let hasErrors = false;

            // 1. Текстовые поля (required), кроме checkbox/radio
            form.querySelectorAll('input[required]:not([type="checkbox"]):not([type="radio"])').forEach((input) => {
                // Поле телефон/email обрабатывается отдельно ниже
                if (input.dataset.phoneOrEmail) return;

                if (!input.value.trim()) {
                    showFieldError(input, "Заполните поле");
                    hasErrors = true;
                } else {
                    clearFieldError(input);
                }
            });

            // 2. Валидация поля «телефон или email» (для heroFormPopup и modal-1)
            if (isPhoneOrEmailForm && phoneInput && phoneInput.dataset.phoneOrEmail) {
                const val = phoneInput.value.trim();

                if (!val) {
                    showFieldError(phoneInput, "Введите телефон или email");
                    hasErrors = true;
                } else if (val.includes("@")) {
                    // Проверка email
                    if (!isEmail(val)) {
                        showFieldError(phoneInput, "Введите корректный email");
                        hasErrors = true;
                    } else {
                        clearFieldError(phoneInput);
                    }
                } else {
                    // Проверка телефона
                    phoneInput.value = formatPhone(phoneInput.value);
                    const digits = phoneInput.value.replace(/\D/g, "");
                    if (digits.length < 11) {
                        showFieldError(phoneInput, "Введите корректный номер телефона");
                        hasErrors = true;
                    } else {
                        clearFieldError(phoneInput);
                    }
                }
            }

            // 3. Валидация обычного поля телефона (не phoneOrEmail)
            if (!isPhoneOrEmailForm && phoneInput && !phoneInput.dataset.phoneOrEmail) {
                phoneInput.value = formatPhone(phoneInput.value);
                const digits = phoneInput.value.replace(/\D/g, "");
                if (digits.length < 11) {
                    showFieldError(phoneInput, "Введите корректный номер");
                    hasErrors = true;
                }
            }

            // 4. Радио-кнопки (selector)
            const radioGroup = form.querySelector('input[name="selector"]');
            if (radioGroup) {
                const anyRadioChecked = [...form.querySelectorAll('input[name="selector"]')].some((r) => r.checked);
                if (!anyRadioChecked) {
                    const radioContainer = form.querySelector(".services__form-radio-group, .services__form-second-radio-group ");
                    if (radioContainer) {
                        radioContainer.style.outline = "2px solid red";
                        radioContainer.style.borderRadius = "8px";
                        radioContainer.style.padding = "6px";
                        form.querySelectorAll('input[name="selector"]').forEach((r) => {
                            r.addEventListener("change", () => {
                                radioContainer.style.outline = "";
                                radioContainer.style.padding = "";
                            }, { once: true });
                        });
                    }
                    hasErrors = true;
                }
            }

            // 5. Соцсети (.form__group-social — обычные формы, .hh__group-social — modal-100)
            const socialBlock = form.querySelector(".form__group-social, .hh__group-social");
            const socialError = form.querySelector(".social-error");
            const socialToggleBtn = form.querySelector(".form__group-btn");

            if (socialBlock) {
                const anyChecked = [...socialBlock.querySelectorAll('input[type="checkbox"]')].some((c) => c.checked);
                if (!anyChecked) {
                    // Подсвечиваем сам блок с чекбоксами
                    socialBlock.style.outline = "2px solid red";
                    socialBlock.style.borderRadius = "8px";
                    socialBlock.style.padding = "6px";

                    // Показываем текст ошибки
                    if (socialError) socialError.style.display = "block";

                    // Подсвечиваем кнопку-тоггл (если есть, только в обычных формах)
                    if (socialToggleBtn) socialToggleBtn.style.outline = "2px solid red";

                    // Снимаем подсветку при первом выборе
                    socialBlock.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
                        cb.addEventListener("change", () => {
                            socialBlock.style.outline = "";
                            socialBlock.style.borderRadius = "";
                            socialBlock.style.padding = "";
                            if (socialError) socialError.style.display = "none";
                            if (socialToggleBtn) socialToggleBtn.style.outline = "";
                        }, { once: true });
                    });

                    hasErrors = true;
                }
            }

            // 6. Чекбоксы политики (required)
            form.querySelectorAll('input[type="checkbox"][required]').forEach((cb) => {
                if (!cb.checked) {
                    hasErrors = true;
                    const label = cb.nextElementSibling;
                    if (label && label.tagName === "LABEL") {
                        label.style.boxShadow = "0 0 0 2px red";
                        cb.addEventListener("change", () => {
                            label.style.boxShadow = "";
                            clearFieldError(cb);
                        }, { once: true });
                    }
                    const wrap = cb.closest(".form__check-wrap");
                    if (wrap) {
                        let errEl = wrap.querySelector(".form__check-inline-error");
                        if (!errEl) {
                            errEl = document.createElement("span");
                            errEl.className = "form__check-inline-error";
                            errEl.style.cssText = "display:block;font-size:11px;color:red;margin-top:4px;white-space:nowrap;";
                            wrap.appendChild(errEl);
                        }
                        errEl.textContent = "Обязательно";
                        cb.addEventListener("change", () => { errEl.textContent = ""; }, { once: true });
                    }
                } else {
                    clearFieldError(cb);
                }
            });

            // 7. Textarea в форме HH (modal-100) — обязательные поля
            if (isHHForm) {
                form.querySelectorAll(".hh__textarea").forEach((ta) => {
                    if (!ta.value.trim()) {
                        showTextareaError(ta, "Заполните поле");
                        hasErrors = true;
                    } else {
                        clearTextareaError(ta);
                    }
                });
            }

            if (hasErrors) return;

            // --- Блокируем кнопку ---
            const submitBtn = form.querySelector('[type="submit"]');
            const originalHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.textContent = "Отправка...";

            const formData = new FormData(form);

            // Если поле phoneOrEmail содержит email — переименовываем для бэкенда
            if (isPhoneOrEmailForm && phoneInput?.dataset.phoneOrEmail) {
                const val = phoneInput.value.trim();
                if (isEmail(val)) {
                    formData.delete("phone");
                    formData.append("email", val);
                }
            }

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
                    const socialBlockReset = form.querySelector(".form__group-social, .hh__group-social");
                    if (socialBlockReset) socialBlockReset.style.display = "none";
                    if (socialToggleBtn) socialToggleBtn.classList.remove("active");

                    // Сбрасываем textarea
                    form.querySelectorAll(".hh__textarea").forEach((ta) => {
                        ta.style.height = "";
                        clearTextareaError(ta);
                    });

                    // Закрываем модалку
                    const modal = form.closest(".modal");
                    if (modal) {
                        modal.classList.remove("active");
                        document.body.classList.remove("modal-open");
                    }

                    // Закрываем hero-попап
                    const heroPopup = form.closest("#heroFormPopup");
                    if (heroPopup) {
                        heroPopup.classList.remove("active");
                        document.getElementById("heroFormOverlay")?.classList.remove("active");
                        document.body.classList.remove("modal-open");
                    }
                } else {
                    alert("Ошибка отправки. Попробуйте ещё раз.");
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalHTML;
                }
            } catch (error) {
                alert("Ошибка соединения. Попробуйте ещё раз.");
                console.error(error);
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
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

            const currentModal = btn.closest(".modal");
            if (currentModal) currentModal.classList.remove("active");

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
        if (e.key === "Escape" && heroPopup?.classList.contains("active")) closeHeroPopup();
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