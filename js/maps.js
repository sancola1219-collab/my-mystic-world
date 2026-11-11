// ===== 地圖、NPC、劇情 =====
// 圖塊：. 草地  , 高草(遇怪)  T 樹  ~ 水  = 小路  H 建築  D 門  f 花  S 告示牌  b 橋
//       # 石牆  a 灰燼地  ; 灰燼草(遇怪)  L 熔岩  m 岩石  X 深淵地面  x 深淵草(遇怪)  C 晶石  G 深淵之門

const SOLID = new Set(['T', '~', 'H', '#', 'L', 'm', 'C', 'G', 'S']);
const ENCOUNTER = new Set([',', ';', 'x']);

const LOOK = {
  mom:    { hair: '#6a3a20', shirt: '#e07aa0', pants: '#5a3040' },
  prof:   { hair: '#e8e8e8', shirt: '#f4f4f0', pants: '#4a5a70' },
  rival:  { hair: '#2a4ad0', shirt: '#2a2a40', pants: '#1a1a2a', hat: '#3a6af0' },
  kid:    { hair: '#4a2a10', shirt: '#5ab040', pants: '#3a3a60', hat: '#e0c040' },
  girl:   { hair: '#c86a30', shirt: '#f0a0c0', pants: '#a04060' },
  elder:  { hair: '#c0c0c0', shirt: '#7a5a3a', pants: '#3a2a1a' },
  fu:     { hair: '#e07a1e', shirt: '#e08a2a', pants: '#2fb0a8', robe: '#c8641e' },
  smith:  { hair: '#2a1a10', shirt: '#7a7a8a', pants: '#3a2a20', hat: '#c8641e' },
  liye:   { hair: '#5ad0e0', shirt: '#2a3a7a', pants: '#1a2050', robe: '#3a5aa0' },
  cult:   { hair: '#2a1a3a', shirt: '#4a2a6a', pants: '#2a1a3a', hat: '#6a3a9a', robe: '#3a1a50' },
  bishop: { hair: '#e0e0f0', shirt: '#6a1a5a', pants: '#2a0a2a', hat: '#9a2a8a', robe: '#4a0a3a' },
  fighter:{ hair: '#1a1a1a', shirt: '#f0f0f0', pants: '#2a2a2a' },
  rider:  { hair: '#e0d040', shirt: '#3a6ad8', pants: '#e8ecf4' },
  guard:  { hair: '#3a2a1a', shirt: '#6a7a50', pants: '#3a4a2a', hat: '#4a5a3a' },
  worker: { hair: '#5a3a1a', shirt: '#d0a040', pants: '#4a4a5a' },
};

const STARTERS = [14, 6, 7];
const RIVAL_PICK = { 14: 6, 6: 7, 7: 14 };
function rivalStarter() { return RIVAL_PICK[S.starter] || 6; }

