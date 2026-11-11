// ===== 西遊記篇：取經之路十五關、妖王、如來佛祖 =====

// ---------- 人形妖王／神佛造型 ----------
const XOL = 'rgba(16,8,10,0.85)';
function xyGrad(c, x0, y0, x1, y1, col, k = 0.35) { const g = c.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, sh(col, k)); g.addColorStop(0.55, col); g.addColorStop(1, sh(col, -0.45)); return g; }
function xyStaff(c, x, y, ang, L, col, tip) {
  c.save(); c.translate(x, y); c.rotate(ang);
  c.fillStyle = xyGrad(c, -1.6, 0, 1.6, 0, col, 0.4); c.strokeStyle = XOL; c.lineWidth = 0.6; c.beginPath(); c.roundRect(-1.6, -L * 0.6, 3.2, L, 1.4); c.fill(); c.stroke();
  for (const yy of [-L * 0.6, L * 0.4 - 5]) { c.fillStyle = xyGrad(c, -2.4, 0, 2.4, 0, tip, 0.5); c.beginPath(); c.roundRect(-2.4, yy, 4.8, 5, 1.2); c.fill(); c.stroke(); }
  c.restore();
}
function xyWeapon(c, w, t, o) {
  const x = 25, y = 2;
  if (w === 'staff') xyStaff(c, x, y, 0.12, 82, o.wc || '#b02020', '#f0c040');
  if (w === 'iron') xyStaff(c, x, y, 0.12, 80, '#3a3a44', '#a0a0b0');
  if (w === 'spear' || w === 'fire' || w === 'trident') {
    c.save(); c.translate(x, y); c.rotate(0.12);
    c.fillStyle = xyGrad(c, -1.4, 0, 1.4, 0, w === 'fire' ? '#a02018' : '#5a3a22'); c.fillRect(-1.3, -48, 2.6, 88);
    if (w === 'trident') { c.strokeStyle = '#d8dce8'; c.lineWidth = 2.2; c.lineCap = 'round'; c.beginPath(); c.moveTo(-7, -60); c.lineTo(-7, -50); c.quadraticCurveTo(0, -44, 7, -50); c.lineTo(7, -60); c.moveTo(0, -64); c.lineTo(0, -46); c.stroke(); }
    else {
      if (w === 'fire') { c.save(); c.shadowColor = '#ff6020'; c.shadowBlur = 12; }
      const g = c.createLinearGradient(-3, -66, 3, -48); g.addColorStop(0, '#ffffff'); g.addColorStop(1, w === 'fire' ? '#ff5020' : '#b8c0d0');
      c.fillStyle = g; c.beginPath(); c.moveTo(0, -68); c.quadraticCurveTo(4.4, -56, 2.6, -48); c.lineTo(-2.6, -48); c.quadraticCurveTo(-4.4, -56, 0, -68); c.fill(); c.strokeStyle = XOL; c.lineWidth = 0.5; c.stroke();
      if (w === 'fire') { for (let i = 0; i < 4; i++) { const f = 6 + Math.sin(t * 9 + i) * 2.5; c.fillStyle = i % 2 ? '#ffd040' : '#ff6020'; c.beginPath(); c.moveTo(-3 + i * 2, -50); c.quadraticCurveTo(-4 + i * 2.5, -50 - f * 2, 1 + i * 1.5, -52); c.fill(); } c.restore(); }
      c.fillStyle = '#d02020'; for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(-2, -47); c.quadraticCurveTo(i * 2.4, -40, i * 3 + Math.sin(t * 3 + i) * 1.2, -36); c.lineTo(2, -47); c.fill(); }
    }
    c.restore();
  }
  if (w === 'rake') {
    c.save(); c.translate(x, y); c.rotate(0.12);
    c.fillStyle = xyGrad(c, -1.4, 0, 1.4, 0, '#6a4a2a'); c.fillRect(-1.4, -50, 2.8, 92);
    c.fillStyle = xyGrad(c, -12, -60, 12, -50, '#c0c8d4', 0.5); c.strokeStyle = XOL; c.lineWidth = 0.6; c.beginPath(); c.roundRect(-13, -55, 26, 6, 2); c.fill(); c.stroke();
    for (let i = 0; i < 9; i++) { const xx = -12 + i * 3; c.fillStyle = '#e0e6ee'; c.beginPath(); c.moveTo(xx - 1, -49); c.lineTo(xx, -40 - (i % 2)); c.lineTo(xx + 1, -49); c.fill(); }
    G.circle(c, 0, -57, 2.6, '#f0c040', XOL, 0.5); c.restore();
  }
  if (w === 'fan') {
    c.save(); c.translate(x + 2, y - 4); c.rotate(-0.25 + Math.sin(t * 2) * 0.12);
    c.fillStyle = '#7a5020'; c.fillRect(-1.2, -6, 2.4, 22);
    const g = c.createRadialGradient(0, -24, 2, 0, -22, 20); g.addColorStop(0, '#c8f080'); g.addColorStop(1, '#3a8a30');
    c.fillStyle = g; c.strokeStyle = XOL; c.lineWidth = 0.7; c.beginPath(); c.moveTo(0, -6); c.bezierCurveTo(-22, -12, -18, -44, 0, -46); c.bezierCurveTo(18, -44, 22, -12, 0, -6); c.fill(); c.stroke();
    c.strokeStyle = 'rgba(30,70,20,0.6)'; c.lineWidth = 0.6; for (let i = -3; i <= 3; i++) { c.beginPath(); c.moveTo(0, -8); c.quadraticCurveTo(i * 5, -26, i * 4.4, -42 + Math.abs(i) * 2); c.stroke(); }
    c.restore();
  }
  if (w === 'gourd') {
    c.save(); c.translate(x + 1, y + 6); c.rotate(-0.2);
    const col = o.gourd || '#c02a20', g = c.createRadialGradient(-3, -4, 1, 0, 0, 12); g.addColorStop(0, sh(col, 0.5)); g.addColorStop(1, sh(col, -0.35));
    c.fillStyle = g; c.strokeStyle = XOL; c.lineWidth = 0.7; c.beginPath(); c.arc(0, 4, 8, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.arc(0, -7, 5.4, 0, 7); c.fill(); c.stroke();
    c.fillStyle = '#f0c040'; c.fillRect(-2.8, -2.4, 5.6, 2); c.fillStyle = '#6a4020'; c.fillRect(-1.4, -15, 2.8, 4);
    c.save(); c.shadowColor = o.c; c.shadowBlur = 10; c.strokeStyle = o.c; c.globalAlpha = 0.6 + Math.sin(t * 4) * 0.3; c.lineWidth = 1; c.beginPath(); c.arc(0, -16, 3 + (t * 6 % 4), 0, 7); c.stroke(); c.restore();
    c.restore();
  }
  if (w === 'sword') sword(c, x + 1, y + 6, 0.35, 44, o.c, '#c8a050');
  if (w === 'monk') { // 降妖寶杖：月牙鏟
    c.save(); c.translate(x, y); c.rotate(0.12);
    c.fillStyle = xyGrad(c, -1.4, 0, 1.4, 0, '#8a6a3a'); c.fillRect(-1.4, -46, 2.8, 90);
    c.fillStyle = xyGrad(c, -8, -60, 8, -46, '#d8dce4', 0.5); c.strokeStyle = XOL; c.lineWidth = 0.6;
    c.beginPath(); c.moveTo(-8, -58); c.quadraticCurveTo(0, -48, 8, -58); c.quadraticCurveTo(4, -46, 0, -45); c.quadraticCurveTo(-4, -46, -8, -58); c.fill(); c.stroke();
    c.fillStyle = '#d8dce4'; c.beginPath(); c.moveTo(-5, 44); c.quadraticCurveTo(0, 52, 5, 44); c.closePath(); c.fill(); c.stroke();
    c.restore();
  }
}
// 頭部
function xyHead(c, k, t, o, hx, hy) {
  const skin = o.skin || '#f6d4b4', fur = o.fur || o.a;
  const eyes = (dx, y, r, col, angry) => { for (const d of [-1, 1]) { A.eye(c, hx + d * dx, y, r, col, false); if (angry) { c.strokeStyle = XOL; c.lineWidth = 1.2; c.beginPath(); c.moveTo(hx + d * (dx + r * 1.4), y - r * 1.6); c.lineTo(hx + d * (dx - r * 1.2), y - r * 0.7); c.stroke(); } } };
  const ball = (x, y, r, col, k2 = 0.35) => { const g = c.createRadialGradient(x - r * 0.35, y - r * 0.4, 1, x, y, r); g.addColorStop(0, sh(col, k2)); g.addColorStop(1, sh(col, -0.35)); G.circle(c, x, y, r, g, XOL, 0.8); };
  if (k === 'bear') {
    for (const d of [-1, 1]) { ball(hx + d * 9, hy - 9, 4.4, fur); G.circle(c, hx + d * 9, hy - 9, 2.2, sh(fur, 0.25)); }
    ball(hx, hy, 11.5, fur, 0.2);
    G.ell(c, hx, hy + 4.5, 6, 4.6, sh(fur, 0.35), XOL, 0.6); G.ell(c, hx, hy + 2.4, 2.4, 1.6, '#100808');
    eyes(4.6, hy - 2, 1.7, o.c, true); c.strokeStyle = XOL; c.lineWidth = 0.8; c.beginPath(); c.moveTo(hx - 2.4, hy + 6.4); c.quadraticCurveTo(hx, hy + 8, hx + 2.4, hy + 6.4); c.stroke();
    G.teeth(c, hx - 2, hx + 2, hy + 6.6, 2.2, 2, '#fff', 1);
  } else if (k === 'rat') {
    for (const d of [-1, 1]) { ball(hx + d * 9, hy - 8, 5.4, fur); G.circle(c, hx + d * 9, hy - 8, 3, '#f0a0a0'); }
    c.fillStyle = xyGrad(c, hx - 10, hy - 10, hx + 10, hy + 10, fur); c.strokeStyle = XOL; c.lineWidth = 0.8;
    c.beginPath(); c.moveTo(hx - 10, hy - 2); c.quadraticCurveTo(hx - 10, hy - 12, hx, hy - 12); c.quadraticCurveTo(hx + 10, hy - 12, hx + 10, hy - 2); c.quadraticCurveTo(hx + 6, hy + 8, hx, hy + 13); c.quadraticCurveTo(hx - 6, hy + 8, hx - 10, hy - 2); c.fill(); c.stroke();
    G.ell(c, hx, hy + 11.5, 2, 1.5, '#301010'); eyes(4.2, hy - 2, 1.8, o.c, true);
    c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 0.5; for (const d of [-1, 1]) for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(hx + d * 2, hy + 9); c.lineTo(hx + d * 13, hy + 6 + i * 2.4); c.stroke(); }
  } else if (k === 'bull') {
    for (const d of [-1, 1]) { const hg = c.createLinearGradient(hx, hy - 8, hx + d * 26, hy - 22); hg.addColorStop(0, '#f4ecd8'); hg.addColorStop(1, '#8a7a5a'); c.fillStyle = hg; c.strokeStyle = XOL; c.lineWidth = 0.8; c.beginPath(); c.moveTo(hx + d * 7, hy - 6); c.bezierCurveTo(hx + d * 22, hy - 8, hx + d * 28, hy - 18, hx + d * 22, hy - 30); c.quadraticCurveTo(hx + d * 22, hy - 14, hx + d * 6, hy - 11); c.fill(); c.stroke(); ball(hx + d * 11.5, hy - 2, 3.4, fur); }
    ball(hx, hy, 11, fur, 0.25);
    G.ell(c, hx, hy + 6, 7.6, 5.4, sh(fur, 0.3), XOL, 0.7); for (const d of [-1, 1]) G.ell(c, hx + d * 3, hy + 6, 1.4, 1.8, '#200808');
    c.strokeStyle = '#f0c040'; c.lineWidth = 1.6; c.beginPath(); c.arc(hx, hy + 9.4, 3, 0.2, Math.PI - 0.2); c.stroke();
    eyes(5, hy - 2.6, 1.8, o.c, true);
    c.fillStyle = '#1a1010'; c.beginPath(); c.moveTo(hx - 4, hy - 10); c.quadraticCurveTo(hx, hy - 15, hx + 4, hy - 10); c.quadraticCurveTo(hx, hy - 8, hx - 4, hy - 10); c.fill();
  } else if (k === 'lion') {
    for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283, r = 14 + (i % 2) * 2.5; ball(hx + Math.cos(a) * r * 0.9, hy + Math.sin(a) * r * 0.85 + 1, 5.6, o.mane || '#3a70b0', 0.3); }
    ball(hx, hy + 1, 10.5, fur, 0.25);
    G.ell(c, hx, hy + 6, 6, 4.2, sh(fur, 0.35), XOL, 0.6); G.poly(c, [hx - 2.6, hy + 2.4, hx + 2.6, hy + 2.4, hx, hy + 5], '#301818');
    eyes(4.6, hy - 1.6, 1.9, o.c, true); G.teeth(c, hx - 4, hx + 4, hy + 8, 2.6, 3, '#fff', 1);
  } else if (k === 'elephant') {
    for (const d of [-1, 1]) { c.fillStyle = xyGrad(c, hx, hy - 8, hx + d * 22, hy + 10, fur, 0.2); c.strokeStyle = XOL; c.lineWidth = 0.8; c.beginPath(); c.moveTo(hx + d * 7, hy - 9); c.bezierCurveTo(hx + d * 26, hy - 16, hx + d * 28, hy + 10, hx + d * 9, hy + 6); c.closePath(); c.fill(); c.stroke(); G.ell(c, hx + d * 17, hy - 2, 5, 7, 'rgba(240,160,160,0.45)'); }
    ball(hx, hy - 1, 10.5, fur, 0.3);
    const sw = Math.sin(t * 2) * 3;
    A.body(c, [[hx, hy + 2], [hx, hy + 12], [hx + 3, hy + 22], [hx + 9 + sw, hy + 24]], [4, 2], fur);
    for (const d of [-1, 1]) A.tube(c, [[hx + d * 4, hy + 6], [hx + d * 9, hy + 14], [hx + d * 13, hy + 12]], [1.8, 0.4], '#fbf4e4');
    eyes(5, hy - 3, 1.6, o.c, true);
  } else if (k === 'roc') {
    for (let i = 0; i < 5; i++) { c.fillStyle = i % 2 ? o.b : o.c; c.strokeStyle = XOL; c.lineWidth = 0.5; c.beginPath(); c.moveTo(hx - 3 + i * 1.5, hy - 9); c.quadraticCurveTo(hx - 14 + i * 5, hy - 26 - Math.sin(i) * 3, hx - 2 + i * 2, hy - 30 + i); c.quadraticCurveTo(hx - 4 + i * 3, hy - 18, hx + 2 + i * 1.5, hy - 9); c.fill(); c.stroke(); }
    ball(hx, hy, 10.5, fur, 0.3);
    const bg = c.createLinearGradient(hx, hy, hx + 16, hy + 10); bg.addColorStop(0, '#fff0a0'); bg.addColorStop(1, '#c08010');
    c.fillStyle = bg; c.strokeStyle = XOL; c.lineWidth = 0.8; c.beginPath(); c.moveTo(hx - 5, hy + 1); c.quadraticCurveTo(hx + 8, hy - 3, hx + 16, hy + 4); c.quadraticCurveTo(hx + 16, hy + 12, hx + 11, hy + 12); c.quadraticCurveTo(hx + 10, hy + 7, hx - 4, hy + 7); c.closePath(); c.fill(); c.stroke();
    eyes(4.4, hy - 2.6, 2, o.c, true);
  } else if (k === 'pig') {
    for (const d of [-1, 1]) { c.fillStyle = xyGrad(c, hx, hy, hx + d * 16, hy + 10, fur, 0.25); c.strokeStyle = XOL; c.lineWidth = 0.8; c.beginPath(); c.moveTo(hx + d * 5, hy - 9); c.quadraticCurveTo(hx + d * 20, hy - 10, hx + d * 17, hy + 6); c.quadraticCurveTo(hx + d * 10, hy - 2, hx + d * 8, hy - 3); c.fill(); c.stroke(); }
    ball(hx, hy, 12, fur, 0.35);
    G.ell(c, hx, hy + 4.6, 6.4, 4.4, sh(fur, 0.15), XOL, 0.8); for (const d of [-1, 1]) G.ell(c, hx + d * 2.4, hy + 4.6, 1.3, 2, '#6a2020');
    for (const d of [-1, 1]) { G.circle(c, hx + d * 5, hy - 2.6, 1.7, '#201010'); G.circle(c, hx + d * 5 - 0.5, hy - 3.2, 0.6, '#fff'); G.ell(c, hx + d * 8, hy + 2, 2.4, 1.4, 'rgba(255,110,130,0.45)'); }
    G.smile(c, hx, hy + 7, 3.4, XOL, 0.8);
    c.fillStyle = '#20202a'; c.beginPath(); c.arc(hx, hy - 6, 12.2, Math.PI * 1.08, Math.PI * 1.92); c.quadraticCurveTo(hx, hy - 12, hx - 11.4, hy - 9); c.fill();
  } else if (k === 'monkey') {
    for (const d of [-1, 1]) { ball(hx + d * 11, hy, 3.6, fur); G.circle(c, hx + d * 11, hy, 2, '#f0c0a0'); }
    ball(hx, hy, 11, fur, 0.25);
    c.fillStyle = o.skin || '#f0c8a0'; c.strokeStyle = XOL; c.lineWidth = 0.6; c.beginPath(); c.moveTo(hx, hy - 6); c.bezierCurveTo(hx - 9, hy - 12, hx - 10, hy + 3, hx - 4, hy + 8); c.quadraticCurveTo(hx, hy + 10, hx + 4, hy + 8); c.bezierCurveTo(hx + 10, hy + 3, hx + 9, hy - 12, hx, hy - 6); c.fill(); c.stroke();
    eyes(3.6, hy - 1.4, 1.8, o.c, true); G.dot(c, hx - 1, hy + 3.2, 0.6); G.dot(c, hx + 1, hy + 3.2, 0.6); G.smile(c, hx, hy + 4.4, 2.6, XOL, 0.8);
    c.strokeStyle = '#f0c040'; c.lineWidth = 2; c.beginPath(); c.arc(hx, hy - 1, 11.4, Math.PI * 1.08, Math.PI * 1.92); c.stroke();
  } else if (k === 'ogre') {
    for (const d of [-1, 1]) A.tube(c, [[hx + d * 5, hy - 8], [hx + d * 9, hy - 18], [hx + d * 8, hy - 25]], [2.4, 0.3], o.horn || '#f0e8d0');
    const g = c.createRadialGradient(hx - 3, hy - 4, 1, hx, hy, 12); g.addColorStop(0, sh(skin, 0.35)); g.addColorStop(1, sh(skin, -0.3));
    c.fillStyle = g; c.strokeStyle = XOL; c.lineWidth = 0.8; c.beginPath(); c.moveTo(hx - 10, hy - 4); c.quadraticCurveTo(hx - 10, hy - 12, hx, hy - 12); c.quadraticCurveTo(hx + 10, hy - 12, hx + 10, hy - 4); c.quadraticCurveTo(hx + 10, hy + 9, hx, hy + 11); c.quadraticCurveTo(hx - 10, hy + 9, hx - 10, hy - 4); c.fill(); c.stroke();
    eyes(4.2, hy - 2.4, 2, o.c, true);
    c.fillStyle = '#300808'; c.beginPath(); c.moveTo(hx - 5, hy + 4); c.quadraticCurveTo(hx, hy + 9, hx + 5, hy + 4); c.closePath(); c.fill();
    G.teeth(c, hx - 4, hx + 4, hy + 4.4, -2.4, 2, '#fff', -1);
    if (o.hair) { c.fillStyle = o.hair; for (let i = -3; i <= 3; i++) { c.beginPath(); c.moveTo(hx + i * 3 - 2, hy - 10); c.quadraticCurveTo(hx + i * 4, hy - 20 - Math.abs(i), hx + i * 3 + 2, hy - 10); c.fill(); } }
    if (o.beard) { c.fillStyle = o.beard; c.beginPath(); c.moveTo(hx - 8, hy + 3); c.quadraticCurveTo(hx - 6, hy + 18, hx, hy + 20); c.quadraticCurveTo(hx + 6, hy + 18, hx + 8, hy + 3); c.quadraticCurveTo(hx, hy + 10, hx - 8, hy + 3); c.fill(); c.strokeStyle = XOL; c.lineWidth = 0.5; c.stroke(); }
  } else if (k === 'buddha') {
    for (const d of [-1, 1]) { c.fillStyle = sh(skin, -0.1); c.strokeStyle = XOL; c.lineWidth = 0.6; c.beginPath(); c.ellipse(hx + d * 10, hy + 3, 2.8, 8, d * 0.1, 0, 7); c.fill(); c.stroke(); }
    const g = c.createRadialGradient(hx - 3, hy - 4, 1, hx, hy, 12); g.addColorStop(0, '#fff8d8'); g.addColorStop(1, sh(skin, -0.25));
    G.ell(c, hx, hy, 9.6, 11, g, XOL, 0.8);
    c.fillStyle = '#2a3a8a'; c.beginPath(); c.arc(hx, hy - 4, 10, Math.PI * 1.02, Math.PI * 1.98); c.quadraticCurveTo(hx, hy - 9, hx - 10, hy - 5); c.fill();
    G.circle(c, hx, hy - 13.4, 5, '#2a3a8a', XOL, 0.6);
    for (let i = 0; i < 14; i++) { const a = Math.PI + i / 13 * Math.PI; G.circle(c, hx + Math.cos(a) * 8.4, hy - 4 + Math.sin(a) * 5.6, 1.1, '#4a5aaa'); }
    for (const d of [-1, 1]) { c.strokeStyle = '#3a2010'; c.lineWidth = 0.9; c.beginPath(); c.arc(hx + d * 3.8, hy + 0.4, 2.2, 0.3, Math.PI - 0.3); c.stroke(); c.beginPath(); c.arc(hx + d * 3.8, hy - 2.4, 2.8, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); }
    G.circle(c, hx, hy - 4.2, 0.9, '#ff4040');
    c.strokeStyle = '#a04030'; c.lineWidth = 0.9; c.beginPath(); c.arc(hx, hy + 5, 2, 0.3, Math.PI - 0.3); c.stroke();
  } else { // 人類
    const hair = o.hair || '#201418', style = o.hs || 'short';
    faceHuman(c, hx, hy, 9.6, skin, hair, o.eye || '#2a1a10');
    if (style === 'bun' || style === 'lady') { G.circle(c, hx, hy - 12, 5, hair, XOL, 0.6); c.strokeStyle = '#f0c040'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(hx - 9, hy - 15); c.lineTo(hx + 9, hy - 9); c.stroke(); G.circle(c, hx + 9, hy - 9, 1.6, o.c); }
    if (style === 'tufts') for (const d of [-1, 1]) { G.circle(c, hx + d * 7, hy - 10, 3.6, hair, XOL, 0.6); c.strokeStyle = '#d02020'; c.lineWidth = 1; c.beginPath(); c.arc(hx + d * 7, hy - 10, 3.6, 0, 7); c.stroke(); }
    if (style === 'skull') { c.strokeStyle = '#f0f0f0'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(hx - 9, hy - 14); c.lineTo(hx + 6, hy - 17); c.stroke(); G.circle(c, hx + 7, hy - 17, 2.6, '#f4f0e8', XOL, 0.5); G.dot(c, hx + 6, hy - 17.4, 0.6); G.dot(c, hx + 8, hy - 17.4, 0.6); }
    if (style === 'monk') { c.fillStyle = sh(skin, -0.05); c.beginPath(); c.arc(hx, hy - 1.4, 9.8, Math.PI * 1.02, Math.PI * 1.98); c.fill(); for (const d of [-1, 1]) { c.fillStyle = o.brow || '#f0d040'; c.beginPath(); c.moveTo(hx + d * 1.5, hy - 3.4); c.quadraticCurveTo(hx + d * 8, hy - 6, hx + d * 16, hy + 2); c.quadraticCurveTo(hx + d * 8, hy - 2.6, hx + d * 1.5, hy - 2); c.fill(); } }
    if (o.lips !== 0 && (style === 'lady' || style === 'skull')) { c.fillStyle = '#d83050'; c.beginPath(); c.ellipse(hx, hy + 5.2, 1.6, 0.8, 0, 0, 7); c.fill(); }
  }
}
PLANS.xiyou = function (c, t, o) {
  const b = Math.sin(t * 2) * 1.2, k = o.head, hy = -34;
  c.save(); c.translate(0, b);
  if (k === 'buddha') { xyBuddha(c, t, o); c.restore(); return; }
  // 背後：長髮、翅膀、蛛腳、金鐃、披風
  if (o.hs === 'lady' || o.hs === 'skull') { c.fillStyle = xyGrad(c, 0, -46, 0, 0, o.hair || '#201418', 0.2); c.strokeStyle = XOL; c.lineWidth = 0.7; const sw = Math.sin(t * 1.6) * 2; c.beginPath(); c.moveTo(-10, -40); c.bezierCurveTo(-18, -20, -14 + sw, 0, -16 + sw, 8); c.quadraticCurveTo(0, 2, 16 + sw, 8); c.bezierCurveTo(14 + sw, 0, 18, -20, 10, -40); c.closePath(); c.fill(); c.stroke(); }
  if (o.wings) for (const d of [-1, 1]) {
    const fl = Math.sin(t * 2.4) * 0.12;
    c.save(); c.translate(d * 8, -20); c.scale(d, 1); c.rotate(-0.3 - fl);
    for (let i = 0; i < 9; i++) { const L = 38 - i * 2.2, a = -0.9 + i * 0.2, x = Math.cos(a) * 10, y = Math.sin(a) * 10; const g = c.createLinearGradient(x, y, x + Math.cos(a) * L, y + Math.sin(a) * L); g.addColorStop(0, o.a); g.addColorStop(1, i % 2 ? o.c : sh(o.b, 0.2)); c.fillStyle = g; c.strokeStyle = XOL; c.lineWidth = 0.5; c.beginPath(); c.ellipse(x + Math.cos(a) * L / 2, y + Math.sin(a) * L / 2, L / 2, 3.6, a, 0, 7); c.fill(); c.stroke(); }
    c.restore();
  }
  if (o.spider) for (const d of [-1, 1]) for (let i = 0; i < 3; i++) { const w = Math.sin(t * 3 + i) * 2; A.tube(c, [[d * 6, -14 + i * 4], [d * (22 + i * 2), -30 + i * 10 + w], [d * (34 + i * 3), -6 + i * 14]], [1.6, 0.4], '#2a1a30'); }
  if (o.cymbal) { c.save(); c.translate(0, -36); c.rotate(t * 0.6); const g = c.createRadialGradient(0, 0, 4, 0, 0, 26); g.addColorStop(0, '#fff0a0'); g.addColorStop(0.7, '#e0a820'); g.addColorStop(1, '#8a5a10'); G.circle(c, 0, 0, 25, g, XOL, 0.8); for (let i = 0; i < 12; i++) { c.rotate(0.5236); c.strokeStyle = 'rgba(120,70,0,0.5)'; c.lineWidth = 0.6; c.beginPath(); c.moveTo(8, 0); c.lineTo(24, 0); c.stroke(); } c.restore(); }
  if (o.cape) { const cp = Math.sin(t * 2) * 3; c.fillStyle = xyGrad(c, -20, -20, 24, 40, o.cape, 0.25); c.strokeStyle = XOL; c.lineWidth = 0.8; c.beginPath(); c.moveTo(-12, -24); c.lineTo(12, -24); c.bezierCurveTo(26, -4, 28 + cp, 20, 30 + cp, 40); c.quadraticCurveTo(0, 34, -30 + cp, 40); c.bezierCurveTo(-28 + cp, 20, -26, -4, -12, -24); c.closePath(); c.fill(); c.stroke(); }
  if (o.fire) { c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 7; i++) { const x = -24 + i * 8, f = 10 + Math.sin(t * 8 + i * 1.7) * 5; const g = c.createLinearGradient(0, 44, 0, 44 - f * 3); g.addColorStop(0, 'rgba(255,90,20,0.8)'); g.addColorStop(1, 'rgba(255,220,60,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(x - 6, 44); c.quadraticCurveTo(x, 44 - f * 3, x + 6, 44); c.fill(); } c.restore(); }
  // 腿、靴
  for (const d of [-1, 1]) { A.body(c, [[d * 6, 12], [d * 8, 28], [d * 9, 38]], [5.4, 4.2], o.pants || sh(o.a, -0.35)); c.fillStyle = xyGrad(c, d * 4, 36, d * 16, 44, o.boot || '#2a1e18', 0.3); c.strokeStyle = XOL; c.lineWidth = 0.7; c.beginPath(); c.moveTo(d * 4, 36); c.lineTo(d * 13, 36); c.quadraticCurveTo(d * 17, 41, d * 16, 44); c.lineTo(d * 4, 44); c.closePath(); c.fill(); c.stroke(); }
  // 長袍下襬
  robe(c, 12, -18, o.skirt || 20, o.long ? 40 : 24, o.a, null);
  c.strokeStyle = o.b; c.lineWidth = 2; c.beginPath(); c.moveTo(-(o.skirt || 20) + 1, o.long ? 39 : 23); c.lineTo((o.skirt || 20) - 1, o.long ? 39 : 23); c.stroke();
  // 上身
  const tg = xyGrad(c, -14, -26, 14, 8, o.top || o.a, 0.3);
  c.fillStyle = tg; c.strokeStyle = XOL; c.lineWidth = 0.9; c.beginPath(); c.moveTo(-13, -26); c.quadraticCurveTo(0, -30, 13, -26); c.lineTo(11, 6); c.quadraticCurveTo(0, 9, -11, 6); c.closePath(); c.fill(); c.stroke();
  // 交領
  c.fillStyle = o.b; c.beginPath(); c.moveTo(-6, -27); c.lineTo(3, -6); c.lineTo(6, -9); c.lineTo(-2, -27.5); c.closePath(); c.fill(); c.beginPath(); c.moveTo(6, -27); c.lineTo(-2, -12); c.lineTo(-4, -15); c.lineTo(2, -27.5); c.closePath(); c.fill();
  if (o.armor) { c.fillStyle = xyGrad(c, -12, -24, 12, 0, o.armor, 0.5); c.strokeStyle = XOL; c.lineWidth = 0.8; for (const d of [-1, 1]) { c.beginPath(); c.moveTo(d * 1.5, -24); c.quadraticCurveTo(d * 13, -26, d * 12, -12); c.quadraticCurveTo(d * 8, -6, d * 1.5, -8); c.closePath(); c.fill(); c.stroke(); } G.circle(c, 0, -14, 3.4, xyGrad(c, -3, -17, 3, -11, '#f0c040', 0.5), XOL, 0.6); }
  if (o.beads) for (let i = 0; i < 11; i++) { const a = Math.PI * (0.12 + i * 0.076); G.circle(c, Math.cos(a) * 12, -27 + Math.sin(a) * 18, 2.4, i === 5 ? '#e04020' : '#6a4a3a', XOL, 0.4); }
  // 腰帶
  c.fillStyle = xyGrad(c, -12, 2, 12, 8, o.belt || '#c89838', 0.4); c.strokeStyle = XOL; c.lineWidth = 0.7; c.beginPath(); c.roundRect(-12, 1.5, 24, 5.4, 2); c.fill(); c.stroke();
  G.circle(c, 0, 4.2, 2.8, '#f0d060', XOL, 0.5); G.circle(c, 0, 4.2, 1.2, o.c);
  // 手臂
  for (const d of [-1, 1]) {
    const hx = d < 0 ? -19 : 24, hy2 = d < 0 ? 4 : 2;
    A.body(c, [[d * 12, -23], [d * 18, -12], [hx, hy2]], [5.4, 4.2], o.top || o.a);
    c.fillStyle = sh(o.b, 0.1); c.strokeStyle = XOL; c.lineWidth = 0.6; c.beginPath(); c.ellipse(hx - d * 0.6, hy2 - 3, 5.6, 2.4, d * 0.5, 0, 7); c.fill(); c.stroke();
    if (o.pads) { c.fillStyle = xyGrad(c, d * 8, -30, d * 22, -18, o.pads, 0.45); c.beginPath(); c.moveTo(d * 9, -28); c.quadraticCurveTo(d * 22, -32, d * 22, -18); c.quadraticCurveTo(d * 16, -22, d * 9, -20); c.closePath(); c.fill(); c.stroke(); }
    G.circle(c, hx, hy2 + 1.4, 3.4, o.handc || o.skin || '#f6d4b4', XOL, 0.6);
  }
  xyWeapon(c, o.weapon, t, o);
  // 頭
  A.body(c, [[0, -26], [0, -22]], [4, 4], o.skin || '#f6d4b4');
  xyHead(c, k, t, o, 0, hy);
  if (o.crown) { c.fillStyle = xyGrad(c, -8, hy - 18, 8, hy - 10, '#f0c040', 0.5); c.strokeStyle = XOL; c.lineWidth = 0.6; c.beginPath(); c.moveTo(-8, hy - 9); c.lineTo(-7, hy - 17); c.lineTo(-3, hy - 13); c.lineTo(0, hy - 19); c.lineTo(3, hy - 13); c.lineTo(7, hy - 17); c.lineTo(8, hy - 9); c.closePath(); c.fill(); c.stroke(); G.circle(c, 0, hy - 13, 1.5, o.c); }
  if (o.aura) { c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.25 + Math.sin(t * 3) * 0.1; const g = c.createRadialGradient(0, -10, 10, 0, -10, 56); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, o.aura); c.fillStyle = g; c.beginPath(); c.arc(0, -10, 56, 0, 7); c.fill(); c.restore(); }
  c.restore();
};
function xyBuddha(c, t, o) {
  // 佛光
  c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 24; i++) { const a = i / 24 * 6.283 + t * 0.15, L = 50 + (i % 2) * 10; c.strokeStyle = `rgba(255,220,120,${0.25 + (i % 3) * 0.08})`; c.lineWidth = 2; c.beginPath(); c.moveTo(Math.cos(a) * 20, -30 + Math.sin(a) * 20); c.lineTo(Math.cos(a) * L, -30 + Math.sin(a) * L); c.stroke(); }
  const g = c.createRadialGradient(0, -30, 6, 0, -30, 34); g.addColorStop(0, 'rgba(255,250,200,0.9)'); g.addColorStop(0.6, 'rgba(255,200,80,0.45)'); g.addColorStop(1, 'rgba(255,160,40,0)'); c.fillStyle = g; c.beginPath(); c.arc(0, -30, 34, 0, 7); c.fill();
  c.restore();
  c.save(); c.shadowColor = '#ffe080'; c.shadowBlur = 10; c.strokeStyle = '#ffd040'; c.lineWidth = 1.8; c.beginPath(); c.arc(0, -34, 17, 0, 7); c.stroke(); c.beginPath(); c.arc(0, -14, 34, 0, 7); c.stroke(); c.restore();
  // 蓮花座
  for (let row = 0; row < 2; row++) for (let i = -4; i <= 4; i++) {
    const x = i * 7.4 * (row ? 1.15 : 0.9), y = 34 + row * 6, g2 = c.createLinearGradient(x, y - 12, x, y + 4); g2.addColorStop(0, '#fff0f4'); g2.addColorStop(1, row ? '#e06090' : '#f0a0c0');
    c.fillStyle = g2; c.strokeStyle = XOL; c.lineWidth = 0.5; c.beginPath(); c.moveTo(x - 5, y + 4); c.quadraticCurveTo(x - 5, y - 6, x, y - 12 + Math.abs(i)); c.quadraticCurveTo(x + 5, y - 6, x + 5, y + 4); c.closePath(); c.fill(); c.stroke();
  }
  // 盤坐袈裟
  c.fillStyle = xyGrad(c, -30, 14, 30, 34, o.a, 0.3); c.strokeStyle = XOL; c.lineWidth = 0.9;
  c.beginPath(); c.moveTo(-14, 10); c.quadraticCurveTo(-34, 16, -32, 30); c.quadraticCurveTo(0, 38, 32, 30); c.quadraticCurveTo(34, 16, 14, 10); c.closePath(); c.fill(); c.stroke();
  for (const d of [-1, 1]) G.ell(c, d * 8, 27, 5, 2.6, o.skin, XOL, 0.5);
  c.fillStyle = xyGrad(c, -15, -26, 15, 12, o.a, 0.35); c.beginPath(); c.moveTo(-13, -24); c.quadraticCurveTo(0, -28, 13, -24); c.quadraticCurveTo(17, 0, 15, 14); c.quadraticCurveTo(0, 18, -15, 14); c.quadraticCurveTo(-17, 0, -13, -24); c.closePath(); c.fill(); c.stroke();
  c.fillStyle = o.b; c.beginPath(); c.moveTo(-13, -24); c.quadraticCurveTo(-2, -20, 6, 14); c.lineTo(1, 15); c.quadraticCurveTo(-6, -12, -15, -18); c.closePath(); c.fill();
  c.fillStyle = o.skin; c.beginPath(); c.moveTo(2, -25); c.quadraticCurveTo(12, -24, 12, -10); c.quadraticCurveTo(6, -14, 3, -12); c.closePath(); c.fill(); c.stroke();
  G.ell(c, 6, -16, 3, 3, '#f0c040'); c.fillStyle = '#ff4040'; c.font = 'bold 5px serif'; c.textAlign = 'center'; c.fillText('卍', 6, -14.4);
  // 手印
  A.body(c, [[-13, -20], [-20, -6], [-10, 14]], [4.6, 3.6], o.a); G.circle(c, -9, 14, 3.6, o.skin, XOL, 0.6);
  A.body(c, [[13, -20], [22, -12], [17, -2]], [4.6, 3.6], o.a); c.fillStyle = o.skin; c.strokeStyle = XOL; c.lineWidth = 0.6; c.beginPath(); c.ellipse(17, -7, 3, 5.4, 0.1, 0, 7); c.fill(); c.stroke();
  A.body(c, [[0, -26], [0, -23]], [4, 4], o.skin);
  xyHead(c, 'buddha', t, o, 0, -34);
  // 金光蓮瓣飄落
  for (let i = 0; i < 6; i++) { const p = (t * 0.25 + i / 6) % 1, x = Math.sin(i * 2.1 + t) * 40, y = -60 + p * 100; c.globalAlpha = 1 - p; G.ell(c, x, y, 2.4, 1.2, '#ffd0e0', null, 0, p * 6); c.globalAlpha = 1; }
}

