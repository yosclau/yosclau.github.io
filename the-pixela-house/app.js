(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var intro = document.querySelector('.intro');
  var rig = document.getElementById('rig');
  var badge = document.getElementById('badge');
  function sizeStrap(){
    var h = intro.clientHeight || window.innerHeight;
    var s = Math.max(110, Math.min(260, h*(window.innerWidth < 700 ? 0.3 : 0.24)));
    rig.style.setProperty('--strap', s+'px');
  }
  sizeStrap(); window.addEventListener('resize', sizeStrap);
  var th = reduce ? 0 : -14, om = 0, y = reduce ? 0 : -window.innerHeight, vy = 0;
  var dragging = false, last = 0, twist = 0, K = 38, C = 1.6;
  function step(t){
    var dt = Math.min(0.032, (t - (last||t))/1000); last = t;
    if(!dragging){ var a = -K*th - C*om; om += a*dt; th += om*dt; }
    var ay = -90*y - 9*vy; vy += ay*dt; y += vy*dt;
    if(Math.abs(y) < .2 && Math.abs(vy) < .2){ y = 0; vy = 0; }
    twist += ((om*0.12) - twist)*0.1;
    rig.style.transform = 'translateY('+y.toFixed(1)+'px) rotate('+th.toFixed(2)+'deg)';
    badge.style.transform = 'perspective(900px) rotateY('+Math.max(-25,Math.min(25,twist)).toFixed(2)+'deg)';
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
  if(!reduce) setInterval(function(){ if(!dragging && Math.abs(om) < 4) om += (Math.random()-.5)*14; }, 2600);
  var lastY = window.scrollY;
  window.addEventListener('scroll', function(){ var d = window.scrollY - lastY; lastY = window.scrollY; if(!dragging) om += Math.max(-30, Math.min(30, d*0.6)); }, {passive:true});
  var sx=0, sy=0, moved=false, prevAng=0, prevT=0, offs=0;
  function anchor(){ var r = intro.getBoundingClientRect(); return {x: r.left + r.width/2, y: r.top + y}; }
  function angOf(e){ var a = anchor(); return Math.atan2(-(e.clientX - a.x), e.clientY - a.y)*180/Math.PI; }
  badge.addEventListener('pointerdown', function(e){ dragging = true; moved = false; sx = e.clientX; sy = e.clientY; offs = th - angOf(e); prevAng = th; prevT = performance.now(); try{ badge.setPointerCapture(e.pointerId); }catch(_){} });
  badge.addEventListener('pointermove', function(e){
    if(!dragging) return;
    if(Math.abs(e.clientX-sx) + Math.abs(e.clientY-sy) > 6) moved = true;
    if(!moved) return;
    var n = Math.max(-70, Math.min(70, angOf(e) + offs)), now = performance.now(), dt = Math.max(8, now - prevT)/1000;
    om = (n - prevAng)/dt; prevAng = n; prevT = now; th = n;
  });
  function end(){ if(!dragging) return; dragging = false; om = Math.max(-260, Math.min(260, om)); if(!moved){ badge.classList.toggle('flipped'); om += 40; } }
  badge.addEventListener('pointerup', end); badge.addEventListener('pointercancel', end);
  badge.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); badge.classList.toggle('flipped'); om += 40; }});
  if(!reduce){
    setTimeout(function(){ badge.classList.add('flipped'); om += 30; }, 2600);
    setTimeout(function(){ badge.classList.remove('flipped'); om -= 30; }, 5600);
  }
  function typeOnce(el, text, speed){ var i = 0; el.textContent = ''; (function tick(){ el.textContent = text.slice(0, ++i); if(i < text.length) setTimeout(tick, speed); })(); }
  var cap = document.getElementById('capText');
  setTimeout(function(){ typeOnce(cap, 'Sistemas de IA para negocios que ya no quieren copiar y pegar', reduce?0:45); }, reduce?0:900);
  var words = ['filtra', 'ordena', 'resume', 'agenda'], tw = document.getElementById('tw'), wi = 0;
  function cycle(){
    (function del(){
      if(tw.textContent.length > 0){ tw.textContent = tw.textContent.slice(0,-1); setTimeout(del, 60); }
      else { wi = (wi+1) % words.length; var w = words[wi], i = 0;
        (function add(){ tw.textContent = w.slice(0, ++i); if(i < w.length) setTimeout(add, 95); else setTimeout(cycle, 1900); })(); }
    })();
  }
  if(!reduce) setTimeout(cycle, 2200);
  var rows = document.querySelectorAll('#roleList li');
  function roleTick(){
    var mid = window.innerHeight*0.5, best = null, bd = 1e9;
    rows.forEach(function(li){ var r = li.getBoundingClientRect(); var d = Math.abs((r.top + r.height/2) - mid); if(d < bd){ bd = d; best = li; } });
    rows.forEach(function(li){ li.classList.toggle('on', li === best); });
  }
  window.addEventListener('scroll', roleTick, {passive:true}); roleTick();
  var win = document.querySelector('.pix-win');
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es, o){ es.forEach(function(e){ if(e.isIntersecting){ win.classList.add('go'); o.disconnect(); } }); }, {threshold:.3}).observe(win);
  } else { win.classList.add('go'); }
})();
