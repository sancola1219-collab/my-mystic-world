// ===== 主程式：遊戲狀態、地圖世界、選單、存檔 =====

const SAVE_KEY = 'my_mystic_world_save_v1';
let S = null;
let shake = 0;

function newState(name) {
  return {
    name, map: 'village', x: 4, y: 5, dir: 'down', party: [], box: [], bag: {}, money: 500,
    flags: {}, dex: { seen: {}, caught: {} }, badges: 0, respawn: { map: 'village', x: 3, y: 12 }, starter: null, mute: false,
  };
}

// ---- 狀態工具 ----
const flag = k => !!S.flags[k];
function setFlag(k) { S.flags[k] = true; }
function addItem(id, n) { S.bag[id] = (S.bag[id] || 0) + n; if (S.bag[id] <= 0) delete S.bag[id]; }
function seeMon(id) { S.dex.seen[id] = true; }
function addMon(m) {
  S.dex.seen[m.id] = true; S.dex.caught[m.id] = true;
  if (S.party.length < 6) { S.party.push(m); return 'party'; }
  S.box.push(m); return 'box';
}
function healParty() { for (const m of S.party) { m.hp = m.maxHp; m.status = null; for (const mv of m.moves) mv.pp = MOVES[mv.id].pp; } }
// ---- 遊戲提示 ----
async function tip(key, lines) {
  if (!S || S.hintsOff || flag('tip_' + key)) return;
  setFlag('tip_' + key);
  sfx('exclaim');
  await say(lines, { name: '💡 提示' });
}
function goal() {
  const g = [
    ['gotStarter', '去村子右上方（藍色屋頂）的星垣研究所，領取第一隻夥伴'],
    ['rival1', '從晨曦村北邊的出口出發'],
    ['badge1', '往北穿過甜光林道，到符燈鎮挑戰「符光試煉殿」（橘色大屋頂）'],
    ['rival2', '從符燈鎮東邊出發，穿過霧澤古道'],
    ['badge2', '在熔岩工堡挑戰「熔鋼試煉場」的赤鐵'],
    ['badge3', '從工堡北門穿過風旋山谷，到觀星鎮的觀星塔挑戰璃夜'],
    ['rival3', '從觀星鎮東邊進入深淵裂縫'],
    ['leader', '深入深淵裂縫，找到深淵教團的主教'],
    ['part1', '面對深淵之門前的巨顎方門獸（入口的小嵐可以幫你治療）'],
    ['badge4', '從觀星鎮北邊出發，在冰晶湖挑戰霜鈴試煉（雪音）'],
    ['bishop2', '往北進入玩具閣樓，追上主教厄蘭'],
    ['badge5', '在雷鳴高原挑戰雷鼓試煉（鼓雷）'],
    ['badge6', '在時鐘古殿深處挑戰時序守刻音'],
    ['bishop3', '前往天空聖域，阻止主教厄蘭'],
    ['finalEnd', '挑戰聖域頂端的幻紋始祖'],
  ];
  for (const [f, txt] of g) if (!flag(f)) return txt;
  return `收集全部 100 種幻靈！（目前 ${Object.keys(S.dex.caught).length} / 100）`;
}
const TIPS = [
  '按住 Shift 可以奔跑。', '在高草叢裡走動會遇到野生幻靈。', '橘色屋頂的「祈光亭」可以免費治療夥伴。',
  '對手體力越低、有異常狀態時，越容易收服。', '金紋靈符的捕捉率比一般靈符高。', '沒有出場的夥伴也能分到一半經驗值。',
  '幻靈升到一定等級會進化，變得更強！', '訓練家看到你時會主動挑戰，繞開他的視線就能避開。', '屬性相剋：火→木→水→火，光↔暗，鬥剋鋼與暗。',
  '傳說中有 4 隻傳說幻靈，分別藏在冰晶湖、雷鳴高原、天空聖域……', '圖鑑裡按 Z 可以看到幻靈的原畫。', '選單裡可以開關背景音樂、音效和提示。',
];
async function hintPage() {
  await say(['【目前目標】\n' + goal(), '【小技巧】\n' + TIPS[Math.floor(Math.random() * TIPS.length)], '【操作】方向鍵移動　Z 確定/調查　X 選單/取消\nShift 奔跑　H 查看目標　M 調整音量'], { name: '💡 提示' });
}

function stepBack() { if (S.prevX != null) { S.x = S.prevX; S.y = S.prevY; } }

function saveGame(silent) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); if (!silent) showToast('已存檔！'); } catch (e) { if (!silent) showToast('存檔失敗（瀏覽器不允許儲存）'); }
}
function loadGame() { try { const d = localStorage.getItem(SAVE_KEY); return d ? JSON.parse(d) : null; } catch (e) { return null; } }

// ---- 地圖預處理 ----
for (const id in MAPS) {
  const m = MAPS[id];
  m.w = Math.max(...m.rows.map(r => r.length));
  m.h = m.rows.length;
  m.rows = m.rows.map(r => r.padEnd(m.w, 'T'));
  m.doors = m.doors || {}; m.signs = m.signs || {}; m.npcs = m.npcs || []; m.triggers = m.triggers || []; m.exits = m.exits || [];
  // 每棟建築找出它的門，用門的屋頂顏色上色
  m.roofAt = {};
  const seen = new Set();
  for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) {
    const ch = m.rows[y][x];
    if ((ch !== 'H' && ch !== 'D') || seen.has(x + ',' + y)) continue;
    const comp = [], st = [[x, y]]; seen.add(x + ',' + y);
    let roof = '#8a5a3a';
    while (st.length) {
      const [cx, cy] = st.pop(); comp.push([cx, cy]);
      if (m.rows[cy][cx] === 'D' && m.doors[cx + ',' + cy]) roof = m.doors[cx + ',' + cy].roof || roof;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cx + dx, ny = cy + dy, k = nx + ',' + ny;
        if (nx < 0 || ny < 0 || nx >= m.w || ny >= m.h || seen.has(k)) continue;
        const c2 = m.rows[ny][nx];
        if (c2 === 'H' || c2 === 'D') { seen.add(k); st.push([nx, ny]); }
      }
    }
    for (const [cx, cy] of comp) m.roofAt[cx + ',' + cy] = roof;
  }
}

