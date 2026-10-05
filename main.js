document.documentElement.classList.add('js');

// Tema claro / oscuro
const root = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
const prefersDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;
themeBtn.addEventListener('click', () => {
  const current = root.dataset.theme || (prefersDark() ? 'dark' : 'light');
  const next = current === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) {}
});

// Borde del header al hacer scroll
const nav = document.querySelector('.nav');
const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Filtros de proyectos
const chips = document.querySelectorAll('.chip');
const cards = document.querySelectorAll('.grid .card');
chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    const filter = chip.dataset.filter;
    chips.forEach((c) => {
      const active = c === chip;
      c.classList.toggle('is-active', active);
      c.setAttribute('aria-pressed', String(active));
    });
    cards.forEach((card) => {
      const match = filter === 'todos' || card.dataset.cat.split(' ').includes(filter);
      card.classList.toggle('is-hidden', !match);
    });
  });
});

// Aparición al hacer scroll + enlace activo en la navegación
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window) {
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => revealObs.observe(el));

  const links = document.querySelectorAll('.nav__links a');
  const spyObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach((s) => spyObs.observe(s));

  // La terminal se "escribe" línea a línea la primera vez que aparece
  const term = document.querySelector('.terminal__body');
  if (term && !reduceMotion) {
    const lines = [...term.querySelectorAll('p')];
    lines.forEach((l) => l.classList.add('is-hidden'));
    const termObs = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      termObs.disconnect();
      lines.forEach((l, i) => setTimeout(() => {
        l.classList.remove('is-hidden');
        l.classList.add('is-shown');
      }, 250 + i * 420));
    }, { threshold: 0.4 });
    termObs.observe(term);
  }
} else {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
}

document.getElementById('year').textContent = new Date().getFullYear();