// ---------- 招式 ----------
Object.assign(MOVES, {
  xy_blackwind: { n: '黑風烈焰', t: '暗', p: 115, a: 95, pp: 20, fxk: 'blast', d: '捲起黑風與火焰燒向對手。', e: { burn: 0.2 } },
  xy_bear: { n: '熊羆撼山', t: '地', p: 110, a: 95, pp: 20, fxk: 'quake', d: '巨掌拍地，山搖地動。' },
  xy_wind: { n: '三昧神風', t: '風', p: 120, a: 90, pp: 15, fxk: 'twister', d: '吹得天昏地暗的妖風，可能使對手混亂。', e: { conf: 0.25 } },
  xy_trident: { n: '鋼叉突刺', t: '鋼', p: 105, a: 100, pp: 20, fxk: 'needles', d: '三股鋼叉連刺。' },
  xy_bone: { n: '白骨陰風', t: '靈', p: 115, a: 95, pp: 20, fxk: 'mist', d: '陰冷的白骨之風，吸取體力。', e: { drain: 0.3 } },
  xy_morph: { n: '三變化形', t: '幻', p: 0, a: 100, pp: 15, d: '化成村姑、老婦、老翁迷惑對手。', e: { conf: 1 } },
  xy_robe: { n: '黃袍魔刀', t: '鬥', p: 115, a: 95, pp: 20, fxk: 'slash', d: '奎木狼星下凡的刀法。', e: { crit: 1 } },
  xy_gourd: { n: '紫金紅葫蘆', t: '光', p: 130, a: 90, pp: 10, fxk: 'orb', d: '叫一聲名字，答應就被吸進葫蘆！' },
  xy_vase: { n: '羊脂玉淨瓶', t: '冰', p: 125, a: 90, pp: 10, fxk: 'drain', d: '把對手的力量吸進玉瓶。', e: { drain: 0.35 } },
  xy_samadhi: { n: '三昧真火', t: '火', p: 140, a: 90, pp: 10, fxk: 'pillar', d: '連龍王的雨都澆不熄的真火。', e: { burn: 0.35 } },
  xy_spear: { n: '火尖槍', t: '火', p: 110, a: 100, pp: 20, fxk: 'slash', d: '紅孩兒的長槍，槍尖噴火。', e: { burn: 0.15 } },
  xy_fan: { n: '芭蕉扇', t: '風', p: 135, a: 90, pp: 10, fxk: 'twister', d: '一扇八萬四千里，把對手搧得老遠。', e: { foe: { spd: -1 } } },
  xy_bull: { n: '大力牛魔拳', t: '鬥', p: 140, a: 90, pp: 10, fxk: 'quake', d: '平天大聖的千斤蠻力。' },
  xy_cymbal: { n: '金鐃罩頂', t: '幻', p: 120, a: 95, pp: 15, fxk: 'rings', d: '用金鐃把對手罩住，可能使其麻痺。', e: { par: 0.3 } },
  xy_silk: { n: '盤絲天網', t: '木', p: 110, a: 95, pp: 15, fxk: 'chains', d: '肚臍吐出的蛛絲，纏得對手動彈不得。', e: { foe: { spd: -2 } } },
  xy_roar: { n: '青獅怒吼', t: '鬥', p: 125, a: 95, pp: 15, fxk: 'sound', d: '吞下十萬天兵的大口一吼。', e: { conf: 0.2 } },
  xy_trunk: { n: '象鼻捲天', t: '地', p: 125, a: 95, pp: 15, fxk: 'quake', d: '長鼻把對手捲起摔下。' },
  xy_roc: { n: '金翅搏擊', t: '風', p: 135, a: 95, pp: 10, fxk: 'feathers', d: '一翅九萬里的金翅大鵬。', e: { crit: 1 } },
  xy_staff: { n: '如意亂棒', t: '鬥', p: 45, a: 100, pp: 15, fxk: 'barrage', d: '鐵棒狂風暴雨般連打 2~5 次。', e: { multi: [2, 5] } },
  xy_mimic: { n: '真假難辨', t: '幻', p: 0, a: 100, pp: 10, d: '變成和對手一模一樣，攻擊與速度大幅提升。', e: { self: { atk: 2, spd: 1 } } },
  xy_palm: { n: '五指山', t: '光', p: 180, a: 85, pp: 5, fxk: 'meteor', d: '翻掌化作五座大山壓下。' },
  xy_dharma: { n: '萬佛朝宗', t: '幻', p: 160, a: 90, pp: 5, fxk: 'beam', d: '千萬佛光同時照下。' },
  xy_lotus: { n: '金蓮淨世', t: '光', p: 0, a: 100, pp: 5, d: '金蓮綻放，回復一半體力並淨化異常狀態。', e: { heal: 0.5, cure: 1 } },
  xy_rake: { n: '九齒釘耙', t: '地', p: 115, a: 95, pp: 20, fxk: 'claw', d: '天蓬元帥的釘耙一耙下去。' },
  xy_belly: { n: '肚皮彈跳', t: '鬥', p: 90, a: 100, pp: 20, fxk: 'quake', d: '用圓滾滾的肚子撞過去。' },
  xy_sand: { n: '流沙降妖', t: '水', p: 115, a: 95, pp: 20, fxk: 'rain', d: '捲起流沙河的濁浪。' },
  xy_dragon: { n: '白龍化雨', t: '水', p: 120, a: 95, pp: 15, fxk: 'rain', d: '西海龍王三太子降下甘霖。' },
  xy_pearl: { n: '龍珠光輝', t: '光', p: 110, a: 100, pp: 15, fxk: 'beam', d: '龍珠射出聖潔的光芒。' },
});

