// ===== 第二部：第 8 ~ 12 章 =====

Object.assign(LOOK, {
  snow:   { hair: '#e8f4ff', shirt: '#7ac0f0', pants: '#3a6a9a', hat: '#ffffff' },
  drum:   { hair: '#e83a2a', shirt: '#f0c030', pants: '#3a2a1a', robe: '#a02a1a' },
  keyin:  { hair: '#8a7a6a', shirt: '#5a4a3a', pants: '#2a2a2a', robe: '#c8a050' },
  maiden: { hair: '#1a1a2a', shirt: '#f4f4f4', pants: '#c83a3a' },
  toyman: { hair: '#ff8ac0', shirt: '#ffd040', pants: '#5a8ad0', hat: '#e83a3a' },
});

// 御三家各階段
const STARTER_LINE = { 14: [14, 21, 22], 6: [6, 23, 24], 7: [7, 25, 26] };
function rivalMon(stage) { return STARTER_LINE[rivalStarter()][stage]; }

// 章節標題
const CHAPTERS = {
  village: [1, '啟程・晨曦村'], route1: [1, '啟程・晨曦村'], town2: [2, '符燈之試'], route2: [3, '霧澤的陰影'],
  forge: [4, '熔鋼之心'], valley: [5, '風之山谷'], startown: [6, '星輪的指引'], abyss: [7, '深淵之門'],
  frost: [8, '冰晶湖的歌聲'], toybox: [9, '玩具閣樓的秘密'], thunder: [10, '雷鳴高原'], clock: [11, '時鐘古殿'], sky: [12, '天空聖域・終章'],
};

