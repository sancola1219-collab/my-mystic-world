// ===== 主選單：原本的冒險遊戲／幻靈塔防／幻靈小畫家＋滑鼠輸入 =====

// ---------- 滑鼠／觸控：換算成遊戲座標，事件排進佇列給最上層圖層取用 ----------
const MOUSE = { x: -1, y: -1, down: false, ev: [] };
(function mouseInit() {
  const pos = e => { const r = canvas.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; };
  const push = (t, e) => { const [x, y] = pos(e); MOUSE.x = x; MOUSE.y = y; MOUSE.ev.push({ t, x, y }); if (MOUSE.ev.length > 400) MOUSE.ev.splice(0, 200); };
  canvas.addEventListener('pointerdown', e => { if (e.button > 0) return; MOUSE.down = true; try { canvas.setPointerCapture(e.pointerId); } catch (er) {} push('down', e); e.preventDefault(); });
  canvas.addEventListener('pointermove', e => push('move', e));
  const up = e => { if (!MOUSE.down) return; MOUSE.down = false; push('up', e); };
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
  canvas.style.touchAction = 'none';
})();
function mouseEvents() { const q = MOUSE.ev; MOUSE.ev = []; return q; }
const inRect = (x, y, r) => x >= r[0] && y >= r[1] && x < r[0] + r[2] && y < r[1] + r[3];

