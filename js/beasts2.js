// ===== 其他身體藍圖：天使、惡魔、騎士、死神、幽靈、魔像、蟲、星空生物、邪神… =====

function mirrorWings(c, fn) { fn(); c.save(); c.scale(-1, 1); fn(); c.restore(); }
function robe(c, x0, y0, x1, y1, col, trim) {
  const g = c.createLinearGradient(-x1, 0, x1, 0); g.addColorStop(0, sh(col, 0.25)); g.addColorStop(0.5, col); g.addColorStop(1, sh(col, -0.45));
  c.beginPath(); c.moveTo(-x0, y0); c.lineTo(x0, y0); c.quadraticCurveTo(x1 * 0.8, (y0 + y1) / 2, x1, y1);
  for (let i = 4; i > -4; i--) c.quadraticCurveTo(x1 * (i - 0.5) / 4, y1 + (i % 2 ? 5 : -2), x1 * (i - 1) / 4, y1);
  c.quadraticCurveTo(-x1 * 0.8, (y0 + y1) / 2, -x0, y0); c.closePath();
  c.fillStyle = g; c.fill(); c.strokeStyle = 'rgba(10,6,14,0.75)'; c.lineWidth = 0.9; c.stroke();
  c.strokeStyle = 'rgba(0,0,0,0.22)'; c.lineWidth = 0.9;
  for (const f of [-0.55, -0.15, 0.25, 0.6]) { c.beginPath(); c.moveTo(x0 * f, y0 + 3); c.quadraticCurveTo(x1 * f * 0.8, (y0 + y1) / 2, x1 * f, y1 - 2); c.stroke(); }
  if (trim) { c.strokeStyle = trim; c.lineWidth = 1.6; c.beginPath(); c.moveTo(0, y0); c.lineTo(0, y1 - 1); c.stroke(); }
}
function halo(c, x, y, rx, col) { c.save(); c.shadowColor = col; c.shadowBlur = 10; c.strokeStyle = col; c.lineWidth = 1.8; c.beginPath(); c.ellipse(x, y, rx, rx * 0.3, 0, 0, 7); c.stroke(); c.restore(); }
function faceHuman(c, x, y, r, skin, hair, eye) {
  const g = c.createRadialGradient(x - r * 0.3, y - r * 0.3, 1, x, y, r); g.addColorStop(0, sh(skin, 0.35)); g.addColorStop(1, sh(skin, -0.2));
  c.fillStyle = g; c.beginPath(); c.ellipse(x, y, r * 0.86, r, 0, 0, 7); c.fill(); c.strokeStyle = 'rgba(10,6,14,0.8)'; c.lineWidth = 0.8; c.stroke();
  if (hair) { c.fillStyle = hair; c.beginPath(); c.arc(x, y - r * 0.15, r * 1.02, Math.PI * 0.96, Math.PI * 2.04); c.quadraticCurveTo(x + r * 0.5, y - r * 0.5, x, y - r * 0.55); c.quadraticCurveTo(x - r * 0.5, y - r * 0.5, x - r * 1.02, y - r * 0.05); c.fill(); }
  A.eye(c, x - r * 0.38, y, r * 0.2, eye, false); A.eye(c, x + r * 0.34, y, r * 0.2, eye, false);
}
function sword(c, x, y, ang, L, col, hilt) {
  c.save(); c.translate(x, y); c.rotate(ang);
  c.shadowColor = col; c.shadowBlur = 8;
  const g = c.createLinearGradient(-2.4, 0, 2.4, 0); g.addColorStop(0, '#ffffff'); g.addColorStop(1, col);
  c.fillStyle = g; c.beginPath(); c.moveTo(-2.4, 0); c.lineTo(0, -L); c.lineTo(2.4, 0); c.closePath(); c.fill(); c.shadowBlur = 0;
  c.fillStyle = hilt; c.fillRect(-6, -1, 12, 2.4); c.fillRect(-1.2, 1, 2.4, 8); c.restore();
}

