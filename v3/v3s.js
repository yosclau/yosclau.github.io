/* v3s · pared de mundos, par de fotos, pídeme un estilo, redes y mesa de trabajo */
(function () {
const $ = id => document.getElementById(id);
if (!$('ys-wall')) return;
const M = '/m/', L = 'mundos/';
const LOCAL = new Set(['logo-animado', 'sello-animado', 'iconos-flotantes', 'ic-luna', 'ic-carpa', 'ic-sello-rojo', 'ic-globo', 'ic-conejita', 'ic-timbre']);
const base = f => (LOCAL.has(f) ? L : M) + f;
const img = f => base(f) + '.webp';
const vid = f => base(f) + '.mp4';
const poster = f => base(f) + '-poster.webp';
const touch = matchMedia('(hover: none)').matches;
const narrow = () => matchMedia('(max-width: 899px)').matches;

// Videos: no cargan nada hasta que se necesitan. En compu se reproducen con hover; en touch, cuando se ven en pantalla.
const vio = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
  const v = e.target; if (e.isIntersecting && e.intersectionRatio > .55) v.play().catch(() => { }); else v.pause()
}), { threshold: [0, .55, .8] }) : null;
function lazyVideo(f, autoInView) {
  const v = document.createElement('video'); v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.preload = 'none'; v.poster = poster(f); v.src = vid(f);
  if (autoInView && vio) vio.observe(v); return v
}

// ---------- catálogo ----------
const PROJ = {
  retratos: { name: 'Yo en otros mundos', cat: 'Retratos', idea: 'Traducirme a distintos universos visuales sin dejar de ser yo.', yo: 'mundos · referencias · selección', ia: 'ilustración (ChatGPT)', tags: ['Art direction', 'Ilustración IA', '7 retratos'], caso: 'p-yo' },
  sky: { name: 'Sky Club', cat: 'Personajes 3D', idea: 'Una familia de avatares 3D sobre nubes: yo en seis versiones y mis mascotas con sus gafas.', yo: 'personajes · sistema visual · consistencia', ia: 'render 3D', tags: ['Character design', '12 avatares', 'Stickers'], caso: 'p-sky' },
  poster: { name: 'Vocabulario visual', cat: 'Pósters', idea: 'Aprender el vocabulario visual para pedirle a la IA justo lo que imagino: 50 estilos, más de 100 pósters.', yo: 'elementos · textos · dirección por estilo', ia: 'imagen (ChatGPT)', tags: ['Diseño gráfico', 'Prompting', '100+ pósters'], caso: 'p-vocab' },
  sab: { name: 'Structure Art Built', cat: 'Branding', client: true, idea: 'Una constructora que necesitaba verse tan sólida como su trabajo: calidad, orden y confianza.', yo: 'concepto · paleta · sistema visual · textos', ia: 'mockups y escenas', tags: ['Cliente', 'Branding', 'Anuncios'], caso: 'p-structure' },
  naranja: { name: 'Campaña Naranja', cat: 'Video IA', idea: 'Moda y tecnología en hora dorada: un spot de lujo para un accesorio-joya de teléfono.', yo: 'idea · mundo · selección', ia: 'video (Higgsfield)', tags: ['Spec ad', 'Vertical 9:16', '12 s'], caso: 'p-naranja' },
  reel: { name: 'Playground', cat: 'Video IA', idea: 'Reels y experimentos para redes: tendencias, personajes y mundos en formato corto.', yo: 'idea · guion · edición', ia: 'video e imagen', tags: ['Reels', 'Experimentos'] },
  motion: { name: 'Motion YosClau', cat: 'Motion', idea: 'Mi logo, mi sello y mis íconos en movimiento, listos para la web y redes.', yo: 'concepto · storyboard · dirección', ia: 'animación con Claude y Higgsfield', tags: ['Logo animado', 'Web', 'Reels'] },
};
const ITEMS = [
  ['yo-perla', 'retratos', 'Perlas'], ['yo-arlequin', 'retratos', 'Arlequín de papel'], ['yo-marioneta-escena', 'retratos', 'Marioneta'], ['yo-barroco', 'retratos', 'Barroco a la vela'],
  ['yo-jardin', 'retratos', 'Jardín al atardecer'], ['yo-margaritas', 'retratos', 'Margaritas'], ['yo-verano', 'retratos', 'Caricatura de verano'],
  ['avatar-01', 'sky', 'Gafas rojas'], ['avatar-03', 'sky', 'Gafas oscuras'], ['avatar-05', 'sky', 'Moños rojos'], ['avatar-07', 'sky', 'Siamés'], ['avatar-08', 'sky', 'Rizos'], ['avatar-11', 'sky', 'Border collie'],
  ['estilo-01', 'poster', 'Retro 70s'], ['estilo-02', 'poster', 'Art déco'], ['estilo-03', 'poster', 'Art nouveau'], ['estilo-04', 'poster', 'Pop collage'],
  ['estilo-05', 'poster', 'Y2K'], ['estilo-06', 'poster', 'Bauhaus'], ['estilo-07', 'poster', 'Brutalismo'], ['estilo-08', 'poster', 'Synthwave'],
  ['structure-01', 'sab', 'Logo'], ['structure-02', 'sab', 'Papelería'], ['structure-03', 'sab', 'Logo en negro'], ['structure-04', 'sab', 'Letrero'], ['structure-05', 'sab', 'Anuncio'], ['structure-06', 'sab', 'Anuncio'],
  ['campana-naranja', 'naranja', 'Spot', 'v'], ['reel-pov-conejo', 'reel', 'Reel POV'], ['cielo-02', 'sky', 'Cielo'],
  ['logo-animado', 'motion', 'Logo animado', 'v'], ['sello-animado', 'motion', 'Sello de cera', 'v'], ['iconos-flotantes', 'motion', 'Íconos flotantes', 'v'],
].map(([f, p, title, kind], i) => ({ i, f, p, title, video: kind === 'v' }));
const CATS = ['Todo', 'Retratos', 'Personajes 3D', 'Pósters', 'Branding', 'Video IA', 'Motion'];
const catOf = it => PROJ[it.p].cat;

