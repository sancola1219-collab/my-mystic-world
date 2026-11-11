// ===== 西遊記序章：大鬧天宮（天兵天將、巨靈神、四大天王、李靖、哪吒、二郎神、太上老君）＋如來調整＋番外篇共用引擎 =====

// ---------- 人形造型擴充：新武器、第三隻眼、風火輪、混天綾、忍者頭巾 ----------
const xyWeaponV1 = xyWeapon;
xyWeapon = function (c, w, t, o) {
  const x = 25, y = 2;
  if (w === 'axe') {
    c.save(); c.translate(x, y); c.rotate(0.15);
    c.fillStyle = xyGrad(c, -1.6, 0, 1.6, 0, '#6a4a2a'); c.fillRect(-1.6, -50, 3.2, 92);
    const g = c.createLinearGradient(0, -60, 22, -30); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#8a92a4');
    c.fillStyle = g; c.strokeStyle = XOL; c.lineWidth = 0.8; c.beginPath(); c.moveTo(1, -56); c.quadraticCurveTo(26, -60, 24, -36); c.quadraticCurveTo(20, -26, 1, -32); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(-1, -54); c.quadraticCurveTo(-14, -50, -12, -38); c.lineTo(-1, -36); c.closePath(); c.fill(); c.stroke();
    G.circle(c, 0, -44, 2.6, '#f0c040', XOL, 0.5); c.restore(); return;
  }
  if (w === 'pagoda') {
    c.save(); c.translate(x + 2, y - 4); c.shadowColor = '#ffe080'; c.shadowBlur = 12 + Math.sin(t * 3) * 4;
    for (let i = 0; i < 5; i++) { const w2 = 9 - i * 1.4, yy = -i * 5.4; c.fillStyle = xyGrad(c, -w2, yy - 5, w2, yy, '#f0c040', 0.5); c.strokeStyle = XOL; c.lineWidth = 0.5; c.beginPath(); c.moveTo(-w2, yy); c.lineTo(w2, yy); c.lineTo(w2 * 0.7, yy - 4); c.lineTo(-w2 * 0.7, yy - 4); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#c03020'; c.fillRect(-w2 * 0.5, yy - 3.6, w2, 1.2); }
    c.fillStyle = '#f0c040'; c.beginPath(); c.moveTo(-1.4, -26); c.lineTo(0, -32); c.lineTo(1.4, -26); c.fill(); c.restore(); return;
  }
  if (w === 'pipa') {
    c.save(); c.translate(x - 4, y); c.rotate(-0.5);
    const g = c.createRadialGradient(-2, 4, 1, 0, 6, 12); g.addColorStop(0, '#f0c080'); g.addColorStop(1, '#8a4a1a');
    c.fillStyle = g; c.strokeStyle = XOL; c.lineWidth = 0.7; c.beginPath(); c.ellipse(0, 6, 8, 11, 0, 0, 7); c.fill(); c.stroke();
    c.fillStyle = '#5a3018'; c.fillRect(-1.4, -22, 2.8, 20); c.fillStyle = '#3a2010'; c.beginPath(); c.moveTo(-2.4, -22); c.quadraticCurveTo(0, -30, 4, -28); c.lineTo(1.4, -22); c.fill();
    c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 0.4; for (let i = -1.5; i <= 1.5; i++) { c.beginPath(); c.moveTo(i * 0.8, -20); c.lineTo(i * 1.2, 14); c.stroke(); }
    G.circle(c, 0, 9, 2.4, '#2a1408'); c.restore(); return;
  }
  if (w === 'umbrella') {
    c.save(); c.translate(x, y); c.rotate(0.1);
    c.fillStyle = '#5a3a20'; c.fillRect(-1, -40, 2, 70);
    c.translate(0, -42); c.rotate(t * 0.8);
    for (let i = 0; i < 8; i++) { c.rotate(0.785); c.fillStyle = i % 2 ? o.c : sh(o.b, 0.1); c.strokeStyle = XOL; c.lineWidth = 0.4; c.beginPath(); c.moveTo(0, 0); c.lineTo(18, -4); c.lineTo(18, 4); c.closePath(); c.fill(); c.stroke(); }
    G.circle(c, 0, 0, 3, '#f0c040', XOL, 0.5); c.restore(); return;
  }
  if (w === 'blade3') { // 三尖兩刃刀
    c.save(); c.translate(x, y); c.rotate(0.12);
    c.fillStyle = xyGrad(c, -1.4, 0, 1.4, 0, '#3a3a4a'); c.fillRect(-1.4, -48, 2.8, 90);
    const g = c.createLinearGradient(-8, -70, 8, -48); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#9aa8c0');
    c.fillStyle = g; c.strokeStyle = XOL; c.lineWidth = 0.6;
    c.beginPath(); c.moveTo(0, -74); c.quadraticCurveTo(4.4, -60, 3.4, -50); c.lineTo(-3.4, -50); c.quadraticCurveTo(-4.4, -60, 0, -74); c.fill(); c.stroke();
    for (const d of [-1, 1]) { c.beginPath(); c.moveTo(d * 3, -50); c.quadraticCurveTo(d * 9, -54, d * 8, -64); c.quadraticCurveTo(d * 7, -54, d * 2, -48); c.fill(); c.stroke(); }
    c.fillStyle = '#f0c040'; c.fillRect(-5, -50, 10, 2.4); c.restore(); return;
  }
  if (w === 'katana') {
    c.save(); c.translate(x, y + 4); c.rotate(-0.55);
    const g = c.createLinearGradient(-2, 0, 2, 0); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#9aa4b8');
    c.fillStyle = g; c.strokeStyle = XOL; c.lineWidth = 0.5; c.beginPath(); c.moveTo(-1.6, -4); c.quadraticCurveTo(-2.6, -30, 1, -52); c.quadraticCurveTo(1.8, -30, 1.6, -4); c.closePath(); c.fill(); c.stroke();
    G.ell(c, 0, -3, 4.4, 1.6, '#2a2a30', XOL, 0.4); c.fillStyle = '#2a1a2a'; c.fillRect(-1.4, -2, 2.8, 12);
    c.strokeStyle = '#c8c0b0'; c.lineWidth = 0.4; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(-1.4, i * 2.6); c.lineTo(1.4, i * 2.6 + 1.6); c.stroke(); }
    c.restore(); return;
  }
  if (w === 'kunai') {
    for (const [px, py, a] of [[24, 6, 2.6], [-20, 8, -2.6]]) {
      c.save(); c.translate(px, py); c.rotate(a);
      const g = c.createLinearGradient(-2, 0, 2, 0); g.addColorStop(0, '#e8ecf4'); g.addColorStop(1, '#6a7484');
      c.fillStyle = g; c.strokeStyle = XOL; c.lineWidth = 0.5; c.beginPath(); c.moveTo(0, -16); c.lineTo(3, -4); c.lineTo(-3, -4); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = '#2a2a34'; c.fillRect(-1, -4, 2, 8); c.strokeStyle = '#7a7a8a'; c.lineWidth = 0.8; c.beginPath(); c.arc(0, 6, 1.8, 0, 7); c.stroke(); c.restore();
    }
    // 手裡劍在身邊轉
    c.save(); c.translate(-30, -26); c.rotate(t * 6); c.fillStyle = '#9aa4b8'; c.strokeStyle = XOL; c.lineWidth = 0.4;
    c.beginPath(); for (let i = 0; i < 4; i++) { const a = i * 1.5708; c.lineTo(Math.cos(a) * 6, Math.sin(a) * 6); c.lineTo(Math.cos(a + 0.785) * 1.8, Math.sin(a + 0.785) * 1.8); } c.closePath(); c.fill(); c.stroke(); G.circle(c, 0, 0, 0.9, '#2a2a34'); c.restore();
    return;
  }
  return xyWeaponV1(c, w, t, o);
};
const xyHeadV1 = xyHead;
xyHead = function (c, k, t, o, hx, hy) {
  xyHeadV1(c, k, t, o, hx, hy);
  if (k === 'human' && o.beard) { c.fillStyle = o.beard; c.strokeStyle = XOL; c.lineWidth = 0.5; c.beginPath(); c.moveTo(hx - 6, hy + 3); c.quadraticCurveTo(hx - 5, hy + 16, hx, hy + 20); c.quadraticCurveTo(hx + 5, hy + 16, hx + 6, hy + 3); c.quadraticCurveTo(hx, hy + 8, hx - 6, hy + 3); c.fill(); c.stroke(); for (const d of [-1, 1]) { c.beginPath(); c.moveTo(hx + d * 1, hy + 4); c.quadraticCurveTo(hx + d * 6, hy + 4, hx + d * 9, hy + 8); c.lineWidth = 1.4; c.strokeStyle = o.beard; c.stroke(); } }
  if (o.eye3) { c.save(); c.shadowColor = '#ff4040'; c.shadowBlur = 8; c.fillStyle = '#fff'; c.beginPath(); c.ellipse(hx, hy - 6, 1.2, 2.6, 0, 0, 7); c.fill(); c.fillStyle = '#e02020'; c.beginPath(); c.ellipse(hx, hy - 6, 0.7, 1.8, 0, 0, 7); c.fill(); c.restore(); }
  if (o.ninja) {
    // 刺刺頭髮
    c.fillStyle = o.hair || '#2a2a34'; c.strokeStyle = XOL; c.lineWidth = 0.5;
    c.beginPath(); c.moveTo(hx - 10, hy - 4); for (let i = 0; i < 7; i++) { const a = Math.PI * (1.05 + i * 0.15); c.lineTo(hx + Math.cos(a) * 15, hy - 6 + Math.sin(a) * 12); c.lineTo(hx + Math.cos(a + 0.08) * 9, hy - 6 + Math.sin(a + 0.08) * 8); } c.lineTo(hx + 10, hy - 4); c.closePath(); c.fill(); c.stroke();
    // 護額
    c.fillStyle = o.band || '#2a3a6a'; c.fillRect(hx - 10, hy - 7.6, 20, 3.6);
    const pg = c.createLinearGradient(hx - 5, hy - 8, hx + 5, hy - 3); pg.addColorStop(0, '#ffffff'); pg.addColorStop(1, '#8a94a8');
    c.fillStyle = pg; c.beginPath(); c.roundRect(hx - 5, hy - 8, 10, 4.4, 1); c.fill(); c.stroke();
    c.strokeStyle = '#3a4050'; c.lineWidth = 0.6; c.beginPath(); c.moveTo(hx - 2.4, hy - 5.8); c.lineTo(hx, hy - 7.2); c.lineTo(hx + 2.4, hy - 5.8); c.lineTo(hx, hy - 4.4); c.closePath(); c.stroke();
    for (const d of [-1, 1]) { c.fillStyle = o.band || '#2a3a6a'; c.beginPath(); c.moveTo(hx + d * 10, hy - 6); c.quadraticCurveTo(hx + d * 16, hy - 4 + Math.sin(t * 4 + d) * 2, hx + d * 18, hy + 2); c.lineTo(hx + d * 16, hy + 2); c.quadraticCurveTo(hx + d * 14, hy - 3, hx + d * 10, hy - 4); c.fill(); }
    // 面罩
    if (o.mask) { c.fillStyle = o.mask; c.strokeStyle = XOL; c.lineWidth = 0.5; c.beginPath(); c.moveTo(hx - 8.4, hy + 1); c.quadraticCurveTo(hx, hy - 0.6, hx + 8.4, hy + 1); c.quadraticCurveTo(hx + 7, hy + 9, hx, hy + 10); c.quadraticCurveTo(hx - 7, hy + 9, hx - 8.4, hy + 1); c.fill(); c.stroke(); }
  }
};
const xyPlanV1 = PLANS.xiyou;
PLANS.xiyou = function (c, t, o) {
  if (o.sash) { // 混天綾
    c.save(); const w = Math.sin(t * 2.2) * 6; c.strokeStyle = '#e83040'; c.lineWidth = 3.4; c.lineCap = 'round'; c.globalAlpha = 0.9;
    c.beginPath(); c.moveTo(-14, -22); c.bezierCurveTo(-40, -30 + w, -36, 10 - w, -46, 20 + w); c.stroke();
    c.beginPath(); c.moveTo(14, -22); c.bezierCurveTo(40, -36 - w, 46, -10 + w, 40, 12 - w); c.stroke(); c.restore();
  }
  xyPlanV1(c, t, o);
  if (o.wheels) for (const d of [-1, 1]) { // 風火輪
    c.save(); c.translate(d * 9, 43 + Math.sin(t * 2) * 1.2); c.scale(1, 0.4); c.rotate(t * 8 * d);
    c.strokeStyle = '#f0c040'; c.lineWidth = 2.4; c.beginPath(); c.arc(0, 0, 8, 0, 7); c.stroke();
    for (let i = 0; i < 8; i++) { c.rotate(0.785); c.fillStyle = i % 2 ? '#ff6020' : '#ffd040'; c.beginPath(); c.moveTo(8, -2); c.quadraticCurveTo(15, 0, 8, 2); c.fill(); }
    c.restore();
  }
};

