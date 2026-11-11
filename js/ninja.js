// ===== 忍者番外篇：影之里（原創忍者角色、忍術、最終頭目八岐大蛇）=====

// ---------- 八岐大蛇造型 ----------
PLANS.orochi = function (c, t, o) {
  const b = Math.sin(t * 1.6) * 1.5;
  c.save(); c.translate(0, b);
  // 盤起的身體
  const coil = c.createRadialGradient(-6, 26, 4, 0, 30, 34); coil.addColorStop(0, sh(o.a, 0.3)); coil.addColorStop(1, sh(o.a, -0.45));
  G.ell(c, 0, 32, 36, 14, coil, XOL, 1);
  c.strokeStyle = 'rgba(255,255,255,0.18)'; c.lineWidth = 0.8; for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(-28 + i * 7, 30, 4, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); }
  // 八個頭
  const heads = [];
  for (let i = 0; i < 8; i++) {
    const k = (i - 3.5) / 3.5, sw = Math.sin(t * 2 + i * 0.9) * 4, back = i % 2;
    const x0 = k * 22, y0 = 24, x1 = k * 40 + sw, y1 = -30 - (1 - Math.abs(k)) * 18 + back * 8 + Math.cos(t * 1.8 + i) * 3;
    const dd = k < 0 ? -1 : 1, my = (y0 + y1) / 2;
    heads.push({ i, back, pts: [[x0, y0], [x0 + dd * 6 + sw * 0.3, y0 - 12], [x1 - dd * 14 + sw * 0.8, my + 2], [x1 - dd * 4 + sw, y1 + 10], [x1, y1]], hx: x1, hy: y1, d: dd });
  }
  heads.sort((a, b2) => b2.back - a.back);
  for (const h of heads) {
    const col = h.back ? sh(o.a, -0.15) : o.a;
    const sp = A.body(c, h.pts, [6.4, 3.8], col);
    if (A.scales) A.scales(c, sp, 'rgba(255,255,255,0.18)', 1, 3);
    c.save(); c.translate(h.hx, h.hy); c.scale(h.d * 1.45, 1.45);
    const hg = c.createLinearGradient(-6, -6, 10, 6); hg.addColorStop(0, sh(col, 0.3)); hg.addColorStop(1, sh(col, -0.4));
    c.fillStyle = hg; c.strokeStyle = XOL; c.lineWidth = 0.7; c.beginPath(); c.moveTo(-5, -4); c.quadraticCurveTo(4, -8, 12, -2); c.quadraticCurveTo(13, 2, 10, 3); c.quadraticCurveTo(3, 6, -5, 4); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#300810'; c.beginPath(); c.moveTo(12, -1); c.lineTo(4, 1.4); c.lineTo(11, 3); c.fill();
    G.teeth(c, 6, 10, 0.8, 1.6, 2, '#fff', 1);
    c.save(); c.shadowColor = o.c; c.shadowBlur = 6; c.fillStyle = o.c; c.beginPath(); c.ellipse(4, -3, 1.8, 1.2, 0.2, 0, 7); c.fill(); c.fillStyle = '#100808'; c.fillRect(3.7, -4.1, 0.6, 2.2); c.restore();
    c.strokeStyle = '#e04050'; c.lineWidth = 0.7; c.beginPath(); c.moveTo(12, 0.5); c.lineTo(16 + Math.sin(t * 10 + h.i) * 1.5, -0.5); c.moveTo(15, 0); c.lineTo(17, 1.6); c.stroke();
    for (let k = 0; k < 3; k++) { c.fillStyle = sh(o.b, -0.1); c.beginPath(); c.moveTo(-4 + k * 3, -4.6); c.lineTo(-6 + k * 3, -9); c.lineTo(-2 + k * 3, -5); c.fill(); }
    c.restore();
  }
  // 霧氣
  c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 5; i++) { const x = -40 + i * 20 + Math.sin(t + i) * 4; const g = c.createRadialGradient(x, 40, 2, x, 40, 18); g.addColorStop(0, 'rgba(160,80,200,0.25)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.beginPath(); c.arc(x, 40, 18, 0, 7); c.fill(); } c.restore();
  c.restore();
};

// ---------- 角色 ----------
const NJ0 = 1150;
const NJ_LIST = [
  ['小翔', ['風', '鬥'], [110, 120, 100, 140], { head: 'human', ninja: 1, a: '#e88030', b: '#2a3a6a', c: '#80d0ff', skin: '#f6d4b4', hair: '#f0c040', weapon: 'kunai', top: '#e88030', band: '#2a3a6a' }, ['nj_shadow', 'nj_wind'], '影之里的見習忍者，夢想成為里長。', 0, 1],
  ['霧島', ['水', '幻'], [125, 120, 120, 130], { head: 'human', ninja: 1, a: '#3a5a8a', b: '#c8d8f0', c: '#80e0ff', skin: '#f4d4bc', hair: '#c8d8e8', weapon: 'katana', mask: '#3a4a6a', band: '#3a5a8a' }, ['nj_mist', 'nj_water'], '忍者考試的考官，擅長霧隱之術。', 0, 1],
  ['小隼', ['風', '鋼'], [115, 140, 105, 160], { head: 'human', ninja: 1, a: '#4a8a5a', b: '#e0e0e0', c: '#c0ffc0', skin: '#f6d4b4', hair: '#2a2a30', weapon: 'kunai', band: '#4a8a5a' }, ['nj_wind', 'nj_shuriken'], '雙手苦無快如疾風的中忍。', 0, 1],
  ['綾音', ['幻', '暗'], [120, 140, 115, 135], { head: 'human', hs: 'lady', ninja: 1, a: '#7a4a9a', b: '#f0c0e0', c: '#ff80c0', skin: '#fbe0d0', hair: '#4a1a3a', weapon: 'sword', band: '#7a4a9a', long: 1, skirt: 22, spider: 1 }, ['nj_puppet', 'nj_shadow'], '用查不到的細線操縱傀儡的少女。', 0, 1],
  ['雷藏', ['雷', '鬥'], [135, 150, 120, 145], { head: 'human', ninja: 1, a: '#3a3a4a', b: '#f0d040', c: '#fff080', skin: '#e8c8a8', hair: '#f0f0f0', weapon: 'katana', mask: '#2a2a34', band: '#3a3a4a', armor: '#5a5a6a', aura: '#f0e060' }, ['nj_thunder', 'nj_shuriken'], '影之里的上忍，刀上纏著雷光。', 0, 1],
  ['蛇目', ['暗', '木'], [130, 150, 115, 145], { head: 'human', ninja: 1, a: '#4a5a3a', b: '#a0c060', c: '#c0ff40', skin: '#e0e8d8', hair: '#1a1a20', eye: '#c0c020', weapon: 'sword', band: '#4a5a3a', long: 1 }, ['nj_snake', 'nj_poison'], '背叛影之里的忍者，研究禁忌的蛇之術。', 0, 1],
  ['夜鴉', ['暗', '風'], [140, 160, 125, 170], { head: 'human', ninja: 1, a: '#1a1a24', b: '#c0c0c8', c: '#ff4040', skin: '#f0d8c8', hair: '#3a3a44', weapon: 'katana', mask: '#e8e8ec', band: '#1a1a24', armor: '#5a5a66', cape: '#14141c', wings: 1 }, ['nj_crow', 'nj_shadow'], '戴著白面具的暗部隊長，能化成一群烏鴉。', 0, 1],
  ['宗玄', ['火', '鬥'], [165, 165, 150, 140], { head: 'human', ninja: 1, a: '#c03020', b: '#f0f0f0', c: '#ffb040', skin: '#f0d0b0', hair: '#e8e8e8', beard: '#e8e8e8', weapon: 'katana', band: '#c03020', cape: '#f4f0e8', crown: 1, aura: '#ff8040' }, ['nj_fire', 'nj_clone'], '影之里的里長，火遁之術天下第一。', 1, 1],
  ['八岐大蛇', ['暗', '水'], [200, 190, 170, 140], { plan: 'orochi', a: '#5a3a6a', b: '#a080c0', c: '#ff3040' }, ['nj_orochi', 'nj_snake', 'nj_poison'], '被封印在影之里地底的八頭巨蛇，傳說中的災厄。', 1, 0],
];
const NJ_ID = sagaIds(NJ0, NJ_LIST);
sagaSpecies(NJ0, NJ_LIST, '忍者番外篇・影之里');
for (const id of Object.values(NJ_ID)) MONS[id].side = true;
Object.assign(MOVES, {
  nj_shadow: { n: '影分身', t: '幻', p: 30, a: 100, pp: 15, fxk: 'barrage', d: '變出好幾個分身一起攻擊，連打 2~5 次。', e: { multi: [2, 5] } },
  nj_wind: { n: '風遁・鎌鼬', t: '風', p: 110, a: 100, pp: 15, fxk: 'twister', d: '化風為刃的忍術。', e: { crit: 1 } },
  nj_mist: { n: '霧隱之術', t: '水', p: 0, a: 100, pp: 10, d: '在濃霧裡隱身，速度與防禦提升。', e: { self: { spd: 1, def: 1 } } },
  nj_water: { n: '水遁・水龍彈', t: '水', p: 120, a: 95, pp: 15, fxk: 'rain', d: '化成水龍撞向對手。' },
  nj_shuriken: { n: '手裡劍亂舞', t: '鋼', p: 25, a: 100, pp: 20, fxk: 'needles', d: '撒出大量手裡劍，連打 2~5 次。', e: { multi: [2, 5] } },
  nj_puppet: { n: '傀儡操線', t: '幻', p: 110, a: 95, pp: 15, fxk: 'chains', d: '看不見的細線纏住對手。', e: { foe: { spd: -1 } } },
  nj_thunder: { n: '雷遁・雷切斬', t: '雷', p: 130, a: 95, pp: 10, fxk: 'slash', d: '刀上纏雷，一閃而過。', e: { par: 0.25 } },
  nj_snake: { n: '潛影蛇手', t: '暗', p: 115, a: 100, pp: 15, fxk: 'bite', d: '袖子裡竄出毒蛇咬住對手。', e: { poison: 0.3 } },
  nj_poison: { n: '毒霧之術', t: '木', p: 90, a: 100, pp: 15, fxk: 'mist', d: '吐出紫色毒霧。', e: { poison: 0.5 } },
  nj_crow: { n: '鴉群幻術', t: '暗', p: 125, a: 95, pp: 10, fxk: 'feathers', d: '化成成群烏鴉撲向對手，可能使其混亂。', e: { conf: 0.3 } },
  nj_fire: { n: '火遁・豪火龍', t: '火', p: 145, a: 90, pp: 10, fxk: 'blast', d: '口吐巨大的火龍。', e: { burn: 0.3 } },
  nj_clone: { n: '千影分身', t: '鬥', p: 45, a: 100, pp: 10, fxk: 'barrage', d: '上千個分身一起出拳，連打 2~5 次。', e: { multi: [2, 5] } },
  nj_orochi: { n: '八岐災禍', t: '暗', p: 175, a: 85, pp: 5, fxk: 'meteor', d: '八個頭同時噬咬，天地為之色變。', e: { poison: 0.3 } },
});

// ---------- 地圖與劇情 ----------
THEME.ninja = Object.assign({}, THEME.huaguo, { g: '#5a7a4a', g2: '#4e6e40', path: '#b8a07a', tree: '#2a5a3a', tree2: '#163a24', gh: '#8ab070', obst: null, liq: null, wx: 'green' });
LIGHT.ninja = ['200,220,255', 0.1];
BBG.ninja = { sky: ['#2a2a4a', '#c08a6a'], hill: ['#2a3a3a', '#141e1e'], ground: ['#5a6a4a', '#3a4a30'], plat: ['#7a8a60', '#3a4a30'], tuft: '#3a5a3a' };
MAP_SONG.ninja = 'route';
makeSaga({
  map: 'ninja', name: '忍者番外篇・影之里', theme: 'ninja', flag: 'nj', short: '忍者番外篇', ids: NJ_ID, joinWord: '認可了你的忍道',
  title: n => '忍者 ' + n, foeLook: { hair: '#2a2a30', shirt: '#2a3a4a', pants: '#1a1a24' },
  guard: { hair: '#2a2a30', shirt: '#3a4a5a', pants: '#1a1a24', hat: '#2a3a6a' }, guardName: '下忍',
  helper: { name: '拉麵店老闆', look: { hair: '#3a2a20', shirt: '#ffffff', pants: '#3a3a4a', hat: '#ffffff' } },
  stages: [
    { boss: '霧島', place: '忍者考試・第一試', minion: ['水', '幻'], line: ['歡迎來到忍者考試。', '能在濃霧裡找到我的人，才有資格成為忍者。'], win: ['合格！你找到了霧中的我。'] },
    { boss: '小隼', place: '死亡森林', minion: ['風', '鋼'], line: ['第二試在死亡森林！', '跟得上我的苦無嗎？'], win: ['好快……你比我還快！'] },
    { boss: '綾音', place: '傀儡之屋', minion: ['幻', '暗'], line: ['嘻嘻，你看得見我的線嗎？', '跳舞吧，我的小傀儡們！'], win: ['線……全被斬斷了。'] },
    { boss: '雷藏', place: '雷鳴瀑布', minion: ['雷', '鬥'], line: ['我是上忍雷藏。', '這一刀，比雷還快。'], win: ['不錯。你有成為上忍的實力。'] },
    { boss: '蛇目', place: '蛇之洞窟', minion: ['暗', '木'], line: ['嘶嘶……影之里的走狗。', '地底封印的「那個東西」，就快醒了……'], win: ['來不及了……封印已經鬆了……嘶嘶……'] },
    { boss: '夜鴉', place: '暗部本部', minion: ['暗', '風'], line: ['……你看到的，只是一群烏鴉。', '想去封印之地，先過我這關。'], win: ['你的忍道……是真的。去吧，里長在等你。'] },
    { boss: '宗玄', place: '里長之塔', minion: ['火', '鬥'], line: ['老夫是影之里的里長。', '封印之地的大蛇，連老夫都沒把握。', '讓老夫看看，你值不值得託付這個里！'], win: ['哈哈哈！好！影之里交給你了！', '去吧——封印之地就在塔的後面！'] },
    { boss: '八岐大蛇', place: '封印之地', minion: ['暗', '水'], line: ['（地面裂開，八個巨大的蛇頭從黑霧中升起……）', '「千年了……是誰……打擾吾之沉睡……」'], win: ['「……吾……竟敗於人之手……」', '（八岐大蛇低下了八個頭。）'] },
  ],
  npcs: H0 => [
    { id: 'njsho', x: 3, y: H0 - 3, dir: 'right', look: { hair: '#f0c040', shirt: '#e88030', pants: '#2a3a6a', hat: '#2a3a6a' }, name: '小翔', talk: async () => { healParty(); await say(['我一定要成為影之里的里長！', '一起加油吧！（隊伍完全恢復了！）'], { name: '小翔' }); } },
    { id: 'njramen', x: 8, y: H0 - 3, dir: 'left', look: { hair: '#3a2a20', shirt: '#ffffff', pants: '#3a3a4a', hat: '#ffffff' }, name: '拉麵店老闆', talk: async () => { healParty(); const i = sagaNext('ninja'); await say(['來碗熱騰騰的拉麵吧！（隊伍完全恢復了！）', i < 0 ? '你現在是影之里的英雄了！' : `下一關在「${SAGAS.ninja.stages[i].place}」，加油啊！`], { name: '拉麵店老闆' }); } },
  ],
  intro: async () => {
    await chapterCard('忍者番外篇', '影之里——忍道之路');
    await say(['這裡是藏在深山裡的忍者之里「影之里」。', '一年一度的忍者考試開始了，只有通過所有考驗的人才能成為真正的忍者。', '但是最近，地底封印的大蛇好像開始騷動……']);
    await say(['你也是來考忍者的嗎？我是小翔！', '我們一起考吧！'], { name: '小翔' });
    const m = makeMon(NJ_ID['小翔'], Math.max(5, sagaBase() - 5)); const id = m.id; S.dex.seen[id] = true; S.dex.caught[id] = true;
    const w = addMon(m); jingle('caught'); await say(`小翔加入了${w === 'box' ? '靈匣' : '隊伍'}！`);
    await say('想離開時，按 X 打開選單選「離開忍者番外篇」。');
  },
  finale: async () => {
    setFlag('njEnd'); S.money += 400000; addItem('fuseCore', 3);
    await fadeOut(600); fade = 0;
    await chapterCard('忍道', '大蛇重新沉睡，影之里迎來和平');
    await fadeIn(300);
    await say(['八岐大蛇重新沉入地底。', '影之里的人們為你舉辦了盛大的慶典。', '小翔說：「我也會變得跟你一樣強！」', '（獲得了 $400000 和 融合晶石 ×3！忍者番外篇完成！）']);
  },
});
TIPS.push('按 X 打開選單，可以進入「忍者番外篇：影之里」！');
