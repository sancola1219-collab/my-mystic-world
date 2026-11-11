// ===== 番外篇：米老鼠班道館＋全怪物強化 =====

// ---------- 全怪物強化：對手再強一截 ----------
const FOE_POWER = 1.15;
const runBattleBase = runBattle;
runBattle = function (cfg) {
  for (const m of cfg.foeTeam) { m.atk = Math.round(m.atk * FOE_POWER); m.def = Math.round(m.def * FOE_POWER); m.spd = Math.round(m.spd * FOE_POWER); m.maxHp = m.hp = Math.round(m.maxHp * FOE_POWER); }
  return runBattleBase(cfg);
};
const addMonBase = addMon;
addMon = function (m) { const r = m.maxHp ? m.hp / m.maxHp : 1; calcStats(m); m.hp = Math.max(1, Math.round(m.maxHp * r)); return addMonBase(m); }; // 收服後回到一般數值
function migrateV7() {
  S.v7 = 1;
  for (const m of S.party.concat(S.box)) { const r = m.maxHp ? m.hp / m.maxHp : 1; calcStats(m); m.hp = m.hp <= 0 ? 0 : Math.max(1, Math.round(m.maxHp * r)); }
}

// ---------- 魔王：彭子甯（水／火，可愛小女孩）----------
PLANS.littlegirl = function (c, t, o) {
  const skin = '#ffe6d4', dk = 'rgba(40,20,30,0.8)', sway = Math.sin(t * 2) * 1.2;
  c.save(); c.translate(0, Math.sin(t * 2.4) * 1.6 + 6);
  // 水火光輪
  c.save(); c.translate(0, -8); c.rotate(t * 0.6);
  for (let i = 0; i < 12; i++) { const an = i * 0.5236, hot = i % 2; c.save(); c.rotate(an); c.translate(46, 0); c.shadowColor = hot ? '#ff6020' : '#40a0ff'; c.shadowBlur = 12; c.fillStyle = hot ? '#ffa040' : '#70c0ff'; c.beginPath(); c.moveTo(8, 0); c.quadraticCurveTo(0, -7, -8, 0); c.quadraticCurveTo(0, 7, 8, 0); c.fill(); c.restore(); }
  c.restore();
  // 雙馬尾：一邊水藍、一邊火紅
  for (const d of [-1, 1]) {
    const col = d < 0 ? '#4aa0f0' : '#f05a30', col2 = d < 0 ? '#a8e0ff' : '#ffc070';
    const g = c.createLinearGradient(0, -30, 0, 12); g.addColorStop(0, col2); g.addColorStop(1, col);
    c.fillStyle = g; c.strokeStyle = dk; c.lineWidth = 0.7;
    c.beginPath(); c.moveTo(d * 11, -30); c.bezierCurveTo(d * 28, -30, d * (30 + sway), -8, d * (20 + sway), 12); c.bezierCurveTo(d * 19, -2, d * 14, -14, d * 9, -22); c.closePath(); c.fill(); c.stroke();
    G.circle(c, d * 12, -30, 3, d < 0 ? '#ff6090' : '#ffd040', dk, 0.5);
  }
  // 腿與小鞋
  for (const d of [-1, 1]) { A.body(c, [[d * 4, 18], [d * 4.6, 28], [d * 4.4, 35]], [2.7, 2.1], skin); G.ell(c, d * 5, 37, 3.8, 2.4, '#e84a7a', dk, 0.6); }
  // 雙色小洋裝
  c.save(); c.beginPath(); c.moveTo(-6, -10); c.quadraticCurveTo(-7, 4, -17, 19); c.quadraticCurveTo(0, 25, 17, 19); c.quadraticCurveTo(7, 4, 6, -10); c.closePath();
  const dg = c.createLinearGradient(-15, 0, 15, 0); dg.addColorStop(0, '#5ab8f8'); dg.addColorStop(0.48, '#a8dcff'); dg.addColorStop(0.52, '#ffc088'); dg.addColorStop(1, '#f86838');
  c.fillStyle = dg; c.fill(); c.strokeStyle = dk; c.lineWidth = 0.8; c.stroke(); c.restore();
  c.strokeStyle = '#fff'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-16.4, 18); c.quadraticCurveTo(0, 24, 16.4, 18); c.stroke();
  G.poly(c, [0, -6, -6, -9.6, -6, -2.4], '#ff6090', dk, 0.5); G.poly(c, [0, -6, 6, -9.6, 6, -2.4], '#ff6090', dk, 0.5); G.circle(c, 0, -6, 1.5, '#ffd0e0');
  // 手與水火
  A.body(c, [[-6, -8], [-14, -3], [-20, -8]], [2, 1.5], skin); A.body(c, [[6, -8], [14, -3], [20, -8]], [2, 1.5], skin);
  c.save(); c.shadowColor = '#40a0ff'; c.shadowBlur = 14; const wg = c.createRadialGradient(-25, -15, 1, -24, -13, 8); wg.addColorStop(0, '#ffffff'); wg.addColorStop(1, '#3a90f0'); G.circle(c, -24, -13, 7 + Math.sin(t * 3) * 0.6, wg); c.restore();
  c.save(); c.translate(24, -10); c.shadowColor = '#ff6020'; c.shadowBlur = 14; const fl = Math.sin(t * 9) * 2; c.fillStyle = '#ff7a20'; c.beginPath(); c.moveTo(-6.4, 2); c.quadraticCurveTo(-7, -9, 0, -17 - fl); c.quadraticCurveTo(7, -9, 6.4, 2); c.quadraticCurveTo(0, 7, -6.4, 2); c.fill(); c.fillStyle = '#ffe080'; c.beginPath(); c.moveTo(-3, 2); c.quadraticCurveTo(-3, -5, 0, -10 - fl); c.quadraticCurveTo(3, -5, 3, 2); c.quadraticCurveTo(0, 4, -3, 2); c.fill(); c.restore();
  // 頭
  const fg = c.createRadialGradient(-3, -26, 2, 0, -23, 15); fg.addColorStop(0, '#fff6ee'); fg.addColorStop(1, '#ffdcc4');
  G.circle(c, 0, -23, 13.5, fg, dk, 0.8);
  for (const d of [-1, 1]) {
    G.ell(c, d * 5.2, -22, 3.2, 3.9, '#ffffff', dk, 0.5);
    G.ell(c, d * 5.2, -21.6, 2.5, 3.2, d < 0 ? '#3a80e0' : '#e85020'); G.circle(c, d * 5.2, -21.4, 1.3, '#180a14'); G.circle(c, d * 5.2 - 0.9, -23, 0.85, '#ffffff'); G.circle(c, d * 5.2 + 0.9, -20.4, 0.4, '#ffffff');
    c.strokeStyle = '#2a1020'; c.lineWidth = 0.9; c.lineCap = 'round'; c.beginPath(); c.arc(d * 5.2, -21.6, 3.8, Math.PI * 1.1, Math.PI * 1.9); c.stroke();
    G.ell(c, d * 8.2, -17.6, 2.4, 1.4, 'rgba(255,110,140,0.42)');
  }
  c.beginPath(); c.arc(0, -17.2, 2.4, 0.15, Math.PI - 0.15); c.closePath(); G.fs(c, '#e8506c', dk, 0.4);
  // 瀏海
  const hg = c.createLinearGradient(-14, 0, 14, 0); hg.addColorStop(0, '#4aa0f0'); hg.addColorStop(0.5, '#c090d0'); hg.addColorStop(1, '#f05a30');
  c.fillStyle = hg; c.strokeStyle = dk; c.lineWidth = 0.7; c.beginPath(); c.moveTo(-14, -21); c.bezierCurveTo(-16, -41, 16, -41, 14, -21); c.quadraticCurveTo(10, -30, 5, -30); c.quadraticCurveTo(3, -27, 0, -29.6); c.quadraticCurveTo(-3, -27, -5, -30); c.quadraticCurveTo(-10, -30, -14, -21); c.closePath(); c.fill(); c.stroke();
  // 小皇冠（魔王的證明）
  G.poly(c, [-6, -36, -7.4, -42, -3, -39, 0, -44, 3, -39, 7.4, -42, 6, -36], '#f4cc58', '#8a6010', 0.6); G.circle(c, 0, -39, 1.2, '#ff3060');
  c.restore();
};
Object.assign(MOVES, {
  zn_water: { n: '水球丟丟', t: '水', p: 100, a: 100, pp: 30, fxk: 'orb', d: '丟出比自己還大的水球。' },
  zn_fire:  { n: '生氣噴火', t: '火', p: 120, a: 95, pp: 20, e: { burn: 0.5 }, fxk: 'blast', d: '一生氣就會噴火。' },
  zn_rain:  { n: '哭哭大雨', t: '水', p: 110, a: 100, pp: 20, e: { foe: { spd: -1 } }, fxk: 'rain', d: '一哭，整間教室都會下大雨。' },
  zn_steam: { n: '水火蒸氣爆', t: '火', p: 170, a: 90, pp: 10, ult: 1, fxk: 'steam', d: '水與火同時引爆，威力無法想像。' },
  zn_smile: { n: '可愛微笑', t: '幻', p: 0, a: 100, pp: 15, e: { self: { atk: 2, def: 1 } }, d: '看起來很可愛，其實正在變強。' },
});
const ZINING = 433;
MONS[ZINING] = {
  n: '彭子甯', t: ['水', '火'], b: [190, 190, 150, 150], cr: 3, xp: 500, h: '1.1 m', w: '18.0 kg', hab: '番外篇・米老鼠班道館', big: true,
  desc: '米老鼠班的魔王。看起來是可愛的小女孩，卻同時操控水與火，全班沒有人打得贏她。',
  art: { plan: 'littlegirl', s: 3, a: '#ffc0d0', b: '#70c0ff', c: '#ffd040' },
  learn: [[1, 'zn_water'], [1, 'zn_fire'], [1, 'zn_rain'], [1, 'zn_smile'], [1, 'zn_steam']],
};
SPRITES[ZINING] = (c, t) => drawPlan(c, ZINING, t);

