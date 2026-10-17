const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
const root = document.documentElement;

/* 1. Mobile menu */
$('#menuBtn').onclick = () => $('#nav').classList.toggle('open');
$$('#nav a').forEach(a => a.onclick = () => $('#nav').classList.remove('open'));

/* 3. Day / night toggle */
$('#themeBtn').onclick = () => {
  const wasNight = root.dataset.theme === 'night';
  root.dataset.theme = wasNight ? 'day' : 'night';
  $('#themeBtn').textContent = wasNight ? '🌙' : '☀️';
};

/* 4. Hero parallax (layers move with the mouse) */
$('.hero').addEventListener('mousemove', e => {
  const x = e.clientX / innerWidth - 0.5;
  $$('.layer').forEach(l => l.style.transform = `translateX(${x * -l.dataset.speed * 2}px)`);
});

/* 5. Destination data -> slides are built from this list */
const places = [
  { name: 'Munnar, Kerala', vibe: 'Quiet', img: 'images/munnar.jpg', a: '#a9d6a0', b: '#4f8f6a',
    days: 3, price: 14999, desc: 'Misty tea hills, waterfalls and cool mornings above the clouds.',
    inc: ['🏨 Hill stay', '🍳 Breakfast', '🚐 Local transfers'] },
  { name: 'Kyoto, Japan', vibe: 'Quiet', img: 'images/kyoto.jpg', a: '#f5c6d0', b: '#6a9f7a',
    days: 5, price: 84999, desc: 'Bamboo groves, mossy temples and tea that tastes like silence.',
    inc: ['🏨 Ryokan stay', '🍵 Tea ceremony', '🚆 Rail pass'] },
  { name: 'Bali, Indonesia', vibe: 'Sunlit', img: 'images/bali.jpg', a: '#ffd59e', b: '#f08a7e',
    days: 3, price: 29999, desc: 'Rice terraces, warm rain and sunsets that feel like a hug.',
    inc: ['🏨 Villa stay', '🍳 Breakfast', '🛵 Scooter day'] },
  { name: 'Santorini, Greece', vibe: 'Sunlit', img: 'images/santorini.jpg', a: '#bfe0f5', b: '#4a7fb5',
    days: 4, price: 74999, desc: 'White domes, blue water and golden hour on the caldera.',
    inc: ['🏨 Cave hotel', '⛵ Sunset sail', '🍷 Wine tasting'] },
  { name: 'Swiss Alps', vibe: 'Wild', img: 'images/swiss-alps.jpg', a: '#cfe3f2', b: '#6a8caf',
    days: 5, price: 94999, desc: 'Crisp air, wildflower meadows and trails that reward every step.',
    inc: ['🏨 Chalet stay', '🚠 Cable cars', '🥾 Guided hike'] },
  { name: 'Lapland, Finland', vibe: 'Magical', img: 'images/lapland.jpg', a: '#b39ddb', b: '#4db6ac',
    days: 5, price: 119999, desc: 'Northern lights, snowy pines and a sky that dances back.',
    inc: ['🏨 Glass igloo', '🌌 Aurora hunt', '🐕 Husky ride'] }
];
const rupee = n => '₹' + n.toLocaleString('en-IN');   // 119999 -> ₹1,19,999

$('#track').innerHTML = places.map(p => `
  <article class="slide" style="--a:${p.a};--b:${p.b}">
    <div class="scene"><img src="${p.img}" alt="${p.name}" onerror="this.remove()"></div>
    <div class="info">
      <span class="chip vibe">${p.vibe}</span>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="price"><small>Starting at</small> <strong>${rupee(p.price)}</strong>
        <small>/ person &middot; ${p.days} days</small></div>
      <div class="chips">${p.inc.map(i => `<span class="chip">${i}</span>`).join('')}</div>
      <div class="actions">
        <button class="btn small like">♡ Save</button>
        <button class="btn small enquire" data-name="${p.name}">Enquire</button>
      </div>
    </div>
  </article>`).join('');

/* 6. Carousel */
const slides = $$('.slide');
const dots = $('#dots');
let current = 0, timer;
slides.forEach((_, k) => {
  const d = document.createElement('button');
  d.setAttribute('aria-label', 'Go to slide ' + (k + 1));
  d.onclick = () => go(k);
  dots.appendChild(d);
});
function go(n) {
  current = (n + slides.length) % slides.length;
  $('#track').style.transform = `translateX(-${current * 100}%)`;
  $$('button', dots).forEach((d, k) => d.classList.toggle('on', k === current));
  clearInterval(timer);
  timer = setInterval(() => go(current + 1), 6000);
}
$('#prev').onclick = () => go(current - 1);
$('#next').onclick = () => go(current + 1);
// vibe buttons jump to the next place with that vibe
$$('.vibes button').forEach(b => b.onclick = () => {
  for (let k = 1; k <= slides.length; k++) {
    const n = (current + k) % slides.length;
    if (places[n].vibe === b.dataset.vibe) { go(n); break; }
  }
});
go(0);

/* 7. 3D tilt, save buttons, enquire buttons */
$$('.scene').forEach(s => {
  s.onmousemove = e => {
    const r = s.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    s.style.transform = `rotateY(${x * 24}deg) rotateX(${-y * 24}deg)`;
  };
  s.onmouseleave = () => s.style.transform = '';
});

let saved = 0;
$$('.like').forEach(b => b.onclick = () => {
  b.classList.toggle('on');
  const on = b.classList.contains('on');
  b.textContent = on ? '♥ Saved' : '♡ Save';
  saved += on ? 1 : -1;
  $('#saved').textContent = saved;
});

function toast(text) {
  const t = $('#toast');
  t.textContent = text;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}
$$('.enquire').forEach(b => b.onclick = () =>
  toast(`Thanks! We'll send you the ${b.dataset.name} package details ✉️`));

/* 8. Flip cards (tap on mobile) */
$$('.flip').forEach(c => c.onclick = () => c.classList.toggle('flipped'));

/* 9. Scroll reveal */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('show'); });
}, { threshold: 0.15 });
$$('.reveal').forEach(el => io.observe(el));

/* 11. Postcard message */
$('#postcard').onsubmit = e => {
  e.preventDefault();
  const name = $('#name').value.trim() || 'traveller';
  $('#msg').textContent = `Your postcard is on its way, ${name} ✉️🌿`;
  e.target.reset();
};