// ---------- 角色資料 ----------
const XY0 = 1104;
const XY_LIST = [
  // [名字, 屬性, 能力, 造型, 招式, 介紹, 神獸?, 人名?]
  ['黑風怪', ['暗', '地'], [130, 135, 125, 90], { head: 'bear', a: '#2a2a34', b: '#c8a040', c: '#ff6030', fur: '#2a2228', armor: '#3a3a48', weapon: 'spear', cape: '#4a1818' }, ['xy_blackwind', 'xy_bear'], '黑風山的熊精，偷了唐僧的袈裟要辦「佛衣會」。', 0, 0],
  ['黃風怪', ['風', '地'], [120, 130, 110, 135], { head: 'rat', a: '#c89838', b: '#7a4a18', c: '#ffe040', fur: '#d0a050', weapon: 'trident', top: '#a07028' }, ['xy_wind', 'xy_trident'], '黃風嶺的黃毛貂鼠，一口三昧神風能吹瞎人眼。', 0, 0],
  ['白骨精', ['靈', '暗'], [115, 140, 105, 140], { head: 'human', hs: 'skull', a: '#f0eef4', b: '#8a6ab0', c: '#a080ff', skin: '#f8f0f0', hair: '#1a1018', weapon: 'sword', long: 1, skirt: 22, aura: '#8060c0' }, ['xy_bone', 'xy_morph'], '白虎嶺的屍魔，三次變化想騙唐僧，被悟空三打。', 0, 1],
  ['黃袍怪', ['暗', '鬥'], [135, 140, 120, 110], { head: 'ogre', a: '#d8b040', b: '#6a3a10', c: '#ffe080', skin: '#5a80c0', hair: '#c03020', weapon: 'sword', armor: '#c09030', pads: '#c09030' }, ['xy_robe', 'xy_bear'], '碗子山波月洞的妖王，原是天上的奎木狼星。', 0, 0],
  ['金角大王', ['光', '地'], [135, 140, 130, 115], { head: 'ogre', a: '#f0c040', b: '#a02020', c: '#ffe060', skin: '#e0b060', horn: '#ffe080', hair: '#3a2010', weapon: 'gourd', gourd: '#d03020', crown: 1, armor: '#d0a030' }, ['xy_gourd', 'xy_bear'], '平頂山蓮花洞大王，原是太上老君看金爐的童子。', 0, 0],
  ['銀角大王', ['冰', '鋼'], [130, 140, 130, 120], { head: 'ogre', a: '#d0d8e8', b: '#3a5aa0', c: '#a0e0ff', skin: '#b8c8e0', horn: '#ffffff', hair: '#2a2a3a', weapon: 'gourd', gourd: '#e8f0ff', crown: 1, armor: '#c0c8d8' }, ['xy_vase', 'xy_trident'], '平頂山二大王，原是太上老君看銀爐的童子。', 0, 0],
  ['紅孩兒', ['火'], [120, 150, 110, 150], { head: 'human', hs: 'tufts', a: '#e83020', b: '#ffd040', c: '#ff8020', skin: '#fbd8b8', hair: '#201010', weapon: 'fire', top: '#ff5030', fire: 1 }, ['xy_samadhi', 'xy_spear'], '火雲洞聖嬰大王，牛魔王之子，練成三昧真火。', 0, 1],
  ['鐵扇公主', ['風', '火'], [135, 135, 135, 130], { head: 'human', hs: 'lady', a: '#3a8a5a', b: '#f0c040', c: '#c0ff80', skin: '#fbe0cc', hair: '#1a1018', weapon: 'fan', long: 1, skirt: 24 }, ['xy_fan', 'xy_wind'], '芭蕉洞的羅剎女，手中芭蕉扇能搧滅火焰山。', 0, 1],
  ['牛魔王', ['火', '鬥'], [170, 170, 150, 120], { head: 'bull', a: '#2a2228', b: '#c03020', c: '#ff6030', fur: '#3a2a28', weapon: 'iron', armor: '#4a4a58', pads: '#5a5a68', cape: '#8a1a14' }, ['xy_bull', 'xy_samadhi'], '平天大聖牛魔王，和悟空結拜的七大聖之首。', 1, 1],
  ['黃眉大王', ['幻', '暗'], [150, 145, 140, 120], { head: 'human', hs: 'monk', a: '#e0a830', b: '#8a2020', c: '#ffe060', skin: '#f0c8a0', brow: '#f0d040', weapon: 'staff', wc: '#6a4a2a', cymbal: 1, beads: 1 }, ['xy_cymbal', 'xy_morph'], '假扮佛祖的小雷音寺妖王，原是彌勒佛敲磬的黃眉童子。', 0, 0],
  ['蜘蛛精', ['木', '暗'], [125, 140, 115, 150], { head: 'human', hs: 'lady', a: '#9a50c0', b: '#f0c0e0', c: '#ff80c0', skin: '#fbe0d8', hair: '#2a1030', weapon: 'sword', long: 1, skirt: 22, spider: 1 }, ['xy_silk', 'xy_bone'], '盤絲洞的七姊妹之首，蛛絲遮天蔽日。', 0, 1],
  ['青獅精', ['鬥', '地'], [160, 155, 140, 115], { head: 'lion', a: '#3a5a8a', b: '#f0c040', c: '#ffe060', fur: '#6a8ab0', mane: '#2a4a8a', weapon: 'sword', armor: '#4a6a9a', pads: '#4a6a9a' }, ['xy_roar', 'xy_bull'], '獅駝嶺大大王，文殊菩薩的坐騎。', 0, 0],
  ['白象精', ['地', '鋼'], [170, 150, 160, 100], { head: 'elephant', a: '#d8d8d0', b: '#8a4a20', c: '#ffd080', fur: '#c8c8c0', weapon: 'spear', armor: '#a0a0a8', pads: '#a0a0a8' }, ['xy_trunk', 'xy_trident'], '獅駝嶺二大王，普賢菩薩的坐騎。', 0, 0],
  ['大鵬金翅鵰', ['風', '光'], [160, 175, 140, 175], { head: 'roc', a: '#d89820', b: '#7a3a10', c: '#ffe060', fur: '#e0a830', weapon: 'spear', wings: 1, armor: '#f0c040', aura: '#ffd040' }, ['xy_roc', 'xy_wind'], '獅駝嶺三大王，一翅九萬里，如來佛祖的「舅舅」。', 1, 0],
  ['六耳獼猴', ['鬥', '暗'], [165, 180, 145, 180], { head: 'monkey', a: '#4a2a3a', b: '#c8a040', c: '#ff4040', fur: '#5a4048', skin: '#d8b090', weapon: 'staff', wc: '#2a2a2a', cape: '#3a1a28', armor: '#6a5a40' }, ['xy_staff', 'xy_mimic'], '和孫悟空長得一模一樣的假美猴王，善聆音能察理。', 1, 0],
  ['如來佛祖', ['光', '幻'], [255, 200, 220, 170], { head: 'buddha', a: '#e8b040', b: '#c03020', c: '#ffe080', skin: '#f8dca0' }, ['xy_palm', 'xy_dharma', 'xy_lotus'], '西天靈山雷音寺的佛祖，曾翻掌化作五指山壓住齊天大聖。', 1, 1],
  ['豬八戒', ['地', '水'], [150, 125, 115, 80], { head: 'pig', a: '#3a3a4a', b: '#f0c040', c: '#ffd080', fur: '#f4b8c0', weapon: 'rake', top: '#2a2a3a', beads: 0, belt: '#8a6a3a' }, ['xy_rake', 'xy_belly'], '天蓬元帥投錯豬胎，好吃懶做卻很重義氣的二師兄。', 0, 1],
  ['沙悟淨', ['水', '地'], [140, 120, 140, 85], { head: 'ogre', a: '#5a6a8a', b: '#c8a050', c: '#80e0ff', skin: '#7a9a9a', horn: 0, hair: '#4a2a1a', beard: '#4a2a1a', weapon: 'monk', beads: 1 }, ['xy_sand', 'xy_rake'], '捲簾大將，在流沙河等候取經人的三師弟。', 0, 1],
];
const XY_ID = {}; XY_LIST.forEach((q, i) => XY_ID[q[0]] = XY0 + i);
const WHITE_DRAGON = XY0 + XY_LIST.length; // 白龍馬
XY_LIST.forEach(([n, t, b, art, sig, desc, big, human], i) => {
  const id = XY0 + i, tm = TYPE_MOVES[t[0]], tm2 = TYPE_MOVES[t[1] || t[0]];
  const learn = sig.map(m => [1, m]);
  for (const mv of [tm2[1][0], tm[2][0], tm[1][0]]) if (learn.length < 5 && !learn.some(q => q[1] === mv)) learn.push([1, mv]);
  learn.push([40, tm[2][0]]);
  MONS[id] = { n, t, b, cr: big ? 3 : 8, xp: big ? 420 : 300, h: '1.9 m', w: '90.0 kg', hab: '西遊記篇・取經之路', desc, big: !!big, human: !!human, xy: true, art: Object.assign({ plan: 'xiyou', s: big ? 4 : 3 }, art), learn };
  SPRITES[id] = (c, tt) => drawPlan(c, id, tt);
});
MONS[WHITE_DRAGON] = { n: '白龍馬', t: ['水', '光'], b: [125, 115, 115, 130], cr: 8, xp: 300, h: '4.0 m', w: '300.0 kg', hab: '西遊記篇・鷹愁澗', xy: true,
  desc: '西海龍王三太子，化作白馬馱著唐僧走完十萬八千里。可以當坐騎！',
  art: { plan: 'dragon', s: 3, a: '#f4f6ff', b: '#80b0e0', c: '#ffe080' }, learn: [[1, 'xy_dragon'], [1, 'xy_pearl'], [1, TYPE_MOVES['水'][1][0]], [1, TYPE_MOVES['光'][1][0]], [1, TYPE_MOVES['水'][2][0]]] };