Object.assign(MAPS, {
  frost: {
    name: '冰晶湖・霜鈴村', theme: 'ice',
    rows: [
      'TTTTTTTTTTT==TTTTTTTTTTT',
      'T..........==..........T',
      'T.HHHH.....==....HHHHH.T',
      'T.HHHH.....==....HHHHH.T',
      'T.HDHH.....==....HHDHH.T',
      'T..=.......==......=...T',
      'T..=================...T',
      'T..........==..........T',
      'T,,,,,.....==.....,,,,,T',
      'T,,,,,..~~~bb~~~..,,,,,T',
      'T,,,,,..~~~bb~~~..,,,,,T',
      'T.......~~....~~.......T',
      'T.......~~....~~.......T',
      'T,,,,,..~~~bb~~~..,,,,,T',
      'T,,,,,..~~~bb~~~..,,,,,T',
      'T,,,,,.....==.....,,,,,T',
      'T..........==..........T',
      'TT,,,,.....==.....,,,,TT',
      'TT,,,,.....==.....,,,,TT',
      'T..........==....S.....T',
      'TTTTTTTTTTT==TTTTTTTTTTT',
    ],
    exits: [
      { x: 11, y: 20, w: 2, h: 1, to: 'startown', tx: 15, ty: 1 },
      { x: 11, y: 0, w: 2, h: 1, to: 'toybox', tx: 10, ty: 14 },
    ],
    doors: {
      '3,4': { roof: '#e0a030', label: '祈光亭・補給站', run: () => centerDoor(true) },
      '19,4': { roof: '#5aa0e0', label: '霜鈴試煉殿', run: () => trialDoor(4) },
    },
    signs: { '17,19': '【冰晶湖】\n湖心的小島上，據說沉睡著一頭冰龍。\n北：霜鈴村、玩具閣樓' },
    wild: [[53, 34, 37, 25], [54, 36, 38, 10], [80, 34, 37, 20], [93, 35, 38, 15], [75, 34, 37, 10], [36, 34, 36, 10], [81, 38, 38, 3], [94, 38, 38, 3]],
    triggers: [
      { x: 11, y: 1, w: 2, h: 1, run: async () => { if (!flag('badge4')) { await say('冰風呼嘯，前方的路被暴風雪封住了……先去挑戰霜鈴試煉吧。'); stepBack(); } } },
    ],
    npcs: [
      { id: 'dragon', x: 10, y: 11, dir: 'down', legend: 98, name: '霜晶龍', cond: () => !flag('legend98'), talk: () => legendBattle(98, 50, '湖心傳來冰晶碎裂的聲音……沉睡的冰龍睜開了眼睛！') },
      { id: 'sk1', x: 3, y: 15, dir: 'right', look: LOOK.snow, name: '滑雪少年 小霜', sight: 4,
        trainer: { team: [[53, 35], [93, 36], [80, 36]], money: 1200, before: '冰上的對戰，可是會滑倒的喔！', after: '我、我只是腳滑了！' } },
      { id: 'sk2', x: 20, y: 8, dir: 'left', look: LOOK.girl, name: '冰舞者 晶晶', sight: 4,
        trainer: { team: [[81, 38], [37, 37]], money: 1300, before: '聖代與茶杯的華爾滋，請欣賞！', after: '舞步亂掉了……' } },
      { id: 'elder2', x: 7, y: 5, dir: 'down', look: LOOK.elder, name: '霜鈴村長', talk: () => say(['湖心的霜晶龍已經沉睡了一千年。', '最近湖面上的冰一直在唱歌……是在呼喚強者嗎？'], { name: '霜鈴村長' }) },
    ],
  },

  toybox: {
    name: '玩具閣樓', theme: 'toy',
    rows: [
      '##########==##########',
      '#....,,,,.==.,,,,....#',
      '#....,,,,.==.,,,,....#',
      '#..####........####..#',
      '#,,,,,,........,,,,,,#',
      '#,,,,,,..####..,,,,,,#',
      '#.......####.........#',
      '####...........S..####',
      '#,,,,,,,......,,,,,,,#',
      '#,,,,,,,..##..,,,,,,,#',
      '#.........##.........#',
      '#..####........####..#',
      '#,,,,,,,,......,,,,,,#',
      '#,,,,,,,,......,,,,,,#',
      '#..........==........#',
      '##########==##########',
    ],
    exits: [
      { x: 10, y: 15, w: 2, h: 1, to: 'frost', tx: 11, ty: 1 },
      { x: 10, y: 0, w: 2, h: 1, to: 'thunder', tx: 11, ty: 15 },
    ],
    signs: { '15,7': '【玩具閣樓】\n被遺忘的玩具們聚集的巨大閣樓。\n小心！有些玩具會咬人。' },
    wild: [[42, 38, 41, 20], [48, 38, 41, 15], [50, 38, 40, 15], [71, 38, 41, 15], [69, 38, 40, 15], [12, 39, 41, 10], [43, 41, 42, 5], [82, 39, 41, 5]],
    triggers: [
      { x: 1, y: 12, w: 20, h: 1, run: async () => { if (!flag('rival4')) await rivalBattle4(); } },
      { x: 1, y: 3, w: 20, h: 1, run: async () => { if (!flag('bishop2')) await bishopBattle2(); } },
    ],
    npcs: [
      { id: 'tg1', x: 4, y: 8, dir: 'right', look: LOOK.cult, name: '深淵教團 成員', sight: 5,
        trainer: { team: [[43, 41], [72, 41]], money: 1500, before: '主教大人要的「幻紋鑰匙」就藏在閣樓裡！別來礙事！', after: '鑰匙……被主教大人拿走了……' } },
      { id: 'tg2', x: 17, y: 4, dir: 'left', look: LOOK.cult, name: '深淵教團 成員', sight: 5,
        trainer: { team: [[49, 42], [57, 42]], money: 1500, before: '燭火搖曳，影子就會被偷走喔～', after: '我的影子……還給我……' } },
      { id: 'toyman', x: 2, y: 13, dir: 'right', look: LOOK.toyman, name: '玩具修理師', talk: () => { healParty(); return say(['這裡的玩具都是被主人遺忘的孩子。', '幫你把夥伴修好了！（隊伍完全恢復了）'], { name: '玩具修理師' }); } },
      { id: 'rival4npc', x: 19, y: 13, dir: 'left', look: LOOK.rival, name: '小嵐', cond: () => flag('rival4'), talk: () => { healParty(); return say('需要治療就來找我！（隊伍完全恢復了）', { name: '小嵐' }); } },
    ],
  },

  thunder: {
    name: '雷鳴高原', theme: 'storm',
    rows: [
      'mmmmmmmmmmm==mmmmmmmmmmm',
      'm,,,,......==......,,,,m',
      'm,,,,..mm..==..mm..,,,,m',
      'm......mm..==..mm......m',
      'mm.HHHH....==....HHHHH.m',
      'm..HHHH....==....HHHHH.m',
      'm..HDHH....==....HHDHH.m',
      'm...=......==......=...m',
      'm...================...m',
      'm,,,,,.....==.....,,,,,m',
      'm,,,,,..mm.==.mm..,,,,,m',
      'm.......mm.==.mm.......m',
      'm,,,,,,....==....,,,,,,m',
      'm,,,,,,....==....,,,,,,m',
      'mmmm.......==.......mmmm',
      'm..S.......==..........m',
      'mmmmmmmmmmm==mmmmmmmmmmm',
    ],
    exits: [
      { x: 11, y: 16, w: 2, h: 1, to: 'toybox', tx: 10, ty: 1 },
      { x: 11, y: 0, w: 2, h: 1, to: 'clock', tx: 10, ty: 11 },
    ],
    doors: {
      '4,6': { roof: '#e0a030', label: '祈光亭・補給站', run: () => centerDoor(true) },
      '19,6': { roof: '#d0302a', label: '雷鼓試煉場', run: () => trialDoor(5) },
    },
    signs: { '3,15': '【雷鳴高原】\n雷雲終年不散的高原。山頂的雷鼓聲從未停歇。' },
    wild: [[95, 41, 44, 25], [46, 42, 44, 20], [89, 41, 44, 15], [78, 41, 44, 15], [15, 41, 43, 10], [45, 41, 43, 10], [96, 44, 45, 3], [90, 44, 45, 2]],
    triggers: [
      { x: 11, y: 1, w: 2, h: 1, run: async () => { if (!flag('badge5')) { await say('落雷不斷劈在山路上，根本過不去！也許雷鼓試煉的鼓雷能讓雷雲安靜下來。'); stepBack(); } } },
    ],
    npcs: [
      { id: 'thunderking', x: 21, y: 2, dir: 'down', legend: 99, name: '雷鼓天王', cond: () => !flag('legend99'), talk: () => legendBattle(99, 55, '轟隆！高原頂端的天鼓自己響了起來——雷鼓天王現身了！') },
      { id: 'th1', x: 6, y: 12, dir: 'right', look: LOOK.fighter, name: '拳擊手 阿雷', sight: 5,
        trainer: { team: [[79, 44], [16, 45]], money: 1600, before: '我的拳頭比雷還快！', after: '被雷劈到的感覺……原來是這樣……' } },
      { id: 'th2', x: 17, y: 10, dir: 'left', look: LOOK.rider, name: '風箏少女 飄飄', sight: 4,
        trainer: { team: [[90, 45], [47, 46]], money: 1600, before: '風車和雷雲，是高原上最好的朋友！', after: '風箏線斷掉了～' } },
    ],
  },

  clock: {
    name: '時鐘古殿', theme: 'temple',
    rows: [
      '##########==##########',
      '#.........==.........#',
      '#.,,,,,..#..#..,,,,,.#',
      '#.,,,,,..#..#..,,,,,.#',
      '#.......##..##.......#',
      '#####.............####',
      '#,,,,,....S.....,,,,,#',
      '#,,,,,..........,,,,,#',
      '#....####..####......#',
      '#,,,,,,.......,,,,,,,#',
      '#,,,,,,.......,,,,,,,#',
      '#..........==........#',
      '##########==##########',
    ],
    exits: [
      { x: 10, y: 12, w: 2, h: 1, to: 'thunder', tx: 11, ty: 1 },
      { x: 10, y: 0, w: 2, h: 1, to: 'sky', tx: 10, ty: 12 },
    ],
    signs: { '10,6': '【時鐘古殿】\n古代人建造的時間神殿。\n殿內的時鐘，每一座都指向不同的時間。' },
    wild: [[50, 45, 48, 20], [64, 45, 48, 20], [83, 46, 48, 15], [51, 47, 48, 10], [49, 46, 48, 15], [65, 47, 48, 10], [3, 46, 48, 5], [52, 48, 48, 2], [44, 48, 48, 3]],
    triggers: [
      { x: 10, y: 1, w: 2, h: 1, run: async () => { if (!flag('badge6')) { await say('通往天空聖域的時之門停止了轉動。必須先通過時序試煉。'); stepBack(); } } },
    ],
    npcs: [
      { id: 'keyin', x: 10, y: 3, dir: 'down', look: LOOK.keyin, name: '時序守 刻音', cond: () => !flag('badge6'), talk: () => trialDoor(6) },
      { id: 'maiden', x: 3, y: 11, dir: 'right', look: LOOK.maiden, name: '古殿巫女', talk: () => { healParty(); return say(['時間的流動，會治癒所有傷痛。', '（隊伍完全恢復了！）'], { name: '古殿巫女' }); } },
      { id: 'cl1', x: 15, y: 9, dir: 'left', look: LOOK.cult, name: '深淵教團 幹部', sight: 5,
        trainer: { team: [[65, 47], [84, 48]], money: 2000, before: '主教大人已經前往天空聖域了！誰都阻止不了始祖的甦醒！', after: '時間……站在你那邊嗎……' } },
    ],
  },

  sky: {
    name: '天空聖域', theme: 'sky',
    rows: [
      '~~~~~~~~~~~~~~~~~~~~~~',
      '~~~~~~~~~....~~~~~~~~~',
      '~~~~~~~~~....~~~~~~~~~',
      '~~~~~~~~~~==~~~~~~~~~~',
      '~~~~,,,,,.==.,,,,,~~~~',
      '~~~~,,,,,.==.,,,,,~~~~',
      '~~~~~~~...==...~~~~~~~',
      '~~,,,,....==....,,,,~~',
      '~~,,,,....==....,,,,~~',
      '~~~~~.....==.....~~~~~',
      '~~~~~,,,..==..,,,~~~~~',
      '~~~~~,,,..==..,,,~~~~~',
      '~~~~~~~~..==..~~~~~~~~',
      '~~~~~~~~~~==~~~~~~~~~~',
    ],
    exits: [{ x: 10, y: 13, w: 2, h: 1, to: 'clock', tx: 10, ty: 1 }],
    wild: [[66, 48, 52, 25], [67, 50, 52, 15], [45, 48, 51, 15], [17, 49, 52, 15], [1, 48, 51, 15], [68, 52, 53, 3], [47, 52, 53, 3]],
    triggers: [
      { x: 7, y: 6, w: 8, h: 1, run: async () => { if (!flag('bishop3')) await bishopBattle3(); } },
    ],
    npcs: [
      { id: 'lightbeast', x: 2, y: 7, dir: 'right', legend: 97, name: '光冕聖獸', cond: () => !flag('legend97'), talk: () => legendBattle(97, 58, '雲海裂開一道光——三角之冠閃耀的光冕聖獸降臨了！') },
      { id: 'bishop3', x: 11, y: 5, dir: 'down', look: LOOK.bishop, name: '哭偶主教 厄蘭', cond: () => !flag('bishop3'), talk: async () => {} },
      { id: 'origin', x: 10, y: 1, dir: 'down', legend: 100, name: '幻紋始祖', cond: () => flag('bishop3') && !flag('originCaught'), talk: () => originBattle() },
    ],
  },
});

