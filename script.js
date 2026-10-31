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

// Section navigation should not leave an anchor that overrides reload position.
(() => {
  const clearFragment = () => {
    if (window.location.hash) {
      history.replaceState(history.state, '', window.location.pathname + window.location.search);
    }
  };
  // Save the position at departure, rather than the last clicked section.
  const positionKey = 'le-ancour:scroll:' + location.pathname + location.search;
  window.addEventListener('pagehide', () => {
    try {
      sessionStorage.setItem(positionKey, JSON.stringify({ x: scrollX, y: scrollY }));
    } catch { /* Native restoration remains available if storage is blocked. */ }
  });
  if (performance.getEntriesByType('navigation')[0]?.type === 'reload') {
    clearFragment();
    try {
      const position = JSON.parse(sessionStorage.getItem(positionKey));
      if (position && Number.isFinite(position.x) && Number.isFinite(position.y)) {
        history.scrollRestoration = 'manual';
        window.addEventListener('pageshow', () => {
          requestAnimationFrame(() => {
            window.scrollTo({ left: position.x, top: position.y, behavior: 'instant' });
            history.scrollRestoration = 'auto';
          });
        }, { once: true });
      }
    } catch { /* Fall back to normal browser restoration. */ }
  }
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
        event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href^="#"]');
    if (!link || link.hasAttribute('download') ||
        (link.target && link.target !== '_self')) return;
    let id;
    try { id = decodeURIComponent(link.hash.slice(1)); } catch { return; }
    const section = document.getElementById(id);
    if (!section) return;
    event.preventDefault();
    clearFragment();
    // Keyboard navigation moves focus; pointer clicks only move the viewport.
    // Leaving a clicked heading focused can make browsers scroll back to it.
    if (event.detail === 0) {
      const focusTarget = section.querySelector('h1, h2') || section;
      if (!focusTarget.hasAttribute('tabindex')) {
        focusTarget.setAttribute('tabindex', '-1');
        focusTarget.addEventListener('blur', () => focusTarget.removeAttribute('tabindex'), { once: true });
      }
      focusTarget.focus({ preventScroll: true });
    }
    section.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'start'
    });
  });
})();
