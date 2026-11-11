// ===== 華麗招式特效 =====
// 每個屬性都有專屬演出，分三級：小招、中招、大招（大招有畫面變暗與招式橫幅特寫）。

function fxRun(ms, fn) {
  const o = { p: 0, fn };
  (B.vfx = B.vfx || []).push(o);
  return tween(ms, p => o.p = p).then(() => { const i = B.vfx.indexOf(o); if (i >= 0) B.vfx.splice(i, 1); });
}
function drawVfx() {
  if (!B.vfx) return;
  for (const o of B.vfx.slice()) { ctx.save(); try { o.fn(o.p, ctx); } catch (e) { console.error(e); } ctx.restore(); }
}
function shakeFx(ms, amp) { return tween(ms, p => B.sk = amp * (1 - p)).then(() => B.sk = 0); }
function flashFx(col, a, ms) { return fxRun(ms, (p, c) => { c.globalAlpha = a * (1 - p); c.fillStyle = col; c.fillRect(-20, -20, W + 40, H + 40); }); }
function dimFx(col, a, ms) { return fxRun(ms, (p, c) => { c.globalAlpha = a * Math.min(1, p * 5, (1 - p) * 5); c.fillStyle = col; c.fillRect(-20, -20, W + 40, H + 40); }); }
function ringFx(x, y, r0, r1, col, ms, lw = 8) {
  return fxRun(ms, (p, c) => { c.globalAlpha = 1 - p; c.strokeStyle = col; c.lineWidth = lw * (1 - p) + 1; c.shadowColor = col; c.shadowBlur = 20; c.beginPath(); c.arc(x, y, r0 + (r1 - r0) * p, 0, 7); c.stroke(); });
}
function spray(x, y, col, n, spd, opt = {}) {
  for (let i = 0; i < n; i++) {
    const a = opt.ang != null ? opt.ang + (Math.random() - 0.5) * (opt.spread || 1) : Math.random() * 6.28, v = spd * (0.3 + Math.random() * 0.7);
    B.fx.push({ x: x + (Math.random() - 0.5) * (opt.w || 0), y: y + (Math.random() - 0.5) * (opt.h || 0), vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: opt.g || 0, life: 24 + Math.random() * 26, c: col, s: (opt.s || 3) * (0.5 + Math.random()) });
  }
}
function lerp(a, b, p) { return a + (b - a) * p; }
function boltPath(c, x0, y0, x1, y1, jag) {
  const n = 9; c.beginPath(); c.moveTo(x0, y0);
  for (let i = 1; i < n; i++) { const u = i / n; c.lineTo(lerp(x0, x1, u) + (Math.random() - 0.5) * jag, lerp(y0, y1, u) + (Math.random() - 0.5) * jag * 0.4); }
  c.lineTo(x1, y1);
}
function strokeBolt(c, x0, y0, x1, y1, col, jag = 44, w = 7) {
  boltPath(c, x0, y0, x1, y1, jag);
  c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = col; c.lineWidth = w; c.shadowColor = col; c.shadowBlur = 26; c.stroke();
  c.strokeStyle = '#ffffff'; c.lineWidth = w * 0.4; c.stroke();
}

