// ===== 擴充：5 個招式、更多道具、任務、世界地圖傳送、更多劇情 =====
// 這個檔案在 main.js 之後載入，會覆蓋同名的舊函式。

// ---------- 5 個招式 ----------
const MAX_MOVES = 5;

function fillMoves(m) {
  const known = new Set(m.moves.map(x => x.id));
  const add = id => { if (m.moves.length < MAX_MOVES && MOVES[id] && !known.has(id)) { known.add(id); m.moves.push({ id, pp: MOVES[id].pp }); } };
  const learn = MONS[m.id].learn.filter(([l]) => l <= m.level).map(([, mv]) => mv).reverse();
  learn.forEach(add);
  for (const t of MONS[m.id].t) {
    const tm = TYPE_MOVES[t];
    add(tm[0][0]); add(tm[3][0]);
    if (m.level >= 18) add(tm[1][0]);
    if (m.level >= 38) add(tm[2][0]);
  }
  add('tackle'); add('growl'); add('struggle');
}

function makeMon(id, level) {
  const m = { id, level, exp: expForLevel(level), status: null, moves: [] };
  calcStats(m);
  m.hp = m.maxHp;
  const learnable = MONS[id].learn.filter(([l]) => l <= level).map(([, mv]) => mv);
  m.moves = [...new Set(learnable)].slice(-MAX_MOVES).map(mv => ({ id: mv, pp: MOVES[mv].pp }));
  fillMoves(m);
  return m;
}

// 原畫怪物補第 5、6 個可學的招式
for (let id = 1; id <= 20; id++) {
  const L = MONS[id].learn, have = new Set(L.map(([, m]) => m));
  const [t1, t2] = MONS[id].t, extra = [[20, TYPE_MOVES[t1][1][0]], [32, TYPE_MOVES[t2 || t1][1][0]], [42, TYPE_MOVES[t1][2][0]]];
  for (const [lv, mv] of extra) if (!have.has(mv)) { L.push([lv, mv]); have.add(mv); }
  L.sort((a, b) => a[0] - b[0]);
}

async function learnMove(m, mid) {
  if (m.moves.some(x => x.id === mid)) return;
  if (m.moves.length < MAX_MOVES) { m.moves.push({ id: mid, pp: MOVES[mid].pp }); await say(`${monName(m)} 學會了「${MOVES[mid].n}」！`); return; }
  await say([`${monName(m)} 想學習「${MOVES[mid].n}」，`, `但是已經學會 ${MAX_MOVES} 個招式了。要忘記哪一個招式呢？`]);
  const opts = m.moves.map(x => MOVES[x.id].n).concat(['放棄學習「' + MOVES[mid].n + '」']);
  const c = await choose(opts, { title: '要忘記哪個招式？', w: 380, x: W / 2 - 190, y: 40, cancel: false, desc: k => k < MAX_MOVES ? MOVES[m.moves[k].id].d : MOVES[mid].d });
  if (c < MAX_MOVES) { const old = MOVES[m.moves[c].id].n; m.moves[c] = { id: mid, pp: MOVES[mid].pp }; await say(`${monName(m)} 忘記了「${old}」，學會了「${MOVES[mid].n}」！`); }
  else await say(`${monName(m)} 沒有學習「${MOVES[mid].n}」。`);
}

function chooseMove(m) {
  const items = m.moves.map(mv => (x, y, sel) => {
    const M = MOVES[mv.id];
    ctx.fillStyle = TYPES[M.t].c; ctx.fillRect(x - 4, y + 7, 5, 24);
    text(M.n, x + 8, y + 6, { size: 20, color: mv.pp > 0 ? (sel ? '#ffd77a' : '#f4ead0') : '#776e66' });
    text(`${mv.pp}/${M.pp}`, x + 300, y + 9, { size: 16, align: 'right', color: '#c8bca0' });
  });
  return choose(items, {
    x: 16, y: H - 262, w: W - 32, cols: 2, rowH: 40, title: '選擇招式　（X 返回）',
    desc: k => {
      const M = MOVES[m.moves[k].id], eff = typeMult(M.t, MONS[B.foe().id].t);
      const effTxt = M.p ? (eff > 1 ? '　▲效果絕佳' : eff < 1 ? '　▼效果不好' : '') : '';
      return `【${M.t}】威力 ${M.p || '—'}　命中 ${M.a}${effTxt}\n${M.d}`;
    },
  });
}

// ---------- 道具 ----------
Object.assign(ITEMS, {
  revive:     { n: '復甦羽', price: 1200, d: '讓昏厥的夥伴復活，回復一半體力。', use: 'revive', v: 0.5 },
  maxRevive:  { n: '大復甦羽', price: 3000, d: '讓昏厥的夥伴復活，體力全滿。', use: 'revive', v: 1 },
  elixir:     { n: '萬靈藥', price: 1500, d: '體力全滿並解除所有異常狀態。', use: 'elixir' },
  ppFruit:    { n: '靈力果', price: 600, d: '回復一隻夥伴所有招式的 PP。', use: 'pp' },
  candy:      { n: '經驗糖', price: 2500, d: '讓一隻夥伴立刻升 1 級。', use: 'candy' },
  atkCharm:   { n: '力量符', price: 400, d: '戰鬥中使用，大幅提升攻擊。', use: 'buff', stat: 'atk' },
  defCharm:   { n: '守護符', price: 400, d: '戰鬥中使用，大幅提升防禦。', use: 'buff', stat: 'def' },
  spdCharm:   { n: '疾風符', price: 400, d: '戰鬥中使用，大幅提升速度。', use: 'buff', stat: 'spd' },
  smoke:      { n: '煙霧彈', price: 300, d: '必定能從野生幻靈的戰鬥中逃走。', use: 'smoke' },
  lamp:       { n: '祈光燈', price: 4000, d: '全隊體力全滿、解除異常，連昏厥的夥伴都會復活。', use: 'lamp' },
  moonCharm:  { n: '月光靈符', price: 1200, d: '捕捉率很高的靈符。', use: 'ball', v: 2.6 },
  letter:     { n: '信件', price: 0, d: '要交給霧澤古道撐篙老人的信。', use: 'key' },
});
const ITEM_ORDER = ['potion', 'superPot', 'fullPot', 'elixir', 'cure', 'revive', 'maxRevive', 'lamp', 'ppFruit', 'candy', 'atkCharm', 'defCharm', 'spdCharm', 'smoke', 'charm', 'goldCharm', 'moonCharm', 'starCharm', 'letter'];

