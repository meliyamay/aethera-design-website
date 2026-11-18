/* Aethera Design: soft motion */
(function(){
  var reduce = false;
  try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(e){}

  /* ---- hero slideshow: slides sideways, slowly, endless ---- */
  var track = document.getElementById('track');
  if (track) {
    var hero = track.parentNode, busy = false, timer = null;
    var DUR = 1900, EVERY = 5200;
    function step(){ var s = track.children[0]; return s.getBoundingClientRect().width + 8; }
    function next(){
      if (busy) return; busy = true;
      track.style.transition = 'transform ' + DUR + 'ms cubic-bezier(.65,0,.25,1)';
      track.style.transform = 'translateX(' + (-step()) + 'px)';
      setTimeout(function(){
        track.style.transition = 'none';
        track.appendChild(track.children[0]);
        track.style.transform = 'translateX(0)';
        void track.offsetWidth; busy = false;
      }, DUR + 40);
    }
    function prev(){
      if (busy) return; busy = true;
      track.style.transition = 'none';
      track.insertBefore(track.children[track.children.length - 1], track.children[0]);
      track.style.transform = 'translateX(' + (-step()) + 'px)';
      void track.offsetWidth;
      track.style.transition = 'transform ' + DUR + 'ms cubic-bezier(.65,0,.25,1)';
      track.style.transform = 'translateX(0)';
      setTimeout(function(){ track.style.transition = 'none'; busy = false; }, DUR + 40);
    }
    function start(){ stop(); if (!reduce) timer = setInterval(function(){ if (!document.hidden) next(); }, EVERY); }
    function stop(){ if (timer) clearInterval(timer); timer = null; }
    var b1 = hero.querySelector('.prev'), b2 = hero.querySelector('.next');
    if (b1) b1.addEventListener('click', function(){ prev(); start(); });
    if (b2) b2.addEventListener('click', function(){ next(); start(); });
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    var t0 = 0; /* wait until the intro is over on the home page */
    setTimeout(start, 600);
    window.aetheraHero = { next: next, prev: prev };
  }

  /* ---- reveal on scroll ---- */
  var sel = '.pcard,.side .widget,.section-head,.cat-head > *,.post .head > *,.post-fig,.prose p,.look h2,.look li,.about-page > *,.news .wrap > *,.empty,.foot-top,.disclosure';
  var els = [].slice.call(document.querySelectorAll(sel));
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach(function(e){ e.classList.add('rv','in'); });
  } else {
    var seen = new Map();
    els.forEach(function(e){
      var p = e.parentNode, n = seen.get(p) || 0; seen.set(p, n + 1);
      e.classList.add('rv');
      e.style.transitionDelay = Math.min(n, 5) * 90 + 'ms';
    });
    var io = new IntersectionObserver(function(list){
      list.forEach(function(en){
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    els.forEach(function(e){ io.observe(e); });
  }

  /* ---- soft page transition on internal links ---- */
  document.addEventListener('click', function(ev){
    var a = ev.target.closest && ev.target.closest('a[href]');
    if (!a || ev.defaultPrevented || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button) return;
    if (a.target && a.target !== '_self') return;
    var h = a.getAttribute('href');
    if (!h || h.charAt(0) === '#' || /^(mailto:|tel:|https?:|\/\/)/.test(h)) return;
    if (reduce) return;
    ev.preventDefault();
    document.body.classList.add('leaving');
    setTimeout(function(){ location.href = a.href; }, 420);
  });
  window.addEventListener('pageshow', function(e){
    if (e.persisted) document.body.classList.remove('leaving');
  });
})();
