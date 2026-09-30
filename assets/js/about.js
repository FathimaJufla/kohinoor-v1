/* ═══════════════════════════════════════
   KOHINOOR CATERER — ABOUT PAGE LOGIC
   No dependencies
   ═══════════════════════════════════════ */

const init = () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Header gains a solid backdrop once the page is scrolled
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 2. Scroll reveals
  const reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => revealObserver.observe(el));
  }

  // 3. Film band: only download and play the video while it is on screen
  const video = document.querySelector('.film video');
  if (video && !reduceMotion && 'IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.play().catch(() => {}); // Poster stays if autoplay is blocked
      } else {
        video.pause();
      }
    }, { threshold: 0.1 });
    videoObserver.observe(video);
  }

  // 4. Philosophy stack: cards pin with CSS sticky; this adds depth to the
  //    cards underneath as later cards slide over them
  const stack = document.querySelector('.philosophy-stack');
  const pinned = window.matchMedia('(min-height: 521px)');
  if (stack && !reduceMotion && 'IntersectionObserver' in window) {
    const cards = [...stack.querySelectorAll('.philosophy-card')];
    let ticking = false;
    let listening = false;

    const render = () => {
      ticking = false;
      if (!pinned.matches) {
        cards.forEach(card => { card.style.removeProperty('--scale'); card.style.removeProperty('--dim'); });
        return;
      }
      const rects = cards.map(card => card.getBoundingClientRect());
      cards.forEach((card, i) => {
        // Depth = how many later cards cover this one (fractional while in transit)
        let depth = 0;
        for (let j = i + 1; j < cards.length; j++) {
          depth += Math.max(0, Math.min(1, 1 - (rects[j].top - rects[i].top) / rects[i].height));
        }
        card.style.setProperty('--scale', (1 - Math.min(depth, 3) * 0.035).toFixed(4));
        card.style.setProperty('--dim', Math.min(depth * 0.4, 0.7).toFixed(3));
      });
    };
    const requestRender = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(render);
    };
    const listen = (on) => {
      if (on === listening) return;
      listening = on;
      const method = on ? 'addEventListener' : 'removeEventListener';
      window[method]('scroll', requestRender, { passive: true });
      window[method]('resize', requestRender);
    };

    // Scroll work only happens while the stack is on screen
    const stackObserver = new IntersectionObserver(([entry]) => {
      listen(entry.isIntersecting);
      if (entry.isIntersecting) requestRender();
    });
    stackObserver.observe(stack);

    // Release listeners when leaving; re-arm if restored from the back/forward cache
    window.addEventListener('pagehide', () => listen(false));
    window.addEventListener('pageshow', (event) => {
      if (!event.persisted) return;
      stackObserver.unobserve(stack);
      stackObserver.observe(stack);
    });
  }

}; // End of init function

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
