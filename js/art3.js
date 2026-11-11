// ===== 三界篇的場景美術：障礙物、液體、戰鬥背景 =====

const OBST = {
  cloud(c, x, y, th) { for (const [ox, oy, r] of [[14, 30, 13], [34, 30, 13], [24, 20, 16]]) { const g = c.createRadialGradient(x + ox - 4, y + oy - 5, 2, x + ox, y + oy, r); g.addColorStop(0, '#ffffff'); g.addColorStop(1, th.tree); c.fillStyle = g; c.beginPath(); c.arc(x + ox, y + oy, r, 0, 7); c.fill(); } },
  pillar(c, x, y, th) {
    const g = c.createLinearGradient(x + 12, 0, x + 36, 0); g.addColorStop(0, '#ffffff'); g.addColorStop(0.5, '#e8e4dc'); g.addColorStop(1, '#a8a498');
    c.fillStyle = g; c.fillRect(x + 13, y - 8, 22, 48);
    c.strokeStyle = 'rgba(90,80,60,0.35)'; c.lineWidth = 1; for (let i = 1; i < 5; i++) { c.beginPath(); c.moveTo(x + 13 + i * 4.4, y - 6); c.lineTo(x + 13 + i * 4.4, y + 38); c.stroke(); }
    c.fillStyle = th.tree; c.fillRect(x + 8, y - 14, 32, 7); c.fillStyle = '#d8d4c8'; c.fillRect(x + 8, y + 38, 32, 7);
  },
  rock(c, x, y, th) { const g = c.createLinearGradient(x, y, x + 48, y + 48); g.addColorStop(0, shade(th.tree, 0.3)); g.addColorStop(1, shade(th.tree, -0.5)); c.fillStyle = g; c.beginPath(); c.moveTo(x + 3, y + 42); c.lineTo(x + 10, y + 12); c.lineTo(x + 26, y + 4); c.lineTo(x + 42, y + 18); c.lineTo(x + 46, y + 42); c.closePath(); c.fill(); c.strokeStyle = 'rgba(0,0,0,0.6)'; c.lineWidth = 1.4; c.stroke(); },
  asteroid(c, x, y, th, R) {
    const g = c.createRadialGradient(x + 18, y + 16, 3, x + 24, y + 24, 24); g.addColorStop(0, shade(th.tree, 0.45)); g.addColorStop(1, shade(th.tree, -0.55));
    c.fillStyle = g; c.beginPath(); c.ellipse(x + 24, y + 24, 21, 18, 0.2, 0, 7); c.fill(); c.strokeStyle = 'rgba(0,0,0,0.6)'; c.stroke();
    for (let i = 0; i < 4; i++) { c.fillStyle = 'rgba(0,0,0,0.3)'; c.beginPath(); c.arc(x + 12 + R() * 24, y + 12 + R() * 22, 2 + R() * 3, 0, 7); c.fill(); }
  },
  crystal(c, x, y, th) {
    c.save(); c.shadowColor = th.gh; c.shadowBlur = 12;
    for (const [ox, w, h] of [[8, 10, 30], [20, 13, 42], [33, 9, 24]]) { const g = c.createLinearGradient(x + ox, y, x + ox + w, y + 48); g.addColorStop(0, '#ffffff'); g.addColorStop(0.4, th.gh); g.addColorStop(1, th.tree); c.fillStyle = g; c.beginPath(); c.moveTo(x + ox, y + 46); c.lineTo(x + ox + w / 2, y + 46 - h); c.lineTo(x + ox + w, y + 46); c.closePath(); c.fill(); }
    c.restore();
  },
  spike(c, x, y, th) { for (const [ox, h] of [[8, 34], [22, 48], [36, 28]]) { const g = c.createLinearGradient(0, y + 46 - h, 0, y + 46); g.addColorStop(0, th.gh); g.addColorStop(1, shade(th.tree, -0.4)); c.fillStyle = g; c.beginPath(); c.moveTo(x + ox - 8, y + 46); c.lineTo(x + ox, y + 46 - h); c.lineTo(x + ox + 8, y + 46); c.closePath(); c.fill(); c.strokeStyle = 'rgba(0,0,0,0.6)'; c.stroke(); } },
  dead(c, x, y, th) { c.strokeStyle = shade(th.tree, -0.5); c.lineCap = 'round'; c.lineWidth = 6; c.beginPath(); c.moveTo(x + 24, y + 44); c.lineTo(x + 24, y + 18); c.stroke(); c.lineWidth = 3; for (const [a, b, d, e] of [[24, 28, 8, 12], [24, 22, 38, 6], [24, 18, 16, 0], [14, 20, 6, 22]]) { c.beginPath(); c.moveTo(x + a, y + b); c.lineTo(x + d, y + e); c.stroke(); } },
  bone(c, x, y) {
    c.strokeStyle = '#e8dcc0'; c.lineWidth = 3.4; c.lineCap = 'round';
    for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(x + 14 + i * 7, y + 44); c.quadraticCurveTo(x + 6 + i * 11, y + 22, x + 22 + i * 3, y + 10 + i * 3); c.stroke(); }
    c.fillStyle = '#efe6d0'; c.beginPath(); c.arc(x + 24, y + 34, 9, 0, 7); c.fill(); c.fillStyle = '#201410'; for (const d of [-3, 3]) { c.beginPath(); c.arc(x + 24 + d, y + 33, 2, 0, 7); c.fill(); }
  },
  blade(c, x, y) { for (const [ox, a] of [[12, -0.15], [24, 0.05], [36, 0.2]]) { c.save(); c.translate(x + ox, y + 46); c.rotate(a); const g = c.createLinearGradient(-4, 0, 4, 0); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#707888'); c.fillStyle = g; c.beginPath(); c.moveTo(-5, 0); c.lineTo(0, -46); c.lineTo(5, 0); c.closePath(); c.fill(); c.fillStyle = '#5a3a20'; c.fillRect(-8, -3, 16, 3); c.restore(); } },
  tomb(c, x, y, th) { const g = c.createLinearGradient(x + 10, 0, x + 38, 0); g.addColorStop(0, shade(th.path, 0.3)); g.addColorStop(1, shade(th.path, -0.5)); c.fillStyle = g; c.beginPath(); c.roundRect(x + 11, y + 8, 26, 36, [12, 12, 0, 0]); c.fill(); c.strokeStyle = 'rgba(0,0,0,0.7)'; c.lineWidth = 1.2; c.stroke(); c.strokeStyle = th.gh; c.beginPath(); c.moveTo(x + 24, y + 16); c.lineTo(x + 24, y + 34); c.moveTo(x + 18, y + 22); c.lineTo(x + 30, y + 22); c.stroke(); },
  mirror(c, x, y, th) { c.fillStyle = '#c8a050'; c.beginPath(); c.ellipse(x + 24, y + 20, 15, 22, 0, 0, 7); c.fill(); const g = c.createLinearGradient(x + 10, y, x + 38, y + 40); g.addColorStop(0, '#ffffff'); g.addColorStop(0.5, th.gh); g.addColorStop(1, th.tree); c.fillStyle = g; c.beginPath(); c.ellipse(x + 24, y + 20, 11.5, 18, 0, 0, 7); c.fill(); c.fillStyle = '#5a3a20'; c.fillRect(x + 21, y + 40, 6, 6); },
};

function drawLiquid(th, tx, ty, sx, sy, t) {
  const T = TILE, g = ctx.createLinearGradient(0, sy, 0, sy + T); g.addColorStop(0, th.d1); g.addColorStop(1, th.d2);
  ctx.fillStyle = g; ctx.fillRect(sx, sy, T, T);
  const q = th.liq, h = (tx * 7 + ty * 13);
  if (q === 'cloud' || q === 'mist') {
    ctx.fillStyle = q === 'cloud' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.28)';
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(sx + 8 + i * 16 + Math.sin(t * 0.7 + tx + i) * 4, sy + 26 + ((tx + ty + i) % 2) * 10, 13, 0, 7); ctx.fill(); }
  } else if (q === 'void') {
    for (let i = 0; i < 4; i++) { ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.5 + h + i)); ctx.fillStyle = '#ffffff'; ctx.fillRect(sx + (h * (i + 3) * 7) % 46, sy + (h * (i + 5) * 11) % 46, 2, 2); } ctx.globalAlpha = 1;
  } else if (q === 'lava' || q === 'blood' || q === 'acid') {
    ctx.fillStyle = q === 'lava' ? 'rgba(255,230,120,0.5)' : q === 'blood' ? 'rgba(255,120,120,0.35)' : 'rgba(230,255,120,0.45)';
    const b = 0.5 + 0.5 * Math.sin(t * 2.4 + h);
    ctx.beginPath(); ctx.arc(sx + (h * 5) % 34 + 7, sy + (h * 3) % 34 + 7, 3 + b * 6, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(sx + (h * 11 + t * 3) % 40 + 4, sy + (h * 13) % 40 + 4, 8, 4, h, 0, 7); ctx.fill();
  } else if (q === 'ice') {
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(sx + h % 20 + 4, sy + 4); ctx.lineTo(sx + 20, sy + 24); ctx.lineTo(sx + 38, sy + 30 + h % 10); ctx.stroke();
  } else {
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 2;
    for (let i = 0; i < 2; i++) { const o = (t * 14 + i * 24 + tx * 11) % (T + 16) - 8; ctx.beginPath(); ctx.moveTo(sx + o - 8, sy + 14 + i * 20); ctx.quadraticCurveTo(sx + o, sy + 9 + i * 20, sx + o + 8, sy + 14 + i * 20); ctx.stroke(); }
  }
}

