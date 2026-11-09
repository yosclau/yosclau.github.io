/* Yosclau v3: parallax suave + carta con video */
(function(){
  var doc = document.documentElement;
  doc.classList.add('v3js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Parallax: cada elemento flotante se mueve según su data-depth
  var floats = [].slice.call(document.querySelectorAll('[data-depth]'));
  if (!reduce && floats.length) {
    var ticking = false;
    var update = function(){
      ticking = false;
      var vh = window.innerHeight;
      floats.forEach(function(el){
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var c = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.setProperty('--py', (c * -(+el.getAttribute('data-depth') || 10)).toFixed(1) + 'px');
      });
    };
    window.addEventListener('scroll', function(){ if (!ticking) { ticking = true; requestAnimationFrame(update); } }, {passive:true});
    update();
  }

  // Carta: tocan la carpa -> el video se abre y sale la carta -> formulario rosa
  var wrap = document.getElementById('carta-wrap');
  var escena = document.getElementById('carpa-escena');
  var btn = document.getElementById('btn-colabora');
  var video = document.getElementById('carta-video');
  var form = document.getElementById('carta');
  if (!wrap || !btn || !form) return;

  var done = false, started = false, timers = [];
  function clearTimers(){ timers.forEach(clearTimeout); timers = []; }

  function showForm(instant){
    clearTimers();
    done = true;
    if (escena) escena.classList.add('abierta');
    wrap.classList.add('abierta');
    btn.setAttribute('aria-expanded', 'true');
    if (instant) return;
    setTimeout(function(){
      form.scrollIntoView({block:'start', behavior: reduce ? 'auto' : 'smooth'});
      var first = document.getElementById('c-nombre');
      if (first) { try { first.focus({preventScroll:true}); } catch(e) {} }
    }, 250);
  }

  btn.addEventListener('click', function(){
    if (done) { showForm(); return; }
    if (started) return;
    started = true;
    if (escena) escena.classList.add('jugando');
    if (reduce || !video || !video.canPlayType || !video.canPlayType('video/mp4')) { showForm(); return; }
    video.muted = true; video.playsInline = true;
    try { video.currentTime = 0; } catch(e) {}
    var p;
    try { p = video.play(); } catch(e) { showForm(); return; }
    if (p && p.catch) p.catch(function(){ showForm(); });
    // Si el video no arranca en 5 s, o tarda demasiado, la carta se abre igual
    timers.push(setTimeout(function(){ if (video.paused || video.readyState < 2) showForm(); }, 5000));
    timers.push(setTimeout(function(){ if (!done) showForm(); }, 12000));
  });
  if (video) {
    video.addEventListener('ended', function(){ if (!done) showForm(); });
    video.addEventListener('error', function(){ if (started && !done) showForm(); }, true);
  }

  // Si llegan con #carta o #gracias, la carta ya está abierta
  var h = (location.hash || '').slice(1);
  if (h === 'carta' || h === 'gracias') { showForm(true); }
  window.addEventListener('hashchange', function(){
    var k = (location.hash || '').slice(1);
    if (k === 'carta' || k === 'gracias') { showForm(true); }
  });
})();

// Antes / después
(function(){
  document.querySelectorAll('.ba').forEach(function(ba){
    var r = ba.querySelector('.ba-range'); if (!r) return;
    var set = function(){ ba.style.setProperty('--x', r.value + '%'); };
    r.addEventListener('input', set); set();
  });
})();
