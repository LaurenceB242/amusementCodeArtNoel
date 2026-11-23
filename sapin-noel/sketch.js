// ===== RÉGLAGES =====
const AUDIO_FILE = 'last-christmas.mp3';

// ===== VARIABLES =====
let audio;
let audioCtx, analyser, freqData;
let started = false;
let bass = 0;                 // niveau des basses lissé (0 à 1)
let snow = [];
let lights = [];

const TREE_X = 400;
const TREE_Y = 480;           // haut du tronc

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  noStroke();

  audio = new Audio(AUDIO_FILE);

  // Neige
  for (let i = 0; i < 150; i++) {
    snow.push({
      x: random(width),
      y: random(height),
      speed: random(0.5, 2),
      size: random(2, 5),
      drift: random(TWO_PI)
    });
  }

  // Guirlandes : points aléatoires dans chaque étage du sapin
  for (let tier = 0; tier < 4; tier++) {
    let w = 200 - tier * 40;
    let baseY = TREE_Y - tier * 70;
    let topY = baseY - 100;
    for (let k = 0; k < 9; k++) {
      let t = random(0.2, 0.95);
      lights.push({
        x: TREE_X + random(-1, 1) * (w / 2) * t * 0.85,
        y: topY + t * 100,
        col: color(random([
          [255, 60, 60], [255, 220, 80], [80, 160, 255], [255, 120, 220]
        ]))
      });
    }
  }
}

function draw() {
  background(10, 20, 40);
  updateAudioLevel();

  drawSnow();
  drawTree();
  drawLights();
  drawStar(TREE_X, TREE_Y - 4 * 70 + 30, 14 + bass * 14, 6 + bass * 6);
  drawLyrics();

  if (!started) {
    fill(255, 200);
    textSize(20);
    text("Clique pour lancer la musique", width / 2, 40);
  }
}

// ===== AUDIO =====
function mousePressed() {
  if (!started) {
    audio.play();
    setupAnalyser();
    started = true;
  } else if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

function setupAnalyser() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioCtx.createMediaElementSource(audio);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  freqData = new Uint8Array(analyser.frequencyBinCount);
}

function updateAudioLevel() {
  let target = 0;
  if (analyser) {
    analyser.getByteFrequencyData(freqData);
    let sum = 0;
    for (let i = 0; i < 8; i++) sum += freqData[i]; // basses fréquences
    target = sum / 8 / 255;
  }
  bass = lerp(bass, target, 0.2);
}

// Appuie sur "L" pendant que la chanson joue : le temps s'affiche dans la console
// (utile pour noter les timestamps des paroles)
function keyPressed() {
  if (key === 'l' || key === 'L') {
    console.log(audio.currentTime.toFixed(2));
  }
}

// ===== DESSIN =====
function drawTree() {
  fill(90, 60, 30);
  rect(TREE_X - 15, TREE_Y, 30, 50);

  fill(20, 120, 50);
  for (let i = 0; i < 4; i++) {
    let w = 200 - i * 40;
    let y = TREE_Y - i * 70;
    triangle(TREE_X - w / 2, y, TREE_X + w / 2, y, TREE_X, y - 100);
  }
}

function drawLights() {
  for (let i = 0; i < lights.length; i++) {
    let l = lights[i];
    let b = map(sin(frameCount * 0.05 + i), -1, 1, 60, 255);
    b = constrain(b + bass * 150, 0, 255);
    // halo
    fill(red(l.col), green(l.col), blue(l.col), b * 0.3);
    circle(l.x, l.y, 16 + bass * 10);
    // ampoule
    fill(red(l.col), green(l.col), blue(l.col), b);
    circle(l.x, l.y, 7);
  }
}

function drawStar(cx, cy, r1, r2) {
  // halo
  fill(255, 230, 100, 60);
  circle(cx, cy, r1 * 3.5);
  // étoile à 5 branches
  fill(255, 220, 60);
  beginShape();
  for (let i = 0; i < 10; i++) {
    let angle = -HALF_PI + (i * PI) / 5;
    let r = i % 2 === 0 ? r1 : r2;
    vertex(cx + cos(angle) * r, cy + sin(angle) * r);
  }
  endShape(CLOSE);
}

function drawSnow() {
  fill(255, 230);
  for (let f of snow) {
    circle(f.x + sin(frameCount * 0.02 + f.drift) * 10, f.y, f.size);
    f.y += f.speed;
    if (f.y > height) {
      f.y = -5;
      f.x = random(width);
    }
  }
}

// ===== PAROLES =====
function currentLine() {
  let t = audio.currentTime;
  let current = null;
  for (let l of lyrics) {
    if (t >= l.time) current = l;
  }
  return current;
}

function drawLyrics() {
  if (!started) return;
  let l = currentLine();
  if (!l) return;

  let alpha = map(audio.currentTime - l.time, 0, 0.5, 0, 255, true);
  textSize(32);
  fill(0, alpha * 0.6);
  text(l.text, width / 2 + 2, height - 38);   // ombre
  fill(255, 240, 200, alpha);
  text(l.text, width / 2, height - 40);
}