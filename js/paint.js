// ===== 幻靈小畫家：畫筆、特殊筆刷、形狀、文字、油漆桶、幻靈印章、對稱、透明度、特效、遊戲場景畫板 =====

const PAINT_KEY = 'my_mystic_world_paint';
const PX = 8, PY = 46, PW = 600, PH = 450, PS = 2; // 畫布在畫面上的位置；內部解析度 ×2
const PAINT_COLORS = ['#000000', '#5a5a5a', '#a0a0a0', '#ffffff', '#7a3a1a', '#c8843c', '#f6d2ae', '#ffb0c8', '#e02020', '#ff7a20', '#ffd020', '#fff48a', '#2a8a2a', '#5ad060', '#a8f080', '#1a6a6a', '#2060d0', '#50a0ff', '#a0e0ff', '#3a2a8a', '#8040c0', '#d070e0', '#ff60a0'];
const PAINT_TOOLS = [
  ['brush', '畫筆'], ['eraser', '橡皮擦'], ['rainbow', '彩虹筆'], ['glitter', '亮粉筆'], ['spray', '噴槍'], ['calli', '毛筆'],
  ['fill', '油漆桶'], ['pick', '吸色'], ['line', '直線'], ['rect', '方形'], ['circle', '圓形'], ['tri', '三角形'],
  ['star', '星星'], ['heart', '愛心'], ['text', '文字'], ['stamp', '印章'],
];
const PAINT_SIZES = [2, 5, 10, 18, 32];
const PAINT_ALPHA = [1, 0.6, 0.3];
const PAINT_BOARDS = [['white', '白紙'], ['grid', '方格紙'], ['black', '黑板'], ['green', '草原'], ['warm', '夕陽小鎮'], ['night', '星空'], ['ice', '雪原'], ['lava', '熔岩'], ['sky', '天空聖域'], ['abyss', '深淵'], ['swamp', '霧澤'], ['mountain', '高山'], ['toy', '玩具箱'], ['temple', '古殿'], ['huaguo', '花果山'], ['tiangong', '天宮'], ['ninja', '忍者之里'], ['kinder', '幼稚園'], ['starorb', '武道會'], ['xiyou', '取經之路']];
const PAINT_FX = ['左右翻轉', '上下翻轉', '黑白', '懷舊', '反相', '模糊', '加亮', '變暗', '馬賽克', '畫框（金色）'];
function paintLoad() { try { return JSON.parse(localStorage.getItem(PAINT_KEY)) || { slots: [null, null, null, null] }; } catch (e) { return { slots: [null, null, null, null] }; } }

function paintStart() {
  layers.length = 0;
  try { playMusic('town'); } catch (e) {}
  pushLayer(paintLayer());
}
// 自訂顏色：用瀏覽器內建的取色器
const PAINT_COLOR_INPUT = (() => { const i = document.createElement('input'); i.type = 'color'; i.value = '#ff8040'; i.style.cssText = 'position:fixed;left:-100px;top:0;opacity:0;width:1px;height:1px'; document.body.appendChild(i); return i; })();