// ---------- chips ----------
const cats = $('ys-cats'); let cur = 'Todo';
CATS.forEach(c => {
  const n = c === 'Todo' ? ITEMS.length : ITEMS.filter(it => catOf(it) === c).length;
  const b = document.createElement('button'); b.type = 'button'; b.className = 'ys-chip'; b.innerHTML = `${c}<span class="n">${n}</span>`; b.setAttribute('aria-pressed', c === cur);
  b.onclick = () => { cur = c; [...cats.children].forEach(x => x.setAttribute('aria-pressed', x === b)); renderWall() };
  cats.appendChild(b)
});

function tile(it, dup) {
  const b = document.createElement('button'); b.type = 'button'; b.className = 'ys-tile'; b.setAttribute('aria-label', `${PROJ[it.p].name}: ${it.title}`);
  if (it.video) {
    const v = lazyVideo(it.f, touch && !dup); b.appendChild(v);
    const pl = document.createElement('span'); pl.className = 'play'; b.appendChild(pl);
    if (!touch) { b.onmouseenter = () => { v.play().catch(() => { }) }; b.onmouseleave = () => { v.pause() } }
  } else { const im = document.createElement('img'); im.src = img(it.f); im.alt = ''; im.loading = 'lazy'; im.decoding = 'async'; b.appendChild(im) }
  const t = document.createElement('span'); t.className = 'tag'; t.textContent = catOf(it); b.appendChild(t);
  b.onclick = () => openLB(it.i); return b
}
const wall = $('ys-wall');
function renderWall() {
  if (vio) wall.querySelectorAll('video').forEach(v => vio.unobserve(v));
  wall.innerHTML = '';
  const list = cur === 'Todo' ? ITEMS : ITEMS.filter(it => catOf(it) === cur);
  $('ys-count').textContent = `${list.length} piezas${cur === 'Todo' ? ' en 7 mundos' : ' · ' + cur}`;
  if (cur === 'Todo') {
    const strip = touch || narrow();
    const rows = document.createElement('div'); rows.className = 'ys-rows' + (strip ? ' scroll' : '');
    const order = [...ITEMS].sort((a, b) => ((a.i * 7) % 11) - ((b.i * 7) % 11));
    const H = narrow() ? 170 : 230;
    [0, 1, 2].forEach(r => {
      const row = document.createElement('div'); row.className = 'ys-row' + (r % 2 ? ' rev' : ''); row.style.setProperty('--dur', (70 + r * 12) + 's');
      const part = order.filter((_, k) => k % 3 === r);
      (strip ? part : [...part, ...part]).forEach((it, k) => {
        const dup = k >= part.length; const t = tile(it, dup);
        if (dup) { t.tabIndex = -1; t.setAttribute('aria-hidden', 'true') }
        const ar = ['naranja', 'reel', 'retratos', 'poster'].includes(it.p) ? .78 : it.p === 'motion' && it.f !== 'sello-animado' ? 1.6 : 1;
        t.style.width = Math.round(H * ar) + 'px'; row.appendChild(t)
      });
      rows.appendChild(row)
    });
    wall.appendChild(rows)
  } else {
    const g = document.createElement('div'); g.className = 'ys-grid';
    list.forEach((it, k) => { const t = tile(it); t.style.animationDelay = (k * 40) + 'ms'; g.appendChild(t) });
    wall.appendChild(g)
  }
}

