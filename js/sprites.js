// ===== 怪物造型：依照原畫以向量繪製（100 單位方框，中心為原點，地面約 y=45）=====

const G = {
  circle(c, x, y, r, fill, stroke, lw) { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); G.fs(c, fill, stroke, lw); },
  ell(c, x, y, rx, ry, fill, stroke, lw, rot = 0) { c.beginPath(); c.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); G.fs(c, fill, stroke, lw); },
  poly(c, pts, fill, stroke, lw) { c.beginPath(); c.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) c.lineTo(pts[i], pts[i + 1]); c.closePath(); G.fs(c, fill, stroke, lw); },
  rr(c, x, y, w, h, r, fill, stroke, lw) { c.beginPath(); c.roundRect(x, y, w, h, r); G.fs(c, fill, stroke, lw); },
  line(c, pts, stroke, lw, cap = 'round') { c.beginPath(); c.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) c.lineTo(pts[i], pts[i + 1]); c.strokeStyle = stroke; c.lineWidth = lw; c.lineCap = cap; c.lineJoin = 'round'; c.stroke(); },
  curve(c, pts, stroke, lw) { // 二次曲線：起點 + (控制, 終點)*n
    c.beginPath(); c.moveTo(pts[0], pts[1]);
    for (let i = 2; i < pts.length; i += 4) c.quadraticCurveTo(pts[i], pts[i + 1], pts[i + 2], pts[i + 3]);
    c.strokeStyle = stroke; c.lineWidth = lw; c.lineCap = 'round'; c.stroke();
  },
  fs(c, fill, stroke, lw) { if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw || 2; c.stroke(); } },
  rg(c, x, y, r, c1, c2) { const g = c.createRadialGradient(x, y - r * 0.4, r * 0.1, x, y, r); g.addColorStop(0, c1); g.addColorStop(1, c2); return g; },
  lg(c, x1, y1, x2, y2, c1, c2) { const g = c.createLinearGradient(x1, y1, x2, y2); g.addColorStop(0, c1); g.addColorStop(1, c2); return g; },
  glow(c, color, blur) { c.shadowColor = color; c.shadowBlur = blur; },
  noGlow(c) { c.shadowBlur = 0; },
  dot(c, x, y, r, col = '#1a1410') { G.circle(c, x, y, r, col); },
  smile(c, x, y, r, col, lw, a0 = 0.15, a1 = 0.85) { c.beginPath(); c.arc(x, y, r, Math.PI * a0, Math.PI * a1); c.strokeStyle = col; c.lineWidth = lw; c.lineCap = 'round'; c.stroke(); },
  frown(c, x, y, r, col, lw) { c.beginPath(); c.arc(x, y + r, r, Math.PI * 1.2, Math.PI * 1.8); c.strokeStyle = col; c.lineWidth = lw; c.lineCap = 'round'; c.stroke(); },
  star(c, x, y, n, r1, r2, rot, fill, stroke, lw) {
    const p = [];
    for (let i = 0; i < n * 2; i++) { const r = i % 2 ? r2 : r1, a = rot + i * Math.PI / n; p.push(x + Math.cos(a) * r, y + Math.sin(a) * r); }
    G.poly(c, p, fill, stroke, lw);
  },
  teeth(c, x0, x1, y, h, n, col, dir = 1) { // dir 1 = 向下長, -1 = 向上長
    const w = (x1 - x0) / n;
    for (let i = 0; i < n; i++) G.poly(c, [x0 + i * w, y, x0 + (i + 1) * w, y, x0 + (i + 0.5) * w, y + h * dir], col, '#5a4a3a', 0.8);
  },
  sparkles(c, t, col, n = 8, R = 45) {
    for (let i = 0; i < n; i++) {
      const a = i * 2.39 + t * 0.4, r = R * (0.5 + 0.5 * ((i * 37) % 10) / 10);
      const tw = 0.5 + 0.5 * Math.sin(t * 3 + i * 1.7);
      c.globalAlpha = tw * 0.9; G.star(c, Math.cos(a) * r, Math.sin(a) * r * 0.8 - 5, 4, 3 * tw + 1, 0.8, 0, col); c.globalAlpha = 1;
    }
  },
};

