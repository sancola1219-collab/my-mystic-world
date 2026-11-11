// ===== 細膩生物繪圖引擎 =====
// 用「粗細漸變的骨架曲線」組出身體，再加鱗片、翅膜、羽毛、爪、發光眼。
// 座標：100 單位方框，地面 y=45，生物面向左（玩家方會自動翻面）。

const SHADE_MEMO = {};
function sh(col, k) { const key = col + k; return SHADE_MEMO[key] || (SHADE_MEMO[key] = shade(col, k)); }

const A = {
  sample(pts, seg = 7) {
    const out = [], n = pts.length;
    for (let i = 0; i < n - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n - 1, i + 2)];
      for (let k = 0; k < seg; k++) {
        const u = k / seg, u2 = u * u, u3 = u2 * u;
        out.push({
          x: 0.5 * (2 * p1[0] + (p2[0] - p0[0]) * u + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * u2 + (3 * p1[0] - p0[0] - 3 * p2[0] + p3[0]) * u3),
          y: 0.5 * (2 * p1[1] + (p2[1] - p0[1]) * u + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * u2 + (3 * p1[1] - p0[1] - 3 * p2[1] + p3[1]) * u3),
        });
      }
    }
    out.push({ x: pts[n - 1][0], y: pts[n - 1][1] });
    for (let i = 0; i < out.length; i++) {
      const a = out[Math.max(0, i - 1)], b = out[Math.min(out.length - 1, i + 1)];
      const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1;
      out[i].nx = -dy / L; out[i].ny = dx / L; out[i].u = i / (out.length - 1);
    }
    return out;
  },
  // 粗細漸變的管狀身體；w 為寬度函式 u→半寬，或 [起始半寬, 結束半寬]
  tube(c, pts, w, fill, stroke = 'rgba(10,6,14,0.75)', lw = 1) {
    const s = A.sample(pts), wf = Array.isArray(w) ? u => w[0] + (w[1] - w[0]) * u : w;
    c.beginPath();
    s.forEach((p, i) => { const r = wf(p.u); i ? c.lineTo(p.x + p.nx * r, p.y + p.ny * r) : c.moveTo(p.x + p.nx * r, p.y + p.ny * r); });
    for (let i = s.length - 1; i >= 0; i--) { const p = s[i], r = wf(p.u); c.lineTo(p.x - p.nx * r, p.y - p.ny * r); }
    c.closePath();
    c.fillStyle = fill; c.fill();
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw; c.stroke(); }
    s.wf = wf;
    return s;
  },
  // 有光影的身體：上亮下暗
  body(c, pts, w, col) {
    let y0 = 1e9, y1 = -1e9; for (const p of pts) { y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
    const m = Array.isArray(w) ? Math.max(w[0], w[1]) : 12;
    const g = c.createLinearGradient(0, y0 - m, 0, y1 + m);
    g.addColorStop(0, sh(col, 0.32)); g.addColorStop(0.5, col); g.addColorStop(1, sh(col, -0.45));
    return A.tube(c, pts, w, g);
  },
  // 肚皮：沿身體一側的節狀板
  belly(c, s, side, col, from = 0, to = 1) {
    c.fillStyle = col;
    c.beginPath(); let first = true;
    const pick = s.filter(p => p.u >= from && p.u <= to);
    for (const p of pick) { const r = s.wf(p.u) * side; const x = p.x + p.nx * r, y = p.y + p.ny * r; first ? c.moveTo(x, y) : c.lineTo(x, y); first = false; }
    for (let i = pick.length - 1; i >= 0; i--) { const p = pick[i], r = s.wf(p.u) * side * 0.45; c.lineTo(p.x + p.nx * r, p.y + p.ny * r); }
    c.closePath(); c.fill();
    c.strokeStyle = 'rgba(0,0,0,0.25)'; c.lineWidth = 0.6;
    for (let i = 0; i < pick.length; i += 2) { const p = pick[i], r = s.wf(p.u) * side; c.beginPath(); c.moveTo(p.x + p.nx * r, p.y + p.ny * r); c.lineTo(p.x + p.nx * r * 0.45, p.y + p.ny * r * 0.45); c.stroke(); }
  },
  // 鱗片
  scales(c, s, col, every = 2, rows = 3, from = 0, to = 1) {
    c.strokeStyle = col; c.lineWidth = 0.55;
    for (let i = 0; i < s.length; i += every) {
      const p = s[i]; if (p.u < from || p.u > to) continue;
      const w = s.wf(p.u);
      for (let k = 0; k < rows; k++) {
        const o = ((k + 0.5) / rows * 2 - 1) * w * 0.8, off = (i / every + k) % 2 ? 1 : 0;
        const x = p.x + p.nx * o + off, y = p.y + p.ny * o;
        c.beginPath(); c.arc(x, y, Math.max(0.8, w / rows * 0.7), 0.3, Math.PI - 0.3); c.stroke();
      }
    }
  },
  // 背脊尖刺
  spines(c, s, side, every, size, col, from = 0, to = 1) {
    c.fillStyle = col; c.strokeStyle = 'rgba(10,6,14,0.7)'; c.lineWidth = 0.6;
    for (let i = 0; i < s.length; i += every) {
      const p = s[i]; if (p.u < from || p.u > to) continue;
      const r = s.wf(p.u) * side, sz = size * (1 - p.u * 0.55);
      const bx = p.x + p.nx * r, by = p.y + p.ny * r, tx = -p.ny, ty = p.nx;
      c.beginPath(); c.moveTo(bx + tx * sz * 0.5, by + ty * sz * 0.5); c.lineTo(bx + p.nx * sz * side - tx * sz * 0.6, by + p.ny * sz * side - ty * sz * 0.6); c.lineTo(bx - tx * sz * 0.5, by - ty * sz * 0.5); c.closePath(); c.fill(); c.stroke();
    }
  },
  claws(c, x, y, dir, size, col = '#e8e0d0') {
    for (let i = -1; i <= 1; i++) {
      const bx = x + i * size * 0.9;
      c.fillStyle = col; c.strokeStyle = 'rgba(0,0,0,0.6)'; c.lineWidth = 0.5;
      c.beginPath(); c.moveTo(bx - size * 0.45, y); c.quadraticCurveTo(bx + dir * size * 0.2, y + size * 0.4, bx + dir * size, y + size * 1.1); c.quadraticCurveTo(bx + size * 0.4, y + size * 0.3, bx + size * 0.45, y); c.closePath(); c.fill(); c.stroke();
    }
  },
  eye(c, x, y, r, col, slit = true) {
    c.save(); c.shadowColor = col; c.shadowBlur = r * 3;
    c.fillStyle = col; c.beginPath(); c.ellipse(x, y, r * 1.25, r, -0.2, 0, 7); c.fill(); c.restore();
    c.fillStyle = '#100608';
    c.beginPath(); slit ? c.ellipse(x, y, r * 0.3, r * 0.92, 0, 0, 7) : c.arc(x, y, r * 0.55, 0, 7); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.9)'; c.beginPath(); c.arc(x - r * 0.4, y - r * 0.4, r * 0.28, 0, 7); c.fill();
    c.strokeStyle = 'rgba(0,0,0,0.7)'; c.lineWidth = 0.7; c.beginPath(); c.moveTo(x - r * 1.5, y - r * 0.8); c.lineTo(x + r * 1.4, y - r * 1.15); c.stroke();
  },
  // 蝙蝠翼（翼手、翼膜、爪）
  wingBat(c, x, y, size, flap, o, far) {
    c.save(); c.translate(x, y); c.rotate(flap); c.scale(size, size);
    const mem = far ? sh(o.b, -0.5) : o.b;
    const tips = [[62, -46], [76, -18], [68, 10], [44, 22]], wr = [34, -44];
    const g = c.createLinearGradient(0, -50, 60, 20); g.addColorStop(0, sh(mem, 0.15)); g.addColorStop(1, sh(mem, -0.35));
    c.beginPath(); c.moveTo(0, 0); c.lineTo(wr[0], wr[1]); c.lineTo(tips[0][0], tips[0][1]);
    c.quadraticCurveTo(58, -20, tips[1][0], tips[1][1]); c.quadraticCurveTo(54, -2, tips[2][0], tips[2][1]); c.quadraticCurveTo(40, 2, tips[3][0], tips[3][1]); c.quadraticCurveTo(16, 8, 4, 14); c.closePath();
    c.fillStyle = g; c.fill(); c.strokeStyle = 'rgba(10,6,14,0.7)'; c.lineWidth = 0.8; c.stroke();
    const bone = far ? sh(o.a, -0.5) : o.a;
    for (const p of tips) { A.tube(c, [wr, [(wr[0] + p[0]) / 2 + 2, (wr[1] + p[1]) / 2 - 3], p], [1.4, 0.3], bone, null); }
    A.tube(c, [[0, 0], [14, -26], wr], [3.4, 1.8], bone);
    A.claws(c, wr[0] - 1, wr[1] - 3, -1, 1.6, o.c);
    c.restore();
  },
  // 羽翼：多層羽毛
  wingFeather(c, x, y, size, flap, col1, col2, far) {
    c.save(); c.translate(x, y); c.rotate(flap); c.scale(size, size);
    const dk = far ? -0.5 : 0;
    for (let layer = 0; layer < 3; layer++) {
      const n = [9, 7, 5][layer], len = [74, 48, 28][layer], col = layer === 0 ? col2 : col1;
      for (let i = 0; i < n; i++) {
        const a = -1.45 + (i / (n - 1)) * 1.65, L = len * (1 - i * 0.045);
        const ex = Math.cos(a) * L, ey = Math.sin(a) * L, bx = Math.cos(a) * L * 0.12, by = Math.sin(a) * L * 0.12;
        const g = c.createLinearGradient(bx, by, ex, ey); g.addColorStop(0, sh(col, 0.25 + dk)); g.addColorStop(1, sh(col, -0.15 + dk));
        A.tube(c, [[bx, by], [(bx + ex) / 2 + Math.sin(a) * 2, (by + ey) / 2 - Math.cos(a) * 2], [ex, ey]], u => (layer === 0 ? 4.6 : 4) * Math.sin(Math.PI * Math.min(1, u + 0.12)), g, 'rgba(20,10,20,0.45)', 0.5);
      }
    }
    c.restore();
  },
  // 光環底襯（傳說級）
  aura(c, t, col, r = 62) {
    const g = c.createRadialGradient(0, -6, 6, 0, -6, r);
    g.addColorStop(0, col.replace('rgb(', 'rgba(').replace(')', ',0.42)')); g.addColorStop(1, col.replace('rgb(', 'rgba(').replace(')', ',0)'));
    c.fillStyle = g; c.beginPath(); c.arc(0, -6, r, 0, 7); c.fill();
    c.strokeStyle = col.replace('rgb(', 'rgba(').replace(')', ',0.4)'); c.lineWidth = 0.8;
    c.save(); c.translate(0, -6); c.rotate(t * 0.3);
    for (let k = 0; k < 2; k++) { c.beginPath(); c.setLineDash([3 + k * 3, 5]); c.arc(0, 0, r * (0.72 + k * 0.2), 0, 7); c.stroke(); } c.setLineDash([]);
    c.restore();
  },
};

