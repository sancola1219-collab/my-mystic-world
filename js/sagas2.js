// ===== 第十五波：番外篇大擴充（天宮 15 關、忍者 16 關、取經之路・續 14 關、星珠武道篇、彩虹幼稚園篇）＋主線新神獸 24 隻 =====

// ---------- 造型擴充：新頭部、耳朵、獨角、爆炸頭、氣功球、書本 ----------
const xyHeadV2 = xyHead;
xyHead = function (c, k, t, o, hx, hy) {
  const fur = o.fur || o.a;
  const ball = (x, y, r, col, k2 = 0.35) => { const g = c.createRadialGradient(x - r * 0.35, y - r * 0.4, 1, x, y, r); g.addColorStop(0, sh(col, k2)); g.addColorStop(1, sh(col, -0.35)); G.circle(c, x, y, r, g, XOL, 0.8); };
  const eyes = (dx, y, r) => { for (const d of [-1, 1]) { A.eye(c, hx + d * dx, y, r, o.c, false); c.strokeStyle = XOL; c.lineWidth = 1.1; c.beginPath(); c.moveTo(hx + d * (dx + r * 1.4), y - r * 1.6); c.lineTo(hx + d * (dx - r * 1.2), y - r * 0.8); c.stroke(); } };
  if (k === 'deer' || k === 'goat') {
    if (k === 'deer') for (const d of [-1, 1]) { c.strokeStyle = '#8a6a3a'; c.lineWidth = 2; c.lineCap = 'round'; c.beginPath(); c.moveTo(hx + d * 5, hy - 9); c.lineTo(hx + d * 12, hy - 24); c.moveTo(hx + d * 8, hy - 16); c.lineTo(hx + d * 16, hy - 18); c.moveTo(hx + d * 10, hy - 20); c.lineTo(hx + d * 7, hy - 28); c.moveTo(hx + d * 12, hy - 24); c.lineTo(hx + d * 18, hy - 29); c.stroke(); }
    else for (const d of [-1, 1]) { c.strokeStyle = '#c8b890'; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(hx + d * 5, hy - 9); c.bezierCurveTo(hx + d * 16, hy - 20, hx + d * 22, hy - 4, hx + d * 13, hy - 2); c.stroke(); }
    for (const d of [-1, 1]) { c.fillStyle = sh(fur, -0.1); c.strokeStyle = XOL; c.lineWidth = 0.6; c.beginPath(); c.ellipse(hx + d * 11, hy - 5, 5, 2.2, d * -0.5, 0, 7); c.fill(); c.stroke(); }
    c.fillStyle = xyGrad(c, hx - 9, hy - 10, hx + 9, hy + 14, fur, 0.3); c.strokeStyle = XOL; c.lineWidth = 0.8;
    c.beginPath(); c.moveTo(hx - 8, hy - 6); c.quadraticCurveTo(hx, hy - 13, hx + 8, hy - 6); c.quadraticCurveTo(hx + 7, hy + 6, hx + 3.6, hy + 13); c.quadraticCurveTo(hx, hy + 15, hx - 3.6, hy + 13); c.quadraticCurveTo(hx - 7, hy + 6, hx - 8, hy - 6); c.fill(); c.stroke();
    G.ell(c, hx, hy + 11.4, 3, 2, '#2a1a14'); eyes(4.2, hy - 2, 1.7);
    if (k === 'goat') { c.fillStyle = '#e8e4d8'; c.beginPath(); c.moveTo(hx - 3, hy + 13); c.quadraticCurveTo(hx, hy + 24, hx + 3, hy + 13); c.fill(); c.stroke(); }
    return;
  }
  if (k === 'fish') {
    for (const d of [-1, 1]) { c.fillStyle = sh(o.c, 0.2); c.strokeStyle = XOL; c.lineWidth = 0.6; c.beginPath(); c.moveTo(hx + d * 9, hy - 2); c.quadraticCurveTo(hx + d * 20, hy - 10, hx + d * 18, hy + 6); c.quadraticCurveTo(hx + d * 13, hy + 2, hx + d * 9, hy + 4); c.fill(); c.stroke(); }
    c.fillStyle = sh(o.c, 0.1); c.beginPath(); c.moveTo(hx - 4, hy - 11); c.quadraticCurveTo(hx, hy - 24 + Math.sin(t * 3) * 2, hx + 6, hy - 11); c.fill(); c.stroke();
    ball(hx, hy, 11.5, fur, 0.35);
    c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 0.7; for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(hx - 4 + i * 3, hy + 4, 2.4, Math.PI * 0.1, Math.PI * 0.9); c.stroke(); }
    for (const d of [-1, 1]) { G.circle(c, hx + d * 5.4, hy - 3, 3.4, '#fff', XOL, 0.6); G.circle(c, hx + d * 5.8, hy - 3, 1.8, '#101018'); G.circle(c, hx + d * 5, hy - 3.8, 0.7, '#fff'); }
    c.fillStyle = '#6a1a1a'; c.beginPath(); c.ellipse(hx, hy + 6.4, 4, 2.4, 0, 0, 7); c.fill();
    c.strokeStyle = sh(fur, -0.3); c.lineWidth = 1; for (const d of [-1, 1]) { c.beginPath(); c.moveTo(hx + d * 3, hy + 6); c.quadraticCurveTo(hx + d * 10, hy + 10, hx + d * 9, hy + 18 + Math.sin(t * 3 + d) * 2); c.stroke(); }
    return;
  }
  if (o.ears === 'fox' || o.ears === 'rabbit') {
    for (const d of [-1, 1]) {
      c.fillStyle = o.hair || '#f0f0f0'; c.strokeStyle = XOL; c.lineWidth = 0.6; c.beginPath();
      if (o.ears === 'fox') { c.moveTo(hx + d * 3, hy - 9); c.lineTo(hx + d * 10, hy - 22); c.lineTo(hx + d * 10, hy - 7); }
      else { c.ellipse(hx + d * 5, hy - 20, 2.6, 9, d * 0.15, 0, 7); }
      c.closePath(); c.fill(); c.stroke();
      c.fillStyle = '#ffb0c0'; c.beginPath(); if (o.ears === 'fox') { c.moveTo(hx + d * 5, hy - 10); c.lineTo(hx + d * 9.4, hy - 18); c.lineTo(hx + d * 9.4, hy - 9); } else c.ellipse(hx + d * 5, hy - 20, 1.2, 6.4, d * 0.15, 0, 7); c.closePath(); c.fill();
    }
  }
  if (o.ears === 'big') for (const d of [-1, 1]) { c.fillStyle = o.skin || '#f0c0a0'; c.strokeStyle = XOL; c.lineWidth = 0.6; c.beginPath(); c.ellipse(hx + d * 13, hy, 5, 9, d * 0.2, 0, 7); c.fill(); c.stroke(); c.fillStyle = 'rgba(160,60,60,0.4)'; c.beginPath(); c.ellipse(hx + d * 13, hy, 2.4, 5.4, d * 0.2, 0, 7); c.fill(); }
  xyHeadV2(c, k, t, o, hx, hy);
  if (o.onehorn) { const g = c.createLinearGradient(hx, hy + 2, hx, hy - 20); g.addColorStop(0, '#d8d0c0'); g.addColorStop(1, '#ffffff'); c.fillStyle = g; c.strokeStyle = XOL; c.lineWidth = 0.6; c.beginPath(); c.moveTo(hx - 3, hy - 8); c.quadraticCurveTo(hx - 1, hy - 18, hx + 2, hy - 24); c.quadraticCurveTo(hx + 3, hy - 14, hx + 3, hy - 8); c.closePath(); c.fill(); c.stroke(); }
  if (o.spiky) {
    const g = c.createLinearGradient(hx, hy - 30, hx, hy); g.addColorStop(0, sh(o.hair, 0.35)); g.addColorStop(1, sh(o.hair, -0.25));
    c.save(); if (o.aura) { c.shadowColor = o.aura; c.shadowBlur = 10; }
    c.fillStyle = g; c.strokeStyle = XOL; c.lineWidth = 0.6; c.beginPath(); c.moveTo(hx - 10, hy - 2);
    const sp = [[-17, -12], [-8, -9], [-14, -24], [-4, -14], [-2, -30], [3, -15], [10, -27], [8, -12], [18, -18], [10, -4]];
    for (const [x, y] of sp) c.lineTo(hx + x, hy + y + Math.sin(t * 3 + x) * 0.5);
    c.lineTo(hx + 10, hy - 2); c.quadraticCurveTo(hx, hy - 9, hx - 10, hy - 2); c.closePath(); c.fill(); c.stroke(); c.restore();
  }
};
const xyWeaponV2 = xyWeapon;
xyWeapon = function (c, w, t, o) {
  if (w === 'ki') {
    const r = 6 + Math.sin(t * 6) * 1.2;
    c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createRadialGradient(26, 2, 0, 26, 2, r * 2.4); g.addColorStop(0, '#ffffff'); g.addColorStop(0.35, o.c); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.beginPath(); c.arc(26, 2, r * 2.4, 0, 7); c.fill();
    for (let i = 0; i < 6; i++) { const a = t * 4 + i * 1.05; c.strokeStyle = o.c; c.lineWidth = 0.8; c.beginPath(); c.moveTo(26 + Math.cos(a) * r, 2 + Math.sin(a) * r); c.lineTo(26 + Math.cos(a) * r * 1.9, 2 + Math.sin(a) * r * 1.9); c.stroke(); }
    c.restore(); return;
  }
  if (w === 'book') {
    c.save(); c.translate(26, 0); c.rotate(-0.2); G.rr(c, -7, -5, 14, 10, 1.4, '#c03030', XOL, 0.6); c.fillStyle = '#fff8e8'; c.fillRect(-6, -4, 12, 1.6); G.circle(c, 0, 1.4, 2, '#f0d040'); c.restore(); return;
  }
  return xyWeaponV2(c, w, t, o);
};