// ---------- 番外篇共用引擎：一條路、依序打敗頭目、打敗就加入 ----------
const SAGAS = {};
function sagaKey(cfg, i) { const q = cfg.stages[i]; return q.key || cfg.flag + i; }
function sagaNext(map) { const cfg = SAGAS[map]; return cfg.stages.findIndex((_, k) => !flag(sagaKey(cfg, k))); }
function sagaIds(base, list) { const out = {}; list.forEach((q, i) => out[q[0]] = base + i); return out; }
function sagaSpecies(base, list, hab, plan = 'xiyou') {
  list.forEach(([n, t, b, art, sig, desc, big, human], i) => {
    const id = base + i, tm = TYPE_MOVES[t[0]], tm2 = TYPE_MOVES[t[1] || t[0]], learn = sig.map(m => [1, m]);
    for (const mv of [tm2[1][0], tm[2][0], tm[1][0]]) if (learn.length < 5 && !learn.some(q => q[1] === mv)) learn.push([1, mv]);
    learn.push([40, tm[2][0]]);
    MONS[id] = { n, t, b, cr: big ? 3 : 8, xp: big ? 420 : 300, h: '1.9 m', w: '80.0 kg', hab, desc, big: !!big, human: !!human, art: Object.assign({ plan: art.plan || plan, s: big ? 4 : 3 }, art), learn };
    SPRITES[id] = (c, tt) => drawPlan(c, id, tt);
  });
}
function makeSaga(cfg) {
  // cfg: key, map, name, theme, stages[{boss|team, place, minion, line, win}], start npcs, flag, intro(), finale(), enterLabel
  const N = cfg.stages.length, W0 = 12;
  const rows = ['TTTTTTTTTTTT', 'TT...==...TT', 'TT...==...TT'];
  for (let g = N - 1; g >= 0; g--) rows.push('TTTTT==TTTTT', 'TT...==...TT', 'TT...==...TT');
  rows.push('TT...==...TT', 'TT...==...TT', 'TTTTTTTTTTTT');
  const gateY = i => 3 + (N - 1 - i) * 3;
  const m = MAPS[cfg.map] = { name: cfg.name, theme: cfg.theme, rows, w: W0, h: rows.length, exits: [], doors: {}, signs: {}, triggers: [], npcs: [], roofAt: {} };
  const H0 = m.h;
  cfg.stages.forEach((q, i) => {
    const key = sagaKey(cfg, i), gy = gateY(i), ace = q.team ? q.team[q.team.length - 1] : q.boss;
    q.ids = (q.team || [q.boss]).map(n => cfg.ids[n]);
    m.npcs.push({ id: cfg.flag + 'b' + i, x: 5, y: gy, dir: 'down', legend: cfg.ids[ace], name: ace, cond: () => !flag(key), talk: () => sagaBattle(cfg, i) });
    m.npcs.push({ id: cfg.flag + 'g' + i, x: 6, y: gy, dir: 'down', look: cfg.guard, name: cfg.guardName, cond: () => !flag(key), talk: () => say(`「${ace}」就在這裡！要過去，先打贏${q.team ? '他們' : ace}！`, { name: cfg.guardName }) });
    m.npcs.push({ id: cfg.flag + 'r' + i, x: 9, y: gy + 1, dir: 'left', look: cfg.helper.look, name: cfg.helper.name, cond: () => flag(key), talk: async () => { healParty(); await say([`這裡是「${q.place}」。`, '先休息一下吧。（隊伍完全恢復了！）'], { name: cfg.helper.name }); const c = await choose(['再戰一次', '不用了'], { title: `要再挑戰${ace}嗎？`, w: 300, x: W / 2 - 150, y: 260 }); if (c === 0) await sagaBattle(cfg, i); } });
  });
  for (const n of cfg.npcs(H0)) m.npcs.push(n);
  for (const n of m.npcs) n._home = [n.x, n.y];
  cfg.N = N; cfg.gateY = gateY;
  SAGAS[cfg.map] = cfg;
  return cfg;
}
function sagaBase() { return Math.max(10, ...S.party.concat(S.box).map(m => m.level)); }
function sagaMinion(types, lv, j) {
  const pool = Object.keys(MONS).map(Number).filter(id => id < 1104 && !MONS[id].big && MONS[id].t.some(t => types.includes(t)) && MONS[id].art);
  return makeMon(pool[(j * 97 + lv * 13) % pool.length], lv);
}
async function sagaBattle(cfg, i) {
  const q = cfg.stages[i], key = sagaKey(cfg, i), last = i === cfg.N - 1, ace = q.team ? q.team[q.team.length - 1] : q.boss;
  await say(q.line, { name: ace });
  const c = await choose(['迎戰！', '先準備一下'], { title: `挑戰${q.place}的${q.team ? q.team.join('、') : ace}？`, w: 420, x: W / 2 - 210, y: 300 });
  if (c !== 0) return;
  const base = sagaBase(), lv = Math.min(LEVEL_CAP, base + 3 + Math.floor(i / 2)), team = [];
  if (!q.team) for (let j = 0; j < 2 + Math.floor(i / 4); j++) team.push(sagaMinion(q.minion, Math.max(5, base - 4 + j), i + j));
  q.ids.forEach((id, j) => team.push(xyBossMon(id, Math.max(5, lv - (q.ids.length - 1 - j)), (last ? 1.9 : 1.4 + i * 0.05) * (j === q.ids.length - 1 ? 1 : 0.85), (last ? 4 : 2.2 + i * 0.12) * (j === q.ids.length - 1 ? 1 : 0.7))));
  const r = await runBattle({ trainer: { name: cfg.title(ace), look: cfg.foeLook, money: lv * (last ? 1200 : 400) }, foeTeam: team });
  if (r !== 'win') return;
  await say(q.win, { name: ace });
  if (!flag(key)) {
    setFlag(key);
    for (const id of q.ids) {
      const mm = makeMon(id, Math.max(5, lv - 6)); S.dex.seen[id] = true; S.dex.caught[id] = true;
      const w = addMon(mm); jingle('caught');
      await say(`${MONS[id].n}${cfg.joinWord}，加入了${w === 'box' ? '靈匣' : '隊伍'}！`);
    }
    if (cfg.after) await cfg.after(i);
    if (last) await cfg.finale();
    saveGame(true);
  }
}
async function sagaEnter(map) {
  const cfg = SAGAS[map];
  if (!S.party.length) { await say('要先有一隻夥伴才能出發喔！去村子右上方的星垣研究所領取吧。'); return false; }
  if (S.map === 'xiyou') S.sagaBack = S.xyBack; else if (!SAGAS[S.map]) S.sagaBack = { map: S.map, x: S.x, y: S.y };
  S.dir = 'up';
  await warp(map, 5, MAPS[map].h - 2);
  if (!flag(cfg.flag + 'Intro')) { setFlag(cfg.flag + 'Intro'); await cfg.intro(); }
  return true;
}
async function sagaLeave() { const b = S.sagaBack || S.xyBack || S.respawn; await warp(b.map, b.x, b.y); }
const navInfoSaga = navInfo;
navInfo = function () {
  const cfg = SAGAS[S.map];
  if (!cfg) return navInfoSaga();
  const i = sagaNext(S.map);
  if (i >= 0) { const q = cfg.stages[i], ace = q.team ? q.team[q.team.length - 1] : q.boss; return { tx: 5, ty: cfg.gateY(i), label: ace, line: `${cfg.short}：第 ${i + 1} / ${cfg.N} 關　${q.place}・${ace}` }; }
  return { label: '', line: `${cfg.short}完成！按 X 可以離開` };
};