const legW = (a, b) => u => (a + (b - a) * u) * Math.min(1, 0.55 + u * 3.5);
const roundW = w => u => w(u) * Math.pow(Math.max(0.02, Math.sin(Math.PI * (0.03 + u * 0.94))), 0.42);

// ---------- 頭部 ----------
function dragonHead(c, x, y, k, o, t, ang = 0, baby = false) {
  c.save(); c.translate(x, y); c.rotate(ang); c.scale(k, k);
  const open = 4 + Math.sin(t * 2.4) * 1.5;
  // 角
  const hn = o.horn == null ? 2 : o.horn, hc = o.horncol || o.c;
  if (hn >= 1) { A.tube(c, [[6, -8], [20, -15], [33, -24]], [3, 0.3], hc); }
  if (hn >= 2) { A.tube(c, [[10, -4], [24, -6], [38, -13]], [2.6, 0.3], sh(hc, -0.2)); }
  if (hn >= 3) { A.tube(c, [[2, -9], [10, -22], [10, -33]], [2, 0.2], hc); }
  // 下顎
  c.beginPath(); c.moveTo(8, 4); c.lineTo(-4, 8 + open * 0.3); c.lineTo(-21, 7 + open); c.quadraticCurveTo(-22, 10 + open, -18, 11 + open); c.lineTo(4, 11); c.quadraticCurveTo(10, 9, 10, 5); c.closePath();
  c.fillStyle = sh(o.a, -0.3); c.fill(); c.strokeStyle = 'rgba(10,6,14,0.8)'; c.lineWidth = 0.7; c.stroke();
  // 口腔
  c.beginPath(); c.moveTo(6, 3); c.lineTo(-24, 2); c.lineTo(-21, 7 + open); c.lineTo(-4, 8 + open * 0.3); c.closePath(); c.fillStyle = '#4a0e18'; c.fill();
  c.save(); c.shadowColor = o.c; c.shadowBlur = 8; c.fillStyle = o.c; c.globalAlpha = 0.55; c.beginPath(); c.ellipse(-10, 5 + open * 0.3, 8, 2.2, 0, 0, 7); c.fill(); c.restore();
  for (let i = 0; i < 6; i++) { const tx = -22 + i * 4; c.fillStyle = '#f4ecdc'; c.beginPath(); c.moveTo(tx, 2); c.lineTo(tx + 1.1, 5.5); c.lineTo(tx + 2.2, 2); c.fill(); }
  for (let i = 0; i < 4; i++) { const tx = -19 + i * 4.6, ty = 7.4 + open * (1 - i * 0.2); c.fillStyle = '#f4ecdc'; c.beginPath(); c.moveTo(tx, ty); c.lineTo(tx + 1, ty - 3); c.lineTo(tx + 2, ty); c.fill(); }
  // 頭骨
  const g = c.createLinearGradient(0, -11, 0, 6); g.addColorStop(0, sh(o.a, 0.38)); g.addColorStop(0.6, o.a); g.addColorStop(1, sh(o.a, -0.35));
  c.beginPath(); c.moveTo(12, 4); c.quadraticCurveTo(13, -7, 3, -10);
  if (baby) { c.quadraticCurveTo(-8, -12, -14, -5); c.quadraticCurveTo(-21, -3, -20, 1); }
  else { c.lineTo(-5, -9); c.quadraticCurveTo(-10, -6, -15, -5); c.lineTo(-23, -5); c.quadraticCurveTo(-28, -3, -27, 1); }
  c.lineTo(-24, 3); c.lineTo(6, 4); c.closePath();
  c.fillStyle = g; c.fill(); c.strokeStyle = 'rgba(10,6,14,0.85)'; c.lineWidth = 0.9; c.stroke();
  c.strokeStyle = 'rgba(0,0,0,0.22)'; c.lineWidth = 0.5; for (let i = 0; i < 5; i++) { c.beginPath(); c.arc(-16 + i * 5.5, -1 - (i % 2), 1.8, 0.3, 2.8); c.stroke(); }
  c.fillStyle = '#1a0a10'; c.beginPath(); c.ellipse(-23, -2.4, 1.3, 0.8, -0.3, 0, 7); c.fill();
  A.eye(c, -3, -4.4, baby ? 3.2 : 2.3, o.c);
  // 耳鰭
  c.fillStyle = o.b; c.strokeStyle = 'rgba(10,6,14,0.7)'; c.lineWidth = 0.6;
  c.beginPath(); c.moveTo(9, -2); c.lineTo(22, 3); c.lineTo(15, 5); c.lineTo(19, 11); c.lineTo(9, 7); c.closePath(); c.fill(); c.stroke();
  c.restore();
}