function paintLayer() {
  const mk = () => { const cv = document.createElement('canvas'); cv.width = PW * PS; cv.height = PH * PS; return cv; };
  const bgcv = mk(), pcv = mk(), bg = bgcv.getContext('2d'), pc = pcv.getContext('2d', { willReadFrequently: true });
  bg.fillStyle = '#ffffff'; bg.fillRect(0, 0, bgcv.width, bgcv.height);
  const stampIds = Object.keys(MONS).map(Number).filter(id => SPRITES[id]).sort((a, b) => a - b);
  const P = { tool: 'brush', col: '#000000', custom: '#ff8040', size: 1, alpha: 0, fillShape: false, mirror: false, stamp: 8, stampSize: 1, flip: false, rot: 0,
    undo: [], redo: [], drag: null, wantBg: null, board: 'white', pickOpen: false, page: 0, busy: false, note: null, hover: null, hue: 0, text: '你好！', font: 1 };
  const snap = () => { P.undo.push({ p: pc.getImageData(0, 0, pcv.width, pcv.height), b: bg.getImageData(0, 0, bgcv.width, bgcv.height) }); if (P.undo.length > 15) P.undo.shift(); P.redo = []; };
  const cur = () => ({ p: pc.getImageData(0, 0, pcv.width, pcv.height), b: bg.getImageData(0, 0, bgcv.width, bgcv.height) });
  const restore = s => { pc.putImageData(s.p, 0, 0); bg.putImageData(s.b, 0, 0); };
  const toP = (x, y) => [(x - PX) * PS, (y - PY) * PS];
  const inCanvas = (x, y) => x >= PX && y >= PY && x < PX + PW && y < PY + PH;
  const say2 = s => { P.note = { s, t: 1.8 }; };
  const mx = x => pcv.width - x; // 對稱
  const both = (fn, x0, y0, x1, y1) => { fn(x0, y0, x1, y1, false); if (P.mirror) fn(mx(x0), y0, x1 == null ? null : mx(x1), y1, true); };
  const ink = () => PAINT_ALPHA[P.alpha];
  function stroke(x0, y0, x1, y1) {
    const w = PAINT_SIZES[P.size] * PS;
    pc.save(); pc.lineCap = 'round'; pc.lineJoin = 'round'; pc.globalAlpha = ink();
    if (P.tool === 'eraser') { pc.globalCompositeOperation = 'destination-out'; pc.globalAlpha = 1; pc.lineWidth = w * 1.6; pc.strokeStyle = '#000'; }
    else if (P.tool === 'rainbow') { P.hue = (P.hue + Math.hypot(x1 - x0, y1 - y0) * 0.6) % 360; pc.strokeStyle = `hsl(${P.hue},90%,55%)`; pc.lineWidth = w; }
    else if (P.tool === 'calli') { const sp = Math.hypot(x1 - x0, y1 - y0); pc.lineWidth = Math.max(PS, w * 1.4 - sp * 0.35); pc.strokeStyle = P.col; }
    else { pc.strokeStyle = P.col; pc.lineWidth = w; }
    pc.beginPath(); pc.moveTo(x0, y0); pc.lineTo(x1, y1); pc.stroke(); pc.restore();
  }
  function spray(x, y) {
    const r = PAINT_SIZES[P.size] * PS * 1.8; pc.save(); pc.globalAlpha = ink(); pc.fillStyle = P.col;
    for (let i = 0; i < 26; i++) { const a = Math.random() * 6.283, d = Math.sqrt(Math.random()) * r; pc.fillRect(x + Math.cos(a) * d, y + Math.sin(a) * d, PS, PS); }
    pc.restore();
  }
  function glitter(x, y) {
    const r = PAINT_SIZES[P.size] * PS * 1.6 + 6; pc.save(); pc.globalAlpha = ink();
    for (let i = 0; i < 3; i++) {
      const a = Math.random() * 6.283, d = Math.random() * r, px = x + Math.cos(a) * d, py = y + Math.sin(a) * d, s = (2 + Math.random() * 4) * PS;
      pc.fillStyle = Math.random() < 0.35 ? '#ffffff' : `hsl(${Math.random() * 360},90%,65%)`;
      pc.beginPath(); for (let k = 0; k < 8; k++) { const rr = k % 2 ? s * 0.3 : s, aa = k * Math.PI / 4; pc.lineTo(px + Math.cos(aa) * rr, py + Math.sin(aa) * rr); } pc.closePath(); pc.fill();
    }
    pc.restore();
  }
  function shapePath(c, kind, x0, y0, x1, y1) {
    const l = Math.min(x0, x1), t = Math.min(y0, y1), w = Math.abs(x1 - x0), h = Math.abs(y1 - y0), cx = l + w / 2, cy = t + h / 2;
    c.beginPath();
    if (kind === 'line') { c.moveTo(x0, y0); c.lineTo(x1, y1); }
    if (kind === 'rect') c.rect(l, t, w, h);
    if (kind === 'circle') c.ellipse(cx, cy, w / 2, h / 2, 0, 0, 7);
    if (kind === 'tri') { c.moveTo(cx, t); c.lineTo(l + w, t + h); c.lineTo(l, t + h); c.closePath(); }
    if (kind === 'star') { for (let k = 0; k < 10; k++) { const r = k % 2 ? 0.42 : 1, a = -Math.PI / 2 + k * Math.PI / 5; c.lineTo(cx + Math.cos(a) * w / 2 * r, cy + Math.sin(a) * h / 2 * r); } c.closePath(); }
    if (kind === 'heart') { c.moveTo(cx, t + h * 0.3); c.bezierCurveTo(cx, t, l, t, l, t + h * 0.32); c.bezierCurveTo(l, t + h * 0.62, cx, t + h * 0.8, cx, t + h); c.bezierCurveTo(cx, t + h * 0.8, l + w, t + h * 0.62, l + w, t + h * 0.32); c.bezierCurveTo(l + w, t, cx, t, cx, t + h * 0.3); c.closePath(); }
  }
  function shape(c, kind, x0, y0, x1, y1, k) {
    c.save(); c.globalAlpha = ink(); c.strokeStyle = P.col; c.fillStyle = P.col; c.lineWidth = PAINT_SIZES[P.size] * k; c.lineCap = 'round'; c.lineJoin = 'round';
    shapePath(c, kind, x0, y0, x1, y1);
    if (P.fillShape && kind !== 'line') c.fill(); else c.stroke();
    c.restore();
  }
  function flood(x, y) {
    x = Math.floor(x); y = Math.floor(y);
    const w = pcv.width, h = pcv.height, img = pc.getImageData(0, 0, w, h), d = img.data;
    const n = parseInt(P.col.slice(1), 16), fr = n >> 16, fg = (n >> 8) & 255, fb = n & 255;
    const i0 = (y * w + x) * 4, tr = d[i0], tg = d[i0 + 1], tb = d[i0 + 2], ta = d[i0 + 3];
    if (ta === 255 && tr === fr && tg === fg && tb === fb) return;
    const same = i => Math.abs(d[i + 3] - ta) < 60 && (ta < 60 || (Math.abs(d[i] - tr) < 50 && Math.abs(d[i + 1] - tg) < 50 && Math.abs(d[i + 2] - tb) < 50));
    const st = [x, y], seen = new Uint8Array(w * h);
    while (st.length) {
      const cy = st.pop(), cx0 = st.pop(); let cx = cx0;
      while (cx >= 0 && !seen[cy * w + cx] && same((cy * w + cx) * 4)) cx--;
      cx++; let up = false, dn = false;
      while (cx < w && !seen[cy * w + cx] && same((cy * w + cx) * 4)) {
        const i = (cy * w + cx) * 4; d[i] = fr; d[i + 1] = fg; d[i + 2] = fb; d[i + 3] = 255; seen[cy * w + cx] = 1;
        if (cy > 0) { const ok = !seen[(cy - 1) * w + cx] && same(((cy - 1) * w + cx) * 4); if (ok && !up) { st.push(cx, cy - 1); up = true; } else if (!ok) up = false; }
        if (cy < h - 1) { const ok = !seen[(cy + 1) * w + cx] && same(((cy + 1) * w + cx) * 4); if (ok && !dn) { st.push(cx, cy + 1); dn = true; } else if (!ok) dn = false; }
        cx++;
      }
    }
    pc.putImageData(img, 0, 0);
  }
  function pickColor(x, y) {
    const tmp = document.createElement('canvas'); tmp.width = tmp.height = 1; const q = tmp.getContext('2d');
    q.drawImage(bgcv, -Math.floor(x), -Math.floor(y)); q.drawImage(pcv, -Math.floor(x), -Math.floor(y));
    const d = q.getImageData(0, 0, 1, 1).data; P.col = '#' + [d[0], d[1], d[2]].map(v => v.toString(16).padStart(2, '0')).join('');
  }
  const stampPx = () => [70, 120, 190][P.stampSize];
  function stampAt(x, y, mirrored) {
    pc.save(); pc.globalAlpha = ink(); pc.translate(x, y); pc.rotate(P.rot * Math.PI / 4 * (mirrored ? -1 : 1)); pc.scale(PS * stampPx() / 76, PS * stampPx() / 76);
    drawMon(pc, P.stamp, 0, 0, 76, 1.2, { still: !(P.flip ^ mirrored), flip: !!(P.flip ^ mirrored) });
    pc.restore();
  }
  function textAt(x, y, mirrored) {
    const fs = [20, 34, 56][P.font] * PS;
    pc.save(); pc.globalAlpha = ink(); pc.font = `bold ${fs}px ${FONT}`; pc.textAlign = 'center'; pc.textBaseline = 'middle';
    pc.lineWidth = fs / 8; pc.strokeStyle = P.col === '#ffffff' ? '#000000' : '#ffffff'; pc.lineJoin = 'round';
    pc.strokeText(P.text, x, y); pc.fillStyle = P.col; pc.fillText(P.text, x, y); pc.restore();
  }
  function composite(scale) { const cv = document.createElement('canvas'); cv.width = PW * scale; cv.height = PH * scale; const q = cv.getContext('2d'); q.drawImage(bgcv, 0, 0, cv.width, cv.height); q.drawImage(pcv, 0, 0, cv.width, cv.height); return cv; }
  function applyFx(k) {
    snap();
    const w = pcv.width, h = pcv.height;
    // 把背景也合進畫作，特效才會套用到整張圖
    const all = composite(PS); bg.fillStyle = '#ffffff'; bg.fillRect(0, 0, w, h); pc.clearRect(0, 0, w, h);
    if (k === 0 || k === 1) { pc.save(); if (k === 0) { pc.translate(w, 0); pc.scale(-1, 1); } else { pc.translate(0, h); pc.scale(1, -1); } pc.drawImage(all, 0, 0); pc.restore(); return; }
    if (k === 5) { pc.filter = 'blur(4px)'; pc.drawImage(all, 0, 0); pc.filter = 'none'; return; }
    if (k === 8) { const s = 12 * PS, t2 = document.createElement('canvas'); t2.width = Math.ceil(w / s); t2.height = Math.ceil(h / s); const q = t2.getContext('2d'); q.drawImage(all, 0, 0, t2.width, t2.height); pc.imageSmoothingEnabled = false; pc.drawImage(t2, 0, 0, w, h); pc.imageSmoothingEnabled = true; return; }
    pc.drawImage(all, 0, 0);
    if (k === 9) { pc.save(); const g = pc.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#fff0a0'); g.addColorStop(0.5, '#c8901c'); g.addColorStop(1, '#ffe080'); pc.strokeStyle = g; pc.lineWidth = 34; pc.strokeRect(17, 17, w - 34, h - 34); pc.strokeStyle = '#6a4010'; pc.lineWidth = 4; pc.strokeRect(34, 34, w - 68, h - 68); pc.strokeRect(2, 2, w - 4, h - 4); pc.restore(); return; }
    const img = pc.getImageData(0, 0, w, h), d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i + 1], b = d[i + 2], l = r * 0.3 + g * 0.59 + b * 0.11;
      if (k === 2) d[i] = d[i + 1] = d[i + 2] = l;
      if (k === 3) { d[i] = Math.min(255, l * 1.07 + 30); d[i + 1] = Math.min(255, l * 0.92 + 14); d[i + 2] = l * 0.72; }
      if (k === 4) { d[i] = 255 - r; d[i + 1] = 255 - g; d[i + 2] = 255 - b; }
      if (k === 6) { d[i] = Math.min(255, r * 1.18 + 16); d[i + 1] = Math.min(255, g * 1.18 + 16); d[i + 2] = Math.min(255, b * 1.18 + 16); }
      if (k === 7) { d[i] = r * 0.75; d[i + 1] = g * 0.75; d[i + 2] = b * 0.75; }
    }
    pc.putImageData(img, 0, 0);
  }
  function drawBoard(k) {
    const w = bgcv.width, h = bgcv.height;
    if (k === 'white') { bg.fillStyle = '#ffffff'; bg.fillRect(0, 0, w, h); return; }
    if (k === 'black') { bg.fillStyle = '#1e3a2a'; bg.fillRect(0, 0, w, h); bg.strokeStyle = '#8a5a2a'; bg.lineWidth = 24; bg.strokeRect(0, 0, w, h); return; }
    if (k === 'grid') { bg.fillStyle = '#ffffff'; bg.fillRect(0, 0, w, h); bg.strokeStyle = '#c8dcf0'; bg.lineWidth = 2; for (let x = 0; x < w; x += 40) { bg.beginPath(); bg.moveTo(x, 0); bg.lineTo(x, h); bg.stroke(); } for (let y = 0; y < h; y += 40) { bg.beginPath(); bg.moveTo(0, y); bg.lineTo(w, y); bg.stroke(); } return; }
    P.wantBg = k;
  }
  async function menu(kind) {
    P.busy = true;
    if (kind === 'board') {
      const c = await choose(PAINT_BOARDS.map(b => b[1]), { title: '選擇畫板（背景）', w: 300, x: W / 2 - 150, y: 40, rowH: 34, maxRows: 12 });
      if (c >= 0) { snap(); P.board = PAINT_BOARDS[c][0]; drawBoard(P.board); }
    }
    if (kind === 'fx') { const c = await choose(PAINT_FX, { title: '特效（整張圖）', w: 280, x: W / 2 - 140, y: 60, rowH: 36 }); if (c >= 0) { applyFx(c); say2(`套用了「${PAINT_FX[c]}」`); } }
    if (kind === 'clear') { const c = await choose(['清空畫的東西（保留畫板）', '全部清空（變回白紙）', '取消'], { title: '確定要清空嗎？', w: 360, x: W / 2 - 180, y: 200 }); if (c === 0 || c === 1) { snap(); pc.clearRect(0, 0, pcv.width, pcv.height); if (c === 1) drawBoard('white'); } }
    if (kind === 'save') {
      try { const a = document.createElement('a'); a.download = '我的幻靈畫作.png'; a.href = composite(PS).toDataURL('image/png'); document.body.appendChild(a); a.click(); a.remove(); say2('已存成圖片檔！'); } catch (e) { say2('存檔失敗'); }
    }
    if (kind === 'album') {
      const d = paintLoad();
      const c = await choose(['存到相簿', '從相簿打開', '取消'], { title: '相簿（可以放 4 張）', w: 300, x: W / 2 - 150, y: 180 });
      if (c === 0 || c === 1) {
        const k = await choose(d.slots.map((s, i) => `第 ${i + 1} 格：${s ? '有圖畫' : '空的'}`), { title: c === 0 ? '存到哪一格？' : '打開哪一格？', w: 300, x: W / 2 - 150, y: 180 });
        if (k >= 0 && c === 0) { d.slots[k] = composite(1).toDataURL('image/jpeg', 0.85); try { localStorage.setItem(PAINT_KEY, JSON.stringify(d)); say2('已存到相簿！'); } catch (e) { say2('空間不夠，存不進去'); } }
        if (k >= 0 && c === 1) { if (!d.slots[k]) say2('這一格是空的'); else { const im = new Image(); im.onload = () => { snap(); drawBoard('white'); pc.clearRect(0, 0, pcv.width, pcv.height); pc.drawImage(im, 0, 0, pcv.width, pcv.height); P.board = 'white'; }; im.src = d.slots[k]; } }
      }
    }
    if (kind === 'text') {
      const s = prompt('要寫什麼字？', P.text);
      if (s && s.trim()) P.text = s.trim().slice(0, 30);
      const c = await choose(['小字', '中字', '大字'], { title: '字的大小', w: 220, x: W / 2 - 110, y: 220, start: P.font });
      if (c >= 0) P.font = c;
      P.tool = 'text'; say2('在畫布上點一下就會寫上去');
    }
    if (kind === 'exit') { const c = await choose(['回主選單', '繼續畫'], { title: '要離開小畫家嗎？（沒存的畫會消失）', w: 380, x: W / 2 - 190, y: 200 }); if (c === 0) { popLayer(L); hubOpen(); return; } }
    P.busy = false; MOUSE.ev = []; P.drag = null;
  }
  // 版面
  const topBtns = [['undo', '復原', 150, 58], ['redo', '重做', 212, 58], ['clear', '清空', 274, 58], ['board', '畫板', 336, 58], ['fx', '特效', 398, 58], ['save', '存圖片', 460, 74], ['album', '相簿', 538, 58], ['exit', '主選單', 600, 76]].map(([id, s, x, w]) => ({ id, s, r: [x, 6, w, 30] }));
  const toolRect = i => [618 + (i % 2) * 72, 44 + Math.floor(i / 2) * 31, 68, 28];
  const sizeRect = i => [618 + i * 29, 310, 26, 26];
  const optRect = i => [618 + i * 48, 342, 44, 26];
  const colRect = i => [70 + (i % 12) * 45, 504 + Math.floor(i / 12) * 34, 41, 30];
  const customRect = colRect(23);
  const stampBox = [618, 374, 140, 92], stampOpt = i => [618 + i * 35, 470, 33, 24], stampNav = [[618, 498, 44, 22], [666, 498, 44, 22], [714, 498, 44, 22]];
  const gridRect = i => [40 + (i % 8) * 86, 70 + Math.floor(i / 8) * 86, 82, 82];
  function click(x, y) {
    if (P.pickOpen) {
      const pages = Math.ceil(stampIds.length / 40);
      if (inRect(x, y, [40, 506, 120, 40])) { P.page = (P.page + pages - 1) % pages; return; }
      if (inRect(x, y, [608, 506, 120, 40])) { P.page = (P.page + 1) % pages; return; }
      if (inRect(x, y, [324, 506, 120, 40])) { P.pickOpen = false; return; }
      for (let i = 0; i < 40; i++) { const id = stampIds[P.page * 40 + i]; if (id && inRect(x, y, gridRect(i))) { P.stamp = id; P.tool = 'stamp'; P.pickOpen = false; sfx('ok'); return; } }
      return;
    }
    for (const b of topBtns) if (inRect(x, y, b.r)) {
      sfx('cursor');
      if (b.id === 'undo') { if (P.undo.length) { P.redo.push(cur()); restore(P.undo.pop()); } return; }
      if (b.id === 'redo') { if (P.redo.length) { P.undo.push(cur()); restore(P.redo.pop()); } return; }
      menu(b.id); return;
    }
    for (let i = 0; i < PAINT_TOOLS.length; i++) if (inRect(x, y, toolRect(i))) { const id = PAINT_TOOLS[i][0]; sfx('cursor'); if (id === 'text') { menu('text'); return; } P.tool = id; return; }
    for (let i = 0; i < PAINT_SIZES.length; i++) if (inRect(x, y, sizeRect(i))) { P.size = i; sfx('cursor'); return; }
    if (inRect(x, y, optRect(0))) { P.fillShape = !P.fillShape; sfx('cursor'); say2(P.fillShape ? '形狀：實心' : '形狀：空心'); return; }
    if (inRect(x, y, optRect(1))) { P.mirror = !P.mirror; sfx('cursor'); say2(P.mirror ? '左右對稱：開' : '左右對稱：關'); return; }
    if (inRect(x, y, optRect(2))) { P.alpha = (P.alpha + 1) % PAINT_ALPHA.length; sfx('cursor'); say2(`透明度：${Math.round(PAINT_ALPHA[P.alpha] * 100)}%`); return; }
    if (inRect(x, y, customRect)) { sfx('cursor'); try { PAINT_COLOR_INPUT.oninput = () => { P.custom = P.col = PAINT_COLOR_INPUT.value; }; PAINT_COLOR_INPUT.click(); } catch (e) {} P.col = P.custom; if (['eraser', 'pick', 'stamp', 'rainbow', 'glitter'].includes(P.tool)) P.tool = 'brush'; return; }
    for (let i = 0; i < PAINT_COLORS.length; i++) if (inRect(x, y, colRect(i))) { P.col = PAINT_COLORS[i]; if (['eraser', 'pick', 'stamp', 'rainbow', 'glitter'].includes(P.tool)) P.tool = 'brush'; sfx('cursor'); return; }
    if (inRect(x, y, stampBox)) { P.pickOpen = true; P.page = Math.max(0, Math.floor(stampIds.indexOf(P.stamp) / 40)); return; }
    for (let i = 0; i < 4; i++) if (inRect(x, y, stampOpt(i))) { if (i < 3) P.stampSize = i; else P.flip = !P.flip; P.tool = 'stamp'; sfx('cursor'); return; }
    const si = stampIds.indexOf(P.stamp);
    if (inRect(x, y, stampNav[0])) { P.stamp = stampIds[(si + stampIds.length - 1) % stampIds.length]; P.tool = 'stamp'; return; }
    if (inRect(x, y, stampNav[1])) { P.rot = (P.rot + 1) % 8; P.tool = 'stamp'; say2(`印章旋轉 ${P.rot * 45}°`); return; }
    if (inRect(x, y, stampNav[2])) { P.stamp = stampIds[(si + 1) % stampIds.length]; P.tool = 'stamp'; return; }
  }
  const SHAPES = ['line', 'rect', 'circle', 'tri', 'star', 'heart'];
  const L = {
    update(dt) {
      if (P.note) { P.note.t -= dt; if (P.note.t <= 0) P.note = null; }
      if (P.busy) return;
      if (take('back')) { if (P.pickOpen) P.pickOpen = false; else { menu('exit'); return; } }
      for (const e of mouseEvents()) {
        P.hover = [e.x, e.y];
        const on = inCanvas(e.x, e.y) && !P.pickOpen, [x, y] = toP(e.x, e.y);
        if (e.t === 'down') {
          if (!on) { click(e.x, e.y); if (P.busy) return; continue; }
          if (P.tool === 'pick') { pickColor(x, y); P.tool = 'brush'; continue; }
          snap();
          if (P.tool === 'fill') { flood(x, y); if (P.mirror) flood(mx(x), y); continue; }
          if (P.tool === 'stamp') { stampAt(x, y, false); if (P.mirror) stampAt(mx(x), y, true); sfx('ok'); continue; }
          if (P.tool === 'text') { textAt(x, y); if (P.mirror) textAt(mx(x), y); continue; }
          P.drag = { x0: x, y0: y, x, y };
          if (['brush', 'eraser', 'rainbow', 'calli'].includes(P.tool)) both((a, b) => stroke(a, b, a + 0.01, b), x, y);
          if (P.tool === 'spray') both(spray, x, y);
          if (P.tool === 'glitter') both(glitter, x, y);
        }
        if (e.t === 'move' && P.drag) {
          if (['brush', 'eraser', 'rainbow', 'calli'].includes(P.tool)) { const h0 = P.hue; stroke(P.drag.x, P.drag.y, x, y); if (P.mirror) { P.hue = h0; stroke(mx(P.drag.x), P.drag.y, mx(x), y); } }
          if (P.tool === 'spray') both(spray, x, y);
          if (P.tool === 'glitter') both(glitter, x, y);
          P.drag.x = x; P.drag.y = y;
        }
        if (e.t === 'up' && P.drag) {
          if (SHAPES.includes(P.tool)) { shape(pc, P.tool, P.drag.x0, P.drag.y0, P.drag.x, P.drag.y, PS); if (P.mirror) shape(pc, P.tool, mx(P.drag.x0), P.drag.y0, mx(P.drag.x), P.drag.y, PS); }
          P.drag = null;
        }
      }
      if (P.drag && MOUSE.down) { if (P.tool === 'spray') both(spray, P.drag.x, P.drag.y); if (P.tool === 'glitter' && Math.random() < 0.4) both(glitter, P.drag.x, P.drag.y); }
    },
    draw() {
      const t = performance.now() / 1000;
      if (P.wantBg) { try { drawBattleBG(P.wantBg, 0); bg.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, bgcv.width, bgcv.height); } catch (e) { console.error(e); } P.wantBg = null; }
      const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#2a2040'); g.addColorStop(1, '#14101e'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      text('幻靈小畫家', 10, 9, { size: 22, bold: true, color: '#ffa0d0' });
      for (const b of topBtns) { panel(b.r[0], b.r[1], b.r[2], b.r[3], { bg: 'rgba(50,38,76,0.95)' }); text(b.s, b.r[0] + b.r[2] / 2, b.r[1] + 6, { size: 16, align: 'center', color: (b.id === 'undo' && !P.undo.length) || (b.id === 'redo' && !P.redo.length) ? '#6a6070' : '#f4ead0' }); }
      // 畫布
      ctx.fillStyle = '#000'; ctx.fillRect(PX - 3, PY - 3, PW + 6, PH + 6);
      ctx.drawImage(bgcv, PX, PY, PW, PH); ctx.drawImage(pcv, PX, PY, PW, PH);
      ctx.save(); ctx.beginPath(); ctx.rect(PX, PY, PW, PH); ctx.clip();
      if (P.mirror) { ctx.strokeStyle = 'rgba(255,100,180,0.6)'; ctx.setLineDash([6, 6]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(PX + PW / 2, PY); ctx.lineTo(PX + PW / 2, PY + PH); ctx.stroke(); ctx.setLineDash([]); }
      if (P.drag && SHAPES.includes(P.tool)) { const a = [P.drag.x0 / PS + PX, P.drag.y0 / PS + PY, P.drag.x / PS + PX, P.drag.y / PS + PY]; shape(ctx, P.tool, ...a, 1); if (P.mirror) shape(ctx, P.tool, 2 * PX + PW - a[0], a[1], 2 * PX + PW - a[2], a[3], 1); }
      if (P.hover && inCanvas(P.hover[0], P.hover[1]) && !P.pickOpen && !P.busy) {
        const [hx, hy] = P.hover;
        if (P.tool === 'stamp') { ctx.save(); ctx.globalAlpha = 0.55; ctx.translate(hx, hy); ctx.rotate(P.rot * Math.PI / 4); ctx.scale(stampPx() / 76, stampPx() / 76); drawMon(ctx, P.stamp, 0, 0, 76, 1.2, { still: !P.flip, flip: P.flip }); ctx.restore(); }
        else if (P.tool === 'text') { ctx.save(); ctx.globalAlpha = 0.6; ctx.font = `bold ${[20, 34, 56][P.font]}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = P.col; ctx.fillText(P.text, hx, hy); ctx.restore(); }
        else { const r = P.tool === 'fill' || P.tool === 'pick' ? 4 : PAINT_SIZES[P.size] / 2 * (P.tool === 'eraser' ? 1.6 : P.tool === 'spray' ? 3.6 : 1); ctx.strokeStyle = '#000'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(hx, hy, Math.max(2, r), 0, 7); ctx.stroke(); ctx.strokeStyle = '#fff'; ctx.beginPath(); ctx.arc(hx, hy, Math.max(2, r) + 1, 0, 7); ctx.stroke(); }
      }
      ctx.restore();
      // 工具
      PAINT_TOOLS.forEach(([id, n], i) => { const r = toolRect(i), on = P.tool === id; ctx.fillStyle = on ? '#ffa0d0' : 'rgba(50,38,76,0.95)'; ctx.strokeStyle = on ? '#ffffff' : '#8a7aa0'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(r[0], r[1], r[2], r[3], 7); ctx.fill(); ctx.stroke(); text(n, r[0] + r[2] / 2, r[1] + 5, { size: 15, align: 'center', color: on ? '#2a1030' : '#f4ead0', shadow: false }); });
      text('粗細', 618, 293, { size: 13, color: '#c8bca0' });
      PAINT_SIZES.forEach((s, i) => { const r = sizeRect(i), on = P.size === i; ctx.fillStyle = on ? '#ffa0d0' : 'rgba(50,38,76,0.95)'; ctx.beginPath(); ctx.roundRect(r[0], r[1], r[2], r[3], 6); ctx.fill(); ctx.fillStyle = on ? '#2a1030' : '#f4ead0'; ctx.beginPath(); ctx.arc(r[0] + r[2] / 2, r[1] + r[3] / 2, Math.min(10, s / 2 + 1), 0, 7); ctx.fill(); });
      [[P.fillShape ? '實心' : '空心', P.fillShape], ['對稱', P.mirror], [Math.round(PAINT_ALPHA[P.alpha] * 100) + '%', P.alpha > 0]].forEach(([s, on], i) => { const r = optRect(i); ctx.fillStyle = on ? '#ffa0d0' : 'rgba(50,38,76,0.95)'; ctx.beginPath(); ctx.roundRect(r[0], r[1], r[2], r[3], 6); ctx.fill(); text(s, r[0] + r[2] / 2, r[1] + 4, { size: 14, align: 'center', color: on ? '#2a1030' : '#f4ead0', shadow: false }); });
      ctx.fillStyle = P.tool === 'stamp' ? 'rgba(255,160,208,0.25)' : 'rgba(50,38,76,0.95)'; ctx.strokeStyle = P.tool === 'stamp' ? '#ffa0d0' : '#8a7aa0'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(...stampBox, 8); ctx.fill(); ctx.stroke();
      ctx.save(); ctx.beginPath(); ctx.roundRect(...stampBox, 8); ctx.clip(); ctx.translate(stampBox[0] + 70, stampBox[1] + 42); ctx.rotate(P.rot * Math.PI / 4); drawMon(ctx, P.stamp, 0, 0, 76, t, { still: !P.flip, flip: P.flip }); ctx.restore();
      text('印章：' + MONS[P.stamp].n, stampBox[0] + 70, stampBox[1] + 74, { size: 12, align: 'center' });
      ['小', '中', '大', '翻'].forEach((s, i) => { const r = stampOpt(i), on = i < 3 ? P.stampSize === i : P.flip; ctx.fillStyle = on ? '#ffa0d0' : 'rgba(50,38,76,0.95)'; ctx.beginPath(); ctx.roundRect(r[0], r[1], r[2], r[3], 6); ctx.fill(); text(s, r[0] + r[2] / 2, r[1] + 3, { size: 14, align: 'center', color: on ? '#2a1030' : '#f4ead0', shadow: false }); });
      ['◀', '旋轉', '▶'].forEach((s, i) => { const r = stampNav[i]; ctx.fillStyle = 'rgba(50,38,76,0.95)'; ctx.beginPath(); ctx.roundRect(r[0], r[1], r[2], r[3], 6); ctx.fill(); text(s, r[0] + r[2] / 2, r[1] + 3, { size: 13, align: 'center' }); });
      // 顏色
      ctx.fillStyle = P.col; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(10, 504, 52, 64, 8); ctx.fill(); ctx.stroke();
      PAINT_COLORS.forEach((c2, i) => { const r = colRect(i); ctx.fillStyle = c2; ctx.strokeStyle = P.col === c2 ? '#ffffff' : 'rgba(0,0,0,0.6)'; ctx.lineWidth = P.col === c2 ? 3 : 1; ctx.beginPath(); ctx.roundRect(r[0], r[1], r[2], r[3], 5); ctx.fill(); ctx.stroke(); });
      { const r = customRect, gg = ctx.createLinearGradient(r[0], 0, r[0] + r[2], 0); ['#ff4040', '#ffe040', '#40e060', '#40a0ff', '#c040ff'].forEach((c2, k) => gg.addColorStop(k / 4, c2)); ctx.fillStyle = gg; ctx.beginPath(); ctx.roundRect(r[0], r[1], r[2], r[3], 5); ctx.fill(); text('＋', r[0] + r[2] / 2, r[1] + 4, { size: 18, bold: true, align: 'center' }); }
      text('用滑鼠畫圖　X：離開', 618, 532, { size: 13, color: '#a09080' });
      text('＋＝自訂顏色', 618, 552, { size: 13, color: '#a09080' });
      // 印章挑選
      if (P.pickOpen) {
        ctx.fillStyle = 'rgba(10,6,20,0.94)'; ctx.fillRect(0, 0, W, H);
        const pages = Math.ceil(stampIds.length / 40);
        text(`選一隻幻靈當印章（第 ${P.page + 1} / ${pages} 頁）`, W / 2, 24, { size: 24, bold: true, align: 'center', color: '#ffa0d0' });
        for (let i = 0; i < 40; i++) { const id = stampIds[P.page * 40 + i]; if (!id) continue; const r = gridRect(i), hov = P.hover && inRect(P.hover[0], P.hover[1], r); ctx.fillStyle = hov ? 'rgba(255,160,208,0.3)' : 'rgba(50,38,76,0.8)'; ctx.beginPath(); ctx.roundRect(r[0], r[1], r[2], r[3], 8); ctx.fill(); drawMon(ctx, id, r[0] + 41, r[1] + 36, 62, t, { still: true }); text(MONS[id].n.slice(0, 5), r[0] + 41, r[1] + 64, { size: 12, align: 'center' }); }
        [[40, '◀ 上一頁'], [324, '關閉'], [608, '下一頁 ▶']].forEach(([x, s]) => { panel(x, 506, 120, 40, { bg: 'rgba(50,38,76,0.95)' }); text(s, x + 60, 516, { size: 17, align: 'center' }); });
      }
      if (P.note) { ctx.save(); ctx.globalAlpha = Math.min(1, P.note.t * 2); panel(W / 2 - 150, 240, 300, 50); text(P.note.s, W / 2, 254, { size: 20, align: 'center', color: '#ffe080' }); ctx.restore(); }
    },
  };
  return L;
}
