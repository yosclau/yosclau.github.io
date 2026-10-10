// Yosclau portfolio · small progressive enhancements
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Play case videos only when visible; pause off-screen to save battery
  var vids = document.querySelectorAll('video.vid');
  if ('IntersectionObserver' in window){
    var vo = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        var v = e.target;
        if (e.isIntersecting && !reduce){ var p = v.play(); if (p && p.catch) p.catch(function(){}); }
        else if (!e.isIntersecting){ v.pause(); }
      });
    }, {threshold:0.25});
    vids.forEach(function(v){ vo.observe(v); });
  }
  // Sound toggles
  document.querySelectorAll('button.sound').forEach(function(btn){
    var v = btn.parentElement.querySelector('video');
    btn.addEventListener('click', function(){
      var on = v.muted;
      document.querySelectorAll('video').forEach(function(o){ if (o !== v){ o.muted = true; } });
      document.querySelectorAll('button.sound').forEach(function(b){ if (b !== btn){ b.setAttribute('aria-pressed','false'); b.textContent = 'Activar sonido'; } });
      v.muted = !on;
      if (on){ v.currentTime = 0; var p = v.play(); if (p && p.catch) p.catch(function(){}); }
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.textContent = on ? 'Silenciar' : 'Activar sonido';
    });
  });
  // Gentle reveal
  if (!reduce && 'IntersectionObserver' in window){
    var els = document.querySelectorAll('.case, .play, .constants li, .steps li, .srv, .crew-card, .section-head, .pf-head');
    var ro = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); ro.unobserve(e.target); } });
    }, {threshold:0.12, rootMargin:'0px 0px -40px 0px'});
    els.forEach(function(el){ el.classList.add('reveal'); ro.observe(el); });
  }
})();

// Portafolio: filtros por categoría (sin JS se ve todo)
(function(){
  var chips = document.querySelectorAll('.chip-f');
  if (!chips.length) return;
  var items = document.querySelectorAll('main [data-cat]');
  var archive = document.getElementById('archivo');
  var status = document.querySelector('.filter-status');
  var bar = document.querySelector('.filters');
  var top = document.querySelector('.topbar');
  var cats = {};
  chips.forEach(function(c){ cats[c.getAttribute('data-filter')] = c.textContent; });
  function setTb(){ if (top) document.documentElement.style.setProperty('--tb', top.offsetHeight + 'px'); }
  setTb(); window.addEventListener('resize', setTb);
  function apply(cat, scroll){
    var n = 0, inArchive = 0;
    chips.forEach(function(c){ c.setAttribute('aria-pressed', c.getAttribute('data-filter') === cat ? 'true' : 'false'); });
    items.forEach(function(el){
      var show = cat === 'all' || el.getAttribute('data-cat') === cat;
      el.hidden = !show;
      if (show){ n++; if (archive && archive.contains(el)) inArchive++; }
    });
    if (archive) archive.hidden = inArchive === 0;
    if (status) status.textContent = (cat === 'all' ? 'Todo el portafolio' : cats[cat]) + ': ' + n + (n === 1 ? ' proyecto' : ' proyectos');
    if (scroll && bar){
      var y = bar.getBoundingClientRect().top + window.pageYOffset - (top ? top.offsetHeight : 0);
      if (window.pageYOffset > y + 2) window.scrollTo(0, y);
    }
  }
  chips.forEach(function(c){
    c.addEventListener('click', function(){
      var cat = c.getAttribute('data-filter');
      apply(cat, true);
      if (history.replaceState) history.replaceState(null, '', cat === 'all' ? location.pathname : '#' + cat);
    });
  });
  var h = (location.hash || '').slice(1);
  if (h && cats[h] && h !== 'all') apply(h, false);
})();