function canUse(I, m) {
  switch (I.use) {
    case 'heal': return m.hp > 0 && m.hp < m.maxHp;
    case 'cure': return m.hp > 0 && !!m.status;
    case 'revive': return m.hp <= 0;
    case 'elixir': return m.hp > 0 && (m.hp < m.maxHp || !!m.status);
    case 'pp': return m.moves.some(x => x.pp < MOVES[x.id].pp);
    case 'candy': return m.level < LEVEL_CAP;
  }
  return false;
}
function applyItem(I, m) {
  switch (I.use) {
    case 'heal': { const f = m.hp; m.hp = Math.min(m.maxHp, m.hp + I.v); return `${monName(m)} 回復了 ${m.hp - f} 點體力！`; }
    case 'cure': m.status = null; return `${monName(m)} 的異常狀態消失了！`;
    case 'revive': m.hp = Math.max(1, Math.floor(m.maxHp * I.v)); m.status = null; return `${monName(m)} 恢復了精神！`;
    case 'elixir': m.hp = m.maxHp; m.status = null; return `${monName(m)} 完全恢復了！`;
    case 'pp': for (const x of m.moves) x.pp = MOVES[x.id].pp; return `${monName(m)} 的招式 PP 全部恢復了！`;
  }
  return '';
}
function lampAll() { for (const m of S.party) { m.hp = m.maxHp; m.status = null; } }

// 一次吃很多顆經驗糖：直接升到目標等級，只顯示一次訊息
async function levelUpMany(m, n) {
  const from = m.level, to = Math.min(LEVEL_CAP, from + n), oldMax = m.maxHp;
  m.level = to; m.exp = Math.max(m.exp, expForLevel(to));
  calcStats(m); m.hp = Math.max(0, m.hp) + m.maxHp - oldMax;
  jingle('level');
  await say(`${monName(m)} 從 Lv${from} 升到了 Lv${to}！（用了 ${to - from} 顆經驗糖）`);
  for (const [lv, mid] of MONS[m.id].learn) if (lv > from && lv <= to) await learnMove(m, mid);
  let evo, k = 0;
  while ((evo = MONS[m.id].evo) && m.level >= evo.lv && m.hp > 0 && k++ < 5) await evolve(m, evo.to);
}
async function levelUp(m) {
  const oldMax = m.maxHp;
  m.level++; m.exp = Math.max(m.exp, expForLevel(m.level));
  calcStats(m); m.hp = Math.max(0, m.hp) + m.maxHp - oldMax;
  jingle('level');
  await say(`${monName(m)} 升到了 Lv${m.level}！`);
  for (const [lv, mid] of MONS[m.id].learn) if (lv === m.level) await learnMove(m, mid);
  const evo = MONS[m.id].evo;
  if (evo && m.level >= evo.lv && m.hp > 0) await evolve(m, evo.to);
}

async function bagMenu(mode) {
  while (true) {
    const ids = Object.keys(S.bag).filter(id => S.bag[id] > 0 && ITEMS[id]).sort((a, b) => ITEM_ORDER.indexOf(a) - ITEM_ORDER.indexOf(b));
    if (!ids.length) { await say('背包是空的。'); return null; }
    const c = await choose(ids.map(id => (x, y, sel) => {
      text(ITEMS[id].n, x, y + 6, { size: 20, color: sel ? '#ffd77a' : '#f4ead0' });
      text('×' + S.bag[id], x + 280, y + 6, { size: 19, align: 'right', color: '#c8bca0' });
    }), { title: '背包', w: 360, x: W / 2 - 180, y: 20, rowH: 38, maxRows: 10, desc: k => ITEMS[ids[k]].d });
    if (c < 0) return null;
    const id = ids[c], I = ITEMS[id];
    if (I.use === 'key') { await say(I.d); continue; }
    if (I.use === 'ball') { if (mode === 'battle') return { id }; await say('靈符要在和野生幻靈戰鬥時使用。'); continue; }
    if (I.use === 'buff' || I.use === 'smoke') { if (mode === 'battle') return { id }; await say('這個道具只能在戰鬥中使用。'); continue; }
    if (I.use === 'lamp') {
      if (mode === 'battle') return { id };
      addItem(id, -1); lampAll(); jingle('heal');
      await say('祈光燈照亮了全隊！所有夥伴都完全恢復了！'); continue;
    }
    if (I.use === 'candy' && mode === 'battle') { await say('戰鬥中不能使用經驗糖。'); continue; }
    const tgt = await partyMenu('item');
    if (tgt < 0) continue;
    const m = S.party[tgt];
    if (!canUse(I, m)) { await say('現在使用沒有效果。'); continue; }
    if (mode === 'battle') return { id, target: tgt };
    if (I.use === 'candy') {
      const have = S.bag[id] || 0, room = LEVEL_CAP - m.level, all = Math.min(have, room);
      let n = 1;
      if (all > 1) {
        const q = await choose(['用 1 顆', `全部用完（${all} 顆，升到 Lv${m.level + all}）`, '自己選數量', '取消'], { title: `要給 ${monName(m)} 吃幾顆經驗糖？（持有 ${have}）`, w: 460, x: W / 2 - 230, y: 200 });
        if (q < 0 || q === 3) continue;
        if (q === 1) n = all;
        if (q === 2 && all <= 2) n = all;
        else if (q === 2) {
          const opts = [2, 5, 10, 20, 50, 100].filter(v => v < all);
          const k = await choose(opts.map(v => `${v} 顆（升到 Lv${m.level + v}）`), { title: '要用幾顆？', w: 360, x: W / 2 - 180, y: 200 });
          if (k < 0) continue;
          n = opts[k];
        }
      }
      addItem(id, -n);
      if (n === 1) await levelUp(m); else await levelUpMany(m, n);
      continue;
    }
    addItem(id, -1);
    sfx('heal');
    await say(applyItem(I, m));
  }
}

