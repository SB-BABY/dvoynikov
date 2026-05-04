function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animateCounter(el, endValue) {
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const current = Math.round(easeOut(progress) * endValue);
    el.textContent = current;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function runAdvantagesAnimation() {
  const items = document.querySelectorAll('.advantages__item');

  items.forEach((item, i) => {
    setTimeout(() => {
      item.classList.add('animated');

      // Берём span внутри заголовка — если есть, анимируем
      const span = item.querySelector('.advantages__item-title span');
      if (!span) return; // "3-6" — нет span, пропускаем

      const endValue = parseInt(span.textContent.trim());
      if (isNaN(endValue)) return; // на всякий случай

      animateCounter(span, endValue);
    }, i * 120);
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      runAdvantagesAnimation();
      observer.disconnect();
    }
  });
}, { threshold: 0.3 });

observer.observe(document.querySelector('.advantages__list'));