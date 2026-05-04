document.addEventListener("DOMContentLoaded", () => {

    const forms = document.querySelectorAll(".js-contact-form");

    forms.forEach(form => {

        const phoneInput = form.querySelector('input[name="phone"]');

        function formatPhone(value) {

            let digits = value.replace(/\D/g, '');

            if (digits.startsWith('8')) {
                digits = '7' + digits.slice(1);
            }

            if (!digits.startsWith('7')) {
                digits = '7' + digits;
            }

            digits = digits.substring(0, 11);

            return "+" + digits;
        }

        if (phoneInput) {

            phoneInput.addEventListener("input", () => {
                phoneInput.value = formatPhone(phoneInput.value);
            });

            phoneInput.addEventListener("blur", () => {
                phoneInput.value = formatPhone(phoneInput.value);
            });

            phoneInput.addEventListener("paste", () => {
                setTimeout(() => {
                    phoneInput.value = formatPhone(phoneInput.value);
                }, 0);
            });
        }

        form.addEventListener("submit", async function (e) {

            e.preventDefault();

            const honeypot1 = form.querySelector('input[name="qwerty123"]')?.value;
            const honeypot2 = form.querySelector('input[name="123qwerty"]')?.value;

            if (honeypot1 || honeypot2) return;

            if (phoneInput) {
                phoneInput.value = formatPhone(phoneInput.value);
            }

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            // Блокируем кнопку
            const submitBtn = form.querySelector('[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = "Отправка...";

            const formData = new FormData(form);

            try {

                const response = await fetch("./php/send-form.php", {
                    method: "POST",
                    body: formData
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

                    const modal = form.closest(".modal");
                    if (modal) {
                        modal.classList.remove("active");
                        document.body.classList.remove("modal-open");
                    }

                } else {
                    alert("Ошибка отправки");
                    // Разблокируем если ошибка
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Оставить заявку";
                }

            } catch (error) {
                alert("Ошибка соединения");
                console.error(error);
                // Разблокируем если ошибка
                submitBtn.disabled = false;
                submitBtn.textContent = "Оставить заявку";
            }

        });

    });




    /* -------------------
       МОДАЛКА
    ------------------- */

    // const modal = document.getElementById("modal");
    // const openBtn = document.querySelectorAll(".open-modal-btn");
    // const closeBtn = document.querySelector(".modal__close");
    // const overlay = document.querySelector(".modal__overlay");

    // function openModal() {
    //     modal.classList.add("active");
    //     document.body.classList.add("modal-open");
    // }

    // function closeModal() {
    //     modal.classList.remove("active");
    //     document.body.classList.remove("modal-open");
    // }

    // openBtn.forEach(btn => {
    //     btn.addEventListener("click", openModal);
    // });

    // if (closeBtn) {
    //     closeBtn.addEventListener("click", closeModal);
    // }

    // if (overlay) {
    //     overlay.addEventListener("click", closeModal);
    // }

    // document.addEventListener("keydown", (e) => {
    //     if (e.key === "Escape" && modal.classList.contains("active")) {
    //         closeModal();
    //     }
    // });

    const openButtons = document.querySelectorAll(".open-modal-btn");

    openButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const modalId = btn.dataset.modal;
            const modal = document.getElementById(modalId);

            if (!modal) return;

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
                if (e.key === "Escape") {
                    closeModal();
                }
            }

            if (closeBtn) {
                closeBtn.addEventListener("click", closeModal);
            }

            if (overlay) {
                overlay.addEventListener("click", closeModal);
            }

            document.addEventListener("keydown", escHandler);
        });
    });

    // POPUP
    // попап с хранением в сесии
    // const popupShownKey = "popup_modal5_shown";

    // if (!sessionStorage.getItem(popupShownKey)) {
    //     setTimeout(() => {
    //         const modal5 = document.getElementById("modal-5");
    //         if (!modal5) return;

    //         // Не показывать, если другая модалка открыта
    //         if (document.body.classList.contains("modal-open")) return;

    //         modal5.classList.add("active");
    //         document.body.classList.add("modal-open");

    //         sessionStorage.setItem(popupShownKey, "true");

    //         const closeBtn = modal5.querySelector(".modal__close");
    //         const overlay = modal5.querySelector(".modal__overlay");

    //         function closeModal() {
    //             modal5.classList.remove("active");
    //             document.body.classList.remove("modal-open");
    //             document.removeEventListener("keydown", escHandler);
    //         }

    //         function escHandler(e) {
    //             if (e.key === "Escape") closeModal();
    //         }

    //         if (closeBtn) closeBtn.addEventListener("click", closeModal);
    //         if (overlay) overlay.addEventListener("click", closeModal);
    //         document.addEventListener("keydown", escHandler);

    //     }, 1500);
    // }

    // попап без хранения в сесии
    // POPUP
    setTimeout(() => {
        const modal5 = document.getElementById("modal-5");
        if (!modal5) return;

        if (document.body.classList.contains("modal-open")) return;

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

        if (closeBtn) closeBtn.addEventListener("click", closeModal);
        if (overlay) overlay.addEventListener("click", closeModal);
        document.addEventListener("keydown", escHandler);

    }, 15000);

});