async function useBattleItem(act) {
  const I = ITEMS[act.id];
  if (I.use === 'ball') {
    if (B.trainer) { await msg('不能捕捉別人的幻靈！'); return 'cancel'; }
    addItem(act.id, -1);
    return await throwCharm(act.id);
  }
  if (I.use === 'smoke') {
    if (B.trainer || B.boss) { await msg('這場戰鬥沒辦法逃跑！'); return 'cancel'; }
    addItem(act.id, -1); sfx('escape');
    await msg('煙霧瀰漫……順利逃走了！');
    return 'fled';
  }
  if (I.use === 'buff') {
    addItem(act.id, -1);
    await msg(`使用了 ${I.n}！`);
    await changeStats('p', { [I.stat]: 2 });
    return 'ok';
  }
  if (I.use === 'lamp') {
    addItem(act.id, -1); lampAll(); B.conf.p = 0; sfx('heal');
    sparkleUp(POS.p.x, POS.p.y, '#ffe080');
    await msg('祈光燈照亮了全隊！所有夥伴都完全恢復了！');
    return 'ok';
  }
  const target = S.party[act.target];
  addItem(act.id, -1);
  if (target === B.me() && (I.use === 'elixir' || I.use === 'cure')) B.conf.p = 0;
  sfx('heal');
  await msg(applyItem(I, target));
  return 'ok';
}

async function shop() {
  const list = ['potion', 'superPot', 'fullPot', 'elixir', 'cure', 'revive', 'maxRevive', 'lamp', 'ppFruit', 'candy', 'atkCharm', 'defCharm', 'spdCharm', 'smoke', 'charm', 'goldCharm', 'moonCharm', 'genesisCharm'];
  while (true) {
    const c = await choose(list.map(id => (x, y, sel) => {
      text(ITEMS[id].n, x, y + 6, { size: 20, color: sel ? '#ffd77a' : '#f4ead0' });
      text(`$${ITEMS[id].price}`, x + 300, y + 6, { size: 19, align: 'right', color: '#c8bca0' });
    }), { title: `商店　持有金錢：$${S.money}`, w: 400, x: 30, y: 20, rowH: 36, maxRows: 10, desc: k => ITEMS[list[k]].d + `（持有 ${S.bag[list[k]] || 0}）` });
    if (c < 0) { await say('謝謝光臨！', { name: '店員' }); return; }
    const id = list[c];
    const q = await choose(['×1', '×5', '×10'], { title: '要買幾個？', w: 200, x: 460, y: 120 });
    if (q < 0) continue;
    const n = [1, 5, 10][q], cost = n * ITEMS[id].price;
    if (S.money < cost) { await say('錢不夠喔……', { name: '店員' }); continue; }
    S.money -= cost; addItem(id, n); sfx('ok');
    await say(`買了 ${ITEMS[id].n} ×${n}！`, { name: '店員' });
  }
}

// ---------- 新的遊戲狀態、讀檔升級 ----------
function newState(name) {
  return {
    name, map: 'village', x: 4, y: 5, dir: 'down', party: [], box: [], bag: {}, money: 2000,
    flags: {}, dex: { seen: {}, caught: {} }, badges: 0, respawn: { map: 'village', x: 3, y: 12 }, starter: null, mute: false,
    quests: {}, stats: { wild: 0 }, visited: { village: true },
  };
}
function migrate() {
  S.quests = S.quests || {}; S.stats = S.stats || { wild: 0 }; S.visited = S.visited || {};
  S.visited[S.map] = true;
  if (!S.flags.money2000) { S.flags.money2000 = true; if (S.money < 2000) S.money = 2000; }
  for (const m of S.party.concat(S.box)) fillMoves(m);
  S._mig = true;
}

