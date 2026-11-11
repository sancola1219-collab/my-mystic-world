// ===== 異界篇：第 31~94 關（加上 6 場試煉＋前 30 關，共 100 座道館）、幻靈 No.333~432、目標導航、路人擴充 =====

// ---------- 新身體藍圖 ----------
Object.assign(PLANS, {
  // 人魚
  mermaid(c, t, o) {
    const skin = o.skin || '#fbe0cc', sway = Math.sin(t * 1.8), hair = o.hair || o.b;
    c.save(); c.translate(0, Math.sin(t * 2) * 1.5);
    const back = c.createLinearGradient(0, -36, 0, 8); back.addColorStop(0, sh(hair, 0.3)); back.addColorStop(1, sh(hair, -0.3));
    c.fillStyle = back; c.beginPath(); c.moveTo(-10, -28); c.bezierCurveTo(-22 + sway * 2, -14, -18 + sway * 3, 2, -24 + sway * 4, 10); c.quadraticCurveTo(0, 2, 24 + sway * 4, 10); c.bezierCurveTo(18 + sway * 3, 2, 22 + sway * 2, -14, 10, -28); c.closePath(); c.fill(); c.strokeStyle = 'rgba(20,10,30,0.7)'; c.lineWidth = 0.7; c.stroke();
    const tail = A.body(c, [[0, 4], [10, 20], [24, 30], [42, 24 + sway * 3]], u => 10 * (1 - u * 0.85) + 1, o.a);
    A.scales(c, tail, 'rgba(255,255,255,0.3)', 1, 3);
    c.fillStyle = o.c; c.strokeStyle = 'rgba(20,10,30,0.7)'; const ex = 42, ey = 24 + sway * 3;
    c.beginPath(); c.moveTo(ex, ey); c.quadraticCurveTo(ex + 16, ey - 20, ex + 22, ey - 12); c.quadraticCurveTo(ex + 12, ey, ex + 22, ey + 10); c.quadraticCurveTo(ex + 12, ey + 10, ex, ey); c.fill(); c.stroke();
    const g = c.createLinearGradient(-9, 0, 9, 0); g.addColorStop(0, '#fff0e4'); g.addColorStop(1, shade(skin, -0.12));
    c.fillStyle = g; c.beginPath(); c.moveTo(-7, -14); c.quadraticCurveTo(-5, -4, -8, 6); c.lineTo(8, 6); c.quadraticCurveTo(5, -4, 7, -14); c.closePath(); c.fill(); c.stroke();
    for (const d of [-1, 1]) G.ell(c, d * 3.6, -8, 3.8, 3, o.c, 'rgba(20,10,30,0.6)', 0.5);
    A.body(c, [[-7, -12], [-16, -6], [-20, -14]], [1.9, 1.2], skin); A.body(c, [[7, -12], [15, -4], [13, 6]], [1.9, 1.2], skin);
    faceHuman(c, 0, -22, 8, skin, hair, o.c);
    c.fillStyle = '#e8506c'; c.beginPath(); c.ellipse(0, -16.6, 1.4, 0.7, 0, 0, 7); c.fill();
    if (o.s >= 2) G.poly(c, [-5, -30, -6, -36, -2.6, -33, 0, -38, 2.6, -33, 6, -36, 5, -30], '#f4cc58', '#8a6010', 0.5);
    c.save(); c.shadowColor = o.c; c.shadowBlur = 10; G.circle(c, -22, -17, 4, sh(o.c, 0.5)); c.restore();
    c.restore();
  },
  // 巨型章魚
  kraken(c, t, o) {
    for (let i = 0; i < 8; i++) {
      const d = i < 4 ? -1 : 1, q = (i % 4) + 1, w = Math.sin(t * 2 + i) * 6;
      const tn = A.body(c, [[d * (8 + q * 2), 8], [d * (16 + q * 8), 22 - q * 3 + w], [d * (22 + q * 9), 36 - q * 10 - w], [d * (30 + q * 8), 28 - q * 16 + w]], [6.4, 0.6], i % 2 ? sh(o.a, -0.15) : o.a);
      for (let k = 2; k < tn.length; k += 3) G.circle(c, tn[k].x, tn[k].y, Math.max(0.6, tn.wf(tn[k].u) * 0.42), sh(o.b, 0.2), 'rgba(0,0,0,0.4)', 0.3);
    }
    const g = c.createRadialGradient(-8, -30, 4, 0, -16, 38); g.addColorStop(0, sh(o.a, 0.42)); g.addColorStop(1, sh(o.a, -0.5));
    c.beginPath(); c.moveTo(-24, 8); c.bezierCurveTo(-34, -30, -18, -52, 0, -52); c.bezierCurveTo(18, -52, 34, -30, 24, 8); c.quadraticCurveTo(0, 18, -24, 8); c.closePath(); c.fillStyle = g; c.fill(); c.strokeStyle = 'rgba(10,6,14,0.85)'; c.lineWidth = 1; c.stroke();
    for (const [x, y, r] of [[-13, -34, 3], [6, -40, 4], [14, -24, 2.6], [-6, -22, 2]]) G.circle(c, x, y, r, sh(o.a, -0.25));
    for (const d of [-1, 1]) A.eye(c, d * 10, -6, 4, o.c);
    c.save(); c.shadowColor = o.c; c.shadowBlur = 8; c.fillStyle = '#1a0a14'; c.beginPath(); c.ellipse(0, 8, 6, 3.4, 0, 0, 7); c.fill(); c.restore();
  },
  // 暴龍
  dino(c, t, o) {
    const br = Math.sin(t * 2) * 1, tw = Math.sin(t * 1.6) * 5, open = 5 + Math.sin(t * 2.4) * 2;
    const tl = A.body(c, [[12, -2], [32, 2], [54, -6 + tw * 0.5], [72, -16 + tw]], [13, 0.6], sh(o.a, -0.06));
    A.spines(c, tl, -1, 3, 6, o.b); A.scales(c, tl, 'rgba(0,0,0,0.3)', 2, 3);
    const far = A.body(c, [[6, 6], [12, 22], [4, 34], [6, 43]], legW(9, 3), sh(o.a, -0.42)); A.claws(c, 4, 42.5, -1, 2, '#e8e0d0');
    const body = A.body(c, [[-18, -14 + br], [0, -6], [18, 0]], roundW(u => 15 + Math.sin(u * 3.14) * 5), o.a);
    A.belly(c, body, 1, sh(o.b, 0.25)); A.scales(c, body, 'rgba(0,0,0,0.3)', 2, 4); A.spines(c, body, -1, 3, 8, o.b);
    if (o.pat === 'stripe') { c.strokeStyle = sh(o.a, -0.6); c.lineWidth = 2.4; for (let i = 3; i < body.length; i += 3) { const p = body[i], r = body.wf(p.u); c.beginPath(); c.moveTo(p.x - p.nx * r, p.y - p.ny * r); c.lineTo(p.x + 2, p.y); c.stroke(); } }
    const near = A.body(c, [[12, 4], [22, 20], [10, 33], [14, 43]], legW(12, 3.4), sh(o.a, -0.04)); A.scales(c, near, 'rgba(0,0,0,0.28)', 2, 3); A.claws(c, 12, 42.5, -1, 2.4, '#e8e0d0');
    A.body(c, [[-20, -6], [-30, 0], [-34, -6]], [3, 1.4], sh(o.a, -0.1));
    const nk = A.body(c, [[-16, -14], [-26, -28], [-34, -34]], [13, 9], o.a); A.spines(c, nk, -1, 3, 6, o.b);
    c.save(); c.translate(-38, -38);
    c.beginPath(); c.moveTo(10, 8); c.lineTo(-2, 8 + open * 0.3); c.lineTo(-30, 8 + open); c.quadraticCurveTo(-32, 13 + open, -26, 14 + open); c.lineTo(8, 16); c.closePath(); c.fillStyle = sh(o.a, -0.3); c.fill(); c.strokeStyle = 'rgba(10,6,14,0.85)'; c.lineWidth = 0.8; c.stroke();
    c.beginPath(); c.moveTo(8, 4); c.lineTo(-33, 2); c.lineTo(-30, 8 + open); c.lineTo(-2, 8 + open * 0.3); c.closePath(); c.fillStyle = '#4a0e18'; c.fill();
    for (let i = 0; i < 8; i++) { const x = -32 + i * 5; c.fillStyle = '#f4ecdc'; c.beginPath(); c.moveTo(x, 2); c.lineTo(x + 1.4, 7); c.lineTo(x + 2.8, 2); c.fill(); }
    for (let i = 0; i < 6; i++) { const x = -29 + i * 5, y = 8.6 + open * (1 - i * 0.14); c.fillStyle = '#f4ecdc'; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 1.2, y - 4.6); c.lineTo(x + 2.4, y); c.fill(); }
    const hg = c.createLinearGradient(0, -14, 0, 6); hg.addColorStop(0, sh(o.a, 0.35)); hg.addColorStop(1, sh(o.a, -0.25));
    c.beginPath(); c.moveTo(13, 5); c.quadraticCurveTo(14, -10, 2, -13); c.quadraticCurveTo(-10, -10, -20, -8); c.lineTo(-33, -5); c.quadraticCurveTo(-37, -1, -35, 3); c.lineTo(8, 5); c.closePath(); c.fillStyle = hg; c.fill(); c.strokeStyle = 'rgba(10,6,14,0.85)'; c.lineWidth = 0.9; c.stroke();
    A.eye(c, -5, -7, 2.6, o.c); c.fillStyle = '#1a0a10'; c.beginPath(); c.ellipse(-31, -2, 1.4, 0.9, 0, 0, 7); c.fill();
    c.restore();
  },
  // 多尾狐
  fox(c, t, o) {
    const n = o.tails || (o.s === 1 ? 1 : o.s === 2 ? 5 : 9);
    for (let i = 0; i < n; i++) {
      const a = -1.45 + (n === 1 ? 0.6 : i / (n - 1) * 1.5), L = 54 + (i % 3) * 5, w = Math.sin(t * 1.8 + i) * 3;
      const tl = A.body(c, [[20, 0], [20 + Math.cos(a) * L * 0.5, Math.sin(a) * L * 0.5 + 4 + w], [20 + Math.cos(a) * L, Math.sin(a) * L + w]], u => 8 * Math.sin(Math.PI * Math.min(1, u * 0.92 + 0.1)) + 0.6, o.a);
      const e = tl[tl.length - 1]; c.save(); c.shadowColor = o.c; c.shadowBlur = 7; G.ell(c, e.x, e.y, 3.6, 3.6, '#fff4e4'); c.restore();
    }
    for (const [hx, fx] of [[-14, -22], [14, 8]]) A.body(c, [[hx, 2], [hx - 2, 22], [fx, 34], [fx, 43]], legW(5.4, 2), sh(o.a, -0.4));
    const body = A.body(c, [[-22, -4], [-2, -6], [22, 0]], roundW(u => 11 + Math.sin(u * 3.14) * 3), o.a);
    A.belly(c, body, 1, '#fff4e4');
    for (const [hx, fx] of [[-18, -30], [18, 16]]) { A.body(c, [[hx, 4], [hx + 2, 22], [fx + 2, 34], [fx, 43]], legW(6.6, 2.2), sh(o.a, -0.04)); G.ell(c, fx, 42, 3.6, 2, sh(o.b, -0.2)); }
    A.body(c, [[-20, -8], [-30, -20], [-34, -26]], [9, 6], o.a);
    for (let i = 0; i < 6; i++) { const yy = -18 + i * 3; A.tube(c, [[-34 + i, yy], [-40 + i * 2, yy + 6]], [3, 0.3], '#fff4e4', 'rgba(0,0,0,0.3)', 0.3); }
    beastHead(c, -38, -30, 0.95, o, t, 'wolf');
    c.save(); c.shadowColor = o.c; c.shadowBlur = 8; G.star(c, -40, -38, 4, 3.2, 1, t, o.c); c.restore();
    if (o.s >= 2) for (let i = 0; i < 3; i++) { const a = t * 1.2 + i * 2.09; c.save(); c.shadowColor = o.c; c.shadowBlur = 12; G.circle(c, Math.cos(a) * 44, -30 + Math.sin(a) * 12, 3.4, sh(o.c, 0.4)); c.restore(); }
  },
});

