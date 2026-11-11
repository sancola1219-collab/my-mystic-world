// ===== 第五波更新：血量三倍、電屬性家族、孫悟空、舊怪物造型細膩化 =====

// ---------- 血量三倍後的平衡 ----------
ITEMS.potion.v = 90; ITEMS.potion.d = '回復 90 點體力。';
ITEMS.superPot.v = 240; ITEMS.superPot.d = '回復 240 點體力。';
for (const id in MOVES) if (MOVES[id].pp < 90) MOVES[id].pp *= 2; // 戰鬥變長，招式次數也加倍

// ---------- 新招式 ----------
Object.assign(MOVES, {
  wk_staff:  { n: '如意金箍棒', t: '鬥', p: 150, a: 95, pp: 10, ult: 1, fx: 'staff', d: '萬斤神棒從天而降，一棒打碎山河。' },
  wk_cloud:  { n: '筋斗雲', t: '風', p: 90, a: 100, pp: 20, e: { prio: 1 }, d: '一個筋斗十萬八千里，必定先手。' },
  wk_eye:    { n: '火眼金睛', t: '光', p: 0, a: 100, pp: 15, e: { foe: { def: -2 } }, d: '看穿一切偽裝，大幅降低對手防禦。' },
  wk_change: { n: '七十二變', t: '幻', p: 0, a: 100, pp: 10, e: { self: { atk: 2, spd: 2 }, cure: 1 }, d: '變化萬千，大幅提升攻擊與速度。' },
  wk_hold:   { n: '定身法', t: '幻', p: 0, a: 90, pp: 10, e: { par: 1 }, d: '一聲「定！」，讓對手全身麻痺。' },
});

// ---------- 電屬性家族 ----------
// [身體, 副屬性, 主色, 副色, 發光色, 設定, 三階名字, 招牌招式, 說明, 定位, 基礎等級, 出沒地圖]
const VOLT_FAMILIES = [
  ['beast', null, '#f0d040', '#a07010', '#fff080', { kind: 'wolf', pat: 'spot' }, ['雷貂崽', '閃電貂', '雷光天貂'], '閃電撕咬', '毛皮摩擦就會放電的小貂。', 'spd', 4, ['route1', 'thunder']],
  ['serpent', '水', '#3a70c0', '#ffe060', '#80e0ff', {}, ['電鰻', '雷蛟', '蒼雷海蛟'], '雷海纏繞', '在雷雨海面下游動的電鰻。', 'atk', 10, ['route2', 's15']],
  ['moth', '木', '#f0e060', '#60a040', '#80ff80', {}, ['電粉蛾', '雷紋蛾', '霹靂蛾后'], '帶電鱗粉', '鱗粉帶電的飛蛾。', 'spd', 11, ['route2', 's3']],
  ['scorpion', '鋼', '#5a6a88', '#2a3040', '#60e0ff', {}, ['電甲蟲', '雷甲蠍', '千伏蠍皇'], '千伏毒針', '尾針能放出千伏電壓。', 'def', 14, ['forge', 's10']],
  ['golem', '地', '#6a6a78', '#303038', '#60c0ff', {}, ['磁石兵', '雷核魔像', '雷柱巨神'], '磁暴重拳', '磁石凝聚而成的魔像。', 'def', 15, ['forge', 's11']],
  ['bird', '風', '#d8c050', '#4a70d0', '#fff060', {}, ['電雛', '雷翼鷹', '天雷鵬'], '雷翼俯衝', '振翅就能招來雷雲的巨鳥。', 'spd', 19, ['valley', 's12']],
  ['beast', '風', '#f8f0c0', '#ffc030', '#ffe060', { kind: 'horse', horn: 1 }, ['電駒', '雷蹄馬', '奔雷神駒'], '奔雷踏', '踏過的地方都會留下閃電。', 'spd', 20, ['valley', 's5']],
  ['fairy', '光', '#fff080', '#6090e0', '#ffffff', {}, ['電光精', '雷音仙', '九天玄雷女'], '玄雷仙音', '歌聲能引來落雷的仙子。', 'bal', 38, ['toybox', 's2']],
  ['beast', '鬥', '#c8a030', '#3050b0', '#80c0ff', { kind: 'lion', mane: 1, pat: 'stripe' }, ['電鬃獅崽', '雷鬃獅', '雷霆獅王'], '雷霆獅吼', '鬃毛裡奔竄著閃電。', 'atk', 41, ['thunder', 's12']],
  ['dragon', '鋼', '#2a3a70', '#f0d040', '#ffe040', { horn: 3, horncol: '#ffe060' }, ['雷鱗幼龍', '閃電飛龍', '萬雷天龍'], '萬雷龍息', '吐息是一道貫穿天地的閃電。', 'atk', 42, ['thunder', 's16']],
];

(function addVolt() {
  let id = 301;
  const total = { 1: 320, 2: 430, 3: 545, 4: 660 };
  const add = (name, types, stage, role, sig, desc, art, learnExtra) => {
    const me = id++, [t1, t2] = types, M1 = TYPE_MOVES[t1], M2 = TYPE_MOVES[t2 || t1];
    MOVES['sig' + me] = { n: sig, t: t1, p: { 1: 80, 2: 100, 3: 120, 4: 140 }[stage], a: 95, pp: 16, ult: stage >= 3 ? 1 : 0, d: `${name}的招牌招式。` };
    MONS[me] = {
      n: name, t: types, b: ROLE_W[role].map(x => Math.round(total[stage] * x)), cr: stage === 4 ? 12 : stage === 3 ? 45 : stage === 2 ? 90 : 170, xp: { 1: 100, 2: 170, 3: 250, 4: 330 }[stage],
      h: (0.6 + stage * 0.7).toFixed(1) + ' m', w: (8 + stage * stage * 14).toFixed(1) + ' kg', hab: '', desc, big: stage === 4, art,
      learn: learnExtra || [[1, M1[0][0]], [6, 'growl'], [12, M1[3][0]], [18, M2[0][0]], [26, M1[1][0]], [34, 'sig' + me], [42, M2[1][0]], [50, M1[2][0]], [60, M2[2][0]], [72, ULT[t1][0]]],
    };
    SPRITES[me] = (c, t) => drawPlan(c, me, t);
    return me;
  };
  for (const [plan, t2, a, b, c, opts, names, sig, desc, role, L, maps] of VOLT_FAMILIES) {
    const types = t2 ? ['雷', t2] : ['雷'], ids = names.map((n, i) => add(n, types, i + 1, role, sig, desc + ['幼體。', '成長後力量大增。', '最終形態，閃電環繞全身。'][i], Object.assign({ plan, a, b, c, s: i + 1, zap: 1 }, opts)));
    MONS[ids[0]].evo = { lv: L + 12, to: ids[1] }; MONS[ids[1]].evo = { lv: L + 26, to: ids[2] };
    const [m1, m2] = maps, cap = v => Math.min(100, v);
    MAPS[m1].wild.push([ids[0], L, L + 3, 22]);
    MONS[ids[0]].hab = MAPS[m1].name;
    if (MAPS[m2].wild) { const q = MAPS[m2].wild[0][1]; MAPS[m2].wild.push([ids[1], q, q + 3, 12], [ids[2], q + 3, q + 5, 4]); }
    MAPS.thunder.wild.push([ids[0], 40, 43, 6]);
  }
  add('九天雷祖', ['雷', '光'], 4, 'atk', '九天應元雷', '掌管天下萬雷的神祇，一怒則雷霆千里。', { plan: 'demon', s: 4, a: '#4060c0', b: '#ffe060', c: '#ffffff', zap: 1, horncol: '#ffe060' });
  add('孫悟空', ['鬥', '光'], 4, 'atk', '齊天大聖', '從石頭裡蹦出的齊天大聖，手持如意金箍棒，一個筋斗十萬八千里。', { plan: 'wukong', s: 4, a: '#c89040', b: '#d02020', c: '#ffd040', zap: 0 },
    [[1, 'wk_cloud'], [1, 'wk_eye'], [1, 'wk_change'], [1, 'wk_hold'], [1, 'wk_staff']]);
  MONS[331].b = MONS[331].b.map(v => Math.round(v * 1.05));
  MONS[332].b = MONS[332].b.map(v => Math.round(v * 1.2));
})();
const WUKONG = 332, THUNDER_GOD = 331;

