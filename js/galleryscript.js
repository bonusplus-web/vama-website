/* ======================================================================
   VAMA SRL  –  GALLERY-PAGE SCRIPT  (galleryscript.js)
   ----------------------------------------------------------------------
   • Sticky country tabs  → smooth-scroll & scroll-spy
   • Lightweight slider   → per-project image carousel, zero dependencies
   • Optional auto-play   → pauses on user interaction & reduced-motion
   ====================================================================== */
(() => {
  /* -------------------------------------------------- 0.  DOM REFERENCES */
  const header        = document.querySelector('.header');
  const headerH       = header?.offsetHeight || 0;

  const tabsBar       = document.querySelector('.product-tabs');
  const tabs          = [...document.querySelectorAll('.product-tab')];
  const sections      = tabs.map(t => document.querySelector(t.getAttribute('href'))).filter(Boolean);

  const sliders       = [...document.querySelectorAll('.gallery-card__slider')];

  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------------------------------------------------- 1.  SMOOTH-SCROLL */
  if (tabs.length && sections.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(tab.getAttribute('href'));
        if (!target) return;

        const y = target.getBoundingClientRect().top + window.scrollY
                - headerH - (tabsBar?.offsetHeight || 0) + 1;

        window.scrollTo({ top: y, behavior: prefersReduce ? 'auto' : 'smooth' });
      });
    });

    /* Scroll-spy: highlight current country tab */
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        tabs.forEach(t => t.classList.remove('is-active'));
        const active = tabs.find(t => t.getAttribute('href').slice(1) === entry.target.id);
        active?.classList.add('is-active');
      });
    }, {
      rootMargin: `-${headerH + (tabsBar?.offsetHeight || 0)}px 0px -60% 0px`,
      threshold : 0.25
    });
    sections.forEach(sec => spy.observe(sec));
  }

  /* -------------------------------------------------- 2.  CAROUSEL LOGIC */
  sliders.forEach(slider => {
    const vp       = slider.querySelector('.gallery-card__viewport');
    const slides   = vp ? [...vp.querySelectorAll('.slide')] : [];
    const prevBtn  = slider.querySelector('.carousel__btn--prev');
    const nextBtn  = slider.querySelector('.carousel__btn--next');
    let  index     = slides.findIndex(s => s.classList.contains('is-active'));
    if (index === -1) index = 0;

    /* --- helpers ------------------------------------------------------ */
    const show     = i => {
      slides[index].classList.remove('is-active');
      index = (i + slides.length) % slides.length;
      slides[index].classList.add('is-active');
    };

    /* --- controls ----------------------------------------------------- */
    prevBtn?.addEventListener('click', () => { show(index - 1); stopAuto(); });
    nextBtn?.addEventListener('click', () => { show(index + 1); stopAuto(); });

    /* --- autoplay (7 s interval) -------------------------------------- */
    let timer = null;
    const startAuto = () => {
      if (prefersReduce || slides.length < 2) return;
      timer = setInterval(() => show(index + 1), 7000);
    };
    const stopAuto  = () => { timer && clearInterval(timer); timer = null; };

    /* pause on hover / focus for accessibility */
    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);
    slider.addEventListener('focusin',   stopAuto);
    slider.addEventListener('focusout',  startAuto);

    startAuto();
  });
})();