// ---------- 怪物資料 ----------
// [身體, 屬性, 主色, 副色, 發光色, 設定, 名字三階, 招牌招式, 說明, 定位, 世界(0~7)]
const REALM_FAMILIES = [
  ['mermaid', ['水', '光'], '#40c0d0', '#f0a0c0', '#ffe0a0', {}, ['珊瑚人魚', '歌聲人魚', '海淵人魚后'], '人魚悲歌', '在海底宮殿歌唱的人魚。', 'hp', 0],
  ['kraken', ['水', '暗'], '#8a3a6a', '#f0b0c0', '#ffd040', {}, ['小章怪', '深海章魔', '克拉肯'], '八爪滅船', '能把大船拖進深海的巨大章魚。', 'atk', 0],
  ['serpent', ['水', '風'], '#2a80c0', '#d0f0ff', '#80f0ff', {}, ['浪花蛟', '蒼波蛟', '滄海蛟王'], '滄海龍捲', '在海嘯中誕生的蛟。', 'spd', 0],
  ['turtle', ['水', '地'], '#3a8a7a', '#e07060', '#ffc080', {}, ['珊瑚龜', '礁石龜', '蓬萊玄龜'], '蓬萊鎮海', '背著珊瑚礁的海龜。', 'def', 0],
  ['mech', ['鋼', '雷'], '#b0a050', '#404858', '#ffe040', {}, ['齒輪兵', '鋼鐵衛士', '泰坦機神'], '泰坦重擊', '機甲都市的巡邏兵。', 'def', 1],
  ['dragon', ['鋼', '火'], '#6a7488', '#c04020', '#ff8020', { horn: 3, horncol: '#c8d0e0' }, ['機械幼龍', '鋼翼機龍', '毀滅機械龍'], '毀滅光砲', '以鋼鐵與火焰打造的機械龍。', 'atk', 1],
  ['beast', ['鋼', '鬥'], '#7a8498', '#303848', '#60e0ff', { kind: 'wolf', pat: 'scale' }, ['鐵犬', '機械獵犬', '鋼牙狼神'], '鋼牙連擊', '永不疲倦的機械獵犬。', 'spd', 1],
  ['spider', ['鋼', '暗'], '#505868', '#303848', '#ff5040', {}, ['鉗蛛機', '電纜蛛', '蛛型要塞'], '電纜絞殺', '在管線間爬行的機械蛛。', 'atk', 1],
  ['moth', ['幻', '光'], '#d0b0ff', '#80c0ff', '#ffe0ff', {}, ['夢粉蛾', '月影蛾', '夢境神蛾'], '夢粉飛舞', '鱗粉能讓人陷入美夢。', 'spd', 2],
  ['whale', ['幻', '靈'], '#7050b0', '#e0c0ff', '#ffd0ff', {}, ['夢遊幼鯨', '夢海鯨', '千夢鯨王'], '千夢鯨歌', '在夢與夢之間洄游的巨鯨。', 'hp', 2],
  ['fairy', ['幻', '木'], '#c0f0b0', '#ff90c0', '#ffffa0', {}, ['夢芽仙', '夢花仙', '夢境仙后'], '夢花綻放', '守護美夢的仙子。', 'bal', 2],
  ['wraith', ['幻', '暗'], '#403070', '#000000', '#ff60a0', {}, ['惡夢影', '夢魘獸', '夢魘之主'], '永眠夢魘', '吃掉美夢的黑影。', 'atk', 2],
  ['dino', ['地', '鬥'], '#7a8a40', '#c06030', '#ffd040', { pat: 'stripe' }, ['幼暴龍', '暴牙龍', '霸王暴龍'], '暴龍撕咬', '遠古大地的霸主。', 'atk', 3],
  ['dino', ['風', '地'], '#a07840', '#407040', '#80ff60', {}, ['迅爪龍', '獵影龍', '疾風迅猛龍'], '迅猛連爪', '成群狩獵的敏捷恐龍。', 'spd', 3],
  ['bird', ['風', '地'], '#a06840', '#e0c080', '#ffb040', {}, ['翼手雛', '風翼龍', '蒼穹翼龍'], '蒼穹俯衝', '翱翔在遠古天空的翼龍。', 'spd', 3],
  ['turtle', ['地', '鋼'], '#6a5a40', '#8a8060', '#ffc060', {}, ['甲殼幼龍', '岩甲龍', '不破甲龍'], '不破鐵甲', '全身覆蓋岩甲的恐龍。', 'def', 3],
  ['fox', ['幻', '火'], '#f0a040', '#c05020', '#ff6040', {}, ['一尾狐', '五尾狐', '九尾妖狐'], '狐火九連', '尾巴越多，妖力越強。', 'spd', 4],
  ['demon', ['風', '暗'], '#c03030', '#201820', '#ffd040', {}, ['鴉天狗', '大天狗', '天狗王'], '天狗神風', '住在深山裡的高傲妖怪。', 'atk', 4],
  ['reaper', ['靈', '暗'], '#f0e8e0', '#000000', '#ff3060', {}, ['怨面', '般若', '鬼母般若'], '般若怨念', '嫉妒化成的女鬼。', 'atk', 4],
  ['star', ['靈', '火'], '#60a0ff', '#2040c0', '#102040', {}, ['鬼火丸', '青行燈', '百鬼燈主'], '百鬼燈火', '夜路上飄動的青色鬼火。', 'spd', 4],
  ['angel', ['光', '雷'], '#e8f0ff', '#c0d0f0', '#ffe040', { weapon: 'sword' }, ['見習戰姬', '神殿戰姬', '女武神'], '戰姬審判', '從戰場帶走英靈的戰姬。', 'atk', 5],
  ['beast', ['光', '火'], '#f0c870', '#b06020', '#fff080', { kind: 'lion', mane: 1 }, ['幼神獅', '聖山獅', '涅墨亞神獅'], '不壞神爪', '刀槍不入的神獅。', 'def', 5],
  ['bird', ['風', '光'], '#d0c0a0', '#ffe0a0', '#ffd040', {}, ['聖鷹雛', '神殿鷹', '天帝神鷹'], '天帝雷羽', '替天帝傳遞雷霆的神鷹。', 'spd', 5],
  ['knight', ['鋼', '光'], '#d0a040', '#a02020', '#ffe080', {}, ['神殿步兵', '神盾戰士', '不敗英雄'], '神盾衝鋒', '手持神盾的英雄。', 'def', 5],
  ['golem', ['鋼', '幻'], '#8a7a60', '#403020', '#80f0ff', {}, ['時之守衛', '歷史石像', '永恆守望者'], '時光重拳', '看守時間盡頭的石像。', 'def', 6],
  ['alien', ['幻', '鋼'], '#a0c0d0', '#304050', '#80ffff', {}, ['時空旅人', '時間管理員', '萬世觀測者'], '時空裂隙', '在時間線之間旅行的來客。', 'spd', 6],
  ['eldritch', ['暗', '幻'], '#201030', '#100818', '#c040ff', {}, ['混沌之瞳', '混沌之眼', '萬象邪眼'], '混沌凝視', '從世界開始之前就存在的眼睛。', 'atk', 7],
  ['dragon', ['暗', '鬥'], '#180c14', '#c02020', '#ff3030', { horn: 3, horncol: '#a0a0a0' }, ['末日幼龍', '滅世黑龍', '終焉暴龍'], '終焉龍吼', '預告世界末日的黑龍。', 'atk', 7],
];
const REALM_LEGENDS = [
  ['long', ['水', '光'], '#3080d0', '#f0e0a0', '#ffe080', { horncol: '#fff0b0' }, '東海龍王', '龍王降雨', '統治四海的龍王。', 'hp', 34],
  ['whale', ['水', '暗'], '#102040', '#6080a0', '#60ffe0', {}, '利維坦', '深淵巨浪', '翻身就能掀起滅世海嘯的海怪。', 'hp', 38],
  ['mech', ['鋼', '光'], '#e0e4f0', '#2050c0', '#60f0ff', {}, '歐米茄機神', '歐米茄主砲', '機甲都市的終極兵器。', 'atk', 42],
  ['dragon', ['鋼', '雷'], '#a0a8c0', '#2040a0', '#ffe040', { heads: 3, horncol: '#ffffff' }, '三首機龍皇', '三重電漿砲', '三個頭部各裝著主砲的機械龍皇。', 'atk', 46],
  ['beast', ['幻', '靈'], '#e0d0f0', '#8060c0', '#ffc0ff', { kind: 'horse', pat: 'star', horn: 1 }, '夢貘', '吞夢', '以夢為食的神獸。', 'bal', 50],
  ['fairy', ['幻', '光'], '#ffd0f0', '#a080ff', '#ffffff', {}, '夢境女王', '永恆美夢', '夢境迴廊的統治者。', 'spd', 54],
  ['dino', ['地', '火'], '#6a2010', '#ff8020', '#ffc040', { pat: 'stripe' }, '霸王龍皇', '遠古霸吼', '讓整片大陸顫抖的恐龍之王。', 'atk', 58],
  ['golem', ['木', '地'], '#5a7a3a', '#3a2a1a', '#a0ff60', {}, '世界樹靈', '世界樹根', '遠古森林的意志。', 'def', 62],
  ['fox', ['幻', '光'], '#fff8e8', '#ffc0a0', '#ffe060', { tails: 9 }, '九尾天狐', '天狐幻月', '修成仙的九尾白狐。', 'spd', 66],
  ['demon', ['火', '靈'], '#a02020', '#201010', '#ffd040', { horncol: '#ffe0a0' }, '酒吞童子', '鬼王酒宴', '百鬼之首的大妖怪。', 'atk', 70],
  ['angel', ['雷', '光'], '#fff0c0', '#ffffff', '#ffe040', { weapon: 'sword' }, '奧林帕斯天帝', '神王雷霆', '聖山之巔手握雷霆的天帝。', 'atk', 74],
  ['reaper', ['暗', '靈'], '#101018', '#000000', '#60a0ff', {}, '冥界之王', '冥府審判', '掌管亡者的冥王。', 'def', 78],
  ['dragon', ['幻', '鋼'], '#50a0c0', '#e0f0ff', '#a0ffff', { horn: 3, horncol: '#ffffff' }, '時空龍', '時空崩壞', '在時間盡頭盤旋的巨龍。', 'spd', 82],
  ['mech', ['鋼', '幻'], '#c8a050', '#403020', '#ffffff', {}, '永恆鐘主', '永恆停滯', '讓一切停止的巨大機關神。', 'def', 86],
  ['dragon', ['暗', '幻'], '#100818', '#6020c0', '#ff40ff', { heads: 3 }, '虛空巨龍', '虛無三重奏', '混沌裡誕生的三首巨龍。', 'atk', 90],
  ['eldritch', ['暗', '光'], '#000000', '#201030', '#ffffff', {}, '混沌之主', '萬物歸零', '一切的起點，也是一切的終點。', 'atk', 94],
];