function tileAt(map, x, y) {
  if (x < 0 || y < 0 || x >= map.w || y >= map.h) return 'T';
  return map.rows[y][x];
}
function activeNpcs(map) { return map.npcs.filter(n => !n.cond || n.cond()); }
function npcAt(map, x, y) { return activeNpcs(map).find(n => n.x === x && n.y === y); }
function blocked(map, x, y) {
  const ch = tileAt(map, x, y);
  if (SOLID.has(ch) || ch === 'D') return true;
  if (x < 0 || y < 0 || x >= map.w || y >= map.h) return true;
  return !!npcAt(map, x, y);
}
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const trKey = (mapId, n) => 'tr_' + mapId + '_' + n.id;

// ---- 圖塊繪製 ----
const THEME = {
  green:    { g: '#6ab04c', g2: '#5a9e40', path: '#d8c08a', tree: '#2e7a32', tree2: '#1e5a24' },
  warm:     { g: '#8ab85a', g2: '#78a64a', path: '#e4cc94', tree: '#4a8a3a', tree2: '#2e6a2a' },
  swamp:    { g: '#4f7f5c', g2: '#43704f', path: '#9aa478', tree: '#2a5a40', tree2: '#1a4030' },
  lava:     { g: '#5a4a44', g2: '#4e403a', path: '#7a6a60', tree: '#3a3a3a', tree2: '#2a2a2a' },
  mountain: { g: '#8aa86a', g2: '#7a985a', path: '#c8b890', tree: '#5a7a4a', tree2: '#3a5a3a' },
  night:    { g: '#3e6a58', g2: '#345a4a', path: '#8a8aa8', tree: '#1e4a3a', tree2: '#123428' },
  abyss:    { g: '#1c1230', g2: '#241638', path: '#3a2a50', tree: '#3a1a5a', tree2: '#200a38' },
  ice:      { g: '#e4f0fa', g2: '#d4e6f4', path: '#b8cce0', tree: '#e8f4ff', tree2: '#3a6a5a', gc: '#8ab8d8', gh: '#ffffff', water: '#9ad4f4' },
  toy:      { g: '#d8b88a', g2: '#ccaa7c', path: '#e8d0a0', tree: '#5a8a3a', tree2: '#3a6a2a', gc: '#c8508a', gh: '#ffa0d0' },
  storm:    { g: '#5a6a58', g2: '#4e5e4c', path: '#8a8a78', tree: '#3a4a3a', tree2: '#2a3a2a', gc: '#3a5a3a', gh: '#e8e060' },
  temple:   { g: '#8a8070', g2: '#7e7464', path: '#b0a488', tree: '#4a5a3a', tree2: '#2a3a2a', gc: '#4a6a3a', gh: '#8ab060' },
  sky:      { g: '#fff4dc', g2: '#f8ecd0', path: '#ffe8a0', tree: '#ffffff', tree2: '#d8e8ff', gc: '#e8c060', gh: '#fff0a0', water: '#a8d0ff' },
};
function hash(x, y) { let h = x * 374761393 + y * 668265263; h = (h ^ (h >> 13)) * 1274126177; return ((h ^ (h >> 16)) >>> 0) / 4294967296; }