Object.assign(PLANS, {
  angel(c, t, o) {
    const fl = Math.sin(t * 2.2) * 0.1, n = o.s >= 3 ? 2 : 1;
    for (let i = n - 1; i >= 0; i--) mirrorWings(c, () => A.wingFeather(c, 7, -18 - i * 2, 0.52 + o.s * 0.1, (i ? -0.5 : 0.05) - fl, o.b, '#ffffff', i > 0));
    c.save(); c.translate(0, Math.sin(t * 1.6) * 1.5);
    robe(c, 8, -12, 19 + o.s * 2, 38, o.a, o.c);
    tubeArm(c, [-8, -14], [-17, -2], [-21, 6], 3, o.a); tubeArm(c, [8, -14], [18, -2], [20, 7], 3, o.a);
    G.ell(c, 0, -13, 10, 6, sh(o.a, 0.2), o.c, 0.8);
    faceHuman(c, 0, -26, 8, o.skin || '#f8e0c8', o.hair || '#f4e0a0', o.c);
    halo(c, 0, -39, 10 + o.s, o.c);
    if (o.weapon === 'sword') sword(c, 21, 8, 0.12, 40, o.c, '#c8a050');
    else { c.strokeStyle = '#d8b860'; c.lineWidth = 2; c.beginPath(); c.moveTo(-22, 36); c.lineTo(-22, -34); c.stroke(); G.star(c, -22, -38, 8, 7, 3, t * 0.8, o.c, '#fff', 0.5); }
    c.restore();
  },
  demon(c, t, o) {
    const fl = Math.sin(t * 2.4) * 0.12;
    mirrorWings(c, () => A.wingBat(c, 10, -20, 0.55 + o.s * 0.14, -0.3 - fl, o, true));
    const tl = A.body(c, [[8, 16], [26, 26], [38, 12], [34 + Math.sin(t * 2) * 4, -4]], [4, 0.7], o.a);
    A.spines(c, tl, -1, 4, 3, o.c);
    for (const d of [-1, 1]) { A.body(c, [[d * 8, 12], [d * 15, 26], [d * 12, 34], [d * 14, 43]], legW(8, 2.6), sh(o.a, -0.15)); A.claws(c, d * 14 - 1, 42.5, d < 0 ? -1 : 1, 1.8, o.c); }
    const g = c.createLinearGradient(-16, 0, 16, 0); g.addColorStop(0, sh(o.a, 0.28)); g.addColorStop(1, sh(o.a, -0.45));
    c.beginPath(); c.moveTo(-19, -20); c.quadraticCurveTo(0, -27, 19, -20); c.quadraticCurveTo(15, 0, 9, 15); c.lineTo(-9, 15); c.quadraticCurveTo(-15, 0, -19, -20); c.closePath(); c.fillStyle = g; c.fill(); c.strokeStyle = 'rgba(10,6,14,0.85)'; c.lineWidth = 1; c.stroke();
    c.strokeStyle = 'rgba(0,0,0,0.35)'; c.lineWidth = 1; c.beginPath(); c.moveTo(0, -20); c.lineTo(0, 12); c.moveTo(-12, -10); c.quadraticCurveTo(0, -4, 12, -10); for (const y of [-2, 5]) { c.moveTo(-6, y); c.lineTo(6, y); } c.stroke();
    c.save(); c.shadowColor = o.c; c.shadowBlur = 10; c.fillStyle = o.c; c.beginPath(); c.arc(0, -10, 2.8, 0, 7); c.fill(); c.restore();
    const sw = Math.sin(t * 2) * 2;
    for (const d of [-1, 1]) { A.body(c, [[d * 18, -19], [d * 28, -4 + sw * d], [d * 26, 12]], legW(6.6, 3), o.a); A.claws(c, d * 26 - 1, 12, d < 0 ? -1 : 1, 2, o.c); }
    c.fillStyle = sh(o.a, 0.1); c.beginPath(); c.moveTo(-8, -34); c.quadraticCurveTo(0, -42, 8, -34); c.lineTo(6, -24); c.quadraticCurveTo(0, -18, -6, -24); c.closePath(); c.fill(); c.strokeStyle = 'rgba(10,6,14,0.85)'; c.stroke();
    for (const d of [-1, 1]) { A.tube(c, [[d * 6, -36], [d * 18, -44], [d * 16, -58]], [2.8, 0.3], o.horncol || '#e8d8c0'); A.eye(c, d * 3.4, -31, 1.7, o.c); }
    G.teeth(c, -5, 5, -24, 3, 5, '#f4ecdc', 1);
  },
  knight(c, t, o) {
    const m = sh(o.a, 0.25);
    if (o.s >= 2) { const cp = Math.sin(t * 2) * 3; c.fillStyle = o.b; c.strokeStyle = 'rgba(0,0,0,0.6)'; c.beginPath(); c.moveTo(-12, -22); c.lineTo(12, -22); c.quadraticCurveTo(32, 12, 26 + cp, 42); c.lineTo(-26 + cp, 42); c.quadraticCurveTo(-32, 12, -12, -22); c.closePath(); c.fill(); c.stroke(); }
    for (const d of [-1, 1]) { A.body(c, [[d * 7, 10], [d * 9, 25], [d * 10, 42]], [6.4, 4.6], o.a); G.rr(c, d * 10 - 6, 39, 12, 6, 2, sh(o.a, -0.3), o.c, 0.6); G.circle(c, d * 9, 25, 3.6, m, o.c, 0.6); }
    const g = c.createLinearGradient(-15, 0, 15, 0); g.addColorStop(0, m); g.addColorStop(0.5, o.a); g.addColorStop(1, sh(o.a, -0.5));
    c.beginPath(); c.moveTo(-17, -20); c.lineTo(17, -20); c.lineTo(12, 13); c.lineTo(-12, 13); c.closePath(); c.fillStyle = g; c.fill(); c.strokeStyle = 'rgba(10,6,14,0.85)'; c.lineWidth = 1; c.stroke();
    c.strokeStyle = o.c; c.lineWidth = 1.2; c.beginPath(); c.moveTo(0, -18); c.lineTo(0, 11); c.moveTo(-14, -8); c.lineTo(14, -8); c.stroke();
    G.star(c, 0, -8, 4, 5, 1.6, 0, o.c);
    for (const d of [-1, 1]) G.ell(c, d * 18, -19, 8, 6, m, 'rgba(0,0,0,0.7)', 0.8);
    A.body(c, [[-18, -16], [-22, -2], [-20, 8]], [5, 4], o.a); A.body(c, [[18, -16], [23, -3], [26, 6]], [5, 4], o.a);
    sword(c, 27, 7, 0.32, 50, o.c, '#c8a050');
    if (o.shield !== 0) { c.save(); c.translate(-24, 6); const sg = c.createLinearGradient(-10, -14, 10, 14); sg.addColorStop(0, sh(o.b, 0.3)); sg.addColorStop(1, sh(o.b, -0.3)); c.fillStyle = sg; c.beginPath(); c.moveTo(-11, -13); c.lineTo(11, -13); c.quadraticCurveTo(11, 8, 0, 17); c.quadraticCurveTo(-11, 8, -11, -13); c.closePath(); c.fill(); c.strokeStyle = o.c; c.lineWidth = 1.2; c.stroke(); G.star(c, 0, 0, 5, 6, 2.5, -1.57, o.c); c.restore(); }
    const hg = c.createLinearGradient(-9, 0, 9, 0); hg.addColorStop(0, m); hg.addColorStop(1, sh(o.a, -0.45));
    c.fillStyle = hg; c.beginPath(); c.moveTo(-9, -22); c.lineTo(-10, -34); c.quadraticCurveTo(0, -44, 10, -34); c.lineTo(9, -22); c.quadraticCurveTo(0, -18, -9, -22); c.closePath(); c.fill(); c.strokeStyle = 'rgba(10,6,14,0.85)'; c.lineWidth = 1; c.stroke();
    c.fillStyle = '#0a0a12'; c.fillRect(-8, -32, 16, 3.4);
    c.save(); c.shadowColor = o.c; c.shadowBlur = 6; c.fillStyle = o.c; c.fillRect(-6, -31, 12, 1.5); c.restore();
    A.tube(c, [[0, -41], [8, -52], [20, -50], [28, -42]], [3.4, 0.5], o.c);
  },
  reaper(c, t, o) {
    c.save(); c.translate(0, Math.sin(t * 1.5) * 2.5);
    c.strokeStyle = '#5a4a3a'; c.lineWidth = 2.2; c.beginPath(); c.moveTo(25, 40); c.lineTo(20, -46); c.stroke();
    c.save(); c.shadowColor = o.c; c.shadowBlur = 10; const bg = c.createLinearGradient(20, -50, -30, -30); bg.addColorStop(0, '#f0f4ff'); bg.addColorStop(1, o.c); c.fillStyle = bg; c.beginPath(); c.moveTo(21, -48); c.quadraticCurveTo(-10, -62, -34, -30); c.quadraticCurveTo(-8, -48, 20, -40); c.closePath(); c.fill(); c.restore();
    robe(c, 11, -24, 24 + o.s * 2, 40, o.a, null);
    A.body(c, [[-11, -16], [-22, -6], [-14, 2]], [5, 3], o.a); A.body(c, [[11, -16], [22, -10], [22, -2]], [5, 3], o.a);
    G.circle(c, 22, -2, 2.6, '#e8e0d0');
    c.fillStyle = sh(o.a, -0.25); c.beginPath(); c.moveTo(-14, -18); c.quadraticCurveTo(-16, -44, 0, -46); c.quadraticCurveTo(16, -44, 14, -18); c.quadraticCurveTo(0, -12, -14, -18); c.closePath(); c.fill(); c.strokeStyle = 'rgba(10,6,14,0.85)'; c.stroke();
    c.fillStyle = '#080410'; c.beginPath(); c.ellipse(0, -28, 9, 11, 0, 0, 7); c.fill();
    G.ell(c, 0, -29, 7, 8, '#e8e2d4'); for (const d of [-1, 1]) { G.ell(c, d * 3, -30, 2.2, 2.6, '#100810'); A.eye(c, d * 3, -30, 1.1, o.c, false); }
    c.fillStyle = '#100810'; c.fillRect(-3.4, -24.5, 6.8, 2);
    c.restore();
  },
  wraith(c, t, o) {
    c.save(); c.translate(0, Math.sin(t * 1.8) * 3);
    c.save(); c.shadowColor = o.c; c.shadowBlur = 14; const g = c.createLinearGradient(0, -40, 0, 42); g.addColorStop(0, sh(o.a, 0.35)); g.addColorStop(0.7, o.a); g.addColorStop(1, 'rgba(0,0,0,0.1)');
    c.beginPath(); c.moveTo(0, -46); c.bezierCurveTo(26, -46, 30, -14, 26, 10);
    for (let i = 0; i < 7; i++) { const x = 26 - i * 8.6, y = 26 + (i % 2) * 14 + Math.sin(t * 3 + i) * 3; c.quadraticCurveTo(x + 2, 16, x - 4.3, y); }
    c.bezierCurveTo(-30, -14, -26, -46, 0, -46); c.closePath(); c.fillStyle = g; c.fill(); c.restore();
    for (const d of [-1, 1]) { const w = Math.sin(t * 2.4 + d) * 5; A.tube(c, [[d * 18, -14], [d * 34, -8 + w], [d * 42, 6 + w]], [4, 0.8], sh(o.a, 0.1), null); A.claws(c, d * 42, 6 + w, d < 0 ? -1 : 1, 1.4, o.c); }
    c.fillStyle = '#0a0612'; c.beginPath(); c.ellipse(0, -28, 13, 15, 0, 0, 7); c.fill();
    for (const d of [-1, 1]) A.eye(c, d * 5.4, -30, 2.6, o.c, false);
    c.fillStyle = o.c; c.beginPath(); c.ellipse(0, -18, 4, 2 + Math.abs(Math.sin(t * 2)) * 3, 0, 0, 7); c.fill();
    if (o.chain) { c.strokeStyle = '#a0a0b0'; c.lineWidth = 1.2; for (const d of [-1, 1]) for (let i = 0; i < 6; i++) { c.beginPath(); c.ellipse(d * (20 + i * 3), 8 + i * 6, 2, 3, d * 0.5, 0, 7); c.stroke(); } }
    c.restore();
  },
  golem(c, t, o) {
    const rock = (x, y, w, h, r) => { const g = c.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, sh(o.a, 0.3)); g.addColorStop(1, sh(o.a, -0.5)); c.beginPath(); c.moveTo(x + r, y); c.lineTo(x + w - r * 0.4, y + r * 0.4); c.lineTo(x + w, y + h - r); c.lineTo(x + w - r, y + h); c.lineTo(x + r * 0.5, y + h - r * 0.3); c.lineTo(x, y + r); c.closePath(); c.fillStyle = g; c.fill(); c.strokeStyle = 'rgba(10,6,14,0.85)'; c.lineWidth = 1; c.stroke(); };
    const glowLine = pts => { c.save(); c.shadowColor = o.c; c.shadowBlur = 8; c.strokeStyle = o.c; c.lineWidth = 1.3; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.restore(); };
    const b = Math.sin(t * 1.5) * 1.2;
    rock(-22, 18, 19, 27, 4); rock(4, 18, 19, 27, 4);
    rock(-28, -24 + b, 56, 46, 8);
    glowLine([[-10, -20], [-4, -8], [-12, 4], [-2, 16]]); glowLine([[12, -18], [6, -6], [14, 6]]);
    rock(-46, -22 + b, 20, 22, 5); rock(26, -22 + b, 20, 22, 5); rock(-50, 0 + b, 21, 28, 5); rock(29, 0 + b, 21, 28, 5);
    glowLine([[-42, -14 + b], [-36, -4 + b], [-42, 10 + b]]); glowLine([[40, -14 + b], [36, 2 + b], [42, 14 + b]]);
    rock(-14, -44 + b, 28, 22, 5);
    for (const d of [-1, 1]) A.eye(c, d * 6, -34 + b, 2.5, o.c, false);
    if (o.s >= 3) for (let i = 0; i < 3; i++) { const a = t + i * 2.1; rock(Math.cos(a) * 54 - 5, -22 + Math.sin(a) * 12, 10, 9, 2); }
  },
  scorpion(c, t, o) {
    for (let i = 0; i < 4; i++) for (const far of [1, 0]) { const x = -10 + i * 11, w = Math.sin(t * 5 + i) * 1.4; A.tube(c, [[x, 18], [x - 8 + far * 6, 28 + w], [x - 13 + far * 10, 43]], [2.2, 0.7], sh(o.a, far ? -0.45 : -0.1)); }
    const tl = A.body(c, [[24, 16], [46, 14], [58, -8], [50, -30], [34, -36 + Math.sin(t * 2) * 3]], u => 8 * (1 - u * 0.65), o.a);
    for (let i = 3; i < tl.length - 1; i += 4) { const p = tl[i], r = tl.wf(p.u); c.strokeStyle = 'rgba(0,0,0,0.55)'; c.lineWidth = 0.9; c.beginPath(); c.moveTo(p.x + p.nx * r, p.y + p.ny * r); c.lineTo(p.x - p.nx * r, p.y - p.ny * r); c.stroke(); }
    const e = tl[tl.length - 1]; c.save(); c.shadowColor = o.c; c.shadowBlur = 8; c.fillStyle = o.c; c.beginPath(); c.moveTo(e.x + 4, e.y - 4); c.quadraticCurveTo(e.x - 8, e.y - 2, e.x - 14, e.y + 7); c.quadraticCurveTo(e.x - 4, e.y + 6, e.x + 4, e.y + 4); c.closePath(); c.fill(); c.restore();
    const body = A.body(c, [[-24, 12], [-4, 10], [26, 16]], roundW(u => 13), o.a);
    for (let i = 3; i < body.length - 2; i += 4) { const p = body[i], r = body.wf(p.u); c.strokeStyle = 'rgba(0,0,0,0.5)'; c.lineWidth = 1; c.beginPath(); c.moveTo(p.x + p.nx * r * 0.9, p.y + p.ny * r * 0.9); c.quadraticCurveTo(p.x - 3, p.y, p.x - p.nx * r * 0.9, p.y - p.ny * r * 0.9); c.stroke(); }
    for (const [yy, off] of [[6, 0], [20, 6]]) { const w = Math.sin(t * 2 + yy) * 2; A.body(c, [[-22, yy], [-40, yy - 5], [-48, yy + 3 + w]], [4.4, 3], off ? sh(o.a, -0.3) : o.a); c.save(); c.translate(-52, yy + 3 + w); c.fillStyle = sh(o.a, off ? -0.2 : 0.12); c.strokeStyle = 'rgba(10,6,14,0.85)'; c.lineWidth = 0.9; c.beginPath(); c.moveTo(6, 0); c.quadraticCurveTo(0, -11, -15, -9); c.quadraticCurveTo(-8, -3, -6, 0); c.quadraticCurveTo(-8, 3, -14, 9); c.quadraticCurveTo(0, 9, 6, 0); c.closePath(); c.fill(); c.stroke(); c.restore(); }
    for (const d of [8, 13]) A.eye(c, -30, d, 1.7, o.c, false);
  },
  spider(c, t, o) {
    for (let i = 0; i < 4; i++) for (const d of [-1, 1]) { const w = Math.sin(t * 4 + i * 1.4 + d) * 2; const x = d * (8 + i * 2); A.tube(c, [[x, 6], [d * (24 + i * 7), -16 - i * 2 + w], [d * (36 + i * 6), 6 + i * 4], [d * (40 + i * 3), 43 - (3 - i) * 2]], [2.4, 0.5], sh(o.a, -0.15)); }
    const ab = c.createRadialGradient(-3, -22, 2, 0, -14, 25); ab.addColorStop(0, sh(o.a, 0.35)); ab.addColorStop(1, sh(o.a, -0.55));
    G.ell(c, 0, -12, 21, 23, ab, 'rgba(10,6,14,0.85)', 1);
    c.save(); c.shadowColor = o.c; c.shadowBlur = 8; G.star(c, 0, -14, 4, 12, 3, 0.78, o.c); c.restore();
    G.ell(c, 0, 13, 14, 11, sh(o.a, -0.1), 'rgba(10,6,14,0.85)', 1);
    for (const [x, y, r] of [[-5, 10, 2.4], [5, 10, 2.4], [-9, 14, 1.5], [9, 14, 1.5], [-2.5, 15, 1.3], [2.5, 15, 1.3]]) A.eye(c, x, y, r, o.c, false);
    for (const d of [-1, 1]) A.tube(c, [[d * 4, 20], [d * 6, 25], [d * 2, 30]], [1.8, 0.3], o.horncol || '#e8e0d0');
  },
  moth(c, t, o) {
    const fl = Math.sin(t * 5) * 0.14;
    c.save(); c.translate(0, -8);
    for (const d of [-1, 1]) {
      c.save(); c.scale(d, 1); c.rotate(-fl);
      for (const [yy, rx, ry, rot, col] of [[8, 34, 22, 0.5, o.b], [-14, 44, 28, -0.4, o.a]]) {
        const g = c.createRadialGradient(12, yy, 3, 26, yy, rx); g.addColorStop(0, sh(col, 0.45)); g.addColorStop(0.7, col); g.addColorStop(1, sh(col, -0.5));
        G.ell(c, 30, yy, rx, ry, g, 'rgba(10,6,14,0.8)', 1, rot);
      }
      c.save(); c.shadowColor = o.c; c.shadowBlur = 8; G.circle(c, 38, -17, 9, o.c, '#100810', 2); G.circle(c, 38, -17, 3.6, '#100810'); G.circle(c, 22, 12, 5, sh(o.c, 0.3), '#100810', 1.2); c.restore();
      c.strokeStyle = 'rgba(0,0,0,0.3)'; c.lineWidth = 0.7; for (let a = -1.2; a < 0.9; a += 0.35) { c.beginPath(); c.moveTo(3, -8); c.lineTo(Math.cos(a) * 66, -8 + Math.sin(a) * 40); c.stroke(); }
      c.restore();
    }
    const b = A.body(c, [[0, -22], [0, -4], [0, 20]], u => 6.6 * (1 - u * 0.5), sh(o.a, -0.25));
    for (let i = 3; i < b.length; i += 3) { c.strokeStyle = o.c; c.lineWidth = 0.8; const p = b[i]; c.beginPath(); c.moveTo(p.x - 6, p.y); c.lineTo(p.x + 6, p.y); c.stroke(); }
    G.circle(c, 0, -25, 6.6, sh(o.a, 0.1), 'rgba(10,6,14,0.8)', 0.9);
    for (const d of [-1, 1]) { A.eye(c, d * 3, -26, 1.8, o.c, false); A.tube(c, [[d * 2, -31], [d * 10, -42], [d * 20, -44]], [1, 0.3], o.b); }
    c.restore();
  },
  jelly(c, t, o) {
    const p = Math.sin(t * 2) * 2.4;
    for (let i = 0; i < 8; i++) { const x = -21 + i * 6, ph = t * 2.2 + i; A.tube(c, [[x, 2], [x + Math.sin(ph) * 5, 18], [x - Math.sin(ph + 1) * 6, 32], [x + Math.sin(ph + 2) * 7, 45 - (i % 3) * 5]], [i % 2 ? 2.4 : 1.4, 0.3], i % 2 ? o.b : o.a, null); }
    c.save(); c.shadowColor = o.c; c.shadowBlur = 18;
    const g = c.createRadialGradient(-5, -24, 2, 0, -8, 36); g.addColorStop(0, 'rgba(255,255,255,0.9)'); g.addColorStop(0.45, o.a); g.addColorStop(1, sh(o.b, -0.3));
    c.beginPath(); c.moveTo(-32 - p, 6); c.bezierCurveTo(-34, -40, 34, -40, 32 + p, 6);
    for (let i = 8; i > 0; i--) c.quadraticCurveTo(-32 + (i - 0.5) * 8, 13, -32 + (i - 1) * 8, 6);
    c.closePath(); c.fillStyle = g; c.fill(); c.restore();
    c.save(); c.shadowColor = o.c; c.shadowBlur = 10; G.star(c, 0, -14, 6, 9, 3.4, t, o.c); c.restore();
    for (const d of [-1, 1]) A.eye(c, d * 10, -4, 2, o.c, false);
  },
  whale(c, t, o) {
    const w = Math.sin(t * 1.5);
    A.tube(c, [[46, -2], [60, -14 + w * 3], [76, -22 + w * 5]], [7, 0.6], sh(o.a, -0.1));
    for (const a of [-1, 1]) { c.fillStyle = sh(o.a, -0.15); c.strokeStyle = 'rgba(10,6,14,0.7)'; c.beginPath(); c.moveTo(74, -22 + w * 5); c.quadraticCurveTo(84, -30 + a * 14, 90, -24 + a * 18 + w * 4); c.quadraticCurveTo(82, -24, 72, -18 + w * 5); c.fill(); c.stroke(); }
    const b = A.body(c, [[-54, 4], [-26, -6], [12, -4], [48, -2]], roundW(u => 25 * (1 - u * 0.55)), o.a);
    A.belly(c, b, 1, o.b, 0, 0.82);
    for (let i = 2; i < b.length - 4; i += 2) { const p = b[i], r = b.wf(p.u); c.strokeStyle = 'rgba(0,0,0,0.18)'; c.lineWidth = 0.7; c.beginPath(); c.moveTo(p.x + p.nx * r, p.y + p.ny * r); c.lineTo(p.x + p.nx * r * 0.45 - 2, p.y + p.ny * r * 0.45); c.stroke(); }
    for (let i = 0; i < 14; i++) { const p = b[(i * 3 + 1) % (b.length - 2)], off = -(i % 5) * 3 - 3; c.save(); c.shadowColor = o.c; c.shadowBlur = 5; G.star(c, p.x + p.nx * off, p.y + p.ny * off, 4, 1.9, 0.5, t + i, sh(o.c, 0.5)); c.restore(); }
    c.fillStyle = sh(o.a, -0.25); c.strokeStyle = 'rgba(10,6,14,0.8)'; c.lineWidth = 0.9; c.beginPath(); c.moveTo(-12, 12); c.quadraticCurveTo(-8, 28 + w * 4, 14, 42 + w * 4); c.quadraticCurveTo(12, 24, 4, 12); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(14, -24); c.quadraticCurveTo(24, -38, 32, -34); c.quadraticCurveTo(26, -28, 26, -18); c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = 'rgba(10,6,14,0.85)'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(-56, 6); c.quadraticCurveTo(-36, 14, -18, 4); c.stroke();
    A.eye(c, -30, -3, 2.8, o.c, false);
    if (o.s >= 3) { c.save(); c.shadowColor = o.c; c.shadowBlur = 8; c.strokeStyle = sh(o.c, 0.5); c.lineWidth = 1.2; c.beginPath(); c.ellipse(-8, -14, 46, 9, -0.2, 0, 7); c.stroke(); c.restore(); }
  },
  alien(c, t, o) {
    c.save(); c.translate(0, Math.sin(t * 2) * 1.6);
    for (const d of [-1, 1]) { A.body(c, [[d * 6, 6], [d * 10, 24], [d * 12, 43]], [3.4, 1.6], sh(o.a, -0.12)); A.body(c, [[d * 9, -12], [d * 22, 0], [d * 24, 16]], [2.8, 1.4], o.a); for (const f of [-2, 0, 2]) { c.strokeStyle = sh(o.a, -0.3); c.lineWidth = 1; c.beginPath(); c.moveTo(d * 24, 16); c.lineTo(d * 24 + f * 1.4, 22); c.stroke(); } }
    A.body(c, [[0, -16], [0, -2], [0, 12]], u => 10 - u * 2 + Math.sin(u * 6), sh(o.b, -0.1));
    c.save(); c.shadowColor = o.c; c.shadowBlur = 9; G.circle(c, 0, -4, 3.6, o.c); c.restore();
    const g = c.createRadialGradient(-7, -38, 3, 0, -30, 26); g.addColorStop(0, sh(o.a, 0.42)); g.addColorStop(1, sh(o.a, -0.35));
    c.beginPath(); c.moveTo(0, -12); c.bezierCurveTo(-10, -13, -26, -26, -22, -40); c.bezierCurveTo(-18, -54, 18, -54, 22, -40); c.bezierCurveTo(26, -26, 10, -13, 0, -12); c.closePath(); c.fillStyle = g; c.fill(); c.strokeStyle = 'rgba(10,6,14,0.85)'; c.lineWidth = 1; c.stroke();
    for (const d of [-1, 1]) { c.save(); c.translate(d * 9.5, -31); c.rotate(d * 0.5); G.ell(c, 0, 0, 7.4, 4.4, '#050308'); c.fillStyle = 'rgba(255,255,255,0.25)'; c.fillRect(-3, -2.6, 3, 1); G.ell(c, d, 0.5, 1.6, 1.4, o.c); c.restore(); }
    c.strokeStyle = 'rgba(10,6,14,0.8)'; c.lineWidth = 0.8; c.beginPath(); c.moveTo(-3, -17); c.lineTo(3, -17); c.stroke();
    if (o.s >= 2) for (let i = 0; i < o.s + 1; i++) { const a = t * 1.5 + i * 6.28 / (o.s + 1); c.save(); c.shadowColor = o.c; c.shadowBlur = 8; G.circle(c, Math.cos(a) * 40, -22 + Math.sin(a) * 14, 3, o.c); c.restore(); }
    c.restore();
  },
  mech(c, t, o) {
    const b = Math.sin(t * 2);
    const plate = (pts, col) => { const g = c.createLinearGradient(-30, -40, 30, 40); g.addColorStop(0, sh(col, 0.3)); g.addColorStop(1, sh(col, -0.45)); c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fillStyle = g; c.fill(); c.strokeStyle = 'rgba(10,6,14,0.85)'; c.lineWidth = 0.9; c.stroke(); };
    for (const d of [-1, 1]) {
      plate([[d * 6, 10], [d * 20, 10], [d * 24, 28], [d * 17, 34], [d * 8, 28]], o.a); plate([[d * 9, 30], [d * 22, 30], [d * 25, 45], [d * 7, 45]], sh(o.a, -0.2));
      plate([[d * 20, -22 + b], [d * 40, -28 + b], [d * 44, -10 + b], [d * 26, -4 + b]], o.a);
      plate([[d * 30, -6 + b], [d * 42, -6 + b], [d * 46, 18 + b], [d * 36, 26 + b], [d * 28, 16 + b]], sh(o.a, -0.15));
    }
    plate([[-20, -26 + b], [20, -26 + b], [26, -10 + b], [14, 14 + b], [-14, 14 + b], [-26, -10 + b]], o.a);
    c.save(); c.shadowColor = o.c; c.shadowBlur = 14; G.circle(c, 0, -8 + b, 7, sh(o.c, 0.5), o.c, 2); c.restore();
    c.strokeStyle = o.c; c.lineWidth = 1; for (const d of [-1, 1]) { c.beginPath(); c.moveTo(d * 8, 8 + b); c.lineTo(d * 18, -6 + b); c.lineTo(d * 16, -20 + b); c.stroke(); }
    plate([[-11, -29 + b], [-13, -42 + b], [0, -48 + b], [13, -42 + b], [11, -29 + b], [0, -25 + b]], sh(o.a, 0.1));
    c.save(); c.shadowColor = o.c; c.shadowBlur = 9; c.fillStyle = o.c; c.beginPath(); c.moveTo(-10, -39 + b); c.lineTo(10, -39 + b); c.lineTo(7, -34 + b); c.lineTo(-7, -34 + b); c.closePath(); c.fill(); c.restore();
    for (const d of [-1, 1]) A.tube(c, [[d * 10, -42 + b], [d * 20, -52 + b], [d * 24, -62 + b]], [2, 0.3], o.b);
  },
  planet(c, t, o) {
    const r = 21 + o.s * 5;
    c.save(); c.translate(0, -6);
    c.strokeStyle = sh(o.b, -0.3); c.lineWidth = 5; c.beginPath(); c.ellipse(0, 0, r * 1.75, r * 0.42, -0.3, Math.PI * 1.03, Math.PI * 1.97); c.stroke();
    c.strokeStyle = o.b; c.lineWidth = 2; c.stroke();
    const g = c.createRadialGradient(-r * 0.4, -r * 0.4, r * 0.1, 0, 0, r * 1.05); g.addColorStop(0, sh(o.a, 0.5)); g.addColorStop(0.6, o.a); g.addColorStop(1, sh(o.a, -0.65));
    c.save(); c.shadowColor = sh(o.a, 0.2); c.shadowBlur = 16; G.circle(c, 0, 0, r, g, 'rgba(10,6,14,0.5)', 1); c.restore();
    c.save(); c.beginPath(); c.arc(0, 0, r, 0, 7); c.clip();
    for (let i = 0; i < 5; i++) { c.fillStyle = i % 2 ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.16)'; const ph = (t * 3 + i * 17) % (r * 3) - r * 1.5; c.beginPath(); c.ellipse(ph, -r * 0.8 + i * r * 0.4, r * 1.1, r * 0.1, 0, 0, 7); c.fill(); }
    for (const [x, y, q] of [[-0.4, 0.5, 0.17], [0.45, -0.45, 0.13], [0.5, 0.45, 0.09]]) G.circle(c, x * r, y * r, q * r, 'rgba(0,0,0,0.25)', 'rgba(255,255,255,0.2)', 0.6);
    c.restore();
    for (const d of [-1, 1]) A.eye(c, d * r * 0.3, -r * 0.08, r * 0.1, o.c, false);
    c.strokeStyle = 'rgba(10,6,14,0.8)'; c.lineWidth = 1.2; c.beginPath(); c.arc(0, r * 0.22, r * 0.22, 0.4, 2.74); c.stroke();
    c.strokeStyle = o.b; c.lineWidth = 2; c.beginPath(); c.ellipse(0, 0, r * 1.75, r * 0.42, -0.3, -0.05, Math.PI + 0.05); c.stroke();
    for (let i = 0; i < o.s; i++) { const a = t * 0.9 + i * 2.2; G.circle(c, Math.cos(a) * r * 1.55, Math.sin(a) * r * 0.42 - Math.cos(a) * r * 0.45, 2.6, sh(o.b, 0.3), 'rgba(0,0,0,0.5)', 0.5); }
    c.restore();
  },
  star(c, t, o) {
    const r = 11 + o.s * 3.5;
    c.save(); c.translate(0, -8);
    c.save(); c.rotate(t * 0.5); for (let i = 0; i < 12; i++) { c.rotate(Math.PI / 6); const L = r * (1.6 + (i % 3) * 0.5 + Math.sin(t * 3 + i) * 0.2); const g = c.createLinearGradient(0, 0, 0, -L * 1.5); g.addColorStop(0, o.a); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(-3.6, 0); c.quadraticCurveTo(0, -L * 0.4, 0, -L * 1.5); c.quadraticCurveTo(0, -L * 0.4, 3.6, 0); c.fill(); } c.restore();
    c.save(); c.shadowColor = o.a; c.shadowBlur = 22; const g = c.createRadialGradient(-r * 0.3, -r * 0.3, 1, 0, 0, r); g.addColorStop(0, '#ffffff'); g.addColorStop(0.5, sh(o.a, 0.4)); g.addColorStop(1, o.a); G.circle(c, 0, 0, r, g); c.restore();
    c.strokeStyle = sh(o.b, 0.1); c.lineWidth = 1.2; for (let k = 0; k < 2; k++) { c.save(); c.rotate(t * (k ? -0.7 : 0.9) + k); c.beginPath(); c.ellipse(0, 0, r * (1.5 + k * 0.4), r * 0.42, 0, 0, 7); c.stroke(); G.circle(c, r * (1.5 + k * 0.4), 0, 2.2, o.c); c.restore(); }
    for (const d of [-1, 1]) A.eye(c, d * r * 0.34, -r * 0.08, r * 0.14, sh(o.c, -0.2), false);
    c.restore();
  },
  crystal(c, t, o) {
    const shard = (x, y, w, h, a) => { c.save(); c.translate(x, y); c.rotate(a); const g = c.createLinearGradient(-w, -h, w, 0); g.addColorStop(0, '#ffffff'); g.addColorStop(0.35, o.a); g.addColorStop(1, sh(o.b, -0.4)); c.beginPath(); c.moveTo(-w, 0); c.lineTo(-w * 0.8, -h * 0.75); c.lineTo(0, -h); c.lineTo(w * 0.8, -h * 0.75); c.lineTo(w, 0); c.closePath(); c.fillStyle = g; c.fill(); c.strokeStyle = 'rgba(255,255,255,0.6)'; c.lineWidth = 0.7; c.stroke(); c.beginPath(); c.moveTo(0, -h); c.lineTo(-w * 0.2, 0); c.strokeStyle = 'rgba(255,255,255,0.35)'; c.stroke(); c.restore(); };
    for (const [x, fx] of [[-22, -28], [-8, -10], [8, 10], [22, 28]]) A.body(c, [[x, 18], [x + (x > 0 ? 6 : -6), 30], [fx, 43]], legW(5.4, 2), sh(o.b, -0.25));
    const b = A.body(c, [[-26, 8], [0, 3], [26, 8]], roundW(u => 17), sh(o.b, -0.1));
    A.scales(c, b, 'rgba(255,255,255,0.15)', 2, 3);
    c.save(); c.shadowColor = o.c; c.shadowBlur = 8;
    for (let i = 0; i < 6; i++) shard(-22 + i * 9, Math.abs(i - 2.5), 4.6, 14 + (i % 3) * 7 + o.s * 3, (i - 2.5) * 0.14);
    c.restore();
    A.body(c, [[-24, 4], [-36, -8], [-46, -8]], [8, 5], sh(o.b, -0.1));
    A.eye(c, -42, -11, 2, o.c);
    shard(-38, -14, 4, 20 + o.s * 3, -0.3); shard(-44, -13, 3, 14, -0.7);
  },
  fairy(c, t, o) {
    c.save(); c.translate(0, -8 + Math.sin(t * 2.6) * 3);
    const fl = Math.sin(t * 9) * 0.25;
    mirrorWings(c, () => { for (const [yy, rx, ry, a] of [[-14, 30, 13, -0.55], [8, 21, 10, 0.5]]) { c.save(); c.translate(5, yy); c.rotate(a + fl); const g = c.createLinearGradient(0, 0, rx * 2, 0); g.addColorStop(0, 'rgba(255,255,255,0.75)'); g.addColorStop(1, o.a); G.ell(c, rx, 0, rx, ry, g, 'rgba(255,255,255,0.7)', 0.7); c.restore(); } });
    robe(c, 5, -8, 12 + o.s, 18, o.b, null);
    for (const d of [-1, 1]) { A.body(c, [[d * 4, 16], [d * 5, 26], [d * 4, 34]], [2.2, 1.4], o.skin || '#f8e0c8'); A.body(c, [[d * 5, -7], [d * 13, -1], [d * 18, -6]], [1.9, 1.3], o.skin || '#f8e0c8'); }
    faceHuman(c, 0, -17, 8, o.skin || '#f8e0c8', o.hair || o.a, o.c);
    c.strokeStyle = o.a; c.lineWidth = 1; for (const d of [-1, 1]) { c.beginPath(); c.moveTo(d * 3, -24); c.quadraticCurveTo(d * 5, -33, d * 11, -34); c.stroke(); G.circle(c, d * 11, -34, 1.6, o.c); }
    c.save(); c.shadowColor = o.c; c.shadowBlur = 10; G.star(c, 19, -8, 4, 6, 1.8, t * 2, sh(o.c, 0.3)); c.restore();
    c.restore();
  },
  angler(c, t, o) {
    const w = Math.sin(t * 2) * 3;
    c.save(); c.translate(6, 0);
    c.fillStyle = sh(o.a, -0.2); c.strokeStyle = 'rgba(10,6,14,0.75)'; c.lineWidth = 0.8;
    c.beginPath(); c.moveTo(26, 0); c.lineTo(50, -20 + w); c.lineTo(46, 0); c.lineTo(50, 20 - w); c.closePath(); c.fill(); c.stroke();
    const g = c.createRadialGradient(-12, -14, 3, -4, 0, 38); g.addColorStop(0, sh(o.a, 0.35)); g.addColorStop(1, sh(o.a, -0.55));
    c.beginPath(); c.moveTo(30, 0); c.bezierCurveTo(14, -32, -30, -36, -44, -8); c.lineTo(-22, 1); c.lineTo(-46, 12); c.bezierCurveTo(-30, 34, 14, 30, 30, 0); c.closePath(); c.fillStyle = g; c.fill(); c.stroke();
    c.fillStyle = '#0a0410'; c.beginPath(); c.moveTo(-44, -8); c.lineTo(-22, 1); c.lineTo(-46, 12); c.closePath(); c.fill();
    G.teeth(c, -44, -24, -7.5, 8, 6, '#f4ecdc', 1); G.teeth(c, -45, -25, 11.5, 8, 6, '#f4ecdc', -1);
    A.eye(c, -16, -12, 3.2, o.c, false);
    c.fillStyle = o.b; c.beginPath(); c.moveTo(0, 20); c.lineTo(10, 36); c.lineTo(16, 18); c.closePath(); c.fill(); c.stroke();
    A.spines(c, Object.assign(A.sample([[-20, -26], [0, -28], [18, -14]]), { wf: () => 0 }), -1, 3, 8, o.b);
    A.tube(c, [[-20, -24], [-30, -42], [-46, -40 + w], [-54, -28 + w]], [1.4, 0.7], o.b);
    c.save(); c.shadowColor = o.c; c.shadowBlur = 18; G.circle(c, -54, -25 + w, 4.6 + Math.sin(t * 4), sh(o.c, 0.5)); c.restore();
    c.restore();
  },
  turtle(c, t, o) {
    for (const [x, far] of [[-22, 1], [24, 1], [-30, 0], [32, 0]]) { A.body(c, [[x * 0.8, 18], [x, 32], [x, 43]], [8, 7], sh(o.a, far ? -0.42 : -0.05)); A.claws(c, x - 1, 42, -1, 1.7, '#e8e0d0'); }
    A.body(c, [[36, 20], [48, 26], [60, 22 + Math.sin(t * 2) * 3]], [6, 0.6], o.a);
    A.body(c, [[-30, 14], [-42, 0], [-46, -10]], [8, 5.6], o.a);
    if (o.snake) { A.body(c, [[36, 10], [54, -10], [40, -34], [18, -44], [8, -56]], [4, 2.4], o.b); dragonHead(c, 4, -58, 0.5, Object.assign({}, o, { a: o.b, horn: 0 }), t, 0); }
    dragonHead(c, -49, -13, 0.74, Object.assign({}, o, { horn: 2 }), t, 0);
    const g = c.createRadialGradient(-12, -18, 5, 0, 8, 44); g.addColorStop(0, sh(o.b, 0.35)); g.addColorStop(1, sh(o.b, -0.5));
    c.beginPath(); c.moveTo(-42, 22); c.bezierCurveTo(-40, -30, 40, -30, 44, 22); c.closePath(); c.fillStyle = g; c.fill(); c.strokeStyle = 'rgba(10,6,14,0.85)'; c.lineWidth = 1; c.stroke();
    G.rr(c, -44, 19, 90, 8, 4, sh(o.a, 0.2), 'rgba(10,6,14,0.8)', 0.8);
    c.strokeStyle = o.c; c.lineWidth = 1.1;
    for (const [cx, cy, r] of [[0, -6, 11], [-20, 4, 8.5], [20, 4, 8.5], [-1, 14, 6.6]]) { c.beginPath(); for (let i = 0; i < 6; i++) { const a = i * 1.047 + 0.52; i ? c.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.82) : c.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.82); } c.closePath(); c.stroke(); }
    if (o.s >= 3) { c.save(); c.shadowColor = o.c; c.shadowBlur = 8; for (const [x, y, h] of [[-8, -18, 14], [8, -17, 12], [0, -19, 20]]) { c.fillStyle = sh(o.c, 0.2); c.beginPath(); c.moveTo(x - 4, y + 3); c.lineTo(x, y - h); c.lineTo(x + 4, y + 3); c.fill(); } c.restore(); }
  },
  eldritch(c, t, o) {
    for (let i = 0; i < 9; i++) { const a = -0.15 + i * 0.42, sw = Math.sin(t * 2 + i) * 6, L = 50 + (i % 3) * 8; const x1 = Math.cos(a) * L, y1 = Math.sin(a) * L * 0.72 + 12; const tn = A.body(c, [[Math.cos(a) * 16, Math.sin(a) * 14], [Math.cos(a + 0.3) * L * 0.55, Math.sin(a + 0.3) * L * 0.5 + sw], [x1, y1 + sw]], [5.4, 0.5], sh(o.b, i % 2 ? -0.12 : 0.05)); for (let k = 3; k < tn.length; k += 4) G.circle(c, tn[k].x, tn[k].y, 1.1, o.c); }
    const g = c.createRadialGradient(-9, -14, 4, 0, -2, 34); g.addColorStop(0, sh(o.a, 0.35)); g.addColorStop(1, sh(o.a, -0.6));
    G.circle(c, 0, -3, 30, g, 'rgba(10,6,14,0.85)', 1.1);
    G.ell(c, 0, -4, 22, 15, '#f8f0e0', 'rgba(10,6,14,0.9)', 1.4);
    const lx = Math.sin(t * 0.9) * 7;
    c.save(); c.shadowColor = o.c; c.shadowBlur = 14; G.circle(c, lx, -4, 11, o.c); c.restore();
    G.ell(c, lx, -4, 2.6, 10, '#05030a');
    c.strokeStyle = 'rgba(180,30,30,0.5)'; c.lineWidth = 0.6; for (let i = 0; i < 8; i++) { const a = i * 0.78; c.beginPath(); c.moveTo(Math.cos(a) * 22, -4 + Math.sin(a) * 14); c.lineTo(Math.cos(a) * 15, -4 + Math.sin(a) * 9); c.stroke(); }
    G.teeth(c, -22, 22, 18, 7, 9, '#efe4d0', -1);
    for (let i = 0; i < 5; i++) { const a = -2.5 + i * 0.45; A.eye(c, Math.cos(a) * 26, -3 + Math.sin(a) * 25, 1.8, o.c, false); }
  },
  serpent(c, t, o) {
    const w = Math.sin(t * 1.8) * 3;
    const pts = [[-20, -38], [-2, -32 + w], [12, -10], [-10, 12 + w], [8, 36], [40, 36], [60, 22 - w], [70, 30]];
    const b = A.body(c, pts, u => (8 + o.s * 1.6) * (1 - u * 0.86) + 1, o.a);
    A.belly(c, b, 1, o.b, 0, 0.9);
    A.scales(c, b, 'rgba(0,0,0,0.3)', 1, 3);
    A.spines(c, b, -1, 3, 6, o.c, 0.02, 0.85);
    dragonHead(c, -25, -38, 0.86, Object.assign({}, o, { horn: o.horn || 1 }), t, 0);
    if (o.hood) { c.fillStyle = o.b; c.strokeStyle = 'rgba(10,6,14,0.7)'; c.beginPath(); c.moveTo(-6, -34); c.quadraticCurveTo(10, -60, 20, -40); c.quadraticCurveTo(18, -22, 8, -22); c.closePath(); c.fill(); c.stroke(); }
  },
});