const REALM_ROSTER = [[], [], [], [], [], [], [], []], REALM_LEGEND = {};
(function addRealmMons() {
  let id = 333;
  const total = { 1: 340, 2: 460, 3: 580, 4: 720 };
  const add = (name, types, stage, role, sig, desc, art) => {
    const me = id++, [t1, t2] = types, M1 = TYPE_MOVES[t1], M2 = TYPE_MOVES[t2 || t1];
    MOVES['sig' + me] = { n: sig, t: t1, p: { 1: 90, 2: 110, 3: 130, 4: 150 }[stage], a: 95, pp: 16, ult: stage >= 3 ? 1 : 0, d: `${name}的招牌招式。` };
    MONS[me] = {
      n: name, t: types, b: ROLE_W[role].map(x => Math.round(total[stage] * x)), cr: stage === 4 ? 12 : stage === 3 ? 45 : stage === 2 ? 90 : 170, xp: { 1: 120, 2: 200, 3: 280, 4: 360 }[stage],
      h: (0.8 + stage * 0.8).toFixed(1) + ' m', w: (10 + stage * stage * 16).toFixed(1) + ' kg', hab: '', desc, big: stage === 4, art,
      learn: [[1, M1[0][0]], [30, M1[3][0]], [50, M2[0][0]], [60, M1[1][0]], [70, M2[1][0]], [80, 'sig' + me], [90, M1[2][0]], [100, M2[2][0]], [110, ULT[t1][0]]],
    };
    SPRITES[me] = (c, t) => drawPlan(c, me, t);
    return me;
  };
  for (const [plan, types, a, b, c, opts, names, sig, desc, role, w] of REALM_FAMILIES) {
    const ids = names.map((n, i) => add(n, types, i + 1, role, sig, desc + ['幼體。', '成長後力量大增。', '最終形態，異界最強的一員。'][i], Object.assign({ plan, a, b, c, s: i + 1 }, opts)));
    const L = 98 + w * 8;
    MONS[ids[0]].evo = { lv: L + 5, to: ids[1] }; MONS[ids[1]].evo = { lv: L + 11, to: ids[2] };
    ids.forEach((q, i) => REALM_ROSTER[w].push([q, i + 1]));
  }
  for (const [plan, types, a, b, c, opts, name, sig, desc, role, k] of REALM_LEGENDS) REALM_LEGEND[k] = add(name, types, 4, role, sig, desc, Object.assign({ plan, a, b, c, s: 4, final: k === 94 }, opts));
  MONS[REALM_LEGEND[94]].b = MONS[REALM_LEGEND[94]].b.map(v => Math.round(v * 1.2));
  if (id !== 433) console.error('幻靈數量不對', id - 1);
})();