function drawTile(map, ch, tx, ty, sx, sy, t) {
  const th = THEME[map.theme] || THEME.green, T = TILE;
  const base = map.theme === 'lava' ? '#5a4a44' : th.g;
  const r = hash(tx, ty);
  ctx.fillStyle = (ch === 'X' || ch === 'x') ? (r > 0.5 ? '#1c1230' : '#20143a') : (r > 0.5 ? base : th.g2);
  ctx.fillRect(sx, sy, T, T);
  if (ch === '.' || ch === 'a') {
    if (r > 0.7) { ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(sx + r * 30, sy + 10 + r * 20, 3, 6); }
    return;
  }
  switch (ch) {
    case ',': case ';': case 'x': {
      const col = ch === ',' ? (th.gc || '#2f7a2a') : ch === ';' ? '#7a5a3a' : '#5a2a8a';
      const hi = ch === ',' ? (th.gh || '#7ac860') : ch === ';' ? '#c8783a' : '#a060e0';
      const sw = Math.sin(t * 2 + tx + ty) * 2;
      for (let i = 0; i < 4; i++) {
        const bx = sx + 6 + i * 10 + (hash(tx + i, ty) * 4), by = sy + T - 4;
        ctx.fillStyle = col;
        ctx.beginPath(); ctx.moveTo(bx - 5, by); ctx.lineTo(bx + sw, by - 30 - (i % 2) * 6); ctx.lineTo(bx + 5, by); ctx.fill();
        ctx.fillStyle = hi;
        ctx.beginPath(); ctx.moveTo(bx - 2, by - 6); ctx.lineTo(bx + sw, by - 26 - (i % 2) * 6); ctx.lineTo(bx + 2, by - 6); ctx.fill();
      }
      break;
    }
    case 'T': {
      ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(sx + 24, sy + 42, 18, 5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#5a3a20'; ctx.fillRect(sx + 20, sy + 28, 8, 14);
      ctx.fillStyle = th.tree2; ctx.beginPath(); ctx.arc(sx + 24, sy + 20, 19, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = th.tree; ctx.beginPath(); ctx.arc(sx + 21, sy + 17, 15, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.beginPath(); ctx.arc(sx + 17, sy + 12, 6, 0, Math.PI * 2); ctx.fill();
      break;
    }
    case '~': {
      if (map.theme === 'sky') { ctx.fillStyle = th.water; ctx.fillRect(sx, sy, T, T); ctx.fillStyle = 'rgba(255,255,255,0.85)'; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(sx + 10 + i * 14 + Math.sin(t + tx + i) * 3, sy + 24 + (i % 2) * 8, 12, 0, Math.PI * 2); ctx.fill(); } break; }
      ctx.fillStyle = th.water || (map.theme === 'swamp' ? '#2a6a78' : '#3a7ad0'); ctx.fillRect(sx, sy, T, T);
      ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 2;
      for (let i = 0; i < 2; i++) { const o = (t * 12 + i * 24 + tx * 7) % T; ctx.beginPath(); ctx.moveTo(sx + o - 8, sy + 14 + i * 20); ctx.quadraticCurveTo(sx + o, sy + 10 + i * 20, sx + o + 8, sy + 14 + i * 20); ctx.stroke(); }
      break;
    }
    case '=': ctx.fillStyle = th.path; ctx.fillRect(sx, sy, T, T); ctx.fillStyle = 'rgba(0,0,0,0.07)'; ctx.fillRect(sx + r * 30, sy + r * 36, 6, 4); break;
    case 'b': ctx.fillStyle = '#3a7ad0'; ctx.fillRect(sx, sy, T, T); ctx.fillStyle = '#9a6a3a'; ctx.fillRect(sx, sy + 2, T, T - 4); ctx.fillStyle = '#6a4220'; for (let i = 0; i < 4; i++) ctx.fillRect(sx + i * 12, sy + 2, 2, T - 4); break;
    case 'f': {
      const cs = ['#ff7aa0', '#ffe060', '#ffffff', '#a080ff'];
      for (let i = 0; i < 3; i++) { const fx = sx + 8 + hash(tx, ty + i) * 30, fy = sy + 8 + hash(tx + i, ty) * 30; ctx.fillStyle = cs[(tx + ty + i) % 4]; for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.arc(fx + Math.cos(k * 1.26) * 3, fy + Math.sin(k * 1.26) * 3, 2.4, 0, Math.PI * 2); ctx.fill(); } ctx.fillStyle = '#e0a020'; ctx.beginPath(); ctx.arc(fx, fy, 1.6, 0, Math.PI * 2); ctx.fill(); }
      break;
    }
    case 'S': ctx.fillStyle = '#5a3a20'; ctx.fillRect(sx + 21, sy + 24, 6, 20); ctx.fillStyle = '#b8864a'; ctx.fillRect(sx + 8, sy + 8, 32, 20); ctx.strokeStyle = '#5a3a20'; ctx.lineWidth = 2; ctx.strokeRect(sx + 8, sy + 8, 32, 20); ctx.fillStyle = '#5a3a20'; ctx.fillRect(sx + 13, sy + 14, 22, 2); ctx.fillRect(sx + 13, sy + 20, 16, 2); break;
    case '#': if (map.theme === 'toy') { const cs = ['#e85a5a', '#5a9ae8', '#f0c040', '#5ac06a']; ctx.fillStyle = cs[Math.floor(r * 4)]; ctx.fillRect(sx + 1, sy + 1, T - 2, T - 2); ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillRect(sx + 4, sy + 4, T - 8, 6); ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.font = 'bold 22px sans-serif'; ctx.fillText('ABCDEFG'[Math.floor(r * 7)], sx + 16, sy + 34); break; }
      ctx.fillStyle = map.theme === 'temple' ? '#5a5048' : '#4a4048'; ctx.fillRect(sx, sy, T, T); ctx.fillStyle = '#5e5460'; ctx.fillRect(sx + 2, sy + 2, 20, 20); ctx.fillRect(sx + 26, sy + 2, 20, 20); ctx.fillRect(sx + 12, sy + 26, 22, 20); break;
    case 'L': { ctx.fillStyle = '#c83a10'; ctx.fillRect(sx, sy, T, T); const gl = 0.5 + 0.5 * Math.sin(t * 3 + tx * 1.7 + ty); ctx.fillStyle = `rgba(255,200,40,${0.3 + gl * 0.4})`; ctx.beginPath(); ctx.arc(sx + 24 + Math.sin(tx) * 8, sy + 24, 10 + gl * 6, 0, Math.PI * 2); ctx.fill(); break; }
    case 'm': ctx.fillStyle = '#6a6458'; ctx.beginPath(); ctx.moveTo(sx, sy + T); ctx.lineTo(sx + 6, sy + 10); ctx.lineTo(sx + 22, sy + 2); ctx.lineTo(sx + 40, sy + 8); ctx.lineTo(sx + T, sy + T); ctx.fill(); ctx.fillStyle = '#8a8474'; ctx.beginPath(); ctx.moveTo(sx + 8, sy + 14); ctx.lineTo(sx + 22, sy + 6); ctx.lineTo(sx + 30, sy + 20); ctx.fill(); break;
    case 'C': { ctx.fillStyle = '#120a20'; ctx.fillRect(sx, sy, T, T); ctx.shadowColor = '#a050ff'; ctx.shadowBlur = 10; ctx.fillStyle = r > 0.5 ? '#6a2ab0' : '#4a1a8a'; ctx.beginPath(); ctx.moveTo(sx + 10, sy + T); ctx.lineTo(sx + 18, sy + 6 + r * 8); ctx.lineTo(sx + 26, sy + T); ctx.fill(); ctx.beginPath(); ctx.moveTo(sx + 24, sy + T); ctx.lineTo(sx + 34, sy + 16); ctx.lineTo(sx + 42, sy + T); ctx.fill(); ctx.shadowBlur = 0; break; }
    case 'G': { ctx.fillStyle = '#0a0410'; ctx.fillRect(sx, sy, T, T); const gl = 0.5 + 0.5 * Math.sin(t * 2 + ty); ctx.strokeStyle = `rgba(180,80,255,${0.4 + gl * 0.5})`; ctx.lineWidth = 2; ctx.strokeRect(sx + 4, sy + 4, T - 8, T - 8); ctx.beginPath(); ctx.arc(sx + 24, sy + 24, 8, 0, Math.PI * 2); ctx.stroke(); break; }
    case 'H': case 'D': {
      const roof = map.roofAt[tx + ',' + ty] || '#8a5a3a';
      const below = tileAt(map, tx, ty + 1), isWall = below !== 'H' && below !== 'D';
      if (isWall) {
        ctx.fillStyle = '#e8dcc0'; ctx.fillRect(sx, sy, T, T);
        ctx.fillStyle = '#c8b898'; ctx.fillRect(sx, sy + T - 6, T, 6);
        if (ch === 'D') { ctx.fillStyle = '#5a3a20'; ctx.beginPath(); ctx.roundRect(sx + 10, sy + 8, 28, T - 8, [12, 12, 0, 0]); ctx.fill(); ctx.fillStyle = '#ffd060'; ctx.beginPath(); ctx.arc(sx + 32, sy + 30, 2.5, 0, Math.PI * 2); ctx.fill(); }
        else { ctx.fillStyle = '#7ab0e0'; ctx.fillRect(sx + 12, sy + 12, 24, 18); ctx.strokeStyle = '#5a3a20'; ctx.lineWidth = 3; ctx.strokeRect(sx + 12, sy + 12, 24, 18); ctx.beginPath(); ctx.moveTo(sx + 24, sy + 12); ctx.lineTo(sx + 24, sy + 30); ctx.stroke(); }
      } else {
        ctx.fillStyle = roof; ctx.fillRect(sx, sy, T, T);
        ctx.fillStyle = 'rgba(0,0,0,0.18)'; for (let i = 0; i < 3; i++) ctx.fillRect(sx, sy + 14 + i * 16, T, 3);
        if (tileAt(map, tx, ty - 1) !== 'H') { ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillRect(sx, sy, T, 5); }
      }
      break;
    }
  }
}

// ---- 世界圖層 ----
const P = { mx: 0, my: 0, moving: false, from: null, prog: 0, frame: 0, exclaim: null };
let busy = 0;
async function run(fn) { busy++; try { await fn(); } catch (e) { console.error(e); } busy--; }

function worldLayer() {
  return {
    isWorld: true,
    update(dt) {
      const map = MAPS[S.map];
      if (P.moving) {
        const spd = (held.run ? 8 : 4.2) * dt;
        P.prog += spd;
        if (P.prog >= 1) { P.moving = false; P.prog = 0; P.frame++; arrive(); }
        return;
      }
      if (busy || topLayer() !== this) return;
      if (take('back')) { run(mainMenu); return; }
      if (take('hint')) { run(hintPage); return; }
      if (take('ok')) { run(interact); return; }
      for (const d of ['up', 'down', 'left', 'right']) {
        if (held[d]) {
          S.dir = d;
          const [dx, dy] = DIRS[d], nx = S.x + dx, ny = S.y + dy;
          if (tileAt(map, nx, ny) === 'D' && map.doors[nx + ',' + ny]) { sfx('door'); run(map.doors[nx + ',' + ny].run); held[d] = false; return; }
          if (!blocked(map, nx, ny) || isExit(map, nx, ny)) {
            S.prevX = S.x; S.prevY = S.y; S.x = nx; S.y = ny; P.moving = true; P.prog = 0; P.from = [S.prevX, S.prevY];
          } else if (performance.now() - (P.bumpT || 0) > 300) { P.bumpT = performance.now(); sfx('bump'); }
          break;
        }
      }
    },
    draw() {
      const map = MAPS[S.map], t = performance.now() / 1000;
      let px = S.x, py = S.y;
      if (P.moving) { px = P.from[0] + (S.x - P.from[0]) * P.prog; py = P.from[1] + (S.y - P.from[1]) * P.prog; }
      let camX = px * TILE - W / 2 + TILE / 2, camY = py * TILE - H / 2 + TILE / 2;
      camX = Math.max(0, Math.min(map.w * TILE - W, camX)); camY = Math.max(0, Math.min(map.h * TILE - H, camY));
      if (map.w * TILE < W) camX = (map.w * TILE - W) / 2;
      if (map.h * TILE < H) camY = (map.h * TILE - H) / 2;
      if (shake) { camX += (Math.random() - 0.5) * 12 * shake; camY += (Math.random() - 0.5) * 12 * shake; }
      ctx.fillStyle = map.theme === 'abyss' ? '#06030c' : map.theme === 'sky' ? '#a8d0ff' : '#1a2a1a'; ctx.fillRect(0, 0, W, H);
      const x0 = Math.floor(camX / TILE), y0 = Math.floor(camY / TILE);
      for (let ty = y0; ty <= y0 + VH + 1; ty++) for (let tx = x0; tx <= x0 + VW + 1; tx++) {
        if (tx < 0 || ty < 0 || tx >= map.w || ty >= map.h) continue;
        drawTile(map, map.rows[ty][tx], tx, ty, Math.round(tx * TILE - camX), Math.round(ty * TILE - camY), t);
      }
      // 人物（依 y 排序）
      const ents = activeNpcs(map).map(n => ({ n, x: n.px == null ? n.x : n.px, y: n.py == null ? n.y : n.py }));
      ents.push({ me: true, x: px, y: py });
      ents.sort((a, b) => a.y - b.y);
      for (const e of ents) {
        const sx = e.x * TILE - camX, sy = e.y * TILE - camY - 8;
        if (e.me) drawPerson(ctx, sx, sy, S.dir, { hair: '#3a2414', shirt: '#d03a3a', pants: '#2a3a6a', hat: '#e84a3a' }, P.moving ? Math.floor(P.prog * 2) + P.frame : 0);
        else if (e.n.boss) drawMon(ctx, 8, sx + TILE / 2 + 20, sy - 30, 190, t);
        else if (e.n.legend) drawMon(ctx, e.n.legend, sx + TILE / 2, sy + 4, 110, t);
        else drawPerson(ctx, sx, sy, e.n.dir, e.n.look, 0);
        if (e.n && P.exclaim === e.n) { panel(sx + 10, sy - 40, 28, 34); text('！', sx + 24, sy - 36, { size: 24, align: 'center', color: '#ff5a3a', bold: true }); }
      }
      // 目標提示
      if (!S.hintsOff && !busy) {
        ctx.save(); ctx.font = '16px ' + FONT;
        const g = '目標：' + goal(), gw = Math.min(W - 280, ctx.measureText(g).width + 30);
        ctx.globalAlpha = 0.88; panel(W - gw - 12, 12, gw, 36, { bg: 'rgba(14,10,22,0.8)' }); ctx.restore();
        ctx.save(); ctx.beginPath(); ctx.rect(W - gw - 2, 12, gw - 20, 36); ctx.clip();
        text(g, W - gw + 3, 21, { size: 16, color: '#ffe8a0' }); ctx.restore();
        text('H：提示', W - 14, 52, { size: 13, align: 'right', color: 'rgba(255,232,160,0.6)' });
      }
      // 地名
      if (P.mapShown && performance.now() - P.mapShown < 2200) {
        const a = Math.min(1, (2200 - (performance.now() - P.mapShown)) / 400);
        ctx.save(); ctx.globalAlpha = a; panel(20, 20, 220, 50); text(map.name, 130, 32, { size: 24, align: 'center', serif: true, bold: true, color: '#ffd77a' }); ctx.restore();
      }
    },
  };
}

function isExit(map, x, y) { return map.exits.some(e => x >= e.x && x < e.x + e.w && y >= e.y && y < e.y + e.h); }

function arrive() {
  const map = MAPS[S.map];
  const ex = map.exits.find(e => S.x >= e.x && S.x < e.x + e.w && S.y >= e.y && S.y < e.y + e.h);
  if (ex) { run(() => warp(ex.to, ex.tx + (S.x - ex.x) * (ex.w > 1 ? 1 : 0), ex.ty + (S.y - ex.y) * (ex.h > 1 ? 1 : 0))); return; }
  const tr = map.triggers.find(g => S.x >= g.x && S.x < g.x + g.w && S.y >= g.y && S.y < g.y + g.h);
  if (tr) { run(tr.run); return; }
  // 視線內的訓練家
  for (const n of activeNpcs(map)) {
    if (!n.trainer || flag(trKey(S.map, n)) || !n.sight) continue;
    const [dx, dy] = DIRS[n.dir];
    for (let k = 1; k <= n.sight; k++) {
      const x = n.x + dx * k, y = n.y + dy * k;
      if (x === S.x && y === S.y) { run(() => trainerEncounter(n, true)); return; }
      if (SOLID.has(tileAt(map, x, y)) || npcAt(map, x, y)) break;
    }
  }
  if (ENCOUNTER.has(tileAt(map, S.x, S.y)) && map.wild && !flag('tip_grass') && S.party.length) { run(() => tip('grass', ['這是高草叢！走在裡面可能會遇到野生幻靈。', '想避開戰鬥就走小路，想收服幻靈就多走幾步吧。'])); return; }
  if (ENCOUNTER.has(tileAt(map, S.x, S.y)) && map.wild && S.party.some(m => m.hp > 0) && Math.random() < 0.11) run(randomEncounter);
}

async function randomEncounter() {
  const tbl = MAPS[S.map].wild, tot = tbl.reduce((s, e) => s + e[3], 0);
  let r = Math.random() * tot, pick = tbl[0];
  for (const e of tbl) { r -= e[3]; if (r <= 0) { pick = e; break; } }
  const res = await wildBattle(makeMon(pick[0], rnd(pick[1], pick[2])));
  if (S.party.some(m => m.hp < m.maxHp * 0.3)) await tip('heal', ['隊伍裡有夥伴受了重傷。', '回到祈光亭（橘色屋頂）可以免費完全治療，也可以用背包裡的甜光露。']);
  if (res === 'lose') P.mapShown = performance.now();
}

async function warp(to, x, y) {
  await fadeOut(220);
  S.map = to; S.x = x; S.y = y; P.moving = false;
  playMusic(mapSong());
  P.mapShown = performance.now();
  await fadeIn(220);
  await maybeChapter();
  P.mapShown = performance.now();
  saveGame(true);
}

async function trainerEncounter(n, spotted) {
  const key = trKey(S.map, n);
  if (flag(key)) { await say(n.trainer.after, { name: n.name }); return; }
  if (spotted) {
    P.exclaim = n; sfx('exclaim'); await wait(600); P.exclaim = null;
    // 走到玩家面前
    const [dx, dy] = DIRS[n.dir];
    while (Math.abs(S.x - n.x) + Math.abs(S.y - n.y) > 1) {
      const sx = n.x, sy = n.y;
      await tween(180, p => { n.px = sx + dx * p; n.py = sy + dy * p; });
      n.x += dx; n.y += dy; n.px = n.py = null;
    }
    S.dir = { up: 'down', down: 'up', left: 'right', right: 'left' }[n.dir];
  }
  await say(n.trainer.before, { name: n.name });
  const r = await trainerBattle({ name: n.name, look: n.look, team: n.trainer.team, money: n.trainer.money, after: null });
  if (r === 'win') { setFlag(key); await say(n.trainer.after, { name: n.name }); }
  // 回到原位（避免擋路）
  const orig = MAPS[S.map].npcs.find(q => q === n);
  if (orig && orig._home) { n.x = orig._home[0]; n.y = orig._home[1]; }
}

async function interact() {
  const map = MAPS[S.map];
  const [dx, dy] = DIRS[S.dir], fx = S.x + dx, fy = S.y + dy;
  const n = npcAt(map, fx, fy);
  if (n) {
    if (!n.boss && !n.legend) n.dir = { up: 'down', down: 'up', left: 'right', right: 'left' }[S.dir];
    if (n.trainer) await trainerEncounter(n, false);
    else if (n.talk) await n.talk();
    return;
  }
  const k = fx + ',' + fy;
  if (tileAt(map, fx, fy) === 'S' && map.signs[k]) await say(map.signs[k]);
  else if (tileAt(map, fx, fy) === 'D' && map.doors[k]) await map.doors[k].run();
  else if (tileAt(map, fx, fy) === '~') await say('水面映著天空，波光粼粼。');
}

// 記錄 NPC 原位
for (const id in MAPS) for (const n of MAPS[id].npcs) n._home = [n.x, n.y];

// ---- 祈光亭 / 商店 ----
async function centerDoor(withShop) {
  const opts = ['治療夥伴', '靈匣（存取幻靈）'].concat(withShop ? ['購物'] : []).concat(['離開']);
  const c = await choose(opts, { title: '祈光亭', w: 300, x: W / 2 - 150, y: 120 });
  const pick = opts[c];
  if (pick === '治療夥伴') {
    healParty(); jingle('heal');
    S.respawn = { map: S.map, x: S.x, y: S.y };
    await say(['歡迎來到祈光亭。', '你的夥伴們沐浴在溫暖的光芒中……', '已經完全恢復了！祝你旅途平安。'], { name: '祈光使' });
    saveGame(true);
  } else if (pick === '靈匣（存取幻靈）') await boxMenu();
  else if (pick === '購物') await shop();
}

async function shop() {
  const list = ['potion', 'superPot', 'fullPot', 'cure', 'revive', 'charm', 'goldCharm'];
  while (true) {
    const c = await choose(list.map(id => (x, y, sel) => {
      text(ITEMS[id].n, x, y + 6, { size: 20, color: sel ? '#ffd77a' : '#f4ead0' });
      text(`$${ITEMS[id].price}`, x + 290, y + 6, { size: 19, align: 'right', color: '#c8bca0' });
    }), { title: `商店　持有金錢：$${S.money}`, w: 380, x: 40, y: 30, rowH: 38, desc: k => ITEMS[list[k]].d + `（持有 ${S.bag[list[k]] || 0}）` });
    if (c < 0) { await say('謝謝光臨！', { name: '店員' }); return; }
    const id = list[c];
    const q = await choose(['×1', '×5', '×10'], { title: '要買幾個？', w: 200, x: 440, y: 120 });
    if (q < 0) continue;
    const n = [1, 5, 10][q], cost = n * ITEMS[id].price;
    if (S.money < cost) { await say('錢不夠喔……', { name: '店員' }); continue; }
    S.money -= cost; addItem(id, n); sfx('ok');
    await say(`買了 ${ITEMS[id].n} ×${n}！`, { name: '店員' });
  }
}

async function boxMenu() {
  while (true) {
    const c = await choose(['存入幻靈', '領出幻靈', '離開'], { title: `靈匣（${S.box.length} 隻）`, w: 280, x: W / 2 - 140, y: 140 });
    if (c === 0) {
      if (S.party.length <= 1) { await say('隊伍至少要留一隻幻靈！'); continue; }
      const i = await partyMenu('pick', '要存入哪一隻？');
      if (i < 0) continue;
      if (S.party.filter((m, k) => k !== i && m.hp > 0).length === 0) { await say('至少要留一隻還能戰鬥的幻靈！'); continue; }
      const [m] = S.party.splice(i, 1); S.box.push(m);
      await say(`${monName(m)} 被存入靈匣了。`);
    } else if (c === 1) {
      if (!S.box.length) { await say('靈匣是空的。'); continue; }
      if (S.party.length >= 6) { await say('隊伍已經滿了！'); continue; }
      const i = await choose(S.box.map(m => `${monName(m)}　Lv${m.level}`), { title: '要領出哪一隻？', w: 340, x: W / 2 - 170, y: 40, rowH: 36 });
      if (i < 0) continue;
      const [m] = S.box.splice(i, 1); m.hp = m.maxHp; m.status = null; S.party.push(m);
      await say(`${monName(m)} 加入了隊伍！`);
    } else return;
  }
}

// ---- 選單 ----
async function mainMenu() {
  while (true) {
    const items = ['夥伴', '背包', '圖鑑', '提示', '存檔', S.musicOff ? '音樂：關' : '音樂：開', S.mute ? '音效：關' : '音效：開', S.hintsOff ? '提示框：關' : '提示框：開', '關閉'];
    const c = await choose(items, {
      title: `${S.name}　$${S.money}　印記 ${S.badges || 0}/6`, w: 300, x: W - 320, y: 20,
    });
    if (c === 0) { if (!S.party.length) { await say('你還沒有夥伴！'); continue; } await partyMenu('view'); }
    else if (c === 1) await bagMenu('field');
    else if (c === 2) await dexMenu();
    else if (c === 3) { await hintPage(); return; }
    else if (c === 4) { saveGame(); await wait(300); }
    else if (c === 5) S.musicOff = !S.musicOff;
    else if (c === 6) S.mute = !S.mute;
    else if (c === 7) S.hintsOff = !S.hintsOff;
    else return;
  }
}

function monRow(m, x, y, sel) {
  drawMon(ctx, m.id, x + 26, y + 30, 54, performance.now() / 1000, { still: !sel });
  text(monName(m), x + 64, y + 4, { size: 20, color: sel ? '#ffd77a' : m.hp > 0 ? '#f4ead0' : '#8a7a70' });
  text('Lv' + m.level, x + 240, y + 6, { size: 17, color: '#c8bca0' });
  if (m.status) text(STATUS_NAME[m.status], x + 300, y + 6, { size: 16, color: '#ff8a7a' });
  if (m.hp <= 0) text('昏厥', x + 300, y + 6, { size: 16, color: '#ff6a5a' });
  hpBar(x + 64, y + 36, 200, m.hp, m.maxHp);
  text(`${m.hp}/${m.maxHp}`, x + 360, y + 30, { size: 16, align: 'right', color: '#c8bca0' });
}

// mode: view / switch / force / pick / item
async function partyMenu(mode, title) {
  while (true) {
    const i = await choose(S.party.map(m => (x, y, sel) => monRow(m, x, y, sel)), {
      title: title || (mode === 'force' ? '請選擇下一隻上場的夥伴' : mode === 'switch' ? '要換哪一隻上場？' : mode === 'item' ? '要對誰使用？' : '夥伴'),
      w: 430, x: W / 2 - 215, y: 20, rowH: 66, cancel: mode !== 'force',
      start: mode === 'force' ? Math.max(0, S.party.findIndex(m => m.hp > 0)) : 0,
    });
    if (mode !== 'view' || i < 0) return i;
    const c = await choose(['查看能力', '移到第一位', '取消'], { w: 220, x: W / 2 + 225, y: 40 + i * 66 > H - 200 ? H - 200 : 40 + i * 66 });
    if (c === 0) await summary(S.party[i]);
    if (c === 1) { const [m] = S.party.splice(i, 1); S.party.unshift(m); }
  }
}

function summary(m) {
  return new Promise(res => {
    const L = pushLayer({
      update() { if (take('ok') || take('back')) { popLayer(L); res(); } },
      draw() {
        const t = performance.now() / 1000;
        ctx.fillStyle = 'rgba(8,5,14,0.96)'; ctx.fillRect(0, 0, W, H);
        panel(20, 20, 330, H - 40);
        drawMon(ctx, m.id, 185, 190, 220, t);
        text(monName(m), 185, 330, { size: 28, align: 'center', bold: true, serif: true, color: '#ffd77a' });
        if (m.nick) text(MONS[m.id].n, 185, 366, { size: 17, align: 'center', color: '#c8bca0' });
        MONS[m.id].t.forEach((ty, k, a) => typeBadge(ty, 185 - a.length * 30 + k * 60, 396, 54));
        text(`Lv ${m.level}　經驗 ${m.exp}`, 185, 436, { size: 18, align: 'center' });
        text(`下一級還需 ${expForLevel(m.level + 1) - m.exp}`, 185, 462, { size: 16, align: 'center', color: '#c8bca0' });
        panel(370, 20, W - 390, 170);
        const stats = [['HP', `${m.hp} / ${m.maxHp}`], ['攻擊', m.atk], ['防禦', m.def], ['速度', m.spd]];
        stats.forEach(([k, v], i) => { text(k, 400, 42 + i * 34, { size: 20, color: '#ffd77a' }); text(String(v), 600, 42 + i * 34, { size: 20, align: 'right' }); });
        text(m.status ? '狀態：' + STATUS_NAME[m.status] : '狀態：良好', 640, 42, { size: 18, color: '#c8bca0' });
        panel(370, 200, W - 390, H - 220);
        text('招式', 400, 214, { size: 20, color: '#ffd77a', bold: true });
        m.moves.forEach((mv, i) => {
          const M = MOVES[mv.id], y = 246 + i * 62;
          typeBadge(M.t, 400, y, 44);
          text(M.n, 456, y, { size: 20 });
          text(`威力 ${M.p || '—'}  PP ${mv.pp}/${M.pp}`, W - 40, y + 2, { size: 16, align: 'right', color: '#c8bca0' });
          text(M.d, 400, y + 28, { size: 15, color: '#b0a690' });
        });
      },
    });
  });
}

async function bagMenu(mode) {
  while (true) {
    const ids = Object.keys(S.bag).filter(id => S.bag[id] > 0);
    if (!ids.length) { await say('背包是空的。'); return null; }
    const c = await choose(ids.map(id => (x, y, sel) => {
      text(ITEMS[id].n, x, y + 6, { size: 20, color: sel ? '#ffd77a' : '#f4ead0' });
      text('×' + S.bag[id], x + 280, y + 6, { size: 19, align: 'right', color: '#c8bca0' });
    }), { title: '背包', w: 360, x: W / 2 - 180, y: 30, rowH: 38, desc: k => ITEMS[ids[k]].d });
    if (c < 0) return null;
    const id = ids[c], I = ITEMS[id];
    if (I.use === 'ball') {
      if (mode === 'battle') return { id };
      await say('靈符要在和野生幻靈戰鬥時使用。'); continue;
    }
    const tgt = await partyMenu('item');
    if (tgt < 0) continue;
    const m = S.party[tgt];
    const ok = I.use === 'heal' ? m.hp > 0 && m.hp < m.maxHp : I.use === 'cure' ? !!m.status : I.use === 'revive' ? m.hp <= 0 : false;
    if (!ok) { await say('現在使用沒有效果。'); continue; }
    if (mode === 'battle') return { id, target: tgt };
    addItem(id, -1); sfx('heal');
    if (I.use === 'heal') { const f = m.hp; m.hp = Math.min(m.maxHp, m.hp + I.v); await say(`${monName(m)} 回復了 ${m.hp - f} 點體力！`); }
    if (I.use === 'cure') { m.status = null; await say(`${monName(m)} 的異常狀態消失了！`); }
    if (I.use === 'revive') { m.hp = Math.floor(m.maxHp / 2); await say(`${monName(m)} 恢復了精神！`); }
  }
}

// ---- 圖鑑 ----
const posterCache = {};
function poster(id) {
  if (!posterCache[id]) { const im = new Image(); im.src = `assets/posters/${String(id).padStart(2, '0')}.jpg`; posterCache[id] = im; }
  return posterCache[id];
}

async function dexMenu() {
  const ids = Object.keys(MONS).map(Number);
  let start = 0;
  while (true) {
    const caught = Object.keys(S.dex.caught).length, seen = Object.keys(S.dex.seen).length;
    const i = await choose(ids.map(id => (x, y, sel) => {
      const s = S.dex.seen[id], c = S.dex.caught[id];
      if (s) drawMon(ctx, id, x + 50, y + 44, 80, performance.now() / 1000, { still: !sel, alpha: c ? 1 : 0.45 });
      else text('？', x + 50, y + 22, { size: 40, align: 'center', color: '#5a5060' });
      text(`No.${String(id).padStart(2, '0')}`, x + 4, y + 2, { size: 13, color: '#a09080' });
      text(s ? MONS[id].n : '？？？', x + 50, y + 92, { size: 15, align: 'center', color: sel ? '#ffd77a' : '#e4dac0' });
      if (c) { ctx.fillStyle = '#ffd040'; ctx.beginPath(); ctx.arc(x + 96, y + 10, 5, 0, Math.PI * 2); ctx.fill(); }
    }), { title: `幻靈圖鑑　看過 ${seen}　捕捉 ${caught} / ${ids.length}　（↑↓ 捲動）`, w: W - 40, x: 20, y: 10, cols: 5, rowH: 120, start, maxRows: 4 });
    if (i < 0) return;
    start = i;
    if (S.dex.seen[ids[i]]) await dexDetail(ids[i]);
  }
}

function dexDetail(id) {
  const M = MONS[id];
  return new Promise(res => {
    let showPoster = false;
    const img = poster(id);
    const L = pushLayer({
      update() {
        if (take('ok') && id <= 20) showPoster = !showPoster;
        if (take('back')) { if (showPoster) showPoster = false; else { popLayer(L); res(); } }
      },
      draw() {
        const t = performance.now() / 1000;
        ctx.fillStyle = 'rgba(8,5,14,0.97)'; ctx.fillRect(0, 0, W, H);
        if (showPoster) {
          if (img.complete && img.naturalWidth) {
            const s = Math.min((W - 40) / img.naturalWidth, (H - 40) / img.naturalHeight);
            const w = img.naturalWidth * s, h = img.naturalHeight * s;
            ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
          } else text('找不到原畫圖片', W / 2, H / 2, { size: 22, align: 'center' });
          return;
        }
        panel(20, 20, 340, H - 40);
        ctx.fillStyle = 'rgba(255,215,122,0.08)'; ctx.beginPath(); ctx.arc(190, 220, 130, 0, Math.PI * 2); ctx.fill();
        drawMon(ctx, id, 190, 220, id === 8 ? 240 : 220, t);
        text(`No.${String(id).padStart(2, '0')}`, 40, 36, { size: 18, color: '#c8bca0' });
        text(M.n, 190, 380, { size: 32, align: 'center', bold: true, serif: true, color: '#ffd77a' });
        M.t.forEach((ty, k, a) => typeBadge(ty, 190 - a.length * 30 + k * 60, 428, 54));
        text(S.dex.caught[id] ? '★ 已捕捉' : '尚未捕捉', 190, 470, { size: 18, align: 'center', color: S.dex.caught[id] ? '#ffd040' : '#8a8070' });
        panel(380, 20, W - 400, H - 40);
        const rows = [['身高', M.h], ['體重', M.w], ['棲息地', M.hab]];
        rows.forEach(([k, v], i) => { text(k, 410, 46 + i * 36, { size: 19, color: '#ffd77a' }); text(v, 500, 46 + i * 36, { size: 19 }); });
        wrapText(M.desc, W - 460, 19).forEach((ln, i) => text(ln, 410, 166 + i * 28, { size: 19, color: '#e4dac0' }));
        text('招式', 410, 250, { size: 19, color: '#ffd77a', bold: true });
        M.learn.forEach(([lv, mid], i) => {
          const y = 284 + i * 30;
          if (y > H - 80) return;
          text(`Lv${lv}`, 410, y, { size: 16, color: '#a09080' });
          ctx.fillStyle = TYPES[MOVES[mid].t].c; ctx.fillRect(470, y + 3, 5, 18);
          text(MOVES[mid].n, 484, y, { size: 17 });
        });
        if (M.evo) text(`Lv${M.evo.lv} 進化 → ${MONS[M.evo.to].n}`, 650, 250, { size: 16, color: '#8ad0ff' });
        text(id <= 20 ? 'Z：查看原畫　X：返回' : 'X：返回', W - 40, H - 56, { size: 17, align: 'right', color: '#ffd77a' });
      },
    });
  });
}

// ---- 標題畫面 ----
async function titleScreen() {
  const saved = loadGame();
  const t0 = performance.now();
  playMusic('title');
  const L = pushLayer({
    update() {},
    draw() {
      const t = (performance.now() - t0) / 1000;
      const g = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, 600);
      g.addColorStop(0, '#2a1a3a'); g.addColorStop(1, '#05030a');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 80; i++) { ctx.globalAlpha = 0.3 + 0.5 * Math.abs(Math.sin(t + i)); ctx.fillStyle = '#ffe8a0'; ctx.fillRect((i * 173) % W, (i * 97) % H, 2, 2); }
      ctx.globalAlpha = 1;
      const ids = [14, 6, 7, 1, 15, 17, 12, 5, 19, 11, 3, 13];
      ids.forEach((id, i) => { const a = t * 0.25 + i / ids.length * Math.PI * 2; drawMon(ctx, id, W / 2 + Math.cos(a) * 320, 300 + Math.sin(a) * 110, 76, t); });
      drawMon(ctx, 8, W / 2, 330, 200, t, { alpha: 0.9 });
      ctx.save(); ctx.shadowColor = '#ffb040'; ctx.shadowBlur = 24;
      text('我的神奇世界', W / 2, 50, { size: 64, bold: true, serif: true, align: 'center', color: '#ffd77a' });
      ctx.restore();
      text('～ 幻紋大陸的靈契師 ～', W / 2, 136, { size: 22, align: 'center', serif: true, color: '#e8c890' });
      text('方向鍵 移動　Z 確定　X 取消/選單　Shift 奔跑　H 提示　M 音量', W / 2, H - 34, { size: 16, align: 'center', color: '#a09080' });
    },
  });
  const opts = saved ? ['繼續冒險', '新的冒險'] : ['新的冒險'];
  const c = await choose(opts, { w: 240, x: W / 2 - 120, y: H - 170, cancel: false });
  if (opts[c] === '繼續冒險') { S = saved; if (!S.gender) await chooseGender(true); }
  else {
    if (saved) { const k = await choose(['確定重新開始', '取消'], { title: '舊的存檔會被覆蓋！', w: 300, x: W / 2 - 150, y: 200, cancel: false }); if (k !== 0) { popLayer(L); return titleScreen(); } }
    const n = prompt('請輸入你的名字（最多 6 個字）', '旅人');
    S = newState((n && n.trim()) ? n.trim().slice(0, 6) : '旅人');
    await chooseGender();
  }
  await fadeOut(400);
  popLayer(L);
  pushLayer(worldLayer());
  playMusic(mapSong());
  P.mapShown = performance.now();
  await fadeIn(400);
  if (!flag('intro')) {
    setFlag('intro');
    await maybeChapter();
    await run(async () => {
      await say(['這裡是「幻紋大陸」。', '人們和神奇的生物「幻靈」一起生活著。', '和幻靈締結契約、並肩冒險的人，被稱為「靈契師」。', `而你——${S.name}，今天就要踏上成為靈契師的旅程！`]);
      await say(['早安！今天是你成為靈契師的日子！', '星垣博士在村子右上方的研究所等你喔。'], { name: '媽媽' });
    });
    saveGame(true);
  }
}

// ---- 主迴圈 ----
let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  updateTweens(now);
  const top = topLayer();
  if (top) top.update(dt);
  // 世界層即使不在最上層也要讓走路動畫跑完
  const world = layers.find(l => l.isWorld);
  if (world && world !== top && P.moving) world.update(dt);
  let startAt = 0;
  for (let i = layers.length - 1; i >= 0; i--) if (layers[i].full) { startAt = i; break; }
  ctx.clearRect(0, 0, W, H);
  for (let i = startAt; i < layers.length; i++) layers[i].draw();
  drawToast();
  if (fade > 0) { ctx.fillStyle = `rgba(0,0,0,${fade})`; ctx.fillRect(0, 0, W, H); }
  pressed.length = 0;
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
titleScreen();