// 閃電環繞
const drawPlanBase = drawPlan;
drawPlan = function (c, id, t) {
  drawPlanBase(c, id, t);
  if (!MONS[id].art.zap) return;
  const n = 2 + MONS[id].art.s, col = MONS[id].art.c;
  c.save(); c.strokeStyle = '#fffbd0'; c.shadowColor = col; c.shadowBlur = 8; c.lineWidth = 0.9; c.lineJoin = 'round';
  for (let i = 0; i < n; i++) {
    const ph = Math.floor(t * 9 + i * 3), a = (ph * 2.399) % 6.28, r0 = 24 + (ph * 7) % 16;
    let x = Math.cos(a) * r0, y = Math.sin(a) * r0 - 6;
    c.beginPath(); c.moveTo(x, y);
    for (let k = 1; k < 5; k++) { x += Math.cos(a + ((ph * k * 13) % 5 - 2) * 0.5) * 6; y += Math.sin(a + ((ph * k * 17) % 5 - 2) * 0.5) * 6; c.lineTo(x, y); }
    c.stroke();
  }
  c.restore();
};

// ---------- 孫悟空造型 ----------
PLANS.wukong = function (c, t, o) {
  const b = Math.sin(t * 2) * 1.6, fur = '#c89040', gold = '#f0c040', dk = 'rgba(30,14,6,0.85)';
  c.save(); c.translate(0, b);
  // 筋斗雲
  for (const [x, y, r, q] of [[-30, 40, 13, 0], [-12, 44, 16, 1], [10, 42, 17, 2], [30, 41, 13, 3], [-44, 42, 8, 4], [44, 42, 9, 5]]) {
    const yy = y + Math.sin(t * 2.4 + q) * 1.5, g = c.createRadialGradient(x - 3, yy - 5, 1, x, yy, r); g.addColorStop(0, '#ffffff'); g.addColorStop(0.7, '#ffe8b8'); g.addColorStop(1, '#f0b060');
    c.fillStyle = g; c.beginPath(); c.arc(x, yy, r, 0, 7); c.fill();
  }
  for (let i = 0; i < 3; i++) { c.strokeStyle = '#f8c870'; c.lineWidth = 1.2; c.beginPath(); c.arc(-20 + i * 22, 44 + (i % 2) * 2, 6, 0.4, 5.2); c.stroke(); }
  // 紅披風
  const cp = Math.sin(t * 2.2) * 3;
  const cg = c.createLinearGradient(-20, -20, 30, 40); cg.addColorStop(0, '#f04030'); cg.addColorStop(1, '#8a1010');
  c.fillStyle = cg; c.strokeStyle = dk; c.lineWidth = 0.9;
  c.beginPath(); c.moveTo(-13, -21); c.lineTo(13, -21); c.bezierCurveTo(30, -6, 34 + cp, 16, 44 + cp, 34); c.quadraticCurveTo(26 + cp, 26, 20, 34); c.quadraticCurveTo(0, 22, -18, 32); c.quadraticCurveTo(-26, 8, -13, -21); c.closePath(); c.fill(); c.stroke();
  c.strokeStyle = 'rgba(255,190,120,0.35)'; for (const x of [6, 16, 26]) { c.beginPath(); c.moveTo(x - 8, -16); c.quadraticCurveTo(x + 6, 6, x + 12 + cp * 0.6, 26); c.stroke(); }
  // 尾巴
  const tw = Math.sin(t * 2.6) * 4;
  A.body(c, [[8, 12], [28, 10], [40, -6 + tw], [32, -22 + tw], [40, -30 + tw]], [2.8, 1.2], fur);
  // 腿與戰靴
  for (const d of [-1, 1]) {
    A.body(c, [[d * 7, 10], [d * 11, 21], [d * 9, 32]], legW(6.2, 3.8), '#7a2a20');
    c.fillStyle = gold; c.strokeStyle = dk; c.lineWidth = 0.7; c.beginPath(); c.moveTo(d * 4, 30); c.lineTo(d * 14, 29); c.lineTo(d * 15, 37); c.lineTo(d * 20, 39); c.lineTo(d * 3, 39); c.closePath(); c.fill(); c.stroke();
    G.circle(c, d * 10, 21, 3.2, gold, dk, 0.7);
  }
  // 虎皮裙
  c.fillStyle = '#e0a030'; c.beginPath(); c.moveTo(-13, 5); c.lineTo(13, 5); c.lineTo(17, 20); c.lineTo(8, 17); c.lineTo(0, 22); c.lineTo(-8, 17); c.lineTo(-17, 20); c.closePath(); c.fill(); c.strokeStyle = dk; c.stroke();
  c.strokeStyle = '#3a2008'; c.lineWidth = 1.6; for (const [x0, y0, x1, y1] of [[-10, 8, -6, 15], [-3, 8, -1, 17], [4, 8, 3, 16], [10, 8, 8, 15]]) { c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); }
  // 黃金鎖子甲
  const ag = c.createLinearGradient(-15, 0, 15, 0); ag.addColorStop(0, '#fff0a0'); ag.addColorStop(0.45, gold); ag.addColorStop(1, '#8a5a10');
  c.fillStyle = ag; c.strokeStyle = dk; c.lineWidth = 1; c.beginPath(); c.moveTo(-15, -20); c.quadraticCurveTo(0, -25, 15, -20); c.lineTo(12, 6); c.lineTo(-12, 6); c.closePath(); c.fill(); c.stroke();
  c.strokeStyle = 'rgba(120,70,10,0.55)'; c.lineWidth = 0.5;
  for (let y = -17; y < 5; y += 3.4) for (let x = -12 + (Math.round(y) % 2 ? 1.6 : 0); x < 12; x += 3.4) { c.beginPath(); c.arc(x, y, 1.7, 0.2, 2.9); c.stroke(); }
  G.circle(c, 0, -8, 5, '#ff4030', '#fff0a0', 1.2);
  G.rr(c, -14, 3, 28, 4, 1.4, '#a02020', gold, 0.8);
  // 肩甲（獸面）
  for (const d of [-1, 1]) { const sg = c.createRadialGradient(d * 16, -22, 1, d * 18, -19, 10); sg.addColorStop(0, '#fff4b0'); sg.addColorStop(1, '#a06a14'); G.ell(c, d * 18, -19, 9.5, 7, sg, dk, 0.9); A.eye(c, d * 18, -19, 1.2, '#ff4030', false); }
  // 金箍棒與手臂
  const sw = Math.sin(t * 1.8) * 0.06;
  c.save(); c.translate(24, -6); c.rotate(0.42 + sw);
  const sg = c.createLinearGradient(-3, 0, 3, 0); sg.addColorStop(0, '#ff6a40'); sg.addColorStop(0.5, '#e02818'); sg.addColorStop(1, '#801008');
  c.save(); c.shadowColor = '#ffc040'; c.shadowBlur = 8; c.fillStyle = sg; c.fillRect(-2.6, -60, 5.2, 112); c.restore();
  for (const y of [-60, 44]) { c.fillStyle = gold; c.strokeStyle = dk; c.lineWidth = 0.6; c.fillRect(-3.8, y, 7.6, 10); c.strokeRect(-3.8, y, 7.6, 10); c.fillStyle = '#8a5a10'; c.fillRect(-3.8, y + 4, 7.6, 1.2); }
  c.restore();
  A.body(c, [[17, -17], [28, -10], [25, -6]], legW(5.2, 3.8), fur); G.circle(c, 25, -5, 3.6, '#e8b878', dk, 0.7);
  A.body(c, [[-17, -17], [-28, -22], [-36, -34]], legW(5.2, 3.2), fur); G.circle(c, -37, -36, 3.4, '#e8b878', dk, 0.7);
  G.rr(c, -33, -32, 7, 4, 1, gold, dk, 0.5);
  // 手遮額頭遠望的金光
  // 頭
  c.fillStyle = fur; c.strokeStyle = dk; c.lineWidth = 0.9; c.beginPath(); c.arc(0, -33, 12.5, 0, 7); c.fill(); c.stroke();
  for (let i = 0; i < 14; i++) { const a = i / 14 * 6.28; A.tube(c, [[Math.cos(a) * 11, -33 + Math.sin(a) * 11], [Math.cos(a) * 15, -33 + Math.sin(a) * 15]], [1.7, 0.2], '#a86a20', null); }
  for (const d of [-1, 1]) { G.ell(c, d * 13.5, -33, 3.4, 4.6, '#e8b878', dk, 0.8); }
  const fg = c.createRadialGradient(-2, -34, 1, 0, -31, 11); fg.addColorStop(0, '#ffe0b8'); fg.addColorStop(1, '#e0a878');
  c.fillStyle = fg; c.beginPath(); c.moveTo(-9, -36); c.quadraticCurveTo(-5, -41, 0, -37); c.quadraticCurveTo(5, -41, 9, -36); c.bezierCurveTo(10, -28, 6, -23, 0, -23); c.bezierCurveTo(-6, -23, -10, -28, -9, -36); c.closePath(); c.fill(); c.strokeStyle = dk; c.lineWidth = 0.7; c.stroke();
  for (const d of [-1, 1]) { A.eye(c, d * 4.2, -33.4, 2, '#ffc020'); c.strokeStyle = '#3a1a08'; c.lineWidth = 1.1; c.beginPath(); c.moveTo(d * 1.6, -36); c.lineTo(d * 7.6, -37.6); c.stroke(); }
  c.fillStyle = '#3a1a08'; c.beginPath(); c.ellipse(-1, -29.4, 0.7, 0.5, 0, 0, 7); c.ellipse(1, -29.4, 0.7, 0.5, 0, 0, 7); c.fill();
  c.strokeStyle = '#3a1a08'; c.lineWidth = 0.9; c.beginPath(); c.moveTo(-5, -26.4); c.quadraticCurveTo(0, -24, 5.4, -27.4); c.stroke();
  G.poly(c, [3.2, -26.2, 4.2, -24.4, 4.8, -26.6], '#ffffff');
  // 緊箍與鳳翅紫金冠
  G.rr(c, -11, -43, 22, 4.4, 2, '#fff0a0', '#8a5a10', 0.7);
  G.ell(c, 0, -46, 7, 5, gold, dk, 0.8); G.circle(c, 0, -46, 2.4, '#ff3040', '#fff', 0.5);
  for (const d of [-1, 1]) {
    c.fillStyle = gold; c.strokeStyle = dk; c.lineWidth = 0.6; c.beginPath(); c.moveTo(d * 8, -44); c.lineTo(d * 20, -52); c.lineTo(d * 16, -44); c.lineTo(d * 22, -42); c.lineTo(d * 9, -40); c.closePath(); c.fill(); c.stroke();
    const sway = Math.sin(t * 1.8 + d) * 3;
    const pl = A.tube(c, [[d * 5, -48], [d * 14, -66], [d * 32, -80 + sway], [d * 54, -78 + sway]], [1.7, 0.3], '#d02830', 'rgba(60,0,0,0.7)', 0.4);
    c.strokeStyle = 'rgba(255,230,160,0.7)'; c.lineWidth = 0.5; for (let i = 4; i < pl.length; i += 2) { const p = pl[i]; c.beginPath(); c.moveTo(p.x - 1.5, p.y - 1.5); c.lineTo(p.x + 1.5, p.y + 1.5); c.stroke(); }
  }
  c.restore();
};

