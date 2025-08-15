/* =====================================================================
   Utility helpers
   =====================================================================*/

/**
 * Increment a counter element’s text from 0 → target.
 * @param {HTMLElement} el   element whose text to animate
 * @param {number}      end  target value
 * @param {number}      dur  animation length (ms)
 */
function animateCount(el, end, dur = 2000) {
  const step = Math.max(1, Math.floor(dur / end));
  let   val  = 0;
  const timer = setInterval(() => {
    val += 1;
    el.textContent = val.toLocaleString();
    if (val === end) clearInterval(timer);
  }, step);
}

/* =====================================================================
   1. Mobile-nav toggle
   =====================================================================*/
(() => {
  const btn  = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    menu.hidden = open;
    btn.classList.toggle('is-open', !open);
  });
})();

/* =====================================================================
   2. Testimonial carousel
   =====================================================================*/
(() => {
  const vp     = document.getElementById('testimonial-viewport');
  const slides = vp ? Array.from(vp.querySelectorAll('.testimonial')) : [];
  const prev   = document.getElementById('testimonial-prev');
  const next   = document.getElementById('testimonial-next');
  let idx = 0;

  const go = i => {
    if (!slides.length) return;
    slides[idx].classList.remove('is-active');
    idx = (i + slides.length) % slides.length;
    slides[idx].classList.add('is-active');
  };

  prev?.addEventListener('click', () => go(idx - 1));
  next?.addEventListener('click', () => go(idx + 1));
  setInterval(() => go(idx + 1), 10_000);
})();

/* =====================================================================
   3. KPI counters
   =====================================================================*/
(() => {
  const list = [
    { el: document.getElementById('head-counter'),  target: 650 },
    { el: document.getElementById('flow-counter'),  target: 500 },
    { el: document.getElementById('steel-counter'), target: 304 }
  ].filter(o => o.el);

  if (!list.length) return;

  const section = document.getElementById('counters');
  const ob = new IntersectionObserver(
    e => {
      if (e[0].isIntersecting) {
        list.forEach(o => animateCount(o.el, o.target));
        ob.disconnect();
      }
    },
    { threshold: 0.4 }
  );
  ob.observe(section);
})();

/* =====================================================================
   4. Dynamic year
   =====================================================================*/
(() => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

/* =====================================================================
   5. Smooth-scroll for internal links
   =====================================================================*/
(() => {
  document.querySelectorAll('a[href^="#"]').forEach(a =>
    a.addEventListener('click', e => {
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    })
  );
})();

/* =====================================================================
   6. Scroll-reveal animations (multiple effects)
   =====================================================================*/
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const els = document.querySelectorAll('[data-animate]');
  if (!els.length) return;

  const ob = new IntersectionObserver(
    entries =>
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          ob.unobserve(en.target);   // run once per element
        }
      }),
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
  );

  els.forEach(el => ob.observe(el));
})();