// ---------- 異界關卡資料 ----------
// [世界名, 地面, 小路, 屋頂, 草, 草亮, 液體, 液1, 液2, 障礙物, 天1, 天2, 丘1, 丘2, 地1, 地2, 背景, 天氣, 光色, 光強, 音樂]
const REALMS = [
  ['龍宮海境', '#d8c8a0', '#a0e0e0', '#c04060', '#208080', '#60f0d0', 'water', '#2a80d0', '#104890', 'crystal', '#0a3060', '#40a0d0', '#2a70a0', '#104870', '#c8c0a0', '#6a8080', 'space', 'abyss', '0,40,90', 0.26, 'mystery'],
  ['機甲都市', '#606878', '#909aa8', '#c07020', '#404858', '#60e0ff', 'void', '#101828', '#1a2840', 'pillar', '#101420', '#405070', '#505868', '#2a3040', '#606878', '#2a3040', 'space', 'storm', '10,20,40', 0.3, 'volcano'],
  ['夢境迴廊', '#d8c0f0', '#fff0ff', '#a060e0', '#c080e0', '#ffc0ff', 'cloud', '#c8a0f0', '#e8d0ff', 'mirror', '#6040a0', '#ffc0e0', '#c0a0e0', '#9070c0', '#e0c8f0', '#a080c0', 'heaven', 'sky', '120,60,160', 0.14, 'night'],
  ['遠古恐龍紀', '#90a050', '#c0a870', '#7a5030', '#3a7a30', '#a0e060', 'lava', '#ff7010', '#c03008', 'rock', '#e08040', '#ffe0a0', '#6a8a40', '#3a5a2a', '#90a050', '#505a2a', 'heaven', 'green', '60,30,0', 0.16, 'route'],
  ['百鬼夜行', '#3a3048', '#6a5a70', '#a02030', '#2a2038', '#a060c0', 'blood', '#6a1040', '#300820', 'tomb', '#0a0818', '#403060', '#2a2040', '#140c20', '#302838', '#100c18', 'hell', 'abyss', '20,0,50', 0.45, 'dark'],
  ['奧林帕斯神域', '#f4ecd8', '#ffe8b0', '#e0a030', '#d8c070', '#fff0a0', 'cloud', '#a0d0ff', '#d0ecff', 'pillar', '#4090e0', '#fff4d0', '#f0e8d8', '#c8c0b0', '#f4e8cc', '#c8b888', 'heaven', 'sky', '255,240,190', 0.1, 'sky'],
  ['時間盡頭', '#8a8498', '#b0a8c0', '#506080', '#605878', '#a0f0ff', 'void', '#100c20', '#201838', 'crystal', '#08081a', '#50508a', '#706880', '#403c58', '#7a7490', '#3a3650', 'hole', 'abyss', '20,20,60', 0.34, 'space'],
  ['混沌原點', '#181018', '#402038', '#801040', '#301028', '#ff40a0', 'void', '#000000', '#180820', 'spike', '#000000', '#400830', '#180c18', '#080408', '#181018', '#040204', 'hole', 'lava', '40,0,30', 0.55, 'hell'],
];
const REALM_PLACES = [
  ['白砂海岸|潮音', '珊瑚迴廊|珊瑚', '水晶海溝|水晶', '沉船墓場|沉船', '人魚宮殿|人魚', '深海火山|海炎', '龍宮外城|龍門', '東海龍宮|龍宮'],
  ['鋼鐵車站|車站', '齒輪廣場|齒輪', '霓虹大街|霓虹', '地下管線|管線', '發電中樞|電樞', '兵工巨廠|兵工', '空中軌道|軌道', '中央主腦|主腦'],
  ['入夢之門|入夢', '糖果小鎮|糖果', '顛倒花園|顛倒', '無盡樓梯|樓梯', '鏡中街道|鏡街', '童年教室|童年', '惡夢森林|惡夢', '夢境王座|夢境'],
  ['蕨類平原|蕨原', '巨蛋巢穴|巨蛋', '翼龍斷崖|翼龍', '焦油沼澤|焦油', '獵影叢林|獵影', '熔岩河谷|熔谷', '隕石坑|隕石', '霸王高地|霸王'],
  ['朱紅鳥居|鳥居', '提燈小徑|提燈', '狐狸神社|狐社', '天狗山道|天狗', '雪女冰室|雪女', '河童水塘|河童', '百鬼大街|百鬼', '鬼王御殿|鬼王'],
  ['聖山山腳|山腳', '英雄競技場|競技', '智慧神殿|智慧', '海神聖所|海神', '戰神廣場|戰神', '太陽馬車道|日車', '冥河入口|冥河', '天帝王座|天帝'],
  ['破碎鐘塔|鐘塔', '倒流河川|倒流', '昨日之城|昨日', '明日廢墟|明日', '恐龍幻影|幻影', '無聲車站|無聲', '萬年沙漏|沙漏', '時間盡頭|盡頭'],
  ['混沌邊界|邊界', '虛無荒原|虛無', '倒懸山脈|倒懸', '無色之海|無色', '崩解都市|崩解', '起源之塔|起源', '萬象熔爐|熔爐', '混沌原點|原點'],
];
const REALM_LEADERS = [
  ['浪女 汐', '珊瑚使 瑚', '海溝客 淵', '沉船長 黑帆', '人魚姬 泠', '炎海師 燄', '龜丞相', '龍太子 敖'],
  ['站長 軌', '工頭 輪', '駭客 霓', '管線工 阿線', '電樞長 伏特', '廠長 鋼', '飛軌駕駛 風', '主腦 歐米'],
  ['引路人 眠', '糖果師 蜜', '瘋帽客', '階梯少女 階', '鏡中人 影', '老師 童', '夢獵人 魘', '夢境守衛 寐'],
  ['採集者 蕨', '守巢人 卵', '馴龍者 翼', '沼地獵人 泥', '叢林獵手 影爪', '火山祭司 熔', '星象師 隕', '獸王 霸'],
  ['巫女 緋', '提燈人 燈', '狐神官 玉藻', '山伏 嵐', '雪女 冰華', '河童 阿皿', '百鬼夜行頭 百', '御殿總管 羅'],
  ['牧羊人 潘', '競技冠軍 泰勒', '智者 墨媞', '海祭司 汀', '戰士 阿瑞', '御者 赫利', '渡魂人 卡倫', '神使 赫密'],
  ['鐘塔守 刻', '逆流者 溯', '昨日的你', '明日的你', '幻影獵人 紀', '站長 寂', '沙漏師 砂', '守時者 永'],
  ['邊界騎士 界', '虛無使 無', '倒懸師 懸', '渡海人 色', '崩解者 潰', '起源祭司 始', '鑄造者 爐', '混沌使徒 終'],
];
const REALM_SCENES = [
  ['幻紋始祖', ['靈契師，三界雖然得救，世界之外卻傳來了呼喚。', '天穹西門通往「異界」：八個互不相連的世界，六十四座道館。', '所有裂痕的源頭，都指向最深處的「混沌原點」。', '第一站，是海底的龍宮。']],
  ['小嵐', ['這座城市竟然全是機器！', '聽說這裡的主腦能計算所有戰鬥結果。', '那我們就打出它算不到的結果吧！']],
  ['星垣博士', ['（靈符傳來聲音）你現在在誰的夢裡？', '這裡的規則跟現實不一樣，別被美夢困住了！']],
  ['厄蘭', ['這裡是時間還沒開始前的大地。', '小哭好像不怕恐龍呢，真奇怪。', '我會在後面幫你看著，前進吧。']],
  ['巫女 緋', ['今夜是百鬼夜行。', '人類不該在這個時候走在路上……', '不過你身上的氣息，連鬼都會讓路吧。']],
  ['神使 赫密', ['凡人竟然走上了聖山！', '天帝有令：能打倒八位試煉者的人，才可以見祂。']],
  ['守時者 永', ['這裡是時間的盡頭。', '你會在這裡遇見昨天的自己，也會遇見明天的自己。', '請不要害怕。']],
  ['幻紋始祖', ['這裡就是一切的起點。', '混沌之主就在最深處。', '靈契師，我把所有的光都交給你了。']],
];
const REALM_INTRO = [['終於等到像樣的挑戰者了。', '讓我看看你走到這裡靠的是實力還是運氣。'], ['這座道館，還沒有人能完整走出去。', '你要當第一個嗎？'], ['不必多說，出招吧！'], ['我的隊伍已經等不及了。', '可別讓牠們失望。']];
const REALM_WIN = [['……我輸了，你配得上這枚印記。'], ['好強……前面的路就交給你了。'], ['這就是打倒三界之敵的力量嗎？'], ['痛快！再往前走吧，靈契師！']];