const SPRITES = {
  // 1 冠捲甜靈
  1(c, t) {
    G.glow(c, '#ffcc66', 18);
    for (let i = 0; i < 7; i++) {
      const a = Math.PI * (1.08 + i * 0.14), x = Math.cos(a) * 30, y = -16 + Math.sin(a) * 28;
      if (i % 2) G.ell(c, x, y, 7, 10, '#f2eadb', '#8a9a80', 1.5, a);
      G.circle(c, x * 1.1, y * 1.05 - 2, 8, null, '#6b3a18', 4.5);
    }
    G.noGlow(c);
    G.poly(c, [-11, 4, 11, 4, 26, 38, -26, 38], G.lg(c, 0, 4, 0, 38, '#5a3418', '#3a200e'), '#c89850', 1.5);
    G.ell(c, 0, 36, 27, 6, '#efe0c0', '#c8a870', 1);
    G.ell(c, -8, 42, 5, 4, '#3a200e'); G.ell(c, 8, 42, 5, 4, '#3a200e');
    G.circle(c, 0, 8, 4, '#e8b830', '#8a5a10', 1);
    G.poly(c, [0, -44, -29, 8, 29, 8], G.lg(c, 0, -44, 0, 8, '#fbf3df', '#e6d6b0'), '#6b3d1e', 3.5);
    G.line(c, [-6, -16, -6, -8], '#e0b020', 2.5); G.line(c, [6, -16, 6, -8], '#e0b020', 2.5);
    G.smile(c, 0, -6, 7, '#e0b020', 2.5);
    G.glow(c, '#ffd040', 10);
    G.poly(c, [-9, -44, -11, -54, -5, -49, 0, -58, 5, -49, 11, -54, 9, -44], '#f0c030', '#8a6010', 1.2);
    G.ell(c, 0, -49, 2, 3, '#fff6a0'); G.noGlow(c);
    G.sparkles(c, t, '#ffe7a0');
  },
  // 2 柚輪觸心
  2(c, t) {
    c.globalAlpha = 0.5;
    for (let i = 0; i < 4; i++) G.curve(c, [-20 + i * 12, 40, -40 + i * 20 + Math.sin(t + i) * 8, 10, -20 + i * 14, -30], '#5fcf4a', 1.2);
    c.globalAlpha = 1;
    G.glow(c, '#ff9a30', 20);
    c.beginPath(); c.moveTo(6, -48);
    c.bezierCurveTo(30, -40, 34, 0, 20, 22); c.bezierCurveTo(10, 36, -12, 34, -22, 18);
    c.bezierCurveTo(-30, 0, -26, -22, -10, -30); c.quadraticCurveTo(0, -36, 6, -48);
    G.fs(c, G.rg(c, 0, -5, 40, 'rgba(255,190,90,0.95)', 'rgba(230,110,20,0.85)'), '#ffb050', 1.5);
    const sw = Math.sin(t * 1.5) * 4;
    G.curve(c, [-16, 6, -40, 12 + sw, -32, 30], '#ff9a30', 4);
    G.curve(c, [18, 8, 36, 20 - sw, 26, 38], '#ff9a30', 4);
    G.noGlow(c);
    G.circle(c, -5, -12, 13, '#fff0c8', '#ff8a1e', 3);
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + t * 0.5; G.line(c, [-5, -12, -5 + Math.cos(a) * 11, -12 + Math.sin(a) * 11], '#ff8a1e', 1.5); }
    G.dot(c, 13, -10, 2.4); G.line(c, [9, -2, 17, -3], '#3a1a08', 1.6);
    G.glow(c, '#80ff60', 16);
    G.circle(c, -32, 32, 11, 'rgba(60,140,40,0.85)', '#a8ff80', 2.5);
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 - t; G.line(c, [-32, 32, -32 + Math.cos(a) * 9, 32 + Math.sin(a) * 9], '#d8ffb0', 1.3); }
    G.noGlow(c);
  },
  // 3 星輪懸偶
  3(c, t) {
    G.ell(c, 0, 44, 30, 6, 'rgba(60,180,255,0.25)');
    G.curve(c, [16, -40, 24, -52, 10, -50], '#5a6a7a', 4);
    G.poly(c, [-20, -2, -50, -14, -36, 18], G.lg(c, -50, -14, -20, 10, '#2a5a9a', '#4a8ad0'), '#7ff0ff', 1.5);
    G.poly(c, [20, -2, 50, -14, 36, 18], G.lg(c, 50, -14, 20, 10, '#2a5a9a', '#4a8ad0'), '#7ff0ff', 1.5);
    G.rr(c, -18, -4, 36, 32, 4, '#1c4a5a', '#c8a050', 2);
    G.circle(c, 0, 12, 8, null, '#5af0ff', 1.2);
    G.poly(c, [-3, 7, 3, 7, 0, 12], '#5af0ff'); G.poly(c, [-3, 17, 3, 17, 0, 12], '#5af0ff');
    for (const x of [-12, 0, 12]) {
      const L = x ? 12 : 16;
      G.line(c, [x, 28, x, 28 + L], '#c8a050', 1.5);
      G.glow(c, '#4aa0ff', 12); G.circle(c, x, 33 + L, 5.5, G.rg(c, x, 33 + L, 6, '#c0e8ff', '#2a60d0'), '#c8a050', 1); G.noGlow(c);
    }
    G.circle(c, 0, -22, 22, '#0d2c48', '#c8a050', 3);
    G.glow(c, '#40ffd0', 14);
    G.star(c, 0, -22, 8, 19, 7, t * 0.6, G.rg(c, 0, -22, 19, '#d0fff0', '#30c8a0'), '#a0fff0', 1);
    G.noGlow(c);
    G.dot(c, -4, -24, 1.6); G.dot(c, 4, -24, 1.6); G.frown(c, 0, -19, 3, '#1a2a2a', 1.4);
  },
  // 4 橘鋼戰車獸
  4(c, t) {
    G.rr(c, -44, 30, 88, 14, 7, '#2a2420', '#5a4a40', 2);
    for (let i = 0; i < 6; i++) G.circle(c, -36 + i * 14.5, 37, 4, '#4a3e36', '#8a7060', 1);
    for (let i = 0; i < 5; i++) G.line(c, [-14 + i * 7, -44, -14 + i * 7, -16], '#c8641e', 2.5);
    G.line(c, [-16, -44, 16, -44], '#c8641e', 3); G.line(c, [-16, -30, 16, -30], '#a85014', 2);
    G.rr(c, -30, -16, 60, 48, 8, G.lg(c, 0, -16, 0, 32, '#d8782a', '#8a4010'), '#4a2008', 2);
    for (let i = 0; i < 6; i++) G.dot(c, -26 + i * 10.4, -12, 1.4, '#ffd0a0');
    G.circle(c, 0, 6, 13, G.rg(c, 0, 6, 13, '#f0a050', '#c05a14'), '#4a2008', 2);
    G.dot(c, -4, 3, 2); G.dot(c, 4, 3, 2); G.smile(c, 0, 6, 6, '#2a1004', 2);
    for (const s of [-1, 1]) {
      const x = s * 36;
      G.circle(c, x, 10, 16, G.rg(c, x, 10, 16, '#c8641e', '#6a3008'), '#3a1804', 2);
      G.circle(c, x + s * 3, 11, 10, '#1a0804');
      for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5; G.poly(c, [x + s * 3 + Math.cos(a) * 10, 11 + Math.sin(a) * 10, x + s * 3 + Math.cos(a + 0.3) * 10, 11 + Math.sin(a + 0.3) * 10, x + s * 3 + Math.cos(a + 0.15) * 5, 11 + Math.sin(a + 0.15) * 5], '#e8e0d0'); }
      G.glow(c, '#ff6020', 14); G.circle(c, x + s * 3, 11, 3 + Math.sin(t * 8) * 1, '#ffb040'); G.noGlow(c);
    }
    c.globalAlpha = 0.8;
    for (let i = 0; i < 6; i++) { const k = (t * 1.3 + i * 0.37) % 1; G.circle(c, Math.sin(i * 7) * 40, 30 - k * 70, 1.5, '#ff9a30'); }
    c.globalAlpha = 1;
  },
  // 5 青窗載靈
  5(c, t) {
    for (const [x, y] of [[-28, 38], [-10, 41], [8, 41], [22, 38]]) G.ell(c, x, y, 9, 6, '#3a4aa0', '#1a2050', 1.5);
    G.rr(c, -38, -6, 64, 42, 18, G.rg(c, -10, 10, 40, '#6a7ad8', '#2c3a90'), '#141a50', 2);
    c.globalAlpha = 0.3; for (let i = 0; i < 5; i++) G.smile(c, -26 + i * 11, 26, 5, '#c0c8ff', 1); c.globalAlpha = 1;
    G.rr(c, -24, 8, 4, 8, 2, '#141a40'); G.rr(c, -10, 8, 4, 8, 2, '#141a40'); G.line(c, [-22, 22, -10, 22], '#141a40', 2);
    G.rr(c, -30, -36, 50, 31, 3, '#1a3a24', '#c8a050', 2);
    G.poly(c, [-36, -34, -24, -50, 18, -50, 28, -34], G.lg(c, 0, -50, 0, -34, '#4aa050', '#1e5a28'), '#0e2a10', 1.5);
    G.glow(c, '#70ff90', 14);
    for (const x of [-25, -10, 5]) G.rr(c, x, -30, 12, 20, [6, 6, 1, 1], G.lg(c, 0, -30, 0, -10, '#c0ffc0', '#40c060'), '#c8a050', 1);
    G.noGlow(c);
    G.glow(c, '#b070ff', 20);
    c.globalAlpha = 0.9;
    c.beginPath(); c.moveTo(22, -22); c.quadraticCurveTo(44, -8, 36, 14); c.quadraticCurveTo(28, 6, 22, 10); c.closePath(); G.fs(c, 'rgba(150,100,230,0.8)');
    G.curve(c, [26, -10, 14, -6, 8 + Math.sin(t * 2) * 3, -16], '#9a6ae0', 4);
    G.circle(c, 32, -32, 11, G.rg(c, 32, -32, 11, '#e0d0ff', '#9070d0'), '#d0c0ff', 1);
    c.globalAlpha = 1; G.noGlow(c);
    G.rr(c, 28, -35, 2, 5, 1, '#2a1a50'); G.rr(c, 35, -35, 2, 5, 1, '#2a1a50'); G.line(c, [29, -27, 36, -27], '#2a1a50', 1.4);
    G.glow(c, '#c080ff', 14); G.rr(c, 30, 14, 9, 12, 3, '#6a3ab0', '#e0b050', 1); G.noGlow(c);
  },
  // 6 百符笑使
  6(c, t) {
    G.ell(c, 0, 44, 30, 5, 'rgba(255,140,40,0.3)');
    G.line(c, [-6, 28, -12, 43], '#c86818', 6); G.line(c, [6, 28, 12, 43], '#c86818', 6);
    G.curve(c, [-12, -8, -30, -8, -36, -24], '#2fb0a8', 4);
    G.curve(c, [12, -8, 30, -4, 38, -20], '#2fb0a8', 4);
    G.poly(c, [-14, -10, 14, -10, 24, 30, -24, 30], G.lg(c, 0, -10, 0, 30, '#f08a2a', '#b85410'), '#f8c060', 1.5);
    G.line(c, [0, -10, 0, 30], '#f8c060', 1.2); G.rr(c, -14, 6, 28, 4, 1, '#2fb0a8');
    G.ell(c, 0, -26, 17, 17, '#c86818');
    G.ell(c, 0, -24, 12, 15, G.rg(c, 0, -24, 15, '#ffffff', '#e8e0c8'), '#5a4a30', 1.5);
    G.smile(c, -5, -27, 3, '#1a1008', 1.8, 1.1, 1.9); G.smile(c, 5, -27, 3, '#1a1008', 1.8, 1.1, 1.9);
    G.smile(c, 0, -22, 7, '#1a1008', 2, 0.1, 0.9);
    for (let i = 0; i < 6; i++) {
      const a = t * 0.8 + i * Math.PI / 3, x = Math.cos(a) * 40, y = -10 + Math.sin(a) * 26;
      c.save(); c.translate(x, y); c.rotate(Math.sin(t + i) * 0.4);
      G.glow(c, '#ffa030', 10); G.rr(c, -5, -7, 10, 14, 1.5, '#f0a030', '#7a3a08', 1); G.noGlow(c);
      G.line(c, [-2, -3, 2, -3, 2, 3, -2, 3], '#7a3a08', 1);
      c.restore();
    }
  },
  // 7 六七方殼獸
  7(c, t) {
    G.ell(c, -14, 38, 7, 6, '#e6d0a8', '#8a7050', 1); G.ell(c, 10, 38, 7, 6, '#e6d0a8', '#8a7050', 1);
    G.ell(c, -36, 2, 10, 4.5, '#e6d0a8', '#8a7050', 1, -0.2); G.ell(c, 32, 0, 10, 4.5, '#e6d0a8', '#8a7050', 1, 0.2);
    G.poly(c, [-28, -22, -18, -32, 30, -32, 20, -22], '#5a8ae8', '#16306a', 1.5);
    G.poly(c, [20, -22, 30, -32, 30, 22, 20, 32], '#1e4290', '#16306a', 1.5);
    G.rr(c, -28, -22, 48, 54, 4, G.rg(c, -4, 4, 40, '#4a7ad8', '#24489a'), '#16306a', 2);
    c.globalAlpha = 0.25; for (let i = 0; i < 4; i++) G.circle(c, -20 + i * 13, 26 - (i % 2) * 6, 4, null, '#a0c0ff', 1); c.globalAlpha = 1;
    G.rr(c, -21, -15, 34, 30, 6, G.rg(c, -4, 0, 22, '#fff2d8', '#ead2a8'), '#14306a', 1.5);
    for (const x of [-11, 3]) { G.ell(c, x, -4, 3.2, 4.4, '#1a1410'); G.dot(c, x + 1, -6, 1.2, '#fff'); }
    G.ell(c, -15, 3, 3, 2, 'rgba(255,120,120,0.6)'); G.ell(c, 8, 3, 3, 2, 'rgba(255,120,120,0.6)');
    c.beginPath(); c.arc(-4, 2, 5, 0, Math.PI); c.closePath(); G.fs(c, '#d04a40', '#5a1a10', 1);
    c.font = 'bold 13px serif'; c.fillStyle = '#d8e0f0'; c.strokeStyle = '#2a3a5a'; c.lineWidth = 1.5;
    const by = Math.sin(t * 2) * 1.5;
    c.strokeText('67', -22, -31 + by); c.fillText('67', -22, -31 + by); c.strokeText('67', 4, -33 - by); c.fillText('67', 4, -33 - by);
    c.font = 'bold 9px serif'; c.fillText('67', -24, 28); c.fillText('67', 4, 28);
  },
  // 8 巨顎方門獸
  8(c, t) {
    const jaw = Math.sin(t * 1.2) * 4;
    G.glow(c, '#9a50ff', 22);
    c.beginPath(); c.moveTo(14, 4); c.bezierCurveTo(50, -10, 56, 20, 40, 34); c.bezierCurveTo(30, 44, 46, 50, 50, 46);
    c.strokeStyle = '#5a2a50'; c.lineWidth = 16; c.lineCap = 'round'; c.stroke();
    c.strokeStyle = '#8a4a78'; c.lineWidth = 5; c.stroke();
    G.noGlow(c);
    G.rr(c, -42, -14 - jaw, 58, 30 + jaw * 2, 3, '#140818');
    G.rr(c, -44, -38 - jaw, 62, 24, 4, G.lg(c, 0, -38, 0, -14, '#8a6a70', '#4a3040'), '#2a1828', 2);
    G.poly(c, [18, -38 - jaw, 26, -30 - jaw, 26, -12 - jaw, 18, -14 - jaw], '#3a2430', '#2a1828', 1);
    G.teeth(c, -40, 14, -14 - jaw, 13, 6, '#efe0c0', 1);
    G.rr(c, -46, 14 + jaw, 64, 20, 4, G.lg(c, 0, 14, 0, 34, '#7a5a62', '#3a2232'), '#2a1828', 2);
    G.teeth(c, -42, 14, 14 + jaw, 13, 7, '#efe0c0', -1);
    c.globalAlpha = 0.7; for (let i = 0; i < 5; i++) G.line(c, [-36 + i * 11, -12 - jaw, -36 + i * 11, -2 + ((t * 20 + i * 7) % 14)], '#c0d8ff', 1); c.globalAlpha = 1;
    G.line(c, [-14, -38 - jaw, -14, -48 - jaw], '#6a4a58', 4);
    G.circle(c, -14, -52 - jaw, 7, '#efe0c0', '#2a1828', 1.5); G.circle(c, -14, -52 - jaw, 3, '#a02020'); G.dot(c, -14, -52 - jaw, 1.4);
  },
  // 9 裂口藍魔
  9(c, t) {
    for (const p of [[-14, 16, -30, 44], [-4, 20, -12, 44], [8, 20, 14, 44], [16, 16, 32, 44]]) G.curve(c, [p[0], p[1], (p[0] + p[2]) / 2 - 4, (p[1] + p[3]) / 2, p[2], p[3]], '#1a2460', 3.5);
    G.curve(c, [24, 2, 34, 0, 36, -10], '#1a2460', 4);
    c.save(); c.translate(38, -18); c.rotate(-0.3 + Math.sin(t * 3) * 0.1);
    G.rr(c, -8, -10, 16, 18, 3, '#2a3a8a', '#0e1440', 1.5); G.rr(c, -6, -6, 12, 10, 3, '#d04a8a');
    G.teeth(c, -6, 6, -6, 3, 4, '#fff', 1); c.restore();
    G.poly(c, [-16, -30, -22, -54, -6, -34], '#2a3a8a', '#0e1440', 1.5);
    G.poly(c, [8, -34, 18, -56, 22, -28], '#2a3a8a', '#0e1440', 1.5);
    G.ell(c, 0, -8, 30, 28, G.rg(c, -6, -14, 34, '#3a4ab0', '#141a58'), '#0a0e30', 2);
    G.rr(c, -28, -4, 56, 5, 2, '#e0e4f0');
    for (let i = 0; i < 7; i++) G.dot(c, -24 + i * 8, -1.5, 1, '#1a1a3a');
    G.ell(c, 0, 12, 24, 10, '#08061a');
    G.teeth(c, -24, 24, 3, 9, 8, '#f0f0f8', 1);
    G.teeth(c, -20, 20, 22, 7, 7, '#f0f0f8', -1);
    G.circle(c, 0, -20, 9, '#05040f', '#5a6ae0', 1);
    c.beginPath(); for (let a = 0; a < 12; a += 0.3) { const r = a * 0.7; c.lineTo(Math.cos(a + t * 2) * r, -20 + Math.sin(a + t * 2) * r); }
    c.strokeStyle = '#6a80ff'; c.lineWidth = 1; c.stroke();
  },
  // 10 噬厄哭偶
  10(c, t) {
    const o = Math.sin(t * 1.5) * 2;
    G.glow(c, '#9a50d0', 18);
    G.ell(c, -28, -4, 22, 32 + o, '#1a0e22', '#4a3050', 3);
    G.noGlow(c);
    for (let i = 0; i < 10; i++) {
      const a = Math.PI * 0.6 + i * 0.27, x = -28 + Math.cos(a) * 20, y = -4 + Math.sin(a) * (30 + o);
      const ix = -28 + Math.cos(a) * 12, iy = -4 + Math.sin(a) * 20;
      G.poly(c, [x - 2, y, x + 2, y, ix, iy], '#e8dcc0');
    }
    G.line(c, [-2, 26, -6, 44], '#a08860', 5); G.line(c, [8, 26, 12, 44], '#a08860', 5);
    G.rr(c, -6, -10, 18, 38, 6, G.lg(c, 0, -10, 0, 28, '#c8b088', '#8a7450'), '#4a3a20', 1.5);
    G.line(c, [-22, -6, 32, -6], '#6a4a28', 4);
    for (const [x, y] of [[-18, 8], [28, 8], [3, 12]]) {
      G.line(c, [x, -6, x, y - 6], '#8a7450', 1);
      G.circle(c, x, y, 6, '#3a2a30', '#c8a060', 1.2);
      G.line(c, [x - 3, y - 2, x - 1, y], '#c8a060', 1); G.line(c, [x - 1, y - 2, x - 3, y], '#c8a060', 1);
      G.line(c, [x + 1, y - 2, x + 3, y], '#c8a060', 1); G.line(c, [x + 3, y - 2, x + 1, y], '#c8a060', 1);
    }
    G.circle(c, 3, -26, 14, G.rg(c, 3, -26, 14, '#d8c098', '#9a8058'), '#4a3a20', 1.5);
    for (const x of [-3, 9]) { G.line(c, [x - 3, -32, x + 3, -26], '#1a1008', 2.2); G.line(c, [x + 3, -32, x - 3, -26], '#1a1008', 2.2); }
    G.frown(c, 3, -20, 4, '#1a1008', 2);
  },
  // 11 殼笑守靈
  11(c, t) {
    G.glow(c, '#ffd040', 24);
    G.ell(c, -14, 38, 9, 6, '#d0c4a0', '#8a7a50', 1); G.ell(c, 14, 38, 9, 6, '#d0c4a0', '#8a7a50', 1);
    G.ell(c, -30, 8, 8, 13, '#d0c4a0', '#8a7a50', 1, 0.4); G.ell(c, 30, 8, 8, 13, '#d0c4a0', '#8a7a50', 1, -0.4);
    G.ell(c, 0, 0, 30, 38, G.rg(c, -6, -8, 40, '#f0e8d0', '#b8a880'), '#e0b030', 2);
    G.noGlow(c);
    c.save(); c.beginPath(); c.ellipse(0, 0, 30, 38, 0, 0, Math.PI * 2); c.clip();
    for (let i = -3; i < 4; i++) G.curve(c, [-34, i * 14 - 10, 0, i * 14 + 10, 34, i * 14 - 4], '#e0b030', 2);
    c.restore();
    G.circle(c, 0, -14, 15, '#3a3020');
    G.poly(c, [-12, -22, -22, -32, -10, -14], '#8ac840', '#4a7020', 1); G.poly(c, [12, -22, 22, -32, 10, -14], '#8ac840', '#4a7020', 1);
    G.circle(c, 0, -14, 12, G.rg(c, -2, -16, 12, '#a8e060', '#5a9a28'), '#3a6018', 1);
    G.ell(c, -4, -17, 1.6, 2.4, '#1a2a08'); G.ell(c, 4, -17, 1.6, 2.4, '#1a2a08');
    G.smile(c, 0, -14, 5.5, '#1a2a08', 1.8);
    c.globalAlpha = 0.7; for (let i = 0; i < 3; i++) { const a = t * 0.7 + i * 2.1; G.ell(c, Math.cos(a) * 40, -20 + Math.sin(a) * 20, 3, 1.5, '#f8e070', null, 0, a); } c.globalAlpha = 1;
  },
  // 12 禮章幻靈
  12(c, t) {
    const w = t * 2;
    G.glow(c, '#40a0ff', 18);
    for (let i = 0; i < 4; i++) {
      const s = i < 2 ? -1 : 1, k = i % 2;
      G.curve(c, [-4 + s * 6, -18, -4 + s * (22 + k * 10), -30 + Math.sin(w + i) * 8, -4 + s * (18 + k * 16), -52 + k * 10 + Math.cos(w + i) * 5], 'rgba(80,170,255,0.9)', 5 - k);
    }
    G.ell(c, -4, -30, 15, 17, G.rg(c, -4, -34, 17, 'rgba(180,230,255,0.95)', 'rgba(40,130,240,0.9)'), '#a0e0ff', 1);
    G.noGlow(c);
    G.dot(c, -9, -33, 2, '#0a2a5a'); G.dot(c, 1, -33, 2, '#0a2a5a'); G.ell(c, -4, -24, 3.5, 5, '#0a2a5a');
    G.glow(c, '#b050ff', 16);
    G.curve(c, [24, 4, 40, -10 + Math.sin(w) * 5, 34, -26], '#9a40e0', 4);
    G.curve(c, [26, 20, 44, 18, 42, 2 + Math.cos(w) * 5], '#b060ff', 3);
    G.noGlow(c);
    G.poly(c, [16, -2, 30, -10, 30, 30, 16, 38], G.rg(c, 22, 14, 20, '#d070ff', '#4a1a8a'), '#20104a', 1.5);
    G.rr(c, -30, -2, 46, 40, 3, G.lg(c, 0, -2, 0, 38, '#3a5ad0', '#1e2e80'), '#0e1440', 2);
    G.poly(c, [-30, -2, -36, -14, -8, -12, 0, -2], '#3050c0', '#0e1440', 1.2);
    G.poly(c, [16, -2, 26, -16, 34, -10, 30, -2], '#3050c0', '#0e1440', 1.2);
    G.rr(c, -10, -2, 6, 40, 0, '#6ab0ff'); G.rr(c, -30, 6, 46, 4, 0, '#6ab0ff');
    G.ell(c, -14, 4, 8, 4, '#80c0ff', '#2a4aa0', 1, -0.3); G.ell(c, 0, 4, 8, 4, '#80c0ff', '#2a4aa0', 1, 0.3); G.circle(c, -7, 5, 3, '#c8a050');
    G.ell(c, -18, 22, 2, 3, '#ff80c0'); G.ell(c, 2, 22, 2, 3, '#ff80c0');
    c.beginPath(); c.arc(-8, 26, 5, 0, Math.PI); c.closePath(); G.fs(c, '#ff70a8');
  },
  // 13 蒼角武靈
  13(c, t) {
    const f = Math.sin(t * 2) * 2;
    G.line(c, [-3, 8, -14, 24, -8, 42], '#f0f4ec', 6); G.line(c, [-8, 36, -8, 43], '#e09020', 6);
    G.line(c, [3, 8, 16, 18, 12, 32], '#f0f4ec', 6); G.line(c, [13, 27, 12, 34], '#e09020', 6);
    G.line(c, [-8, -10, -24, -6 + f], '#f0f4ec', 4); G.line(c, [8, -10, 24, -8 - f], '#f0f4ec', 4);
    G.glow(c, '#3060ff', 12);
    G.poly(c, [-22, -12 + f, -46, 4 + f, -30, 6 + f, -26, -2 + f], '#2a40c0', '#90c0ff', 1.2);
    G.poly(c, [24, -16 - f, 42, -6 - f, 30, 8 - f, 22, -2 - f], null, '#5070ff', 4);
    G.noGlow(c);
    G.ell(c, 0, -2, 9, 14, G.rg(c, 0, -4, 14, '#ffffff', '#d0dcc8'), '#4a7a30', 1);
    G.curve(c, [-6, -8, 2, -2, -4, 8], '#3a9a30', 1.5); G.curve(c, [6, -10, -2, 0, 5, 6], '#3a9a30', 1.5);
    G.glow(c, '#4040ff', 14);
    G.curve(c, [-5, -36, -34, -46, -24, -76], '#2a30b0', 7); G.curve(c, [-5, -36, -34, -46, -24, -76], '#6a70ff', 2);
    G.curve(c, [5, -36, 34, -46, 24, -76], '#2a30b0', 7); G.curve(c, [5, -36, 34, -46, 24, -76], '#6a70ff', 2);
    G.noGlow(c);
    G.poly(c, [-8, -28, -26, -22, -8, -20], '#3aa040', '#f0f4ec', 1); G.poly(c, [8, -28, 26, -22, 8, -20], '#3aa040', '#f0f4ec', 1);
    G.ell(c, 0, -27, 9, 11, '#ffffff', '#2a4a20', 1.2);
    G.poly(c, [0, -42, -4, -36, 4, -36], '#5ad0ff');
    G.poly(c, [-7, -28, -2, -25, -6, -24], '#2a8a30'); G.poly(c, [7, -28, 2, -25, 6, -24], '#2a8a30');
    c.beginPath(); c.arc(0, -23, 4, 0, Math.PI); c.closePath(); G.fs(c, '#e88a20');
  },
  // 14 菇樂小靈
  14(c, t) {
    const j = Math.abs(Math.sin(t * 3)) * 3;
    c.translate(0, -j);
    G.glow(c, '#ffd040', 20);
    G.ell(c, -8, 40 + j, 7, 5, '#c8a050', '#7a5a20', 1); G.ell(c, 8, 40 + j, 7, 5, '#c8a050', '#7a5a20', 1);
    G.circle(c, 0, 20, 17, G.rg(c, -4, 16, 18, '#fff0b0', '#e0b040'), '#8a6a20', 1.5);
    G.noGlow(c);
    G.curve(c, [-14, 14, -24, 8, -24, -4], '#e8c060', 5); G.curve(c, [14, 14, 24, 8, 24, -4], '#e8c060', 5);
    G.circle(c, -24, -6, 4.5, '#f0d070', '#8a6a20', 1); G.circle(c, 24, -6, 4.5, '#f0d070', '#8a6a20', 1);
    G.smile(c, -5, 17, 3, '#3a2008', 1.6, 1.1, 1.9); G.smile(c, 5, 17, 3, '#3a2008', 1.6, 1.1, 1.9);
    c.beginPath(); c.arc(0, 22, 6, 0, Math.PI); c.closePath(); G.fs(c, '#ffe060', '#3a2008', 1.2);
    G.ell(c, 0, -10, 18, 15, G.rg(c, -3, -12, 18, '#fff8e0', '#f0d8a0'), '#8a6a20', 1.2);
    c.beginPath(); c.ellipse(0, -18, 25, 20, 0, Math.PI, 0);
    for (let i = 0; i <= 8; i++) c.lineTo(25 - i * 6.25, -18 + (i % 2 ? 6 : 0));
    c.closePath(); G.fs(c, G.rg(c, -6, -28, 26, '#fff0b8', '#d8b050'), '#8a6a20', 1.5);
    for (const x of [-7, 7]) { G.ell(c, x, -8, 3, 4, '#1a1008'); G.dot(c, x + 1, -9.5, 1.1, '#fff'); G.line(c, [x - 3, -12, x - 5, -14], '#1a1008', 1); G.line(c, [x + 3, -12, x + 5, -14], '#1a1008', 1); }
    G.ell(c, -11, -3, 3, 2, 'rgba(255,120,120,0.6)'); G.ell(c, 11, -3, 3, 2, 'rgba(255,120,120,0.6)');
    G.dot(c, 0, -4, 1, '#3a2008');
    c.beginPath(); c.arc(0, -1, 4, 0, Math.PI); c.closePath(); G.fs(c, '#d04a40');
    c.translate(0, j);
    G.sparkles(c, t, '#fff0a0', 6);
  },
  // 15 藍棘拳靈
  15(c, t) { drawSpiky(c, t, false); },
  // 16 藍棘拳衛
  16(c, t) { drawSpiky(c, t, true); },
  // 17 流空騎梭
  17(c, t) {
    const b = Math.sin(t * 2) * 3;
    c.globalAlpha = 0.5; for (let i = 0; i < 5; i++) G.line(c, [30 + ((t * 60 + i * 23) % 30), -20 + i * 12, 50 + ((t * 60 + i * 23) % 30), -20 + i * 12], '#c0e0ff', 1.2); c.globalAlpha = 1;
    c.translate(0, b);
    G.poly(c, [32, 8, 50, -14, 44, 8, 50, 30], '#2a48b0', '#c0d8ff', 1.2);
    G.poly(c, [-6, 0, 10, -20, 14, 0], '#2a48b0', '#c0d8ff', 1);
    G.poly(c, [-4, 14, 8, 30, 12, 14], '#2a48b0', '#c0d8ff', 1);
    G.glow(c, '#4080ff', 12);
    G.ell(c, -2, 8, 38, 13, G.lg(c, 0, -5, 0, 21, '#5a80e8', '#1a2a80'), '#d0e0ff', 1.5);
    G.noGlow(c);
    G.poly(c, [-38, 4, -56, 6, -38, 12], '#c0d0f0', '#2a3a80', 1);
    for (let i = 0; i < 4; i++) G.line(c, [-20 + i * 9, 0, -16 + i * 9, 16], 'rgba(160,200,255,0.6)', 1.5);
    G.circle(c, 18, 9, 6, '#d0e0ff', '#1a2a80', 1.2); G.circle(c, 18, 9, 3, '#4a90ff');
    c.font = 'bold 9px sans-serif'; c.fillStyle = '#9ad0ff'; c.fillText('31', 2, 14);
    G.curve(c, [0, -12, -18, -16 + Math.sin(t * 6) * 3, -30, -10], '#3a6ad8', 3.5);
    G.rr(c, -2, -14, 12, 14, 3, '#e8ecf4', '#2a3a80', 1);
    G.ell(c, 4, -24, 9, 9, '#f4f4f8', '#2a3a80', 1);
    c.beginPath(); c.ellipse(4, -28, 11, 8, 0, Math.PI, 0);
    for (let i = 0; i <= 6; i++) c.lineTo(15 - i * 3.66, -28 + (i % 2 ? 4 : 0));
    c.closePath(); G.fs(c, '#e8ecf4', '#2a3a80', 1);
    G.dot(c, 1, -23, 1.2); G.dot(c, 7, -23, 1.2); G.line(c, [2, -19, 6, -19], '#1a1a3a', 1.2);
    c.translate(0, -b);
  },
  // 18 碧殼心靈
  18(c, t) {
    for (const x of [-18, -6, 6, 18]) { c.beginPath(); c.moveTo(x, 26); c.quadraticCurveTo(x - 6, 38, x, 42); c.quadraticCurveTo(x + 6, 38, x, 26); G.fs(c, '#2a5ab8', '#a0d0ff', 1); }
    G.curve(c, [-22, 14, -40, 16, -34, -4], '#2a5ab8', 6);
    G.glow(c, '#60c0ff', 18);
    G.ell(c, 0, 0, 27, 32, G.rg(c, -6, -8, 34, '#5a8ae8', '#1a3a90'), '#c0e0ff', 1.5);
    G.noGlow(c);
    c.save(); c.beginPath(); c.ellipse(0, 0, 27, 32, 0, 0, Math.PI * 2); c.clip();
    c.beginPath(); c.moveTo(-30, 30); c.quadraticCurveTo(-10, -10, 30, -6); c.lineTo(30, 6); c.quadraticCurveTo(-4, 4, -18, 34); c.closePath(); G.fs(c, '#e8ecf4', '#a0b0c8', 1);
    c.restore();
    G.ell(c, 3, -8, 14, 16, '#0e2a18');
    G.glow(c, '#60ff80', 14); G.circle(c, 3, -8, 10, G.rg(c, 1, -10, 10, '#a8f080', '#3a9a40')); G.noGlow(c);
    G.ell(c, 0, -10, 1.4, 2, '#0e2a08'); G.ell(c, 6, -10, 1.4, 2, '#0e2a08'); G.smile(c, 3, -8, 4, '#0e2a08', 1.5);
    G.curve(c, [10, -28, 26, -46, 30, -34], '#2a5ab8', 3);
    G.glow(c, '#80e0ff', 16); G.circle(c, 30, -32, 4 + Math.sin(t * 3), '#d0f8ff'); G.noGlow(c);
  },
  // 19 槍尾巡獵獸
  19(c, t) {
    for (const [x0, x1] of [[-20, -24], [-8, -6], [12, 10], [22, 26]]) { G.line(c, [x0, 8, x1, 42], '#3a6a2a', 6); G.line(c, [x0, 8, x1, 42], '#5a9a40', 3); G.rr(c, x1 - 3, 40, 7, 4, 1, '#2a2a20'); }
    G.curve(c, [-22, -2, -42, -6, -40, -32], '#4a7a30', 8); G.curve(c, [-22, -2, -42, -6, -40, -32], '#c8a050', 2);
    G.poly(c, [-44, -30, -36, -34, -46, -52], '#c8a870', '#5a4020', 1);
    const nk = Math.sin(t * 1.2) * 3;
    G.curve(c, [18, -4, 32, -16, 30 + nk, -38], '#4a7a30', 7); G.curve(c, [18, -4, 32, -16, 30 + nk, -38], '#6aaa48', 3);
    G.ell(c, 0, 0, 26, 14, G.lg(c, 0, -14, 0, 14, '#6aaa48', '#2a5a1a'), '#1a3a10', 1.5);
    for (const x of [-14, 0, 14]) G.rr(c, x - 2, -13, 4, 26, 1, '#a07838');
    G.rr(c, -6, -18, 10, 6, 1, '#4a3a20');
    G.rr(c, -12, -27, 30, 10, 3, G.lg(c, 0, -27, 0, -17, '#c8a050', '#6a5020'), '#2a2010', 1.2);
    G.circle(c, 18, -22, 4.5, '#1a1408', '#c8a050', 1);
    G.circle(c, 30 + nk, -42, 9, '#3a5a28');
    G.circle(c, 30 + nk, -42, 7, G.rg(c, 29, -44, 8, '#ffffff', '#d0d0c0'), '#2a2a20', 1);
    G.dot(c, 27 + nk, -43, 1.2); G.dot(c, 33 + nk, -43, 1.2); G.line(c, [28 + nk, -38, 32 + nk, -38], '#1a1a10', 1.2);
    c.globalAlpha = 0.5; for (let i = 0; i < 5; i++) { const k = (t * 0.8 + i * 0.2) % 1; G.circle(c, -30 + i * 15, 30 - k * 60, 1.4, '#a0ff60'); } c.globalAlpha = 1;
  },
  // 20 蝶結吞尾蟲
  20(c, t) {
    for (let i = 3; i >= 0; i--) {
      const x = 8 + i * 13, y = -8 + Math.sin(t * 3 - i) * 2;
      G.poly(c, [x + 4, y + 26, x + 7, y + 34, x + 10, y + 26], '#e8dcb0');
      G.rr(c, x, y - 1, 15, 28, 3, G.lg(c, x, 0, x + 15, 0, '#a8d060', '#6a9a30'), '#3a5a18', 1.2);
      G.circle(c, x + 7, y + 13, 5, '#f0e8c8'); c.beginPath(); for (let a = 0; a < 10; a += 0.4) c.lineTo(x + 7 + Math.cos(a) * a * 0.45, y + 13 + Math.sin(a) * a * 0.45); c.strokeStyle = '#e06a8a'; c.lineWidth = 1.2; c.stroke();
    }
    const m = Math.sin(t * 2) * 2;
    G.rr(c, -42, -22, 46, 46, 6, G.lg(c, 0, -22, 0, 24, '#b0d868', '#6a9a30'), '#3a5a18', 2);
    G.rr(c, -40, -8 - m, 42, 26 + m * 2, 3, '#1a1408');
    G.teeth(c, -40, 2, -8 - m, 11, 4, '#f4ecd0', 1);
    G.teeth(c, -40, 2, 18 + m, 11, 4, '#f4ecd0', -1);
    G.dot(c, -32, -15, 2.2); G.dot(c, -12, -15, 2.2);
    for (const x of [-30, -8]) {
      G.poly(c, [x, -24, x - 10, -31, x - 10, -17], '#e85a90', '#8a1a40', 1);
      G.poly(c, [x, -24, x + 10, -31, x + 10, -17], '#e85a90', '#8a1a40', 1);
      G.circle(c, x, -24, 3, '#ff80b0', '#8a1a40', 1);
    }
  },
};