// ---------- 金箍棒特效 ----------
FX.staff = async function (a, b) {
  await fxRun(640, (p, c) => {
    const e = p * p, y = lerp(-420, b.y - 40, e), w = 26 + p * 20;
    c.save(); c.translate(b.x, y); c.rotate(0.05);
    c.shadowColor = '#ffc040'; c.shadowBlur = 40;
    const g = c.createLinearGradient(-w, 0, w, 0); g.addColorStop(0, '#ff7040'); g.addColorStop(0.5, '#e02818'); g.addColorStop(1, '#801008');
    c.fillStyle = g; c.fillRect(-w, -560, w * 2, 560);
    c.fillStyle = '#ffd040'; c.fillRect(-w - 10, -60, w * 2 + 20, 60); c.fillRect(-w - 10, -520, w * 2 + 20, 60);
    c.fillStyle = '#8a5a10'; c.fillRect(-w - 10, -36, w * 2 + 20, 6);
    c.restore();
  });
  sfx('super'); sfxMove('地'); flashFx('#fff4c0', 0.95, 320); shakeFx(560, 26);
  ringFx(b.x, b.y + 60, 20, 360, '#ffd040', 600, 20); ringFx(b.x, b.y + 60, 10, 240, '#ff6030', 500, 12);
  spray(b.x, b.y + 50, '#ffd070', 70, 15, { g: 0.3, w: 120, s: 4 });
  await fxRun(420, (p, c) => { for (let i = 0; i < 9; i++) { const an = i * 0.7, r = 90 + p * 240; c.strokeStyle = `rgba(255,220,120,${1 - p})`; c.lineWidth = 5; c.beginPath(); c.moveTo(b.x + Math.cos(an) * 60, b.y + 60 + Math.sin(an) * 22); c.lineTo(b.x + Math.cos(an) * r, b.y + 60 + Math.sin(an) * r * 0.36); c.stroke(); } });
};
const playMoveFxBase = playMoveFx;
playMoveFx = async function (M, side) {
  if (M.fx) { await cutIn(M, side === 'p' ? B.me() : B.foe()); return FX[M.fx](POS[side], POS[side === 'p' ? 'f' : 'p']); }
  // 血量變多後一場戰鬥很長：同一招第二次起跳過橫幅
  const seen = (B.seenFx = B.seenFx || new Set());
  if (seen.has(M.n) && M.p && (M.ult || M.p >= 100)) { return fxFor(M)(POS[side], POS[side === 'p' ? 'f' : 'p'], 3); }
  seen.add(M.n);
  return playMoveFxBase(M, side);
};

