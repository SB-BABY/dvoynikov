document.addEventListener("DOMContentLoaded", () => {
    const phoneBlocks = document.querySelectorAll('.header__phone');

    if (!phoneBlocks.length) return;

    phoneBlocks.forEach(block => {
        block.addEventListener('click', (e) => {
            e.stopPropagation();

            // закрываем все остальные
            phoneBlocks.forEach(item => {
                if (item !== block) {
                    item.classList.remove('active');
                }
            });

            // переключаем текущий
            block.classList.toggle('active');
        });
    });

    // клик вне — закрыть всё
    document.addEventListener('click', () => {
        phoneBlocks.forEach(block => {
            block.classList.remove('active');
        });
    });
});