const REALM_OF = k => REALMS[Math.floor((k - 31) / 8)][0];
for (const r of REALMS) STAGE_NAMES[r[0]] = { 龍宮海境: ['海兵', '蝦兵', '蟹將'], 機甲都市: ['工程師', '機師', '賽博浪人'], 夢境迴廊: ['夢遊者', '睡美人', '小丑'], 遠古恐龍紀: ['原始獵人', '馴龍少年', '部族戰士'], 百鬼夜行: ['浪人', '陰陽師', '狸貓'], 奧林帕斯神域: ['神殿衛兵', '英雄學徒', '祭司'], 時間盡頭: ['旅人', '鐘錶匠', '迷路的人'], 混沌原點: ['混沌信徒', '虛無騎士', '黑影'] }[r[0]];
Object.assign(STAGE_LOOK, {
  龍宮海境: { hair: '#208080', shirt: '#40a0c0', pants: '#104870' }, 機甲都市: { hair: '#303848', shirt: '#808a98', pants: '#404858', hat: '#c07020' },
  夢境迴廊: { hair: '#c080e0', shirt: '#ffc0e0', pants: '#a060c0' }, 遠古恐龍紀: { hair: '#5a3a20', shirt: '#a07840', pants: '#604020' },
  百鬼夜行: { hair: '#101018', shirt: '#a02030', pants: '#201820' }, 奧林帕斯神域: { hair: '#e0c060', shirt: '#fff8e8', pants: '#c8a050', robe: '#f4ecd8' },
  時間盡頭: { hair: '#a0a0c0', shirt: '#506080', pants: '#303850' }, 混沌原點: { hair: '#100810', shirt: '#301028', pants: '#100810', robe: '#400830' },
});

