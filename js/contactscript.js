/* ========================================================================
   CONTACT-PAGE SCRIPTS   •   VAMA SRL
   Auto-expanding textarea · smooth-scroll to invalid field · spam-trap
   ======================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  const form      = document.getElementById('contact-form');
  if (!form) return;

  const textarea  = form.querySelector('textarea');
  const honeypot  = form.querySelector('input[name="address"]');   // hidden spam-trap
  const prefersReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Auto-expand textarea ------------------------------- */
  if (textarea) {
    const autoSize = () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight + 2}px`;
    };
    textarea.addEventListener('input', autoSize);
    autoSize();                           // run once on load
  }

  /* ---------- 2. Smooth-scroll to first invalid field --------------- */
  form.addEventListener('invalid', e => {
    e.preventDefault();                   // stop abrupt browser jump
    const firstInvalid = form.querySelector(':invalid');
    if (!firstInvalid) return;

    firstInvalid.focus({ preventScroll: true });

    const headerH = document.querySelector('.header')?.offsetHeight || 0;
    const y       = firstInvalid.getBoundingClientRect().top + window.scrollY - headerH - 20;

    window.scrollTo({
      top: y,
      behavior: prefersReduceMotion ? 'auto' : 'smooth'
    });
  }, true);                               // capture phase catches all children

  /* ---------- 3. Submit handler ------------------------------------- */
  form.addEventListener('submit', e => {

    /* 3-a. Block if built-in validation fails (HTML5 invalid events
            already fired so our smooth-scroll has run)                 */
    if (!form.checkValidity()) return;

    /* 3-b. Simple spam check — the hidden “address” field must stay blank */
    if (honeypot && honeypot.value.trim()) {
      e.preventDefault();                 // silently drop bots
      return;
    }

    /* 3-c. Prevent default <mailto:…> (comment-out if you keep mailto) */
    e.preventDefault();

    /* 3-d. Show toast + reset */
    showToast('Thanks for your enquiry — we’ll respond shortly!');
    form.reset();
    textarea?.style.removeProperty('height');
  });

  /* ---------- helper : toast banner -------------------------------- */
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');
    toast.textContent = message;
    document.body.appendChild(toast);

    /* Trigger CSS transition */
    requestAnimationFrame(() => toast.classList.add('is-visible'));

    /* Hide after 4 s */
    setTimeout(() => {
      toast.classList.remove('is-visible');
      toast.addEventListener('transitionend', () => toast.remove(), { once:true });
    }, 4000);
  }
});
