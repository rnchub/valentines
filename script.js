// script.js - responsive interactions + heart confetti
(() => {
  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');
  const herNameSpan = document.querySelector('.her-name');

  // Allow ?name=Emma
  const params = new URLSearchParams(location.search);
  const nameParam = params.get('name');
  if (nameParam) herNameSpan.textContent = decodeURIComponent(nameParam);

  // gentle entrance animation for CTAs
  requestAnimationFrame(() => {
    const ctas = document.querySelectorAll('.cta');
    ctas.forEach((c,i) => {
      c.style.transform = 'translateY(8px)';
      c.style.opacity = '0';
      setTimeout(() => { c.style.transition = 'all 380ms cubic-bezier(.2,.9,.2,1)'; c.style.transform = 'translateY(0)'; c.style.opacity='1'; }, 180 + i*80);
    });
  });

  yesBtn.addEventListener('click', () => {
    yesBtn.textContent = 'Yay! ❤️';
    yesBtn.disabled = true;
    startHearts(140);
    pulsePhotos();
  });

  noBtn.addEventListener('click', () => {
    // friendly nudge animation
    noBtn.animate([
      { transform: 'translateY(0)' },
      { transform: 'translateY(-8px)' },
      { transform: 'translateY(0)' }
    ], { duration: 420, easing: 'ease-out' });
  });

  // Photo pulse when she says yes
  function pulsePhotos(){
    const photos = document.querySelectorAll('.photo');
    photos.forEach((p, idx) => {
      p.animate([
        { transform: p.style.transform },
        { transform: p.style.transform + ' scale(1.06)' },
        { transform: p.style.transform }
      ], { duration: 900, delay: idx*80, easing: 'ease-out' });
    });
  }

  // ---- Simple heart confetti on canvas ----
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  let W = canvas.width = innerWidth;
  let H = canvas.height = innerHeight;
  window.addEventListener('resize', () => { W = canvas.width = innerWidth; H = canvas.height = innerHeight; });

  function rand(min, max){ return Math.random()*(max-min)+min }

  function drawHeart(x,y,s,fill){
    ctx.save();
    ctx.translate(x,y);
    ctx.scale(s,s);
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.bezierCurveTo(0,-3, -3,-7, -7,-7);
    ctx.bezierCurveTo(-14,-7, -14,0, -14,0);
    ctx.bezierCurveTo(-14,8, -6,13, 0,18);
    ctx.bezierCurveTo(6,13, 14,8, 14,0);
    ctx.bezierCurveTo(14,0, 14,-7, 7,-7);
    ctx.bezierCurveTo(3,-7, 0,-3, 0,0);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.restore();
  }

  function startHearts(count = 80){
    const hearts = [];
    for (let i=0;i<count;i++){
      hearts.push({
        x: rand(0,W),
        y: rand(-H, 0),
        s: rand(0.6,1.5),
        vy: rand(0.6, 3),
        vx: rand(-0.9,0.9),
        rot: rand(0,Math.PI*2),
        vro: rand(-0.03,0.03),
        color: `hsl(${rand(320,350)}, ${rand(60,92)}%, ${rand(48,72)}%)`,
        wob: rand(0.5,1.8)
      });
    }
    let t = 0;
    const ttl = 6000 + Math.random()*3000;
    function frame(){
      t += 16;
      ctx.clearRect(0,0,W,H);
      for (let h of hearts){
        h.x += h.vx + Math.sin(t/300*h.wob)*0.6;
        h.y += h.vy;
        h.rot += h.vro;
        ctx.save();
        ctx.translate(h.x, h.y);
        ctx.rotate(Math.sin(h.rot));
        drawHeart(0,0, h.s*6, h.color);
        ctx.restore();
      }
      if (t < ttl){
        requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0,0,W,H);
      }
    }
    frame();
  }

})();