// ---------- lightbox ----------
const lb = $('ys-lb'); let lbList = [], lbPos = 0, lastFocus = null;
function openLB(i) {
  lastFocus = document.activeElement;
  lbList = cur === 'Todo' ? ITEMS : ITEMS.filter(it => catOf(it) === cur); lbPos = Math.max(0, lbList.findIndex(it => it.i === i)); fillLB(); lb.hidden = false;
  document.documentElement.style.overflow = 'hidden'; $('ys-lb-x').focus({ preventScroll: true })
}
function fillLB() {
  const it = lbList[lbPos], pj = PROJ[it.p]; const m = $('ys-lb-m'); m.innerHTML = '';
  if (it.video) { const v = document.createElement('video'); v.src = vid(it.f); v.poster = poster(it.f); v.controls = true; v.autoplay = true; v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('playsinline', ''); m.appendChild(v) }
  else { const im = document.createElement('img'); im.src = img(it.f); im.alt = `${pj.name}: ${it.title}`; m.appendChild(im) }
  $('ys-lb-e').textContent = (pj.client ? 'Cliente · ' : 'Proyecto personal · ') + pj.cat;
  $('ys-lb-t').textContent = pj.name + (it.title ? ' · ' + it.title : '');
  $('ys-lb-d').textContent = pj.idea;
  $('ys-lb-w').innerHTML = `<b>Yo</b><span>${pj.yo}</span><b>IA</b><span>${pj.ia}</span>`;
  $('ys-lb-p').innerHTML = pj.tags.map(t => `<span>${t}</span>`).join('');
  const cs = $('ys-lb-case'); if (pj.caso) { cs.hidden = false; cs.href = '#' + pj.caso } else cs.hidden = true;
}
function closeLB() { lb.hidden = true; $('ys-lb-m').innerHTML = ''; document.documentElement.style.overflow = ''; if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true }) }
$('ys-lb-x').onclick = closeLB;
lb.onclick = e => { if (e.target === lb) closeLB() };
$('ys-lb-prev').onclick = () => { lbPos = (lbPos - 1 + lbList.length) % lbList.length; fillLB() };
$('ys-lb-next').onclick = () => { lbPos = (lbPos + 1) % lbList.length; fillLB() };
$('ys-lb-c').onclick = closeLB; $('ys-lb-case').onclick = closeLB;
addEventListener('keydown', e => { if (lb.hidden) return; if (e.key === 'Escape') closeLB(); if (e.key === 'ArrowRight') $('ys-lb-next').click(); if (e.key === 'ArrowLeft') $('ys-lb-prev').click() });
// swipe en el lightbox (cel)
let sx = null; lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX }, { passive: true });
lb.addEventListener('touchend', e => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 60) (dx < 0 ? $('ys-lb-next') : $('ys-lb-prev')).click() });