function beastHead(c, x, y, k, o, t, kind) {
  c.save(); c.translate(x, y); c.scale(k, k);
  const fur = o.a;
  if (kind !== 'horse') { for (const [ex, ey] of [[6, -13], [-5, -14]]) { c.fillStyle = sh(fur, ex > 0 ? -0.2 : 0); c.strokeStyle = 'rgba(10,6,14,0.75)'; c.lineWidth = 0.7; c.beginPath(); c.moveTo(ex - 4, ey + 5); c.lineTo(ex + 1, ey - 8); c.lineTo(ex + 6, ey + 5); c.closePath(); c.fill(); c.stroke(); } }
  else { c.fillStyle = sh(fur, -0.1); c.beginPath(); c.moveTo(4, -9); c.lineTo(7, -20); c.lineTo(11, -8); c.closePath(); c.fill(); }
  const g = c.createLinearGradient(0, -12, 0, 12); g.addColorStop(0, sh(fur, 0.32)); g.addColorStop(1, sh(fur, -0.3));
  c.beginPath();
  if (kind === 'horse') { c.moveTo(11, -8); c.quadraticCurveTo(0, -12, -8, -7); c.lineTo(-21, 2); c.quadraticCurveTo(-25, 7, -20, 9); c.lineTo(-6, 8); c.quadraticCurveTo(8, 8, 12, 2); }
  else if (kind === 'wolf') { c.moveTo(11, -7); c.quadraticCurveTo(0, -12, -8, -6); c.lineTo(-23, -1); c.quadraticCurveTo(-26, 3, -22, 5); c.lineTo(-8, 8); c.quadraticCurveTo(8, 11, 12, 2); }
  else { c.moveTo(12, -5); c.quadraticCurveTo(4, -13, -6, -9); c.quadraticCurveTo(-16, -6, -17, 2); c.quadraticCurveTo(-16, 8, -8, 9); c.quadraticCurveTo(8, 12, 13, 3); }
  c.closePath(); c.fillStyle = g; c.fill(); c.strokeStyle = 'rgba(10,6,14,0.85)'; c.lineWidth = 0.9; c.stroke();
  const nx = kind === 'lion' ? -16 : kind === 'horse' ? -22 : -23, ny = kind === 'lion' ? -1 : kind === 'horse' ? 4 : 0;
  c.fillStyle = '#1a0a10'; c.beginPath(); c.ellipse(nx, ny, 2, 1.4, 0, 0, 7); c.fill();
  c.strokeStyle = 'rgba(10,6,14,0.8)'; c.lineWidth = 0.7; c.beginPath(); c.moveTo(nx + 2, ny + 3); c.quadraticCurveTo(-6, 7, 3, 5); c.stroke();
  if (kind !== 'horse') { c.fillStyle = '#f4ecdc'; for (const fx of [nx + 4, nx + 9]) { c.beginPath(); c.moveTo(fx, ny + 4); c.lineTo(fx + 1, ny + 8.5); c.lineTo(fx + 2, ny + 4); c.fill(); } }
  A.eye(c, -3, -3.5, 2.2, o.c);
  c.restore();
}

