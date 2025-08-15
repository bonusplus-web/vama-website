/* ==========================================================================
   Product-page script  (~1 kB after minify)
   ─ Smooth scroll for category tabs
   ─ Auto-highlight active tab on scroll (“scroll-spy”)
   ─ Arrow-key navigation between tabs
   ─ Zero dependencies
   ========================================================================== */
(() => {
  /* ——————————————————— 0. Cache DOM ——————————————————— */
  const header        = document.querySelector('.header');
  const headerH       = header?.offsetHeight || 0;           // sticky header height
  const tabsBar       = document.querySelector('.product-tabs');
  const tabs          = [...document.querySelectorAll('.product-tab')];
  const sections      = tabs.map(t => document.querySelector(t.getAttribute('href')))
                            .filter(Boolean);

  if (!tabs.length || !sections.length) return;              // nothing to do

  /* ——————————————————— 1. Smooth-scroll helper ——————————— */
  const prefersReduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollToSection = target => {
    const offset = headerH + (tabsBar?.offsetHeight || 0);
    const y      = target.getBoundingClientRect().top + scrollY - offset + 1;
    scrollTo({ top: y, behavior: prefersReduceMotion ? 'auto' : 'smooth' });
  };

  /* click → scroll */
  tabs.forEach(tab => {
    tab.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(tab.getAttribute('href'));
      if (target) scrollToSection(target);
    });
  });

  /* ——————————————————— 2. Scroll-spy via IntersectionObserver —— */
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          tabs.forEach(t => t.classList.toggle(
            'is-active',
            t.getAttribute('href').slice(1) === entry.target.id
          ));
        }
      });
    },
    {
      /* when 40 % of a section is visible, mark active   */
      rootMargin: `-${headerH + (tabsBar?.offsetHeight || 0)}px 0px -60% 0px`,
      threshold : 0.4
    }
  );
  sections.forEach(sec => observer.observe(sec));

  /* ——————————————————— 3. Keyboard arrow navigation ——————— */
  const focusTab = dir => {
    const i = tabs.findIndex(t => t.classList.contains('is-active'));
    if (i === -1) return;
    const next = tabs[(i + dir + tabs.length) % tabs.length];
    next.focus();                                            // keyboard focus
    next.click();                                            // trigger scroll
  };
  tabsBar.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); focusTab(+1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); focusTab(-1); }
  });
})();
