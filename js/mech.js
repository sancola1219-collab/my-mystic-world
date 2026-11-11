// ===== 機甲類重新設計：曲線裝甲、金屬光澤、關節、能量核心、推進器 =====

// 金屬漸層：亮面 → 本色 → 暗面 → 反光
function metalGrad(c, x0, y0, x1, y1, col) {
  const g = c.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, sh(col, 0.55)); g.addColorStop(0.28, sh(col, 0.12)); g.addColorStop(0.62, sh(col, -0.42)); g.addColorStop(0.82, sh(col, -0.12)); g.addColorStop(1, sh(col, -0.5));
  return g;
}
const MOL = 'rgba(14,10,22,0.85)';
// 曲線裝甲片：pts 為 [x,y] 頂點，曲線依序通過
function armor(c, pts, col, bend = 0.25) {
  const n = pts.length;
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  c.beginPath();
  for (let i = 0; i < n; i++) {
    const p = pts[i], q = pts[(i + 1) % n], mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, ox = (mx - cx) * bend, oy = (my - cy) * bend;
    if (i === 0) c.moveTo(p[0], p[1]);
    c.quadraticCurveTo(mx + ox, my + oy, q[0], q[1]);
  }
  c.closePath(); c.fillStyle = metalGrad(c, x0, y0, x1, y1, col); c.fill(); c.strokeStyle = MOL; c.lineWidth = 0.9; c.stroke();
  return [x0, y0, x1, y1];
}
function rivets(c, list) { for (const [x, y] of list) { G.circle(c, x, y, 0.9, 'rgba(255,255,255,0.75)'); G.circle(c, x + 0.3, y + 0.3, 0.5, 'rgba(0,0,0,0.5)'); } }
function glowDot(c, x, y, r, col) { c.save(); c.shadowColor = col; c.shadowBlur = r * 4; const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, '#ffffff'); g.addColorStop(0.5, col); g.addColorStop(1, sh(col, -0.4)); G.circle(c, x, y, r, g); c.restore(); }
function joint(c, x, y, r, o) { G.circle(c, x, y, r, metalGrad(c, x - r, y - r, x + r, y + r, '#5a6070'), MOL, 0.7); glowDot(c, x, y, r * 0.45, o.c); }
function cable(c, pts, col) { c.strokeStyle = '#1a1a24'; c.lineWidth = 2.4; c.lineCap = 'round'; c.beginPath(); c.moveTo(pts[0], pts[1]); c.bezierCurveTo(pts[2], pts[3], pts[4], pts[5], pts[6], pts[7]); c.stroke(); c.strokeStyle = col; c.lineWidth = 0.8; c.setLineDash([2, 2]); c.stroke(); c.setLineDash([]); }

