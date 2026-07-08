const clockEl = document.getElementById("clock");

function updateClock() {
  const now = new Date();
  const formatted = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(now);
  clockEl.textContent = formatted.replace(/\./g, ".");
}

updateClock();
setInterval(updateClock, 1000);

const batteryFill = document.getElementById("batteryFill");
const batteryLabel = document.getElementById("batteryLabel");

function paintBattery(level, charging) {
  const pct = Math.round(level * 100);
  batteryFill.style.width = pct + "%";
  batteryLabel.textContent = pct + "%" + (charging ? " ⚡" : "");
}

if (navigator.getBattery) {
  navigator.getBattery().then((battery) => {
    paintBattery(battery.level, battery.charging);
    battery.addEventListener("levelchange", () => paintBattery(battery.level, battery.charging));
    battery.addEventListener("chargingchange", () => paintBattery(battery.level, battery.charging));
  });
} else {
  paintBattery(1, false);
}

const canvas = document.getElementById("netCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
let nodes = [];
let heroWidth = 0;
let heroHeight = 0;

function resizeCanvas() {
  const hero = canvas.parentElement;
  heroWidth = hero.clientWidth;
  heroHeight = hero.clientHeight;
  canvas.width = heroWidth * devicePixelRatio;
  canvas.height = heroHeight * devicePixelRatio;
  canvas.style.width = heroWidth + "px";
  canvas.style.height = heroHeight + "px";
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}

function makeNodes() {
  const count = Math.max(18, Math.floor((heroWidth * heroHeight) / 22000));
  nodes = Array.from({ length: count }, () => ({
    x: Math.random() * heroWidth,
    y: Math.random() * heroHeight,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: Math.random() * 1.6 + 1
  }));
}

function stepNetwork() {
  ctx.clearRect(0, 0, heroWidth, heroHeight);
  for (const n of nodes) {
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < 0 || n.x > heroWidth) n.vx *= -1;
    if (n.y < 0 || n.y > heroHeight) n.vy *= -1;
  }
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < 130) {
        ctx.strokeStyle = "rgba(120, 160, 255," + (1 - dist / 130) * 0.35 + ")";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }
  for (const n of nodes) {
    ctx.fillStyle = "rgba(159, 191, 255, 0.85)";
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(stepNetwork);
}

if (canvas) {
  window.addEventListener("resize", () => {
    resizeCanvas();
    makeNodes();
  });
  resizeCanvas();
  makeNodes();
  stepNetwork();
}