function drawSpiky(c, t, evolved) {
  const s = evolved ? 1.08 : 1;
  c.scale(s, s);
  G.glow(c, evolved ? '#ffd040' : '#3060ff', 20);
  G.line(c, [-4, 12, -14, 40], '#e8ecf8', 5); G.line(c, [4, 12, 14, 40], '#e8ecf8', 5);
  G.ell(c, -15, 41, 6, 3.5, '#1a30b0'); G.ell(c, 15, 41, 6, 3.5, '#1a30b0');
  G.noGlow(c);
  G.ell(c, 0, 6, evolved ? 11 : 8, evolved ? 15 : 12, '#f4f6ff', '#2040c0', 1.2);
  if (evolved) { G.curve(c, [-6, 0, 0, 8, -4, 16], '#3050d0', 1.5); G.curve(c, [6, -2, 1, 6, 6, 14], '#3050d0', 1.5); }
  G.line(c, [-6, 2, -24, 2], '#f4f6ff', 3.5); G.line(c, [6, 2, 24, 2], '#f4f6ff', 3.5);
  for (const x of [-27, 27]) {
    for (let i = 0; i < 5; i++) { const a = i * Math.PI * 0.4 + t; G.circle(c, x + Math.cos(a) * 5, 2 + Math.sin(a) * 5, 4, '#f4f6ff', '#2040c0', 1.4); }
    G.circle(c, x, 2, evolved ? 4 : 3, evolved ? '#2a50e0' : '#f4f6ff', '#2040c0', 1.2);
  }
  G.glow(c, '#4070ff', 12);
  const n = 14;
  for (let i = 0; i < n; i++) {
    const a = Math.PI * (0.95 + i / (n - 1) * 1.1), L = 26 + (i % 3) * 6 + Math.sin(t * 4 + i) * 1.5;
    const w = 0.16;
    G.poly(c, [Math.cos(a - w) * 13, -20 + Math.sin(a - w) * 13, Math.cos(a) * L, -20 + Math.sin(a) * L, Math.cos(a + w) * 13, -20 + Math.sin(a + w) * 13], '#2a48e0', '#a0c0ff', 0.8);
  }
  G.noGlow(c);
  if (evolved) G.circle(c, 0, -22, 22, null, '#2a48e0', 3);
  G.circle(c, 0, -18, 15, G.rg(c, -3, -20, 15, '#ffffff', '#d8e0f4'), '#2040c0', 1.5);
  G.line(c, [-9, -24, -3, -21], '#1a1a3a', 2); G.line(c, [9, -24, 3, -21], '#1a1a3a', 2);
  G.ell(c, -5, -17, 2, 2.6, '#1a1a3a'); G.ell(c, 5, -17, 2, 2.6, '#1a1a3a');
  G.line(c, [-3, -10, 3, -10], '#1a1a3a', 1.6);
  if (!evolved) { G.poly(c, [6, -28, 12, -26, 10, -20, 7, -23], '#1a1a2a'); }
  c.scale(1 / s, 1 / s);
}

