// ===== 人魚、騎士重新精修 =====

// ---------- 人魚 ----------
PLANS.mermaid = function (c, t, o) {
  const skin = o.skin || '#fbe0cc', hair = o.hair || o.b, sway = Math.sin(t * 1.8), s = o.s || 2, OL = 'rgba(20,10,30,0.7)';
  c.save(); c.translate(0, Math.sin(t * 2) * 1.5);
  // 氣泡
  for (let i = 0; i < 6; i++) { const p = (t * 0.3 + i / 6) % 1, x = -30 + i * 12 + Math.sin(t * 2 + i) * 3, y = 40 - p * 100; c.globalAlpha = (1 - p) * 0.8; G.circle(c, x, y, 1.4 + (i % 3), 'rgba(220,250,255,0.25)', 'rgba(255,255,255,0.8)', 0.5); c.globalAlpha = 1; }
  // 後髮：一束一束飄動
  for (let i = 0; i < 7; i++) {
    const k = (i - 3) / 3, w = Math.sin(t * 1.6 + i * 0.7) * 3, x0 = k * 8, L = 34 + (3 - Math.abs(i - 3)) * 4;
    const g = c.createLinearGradient(0, -40, 0, -40 + L + 10); g.addColorStop(0, sh(hair, 0.15)); g.addColorStop(1, sh(hair, -0.35));
    c.fillStyle = g; c.strokeStyle = OL; c.lineWidth = 0.5;
    c.beginPath(); c.moveTo(x0 - 5, -36); c.bezierCurveTo(x0 + k * 14 - 6, -24, x0 + k * 20 + w - 4, -12, x0 + k * 24 + w, -36 + L); c.bezierCurveTo(x0 + k * 18 + w + 3, -14, x0 + k * 10 + 5, -24, x0 + 5, -36); c.closePath(); c.fill(); c.stroke();
  }
  // 魚尾
  const tp = [[0, 6], [4, 18], [14, 28], [28, 32], [40, 26 + sway * 3]];
  const tail = A.body(c, tp, u => 11.5 * (1 - u * 0.86) + 1, o.a);
  A.scales(c, tail, 'rgba(255,255,255,0.32)', 1, 3);
  c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(-6, 10); c.bezierCurveTo(0, 24, 16, 30, 38, 24 + sway * 3); c.stroke();
  // 尾鰭（半透明、有鰭條）
  const ex = 40, ey = 26 + sway * 3, fl = Math.sin(t * 2.4) * 4;
  for (const d of [-1, 1]) {
    const g = c.createLinearGradient(ex, ey, ex + 26, ey + d * 18); g.addColorStop(0, sh(o.c, 0.1)); g.addColorStop(1, 'rgba(255,255,255,0.25)');
    c.fillStyle = g; c.strokeStyle = OL; c.lineWidth = 0.6;
    c.beginPath(); c.moveTo(ex - 2, ey); c.bezierCurveTo(ex + 8, ey + d * 6, ex + 18, ey + d * (20 + fl), ex + 28, ey + d * (22 + fl)); c.quadraticCurveTo(ex + 20, ey + d * 8, ex + 22, ey + d * 2); c.quadraticCurveTo(ex + 10, ey, ex - 2, ey); c.fill(); c.stroke();
    c.strokeStyle = 'rgba(255,255,255,0.5)'; c.lineWidth = 0.5; for (let k = 1; k <= 4; k++) { c.beginPath(); c.moveTo(ex + 2, ey + d); c.quadraticCurveTo(ex + 10 + k * 3, ey + d * (k * 3), ex + 14 + k * 3.4, ey + d * (6 + k * 4 + fl * k / 4)); c.stroke(); }
  }
  // 腰鰭
  for (const d of [-1, 1]) { c.fillStyle = 'rgba(255,255,255,0.35)'; c.strokeStyle = OL; c.lineWidth = 0.5; c.beginPath(); c.moveTo(d * 8, 8); c.quadraticCurveTo(d * 20, 8 + sway, d * 18, 18); c.quadraticCurveTo(d * 12, 14, d * 8, 13); c.fill(); c.stroke(); }
  // 腰間：鱗片邊與珍珠腰鍊
  c.fillStyle = sh(o.a, 0.25); for (let i = -3; i <= 3; i++) { c.beginPath(); c.arc(i * 2.6, 6, 2, 0, Math.PI); c.fill(); }
  for (let i = -4; i <= 4; i++) G.circle(c, i * 2.2, 4.4 + Math.abs(i) * 0.25, 1.1, '#fff8f0', 'rgba(120,100,120,0.6)', 0.3);
  // 上身
  const g = c.createLinearGradient(-9, -16, 9, 6); g.addColorStop(0, sh(skin, 0.3)); g.addColorStop(1, sh(skin, -0.15));
  c.fillStyle = g; c.strokeStyle = OL; c.lineWidth = 0.7; c.beginPath(); c.moveTo(-6.5, -16); c.quadraticCurveTo(-9, -10, -6, -4); c.quadraticCurveTo(-5, 0, -7.5, 5); c.lineTo(7.5, 5); c.quadraticCurveTo(5, 0, 6, -4); c.quadraticCurveTo(9, -10, 6.5, -16); c.closePath(); c.fill(); c.stroke();
  // 貝殼胸衣
  for (const d of [-1, 1]) {
    const sg = c.createRadialGradient(d * 3.6, -9.5, 0.5, d * 3.6, -8.5, 4.6); sg.addColorStop(0, '#ffffff'); sg.addColorStop(1, o.c);
    c.fillStyle = sg; c.strokeStyle = OL; c.lineWidth = 0.5; c.beginPath(); c.moveTo(d * 0.6, -6.4); c.quadraticCurveTo(d * 0.4, -12.6, d * 3.8, -12.4); c.quadraticCurveTo(d * 7.4, -12, d * 7, -6.4); c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = 'rgba(120,60,80,0.4)'; for (let k = 0; k < 4; k++) { c.beginPath(); c.moveTo(d * 3.8, -6.6); c.lineTo(d * (1.4 + k * 1.7), -11.8 + Math.abs(k - 1.5) * 0.4); c.stroke(); }
  }
  // 項鍊
  for (let i = 0; i < 9; i++) { const a = Math.PI * (0.2 + i * 0.075); G.circle(c, Math.cos(a) * 5.6, -18.6 + Math.sin(a) * 4, 0.8, '#fff8f0'); }
  G.circle(c, 0, -14.4, 1.4, o.c, OL, 0.3);
  // 手臂：一手撫髮、一手持三叉戟或海螺
  A.body(c, [[-6.5, -15], [-13, -10], [-11, -22]], [1.9, 1.3], skin); G.circle(c, -10.6, -23.5, 1.6, skin, OL, 0.4);
  if (s >= 2) {
    c.save(); c.translate(15, -6); c.rotate(0.1);
    c.fillStyle = metalGrad(c, -1, 0, 1, 0, '#d8b850'); c.fillRect(-0.9, -36, 1.8, 74);
    c.save(); c.shadowColor = o.c; c.shadowBlur = 8; c.strokeStyle = '#f8e070'; c.lineWidth = 1.4; c.lineCap = 'round';
    c.beginPath(); c.moveTo(-6, -46); c.lineTo(-6, -38); c.quadraticCurveTo(0, -33, 6, -38); c.lineTo(6, -46); c.moveTo(0, -50); c.lineTo(0, -35); c.stroke();
    for (const x of [-6, 0, 6]) { c.fillStyle = '#fff8c0'; c.beginPath(); c.moveTo(x - 1.4, x === 0 ? -49 : -45); c.lineTo(x, x === 0 ? -53 : -49); c.lineTo(x + 1.4, x === 0 ? -49 : -45); c.fill(); }
    c.restore(); G.circle(c, 0, -34, 1.8, o.c); c.restore();
    A.body(c, [[6.5, -15], [12, -8], [15, -12]], [1.9, 1.3], skin); G.circle(c, 15, -12, 1.7, skin, OL, 0.4);
  } else {
    A.body(c, [[6.5, -15], [12, -6], [10, 2]], [1.9, 1.3], skin);
    const cg = c.createLinearGradient(6, -2, 16, 6); cg.addColorStop(0, '#fff4f0'); cg.addColorStop(1, '#f0a0b0');
    c.fillStyle = cg; c.strokeStyle = OL; c.lineWidth = 0.5; c.beginPath(); c.moveTo(7, 0); c.quadraticCurveTo(16, -4, 17, 4); c.quadraticCurveTo(12, 8, 7, 4); c.closePath(); c.fill(); c.stroke();
  }
  // 頭、耳鰭
  A.body(c, [[0, -17], [0, -14]], [2.2, 2.4], skin);
  for (const d of [-1, 1]) { c.fillStyle = sh(o.c, 0.2); c.strokeStyle = OL; c.lineWidth = 0.4; c.beginPath(); c.moveTo(d * 6.4, -23); c.quadraticCurveTo(d * 13, -28, d * 12, -18); c.quadraticCurveTo(d * 9, -21, d * 6.4, -20); c.fill(); c.stroke(); for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(d * 6.8, -21.4); c.lineTo(d * (11 + k * 0.4), -26 + k * 3); c.stroke(); } }
  faceHuman(c, 0, -22, 8, skin, hair, o.c);
  // 瀏海、睫毛、腮紅、嘴唇
  c.fillStyle = sh(hair, 0.05); c.beginPath(); c.moveTo(-7.4, -24); c.quadraticCurveTo(-6, -31, 0, -31); c.quadraticCurveTo(6, -31, 7.4, -24); c.quadraticCurveTo(4, -28, 1, -26); c.quadraticCurveTo(-2, -28.6, -4, -26); c.quadraticCurveTo(-6, -27, -7.4, -24); c.fill();
  c.strokeStyle = '#2a1420'; c.lineWidth = 0.6; for (const d of [-1, 1]) { const ex2 = d < 0 ? -3 : 2.7; c.beginPath(); c.moveTo(ex2 - 2, -23.4); c.quadraticCurveTo(ex2, -24.6, ex2 + 2, -23.4); c.stroke(); c.beginPath(); c.moveTo(ex2 + d * 1.8, -23.6); c.lineTo(ex2 + d * 2.8, -24.6); c.stroke(); }
  c.fillStyle = 'rgba(255,120,150,0.35)'; c.beginPath(); c.ellipse(-5, -19.6, 1.6, 0.9, 0, 0, 7); c.ellipse(5, -19.6, 1.6, 0.9, 0, 0, 7); c.fill();
  c.fillStyle = '#e8506c'; c.beginPath(); c.ellipse(0, -16.8, 1.3, 0.6, 0, 0, 7); c.fill();
  // 頭冠
  if (s >= 2) {
    c.save(); c.shadowColor = '#fff0a0'; c.shadowBlur = s >= 3 ? 8 : 3;
    G.poly(c, [-6, -29, -7, -35, -3.4, -32, -1.4, -38, 0, -33, 1.4, -38, 3.4, -32, 7, -35, 6, -29], '#f4cc58', '#8a6010', 0.5);
    c.restore(); G.circle(c, 0, -32.4, 1.3, o.c);
  } else { G.circle(c, -6, -28, 2.2, '#ffb0c0', OL, 0.4); G.circle(c, -6, -28, 0.9, '#fff0a0'); }
  c.save(); c.shadowColor = o.c; c.shadowBlur = 10; G.circle(c, -11, -25.5, 2.4, sh(o.c, 0.5)); c.restore();
  c.restore();
};