// ---------- 花果山 ----------
THEME.huaguo = { g: '#7ac060', g2: '#6ab050', path: '#d8c08a', tree: '#3a9a40', tree2: '#1e6a2a', gc: '#2f7a2a', gh: '#a0e870', water: '#3a90e0', liq: 'fall', d1: '#c8ecff', d2: '#3a90e0', obst: 'peach', wx: 'green' };
LIGHT.huaguo = ['255,240,190', 0.08];
BBG.huaguo = { sky: ['#60b0f0', '#fff0c0'], hill: ['#4aa050', '#2a7a3a'], ground: ['#90d070', '#5a9a40'], plat: ['#b8e888', '#4a8a30'], tuft: '#3a8a30' };
OBST.peach = function (c, x, y, th, R) {
  c.fillStyle = '#6a4428'; c.beginPath(); c.roundRect(x + 19, y + 24, 10, 20, 3); c.fill();
  for (const [ox, oy, r] of [[24, 14, 19], [12, 22, 12], [36, 22, 12]]) { const g = c.createRadialGradient(x + ox - 5, y + oy - 6, 2, x + ox, y + oy, r); g.addColorStop(0, '#90e070'); g.addColorStop(1, th.tree2); c.fillStyle = g; c.beginPath(); c.arc(x + ox, y + oy, r, 0, 7); c.fill(); }
  for (let k = 0; k < 6; k++) { const px = x + 8 + R() * 32, py = y + 6 + R() * 24, g = c.createRadialGradient(px - 1, py - 1, 0.5, px, py, 4.4); g.addColorStop(0, '#fff0d0'); g.addColorStop(0.6, '#ff90a0'); g.addColorStop(1, '#e04060'); c.fillStyle = g; c.beginPath(); c.arc(px, py, 4.2, 0, 7); c.fill(); }
};
const drawLiquidBase = drawLiquid;
drawLiquid = function (th, tx, ty, sx, sy, t) {
  if (th.liq !== 'fall') return drawLiquidBase(th, tx, ty, sx, sy, t);
  const T = TILE, g = ctx.createLinearGradient(0, sy, 0, sy + T); g.addColorStop(0, '#d8f4ff'); g.addColorStop(1, '#5ab0f0'); ctx.fillStyle = g; ctx.fillRect(sx, sy, T, T);
  ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) { const x = sx + 4 + i * 10, o = (t * 150 + i * 31 + tx * 17) % 64; ctx.beginPath(); ctx.moveTo(x, sy + o - 16); ctx.lineTo(x, sy + Math.min(T, o + 8)); ctx.stroke(); }
};
MAPS.huaguo = {
  name: '花果山・水簾洞', theme: 'huaguo', world: '天界',
  rows: [
    'TTTTTT~~~~~~~~TTTTTT',
    'TTT...~~~~~~~~...TTT',
    'TT..............,,TT',
    'TT.,,..........,,,TT',
    'TT.,,....ff....,,,TT',
    'TT......====......TT',
    'TT,,,...====...,,,TT',
    'TT,,,...==.....,,,TT',
    '==========........TT',
    'TT,,,.............TT',
    'TT,,,.....,,,,....TT',
    'TT........,,,,....TT',
    'TTTTTTTTTTTTTTTTTTTT',
  ],
  exits: [{ x: 0, y: 8, w: 1, h: 1, to: 'sky', tx: 20, ty: 8 }], doors: {}, signs: {}, triggers: [],
  wild: [[309, 60, 64, 20], [310, 62, 66, 10], [101, 60, 63, 20], [102, 62, 65, 10], [14, 60, 63, 10], [21, 62, 65, 5]],
  npcs: [
    { id: 'wukong', x: 10, y: 3, dir: 'down', legend: WUKONG, name: '孫悟空', cond: () => !flag('legend' + WUKONG), talk: () => wukongBattle() },
    { id: 'monkey', x: 6, y: 8, dir: 'right', look: { hair: '#a87030', shirt: '#c89040', pants: '#a07030', skin: '#f0c090' }, name: '老猴子', talk: () => { healParty(); return say(['這裡是花果山，大聖爺爺的老家！', '吃顆蟠桃吧。（隊伍完全恢復了！）', '大聖爺爺最喜歡和強者打架了，你可要小心。'], { name: '老猴子' }); } },
  ],
  w: 20, h: 13, roofAt: {},
};
for (const n of MAPS.huaguo.npcs) n._home = [n.x, n.y];
CHAPTERS.huaguo = [50, '特別篇・齊天大聖'];
MAP_SONG.huaguo = 'route';
MONS[WUKONG].hab = '花果山・水簾洞';
MONS[THUNDER_GOD].hab = '雷鳴高原・山頂';
{ const r = MAPS.sky.rows[8]; MAPS.sky.rows[8] = r.slice(0, 20) + '=='; }
MAPS.sky.exits.push({ x: 21, y: 8, w: 1, h: 1, to: 'huaguo', tx: 1, ty: 8 });
MAPS.sky.triggers.push({ x: 20, y: 8, w: 1, h: 1, run: async () => { if (!flag('finalEnd')) { await say('雲的另一邊飄來桃子的香味……現在還過不去。'); stepBack(); } } });
MAPS.sky.signs = MAPS.sky.signs || {};
WORLD.huaguo = { p: [300, 440], spawn: [2, 8] };
WORLD_PAGES[1].ids.push('huaguo');

MAPS.thunder.npcs.push({ id: 'thundergod', x: 2, y: 2, dir: 'down', legend: THUNDER_GOD, name: '九天雷祖', cond: () => !flag('legend' + THUNDER_GOD), talk: () => legendBattle(THUNDER_GOD, 62, '天空裂開一道金光，九天雷祖踏雷而降！') });
MAPS.thunder.npcs[MAPS.thunder.npcs.length - 1]._home = [2, 2];

async function wukongBattle() {
  await say(flag('wukongMet') ? ['哈！又來啦？', '俺老孫等你好久了，看棒！'] : ['呔！哪裡來的小靈契師，敢闖俺老孫的花果山！', '俺乃齊天大聖孫悟空！大鬧天宮，十萬天兵都奈何不了俺！', '想收服俺？先吃俺老孫一棒！', '（打到牠體力剩一半以下，用靈符才有機會！）'], { name: '孫悟空' });
  setFlag('wukongMet');
  const c = await choose(['挑戰！', '先準備一下'], { title: '要挑戰齊天大聖嗎？', w: 320, x: W / 2 - 160, y: 300 });
  if (c !== 0) return;
  const r = await wildBattle(makeMon(WUKONG, 80), { boss: true });
  if (r === 'caught') { setFlag('legend' + WUKONG); await say(['好！俺老孫服了你！', '從今天起，俺就陪你闖蕩三界！'], { name: '孫悟空' }); }
  else if (r === 'win') await say(['哎呀！好傢伙，打得俺老孫好痛快！', '再來！下次用靈符試試看能不能抓住俺！'], { name: '孫悟空' });
}

// ---------- 圖鑑總數 ----------
const goalV4 = goal;
goal = function () { return goalV4().replace(/\b300\b/g, Object.keys(MONS).length); };

// ---------- 舊存檔換算血量（只換算一次）----------
function migrateV5() {
  S.v5 = 1;
  for (const m of S.party.concat(S.box)) {
    const ratio = m.maxHp ? m.hp / m.maxHp : 1;
    calcStats(m);
    m.hp = m.hp <= 0 ? 0 : Math.max(1, Math.round(m.maxHp * ratio));
  }
}
const worldLayerV4 = worldLayer;
worldLayer = function () {
  const L = worldLayerV4(), u = L.update;
  L.update = function (dt) { if (!S.v5) migrateV5(); return u.call(this, dt); };
  return L;
};