// ---------- Pídeme un estilo ----------
const STY = [
  ['Art déco', 'estilo-02', 'Geometría dorada, simetría y glamour de los años 20.'],
  ['Retro 70s', 'estilo-01', 'Colores cálidos, curvas suaves y tipografía redonda.'],
  ['Art nouveau', 'estilo-03', 'Líneas orgánicas, flores y marcos ornamentales.'],
  ['Pop collage', 'estilo-04', 'Recortes, texturas y mucha actitud.'],
  ['Y2K', 'estilo-05', 'Cromo, brillos y nostalgia de los 2000.'],
  ['Bauhaus', 'estilo-06', 'Formas básicas, colores primarios y orden.'],
  ['Brutalismo', 'estilo-07', 'Bloques crudos, contraste fuerte y tipografía pesada.'],
  ['Synthwave', 'estilo-08', 'Neón, atardecer retro y rejillas infinitas.'],
  ['Arlequín de papel', 'yo-arlequin', 'Ilustración vintage con rombos y textura de papel.'],
  ['Barroco a la vela', 'yo-barroco', 'Luz de vela, dramatismo y textura de óleo.'],
  ['Avatar 3D', 'avatar-01', 'Personajes 3D suaves, listos para stickers y perfiles.'],
  ['Caricatura de verano', 'yo-verano', 'Trazo de caricatura, color brillante y mucho sol.'],
  ['Hora dorada', 'campana-naranja-poster', 'Luz cálida de atardecer con look de campaña de lujo.'],
  ['Margaritas', 'yo-margaritas', 'Dulce, floral y con textura tejida.'],
];
const stylesEl = $('ys-styles'), resEl = $('ys-result'), typed = $('ys-typed');
let sIdx = 0, typer = null;
STY.forEach(([n], k) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'ys-chip'; b.textContent = n; b.setAttribute('aria-pressed', k === 0); b.onclick = () => pick(k); stylesEl.appendChild(b) });
function setImg(src, instant) {
  const old = resEl.querySelector('img:not(.out)'); const im = new Image(); im.src = src; im.alt = ''; im.className = instant ? '' : 'out';
  resEl.insertBefore(im, resEl.querySelector('.ys-shimmer'));
  if (!instant) requestAnimationFrame(() => requestAnimationFrame(() => im.classList.remove('out')));
  if (old) { old.classList.add('out'); setTimeout(() => old.remove(), 700) }
  $('ys-wash').style.backgroundImage = `url(${src})`
}
function pick(k, instant) {
  sIdx = k; const [n, f, d] = STY[k];
  [...stylesEl.children].forEach((x, j) => x.setAttribute('aria-pressed', j === k));
  clearInterval(typer); typed.textContent = ''; let c = 0;
  if (instant) typed.textContent = n; else typer = setInterval(() => { typed.textContent = n.slice(0, ++c); if (c >= n.length) clearInterval(typer) }, 38);
  $('ys-badge').innerHTML = `<span>${n}</span>`;
  $('ys-sdesc-t').textContent = n; $('ys-sdesc').textContent = d;
  const src = img(f);
  if (instant) setImg(src, true);
  else { resEl.classList.remove('loading'); void resEl.offsetWidth; resEl.classList.add('loading'); setTimeout(() => setImg(src), 260 + n.length * 20) }
}
const randomPick = () => { let k; do { k = Math.floor(Math.random() * STY.length) } while (k === sIdx); pick(k) };
$('ys-go').onclick = randomPick; $('ys-rand').onclick = randomPick;