// 人形頭部 / 軀幹小工具
function tubeArm(c, a, b, d, w, col) { return A.body(c, [a, b, d], [w, w * 0.7], col); }

// ---------- 身體藍圖 ----------
const PLANS = {
  // 西方飛龍；heads>1 時為多頭龍
  dragon(c, t, o) {
    const s = o.s, baby = s === 1, teen = s === 2, flap = Math.sin(t * 2.6) * 0.12, br = Math.sin(t * 2) * 1.1;
    const wing = o.wing === 0 ? 0 : baby ? 0.42 : teen ? 0.72 : 1;
    if (wing) A.wingBat(c, 8, -14, wing * 0.95, -0.15 - flap, o, true);
    // 尾巴
    const tw = Math.sin(t * 1.6) * 4;
    const tail = A.body(c, [[20, 4], [38, 22], [58, 26], [71, 12 + tw], [66, -6 + tw]], [13, 0.6], sh(o.a, -0.08));
    A.belly(c, tail, 1, o.b, 0, 0.7);
    A.spines(c, tail, -1, 3, baby ? 3 : 6, o.c);
    A.scales(c, tail, 'rgba(0,0,0,0.3)', 2, 3);
    if (!baby) { c.fillStyle = o.c; c.strokeStyle = 'rgba(10,6,14,0.7)'; c.beginPath(); c.moveTo(66, -6 + tw); c.lineTo(74, -14 + tw); c.lineTo(64, -14 + tw); c.lineTo(60, -22 + tw); c.lineTo(61, -5 + tw); c.closePath(); c.fill(); c.stroke(); }
    // 遠側的腿
    for (const [hx, hy, kx, fx] of [[-8, 10, -18, -30], [22, 10, 28, 12]]) {
      const l = A.body(c, [[hx, hy], [kx, 26], [fx + 4, 34], [fx, 43]], [6, 3], sh(o.a, -0.42));
      A.claws(c, fx - 1, 42.5, -1, 1.6, o.c);
    }
    // 軀幹
    const body = A.body(c, [[-16, -1 + br * 0.3], [0, -3 + br * 0.3], [14, -1], [26, 5]], roundW(u => 12 + Math.sin(u * Math.PI) * 6.5), o.a);
    A.belly(c, body, 1, o.b);
    A.scales(c, body, 'rgba(0,0,0,0.3)', 2, 4);
    A.spines(c, body, -1, 3, baby ? 3 : 7, o.c);
    // 近側的腿
    const thigh = A.body(c, [[18, 4], [28, 20], [20, 32], [18, 43]], legW(11, 3.2), sh(o.a, -0.05));
    A.scales(c, thigh, 'rgba(0,0,0,0.28)', 2, 3);
    A.claws(c, 17, 42.5, -1, 2, o.c);
    const arm = A.body(c, [[-13, 6], [-14, 22], [-23, 33], [-23, 43]], legW(8, 2.8), sh(o.a, -0.05));
    A.scales(c, arm, 'rgba(0,0,0,0.28)', 2, 2);
    A.claws(c, -24, 42.5, -1, 1.8, o.c);
    // 頸與頭
    const heads = o.heads || 1;
    for (let h = heads - 1; h >= 0; h--) {
      const off = h === 0 ? 0 : h === 1 ? 14 : -13, sw = Math.sin(t * 1.8 + h) * 2;
      const neck = baby
        ? [[-12, -8], [-22, -16], [-26 + sw * 0.4, -26]]
        : [[-12, -8], [-26 + off * 0.3, -20 + off * 0.2], [-20 + off * 0.8, -36 + off * 0.2], [-27 + off + sw, -49 + Math.abs(off) * 0.4]];
      const nk = A.body(c, neck, [baby ? 9 : 10.5, baby ? 6 : 4.8], h ? sh(o.a, -0.14) : o.a);
      A.belly(c, nk, 1, o.b);
      A.scales(c, nk, 'rgba(0,0,0,0.3)', 2, 3);
      A.spines(c, nk, -1, 3, baby ? 2.5 : 5.5, o.c);
      const end = neck[neck.length - 1];
      dragonHead(c, end[0] - 4, end[1] - 2, baby ? 0.92 : teen ? 0.86 : 0.98, o, t + h, h ? 0.1 : 0.05, baby);
    }
    if (wing) A.wingBat(c, 2, -15, wing * 0.8, 0.1 + flap, o, false);
  },
  // 東方神龍
  long(c, t, o) {
    const s = o.s, w = Math.sin(t * 1.4) * 3, bw = 3.4 + s * 1.5;
    const pts = [[-30, -30 + w * 0.4], [-8, -34], [14, -22 - w], [4, -2], [-16, 12 + w], [2, 30], [30, 30 - w], [50, 12], [56, -8 + w], [68, -18]];
    const sf = u => bw * (1.1 - u * 0.95) + 1.2;
    const leg = (x, y, dir) => { A.body(c, [[x, y], [x + dir * 7, y + 8], [x + dir * 4, y + 17]], [2.8, 1.4], sh(o.a, -0.15)); A.claws(c, x + dir * 4, y + 16, dir, 1.2, o.c); };
    const s0 = A.sample(pts);
    leg(s0[12].x, s0[12].y + 2, -1); leg(s0[34].x, s0[34].y + 2, 1);
    const b = A.body(c, pts, sf, o.a);
    A.belly(c, b, 1, o.b);
    A.scales(c, b, 'rgba(0,0,0,0.3)', 1, 3);
    // 鬃毛
    c.fillStyle = o.c; c.strokeStyle = 'rgba(0,0,0,0.3)'; c.lineWidth = 0.4;
    for (let i = 2; i < b.length; i += 2) {
      const p = b[i], r = b.wf(p.u), L = (7 - p.u * 4) * (1 + Math.sin(t * 3 + i * 0.6) * 0.25);
      c.beginPath(); c.moveTo(p.x - p.nx * r, p.y - p.ny * r); c.quadraticCurveTo(p.x - p.nx * (r + L), p.y - p.ny * (r + L), p.x - p.nx * (r + L * 1.1) + 3, p.y - p.ny * (r + L * 1.1)); c.lineTo(p.x - p.nx * r + 3, p.y - p.ny * r); c.closePath(); c.fill();
    }
    leg(b[22].x, b[22].y + 3, -1); leg(b[46].x, b[46].y + 3, 1);
    // 尾鰭
    const e = b[b.length - 1];
    c.fillStyle = o.c; c.beginPath(); c.moveTo(e.x, e.y); c.quadraticCurveTo(e.x + 12, e.y - 12, e.x + 16, e.y - 2); c.quadraticCurveTo(e.x + 8, e.y + 2, e.x + 14, e.y + 10); c.quadraticCurveTo(e.x + 2, e.y + 6, e.x, e.y); c.fill();
    // 頭
    dragonHead(c, -36, -30 + w * 0.4, 0.82 + s * 0.05, Object.assign({}, o, { horn: 0 }), t, 0);
    A.tube(c, [[-30, -40], [-22, -52], [-8, -58]], [1.8, 0.4], o.horncol || '#f0d890');
    A.tube(c, [[-22, -51], [-16, -51], [-10, -48]], [1, 0.3], o.horncol || '#f0d890');
    A.tube(c, [[-26, -46], [-36, -54], [-34, -62]], [1, 0.3], o.horncol || '#f0d890');
    c.strokeStyle = o.c; c.lineWidth = 0.9; c.lineCap = 'round';
    for (const d of [1, -1]) { c.beginPath(); c.moveTo(-58, -30); c.bezierCurveTo(-68, -32 + d * 6 + w, -74, -24 + d * 8, -80 + w, -30 + d * 10); c.stroke(); }
    if (s >= 3) { c.save(); c.shadowColor = o.c; c.shadowBlur = 14; c.fillStyle = sh(o.c, 0.6); c.beginPath(); c.arc(-58, -6 + w, 6, 0, 7); c.fill(); c.restore(); }
  },
  // 大鳥 / 鳳凰
  bird(c, t, o) {
    const s = o.s, flap = Math.sin(t * 3.4) * 0.18, wsz = 0.5 + s * 0.18;
    A.wingFeather(c, 6, -12, wsz, -0.1 - flap, o.a, o.b, true);
    const n = 2 + s;
    for (let i = 0; i < n; i++) {
      const sp = (i - (n - 1) / 2) * 7, L = 44 + s * 8;
      const tl = A.tube(c, [[18, 8], [34, 14 + sp * 0.4], [18 + L, 20 + sp + Math.sin(t * 2 + i) * 3]], u => 1 + 3.4 * Math.sin(u * Math.PI * 0.9), G.lg(c, 18, 0, 80, 0, o.a, o.b));
      const e = tl[tl.length - 1];
      if (s >= 2) { c.save(); c.shadowColor = o.c; c.shadowBlur = 6; c.fillStyle = o.c; c.beginPath(); c.arc(e.x - 2, e.y, 2.6, 0, 7); c.fill(); c.restore(); c.fillStyle = '#10182a'; c.beginPath(); c.arc(e.x - 2, e.y, 1.1, 0, 7); c.fill(); }
    }
    for (const [lx, fx] of [[3, -4], [12, 8]]) { c.strokeStyle = o.horncol || '#c89040'; c.lineWidth = 2.2; c.beginPath(); c.moveTo(lx, 12); c.lineTo(fx, 28); c.lineTo(fx - 2, 40); c.stroke(); A.claws(c, fx - 3, 39.5, -1, 1.6, o.horncol || '#e0c080'); }
    const body = A.body(c, [[-10, -6], [4, 1], [20, 10]], u => 8 + Math.sin(u * Math.PI) * 8, o.a);
    A.belly(c, body, 1, o.b);
    c.strokeStyle = 'rgba(0,0,0,0.2)'; c.lineWidth = 0.5;
    for (let i = 0; i < body.length; i += 2) for (let k = -1; k <= 1; k++) { const p = body[i], r = body.wf(p.u) * k * 0.6; c.beginPath(); c.arc(p.x + p.nx * r, p.y + p.ny * r, 2, 0.2, 2.9); c.stroke(); }
    const neck = A.body(c, [[-8, -8], [-20, -20], [-16, -34], [-22, -42]], [8.5, 4.6], o.a);
    A.belly(c, neck, 1, o.b);
    // 頭
    c.save(); c.translate(-24, -44);
    for (let i = 0; i < 3 + s; i++) { const a = -2.5 - i * 0.28 + Math.PI * 0.2; A.tube(c, [[3, -2], [3 + Math.cos(a + 3.14) * -10, -2 + Math.sin(a) * 12], [4 - Math.cos(a) * 20 * 0.9, -2 + Math.sin(a) * 24]], u => 1.6 * (1 - u) + 0.3, i % 2 ? o.c : o.b, 'rgba(0,0,0,0.3)', 0.3); }
    const g = c.createRadialGradient(-2, -3, 1, 0, 0, 9); g.addColorStop(0, sh(o.a, 0.4)); g.addColorStop(1, sh(o.a, -0.2));
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, 7.5, 0, 7); c.fill(); c.strokeStyle = 'rgba(10,6,14,0.8)'; c.lineWidth = 0.8; c.stroke();
    c.fillStyle = o.horncol || '#f0b030'; c.beginPath(); c.moveTo(-6, -3); c.quadraticCurveTo(-15, -2, -18, 4); c.quadraticCurveTo(-12, 2, -6, 3); c.closePath(); c.fill(); c.stroke();
    A.eye(c, -2, -2, 1.9, o.c);
    c.restore();
    A.wingFeather(c, 0, -10, wsz * 0.92, 0.28 + flap, o.a, o.b, false);
  },
  // 四足獸：lion / wolf / horse，可加翼、角、斑紋、多頭
  beast(c, t, o) {
    const s = o.s, kind = o.kind || 'lion', br = Math.sin(t * 2) * 0.8, wg = Math.sin(t * 1.6) * 3;
    const hoof = kind === 'horse';
    if (o.wings) A.wingFeather(c, 12, -14, 0.5 + s * 0.12, -0.15 - Math.sin(t * 2.6) * 0.14, o.a, o.b, true);
    // 尾
    const tl = A.body(c, [[26, -4], [40, -8], [50 + wg * 0.5, -22], [46 + wg, -36]], [3.6, 1], o.a);
    c.save(); c.shadowColor = o.c; c.shadowBlur = o.s >= 3 ? 8 : 0; c.fillStyle = o.b; const e = tl[tl.length - 1]; c.beginPath(); c.moveTo(e.x - 5, e.y + 6); c.quadraticCurveTo(e.x - 8, e.y - 8, e.x, e.y - 13); c.quadraticCurveTo(e.x + 8, e.y - 5, e.x + 5, e.y + 6); c.closePath(); c.fill(); c.restore();
    for (const [hx, fx] of [[-16, -24], [18, 12]]) { const l = A.body(c, [[hx, 2], [hx - 3, 20], [fx + 2, 33], [fx, 43]], legW(6.6, 2.4), sh(o.a, -0.4)); if (hoof) G.rr(c, fx - 3.6, 41, 7, 4, 1, '#2a2020'); else A.claws(c, fx - 1, 42.5, -1, 1.5, '#e8e0d0'); }
    const body = A.body(c, [[-24, -3 + br], [-4, -6 + br], [14, -4], [28, 0]], roundW(u => 13 + Math.sin(u * Math.PI) * 4), o.a);
    A.belly(c, body, 1, sh(o.b, 0.2));
    if (o.pat === 'stripe') { c.strokeStyle = sh(o.a, -0.6); c.lineWidth = 2; c.lineCap = 'round'; for (let i = 3; i < body.length - 1; i += 3) { const p = body[i], r = body.wf(p.u); c.beginPath(); c.moveTo(p.x - p.nx * r, p.y - p.ny * r); c.quadraticCurveTo(p.x + 2, p.y, p.x + p.nx * r * 0.4, p.y + p.ny * r * 0.4); c.stroke(); } }
    if (o.pat === 'spot') { c.fillStyle = sh(o.a, -0.45); for (let i = 2; i < body.length; i += 2) { const p = body[i]; c.beginPath(); c.arc(p.x + (i % 3) * 2, p.y - 4 + (i % 4) * 3, 1.8, 0, 7); c.fill(); } }
    if (o.pat === 'star') { for (let i = 2; i < body.length; i += 3) { const p = body[i]; G.star(c, p.x, p.y - 3 + (i % 4) * 2, 4, 2.4, 0.8, 0, o.c); } }
    if (o.pat === 'scale') A.scales(c, body, 'rgba(0,0,0,0.3)', 2, 4);
    for (const [hx, fx] of [[-20, -32], [22, 20]]) { const l = A.body(c, [[hx, 4], [hx + 3, 20], [fx + 3, 33], [fx, 43]], legW(9, 2.8), sh(o.a, -0.04)); if (hoof) G.rr(c, fx - 4, 41, 8, 4.4, 1, '#3a2a20', o.c, 0.5); else A.claws(c, fx - 1, 42.5, -1, 1.8, '#e8e0d0'); }
    const heads = o.heads || 1;
    for (let h = heads - 1; h >= 0; h--) {
      const hy = h === 0 ? 0 : h === 1 ? 5 : -10, hx = h === 0 ? 0 : h === 1 ? 13 : 11;
      const nk = A.body(c, [[-22, -7], [-32 + hx * 0.6, -18 + hy], [-36 + hx, -26 + hy]], [10, 7], h ? sh(o.a, -0.18) : o.a);
      if (o.mane) {
        for (let i = 0; i < 26; i++) {
          const a = i / 26 * 6.28 + 0.3, L = 15 + s * 3 + (i % 3) * 4, fl = Math.sin(t * 2.4 + i) * 1.4, mx = -36 + hx, my = -27 + hy;
          A.tube(c, [[mx + Math.cos(a) * 6, my + Math.sin(a) * 6], [mx + Math.cos(a) * L * 0.6 + 3, my + Math.sin(a) * L * 0.6 + fl], [mx + Math.cos(a) * L + 6, my + Math.sin(a) * L + 2]], [5, 0.4], i % 3 ? o.b : sh(o.b, -0.25), 'rgba(0,0,0,0.3)', 0.3);
        }
      }
      beastHead(c, -40 + hx, -29 + hy, 0.95, o, t + h, kind);
      if (o.horn) { const hc = o.horncol || o.c; A.tube(c, [[-41 + hx, -38 + hy], [-46 + hx, -50 + hy], [-40 + hx, -60 + hy]], [2.2, 0.3], hc); if (o.horn > 1) A.tube(c, [[-34 + hx, -39 + hy], [-32 + hx, -52 + hy], [-24 + hx, -58 + hy]], [2, 0.3], sh(hc, -0.15)); }
    }
    if (o.wings) A.wingFeather(c, 4, -14, 0.46 + s * 0.11, 0.25 + Math.sin(t * 2.6) * 0.14, o.a, o.b, false);
    if (o.flame) { c.save(); c.shadowColor = o.c; c.shadowBlur = 10; c.fillStyle = o.c; c.globalAlpha = 0.8; for (const [x, y] of [[-24, 43], [18, 43], [-34, 43], [10, 43]]) { const f = 8 + Math.sin(t * 9 + x) * 3; c.beginPath(); c.moveTo(x - 5, y); c.quadraticCurveTo(x, y - f * 2, x + 5, y); c.fill(); } c.restore(); }
  },
};

// 把藍圖變成可畫的幻靈
function drawPlan(c, id, t) {
  const o = MONS[id].art;
  const k = { 1: 0.74, 2: 0.88, 3: 1, 4: 1.1 }[o.s];
  c.save();
  if (o.s === 4) A.aura(c, t, sh(o.c, 0), 70);
  c.translate(0, 45 * (1 - k)); c.scale(k, k);
  PLANS[o.plan](c, t, o);
  c.restore();
}
