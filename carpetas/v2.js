/* Yosclau v2: reveal on scroll + tilt suave de la carpa */
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-reveal');
    var els = document.querySelectorAll('main > section > *:not(.vidrio-band):not(.hero-text):not(.hero-collage), .port-grid > *, .work-grid > *');
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, {rootMargin:'0px 0px -8% 0px', threshold:0.08});
    els.forEach(function(el){ el.classList.add('reveal'); io.observe(el); });
  }
  var hero = document.querySelector('.hero');
  var img = document.querySelector('.carpa3d img');
  if (!reduce && hero && img && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    var raf = 0;
    hero.addEventListener('pointermove', function(ev){
      if (raf) return;
      raf = requestAnimationFrame(function(){
        raf = 0;
        var r = hero.getBoundingClientRect();
        var x = (ev.clientX - r.left) / r.width - .5, y = (ev.clientY - r.top) / r.height - .5;
        img.style.setProperty('--ry', (x * 10).toFixed(2) + 'deg');
        img.style.setProperty('--rx', (-y * 8).toFixed(2) + 'deg');
        img.style.setProperty('--tx', (x * 14).toFixed(1) + 'px');
        img.style.setProperty('--ty', (y * 10).toFixed(1) + 'px');
      });
    });
    hero.addEventListener('pointerleave', function(){ ['--rx','--ry','--tx','--ty'].forEach(function(p){ img.style.removeProperty(p); }); });
  }
})();