// ---------- 大鬧天宮：角色 ----------
const TG0 = 1130;
const TG_LIST = [
  ['天兵統領', ['光', '鋼'], [120, 130, 130, 110], { head: 'human', hs: 'short', a: '#d8c060', b: '#a02020', c: '#ffe080', skin: '#f4d0b0', hair: '#2a1a14', weapon: 'spear', armor: '#e0c060', pads: '#e0c060', crown: 1 }, ['tg_spear', 'tg_army'], '率領十萬天兵的統領，奉玉帝旨意捉拿妖猴。', 0, 1],
  ['巨靈神', ['地', '鬥'], [170, 160, 130, 70], { head: 'ogre', a: '#8a5a2a', b: '#d0a040', c: '#ffb040', skin: '#c88050', hair: '#2a1a10', beard: '#2a1a10', weapon: 'axe', armor: '#a07030', pads: '#a07030' }, ['tg_axe', 'xy_bear'], '天庭先鋒，手持宣花板斧，力大無窮。', 0, 1],
  ['持國天王', ['幻', '光'], [140, 130, 130, 120], { head: 'ogre', a: '#f0f0f8', b: '#4060c0', c: '#a0c0ff', skin: '#f4d8c0', horn: 0, hair: '#1a1a24', beard: '#1a1a24', weapon: 'pipa', armor: '#d8dce8', pads: '#d8dce8' }, ['tg_pipa', 'tg_army'], '四大天王之東方，彈琵琶擾亂敵人心神。', 0, 1],
  ['增長天王', ['鋼', '光'], [140, 140, 125, 120], { head: 'ogre', a: '#4060c0', b: '#f0c040', c: '#80c0ff', skin: '#f4d8c0', horn: 0, hair: '#1a1a24', beard: '#1a1a24', weapon: 'sword', armor: '#5070d0', pads: '#5070d0' }, ['tg_sword', 'tg_army'], '四大天王之南方，手持青鋒寶劍。', 0, 1],
  ['廣目天王', ['火', '光'], [140, 135, 125, 125], { head: 'ogre', a: '#c03028', b: '#f0c040', c: '#ff8040', skin: '#f4d8c0', horn: 0, hair: '#1a1a24', beard: '#1a1a24', weapon: 'spear', armor: '#d04030', pads: '#d04030' }, ['tg_eye', 'tg_army'], '四大天王之西方，雙目能看遍世間。', 0, 1],
  ['多聞天王', ['木', '光'], [150, 135, 135, 110], { head: 'ogre', a: '#3a8a4a', b: '#f0c040', c: '#ffe060', skin: '#f4d8c0', horn: 0, hair: '#1a1a24', beard: '#1a1a24', weapon: 'umbrella', armor: '#4a9a5a', pads: '#4a9a5a' }, ['tg_umbrella', 'tg_army'], '四大天王之北方，混元珍珠傘一撐，天昏地暗。', 0, 1],
  ['托塔天王', ['光', '鋼'], [155, 145, 150, 110], { head: 'ogre', a: '#d8b040', b: '#a02020', c: '#ffe080', skin: '#f4d8c0', horn: 0, hair: '#2a1a14', beard: '#2a1a14', weapon: 'pagoda', armor: '#e0c050', pads: '#e0c050', crown: 1, cape: '#a02020' }, ['tg_pagoda', 'tg_sword'], '天兵元帥李靖，玲瓏寶塔能鎮壓一切妖魔。', 0, 1],
  ['哪吒三太子', ['火', '風'], [140, 165, 120, 170], { head: 'human', hs: 'tufts', a: '#e04040', b: '#f0c040', c: '#ff8040', skin: '#fbdcc0', hair: '#1a1010', weapon: 'fire', top: '#ff6040', wheels: 1, sash: 1 }, ['tg_wheel', 'xy_spear'], '李靖的三兒子，腳踏風火輪、身披混天綾，能變三頭六臂。', 0, 1],
  ['哮天犬', ['暗', '鬥'], [130, 155, 115, 170], { plan: 'beast', kind: 'wolf', a: '#2a2a34', b: '#c8c0b0', c: '#ff4040' }, ['tg_bite', 'xy_bear'], '二郎神的神犬，一口咬住誰都不放。', 0, 0],
  ['二郎神', ['光', '鬥'], [170, 180, 155, 165], { head: 'human', hs: 'short', a: '#e8e8f0', b: '#d0a040', c: '#80c0ff', skin: '#f6dcc4', hair: '#1a1a24', weapon: 'blade3', armor: '#c8d0e0', pads: '#c8d0e0', cape: '#e8e8f0', crown: 1, eye3: 1, aura: '#a0c8ff' }, ['tg_blade3', 'tg_eye3', 'tg_change'], '灌江口二郎顯聖真君楊戩，額上天眼能識破七十二變。', 1, 1],
  ['太上老君', ['光', '火'], [180, 160, 170, 120], { head: 'human', hs: 'bun', a: '#f4f0e0', b: '#8a6a3a', c: '#ffd040', skin: '#f4d8c0', hair: '#f0f0f0', weapon: 'gourd', gourd: '#e8c040', long: 1, skirt: 22, aura: '#ffe080', beads: 1 }, ['tg_furnace', 'tg_ring', 'xy_lotus'], '兜率宮的老神仙，八卦爐煉出了悟空的火眼金睛。', 1, 1],
];
const TG_ID = sagaIds(TG0, TG_LIST);
sagaSpecies(TG0, TG_LIST, '西遊記序章・天宮');
for (const id of Object.values(TG_ID)) MONS[id].xy = true;
MONS[TG_ID['太上老君']].art.beard = '#f4f4f4';
Object.assign(MOVES, {
  tg_spear: { n: '天兵長槍陣', t: '鋼', p: 105, a: 100, pp: 20, fxk: 'needles', d: '天兵列陣一起刺出長槍。' },
  tg_army: { n: '十萬天兵', t: '光', p: 40, a: 100, pp: 10, fxk: 'barrage', d: '天兵天將一擁而上，連打 2~5 次。', e: { multi: [2, 5] } },
  tg_axe: { n: '宣花板斧', t: '地', p: 125, a: 90, pp: 15, fxk: 'quake', d: '巨靈神的大斧劈山裂地。' },
  tg_pipa: { n: '琵琶亂心曲', t: '幻', p: 95, a: 100, pp: 15, fxk: 'sound', d: '琵琶聲讓對手心神大亂。', e: { conf: 0.35 } },
  tg_sword: { n: '青鋒斬', t: '鋼', p: 115, a: 100, pp: 15, fxk: 'slash', d: '天王寶劍一斬，風雷隨之。', e: { crit: 1 } },
  tg_eye: { n: '廣目天眼', t: '光', p: 110, a: 100, pp: 15, fxk: 'beam', d: '從雙眼射出的神光，降低對手防禦。', e: { foe: { def: -1 } } },
  tg_umbrella: { n: '混元珍珠傘', t: '暗', p: 115, a: 95, pp: 15, fxk: 'rings', d: '寶傘一撐，天昏地暗。', e: { foe: { spd: -1 } } },
  tg_pagoda: { n: '玲瓏寶塔', t: '光', p: 135, a: 90, pp: 10, fxk: 'pillar', d: '寶塔從天而降，鎮壓妖魔。', e: { par: 0.25 } },
  tg_wheel: { n: '風火輪', t: '火', p: 120, a: 100, pp: 15, fxk: 'twister', d: '踏著風火輪疾衝，烈焰隨之。', e: { burn: 0.2, self: { spd: 1 } } },
  tg_bite: { n: '哮天神咬', t: '暗', p: 115, a: 100, pp: 15, fxk: 'bite', d: '神犬撲上來狠狠一咬。', e: { crit: 1 } },
  tg_blade3: { n: '三尖兩刃刀', t: '鬥', p: 140, a: 95, pp: 10, fxk: 'slash', d: '二郎神的神兵，一刀三刃。', e: { crit: 1 } },
  tg_eye3: { n: '天眼神光', t: '光', p: 150, a: 90, pp: 5, fxk: 'beam', d: '額上的第三隻眼射出神光，任何變化都無所遁形。' },
  tg_change: { n: '七十二變・破', t: '幻', p: 0, a: 100, pp: 10, d: '識破對手的變化，攻擊和速度大幅提升。', e: { self: { atk: 2, spd: 1 } } },
  tg_furnace: { n: '八卦爐真火', t: '火', p: 160, a: 90, pp: 5, fxk: 'blast', d: '八卦爐裡燒了七七四十九天的真火。', e: { burn: 0.4 } },
  tg_ring: { n: '金剛琢', t: '鋼', p: 130, a: 95, pp: 10, fxk: 'orb', d: '老君的金剛琢一套，什麼兵器都能收走。', e: { foe: { atk: -1 } } },
});