// ---------- 騎士 ----------
PLANS.knight = function (c, t, o) {
  const s = o.s || 2, b = Math.sin(t * 2) * 0.8, OL = 'rgba(10,6,14,0.85)', gold = o.trim || '#e8c050';
  c.save(); c.translate(0, b);
  // 披風
  if (s >= 2) {
    const cp = Math.sin(t * 2) * 3;
    const cg = c.createLinearGradient(-30, 0, 30, 0); cg.addColorStop(0, sh(o.b, -0.4)); cg.addColorStop(0.5, o.b); cg.addColorStop(1, sh(o.b, -0.5));
    c.fillStyle = cg; c.strokeStyle = OL; c.lineWidth = 0.8;
    c.beginPath(); c.moveTo(-14, -24); c.lineTo(14, -24); c.bezierCurveTo(28, -4, 30 + cp, 22, 30 + cp, 44); c.quadraticCurveTo(20 + cp, 40, 12 + cp, 45); c.quadraticCurveTo(0, 40, -12 + cp, 45); c.quadraticCurveTo(-20 + cp, 40, -30 + cp, 44); c.bezierCurveTo(-30 + cp, 22, -28, -4, -14, -24); c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = gold; c.lineWidth = 1.2; c.beginPath(); c.moveTo(-30 + cp, 43); c.quadraticCurveTo(-20 + cp, 39, -12 + cp, 44); c.quadraticCurveTo(0, 39, 12 + cp, 44); c.quadraticCurveTo(20 + cp, 39, 30 + cp, 43); c.stroke();
    c.strokeStyle = 'rgba(0,0,0,0.25)'; c.lineWidth = 0.8; for (const x of [-16, -4, 8, 20]) { c.beginPath(); c.moveTo(x * 0.5, -18); c.quadraticCurveTo(x * 0.9, 10, x + cp * 0.6, 40); c.stroke(); }
  }
  // 腿：腿甲、膝甲、鐵靴
  for (const d of [-1, 1]) {
    A.body(c, [[d * 6, 12], [d * 8, 26], [d * 9, 38]], [5, 4], '#3a3a48');
    armor(c, [[d * 3, 13], [d * 12, 13], [d * 12, 25], [d * 4, 25]], o.a, 0.25);
    armor(c, [[d * 4, 30], [d * 13, 29], [d * 12, 40], [d * 6, 41]], o.a, 0.25);
    armor(c, [[d * 4, 23], [d * 9, 21], [d * 14, 24], d > 0 ? [10, 30] : [-10, 30], [d * 3, 28]], o.a, 0.35);
    G.circle(c, d * 9, 25.5, 1.8, gold, OL, 0.4);
    armor(c, [[d * 4, 40], [d * 13, 39], [d * 19, 44], [d * 3, 45]], sh(o.a, -0.1), 0.15);
  }
  // 草摺（裙甲）
  for (let i = -2; i <= 2; i++) armor(c, [[i * 5 - 3, 4], [i * 5 + 3, 4], [i * 5 + 3.4 + i * 0.6, 15], [i * 5 - 3.4 + i * 0.6, 15]], i % 2 ? sh(o.a, -0.1) : o.a, 0.2);
  c.strokeStyle = gold; c.lineWidth = 0.8; c.beginPath(); c.moveTo(-14, 14.6); c.quadraticCurveTo(0, 16, 14, 14.6); c.stroke();
  // 胸甲
  armor(c, [[-15, -24], [0, -27], [15, -24], [14, -8], [11, 4], [0, 6], [-11, 4], [-14, -8]], o.a, 0.22);
  for (const d of [-1, 1]) { c.strokeStyle = 'rgba(255,255,255,0.5)'; c.lineWidth = 0.9; c.beginPath(); c.moveTo(d * 2, -22); c.quadraticCurveTo(d * 12, -21, d * 12, -10); c.stroke(); c.strokeStyle = 'rgba(0,0,0,0.3)'; c.beginPath(); c.moveTo(d * 2, -10); c.quadraticCurveTo(d * 10, -8, d * 11, -2); c.stroke(); }
  c.strokeStyle = gold; c.lineWidth = 1.2; c.beginPath(); c.moveTo(-15, -24); c.quadraticCurveTo(0, -28, 15, -24); c.stroke(); c.beginPath(); c.moveTo(0, -26); c.lineTo(0, 5); c.stroke();
  // 胸前紋章
  c.save(); c.shadowColor = o.c; c.shadowBlur = 8; G.star(c, 0, -13, 4, 5, 1.8, 0, o.c); c.restore();
  G.circle(c, 0, -13, 1.6, '#ffffff');
  // 腰帶
  c.fillStyle = '#4a2a1a'; c.strokeStyle = OL; c.lineWidth = 0.6; c.beginPath(); c.roundRect(-12, 1.6, 24, 4, 1.5); c.fill(); c.stroke();
  G.rr(c, -3, 1, 6, 5, 1, gold, OL, 0.5);
  // 手臂
  const arm = (d) => {
    A.body(c, [[d * 15, -21], [d * 20, -10], [d * 22, 0]], [5, 4.2], '#3a3a48');
    armor(c, [[d * 15, -17], [d * 22, -17], [d * 23, -8], [d * 17, -8]], o.a, 0.25);
    armor(c, [[d * 16, -9], [d * 21, -11], [d * 25, -6], [d * 21, -2]], o.a, 0.3);
    armor(c, [[d * 18, -4], [d * 25, -4], [d * 26, 5], [d * 19, 5]], o.a, 0.25);
    armor(c, [[d * 18, 4], [d * 26, 4], [d * 26, 9], [d * 19, 10]], sh(o.a, -0.2), 0.3);
  };
  arm(-1); arm(1);
  // 劍
  c.save(); c.translate(23, 7); c.rotate(0.28);
  c.save(); c.shadowColor = o.c; c.shadowBlur = s >= 3 ? 14 : 6;
  const bg = c.createLinearGradient(-3, 0, 3, 0); bg.addColorStop(0, '#ffffff'); bg.addColorStop(0.5, '#d8e0f0'); bg.addColorStop(1, sh(o.c, -0.1));
  c.fillStyle = bg; c.strokeStyle = OL; c.lineWidth = 0.5; c.beginPath(); c.moveTo(-2.8, -4); c.lineTo(-2.4, -50); c.lineTo(0, -56); c.lineTo(2.4, -50); c.lineTo(2.8, -4); c.closePath(); c.fill(); c.stroke();
  c.restore();
  c.strokeStyle = 'rgba(120,130,160,0.7)'; c.lineWidth = 0.6; c.beginPath(); c.moveTo(0, -6); c.lineTo(0, -50); c.stroke();
  c.fillStyle = metalGrad(c, -10, -6, 10, -2, gold); c.beginPath(); c.moveTo(-11, -5); c.quadraticCurveTo(0, -1, 11, -5); c.lineTo(10, -2); c.quadraticCurveTo(0, 1, -10, -2); c.closePath(); c.fill(); c.stroke();
  c.fillStyle = '#4a2a1a'; c.fillRect(-1.4, -1, 2.8, 9); G.circle(c, 0, 9, 2.2, gold, OL, 0.4); G.circle(c, 0, -3.4, 1.4, o.c);
  c.restore();
  // 盾
  if (o.shield !== 0) {
    c.save(); c.translate(-24, 4);
    const sg = c.createLinearGradient(-12, -14, 12, 16); sg.addColorStop(0, sh(o.b, 0.35)); sg.addColorStop(0.5, o.b); sg.addColorStop(1, sh(o.b, -0.45));
    c.fillStyle = sg; c.strokeStyle = OL; c.lineWidth = 0.9; c.beginPath(); c.moveTo(-12, -15); c.quadraticCurveTo(0, -18, 12, -15); c.quadraticCurveTo(13, 6, 0, 20); c.quadraticCurveTo(-13, 6, -12, -15); c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = metalGrad(c, -12, -15, 12, 20, gold); c.lineWidth = 2; c.beginPath(); c.moveTo(-10.5, -13.4); c.quadraticCurveTo(0, -16, 10.5, -13.4); c.quadraticCurveTo(11, 5, 0, 17.6); c.quadraticCurveTo(-11, 5, -10.5, -13.4); c.closePath(); c.stroke();
    c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(0, -12); c.lineTo(0, 13); c.moveTo(-7, -4); c.lineTo(7, -4); c.stroke();
    c.save(); c.shadowColor = o.c; c.shadowBlur = 8; G.star(c, 0, -4, 5, 5, 2.2, -1.57, o.c); c.restore();
    rivets(c, [[-8, -11], [8, -11], [0, 14], [-9, 2], [9, 2]]);
    c.fillStyle = 'rgba(255,255,255,0.25)'; c.beginPath(); c.ellipse(-5, -8, 3, 6, -0.3, 0, 7); c.fill();
    c.restore();
  }
  // 肩甲（三層）
  for (const d of [-1, 1]) for (let k = 2; k >= 0; k--) armor(c, [[d * 10, -28 + k * 3], [d * (20 + k), -30 + k * 3.4], [d * (26 + k), -22 + k * 3.4], [d * (22 + k), -16 + k * 3], [d * 12, -20 + k * 3]], k ? sh(o.a, -0.1 * k) : o.a, 0.32);
  for (const d of [-1, 1]) { c.strokeStyle = gold; c.lineWidth = 1; c.beginPath(); c.moveTo(d * 11, -27.6); c.quadraticCurveTo(d * 21, -30, d * 25.6, -22.4); c.stroke(); }
  // 頭盔
  A.body(c, [[0, -26], [0, -23]], [4.4, 4.4], '#3a3a48');
  armor(c, [[-9, -24], [-10, -36], [-6, -43], [0, -45], [6, -43], [10, -36], [9, -24], [4, -21], [-4, -21]], o.a, 0.2);
  c.fillStyle = '#0a0a12'; c.beginPath(); c.moveTo(-8, -33); c.quadraticCurveTo(0, -35, 8, -33); c.lineTo(7.6, -30.6); c.quadraticCurveTo(0, -32.2, -7.6, -30.6); c.closePath(); c.fill();
  c.save(); c.shadowColor = o.c; c.shadowBlur = 8; c.fillStyle = o.c; c.beginPath(); c.moveTo(-6.4, -32.4); c.quadraticCurveTo(0, -33.8, 6.4, -32.4); c.lineTo(6, -31.4); c.quadraticCurveTo(0, -32.6, -6, -31.4); c.closePath(); c.fill(); c.restore();
  c.strokeStyle = 'rgba(0,0,0,0.5)'; c.lineWidth = 0.6; for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(i * 2.2, -28.6); c.lineTo(i * 2.2, -24); c.stroke(); }
  c.strokeStyle = gold; c.lineWidth = 1.2; c.beginPath(); c.moveTo(0, -45); c.lineTo(0, -34.6); c.stroke();
  c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.ellipse(-4, -39, 2.4, 1.2, -0.5, 0, 7); c.fill();
  // 羽飾
  const pw = Math.sin(t * 2.4) * 3;
  for (let i = 0; i < 5; i++) {
    const g = c.createLinearGradient(0, -46, 26, -40); g.addColorStop(0, sh(o.c, 0.3)); g.addColorStop(1, i % 2 ? o.b : o.c);
    c.fillStyle = g; c.strokeStyle = OL; c.lineWidth = 0.4;
    c.beginPath(); c.moveTo(-1, -45); c.bezierCurveTo(6, -54 + i, 18 + pw, -54 + i * 2, 26 + pw + i, -40 + i * 3); c.bezierCurveTo(16 + pw, -46 + i * 2, 8, -46 + i, 1, -43); c.closePath(); c.fill(); c.stroke();
  }
  if (s >= 3) { c.save(); c.shadowColor = gold; c.shadowBlur = 8; for (const d of [-1, 1]) G.poly(c, [d * 8, -40, d * 16, -50, d * 12, -38], gold, OL, 0.4); c.restore(); }
  c.restore();
};