// ---------- 主選單 ----------
const HUB_ITEMS = [
  { n: '幻紋大陸冒險', sub: '原本的遊戲：收服幻靈、挑戰道館、番外篇', col: '#ffd77a', go: () => hubStartRpg() },
  { n: '幻靈塔防', sub: '把幻靈放在路邊，擋住一波波來襲的怪物', col: '#8ae0ff', go: () => tdStart() },
  { n: '幻靈小畫家', sub: '用畫筆和幻靈印章，畫出自己的作品', col: '#ffa0d0', go: () => paintStart() },
];
function hubLayer() {
  let sel = 0; const t0 = performance.now();
  const rects = HUB_ITEMS.map((_, i) => [24 + i * 244, 190, 232, 300]);
  const L = {
    isHub: true,
    update() {
      for (const e of mouseEvents()) {
        const k = rects.findIndex(r => inRect(e.x, e.y, r));
        if (k >= 0 && e.t === 'move' && k !== sel) { sel = k; }
        if (k >= 0 && e.t === 'down') { sel = k; sfx('ok'); popLayer(L); HUB_ITEMS[k].go(); return; }
      }
      if (take('left')) { sel = (sel + HUB_ITEMS.length - 1) % HUB_ITEMS.length; sfx('cursor'); }
      if (take('right')) { sel = (sel + 1) % HUB_ITEMS.length; sfx('cursor'); }
      if (take('ok')) { sfx('ok'); popLayer(L); HUB_ITEMS[sel].go(); }
    },
    draw() {
      const t = (performance.now() - t0) / 1000;
      const g = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, 600); g.addColorStop(0, '#2a1a3a'); g.addColorStop(1, '#05030a');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 90; i++) { ctx.globalAlpha = 0.3 + 0.5 * Math.abs(Math.sin(t + i)); ctx.fillStyle = '#ffe8a0'; ctx.fillRect((i * 173) % W, (i * 97) % H, 2, 2); }
      ctx.globalAlpha = 1;
      ctx.save(); ctx.shadowColor = '#ffb040'; ctx.shadowBlur = 24;
      text('我的神奇世界', W / 2, 40, { size: 60, bold: true, serif: true, align: 'center', color: '#ffd77a' });
      ctx.restore();
      text('～ 選一個想玩的吧 ～', W / 2, 122, { size: 22, align: 'center', serif: true, color: '#e8c890' });
      HUB_ITEMS.forEach((it, i) => {
        const r = rects[i], on = i === sel, lift = on ? -8 - Math.sin(t * 4) * 2 : 0;
        ctx.save(); ctx.translate(0, lift);
        if (on) { ctx.shadowColor = it.col; ctx.shadowBlur = 26; }
        panel(r[0], r[1], r[2], r[3], { border: on ? it.col : '#6a5a40', bg: on ? 'rgba(30,22,48,0.96)' : 'rgba(14,10,22,0.9)' });
        ctx.shadowBlur = 0;
        const cx = r[0] + r[2] / 2, cy = r[1] + 110;
        ctx.save(); ctx.beginPath(); ctx.roundRect(r[0] + 10, r[1] + 10, r[2] - 20, 190, 8); ctx.clip();
        if (i === 0) {
          const gg = ctx.createLinearGradient(0, r[1], 0, r[1] + 200); gg.addColorStop(0, '#6ab0f0'); gg.addColorStop(1, '#8ac868'); ctx.fillStyle = gg; ctx.fillRect(r[0], r[1], r[2], 200);
          drawMon(ctx, 8, cx, cy + 14, 120, t); drawMon(ctx, 14, cx - 70, cy + 44, 60, t); drawMon(ctx, 1, cx + 70, cy + 44, 60, t);
        } else if (i === 1) {
          ctx.fillStyle = '#6aa850'; ctx.fillRect(r[0], r[1], r[2], 200);
          ctx.strokeStyle = '#e0c890'; ctx.lineWidth = 30; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(r[0] - 10, cy + 50); ctx.lineTo(cx - 30, cy + 50); ctx.lineTo(cx - 30, cy - 40); ctx.lineTo(cx + 50, cy - 40); ctx.lineTo(cx + 50, cy + 30); ctx.lineTo(r[0] + r[2] + 10, cy + 30); ctx.stroke();
          const p = (t * 0.25) % 1; drawMon(ctx, 6, r[0] + p * 80, cy + 46, 44, t); drawMon(ctx, 12, cx - 30, cy + 40 - ((t * 20) % 80), 44, t);
          drawMon(ctx, 15, cx + 8, cy + 6, 58, t); drawMon(ctx, 5, cx - 78, cy - 20, 54, t);
          ctx.strokeStyle = '#ffe080'; ctx.lineWidth = 2; ctx.globalAlpha = 0.5 + Math.sin(t * 10) * 0.4; ctx.beginPath(); ctx.moveTo(cx + 8, cy); ctx.lineTo(cx - 30, cy + 40 - ((t * 20) % 80)); ctx.stroke(); ctx.globalAlpha = 1;
        } else {
          ctx.fillStyle = '#fffaf0'; ctx.fillRect(r[0], r[1], r[2], 200);
          const cols = ['#f04040', '#f0a030', '#f0e040', '#50c050', '#40a0f0', '#a060e0'];
          cols.forEach((cc, k) => { ctx.strokeStyle = cc; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(cx, cy + 90, 96 - k * 11, Math.PI * 1.12, Math.PI * (1.12 + 0.76 * Math.min(1, (t * 0.6) % 2))); ctx.stroke(); });
          drawMon(ctx, 19, cx - 50, cy + 40, 64, t); drawMon(ctx, 3, cx + 54, cy + 46, 60, t);
          ctx.save(); ctx.translate(cx + 20 + Math.sin(t * 2) * 30, cy - 30 + Math.cos(t * 3) * 10); ctx.rotate(-0.6); ctx.fillStyle = '#c8a060'; ctx.fillRect(-3, -4, 6, 40); ctx.fillStyle = '#f04080'; ctx.beginPath(); ctx.moveTo(-5, 36); ctx.lineTo(0, 54); ctx.lineTo(5, 36); ctx.fill(); ctx.restore();
        }
        ctx.restore();
        text(it.n, cx, r[1] + 212, { size: 25, bold: true, align: 'center', color: on ? it.col : '#f4ead0' });
        wrapText(it.sub, r[2] - 36, 15).forEach((ln, k) => text(ln, cx, r[1] + 250 + k * 20, { size: 15, align: 'center', color: '#c8bca0' }));
        ctx.restore();
      });
      text('← → 選擇　Z 確定　也可以用滑鼠點', W / 2, H - 46, { size: 17, align: 'center', color: '#a09080' });
    },
  };
  return L;
}
function hubOpen() { layers.length = 0; fade = 0; pushLayer(hubLayer()); try { playMusic('title'); } catch (e) {} }
function hubStartRpg() { layers.length = 0; titleScreen(); }
// 開機時 main.js 已經開了標題畫面：換成主選單
hubOpen();