// ---------- 道館地圖：一條走廊七道門，一個一個打才能往前 ----------
const CLASSMATES = [
  { n: '葉子安', hair: '#3a2414', hat: '#f0d040', shirt: '#6ac0f0', team: [58, 73, 14], line: '我是第一關！米老鼠班最有禮貌的就是我，請多指教！', after: '好厲害！下一位是菜子橫喔！' },
  { n: '菜子橫', hair: '#201820', hat: '#f0d040', shirt: '#80d060', team: [59, 74, 60], line: '嘿嘿，我種的植物幻靈都很兇喔！', after: '輸了！無彥甫一定比我強！' },
  { n: '無彥甫', hair: '#2a2030', hat: '#f0d040', shirt: '#f0a040', team: [62, 50, 51], line: '我的方塊和時鐘幻靈，排得最整齊了！', after: '下一位是塵其銳，要小心喔！' },
  { n: '塵其銳', hair: '#3a2a20', hat: '#f0d040', shirt: '#c080e0', team: [65, 82, 83], line: '我最喜歡幽靈了，你會怕嗎？', after: '竟然不怕！豬驗崧在等你！' },
  { n: '豬驗崧', hair: '#201810', hat: '#f0d040', shirt: '#f08080', team: [79, 16, 13], line: '我吃很多飯，力氣最大！來比力氣！', after: '力氣輸了……鄰塵又更厲害喔！' },
  { n: '鄰塵又', hair: '#4a3020', hat: '#f0d040', shirt: '#60d0c0', team: [47, 96, 33], line: '閃電！快快快！你跟得上嗎？', after: '追不上你……最後一位是輸彥寧！' },
  { n: '輸彥寧', hair: '#2a1a14', hat: '#f0d040', shirt: '#7090f0', team: [44, 29, 38, 41], line: '我是魔王前的最後一關，絕對不讓你過！', after: '過關了……可是子甯真的很強很強，你要小心！' },
];
function classBase() { return Math.max(5, ...S.party.map(m => m.level)); }
const ROWS = ['##########'];
for (let i = 0; i < 2; i++) ROWS.push('#........#');
ROWS.push('#........#');
for (let g = 6; g >= 0; g--) { ROWS.push('####..####', '#........#', '#........#'); }
ROWS.push('##########');
MAPS.mickey = {
  name: '番外篇・米老鼠班道館', theme: 'toy', rows: ROWS.map(r => r), w: 10, h: ROWS.length, exits: [], doors: {}, signs: {}, triggers: [], npcs: [], roofAt: {},
};
{
  const m = MAPS.mickey, H0 = m.h;
  CLASSMATES.forEach((q, i) => {
    const gy = H0 - 4 - i * 3, key = 'mk' + i, look = { hair: q.hair, shirt: q.shirt, pants: '#3a4a7a', hat: q.hat };
    for (const x of [4, 5]) m.npcs.push({ id: 'gate' + i + '_' + x, x, y: gy, dir: 'down', look, name: q.n, cond: () => !flag(key) && (x === 4), talk: () => classBattle(i) });
    if (true) m.npcs.push({ id: 'blk' + i, x: 5, y: gy, dir: 'down', look: { hair: '#c8a050', shirt: '#f4e8c8', pants: '#c8a050' }, name: '值日生', cond: () => !flag(key), talk: () => say(`要先打贏${q.n}才能過去喔！`, { name: '老師' }) });
    m.npcs.push({ id: 'done' + i, x: 2, y: gy + 1, dir: 'right', look, name: q.n, cond: () => flag(key), talk: async () => { await say(q.after, { name: q.n }); const c = await choose(['再比一次', '不用了'], { title: `要再和${q.n}對戰嗎？`, w: 300, x: W / 2 - 150, y: 260 }); if (c === 0) await classBattle(i); } });
  });
  m.npcs.push({ id: 'teacher', x: 7, y: H0 - 2, dir: 'left', look: { hair: '#6a3a1a', shirt: '#ffb0c0', pants: '#a04878' }, name: '老師', talk: async () => { healParty(); await say(['歡迎來到米老鼠班！', '要照順序打贏七位小朋友，才能見到魔王彭子甯。', '（隊伍完全恢復了！）'], { name: '老師' }); } });
  m.npcs.push({ id: 'boss', x: 4, y: 2, dir: 'down', legend: ZINING, name: '魔王 彭子甯', cond: () => flag('mk6') && !flag('znJoin'), talk: () => zinBattle() });
  m.npcs.push({ id: 'nurse', x: 8, y: 3, dir: 'left', look: { hair: '#201820', shirt: '#ffffff', pants: '#f0a0b0' }, name: '保健老師', cond: () => flag('mk6'), talk: async () => { healParty(); await say('魔王很強很強，先休息一下。（隊伍完全恢復了！）', { name: '保健老師' }); } });
  for (const n of m.npcs) n._home = [n.x, n.y];
}
async function classBattle(i) {
  const q = CLASSMATES[i], base = classBase(), key = 'mk' + i;
  await say(q.line, { name: q.n });
  const team = q.team.map((id, j) => [id, Math.max(3, base - 5 + i * 2 + j)]);
  const r = await trainerBattle({ name: '試煉者 ' + q.n, look: { hair: q.hair, shirt: q.shirt, pants: '#3a4a7a', hat: q.hat }, team, money: base * 60 });
  if (r !== 'win') return;
  const first = !flag(key);
  setFlag(key);
  await say(q.after, { name: q.n });
  if (first && i === 6) { shake = 1; await say('教室最裡面傳來可愛的笑聲……魔王的門打開了！'); await tween(600, p => shake = 1 - p); }
}
async function zinBattle() {
  await say(flag('znMet') ? ['又來了？', '嘻嘻，再被我打哭一次吧！'] : ['嘻嘻，你就是打贏全班的人嗎？', '我是彭子甯，米老鼠班的魔王喔！', '看起來很可愛對不對？', '可是……沒有人打贏過我喔。', '水和火，都要聽我的話！'], { name: '魔王 彭子甯' });
  setFlag('znMet');
  const c = await choose(['挑戰！', '先準備一下'], { title: '要挑戰魔王彭子甯嗎？', w: 320, x: W / 2 - 160, y: 300 });
  if (c !== 0) return;
  const lv = classBase() + 12, boss = makeMon(ZINING, lv);
  const P2 = 1.7; boss.atk = Math.round(boss.atk * P2); boss.def = Math.round(boss.def * P2); boss.spd = Math.round(boss.spd * P2); boss.maxHp = boss.hp = Math.round(boss.maxHp * 2.5);
  const r = await runBattle({ trainer: { name: '魔王 彭子甯', look: { hair: '#c090d0', shirt: '#ffc0d0', pants: '#70c0ff' }, money: lv * 500 }, foeTeam: [boss] });
  if (r !== 'win') return;
  await say(['嗚……怎麼可能……', '嘻嘻，開玩笑的！你好厲害喔！', '我決定了，我要跟你一起去冒險！'], { name: '魔王 彭子甯' });
  if (!flag('znJoin')) {
    setFlag('znJoin');
    const m = makeMon(ZINING, Math.max(5, lv - 12)); S.dex.seen[ZINING] = true; S.dex.caught[ZINING] = true;
    const w = addMon(m); jingle('caught');
    await say(`彭子甯加入了${w === 'box' ? '靈匣' : '隊伍'}！（番外篇完成！）`);
    saveGame(true);
  }
}
async function enterSide() {
  if (!S.party.length) { await say('要先有一隻夥伴才能挑戰喔！去村子右上方的星垣研究所領取吧。'); return false; }
  if (S.map !== 'mickey') S.sideBack = { map: S.map, x: S.x, y: S.y };
  const m = MAPS.mickey;
  S.dir = 'up';
  await warp('mickey', 2, m.h - 2);
  if (!flag('sideIntro')) { setFlag('sideIntro'); await say(['這裡是番外篇「米老鼠班道館」。', '七位小朋友守在每一道門前，要照順序打贏。', '對手會配合你的等級，隨時都能挑戰。', '想離開時，按 X 打開選單選「離開番外篇」。'], { name: '老師' }); }
  return true;
}
async function leaveSide() {
  const b = S.sideBack || S.respawn;
  await warp(b.map, b.x, b.y);
}

