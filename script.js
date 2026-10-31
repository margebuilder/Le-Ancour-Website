// Reveal each section once as it enters the viewport. Keep content accessible
// when JavaScript, IntersectionObserver, or animations are unavailable.
(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || !('IntersectionObserver' in window)) return;
  const elements = document.querySelectorAll(
    '.hero-copy > *, .hero-art, .hero-bottom, .about > div, .leadership-grid > *, .section-heading, .investment-list article, .details > div:first-child, .contact-copy > p, .detail-list > div, .footer-top > *, .footer-bottom'
  );
  let observer;
  const showAll = () => {
    observer?.disconnect();
    elements.forEach(element => element.classList.remove('is-pending', 'is-visible'));
  };
  try {
    observer = new IntersectionObserver(entries => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        target.classList.remove('is-pending');
        target.classList.add('is-visible');
        observer.unobserve(target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });
    ['.hero-copy > *', '.about > div', '.investment-list article',
      '.contact-copy > p', '.detail-list > div', '.footer-top > *'].forEach(selector => {
      document.querySelectorAll(selector).forEach((element, index) => {
        element.style.setProperty('--reveal-delay', `${Math.min(index * 110, 330)}ms`);
      });
    });
    elements.forEach(element => {
      element.classList.add('reveal', 'is-pending');
      observer.observe(element);
    });
    motion.addEventListener('change', showAll);
    document.addEventListener('focusin', event => {
      const parent = event.target.closest('.reveal');
      if (parent) {
        parent.classList.remove('is-pending', 'is-visible');
        observer.unobserve(parent);
      }
    });
  } catch {
    showAll();
  }
})();

// Type only Jackie's description, once, without shifting the surrounding layout.
(() => {
  const paragraph = document.querySelector('.leader-copy > p:last-child');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!paragraph || motion.matches || !('IntersectionObserver' in window)) return;
  const fullText = paragraph.textContent;
  const characters = typeof Intl.Segmenter === 'function'
    ? [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(fullText)].map(item => item.segment)
    : Array.from(fullText);
  let frame;
  let observer;
  const finish = () => {
    cancelAnimationFrame(frame);
    observer?.disconnect();
    paragraph.textContent = fullText;
    paragraph.classList.remove('typewriter');
  };
  motion.addEventListener('change', finish);
  try {
    observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      if (motion.matches) return;
      // Screen readers receive the complete sentence, without live announcements.
      const accessibleText = document.createElement('span');
      accessibleText.className = 'visually-hidden';
      accessibleText.textContent = fullText;
      const spacer = document.createElement('span');
      spacer.className = 'typing-spacer';
      spacer.setAttribute('aria-hidden', 'true');
      spacer.textContent = fullText;
      const visibleText = document.createElement('span');
      visibleText.className = 'typing-text';
      visibleText.setAttribute('aria-hidden', 'true');
      paragraph.replaceChildren(accessibleText, spacer, visibleText);
      paragraph.classList.add('typewriter');
      const started = performance.now();
      const tick = now => {
        const count = Math.floor((now - started) / 22);
        visibleText.textContent = characters.slice(0, count).join('');
        if (count >= characters.length) {
          finish();
        } else {
          frame = requestAnimationFrame(tick);
        }
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.35, rootMargin: '0px 0px -40px 0px' });
    observer.observe(paragraph);
  } catch {
    finish();
  }
})();