SPRITES[WHITE_DRAGON] = (c, tt) => drawPlan(c, WHITE_DRAGON, tt);
MONS[WUKONG].human = true; // 孫悟空的名字算人名
MONS[ZINING].human = true;
const NYORAI = XY_ID['如來佛祖'];

// ---------- 十五關 ----------
const XY_STAGES = [
  { boss: '黑風怪', place: '黑風山・黑風洞', minion: ['暗', '地'], line: ['好香的袈裟！今晚就辦一場「佛衣會」！', '想要回袈裟？先問問俺的黑纓槍！'], win: ['袈裟還你、還你……俺願意去南海給觀音菩薩看山門。'] },
  { boss: '黃風怪', place: '黃風嶺・黃風洞', minion: ['風', '地'], line: ['嘻嘻嘻，這陣風吹過，你的眼睛就看不見了！', '三昧神風——起！'], win: ['定風丹……你們請來了靈吉菩薩！吱吱，俺投降！'] },
  { boss: '白骨精', place: '白虎嶺・白骨洞', minion: ['靈', '暗'], line: ['哎呀，小哥哥，你一個人走山路不怕嗎？', '……被看穿了嗎？那就別怪我露出原形！'], win: ['三次變化都被識破……好一雙火眼金睛……'] },
  { boss: '黃袍怪', place: '碗子山・波月洞', minion: ['暗', '鬥'], line: ['俺本是天上二十八宿的奎木狼！', '下凡十三年，誰也別想帶走俺的百花羞！'], win: ['唉，天上已經點卯了……俺還是回天上去吧。'] },
  { boss: '金角大王', place: '平頂山・蓮花洞', minion: ['光', '地'], line: ['我叫你一聲，你敢答應嗎？', '答應了，就被吸進我的紫金紅葫蘆！'], win: ['葫蘆……怎麼反而把我吸進去了！'] },
  { boss: '銀角大王', place: '平頂山・壓龍洞', minion: ['冰', '鋼'], line: ['哥哥被你收了？', '我的羊脂玉淨瓶可不會手下留情！'], win: ['好吧好吧，我們回兜率宮給老君看爐子……'] },
  { boss: '紅孩兒', place: '號山・火雲洞', minion: ['火'], line: ['我是聖嬰大王！我爸爸是牛魔王！', '看我的三昧真火，連四海龍王的雨都澆不熄！'], win: ['嗚哇——觀音菩薩的蓮花台好燙……我、我當善財童子就是了！'] },
  { boss: '鐵扇公主', place: '翠雲山・芭蕉洞', minion: ['風', '火'], line: ['你們害我孩兒去當什麼善財童子！', '想借芭蕉扇過火焰山？先吃我一扇！'], win: ['……扇子給你。過了火焰山，記得還我。'] },
  { boss: '牛魔王', place: '火焰山・積雷山', minion: ['火', '鬥'], line: ['老孫的朋友？哼，七大聖結拜的情分早就斷了！', '平天大聖在此，火焰山的火就是我的火！'], win: ['俺服了……把扇子拿去，搧滅這八百里火焰吧。'] },
  { boss: '黃眉大王', place: '小西天・小雷音寺', minion: ['幻', '暗'], line: ['阿彌陀佛——這裡就是雷音寺，我就是佛祖！', '不信？那就被我的金鐃關上三天三夜！'], win: ['彌勒佛祖來了……我只是偷了人種袋的小童子啊……'] },
  { boss: '蜘蛛精', place: '盤絲嶺・盤絲洞', minion: ['木', '暗'], line: ['七姊妹正在濯垢泉洗澡，誰敢偷看？', '盤絲大法——把你們通通綁起來！'], win: ['蛛絲都被燒斷了……姊妹們，快逃！'] },
  { boss: '青獅精', place: '獅駝嶺・獅駝洞', minion: ['鬥', '地'], line: ['我曾一口吞下十萬天兵！', '小小靈契師，夠我塞牙縫嗎？'], win: ['文殊菩薩來接我了……吼……'] },
  { boss: '白象精', place: '獅駝嶺・象鼻峰', minion: ['地', '鋼'], line: ['大哥被打敗了？', '讓我的長鼻子把你捲起來摔到天上去！'], win: ['普賢菩薩……我跟您回峨眉山……'] },
  { boss: '大鵬金翅鵰', place: '獅駝國・金殿', minion: ['風', '光'], line: ['一翅九萬里，連孫悟空都追不上我！', '連如來都要叫我一聲舅舅，你算什麼？'], win: ['……如來的佛光好亮，我飛不動了。'] },
  { boss: '六耳獼猴', place: '真假美猴王・南海', minion: ['鬥', '暗'], line: ['我才是真正的孫悟空！', '你分得出來嗎？連觀音菩薩都分不出來！'], win: ['被諦聽聽出來了……我果然只是六耳獼猴……'] },
  { boss: '如來佛祖', place: '靈山・大雷音寺', minion: ['光', '幻'], line: ['善哉，善哉。', '十萬八千里，九九八十一難，你們都走過來了。', '最後一難，就是讓我看看你心中的佛光。'], win: ['南無阿彌陀佛。', '你和夥伴的心，比金剛還要堅固。', '真經賜予你們。我也願隨你走一程，看看這個世界。'] },
];
XY_STAGES.forEach(q => q.id = XY_ID[q.boss]);

