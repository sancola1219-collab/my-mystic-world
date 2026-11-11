// ===== 幻靈塔防：把幻靈放在路邊，擋住一波波怪物（屬性相剋和原本遊戲一樣）=====

const TD_KEY = 'my_mystic_world_td';
const TDC = 16, TDR = 9, TDT = 48, TDY = 40; // 格子 16×9、上方資訊列 40px、下方商店列
const TD_MAPS = [
  { n: '晨曦草原', pal: ['#7ac060', '#62a84c', '#e6cf98', '#c9ab6c', '#3f8a3a'], song: 'route', pts: [[-1, 2], [3, 2], [3, 6], [7, 6], [7, 1], [11, 1], [11, 7], [14, 7], [14, 4], [16, 4]] },
  { n: '熔岩工堡', pal: ['#6a4a3a', '#55392c', '#e09050', '#b0602c', '#2a1810'], song: 'trainer', pts: [[-1, 7], [2, 7], [2, 1], [5, 1], [5, 5], [9, 5], [9, 2], [13, 2], [13, 7], [16, 7]] },
  { n: '霜鈴雪原', pal: ['#dceefa', '#c2dcf0', '#9ab8d8', '#7c9cc0', '#6a8ab0'], song: 'route', pts: [[-1, 4], [2, 4], [2, 1], [6, 1], [6, 7], [10, 7], [10, 3], [13, 3], [13, 6], [16, 6]] },
];
const TD_TOWERS = [
  { el: '火', n: '火焰塔', cost: 70, r: 2.2, cd: 1.1, d: 16, k: 'splash', sp: 1.1, info: '爆炸，炸到旁邊的怪物' },
  { el: '水', n: '水流塔', cost: 50, r: 2.4, cd: 0.45, d: 7, k: 'shot', info: '便宜又射得快' },
  { el: '木', n: '毒藤塔', cost: 60, r: 2.4, cd: 0.9, d: 5, k: 'poison', dot: 6, dur: 4, info: '讓怪物中毒持續扣血' },
  { el: '雷', n: '雷電塔', cost: 90, r: 2.6, cd: 1.0, d: 13, k: 'chain', hops: 3, info: '閃電會連續跳到 3 隻怪物' },
  { el: '冰', n: '冰凍塔', cost: 65, r: 2.3, cd: 0.9, d: 6, k: 'slow', slow: 0.5, dur: 2, info: '讓怪物走路變慢' },
  { el: '風', n: '疾風塔', cost: 80, r: 3.4, cd: 0.25, d: 4, k: 'shot', info: '射程遠、速度超快' },
  { el: '地', n: '巨岩塔', cost: 100, r: 1.9, cd: 2.0, d: 55, k: 'stun', dur: 0.6, sp: 0.8, info: '重擊，把怪物震暈' },
  { el: '光', n: '聖光塔', cost: 120, r: 4.6, cd: 1.8, d: 48, k: 'beam', info: '超遠距離的狙擊光束' },
  { el: '暗', n: '詛咒塔', cost: 85, r: 2.6, cd: 1.2, d: 8, k: 'curse', amp: 0.35, dur: 4, info: '被詛咒的怪物受到更多傷害' },
  { el: '鋼', n: '刀刃塔', cost: 95, r: 1.5, cd: 0.7, d: 11, k: 'aura', info: '同時砍到身邊所有怪物' },
];
// 每種塔用一隻該屬性的幻靈當造型，升級時用牠的進化型
for (const T of TD_TOWERS) {
  let id = 0;
  for (let k = 1; k <= 330 && !id; k++) if (MONS[k] && !MONS[k].big && MONS[k].t[0] === T.el && (k <= 20 || MONS[k].evo)) id = k;
  for (let k = 1; k <= 1103 && !id; k++) if (MONS[k] && !MONS[k].big && MONS[k].t[0] === T.el) id = k;
  const e1 = MONS[id].evo ? MONS[id].evo.to : id, e2 = MONS[e1] && MONS[e1].evo ? MONS[e1].evo.to : e1;
  T.ids = [id, e1, e2];
}
const TD_POOL = Object.keys(MONS).map(Number).filter(id => id <= 1103 && !MONS[id].big && SPRITES[id]).sort((a, b) => MONS[a].b.reduce((x, y) => x + y, 0) - MONS[b].b.reduce((x, y) => x + y, 0) || a - b);
const TD_BOSS = Object.keys(MONS).map(Number).filter(id => id <= 432 && MONS[id].big && SPRITES[id]);
function tdLoad() { try { return JSON.parse(localStorage.getItem(TD_KEY)) || { best: {} }; } catch (e) { return { best: {} }; } }
const TD_DIFF = [{ n: '普通', hp: 1, gold: 160, lives: 15, col: '#8ae0ff' }, { n: '困難', hp: 1.55, gold: 140, lives: 10, col: '#ffb040' }, { n: '地獄', hp: 2.3, gold: 120, lives: 5, col: '#ff5050' }];
function tdSaveBest(mi, wave) { const d = tdLoad(); if ((d.best[mi] || 0) < wave) { d.best[mi] = wave; try { localStorage.setItem(TD_KEY, JSON.stringify(d)); } catch (e) {} } }