// ---------- 野外：遇怪率提高、打贏有零錢 ----------
const ENCOUNTER_RATE = 0.25;
function arrive() {
  const map = MAPS[S.map];
  const ex = map.exits.find(e => S.x >= e.x && S.x < e.x + e.w && S.y >= e.y && S.y < e.y + e.h);
  if (ex) { run(() => warp(ex.to, ex.tx + (S.x - ex.x) * (ex.w > 1 ? 1 : 0), ex.ty + (S.y - ex.y) * (ex.h > 1 ? 1 : 0))); return; }
  const tr = map.triggers.find(g => S.x >= g.x && S.x < g.x + g.w && S.y >= g.y && S.y < g.y + g.h);
  if (tr) { run(tr.run); return; }
  for (const n of activeNpcs(map)) {
    if (!n.trainer || flag(trKey(S.map, n)) || !n.sight) continue;
    const [dx, dy] = DIRS[n.dir];
    for (let k = 1; k <= n.sight; k++) {
      const x = n.x + dx * k, y = n.y + dy * k;
      if (x === S.x && y === S.y) { run(() => trainerEncounter(n, true)); return; }
      if (SOLID.has(tileAt(map, x, y)) || npcAt(map, x, y)) break;
    }
  }
  const grass = ENCOUNTER.has(tileAt(map, S.x, S.y)) && map.wild;
  if (grass && !flag('tip_grass') && S.party.length) { run(() => tip('grass', ['這是高草叢！走在裡面很常遇到野生幻靈。', '想避開戰鬥就走小路，想收服幻靈就多走幾步吧。'])); return; }
  if (grass && S.party.some(m => m.hp > 0) && Math.random() < ENCOUNTER_RATE) run(randomEncounter);
}

async function wildBattle(mon, opt = {}) {
  seeMon(mon.id);
  const r = await runBattle({ wild: true, boss: !!opt.boss, foeTeam: [mon] });
  if (r === 'win' || r === 'caught') {
    S.stats.wild++;
    if (r === 'win') { const g = mon.level * 12 + 20; S.money += g; showToast(`撿到了 $${g}！`); }
  }
  return r;
}

async function warp(to, x, y) {
  await fadeOut(220);
  S.map = to; S.x = x; S.y = y; P.moving = false;
  S.visited[to] = true;
  playMusic(mapSong());
  P.mapShown = performance.now();
  await fadeIn(220);
  await maybeChapter();
  P.mapShown = performance.now();
  saveGame(true);
}

// ---------- 世界地圖與傳送 ----------
const WORLD = {
  village:  { p: [110, 500], spawn: [9, 7] },   route1: { p: [110, 405], spawn: [9, 10] },
  town2:    { p: [110, 310], spawn: [10, 8] },  route2: { p: [235, 310], spawn: [2, 7] },
  forge:    { p: [360, 310], spawn: [12, 7] },  valley: { p: [360, 215], spawn: [10, 10] },
  startown: { p: [360, 120], spawn: [11, 8] },  abyss:  { p: [490, 120], spawn: [1, 7] },
  frost:    { p: [620, 500], spawn: [11, 7] },  toybox: { p: [620, 405], spawn: [10, 13] },
  thunder:  { p: [620, 310], spawn: [11, 8] },  clock:  { p: [620, 215], spawn: [10, 10] },
  sky:      { p: [620, 120], spawn: [10, 11] },
};
const WORLD_LINKS = [['village', 'route1'], ['route1', 'town2'], ['town2', 'route2'], ['route2', 'forge'], ['forge', 'valley'], ['valley', 'startown'], ['startown', 'abyss'], ['startown', 'frost'], ['frost', 'toybox'], ['toybox', 'thunder'], ['thunder', 'clock'], ['clock', 'sky']];

async function worldMap() {
  const ids = Object.keys(WORLD);
  const open = ids.filter(id => S.visited[id]);
  let sel = Math.max(0, open.indexOf(S.map));
  const pick = await new Promise(res => {
    const L = pushLayer({
      full: true,
      update() {
        if (take('up') || take('left')) { sel = (sel - 1 + open.length) % open.length; sfx('cursor'); }
        if (take('down') || take('right')) { sel = (sel + 1) % open.length; sfx('cursor'); }
        if (take('ok')) { sfx('select'); popLayer(L); res(open[sel]); }
        if (take('back')) { popLayer(L); res(null); }
      },
      draw() {
        const t = performance.now() / 1000;
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, '#e8d4a8'); g.addColorStop(1, '#c8a878');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = 'rgba(90,60,30,0.08)';
        for (let i = 0; i < 60; i++) { ctx.beginPath(); ctx.arc((i * 137) % W, (i * 89) % H, 20 + (i % 7) * 8, 0, Math.PI * 2); ctx.fill(); }
        ctx.strokeStyle = '#6a4a2a'; ctx.lineWidth = 6; ctx.strokeRect(8, 8, W - 16, H - 16);
        ctx.lineWidth = 1.5; ctx.strokeRect(16, 16, W - 32, H - 32);
        text('幻紋大陸', 40, 26, { size: 34, serif: true, bold: true, color: '#4a2a10', shadow: false });
        text('第一部', 210, 470, { size: 16, serif: true, color: 'rgba(74,42,16,0.6)', shadow: false });
        text('第二部', 590, 545, { size: 16, serif: true, color: 'rgba(74,42,16,0.6)', shadow: false });
        for (const [a, b] of WORLD_LINKS) {
          const A = WORLD[a].p, Bp = WORLD[b].p;
          ctx.setLineDash([6, 6]); ctx.strokeStyle = S.visited[a] && S.visited[b] ? '#8a4a1a' : 'rgba(90,60,30,0.3)'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(A[0], A[1]);
          if (a === 'startown' && b === 'frost') ctx.bezierCurveTo(470, 300, 520, 520, Bp[0], Bp[1]);
          else ctx.lineTo(Bp[0], Bp[1]);
          ctx.stroke(); ctx.setLineDash([]);
        }
        for (const id of ids) {
          const [x, y] = WORLD[id].p, ok = S.visited[id], isSel = open[sel] === id, here = S.map === id;
          ctx.save();
          if (isSel) { ctx.shadowColor = '#ffd040'; ctx.shadowBlur = 20; }
          ctx.fillStyle = ok ? (THEME[MAPS[id].theme] || THEME.green).g : '#8a7a6a';
          ctx.strokeStyle = isSel ? '#ffd040' : '#4a2a10'; ctx.lineWidth = isSel ? 4 : 2;
          ctx.beginPath(); ctx.arc(x, y, isSel ? 20 : 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.restore();
          if (here) drawPerson(ctx, x - 16, y - 46 + Math.sin(t * 4) * 2, 'down', PLAYER_LOOK, 0, 1);
          text(ok ? MAPS[id].name : '？？？', x, y + 22, { size: 15, align: 'center', bold: isSel, color: ok ? '#3a1a08' : '#7a6a5a', shadow: false });
        }
        panel(W / 2 - 130, H - 92, 260, 76);
        text(`▶ ${MAPS[open[sel]].name}`, W / 2 - 114, H - 82, { size: 20, color: '#ffd77a', bold: true });
        text('方向鍵選擇　Z 傳送　X 返回', W / 2 - 114, H - 50, { size: 15, color: '#c8bca0' });
      },
    });
  });
  if (!pick) return false;
  if (pick === S.map) { await say('你已經在這裡了。'); return false; }
  await say(`使用星垣博士的傳送靈符，飛往「${MAPS[pick].name}」！`);
  const [x, y] = WORLD[pick].spawn;
  S.dir = 'down';
  await warp(pick, x, y);
  return true;
}