// ---------- 地圖 ----------
THEME.xiyou = Object.assign({}, THEME.huaguo, { g: '#9ab860', g2: '#88a850', path: '#e0c890', tree: '#4a8a40', tree2: '#2a5a2a', gh: '#c0e080', wx: 'green' });
LIGHT.xiyou = ['255,230,170', 0.12];
BBG.xiyou = { sky: ['#f0c070', '#fff4d8'], hill: ['#8a7a50', '#5a5a3a'], ground: ['#c8b070', '#8a7a40'], plat: ['#e8d8a0', '#a08a50'], tuft: '#7a8a3a' };
MAP_SONG.xiyou = 'route';
const XYW = 12, XN = XY_STAGES.length;
const XY_ROWS = ['TTTTTTTTTTTT', 'TT...==...TT', 'TT...==...TT'];
for (let g = XN - 1; g >= 0; g--) XY_ROWS.push('TTTTT==TTTTT', 'TT...==...TT', 'TT...==...TT');
XY_ROWS.push('TT...==...TT', 'TT...==...TT', 'TTTTTTTTTTTT');
const xyGateY = i => 3 + (XN - 1 - i) * 3;
MAPS.xiyou = { name: '西遊記篇・取經之路', theme: 'xiyou', rows: XY_ROWS, w: XYW, h: XY_ROWS.length, exits: [], doors: {}, signs: {}, triggers: [], npcs: [], roofAt: {} };
{
  const m = MAPS.xiyou, H0 = m.h, imp = { hair: '#2a3a20', shirt: '#6a4a8a', pants: '#3a2a40', skin: '#a8c878' };
  XY_STAGES.forEach((q, i) => {
    const gy = xyGateY(i), key = 'xy' + i;
    m.npcs.push({ id: 'xyb' + i, x: 5, y: gy, dir: 'down', legend: q.id, name: q.boss, cond: () => !flag(key), talk: () => xyBattle(i) });
    m.npcs.push({ id: 'xyi' + i, x: 6, y: gy, dir: 'down', look: imp, name: '小妖', cond: () => !flag(key), talk: () => say(`我們大王「${q.boss}」就在這裡！要過去先打贏大王！`, { name: '小妖' }) });
    m.npcs.push({ id: 'xyr' + i, x: 9, y: gy + 1, dir: 'left', look: { hair: '#c8a050', shirt: '#e8d8b0', pants: '#8a6a3a' }, name: '土地公', cond: () => flag(key) && i < XN - 1, talk: async () => { healParty(); await say([`這裡是「${q.place}」。`, '老朽替你們療傷吧。（隊伍完全恢復了！）'], { name: '土地公' }); const c = await choose(['再戰一次', '不用了'], { title: `要再挑戰${q.boss}嗎？`, w: 300, x: W / 2 - 150, y: 260 }); if (c === 0) await xyBattle(i, true); } });
  });
  m.npcs.push({ id: 'tang', x: 3, y: H0 - 3, dir: 'right', look: { hair: '#f0d8c0', shirt: '#e8c040', pants: '#c03020', robe: '#c83a2a', skin: '#f6d8b8' }, name: '唐三藏', talk: () => xyTang() });
  m.npcs.push({ id: 'guanyin', x: 8, y: H0 - 3, dir: 'left', look: { hair: '#202028', shirt: '#ffffff', pants: '#e8f0f8', robe: '#f4f8ff', skin: '#fbe8d8' }, name: '觀音菩薩', talk: () => xyGuanyin() });
  m.npcs.push({ id: 'xyend', x: 5, y: 1, dir: 'down', look: { hair: '#f0d8c0', shirt: '#e8c040', pants: '#c03020', robe: '#c83a2a', skin: '#f6d8b8' }, name: '唐三藏', cond: () => flag('xyEnd'), talk: async () => { healParty(); await say(['真經已經取到了。', '阿彌陀佛，多謝施主一路相護。（隊伍完全恢復了！）', '如來佛祖還在大殿，想再請教的話隨時可以去。'], { name: '唐三藏' }); const c = await choose(['再向如來請教一戰', '不用了'], { w: 320, x: W / 2 - 160, y: 260 }); if (c === 0) await xyBattle(XN - 1, true); } });
  for (const n of m.npcs) n._home = [n.x, n.y];
}
async function xyTang() {
  healParty();
  const hasWk = S.party.some(m => m.id === WUKONG);
  await say(hasWk ? ['悟空！你也來了！', '有大聖和施主在，貧僧就安心了。（隊伍完全恢復了！）'] : ['貧僧唐三藏，奉唐王之命前往西天拜佛求經。', '一路上妖魔鬼怪都想吃貧僧的肉……', '施主若願護送，貧僧感激不盡。（隊伍完全恢復了！）'], { name: '唐三藏' });
}
async function xyGuanyin() {
  const i = XY_STAGES.findIndex((_, k) => !flag('xy' + k));
  await say(i < 0 ? ['八十一難已滿，功德圓滿。', '善哉。'] : [`下一難在「${XY_STAGES[i].place}」，妖王是${XY_STAGES[i].boss}。`, '妖王的強度會配合你的夥伴，打不過就先回來找唐僧休息。', '打敗的妖王，都會被你感化而成為夥伴。'], { name: '觀音菩薩' });
}
function xyBase() { return Math.max(10, ...S.party.concat(S.box).map(m => m.level)); }
function xyBossMon(id, lv, k, hpk) {
  const m = makeMon(id, lv);
  if (MONS[id].big) { const L = LEGEND_POWER; m.maxHp = Math.round(m.maxHp / L); m.atk = Math.round(m.atk / L); m.def = Math.round(m.def / L); m.spd = Math.round(m.spd / L); }
  m.atk = Math.round(m.atk * k); m.def = Math.round(m.def * k); m.spd = Math.round(m.spd * Math.min(k, 1.6)); m.maxHp = m.hp = Math.round(m.maxHp * hpk);
  return m;
}
function xyMinion(types, lv, j) {
  const pool = Object.keys(MONS).map(Number).filter(id => id < 1104 && !MONS[id].big && MONS[id].t.some(t => types.includes(t)) && MONS[id].art);
  return makeMon(pool[(j * 97 + lv * 13) % pool.length], lv);
}
async function xyBattle(i, again) {
  const q = XY_STAGES[i], key = 'xy' + i, last = i === XN - 1;
  await say(q.line, { name: q.boss });
  const c = await choose(['迎戰！', '先準備一下'], { title: `挑戰${q.place}的${q.boss}？`, w: 340, x: W / 2 - 170, y: 300 });
  if (c !== 0) return;
  const base = xyBase(), lv = Math.min(LEVEL_CAP, base + 3 + Math.floor(i / 2));
  const team = [];
  if (!last) for (let j = 0; j < 2 + Math.floor(i / 5); j++) team.push(xyMinion(q.minion, Math.max(5, base - 4 + j), i + j));
  team.push(xyBossMon(q.id, lv, last ? 2.2 : 1.45 + i * 0.05, last ? 6 : 2.4 + i * 0.12));
  const r = await runBattle({ trainer: { name: (last ? '' : '妖王 ') + q.boss, look: { hair: '#2a1a14', shirt: '#4a2a3a', pants: '#2a1a20' }, money: lv * (last ? 1200 : 400) }, foeTeam: team });
  if (r !== 'win') return;
  await say(q.win, { name: q.boss });
  if (!flag(key)) {
    setFlag(key);
    const m = makeMon(q.id, Math.max(5, lv - 6)); S.dex.seen[q.id] = true; S.dex.caught[q.id] = true;
    const w = addMon(m); jingle('caught');
    await say(`${q.boss}被感化了，加入了${w === 'box' ? '靈匣' : '隊伍'}！`);
    if (i === 0) await xyJoin('豬八戒', ['（高老莊的方向跑來一個豬頭大耳的和尚……）', '師父！俺老豬來也！', '天蓬元帥豬八戒，從今天起跟你們一起取經！']);
    if (i === 1) await xyJoin('沙悟淨', ['（流沙河的水面翻起大浪……）', '捲簾大將沙悟淨，在此等候取經人多時了。', '大師兄、二師兄，我來挑擔吧。']);
    if (last) await xyFinale();
    saveGame(true);
  }
}
async function xyJoin(n, lines) {
  const id = XY_ID[n]; await say(lines, { name: n });
  const m = makeMon(id, Math.max(5, xyBase() - 5)); S.dex.seen[id] = true; S.dex.caught[id] = true;
  const w = addMon(m); jingle('caught'); await say(`${n}加入了${w === 'box' ? '靈匣' : '隊伍'}！`);
}
async function xyFinale() {
  setFlag('xyEnd'); S.money += 500000; addItem('fuseCore', 5);
  await fadeOut(600); fade = 0;
  await chapterCard('取經功成', '十萬八千里，九九八十一難，真經終於到手。');
  await fadeIn(300);
  await say(['你們捧著真經走出大雷音寺。', '唐三藏、悟空、八戒、悟淨、白龍馬都在你身後。', '（獲得了 $500000 和 融合晶石 ×5！西遊記篇完成！）']);
}
async function enterXiyou() {
  if (!S.party.length) { await say('要先有一隻夥伴才能出發喔！去村子右上方的星垣研究所領取吧。'); return false; }
  if (S.map !== 'xiyou' && !(typeof SAGAS !== 'undefined' && SAGAS[S.map])) S.xyBack = { map: S.map, x: S.x, y: S.y };
  else if (typeof SAGAS !== 'undefined' && SAGAS[S.map]) S.xyBack = S.sagaBack;
  S.dir = 'up';
  await warp('xiyou', 5, MAPS.xiyou.h - 2);
  if (!flag('xyIntro')) {
    setFlag('xyIntro');
    await chapterCard('西遊記篇', '九九八十一難，取經之路由你守護');
    await say(['貧僧唐三藏，要前往西天靈山取經。', '這一路有十五位妖王擋路，最後在靈山等著的是如來佛祖。'], { name: '唐三藏' });
    await say(['我是南海觀音。', '鷹愁澗的小白龍，就讓牠陪你上路吧。', '牠是一條龍——把牠排在隊伍第一位，就能騎著牠走喔！'], { name: '觀音菩薩' });
    const m = makeMon(WHITE_DRAGON, Math.max(5, xyBase() - 5)); S.dex.seen[WHITE_DRAGON] = true; S.dex.caught[WHITE_DRAGON] = true;
    const w = addMon(m); jingle('caught'); await say(`白龍馬加入了${w === 'box' ? '靈匣' : '隊伍'}！`);
    await say(['想離開時，按 X 打開選單選「離開西遊記篇」。'], { name: '觀音菩薩' });
  }
  return true;
}
async function leaveXiyou() { const b = S.xyBack || S.respawn; await warp(b.map, b.x, b.y); }
const navInfoXY = navInfo;
navInfo = function () {
  if (S.map !== 'xiyou') return navInfoXY();
  const i = XY_STAGES.findIndex((_, k) => !flag('xy' + k));
  if (i >= 0) return { tx: 5, ty: xyGateY(i), label: XY_STAGES[i].boss, line: `西遊記篇：第 ${i + 1} / ${XN} 難　${XY_STAGES[i].place}・${XY_STAGES[i].boss}` };
  return { label: '', line: '西遊記篇完成！按 X 可以離開' };
};
TIPS.push('按 X 打開選單，可以進入「西遊記篇」，一路打到靈山見如來佛祖。');
