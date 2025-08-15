/* ==========================================================================
   0. Utility: animated counter
   ========================================================================== */
function animateCount(el, end, duration = 2000) {
  const start   = 0;
  const range   = end - start;
  const step    = Math.max(1, Math.floor(duration / range));
  let current   = start;

  const timer = setInterval(() => {
    current += 1;
    el.textContent = current.toLocaleString();
    if (current === end) clearInterval(timer);
  }, step);
}

/* ==========================================================================
   1. Mobile-nav toggle
   ========================================================================== */
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

/* ==========================================================================
   2. Testimonial carousel (home)
   ========================================================================== */
(() => {
  const vp     = document.getElementById('testimonial-viewport');
  const slides = vp ? Array.from(vp.querySelectorAll('.testimonial')) : [];
  const prev   = document.getElementById('testimonial-prev');
  const next   = document.getElementById('testimonial-next');
  let index    = 0;

  const goTo = i => {
    if (!slides.length) return;
    slides[index].classList.remove('is-active');
    index = (i + slides.length) % slides.length;
    slides[index].classList.add('is-active');
    /* no translateX — CSS shows only the active slide */
  };

  prev?.addEventListener('click', () => goTo(index - 1));
  next?.addEventListener('click', () => goTo(index + 1));

  /* auto-play every 10 s */
  setInterval(() => goTo(index + 1), 10_000);
})();

/* ==========================================================================
   3. KPI counters  (home page)
   ========================================================================== */
(() => {
  const counters = [
    { el: document.getElementById('head-counter'),  target: 650 },
    { el: document.getElementById('flow-counter'),  target: 500 },
    { el: document.getElementById('steel-counter'), target: 304 }
  ].filter(c => c.el);

  if (!counters.length) return;

  const section = document.getElementById('counters');
  const io = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting) {
        counters.forEach(c => animateCount(c.el, c.target));
        io.disconnect();
      }
    },
    { threshold: 0.4 }
  );
  io.observe(section);
})();

/* ==========================================================================
   3b. KPI counters  (about page)
   ========================================================================== */
(() => {
  const section = document.getElementById('about-counters');
  if (!section) return;

  const nums = section.querySelectorAll('.kpi__value[data-count]');
  if (!nums.length) return;

  const io = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting) {
        nums.forEach(n => animateCount(n, +n.dataset.count));
        io.disconnect();
      }
    },
    { threshold: 0.4 }
  );
  io.observe(section);
})();

/* ==========================================================================
   4. Dynamic footer year
   ========================================================================== */
(() => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();

/* ==========================================================================
   5. Timeline reveal (about page)
   ========================================================================== */
(() => {
  const items = document.querySelectorAll('.timeline__item');
  if (!items.length) return;

  /* .timeline__item {opacity:0; transform:translateY(20px); transition:.6s ease;}
     .timeline__item.is-visible {opacity:1; transform:none;} */
  const io = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  items.forEach(it => io.observe(it));
})();

/* Accordion – How we build a pump */
(() => {
  const items = document.querySelectorAll('.accordion__item');
  if (!items.length) return;

  items.forEach(item => {
    const header = item.querySelector('.accordion__header');
    header.addEventListener('click', () => {
      item.classList.toggle('is-open');
    });
  });
})();
