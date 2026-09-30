/* ═══════════════════════════════════════
   KOHINOOR CATERER — EXPERIENTIAL LOGIC
   Tech: GSAP, Splitting
   ═══════════════════════════════════════ */

const init = () => {

  // 0. If the GSAP CDN failed to load, show the content without animation
  //    (everything below starts at opacity: 0 in style.css)
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('.viewport-container, .logo-mark, .welcome-heading, .welcome-text, .welcome-sub, .welcome-tagline, .cta-surface, .contact-strip, .legal')
      .forEach(el => { el.style.opacity = 1; });
    return;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Prepare Text Splitting
  if (typeof Splitting === 'function') Splitting({ target: '.hero-line', by: 'words' });

  // 2. Custom Cursor Logic (Desktop Only)
  const cursor = document.querySelector('.cursor');
  // Same condition style.css uses to show the cursor, so touch laptops with a mouse still get it
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (cursor && hasFinePointer) {
    // GSAP quickTo for smooth cursor follow
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3" });

    // Hidden until the mouse moves, so it doesn't sit in the top-left corner
    gsap.set(cursor, { autoAlpha: 0 });
    let cursorShown = false;
    window.addEventListener("mousemove", (e) => {
      if (!cursorShown) {
        cursorShown = true;
        gsap.set(cursor, { x: e.clientX, y: e.clientY, autoAlpha: 1 });
      }
      xTo(e.clientX);
      yTo(e.clientY);
    });
    document.documentElement.addEventListener("mouseleave", () => {
      cursorShown = false;
      gsap.set(cursor, { autoAlpha: 0 });
    });

    // Hover states for cursor
    const interactables = document.querySelectorAll('a, button');
    const enquireBtn = document.querySelector('.enquire-btn');

    interactables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (el === enquireBtn || el.closest('.enquire-btn')) {
          // CTA button: cursor fades out so the button glow takes focus
          gsap.to(cursor, { scale: 0.4, opacity: 0, duration: 0.3 });
        } else {
          gsap.to(cursor, { scale: 2.5, backgroundColor: 'rgba(201,168,76,0.1)', borderColor: '#FFFFFF', duration: 0.3 });
        }
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(cursor, { scale: 1, opacity: 1, backgroundColor: 'transparent', borderColor: '#C9A84C', duration: 0.3 });
      });
    });

    window.addEventListener('mousedown', () => gsap.to(cursor, { scale: 0.8, duration: 0.1 }));
    window.addEventListener('mouseup', () => gsap.to(cursor, { scale: 1, duration: 0.1 }));
  }

  // 3. Periodic Shimmer Sweep on CTA Button
  const btn = document.querySelector('.enquire-btn');
  if (btn) {
    // Auto-shimmer every 4 seconds after initial page load
    setTimeout(() => {
      setInterval(() => {
        if (!btn.matches(':hover')) {
          btn.classList.add('shimmer-active');
          setTimeout(() => btn.classList.remove('shimmer-active'), 800);
        }
      }, 4000);
    }, 3500); // Start after entrance animations complete
  }

  // 4. Master GSAP Animation Timeline
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

  tl
    // 0.0s — Background and Container fade-in
    .to('.viewport-container', { opacity: 1, duration: 1 })

    // 0.0s — Cinematic video fades in
    .to('.ambient-video', { opacity: 1, duration: 2 }, 0)

    // 0.5s — Logo mark descends
    .to('.logo-mark', { opacity: 1, y: 0, scale: 1, duration: 1, startAt: { y: -20, scale: 0.9 } }, 0.3)

    // 0.8s — Welcome heading fades in
    .to('.welcome-heading', { opacity: 1, y: 0, duration: 0.8, startAt: { opacity: 0, y: 12 } }, 0.6)

    // 1.0s — Ornament divider draws itself
    .to('.divider-line-left', { strokeDashoffset: 0, duration: 0.7 }, 1.0)
    .to('.divider-line-right', { strokeDashoffset: 0, duration: 0.7 }, 1.0)
    .to('.divider-diamond', { scale: 1, duration: 0.5, ease: "back.out(3)", startAt: { scale: 0, transformOrigin: "50% 50%" } }, 1.3)

    // 1.4s — Hero line words
    .to('.hero-line .word', { opacity: 1, y: 0, stagger: 0.08, duration: 0.9, startAt: { opacity: 0, y: 20 } }, 1.4)

    // 1.8s — Welcome text fades in and rises
    .to('.welcome-text', { opacity: 1, y: 0, duration: 0.9, startAt: { y: 16 } }, 1.8)

    // 2.0s — Welcome sub-text
    .to('.welcome-sub', { opacity: 1, y: 0, duration: 0.7, startAt: { y: 10 } }, 2.0)

    // 2.1s — Welcome tagline
    .to('.welcome-tagline', { opacity: 1, y: 0, duration: 0.7, startAt: { y: 10 } }, 2.1)

    // 2.2s — Glass CTA surface rises
    .to('.cta-surface', { opacity: 1, y: 0, scale: 1, duration: 1, startAt: { y: 30, scale: 0.97 } }, 2.2)

    // 2.5s — Contact strip
    .to('.contact-strip', { opacity: 1, y: 0, duration: 0.8, startAt: { y: 12 } }, 2.5)

    // 2.8s — Legal
    .to('.legal', { opacity: 1, duration: 0.8 }, 2.8);

  // Reduced motion: skip straight to the finished layout
  if (reduceMotion) tl.progress(1);

}; // End of init function

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