PLANS.mech = function (c, t, o) {
  const s = o.s, b = Math.sin(t * 2) * 1.1, baby = s === 1, a = o.a, tr = o.b, gl = o.c;
  const weapon = o.weapon || ((o.a.charCodeAt(2) + o.b.charCodeAt(3)) % 2 ? 'cannon' : 'blade');
  c.save(); c.translate(0, baby ? 8 : 0);
  const hs = baby ? 1.35 : 1; // 幼體頭比較大
  // ── 背部推進器與機翼 ──
  for (const d of [-1, 1]) {
    if (s >= 2) {
      c.save(); c.translate(d * 12, -18 + b); c.rotate(d * (-0.5 + Math.sin(t * 1.6) * 0.04));
      for (let k = 0; k < (s >= 3 ? 3 : 2); k++) {
        const L = 34 - k * 7, y = k * 7;
        armor(c, [[0, y], [d * L, y - 12], [d * (L + 6), y - 6], [d * (L - 4), y + 4], [0, y + 6]], k % 2 ? tr : a, 0.1);
        c.save(); c.shadowColor = gl; c.shadowBlur = 8; c.strokeStyle = gl; c.lineWidth = 1; c.beginPath(); c.moveTo(d * 4, y + 2); c.lineTo(d * (L - 2), y - 4); c.stroke(); c.restore();
      }
      c.restore();
    }
    armor(c, [[d * 8, -24 + b], [d * 18, -26 + b], [d * 20, -6 + b], [d * 10, -4 + b]], sh(a, -0.25), 0.15);
    const fl = 7 + Math.sin(t * 14 + d) * 3;
    c.save(); c.shadowColor = gl; c.shadowBlur = 12; const g = c.createLinearGradient(0, -4 + b, 0, -4 + b + fl * 2); g.addColorStop(0, '#ffffff'); g.addColorStop(0.4, gl); g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g; c.beginPath(); c.moveTo(d * 11, -5 + b); c.quadraticCurveTo(d * 15, -4 + b + fl * 2, d * 19, -5 + b); c.closePath(); c.fill(); c.restore();
  }
  // ── 腿 ──
  for (const d of [-1, 1]) {
    A.body(c, [[d * 7, 8 + b * 0.5], [d * 9, 20], [d * 10, 26]], legW(4.6, 3.6), '#3a3e4a');
    armor(c, [[d * 4, 6 + b * 0.5], [d * 13, 6 + b * 0.5], [d * 14, 20], [d * 6, 22]], a, 0.3);
    joint(c, d * 10, 25, 3.6, o);
    armor(c, [[d * 6, 27], [d * 15, 26], [d * 16, 38], [d * 12, 41], [d * 6, 40]], a, 0.28);
    c.strokeStyle = 'rgba(0,0,0,0.35)'; c.lineWidth = 0.6; c.beginPath(); c.moveTo(d * 8, 31); c.lineTo(d * 14, 31); c.moveTo(d * 9, 35); c.lineTo(d * 14, 35); c.stroke();
    c.save(); c.shadowColor = gl; c.shadowBlur = 6; c.fillStyle = gl; c.fillRect(d > 0 ? 9 : -14, 28.4, 5, 1.2); c.restore();
    armor(c, [[d * 4, 40], [d * 18, 39], [d * 21, 45], [d * 3, 45]], tr, 0.15);
    rivets(c, [[d * 7, 9], [d * 12, 9], [d * 8, 38]]);
  }
  // ── 腰部裙甲 ──
  armor(c, [[-11, 2 + b], [11, 2 + b], [9, 12 + b], [0, 15 + b], [-9, 12 + b]], tr, 0.2);
  for (const d of [-1, 1]) armor(c, [[d * 10, 3 + b], [d * 17, 4 + b], [d * 15, 15 + b], [d * 9, 12 + b]], a, 0.2);
  // ── 軀幹 ──
  c.save(); c.translate(0, b);
  armor(c, [[-9, -2], [9, -2], [8, 4], [-8, 4]], '#3a3e4a', 0.2);
  for (let i = 0; i < 3; i++) armor(c, [[-7 + i * 0.5, -6 + i * 3], [7 - i * 0.5, -6 + i * 3], [6.5 - i * 0.5, -3.4 + i * 3], [-6.5 + i * 0.5, -3.4 + i * 3]], sh(a, -0.15), 0.2);
  armor(c, [[-15, -27], [0, -30], [15, -27], [17, -16], [8, -6], [-8, -6], [-17, -16]], a, 0.22);
  for (const d of [-1, 1]) {
    armor(c, [[d * 2, -27], [d * 13, -25], [d * 14, -17], [d * 6, -12], [d * 2, -15]], tr, 0.2);
    c.strokeStyle = 'rgba(255,255,255,0.45)'; c.lineWidth = 0.8; c.beginPath(); c.moveTo(d * 4, -25.5); c.quadraticCurveTo(d * 10, -25, d * 12, -20); c.stroke();
  }
  // 能量核心
  const cr = s >= 3 ? 6.4 : 5.2;
  G.circle(c, 0, -17, cr + 2.2, metalGrad(c, -cr, -22, cr, -12, '#6a7080'), MOL, 0.8);
  glowDot(c, 0, -17, cr, gl);
  c.save(); c.translate(0, -17); c.rotate(t * 2); c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 0.7;
  for (let i = 0; i < 3; i++) { c.rotate(2.094); c.beginPath(); c.arc(0, 0, cr * 0.7, 0, 1.2); c.stroke(); }
  c.restore();
  cable(c, [-6, -10, -12, -4, -12, 2, -9, 4], gl); cable(c, [6, -10, 12, -4, 12, 2, 9, 4], gl);
  rivets(c, [[-13, -24], [13, -24], [-14, -18], [14, -18]]);
  c.restore();
  // ── 手臂 ──
  const sw = Math.sin(t * 1.8) * 2;
  for (const d of [-1, 1]) {
    c.save(); c.translate(0, b);
    A.body(c, [[d * 18, -22], [d * 24, -12 + sw * d * 0.3], [d * 26, -4]], legW(4.2, 3.4), '#3a3e4a');
    joint(c, d * 25, -6, 3.4, o);
    if ((d > 0 && weapon === 'cannon') || (d < 0 && weapon === 'blade')) {
      if (weapon === 'cannon') {
        armor(c, [[d * 21, -6], [d * 31, -7], [d * 33, 12], [d * 23, 13]], a, 0.2);
        G.rr(c, d > 0 ? 24 : -32, 12, 8, 12, 2, metalGrad(c, 24, 12, 32, 24, '#4a5060'), MOL, 0.7);
        G.circle(c, d * 28, 25, 3.4, '#101018', MOL, 0.6); glowDot(c, d * 28, 25, 1.8 + Math.sin(t * 6) * 0.5, gl);
        c.strokeStyle = gl; c.lineWidth = 0.9; c.beginPath(); c.moveTo(d * 24, 0); c.lineTo(d * 31, 0); c.moveTo(d * 24, 4); c.lineTo(d * 31, 4); c.stroke();
      } else {
        armor(c, [[d * 21, -6], [d * 31, -7], [d * 32, 9], [d * 23, 10]], a, 0.2);
        c.save(); c.translate(d * 28, 10); c.rotate(d * 0.12); c.shadowColor = gl; c.shadowBlur = 14;
        const bg = c.createLinearGradient(-3, 0, 3, 0); bg.addColorStop(0, '#ffffff'); bg.addColorStop(0.5, gl); bg.addColorStop(1, sh(gl, -0.3));
        c.fillStyle = bg; c.beginPath(); c.moveTo(-3, 0); c.lineTo(-2, 28 + s * 4); c.lineTo(0, 32 + s * 4); c.lineTo(3, 0); c.closePath(); c.fill(); c.restore();
      }
    } else {
      armor(c, [[d * 21, -6], [d * 31, -7], [d * 31, 8], [d * 22, 9]], a, 0.24);
      armor(c, [[d * 22, 8], [d * 30, 8], [d * 31, 14], [d * 26, 17], [d * 21, 14]], '#4a5060', 0.3);
      for (let i = 0; i < 3; i++) G.rr(c, d * (22 + i * 3) - (d < 0 ? 2.4 : 0), 14, 2.4, 4.4, 1, '#3a3e4a', MOL, 0.4);
    }
    c.save(); c.shadowColor = gl; c.shadowBlur = 6; c.fillStyle = gl; c.fillRect(d > 0 ? 24 : -29, -2, 5, 1.1); c.restore();
    // 肩甲
    const pg = armor(c, [[d * 13, -30], [d * 25, -33], [d * 33, -26], [d * 31, -16], [d * 20, -15], [d * 14, -20]], tr, 0.32);
    armor(c, [[d * 16, -29], [d * 26, -31], [d * 31, -25], [d * 24, -24]], a, 0.25);
    c.strokeStyle = 'rgba(255,255,255,0.5)'; c.lineWidth = 0.8; c.beginPath(); c.moveTo(d * 18, -30); c.quadraticCurveTo(d * 25, -32, d * 30, -27); c.stroke();
    rivets(c, [[d * 20, -19], [d * 28, -19]]);
    if (s >= 3) { c.fillStyle = gl; c.save(); c.shadowColor = gl; c.shadowBlur = 8; c.beginPath(); c.moveTo(d * 24, -33); c.lineTo(d * 28, -42); c.lineTo(d * 30, -32); c.closePath(); c.fill(); c.restore(); }
    c.restore();
  }
  // ── 頭 ──
  c.save(); c.translate(0, -36 + b); c.scale(hs, hs);
  A.body(c, [[0, 8], [0, 4]], [3.4, 3.4], '#3a3e4a');
  armor(c, [[-9, -6], [-6, -12], [0, -14], [6, -12], [9, -6], [8, 3], [4, 7], [-4, 7], [-8, 3]], a, 0.22);
  armor(c, [[-6, -1], [6, -1], [5, 5], [0, 7], [-5, 5]], tr, 0.2);
  for (let i = -1; i <= 1; i++) { c.strokeStyle = 'rgba(0,0,0,0.5)'; c.lineWidth = 0.6; c.beginPath(); c.moveTo(i * 2, 2); c.lineTo(i * 2, 5.5); c.stroke(); }
  c.fillStyle = '#08080e'; c.beginPath(); c.moveTo(-7.6, -6); c.quadraticCurveTo(0, -8, 7.6, -6); c.lineTo(6.4, -2); c.quadraticCurveTo(0, -3.4, -6.4, -2); c.closePath(); c.fill();
  c.save(); c.shadowColor = gl; c.shadowBlur = 10; c.fillStyle = gl;
  if (s === 1) { for (const d of [-1, 1]) { c.beginPath(); c.ellipse(d * 3.2, -4.4, 1.9, 1.5, 0, 0, 7); c.fill(); } }
  else { c.beginPath(); c.moveTo(-6.6, -5.4); c.quadraticCurveTo(0, -6.6, 6.6, -5.4); c.lineTo(5.6, -3.4); c.quadraticCurveTo(0, -4.4, -5.6, -3.4); c.closePath(); c.fill(); }
  c.restore();
  c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.ellipse(-4, -10, 3, 1.2, -0.3, 0, 7); c.fill();
  // V 型頭冠
  c.save(); c.shadowColor = gl; c.shadowBlur = 6;
  for (const d of [-1, 1]) { const L = s >= 3 ? 18 : s === 2 ? 13 : 8; c.fillStyle = sh(tr, 0.15); c.strokeStyle = MOL; c.lineWidth = 0.6; c.beginPath(); c.moveTo(0, -11); c.lineTo(d * L, -11 - L * 0.9); c.lineTo(d * (L - 3), -11 - L * 0.62); c.lineTo(d * 2, -9); c.closePath(); c.fill(); c.stroke(); }
  c.restore();
  glowDot(c, 0, -11.6, 1.8, gl);
  for (const d of [-1, 1]) armor(c, [[d * 8, -6], [d * 12, -5], [d * 12, 2], [d * 8.4, 3]], tr, 0.2);
  c.restore();
  c.restore();
};
