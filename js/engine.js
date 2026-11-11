// ===== 引擎：畫布、輸入、圖層、對話框、選單、補間動畫 =====

const TILE = 48, VW = 16, VH = 12, W = TILE * VW, H = TILE * VH;
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
// 依螢幕大小提高內部解析度，畫面才不會糊
const SS = Math.min(2, Math.max(1, Math.ceil(Math.min(window.innerWidth / W, window.innerHeight / H) * (window.devicePixelRatio || 1) * 2) / 2));
canvas.width = W * SS; canvas.height = H * SS;
ctx.scale(SS, SS);
const FONT = '"Microsoft JhengHei","PingFang TC","Noto Sans TC",sans-serif';
const SERIF = '"Noto Serif TC","PMingLiU","MingLiU",serif';

function fitCanvas() {
  const s = Math.min(window.innerWidth / W, window.innerHeight / H);
  canvas.style.width = Math.floor(W * s) + 'px';
  canvas.style.height = Math.floor(H * s) + 'px';
}
window.addEventListener('resize', fitCanvas); fitCanvas();

// ---- 輸入 ----
const KEYMAP = {
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
  w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right',
  z: 'ok', Z: 'ok', Enter: 'ok', ' ': 'ok',
  x: 'back', X: 'back', Escape: 'back', Backspace: 'back',
  h: 'hint', H: 'hint',
  Shift: 'run',
};
const held = {};
let pressed = [];
window.addEventListener('keydown', e => {
  const k = KEYMAP[e.key];
  if (!k) return;
  e.preventDefault();
  if (!held[k] || (e.repeat && (k === 'up' || k === 'down' || k === 'left' || k === 'right'))) pressed.push(k);
  held[k] = true;
});
window.addEventListener('keyup', e => { const k = KEYMAP[e.key]; if (k) held[k] = false; });
window.addEventListener('blur', () => { for (const k in held) held[k] = false; });
function take(k) { const i = pressed.indexOf(k); if (i >= 0) { pressed.splice(i, 1); return true; } return false; }

// 觸控按鈕（手機 / 平板）
(function touchPad() {
  if (!('ontouchstart' in window)) return;
  const pad = document.getElementById('pad');
  pad.style.display = 'block';
  pad.querySelectorAll('[data-k]').forEach(b => {
    const k = b.dataset.k;
    b.addEventListener('touchstart', e => { e.preventDefault(); if (!held[k]) pressed.push(k); held[k] = true; });
    b.addEventListener('touchend', e => { e.preventDefault(); held[k] = false; });
  });
})();

// ---- 補間動畫 ----
const tweens = [];
function tween(ms, fn) {
  return new Promise(res => tweens.push({ t0: performance.now(), ms, fn, res }));
}
function wait(ms) { return tween(ms, () => {}); }
function updateTweens(now) {
  for (let i = tweens.length - 1; i >= 0; i--) {
    const tw = tweens[i], p = Math.min(1, (now - tw.t0) / tw.ms);
    tw.fn(p);
    if (p >= 1) { tweens.splice(i, 1); tw.res(); }
  }
}

// ---- 圖層 ----
const layers = [];
function pushLayer(l) { layers.push(l); return l; }
function popLayer(l) { const i = layers.indexOf(l); if (i >= 0) layers.splice(i, 1); }
function topLayer() { return layers[layers.length - 1]; }

// ---- 繪圖小工具 ----
function panel(x, y, w, h, opt = {}) {
  ctx.save();
  ctx.fillStyle = opt.bg || 'rgba(14,10,22,0.94)';
  ctx.strokeStyle = opt.border || '#c8a050';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, 10); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = 'rgba(200,160,80,0.35)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(x + 5, y + 5, w - 10, h - 10, 7); ctx.stroke();
  ctx.restore();
}
function text(s, x, y, opt = {}) {
  ctx.save();
  ctx.font = `${opt.bold ? 'bold ' : ''}${opt.size || 22}px ${opt.serif ? SERIF : FONT}`;
  ctx.fillStyle = opt.color || '#f4ead0';
  ctx.textAlign = opt.align || 'left';
  ctx.textBaseline = opt.base || 'top';
  if (opt.shadow !== false) { ctx.shadowColor = 'rgba(0,0,0,0.7)'; ctx.shadowOffsetY = 2; ctx.shadowBlur = 2; }
  ctx.fillText(s, x, y);
  ctx.restore();
}
function wrapText(s, maxW, size) {
  ctx.save(); ctx.font = `${size}px ${FONT}`;
  const out = [];
  for (const para of String(s).split('\n')) {
    let line = '';
    for (const ch of para) {
      if (ctx.measureText(line + ch).width > maxW) { out.push(line); line = ch; } else line += ch;
    }
    out.push(line);
  }
  ctx.restore();
  return out;
}
function typeBadge(t, x, y, w = 52) {
  ctx.save();
  ctx.fillStyle = TYPES[t].c; ctx.globalAlpha = 0.9;
  ctx.beginPath(); ctx.roundRect(x, y, w, 24, 12); ctx.fill();
  ctx.restore();
  text(t, x + w / 2, y + 2, { size: 17, bold: true, align: 'center', color: '#1a1020', shadow: false });
}
function hpBar(x, y, w, hp, max) {
  const p = Math.max(0, hp / max);
  ctx.fillStyle = '#2a2030'; ctx.beginPath(); ctx.roundRect(x, y, w, 10, 5); ctx.fill();
  ctx.fillStyle = p > 0.5 ? '#5ad060' : p > 0.2 ? '#f0c030' : '#f04a3a';
  ctx.beginPath(); ctx.roundRect(x, y, Math.max(0, w * p), 10, 5); ctx.fill();
}

