// script.js - reveal + simple heart confetti
(() => {
  const revealBtn = document.getElementById('revealBtn');
  const reveal = document.getElementById('reveal');
  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');
  const herNameSpan = document.querySelector('.her-name');

  // Optional: let the user set her name via URL param ?name=Emma
  const params = new URLSearchParams(location.search);
  const nameParam = params.get('name');
  if (nameParam) herNameSpan.textContent = decodeURIComponent(nameParam);

  revealBtn.addEventListener('click', () => {
    reveal.style.display = 'block';
    reveal.setAttribute('aria-hidden', 'false');
    revealBtn.disabled = true;
    revealBtn.textContent = 'Open';
    // smooth scroll into view
    reveal.scrollIntoView({behavior:'smooth', block:'center'});
  });

  yesBtn.addEventListener('click', () => {
    startHearts(120);
    yesBtn.textContent = 'Yay! ❤️';
    yesBtn.disabled = true;
  });

  noBtn.addEventListener('click', () => {
    // gentle nudge animation
    noBtn.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-6px)' }, { transform: 'translateY(0)' }], { duration: 420 });
  });

  // ---- Simple heart confetti on canvas ----
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  let W = canvas.width = innerWidth;
  let H = canvas.height = innerHeight;
  window.addEventListener('resize', () => { W = canvas.width = innerWidth; H = canvas.height = innerHeight; });

  function rand(min, max){ return Math.random()*(max-min)+min }

  function drawHeart(x,y,s,fill){
    // draw a heart path scaled by s
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
        vy: rand(0.6, 2),
        vx: rand(-0.8,0.8),
        rot: rand(0,Math.PI*2),
        vro: rand(-0.02,0.02),
        color: `hsl(${rand(320,340)}, ${rand(60,90)}%, ${rand(50,70)}%)`
      });
    }
    let t = 0;
    const ttl = 5000 + Math.random()*2500;
    function frame(){
      t += 16;
      ctx.clearRect(0,0,W,H);
      for (let h of hearts){
        h.x += h.vx;
        h.y += h.vy;
        h.rot += h.vro;
        ctx.save();
        ctx.translate(h.x, h.y);
        ctx.rotate(Math.sin(h.rot));
        drawHeart(0,0, h.s*6, h.color);
        ctx.restore();
      }
      // stop when hearts are below screen and time ellapsed
      if (t < ttl){
        requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0,0,W,H);
      }
    }
    frame();
  }

})();