// 觀星鎮北方開路
MAPS.startown.rows[0] = 'TTTTTTTTTTTTTTT==TTTTT';
MAPS.startown.exits.push({ x: 15, y: 0, w: 2, h: 1, to: 'frost', tx: 11, ty: 19 });
MAPS.startown.triggers.push({ x: 15, y: 1, w: 2, h: 1, run: async () => {
  if (!flag('part2')) { await say('北方的山路被一道看不見的星之結界擋住了……', {}); stepBack(); }
} });

// 第一部的野生幻靈擴充
MAPS.route1.wild.push([58, 3, 5, 18], [45, 3, 5, 12], [73, 3, 5, 12], [66, 5, 6, 4]);
MAPS.route2.wild.push([36, 9, 12, 14], [75, 9, 12, 12], [91, 9, 12, 14], [85, 10, 12, 10], [56, 10, 12, 8]);
MAPS.forge.wild.push([39, 13, 16, 18], [61, 13, 16, 15], [87, 14, 16, 15], [78, 13, 16, 12], [95, 13, 16, 10]);
MAPS.valley.wild.push([89, 18, 21, 15], [59, 19, 22, 8], [58, 18, 20, 12], [62, 20, 22, 8], [46, 19, 22, 10], [69, 18, 21, 12], [40, 20, 22, 5]);
MAPS.abyss.wild.push([82, 26, 29, 15], [83, 28, 29, 8], [64, 26, 29, 15], [57, 27, 29, 10], [74, 27, 29, 10], [92, 27, 29, 10], [86, 28, 29, 5]);

