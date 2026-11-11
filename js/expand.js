// ===== 第十波：神獸強度三倍、各屬性大擴充（草 70 種、其他屬性各 50 種）=====

// ---------- 神獸強度 ×3 ----------
const LEGEND_POWER = 10;
const isLegend = id => !!(MONS[id] && MONS[id].big && id !== ZINING);
const calcStatsBase = calcStats;
calcStats = function (m) {
  calcStatsBase(m);
  if (isLegend(m.id)) { m.maxHp *= LEGEND_POWER; m.atk *= LEGEND_POWER; m.def *= LEGEND_POWER; m.spd *= LEGEND_POWER; }
};
function migrateV8() {
  S.v8 = 1;
  for (const m of S.party.concat(S.box)) { const r = m.maxHp ? m.hp / m.maxHp : 1; calcStats(m); m.hp = m.hp <= 0 ? 0 : Math.max(1, Math.round(m.maxHp * r)); }
}

// ---------- 各屬性的造型、配色、命名 ----------
const EXP_TYPES = {
  木: { n: 70, plans: [['fairy', {}], ['moth', {}], ['beast', { kind: 'horse', horn: 1 }], ['beast', { kind: 'lion', mane: 1 }], ['serpent', {}], ['turtle', {}], ['golem', {}], ['spider', {}], ['dino', {}], ['bird', {}], ['long', {}], ['fox', {}], ['crystal', {}]],
    pal: [['#5ac040', '#e8f0a0', '#c0ff60'], ['#3a8a30', '#f0a0c0', '#ffe060'], ['#80c060', '#a06030', '#d0ff80'], ['#2a6a3a', '#c8e090', '#80ffa0'], ['#a0d050', '#f8e0a0', '#fff080'], ['#4a9a6a', '#e090b0', '#ff90c0'], ['#6a8a30', '#d8c070', '#e0ff60']],
    pre: ['嫩芽', '青藤', '翠葉', '森語', '花冠', '竹影', '苔衣', '松針', '桃花', '蓮心', '藤蔓', '蕨羽', '櫻吹', '橡實', '楓紅', '蘭香', '柳絲', '草露', '綠蔭', '芽苞', '菩提', '茉莉', '向日', '藻綠', '棘刺'], verb: ['藤鞭', '花舞', '葉刃', '森嘯', '根縛', '孢爆', '花雨'], sec: ['光', '地', '暗', '風', '水', '幻'] },
  火: { n: 50, plans: [['dragon', {}], ['beast', { kind: 'lion', mane: 1, flame: 1 }], ['beast', { kind: 'wolf', flame: 1 }], ['bird', {}], ['fox', {}], ['golem', {}], ['demon', {}], ['scorpion', {}], ['star', {}], ['dino', {}], ['moth', {}]],
    pal: [['#e8502a', '#ffd080', '#ffb030'], ['#c03020', '#ffe0a0', '#ff8020'], ['#f07030', '#3a2020', '#ffd040'], ['#a02818', '#f0a040', '#ff6020'], ['#ff8a40', '#fff0c0', '#ffe060']],
    pre: ['炎', '焰尾', '熔心', '赤燄', '火輪', '灼羽', '爆炎', '燼', '烽火', '烈陽', '炭', '燭影', '焦土', '朱焰', '火山', '琥珀', '燎原', '炙鱗'], verb: ['焚炎', '熔爆', '烈焰', '火輪', '燎原'], sec: ['鬥', '地', '風', '暗', '光'] },
  水: { n: 50, plans: [['serpent', {}], ['whale', {}], ['mermaid', {}], ['kraken', {}], ['jelly', {}], ['angler', {}], ['turtle', {}], ['long', {}], ['dragon', { wing: 0 }]],
    pal: [['#3a8ae0', '#d0f0ff', '#80e0ff'], ['#2060b0', '#f0e0a0', '#60f0e0'], ['#40b0c0', '#f0a0c0', '#ffffff'], ['#1a4a8a', '#a0d0f0', '#40c0ff'], ['#60c0e0', '#ffe0b0', '#a0ffff']],
    pre: ['浪花', '潮音', '碧波', '深海', '珊瑚', '漣漪', '霧泉', '瀑布', '湖光', '滄海', '雨滴', '鯨歌', '貝殼', '冰泉', '潮汐', '海螢', '泡沫', '海藍'], verb: ['潮湧', '水龍', '海嘯波', '水刃', '泡沫彈'], sec: ['冰', '光', '幻', '暗', '地'] },
  雷: { n: 50, plans: [['beast', { kind: 'wolf', pat: 'spot' }], ['beast', { kind: 'lion', mane: 1 }], ['bird', {}], ['dragon', {}], ['mech', {}], ['jelly', {}], ['golem', {}], ['scorpion', {}], ['fairy', {}]],
    pal: [['#f0d040', '#3050b0', '#fff080'], ['#ffe060', '#202838', '#ffffff'], ['#4060c0', '#ffe040', '#80c0ff'], ['#c0a020', '#704010', '#fff060']],
    pre: ['電光', '雷鳴', '閃擊', '伏特', '霹靂', '雷雲', '磁暴', '電漿', '火花', '雷鼓', '電弧', '雷霆', '震電', '迅雷', '雷紋'], verb: ['雷擊', '電漿砲', '萬雷', '雷光', '電磁網'], sec: ['鋼', '風', '鬥', '光', '水'] },
  冰: { n: 50, plans: [['dragon', {}], ['crystal', {}], ['beast', { kind: 'wolf' }], ['bird', {}], ['wraith', {}], ['serpent', {}], ['fairy', {}], ['turtle', {}], ['jelly', {}]],
    pal: [['#c0f0ff', '#4a90e0', '#80ffff'], ['#e8f8ff', '#80a0d0', '#a0e0ff'], ['#90d0f0', '#2a5a9a', '#ffffff'], ['#b0e0f8', '#6070c0', '#c0f8ff']],
    pre: ['霜', '雪絨', '冰晶', '寒月', '凍原', '冰柱', '雪花', '極光', '冰河', '霧凇', '凜冽', '白霜', '冰鏡', '冰鈴', '寒鋒'], verb: ['冰封', '暴雪', '霜刃', '冰晶風暴', '極寒'], sec: ['水', '風', '幻', '鋼', '暗'] },
  風: { n: 50, plans: [['bird', {}], ['serpent', {}], ['beast', { kind: 'horse', wings: 1 }], ['fairy', {}], ['dragon', {}], ['moth', {}], ['long', {}], ['fox', {}]],
    pal: [['#90e0c8', '#f0f8ff', '#60f0c0'], ['#e0f0e8', '#70a0c0', '#a0fff0'], ['#60c0a0', '#f0e0a0', '#ffffff'], ['#b0d8f0', '#5080a0', '#80f0ff']],
    pre: ['疾風', '旋羽', '流雲', '颯', '嵐', '翔', '微風', '天穹', '迴旋', '風鈴', '蒼空', '飄絮', '捲雲', '風刃', '穿雲'], verb: ['旋風', '天穹斬', '風刃', '龍捲', '破空'], sec: ['光', '冰', '雷', '幻', '鬥'] },
  地: { n: 50, plans: [['golem', {}], ['dino', {}], ['turtle', {}], ['beast', { kind: 'lion', pat: 'scale' }], ['scorpion', {}], ['crystal', {}], ['dragon', { wing: 0 }], ['beast', { kind: 'horse', horn: 2 }]],
    pal: [['#a08050', '#5a4030', '#ffc060'], ['#806040', '#c0a070', '#ff9040'], ['#6a5a40', '#a09070', '#e0d080'], ['#b09060', '#4a3020', '#ffd080']],
    pre: ['岩', '砂丘', '大地', '礫', '峽谷', '石紋', '泥沼', '山脈', '化石', '黃土', '荒原', '鐘乳', '岩漿', '琥珀', '巨石'], verb: ['崩山', '地震波', '岩崩', '流沙', '大地之怒'], sec: ['鋼', '鬥', '火', '木', '暗'] },
  鋼: { n: 50, plans: [['mech', {}], ['knight', {}], ['golem', {}], ['scorpion', {}], ['spider', {}], ['dragon', { horn: 3 }], ['beast', { kind: 'wolf', pat: 'scale' }]],
    pal: [['#a8b4c8', '#404858', '#60e0ff'], ['#c8a050', '#5a4020', '#ffe080'], ['#707a8a', '#c04040', '#ff6040'], ['#d0d8e0', '#2a3a6a', '#80c0ff']],
    pre: ['鋼', '鐵壁', '齒輪', '銀刃', '鉚釘', '合金', '重裝', '鎧', '鍛鐵', '精鋼', '機巧', '鉻', '鎢', '鐵軌', '鋼翼'], verb: ['鋼鐵砲', '重擊', '刃旋', '鐵壁衝撞', '金屬風暴'], sec: ['雷', '地', '火', '鬥', '光'] },
  光: { n: 50, plans: [['angel', {}], ['beast', { kind: 'horse', horn: 1, wings: 1 }], ['bird', {}], ['star', {}], ['fairy', {}], ['crystal', {}], ['long', {}], ['beast', { kind: 'lion', mane: 1, wings: 1 }]],
    pal: [['#fff4d0', '#ffd040', '#ffffff'], ['#fffbe8', '#e8c060', '#fff0a0'], ['#f0e8ff', '#c0a0ff', '#ffe0ff'], ['#ffe8b0', '#ff9a40', '#ffffa0']],
    pre: ['聖', '曙光', '晨星', '天輝', '光冕', '白曜', '金輝', '神諭', '日輪', '聖歌', '虹光', '明鏡', '琉璃', '晴空', '祈光'], verb: ['聖光', '天光審判', '光柱', '虹彩', '聖歌'], sec: ['風', '幻', '火', '鋼', '水'] },
  暗: { n: 50, plans: [['demon', {}], ['reaper', {}], ['wraith', {}], ['spider', {}], ['eldritch', {}], ['dragon', {}], ['beast', { kind: 'wolf' }], ['bird', {}]],
    pal: [['#2a1a3a', '#8a3ad0', '#ff50a0'], ['#1a1018', '#a02020', '#ff4040'], ['#302048', '#6040a0', '#c080ff'], ['#201820', '#5a4a6a', '#60ffc0']],
    pre: ['夜', '影', '冥', '黑曜', '深淵', '暗月', '幽', '墨', '魘', '虛', '殘月', '鴉', '朔', '闇', '蝕'], verb: ['暗影爪', '深淵吞噬', '夜襲', '冥火', '蝕月'], sec: ['靈', '火', '鬥', '幻', '水'] },
  靈: { n: 50, plans: [['wraith', {}], ['reaper', {}], ['star', {}], ['jelly', {}], ['fox', {}], ['alien', {}], ['moth', {}]],
    pal: [['#c0a0ff', '#402060', '#a0ffe0'], ['#80a0e0', '#000000', '#c0f0ff'], ['#d0c0f0', '#6040a0', '#ffc0ff'], ['#60c0b0', '#203040', '#a0ffd0']],
    pre: ['魂', '幽光', '靈火', '鬼燈', '夢魂', '冥燈', '殘念', '遊魂', '星魂', '靈核', '燐火', '虛影', '魄', '冥蝶', '願靈'], verb: ['魂波', '鬼火', '幽冥衝擊', '靈縛', '附身'], sec: ['暗', '幻', '冰', '火', '光'] },
  幻: { n: 50, plans: [['fairy', {}], ['alien', {}], ['fox', {}], ['moth', {}], ['whale', {}], ['eldritch', {}], ['planet', {}], ['star', {}]],
    pal: [['#ff90d8', '#a060e0', '#ffe0ff'], ['#c0a0ff', '#6040c0', '#ffffff'], ['#ffb0e0', '#60c0ff', '#ffff80'], ['#a0d0ff', '#c050c0', '#ffc0ff']],
    pre: ['夢', '幻彩', '鏡花', '虹', '星夢', '迷霧', '萬花', '月影', '泡影', '幻月', '童話', '魔方', '琉光', '綺夢', '奇想'], verb: ['夢境波', '萬花鏡', '幻光', '迷夢', '奇蹟'], sec: ['光', '靈', '水', '風', '暗'] },
  鬥: { n: 50, plans: [['knight', {}], ['demon', {}], ['beast', { kind: 'lion', mane: 1 }], ['dino', {}], ['golem', {}], ['beast', { kind: 'wolf' }]],
    pal: [['#e8a070', '#7a2a20', '#ffd040'], ['#c06040', '#202030', '#ff8040'], ['#a08060', '#3a2a40', '#ffe080'], ['#d07050', '#f0e0c0', '#ffb040']],
    pre: ['拳', '鐵拳', '武', '霸', '豪', '猛', '剛', '烈拳', '武鬥', '戰', '破', '勇', '狂', '鬥魂', '威'], verb: ['百裂拳', '破山掌', '飛踢', '連環拳', '武神斬'], sec: ['鋼', '地', '火', '風', '暗'] },
};
const PLAN_NOUN = {
  dragon: ['龍'], long: ['蛟', '龍'], bird: ['鳥', '鷹', '鳳', '雀'], beast: { wolf: ['狼', '犬'], lion: ['獅', '虎'], horse: ['駒', '馬', '麟'] }, angel: ['天使', '聖使'], demon: ['魔', '鬼'], knight: ['騎士', '衛士', '武士'], reaper: ['使者', '冥使'],
  wraith: ['魂', '靈'], golem: ['像', '巨人'], scorpion: ['蠍'], spider: ['蛛'], moth: ['蛾', '蝶'], jelly: ['水母'], whale: ['鯨'], alien: ['星人'], mech: ['機兵', '機甲'], planet: ['星'], star: ['星靈'], crystal: ['晶獸'],
  fairy: ['仙', '精靈'], angler: ['魚'], turtle: ['龜'], eldritch: ['邪眼', '眼'], serpent: ['蛇'], mermaid: ['人魚'], kraken: ['章魚'], dino: ['龍', '暴龍'], fox: ['狐'],
};
const STAGE3_SUFFIX = ['王', '皇', '神', '帝', '尊', '霸主', '聖者', '之主'];
const TYPE_DESC = {
  木: '森林與花草孕育的', 火: '體內燃著烈焰的', 水: '在水中自在悠游的', 雷: '全身奔竄著電流的', 冰: '在極寒之地誕生的', 風: '乘著風自由飛翔的', 地: '與大地共生的',
  鋼: '擁有鋼鐵之軀的', 光: '散發神聖光輝的', 暗: '潛伏在黑暗中的', 靈: '徘徊在世間的', 幻: '游走在夢與現實之間的', 鬥: '為戰鬥而生的',
};