// ---------- 舊怪物造型細膩化：物件細節 ----------
const BX = {
  cup(c, s) {
    c.save(); c.beginPath(); c.moveTo(-30, -18); c.lineTo(30, -18); c.quadraticCurveTo(28, 30, 0, 32); c.quadraticCurveTo(-28, 30, -30, -18); c.clip();
    c.strokeStyle = '#3a70c0'; c.lineWidth = 1; for (let i = 0; i < 7; i++) { const x = -27 + i * 9; c.beginPath(); c.arc(x, 24, 5, Math.PI, 0); c.stroke(); c.beginPath(); c.arc(x + 4.5, -8, 3, 0, Math.PI); c.stroke(); }
    c.fillStyle = 'rgba(255,255,255,0.45)'; c.beginPath(); c.ellipse(-19, 2, 4, 14, 0.15, 0, 7); c.fill(); c.restore();
    c.strokeStyle = '#d8a830'; c.lineWidth = 1.6; c.beginPath(); c.ellipse(0, -18, 30, 7, 0, 0, Math.PI); c.stroke(); c.beginPath(); c.ellipse(0, 36, 22, 3.6, 0, 0, 7); c.stroke();
  },
  lantern(c, s) {
    for (let y = -24; y < 22; y += 11) { c.strokeStyle = 'rgba(120,20,10,0.45)'; c.lineWidth = 1.1; c.beginPath(); c.ellipse(0, y, 27 * Math.cos(y / 40), 2, 0, 0, 7); c.stroke(); }
    c.fillStyle = '#e8c050'; c.fillRect(-14, -40, 28, 2); c.fillRect(-14, 32, 28, 2);
    for (const x of [-4, 0, 4]) { c.strokeStyle = '#e04030'; c.lineWidth = 1.1; c.beginPath(); c.moveTo(x, 34); c.lineTo(x * 1.5, 46); c.stroke(); }
    G.circle(c, 0, 37, 2.2, '#e8c050');
  },
  book(c, s) {
    for (const d of [-1, 1]) { c.fillStyle = '#d8b050'; c.beginPath(); c.moveTo(d * 38, -28); c.lineTo(d * 30, -27); c.lineTo(d * 38, -20); c.closePath(); c.fill(); c.beginPath(); c.moveTo(d * 38, 24); c.lineTo(d * 30, 24); c.lineTo(d * 38, 17); c.closePath(); c.fill(); }
    c.save(); c.strokeStyle = s.c1; c.lineWidth = 1; c.globalAlpha = 0.65; c.beginPath(); c.arc(-18, 12, 6, 0, 7); c.stroke(); c.beginPath(); c.arc(18, 12, 6, 0, 7); c.stroke(); G.star(c, -18, 12, 5, 5, 2, 0, null, s.c1, 0.7); G.star(c, 18, 12, 6, 5, 2.4, 0, null, s.c1, 0.7); c.restore();
    c.fillStyle = '#d03040'; c.beginPath(); c.moveTo(-3, 26); c.lineTo(3, 26); c.lineTo(3, 40); c.lineTo(0, 36); c.lineTo(-3, 40); c.closePath(); c.fill();
  },
  cloud(c, s, t) { c.fillStyle = 'rgba(255,255,255,0.55)'; for (const [x, y, r] of [[-20, -2, 7], [-2, -18, 9], [20, -4, 7]]) { c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); } c.strokeStyle = 'rgba(90,110,160,0.35)'; c.lineWidth = 1; for (const [x, y, r] of [[-22, 8, 10], [22, 8, 11], [0, 2, 12]]) { c.beginPath(); c.arc(x, y, r, 0.3, 2.4); c.stroke(); } },
  key(c, s) { c.strokeStyle = '#fff0a0'; c.lineWidth = 1; c.beginPath(); c.arc(0, -22, 18, 0, 7); c.stroke(); for (let i = 0; i < 8; i++) { const a = i * 0.785; G.circle(c, Math.cos(a) * 18, -22 + Math.sin(a) * 18, 1.6, '#ff6040', '#fff0a0', 0.5); } for (let y = 6; y < 26; y += 6) { c.strokeStyle = s.c2; c.beginPath(); c.moveTo(-5, y); c.lineTo(5, y); c.stroke(); } },
  clock(c, s, t) {
    c.fillStyle = '#5a4a30'; c.font = 'bold 6px serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; ['XII', 'III', 'VI', 'IX'].forEach((n, i) => { const a = i * 1.5708 - 1.5708; c.fillText(n, Math.cos(a) * 19, -6 + Math.sin(a) * 19); }); c.textAlign = 'left'; c.textBaseline = 'alphabetic';
    c.save(); c.translate(0, -6); for (let i = 0; i < 3; i++) { c.save(); c.translate(-30 + i * 30, 30); c.rotate(t * (i % 2 ? -1 : 1)); G.star(c, 0, 0, 8, 6, 4, 0, '#c8a050', '#6a4a20', 0.6); c.restore(); } c.restore();
  },
  ball(c, s) { c.fillStyle = 'rgba(255,255,255,0.55)'; c.beginPath(); c.ellipse(-11, -14, 9, 5, -0.6, 0, 7); c.fill(); c.strokeStyle = 'rgba(0,0,0,0.12)'; c.lineWidth = 1; for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(-20 + (i * 17) % 40, -14 + (i * 23) % 36, 2 + i % 3, 0, 4); c.stroke(); } },
  snowman(c) { for (const y of [-6, 8]) { c.strokeStyle = 'rgba(100,140,190,0.4)'; c.lineWidth = 1; c.beginPath(); c.arc(0, y - 8, 16, 0.4, 2.7); c.stroke(); } for (const [x, y] of [[-8, 26], [9, 30], [-4, 36], [12, 18]]) G.circle(c, x, y, 1.2, '#b8d4ec'); },
  candle(c, s) { c.fillStyle = 'rgba(255,255,255,0.6)'; for (const [x, h] of [[-12, 22], [-2, 14], [9, 26], [15, 11]]) { c.beginPath(); c.roundRect(x, -24, 5, h, 2.5); c.fill(); } c.strokeStyle = '#c8a050'; c.lineWidth = 1.6; c.beginPath(); c.ellipse(0, 39, 22, 4, 0, 0, 7); c.stroke(); },
  leaf(c, s) { c.fillStyle = 'rgba(0,0,0,0.12)'; for (const [x, y, r] of [[10, -10, 2.2], [-9, 4, 1.8], [7, 12, 1.4]]) { c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); } c.strokeStyle = 'rgba(255,255,255,0.3)'; c.lineWidth = 0.7; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(1, -24 + i * 13); c.quadraticCurveTo(10, -30 + i * 13, 17, -32 + i * 14); c.stroke(); } },
  cube(c, s) { c.strokeStyle = 'rgba(0,0,0,0.3)'; c.lineWidth = 1; for (const p of [[-24, -14, -14, -8, -18, 2], [14, -16, 8, -4, 16, 6], [-22, 22, -10, 18, -6, 30], [6, 26, 14, 20, 18, 30]]) { c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(p[2], p[3]); c.lineTo(p[4], p[5]); c.stroke(); } c.fillStyle = 'rgba(100,150,70,0.55)'; c.beginPath(); c.ellipse(-8, -22, 13, 2.6, 0, 0, 7); c.fill(); },
  moon(c, s) { c.fillStyle = 'rgba(120,90,50,0.22)'; c.strokeStyle = 'rgba(255,255,255,0.3)'; c.lineWidth = 0.7; for (const [x, y, r] of [[-22, -14, 5], [-27, 8, 4], [-14, 20, 6], [-10, -24, 3]]) { c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.stroke(); } },
  star(c, s) { c.strokeStyle = 'rgba(255,255,255,0.6)'; c.lineWidth = 0.8; for (let i = 0; i < 5; i++) { const a = -1.57 + i * 1.257; c.beginPath(); c.moveTo(0, 2); c.lineTo(Math.cos(a) * 36, 2 + Math.sin(a) * 36); c.stroke(); } },
  bell(c, s) { c.strokeStyle = 'rgba(90,50,10,0.5)'; c.lineWidth = 1; c.beginPath(); c.moveTo(-31, 15); c.quadraticCurveTo(0, 21, 31, 15); c.moveTo(-27, 6); c.quadraticCurveTo(0, 12, 27, 6); c.stroke(); for (let i = -3; i <= 3; i++) G.star(c, i * 8, 15 + (3 - Math.abs(i)) * 0.5 + 0.6, 4, 2, 0.7, 0, '#fff0a0'); c.fillStyle = 'rgba(255,255,255,0.45)'; c.beginPath(); c.ellipse(-14, -14, 3.4, 12, 0.3, 0, 7); c.fill(); },
  tv(c, s) { c.fillStyle = '#20202a'; for (let i = 0; i < 4; i++) c.fillRect(24, 8 + i * 3.4, 10, 1.6); c.strokeStyle = 'rgba(255,255,255,0.3)'; c.lineWidth = 1; c.strokeRect(-34, -26, 68, 52); G.rr(c, -10, 28, 20, 4, 1, '#30303a'); },
  pot(c, s) { c.strokeStyle = 'rgba(255,220,180,0.5)'; c.lineWidth = 1.2; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(-20 + i * 8, 6); c.lineTo(-16 + i * 8, 11); c.lineTo(-12 + i * 8, 6); c.stroke(); } c.fillStyle = '#5a3a20'; c.beginPath(); c.ellipse(0, -12, 26, 4, 0, 0, 7); c.fill(); },
  shell(c, s) { c.fillStyle = 'rgba(255,255,255,0.3)'; for (let i = -3; i <= 3; i++) { c.beginPath(); c.arc(i * 9.5, 28 - Math.abs(i) * 2, 3.8, Math.PI, 0); c.fill(); } G.circle(c, 0, 28, 4, '#fff8f0', 'rgba(120,90,140,0.7)', 0.8); },
  cyl(c, s) { c.strokeStyle = 'rgba(255,240,200,0.65)'; c.lineWidth = 1.1; c.setLineDash([3, 2.4]); for (const x of [-16, 16]) { c.beginPath(); c.moveTo(x, -24); c.lineTo(x, 28); c.stroke(); } c.setLineDash([]); c.fillStyle = 'rgba(255,255,255,0.18)'; c.fillRect(-13, -24, 6, 52); G.circle(c, 0, -30, 2, '#e0e0e8'); for (const x of [-20, 20]) G.circle(c, x, -30, 1.3, '#e0e0e8'); },
  cone(c, s) { c.strokeStyle = 'rgba(120,70,20,0.5)'; c.lineWidth = 0.9; for (let i = -3; i < 4; i++) { c.beginPath(); c.moveTo(i * 8, 0); c.lineTo(i * 3 + 3, 38); c.stroke(); } for (const [x, y, col] of [[-12, -8, '#ff70a0'], [9, -12, '#70d0ff'], [2, -24, '#ffe060'], [13, 0, '#90f080'], [-5, -14, '#c090ff']]) { c.save(); c.translate(x, y); c.rotate(x); c.fillStyle = col; c.fillRect(-2, -0.7, 4, 1.4); c.restore(); } },
  mask(c, s) { c.strokeStyle = 'rgba(30,20,40,0.55)'; c.lineWidth = 1; c.beginPath(); c.moveTo(16, -34); c.lineTo(10, -22); c.lineTo(16, -14); c.lineTo(10, -4); c.stroke(); c.strokeStyle = s.c2; c.lineWidth = 1.4; for (const d of [-1, 1]) { c.beginPath(); c.moveTo(d * 22, 8); c.quadraticCurveTo(d * 16, 20, d * 8, 28); c.stroke(); G.star(c, d * 20, 20, 4, 3, 1, 0, s.c2); } },
  mush(c, s) { c.strokeStyle = 'rgba(90,70,70,0.4)'; c.lineWidth = 0.8; for (let i = -8; i <= 8; i++) { c.beginPath(); c.moveTo(i * 4.4, -8); c.lineTo(i * 1.5, -2); c.stroke(); } c.fillStyle = 'rgba(255,255,255,0.3)'; c.beginPath(); c.ellipse(-14, -24, 9, 4, -0.5, 0, 7); c.fill(); },
  pinwheel(c, s) { G.circle(c, 0, -10, 15, null, '#c8a050', 1.4); c.strokeStyle = 'rgba(70,40,20,0.5)'; c.lineWidth = 0.8; for (let y = 8; y < 42; y += 7) { c.beginPath(); c.moveTo(-2, y); c.lineTo(2, y + 3); c.stroke(); } },
  fish(c, s) { c.strokeStyle = 'rgba(0,0,0,0.2)'; c.lineWidth = 0.7; for (let x = -8; x < 28; x += 6) for (let y = -18; y < 20; y += 6) { c.beginPath(); c.arc(x + (y % 12 ? 3 : 0), y, 3, 0.4, 2.7); c.stroke(); } c.fillStyle = 'rgba(255,255,255,0.45)'; c.beginPath(); c.ellipse(-20, 14, 9, 3, 0, 0, 7); c.fill(); },
  drop(c, s) { c.fillStyle = 'rgba(255,255,255,0.5)'; c.beginPath(); c.ellipse(-11, 8, 4, 11, 0.2, 0, 7); c.fill(); G.circle(c, 12, 18, 2, 'rgba(255,255,255,0.5)'); },
  tri(c, s) { c.strokeStyle = 'rgba(255,255,255,0.5)'; c.lineWidth = 1; c.beginPath(); c.moveTo(0, -30); c.lineTo(-23, 24); c.lineTo(23, 24); c.closePath(); c.stroke(); },
  egg(c, s) { for (let i = 0; i < 6; i++) { const a = i * 1.047; G.star(c, Math.cos(a) * 18, -2 + Math.sin(a) * 24, 4, 3, 1, 0, s.c2); } },
};
for (const k in BODY) {
  const base = BODY[k], ex = BX[k];
  if (ex) BODY[k] = (c, s, t) => { const f = base(c, s, t); c.save(); ex(c, s, t, f); c.restore(); return f; };
}
// 表情：豆豆眼改成有虹膜、高光、眼瞼的眼睛
function eye2(c, x, y, r, iris) {
  G.ell(c, x, y, r * 1.15, r * 1.3, '#ffffff', 'rgba(20,12,10,0.85)', r * 0.3);
  const g = c.createRadialGradient(x, y + r * 0.3, 0.2, x, y, r); g.addColorStop(0, sh(iris, 0.45)); g.addColorStop(1, sh(iris, -0.35));
  c.fillStyle = g; c.beginPath(); c.arc(x, y + r * 0.12, r * 0.86, 0, 7); c.fill();
  c.fillStyle = '#0a0608'; c.beginPath(); c.arc(x, y + r * 0.12, r * 0.44, 0, 7); c.fill();
  c.fillStyle = '#fff'; c.beginPath(); c.arc(x - r * 0.34, y - r * 0.36, r * 0.3, 0, 7); c.fill(); c.beginPath(); c.arc(x + r * 0.3, y + r * 0.34, r * 0.14, 0, 7); c.fill();
  c.strokeStyle = 'rgba(20,12,10,0.9)'; c.lineWidth = r * 0.42; c.lineCap = 'round'; c.beginPath(); c.arc(x, y + r * 0.2, r * 1.2, Math.PI * 1.14, Math.PI * 1.86); c.stroke();
}
const eyesAt = (c, f, dy, gap) => { for (const d of [-1, 1]) eye2(c, f.x + d * gap * f.s, f.y + dy * f.s, 3.1 * f.s, f.iris || '#5a8ad0'); };
const faceBase = Object.assign({}, FACE);
FACE.smile = (c, f, col) => { eyesAt(c, f, -5, 8.5); G.smile(c, f.x, f.y + 1 * f.s, 6.5 * f.s, col, 1.7 * f.s); };
FACE.dot = (c, f, col) => { eyesAt(c, f, -4, 8.5); G.line(c, [f.x - 4 * f.s, f.y + 7 * f.s, f.x + 4 * f.s, f.y + 7 * f.s], col, 1.6 * f.s); };
FACE.angry = (c, f, col) => { eyesAt(c, f, -4, 8.5); G.line(c, [f.x - 14 * f.s, f.y - 12 * f.s, f.x - 4 * f.s, f.y - 7 * f.s], col, 2.6 * f.s); G.line(c, [f.x + 14 * f.s, f.y - 12 * f.s, f.x + 4 * f.s, f.y - 7 * f.s], col, 2.6 * f.s); G.frown(c, f.x, f.y + 7 * f.s, 5 * f.s, col, 1.8 * f.s); };
FACE.sad = (c, f, col) => { eyesAt(c, f, -4, 8.5); G.frown(c, f.x, f.y + 7 * f.s, 5 * f.s, col, 1.8 * f.s); G.ell(c, f.x - 9 * f.s, f.y + 3 * f.s, 1.6 * f.s, 3 * f.s, '#7ac0ff'); };
FACE.o = (c, f, col) => { eyesAt(c, f, -5, 8.5); G.ell(c, f.x, f.y + 6 * f.s, 3.5 * f.s, 4.5 * f.s, col); };
FACE.grin = (c, f, col, t) => { eyesAt(c, f, -7, 9); c.beginPath(); c.arc(f.x, f.y + 1 * f.s, 11 * f.s, 0.1 * Math.PI, 0.9 * Math.PI); c.closePath(); G.fs(c, '#fff', col, 1.3 * f.s); for (let i = -2; i <= 2; i++) G.line(c, [f.x + i * 4 * f.s, f.y + 2 * f.s, f.x + i * 4 * f.s, f.y + 10 * f.s], col, 0.7 * f.s); };
FACE.teeth = (c, f, col, t) => { const q = Object.assign({}, f); eyesAt(c, f, -11, 10); G.rr(c, f.x - 16 * f.s, f.y - 4 * f.s, 32 * f.s, 18 * f.s, 4 * f.s, '#2a0a14', 'rgba(20,10,10,0.8)', 0.8); c.fillStyle = '#a02040'; c.beginPath(); c.ellipse(f.x, f.y + 11 * f.s, 8 * f.s, 3 * f.s, 0, 0, 7); c.fill(); G.teeth(c, f.x - 16 * f.s, f.x + 16 * f.s, f.y - 4 * f.s, 7 * f.s, 6, '#f8f0dc', 1); G.teeth(c, f.x - 14 * f.s, f.x + 14 * f.s, f.y + 14 * f.s, 6 * f.s, 5, '#f8f0dc', -1); };