// 主選單加入番外篇
async function mainMenu() {
  while (true) {
    const inSide = S.map === 'mickey', sideItem = inSide ? '離開番外篇' : '番外篇：米老鼠班道館';
    const items = ['夥伴', '背包', '圖鑑', '世界地圖（傳送）', sideItem, '任務', '提示', '存檔', '聲音設定', zoomLabel(), S.hintsOff ? '提示框：關' : '提示框：開', '關閉'];
    const seals = Object.keys(S.flags).filter(f => /^stage\d+$/.test(f)).length + (S.badges || 0);
    const c = await choose(items, { title: `${S.name}　$${S.money}　道館 ${seals}/100`, w: 340, x: W - 360, y: 8, rowH: 36 });
    if (c === 0) { if (!S.party.length) { await say('你還沒有夥伴！'); continue; } await partyMenu('view'); }
    else if (c === 1) await bagMenu('field');
    else if (c === 2) await dexMenu();
    else if (c === 3) { if (!flag('gotStarter')) { await say('先去研究所領取夥伴吧！'); continue; } if (await worldMap()) return; }
    else if (c === 4) { if (inSide) { await leaveSide(); return; } if (await enterSide()) return; }
    else if (c === 5) await questMenu();
    else if (c === 6) { await hintPage(); return; }
    else if (c === 7) { saveGame(); await wait(300); }
    else if (c === 8) await soundPanel();
    else if (c === 9) cycleZoom();
    else if (c === 10) S.hintsOff = !S.hintsOff;
    else return;
  }
}
const navInfoBase = navInfo;
navInfo = function () {
  if (S.map !== 'mickey') return navInfoBase();
  const i = CLASSMATES.findIndex((_, k) => !flag('mk' + k));
  if (i >= 0) { const gy = MAPS.mickey.h - 4 - i * 3; return { tx: 4, ty: gy, label: CLASSMATES[i].n, line: `番外篇：挑戰 ${CLASSMATES[i].n}（第 ${i + 1} / 7 位）` }; }
  if (!flag('znJoin')) return { tx: 4, ty: 2, label: '彭子甯', line: '番外篇：挑戰魔王 彭子甯' };
  return { label: '', line: '番外篇完成！按 X 可以離開' };
};
TIPS.push('按 X 打開選單，隨時可以進入番外篇「米老鼠班道館」。');
const worldLayerV7 = worldLayer;
worldLayer = function () {
  if (S && !S.v7) migrateV7();
  return worldLayerV7();
};