// ---------- 選單也能用滑鼠點、滾輪捲動 ----------
window.addEventListener('wheel', e => { const tl = topLayer(); if (tl && tl.isMenu) pressed.push(e.deltaY > 0 ? 'down' : 'up'); }, { passive: true });
choose = function (items, opt = {}) {
  return new Promise(res => {
    let sel = opt.start || 0;
    const cols = opt.cols || 1, rowH = opt.rowH || 40;
    const rows = Math.min(Math.ceil(items.length / cols), opt.maxRows || 99);
    let scroll = 0;
    const w = opt.w || 260, h = (opt.title ? 44 : 16) + rows * rowH + 14 + (opt.desc ? 70 : 0);
    const x = opt.x == null ? W - w - 20 : opt.x;
    const y = opt.y == null ? H - h - 170 : opt.y;
    const colW = (w - 30) / cols, top = y + (opt.title ? 44 : 16);
    const hit = (mx, my) => { if (mx < x + 15 || mx >= x + 15 + colW * cols || my < top || my >= top + rows * rowH) return -1; const k = (Math.floor((my - top) / rowH) + scroll) * cols + Math.floor((mx - x - 15) / colW); return k < items.length ? k : -1; };
    MOUSE.ev = []; // 開選單之前的舊點擊不算
    const pick = () => { if (opt.disabled && opt.disabled(sel)) return false; sfx('select'); popLayer(L); res(sel); return true; };
    const L = pushLayer({
      ui: true, isMenu: true,
      update() {
        const n = items.length;
        const before = sel;
        for (const e of mouseEvents()) {
          const k = hit(e.x, e.y);
          if (e.t === 'move' && k >= 0) sel = k;
          if (e.t === 'down') {
            if (k >= 0) { sel = k; if (pick()) return; }
            else if (!inRect(e.x, e.y, [x, y, w, h]) && opt.cancel !== false) { sfx('cursor'); popLayer(L); res(-1); return; }
          }
        }
        if (take('up')) sel = (sel - cols + n) % n;
        if (take('down')) sel = (sel + cols) % n;
        if (cols > 1 && take('left')) sel = (sel - 1 + n) % n;
        if (cols > 1 && take('right')) sel = (sel + 1) % n;
        if (sel !== before) sfx('cursor');
        if (take('ok')) { if (pick()) return; }
        else if (take('back') && opt.cancel !== false) { sfx('cursor'); popLayer(L); res(-1); }
        if (opt.onMove) opt.onMove(sel);
      },
      draw() {
        panel(x, y, w, h);
        if (opt.title) text(opt.title, x + 20, y + 12, { size: 20, color: '#ffd77a', bold: true });
        const selRow = Math.floor(sel / cols);
        if (selRow < scroll) scroll = selRow;
        if (selRow >= scroll + rows) scroll = selRow - rows + 1;
        items.forEach((it, k) => {
          const r = Math.floor(k / cols) - scroll;
          if (r < 0 || r >= rows) return;
          const cx = x + 15 + (k % cols) * colW, cy = top + r * rowH;
          if (k === sel) { ctx.fillStyle = 'rgba(200,160,80,0.25)'; ctx.beginPath(); ctx.roundRect(cx, cy, colW - 6, rowH - 4, 6); ctx.fill(); text('▶', cx + 4, cy + 7, { size: 18, color: '#ffd77a' }); }
          const dis = opt.disabled && opt.disabled(k);
          if (typeof it === 'function') it(cx + 26, cy, k === sel);
          else text(it, cx + 28, cy + 6, { size: 21, color: dis ? '#776e66' : '#f4ead0' });
        });
        if (Math.ceil(items.length / cols) > rows) { if (scroll > 0) text('▲', x + w - 26, top - 2, { size: 14, color: '#ffd77a' }); if (scroll + rows < Math.ceil(items.length / cols)) text('▼', x + w - 26, top + rows * rowH - 16, { size: 14, color: '#ffd77a' }); }
        if (opt.desc) {
          const d = opt.desc(sel) || '';
          wrapText(d, w - 40, 17).slice(0, 3).forEach((ln, k) => text(ln, x + 20, y + h - 70 + k * 22, { size: 17, color: '#c8bca0' }));
        }
      },
    });
  });
};