function stageBaseLevel(k) { return k <= 6 ? 58 + k * 2 : k <= 18 ? 70 + (k - 6) * 2 : k <= 30 ? 70 + (k - 18) * 2 : 94 + (k - 30); }
function genBigRows(k, R) {
  const w = 40, h = 30, g = Array.from({ length: h }, () => new Array(w).fill('.'));
  for (let x = 0; x < w; x++) { g[0][x] = 'T'; g[h - 1][x] = 'T'; }
  for (let y = 0; y < h; y++) { g[y][0] = 'T'; g[y][w - 1] = 'T'; }
  const rect = (x0, y0, x1, y1, ch) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (g[y][x] === '.') g[y][x] = ch; };
  const pat = k % 3;
  if (pat === 0) rect(1, 13, 38, 14, '~');
  if (pat === 1) { rect(3, 12, 14, 15, '~'); rect(25, 12, 36, 15, '~'); }
  if (pat === 2) rect(8, 12, 31, 15, '~');
  rect(2, 17, 12, 21, ','); rect(27, 17, 37, 21, ','); rect(2, 23, 8, 26, ','); rect(31, 23, 37, 26, ','); rect(13, 23, 17, 26, ','); rect(22, 23, 26, 26, ','); rect(2, 9, 8, 10, ','); rect(31, 9, 37, 10, ',');
  for (let i = 0; i < 34; i++) { const x = 1 + Math.floor(R() * 38), y = 9 + Math.floor(R() * 19); if (g[y][x] === '.' && Math.abs(x - 19.5) > 3 && y !== 22) g[y][x] = 'T'; }
  for (let i = 0; i < 8; i++) { const x = 13 + Math.floor(R() * 14), y = 1 + Math.floor(R() * 2); if (g[y][x] === '.' && Math.abs(x - 19.5) > 2) g[y][x] = 'T'; }
  for (let x = 3; x <= 36; x++) if (g[22][x] !== '~') g[22][x] = '=';
  for (let y = 0; y < h; y++) for (const x of [19, 20]) g[y][x] = g[y][x] === '~' ? 'b' : '=';
  const flip = k % 2 === 0, cx = flip ? 28 : 7, gx = flip ? 6 : 26;
  for (let y = 3; y <= 5; y++) for (let x = cx; x < cx + 4; x++) g[y][x] = 'H';
  for (let y = 2; y <= 5; y++) for (let x = gx; x < gx + 7; x++) g[y][x] = 'H';
  const cd = cx + 1, gd = gx + 3;
  g[5][cd] = 'D'; g[5][gd] = 'D';
  for (let y = 6; y <= 8; y++) { g[y][cd] = '='; g[y][gd] = '='; }
  for (let x = Math.min(cd, gd); x <= Math.max(cd, gd); x++) g[8][x] = '=';
  return { rows: g.map(r => r.join('')), cd, gd };
}
function tint(hex, k) { const n = parseInt(hex.slice(1), 16); const f = v => Math.max(0, Math.min(255, Math.round(v + k))).toString(16).padStart(2, '0'); return '#' + f(n >> 16) + f((n >> 8) & 255) + f(n & 255); }

const REALM_MAPS = [];
for (let k = 31; k <= 94; k++) {
  const wi = Math.floor((k - 31) / 8), si = (k - 31) % 8, r = REALMS[wi], rn = r[0], [place, short] = REALM_PLACES[wi][si].split('|'), id = 's' + k, gym = short + '道館', badge = short + '印', leader = REALM_LEADERS[wi][si];
  const shift = (si - 3.5) * 5;
  THEME['t' + k] = { g: tint(r[1], shift), g2: tint(r[1], shift), path: r[2], tree: r[3], tree2: r[4], gc: r[4], gh: r[5], water: r[8], liq: r[6], d1: r[7], d2: r[8], obst: r[9], wx: r[17], noTufts: true };
  LIGHT['t' + k] = [r[18], r[19]];
  BBG['t' + k] = { sky: [r[10], r[11]], hill: [r[12], r[13]], ground: [r[14], r[15]], plat: [tint(r[14], 20), r[15]], tuft: null, kind: r[16] };
  const { rows, cd, gd } = genBigRows(k, srand(k * 6113 + 7));
  const m = { name: `${rn}・${place}`, theme: 't' + k, rows, world: rn, stage: k, exits: [], doors: {}, signs: {}, triggers: [], npcs: [], w: 40, h: 30, big: true, roofAt: {} };
  m.doors[cd + ',5'] = { roof: '#e0a030', label: '祈光亭・補給站', run: () => centerDoor(true) };
  m.doors[gd + ',5'] = { roof: r[3], label: gym, run: () => stageGym(k) };
  m.gymDoor = [gd, 5];
  const L = stageBaseLevel(k), pool = REALM_ROSTER[wi], low = pool.filter(q => q[1] === 1), mid = pool.filter(q => q[1] === 2), hi = pool.filter(q => q[1] === 3);
  const rot = (a, n) => Array.from({ length: Math.min(n, a.length) }, (_, j) => a[(j + k) % a.length]);
  m.wild = [...rot(low, 4).map(q => [q[0], L - 2, L + 1, 24]), ...rot(mid, 3).map(q => [q[0], L, L + 3, 10]), ...rot(hi, 2).map(q => [q[0], L + 3, L + 5, 3])];
  const lg = REALM_LEGEND[k];
  if (lg && k !== 94) m.npcs.push({ id: 'legend', x: 36, y: 11, dir: 'down', legend: lg, name: MONS[lg].n, cond: () => !flag('legend' + lg), talk: () => legendBattle(lg, L + 8, `異界的空氣震動著……傳說神獸「${MONS[lg].n}」現身了！`) });
  if (k === 94) m.npcs.push({ id: 'final', x: 20, y: 1, dir: 'down', legend: lg, name: MONS[lg].n, cond: () => flag('stage94') && !flag('legend' + lg), talk: () => chaosBoss(lg, L + 14) });
  const prev = k === 31 ? ['s6', 1, 9] : ['s' + (k - 1), 19, 1];
  m.exits.push({ x: 19, y: 29, w: 2, h: 1, to: prev[0], tx: prev[1], ty: prev[2] });
  if (k < 94) {
    m.exits.push({ x: 19, y: 0, w: 2, h: 1, to: 's' + (k + 1), tx: 19, ty: 28 });
    m.triggers.push({ x: 19, y: 1, w: 2, h: 1, run: async () => { if (!flag('stage' + k)) { await say(`一道屏障擋住了去路。先打倒「${gym}」的館主吧！`); stepBack(); } } });
  }
  MAPS[id] = m;
  CHAPTERS[id] = [100 + k, `${rn}・${place}`];
  MAP_SONG[id] = r[20];
  REALM_MAPS.push(id);
  m.scene = si === 0 ? REALM_SCENES[wi] : null;
  m.gym = gym; m.leader = leader; m.badge = badge; m.intro = REALM_INTRO[k % 4]; m.win = REALM_WIN[k % 4]; m.L = L;
}
REALM_ROSTER.forEach((pool, w) => { for (const q of pool) if (!MONS[q[0]].hab) MONS[q[0]].hab = REALMS[w][0]; });
for (const k in REALM_LEGEND) MONS[REALM_LEGEND[k]].hab = MAPS['s' + k].name;

// 天穹之頂的第三道門：西門
{ const m = MAPS.s6; m.rows[9] = '==' + m.rows[9].slice(2); m.exits.push({ x: 0, y: 9, w: 1, h: 1, to: 's31', tx: 19, ty: 28 }); m.triggers.push({ x: 1, y: 9, w: 1, h: 1, run: async () => { if (!flag('trueEnd')) { await say('西門上寫著：「打倒噬星者與冥淵魔王的人，方可通過。」'); stepBack(); } } }); }