// ---------- 小朋友造型 ----------
PLANS.kid = function (c, t, o) {
  const b = Math.abs(Math.sin(t * 3)) * 2.4, skin = o.skin || '#fbdcc4', hair = o.hair || '#2a1a14', fat = o.fat ? 1.25 : 1;
  c.save(); c.translate(0, 2 - b); c.scale(1.3, 1.3);
  // 披風
  if (o.prop === 'cape') { const w = Math.sin(t * 3) * 3; c.fillStyle = xyGrad(c, -16, 0, 16, 30, '#d02020', 0.3); c.strokeStyle = XOL; c.lineWidth = 0.7; c.beginPath(); c.moveTo(-8, -2); c.lineTo(8, -2); c.quadraticCurveTo(20, 18, 18 + w, 34); c.lineTo(-18 + w, 34); c.quadraticCurveTo(-20, 18, -8, -2); c.closePath(); c.fill(); c.stroke(); }
  // 腿
  for (const d of [-1, 1]) { const sw = Math.sin(t * 6) * 1.6 * d; G.rr(c, d * 5 - 3 + sw * 0.3, 18, 6, 12, 2.6, o.b, XOL, 0.7); G.ell(c, d * 5.6 + sw * 0.3, 31.4, 5, 2.8, '#f4f4f4', XOL, 0.6); c.fillStyle = o.c; c.fillRect(d * 5.6 - 4 + sw * 0.3, 31.4, 8, 1.4); }
  // 身體
  c.fillStyle = xyGrad(c, -12 * fat, 0, 12 * fat, 22, o.a, 0.35); c.strokeStyle = XOL; c.lineWidth = 0.8;
  c.beginPath(); c.moveTo(-9 * fat, 0); c.quadraticCurveTo(0, -3, 9 * fat, 0); c.quadraticCurveTo(13 * fat, 12, 10 * fat, 21); c.quadraticCurveTo(0, 23, -10 * fat, 21); c.quadraticCurveTo(-13 * fat, 12, -9 * fat, 0); c.closePath(); c.fill(); c.stroke();
  G.rr(c, -10 * fat, 17, 20 * fat, 5, 2, o.b, XOL, 0.6);
  c.fillStyle = 'rgba(255,255,255,0.3)'; c.beginPath(); c.ellipse(-4, 6, 3, 5, -0.3, 0, 7); c.fill();
  // 手
  const wave = Math.sin(t * 4) * 0.4;
  for (const d of [-1, 1]) { c.save(); c.translate(d * 9 * fat, 3); c.rotate(d * (0.5 + (d > 0 ? wave : 0))); G.rr(c, -2.6, 0, 5.2, 11, 2.6, o.a, XOL, 0.6); G.circle(c, 0, 12, 3, skin, XOL, 0.6); c.restore(); }
  // 道具
  if (o.prop === 'balloon') { c.strokeStyle = '#555'; c.lineWidth = 0.6; c.beginPath(); c.moveTo(16, 13); c.quadraticCurveTo(20, -10, 18, -30); c.stroke(); G.ell(c, 18, -38, 7, 9, xyGrad(c, 12, -46, 24, -30, o.c, 0.5), XOL, 0.6); }
  if (o.prop === 'bat') { c.save(); c.translate(17, 12); c.rotate(-0.6); G.rr(c, -1.6, -26, 3.2, 26, 1.6, '#c8a060', XOL, 0.6); c.restore(); }
  if (o.prop === 'flag') { c.strokeStyle = '#6a4a2a'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(17, 14); c.lineTo(17, -26); c.stroke(); c.fillStyle = o.c; c.beginPath(); c.moveTo(17, -26); c.quadraticCurveTo(28, -22 + Math.sin(t * 5) * 2, 30, -18); c.lineTo(17, -16); c.fill(); c.stroke(); }
  if (o.prop === 'bag') { G.rr(c, -18, 4, 8, 10, 2, '#ffd040', XOL, 0.6); c.strokeStyle = '#a07020'; c.beginPath(); c.moveTo(-17, 4); c.lineTo(-8, -2); c.stroke(); }
  if (o.prop === 'snack') { G.rr(c, 13, 8, 8, 10, 1.4, '#f04040', XOL, 0.6); c.fillStyle = '#fff'; c.fillRect(14, 11, 6, 2); }
  // 頭
  const hy = -16, R = 16;
  if (o.hs === 'pig') for (const d of [-1, 1]) { G.circle(c, d * 17, hy + 4, 5, hair, XOL, 0.6); G.circle(c, d * 13.6, hy - 2, 2, o.c); }
  const hg = c.createRadialGradient(-5, hy - 6, 2, 0, hy, R); hg.addColorStop(0, sh(skin, 0.3)); hg.addColorStop(1, sh(skin, -0.12));
  c.fillStyle = hg; c.strokeStyle = XOL; c.lineWidth = 0.9; c.beginPath(); c.ellipse(0, hy, R * 1.05, R, 0, 0, 7); c.fill(); c.stroke();
  const hgr = xyGrad(c, -14, hy - 18, 14, hy, hair, 0.3); c.fillStyle = hgr; c.beginPath();
  if (o.hs === 'bowl') { c.moveTo(-16.4, hy + 1); c.quadraticCurveTo(-17, hy - 18, 0, hy - 17.6); c.quadraticCurveTo(17, hy - 18, 16.4, hy + 1); c.lineTo(12, hy - 4); c.lineTo(6, hy - 6); c.lineTo(0, hy - 4.6); c.lineTo(-6, hy - 6); c.lineTo(-12, hy - 4); c.closePath(); }
  else if (o.hs === 'spiky') { c.moveTo(-16, hy - 2); for (let i = 0; i < 8; i++) { const a = Math.PI * (1 + i / 7); c.lineTo(Math.cos(a) * 21, hy - 4 + Math.sin(a) * 18); c.lineTo(Math.cos(a + 0.2) * 14, hy - 4 + Math.sin(a + 0.2) * 12); } c.lineTo(16, hy - 2); c.closePath(); }
  else if (o.hs === 'buzz') { c.arc(0, hy - 1, R * 1.02, Math.PI * 1.08, Math.PI * 1.92); c.quadraticCurveTo(0, hy - 10, -15.4, hy - 6); c.closePath(); }
  else { c.moveTo(-17, hy + 4); c.quadraticCurveTo(-18, hy - 19, 0, hy - 18); c.quadraticCurveTo(18, hy - 19, 17, hy + 4); c.quadraticCurveTo(14, hy - 8, 4, hy - 9); c.quadraticCurveTo(-6, hy - 6, -10, hy - 10); c.quadraticCurveTo(-14, hy - 6, -17, hy + 4); c.closePath(); }
  c.fill(); c.stroke();
  // 臉
  const ey = hy + 1;
  for (const d of [-1, 1]) {
    G.ell(c, d * 6, ey, 3, 3.8, '#ffffff', XOL, 0.5); G.ell(c, d * 6 + 0.4, ey + 0.6, 2, 2.8, '#2a1a10'); G.circle(c, d * 6 - 0.4, ey - 0.8, 0.9, '#fff');
    c.strokeStyle = sh(hair, -0.2); c.lineWidth = o.brows ? 2.4 : 1.2; c.lineCap = 'round'; c.beginPath(); c.moveTo(d * 3.4, ey - 5.6 - (o.mouth === 'smirk' && d > 0 ? 1 : 0)); c.lineTo(d * 9, ey - 6.4); c.stroke();
    G.ell(c, d * 10.6, ey + 5, 2.6, 1.6, 'rgba(255,110,120,0.4)');
  }
  c.strokeStyle = '#5a2a1a'; c.lineWidth = 1; c.fillStyle = '#c03040';
  if (o.mouth === 'o') { c.beginPath(); c.ellipse(0, ey + 7.6, 2, 2.4, 0, 0, 7); c.fill(); c.stroke(); }
  else if (o.mouth === 'smirk') { c.beginPath(); c.moveTo(-3, ey + 7.4); c.quadraticCurveTo(1, ey + 8.6, 4, ey + 6); c.stroke(); }
  else if (o.mouth === 'grin') { c.beginPath(); c.moveTo(-4.4, ey + 6); c.quadraticCurveTo(0, ey + 12, 4.4, ey + 6); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#fff'; c.fillRect(-3, ey + 6.2, 6, 1.4); }
  else { c.beginPath(); c.arc(0, ey + 5.4, 3, 0.3, Math.PI - 0.3); c.stroke(); }
  c.restore();
};

// ---------- 招式小工具 ----------
function mvs(list) { for (const [k, n, t, p, fxk, d, e] of list) MOVES[k] = Object.assign({ n, t, p, a: p ? 95 : 100, pp: p >= 140 ? 5 : p >= 120 ? 10 : 15, d }, fxk ? { fxk } : {}, e ? { e } : {}); }
mvs([
  ['tg_far', '千里神目', '光', 115, 'beam', '看穿千里，命中要害。', { crit: 1 }], ['tg_ear', '順風神耳', '風', 0, null, '聽見對手的一舉一動，閃避與速度提升。', { self: { spd: 2 } }],
  ['tg_windbag', '風袋狂飆', '風', 125, 'twister', '打開風袋，狂風怒吼。', { foe: { spd: -1 } }], ['tg_rain', '傾盆天雨', '水', 120, 'rain', '雨師降下滂沱大雨。'],
  ['tg_thunder', '五雷轟頂', '雷', 135, 'beam', '雷公的雷錘一敲，五道天雷落下。', { par: 0.25 }], ['tg_mirror', '金光電鏡', '光', 120, 'beam', '電母的鏡子射出刺眼電光。', { foe: { atk: -1 } }],
  ['tg_star9', '九曜連星', '光', 30, 'meteor', '九顆星辰接連墜落，連打 2~5 次。', { multi: [2, 5] }], ['tg_horn', '金角穿天', '鋼', 130, 'needles', '亢金龍的金角能鑽穿金鐃。', { crit: 1 }],
  ['tg_peach', '蟠桃仙氣', '木', 0, null, '吃下蟠桃，回復一半體力。', { heal: 0.5 }], ['tg_dance', '霓裳仙舞', '幻', 100, 'petals', '仙女的舞姿讓對手看得出神。', { conf: 0.3 }],
  ['tg_bare', '赤足踏雲', '地', 120, 'quake', '光著腳從雲端踏下。'], ['tg_hairpin', '金簪劃天河', '光', 150, 'beam', '一劃就劃出一條天河。'],
  ['nj_fang', '牙通牙', '地', 115, 'claw', '人犬一起旋轉衝撞。'], ['nj_bug', '寄壞蟲之術', '木', 105, 'barrage', '成群的蟲子吸走查克拉般的力量。', { drain: 0.3 }],
  ['nj_rock', '土遁・岩壁崩', '地', 125, 'quake', '岩壁從地底升起又崩下。'], ['nj_ice', '冰遁・千本雪', '冰', 120, 'needles', '冰針像暴雪一樣射出。', { foe: { spd: -1 } }],
  ['nj_heal', '醫療忍術', '光', 0, null, '回復一半體力並治好異常。', { heal: 0.5, cure: 1 }], ['nj_sand', '砂暴送葬', '地', 130, 'twister', '流沙把對手捲起來。'],
  ['nj_genjutsu', '鏡花幻術', '幻', 115, 'mist', '鏡中的幻影讓對手陷入混亂。', { conf: 0.4 }], ['nj_slash', '鬼刃一閃', '鋼', 140, 'slash', '流浪劍豪的拔刀術。', { crit: 1 }],
  ['x2_tiger', '虎力呼風', '火', 120, 'blast', '虎力大仙作法呼風喚火。'], ['x2_deer', '鹿角神光', '木', 115, 'beam', '鹿角發出奇異的光。', { drain: 0.25 }],
  ['x2_goat', '冷龍浴湯', '冰', 120, 'steam', '羊力大仙的冷龍讓滾油變冰水。', { foe: { atk: -1 } }], ['x2_fish', '通天冰封', '水', 125, 'rain', '把通天河一夜冰封。', { foe: { spd: -1 } }],
  ['x2_ring', '金剛琢套寶', '鋼', 130, 'orb', '金剛琢一套，兵器全被收走。', { foe: { atk: -2 } }], ['x2_sting', '倒馬毒樁', '暗', 130, 'needles', '連如來都會痛的毒刺。', { poison: 0.5 }],
  ['x2_nine', '九頭噬咬', '水', 130, 'bite', '九個頭輪流咬下。'], ['x2_charm', '狐媚迷魂', '幻', 105, 'petals', '狐狸精的媚術。', { conf: 0.4 }],
  ['x2_roar', '雄獅震吼', '鬥', 120, 'sound', '震天的獅吼。', { foe: { def: -1 } }], ['x2_ninelion', '九頭獅咬', '光', 145, 'bite', '九個獅頭同時咬住對手。'],
  ['x2_eyes', '千眼金光', '光', 125, 'beam', '肋下千隻眼睛放出金光罩住對手。', { par: 0.3 }], ['x2_tunnel', '無底洞', '地', 120, 'quake', '把對手拖進深不見底的洞。'],
  ['x2_leopard', '分瓣梅花計', '暗', 115, 'claw', '豹子精的奇計。', { crit: 1 }], ['x2_rhino', '犀角衝撞', '地', 130, 'quake', '犀牛精的獨角猛衝。'],
  ['x2_pestle', '搗藥玉杵', '光', 125, 'barrage', '月宮搗藥的玉杵敲下。'],
  ['sb_wave', '星光氣功炮', '光', 130, 'beam', '雙手聚氣，射出耀眼的氣功炮。'], ['sb_rush', '連環亂打', '鬥', 30, 'barrage', '快到看不見的拳腳，連打 2~5 次。', { multi: [2, 5] }],
  ['sb_kick', '旋風腿', '鬥', 110, 'twister', '原地旋轉的飛踢。'], ['sb_crane', '鶴翔拳', '風', 115, 'feathers', '鶴拳流派的絕招。'],
  ['sb_laser', '眼部雷射', '雷', 115, 'beam', '機械兵從眼睛射出雷射。'], ['sb_missile', '飛彈齊發', '鋼', 30, 'barrage', '一口氣射出整排飛彈，連打 2~5 次。', { multi: [2, 5] }],
  ['sb_beam', '魔貫光線', '暗', 140, 'beam', '螺旋狀的貫穿光線。', { crit: 1 }], ['sb_regen', '再生', '木', 0, null, '斷掉的手也能長回來，回復一半體力。', { heal: 0.5 }],
  ['sb_ape', '巨猿怒擊', '鬥', 140, 'quake', '滿月下變身的巨猿一拳砸下。'], ['sb_death', '死亡光球', '冰', 150, 'orb', '能毀滅星球的冰之光球。'],
  ['sb_absorb', '能量吸收', '鋼', 110, 'drain', '從手掌吸走對手的能量。', { drain: 0.5 }], ['sb_candy', '變成糖果吧', '幻', 120, 'bubbles', '把對手變成糖果的魔法光線。', { foe: { def: -1 } }],
  ['sb_destroy', '破滅', '暗', 160, 'blast', '破壞之神的一擊。'], ['sb_angel', '天使之杖', '光', 0, null, '時間倒轉，回復體力並大幅提升速度。', { heal: 0.4, self: { spd: 2 } }],
  ['sb_gold', '黃金武神拳', '光', 155, 'pillar', '金色氣焰包覆全身的終極一拳。'], ['sb_wish', '星珠願力', '光', 170, 'meteor', '七顆星珠一起發光，實現擊倒對手的願望。'],
  ['kd_prank', '惡作劇', '幻', 90, 'cards', '趁對手不注意偷偷搗蛋。', { conf: 0.3 }], ['kd_tease', '做鬼臉', '幻', 0, null, '對著對手扮鬼臉，降低對手攻擊。', { foe: { atk: -2 } }],
  ['kd_belly', '肚子彈彈', '鬥', 100, 'quake', '用圓滾滾的肚子撞過去。'], ['kd_snack', '吃點心', '木', 0, null, '吃點心回復體力。', { heal: 0.5 }],
  ['kd_lecture', '老師說教', '光', 110, 'sound', '長長的說教讓人昏昏欲睡。', { sleep: 0.3 }], ['kd_whistle', '哨子集合', '風', 100, 'sound', '嗶——！全體集合！', { foe: { spd: -1 } }],
  ['kd_peck', '啄啄攻擊', '風', 95, 'feathers', '鴿子們一起啄。'], ['kd_flock', '鴿群起飛', '風', 25, 'feathers', '整群鴿子飛過來，連打 2~5 次。', { multi: [2, 5] }],
  ['kd_sample', '試吃轟炸', '火', 110, 'blast', '熱騰騰的試吃品塞進嘴裡。', { burn: 0.2 }], ['kd_bark', '汪汪大叫', '暗', 100, 'sound', '大聲吠叫嚇壞對手。', { foe: { def: -1 } }],
  ['kd_punch', '小拳拳', '鬥', 110, 'claw', '用力揮出小拳頭。'], ['kd_hero', '閃電俠客踢', '雷', 135, 'beam', '電視英雄的必殺飛踢！', { par: 0.2 }],
  ['kd_beam', '正義光線', '光', 120, 'beam', '英雄手錶射出正義光線。'], ['kd_stomp', '恐龍踩踩', '地', 115, 'quake', '玩偶恐龍用力踩地。'],
  ['kd_roar', '嗷嗚吼叫', '鬥', 95, 'sound', '恐龍玩偶的吼叫。', { conf: 0.2 }], ['kd_splash', '潑水大戰', '水', 110, 'rain', '一大桶水潑過來。'],
  ['kd_toybox', '玩具箱大爆發', '鋼', 30, 'barrage', '玩具一個接一個飛出來，連打 2~5 次。', { multi: [2, 5] }], ['kd_robot', '發條機器人', '鋼', 115, 'blast', '上滿發條的機器人衝過去。'],
  ['kd_piano', '催眠曲', '幻', 0, null, '溫柔的鋼琴聲讓對手睡著。', { sleep: 1 }], ['kd_relay', '接力衝刺', '風', 115, 'twister', '運動會的全力衝刺。', { self: { spd: 1 } }],
  ['kd_scold', '姊姊的瞪眼', '幻', 105, 'beam', '被姊姊瞪一眼就會動彈不得。', { par: 0.3 }], ['kd_nightmare', '惡夢降臨', '暗', 150, 'mist', '把對手拖進可怕的惡夢裡。', { sleep: 0.2 }],
  ['kd_pillow', '枕頭大戰', '幻', 30, 'barrage', '枕頭一顆接一顆砸過來，連打 2~5 次。', { multi: [2, 5] }],
]);

// ---------- 大鬧天宮：增加到 15 關 ----------
const TG2_LIST = [
  ['千里眼', ['光', '幻'], [125, 125, 120, 140], { head: 'ogre', a: '#3a6ab0', b: '#f0c040', c: '#80e0ff', skin: '#5a90d0', horn: '#f0e0c0', hair: '#2a1a40', weapon: 'spear', armor: '#4a7ac0', eye3: 1 }, ['tg_far', 'tg_army'], '天庭的千里眼，能看見千里之外的一切。', 0, 1],
  ['順風耳', ['風', '幻'], [125, 120, 120, 145], { head: 'ogre', a: '#3a9a6a', b: '#f0c040', c: '#c0ffd0', skin: '#60b080', horn: '#f0e0c0', hair: '#2a1a40', weapon: 'trident', armor: '#4aaa7a', ears: 'big' }, ['tg_ear', 'tg_army'], '天庭的順風耳，能聽見千里外的聲音。', 0, 1],
  ['風伯', ['風'], [130, 130, 115, 150], { head: 'human', hs: 'short', beard: '#d8d8d8', hair: '#d8d8d8', a: '#a0d0c0', b: '#3a6a5a', c: '#e0fff0', skin: '#f0d0b0', weapon: 'fan', cape: '#80c0b0' }, ['tg_windbag', 'xy_wind'], '掌管風的神仙，背著一只風袋。', 0, 1],
  ['雨師', ['水'], [135, 125, 125, 130], { head: 'human', hs: 'bun', beard: '#3a3a4a', a: '#4a7ac0', b: '#c0e0ff', c: '#80c0ff', skin: '#f0d0b0', hair: '#2a2a3a', weapon: 'umbrella' }, ['tg_rain', 'xy_sand'], '掌管雨的神仙。', 0, 1],
  ['雷公', ['雷', '鬥'], [135, 150, 115, 140], { head: 'roc', a: '#5a4a8a', b: '#f0d040', c: '#fff080', fur: '#4a6ab0', wings: 1, weapon: 'iron', aura: '#f0e060', zap: 1 }, ['tg_thunder', 'tg_army'], '雷部的雷公，手持雷錘。', 0, 0],
  ['電母', ['雷', '光'], [125, 140, 115, 155], { head: 'human', hs: 'lady', a: '#f0e060', b: '#a040c0', c: '#ffffa0', skin: '#fbe0cc', hair: '#2a1030', weapon: 'sword', long: 1, skirt: 22, aura: '#fff080', zap: 1 }, ['tg_mirror', 'tg_thunder'], '雷部的電母，用金光鏡放出閃電。', 0, 1],
  ['九曜星君', ['光', '幻'], [145, 140, 140, 130], { head: 'human', hs: 'short', a: '#2a2a6a', b: '#f0d040', c: '#ffffa0', skin: '#f4d0b0', hair: '#1a1a24', weapon: 'sword', armor: '#3a3a8a', crown: 1, aura: '#a0a0ff', cape: '#1a1a4a' }, ['tg_star9', 'tg_eye'], '掌管九顆星辰的星君。', 0, 1],
  ['亢金龍', ['鋼', '光'], [150, 150, 150, 130], { plan: 'dragon', a: '#e0c050', b: '#a07020', c: '#fff0a0', horn: 2 }, ['tg_horn', 'xy_pearl'], '二十八星宿之一，頭上的金角能鑽穿一切。', 0, 0],
  ['紅衣仙女', ['火', '幻'], [120, 130, 115, 150], { plan: 'fairy', a: '#ff8090', b: '#a02040', c: '#ffd0e0' }, ['tg_dance', 'tg_peach'], '王母派來摘蟠桃的七仙女之一。', 0, 1],
  ['青衣仙女', ['水', '幻'], [120, 125, 120, 150], { plan: 'fairy', a: '#80c0ff', b: '#204080', c: '#d0f0ff' }, ['tg_dance', 'tg_rain'], '王母派來摘蟠桃的七仙女之一。', 0, 1],
  ['紫衣仙女', ['幻', '光'], [125, 130, 120, 150], { plan: 'fairy', a: '#c090ff', b: '#502080', c: '#f0e0ff' }, ['tg_dance', 'tg_peach'], '王母派來摘蟠桃的七仙女之一。', 0, 1],
  ['赤腳大仙', ['地', '光'], [150, 135, 140, 120], { head: 'human', hs: 'bun', a: '#e8d0a0', b: '#a06030', c: '#ffe080', skin: '#e8c098', hair: '#3a2a1a', beard: '#3a2a1a', weapon: 'staff', wc: '#8a6a3a', boot: '#e8c098' }, ['tg_bare', 'xy_bear'], '要去赴蟠桃宴的赤腳大仙，被悟空騙走了。', 0, 1],
  ['王母娘娘', ['光', '木'], [165, 145, 150, 130], { head: 'human', hs: 'lady', a: '#f0e0f8', b: '#c040a0', c: '#ffd0f0', skin: '#fbe0d0', hair: '#1a1018', weapon: 'sword', long: 1, skirt: 24, crown: 1, aura: '#ffc0f0' }, ['tg_hairpin', 'tg_peach'], '瑤池的王母娘娘，一根金簪劃出天河。', 1, 1],
];
const TG2 = 1170, TG2_ID = sagaIds(TG2, TG2_LIST);
sagaSpecies(TG2, TG2_LIST, '西遊記序章・天宮');
for (const id of Object.values(TG2_ID)) MONS[id].xy = true;
{
  const cfg = SAGAS.tiangong, old = cfg.stages;
  old.forEach((q, i) => q.key = q.key || 'tg' + i);
  Object.assign(cfg.ids, TG2_ID);
  const S2 = (o) => o;
  cfg.stages = [
    old[0],
    S2({ team: ['千里眼', '順風耳'], key: 'tgA', place: '南天門・瞭望台', minion: ['光'], line: ['花果山的妖猴，一舉一動都逃不過我們的眼睛和耳朵！'], win: ['看得見、聽得見……就是打不過……'] }),
    old[1],
    S2({ team: ['風伯', '雨師'], key: 'tgB', place: '風雨殿', minion: ['風', '水'], line: ['風起！雨來！把妖猴吹回花果山！'], win: ['風袋破了，雨也停了……'] }),
    S2({ team: ['雷公', '電母'], key: 'tgC', place: '雷部', minion: ['雷'], line: ['雷部奉旨：天雷伺候！'], win: ['連天雷都劈不倒你們……'] }),
    old[2],
    S2({ boss: '九曜星君', key: 'tgD', place: '九曜星宮', minion: ['光', '幻'], line: ['九顆星辰，九道天罰！'], win: ['星光……暗淡了……'] }),
    S2({ boss: '亢金龍', key: 'tgE', place: '二十八宿・東方', minion: ['鋼', '光'], line: ['我是二十八宿的亢金龍！', '我的金角連金鐃都鑽得穿！'], win: ['角……鈍了……'] }),
    old[3], old[4],
    S2({ team: ['紅衣仙女', '青衣仙女', '紫衣仙女'], key: 'tgF', place: '蟠桃園', minion: ['木'], line: ['我們奉王母之命來摘蟠桃……', '咦？蟠桃怎麼都被吃光了？是你們！'], win: ['好啦好啦，我們不告狀……才怪！'] }),
    S2({ boss: '赤腳大仙', key: 'tgG', place: '蟠桃宴的路上', minion: ['地', '光'], line: ['老夫要去赴蟠桃宴，你們擋路做什麼？'], win: ['什麼？蟠桃宴改在通明殿？……又被騙了！'] }),
    S2({ boss: '王母娘娘', key: 'tgH', place: '瑤池', minion: ['光', '木'], line: ['我的蟠桃、我的仙酒、我的蟠桃宴……', '全被你們毀了！'], win: ['……罷了，去兜率宮找老君算帳吧。'] }),
    old[5], old[6],
  ];
  makeSaga(cfg);
}

// ---------- 忍者番外篇：增加到 16 關 ----------
const NJ2_LIST = [
  ['犬丸', ['地', '鬥'], [125, 135, 115, 145], { head: 'human', ninja: 1, a: '#8a6a4a', b: '#e0d0b0', c: '#ffd080', skin: '#e8c098', hair: '#4a3020', weapon: 'kunai', band: '#8a6a4a' }, ['nj_fang', 'nj_shuriken'], '和忍犬並肩作戰的忍者。', 0, 1],
  ['鐵牙', ['地', '暗'], [120, 140, 110, 155], { plan: 'beast', kind: 'wolf', a: '#c8c0b0', b: '#6a5a4a', c: '#ff8040' }, ['nj_fang', 'tg_bite'], '犬丸的大忍犬。', 0, 0],
  ['蟲姬', ['木', '暗'], [125, 135, 120, 140], { head: 'human', ninja: 1, mask: '#3a5a3a', a: '#3a5a3a', b: '#a0c060', c: '#c0ff60', skin: '#f0d8c0', hair: '#1a2a1a', weapon: 'kunai', band: '#3a5a3a', long: 1 }, ['nj_bug', 'nj_poison'], '袖子裡藏著成千上萬的蟲。', 0, 1],
  ['岩鐵', ['地', '鋼'], [160, 140, 160, 90], { head: 'human', ninja: 1, a: '#7a6a5a', b: '#c0a080', c: '#ffd080', skin: '#d8b090', hair: '#3a2a1a', weapon: 'iron', armor: '#8a7a6a', pads: '#8a7a6a', band: '#7a6a5a' }, ['nj_rock', 'nj_clone'], '岩之谷的守門人，身體硬得像石頭。', 0, 1],
  ['白雪', ['冰', '水'], [125, 140, 120, 150], { head: 'human', hs: 'lady', ninja: 1, a: '#e8f0ff', b: '#6080c0', c: '#c0f0ff', skin: '#fbe8e0', hair: '#e0e8f8', weapon: 'katana', band: '#6080c0', long: 1, skirt: 22 }, ['nj_ice', 'nj_mist'], '雪之里的冰遁使。', 0, 1],
  ['千草', ['木', '光'], [140, 120, 130, 135], { head: 'human', hs: 'bun', ninja: 1, a: '#f0f0f0', b: '#40a060', c: '#a0ffc0', skin: '#fbe0d0', hair: '#6a3a1a', weapon: 'kunai', band: '#40a060' }, ['nj_heal', 'nj_poison'], '影之里最強的醫療忍者。', 0, 1],
  ['砂嵐', ['地', '風'], [145, 140, 150, 120], { head: 'human', ninja: 1, a: '#c8a060', b: '#7a4a20', c: '#ffe0a0', skin: '#e0b890', hair: '#a03020', weapon: 'gourd', gourd: '#c8a060', band: '#7a4a20' }, ['nj_sand', 'nj_wind'], '背著大葫蘆、操縱砂子的沙漠忍者。', 0, 1],
  ['鏡夜', ['幻', '暗'], [135, 150, 120, 150], { head: 'human', ninja: 1, mask: '#c0c0d0', a: '#4a3a6a', b: '#c0c0e0', c: '#e0c0ff', skin: '#f0d8d0', hair: '#d0d0e0', weapon: 'sword', band: '#4a3a6a', cape: '#2a1a40', aura: '#a080ff' }, ['nj_genjutsu', 'nj_shadow'], '鏡之迴廊的幻術師。', 0, 1],
  ['刃鬼', ['鋼', '鬥'], [145, 165, 125, 150], { head: 'ogre', a: '#3a2a2a', b: '#c03030', c: '#ff6040', skin: '#c06050', horn: '#e8e0d0', hair: '#1a1010', weapon: 'katana', armor: '#5a4a4a', pads: '#5a4a4a' }, ['nj_slash', 'nj_shuriken'], '被稱為「刃之鬼」的流浪劍豪。', 0, 0],
];
const NJ2 = 1190, NJ2_ID = sagaIds(NJ2, NJ2_LIST);
sagaSpecies(NJ2, NJ2_LIST, '忍者番外篇・影之里');
{
  const cfg = SAGAS.ninja, old = cfg.stages;
  old.forEach((q, i) => q.key = q.key || 'nj' + i);
  Object.assign(cfg.ids, NJ2_ID);
  const st = (boss, key, place, minion, line, win, team) => ({ boss, team, key, place, minion, line, win });
  cfg.stages = [
    old[0],
    st(null, 'njA', '忍犬小屋', ['地'], ['我是犬丸，這是我的搭檔鐵牙！', '汪！'], ['鐵牙，我們輸了……下次再來！'], ['犬丸', '鐵牙']),
    old[1],
    st('蟲姬', 'njB', '蟲之森', ['木', '暗'], ['……你身上的氣息，蟲子們很喜歡。'], ['蟲子們……累了。'], null),
    old[2],
    st('岩鐵', 'njC', '岩之谷', ['地', '鋼'], ['要過岩之谷，先打穿我的身體！'], ['我的岩壁……裂了！'], null),
    st('白雪', 'njD', '雪之里', ['冰', '水'], ['雪之里不歡迎外人。', '冰遁・千本雪！'], ['雪融了……你的心很溫暖。'], null),
    old[3],
    st('千草', 'njE', '醫療所', ['木', '光'], ['醫療忍者也是很能打的喔！'], ['好啦，我幫你們療傷吧。'], null),
    st('砂嵐', 'njF', '砂之荒野', ['地', '風'], ['這片荒野的砂，都聽我的。'], ['……砂停了。你很強。'], null),
    old[4],
    st('鏡夜', 'njG', '鏡之迴廊', ['幻', '暗'], ['哪一個才是真的我呢？'], ['鏡子……碎了。'], null),
    st('刃鬼', 'njH', '斷崖', ['鋼', '鬥'], ['我只想找一個能讓我拔刀的對手。'], ['哈哈……終於找到了。'], null),
    old[5], old[6], old[7],
  ];
  makeSaga(cfg);
}

// ---------- 取經之路・續：更多妖王 ----------
const XY2_LIST = [
  ['虎力大仙', ['火', '鬥'], [140, 145, 120, 120], { head: 'lion', mane: '#e08020', fur: '#f0a040', a: '#c03020', b: '#f0d040', c: '#ffd040', weapon: 'sword', beads: 1 }, ['x2_tiger', 'xy_bull'], '車遲國三大仙之首，老虎精。', 0, 0],
  ['鹿力大仙', ['木', '幻'], [135, 135, 125, 130], { head: 'deer', fur: '#b0804a', a: '#3a7a4a', b: '#f0d040', c: '#a0ff80', weapon: 'staff', wc: '#6a4a2a' }, ['x2_deer', 'tg_eye'], '車遲國三大仙之二，白毛角鹿。', 0, 0],
  ['羊力大仙', ['冰', '幻'], [135, 130, 130, 125], { head: 'goat', fur: '#f0ecdc', a: '#e8e0c8', b: '#6a4a2a', c: '#c0e0ff', weapon: 'sword', beads: 1 }, ['x2_goat', 'xy_vase'], '車遲國三大仙之三，羚羊精。', 0, 0],
  ['靈感大王', ['水', '暗'], [150, 140, 135, 120], { head: 'fish', fur: '#f08030', a: '#2a5a9a', b: '#f0c040', c: '#ff6040', weapon: 'iron', armor: '#3a6aaa' }, ['x2_fish', 'xy_sand'], '通天河的金魚精，原是觀音蓮花池裡的金魚。', 0, 0],
  ['獨角兕大王', ['地', '鋼'], [170, 160, 165, 110], { head: 'bull', onehorn: 1, fur: '#3a4a6a', a: '#2a3a5a', b: '#c8a040', c: '#80c0ff', weapon: 'iron', armor: '#4a5a7a', pads: '#4a5a7a' }, ['x2_ring', 'xy_bull'], '太上老君的青牛，金剛琢能套走一切兵器。', 1, 0],
  ['蠍子精', ['暗', '木'], [135, 155, 125, 140], { plan: 'scorpion', a: '#8a2a5a', b: '#f0a0c0', c: '#ff4080' }, ['x2_sting', 'xy_bone'], '琵琶洞的蠍子精，倒馬毒樁連如來都怕。', 0, 0],
  ['九頭蟲', ['水', '暗'], [150, 150, 130, 130], { plan: 'orochi', a: '#2a5a5a', b: '#80c0a0', c: '#ffd040' }, ['x2_nine', 'nj_snake'], '碧波潭的九頭駙馬，偷走了祭賽國的佛寶。', 0, 0],
  ['玉面公主', ['幻', '火'], [125, 140, 115, 150], { head: 'human', hs: 'lady', ears: 'fox', a: '#f0d0e0', b: '#c04060', c: '#ffb0c0', skin: '#fbe8e0', hair: '#f0f0f8', weapon: 'sword', long: 1, skirt: 22, aura: '#ffc0d0' }, ['x2_charm', 'xy_morph'], '積雷山摩雲洞的狐狸精。', 0, 1],
  ['黃獅精', ['地', '鬥'], [150, 150, 135, 120], { head: 'lion', mane: '#e0b030', fur: '#e8c060', a: '#a07030', b: '#f0d040', c: '#ffe060', weapon: 'rake', armor: '#c09040' }, ['x2_roar', 'xy_rake'], '玉華州虎口洞的黃獅精，偷了悟空三兄弟的兵器。', 0, 0],
  ['九靈元聖', ['光', '暗'], [175, 165, 155, 130], { head: 'lion', mane: '#6a4aa0', fur: '#c0a0e0', a: '#4a2a7a', b: '#f0d040', c: '#e0c0ff', weapon: 'staff', wc: '#3a2a5a', aura: '#c080ff', cape: '#3a1a5a', crown: 1 }, ['x2_ninelion', 'xy_roar'], '太乙救苦天尊的坐騎九頭獅子。', 1, 0],
  ['百眼魔君', ['暗', '木'], [140, 150, 130, 135], { plan: 'spider', a: '#4a3a2a', b: '#f0c040', c: '#ffe040' }, ['x2_eyes', 'nj_poison'], '黃花觀的蜈蚣精，肋下千隻眼放出金光。', 0, 0],
  ['地湧夫人', ['地', '暗'], [135, 145, 125, 145], { head: 'rat', fur: '#f0f0f0', a: '#c0c0d0', b: '#8a4a8a', c: '#ff80c0', weapon: 'sword', long: 1, skirt: 22 }, ['x2_tunnel', 'xy_morph'], '陷空山無底洞的金鼻白毛老鼠精。', 0, 1],
  ['南山大王', ['暗', '鬥'], [140, 150, 125, 145], { head: 'lion', mane: '#d0a040', fur: '#e0b050', a: '#5a3a1a', b: '#d0a040', c: '#ffe060', weapon: 'spear' }, ['x2_leopard', 'tg_bite'], '隱霧山的豹子精。', 0, 0],
  ['辟寒大王', ['冰', '地'], [150, 145, 145, 110], { head: 'bull', onehorn: 1, fur: '#c0d0e0', a: '#5a7aa0', b: '#e0e8ff', c: '#a0e0ff', weapon: 'axe', armor: '#7a9ac0' }, ['x2_rhino', 'xy_trunk'], '青龍山玄英洞的犀牛精老大。', 0, 0],
  ['辟暑大王', ['火', '地'], [150, 145, 145, 110], { head: 'bull', onehorn: 1, fur: '#c08060', a: '#a04020', b: '#f0c060', c: '#ff8040', weapon: 'axe', armor: '#c06040' }, ['x2_rhino', 'xy_samadhi'], '青龍山玄英洞的犀牛精老二。', 0, 0],
  ['辟塵大王', ['地', '鋼'], [150, 145, 150, 105], { head: 'bull', onehorn: 1, fur: '#a09070', a: '#6a5a3a', b: '#d0c090', c: '#ffe080', weapon: 'axe', armor: '#8a7a5a' }, ['x2_rhino', 'xy_trident'], '青龍山玄英洞的犀牛精老三。', 0, 0],
  ['玉兔精', ['光', '幻'], [150, 150, 140, 150], { head: 'human', hs: 'lady', ears: 'rabbit', a: '#f8f4ff', b: '#e080a0', c: '#ffe0f0', skin: '#fdeee8', hair: '#f8f8ff', weapon: 'staff', wc: '#f0f0f0', long: 1, skirt: 22, aura: '#fff0c0' }, ['x2_pestle', 'tg_peach'], '月宮搗藥的玉兔，偷偷下凡假扮天竺公主。', 1, 1],
  ['白鹿精', ['光', '木'], [140, 135, 135, 130], { head: 'deer', fur: '#f0ece0', a: '#e8e0c8', b: '#8a6a3a', c: '#ffe0a0', weapon: 'staff', wc: '#c8b080', crown: 1 }, ['x2_deer', 'xy_lotus'], '比丘國的國丈，原是壽星的白鹿。', 0, 0],
];
const XY2 = 1200, XY2_ID = sagaIds(XY2, XY2_LIST);
sagaSpecies(XY2, XY2_LIST, '西遊記篇・取經之路續');
for (const id of Object.values(XY2_ID)) MONS[id].xy = true;
makeSaga({
  map: 'xiyou2', name: '西遊記篇・取經之路續', theme: 'xiyou', flag: 'x2', short: '取經之路・續', ids: XY2_ID, joinWord: '被感化了',
  title: n => '妖王 ' + n, foeLook: { hair: '#2a1a14', shirt: '#4a2a3a', pants: '#2a1a20' },
  guard: { hair: '#2a3a20', shirt: '#6a4a8a', pants: '#3a2a40', skin: '#a8c878' }, guardName: '小妖',
  helper: { name: '土地公', look: { hair: '#c8a050', shirt: '#e8d8b0', pants: '#8a6a3a' } },
  stages: [
    { team: ['虎力大仙', '鹿力大仙', '羊力大仙'], place: '車遲國・三清觀', minion: ['火'], line: ['我們是車遲國的三位國師！', '求雨、砍頭、下油鍋，你們敢跟我們比嗎？'], win: ['……三位國師，全都現了原形……'] },
    { boss: '靈感大王', place: '通天河', minion: ['水', '暗'], line: ['每年都要吃一對童男童女……', '今年就吃你們吧！'], win: ['觀音菩薩的竹籃……我、我回蓮花池去了……'] },
    { boss: '獨角兕大王', place: '金兜山・金兜洞', minion: ['地', '鋼'], line: ['我的金剛琢，什麼兵器都套得走！'], win: ['老君……老君來牽我回去了……'] },
    { boss: '蠍子精', place: '毒敵山・琵琶洞', minion: ['暗', '木'], line: ['我這倒馬毒樁，連如來都被我扎過！'], win: ['昴日星官……我最怕的公雞……'] },
    { boss: '九頭蟲', place: '碧波潭', minion: ['水', '暗'], line: ['祭賽國的佛寶是我偷的又怎樣？'], win: ['被哮天犬咬掉一個頭……我逃！'] },
    { boss: '玉面公主', place: '積雷山・摩雲洞', minion: ['幻', '火'], line: ['你們是來找牛魔王的？', '先過我這關吧，嘻嘻。'], win: ['嗚……大王快來救我……'] },
    { boss: '黃獅精', place: '玉華州・虎口洞', minion: ['地', '鬥'], line: ['這把釘耙、金箍棒、寶杖，現在都是我的了！', '我要辦一場「釘耙會」！'], win: ['兵器……全被搶回去了……'] },
    { boss: '白鹿精', place: '比丘國', minion: ['光', '木'], line: ['國王要長生不老，就要一千一百一十一個小孩的心當藥引……'], win: ['壽星老兒……您怎麼來了……'] },
    { boss: '百眼魔君', place: '黃花觀', minion: ['暗', '木'], line: ['請喝茶……茶裡有毒喔。', '千眼金光——罩住你們！'], win: ['毗藍婆菩薩的繡花針……破了我的金光……'] },
    { boss: '地湧夫人', place: '陷空山・無底洞', minion: ['地', '暗'], line: ['這個無底洞，進來就出不去了！'], win: ['托塔天王……我是您的乾女兒啊……'] },
    { boss: '南山大王', place: '隱霧山・連環洞', minion: ['暗', '鬥'], line: ['分瓣梅花計！你們上當了吧！'], win: ['計謀……都被看穿了……'] },
    { team: ['辟寒大王', '辟暑大王', '辟塵大王'], place: '青龍山・玄英洞', minion: ['冰', '火'], line: ['我們三兄弟每年正月十五扮成佛爺來偷香油！'], win: ['四木禽星……我們的剋星……'] },
    { boss: '九靈元聖', place: '竹節山・九曲盤桓洞', minion: ['光', '暗'], line: ['九個頭，九張嘴，一口叼走一個！'], win: ['太乙天尊……我跟您回東極妙巖宮……'] },
    { boss: '玉兔精', place: '天竺國・布金寺', minion: ['光', '幻'], line: ['我是天竺國的公主，要拋繡球招駙馬！', '……什麼？被認出來了？'], win: ['嫦娥姊姊……我跟妳回月宮……'] },
  ],
  npcs: H0 => [
    { id: 'x2tang', x: 3, y: H0 - 3, dir: 'right', look: { hair: '#f0d8c0', shirt: '#e8c040', pants: '#c03020', robe: '#c83a2a', skin: '#f6d8b8' }, name: '唐三藏', talk: async () => { healParty(); await say(['西天的路還很長，前面還有好多妖王。', '施主，辛苦你了。（隊伍完全恢復了！）'], { name: '唐三藏' }); } },
    { id: 'x2bajie', x: 8, y: H0 - 3, dir: 'left', look: { hair: '#20202a', shirt: '#3a3a4a', pants: '#2a2a3a', skin: '#f4b8c0' }, name: '豬八戒', talk: async () => { const i = sagaNext('xiyou2'); await say(i < 0 ? ['終於到西天了！俺老豬要大吃一頓！'] : [`師父說下一站是「${SAGAS.xiyou2.stages[i].place}」。`, '唉，又有妖怪……俺老豬肚子好餓……'], { name: '豬八戒' }); } },
  ],
  intro: async () => {
    await chapterCard('取經之路・續', '西天路上，還有更多妖王');
    await say(['一路向西，九九八十一難還沒結束。', '車遲國、通天河、火焰山後的積雷山、陷空山無底洞……', '更多妖王，正等著吃唐僧肉。']);
  },
  finale: async () => {
    setFlag('x2End'); S.money += 400000; addItem('fuseCore', 3);
    await fadeOut(600); fade = 0;
    await chapterCard('八十一難', '所有妖王都被收服了');
    await fadeIn(300);
    await say(['西天路上的妖王，全都成為了你的夥伴。', '（獲得了 $400000 和 融合晶石 ×3！取經之路・續完成！）']);
  },
});

// ---------- 星珠武道篇（原創格鬥冒險）----------
const SB_LIST = [
  ['阿修', ['鬥', '光'], [120, 140, 110, 145], { head: 'human', spiky: 1, hair: '#1a1a20', a: '#f08020', b: '#2a4aa0', c: '#80d0ff', skin: '#f6d4b4', weapon: 'ki', top: '#f08020', belt: '#2a4aa0' }, ['sb_wave', 'sb_rush'], '在武道館長大的少年，夢想集齊七顆星珠。', 0, 1],
  ['力丸', ['鬥'], [130, 135, 125, 125], { head: 'human', hs: 'monk', brow: '#2a1a10', a: '#f0a040', b: '#2a2a2a', c: '#ffd080', skin: '#f6d4b4', weapon: 'ki', top: '#f0a040' }, ['sb_rush', 'sb_kick'], '武道館的大師兄，光頭上點著六個香疤。', 0, 1],
  ['白鶴仙師', ['風', '鬥'], [135, 140, 125, 135], { head: 'human', hs: 'monk', brow: '#f0f0f0', beard: '#f0f0f0', a: '#f0f0f0', b: '#4060a0', c: '#c0e0ff', skin: '#f0d0b0', weapon: 'staff', wc: '#8a6a3a' }, ['sb_crane', 'sb_wave'], '鶴拳流派的老師父。', 0, 1],
  ['機械兵R1', ['鋼', '雷'], [140, 140, 150, 120], { plan: 'mech', a: '#c0c8d8', b: '#c03030', c: '#60e0ff' }, ['sb_laser', 'sb_missile'], '紅蠍軍團製造的機械兵一號機。', 0, 0],
  ['機械兵R2', ['鋼', '火'], [140, 150, 140, 120], { plan: 'mech', a: '#3a3a4a', b: '#f0c040', c: '#ff6040' }, ['sb_missile', 'sb_laser'], '紅蠍軍團製造的機械兵二號機。', 0, 0],
  ['傭兵巴羅', ['鬥', '暗'], [145, 150, 130, 140], { plan: 'alien', a: '#a07050', b: '#3a3a5a', c: '#80ff80' }, ['sb_wave', 'sb_rush'], '來自外星的傭兵，戴著能測戰鬥力的眼鏡。', 0, 0],
  ['綠魔卡爾', ['暗', '幻'], [150, 155, 140, 140], { plan: 'alien', a: '#50a050', b: '#e8e8f0', c: '#ff60a0' }, ['sb_beam', 'sb_regen'], '綠皮膚的魔族戰士，手斷了也能長回來。', 0, 0],
  ['月夜巨猿', ['鬥', '地'], [180, 170, 140, 100], { plan: 'golem', a: '#8a5a3a', b: '#c8a080', c: '#ff4040' }, ['sb_ape', 'xy_bull'], '看見滿月就會變身的巨猿。', 0, 0],
  ['冰皇凍羅', ['冰', '暗'], [165, 175, 150, 165], { plan: 'alien', a: '#f0f0f8', b: '#8a3ab0', c: '#ff60ff' }, ['sb_death', 'sb_beam'], '統治宇宙的冰之帝王，能毀滅一顆星球。', 1, 0],
  ['人造人零號', ['鋼', '雷'], [150, 155, 150, 155], { head: 'human', hs: 'short', a: '#3a5a9a', b: '#e8e8e8', c: '#80c0ff', skin: '#f6dcc4', hair: '#e8d080', weapon: 'ki', top: '#e8e8e8' }, ['sb_absorb', 'sb_laser'], '永遠不會累的人造人。', 0, 1],
  ['人造人壹號', ['鋼', '火'], [150, 160, 145, 155], { head: 'human', hs: 'lady', a: '#3a3a3a', b: '#f0f0f0', c: '#ffd080', skin: '#fbe0d0', hair: '#f0d880', weapon: 'ki' }, ['sb_absorb', 'sb_missile'], '永遠不會累的人造人。', 0, 1],
  ['蟲帝甲羅', ['木', '暗'], [165, 165, 155, 145], { plan: 'demon', a: '#4a8a3a', b: '#2a2a2a', c: '#ff60a0' }, ['sb_absorb', 'sb_beam'], '吸收了無數戰士力量的完全生物。', 0, 0],
  ['泡泡魔人', ['幻', '光'], [190, 155, 140, 130], { plan: 'jelly', a: '#ff90c0', b: '#ffffff', c: '#ff60a0' }, ['sb_candy', 'sb_regen'], '圓滾滾的粉紅魔人，最喜歡吃糖果。', 0, 0],
  ['冥貓神滅', ['暗', '幻'], [170, 185, 155, 170], { plan: 'beast', kind: 'lion', a: '#7a5aa0', b: '#e8c060', c: '#ff60ff' }, ['sb_destroy', 'sb_beam'], '只要打個噴嚏就能毀滅星球的破壞之神。', 1, 0],
  ['天使薇娜', ['光', '幻'], [170, 170, 165, 185], { plan: 'angel', a: '#e8f0ff', b: '#6080e0', c: '#a0e0ff' }, ['sb_angel', 'sb_wave'], '破壞之神的老師，宇宙最強的天使。', 1, 1],
  ['黃金武神', ['光', '鬥'], [175, 190, 160, 180], { head: 'human', spiky: 1, hair: '#ffe040', a: '#2a4aa0', b: '#f0f0f0', c: '#ffe060', skin: '#f6d4b4', weapon: 'ki', aura: '#ffe040', top: '#2a4aa0' }, ['sb_gold', 'sb_wave', 'sb_rush'], '全身燃燒金色氣焰的傳說武神。', 1, 1],
  ['星珠神龍', ['光', '木'], [200, 180, 180, 160], { plan: 'dragon', a: '#40a060', b: '#f0d040', c: '#ff4040', wing: 0 }, ['sb_wish', 'xy_pearl'], '集齊七顆星珠時出現的神龍，能實現一個願望。', 1, 0],
];
const SB0 = 1230, SB_ID = sagaIds(SB0, SB_LIST);
sagaSpecies(SB0, SB_LIST, '星珠武道篇');
for (const id of Object.values(SB_ID)) MONS[id].side = true;
THEME.starorb = Object.assign({}, THEME.huaguo, { g: '#c8b878', g2: '#b8a868', path: '#e8d8a8', tree: '#8a7a50', tree2: '#5a4a30', gh: '#f0e0a0', obst: 'rock', liq: null, wx: 'green' });
LIGHT.starorb = ['255,230,180', 0.1];
BBG.starorb = { sky: ['#60a0f0', '#fff0c8'], hill: ['#c8a870', '#8a6a40'], ground: ['#d8c088', '#a88850'], plat: ['#f0e0a8', '#a08050'], tuft: '#8aa050' };
MAP_SONG.starorb = 'route';
makeSaga({
  map: 'starorb', name: '星珠武道篇', theme: 'starorb', flag: 'sb', short: '星珠武道篇', ids: SB_ID, joinWord: '認可了你的實力',
  title: n => '武者 ' + n, foeLook: { hair: '#1a1a20', shirt: '#f08020', pants: '#2a4aa0' },
  guard: { hair: '#1a1a20', shirt: '#f0a040', pants: '#2a2a2a' }, guardName: '武道館門生',
  helper: { name: '仙豆婆婆', look: { hair: '#e8e8e8', shirt: '#6a8a4a', pants: '#3a4a2a' } },
  stages: [
    { boss: '力丸', place: '天下武道會・預賽', minion: ['鬥'], line: ['我是武道館的大師兄力丸！', '預賽就讓你出局！'], win: ['哇……你比師父還強……'] },
    { boss: '白鶴仙師', place: '鶴仙山', minion: ['風', '鬥'], line: ['老夫的鶴拳，可不輸任何流派。'], win: ['好！第一顆星珠就交給你吧。'] },
    { team: ['機械兵R1', '機械兵R2'], place: '紅蠍軍團基地', minion: ['鋼'], line: ['偵測到入侵者。', '執行排除程序。'], win: ['系統……當機……'] },
    { boss: '傭兵巴羅', place: '外星飛船', minion: ['鬥', '暗'], line: ['戰鬥力只有……五？', '……等等，數字一直在升高！'], win: ['測量器……爆掉了……'] },
    { boss: '綠魔卡爾', place: '神之神殿', minion: ['暗', '幻'], line: ['我是魔族的戰士。', '你們休想拿到星珠！'], win: ['……也許，我們可以當朋友。'] },
    { boss: '月夜巨猿', place: '滿月荒野', minion: ['鬥', '地'], line: ['（滿月升起，一隻巨猿發出了怒吼！）'], win: ['（月亮被雲遮住，巨猿變回了一隻小猴子。）'] },
    { boss: '冰皇凍羅', place: '冰之星', minion: ['冰', '暗'], line: ['呵呵呵……我的戰鬥力是五十三萬。', '星珠，全部交出來。'], win: ['不可能……我是宇宙的帝王……'] },
    { team: ['人造人零號', '人造人壹號'], place: '紅蠍研究所', minion: ['鋼'], line: ['我們是永遠不會累的人造人。'], win: ['……能量耗盡。'] },
    { boss: '蟲帝甲羅', place: '完美競技場', minion: ['木', '暗'], line: ['我要吸收你的力量，成為完美的存在！'], win: ['怎麼會……完美的我……'] },
    { boss: '泡泡魔人', place: '魔人城', minion: ['幻'], line: ['嘿嘿嘿！把你們全部變成糖果！'], win: ['肚子餓了……不想打了……'] },
    { boss: '冥貓神滅', place: '破滅神殿', minion: ['暗'], line: ['……吵死了，誰把我吵醒的？', '先陪我活動一下筋骨吧。'], win: ['有意思……這個星球就不破壞了。'] },
    { boss: '天使薇娜', place: '天使之島', minion: ['光', '幻'], line: ['哎呀，你們居然打贏了滅大人？', '那就讓我也來試試吧。'], win: ['呵呵，好久沒這麼開心了。'] },
    { boss: '黃金武神', place: '天下武道會・決賽', minion: ['光', '鬥'], line: ['我是傳說中的黃金武神。', '最後一顆星珠，就在我手上——來拿吧！'], win: ['……星珠是你的了。去召喚神龍吧！'] },
    { boss: '星珠神龍', place: '星珠祭壇', minion: ['光'], line: ['（七顆星珠一起發光，天空暗了下來……）', '「吾乃星珠神龍。想要願望……先證明你的力量！」'], win: ['「說出你的願望吧……」', '「……和夥伴們永遠在一起？好，吾就實現它。」'] },
  ],
  npcs: H0 => [
    { id: 'sbashu', x: 3, y: H0 - 3, dir: 'right', look: { hair: '#1a1a20', shirt: '#f08020', pants: '#2a4aa0' }, name: '阿修', talk: async () => { healParty(); await say(['七顆星珠集齊的話，就能召喚神龍實現願望！', '我們一起變強吧！（隊伍完全恢復了！）'], { name: '阿修' }); } },
    { id: 'sbgran', x: 8, y: H0 - 3, dir: 'left', look: { hair: '#e8e8e8', shirt: '#6a8a4a', pants: '#3a4a2a' }, name: '仙豆婆婆', talk: async () => { healParty(); const i = sagaNext('starorb'); await say(['吃顆仙豆吧，體力馬上就回來了。（隊伍完全恢復了！）', i < 0 ? '星珠神龍已經實現了你的願望。' : `下一個對手在「${SAGAS.starorb.stages[i].place}」。`], { name: '仙豆婆婆' }); } },
  ],
  intro: async () => {
    await chapterCard('星珠武道篇', '集齊七顆星珠，召喚神龍');
    await say(['傳說只要集齊散落世界的七顆「星珠」，就能召喚神龍實現一個願望。', '一年一度的天下武道會開始了，強者們都在追尋星珠。']);
    await say(['你也想要星珠嗎？我叫阿修！', '我們一起變強，一起去找星珠吧！'], { name: '阿修' });
    const m = makeMon(SB_ID['阿修'], Math.max(5, sagaBase() - 5)); S.dex.seen[m.id] = true; S.dex.caught[m.id] = true;
    const w = addMon(m); jingle('caught'); await say(`阿修加入了${w === 'box' ? '靈匣' : '隊伍'}！`);
    await say('想離開時，按 X 打開選單選「番外篇」→「離開番外篇」。');
  },
  finale: async () => {
    setFlag('sbEnd'); S.money += 500000; addItem('fuseCore', 5);
    await fadeOut(600); fade = 0;
    await chapterCard('願望', '星珠神龍實現了你的願望');
    await fadeIn(300);
    await say(['七顆星珠化作七道光，飛向世界各地。', '一年後，牠們會再次聚集……', '（獲得了 $500000 和 融合晶石 ×5！星珠武道篇完成！）']);
  },
});

// ---------- 彩虹幼稚園篇（原創搞笑日常）----------
const KD_LIST = [
  ['小樂', ['幻', '鬥'], [115, 125, 115, 135], { plan: 'kid', a: '#f04040', b: '#f0d040', c: '#ffd040', hair: '#1a1a1a', hs: 'bowl', mouth: 'grin', prop: 'cape', brows: 1 }, ['kd_prank', 'kd_tease'], '彩虹幼稚園最調皮的五歲小子，最愛惡作劇。', 0, 1],
  ['阿肥', ['地', '鬥'], [150, 120, 130, 90], { plan: 'kid', a: '#40a0f0', b: '#3a3a6a', c: '#ffd040', hair: '#3a2a1a', hs: 'buzz', mouth: 'o', prop: 'snack', fat: 1 }, ['kd_belly', 'kd_snack'], '隔壁班的小胖，口袋裡永遠有零食。', 0, 1],
  ['鴿子大王', ['風', '鬥'], [120, 125, 110, 150], { plan: 'bird', a: '#a0a8b8', b: '#606a7a', c: '#a0ff80' }, ['kd_peck', 'kd_flock'], '公園裡最兇的鴿子，帶著一大群小弟。', 0, 0],
  ['林老師', ['光', '幻'], [135, 125, 130, 125], { head: 'human', hs: 'bun', a: '#f0a0c0', b: '#ffffff', c: '#ffd0e0', skin: '#fbe0d0', hair: '#3a2a1a', weapon: 'book', long: 1, skirt: 22 }, ['kd_lecture', 'kd_whistle'], '溫柔但生氣起來很可怕的班導師。', 0, 1],
  ['旺財', ['地', '暗'], [125, 135, 115, 145], { plan: 'beast', kind: 'wolf', a: '#c89050', b: '#f0e0c0', c: '#ff6040' }, ['kd_bark', 'tg_bite'], '巷子口的大狗，看到小孩就追。', 0, 0],
  ['試吃阿姨', ['火', '木'], [140, 125, 125, 120], { head: 'human', hs: 'bun', a: '#f0c040', b: '#c03030', c: '#ff8040', skin: '#f6d4b4', hair: '#6a3a1a', weapon: 'gourd', gourd: '#f08040', long: 1 }, ['kd_sample', 'kd_snack'], '超市的試吃阿姨，誰都逃不過她的熱情。', 0, 1],
  ['鴨鴨隊長', ['水'], [125, 120, 120, 140], { plan: 'bird', a: '#f0e040', b: '#f08020', c: '#80e0ff' }, ['kd_splash', 'kd_peck'], '戲水池裡的塑膠鴨鴨隊長。', 0, 0],
  ['阿虎', ['鬥', '火'], [135, 145, 120, 135], { plan: 'kid', a: '#303030', b: '#2a2a2a', c: '#ff6040', hair: '#c03020', hs: 'spiky', mouth: 'smirk', prop: 'bat', brows: 1 }, ['kd_punch', 'kd_tease'], '大班的孩子王，溜滑梯是他的地盤。', 0, 1],
  ['恐龍玩偶', ['木', '鬥'], [145, 135, 130, 110], { plan: 'dino', a: '#60c060', b: '#f0f0a0', c: '#ff8040' }, ['kd_stomp', 'kd_roar'], '玩具間裡會動的恐龍玩偶。', 0, 0],
  ['玩具店老闆', ['鋼', '幻'], [140, 130, 140, 115], { head: 'human', hs: 'monk', brow: '#3a3a3a', beard: '#5a4a3a', a: '#6a8ac0', b: '#f0c040', c: '#ffe080', skin: '#f0d0b0', weapon: 'umbrella' }, ['kd_toybox', 'kd_robot'], '玩具店的老闆，店裡的玩具都聽他的。', 0, 1],
  ['鋼琴老師', ['幻', '光'], [135, 130, 125, 135], { head: 'human', hs: 'lady', a: '#2a2a3a', b: '#ffffff', c: '#e0e0ff', skin: '#fbe0d0', hair: '#1a1018', weapon: 'pipa', long: 1, skirt: 22 }, ['kd_piano', 'tg_pipa'], '才藝班的鋼琴老師，琴聲能讓人睡著。', 0, 1],
  ['小剛', ['鬥', '風'], [135, 140, 120, 150], { plan: 'kid', a: '#ffffff', b: '#c03030', c: '#f0d040', hair: '#1a1a1a', hs: 'buzz', mouth: 'grin', prop: 'flag' }, ['kd_relay', 'kd_punch'], '運動會對手班的隊長，跑超快。', 0, 1],
  ['小慧', ['幻', '水'], [140, 135, 130, 140], { plan: 'kid', a: '#f080c0', b: '#4060a0', c: '#ffe0f0', hair: '#3a1a10', hs: 'pig', mouth: 'smile', prop: 'bag' }, ['kd_scold', 'kd_tease'], '小樂的姊姊，管弟弟管得最嚴。', 0, 1],
  ['閃電俠客', ['雷', '光'], [150, 155, 140, 155], { head: 'human', hs: 'short', a: '#f0d040', b: '#c02020', c: '#fff080', skin: '#f6d4b4', hair: '#1a1a24', top: '#c02020', cape: '#2040c0', weapon: 'ki', armor: '#f0d040', aura: '#fff080', zap: 1 }, ['kd_hero', 'kd_beam'], '小朋友最愛的電視英雄。', 0, 1],
  ['夢魔大王布布', ['暗', '幻'], [190, 175, 160, 150], { plan: 'eldritch', a: '#6a3a9a', b: '#ffb0e0', c: '#ffe040' }, ['kd_nightmare', 'kd_pillow'], '出現在小朋友惡夢裡的大魔王。', 1, 0],
];
const KD0 = 1260, KD_ID = sagaIds(KD0, KD_LIST);
sagaSpecies(KD0, KD_LIST, '彩虹幼稚園篇');
for (const id of Object.values(KD_ID)) MONS[id].side = true;
THEME.kinder = Object.assign({}, THEME.huaguo, { g: '#9ad870', g2: '#8ac860', path: '#f0d8a8', tree: '#50b050', tree2: '#2a8a3a', gh: '#d0ff90', obst: null, liq: null, wx: 'green' });
LIGHT.kinder = ['255,250,220', 0.06];
BBG.kinder = { sky: ['#80c8ff', '#fff8e0'], hill: ['#80d070', '#50a050'], ground: ['#a8e080', '#70b050'], plat: ['#f0e8b0', '#c0a060'], tuft: '#50a040' };
MAP_SONG.kinder = 'route';
makeSaga({
  map: 'kinder', name: '彩虹幼稚園篇', theme: 'kinder', flag: 'kd', short: '彩虹幼稚園篇', ids: KD_ID, joinWord: '變成了你的好朋友',
  title: n => n, foeLook: { hair: '#3a2a1a', shirt: '#f0d040', pants: '#4060a0' },
  guard: { hair: '#3a2a1a', shirt: '#80c0ff', pants: '#f0d040', hat: '#f0d040' }, guardName: '小朋友',
  helper: { name: '園長爺爺', look: { hair: '#e8e8e8', shirt: '#a0d080', pants: '#5a7a4a' } },
  stages: [
    { boss: '阿肥', place: '沙坑', minion: ['地'], line: ['這個沙坑是我的！', '想玩的話，先打贏我！'], win: ['好啦……一起玩……分你一塊餅乾。'] },
    { boss: '鴿子大王', place: '公園', minion: ['風'], line: ['（咕咕咕！一大群鴿子包圍了你！）'], win: ['（鴿子們叼走了麵包屑，飛走了。）'] },
    { boss: '林老師', place: '教室', minion: ['光'], line: ['小樂！上課不可以亂跑！', '……還有你，你是哪一班的？'], win: ['唉……你們這些孩子真是……好啦，下課吧。'] },
    { boss: '旺財', place: '巷子口', minion: ['地', '暗'], line: ['（汪汪汪汪！）'], win: ['（旺財搖著尾巴，舔了你一口。）'] },
    { boss: '試吃阿姨', place: '超市', minion: ['火', '木'], line: ['小朋友～來試吃喔！', '不吃完不准走喔～'], win: ['哎呀，被你們吃光了！好厲害！'] },
    { boss: '鴨鴨隊長', place: '戲水池', minion: ['水'], line: ['（呱呱！塑膠鴨鴨排成一排衝過來！）'], win: ['（鴨鴨們翻肚漂走了。）'] },
    { boss: '阿虎', place: '溜滑梯', minion: ['鬥', '火'], line: ['溜滑梯是大班的地盤！', '小班的滾開！'], win: ['……你、你很厲害嘛。以後一起溜吧。'] },
    { boss: '恐龍玩偶', place: '玩具間', minion: ['木'], line: ['（玩具間的恐龍玩偶突然動了起來！嗷嗚！）'], win: ['（恐龍玩偶倒下，發條停了。）'] },
    { boss: '玩具店老闆', place: '玩具店', minion: ['鋼'], line: ['想要我店裡的限量機器人？', '先跟我的玩具們比一場！'], win: ['好吧好吧，送你一個！'] },
    { boss: '鋼琴老師', place: '才藝班', minion: ['幻'], line: ['今天要學的是……催眠曲。', '睡吧～睡吧～'], win: ['呼……你們居然沒睡著。'] },
    { boss: '小剛', place: '運動會', minion: ['鬥', '風'], line: ['大隊接力，我們班一定贏！'], win: ['輸了……可是好開心！'] },
    { boss: '小慧', place: '小樂的家', minion: ['幻', '水'], line: ['小樂！你又把我的娃娃藏起來了對不對！', '你朋友也一起處罰！'], win: ['……算了，這次原諒你們。'] },
    { boss: '閃電俠客', place: '電視台攝影棚', minion: ['雷', '光'], line: ['正義的閃電俠客參上！', '小朋友們，跟我比一場吧！'], win: ['哈哈哈！你們才是真正的英雄！'] },
    { boss: '夢魔大王布布', place: '夢中世界', minion: ['暗', '幻'], line: ['（那天晚上，小樂做了一個好可怕的夢……）', '「嘿嘿嘿……小孩子，最怕黑了吧？」'], win: ['「嗚……怎麼會有不怕惡夢的小孩……」', '（天亮了。小樂醒來，抱著你說：「我們把大魔王打跑了！」）'] },
  ],
  npcs: H0 => [
    { id: 'kdle', x: 3, y: H0 - 3, dir: 'right', look: { hair: '#1a1a1a', shirt: '#f04040', pants: '#f0d040' }, name: '小樂', talk: async () => { healParty(); await say(['嘿嘿嘿！今天要去哪裡玩？', '（小樂請你喝了一瓶果汁。隊伍完全恢復了！）'], { name: '小樂' }); } },
    { id: 'kdgrand', x: 8, y: H0 - 3, dir: 'left', look: { hair: '#e8e8e8', shirt: '#a0d080', pants: '#5a7a4a' }, name: '園長爺爺', talk: async () => { healParty(); const i = sagaNext('kinder'); await say(['呵呵呵，小朋友們今天也很有精神。（隊伍完全恢復了！）', i < 0 ? '小樂說你是他最好的朋友喔。' : `小樂說下一個要去「${SAGAS.kinder.stages[i].place}」玩。`], { name: '園長爺爺' }); } },
  ],
  intro: async () => {
    await chapterCard('彩虹幼稚園篇', '最調皮的五歲小子，最熱鬧的每一天');
    await say(['這裡是彩虹小鎮的「彩虹幼稚園」。', '園裡有一個超級調皮的五歲小子……']);
    await say(['嘿嘿嘿！大哥哥／大姊姊，你要不要跟我一起玩？', '我是小樂！今天要去沙坑、公園、超市……好多地方！'], { name: '小樂' });
    const m = makeMon(KD_ID['小樂'], Math.max(5, sagaBase() - 5)); S.dex.seen[m.id] = true; S.dex.caught[m.id] = true;
    const w = addMon(m); jingle('caught'); await say(`小樂加入了${w === 'box' ? '靈匣' : '隊伍'}！`);
    await say('想離開時，按 X 打開選單選「番外篇」→「離開番外篇」。');
  },
  finale: async () => {
    setFlag('kdEnd'); S.money += 300000; addItem('fuseCore', 3);
    await fadeOut(600); fade = 0;
    await chapterCard('彩虹的一天', '小樂和朋友們又度過了熱鬧的一天');
    await fadeIn(300);
    await say(['夕陽下，小樂揮著手說：「明天也要一起玩喔！」', '（獲得了 $300000 和 融合晶石 ×3！彩虹幼稚園篇完成！）']);
  },
});

// ---------- 主線新神獸 24 隻：散落在各個地圖 ----------
const NL0 = 1300;
const NEW_LEGENDS = [
  ['鳳凰', ['火', '光'], 'bird', { a: '#ff5030', b: '#ffd040', c: '#fff080' }, '不死的神鳥，浴火重生。'],
  ['應龍', ['風', '雷'], 'dragon', { a: '#e0c050', b: '#6a4a20', c: '#fff0a0', zap: 1 }, '長著翅膀的神龍，曾助黃帝擊敗蚩尤。'],
  ['燭龍', ['火', '暗'], 'serpent', { a: '#c02020', b: '#ffd040', c: '#ff8040' }, '睜眼為晝、閉眼為夜的赤色巨龍。'],
  ['饕餮', ['暗', '地'], 'demon', { a: '#8a6a3a', b: '#3a2a1a', c: '#ff4040', horncol: '#e8d8a0' }, '貪吃到把自己身體都吃掉的凶獸。'],
  ['窮奇', ['暗', '風'], 'beast', { kind: 'lion', wings: 1, a: '#2a2a34', b: '#8a2020', c: '#ff4040', mane: 1 }, '長著翅膀的凶虎，四凶之一。'],
  ['檮杌', ['地', '鬥'], 'beast', { kind: 'lion', a: '#6a4a2a', b: '#c8a070', c: '#ffb040', mane: 1, pat: 'scale' }, '人面虎身的凶獸，四凶之一。'],
  ['白澤', ['光', '幻'], 'beast', { kind: 'horse', horn: 2, a: '#f4f4f8', b: '#a0c0e0', c: '#c0e0ff' }, '通曉萬物的祥獸，能說人話。'],
  ['鯤鵬', ['水', '風'], 'whale', { a: '#3a6ab0', b: '#e0f0ff', c: '#80e0ff' }, '北冥之魚，化而為鳥，其翼若垂天之雲。'],
  ['畢方', ['火', '風'], 'bird', { a: '#4060c0', b: '#ff4030', c: '#ffd040' }, '只有一隻腳的火之神鳥。'],
  ['獬豸', ['光', '鬥'], 'beast', { kind: 'horse', horn: 1, a: '#2a2a3a', b: '#c0a060', c: '#ffe080' }, '能分辨善惡、用獨角頂撞惡人的神獸。'],
  ['貔貅', ['地', '光'], 'beast', { kind: 'lion', a: '#e0b040', b: '#8a5a20', c: '#ffe060', mane: 1, wings: 1 }, '只進不出、招財進寶的瑞獸。'],
  ['夔牛', ['雷', '地'], 'beast', { kind: 'horse', horn: 2, a: '#5a6a7a', b: '#2a3a4a', c: '#a0e0ff', zap: 1 }, '一足的雷獸，皮做成的鼓聲傳五百里。'],
  ['相柳', ['水', '暗'], 'orochi', { a: '#3a7a5a', b: '#a0e0c0', c: '#ffe040' }, '九頭蛇身的凶神，所到之處都成了沼澤。'],
  ['帝江', ['幻', '光'], 'eldritch', { a: '#f0c040', b: '#e04040', c: '#ffffa0' }, '沒有臉、會唱歌跳舞的混沌神鳥。'],
  ['英招', ['風', '光'], 'beast', { kind: 'horse', wings: 1, a: '#e8a040', b: '#3a2a1a', c: '#fff0a0', pat: 'spot' }, '虎紋馬身、鳥翼人面的天神。'],
  ['陸吾', ['光', '地'], 'beast', { kind: 'lion', a: '#f0d080', b: '#8a4a20', c: '#ffffa0', mane: 1 }, '守護崑崙山的虎身九尾神。'],
  ['開明獸', ['光', '鋼'], 'beast', { kind: 'lion', a: '#f4f4f0', b: '#c0a040', c: '#ffe080', mane: 1, wings: 1 }, '有九個頭、守著崑崙天門的神獸。'],
  ['精衛', ['水', '風'], 'bird', { a: '#5a5a7a', b: '#f0f0f0', c: '#ff6080' }, '銜西山之木石以填東海的小神鳥。'],
  ['重明鳥', ['光', '火'], 'bird', { a: '#ffd040', b: '#c03030', c: '#ffffff' }, '一隻眼睛有兩個瞳孔，能驅逐妖魔。'],
  ['當康', ['木', '地'], 'beast', { kind: 'wolf', a: '#a07a5a', b: '#f0e0c0', c: '#a0ff80' }, '叫聲預告豐收的瑞獸。'],
  ['乘黃', ['光', '幻'], 'fox', { a: '#f0c040', b: '#ffffff', c: '#ffe0a0' }, '背上有角的神狐，騎上牠能活兩千歲。'],
  ['天狗', ['暗', '火'], 'beast', { kind: 'wolf', a: '#1a1a24', b: '#c02020', c: '#ff6040', flame: 1 }, '會吞下月亮的凶犬。'],
  ['金烏', ['火', '光'], 'bird', { a: '#ffc020', b: '#ff6020', c: '#ffffa0' }, '住在太陽裡的三足神鳥。'],
  ['雷澤神', ['雷', '水'], 'dragon', { a: '#3a6ad0', b: '#a0d0ff', c: '#ffff80', wing: 0, zap: 1 }, '龍身人頭的雷神，拍肚子就會打雷。'],
];
NEW_LEGENDS.forEach(([n, t, plan, opts, desc], i) => {
  const id = NL0 + i, name = Object.keys(MONS).some(k => MONS[k].n === n) ? n + '神' : n;
  const tm = TYPE_MOVES[t[0]], tm2 = TYPE_MOVES[t[1] || t[0]];
  const ult = typeof ULT !== 'undefined' && ULT[t[0]] ? ULT[t[0]][0] : tm[2][0];
  const learn = [[1, tm[2][0]], [1, tm2[2][0]], [1, ult], [1, tm[1][0]], [1, tm2[1][0]]].filter((q, k, arr) => arr.findIndex(z => z[1] === q[1]) === k);
  MONS[id] = { n: name, t, b: [170 + (i % 4) * 5, 170 + (i % 3) * 8, 160 + (i % 5) * 4, 150 + (i % 4) * 8], cr: 3, xp: 400, h: '5.0 m', w: '500.0 kg', hab: '', desc: '傳說中的神獸。' + desc, big: true, art: Object.assign({ plan, s: 4 }, opts), learn };
  SPRITES[id] = (c, tt) => drawPlan(c, id, tt);
});
{
  const skip = new Set(['mickey', 'xiyou', 'huaguo', ...Object.keys(SAGAS)]);
  const maps = Object.keys(MAPS).filter(k => !skip.has(k) && MAPS[k].wild && MAPS[k].wild.length && MAPS[k].rows)
    .map(k => ({ k, lv: Math.max(...MAPS[k].wild.map(w => w[2] || w[1] || 1)) })).sort((a, b) => a.lv - b.lv);
  const OK = new Set(['.', ',']);
  const pick = [];
  for (let i = 0; i < NEW_LEGENDS.length && maps.length; i++) pick.push(maps[Math.min(maps.length - 1, Math.floor((i + 0.5) * maps.length / NEW_LEGENDS.length))]);
  const tryPlace = (k, lv, i) => {
    const m = MAPS[k], id = NL0 + i, used = new Set((m.npcs || []).map(n => n.x + ',' + n.y));
    const block = (x, y) => (m.exits || []).some(e => x >= e.x - 1 && x < e.x + e.w + 1 && y >= e.y - 1 && y < e.y + e.h + 1) || (m.triggers || []).some(e => x >= e.x && x < e.x + e.w && y >= e.y && y < e.y + e.h);
    let best = null, bd = 1e9;
    const MH = m.rows.length, MW = m.rows[0].length;
    for (let y = 2; y < MH - 2; y++) for (let x = 2; x < MW - 2; x++) {
      let ok = true;
      for (let dy = -1; dy <= 1 && ok; dy++) for (let dx = -1; dx <= 1 && ok; dx++) { const ch = (m.rows[y + dy] || '')[x + dx]; if (!OK.has(ch) || used.has((x + dx) + ',' + (y + dy)) || block(x + dx, y + dy)) ok = false; }
      if (!ok) continue;
      const d = Math.abs(x - MW / 2) + Math.abs(y - MH / 2) + ((x * 7 + y * 3 + i) % 5);
      if (d < bd) { bd = d; best = [x, y]; }
    }
    if (!best) return false;
    const L = Math.min(LEVEL_CAP, lv + 10), M = MONS[id];
    M.hab = m.name || k;
    m.npcs = m.npcs || [];
    const n = { id: 'nl' + id, x: best[0], y: best[1], dir: 'down', legend: id, name: M.n, cond: () => !flag('legend' + id), talk: () => legendBattle(id, L, [`四周的空氣突然凝結……`, `傳說中的神獸「${M.n}」出現了！`]) };
    n._home = [n.x, n.y]; m.npcs.push(n);
    return true;
  };
  pick.forEach(({ k, lv }, i) => {
    if (tryPlace(k, lv, i)) return;
    const j0 = maps.findIndex(q => q.k === k);
    for (let d = 1; d < maps.length; d++) for (const j of [j0 + d, j0 - d]) if (maps[j] && tryPlace(maps[j].k, maps[j].lv, i)) return;
  });
}

// ---------- 選單：番外篇整理成一個子選單 ----------
const SIDE_LIST = [
  ['米老鼠班道館', 'mickey', () => enterSide()],
  ['西遊記序章：大鬧天宮', 'tiangong', () => sagaEnter('tiangong')],
  ['西遊記篇：取經之路', 'xiyou', () => enterXiyou()],
  ['西遊記篇：取經之路・續', 'xiyou2', () => sagaEnter('xiyou2')],
  ['忍者番外篇：影之里', 'ninja', () => sagaEnter('ninja')],
  ['星珠武道篇', 'starorb', () => sagaEnter('starorb')],
  ['彩虹幼稚園篇', 'kinder', () => sagaEnter('kinder')],
];
async function leaveAnySide() {
  if (S.map === 'mickey') return leaveSide();
  if (S.map === 'xiyou') return leaveXiyou();
  return sagaLeave();
}
async function sideMenu() {
  const inSide = SIDE_LIST.some(q => q[1] === S.map);
  const items = SIDE_LIST.map(q => q[0] + (q[1] === S.map ? '（目前在這裡）' : ''));
  if (inSide) items.unshift('離開番外篇');
  const c = await choose(items, { title: '番外篇', w: 380, x: W / 2 - 190, y: 120, rowH: 36 });
  if (c < 0) return 0;
  if (inSide && c === 0) { await leaveAnySide(); return 'close'; }
  const q = SIDE_LIST[c - (inSide ? 1 : 0)];
  if (q[1] === S.map) return 0;
  // 從一個番外篇直接到另一個：保留原本主線的位置
  let back = null; if (inSide) back = S.map === 'mickey' ? S.sideBack : S.map === 'xiyou' ? S.xyBack : S.sagaBack;
  const ok = await q[2]();
  if (ok && back) S.sideBack = S.xyBack = S.sagaBack = back;
  return ok ? 'close' : 0;
}
async function mainMenu() {
  while (true) {
    const inSide = SIDE_LIST.some(q => q[1] === S.map), mid = S.party[0] && isDragonMon(S.party[0].id);
    const items = [
      ['夥伴', async () => { if (!S.party.length) { await say('你還沒有夥伴！'); return; } await partyMenu('view'); }],
      ['背包', () => bagMenu('field')],
      ['圖鑑', () => dexMenu()],
      ['世界地圖（傳送）', async () => { if (!flag('gotStarter')) { await say('先去研究所領取夥伴吧！'); return; } return (await worldMap()) ? 'close' : 0; }],
      [inSide ? '番外篇（離開／切換）' : '番外篇', () => sideMenu()],
      [`幻靈融合／分離（晶石 ${(S.bag.fuseCore || 0)}／${(S.bag.splitCore || 0)}）`, () => fuseMenu()],
      [`坐騎：${S.ride === false ? '關' : '開'}${mid ? '' : '（第一隻要是龍）'}`, async () => { S.ride = S.ride === false; if (S.ride && !mid) await say(['把一隻「龍」排在隊伍第一位，就能騎著牠移動，速度也會變快！', '（夥伴 → 選一隻龍 → 移到第一位）']); }],
      ['任務', () => questMenu()],
      ['提示', async () => { await hintPage(); return 'close'; }],
      ['存檔', async () => { saveGame(); await wait(300); }],
      ['聲音設定', () => soundPanel()],
      [zoomLabel(), () => cycleZoom()],
      [S.hintsOff ? '提示框：關' : '提示框：開', () => { S.hintsOff = !S.hintsOff; }],
      ['回到主選單（冒險／塔防／小畫家）', async () => { const k = await choose(['存檔並回主選單', '取消'], { w: 300, x: W / 2 - 150, y: 220 }); if (k !== 0) return; saveGame(true); hubOpen(); return 'close'; }],
      ['關閉', () => 'close'],
    ];
    const seals = Object.keys(S.flags).filter(f => /^stage\d+$/.test(f)).length + (S.badges || 0);
    const c = await choose(items.map(q => q[0]), { title: `${S.name}　$${S.money}　道館 ${seals}/100`, w: 360, x: W - 380, y: 8, rowH: 34, maxRows: 15 });
    if (c < 0) return;
    if ((await items[c][1]()) === 'close') return;
  }
}
TIPS.push('主線的各個地圖新出現了 24 隻神獸，像鳳凰、應龍、鯤鵬、白澤……找找看牠們在哪裡！');
TIPS.push('按 X →「番外篇」，可以選米老鼠班、西遊記、忍者、星珠武道、彩虹幼稚園。');