function bgStars(t, n = 90) { for (let i = 0; i < n; i++) { ctx.globalAlpha = 0.3 + 0.7 * Math.abs(Math.sin(t * 0.8 + i)); ctx.fillStyle = i % 7 ? '#ffffff' : '#a0d0ff'; ctx.fillRect((i * 97) % W, (i * 53) % 250, i % 5 ? 1.6 : 2.6, i % 5 ? 1.6 : 2.6); } ctx.globalAlpha = 1; }
const BGKIND = {
  heaven(t) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 7; i++) { const a = 0.08 + 0.05 * Math.sin(t + i), x = 60 + i * 110; ctx.fillStyle = `rgba(255,240,190,${a})`; ctx.beginPath(); ctx.moveTo(W / 2 + (i - 3) * 20, -10); ctx.lineTo(x - 30, 260); ctx.lineTo(x + 34, 260); ctx.closePath(); ctx.fill(); }
    ctx.restore();
  },
  space(t, P2) {
    bgStars(t);
    const g = ctx.createRadialGradient(610, 80, 8, 640, 110, 110); g.addColorStop(0, shade(P2.hill[0], 0.45)); g.addColorStop(0.75, P2.hill[0]); g.addColorStop(1, shade(P2.hill[1], -0.5));
    ctx.save(); ctx.shadowColor = P2.hill[0]; ctx.shadowBlur = 30; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(640, 100, 78, 0, 7); ctx.fill(); ctx.restore();
    const n = ctx.createRadialGradient(170, 90, 10, 170, 90, 170); n.addColorStop(0, 'rgba(160,90,255,0.3)'); n.addColorStop(1, 'rgba(160,90,255,0)'); ctx.fillStyle = n; ctx.fillRect(0, 0, 400, 260);
  },
  hole(t) {
    bgStars(t, 60);
    ctx.save(); ctx.translate(W / 2 + 100, 110); ctx.scale(1, 0.32); ctx.rotate(t * 0.3);
    for (let i = 0; i < 4; i++) { ctx.strokeStyle = ['#ff9040', '#ffd060', '#c060ff', '#ff5080'][i]; ctx.lineWidth = 7; ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 16; ctx.beginPath(); ctx.arc(0, 0, 112 + i * 20, i, i + 4.8); ctx.stroke(); }
    ctx.restore();
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(W / 2 + 100, 110, 62, 0, 7); ctx.fill();
  },
  hell(t) {
    const g = ctx.createLinearGradient(0, 120, 0, 260); g.addColorStop(0, 'rgba(255,60,10,0)'); g.addColorStop(1, 'rgba(255,70,10,0.45)'); ctx.fillStyle = g; ctx.fillRect(0, 120, W, 140);
    ctx.fillStyle = 'rgba(10,2,4,0.8)';
    for (let i = 0; i < 12; i++) { const x = i * 72 + 8, h = 70 + (i * 37) % 80; ctx.beginPath(); ctx.moveTo(x - 24, 260); ctx.lineTo(x, 260 - h); ctx.lineTo(x + 24, 260); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = '#ffa040'; for (let i = 0; i < 24; i++) { const x = (i * 83) % W, y = 260 - ((t * 30 + i * 41) % 260); ctx.globalAlpha = 0.7; ctx.fillRect(x, y, 2, 2); } ctx.globalAlpha = 1;
  },
};