// ---------- 產生怪物 ----------
const EXP_FAMILIES = [];
(function buildExpansion() {
  const R = srand(20261108), pick = a => a[Math.floor(R() * a.length)];
  const usedNames = new Set(Object.values(MONS).map(m => m.n));
  let id = Math.max(...Object.keys(MONS).map(Number)) + 1;
  const firstId = id;
  const total = { 1: 330, 2: 450, 3: 570 };
  const queue = [];
  for (const t in EXP_TYPES) {
    let left = EXP_TYPES[t].n;
    while (left > 0) { const size = left >= 3 ? 3 : left; queue.push({ t, size }); left -= size; }
  }
  // 屬性交錯排列，讓每張地圖都有各種屬性
  queue.sort((a, b) => (strHash(a.t + EXP_FAMILIES.length) % 7) - (strHash(b.t) % 7));
  const byType = {}; for (const q of queue) (byType[q.t] = byType[q.t] || []).push(q);
  const order = []; for (let i = 0; order.length < queue.length; i++) for (const t in byType) if (byType[t][i]) order.push(byType[t][i]);
  for (const fam of order) {
    const T = EXP_TYPES[fam.t], [plan, opts0] = pick(T.plans), opts = Object.assign({}, opts0), pal = pick(T.pal);
    const types = R() < 0.55 ? [fam.t, pick(T.sec)] : [fam.t];
    if (plan === 'dragon' && R() < 0.3) opts.heads = 2 + Math.floor(R() * 2);
    if (plan === 'beast' && R() < 0.4) opts.pat = pick(['stripe', 'spot', 'scale', 'star']);
    if (plan === 'beast' && R() < 0.2) opts.horn = 1 + Math.floor(R() * 2);
    const a = tint(pal[0], (R() - 0.5) * 40), b = tint(pal[1], (R() - 0.5) * 30), c = pal[2];
    const nounList = plan === 'beast' ? PLAN_NOUN.beast[opts.kind || 'lion'] : PLAN_NOUN[plan];
    let base = '', tries = 0;
    do { base = pick(T.pre) + pick(nounList); tries++; } while ((usedNames.has(base) || usedNames.has('小' + base)) && tries < 60);
    const suf = pick(STAGE3_SUFFIX);
    const names = fam.size === 3 ? ['小' + base, base, base + suf] : fam.size === 2 ? [base, base + suf] : [base + suf];
    const stages = fam.size === 3 ? [1, 2, 3] : fam.size === 2 ? [2, 3] : [3];
    if (names.some(n => usedNames.has(n))) names.forEach((n, i) => names[i] = n + '·' + (id + i));
    names.forEach(n => usedNames.add(n));
    const role = pick(['atk', 'def', 'spd', 'hp', 'bal']), sig = pick(T.pre).slice(0, 2) + pick(T.verb);
    const ids = names.map((n, i) => {
      const me = id++, st = stages[i], [t1, t2] = types, M1 = TYPE_MOVES[t1], M2 = TYPE_MOVES[t2 || t1];
      MOVES['sig' + me] = { n: sig, t: t1, p: { 1: 80, 2: 100, 3: 120 }[st], a: 95, pp: 16, ult: st >= 3 ? 1 : 0, d: `${n}的招牌招式。` };
      MONS[me] = {
        n, t: types, b: ROLE_W[role].map(x => Math.round(total[st] * x)), cr: st === 3 ? 45 : st === 2 ? 90 : 170, xp: { 1: 90, 2: 160, 3: 240 }[st],
        h: (0.4 + st * 0.6 + R()).toFixed(1) + ' m', w: (4 + st * st * 12 + R() * 20).toFixed(1) + ' kg', hab: '',
        desc: `${TYPE_DESC[t1]}${nounList[0]}型幻靈。${['還是幼體，非常好奇。', '成長後實力大增。', '最終形態，是同族中最強的存在。'][st - 1]}`,
        art: Object.assign({ plan, a, b, c, s: st }, opts),
        learn: [[1, 'tackle'], [1, M1[0][0]], [8, M1[3][0]], [16, M2[0][0]], [24, M1[1][0]], [34, 'sig' + me], [44, M2[1][0]], [56, M1[2][0]], [68, M2[2][0]], [80, ULT[t1][0]]],
      };
      SPRITES[me] = (cx, tt) => drawPlan(cx, me, tt);
      return me;
    });
    EXP_FAMILIES.push({ t: fam.t, ids, stages });
  }
  window.EXP_RANGE = [firstId, id - 1];
})();