// opt: { flip, alpha, flash, sink(0-1), bob }
function drawMon(ctx, id, x, y, size, t, opt = {}) {
  const f = SPRITES[id];
  if (!f) return;
  ctx.save();
  ctx.translate(x, y);
  const k = size / 100;
  ctx.scale(opt.flip ? -k : k, k);
  if (opt.sink) { ctx.translate(0, 45); ctx.scale(1, 1 - opt.sink); ctx.translate(0, -45); }
  ctx.globalAlpha = opt.alpha == null ? 1 : opt.alpha;
  const bob = opt.still ? 0 : Math.sin(t * 2.2 + id) * 1.5;
  ctx.translate(0, bob);
  try { f(ctx, t); } catch (e) { console.error('sprite', id, e); }
  ctx.restore();
  if (opt.flash) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = opt.flash;
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(x, y, size * 0.45, size * 0.48, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

// ===== 人物（地圖上的玩家與 NPC）=====
function drawPerson(ctx, x, y, dir, look, frame, scale) {
  // x,y = 格子左上角，格子大小 TILE
  const s = scale || TILE / 32;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(16, 29, 9, 3.5, 0, 0, Math.PI * 2); ctx.fill();
  const step = frame % 2 ? 2 : 0;
  ctx.fillStyle = look.pants || '#2a3048';
  ctx.fillRect(10, 22, 5, 7 - step); ctx.fillRect(17, 22, 5, 7 - (2 - step));
  ctx.fillStyle = look.shirt || '#c03030';
  ctx.beginPath(); ctx.roundRect(8, 13, 16, 11, 3); ctx.fill();
  ctx.fillStyle = look.skin || '#f4d0a8';
  ctx.beginPath(); ctx.arc(16, 10, 7, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = look.hair || '#3a2414';
  if (dir === 'up') { ctx.beginPath(); ctx.arc(16, 9, 7.5, 0, Math.PI * 2); ctx.fill(); }
  else { ctx.beginPath(); ctx.arc(16, 8, 7.5, Math.PI, 0); ctx.fill(); }
  if (look.hat) { ctx.fillStyle = look.hat; ctx.beginPath(); ctx.arc(16, 7, 7.5, Math.PI, 0); ctx.fill(); ctx.fillRect(dir === 'left' ? 4 : dir === 'right' ? 16 : 8, 6, 12, 2.5); }
  if (dir !== 'up') {
    ctx.fillStyle = '#1a1010';
    if (dir === 'down') { ctx.fillRect(12.5, 10, 2, 2.5); ctx.fillRect(17.5, 10, 2, 2.5); }
    else ctx.fillRect(dir === 'left' ? 11 : 19, 10, 2, 2.5);
  }
  if (look.robe) { ctx.fillStyle = look.robe; ctx.fillRect(8, 20, 16, 7); }
  ctx.restore();
}