async function tdStart() {
  layers.length = 0;
  const best = tdLoad().best;
  const bg = pushLayer({ update() {}, draw() { ctx.fillStyle = '#12101c'; ctx.fillRect(0, 0, W, H); text('幻靈塔防', W / 2, 60, { size: 54, bold: true, serif: true, align: 'center', color: '#8ae0ff' }); const t = performance.now() / 1000; TD_TOWERS.forEach((T, i) => drawMon(ctx, T.ids[0], 80 + i * 68, 190 + Math.sin(t * 2 + i) * 6, 60, t)); text('把幻靈放在路邊，不要讓怪物走到終點的水晶！', W / 2, 250, { size: 20, align: 'center', color: '#e8dcc0' }); text('屬性相剋和冒險模式一樣：火剋木、木剋水、水剋火……打中弱點傷害 2 倍', W / 2, 282, { size: 16, align: 'center', color: '#b8ac90' }); text('有盾牌標記的怪物只怕剋制屬性　綠色＋號會回血　每 3 波有快速部隊', W / 2, 304, { size: 15, align: 'center', color: '#b8ac90' }); } });
  const opts = TD_MAPS.map((m, i) => { const b = [0, 1, 2].map(d => best[i + '-' + d] || 0); return `${m.n}${b.some(v => v) ? `（最高：${b.map((v, d) => TD_DIFF[d].n[0] + v).join('／')}）` : ''}`; }).concat(['回主選單']);
  const c = await choose(opts, { title: '選擇地圖', w: 380, x: W / 2 - 190, y: 320, cancel: false });
  if (c >= TD_MAPS.length) { popLayer(bg); return hubOpen(); }
  const d = await choose(TD_DIFF.map(q => `${q.n}（生命 ${q.lives}、怪物血量 ×${q.hp}）`), { title: '選擇難度', w: 380, x: W / 2 - 190, y: 320, start: 1 });
  popLayer(bg);
  if (d < 0) return tdStart();
  pushLayer(tdLayer(c, d));
}