// ---------- 整體質感：明暗、邊緣光、礦石顆粒（用在 No.1~100）----------
const GRAIN = (function () {
  const cv = document.createElement('canvas'); cv.width = cv.height = 128;
  const c = cv.getContext('2d'), R = srand(4242);
  for (let i = 0; i < 2600; i++) { const v = R(); c.fillStyle = v > 0.72 ? `rgba(255,240,200,${0.1 + R() * 0.32})` : `rgba(10,6,20,${0.08 + R() * 0.24})`; const s = 0.5 + R() * 1.3; c.fillRect(R() * 128, R() * 128, s, s); }
  return cv;
})();
const polishA = document.createElement('canvas'), polishB = document.createElement('canvas');
function polished(id, size, t, opt) {
  const R = Math.ceil(size * 1.05), px = R * 2 * SS;
  if (polishA.width < px) { polishA.width = polishA.height = polishB.width = polishB.height = px + 64; }
  const a = polishA.getContext('2d'), b = polishB.getContext('2d');
  a.setTransform(1, 0, 0, 1, 0, 0); a.globalCompositeOperation = 'source-over'; a.clearRect(0, 0, polishA.width, polishA.height);
  a.setTransform(SS, 0, 0, SS, 0, 0);
  drawMonLive(a, id, R, R, size, t, { flip: opt.flip, sink: opt.sink, still: opt.still });
  // 邊緣光：左上緣亮起
  b.setTransform(1, 0, 0, 1, 0, 0); b.globalCompositeOperation = 'source-over'; b.clearRect(0, 0, polishB.width, polishB.height);
  b.drawImage(polishA, 0, 0);
  b.globalCompositeOperation = 'source-in'; b.fillStyle = '#fffbe8'; b.fillRect(0, 0, px, px);
  b.globalCompositeOperation = 'destination-out'; b.drawImage(polishA, 2.6 * SS, 2.6 * SS);
  // 明暗與顆粒
  a.globalCompositeOperation = 'source-atop';
  const g = a.createLinearGradient(R * 0.45, R * 0.3, R * 1.55, R * 1.8); g.addColorStop(0, 'rgba(255,245,220,0.22)'); g.addColorStop(0.5, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(10,4,30,0.48)');
  a.fillStyle = g; a.fillRect(0, 0, R * 2, R * 2);
  a.globalAlpha = 0.8; a.fillStyle = a.createPattern(GRAIN, 'repeat'); a.fillRect(0, 0, R * 2, R * 2); a.globalAlpha = 1;
  a.globalAlpha = 0.55; a.setTransform(1, 0, 0, 1, 0, 0); a.drawImage(polishB, 0, 0); a.globalAlpha = 1;
  a.globalCompositeOperation = 'source-over'; a.setTransform(1, 0, 0, 1, 0, 0);
  return { cv: polishA, R, px };
}
const drawMonV4 = drawMon;
const POLISH_CACHE = {};
drawMon = function (cx, id, x, y, size, t, opt = {}) {
  if (!MONS[id] || MONS[id].art) return drawMonV4(cx, id, x, y, size, t, opt);
  cx.save(); if (opt.alpha != null) cx.globalAlpha = opt.alpha;
  if (opt.still && size <= 130) {
    const key = id + '_' + size;
    let cv = POLISH_CACHE[key];
    if (!cv) { const r = polished(id, size, 1.2, { still: true }); cv = POLISH_CACHE[key] = document.createElement('canvas'); cv.width = cv.height = r.px; cv.getContext('2d').drawImage(r.cv, 0, 0); cv.R = r.R; }
    cx.drawImage(cv, x - cv.R, y - cv.R, cv.R * 2, cv.R * 2);
  } else {
    const r = polished(id, size, t, opt);
    cx.drawImage(r.cv, 0, 0, r.px, r.px, x - r.R, y - r.R, r.R * 2, r.R * 2);
  }
  cx.restore();
  if (opt.flash) { cx.save(); cx.globalCompositeOperation = 'lighter'; cx.globalAlpha = opt.flash; cx.fillStyle = '#fff'; cx.beginPath(); cx.ellipse(x, y, size * 0.45, size * 0.48, 0, 0, 7); cx.fill(); cx.restore(); }
};

// ---------- 仙子改成長髮女性造型 ----------
PLANS.fairy = function (c, t, o) {
  const skin = o.skin || '#fbe4d2', hair = o.hair || o.b, hairLt = sh(hair, 0.32), hairDk = sh(hair, -0.3), dk = 'rgba(30,14,30,0.8)';
  const fl = Math.sin(t * 5) * 0.09, sway = Math.sin(t * 1.8);
  c.save(); c.translate(0, -5 + Math.sin(t * 2.2) * 2.4);
  // 蝴蝶翅膀
  for (const d of [-1, 1]) {
    c.save(); c.scale(d, 1); c.translate(3, -9); c.rotate(-fl);
    const wing = (pts, col) => {
      const g = c.createRadialGradient(6, 0, 3, 26, 0, 50); g.addColorStop(0, sh(col, 0.65)); g.addColorStop(0.6, col); g.addColorStop(1, sh(col, -0.42));
      c.fillStyle = g; c.strokeStyle = sh(col, -0.6); c.lineWidth = 1.1; c.beginPath(); c.moveTo(0, 0); for (const p of pts) c.bezierCurveTo(...p); c.closePath(); c.fill(); c.stroke();
    };
    wing([[12, 13, 16, 34, 32, 37], [40, 38, 44, 22, 34, 13], [26, 8, 10, 5, 0, 0]], o.b);
    wing([[6, -24, 28, -48, 50, -42], [62, -38, 60, -14, 46, -3], [32, 5, 12, 5, 0, 0]], o.a);
    c.strokeStyle = 'rgba(40,16,40,0.32)'; c.lineWidth = 0.7;
    for (const [x, y] of [[50, -40], [56, -24], [48, -6], [34, 34], [38, 20]]) { c.beginPath(); c.moveTo(1, 0); c.quadraticCurveTo(x * 0.5, y * 0.2, x, y); c.stroke(); }
    c.save(); c.shadowColor = o.c; c.shadowBlur = 7;
    G.circle(c, 38, -25, 6.4, sh(o.c, 0.35), sh(o.a, -0.55), 1.3); G.circle(c, 38, -25, 2.4, sh(o.a, -0.5)); G.circle(c, 29, 24, 3.8, sh(o.c, 0.35), sh(o.b, -0.55), 1);
    c.restore();
    for (const [x, y] of [[51, -34], [55, -18], [46, -9], [38, 31]]) G.circle(c, x, y, 1.4, '#fffdf0');
    c.restore();
  }
  // 後方長髮
  const hairLen = 22 + o.s * 6;
  const back = c.createLinearGradient(0, -36, 0, hairLen); back.addColorStop(0, hairLt); back.addColorStop(0.55, hair); back.addColorStop(1, hairDk);
  c.fillStyle = back; c.strokeStyle = dk; c.lineWidth = 0.7;
  c.beginPath(); c.moveTo(-11, -28); c.bezierCurveTo(-18, -8, -16 + sway, hairLen * 0.6, -20 + sway * 3, hairLen);
  c.quadraticCurveTo(-11 + sway, hairLen - 7, -6 + sway * 2, hairLen + 3); c.quadraticCurveTo(0, hairLen - 5, 6 + sway * 2, hairLen + 3); c.quadraticCurveTo(12 + sway, hairLen - 7, 20 + sway * 3, hairLen);
  c.bezierCurveTo(16 + sway, hairLen * 0.6, 18, -8, 11, -28); c.closePath(); c.fill(); c.stroke();
  // 腿
  for (const d of [-1, 1]) { A.body(c, [[d * 3.2, 17], [d * 4, 28], [d * 3.4, 39]], [2.5, 1.4], skin); G.ell(c, d * 3.6, 40, 2.6, 1.5, sh(o.a, -0.15), dk, 0.5); }
  // 洋裝：收腰、蓬裙、層次裙擺
  const dress = c.createLinearGradient(-14, 0, 14, 0); dress.addColorStop(0, sh(o.a, 0.42)); dress.addColorStop(0.5, o.a); dress.addColorStop(1, sh(o.a, -0.25));
  c.fillStyle = sh(o.b, 0.1); c.strokeStyle = dk; c.lineWidth = 0.7;
  c.beginPath(); c.moveTo(-5, 2); c.quadraticCurveTo(-14, 12, -19, 25); for (let i = 0; i < 7; i++) c.quadraticCurveTo(-16.5 + i * 5.5, 30 + (i % 2) * 3, -13.5 + i * 5.5, 25 + (i % 2)); c.quadraticCurveTo(14, 12, 5, 2); c.closePath(); c.fill(); c.stroke();
  c.fillStyle = dress; c.beginPath(); c.moveTo(-6.4, -13); c.quadraticCurveTo(-4.4, -5, -4.4, 1); c.quadraticCurveTo(-13, 10, -15, 20); for (let i = 0; i < 6; i++) c.quadraticCurveTo(-12.5 + i * 5, 25 - (i % 2) * 4, -10 + i * 5, 20 + (i % 2) * 1.6); c.quadraticCurveTo(13, 10, 4.4, 1); c.quadraticCurveTo(4.4, -5, 6.4, -13); c.quadraticCurveTo(0, -9, -6.4, -13); c.closePath(); c.fill(); c.stroke();
  c.strokeStyle = 'rgba(255,255,255,0.4)'; c.lineWidth = 0.6; for (const x of [-7, -2.4, 2.4, 7]) { c.beginPath(); c.moveTo(x * 0.4, 3); c.quadraticCurveTo(x, 11, x * 1.5, 20); c.stroke(); }
  G.rr(c, -4.8, -1, 9.6, 2.4, 1.1, o.c, dk, 0.4);
  G.circle(c, 0, 0.2, 1.8, sh(o.c, 0.45), dk, 0.4);
  // 手臂
  A.body(c, [[-6, -11], [-11, -3], [-8, 5]], [1.8, 1.25], skin);
  A.body(c, [[6, -11], [12, -7], [19, -13]], [1.8, 1.25], skin);
  c.save(); c.shadowColor = o.c; c.shadowBlur = 11; c.strokeStyle = '#e8c868'; c.lineWidth = 1.1; c.beginPath(); c.moveTo(18, -8); c.lineTo(22, -24); c.stroke(); G.star(c, 22.5, -27, 5, 5.4, 2.2, -1.57 + Math.sin(t * 2) * 0.3, sh(o.c, 0.35), '#fff', 0.4); c.restore();
  // 頸與臉
  G.rr(c, -1.7, -17, 3.4, 5, 1.4, skin);
  const fg = c.createRadialGradient(-2, -25, 1, 0, -23, 10); fg.addColorStop(0, '#fff6ee'); fg.addColorStop(1, shade(skin, -0.08));
  c.fillStyle = fg; c.beginPath(); c.moveTo(-7.2, -26); c.bezierCurveTo(-7.8, -21, -4.6, -16.6, 0, -15.6); c.bezierCurveTo(4.6, -16.6, 7.8, -21, 7.2, -26); c.bezierCurveTo(6.6, -33, -6.6, -33, -7.2, -26); c.closePath(); c.fill(); c.strokeStyle = 'rgba(70,30,30,0.6)'; c.lineWidth = 0.55; c.stroke();
  for (const d of [-1, 1]) {
    G.ell(c, d * 3.1, -23.3, 1.75, 2.15, '#ffffff', 'rgba(40,16,30,0.75)', 0.4);
    G.ell(c, d * 3.1, -23.1, 1.3, 1.75, sh(o.c, -0.3)); G.circle(c, d * 3.1, -23, 0.72, '#180a14'); G.circle(c, d * 3.1 - 0.45, -23.8, 0.42, '#ffffff');
    c.strokeStyle = '#2a1020'; c.lineWidth = 0.65; c.lineCap = 'round'; c.beginPath(); c.arc(d * 3.1, -22.9, 2.15, Math.PI * 1.08, Math.PI * 1.92); c.moveTo(d * 5.2, -24.3); c.lineTo(d * 6.3, -25.2); c.stroke();
    c.strokeStyle = hairDk; c.lineWidth = 0.42; c.beginPath(); c.moveTo(d * 1.6, -27); c.quadraticCurveTo(d * 3.6, -28, d * 5.4, -26.9); c.stroke();
    G.ell(c, d * 4.5, -20.5, 1.45, 0.85, 'rgba(255,120,150,0.38)');
  }
  c.fillStyle = '#e8506c'; c.beginPath(); c.moveTo(-1.5, -18.8); c.quadraticCurveTo(0, -19.6, 1.5, -18.8); c.quadraticCurveTo(0, -17.7, -1.5, -18.8); c.closePath(); c.fill();
  // 前髮與兩側長髮
  const top = c.createLinearGradient(0, -36, 0, -18); top.addColorStop(0, hairLt); top.addColorStop(1, hairDk);
  c.fillStyle = top; c.strokeStyle = dk; c.lineWidth = 0.6;
  c.beginPath(); c.moveTo(-8.8, -21); c.bezierCurveTo(-11, -36, 11, -36, 8.8, -21); c.quadraticCurveTo(7, -27, 3.6, -29.4); c.quadraticCurveTo(3, -27.2, -0.6, -28.2); c.quadraticCurveTo(-2.8, -27, -4.4, -29.2); c.quadraticCurveTo(-7, -26.4, -8.8, -21); c.closePath(); c.fill(); c.stroke();
  for (const d of [-1, 1]) { const lock = A.tube(c, [[d * 8.2, -27], [d * 9.8, -14], [d * 8.2 + sway, -3], [d * 10 + sway * 2, 6 + o.s * 2]], u => 2.3 * (1 - u * 0.8), hair, dk, 0.5); }
  c.strokeStyle = 'rgba(255,255,255,0.32)'; c.lineWidth = 0.7; c.beginPath(); c.arc(0, -25, 7.6, Math.PI * 1.2, Math.PI * 1.65); c.stroke();
  // 髮飾與后冠
  if (o.s >= 2) { c.save(); c.shadowColor = o.c; c.shadowBlur = 6; G.poly(c, [-5, -33, -6, -37.4, -2.8, -35, 0, -39.4, 2.8, -35, 6, -37.4, 5, -33], '#f4cc58', '#8a6010', 0.5); G.circle(c, 0, -35, 0.95, '#ff5088'); c.restore(); }
  else for (let i = 0; i < 5; i++) { const a = i * 1.257; G.circle(c, -6 + Math.cos(a) * 1.6, -31 + Math.sin(a) * 1.6, 1, sh(o.c, 0.3)); }
  c.strokeStyle = sh(o.a, -0.3); c.lineWidth = 0.55; for (const d of [-1, 1]) { c.beginPath(); c.moveTo(d * 2, -32); c.quadraticCurveTo(d * 5, -44, d * 12, -46); c.stroke(); G.circle(c, d * 12, -46, 1.1, o.c); }
  c.restore();
};
