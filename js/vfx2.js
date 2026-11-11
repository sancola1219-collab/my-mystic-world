// ===== 招式演出分化：依招式名稱與編號挑選不同的演出，同屬性也不會都長一樣 =====

function fxImpact(b, c1, t) {
  sfx(t >= 3 ? 'super' : 'hit'); spray(b.x, b.y, c1, 18 + t * 10, 6 + t * 2);
  ringFx(b.x, b.y, 10, 70 + t * 50, c1, 340, 6 + t * 2);
  if (t >= 2) flashFx(c1, 0.25 + t * 0.12, 200);
  if (t >= 3) shakeFx(320, 14);
}
const XF = {
  // 上下巨顎咬合
  async bite(a, b, t, c1) {
    const s = 0.8 + t * 0.35;
    await fxRun(420 + t * 60, (p, c) => {
      const gap = 120 * s * (p < 0.7 ? 1 - p / 0.7 : 0), sh2 = p > 0.7 ? Math.sin((p - 0.7) * 40) * 5 : 0;
      c.translate(b.x + sh2, b.y);
      for (const d of [-1, 1]) {
        c.save(); c.translate(0, d * gap); c.scale(s, s * d);
        c.fillStyle = '#20101a'; c.strokeStyle = c1; c.lineWidth = 3; c.shadowColor = c1; c.shadowBlur = 14;
        c.beginPath(); c.moveTo(-96, -2); c.quadraticCurveTo(0, -46, 96, -2); c.lineTo(96, -14); c.quadraticCurveTo(0, -70, -96, -14); c.closePath(); c.fill(); c.stroke();
        c.fillStyle = '#fff6e0'; c.shadowBlur = 0;
        for (let i = 0; i < 8; i++) { const x = -82 + i * 23.4; c.beginPath(); c.moveTo(x - 10, -4 - Math.cos(x / 60) * 16); c.lineTo(x, 22 - Math.cos(x / 60) * 16); c.lineTo(x + 10, -4 - Math.cos(x / 60) * 16); c.closePath(); c.fill(); }
        c.restore();
      }
    });
    fxImpact(b, c1, t);
  },
  // 交錯斬擊
  async slash(a, b, t, c1) {
    const n = t + 1;
    for (let i = 0; i < n; i++) {
      const an = [0.7, -0.7, 0, 1.3, -1.3][i % 5];
      sfxMove('鋼');
      await fxRun(150, (p, c) => {
        c.translate(b.x, b.y); c.rotate(an); c.shadowColor = c1; c.shadowBlur = 24;
        const L = 110 + t * 40, e = Math.min(1, p * 1.7), g = c.createLinearGradient(-L, 0, L, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, '#ffffff'); g.addColorStop(1, c1);
        c.fillStyle = g; c.globalAlpha = 1 - Math.max(0, p - 0.6) * 2.5;
        c.beginPath(); c.moveTo(-L, 0); c.quadraticCurveTo(0, -30 * Math.sin(p * 3.14), -L + 2 * L * e, 0); c.quadraticCurveTo(0, 8, -L, 0); c.fill();
      });
      spray(b.x, b.y, c1, 10, 8, { s: 2 });
    }
    fxImpact(b, c1, t);
  },
  // 三道爪痕
  async claw(a, b, t, c1) {
    for (let k = 0; k < t; k++) {
      await fxRun(240, (p, c) => {
        c.translate(b.x, b.y); c.rotate(k % 2 ? 0.4 : -0.4); c.shadowColor = c1; c.shadowBlur = 16; c.lineCap = 'round';
        for (let i = -2; i <= 2; i++) { c.strokeStyle = i % 2 ? c1 : '#ffffff'; c.lineWidth = 9 * (1 - Math.max(0, p - 0.5)); c.beginPath(); c.moveTo(i * 26 + 26, -100); c.lineTo(i * 26 + 26 - 52 * Math.min(1, p * 2), -100 + 200 * Math.min(1, p * 2)); c.stroke(); }
      });
    }
    fxImpact(b, c1, t);
  },
  // 連續打擊
  async barrage(a, b, t, c1) {
    const n = 3 + t * 2;
    for (let i = 0; i < n; i++) {
      const x = b.x + (Math.random() - 0.5) * 150, y = b.y + (Math.random() - 0.5) * 120;
      sfxMove('鬥');
      fxRun(170, (p, c) => { c.translate(x, y); c.rotate(i); c.globalAlpha = 1 - p; G.star(c, 0, 0, 8, 26 + p * 46, 12 + p * 14, 0, c1, '#ffffff', 2); });
      await wait(80);
    }
    await wait(150); fxImpact(b, c1, t);
  },
  // 粗光束
  async beam(a, b, t, c1) {
    const w = 10 + t * 11;
    await fxRun(480 + t * 170, (p, c) => {
      const e = Math.min(1, p * 3), x1 = lerp(a.x, b.x, e), y1 = lerp(a.y, b.y, e), W2 = w * Math.sin(Math.min(1, p * 1.05) * Math.PI) + 2;
      c.lineCap = 'round'; c.shadowColor = c1; c.shadowBlur = 30;
      c.strokeStyle = c1; c.lineWidth = W2 * 2; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(x1, y1); c.stroke();
      c.strokeStyle = '#ffffff'; c.lineWidth = W2 * 0.8; c.stroke();
      c.shadowBlur = 0; c.strokeStyle = 'rgba(255,255,255,0.6)'; c.lineWidth = 2;
      for (let i = 0; i < 5; i++) { const q = (p * 3 + i * 0.2) % 1, x = lerp(a.x, x1, q), y = lerp(a.y, y1, q); c.beginPath(); c.ellipse(x, y, W2 * 0.8, W2 * 1.8, Math.atan2(b.y - a.y, b.x - a.x), 0, 7); c.stroke(); }
    });
    fxImpact(b, c1, t);
  },
  // 天降流星
  async meteor(a, b, t, c1) {
    const n = 2 + t * 2;
    const list = Array.from({ length: n }, (_, i) => ({ x: b.x + (Math.random() - 0.5) * 220, y: b.y + (Math.random() - 0.5) * 90, d: i * 0.1, r: 12 + t * 6 + (i % 3) * 5 }));
    await fxRun(760 + t * 160, (p, c) => {
      for (const m of list) {
        const q = Math.min(1, Math.max(0, (p - m.d) / (1 - n * 0.09)));
        if (q <= 0 || q >= 1) continue;
        const x = m.x + (1 - q) * 280, y = m.y - (1 - q) * 460;
        c.strokeStyle = c1; c.lineWidth = m.r * 1.3; c.lineCap = 'round'; c.globalAlpha = 0.55; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 90, y - 150); c.stroke(); c.globalAlpha = 1;
        c.shadowColor = c1; c.shadowBlur = 26; const g = c.createRadialGradient(x - 3, y - 3, 1, x, y, m.r); g.addColorStop(0, '#ffffff'); g.addColorStop(0.5, c1); g.addColorStop(1, '#3a2010'); c.fillStyle = g; c.beginPath(); c.arc(x, y, m.r, 0, 7); c.fill(); c.shadowBlur = 0;
      }
    });
    shakeFx(360, 10 + t * 3); fxImpact(b, c1, t);
  },
  // 飛針齊射
  async needles(a, b, t, c1) {
    const n = 8 + t * 6, an0 = Math.atan2(b.y - a.y, b.x - a.x);
    await fxRun(480, (p, c) => {
      for (let i = 0; i < n; i++) {
        const q = Math.min(1, Math.max(0, p * 1.7 - i * 0.03)), ox = ((i * 37) % 120) - 60, oy = ((i * 53) % 110) - 55;
        c.save(); c.translate(lerp(a.x, b.x + ox, q), lerp(a.y, b.y + oy, q)); c.rotate(an0); c.shadowColor = c1; c.shadowBlur = 10; c.fillStyle = q >= 1 ? c1 : '#ffffff'; c.beginPath(); c.moveTo(24, 0); c.lineTo(-14, -3.4); c.lineTo(-14, 3.4); c.closePath(); c.fill(); c.restore();
      }
    });
    fxImpact(b, c1, t);
  },
  // 局部豪雨
  async rain(a, b, t, c1) {
    await fxRun(560 + t * 170, (p, c) => {
      c.fillStyle = 'rgba(20,24,40,' + 0.5 * Math.sin(p * 3.14) + ')'; c.beginPath(); c.ellipse(b.x, b.y - 150, 200, 54, 0, 0, 7); c.fill();
      c.strokeStyle = c1; c.lineWidth = 3; c.shadowColor = c1; c.shadowBlur = 8;
      for (let i = 0; i < 26 + t * 14; i++) { const x = b.x - 170 + (i * 47) % 340, y = b.y - 130 + ((i * 89 + p * 1800) % 260); c.beginPath(); c.moveTo(x, y); c.lineTo(x - 5, y + 26); c.stroke(); }
    });
    fxImpact(b, c1, t);
  },
  // 彩色龍捲
  async twister(a, b, t, c1) {
    await fxRun(620 + t * 200, (p, c) => {
      const lay = 16 + t * 6; c.shadowColor = c1; c.shadowBlur = 10;
      for (let i = 0; i < lay; i++) { const u = i / lay, y = b.y + 110 - u * 280, r = (14 + u * (66 + t * 26)) * Math.min(1, p * 3), an = p * 30 + i * 0.7; c.strokeStyle = i % 2 ? c1 : '#ffffff'; c.lineWidth = 2.6; c.beginPath(); c.ellipse(b.x + Math.sin(p * 9 + u * 3) * 16, y, r, r * 0.25, 0, an, an + 3.8); c.stroke(); }
    });
    fxImpact(b, c1, t);
  },
  // 鎖鏈纏繞
  async chains(a, b, t, c1) {
    await fxRun(640, (p, c) => {
      c.translate(b.x, b.y); c.shadowColor = c1; c.shadowBlur = 10; c.strokeStyle = c1; c.lineWidth = 3;
      for (let k = 0; k < 2 + t; k++) {
        const r = lerp(170, 62 + k * 8, Math.min(1, p * 1.6));
        for (let i = 0; i < 26; i++) { const an = i * 0.2415 + k * 1.2 + p * 4 * (k % 2 ? -1 : 1); c.beginPath(); c.ellipse(Math.cos(an) * r, Math.sin(an) * r * 0.55 - 14 + k * 26 - 26, 6, 4, an, 0, 7); c.stroke(); }
      }
    });
    fxImpact(b, c1, t);
  },
  // 音波
  async sound(a, b, t, c1) {
    const an = Math.atan2(b.y - a.y, b.x - a.x), D = Math.hypot(b.x - a.x, b.y - a.y);
    await fxRun(560 + t * 120, (p, c) => {
      c.translate(a.x, a.y); c.rotate(an); c.shadowColor = c1; c.shadowBlur = 14; c.lineCap = 'round';
      for (let i = 0; i < 5 + t; i++) { const q = (p * 2.2 + i * 0.2) % 1, r = 40 + q * (D + 40); c.globalAlpha = 1 - q * 0.7; c.strokeStyle = i % 2 ? c1 : '#ffffff'; c.lineWidth = 8 - q * 4; c.beginPath(); c.arc(0, 0, r, -0.55, 0.55); c.stroke(); }
    });
    shakeFx(220, 6); fxImpact(b, c1, t);
  },
  // 泡泡／毒液
  async bubbles(a, b, t, c1) {
    const n = 12 + t * 8;
    await fxRun(640, (p, c) => {
      c.strokeStyle = 'rgba(255,255,255,0.75)'; c.lineWidth = 1.6;
      for (let i = 0; i < n; i++) { const q = Math.min(1, Math.max(0, p * 1.6 - i * 0.02)), x = lerp(a.x, b.x + ((i * 41) % 130) - 65, q), y = lerp(a.y, b.y + ((i * 67) % 120) - 60, q) - Math.sin(q * 3.14) * 70, r = 7 + (i % 4) * 4; c.globalAlpha = q >= 1 ? 0 : 0.85; c.fillStyle = c1; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#fff'; c.beginPath(); c.arc(x - r * 0.3, y - r * 0.3, r * 0.22, 0, 7); c.fill(); }
    });
    fxImpact(b, c1, t);
  },
  // 大爆炸
  async blast(a, b, t, c1) {
    await shotFx(a, b, 240, (c, x, y) => { c.shadowColor = c1; c.shadowBlur = 20; G.circle(c, x, y, 12 + t * 3, '#ffffff', c1, 4); });
    flashFx('#ffffff', 0.7, 200); shakeFx(420, 10 + t * 4);
    await fxRun(520, (p, c) => {
      for (let i = 3; i >= 0; i--) { const q = Math.min(1, p * (1 + i * 0.3)), r = (70 + t * 50) * q * (1 - i * 0.18); c.globalAlpha = 1 - p; c.fillStyle = ['#fff4c0', c1, '#ff6020', '#402010'][3 - i]; c.beginPath(); for (let k = 0; k < 18; k++) { const an = k * 0.349, rr = r * (k % 2 ? 1.1 : 0.82); k ? c.lineTo(b.x + Math.cos(an) * rr, b.y + Math.sin(an) * rr) : c.moveTo(b.x + rr, b.y); } c.closePath(); c.fill(); }
    });
    fxImpact(b, c1, t);
  },
  // 光環收束
  async rings(a, b, t, c1) {
    await fxRun(620, (p, c) => {
      c.translate(b.x, b.y); c.shadowColor = c1; c.shadowBlur = 16; c.lineWidth = 4;
      for (let i = 0; i < 3 + t; i++) { const r = lerp(200, 30, Math.min(1, p * 1.5 - i * 0.06 + 0.1)); c.strokeStyle = i % 2 ? c1 : '#ffffff'; c.save(); c.rotate(i * 0.9 + p * 6); c.beginPath(); c.ellipse(0, 0, r, r * 0.38, 0, 0, 7); c.stroke(); c.restore(); }
    });
    fxImpact(b, c1, t);
  },
  // 羽毛風暴
  async feathers(a, b, t, c1) {
    const n = 12 + t * 8;
    await fxRun(680, (p, c) => {
      for (let i = 0; i < n; i++) { const q = Math.min(1, Math.max(0, p * 1.5 - i * 0.015)), x = lerp(a.x, b.x + ((i * 53) % 170) - 85, q) + Math.sin(q * 8 + i) * 20, y = lerp(a.y, b.y + ((i * 31) % 130) - 65, q); c.save(); c.translate(x, y); c.rotate(i + q * 9); c.fillStyle = i % 2 ? c1 : '#ffffff'; c.strokeStyle = 'rgba(0,0,0,0.3)'; c.lineWidth = 0.8; c.beginPath(); c.moveTo(-20, 0); c.quadraticCurveTo(0, -9, 20, 0); c.quadraticCurveTo(0, 9, -20, 0); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-20, 0); c.lineTo(20, 0); c.stroke(); c.restore(); }
    });
    fxImpact(b, c1, t);
  },
  // 符咒紙牌
  async cards(a, b, t, c1) {
    const n = 5 + t * 3;
    await fxRun(620, (p, c) => {
      for (let i = 0; i < n; i++) {
        const q = Math.min(1, Math.max(0, p * 1.5 - i * 0.03)), an = i * 1.2 + p * 8, r = (1 - q) * 70 + 30, x = lerp(a.x, b.x, q) + Math.cos(an) * r, y = lerp(a.y, b.y, q) + Math.sin(an) * r * 0.6;
        c.save(); c.translate(x, y); c.rotate(an); c.shadowColor = c1; c.shadowBlur = 10; G.rr(c, -13, -19, 26, 38, 3, '#fff4d0', c1, 2.4); G.star(c, 0, 0, 5, 8, 3, 0, c1); c.restore();
      }
    });
    fxImpact(b, c1, t);
  },
  // 地面光柱
  async pillar(a, b, t, c1) {
    await fxRun(460 + t * 160, (p, c) => {
      const w = (34 + t * 26) * Math.sin(Math.min(1, p * 1.1) * 3.14) + 4, base = b.y + 110, top = -20;
      const g = c.createLinearGradient(b.x - w, 0, b.x + w, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, '#ffffff'); g.addColorStop(1, 'rgba(255,255,255,0)');
      c.shadowColor = c1; c.shadowBlur = 34; c.fillStyle = c1; c.globalAlpha = 0.7; c.fillRect(b.x - w * 1.3, top, w * 2.6, base - top); c.globalAlpha = 1; c.fillStyle = g; c.fillRect(b.x - w, top, w * 2, base - top);
      c.strokeStyle = c1; c.lineWidth = 3; c.beginPath(); c.ellipse(b.x, base, w * 2, w * 0.5, 0, 0, 7); c.stroke();
    });
    fxImpact(b, c1, t);
  },
  // 巨大能量球
  async orb(a, b, t, c1) {
    const R = 16 + t * 12;
    await fxRun(320, (p, c) => { c.shadowColor = c1; c.shadowBlur = 26; const g = c.createRadialGradient(a.x, a.y, 2, a.x, a.y, R * p + 2); g.addColorStop(0, '#ffffff'); g.addColorStop(1, c1); c.fillStyle = g; c.beginPath(); c.arc(a.x, a.y, R * p + 2, 0, 7); c.fill(); });
    await shotFx(a, b, 300 + t * 40, (c, x, y, p) => { c.shadowColor = c1; c.shadowBlur = 30; const g = c.createRadialGradient(x - R * 0.3, y - R * 0.3, 2, x, y, R); g.addColorStop(0, '#ffffff'); g.addColorStop(0.6, c1); g.addColorStop(1, shade(c1, -0.5)); c.fillStyle = g; c.beginPath(); c.arc(x, y, R, 0, 7); c.fill(); c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 2; c.beginPath(); c.ellipse(x, y, R * 1.5, R * 0.4, p * 9, 0, 7); c.stroke(); });
    fxImpact(b, c1, t);
  },
  // 地面衝擊波
  async quake(a, b, t, c1) {
    const dir = a.x < b.x ? 1 : -1;
    await fxRun(460 + t * 80, (p, c) => {
      for (let i = 0; i < 7 + t * 2; i++) { const q = i / (7 + t * 2), show = p > q * 0.8; if (!show) continue; const x = lerp(a.x, b.x, q), y = lerp(a.y + 80, b.y + 80, q), h = (46 + i * 7) * (1 - Math.min(1, (p - q * 0.8) * 2.6)); c.fillStyle = c1; c.strokeStyle = 'rgba(0,0,0,0.5)'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(x - 20, y); c.lineTo(x - 4 * dir, y - h); c.lineTo(x + 20, y); c.closePath(); c.fill(); c.stroke(); }
    });
    shakeFx(320, 12); fxImpact(b, c1, t);
  },
  // 吸取能量
  async drain(a, b, t, c1) {
    await fxRun(760, (p, c) => {
      c.shadowColor = c1; c.shadowBlur = 12;
      for (let i = 0; i < 30; i++) { const q = (p * 2 + i * 0.033) % 1, x = lerp(b.x, a.x, q) + Math.sin(q * 9 + i) * 34, y = lerp(b.y, a.y, q) + Math.cos(q * 7 + i) * 34 - Math.sin(q * 3.14) * 60; c.fillStyle = i % 2 ? c1 : '#ffffff'; c.beginPath(); c.arc(x, y, 5 - q * 2, 0, 7); c.fill(); }
    });
    ringFx(a.x, a.y, 90, 10, c1, 300, 6); fxImpact(b, c1, Math.min(2, t));
  },
  // 濃霧吞沒
  async mist(a, b, t, c1) {
    await fxRun(640 + t * 120, (p, c) => {
      for (let i = 0; i < 16; i++) { const an = i * 2.4 + p * 3, r = 40 + (i % 5) * 26, s = (46 + (i % 3) * 18) * Math.min(1, p * 2.4); c.globalAlpha = 0.5 * Math.min(1, (1 - p) * 4); c.fillStyle = i % 2 ? c1 : shade(c1, 0.4); c.beginPath(); c.arc(b.x + Math.cos(an) * r, b.y + Math.sin(an) * r * 0.5, s, 0, 7); c.fill(); }
    });
    fxImpact(b, c1, t);
  },
  // 花瓣漩渦
  async petals(a, b, t, c1) {
    await fxRun(660, (p, c) => {
      c.translate(b.x, b.y);
      for (let i = 0; i < 26 + t * 10; i++) { const an = i * 0.7 + p * 12, r = (1 - p) * 170 + 12 + (i % 5) * 7; c.save(); c.rotate(an); c.translate(r, 0); c.rotate(i); c.fillStyle = i % 3 ? c1 : '#ffb0d0'; c.beginPath(); c.ellipse(0, 0, 11, 5, 0, 0, 7); c.fill(); c.restore(); }
    });
    fxImpact(b, c1, t);
  },
  // 火柱環繞／蒸氣爆發（彭子甯）
  async steam(a, b, t) {
    await fxRun(520, (p, c) => { c.shadowBlur = 30; for (let i = 0; i < 12; i++) { const an = i * 0.5236 + p * 8, r = lerp(200, 40, p); c.shadowColor = i % 2 ? '#40a0ff' : '#ff6020'; c.fillStyle = i % 2 ? '#80c8ff' : '#ffa040'; c.beginPath(); c.arc(b.x + Math.cos(an) * r, b.y + Math.sin(an) * r * 0.6, 18, 0, 7); c.fill(); } });
    flashFx('#ffffff', 0.95, 320); shakeFx(520, 22);
    await fxRun(620, (p, c) => { for (let i = 0; i < 30; i++) { const an = i * 2.4, r = p * (120 + (i % 6) * 40); c.globalAlpha = (1 - p) * 0.7; c.fillStyle = '#f4f8ff'; c.beginPath(); c.arc(b.x + Math.cos(an) * r, b.y + Math.sin(an) * r * 0.7, 26 + p * 30, 0, 7); c.fill(); } });
    fxImpact(b, '#ff8040', 3);
  },
};