// ---------- 大鬧天宮：地圖與劇情 ----------
THEME.tiangong = Object.assign({}, THEME.xiyou, { g: '#e8e0f4', g2: '#ddd4ec', path: '#f0d890', tree: '#c8a040', tree2: '#a08030', gh: '#fff4c0', obst: 'pillar', wx: 'green' });
LIGHT.tiangong = ['255,240,200', 0.14];
BBG.tiangong = { sky: ['#a8c8f8', '#fff8e0'], hill: ['#f4f0ff', '#c8c0e8'], ground: ['#f0e8ff', '#c8c0e0'], plat: ['#fff8e8', '#d8c890'], tuft: null };
MAP_SONG.tiangong = 'route';
makeSaga({
  map: 'tiangong', name: '西遊記序章・大鬧天宮', theme: 'tiangong', flag: 'tg', short: '大鬧天宮', ids: TG_ID, joinWord: '被你們的氣魄折服',
  title: n => '天將 ' + n, foeLook: { hair: '#2a1a14', shirt: '#e0c060', pants: '#a02020' },
  guard: { hair: '#2a1a14', shirt: '#e0c060', pants: '#a02020', hat: '#e0c060' }, guardName: '天兵',
  helper: { name: '土地公', look: { hair: '#c8a050', shirt: '#e8d8b0', pants: '#8a6a3a' } },
  stages: [
    { boss: '天兵統領', place: '南天門', minion: ['光', '鋼'], line: ['大膽妖猴！竟敢自封「齊天大聖」！', '十萬天兵在此，還不束手就擒！'], win: ['南天門……守不住了！快去稟報玉帝！'] },
    { boss: '巨靈神', place: '花果山・天兵營', minion: ['地', '鬥'], line: ['俺是天庭先鋒巨靈神！', '看俺一斧把你們劈成兩半！'], win: ['斧柄……斷了！這猴子好大的力氣！'] },
    { team: ['持國天王', '增長天王', '廣目天王', '多聞天王'], place: '四天門', minion: ['光'], line: ['我們是鎮守四方的四大天王！', '東南西北，你們一個也逃不掉！'], win: ['四方天門……全被打開了……'] },
    { boss: '托塔天王', place: '天兵大營', minion: ['光', '鋼'], line: ['本帥奉旨親征！', '玲瓏寶塔在此，任你是什麼妖魔都要鎮壓！'], win: ['……回天庭向玉帝請罪吧。'] },
    { boss: '哪吒三太子', place: '花果山・雲端', minion: ['火', '風'], line: ['爹爹打不過，就換我來！', '三頭六臂、風火輪，看你接得住幾招！'], win: ['好厲害的猴子……我、我回去再練練！'] },
    { team: ['哮天犬', '二郎神'], place: '灌江口・花果山', minion: ['光'], line: ['我是灌江口二郎神楊戩。', '你那七十二變，騙不過我額上的天眼！', '哮天犬，上！'], win: ['好一個大聖……你們確實很強。', '但天地自有安排，這一戰，我楊戩服了。'] },
    { boss: '太上老君', place: '兜率宮', minion: ['光', '火'], line: ['呵呵，偷吃了老夫的金丹，還敢來兜率宮？', '進八卦爐裡燒上七七四十九天吧！'], win: ['八卦爐都被踢翻了……', '罷了罷了，去請西天的如來佛祖吧。'] },
  ],
  npcs: H0 => [
    { id: 'tgwk', x: 3, y: H0 - 3, dir: 'right', look: { hair: '#a87030', shirt: '#e8b030', pants: '#b02020', robe: '#d02828', skin: '#f0c090', hat: '#f0c040' }, name: '美猴王', talk: async () => { healParty(); await say(S.party.some(m => m.id === WUKONG) ? ['哈！你把俺老孫也帶來了？', '兩個大聖，天庭今天有得受了！（隊伍完全恢復了！）'] : ['俺是花果山的美猴王！玉帝只封俺做「弼馬溫」，氣死俺了！', '俺自封「齊天大聖」，天兵天將要來就來吧！', '你也要一起大鬧天宮嗎？好兄弟！（隊伍完全恢復了！）'], { name: '美猴王' }); } },
    { id: 'tgtaibai', x: 8, y: H0 - 3, dir: 'left', look: { hair: '#f4f4f4', shirt: '#f4f0e0', pants: '#c8b080', robe: '#f0ecd8', skin: '#f4d8c0' }, name: '太白金星', talk: async () => { const i = sagaNext('tiangong'); await say(i < 0 ? ['唉，天宮被鬧得天翻地覆。', '如來佛祖已經出手了……五百年後，取經之路就要開始。'] : ['老夫太白金星，本來是來招安的……', `前面的「${SAGAS.tiangong.stages[i].place}」有天將守著，小心了。`, '打敗的天將，都會被你們的氣魄折服而成為夥伴。'], { name: '太白金星' }); } },
  ],
  intro: async () => {
    await chapterCard('西遊記序章', '大鬧天宮——齊天大聖的傳說');
    await say(['很久很久以前，東勝神洲傲來國花果山上，一塊仙石迸裂，生出一隻石猴。', '石猴拜菩提祖師學會了七十二變和筋斗雲，又從東海龍宮取走了如意金箍棒。', '玉帝封牠做「弼馬溫」，牠嫌官小，一怒之下自封「齊天大聖」。', '於是，玉帝派出十萬天兵天將——']);
    await say(['兄弟！你來得正好！', '跟俺老孫一起殺上天宮，讓他們瞧瞧齊天大聖的厲害！', '想離開時，按 X 打開選單選「離開西遊記篇」。'], { name: '美猴王' });
  },
  finale: async () => {
    setFlag('tgEnd'); S.money += 300000;
    await fadeOut(600); fade = 0;
    await chapterCard('五指山', '如來翻掌，五百年後取經之路開始');
    await fadeIn(300);
    await say(['天宮一片狼藉，玉帝只好請來西天的如來佛祖。', '「你若能一個筋斗翻出我的右掌心，天宮就讓給你。」', '悟空翻了十萬八千里，在五根大柱子上寫下「齊天大聖到此一遊」——', '原來那五根柱子，是如來的五根手指。', '如來翻掌，化作五指山，把悟空壓在山下五百年……', '（獲得了 $300000！序章完成，接著挑戰「取經之路」吧！）']);
  },
});

// ---------- 如來佛祖：回復減半、攻擊 ×5 ----------
MOVES.xy_lotus.e.heal = 0.25;
MOVES.xy_lotus.d = '金蓮綻放，回復四分之一體力並淨化異常狀態。';
const NYORAI_ATK_X = 5;
const calcStatsNy = calcStats;
calcStats = function (m) { calcStatsNy(m); if (m.id === NYORAI) m.atk *= NYORAI_ATK_X; };
const worldLayerV11 = worldLayer;
worldLayer = function () {
  if (S && !S.v11) { S.v11 = 1; for (const m of S.party.concat(S.box)) if (m.id === NYORAI) { const r = m.maxHp ? m.hp / m.maxHp : 1; calcStats(m); m.hp = m.hp <= 0 ? 0 : Math.max(1, Math.round(m.maxHp * r)); } }
  return worldLayerV11();
};
TIPS.push('西遊記篇有序章「大鬧天宮」，和美猴王一起對抗天兵天將、二郎神！');