// ---------- par de fotos ----------
const PAIRS = [
  [['yo-perla', 'perlas'], ['yo-arlequin', 'arlequín de papel'], 'La misma Claudia, dos épocas distintas. Así llevo tu marca a nuevos mundos sin que pierda su esencia.'],
  [['yo-barroco', 'barroco a la vela'], ['yo-verano', 'caricatura de verano'], 'De la luz de vela al sol de verano: cambia la atmósfera, la persona se reconoce igual.'],
  [['avatar-01', 'Sky Club 3D'], ['yo-margaritas', 'margaritas'], 'De ilustración a personaje 3D: tu marca puede tener mascota, avatar y stickers.'],
  [['estilo-02', 'art déco'], ['estilo-08', 'synthwave'], 'Un mismo concepto en dos estilos de póster. Es mi catálogo para pedirle a la IA justo lo que imagino.'],
  [['structure-01', 'logo'], ['structure-05', 'anuncio'], 'Structure Art Built: del logo al anuncio, todo habla igual.'],
];
let pIdx = 0, front = 'a'; const phA = $('ys-phA'), phB = $('ys-phB'), duo = $('ys-duo');
const dotsEl = $('ys-parDots'); PAIRS.forEach(() => dotsEl.appendChild(document.createElement('i')));
let mx = 0, my = 0;
function layoutPair() {
  const tilt = (el, b, k, z) => { el.style.transform = `translate3d(${mx * k}px, ${my * k}px, 0) rotate(${b + mx * .02}deg) rotateY(${mx * .03}deg) rotateX(${-my * .03}deg)`; el.style.zIndex = z };
  const fa = front === 'a';
  tilt(phA, -5, fa ? 22 : -10, fa ? 2 : 1); tilt(phB, 6, fa ? -10 : 22, fa ? 1 : 2);
  phA.classList.toggle('back', !fa); phB.classList.toggle('back', fa)
}
function setPair(k) {
  pIdx = (k + PAIRS.length) % PAIRS.length; const [a, b, d] = PAIRS[pIdx];
  [[phA, a], [phB, b]].forEach(([el, [f, cap]], j) => { const im = el.querySelector('img'); im.style.opacity = 0; setTimeout(() => { im.src = img(f); im.alt = cap; el.querySelector('figcaption').textContent = cap; im.style.opacity = 1 }, 200 + j * 120) });
  $('ys-par-d').textContent = d; [...dotsEl.children].forEach((x, j) => x.classList.toggle('on', j === pIdx))
}
duo.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; const r = duo.getBoundingClientRect(); mx = ((e.clientX - r.left) / r.width - .5) * 2; my = ((e.clientY - r.top) / r.height - .5) * 2; layoutPair() });
duo.addEventListener('pointerleave', () => { mx = my = 0; layoutPair() });
const flip = () => { front = front === 'a' ? 'b' : 'a'; layoutPair() };
duo.addEventListener('click', flip); duo.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip() } });
$('ys-parPrev').onclick = () => setPair(pIdx - 1); $('ys-parNext').onclick = () => setPair(pIdx + 1);
setPair(0); layoutPair();