// ---------- 分配到各地圖的野外 ----------
(function placeExpansion() {
  const maps = Object.keys(MAPS).filter(id => MAPS[id].wild && MAPS[id].wild.length && id !== 'mickey')
    .map(id => ({ id, lv: Math.min(...MAPS[id].wild.map(w => w[1])) })).sort((a, b) => a.lv - b.lv);
  EXP_FAMILIES.forEach((f, i) => {
    const home = maps[Math.floor(i / EXP_FAMILIES.length * maps.length)], L = home.lv;
    const first = f.ids[0];
    MAPS[home.id].wild.push([first, L, L + 2, 12]);
    MONS[first].hab = MAPS[home.id].name;
    f.ids.forEach((id, k) => {
      if (f.ids[k + 1]) MONS[id].evo = { lv: Math.min(190, L + 8 + k * 10), to: f.ids[k + 1] };
      if (k > 0) {
        const later = maps[Math.min(maps.length - 1, maps.indexOf(home) + 3 * k)];
        MAPS[later.id].wild.push([id, Math.max(later.lv, L + 8 * k), Math.max(later.lv, L + 8 * k) + 3, 4]);
        if (!MONS[id].hab) MONS[id].hab = MAPS[later.id].name;
      }
    });
  });
})();

// ---------- 舊存檔換算與提示 ----------
const worldLayerV8 = worldLayer;
worldLayer = function () {
  if (S && !S.v8) migrateV8();
  return worldLayerV8();
};
TIPS.push('每張地圖都住著不同屬性的新幻靈，多走幾步草叢看看吧！', '傳說神獸的力量是一般幻靈的三倍，挑戰前記得做好準備。');