// ---------- 任務系統 ----------
// type: catch(收服某種) / dex(圖鑑捕捉數) / defeat(打倒野生數) / deliver(送信) / legend(傳說數)
const QUESTS = {
  q_aoi:    { title: '小葵的朋友', giver: '小葵', type: 'catch', target: 18, reward: 1500,
              intro: ['我小時候在甜光林道遇過一隻碧殼心靈，牠總是對我笑……', '後來我搬家，就再也沒見過牠了。', '你可以幫我收服一隻碧殼心靈，讓我看看牠們過得好不好嗎？'],
              done: ['哇……真的是碧殼心靈！牠的笑容跟以前一模一樣。', '謝謝你！這是我存的零用錢，請收下！'] },
  q_letter: { title: '寄往霧澤的信', giver: '郵差 阿信', type: 'deliver', target: 'letter', reward: 2000,
              intro: ['糟糕，我扭到腳了……這封信要送給霧澤古道的撐篙老人。', '你可以幫我送過去嗎？送到之後回來找我拿報酬！'], gift: ['letter', 1],
              done: ['老人家收到信了？太好了！', '這是報酬，謝謝你幫忙！'] },
  q_hunter: { title: '工堡的守備獸', giver: '學徒', type: 'catch', target: 19, reward: 3000,
              intro: ['赤鐵大師說，想成為鋼匠就要了解槍尾巡獵獸的構造。', '可是牠們好兇……你可以收服一隻給我研究嗎？'],
              done: ['哇！原來尾巴的關節是這樣接的！', '這是我的學徒薪水……全部給你！'] },
  q_hiker:  { title: '山谷的修行', giver: '登山客', type: 'defeat', target: 15, reward: 3000,
              intro: ['風旋山谷的幻靈們最近很躁動。', '你能打倒 15 隻野生幻靈，讓牠們冷靜一下嗎？'], done: ['山谷安靜多了，謝謝你！', '這是登山協會的謝禮。'] },
  q_star:   { title: '星輪的預言', giver: '占星少女', type: 'dex', target: 20, reward: 5000, bonus: ['goldCharm', 5],
              intro: ['星輪告訴我：當有人收服 20 種幻靈時，命運就會轉向。', '你願意試試看嗎？'], done: ['星輪轉動了！你就是預言中的人！', '請收下這些謝禮。'] },
  q_snow:   { title: '雪丸子的冬天', giver: '霜鈴村長', type: 'catch', target: 53, reward: 4000,
              intro: ['村裡的孩子想要一隻雪丸子當玩伴。', '可以幫忙收服一隻嗎？'], done: ['孩子們一定會很開心！', '這是村裡大家湊的謝禮。'] },
  q_key:    { title: '打開玩具箱', giver: '玩具修理師', type: 'catch', target: 48, reward: 5000, bonus: ['maxRevive', 2],
              intro: ['閣樓深處有一個上鎖的大玩具箱。', '聽說「小鑰仔」能打開任何鎖，可以幫我收服一隻嗎？'], done: ['喀嚓！箱子打開了……裡面是好多被遺忘的禮物。', '這些分你一份！'] },
  q_storm:  { title: '高原的雷雲', giver: '氣象員', type: 'defeat', target: 25, reward: 7000,
              intro: ['雷雲把幻靈們都弄得很暴躁。', '幫我打倒 25 隻野生幻靈，我好觀測雷雲的變化！'], done: ['數據收集完成！太感謝了！', '這是研究所的經費……噓，別說出去。'] },
  q_maiden: { title: '時之書', giver: '古殿巫女', type: 'dex', target: 50, reward: 12000, bonus: ['candy', 3],
              intro: ['古殿的「時之書」記載著所有幻靈的名字。', '收服 50 種幻靈的人，就能在書上留下名字。'], done: ['你的名字出現在時之書上了。', '請收下古殿的祝福。'] },
  q_legend: { title: '傳說的見證者', giver: '聖域守望者', type: 'legend', target: 4, reward: 50000,
              intro: ['大陸上有五隻傳說幻靈：巨顎方門獸、霜晶龍、雷鼓天王、光冕聖獸、幻紋始祖。', '收服其中四隻，你就是真正的傳說見證者。'], done: ['你做到了……你就是傳說。', '這是聖域守護了千年的寶藏。'] },
};
const LEGENDS = [8, 97, 98, 99, 100];

