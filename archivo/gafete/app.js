
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var intro = document.querySelector('.intro');
  var rig = document.getElementById('rig');
  var badge = document.getElementById('badge');

  // ---- lanyard length from viewport
  function sizeStrap(){
    var h = intro.clientHeight || window.innerHeight;
    var s = Math.max(110, Math.min(260, h*(window.innerWidth < 700 ? 0.3 : 0.24)));
    rig.style.setProperty('--strap', s+'px');
  }
  sizeStrap(); window.addEventListener('resize', sizeStrap);

  // ---- pendulum physics
  var th = reduce ? 0 : 14, om = 0;          // angle (deg), angular velocity
  var y = reduce ? 0 : -window.innerHeight, vy = 0; // drop-in offset
  var dragging = false, last = 0, twist = 0;
  var K = 38, C = 1.6;                         // stiffness, damping
  function step(t){
    var dt = Math.min(0.032, (t - (last||t))/1000); last = t;
    if(!dragging){
      var a = -K*th - C*om;
      om += a*dt; th += om*dt;
    }
    // drop spring
    var ay = -90*y - 9*vy; vy += ay*dt; y += vy*dt;
    if(Math.abs(y) < .2 && Math.abs(vy) < .2){ y = 0; vy = 0; }
    twist += ((om*0.12) - twist)*0.1;
    rig.style.transform = 'translateY('+y.toFixed(1)+'px) rotate('+th.toFixed(2)+'deg)';
    badge.style.transform = 'perspective(900px) rotateY('+Math.max(-25,Math.min(25,twist)).toFixed(2)+'deg)';
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);

  // idle breeze so it never fully stops
  if(!reduce) setInterval(function(){ if(!dragging && Math.abs(om) < 4) om += (Math.random()-.5)*14; }, 2600);

  // scroll nudges the badge
  var lastY = window.scrollY;
  window.addEventListener('scroll', function(){
    var d = window.scrollY - lastY; lastY = window.scrollY;
    if(!dragging) om += Math.max(-30, Math.min(30, d*0.6));
  }, {passive:true});

  // drag + tap to flip
  var sx=0, sy=0, moved=false, prevAng=0, prevT=0, offs=0;
  function anchor(){ var r = intro.getBoundingClientRect(); return {x: r.left + r.width/2, y: r.top + y}; }
  function angOf(e){ var a = anchor(); return Math.atan2(-(e.clientX - a.x), e.clientY - a.y)*180/Math.PI; }
  badge.addEventListener('pointerdown', function(e){
    dragging = true; moved = false; sx = e.clientX; sy = e.clientY;
    offs = th - angOf(e); prevAng = th; prevT = performance.now();
    try{ badge.setPointerCapture(e.pointerId); }catch(_){}
  });
  badge.addEventListener('pointermove', function(e){
    if(!dragging) return;
    if(Math.abs(e.clientX-sx) + Math.abs(e.clientY-sy) > 6) moved = true;
    if(!moved) return;
    var n = Math.max(-70, Math.min(70, angOf(e) + offs));
    var now = performance.now(), dt = Math.max(8, now - prevT)/1000;
    om = (n - prevAng)/dt; prevAng = n; prevT = now; th = n;
  });
  function end(){
    if(!dragging) return; dragging = false;
    om = Math.max(-260, Math.min(260, om));
    if(!moved){ badge.classList.toggle('flipped'); om += 40; }
  }
  badge.addEventListener('pointerup', end);
  badge.addEventListener('pointercancel', end);
  badge.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); badge.classList.toggle('flipped'); om += 40; }});

  // auto show the back once, like the reference
  if(!reduce){
    setTimeout(function(){ badge.classList.add('flipped'); om += 30; }, 2600);
    setTimeout(function(){ badge.classList.remove('flipped'); om -= 30; }, 5600);
  }

  // ---- typed caption (intro)
  function typeOnce(el, text, speed, cb){
    var i = 0; el.textContent = '';
    (function tick(){ el.textContent = text.slice(0, ++i); if(i < text.length) setTimeout(tick, speed); else if(cb) cb(); })();
  }
  var cap = document.getElementById('capText');
  setTimeout(function(){ typeOnce(cap, 'Diseñando marcas que la gente recuerda', reduce?0:55); }, reduce?0:900);

  // ---- typed headline cycling word (hero)
  var words = ['usa', 'recuerda', 'comparte', 'elige'];
  var tw = document.getElementById('tw'), wi = 0;
  function cycle(){
    var w = words[wi], n = w.length;
    (function del(){
      if(tw.textContent.length > 0){ tw.textContent = tw.textContent.slice(0,-1); setTimeout(del, 60); }
      else { wi = (wi+1) % words.length; w = words[wi]; var i=0;
        (function add(){ tw.textContent = w.slice(0, ++i); if(i < w.length) setTimeout(add, 95); else setTimeout(cycle, 1900); })(); }
    })();
  }
  if(!reduce) setTimeout(cycle, 2200);

  // ---- roles: highlight the row in the middle of the screen
  var rows = document.querySelectorAll('#roleList li');
  function roleTick(){
    var mid = window.innerHeight*0.5, best = null, bd = 1e9;
    rows.forEach(function(li){ var r = li.getBoundingClientRect(); var d = Math.abs((r.top + r.height/2) - mid); if(d < bd){ bd = d; best = li; } });
    rows.forEach(function(li){ li.classList.toggle('on', li === best); });
  }
  window.addEventListener('scroll', roleTick, {passive:true}); roleTick();

  // ---- count up
  var counted = false, nums = document.querySelectorAll('[data-count]');
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting && !counted){ counted = true;
        nums.forEach(function(n){ var to = +n.dataset.count, t0 = performance.now(), D = 1300;
          (function f(t){ var p = Math.min(1, (t - t0)/D); n.textContent = Math.round(to*(1-Math.pow(1-p,3))); if(p < 1) requestAnimationFrame(f); })(t0); });
      }
    });
  }, {threshold:.4});
  io.observe(document.querySelector('.stat-grid'));

  // ---- 3D carousel
  var car = document.getElementById('carousel'), cards = car.querySelectorAll('.card'), dots = document.getElementById('dots');
  var cur = 0, N = cards.length;
  for(var i=0;i<N;i++){ var d = document.createElement('i'); dots.appendChild(d); }
  function layout(){
    cards.forEach(function(c, i){
      var o = i - cur; if(o > N/2) o -= N; if(o < -N/2) o += N; var a = Math.abs(o);
      var tx = o*(window.innerWidth > 860 ? 72 : 62), ry = -o*26, sc = 1 - Math.min(a,3)*0.1, tz = -a*60;
      c.style.transform = 'translateX('+tx+'%) translateZ('+tz+'px) rotateY('+ry+'deg) scale('+sc+')';
      c.style.opacity = a > 2 ? 0 : (a === 0 ? 1 : (a === 1 ? .75 : .35));
      c.style.zIndex = 10 - a;
      c.style.pointerEvents = a > 2 ? 'none' : 'auto';
    });
    dots.querySelectorAll('i').forEach(function(d,i){ d.classList.toggle('on', i === cur); });
  }
  function go(n){ cur = (n + N) % N; layout(); }
  document.getElementById('prev').onclick = function(){ go(cur-1); };
  document.getElementById('next').onclick = function(){ go(cur+1); };
  car.addEventListener('keydown', function(e){ if(e.key==='ArrowLeft') go(cur-1); if(e.key==='ArrowRight') go(cur+1); });
  cards.forEach(function(c, i){ c.addEventListener('click', function(e){ if(i !== cur){ e.preventDefault(); go(i); } }); });
  var px = null, pdx = 0;
  car.addEventListener('pointerdown', function(e){ px = e.clientX; pdx = 0; });
  car.addEventListener('pointermove', function(e){ if(px !== null) pdx = e.clientX - px; });
  function pend(){ if(px === null) return; if(pdx < -40) go(cur+1); else if(pdx > 40) go(cur-1); px = null; }
  car.addEventListener('pointerup', pend); car.addEventListener('pointercancel', pend); car.addEventListener('pointerleave', pend);
  function fit(){ var m=0; cards.forEach(function(c){ m=Math.max(m,c.offsetHeight); }); car.style.height=(m+16)+'px'; }
  layout(); fit(); window.addEventListener('resize', fit); window.addEventListener('load', fit);
  car.querySelectorAll('img').forEach(function(im){ im.addEventListener('load', fit); });
})();