// ---------- redes (teléfono) ----------
const FEED = ['yo-perla', 'estilo-04', 'avatar-05', 'structure-02', 'yo-jardin', 'estilo-05', 'avatar-08', 'yo-arlequin', 'campana-naranja-poster', 'estilo-03', 'yo-marioneta-escena', 'structure-06', 'avatar-11', 'yo-barroco', 'estilo-07'];
const REELS = [['campana-naranja', 'Spot IA'], ['sello-animado', 'Sello'], ['logo-animado', 'Logo'], ['iconos-flotantes', 'Íconos'], ['reel-pov-conejo', 'POV', 1], ['cielo-02', 'Sky Club', 1]];
const TIPS = [['estilo-06', '3 palabras para pedir Bauhaus'], ['estilo-01', 'Cómo describir un estilo retro'], ['yo-verano', 'Mi prompt para retratos'], ['avatar-03', 'Avatares 3D en 5 pasos'], ['estilo-02', 'Paletas que se ven caras'], ['structure-04', 'Mockups que venden']];
const HL = [['Mundos', 'ic-luna'], ['Proceso', 'ic-carpa'], ['Clientes', 'ic-sello-rojo'], ['Tips IA', 'ic-globo'], ['Yo', 'ic-conejita'], ['Estilos', 'ic-timbre']];
const STORIES = { Mundos: ['yo-perla', 'yo-jardin', 'yo-arlequin'], Proceso: ['estilo-03', 'estilo-04'], Clientes: ['structure-01', 'structure-04', 'structure-05'], 'Tips IA': ['estilo-06', 'estilo-01'], Yo: ['yo-margaritas', 'avatar-01'], Estilos: ['estilo-05', 'estilo-08', 'estilo-07'] };
const screen = $('ys-screen'), feed = $('ys-feed'), hl = $('ys-hl');
HL.forEach(([n, ic]) => { const b = document.createElement('button'); b.type = 'button'; b.innerHTML = `<span class="c"><img src="${img(ic)}" alt="" loading="lazy"></span>${n}`; b.onclick = () => openStory(n); hl.appendChild(b) });
function openStory(n) {
  const list = STORIES[n]; let k = 0; const st = document.createElement('div'); st.className = 'ys-story'; st.setAttribute('role', 'button'); st.setAttribute('aria-label', 'Siguiente historia');
  const show = () => { st.innerHTML = `<div class="bar"><i></i></div><img src="${img(list[k])}" alt=""><div class="lab">${n}</div>` };
  show(); screen.appendChild(st);
  let tm = setInterval(() => next(), 4000);
  function next() { k++; if (k >= list.length) { clearInterval(tm); st.remove() } else { show(); clearInterval(tm); tm = setInterval(() => next(), 4000) } }
  st.onclick = next
}
function openPost(f, isVid) {
  const p = document.createElement('div'); p.className = 'ys-post';
  const media = isVid ? `<video src="${vid(f)}" poster="${poster(f)}" autoplay muted loop playsinline></video>` : `<img src="${img(f)}" alt="">`;
  p.innerHTML = `<div class="ys-posth"><img src="${img('yo-perla')}" alt="">yosclau<button type="button" aria-label="Cerrar">×</button></div><div class="ys-postm">${media}<span class="ys-heart">♥</span></div>
  <div class="ys-posta"><div class="acts"><button type="button" class="lk" aria-label="Me gusta">♡</button><span>💬</span><span>↗</span></div><span><b>yosclau</b> Un mundo nuevo ✦ ¿Cuál es tu favorito? #yosclau #diseñoconIA</span></div>`;
  screen.appendChild(p);
  p.querySelector('.ys-posth button').onclick = () => p.remove();
  const lk = p.querySelector('.lk'), heart = p.querySelector('.ys-heart'); let liked = false;
  const like = force => { liked = force || !liked; lk.textContent = liked ? '♥' : '♡'; lk.classList.toggle('liked', liked); if (liked) { heart.classList.remove('go'); void heart.offsetWidth; heart.classList.add('go') } };
  lk.onclick = () => like();
  const pm = p.querySelector('.ys-postm'); let lastTap = 0;
  pm.addEventListener('pointerup', () => { const n = Date.now(); if (n - lastTap < 320) { like(true); lastTap = 0 } else lastTap = n });
}
function renderFeed(t) {
  feed.innerHTML = ''; const g = document.createElement('div'); g.className = 'ys-g3' + (t === 'reels' ? ' reels' : '');
  if (t === 'feed') FEED.forEach(f => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Abrir post'); b.innerHTML = `<img src="${img(f)}" alt="" loading="lazy">`; b.onclick = () => openPost(f); g.appendChild(b) });
  if (t === 'reels') REELS.forEach(([f, v, still]) => {
    const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Abrir reel ' + v);
    if (still) b.innerHTML = `<img src="${img(f)}" alt="" loading="lazy">`;
    else { const vv = lazyVideo(f, touch); b.appendChild(vv); if (!touch) { b.onmouseenter = () => vv.play().catch(() => { }); b.onmouseleave = () => vv.pause() } }
    b.insertAdjacentHTML('beforeend', `<span class="views">▶ ${v}</span>`);
    b.onclick = () => openPost(f, !still); g.appendChild(b)
  });
  if (t === 'tips') TIPS.forEach(([f, cap]) => { const b = document.createElement('button'); b.type = 'button'; b.innerHTML = `<img src="${img(f)}" alt="" loading="lazy"><span class="views">${cap}</span>`; b.onclick = () => openPost(f); g.appendChild(b) });
  feed.appendChild(g)
}
document.querySelectorAll('.ys-tabs button').forEach(b => b.onclick = () => {
  if (vio) feed.querySelectorAll('video').forEach(v => vio.unobserve(v));
  document.querySelectorAll('.ys-tabs button').forEach(x => x.setAttribute('aria-selected', x === b)); renderFeed(b.dataset.t)
});
renderFeed('feed');

// ---------- mesa de trabajo (arrastrable) ----------
// Mouse: arrastra al instante. Touch: mantén presionado ~0.2 s y arrastra; un deslizamiento normal sigue haciendo scroll de la página.
const desk = $('ys-desk');
const DESK = [
  ['pol', 'yo-perla', 'la idea', 8, 10, -6], ['pol', 'estilo-02', 'referencia', 30, 6, 4], ['pol', 'avatar-07', 'personaje', 56, 12, -3],
  ['pol', 'yo-jardin', 'atmósfera', 74, 30, 7], ['pol', 'structure-02', 'para clientes', 40, 52, -5], ['pol', 'estilo-05', 'color', 12, 55, 5],
  ['note y', 'Idea → mundo → historia → sistema → pieza', '', 60, 60, 3], ['note p', '¿Qué se siente?', '', 22, 34, -4], ['note s', 'menos ruido, más intención ✦', '', 80, 6, 5],
  ['obj', 'ic-sello-rojo', '', 4, 78, -10, 120], ['obj', 'ic-luna', '', 88, 70, 12, 100], ['obj', 'ic-globo', '', 48, 2, 0, 90], ['obj', 'ic-conejita', '', 30, 74, 4, 100], ['obj', 'ic-carpa', '', 68, 76, -4, 120], ['obj', 'ic-timbre', '', 90, 44, 9, 90],
];
let zTop = 10; const deskEls = [];
DESK.forEach(([kind, a, b, x, y, r, w]) => {
  const k0 = kind.split(' ')[0]; const el = document.createElement('div'); el.className = 'ys-it ys-' + k0 + (kind.includes(' ') ? ' ' + kind.split(' ')[1] : '');
  if (k0 === 'pol') el.innerHTML = `<span class="ys-tape"></span><img src="${img(a)}" alt="" loading="lazy"><p>${b}</p>`;
  else if (k0 === 'note') el.textContent = a;
  else el.innerHTML = `<img src="${img(a)}" alt="" loading="lazy" style="width:${narrow() ? Math.round(w * .72) : w}px">`;
  el.dataset.x = x; el.dataset.y = y; el.dataset.r = r; el.tabIndex = 0; el.setAttribute('aria-label', 'Pieza del moodboard');
  desk.appendChild(el); deskEls.push(el)
});
function place(el, x, y, r) {
  const W = desk.clientWidth, H = desk.clientHeight, ew = el.offsetWidth, eh = el.offsetHeight;
  el.style.left = Math.max(-ew * .2, Math.min(W - ew * .8, x / 100 * W)) + 'px'; el.style.top = Math.max(-eh * .2, Math.min(H - eh * .8, y / 100 * H)) + 'px'; el.style.transform = `rotate(${r}deg)`
}
function layoutDesk(anim) { deskEls.forEach(el => { el.style.transition = anim ? 'left .8s cubic-bezier(.2,.8,.2,1), top .8s cubic-bezier(.2,.8,.2,1), transform .8s' : 'none'; place(el, +el.dataset.x, +el.dataset.y, +el.dataset.r) }) }
function clampXY(el, x, y) { const W = desk.clientWidth, H = desk.clientHeight, ew = el.offsetWidth, eh = el.offsetHeight; return [Math.max(-ew * .3, Math.min(W - ew * .7, x)), Math.max(-eh * .3, Math.min(H - eh * .7, y))] }
function startDrag(el, cx, cy) {
  el.style.transition = 'none'; el.style.zIndex = ++zTop; el.classList.add('lift');
  el.style.transform = `rotate(${(+el.dataset.r) * .5}deg) scale(1.04)`;
  return { ox: cx - el.offsetLeft, oy: cy - el.offsetTop }
}
function moveDrag(el, s, cx, cy) { const [x, y] = clampXY(el, cx - s.ox, cy - s.oy); el.style.left = x + 'px'; el.style.top = y + 'px' }
function endDrag(el) { el.classList.remove('lift', 'armed'); el.style.transform = `rotate(${el.dataset.r}deg)`; el.dataset.x = el.offsetLeft / desk.clientWidth * 100; el.dataset.y = el.offsetTop / desk.clientHeight * 100 }
deskEls.forEach(el => {
  // mouse y lápiz
  el.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') return;
    e.preventDefault(); el.setPointerCapture(e.pointerId); const s = startDrag(el, e.clientX, e.clientY);
    const mv = ev => moveDrag(el, s, ev.clientX, ev.clientY);
    const up = () => { endDrag(el); el.removeEventListener('pointermove', mv); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up) };
    el.addEventListener('pointermove', mv); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up)
  });
  // touch: mantener presionado para arrastrar
  let hold = null, armed = false, s = null, t0 = null;
  el.addEventListener('touchstart', e => {
    if (e.touches.length > 1) return; const t = e.touches[0]; t0 = [t.clientX, t.clientY]; armed = false;
    clearTimeout(hold); hold = setTimeout(() => { armed = true; el.classList.add('armed'); s = startDrag(el, t0[0], t0[1]); if (navigator.vibrate) navigator.vibrate(8) }, 200)
  }, { passive: true });
  el.addEventListener('touchmove', e => {
    const t = e.touches[0];
    if (!armed) { if (t0 && Math.hypot(t.clientX - t0[0], t.clientY - t0[1]) > 8) { clearTimeout(hold); t0 = null } return }
    e.preventDefault(); moveDrag(el, s, t.clientX, t.clientY)
  }, { passive: false });
  const tend = () => { clearTimeout(hold); if (armed) endDrag(el); armed = false; t0 = null };
  el.addEventListener('touchend', tend); el.addEventListener('touchcancel', tend);
  el.addEventListener('contextmenu', e => e.preventDefault());
});
desk.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; const r = desk.getBoundingClientRect(); desk.style.setProperty('--lx', ((e.clientX - r.left) / r.width * 100) + '%'); desk.style.setProperty('--ly', ((e.clientY - r.top) / r.height * 100) + '%') });
$('ys-tidy').onclick = () => { const cols = narrow() ? 3 : 5, rows = Math.ceil(deskEls.length / cols); deskEls.forEach((el, k) => { el.dataset.x = 3 + (k % cols) * (94 / cols); el.dataset.y = 3 + Math.floor(k / cols) * (80 / rows); el.dataset.r = 0 }); layoutDesk(true) };
$('ys-mess').onclick = () => { deskEls.forEach(el => { el.dataset.x = 2 + Math.random() * 82; el.dataset.y = 2 + Math.random() * 70; el.dataset.r = (Math.random() - .5) * 18; el.style.zIndex = ++zTop }); layoutDesk(true) };
addEventListener('load', () => layoutDesk(false)); let rw = innerWidth; addEventListener('resize', () => { if (innerWidth !== rw) { rw = innerWidth; layoutDesk(false) } }); setTimeout(() => layoutDesk(false), 300);
layoutDesk(false);

renderWall(); pick(0, true);
})();