function questProgress(id) {
  const Q = QUESTS[id], st = S.quests[id];
  switch (Q.type) {
    case 'catch': return [S.dex.caught[Q.target] ? 1 : 0, 1];
    case 'dex': return [Object.keys(S.dex.caught).length, Q.target];
    case 'defeat': return [Math.min(Q.target, S.stats.wild - (st ? st.start : 0)), Q.target];
    case 'deliver': return [st && st.delivered ? 1 : 0, 1];
    case 'legend': return [LEGENDS.filter(i => S.dex.caught[i]).length, Q.target];
  }
  return [0, 1];
}
function questGoalText(id) {
  const Q = QUESTS[id], [a, b] = questProgress(id);
  const what = Q.type === 'catch' ? `收服 ${MONS[Q.target].n}` : Q.type === 'dex' ? `圖鑑捕捉 ${Q.target} 種` : Q.type === 'defeat' ? `打倒 ${Q.target} 隻野生幻靈` : Q.type === 'deliver' ? '把信交給撐篙老人' : `收服 ${Q.target} 隻傳說幻靈`;
  return `${what}（${a}/${b}）`;
}

async function questTalk(id, fallback) {
  const Q = QUESTS[id], st = S.quests[id];
  if (!st) {
    await say(Q.intro, { name: Q.giver });
    const c = await choose(['接受任務', '下次再說'], { title: `任務：${Q.title}　報酬 $${Q.reward}`, w: 380, x: W / 2 - 190, y: 200 });
    if (c !== 0) return;
    S.quests[id] = { state: 'active', start: S.stats.wild };
    if (Q.gift) addItem(Q.gift[0], Q.gift[1]);
    sfx('up'); showToast(`接下任務：${Q.title}`);
    await tip('quest', ['接下任務了！', '按 X 打開選單 →「任務」可以查看進度。完成後回來找委託人領報酬。']);
    return;
  }
  if (st.state === 'done') { if (fallback) await fallback(); else await say('再次感謝你！', { name: Q.giver }); return; }
  const [a, b] = questProgress(id);
  if (a >= b) {
    st.state = 'done';
    if (Q.type === 'deliver') delete S.bag[Q.target];
    await say(Q.done, { name: Q.giver });
    S.money += Q.reward; jingle('item');
    let extra = '';
    if (Q.bonus) { addItem(Q.bonus[0], Q.bonus[1]); extra = `、${ITEMS[Q.bonus[0]].n} ×${Q.bonus[1]}`; }
    await say(`（獲得了 $${Q.reward}${extra}！）`);
    saveGame(true);
  } else await say([`任務「${Q.title}」進行中：`, questGoalText(id)], { name: Q.giver });
}

// 祈光亭的任務板：可重複的討伐委託
function bountyReward() { return 800 + (S.badges || 0) * 500; }
async function bountyBoard() {
  const st = S.quests.bounty;
  const need = 8;
  if (!st || st.state === 'done') {
    const c = await choose(['接下委託', '算了'], { title: `討伐委託：打倒 ${need} 隻野生幻靈　報酬 $${bountyReward()}`, w: 520, x: W / 2 - 260, y: 160 });
    if (c === 0) { S.quests.bounty = { state: 'active', start: S.stats.wild }; showToast('接下了討伐委託！'); }
    return;
  }
  const done = S.stats.wild - st.start;
  if (done >= need) {
    st.state = 'done'; const r = bountyReward(); S.money += r; jingle('item');
    await say([`討伐委託完成！`, `（獲得了 $${r}！可以再接新的委託）`], { name: '任務板' });
  } else await say(`討伐委託進行中：打倒野生幻靈（${done}/${need}）`, { name: '任務板' });
}

async function questMenu() {
  const lines = [];
  for (const id in QUESTS) {
    const st = S.quests[id];
    if (!st) continue;
    lines.push(`${st.state === 'done' ? '✔' : '●'} ${QUESTS[id].title}：${st.state === 'done' ? '已完成' : questGoalText(id) + '　→ 找' + QUESTS[id].giver}`);
  }
  if (S.quests.bounty && S.quests.bounty.state === 'active') lines.push(`● 討伐委託：打倒野生幻靈（${Math.min(8, S.stats.wild - S.quests.bounty.start)}/8）→ 回祈光亭`);
  const pages = Object.keys(S.flags).filter(f => /^diary\d$/.test(f)).length;
  lines.push(`📖 厄蘭的日記：${pages}/6 頁`);
  if (lines.length === 1) lines.unshift('目前沒有任務。和頭上有「！」的人說話可以接任務，祈光亭也有任務板。');
  await choose(lines.map(l => (x, y) => { ctx.save(); ctx.beginPath(); ctx.rect(x - 30, y, 700, 40); ctx.clip(); text(l, x, y + 8, { size: 17 }); ctx.restore(); }), { title: '任務', w: W - 40, x: 20, y: 20, rowH: 40, maxRows: 11 });
}

// ---------- 祈光亭加入任務板 ----------
async function centerDoor(withShop) {
  const opts = ['治療夥伴', '靈匣（存取幻靈）', '任務板（賺錢）'].concat(withShop ? ['購物'] : []).concat(['離開']);
  const c = await choose(opts, { title: '祈光亭', w: 300, x: W / 2 - 150, y: 120 });
  const pick = opts[c];
  if (pick === '治療夥伴') {
    healParty(); jingle('heal');
    S.respawn = { map: S.map, x: S.x, y: S.y };
    await say(['歡迎來到祈光亭。', '你的夥伴們沐浴在溫暖的光芒中……', '已經完全恢復了！祝你旅途平安。'], { name: '祈光使' });
    saveGame(true);
  } else if (pick === '靈匣（存取幻靈）') await boxMenu();
  else if (pick === '任務板（賺錢）') await bountyBoard();
  else if (pick === '購物') await shop();
}

