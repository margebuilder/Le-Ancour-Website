// Reveal each section once as it enters the viewport. Keep content accessible
// when JavaScript, IntersectionObserver, or animations are unavailable.
(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || !('IntersectionObserver' in window)) return;

  const elements = document.querySelectorAll(
    '.about > div, .leadership-grid > *, .section-heading, .investment-list article, .details > div'
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

    elements.forEach(element => {
      element.classList.add('reveal', 'is-pending');
      observer.observe(element);
    });
    motion.addEventListener('change', showAll);
    // Reveal focused content immediately for keyboard and assistive navigation.
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
