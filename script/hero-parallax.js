const hero = document.querySelector('.hero');
const heroBg = document.querySelector('.hero__logo');

if (hero && heroBg) {
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        
        // Позиция мыши от центра секции (-0.5 до 0.5)
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        // Сила параллакса — чем больше число, тем сильнее сдвиг
        const strength = 60;
        
        heroBg.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
    
    // Плавный возврат когда мышь ушла с секции
    hero.addEventListener('mouseleave', () => {
        heroBg.style.transform = `translate(0px, 0px)`;
    });
}