// ---------- 主選單 ----------
async function mainMenu() {
  while (true) {
    const items = ['夥伴', '背包', '圖鑑', '世界地圖（傳送）', '任務', '提示', '存檔', S.musicOff ? '音樂：關' : '音樂：開', S.mute ? '音效：關' : '音效：開', S.hintsOff ? '提示框：關' : '提示框：開', '關閉'];
    const c = await choose(items, { title: `${S.name}　$${S.money}　印記 ${S.badges || 0}/6`, w: 320, x: W - 340, y: 14, rowH: 38 });
    if (c === 0) { if (!S.party.length) { await say('你還沒有夥伴！'); continue; } await partyMenu('view'); }
    else if (c === 1) await bagMenu('field');
    else if (c === 2) await dexMenu();
    else if (c === 3) { if (!flag('gotStarter')) { await say('先去研究所領取夥伴吧！'); continue; } if (await worldMap()) return; }
    else if (c === 4) await questMenu();
    else if (c === 5) { await hintPage(); return; }
    else if (c === 6) { saveGame(); await wait(300); }
    else if (c === 7) S.musicOff = !S.musicOff;
    else if (c === 8) S.mute = !S.mute;
    else if (c === 9) S.hintsOff = !S.hintsOff;
    else return;
  }
}

// ---------- 厄蘭的日記（6 頁，收集劇情＋獎金）----------
const DIARY = [
  ['（日記第 1 頁）', '「今天在霧澤撿到一隻哭偶。牠的臉上有兩個叉叉，看起來好悲傷。」', '「我決定叫牠小哭。我會讓牠笑起來的。」——厄蘭，八歲'],
  ['（日記第 2 頁）', '「村裡的大人說哭偶會帶來厄運，把小哭丟進了湖裡。」', '「我在湖邊找了三天三夜……找到的時候，小哭在發抖。」'],
  ['（日記第 3 頁）', '「為什麼世界上要有悲傷？」', '「星垣老師說：悲傷和喜悅都是幻紋始祖留下的。」', '「那麼，只要改寫始祖的幻紋……」'],
  ['（日記第 4 頁）', '「我找到了深淵之門。門後面的巨獸能吞下一切。」', '「如果把悲傷全部吞掉，大家就不會再哭了吧。」'],
  ['（日記第 5 頁）', '「教團的人越來越多了。大家都有想要吞掉的悲傷。」', '「小哭最近一直看著我。牠的叉叉眼睛……好像在說什麼。」'],
  ['（日記第 6 頁）', '「有一個帶著幻靈旅行的孩子，總是笑著對抗我們。」', '「那孩子的夥伴們都在笑。」', '「……小哭，你也想笑嗎？」'],
];
const DIARY_SPOTS = [['route1', 2, 15], ['route2', 27, 12], ['forge', 23, 13], ['valley', 20, 1], ['abyss', 24, 12], ['toybox', 20, 1]];
DIARY_SPOTS.forEach(([map, x, y], k) => {
  MAPS[map].npcs.push({ id: 'diary' + k, x, y, dir: 'down', pickup: true, name: '發光的紙頁', cond: () => !flag('diary' + k), talk: async () => {
    setFlag('diary' + k); jingle('item');
    const got = Object.keys(S.flags).filter(f => /^diary\d$/.test(f)).length;
    await say(['地上有一張發光的紙頁……是厄蘭的日記！'].concat(DIARY[k]));
    S.money += 800;
    await say(`（收集了厄蘭的日記 ${got}/6，獲得 $800！）`);
    if (got === 6) { S.money += 5000; addItem('lamp', 1); await say(['日記全部收集完成了。', '你終於明白了厄蘭的悲傷……', '（獲得了 $5000、祈光燈 ×1！）']); }
  } });
});

// ---------- 任務委託人與新的劇情 NPC ----------
function wrapNpc(map, id, qid) {
  const n = MAPS[map].npcs.find(q => q.id === id);
  const old = n.talk;
  n.talk = () => questTalk(qid, old);
  n.quest = qid;
}
MAPS.village.npcs.push({ id: 'aoi', x: 12, y: 12, dir: 'down', look: { hair: '#e07a2a', shirt: '#ffd040', pants: '#e85a7a' }, name: '小葵', quest: 'q_aoi', cond: () => flag('gotStarter'), talk: () => questTalk('q_aoi', () => say('碧殼心靈現在是我最好的朋友了！', { name: '小葵' })) });
MAPS.town2.npcs.push({ id: 'postman', x: 14, y: 9, dir: 'down', look: { hair: '#3a2a1a', shirt: '#3a7a3a', pants: '#2a3a2a', hat: '#2a5a2a' }, name: '郵差 阿信', quest: 'q_letter', talk: () => questTalk('q_letter', () => say('送信的事真是謝謝你啦！', { name: '郵差 阿信' })) });
wrapNpc('forge', 'smithkid', 'q_hunter');
wrapNpc('valley', 'hiker', 'q_hiker');
wrapNpc('startown', 'star', 'q_star');
wrapNpc('frost', 'elder2', 'q_snow');
wrapNpc('toybox', 'toyman', 'q_key');
wrapNpc('clock', 'maiden', 'q_maiden');
MAPS.thunder.npcs.push({ id: 'weather', x: 5, y: 3, dir: 'down', look: { hair: '#5a5a6a', shirt: '#e8e8f0', pants: '#3a3a5a' }, name: '氣象員', quest: 'q_storm', talk: () => questTalk('q_storm') });
MAPS.sky.npcs.push({ id: 'watcher', x: 16, y: 9, dir: 'left', look: { hair: '#fff8e0', shirt: '#f0e0a0', pants: '#c8a050', robe: '#ffe8a0' }, name: '聖域守望者', quest: 'q_legend', talk: () => questTalk('q_legend') });