// 招式名稱關鍵字 → 演出
const FX_WORDS = [
  [/海嘯|怒濤|潮|巨浪|滔天|海皇|倒灌/, 'wave'], [/龍捲|旋風|颶風|風暴|迴旋|旋舞|巡舞/, 'twister'], [/牙|咬|噬|吞|顎|巨口/, 'bite'], [/斬|刃|刀|劍|鐮|切/, 'slash'], [/爪|撕|抓/, 'claw'],
  [/連打|連環|連擊|亂舞|亂擊|百拳|連爪|連噬/, 'barrage'], [/流星|隕|星雨|墜|降/, 'meteor'], [/光束|射線|砲|炮|直線|投射|波動/, 'beam'], [/針|刺|飛刀|飛彈|尖|穿/, 'needles'], [/雨|雪|冰雹/, 'rain'],
  [/鎖|束縛|纏|封印|定命|絞|網/, 'chains'], [/吼|鳴|歌|音|嘯|啼|鐘/, 'sound'], [/毒|泡|酸|孢|鱗粉|黏/, 'bubbles'], [/爆|炸|新星|噴發/, 'blast'], [/環|輪|軌/, 'rings'], [/羽|翼/, 'feathers'], [/符|牌|卡|書|頁/, 'cards'], [/柱|聖光|審判|天光|天罰/, 'pillar'],
  [/地裂|崩|震|重壓|山岳|衝擊/, 'quake'], [/吸|牽引|吞噬|吸取/, 'drain'], [/霧|煙|塵|沙/, 'mist'], [/花|葉|櫻|森/, 'petals'], [/球|彈|珠|光彈/, 'orb'],
];
const FX_POOL = {
  火: ['type', 'blast', 'orb', 'pillar'], 水: ['jet', 'bubbles', 'rain', 'orb'], 木: ['type', 'petals', 'needles', 'drain'], 雷: ['type', 'beam', 'rings', 'orb'], 冰: ['type', 'needles', 'mist', 'pillar'], 風: ['type', 'twister', 'slash', 'feathers'],
  地: ['type', 'quake', 'meteor', 'blast'], 鋼: ['type', 'slash', 'beam', 'needles'], 光: ['type', 'pillar', 'beam', 'rings'], 暗: ['type', 'claw', 'mist', 'chains'], 靈: ['type', 'mist', 'drain', 'chains'], 幻: ['type', 'cards', 'rings', 'sound'], 鬥: ['type', 'barrage', 'quake', 'claw'],
};
const FX_COL2 = { 火: '#ffb040', 水: '#60c0ff', 木: '#80e060', 雷: '#ffe850', 冰: '#a0f0ff', 風: '#90f0d0', 地: '#d8a860', 鋼: '#c8d4e4', 光: '#fff0a0', 暗: '#a060e0', 靈: '#c890ff', 幻: '#ff90e0', 鬥: '#ffb080' };
function fxName(M) {
  if (M.fxk) return M.fxk;
  for (const [re, k] of FX_WORDS) if (re.test(M.n)) return k;
  const pool = FX_POOL[M.t] || ['orb'];
  return pool[strHash(M.n) >>> 0 ? (strHash(M.n) >>> 3) % pool.length : 0];
}
function fxFor(M) {
  const k = fxName(M), col = FX_COL2[M.t] || TYPES[M.t].c;
  if (k === 'type') return (a, b, tier) => FX[M.t](a, b, M.t === '水' ? Math.min(2, tier) : tier);
  if (k === 'wave') return (a, b) => FX.水(a, b, 3);
  if (k === 'jet') return (a, b) => FX.水(a, b, 2);
  return (a, b, tier) => XF[k](a, b, tier, col);
}