function tdLayer(mi, di = 1) {
  const DF = TD_DIFF[di], bestKey = mi + "-" + di;
  const map = TD_MAPS[mi], pts = map.pts;
  // 路徑
  const seg = []; let total = 0;
  for (let i = 0; i < pts.length - 1; i++) { const len = Math.abs(pts[i + 1][0] - pts[i][0]) + Math.abs(pts[i + 1][1] - pts[i][1]); seg.push({ a: pts[i], b: pts[i + 1], len, at: total }); total += len; }
  const isPath = new Set();
  for (const s of seg) { const dx = Math.sign(s.b[0] - s.a[0]), dy = Math.sign(s.b[1] - s.a[1]); for (let k = 0; k <= s.len; k++) isPath.add((s.a[0] + dx * k) + ',' + (s.a[1] + dy * k)); }
  const posAt = d => { d = Math.max(0, Math.min(total, d)); const s = seg.find(q => d <= q.at + q.len) || seg[seg.length - 1], u = (d - s.at) / s.len; return [((s.a[0] + (s.b[0] - s.a[0]) * u) + 0.5) * TDT, TDY + ((s.a[1] + (s.b[1] - s.a[1]) * u) + 0.5) * TDT]; };
  // 預先畫好地圖
  const mcv = document.createElement('canvas'); mcv.width = W * SS; mcv.height = TDR * TDT * SS;
  { const c = mcv.getContext('2d'); c.scale(SS, SS); const R = srand(mi * 97 + 5), [g1, g2, p1, p2, dk] = map.pal;
    for (let y = 0; y < TDR; y++) for (let x = 0; x < TDC; x++) { c.fillStyle = g1; c.fillRect(x * TDT, y * TDT, TDT, TDT); if ((x + y) % 2) { c.fillStyle = g2; c.globalAlpha = 0.28; c.fillRect(x * TDT, y * TDT, TDT, TDT); c.globalAlpha = 1; } }
    for (let i = 0; i < 260; i++) { const x = R() * W, y = R() * TDR * TDT; c.fillStyle = i % 3 ? dk : 'rgba(255,255,255,0.35)'; c.globalAlpha = 0.35; c.fillRect(x, y, 2, 5); } c.globalAlpha = 1;
    c.lineJoin = 'round'; c.lineCap = 'round';
    const line = (w, col) => { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); pts.forEach((p, i) => { const x = (p[0] + 0.5) * TDT, y = (p[1] + 0.5) * TDT; i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke(); };
    line(46, 'rgba(0,0,0,0.25)'); line(42, p2); line(34, p1);
    for (let i = 0; i < 160; i++) { const d = R() * total, s = seg.find(q => d <= q.at + q.len), u = (d - s.at) / s.len; const x = (s.a[0] + (s.b[0] - s.a[0]) * u + 0.5) * TDT + (R() - 0.5) * 26, y = (s.a[1] + (s.b[1] - s.a[1]) * u + 0.5) * TDT + (R() - 0.5) * 26; c.fillStyle = R() < 0.5 ? p2 : 'rgba(255,255,255,0.3)'; c.beginPath(); c.arc(x, y, 1.6, 0, 7); c.fill(); }
  }
  const G = { gold: DF.gold, lives: DF.lives, wave: 0, towers: [], foes: [], fx: [], queue: [], spawnT: 0, gapT: 5, speed: 1, sel: -1, cx: 8, cy: 4, over: false, won: false, pick: null, sfxT: 0, menu: false };
  const tileFree = (x, y) => x >= 0 && y >= 0 && x < TDC && y < TDR && !isPath.has(x + ',' + y) && !G.towers.some(t => t.x === x && t.y === y);
  const towerAt = (x, y) => G.towers.find(t => t.x === x && t.y === y);
  const tStat = (t, k) => t.T[k] * (k === 'd' ? [1, 1.8, 3.2][t.lv] : k === 'r' ? [1, 1.1, 1.25][t.lv] : k === 'cd' ? [1, 0.9, 0.78][t.lv] : 1);
  const upCost = t => Math.round(t.T.cost * [0.9, 1.6][t.lv]);
  const sellVal = t => Math.round(t.spent * 0.6);
  function startWave() {
    G.wave++; const n = G.wave, boss = n % 5 === 0;
    const band = Math.min(TD_POOL.length - 24, Math.floor((n - 1) / 50 * TD_POOL.length * 0.9));
    const a = TD_POOL[band + (n * 13) % 20], b = TD_POOL[band + (n * 29 + 7) % 20];
    const hp = Math.round(32 * Math.pow(1.175, n - 1) * (1 + n * 0.07) * DF.hp), cnt = 8 + Math.floor(n * 1.25), fastWave = n % 3 === 0;
    G.queue = [];
    for (let i = 0; i < cnt; i++) { const id = i % 3 === 2 ? b : a, sp = (0.95 + Math.min(1, MONS[id].b[3] / 140) * 0.8) * (fastWave ? 1.6 : 1), h0 = Math.round(hp * (fastWave ? 0.6 : 1)); G.queue.push({ id, hp: h0, max: h0, sp, rew: 3 + Math.floor(n / 4), boss: false, armor: n >= 6 && i % 4 === 1, regen: n >= 10 && i % 5 === 2 }); }
    if (boss) { const id = TD_BOSS[(n / 5 - 1 + mi * 3) % TD_BOSS.length]; G.queue.push({ id, hp: hp * 20, max: hp * 20, sp: 0.6, rew: 50 + n * 3, boss: true, armor: n >= 15, regen: n >= 20 }); if (n >= 25) G.queue.push({ id: TD_BOSS[(n / 5 + 7) % TD_BOSS.length], hp: hp * 16, max: hp * 16, sp: 0.7, rew: 40 + n * 3, boss: true, armor: true }); }
    G.spawnGap = Math.max(0.26, 0.7 - n * 0.013) * (fastWave ? 0.7 : 1); G.spawnT = 0;
    G.note = { s: boss ? `第 ${n} 波：頭目「${MONS[G.queue[G.queue.length - 1].id].n}」來襲！` : fastWave ? `第 ${n} 波：快速部隊衝過來了！` : `第 ${n} 波`, t: 2.2 };
    if (boss) sfx('exclaim');
  }
  function hurtFoe(f, dmg, el, quiet) {
    if (f.hp <= 0) return;
    let m = typeMult(el, MONS[f.id].t); if (m < 0.25) m = 0.25;
    if (f.armor && m <= 1) m *= 0.5; // 裝甲：只有剋制屬性才打得痛
    const d = Math.max(1, Math.round(dmg * m * (f.curseT > 0 ? 1 + f.curseK : 1)));
    f.hp -= d; f.flash = 0.12;
    if (m > 1 && !quiet) G.fx.push({ k: 'num', x: f.x, y: f.y - 20, s: '剋！' + d, col: '#ffe040', t: 0, dur: 0.7 });
    if (f.hp <= 0) { G.gold += f.rew; G.fx.push({ k: 'pop', x: f.x, y: f.y, col: TYPES[MONS[f.id].t[0]].c, t: 0, dur: 0.35, r: f.boss ? 60 : 26 }); G.fx.push({ k: 'num', x: f.x, y: f.y - 10, s: '+$' + f.rew, col: '#ffd77a', t: 0, dur: 0.8 }); if (G.sfxT <= 0) { sfx(f.boss ? 'super' : 'hit'); G.sfxT = 0.08; } }
  }
  function fire(t) {
    const T = t.T, r = tStat(t, 'r') * TDT, d = tStat(t, 'd'), tx = (t.x + 0.5) * TDT, ty = TDY + (t.y + 0.5) * TDT;
    const inR = G.foes.filter(f => f.hp > 0 && Math.hypot(f.x - tx, f.y - ty) <= r + (f.boss ? 14 : 0)).sort((a, b) => b.d - a.d);
    if (!inR.length) return false;
    const f = inR[0], col = TYPES[T.el].c;
    t.kick = 0.15;
    if (T.k === 'aura') { for (const q of inR) hurtFoe(q, d, T.el, true); G.fx.push({ k: 'ring', x: tx, y: ty, r, col, t: 0, dur: 0.25 }); return true; }
    if (T.k === 'beam') { hurtFoe(f, d, T.el); G.fx.push({ k: 'beam', x: tx, y: ty - 10, x2: f.x, y2: f.y, col, t: 0, dur: 0.22, w: 6 }); return true; }
    if (T.k === 'chain') { let cur = f, px = tx, py = ty - 10; const hit = new Set(); for (let h = 0; h < T.hops + t.lv && cur; h++) { hurtFoe(cur, d * Math.pow(0.8, h), T.el, h > 0); G.fx.push({ k: 'zap', x: px, y: py, x2: cur.x, y2: cur.y, col, t: 0, dur: 0.18 }); hit.add(cur); px = cur.x; py = cur.y; cur = G.foes.filter(q => q.hp > 0 && !hit.has(q) && Math.hypot(q.x - px, q.y - py) < TDT * 2).sort((a, b) => b.d - a.d)[0]; } return true; }
    G.fx.push({ k: 'shot', x: tx, y: ty - 10, x2: f.x, y2: f.y, col, t: 0, dur: 0.12 });
    if (T.k === 'splash' || T.k === 'stun') { const R2 = T.sp * TDT * (1 + t.lv * 0.15); for (const q of G.foes) if (q.hp > 0 && Math.hypot(q.x - f.x, q.y - f.y) <= R2) { hurtFoe(q, q === f ? d : d * 0.6, T.el, q !== f); if (T.k === 'stun' && !q.boss) q.stunT = T.dur; } G.fx.push({ k: 'ring', x: f.x, y: f.y, r: R2, col, t: 0, dur: 0.3 }); return true; }
    hurtFoe(f, d, T.el);
    if (T.k === 'poison') { f.poisT = T.dur; f.poisD = T.dot * [1, 1.8, 3.2][t.lv]; f.poisEl = T.el; }
    if (T.k === 'slow') { f.slowT = T.dur + t.lv * 0.5; f.slowK = f.boss ? 0.75 : T.slow; }
    if (T.k === 'curse') { f.curseT = T.dur; f.curseK = T.amp + t.lv * 0.15; }
    return true;
  }
  async function tileMenu() {
    G.menu = true;
    const x = G.cx, y = G.cy, tw = towerAt(x, y);
    if (tw) {
      const can = tw.lv < 2, c = await choose([can ? `升級（$${upCost(tw)}）` : '已經是最高級', `賣掉（拿回 $${sellVal(tw)}）`, '取消'], { title: `${tw.T.n} Lv${tw.lv + 1}　傷害 ${Math.round(tStat(tw, 'd'))}`, w: 320, x: W / 2 - 160, y: 200 });
      if (c === 0 && can) { const cost = upCost(tw); if (G.gold >= cost) { G.gold -= cost; tw.spent += cost; tw.lv++; sfx('up'); G.fx.push({ k: 'ring', x: (x + 0.5) * TDT, y: TDY + (y + 0.5) * TDT, r: 40, col: '#ffe080', t: 0, dur: 0.4 }); } else { sfx('bump'); G.note = { s: '錢不夠！', t: 1.2 }; } }
      if (c === 1) { G.gold += sellVal(tw); G.towers.splice(G.towers.indexOf(tw), 1); sfx('ok'); }
    } else if (tileFree(x, y)) {
      const c = await choose(TD_TOWERS.map(T => (px, py, sel) => { ctx.fillStyle = TYPES[T.el].c; ctx.fillRect(px - 4, py + 6, 5, 22); text(`${T.n}`, px + 8, py + 5, { size: 19, color: G.gold >= T.cost ? (sel ? '#ffd77a' : '#f4ead0') : '#776e66' }); text('$' + T.cost, px + 250, py + 6, { size: 18, align: 'right', color: '#c8bca0' }); }), { title: `要放哪一種塔？（金錢 $${G.gold}）`, w: 300, x: W / 2 - 150, y: 60, rowH: 34, maxRows: 10, desc: k => `【${TD_TOWERS[k].el}】${TD_TOWERS[k].info}` });
      if (c >= 0) place(c, x, y);
    } else sfx('bump');
    G.menu = false; MOUSE.ev = [];
  }
  function place(i, x, y) {
    const T = TD_TOWERS[i];
    if (!tileFree(x, y)) { sfx('bump'); return; }
    if (G.gold < T.cost) { sfx('bump'); G.note = { s: '錢不夠！', t: 1.2 }; return; }
    G.gold -= T.cost; G.towers.push({ T, x, y, lv: 0, cd: 0, spent: T.cost, kick: 0 }); sfx('ok');
    G.fx.push({ k: 'ring', x: (x + 0.5) * TDT, y: TDY + (y + 0.5) * TDT, r: 34, col: TYPES[T.el].c, t: 0, dur: 0.3 });
  }
  async function pauseMenu() {
    G.menu = true;
    const c = await choose(['繼續', '重新開始', '換地圖', '回主選單'], { title: '暫停', w: 260, x: W / 2 - 130, y: 200 });
    G.menu = false; MOUSE.ev = [];
    if (c === 1) { popLayer(L); pushLayer(tdLayer(mi, di)); }
    if (c === 2) { popLayer(L); tdStart(); }
    if (c === 3) { popLayer(L); hubOpen(); }
  }
  async function endGame(win) {
    G.menu = true; tdSaveBest(bestKey, win ? G.wave : G.wave - 1);
    if (win) { jingle('victory'); const c = await choose(['繼續挑戰（無限模式）', '回主選單'], { title: `守住了 40 波！你是塔防大師！`, w: 400, x: W / 2 - 200, y: 200, cancel: false }); G.menu = false; MOUSE.ev = []; if (c === 1) { popLayer(L); hubOpen(); } return; }
    sfx('faint');
    const c = await choose(['再玩一次', '換地圖', '回主選單'], { title: `水晶被打碎了……撐到第 ${G.wave} 波`, w: 380, x: W / 2 - 190, y: 200, cancel: false });
    popLayer(L);
    if (c === 0) pushLayer(tdLayer(mi, di)); else if (c === 1) tdStart(); else hubOpen();
  }
  const shopRect = i => [8 + i * 75.2, 478, 71, 92];
  const btnSpeed = [W - 200, 5, 92, 30], btnMenu = [W - 100, 5, 92, 30];
  const L = {
    update(dt) {
      if (G.menu) return;
      // 滑鼠
      for (const e of mouseEvents()) {
        const gx = Math.floor(e.x / TDT), gy = Math.floor((e.y - TDY) / TDT), inGrid = gy >= 0 && gy < TDR && gx >= 0 && gx < TDC;
        if (inGrid && (e.t === 'move' || e.t === 'down')) { G.cx = gx; G.cy = gy; }
        if (e.t !== 'down') continue;
        if (inRect(e.x, e.y, btnSpeed)) { G.speed = G.speed % 3 + 1; sfx('cursor'); continue; }
        if (inRect(e.x, e.y, btnMenu)) { pauseMenu(); return; }
        const s = TD_TOWERS.findIndex((_, i) => inRect(e.x, e.y, shopRect(i)));
        if (s >= 0) { G.sel = G.sel === s ? -1 : s; sfx('cursor'); continue; }
        if (inGrid) { if (G.sel >= 0 && tileFree(gx, gy)) place(G.sel, gx, gy); else { tileMenu(); return; } }
      }
      // 鍵盤
      if (take('left')) G.cx = Math.max(0, G.cx - 1);
      if (take('right')) G.cx = Math.min(TDC - 1, G.cx + 1);
      if (take('up')) G.cy = Math.max(0, G.cy - 1);
      if (take('down')) G.cy = Math.min(TDR - 1, G.cy + 1);
      if (take('hint')) { G.speed = G.speed % 3 + 1; sfx('cursor'); }
      if (take('run') && !G.queue.length && !G.foes.length && G.gapT > 0.3) G.gapT = 0.3;
      if (take('back')) { if (G.sel >= 0) G.sel = -1; else { pauseMenu(); return; } }
      if (take('ok')) { if (G.sel >= 0 && tileFree(G.cx, G.cy)) place(G.sel, G.cx, G.cy); else { tileMenu(); return; } }
      // 模擬
      const steps = G.speed;
      for (let st = 0; st < steps; st++) {
        const h = Math.min(0.05, dt);
        G.sfxT -= h;
        if (G.queue.length) { G.spawnT -= h; if (G.spawnT <= 0) { const q = G.queue.shift(); const [x, y] = posAt(0); G.foes.push(Object.assign(q, { d: 0, x, y, slowT: 0, stunT: 0, poisT: 0, curseT: 0, flash: 0, ph: Math.random() * 6 })); G.spawnT = G.spawnGap; } }
        else if (!G.foes.length && !G.over) { G.gapT -= h; if (G.gapT <= 0) { if (G.wave === 40 && !G.won) { G.won = true; endGame(true); return; } if (G.wave > 0) { G.gold += 12 + Math.floor(G.wave * 1.5); tdSaveBest(bestKey, G.wave); } startWave(); G.gapT = 6; } }
        for (const f of G.foes) {
          if (f.hp <= 0) continue;
          if (f.poisT > 0) { f.poisT -= h; hurtFoe(f, f.poisD * h, f.poisEl, true); }
          if (f.regen && f.hp > 0) f.hp = Math.min(f.max, f.hp + f.max * 0.03 * h);
          if (f.curseT > 0) f.curseT -= h;
          if (f.flash > 0) f.flash -= h;
          if (f.stunT > 0) { f.stunT -= h; continue; }
          let sp = f.sp; if (f.slowT > 0) { f.slowT -= h; sp *= f.slowK; }
          f.d += sp * h; [f.x, f.y] = posAt(f.d);
          if (f.d >= total) { f.hp = 0; f.leak = true; G.lives -= f.boss ? 5 : 1; shake = 0.4; sfx('bump'); G.fx.push({ k: 'pop', x: f.x - 20, y: f.y, col: '#ff4040', t: 0, dur: 0.4, r: 40 }); }
        }
        G.foes = G.foes.filter(f => f.hp > 0);
        for (const t of G.towers) { t.cd -= h; if (t.kick > 0) t.kick -= h; if (t.cd <= 0 && fire(t)) t.cd = tStat(t, 'cd'); }
        for (const e of G.fx) e.t += h; G.fx = G.fx.filter(e => e.t < e.dur);
        if (G.lives <= 0 && !G.over) { G.over = true; G.lives = 0; endGame(false); return; }
      }
      if (shake > 0) shake = Math.max(0, shake - dt * 2);
      if (G.note) { G.note.t -= dt; if (G.note.t <= 0) G.note = null; }
    },
    draw() {
      const t = performance.now() / 1000;
      ctx.fillStyle = '#12101c'; ctx.fillRect(0, 0, W, H);
      ctx.save(); if (shake > 0) ctx.translate((Math.random() - 0.5) * 10 * shake, (Math.random() - 0.5) * 10 * shake);
      ctx.drawImage(mcv, 0, TDY, W, TDR * TDT);
      // 起點傳送門、終點水晶
      const [sx, sy] = posAt(0.45), [ex, ey] = posAt(total - 0.55);
      ctx.save(); ctx.translate(sx, sy); ctx.shadowColor = '#c060ff'; ctx.shadowBlur = 18; for (let i = 0; i < 3; i++) { ctx.strokeStyle = ['#e0a0ff', '#a050e0', '#6020a0'][i]; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(0, 0, 10 + i * 5, 20 - i * 2, t * (1 + i * 0.4), 0, 5); ctx.stroke(); } ctx.restore();
      ctx.save(); ctx.translate(ex, ey + Math.sin(t * 2) * 3); ctx.shadowColor = '#80e0ff'; ctx.shadowBlur = 20; const cg = ctx.createLinearGradient(-14, -26, 14, 22); cg.addColorStop(0, '#ffffff'); cg.addColorStop(0.5, G.lives > 6 ? '#60d0ff' : '#ff8080'); cg.addColorStop(1, '#2060c0'); ctx.fillStyle = cg; ctx.beginPath(); ctx.moveTo(0, -28); ctx.lineTo(15, -6); ctx.lineTo(0, 24); ctx.lineTo(-15, -6); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.2; ctx.stroke(); ctx.restore();
      // 游標與射程
      const cur = towerAt(G.cx, G.cy), ccx = (G.cx + 0.5) * TDT, ccy = TDY + (G.cy + 0.5) * TDT;
      const showR = cur ? tStat(cur, 'r') : G.sel >= 0 && tileFree(G.cx, G.cy) ? TD_TOWERS[G.sel].r : 0;
      if (showR) { ctx.save(); ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.setLineDash([6, 5]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(ccx, ccy, showR * TDT, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); }
      // 塔與怪物依 y 排序
      const ents = G.towers.map(tw => ({ y: TDY + (tw.y + 0.5) * TDT, tw })).concat(G.foes.map(f => ({ y: f.y, f }))).sort((a, b) => a.y - b.y);
      for (const e of ents) {
        if (e.tw) {
          const tw = e.tw, x = (tw.x + 0.5) * TDT, y = e.y, col = TYPES[tw.T.el].c;
          ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(x, y + 16, 19, 7, 0, 0, 7); ctx.fill();
          ctx.fillStyle = col; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.ellipse(x, y + 15, 17, 6, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
          drawMon(ctx, tw.T.ids[tw.lv], x, y - 6 - (tw.kick > 0 ? 4 : 0), 54 + tw.lv * 6, t, { still: true });
          for (let k = 0; k <= tw.lv; k++) { ctx.fillStyle = '#ffe040'; ctx.beginPath(); ctx.arc(x - tw.lv * 5 + k * 10, y + 20, 3, 0, 7); ctx.fill(); }
        } else {
          const f = e.f, sz = f.boss ? 92 : 46, bob = Math.sin(t * 8 + f.ph) * 2;
          ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.beginPath(); ctx.ellipse(f.x, f.y + (f.boss ? 24 : 14), sz * 0.3, sz * 0.1, 0, 0, 7); ctx.fill();
          drawMon(ctx, f.id, f.x, f.y - (f.boss ? 16 : 6) + bob, sz, t, { still: !f.boss, flash: f.flash > 0 ? 0.5 : 0 });
          if (f.armor) { ctx.save(); ctx.fillStyle = '#b8c0d0'; ctx.strokeStyle = '#3a4050'; ctx.lineWidth = 1; const ax = f.x - sz * 0.42, ay = f.y - sz * 0.25; ctx.beginPath(); ctx.moveTo(ax - 6, ay - 6); ctx.lineTo(ax + 6, ay - 6); ctx.lineTo(ax + 6, ay); ctx.quadraticCurveTo(ax, ay + 8, ax - 6, ay); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }
          if (f.regen) text('+', f.x + sz * 0.42, f.y - sz * 0.32, { size: 16, bold: true, align: 'center', color: '#60ff80' });
          if (f.slowT > 0) { ctx.fillStyle = 'rgba(140,220,255,0.35)'; ctx.beginPath(); ctx.arc(f.x, f.y - 6, sz * 0.36, 0, 7); ctx.fill(); }
          if (f.poisT > 0) { ctx.fillStyle = '#90e040'; ctx.beginPath(); ctx.arc(f.x + sz * 0.3, f.y - sz * 0.4 + Math.sin(t * 6) * 3, 3, 0, 7); ctx.fill(); }
          if (f.curseT > 0) { ctx.fillStyle = '#c060ff'; ctx.beginPath(); ctx.arc(f.x - sz * 0.3, f.y - sz * 0.4 + Math.cos(t * 6) * 3, 3, 0, 7); ctx.fill(); }
          if (f.stunT > 0) text('★', f.x, f.y - sz * 0.7, { size: 14, align: 'center', color: '#ffe040' });
          const bw = f.boss ? 70 : 30; ctx.fillStyle = '#201820'; ctx.fillRect(f.x - bw / 2, f.y - sz * 0.62, bw, 5); ctx.fillStyle = f.hp / f.max > 0.5 ? '#5ad060' : f.hp / f.max > 0.2 ? '#f0c030' : '#f04a3a'; ctx.fillRect(f.x - bw / 2, f.y - sz * 0.62, bw * Math.max(0, f.hp / f.max), 5);
        }
      }
      // 特效
      for (const e of G.fx) {
        const p = e.t / e.dur; ctx.save(); ctx.globalAlpha = 1 - p;
        if (e.k === 'shot') { ctx.strokeStyle = e.col; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.shadowColor = e.col; ctx.shadowBlur = 8; const x = e.x + (e.x2 - e.x) * p, y = e.y + (e.y2 - e.y) * p; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(e.x + (e.x2 - e.x) * Math.min(1, p + 0.35), e.y + (e.y2 - e.y) * Math.min(1, p + 0.35)); ctx.stroke(); }
        if (e.k === 'beam') { ctx.strokeStyle = e.col; ctx.lineWidth = e.w * (1 - p); ctx.shadowColor = '#ffffff'; ctx.shadowBlur = 14; ctx.beginPath(); ctx.moveTo(e.x, e.y); ctx.lineTo(e.x2, e.y2); ctx.stroke(); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.stroke(); }
        if (e.k === 'zap') { ctx.strokeStyle = '#ffffff'; ctx.shadowColor = e.col; ctx.shadowBlur = 10; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(e.x, e.y); for (let k = 1; k < 5; k++) ctx.lineTo(e.x + (e.x2 - e.x) * k / 5 + (Math.random() - 0.5) * 14, e.y + (e.y2 - e.y) * k / 5 + (Math.random() - 0.5) * 14); ctx.lineTo(e.x2, e.y2); ctx.stroke(); }
        if (e.k === 'ring') { ctx.strokeStyle = e.col; ctx.lineWidth = 4 * (1 - p) + 1; ctx.beginPath(); ctx.arc(e.x, e.y, e.r * (0.3 + p * 0.7), 0, 7); ctx.stroke(); ctx.fillStyle = e.col; ctx.globalAlpha = 0.18 * (1 - p); ctx.fill(); }
        if (e.k === 'pop') { ctx.fillStyle = e.col; for (let k = 0; k < 8; k++) { const a = k * 0.785; ctx.beginPath(); ctx.arc(e.x + Math.cos(a) * e.r * p, e.y + Math.sin(a) * e.r * p, 4 * (1 - p) + 1, 0, 7); ctx.fill(); } }
        if (e.k === 'num') text(e.s, e.x, e.y - p * 24, { size: 15, bold: true, align: 'center', color: e.col });
        ctx.restore();
      }
      ctx.save(); ctx.strokeStyle = tileFree(G.cx, G.cy) || cur ? '#ffffff' : '#ff6060'; ctx.lineWidth = 2.5; ctx.setLineDash([8, 6]); ctx.lineDashOffset = -t * 20; ctx.strokeRect(G.cx * TDT + 2, TDY + G.cy * TDT + 2, TDT - 4, TDT - 4); ctx.restore();
      ctx.restore();
      // 上方資訊列
      ctx.fillStyle = 'rgba(14,10,22,0.96)'; ctx.fillRect(0, 0, W, TDY); ctx.fillStyle = '#c8a050'; ctx.fillRect(0, TDY - 2, W, 2);
      text(map.n, 10, 9, { size: 19, bold: true, color: '#8ae0ff' }); text(DF.n, 96, 11, { size: 15, bold: true, color: DF.col });
      text(`第 ${G.wave} 波`, 130, 9, { size: 19, color: '#f4ead0' });
      text(`$ ${G.gold}`, 230, 9, { size: 19, bold: true, color: '#ffd77a' });
      text(`♥ ${G.lives}`, 340, 9, { size: 19, bold: true, color: G.lives > 6 ? '#ff8090' : '#ff3030' });
      if (!G.queue.length && !G.foes.length && !G.over) text(`${Math.ceil(G.gapT)} 秒後下一波・Shift 跳過`, 410, 12, { size: 13, color: "#c8bca0" });
      for (const [r, s] of [[btnSpeed, `速度 ×${G.speed}`], [btnMenu, '選單 X']]) { panel(r[0], r[1], r[2], r[3], { bg: 'rgba(40,30,60,0.95)' }); text(s, r[0] + r[2] / 2, r[1] + 6, { size: 16, align: 'center' }); }
      // 下方商店列
      ctx.fillStyle = 'rgba(14,10,22,0.96)'; ctx.fillRect(0, TDY + TDR * TDT, W, H - TDY - TDR * TDT); ctx.fillStyle = '#c8a050'; ctx.fillRect(0, TDY + TDR * TDT, W, 2);
      TD_TOWERS.forEach((T, i) => {
        const r = shopRect(i), on = G.sel === i, ok = G.gold >= T.cost;
        ctx.save(); if (on) { ctx.shadowColor = TYPES[T.el].c; ctx.shadowBlur = 14; }
        ctx.fillStyle = on ? 'rgba(70,56,100,0.98)' : 'rgba(34,26,50,0.95)'; ctx.strokeStyle = on ? '#ffffff' : TYPES[T.el].c; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(r[0], r[1], r[2], r[3], 8); ctx.fill(); ctx.stroke(); ctx.restore();
        ctx.globalAlpha = ok ? 1 : 0.4; drawMon(ctx, T.ids[0], r[0] + r[2] / 2, r[1] + 30, 50, t, { still: true }); ctx.globalAlpha = 1;
        text(T.n, r[0] + r[2] / 2, r[1] + 56, { size: 14, align: 'center', color: ok ? '#f4ead0' : '#776e66' });
        text('$' + T.cost, r[0] + r[2] / 2, r[1] + 73, { size: 14, bold: true, align: 'center', color: ok ? '#ffd77a' : '#776e66' });
      });
      if (G.sel >= 0) { const T = TD_TOWERS[G.sel]; panel(W / 2 - 230, TDY + 6, 460, 34, { bg: 'rgba(14,10,22,0.85)' }); text(`【${T.el}】${T.n}：${T.info}　點空地放置、X 取消`, W / 2, TDY + 14, { size: 15, align: 'center' }); }
      if (G.note) { ctx.save(); ctx.globalAlpha = Math.min(1, G.note.t * 2); text(G.note.s, W / 2, 210, { size: 34, bold: true, align: 'center', color: '#ffe080' }); ctx.restore(); }
      if (G.wave === 0) text('方向鍵或滑鼠移動游標　Z／點一下：放塔、升級　H：加速　X：選單', W / 2, TDY + TDR * TDT - 26, { size: 15, align: 'center', color: '#ffffff' });
    },
  };
  try { playMusic(map.song); } catch (e) {}
  return L;
}