// 撐篙老人收信
(function () {
  const n = MAPS.route2.npcs.find(q => q.id === 'fisher'), old = n.talk;
  n.talk = async () => {
    const st = S.quests.q_letter;
    if (st && st.state === 'active' && !st.delivered && S.bag.letter) {
      addItem('letter', -1); st.delivered = true;
      await say(['這是……我孫子寫來的信！', '「爺爺，我在符燈鎮當上郵差了。」', '哈哈……那孩子小時候最愛跟著厄蘭到處跑呢。', '厄蘭啊……以前是個很溫柔的孩子，總是抱著一隻哭偶。', '自從他的哭偶被丟進湖裡，那孩子就再也沒有笑過了……', '（信送到了！回符燈鎮找郵差阿信領報酬吧）'], { name: '撐篙老人' });
      return;
    }
    await old();
  };
})();

// 劇情場景 NPC
MAPS.town2.npcs.push({ id: 'rivalT2', x: 13, y: 6, dir: 'down', look: LOOK.rival, name: '小嵐', cond: () => flag('badge1') && !flag('rival2'), talk: () => say([
  '你也拿到符燈印了？我也是！', '跟你說，我的夢想是成為像星垣博士那樣的研究者。', '博士說，每一隻幻靈的笑容背後，都有一段故事。', '……不過聽說霧澤古道最近有穿紫袍的怪人。我先去看看！'], { name: '小嵐' }) });
MAPS.forge.npcs.push({ id: 'chitie', x: 16, y: 7, dir: 'left', look: LOOK.smith, name: '鋼匠 赤鐵', cond: () => flag('badge2'), talk: async () => {
  if (!flag('chitieGift')) { setFlag('chitieGift'); addItem('atkCharm', 3); addItem('defCharm', 3); await say(['教團的人偷走了工堡的「熔核」，說要拿去喚醒深淵之主。', '那個主教……我年輕時見過他。他抱著一隻哭偶，問我能不能打造一顆「不會哭的心」。', '我拒絕了。也許……我該答應他的。', '這些力量符和守護符拿去吧，前面的路會越來越難。', '（獲得了 力量符 ×3、守護符 ×3）'], { name: '鋼匠 赤鐵' }); }
  else await say('熔爐的火不會熄滅。你也一樣，別讓心裡的火熄滅了。', { name: '鋼匠 赤鐵' });
} });
MAPS.startown.npcs.push({ id: 'liyeOut', x: 14, y: 8, dir: 'down', look: LOOK.liye, name: '星術士 璃夜', cond: () => flag('badge3') && !flag('part1'), talk: () => say([
  '星輪昨晚轉了三圈半……這是千年來的第一次。', '我看見了兩個未來：一個是被深淵吞沒的大陸，', '另一個……是一個帶著幻靈的孩子，站在天空的盡頭。', '我不知道哪一個會成真。但我相信你。'], { name: '星術士 璃夜' }) });
MAPS.frost.npcs.push({ id: 'snowOut', x: 15, y: 7, dir: 'down', look: LOOK.snow, name: '冰歌師 雪音', cond: () => flag('badge4'), talk: () => say([
  '你知道嗎？厄蘭上個月來過冰晶湖。', '他一個人站在湖邊很久，懷裡抱著那隻哭偶。', '湖面的冰……那天唱的是一首很悲傷的歌。', '如果你遇到他，請告訴他：冰也會融化，悲傷也是。'], { name: '冰歌師 雪音' }) });

// 標示有任務可接的 NPC
function npcHasQuestMark(n) {
  if (!n.quest) return false;
  const st = S.quests[n.quest];
  if (!st) return 'new';
  if (st.state === 'active') { const [a, b] = questProgress(n.quest); if (a >= b || (n.quest === 'q_letter' && st.delivered)) return 'ready'; }
  return false;
}

// ---------- 主迴圈：黑幕永遠不會蓋住對話框，畫面出錯也不會整個停住 ----------
function loop(now) {
  try {
    if (S && !S._mig) migrate();
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    updateTweens(now);
    const top = topLayer();
    if (top) top.update(dt);
    const world = layers.find(l => l.isWorld);
    if (world && world !== top && P.moving) world.update(dt);
    let startAt = 0;
    for (let i = layers.length - 1; i >= 0; i--) if (layers[i].full) { startAt = i; break; }
    ctx.clearRect(0, 0, W, H);
    const ui = [];
    for (let i = startAt; i < layers.length; i++) {
      if (layers[i].ui) { ui.push(layers[i]); continue; }
      try { layers[i].draw(); } catch (e) { console.error(e); }
    }
    drawToast();
    if (fade > 0) { ctx.fillStyle = `rgba(0,0,0,${fade})`; ctx.fillRect(0, 0, W, H); }
    for (const l of ui) { try { l.draw(); } catch (e) { console.error(e); } }
    // 保險：沒有轉場在跑、卻停在全黑，就自動拉開
    if (fade > 0.5 && !tweens.length) { P.blackT = (P.blackT || 0) + 1; if (P.blackT > 90) { fade = 0; P.blackT = 0; } } else P.blackT = 0;
  } catch (e) { console.error(e); }
  pressed.length = 0;
  requestAnimationFrame(loop);
}
