const views = [...document.querySelectorAll('.view')];
const links = [...document.querySelectorAll('.bottom a')];

function show() {
  const id = (location.hash || '#home').slice(1);
  const target = views.some(v => v.id === id) ? id : 'home';
  views.forEach(v => v.classList.toggle('on', v.id === target));
  links.forEach(a => a.classList.toggle('active', a.dataset.v === target));
  window.scrollTo(0, 0);
  moveIndicator();
}
const indicator = document.querySelector('.indicator');
function moveIndicator() {
  const a = document.querySelector('.bottom a.active');
  if (!a) return;
  indicator.style.width = a.offsetWidth + 'px';
  indicator.style.transform = `translateX(${a.offsetLeft}px)`;
}
addEventListener('resize', moveIndicator);
document.fonts && document.fonts.ready.then(moveIndicator);
addEventListener('hashchange', show);
show();

const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('seen'); io.unobserve(e.target); }
}), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));