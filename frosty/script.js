/* ===============================
   Mouse Tracking
================================ */
let mouseX = window.innerWidth / 2;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
});

/* ===============================
   Frosty Element
================================ */
const frosty = document.getElementById('frosty');

/* ===============================
   Snow Layers Config
================================ */
const layers = [
  {
    el: document.querySelector('.snow-back'),
    count: 60,
    size: [6, 10],
    speed: [0.2, 0.4],
    drift: [0.05, 0.15]
  },
  {
    el: document.querySelector('.snow-mid'),
    count: 70,
    size: [10, 16],
    speed: [0.4, 0.7],
    drift: [0.1, 0.3]
  },
  {
    el: document.querySelector('.snow-front'),
    count: 50,
    size: [16, 24],
    speed: [0.7, 1.1],
    drift: [0.2, 0.5]
  }
];

const snowflakes = [];

/* ===============================
   Helpers
================================ */
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/* ===============================
   Snowflake Creation
================================ */
function createSnowflake(layer) {
  const flake = document.createElement('div');
  flake.className = 'snowflake';
  flake.innerHTML = '❄';

  layer.el.appendChild(flake);
  flake.layer = layer;

  resetSnowflake(flake, true);
  snowflakes.push(flake);
}

function resetSnowflake(flake, initial = false) {
  const { size, speed, drift } = flake.layer;

  flake.style.fontSize = rand(size[0], size[1]) + 'px';
  flake.style.left = rand(0, window.innerWidth) + 'px';
  flake.style.top = initial
    ? rand(-window.innerHeight, 0) + 'px'
    : '-20px';

  flake.speed = rand(speed[0], speed[1]);
  flake.drift = rand(-drift[1], drift[1]);
}

/* ===============================
   Animation Loop
================================ */
function animateSnow() {
  snowflakes.forEach((flake) => {
    let top = parseFloat(flake.style.top);
    let left = parseFloat(flake.style.left);

    // Vertical fall
    top += flake.speed * 5;

    // Mouse-based horizontal parallax
    const mouseForce =
      ((mouseX - window.innerWidth / 2) / window.innerWidth) *
      flake.speed * 8;

    left += flake.drift + mouseForce;

    if (top > window.innerHeight) {
      resetSnowflake(flake);
    } else {
      flake.style.top = top + 'px';
      flake.style.left = left + 'px';
    }
  });

  /* ===============================
     Frosty reacts to snow depth
  ================================ */
  const frontLayer = layers[2];
  const frontFlakes = snowflakes.filter(
    flake => flake.layer === frontLayer
  );

  let activeFrontFlakes = 0;

  frontFlakes.forEach(flake => {
    const top = parseFloat(flake.style.top);
    if (top > 0 && top < window.innerHeight) {
      activeFrontFlakes++;
    }
  });

  const depth = Math.min(
    activeFrontFlakes / frontLayer.count,
    1
  );

  const squash = 1 - depth * 0.04;
  const tilt = depth * 2;
  const sink = depth * 4;

  if (frosty) {
    frosty.style.transform = `
      translateY(${sink}px)
      scaleY(${squash})
      rotate(${tilt}deg)
    `;
  }

  requestAnimationFrame(animateSnow);
}

/* ===============================
   Init
================================ */
layers.forEach(layer => {
  for (let i = 0; i < layer.count; i++) {
    createSnowflake(layer);
  }
});

animateSnow();

/* ===============================
   Frosty Blink Logic
================================ */
function triggerBlink() {
  if (!frosty) return;

  frosty.classList.add('blink');

  setTimeout(() => {
    frosty.classList.remove('blink');
  }, 150);
}

// Random blink every 3–6 seconds
setInterval(() => {
  triggerBlink();
}, Math.random() * 3000 + 3000);