// ===== 第二部劇情 =====
const TRIALS2 = {
  4: { name: '冰歌師 雪音', title: '試煉者 雪音', look: LOOK.snow, badge: '霜鈴印', money: 3000, gift: ['fullPot', 3],
       team: [[54, 38], [81, 39], [94, 40], [55, 42]],
       intro: ['我是霜鈴試煉的守護者，雪音。', '冰晶湖的冰，會為真正的強者唱歌。', '讓我聽聽，你的心跳是什麼旋律吧！'],
       win: ['……冰在唱歌了。是溫暖的旋律呢。', '「霜鈴印」交給你。北方的暴風雪已經停了。', '這些全愈露，帶著吧。'],
       afterTalk: ['冰晶湖的歌聲依然溫柔。你的夥伴已經恢復了。'] },
  5: { name: '雷鼓師 鼓雷', title: '試煉者 鼓雷', look: LOOK.drum, badge: '雷鼓印', money: 3600, gift: ['revive', 3],
       team: [[96, 44], [79, 45], [47, 46], [16, 48]],
       intro: ['咚！咚！咚！我是雷鼓試煉的鼓雷！', '高原的雷，跟著我的鼓聲落下！', '跟上節奏吧，挑戰者！'],
       win: ['哈哈哈！好節奏！「雷鼓印」是你的了！', '雷雲安靜下來了，往北就是時鐘古殿。', '復甦羽送你，倒下的夥伴也能再站起來！'],
       afterTalk: ['咚！你的夥伴充滿精神了！'] },
  6: { name: '時序守 刻音', title: '試煉者 刻音', look: LOOK.keyin, badge: '時序印', money: 4200, gift: ['goldCharm', 10],
       team: [[51, 48], [44, 49], [29, 50], [52, 52]],
       intro: ['……你終於來了。我是時鐘古殿的守門人，刻音。', '我看過無數條時間線，在大部分的未來裡，你都輸給了厄蘭。', '證明給我看——你能走向那個少數的未來。'],
       win: ['……時針動了。新的未來誕生了。', '「時序印」交給你。六枚印記，聖域之門將為你開啟。', '金紋靈符帶上吧。始祖……或許也在等待一位真正的夥伴。'],
       afterTalk: ['時間正在向前流動。去吧。'] },
};
Object.assign(TRIALS, TRIALS2);