// 招式橫幅特寫
function cutIn(M, mon) {
  const col = TYPES[M.t].c;
  return fxRun(1050, (p, c) => {
    const inn = Math.min(1, p * 6), out = Math.max(0, (p - 0.82) * 5.5), h = 150 * (inn - out);
    if (h <= 0) return;
    const y = 190, x = W * (1 - inn) * 0.5;
    c.fillStyle = 'rgba(0,0,0,0.72)'; c.fillRect(0, 0, W, H);
    c.save(); c.beginPath(); c.rect(0, y - h / 2, W, h); c.clip();
    const g = c.createLinearGradient(0, 0, W, 0); g.addColorStop(0, '#05030a'); g.addColorStop(0.5, col); g.addColorStop(1, '#05030a');
    c.fillStyle = g; c.fillRect(0, y - 90, W, 180);
    c.globalAlpha = 0.35; c.strokeStyle = '#fff'; c.lineWidth = 2;
    for (let i = 0; i < 26; i++) { const yy = y - 80 + (i * 37) % 160, xx = (i * 211 + p * 2400) % (W + 200) - 100; c.beginPath(); c.moveTo(xx, yy); c.lineTo(xx + 120, yy); c.stroke(); }
    c.globalAlpha = 1;
    drawMon(c, mon.id, 150 + x * 0.3, y + 12, 200, performance.now() / 1000, {});
    c.restore();
    c.save(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `bold 58px ${SERIF}`;
    c.lineWidth = 7; c.strokeStyle = 'rgba(0,0,0,0.85)'; c.strokeText(M.n, W * 0.62 + x, y);
    c.shadowColor = '#fff'; c.shadowBlur = 18; c.fillStyle = '#ffe9a0'; c.fillText(M.n, W * 0.62 + x, y);
    c.restore();
    c.strokeStyle = '#ffd77a'; c.lineWidth = 3; for (const yy of [y - h / 2, y + h / 2]) { c.beginPath(); c.moveTo(0, yy); c.lineTo(W, yy); c.stroke(); }
  });
}

// 蓄力：能量往施放者聚集
function chargeFx(a, col, ms) {
  const pts = Array.from({ length: 34 }, (_, i) => ({ an: i * 2.4, r: 90 + (i * 37) % 90, s: 2 + i % 3 }));
  return fxRun(ms, (p, c) => {
    c.shadowColor = col; c.shadowBlur = 12; c.fillStyle = col;
    for (const q of pts) { const r = q.r * (1 - p), an = q.an + p * 3; c.beginPath(); c.arc(a.x + Math.cos(an) * r, a.y + Math.sin(an) * r * 0.8, q.s, 0, 7); c.fill(); }
    const g = c.createRadialGradient(a.x, a.y, 2, a.x, a.y, 60 * p + 8); g.addColorStop(0, '#ffffff'); g.addColorStop(0.3, col); g.addColorStop(1, 'rgba(0,0,0,0)');
    c.globalAlpha = p; c.fillStyle = g; c.beginPath(); c.arc(a.x, a.y, 60 * p + 8, 0, 7); c.fill();
  });
}
// 飛行彈
function shotFx(a, b, ms, draw) { return fxRun(ms, (p, c) => { const e = p * p * 0.4 + p * 0.6, x = lerp(a.x, b.x, e), y = lerp(a.y, b.y, e) - Math.sin(p * Math.PI) * 26; draw(c, x, y, p); }); }

const FX = {
  async 火(a, b, tier) {
    const col = '#ff6a2a', trail = [];
    await shotFx(a, b, 260 + tier * 70, (c, x, y) => {
      trail.push([x, y]); if (trail.length > 16) trail.shift();
      trail.forEach(([tx, ty], i) => { const u = i / trail.length; c.globalAlpha = u * 0.7; c.fillStyle = i % 2 ? '#ffd040' : col; c.beginPath(); c.arc(tx, ty, (8 + tier * 6) * u, 0, 7); c.fill(); });
      c.globalAlpha = 1; c.shadowColor = '#ff8020'; c.shadowBlur = 30;
      const g = c.createRadialGradient(x, y, 2, x, y, 12 + tier * 8); g.addColorStop(0, '#fff'); g.addColorStop(0.4, '#ffd040'); g.addColorStop(1, '#ff3010'); c.fillStyle = g; c.beginPath(); c.arc(x, y, 12 + tier * 8, 0, 7); c.fill();
    });
    sfx('super'); flashFx('#ffb040', 0.5, 300); ringFx(b.x, b.y, 20, 130 + tier * 40, '#ffb040', 500, 14);
    spray(b.x, b.y, '#ffb040', 40, 9); spray(b.x, b.y, '#ff4010', 34, 7, { g: -0.1 });
    if (tier >= 2) await fxRun(tier === 3 ? 900 : 500, (p, c) => {
      const n = tier === 3 ? 7 : 3, base = 340;
      for (let i = 0; i < n; i++) {
        const x = b.x - 150 * (tier === 3 ? 1 : 0.4) + i * (tier === 3 ? 50 : 60), h = (260 + (i % 3) * 60) * Math.sin(Math.min(1, p * 1.4) * Math.PI), w = 34;
        const g = c.createLinearGradient(0, base, 0, base - h); g.addColorStop(0, '#fff4a0'); g.addColorStop(0.4, '#ff8020'); g.addColorStop(1, 'rgba(255,40,0,0)');
        c.fillStyle = g; c.beginPath(); c.moveTo(x - w, base); c.quadraticCurveTo(x - w * 0.2 + Math.sin(p * 30 + i) * 12, base - h * 0.6, x, base - h); c.quadraticCurveTo(x + w * 0.2 + Math.sin(p * 30 + i) * 12, base - h * 0.6, x + w, base); c.fill();
      }
    });
  },
  async 水(a, b, tier) {
    if (tier === 1) {
      for (let i = 0; i < 3; i++) { shotFx(a, b, 320, (c, x, y) => { c.shadowColor = '#60c0ff'; c.shadowBlur = 12; c.strokeStyle = '#d0f0ff'; c.lineWidth = 2; c.fillStyle = 'rgba(120,200,255,0.5)'; c.beginPath(); c.arc(x, y + i * 14 - 14, 12, 0, 7); c.fill(); c.stroke(); }); await wait(80); }
      await wait(220); spray(b.x, b.y, '#a0e0ff', 30, 7, { g: 0.2 }); return;
    }
    if (tier === 2) {
      await fxRun(520, (p, c) => {
        const e = Math.min(1, p * 2), x1 = lerp(a.x, b.x, e), y1 = lerp(a.y, b.y, e), w = 26 * Math.sin(p * Math.PI);
        c.lineCap = 'round'; c.strokeStyle = '#3a9aff'; c.lineWidth = w + 10; c.shadowColor = '#60c0ff'; c.shadowBlur = 24; c.beginPath(); c.moveTo(a.x, a.y); c.quadraticCurveTo((a.x + x1) / 2 + Math.sin(p * 20) * 20, (a.y + y1) / 2 - 50, x1, y1); c.stroke();
        c.strokeStyle = '#e0f8ff'; c.lineWidth = w * 0.4; c.stroke();
      });
      spray(b.x, b.y, '#a0e0ff', 50, 10, { g: 0.25 }); ringFx(b.x, b.y, 20, 140, '#a0e0ff', 400); return;
    }
    const dir = a.x < b.x ? 1 : -1;
    await fxRun(1100, (p, c) => {
      const front = dir > 0 ? lerp(-260, W + 260, p) : lerp(W + 260, -260, p);
      const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(180,235,255,0.95)'); g.addColorStop(0.4, '#2a7ae0'); g.addColorStop(1, '#0a2a80');
      c.fillStyle = g; c.beginPath();
      if (dir > 0) c.moveTo(-40, H); else c.moveTo(W + 40, H);
      for (let i = 0; i <= 20; i++) { const u = i / 20, hh = 90 + 70 * Math.sin(u * 7 + p * 14); const x = dir > 0 ? lerp(-40, front, u) : lerp(W + 40, front, u); c.lineTo(x, H - (120 + u * 390) + hh * 0.3 * Math.sin(u * 12 + p * 20)); }
      c.quadraticCurveTo(front + dir * 110, 90, front + dir * 30, H); c.closePath(); c.fill();
      c.strokeStyle = 'rgba(255,255,255,0.85)'; c.lineWidth = 7; c.stroke();
      c.fillStyle = '#fff'; for (let i = 0; i < 24; i++) c.fillRect(front + dir * ((i * 37) % 80) - 20, 80 + (i * 53) % 400, 5, 5);
    });
    spray(b.x, b.y, '#a0e0ff', 60, 12, { g: 0.3 });
  },
  async 木(a, b, tier) {
    const leaves = Array.from({ length: 16 + tier * 14 }, (_, i) => ({ a: i * 0.9, r: 30 + (i * 13) % 90, d: i * 0.012 }));
    await fxRun(520 + tier * 180, (p, c) => {
      for (const l of leaves) {
        const q = Math.max(0, Math.min(1, p * 1.4 - l.d)), x = lerp(a.x, b.x, Math.min(1, q * 1.6)) + Math.cos(l.a + p * 16) * l.r * q, y = lerp(a.y, b.y, Math.min(1, q * 1.6)) + Math.sin(l.a + p * 16) * l.r * 0.7 * q;
        c.save(); c.translate(x, y); c.rotate(l.a + p * 18); c.fillStyle = (l.a * 10 | 0) % 3 ? '#6adf50' : '#d8ff80'; c.shadowColor = '#80ff60'; c.shadowBlur = 8; c.beginPath(); c.moveTo(-10, 0); c.quadraticCurveTo(0, -7, 10, 0); c.quadraticCurveTo(0, 7, -10, 0); c.fill(); c.restore();
      }
    });
    if (tier >= 2) await fxRun(tier === 3 ? 800 : 460, (p, c) => {
      const n = tier === 3 ? 7 : 4;
      for (let i = 0; i < n; i++) {
        const an = i / n * 6.28, h = Math.min(1, p * 2.2), x0 = b.x + Math.cos(an) * 120, y0 = b.y + 110;
        const pts = [[x0, y0], [lerp(x0, b.x, 0.3) + Math.sin(i + p * 8) * 30, lerp(y0, b.y, 0.5) - 20], [lerp(x0, b.x + Math.sin(i) * 20, h), lerp(y0, b.y - 40, h)]];
        A.tube(c, pts, [11, 1.6], i % 2 ? '#3a8a30' : '#5ab040', 'rgba(10,30,10,0.8)', 1.4);
        A.spines(c, Object.assign(A.sample(pts), { wf: () => 8 }), i % 2 ? 1 : -1, 4, 9, '#a0e060');
      }
    });
    spray(b.x, b.y, '#9aff70', 40, 8);
  },
  async 雷(a, b, tier) {
    const n = [2, 4, 8][tier - 1];
    if (tier === 3) await fxRun(420, (p, c) => { c.globalAlpha = Math.min(1, p * 2) * 0.65; c.fillStyle = '#080a20'; c.fillRect(-20, -20, W + 40, H + 40); });
    for (let i = 0; i < n; i++) {
      const tx = b.x + (i ? (Math.random() - 0.5) * 150 : 0), sx = tx + (Math.random() - 0.5) * 200;
      sfxMove('雷');
      flashFx('#f8ffff', i === n - 1 ? 0.95 : 0.7, 160);
      shakeFx(200, 8 + tier * 3);
      spray(tx, b.y + 40, '#ffe860', 16, 9);
      const count = tier === 3 ? 3 : 1;
      await fxRun(170, (p, c) => { for (let k = 0; k < count; k++) strokeBolt(c, sx + k * 30, -20, tx + k * 8, b.y + 30, k ? '#a0c0ff' : '#ffe860', 70, 10 + tier * 2); });
    }
    await fxRun(320, (p, c) => { for (let i = 0; i < 6; i++) { const an = i * 1.05 + p * 12; strokeBolt(c, b.x, b.y, b.x + Math.cos(an) * 110, b.y + Math.sin(an) * 90, '#ffe860', 22, 3); } });
  },
  async 冰(a, b, tier) {
    const n = 5 + tier * 3;
    await fxRun(420, (p, c) => {
      for (let i = 0; i < n; i++) {
        const q = Math.min(1, Math.max(0, p * 1.5 - i * 0.04)), x = lerp(a.x, b.x + (i - n / 2) * 12, q), y = lerp(a.y, b.y + (i % 3 - 1) * 24, q), an = Math.atan2(b.y - a.y, b.x - a.x);
        c.save(); c.translate(x, y); c.rotate(an); c.shadowColor = '#a0f0ff'; c.shadowBlur = 12; c.fillStyle = '#e8fbff'; c.beginPath(); c.moveTo(20, 0); c.lineTo(-10, -6); c.lineTo(-6, 0); c.lineTo(-10, 6); c.closePath(); c.fill(); c.restore();
      }
    });
    if (tier >= 2) {
      const sz = tier === 3 ? 1.5 : 1;
      await fxRun(tier === 3 ? 900 : 520, (p, c) => {
        const g = Math.min(1, p * 2.4);
        c.fillStyle = `rgba(160,230,255,${0.28 * g})`; c.fillRect(-20, -20, W + 40, H + 40);
        for (let i = 0; i < 9; i++) {
          const x = b.x + (i - 4) * 34 * sz, h = (130 + (4 - Math.abs(i - 4)) * 40) * g * sz, base = b.y + 100, w = 24;
          const gr = c.createLinearGradient(x - w, base - h, x + w, base); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.5, '#90e0ff'); gr.addColorStop(1, '#2a6ac0');
          c.fillStyle = gr; c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(x - w, base); c.lineTo(x - w * 0.6, base - h * 0.7); c.lineTo(x, base - h); c.lineTo(x + w * 0.6, base - h * 0.7); c.lineTo(x + w, base); c.closePath(); c.fill(); c.stroke();
        }
      });
      flashFx('#ffffff', 0.7, 240); sfxMove('冰');
    }
    spray(b.x, b.y, '#e8fbff', 50, 11, { g: 0.2 }); ringFx(b.x, b.y, 10, 150, '#a0f0ff', 400);
  },
  async 風(a, b, tier) {
    await fxRun(520 + tier * 240, (p, c) => {
      const lay = 14 + tier * 8;
      for (let i = 0; i < lay; i++) {
        const u = i / lay, y = b.y + 120 - u * 300, r = (20 + u * (70 + tier * 34)) * Math.min(1, p * 3), an = p * 34 + i * 0.8;
        c.strokeStyle = i % 3 ? 'rgba(170,255,225,0.75)' : 'rgba(255,255,255,0.9)'; c.lineWidth = 3; c.shadowColor = '#7fe0c8'; c.shadowBlur = 10;
        c.beginPath(); c.ellipse(b.x, y, r, r * 0.26, 0, an, an + 3.6); c.stroke();
      }
      for (let i = 0; i < 12; i++) { const q = (p * 3 + i * 0.13) % 1, an = i * 2.1 + p * 20, x = b.x + Math.cos(an) * 130 * q, y = b.y + Math.sin(an) * 90 * q; c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(an + 1.5) * 30, y + Math.sin(an + 1.5) * 30); c.stroke(); }
    });
    if (tier === 3) { flashFx('#d0fff0', 0.6, 240); await fxRun(300, (p, c) => { for (let i = -2; i <= 2; i++) { c.strokeStyle = '#fff'; c.lineWidth = 5 * (1 - p); c.shadowColor = '#7fe0c8'; c.shadowBlur = 20; c.beginPath(); c.moveTo(b.x - 200, b.y + i * 40 - 60 + p * 60); c.lineTo(b.x + 200, b.y + i * 40 + 60 - p * 60); c.stroke(); } }); }
    spray(b.x, b.y, '#b8ffe8', 30, 9);
  },
  async 地(a, b, tier) {
    shakeFx(500 + tier * 240, 7 + tier * 5);
    sfxMove('地');
    const n = 4 + tier * 3;
    await fxRun(460 + tier * 170, (p, c) => {
      for (let i = 0; i < n; i++) {
        const q = Math.min(1, Math.max(0, p * 2 - i * 0.06)), x = b.x + (i - (n - 1) / 2) * (200 / n) * (tier === 3 ? 1.4 : 1), base = b.y + 110, h = (120 + (i % 3) * 60) * Math.sin(q * Math.PI * 0.75) * (1 + tier * 0.15);
        const g = c.createLinearGradient(x - 22, base - h, x + 22, base); g.addColorStop(0, '#d8b080'); g.addColorStop(1, '#4a3020');
        c.fillStyle = g; c.strokeStyle = 'rgba(20,10,0,0.8)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x - 26, base); c.lineTo(x - 6, base - h); c.lineTo(x + 8, base - h * 0.9); c.lineTo(x + 26, base); c.closePath(); c.fill(); c.stroke();
      }
    });
    spray(b.x, b.y + 90, '#b08858', 50, 11, { g: 0.35, w: 200, s: 4 });
    if (tier === 3) { flashFx('#ffe0a0', 0.5, 300); ringFx(b.x, b.y + 100, 20, 320, '#d8b080', 600, 18); }
  },
  async 鋼(a, b, tier) {
    if (tier === 3) {
      await fxRun(620, (p, c) => {
        const y = lerp(-240, b.y, p * p), L = 240;
        c.save(); c.translate(b.x, y); c.shadowColor = '#d0f0ff'; c.shadowBlur = 30;
        const g = c.createLinearGradient(-30, 0, 30, 0); g.addColorStop(0, '#ffffff'); g.addColorStop(0.5, '#a8b4c4'); g.addColorStop(1, '#505a6a');
        c.fillStyle = g; c.beginPath(); c.moveTo(-28, -L); c.lineTo(28, -L); c.lineTo(0, 90); c.closePath(); c.fill();
        c.fillStyle = '#c8a050'; c.fillRect(-64, -L - 14, 128, 20); c.fillRect(-11, -L - 74, 22, 62); c.restore();
      });
      sfx('super'); sfxMove('鋼'); flashFx('#ffffff', 0.95, 300); shakeFx(460, 20); ringFx(b.x, b.y + 40, 20, 320, '#d0e8ff', 560, 16);
      spray(b.x, b.y, '#ffe060', 60, 13, { g: 0.2 }); return;
    }
    const n = tier === 2 ? 4 : 2;
    for (let i = 0; i < n; i++) {
      sfxMove('鋼');
      await fxRun(130, (p, c) => {
        const an = i % 2 ? 0.8 : -0.8, L = 130, dx = Math.cos(an) * L, dy = Math.sin(an) * L;
        c.strokeStyle = '#fff'; c.lineWidth = 16 * Math.sin(p * Math.PI); c.lineCap = 'round'; c.shadowColor = '#a0d8ff'; c.shadowBlur = 22; c.beginPath(); c.moveTo(b.x - dx, b.y - dy); c.lineTo(lerp(b.x - dx, b.x + dx, Math.min(1, p * 1.6)), lerp(b.y - dy, b.y + dy, Math.min(1, p * 1.6))); c.stroke();
      });
      spray(b.x, b.y, '#ffe060', 14, 10, { g: 0.2, s: 2 });
    }
  },
  async 光(a, b, tier) {
    if (tier === 1) { await shotFx(a, b, 300, (c, x, y) => { c.shadowColor = '#ffe680'; c.shadowBlur = 26; G.star(c, x, y, 8, 20, 8, performance.now() / 120, '#fffbe0'); }); ringFx(b.x, b.y, 10, 120, '#ffe680', 340); spray(b.x, b.y, '#fff4b0', 26, 8); return; }
    await fxRun(tier === 3 ? 1200 : 680, (p, c) => {
      const w = (tier === 3 ? 120 : 60) * Math.sin(Math.min(1, p * 1.2) * Math.PI) + 8;
      if (tier === 3) { c.fillStyle = `rgba(255,250,220,${0.4 * Math.sin(p * Math.PI)})`; c.fillRect(-20, -20, W + 40, H + 40); }
      const g = c.createLinearGradient(b.x - w, 0, b.x + w, 0); g.addColorStop(0, 'rgba(255,240,160,0)'); g.addColorStop(0.5, '#ffffff'); g.addColorStop(1, 'rgba(255,240,160,0)');
      c.fillStyle = g; c.fillRect(b.x - w, -20, w * 2, b.y + 130);
      c.strokeStyle = '#ffe680'; c.lineWidth = 3; c.shadowColor = '#ffe680'; c.shadowBlur = 20;
      for (let i = 0; i < 4; i++) { const q = (p * 2 + i * 0.25) % 1; c.globalAlpha = 1 - q; c.beginPath(); c.ellipse(b.x, b.y + 100 - q * 300, w * 1.5, w * 0.34, 0, 0, 7); c.stroke(); }
      c.globalAlpha = 1;
      for (let i = 0; i < 18; i++) { const x = b.x + Math.sin(i * 7.3) * w * 1.6, y = ((i * 57 + p * 900) % 420) - 20; G.star(c, x, 420 - y, 4, 6, 1.6, 0, '#fff4b0'); }
    });
    flashFx('#ffffff', tier === 3 ? 0.95 : 0.6, 320); spray(b.x, b.y, '#fff4b0', 50, 11);
  },
  async 暗(a, b, tier) {
    // 黑暗球：吸光 → 飛行 → 吞噬
    const R = 18 + tier * 14;
    const ball = (c, x, y, r, p) => {
      c.save(); c.translate(x, y);
      c.save(); c.scale(1, 0.34); c.rotate(p * 18); for (let i = 0; i < 3; i++) { c.strokeStyle = i % 2 ? '#ff60e0' : '#9a50ff'; c.lineWidth = 3; c.shadowColor = '#b060ff'; c.shadowBlur = 16; c.beginPath(); c.arc(0, 0, r * (1.45 + i * 0.3), i, i + 4.5); c.stroke(); } c.restore();
      const g = c.createRadialGradient(0, 0, r * 0.2, 0, 0, r * 1.25); g.addColorStop(0, '#000000'); g.addColorStop(0.72, '#05000c'); g.addColorStop(0.86, '#6a20c0'); g.addColorStop(1, 'rgba(120,40,220,0)');
      c.fillStyle = g; c.beginPath(); c.arc(0, 0, r * 1.25, 0, 7); c.fill(); c.restore();
    };
    const dark = fxRun(900 + tier * 320, (p, c) => { c.fillStyle = `rgba(10,0,24,${0.72 * Math.min(1, p * 3, (1 - p) * 4)})`; c.fillRect(-20, -20, W + 40, H + 40); });
    await fxRun(320 + tier * 120, (p, c) => {
      for (let i = 0; i < 40; i++) { const an = i * 2.4 + p * 5, r = (240 - (i * 5) % 100) * (1 - p); c.strokeStyle = '#b070ff'; c.lineWidth = 2; c.beginPath(); c.moveTo(a.x + Math.cos(an) * r, a.y + Math.sin(an) * r); c.lineTo(a.x + Math.cos(an) * (r + 26), a.y + Math.sin(an) * (r + 26)); c.stroke(); }
      ball(c, a.x, a.y, R * p, p);
    });
    sfxMove('暗');
    await shotFx(a, b, 320 + tier * 80, (c, x, y, p) => ball(c, x, y, R * (1 + p * 0.3), p));
    await fxRun(240 + tier * 120, (p, c) => { ball(c, b.x, b.y, R * 1.3 + p * (70 + tier * 50), p); });
    sfx('super'); shakeFx(320, 8 + tier * 5);
    await fxRun(200, (p, c) => { ball(c, b.x, b.y, (R * 1.3 + 70 + tier * 50) * (1 - p), p); });
    flashFx('#c060ff', 0.7, 260); ringFx(b.x, b.y, 10, 170 + tier * 50, '#b060ff', 460, 14);
    spray(b.x, b.y, '#b060ff', 46, 11);
    await dark;
  },
  async 靈(a, b, tier) {
    const n = 4 + tier * 3;
    await fxRun(460 + tier * 170, (p, c) => {
      for (let i = 0; i < n; i++) {
        const q = Math.min(1, p * 1.3), an = i / n * 6.28 + p * 8, r = lerp(90, 0, Math.pow(q, 2)), x = lerp(a.x, b.x, q) + Math.cos(an) * r, y = lerp(a.y, b.y, q) + Math.sin(an) * r * 0.7;
        c.shadowColor = '#c890ff'; c.shadowBlur = 18;
        const g = c.createRadialGradient(x, y, 1, x, y, 16); g.addColorStop(0, '#ffffff'); g.addColorStop(0.5, '#c890ff'); g.addColorStop(1, 'rgba(120,60,200,0)');
        c.fillStyle = g; c.beginPath(); c.arc(x, y, 16, 0, 7); c.fill();
      }
    });
    await fxRun(tier === 3 ? 760 : 420, (p, c) => {
      const s = (tier === 3 ? 2.4 : 1.4) * Math.min(1, p * 3); c.globalAlpha = Math.min(1, (1 - p) * 3) * 0.92;
      c.translate(b.x, b.y - 30 - p * 30); c.scale(s, s); c.shadowColor = '#c890ff'; c.shadowBlur = 24;
      c.fillStyle = '#efe6ff'; c.beginPath(); c.arc(0, -8, 38, 0, 7); c.fill(); c.fillRect(-20, 20, 40, 24);
      c.fillStyle = '#1a0a30'; for (const d of [-1, 1]) { c.beginPath(); c.ellipse(d * 15, -8, 11, 13, 0, 0, 7); c.fill(); }
      c.beginPath(); c.moveTo(0, 6); c.lineTo(-6, 18); c.lineTo(6, 18); c.closePath(); c.fill();
      for (let i = -2; i <= 2; i++) c.fillRect(i * 8 - 1.5, 26, 3, 18);
      c.fillStyle = '#ff5ad0'; for (const d of [-1, 1]) { c.beginPath(); c.arc(d * 15, -8, 3.4, 0, 7); c.fill(); }
    });
    flashFx('#8a50d0', 0.5, 240); spray(b.x, b.y, '#d8b0ff', 34, 9);
  },
  async 幻(a, b, tier) {
    const cols = ['#ff70c0', '#ffd060', '#70e0ff', '#a080ff', '#80ffa0'];
    await fxRun(560 + tier * 240, (p, c) => {
      c.translate(b.x, b.y);
      const layers = 2 + tier;
      for (let k = 0; k < layers; k++) {
        const n = 5 + k, r = (50 + k * 42) * Math.min(1, p * 2.4);
        c.save(); c.rotate(p * (k % 2 ? -7 : 7)); c.globalAlpha = Math.min(1, (1 - p) * 3);
        for (let i = 0; i < n; i++) { c.rotate(6.28 / n); c.shadowColor = cols[(i + k) % 5]; c.shadowBlur = 16; G.star(c, r, 0, 4, 22 - k * 2, 5, p * 9, cols[(i + k) % 5]); }
        c.strokeStyle = cols[k % 5]; c.lineWidth = 2; c.beginPath(); for (let i = 0; i <= 6; i++) { const an = i * 1.047; i ? c.lineTo(Math.cos(an) * r, Math.sin(an) * r) : c.moveTo(Math.cos(an) * r, Math.sin(an) * r); } c.stroke();
        c.restore();
      }
    });
    if (tier === 3) await fxRun(420, (p, c) => { for (let i = 0; i < 5; i++) { c.globalAlpha = (1 - p) * 0.55; c.fillStyle = cols[i]; c.fillRect(0, 0, W, 0); c.beginPath(); const an = i * 1.25 + p; c.moveTo(b.x, b.y); c.lineTo(b.x + Math.cos(an) * 900, b.y + Math.sin(an) * 900); c.lineTo(b.x + Math.cos(an + 0.3) * 900, b.y + Math.sin(an + 0.3) * 900); c.closePath(); c.fill(); } });
    flashFx('#ffc0f0', 0.6, 260); spray(b.x, b.y, '#ffb0e0', 36, 10);
  },
  async 鬥(a, b, tier) {
    const n = [1, 3, 5][tier - 1];
    const dir = a.x < b.x ? 1 : -1;
    for (let i = 0; i < n; i++) {
      const hx = b.x + (i ? (Math.random() - 0.5) * 90 : 0), hy = b.y + (i ? (Math.random() - 0.5) * 80 : 0);
      sfxMove('鬥'); flashFx('#fff4d0', 0.5, 90); shakeFx(130, 7 + tier * 2);
      await fxRun(120, (p, c) => {
        c.translate(hx, hy); c.rotate(p);
        G.star(c, 0, 0, 10, 40 + p * 56, 16 + p * 16, 0, '#ffd070', '#ffffff', 3);
        c.fillStyle = '#fff'; c.font = `bold 34px ${SERIF}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('轟', 0, 0);
      });
    }
    if (tier === 3) {
      await fxRun(420, (p, c) => {
        const x = lerp(b.x - dir * 420, b.x, p * p), s = 1 + p;
        c.translate(x, b.y); c.scale(dir * s, s); c.shadowColor = '#ff9040'; c.shadowBlur = 30;
        const g = c.createLinearGradient(-70, -50, 50, 50); g.addColorStop(0, '#ffd8a0'); g.addColorStop(1, '#e07020'); c.fillStyle = g; c.strokeStyle = '#401808'; c.lineWidth = 3;
        c.beginPath(); c.roundRect(-30, -46, 76, 92, 26); c.fill(); c.stroke();
        c.beginPath(); c.roundRect(-110, -26, 84, 52, 12); c.fill(); c.stroke();
        for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(14, -24 + i * 26); c.lineTo(44, -24 + i * 26); c.stroke(); }
      });
      flashFx('#ffffff', 0.95, 280); sfx('super'); shakeFx(420, 20); ringFx(b.x, b.y, 30, 340, '#ffc060', 520, 18);
    }
    spray(b.x, b.y, '#ffd090', 26, 10);
  },
};

// 變化招式：魔法陣與光環
async function statusFx(M, tgt) {
  const col = TYPES[M.t].c;
  await fxRun(640, (p, c) => {
    c.translate(tgt.x, tgt.y + 90); c.scale(1, 0.34); c.rotate(p * 5);
    c.globalAlpha = Math.min(1, p * 4, (1 - p) * 4); c.strokeStyle = col; c.shadowColor = col; c.shadowBlur = 18; c.lineWidth = 4;
    for (const r of [120, 92, 64]) { c.beginPath(); c.arc(0, 0, r, 0, 7); c.stroke(); }
    c.beginPath(); for (let i = 0; i <= 6; i++) { const an = i * 2.094 * 1.5; i ? c.lineTo(Math.cos(an) * 120, Math.sin(an) * 120) : c.moveTo(Math.cos(an) * 120, Math.sin(an) * 120); } c.stroke();
  });
  await fxRun(420, (p, c) => {
    c.shadowColor = col; c.shadowBlur = 16; c.fillStyle = col;
    for (let i = 0; i < 26; i++) { const x = tgt.x + Math.sin(i * 5.3) * 90, y = tgt.y + 90 - ((i * 19 + p * 300) % 240); c.globalAlpha = 1 - p * 0.6; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 3, y + 18); c.lineTo(x - 3, y + 18); c.closePath(); c.fill(); }
  });
}

async function playMoveFx(M, side) {
  const self = POS[side], foe = POS[side === 'p' ? 'f' : 'p'], mon = side === 'p' ? B.me() : B.foe();
  if (!M.p) { await statusFx(M, M.e && (M.e.foe || M.e.conf || M.e.sleep || M.e.poison || M.e.par || M.e.burn) ? foe : self); return; }
  const tier = (M.ult || M.p >= 100) ? 3 : M.p >= 65 ? 2 : 1;
  const col = TYPES[M.t].c;
  if (tier === 3) { sfx('encounter'); await cutIn(M, mon); }
  if (tier >= 2) await chargeFx(self, col, tier === 3 ? 420 : 240);
  await fxFor(M)(self, foe, tier);
}