// ---------- 道館全面變強 ----------
function stagePool(k) {
  if (k > 30) return REALM_ROSTER[Math.floor((k - 31) / 8)];
  const lo = k <= 6 ? 1 : k <= 18 ? 7 : 19, hi = k <= 6 ? 6 : k <= 18 ? 18 : 30, out = [];
  for (const d of [0, -1, 1, -2, 2]) { const q = k + d; if (q >= lo && q <= hi && FAMILY_ROSTER[q]) out.push(...FAMILY_ROSTER[q]); if (out.length >= 15) break; }
  return out;
}
function stageTeam(k) {
  const L = stageBaseLevel(k), pool = stagePool(k), best = pool.filter(q => q[1] >= 2).sort((a, b) => b[1] - a[1]);
  const team = Array.from({ length: 5 }, (_, j) => [best[(j + k) % best.length][0], L + 8 + j]);
  const ace = FAMILY_ROSTER.L[k] || REALM_LEGEND[k] || REALM_LEGEND[k + (k % 4 ? 4 - k % 4 : 0)];
  team.push([ace || best[0][0], L + 14]);
  return team;
}
function gymPower(name) { return /試煉者/.test(name) ? 1.3 : 1; }
const trainerBattleBase = trainerBattle;
trainerBattle = async function (tr) {
  const p = gymPower(tr.name);
  if (p === 1) return trainerBattleBase(tr);
  // 試煉者：等級更高、隊伍補滿、能力值強化
  const list = tr.team.map(([id, lv]) => [id, lv + 4]);
  // 隊伍補滿 6 隻：找同屬性、不重複的幻靈
  const used = new Set(list.map(q => q[0])), seed = strHash(tr.name) >>> 0;
  for (let i = 0; list.length < 6 && i < 12; i++) {
    const q = list[i % tr.team.length], pool = Object.keys(MONS).map(Number).filter(id => !used.has(id) && (id < 1104 || id >= 1300) && !MONS[id].big && MONS[id].t.some(t => MONS[q[0]].t.includes(t)));
    if (!pool.length) continue;
    const id = pool[(seed + i * 37) % pool.length]; used.add(id); list.unshift([id, Math.max(2, q[1] - 2)]);
  }
  const team = list.map(([id, lv]) => { const m = makeMon(id, lv); m.atk = Math.round(m.atk * p); m.def = Math.round(m.def * p); m.spd = Math.round(m.spd * 1.15); m.maxHp = m.hp = Math.round(m.maxHp * 1.25); return m; });
  return runBattle({ trainer: tr, foeTeam: team });
};

// ---------- 最終頭目 ----------
async function chaosBoss(id, lv) {
  await say(['世界還沒有形狀之前，牠就在這裡了。', '「……終於有東西走到我面前了。」'], { name: '混沌之主' });
  const c = await choose(['挑戰！', '先準備一下'], { title: `要挑戰 ${MONS[id].n} 嗎？`, w: 320, x: W / 2 - 160, y: 300 });
  if (c !== 0) return;
  const r = await wildBattle(makeMon(id, lv), { boss: true });
  if (r !== 'win' && r !== 'caught') return;
  if (r === 'caught') setFlag('legend' + id);
  if (flag('realmEnd')) return;
  setFlag('realmEnd'); S.money += 300000;
  await fadeOut(600); fade = 0;
  await chapterCard('百館制霸', '混沌歸於平靜，所有世界都重新連在一起。');
  await fadeIn(300);
  await say(['你走過了一百座道館。', '從晨曦村的小路，到世界開始之前的地方。', '幻紋始祖、小嵐、厄蘭、小哭，還有所有夥伴都在等你回家。', `${S.name}，你是這個世界永遠的傳說。`, '（獲得了 $300000！圖鑑還沒收集完的話，繼續冒險吧！）']);
  saveGame(true);
}

// ---------- 目標導航 ----------
function nextStage() {
  if (!flag('finalEnd')) return null;
  for (let k = 1; k <= 30; k++) if (!flag('stage' + k)) return k;
  if (!flag('endSpace')) return 'space';
  if (!flag('endHell')) return 'hell';
  for (let k = 31; k <= 94; k++) if (!flag('stage' + k)) return k;
  if (!flag('realmEnd')) return 'chaos';
  return null;
}
function navTarget() {
  const k = nextStage();
  if (k == null) return null;
  if (k === 'space') return { map: 's18', x: 12, y: 1, label: '噬星者' };
  if (k === 'hell') return { map: 's30', x: 12, y: 1, label: '冥淵魔王' };
  if (k === 'chaos') return { map: 's94', x: 20, y: 1, label: '混沌之主' };
  const id = 's' + k, m = MAPS[id];
  let d = m.gymDoor;
  if (!d) { const key = Object.keys(m.doors).find(q => m.doors[q].label === m.gym); d = key.split(',').map(Number); m.gymDoor = d; }
  return { map: id, x: d[0], y: d[1], label: m.gym, k };
}
function routeTo(target) { // 回傳從目前地圖出發的地圖路線
  const prev = { [S.map]: null }, q = [S.map];
  while (q.length) {
    const a = q.shift();
    if (a === target) break;
    for (const e of MAPS[a].exits) if (!(e.to in prev)) { prev[e.to] = { from: a, exit: e }; q.push(e.to); }
  }
  if (!(target in prev)) return null;
  const path = [];
  for (let a = target; prev[a]; a = prev[a].from) path.unshift({ map: a, exit: prev[a].exit });
  return path;
}
function exitWord(e, m) { return e.y <= 1 ? '北邊' : e.y >= m.h - 2 ? '南邊' : e.x <= 1 ? '西邊' : '東邊'; }
function navInfo() {
  const t = navTarget();
  if (!t) return null;
  if (t.map === S.map) return { tx: t.x, ty: t.y, label: t.label, line: `就在這張地圖：前往「${t.label}」` };
  const r = routeTo(t.map);
  if (!r || !r.length) return { label: t.label, line: `用世界地圖飛往「${MAPS[t.map].name}」` };
  const e = r[0].exit, m = MAPS[S.map];
  if (S.visited[t.map] && r.length > 2) return { tx: e.x + (e.w > 1 ? 0.5 : 0), ty: e.y, label: t.label, line: `按 X →「世界地圖」直接飛往「${MAPS[t.map].name.replace(/^.*・/, '')}」`, route: r };
  return { tx: e.x + (e.w > 1 ? 0.5 : 0), ty: e.y, label: t.label, line: `往${exitWord(e, m)}出口 →「${MAPS[r[0].map].name}」（還要經過 ${r.length} 張地圖）`, route: r };
}
const goalV5 = goal;
goal = function () {
  const t = navTarget();
  if (!t) return goalV5();
  if (t.k) return `第 ${t.k} 關：${MAPS[t.map].gym}（${MAPS[t.map].name.replace(/^.*・/, '')}）`;
  return `打倒 ${t.label}`;
};
async function hintPage() {
  const n = navInfo(), pages = ['【目前目標】\n' + goal()];
  if (n) {
    pages.push('【路線】\n' + n.line + (n.route ? '\n' + [MAPS[S.map].name, ...n.route.slice(0, 4).map(q => MAPS[q.map].name)].join(' → ') + (n.route.length > 4 ? ' → …' : '') : ''));
    pages.push('畫面上的金色箭頭會一直指向下一步。\n天穹之頂有三道門：北門通星海、東門通冥淵、西門通異界。');
  }
  pages.push('【小技巧】\n' + TIPS[Math.floor(Math.random() * TIPS.length)], '【操作】方向鍵移動　Z 確定　X 選單　H 目標　M 音量\nShift 奔跑　F 全螢幕');
  await say(pages, { name: '💡 提示' });
}
function drawNavArrow() {
  if (!S || S.hintsOff || busy || !P.cam) return;
  const n = navInfo();
  if (!n) return;
  text('下一步：' + n.line, W - 14, 70, { size: 14, align: 'right', color: '#ffe8a0' });
  if (n.tx == null) return;
  const [cx, cy, Z] = P.cam, t = performance.now() / 1000;
  let x = (n.tx * TILE + TILE / 2 - cx) * Z, y = (n.ty * TILE - cy) * Z;
  const on = x > 40 && x < W - 40 && y > 90 && y < H - 40, c = ctx;
  c.save();
  if (on) { c.translate(x, y - 8 + Math.sin(t * 5) * 6); c.rotate(Math.PI / 2); }
  else {
    const mx = W / 2, my = H / 2, a = Math.atan2(y - my, x - mx), rx = W / 2 - 44, ry = H / 2 - 60, k = Math.min(rx / Math.abs(Math.cos(a) || 1e-6), ry / Math.abs(Math.sin(a) || 1e-6));
    c.translate(mx + Math.cos(a) * k, my + Math.sin(a) * k + 14); c.rotate(a);
  }
  c.shadowColor = '#ffd040'; c.shadowBlur = 16; c.fillStyle = '#ffd040'; c.strokeStyle = '#6a4010'; c.lineWidth = 2;
  c.beginPath(); c.moveTo(20, 0); c.lineTo(-8, -15); c.lineTo(-2, -5); c.lineTo(-20, -5); c.lineTo(-20, 5); c.lineTo(-2, 5); c.lineTo(-8, 15); c.closePath(); c.fill(); c.stroke();
  c.restore();
}
const worldLayerV6 = worldLayer;
worldLayer = function () {
  if (S && flag('stage6')) { S.visited.s7 = true; S.visited.s19 = true; }
  const L = worldLayerV6(), d = L.draw;
  L.draw = function () { d.call(this); drawNavArrow(); };
  return L;
};