async function legendBattle(id, lv, intro) {
  await say(intro);
  const c = await choose(['挑戰！', '先不要'], { title: `要挑戰 ${MONS[id].n} 嗎？`, w: 300, x: W / 2 - 150, y: 300 });
  if (c !== 0) return;
  const r = await wildBattle(makeMon(id, lv), { boss: true });
  if (r === 'caught') setFlag('legend' + id);
  else if (r === 'win') await say(`${MONS[id].n} 化為光芒消失了……但似乎還能再遇見牠。`);
}

async function part1End() {
  setFlag('part1');
  await fadeOut(600);
  fade = 0;
  await chapterCard('第一部　完', '深淵之門重新封閉了……但故事還沒有結束。');
  await fadeIn(400);
  await say([
    '（星垣博士透過靈符傳來了聲音）',
    '你做到了！深淵之門已經安靜下來了！',
    '但是……主教厄蘭逃走了。他帶走了深淵之門裡的「幻紋之核」。',
    '璃夜看了星輪，說厄蘭要前往「天空聖域」，喚醒創造這片大陸的「幻紋始祖」，',
    '用始祖的力量把整個世界改寫成深淵！',
    '天空聖域只有集齊「六枚」印記的人才能進入。',
    '觀星鎮北方的星之結界我已經解開了。去吧——北方還有三場試煉在等你！',
    '（獲得了 金紋靈符 ×10）',
  ], { name: '星垣博士' });
  addItem('goldCharm', 10);
  setFlag('part2');
  saveGame(true);
}