const MAPS = {
  village: {
    name: '晨曦村', theme: 'green', music: 'town',
    rows: [
      'TTTTTTTTT==TTTTTTTTT',
      'T........==........T',
      'T.HHHH...==..HHHHH.T',
      'T.HHHH...==..HHHHH.T',
      'T.HDHH...==..HHDHH.T',
      'T..=.....==....=...T',
      'T..=============...T',
      'T........==........T',
      'T..S.....==........T',
      'T.HHHH...==...HHH..T',
      'T.HHHH...==...HHH..T',
      'T.HDHH...==...HDH..T',
      'T..=.....==....=...T',
      'T..=============...T',
      'T~~~.......f.......T',
      'T~~~~~....ff.......T',
      'TTTTTTTTTTTTTTTTTTTT',
    ],
    exits: [{ x: 9, y: 0, w: 2, h: 1, to: 'route1', tx: 9, ty: 19 }],
    doors: {
      '3,4': { roof: '#b84a3a', label: '我的家', run: () => homeDoor() },
      '15,4': { roof: '#3a6ab8', label: '星垣研究所', run: () => labDoor() },
      '3,11': { roof: '#e0a030', label: '祈光亭', run: () => centerDoor(false) },
      '15,11': { roof: '#6a8a3a', label: '鄰居家', run: () => neighborDoor() },
    },
    signs: { '3,8': '【晨曦村】\n光芒最先照到的村落。北邊是甜光林道。' },
    triggers: [
      { x: 8, y: 0, w: 4, h: 2, run: async () => {
        if (!flag('gotStarter')) { await say('（媽媽的聲音）等等！還沒去星垣研究所領取夥伴呢！', { name: '媽媽' }); stepBack(); return; }
        if (!flag('rival1')) await rivalBattle1();
      } },
    ],
    npcs: [
      { id: 'mom', x: 5, y: 6, dir: 'down', look: LOOK.mom, name: '媽媽', talk: async () => {
        if (!flag('gotStarter')) await say(['今天是你成為「靈契師」的日子！', '星垣博士在右上角的研究所等你喔。'], { name: '媽媽' });
        else { healParty(); await say(['你的夥伴看起來好可愛！', '來，休息一下吧。（隊伍完全恢復了！）'], { name: '媽媽' }); }
      } },
      { id: 'oldman', x: 12, y: 8, dir: 'left', look: LOOK.elder, name: '村長爺爺', talk: async () => {
        await say(['聽說深淵裂縫最近不斷傳出低吼……', '傳說中，深淵之門後沉睡著吞噬一切的「巨顎方門獸」。', '願光芒守護你，年輕的靈契師。'], { name: '村長爺爺' });
      } },
    ],
  },

  route1: {
    name: '甜光林道', theme: 'green',
    rows: [
      'TTTTTTTTT==TTTTTTTTT',
      'TTTT.....==.....TTTT',
      'TT,,,,...==...,,,,TT',
      'TT,,,,...==...,,,,TT',
      'TT.......==.......TT',
      'TTTTTT...==...TTTTTT',
      'T,,,,,...==........T',
      'T,,,,,...==..f..f..T',
      'T,,,,,...==........T',
      'T........==...,,,,,T',
      'TTT..f...==...,,,,,T',
      'T........==...,,,,,T',
      'T..TTTT..==..TTTTTTT',
      'T..TTTT..==........T',
      'T,,,,,,..==...S....T',
      'T,,,,,,..==........T',
      'T,,,,,,..==..,,,,,,T',
      'T........==..,,,,,,T',
      'TTTTT....==..,,,,,,T',
      'T........==........T',
      'TTTTTTTTT==TTTTTTTTT',
    ],
    exits: [
      { x: 9, y: 20, w: 2, h: 1, to: 'village', tx: 9, ty: 1 },
      { x: 9, y: 0, w: 2, h: 1, to: 'town2', tx: 10, ty: 13 },
    ],
    signs: { '14,14': '【甜光林道】\n高草叢裡住著許多幻靈。\n北：符燈鎮　南：晨曦村' },
    wild: [[14, 3, 5, 20], [1, 3, 5, 20], [18, 3, 5, 25], [15, 4, 6, 20], [2, 5, 6, 8]],
    npcs: [
      { id: 'jie', x: 4, y: 9, dir: 'right', look: LOOK.kid, name: '蘑菇少年 小傑', sight: 5,
        trainer: { team: [[14, 4], [18, 5]], money: 120, before: '眼神交會了！來場幻靈對戰吧！', after: '哇……你的夥伴好強！' } },
      { id: 'lili', x: 15, y: 13, dir: 'left', look: LOOK.girl, name: '甜點師 莉莉', sight: 4,
        trainer: { team: [[1, 6]], money: 150, before: '我的冠捲甜靈今天特別甜喔！', after: '輸了也要笑著吃點心～' } },
    ],
  },

  town2: {
    name: '符燈鎮', theme: 'warm',
    rows: [
      'TTTTTTTTTTTTTTTTTTTTTT',
      'T.f..........f.......T',
      'T.HHHH...HHHHHH......T',
      'T.HHHH...HHHHHH..HHH.T',
      'T.HDHH...HHHHHH..HHH.T',
      'T..=.....HHHDHH..HDH.T',
      'T..=........=.....=...',
      'T..================...',
      'T.........==..........',
      'T..S......==.....S...T',
      'T.HHHH....==...f.....T',
      'T.HHHH....==.........T',
      'T.HDHH....==....f....T',
      'T..=======..........fT',
      'TTTTTTTTTT==TTTTTTTTTT',
    ],
    exits: [
      { x: 10, y: 14, w: 2, h: 1, to: 'route1', tx: 9, ty: 1 },
      { x: 21, y: 6, w: 1, h: 3, to: 'route2', tx: 1, ty: 6 },
    ],
    doors: {
      '3,4': { roof: '#7a5a8a', label: '民宅', run: () => say(['最近有穿紫袍的怪人在霧澤古道出沒，', '他們自稱「深淵教團」，說要喚醒什麼東西……好可怕。'], { name: '鎮民' }) },
      '12,5': { roof: '#d0601e', label: '符光試煉殿', run: () => trialDoor(1) },
      '18,5': { roof: '#3a8ab0', label: '商店', run: () => shop() },
      '3,12': { roof: '#e0a030', label: '祈光亭', run: () => centerDoor(false) },
    },
    signs: { '3,9': '【符燈鎮】\n符咒與燈火交織的城鎮。', '17,9': '【符光試煉殿】\n試煉者：符語師 阿符\n「笑容，是最古老的詭計。」' },
    triggers: [
      { x: 20, y: 6, w: 1, h: 3, run: async () => {
        if (!flag('badge1')) { await say('前面的霧澤古道很危險。先通過符光試煉，證明你的實力吧！', { name: '守衛' }); stepBack(); }
      } },
    ],
    npcs: [
      { id: 'guard1', x: 20, y: 5, dir: 'down', look: LOOK.guard, name: '守衛', talk: () => say(flag('badge1') ? '持有符燈印的靈契師，請通行！' : '先取得「符燈印」才能前往霧澤古道。', { name: '守衛' }) },
      { id: 'lady', x: 7, y: 9, dir: 'down', look: LOOK.girl, name: '鎮民', talk: () => say(['屬性相剋很重要喔！', '火剋木、木剋水、水剋火……', '光能照亮暗，暗能吞噬靈與幻！'], { name: '鎮民' }) },
    ],
  },

  route2: {
    name: '霧澤古道', theme: 'swamp',
    rows: [
      'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
      'T,,,,....~~~~~~~~....,,,,,,..T',
      'T,,,,....~~~~~~~~....,,,,,,..T',
      'T........~~~~~~~~..T.........T',
      'T..TT....~~~~~~~~..T..~~~~...T',
      'T..TT,,,.bbbbbbbb.....~~~~..,T',
      '.......,.bbbbbbbb.....~~~~..,.',
      '.........~~~~~~~~.......,,,,,.',
      '..,,,,..........S.....,,,,,,..',
      'T.,,,,..~~~~.......TT.,,,,,,.T',
      'T.,,,,..~~~~..,,,,.TT........T',
      'T.......~~~~..,,,,...........T',
      'T.......~~~~..,,,,......f....T',
      'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    ],
    exits: [
      { x: 0, y: 6, w: 1, h: 3, to: 'town2', tx: 20, ty: 6 },
      { x: 29, y: 6, w: 1, h: 3, to: 'forge', tx: 1, ty: 6 },
    ],
    signs: { '16,8': '【霧澤古道】\n青霧瀰漫的古老水道。\n東：熔岩工堡' },
    wild: [[5, 9, 12, 25], [12, 9, 12, 20], [20, 10, 12, 20], [2, 9, 12, 20], [7, 10, 11, 7], [14, 9, 11, 7]],
    triggers: [
      { x: 26, y: 1, w: 2, h: 12, run: async () => { if (!flag('rival2')) await rivalBattle2(); } },
    ],
    npcs: [
      { id: 'g1', x: 18, y: 8, dir: 'up', look: LOOK.cult, name: '深淵教團 成員', sight: 4,
        trainer: { team: [[20, 11], [2, 11]], money: 300, before: ['站住！教團正在收集「幻紋之光」，', '喚醒深淵之主的日子就快到了！礙事的傢伙，滾開！'], after: '可惡……主教大人不會放過你的！' } },
      { id: 'g2', x: 24, y: 3, dir: 'left', look: LOOK.cult, name: '深淵教團 成員', sight: 4,
        trainer: { team: [[12, 12], [20, 13]], money: 320, before: '嘻嘻，打開盒蓋前，誰也不知道裡面是驚喜還是驚嚇！', after: '是驚嚇……給我的驚嚇……' } },
      { id: 'fisher', x: 5, y: 3, dir: 'down', look: LOOK.elder, name: '撐篙老人', talk: () => say(['青窗載靈會背著綠窗殼在水陸之間漫遊。', '傳說牠窗內的微光，能指引迷路的旅人回家。'], { name: '撐篙老人' }) },
    ],
  },

  forge: {
    name: '熔岩工堡', theme: 'lava',
    rows: [
      '############==############',
      '#aaaaLLLaaaa==aaaaLLLLaaa#',
      '#a;;;LLLaaaa==aaaaLLLLa;a#',
      '#a;;;aaaaHHHHHHHaaaaaa;;a#',
      '#a;;;aaaaHHHHHHHaaHHHa;;a#',
      '#aaaaaaaaHHHDHHHaaHHHaaaa#',
      'aaaaaaaaaaaa==aaaaHDHaaaa#',
      'aaaaaaaaaaaa==aaaaaaaaaaa#',
      'a;;;aaaaaaaa==aaaa;;;;aaa#',
      '#;;;aaLLLaaaaaaaaa;;;;aaa#',
      '#;;;aaLLLaaS##aaaa;;;;aaa#',
      '#aaaaaLLLaaa##aaaaaaaaaaa#',
      '#a;;;;aaaaaaaaaaaLLLa;;;a#',
      '#a;;;;aaaaaaaaaaaLLLa;;;a#',
      '#aaaaaaaaaaaaaaaaaaaaaaaa#',
      '##########################',
    ],
    exits: [
      { x: 0, y: 6, w: 1, h: 3, to: 'route2', tx: 28, ty: 6 },
      { x: 12, y: 0, w: 2, h: 1, to: 'valley', tx: 10, ty: 19 },
    ],
    doors: {
      '12,5': { roof: '#8a3a1a', label: '熔鋼試煉場', run: () => trialDoor(2) },
      '19,6': { roof: '#e0a030', label: '祈光亭・補給站', run: () => centerDoor(true) },
    },
    signs: { '11,10': '【熔岩工堡】\n廢棄的戰械工堡，橘鋼戰車獸曾在此衝鋒。\n北：風旋山谷' },
    wild: [[19, 13, 16, 30], [7, 13, 15, 15], [6, 13, 15, 15], [3, 15, 16, 10], [4, 16, 16, 5], [15, 13, 15, 25]],
    triggers: [
      { x: 12, y: 1, w: 2, h: 1, run: async () => {
        if (!flag('badge2')) { await say('工堡北門的閘門被鎖住了。也許試煉者「赤鐵」有鑰匙……', {}); stepBack(); }
      } },
    ],
    npcs: [
      { id: 'tie', x: 4, y: 11, dir: 'right', look: LOOK.worker, name: '機工 阿鐵', sight: 4,
        trainer: { team: [[19, 15], [7, 15]], money: 400, before: '機械與荒野的完美協奏，見識一下！', after: '巡行無聲……結果被你裁決了。' } },
      { id: 'g3', x: 21, y: 9, dir: 'left', look: LOOK.cult, name: '深淵教團 成員', sight: 4,
        trainer: { team: [[9, 16]], money: 450, before: '主教大人命令我們偷走工堡的熔核！裂口藍魔，上吧！', after: '撤、撤退！' } },
      { id: 'smithkid', x: 15, y: 7, dir: 'down', look: LOOK.kid, name: '學徒', talk: () => say(['赤鐵大師的橘鋼戰車獸超級硬！', '用水或冰屬性的招式，效果會比較好喔。'], { name: '學徒' }) },
    ],
  },

  valley: {
    name: '風旋山谷', theme: 'mountain',
    rows: [
      'mmmmmmmmmm==mmmmmmmmmm',
      'm,,,,.....==.....,,,,m',
      'm,,,,..mm.==..mm.,,,,m',
      'm......mm.==..mm.....m',
      'mmmm.........,,,,,..mm',
      'm,,,,,.......,,,,,...m',
      'm,,,,,..mmm..,,,,,...m',
      'm......mmm..........mm',
      'mm..S.......mmmm.....m',
      'm,,,,,......mmmm,,,,,m',
      'm,,,,,..............,m',
      'm.....~~~~bb~~~~.....m',
      'm.....~~~~bb~~~~.....m',
      'm,,,,......,,,,,,,,..m',
      'm,,,,..mmm..,,,,,,,..m',
      'm......mmm...........m',
      'mmmm..........mmmm...m',
      'm,,,,,,.....,,,,,,,,.m',
      'm,,,,,,.....,,,,,,,,.m',
      'm..........==........m',
      'mmmmmmmmmm==mmmmmmmmmm',
    ],
    exits: [
      { x: 10, y: 20, w: 2, h: 1, to: 'forge', tx: 12, ty: 1 },
      { x: 10, y: 0, w: 2, h: 1, to: 'startown', tx: 10, ty: 11 },
    ],
    signs: { '4,8': '【風旋山谷】\n強風呼嘯的山谷，武靈們在此修行。\n北：觀星鎮' },
    wild: [[13, 18, 21, 20], [15, 18, 20, 20], [17, 19, 22, 20], [3, 19, 21, 15], [1, 18, 20, 15], [11, 20, 22, 10]],
    npcs: [
      { id: 'cang', x: 8, y: 4, dir: 'down', look: LOOK.fighter, name: '武者 蒼', sight: 4,
        trainer: { team: [[13, 21], [16, 22]], money: 600, before: '角影一轉，空氣都會被切成節奏！', after: '好俐落的指揮……我還得再修行。' } },
      { id: 'bell', x: 15, y: 15, dir: 'left', look: LOOK.rider, name: '騎手 風鈴', sight: 4,
        trainer: { team: [[5, 21], [17, 22]], money: 600, before: '一旦躍上梭背，天空就會把道路打開！', after: '風停了……你比風還快。' } },
      { id: 'hiker', x: 17, y: 10, dir: 'down', look: LOOK.elder, name: '登山客', talk: () => { healParty(); return say(['這裡風大，我請你喝杯熱茶吧。', '（隊伍完全恢復了！）'], { name: '登山客' }); } },
    ],
  },

  startown: {
    name: '觀星鎮', theme: 'night',
    rows: [
      'TTTTTTTTTTTTTTTTTTTTTT',
      'T...f.....HHHH.....f.T',
      'T.HHHH....HHHH.......T',
      'T.HHHH....HHHH..HHH..T',
      'T.HDHH....HHHH..HHH..T',
      'T..=......HHDH..HDH..T',
      'T..=........=....=...T',
      'T..===============....',
      'T..........==.........',
      'T...S......==....S...T',
      'T..f.......==.....f..T',
      'T..........==........T',
      'TTTTTTTTTT==TTTTTTTTTT',
    ],
    exits: [
      { x: 10, y: 12, w: 2, h: 1, to: 'valley', tx: 10, ty: 1 },
      { x: 21, y: 7, w: 1, h: 2, to: 'abyss', tx: 1, ty: 7 },
    ],
    doors: {
      '3,4': { roof: '#e0a030', label: '祈光亭', run: () => centerDoor(false) },
      '12,5': { roof: '#2a4a9a', label: '觀星塔', run: () => trialDoor(3) },
      '17,5': { roof: '#3a8ab0', label: '商店', run: () => shop() },
    },
    signs: { '4,9': '【觀星鎮】\n夜空中的答案會在這裡被喚醒。', '17,9': '東：深淵裂縫\n（非持有三枚印記者禁止通行）' },
    triggers: [
      { x: 20, y: 7, w: 1, h: 2, run: async () => {
        if (!flag('badge3')) { await say('前方是深淵裂縫。沒有集齊三枚試煉印記的人，不能進去！', { name: '星塔守衛' }); stepBack(); }
      } },
    ],
    npcs: [
      { id: 'guard3', x: 19, y: 6, dir: 'down', look: LOOK.guard, name: '星塔守衛', talk: () => say(flag('badge3') ? '三枚印記……你就是璃夜大人說的靈契師吧。請務必小心！' : '集齊三枚試煉印記，才能前往深淵裂縫。', { name: '星塔守衛' }) },
      { id: 'star', x: 7, y: 9, dir: 'down', look: LOOK.liye, name: '占星少女', talk: () => say(['星輪懸偶會在夜裡測量命運的轉向。', '最近，所有的星輪都指向東方的深淵……'], { name: '占星少女' }) },
    ],
  },

  abyss: {
    name: '深淵裂縫', theme: 'abyss',
    rows: [
      'CCCCCCCCCCCCCCCCCCCCCCCCCC',
      'CXXXXxxxxCCCCXXXXXXxxxxXXC',
      'CXxxXxxxxCCCCXxxxXXxxxxXXC',
      'CXxxXXXXXXXXXXxxxXXXXXXXXC',
      'CXXXXCCCXXXXXXXXXXCCCXXXXC',
      'CCXXXCCCXXxxxxXXXXCCCXXGGC',
      'XXXXXXXXXXxxxxXXXXXXXXXGGC',
      'XXXXXXXXXXXXXXXXXXXXXXXGGC',
      'XXXXXXXXXXxxxxXXXXXXXXXGGC',
      'CCXXXCCCXXxxxxXXXXCCCXXGGC',
      'CXXXXCCCXXXXXXXXXXCCCXXXXC',
      'CXxxXXXXXXXXXXxxxXXXXXXXXC',
      'CXxxXxxxxCCCCXxxxXXxxxxXXC',
      'CXXXXxxxxCCCCXXXXXXxxxxXXC',
      'CCCCCCCCCCCCCCCCCCCCCCCCCC',
    ],
    exits: [{ x: 0, y: 6, w: 1, h: 3, to: 'startown', tx: 20, ty: 7 }],
    wild: [[9, 26, 29, 30], [10, 27, 29, 15], [20, 26, 28, 25], [2, 26, 28, 20], [12, 26, 28, 10]],
    triggers: [
      { x: 2, y: 1, w: 1, h: 13, run: async () => { if (!flag('rival3')) await rivalBattle3(); } },
      { x: 17, y: 1, w: 1, h: 13, run: async () => { if (!flag('leader')) await leaderBattle(); } },
    ],
    npcs: [
      { id: 'rivalA', x: 3, y: 5, dir: 'down', look: LOOK.rival, name: '小嵐', cond: () => flag('rival3'), talk: async () => {
        healParty(); await say(['我把你的夥伴都治療好了。', '去吧！深淵之門就交給你了！'], { name: '小嵐' });
      } },
      { id: 'g4', x: 9, y: 3, dir: 'down', look: LOOK.cult, name: '深淵教團 幹部', sight: 4,
        trainer: { team: [[9, 27], [20, 27]], money: 900, before: '當深淵之口裂開，連光都會顫抖！', after: '光……怎麼可能……' } },
      { id: 'g5', x: 14, y: 11, dir: 'up', look: LOOK.cult, name: '深淵教團 幹部', sight: 4,
        trainer: { team: [[2, 28], [10, 28]], money: 900, before: '一念相牽，萬象為線……你逃不掉的！', after: '我的意念……被切斷了……' } },
      { id: 'bishop', x: 19, y: 7, dir: 'left', look: LOOK.bishop, name: '哭偶主教 厄蘭', cond: () => !flag('leader'), talk: async () => {} },
      { id: 'boss', x: 22, y: 7, dir: 'left', boss: true, name: '巨顎方門獸', cond: () => flag('leader') && !flag('bossCaught'), talk: () => bossBattle() },
    ],
  },
};

// ===== 劇情腳本 =====
async function homeDoor() {
  if (!flag('gotStarter')) await say(['（家裡很安靜，媽媽在外面等你。）'], {});
  else { healParty(); await say('在家裡好好睡了一覺。隊伍完全恢復了！'); }
}

async function neighborDoor() {
  if (!flag('neighborGift')) {
    setFlag('neighborGift');
    addItem('potion', 3);
    await say(['要出發旅行了嗎？這些甜光露帶在身上吧！', '（獲得了 甜光露 ×3）'], { name: '鄰居阿姨' });
  } else await say('甜光露可以在戰鬥中回復夥伴的體力喔。', { name: '鄰居阿姨' });
}

async function labDoor() {
  if (flag('gotStarter')) {
    healParty();
    const seen = Object.keys(S.dex.seen).length, caught = Object.keys(S.dex.caught).length;
    await say([`圖鑑進度：看過 ${seen} 種，捕捉 ${caught} 種。`, caught >= 100 ? '太了不起了！你完成了整本幻靈圖鑑！' : '世界上一共有 100 種幻靈，繼續加油！', '（隊伍完全恢復了！）'], { name: '星垣博士' });
    return;
  }
  await say([
    '喔喔，你來啦！我是研究幻靈的星垣博士。',
    '這片「幻紋大陸」上住著各式各樣的幻靈。',
    '和幻靈締結契約、一起冒險的人，就叫做「靈契師」。',
    '最近，深淵裂縫傳出不祥的低吼，幻靈們都很不安……',
    '我希望你能踏上旅程，集齊三枚試煉印記，查明真相！',
    '首先，從這三隻幻靈中選一隻當你的夥伴吧！',
  ], { name: '星垣博士' });
  let pick = -1;
  while (pick < 0) {
    const i = await choose(STARTERS.map(id => (x, y, sel) => {
      drawMon(ctx, id, x + 30, y + 30, 60, performance.now() / 1000);
      text(MONS[id].n, x + 70, y + 8, { size: 22, color: sel ? '#ffd77a' : '#f4ead0' });
      MONS[id].t.forEach((t, k) => typeBadge(t, x + 70 + k * 58, y + 38, 50));
    }), { title: '選擇你的第一隻夥伴', w: 360, rowH: 74, x: W / 2 - 180, y: 40, cancel: false, desc: k => MONS[STARTERS[k]].desc });
    const id = STARTERS[i];
    const ok = await choose(['就是牠了！', '再想想'], { title: `選擇 ${MONS[id].n}？`, w: 260, x: W / 2 - 130, y: 330, cancel: false });
    if (ok === 0) pick = id;
  }
  S.starter = pick;
  const m = makeMon(pick, 5);
  addMon(m);
  setFlag('gotStarter');
  addItem('charm', 5); addItem('potion', 2);
  await say([`你和 ${MONS[pick].n} 締結了契約！`, '（獲得了 靈符 ×5、甜光露 ×2）', '靈符可以在戰鬥中捕捉虛弱的野生幻靈。', '按 X（或 Esc）可以打開選單，查看隊伍、背包與圖鑑。', '對了，我的另一位學生「小嵐」也剛出發，你們說不定會碰面喔！'], { name: '星垣博士' });
}

async function rivalBattle1() {
  await say(['嘿！你也拿到夥伴了？', `我選的是 ${MONS[rivalStarter()].n}！屬性剛好剋你的喔～`, '來試試看誰比較厲害吧！'], { name: '小嵐' });
  const r = await trainerBattle({ name: '靈契師 小嵐', look: LOOK.rival, team: [[rivalStarter(), 5]], money: 100, noWhiteout: true });
  setFlag('rival1');
  if (r === 'win') await say(['可惡，我輸了！', '不過我會變得更強的。符燈鎮見！'], { name: '小嵐' });
  else { healParty(); await say(['嘿嘿，是我贏了！', '別灰心，回去讓夥伴休息一下吧。（隊伍恢復了）', '符燈鎮見！'], { name: '小嵐' }); }
}

async function rivalBattle2() {
  await say(['又見面了！我聽說深淵教團的人在這附近出沒。', '在對付他們之前，先讓我確認一下你有多強！'], { name: '小嵐' });
  const r = await trainerBattle({ name: '靈契師 小嵐', look: LOOK.rival, team: [[15, 12], [18, 12], [rivalStarter(), 14]], money: 500 });
  if (r !== 'win') return;
  setFlag('rival2');
  await say(['你真的很強……', '教團的人說要在深淵之門喚醒什麼「深淵之主」。', '我要先去調查。前面的熔岩工堡也有試煉，加油！'], { name: '小嵐' });
}

async function rivalBattle3() {
  await say(['終於追上我了嗎？', '教團主教就在裡面，巨顎方門獸快要醒了。', '讓我用全力確認——你有沒有資格走到最深處！'], { name: '小嵐' });
  const r = await trainerBattle({ name: '靈契師 小嵐', look: LOOK.rival, team: [[16, 29], [11, 29], [17, 30], [rivalMon(1), 31]], money: 1500 });
  if (r !== 'win') return;
  setFlag('rival3');
  healParty();
  await say(['……我承認，你比我強。', '你的夥伴我都治好了。之後需要治療就來找我！', '去吧，阻止主教！'], { name: '小嵐' });
}

async function leaderBattle() {
  await say([
    '呵呵呵……哭聲不止，巨口不息。',
    '我是深淵教團的主教「厄蘭」。',
    '我們收集了大陸上的幻紋之光，就是為了喚醒門後的深淵之主——巨顎方門獸！',
    '萬物盡吞，唯深淵永恆！就讓你成為第一個祭品吧！',
  ], { name: '哭偶主教 厄蘭' });
  const r = await trainerBattle({ name: '哭偶主教 厄蘭', look: LOOK.bishop, team: [[20, 31], [9, 32], [10, 34]], money: 3000 });
  if (r !== 'win') return;
  setFlag('leader');
  shake = 1;
  await say(['不……不可能……', '但是太遲了！儀式已經完成——', '聽啊！深淵之主醒來了！哈哈哈哈！'], { name: '哭偶主教 厄蘭' });
  await tween(1200, p => shake = 1 - p);
  await say(['（轟隆隆隆隆……！）', '深淵之門緩緩打開，一隻巨大的方口巨獸探出了頭！', '主教趁亂逃走了……', '準備好之後，去面對巨顎方門獸吧！（可以先回入口找小嵐治療）']);
}

async function bossBattle() {
  await say(['巨顎方門獸張開了足以吞下整座山的巨口……', '一旦牠離開深淵，整片大陸都會被吞噬！']);
  const c = await choose(['挑戰！', '先準備一下'], { title: '要挑戰巨顎方門獸嗎？', w: 300, x: W / 2 - 150, y: 300 });
  if (c !== 0) return;
  const r = await wildBattle(makeMon(8, 38), { boss: true });
  if (r === 'caught') { setFlag('bossCaught'); if (!flag('part1')) await part1End(); }
  else if (r === 'win') { await say(['巨顎方門獸發出震天的咆哮，退回了深淵之門……', '（牠似乎還能再次被挑戰。也許可以試著用靈符收服牠？）']); if (!flag('part1')) await part1End(); }
}

async function trialDoor(n) {
  const T = TRIALS[n];
  if (flag('badge' + n)) { healParty(); await say(T.afterTalk, { name: T.name }); return; }
  await say(T.intro, { name: T.name });
  const r = await trainerBattle({ name: T.title, look: T.look, team: T.team, money: T.money });
  if (r !== 'win') return;
  setFlag('badge' + n);
  S.badges = (S.badges || 0) + 1;
  await say(T.win, { name: T.name });
  if (T.gift) { addItem(T.gift[0], T.gift[1]); await say(`（獲得了 ${ITEMS[T.gift[0]].n} ×${T.gift[1]}）`); }
  showToast(`獲得了「${T.badge}」！`);
  await jingle('badge');
  await tip('badge', ['集齊印記，守衛就會讓你前往新的地區。', '不知道下一步要去哪裡？看畫面右上角的「目標」，或按 H 查看提示。']);
}

const TRIALS = {
  1: { name: '符語師 阿符', title: '試煉者 阿符', look: LOOK.fu, badge: '符燈印', money: 800, gift: ['goldCharm', 3],
       team: [[15, 9], [1, 10], [6, 12]],
       intro: ['歡迎來到符光試煉殿！我是試煉者阿符。', '笑容，是最古老的詭計；符咒，是最溫柔的力量。', '讓我看看你和夥伴之間的羈絆吧！'],
       win: ['哈哈！漂亮！這枚「符燈印」是你的了。', '帶著它，守衛就會讓你通過霧澤古道。', '這些金紋靈符也送你，捕捉率比一般靈符高喔！'],
       afterTalk: ['你的夥伴們都好好休息過了。', '霧澤古道東邊就是熔岩工堡，下一位試煉者在那裡等你！'] },
  2: { name: '鋼匠 赤鐵', title: '試煉者 赤鐵', look: LOOK.smith, badge: '熔鋼印', money: 1400, gift: ['superPot', 5],
       team: [[19, 17], [3, 18], [4, 20]],
       intro: ['我是赤鐵。這座工堡的鋼與火，都聽我號令。', '它碾碎的不只是鋼鐵，更是意志與恐懼！', '來吧，讓道路在火焰中臣服！'],
       win: ['……你的意志比鋼還硬。「熔鋼印」拿去吧。', '北門的閘門已經打開了，風旋山谷的盡頭就是觀星鎮。', '這些蜜光露帶著，前面的路不好走。'],
       afterTalk: ['熔爐的火永不熄滅，你的夥伴也已經恢復了。'] },
  3: { name: '星術士 璃夜', title: '試煉者 璃夜', look: LOOK.liye, badge: '星輪印', money: 2000, gift: ['starCharm', 1],
       team: [[12, 24], [17, 25], [3, 27]],
       intro: ['我是觀星塔的守望者，璃夜。', '星輪告訴我，你會在今夜來到這裡……', '當輪心開始旋轉，夜空中的答案也會被喚醒。來吧！'],
       win: ['星輪的轉向……果然指向了你。這是「星輪印」。', '三枚印記集齊了，深淵裂縫的大門會為你打開。', '深淵教團想喚醒巨顎方門獸——', '這枚「星紋靈符」蘊含星之力，或許能收服那頭巨獸。拜託你了！'],
       afterTalk: ['星輪依然指向東方的深淵。你的夥伴已經恢復，去吧！'] },
};

async function ending(caught) {
  setFlag('ending');
  await fadeOut(800);
  const lines = [
    caught ? '幻紋始祖成為了你的夥伴。' : '幻紋始祖回到了天空聖域，靜靜守護著大陸。',
    '深淵的哭聲停止了，幻紋大陸迎來了真正的黎明。',
    `圖鑑紀錄：捕捉 ${Object.keys(S.dex.caught).length} / 100 種`,
  ];
  const credits = new Promise(res => {
    const t0 = performance.now();
    const L = pushLayer({
      update() { if (performance.now() - t0 > 2000 && take('ok')) { popLayer(L); res(); } },
      draw() {
        ctx.fillStyle = '#05030a'; ctx.fillRect(0, 0, W, H);
        const tt = (performance.now() - t0) / 1000;
        for (let i = 0; i < 60; i++) { ctx.globalAlpha = 0.4 + 0.4 * Math.sin(tt * 2 + i); ctx.fillStyle = '#ffe8a0'; ctx.fillRect((i * 137) % W, (i * 89 + tt * 10) % H, 2, 2); }
        ctx.globalAlpha = 1;
        text('～ 我的神奇世界 ～', W / 2, 60, { size: 40, serif: true, bold: true, align: 'center', color: '#ffd77a' });
        lines.forEach((l, i) => text(l, W / 2, 140 + i * 36, { size: 22, align: 'center' }));
        const ids = Object.keys(MONS).map(Number).filter(i => S.dex.caught[i]).slice(0, 30);
        ids.forEach((id, i) => { const a = tt * 0.3 + i / ids.length * Math.PI * 2; drawMon(ctx, id, W / 2 + Math.cos(a) * 300, 400 + Math.sin(a) * 90, 64, tt); });
        text(`冒險者：${S.name}　　隊伍：${S.party.map(monName).join('、')}`, W / 2, 268, { size: 18, align: 'center', color: '#c8bca0' });
        text('感謝遊玩！　怪物原畫設計：玩家本人', W / 2, 300, { size: 18, align: 'center', color: '#c8bca0' });
        if (tt > 2) text('按 Z 繼續冒險（可以繼續收集圖鑑）', W / 2, H - 40, { size: 18, align: 'center', color: '#ffd77a' });
      },
    });
  });
  playMusic('sky');
  await fadeIn(400);
  await credits;
  saveGame();
}