// ---------- 世界地圖加上異界 ----------
REALMS.forEach((r, i) => {
  const ids = REALM_MAPS.slice(i * 8, i * 8 + 8);
  ids.forEach((id, q) => { const row = Math.floor(q / 4), col = q % 4, sn = row % 2 ? 3 - col : col; WORLD[id] = { p: [130 + sn * 170, 170 + row * 190], spawn: [19, 27] }; });
  WORLD_PAGES.push({ name: r[0], ids });
  PAGE_BG.push([r[10], r[11], i === 2 || i === 5 ? '#301850' : '#f0ecff']);
});

// ---------- 路人訓練家 ----------
const PASSERBY_NAMES = ['見習靈契師', '旅行家', '武道家', '魔術師', '賞金獵人', '學者', '流浪歌手', '冒險者', '少女靈契師', '老練獵人'];
const PASSERBY_LINES = ['眼神對上就是要對戰！', '讓我試試你的實力！', '這條路歸我管，先打過再說！', '我的夥伴今天狀態超好！', '路過也要打一場！', '正好缺一個對手！'];
const PASSERBY_LOOKS = [LOOK.kid, LOOK.girl, LOOK.fighter, LOOK.worker, LOOK.rider, LOOK.snow, LOOK.toyman, LOOK.guard];
function addPasserby(id, n) {
  const m = MAPS[id], R = srand(strHash(id) + 91), wild = m.wild;
  if (!wild || !wild.length || !m.exits.length) return;
  const open = (x, y, extra) => { if (x < 0 || y < 0 || x >= m.w || y >= m.h) return false; const c = m.rows[y][x]; if (SOLID.has(c) || c === 'D') return false; return !m.npcs.some(q => q.x === x && q.y === y) && !(extra && extra.x === x && extra.y === y); };
  const e0 = m.exits[0], reach = extra => { const seen = new Set([e0.x + ',' + e0.y]), st = [[e0.x, e0.y]]; while (st.length) { const [x, y] = st.pop(); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy, k = nx + ',' + ny; if (!seen.has(k) && open(nx, ny, extra)) { seen.add(k); st.push([nx, ny]); } } } return seen; };
  const inRect = (x, y, g) => x >= g.x - 1 && x < g.x + g.w + 1 && y >= g.y - 1 && y < g.y + g.h + 1;
  const keys = () => { const out = m.exits.map(e => [e.x, e.y]); for (const k in m.doors) { const [x, y] = k.split(',').map(Number); out.push([x, y + 1]); } for (const q of m.npcs) out.push([q.x, q.y, 1]); return out; };
  const seen0 = [...reach()].map(s => s.split(',').map(Number)).filter(([x, y]) => (m.rows[y][x] === '.' || m.rows[y][x] === ',' || m.rows[y][x] === ';' || m.rows[y][x] === 'x' || m.rows[y][x] === 'a') && !m.exits.some(g => inRect(x, y, g)) && !m.triggers.some(g => inRect(x, y, g)));
  let made = 0;
  for (let i = 0; i < 300 && made < n && seen0.length; i++) {
    const [x, y] = seen0[Math.floor(R() * seen0.length)];
    if (m.npcs.some(q => Math.abs(q.x - x) + Math.abs(q.y - y) < 4)) continue;
    const s = { x, y }, seen = reach(s), ok = keys().every(([kx, ky, adj]) => adj ? [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => seen.has((kx + a) + ',' + (ky + b))) : seen.has(kx + ',' + ky));
    if (!ok) continue;
    const dirs = ['up', 'down', 'left', 'right'].filter(d => open(x + DIRS[d][0], y + DIRS[d][1]));
    if (!dirs.length) continue;
    const size = 2 + Math.floor(R() * 2), team = Array.from({ length: size }, () => { const w = wild[Math.floor(R() * wild.length)]; return [w[0], w[2] + Math.floor(R() * 2)]; });
    const lv = team[0][1], name = PASSERBY_NAMES[Math.floor(R() * PASSERBY_NAMES.length)];
    m.npcs.push({ id: 'pb' + made, x, y, dir: dirs[Math.floor(R() * dirs.length)], look: PASSERBY_LOOKS[Math.floor(R() * PASSERBY_LOOKS.length)], name, sight: 3, _home: [x, y],
      trainer: { team, money: lv * 45, before: PASSERBY_LINES[Math.floor(R() * PASSERBY_LINES.length)], after: '你真的很強……繼續加油！' } });
    made++;
  }
}
for (const id in MAPS) {
  if (id === 'huaguo') continue;
  addPasserby(id, MAPS[id].big ? 10 : /^s\d/.test(id) ? 5 : 4);
}

// ---------- 畫面放大與全螢幕 ----------
function zoomLabel() { return `畫面大小：${VOL.zoom} 倍`; }
function cycleZoom() { VOL.zoom = VOL.zoom === 2 ? 1 : VOL.zoom === 1 ? 1.5 : 2; applyVol(); }
function toggleFull() { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {}); }
window.addEventListener('keydown', e => { if (e.key === 'f' || e.key === 'F') toggleFull(); });
document.addEventListener('fullscreenchange', () => setTimeout(fitCanvas, 100));
async function mainMenu() {
  while (true) {
    const items = ['夥伴', '背包', '圖鑑', '世界地圖（傳送）', '任務', '提示', '存檔', '聲音設定', zoomLabel(), S.hintsOff ? '提示框：關' : '提示框：開', '關閉'];
    const seals = Object.keys(S.flags).filter(f => /^stage\d+$/.test(f)).length + (S.badges || 0);
    const c = await choose(items, { title: `${S.name}　$${S.money}　道館 ${seals}/100`, w: 330, x: W - 350, y: 14, rowH: 38 });
    if (c === 0) { if (!S.party.length) { await say('你還沒有夥伴！'); continue; } await partyMenu('view'); }
    else if (c === 1) await bagMenu('field');
    else if (c === 2) await dexMenu();
    else if (c === 3) { if (!flag('gotStarter')) { await say('先去研究所領取夥伴吧！'); continue; } if (await worldMap()) return; }
    else if (c === 4) await questMenu();
    else if (c === 5) { await hintPage(); return; }
    else if (c === 6) { saveGame(); await wait(300); }
    else if (c === 7) await soundPanel();
    else if (c === 8) cycleZoom();
    else if (c === 9) S.hintsOff = !S.hintsOff;
    else return;
  }
}
TIPS.push('按 F 可以切換全螢幕。', '選單裡可以調整畫面放大倍率。', '天穹之頂有北、東、西三道門，分別通往星海、冥淵和異界。');