async function rivalBattle4() {
  await say(['喲！我們又見面了。', '我也一路追著厄蘭到這裡……閣樓深處有教團的人在找什麼「幻紋鑰匙」。', '不過在那之前——我變強了，再比一場！'], { name: '小嵐' });
  const r = await trainerBattle({ name: '靈契師 小嵐', look: LOOK.rival, team: [[33, 42], [16, 42], [11, 42], [31, 43], [rivalMon(2), 44]], money: 3000 });
  if (r !== 'win') return;
  setFlag('rival4');
  healParty();
  await say(['哈……還是贏不了你。', '我把你的夥伴治好了。我會在這裡守著，需要治療就來找我！', '快去阻止厄蘭！'], { name: '小嵐' });
}

async function bishopBattle2() {
  await say(['呵呵……又是你。', '幻紋鑰匙已經到手了。有了它，天空聖域的大門就會打開。', '不過，在那之前，讓你嘗嘗玩具們的怨念吧！'], { name: '哭偶主教 厄蘭' });
  const r = await trainerBattle({ name: '哭偶主教 厄蘭', look: LOOK.bishop, team: [[74, 44], [83, 44], [9, 45], [10, 46]], money: 4000 });
  if (r !== 'win') return;
  setFlag('bishop2');
  await say(['哼……沒關係，鑰匙已經在我手上。', '你想阻止我，就到天空聖域來吧！哈哈哈哈！', '（厄蘭乘著黑霧消失了……）'], { name: '哭偶主教 厄蘭' });
}