// ---- 對話框 ----
// say('文字') 或 say(['第一頁','第二頁'], { name:'說話者', auto: 毫秒 })
function say(pages, opt = {}) {
  if (!Array.isArray(pages)) pages = [pages];
  return new Promise(res => {
    let i = 0, shown = 0, t0 = performance.now();
    const L = pushLayer({
      ui: true,
      update() {
        const full = pages[i].length;
        if (shown < full) {
          shown = Math.min(full, shown + 1.4);
          if (take('ok') || take('back')) shown = full;
          t0 = performance.now();
          return;
        }
        const autoDone = opt.auto && performance.now() - t0 > opt.auto;
        if (take('ok') || take('back') || autoDone) {
          i++; shown = 0; t0 = performance.now();
          if (i >= pages.length) { popLayer(L); res(); }
        }
      },
      draw() {
        if (i >= pages.length) return;
        const y = H - 150;
        panel(16, y, W - 32, 134);
        if (opt.name) { panel(30, y - 40, Math.max(120, opt.name.length * 24 + 40), 44, { bg: 'rgba(40,24,40,0.97)' }); text(opt.name, 50, y - 30, { size: 21, bold: true, color: '#ffd77a' }); }
        const lines = wrapText(pages[i].slice(0, Math.floor(shown)), W - 100, 24);
        lines.slice(0, 3).forEach((ln, k) => text(ln, 46, y + 22 + k * 34, { size: 24 }));
        if (shown >= pages[i].length && !opt.auto && Math.floor(performance.now() / 300) % 2) {
          ctx.fillStyle = '#ffd77a'; ctx.beginPath(); ctx.moveTo(W - 60, y + 106); ctx.lineTo(W - 48, y + 106); ctx.lineTo(W - 54, y + 114); ctx.fill();
        }
      },
    });
  });
}

// ---- 選單 ----
// opts: { x, y, w, title, cancel:true, cols, desc:(i)=>文字, disabled:(i)=>bool, keepOpen }
function choose(items, opt = {}) {
  return new Promise(res => {
    let sel = opt.start || 0;
    const cols = opt.cols || 1, rowH = opt.rowH || 40;
    const rows = Math.min(Math.ceil(items.length / cols), opt.maxRows || 99);
    let scroll = 0;
    const w = opt.w || 260, h = (opt.title ? 44 : 16) + rows * rowH + 14 + (opt.desc ? 70 : 0);
    const x = opt.x == null ? W - w - 20 : opt.x;
    const y = opt.y == null ? H - h - 170 : opt.y;
    const L = pushLayer({
      ui: true,
      update() {
        const n = items.length;
        const before = sel;
        if (take('up')) sel = (sel - cols + n) % n;
        if (take('down')) sel = (sel + cols) % n;
        if (cols > 1 && take('left')) sel = (sel - 1 + n) % n;
        if (cols > 1 && take('right')) sel = (sel + 1) % n;
        if (sel !== before) sfx('cursor');
        if (take('ok')) { if (opt.disabled && opt.disabled(sel)) return; sfx('select'); popLayer(L); res(sel); }
        else if (take('back') && opt.cancel !== false) { sfx('cursor'); popLayer(L); res(-1); }
        if (opt.onMove) opt.onMove(sel);
      },
      draw() {
        panel(x, y, w, h);
        if (opt.title) text(opt.title, x + 20, y + 12, { size: 20, color: '#ffd77a', bold: true });
        const colW = (w - 30) / cols, selRow = Math.floor(sel / cols);
        if (selRow < scroll) scroll = selRow;
        if (selRow >= scroll + rows) scroll = selRow - rows + 1;
        items.forEach((it, k) => {
          const r = Math.floor(k / cols) - scroll;
          if (r < 0 || r >= rows) return;
          const cx = x + 15 + (k % cols) * colW, cy = y + (opt.title ? 44 : 16) + r * rowH;
          if (k === sel) { ctx.fillStyle = 'rgba(200,160,80,0.25)'; ctx.beginPath(); ctx.roundRect(cx, cy, colW - 6, rowH - 4, 6); ctx.fill(); text('▶', cx + 4, cy + 7, { size: 18, color: '#ffd77a' }); }
          const dis = opt.disabled && opt.disabled(k);
          if (typeof it === 'function') it(cx + 26, cy, k === sel);
          else text(it, cx + 28, cy + 6, { size: 21, color: dis ? '#776e66' : '#f4ead0' });
        });
        if (opt.desc) {
          const d = opt.desc(sel) || '';
          wrapText(d, w - 40, 17).slice(0, 3).forEach((ln, k) => text(ln, x + 20, y + h - 70 + k * 22, { size: 17, color: '#c8bca0' }));
        }
      },
    });
  });
}

// ---- 畫面轉場 ----
let fade = 0; // 0~1 黑幕
async function fadeOut(ms = 300) { await tween(ms, p => fade = p); }
async function fadeIn(ms = 300) { await tween(ms, p => fade = 1 - p); }
async function flashEncounter() {
  for (let i = 0; i < 3; i++) { await tween(90, p => fade = p * 0.8); await tween(90, p => fade = 0.8 - p * 0.8); }
  await tween(250, p => fade = p);
}

// ---- 浮動提示 ----
let toast = null;
function showToast(s) { toast = { s, t: performance.now() }; }
function drawToast() {
  if (!toast) return;
  const age = performance.now() - toast.t;
  if (age > 2200) { toast = null; return; }
  ctx.save(); ctx.globalAlpha = Math.min(1, (2200 - age) / 300);
  ctx.font = `20px ${FONT}`; const w = ctx.measureText(toast.s).width + 50;
  panel(W / 2 - w / 2, 18, w, 46);
  text(toast.s, W / 2, 30, { size: 20, align: 'center', color: '#ffe8a0' });
  ctx.restore();
}