async function bishopBattle3() {
  await say([
    '……你真的來了。',
    '你知道嗎？幻紋始祖創造了這片大陸，也創造了「哭泣」。',
    '我只是想讓所有人不再哭泣——只要一切都被深淵吞沒，就不會再有悲傷了！',
    '這是最後一次了，靈契師！',
  ], { name: '哭偶主教 厄蘭' });
  const r = await trainerBattle({ name: '哭偶主教 厄蘭', look: LOOK.bishop, team: [[35, 54], [84, 55], [41, 55], [8, 56], [10, 58]], money: 8000 });
  if (r !== 'win') return;
  setFlag('bishop3');
  shake = 1;
  await say(['……為什麼……你的夥伴們，都在笑……', '我的哭偶……也在笑嗎……', '不好！幻紋之核失控了——始祖要醒了！'], { name: '哭偶主教 厄蘭' });
  await tween(1500, p => shake = 1 - p);
  await say(['天空裂開了，一顆巨大的蛋浮現在聖域頂端。', '那就是幻紋始祖——被深淵之力污染、正在失控的創世之靈！', '只有打倒牠、或讓牠成為夥伴，才能拯救幻紋大陸！']);
}

async function originBattle() {
  await say(['幻紋始祖睜開了巨大的單眼……', '牠的光芒裡，混著深淵的黑霧。']);
  const c = await choose(['挑戰！', '先準備一下'], { title: '要挑戰幻紋始祖嗎？', w: 300, x: W / 2 - 150, y: 300 });
  if (c !== 0) return;
  const r = await wildBattle(makeMon(100, 60), { boss: true });
  if (r === 'caught') { setFlag('originCaught'); await finalEnding(true); }
  else if (r === 'win') { await say(['黑霧從幻紋始祖身上散去了……', '牠安靜地閉上眼睛，回到了聖域頂端。（還可以再次挑戰並收服牠）']); if (!flag('finalEnd')) await finalEnding(false); }
}

async function finalEnding(caught) {
  setFlag('finalEnd');
  await say([
    caught ? '幻紋始祖化成溫暖的光，鑽進了你的靈符裡。' : '幻紋始祖身上的深淵之力完全消散了。',
    '厄蘭跪在地上，懷裡的哭偶……第一次露出了微笑。',
    '「……原來，悲傷也能被笑容包覆起來啊。」',
    '小嵐、星垣博士、六位試煉者都趕到了天空聖域。',
    '幻紋大陸，終於迎來了真正的黎明。',
  ]);
  await ending(caught, true);
}

function chapterCard(title, sub) {
  return new Promise(res => {
    const t0 = performance.now();
    const L = pushLayer({
      full: true,
      update() { if (performance.now() - t0 > 2600 || (performance.now() - t0 > 600 && take('ok'))) { popLayer(L); res(); } },
      draw() {
        const tt = (performance.now() - t0) / 1000, a = Math.min(1, tt * 2, (2.6 - tt) * 2);
        ctx.fillStyle = '#05030a'; ctx.fillRect(0, 0, W, H);
        ctx.save(); ctx.globalAlpha = Math.max(0, a);
        ctx.strokeStyle = '#c8a050'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(W / 2 - 220, H / 2 + 6); ctx.lineTo(W / 2 + 220, H / 2 + 6); ctx.stroke();
        text(title, W / 2, H / 2 - 58, { size: 46, align: 'center', serif: true, bold: true, color: '#ffd77a' });
        text(sub, W / 2, H / 2 + 26, { size: 22, align: 'center', serif: true, color: '#e8d8b0' });
        ctx.restore();
      },
    });
  });
}

async function maybeChapter() {
  const ch = CHAPTERS[S.map];
  if (!ch || flag('ch' + ch[0])) return;
  setFlag('ch' + ch[0]);
  await chapterCard(`第 ${ch[0]} 章`, ch[1]);
}

// 圖鑑棲息地：依照出沒地圖自動填入
for (const id in MAPS) for (const e of MAPS[id].wild || []) setHab([e[0]], MAPS[id].name);
for (const id in MONS) if (!MONS[id].hab) MONS[id].hab = '由進化而來';
MONS[98].hab = '冰晶湖・湖心'; MONS[99].hab = '雷鳴高原・山頂'; MONS[97].hab = '天空聖域'; MONS[100].hab = '天空聖域・頂端';
