// ===== 畫面升級：預先繪製的精緻地圖、建築招牌、光影天氣、人物、戰鬥背景 =====
// 在 main.js / extras.js 之後載入，覆蓋 drawPerson、worldLayer。

const PLAYER_LOOK = { hair: '#3a2414', shirt: '#d03a3a', pants: '#2a3a6a', hat: '#e84a3a', skin: '#f6d2ae' };

function shade(hex, k) { // k>0 變亮，k<0 變暗
  const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const f = v => Math.max(0, Math.min(255, Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k))));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}
function srand(seed) { let a = seed | 0; return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function strHash(s) { let h = 7; for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 2654435761); return h; }

// ---------- 人物 ----------
function drawPerson(c, x, y, dir, look, frame, scale) {
  const s = scale || TILE / 32;
  c.save(); c.translate(x, y); c.scale(s, s);
  const ol = 'rgba(30,18,12,0.85)', skin = look.skin || '#f6d2ae', side = dir === 'left' || dir === 'right', k = dir === 'left' ? -1 : 1;
  const sg = c.createRadialGradient(16, 30, 1, 16, 30, 10); sg.addColorStop(0, 'rgba(0,0,0,0.32)'); sg.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = sg; c.beginPath(); c.ellipse(16, 30, 10, 3.6, 0, 0, Math.PI * 2); c.fill();
  const walk = frame % 2 ? 1 : 0, sw = (frame % 4 === 1 ? 1 : frame % 4 === 3 ? -1 : 0) * 1.8;
  const shirt = look.shirt || '#c03030', pants = look.pants || '#2a3048';
  c.lineWidth = 0.8; c.strokeStyle = ol;
  // 背包（主角）
  const pack = look.styled && !look.robe;
  const drawPack = () => { const pg = c.createLinearGradient(9, 12, 23, 24); pg.addColorStop(0, '#c8884a'); pg.addColorStop(1, '#7a4a22'); c.fillStyle = pg; c.beginPath(); c.roundRect(side ? 16 - k * 9 - 3.5 : 10, 13, side ? 7 : 12, 10.5, 3); c.fill(); c.stroke(); c.fillStyle = '#5a3418'; if (!side) { c.beginPath(); c.roundRect(11.5, 17.5, 9, 4.6, 1.6); c.fill(); c.stroke(); c.fillStyle = '#e8c050'; c.fillRect(15.3, 18.6, 1.4, 1.6); } };
  if (pack && dir !== 'up') { c.save(); if (dir === 'down') { c.beginPath(); c.rect(0, 0, 32, 32); c.clip(); } if (side) drawPack(); c.restore(); }
  // 腳
  for (const [lx, o] of [[11.5, sw], [17.5, -sw]]) {
    const lg = c.createLinearGradient(lx, 0, lx + 4, 0); lg.addColorStop(0, shade(pants, 0.15)); lg.addColorStop(1, shade(pants, -0.3));
    c.fillStyle = lg; c.beginPath(); c.roundRect(lx, 21 + Math.max(0, o) * 0.5, 4, 6.5 - Math.abs(o) * 0.4, 1.5); c.fill(); c.stroke();
    const fy = 26.4 - Math.abs(o) * 0.4;
    c.fillStyle = '#3a2620'; c.beginPath(); c.roundRect(lx - 0.6, fy, 5.2, 2.8, [1.4, 1.4, 1, 1]); c.fill(); c.stroke();
    c.fillStyle = '#f0ece4'; c.fillRect(lx - 0.4, fy + 2, 4.8, 0.7);
    c.fillStyle = 'rgba(255,255,255,0.35)'; c.fillRect(lx + 0.4, fy + 0.5, 1.6, 0.7);
  }
  // 身體
  const gb = c.createLinearGradient(8, 13, 24, 23); gb.addColorStop(0, shade(shirt, 0.3)); gb.addColorStop(0.6, shirt); gb.addColorStop(1, shade(shirt, -0.3));
  c.fillStyle = gb; c.beginPath(); c.moveTo(10.5, 14); c.quadraticCurveTo(16, 12.6, 21.5, 14); c.quadraticCurveTo(23.4, 14.6, 23, 18); c.lineTo(22.6, 22.4); c.quadraticCurveTo(16, 23.6, 9.4, 22.4); c.lineTo(9, 18); c.quadraticCurveTo(8.6, 14.6, 10.5, 14); c.closePath(); c.fill(); c.stroke();
  if (dir !== 'up') {
    // 衣領、門襟、皺褶
    c.fillStyle = shade(shirt, 0.55); c.beginPath(); c.moveTo(12.6, 13.6); c.lineTo(16, 16.6); c.lineTo(19.4, 13.6); c.lineTo(17.6, 13.2); c.lineTo(16, 14.8); c.lineTo(14.4, 13.2); c.closePath(); c.fill();
    if (!side) { c.strokeStyle = shade(shirt, -0.35); c.lineWidth = 0.5; c.beginPath(); c.moveTo(16, 16.6); c.lineTo(16, 22); c.stroke(); for (const yy of [18, 20]) { c.fillStyle = shade(shirt, 0.6); c.beginPath(); c.arc(16.9, yy, 0.45, 0, 7); c.fill(); } }
    c.strokeStyle = 'rgba(0,0,0,0.18)'; c.lineWidth = 0.6; c.beginPath(); c.moveTo(11, 17); c.quadraticCurveTo(12, 19.5, 11.4, 21.6); c.moveTo(21, 17); c.quadraticCurveTo(20, 19.5, 20.6, 21.6); c.stroke();
    if (pack && !side) { c.strokeStyle = '#6a3e1c'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(11.4, 14); c.lineTo(11.6, 19.6); c.moveTo(20.6, 14); c.lineTo(20.4, 19.6); c.stroke(); }
  }
  c.strokeStyle = ol; c.lineWidth = 0.8;
  // 腰帶
  c.fillStyle = '#3a2a22'; c.beginPath(); c.roundRect(9.4, 20.4, 13.2, 1.9, 0.8); c.fill();
  if (dir !== 'up') { c.fillStyle = '#e8c050'; c.fillRect(side ? 16 + k * 3 - 1 : 15, 20.5, 2, 1.7); }
  if (look.robe) { const rg = c.createLinearGradient(7, 19, 25, 27); rg.addColorStop(0, shade(look.robe, 0.2)); rg.addColorStop(1, shade(look.robe, -0.3)); c.fillStyle = rg; c.beginPath(); c.moveTo(9, 19); c.lineTo(23, 19); c.quadraticCurveTo(24.6, 23, 24.8, 27); c.quadraticCurveTo(16, 28.4, 7.2, 27); c.quadraticCurveTo(7.4, 23, 9, 19); c.closePath(); c.fill(); c.stroke(); c.strokeStyle = 'rgba(0,0,0,0.2)'; c.beginPath(); c.moveTo(13, 20); c.lineTo(12.4, 27); c.moveTo(19, 20); c.lineTo(19.6, 27); c.stroke(); c.strokeStyle = ol; }
  if (pack && dir === 'up') drawPack();
  // 手臂
  const ay = side ? 0 : sw;
  const armDraw = (ax, oy) => {
    const ag = c.createLinearGradient(ax, 0, ax + 3.4, 0); ag.addColorStop(0, shade(shirt, 0.15)); ag.addColorStop(1, shade(shirt, -0.3));
    c.fillStyle = ag; c.beginPath(); c.roundRect(ax, 14.5 + oy, 3.4, 6.6, 1.6); c.fill(); c.stroke();
    c.fillStyle = shade(shirt, -0.4); c.fillRect(ax + 0.2, 19.8 + oy, 3, 0.9);
    const hg = c.createRadialGradient(ax + 1.3, 21.6 + oy, 0.3, ax + 1.7, 22 + oy, 2); hg.addColorStop(0, shade(skin, 0.25)); hg.addColorStop(1, shade(skin, -0.15));
    c.fillStyle = hg; c.beginPath(); c.arc(ax + 1.7, 22.1 + oy, 1.85, 0, 7); c.fill(); c.lineWidth = 0.5; c.stroke(); c.lineWidth = 0.8;
  };
  if (dir !== 'right') armDraw(6.5, ay);
  if (dir !== 'left') armDraw(22.1, -ay);
  // 脖子
  c.fillStyle = shade(skin, -0.18); c.fillRect(14.2, 15.4 - 3, 3.6, 2.4);
  // 頭
  const gh = c.createRadialGradient(13.6, 6.6, 1, 16, 9.5, 10); gh.addColorStop(0, shade(skin, 0.35)); gh.addColorStop(0.7, skin); gh.addColorStop(1, shade(skin, -0.15));
  c.fillStyle = gh; c.beginPath(); c.arc(16, 9.5, 8.2, 0, Math.PI * 2); c.fill(); c.stroke();
  // 耳朵
  if (dir !== 'up') { c.fillStyle = shade(skin, -0.05); for (const ex of side ? [16 - k * 6.4] : [7.9, 24.1]) { c.beginPath(); c.ellipse(ex, 10.6, 1.4, 2, 0, 0, 7); c.fill(); c.lineWidth = 0.5; c.stroke(); c.lineWidth = 0.8; } }
  const hair = look.hair || '#3a2414';
  const ghr = c.createLinearGradient(8, 0, 24, 12); ghr.addColorStop(0, shade(hair, 0.35)); ghr.addColorStop(0.5, hair); ghr.addColorStop(1, shade(hair, -0.3));
  c.fillStyle = ghr;
  if (dir === 'up') {
    c.beginPath(); c.arc(16, 9, 8.6, 0, Math.PI * 2); c.fill(); c.stroke();
    c.strokeStyle = 'rgba(0,0,0,0.25)'; c.lineWidth = 0.5; for (const lx of [-4, 0, 4]) { c.beginPath(); c.moveTo(16 + lx * 0.4, 1.4); c.quadraticCurveTo(16 + lx, 9, 16 + lx * 1.4, 16.4); c.stroke(); }
    c.strokeStyle = ol; c.lineWidth = 0.8;
  } else {
    c.beginPath(); c.arc(16, 8.2, 8.6, Math.PI * 1.02, Math.PI * 1.98); c.closePath(); c.fill();
    c.beginPath();
    if (dir === 'down') { c.moveTo(7.6, 9); c.quadraticCurveTo(9.4, 4, 12.4, 7.8); c.quadraticCurveTo(14, 4.4, 16.4, 7.2); c.quadraticCurveTo(18.6, 4.2, 20, 7.8); c.quadraticCurveTo(22.6, 4.4, 24.4, 9); }
    else { c.moveTo(16 + k * 8.4, 8); c.quadraticCurveTo(16 + k * 2, 3, 16 - k * 8.4, 10.5); }
    c.lineTo(16, 1); c.closePath(); c.fill();
    c.strokeStyle = ol; c.lineWidth = 0.7; c.beginPath(); c.arc(16, 8.2, 8.6, Math.PI * 1.02, Math.PI * 1.98); c.stroke();
    // 髮絲與光澤
    c.strokeStyle = 'rgba(0,0,0,0.22)'; c.lineWidth = 0.45; for (const lx of [11, 14.5, 18, 21]) { c.beginPath(); c.moveTo(16 + (lx - 16) * 0.5, 1.6); c.quadraticCurveTo(lx, 3.6, lx + 0.3, 6.6); c.stroke(); }
    c.strokeStyle = 'rgba(255,255,255,0.4)'; c.lineWidth = 0.9; c.beginPath(); c.arc(16, 8.4, 6.4, Math.PI * 1.22, Math.PI * 1.45); c.stroke();
    c.strokeStyle = ol; c.lineWidth = 0.8;
  }
  if (look.hat) {
    const hg2 = c.createLinearGradient(8, 0, 24, 8); hg2.addColorStop(0, shade(look.hat, 0.3)); hg2.addColorStop(1, shade(look.hat, -0.25));
    c.fillStyle = hg2; c.beginPath(); c.arc(16, 6.8, 8.4, Math.PI, 0); c.fill(); c.stroke();
    c.strokeStyle = shade(look.hat, -0.35); c.lineWidth = 0.5; c.beginPath(); c.moveTo(16, -1.6); c.lineTo(16, 6.6); c.stroke(); c.strokeStyle = ol; c.lineWidth = 0.8;
    c.fillStyle = shade(look.hat, -0.25);
    const bx = dir === 'left' ? 3.5 : dir === 'right' ? 16.5 : 7.5;
    if (dir !== 'up') { c.beginPath(); c.roundRect(bx, 5.4, dir === 'down' ? 17 : 12, 2.6, 1.2); c.fill(); c.stroke(); }
    c.fillStyle = '#ffffff'; c.beginPath(); c.arc(16, -1.4, 1.1, 0, 7); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.arc(13, 3.6, 2, 0, 7); c.fill();
  }
  // 臉
  if (dir !== 'up') {
    const eyes = dir === 'down' ? [12.6, 19.4] : dir === 'left' ? [11.4] : [20.6], iris = look.eye || '#5a3820';
    for (const ex of eyes) {
      const ox = dir === 'left' ? -0.4 : dir === 'right' ? 0.4 : 0;
      c.fillStyle = '#fff'; c.beginPath(); c.ellipse(ex, 11, 1.75, 2.15, 0, 0, 7); c.fill();
      c.fillStyle = iris; c.beginPath(); c.ellipse(ex + ox, 11.3, 1.25, 1.6, 0, 0, 7); c.fill();
      c.fillStyle = '#120a08'; c.beginPath(); c.ellipse(ex + ox, 11.5, 0.7, 0.95, 0, 0, 7); c.fill();
      c.fillStyle = '#fff'; c.beginPath(); c.arc(ex + ox - 0.5, 10.5, 0.55, 0, 7); c.fill(); c.beginPath(); c.arc(ex + ox + 0.5, 12.2, 0.25, 0, 7); c.fill();
      c.strokeStyle = '#1a1010'; c.lineWidth = 0.55; c.beginPath(); c.ellipse(ex, 11, 1.75, 2.15, 0, Math.PI * 1.1, Math.PI * 1.9); c.stroke();
      c.strokeStyle = shade(hair, -0.2); c.lineWidth = 0.6; c.beginPath(); c.moveTo(ex - 1.6, 8.1); c.quadraticCurveTo(ex, 7.4, ex + 1.6, 8.1); c.stroke();
    }
    c.fillStyle = 'rgba(160,90,70,0.45)'; c.beginPath(); c.arc(dir === 'down' ? 16 : 16 + k * 5.4, 12.8, 0.45, 0, 7); c.fill();
    if (dir === 'down') { c.fillStyle = 'rgba(255,120,120,0.35)'; c.beginPath(); c.ellipse(10.5, 13.6, 1.6, 1, 0, 0, 7); c.ellipse(21.5, 13.6, 1.6, 1, 0, 0, 7); c.fill(); c.strokeStyle = 'rgba(80,30,20,0.8)'; c.lineWidth = 0.7; c.beginPath(); c.arc(16, 13.4, 1.4, 0.2, Math.PI - 0.2); c.stroke(); }
    else { c.strokeStyle = 'rgba(80,30,20,0.8)'; c.lineWidth = 0.6; c.beginPath(); c.moveTo(16 + k * 4.4, 14.4); c.lineTo(16 + k * 6, 14.2); c.stroke(); c.fillStyle = 'rgba(255,120,120,0.3)'; c.beginPath(); c.ellipse(16 + k * 2.4, 13.4, 1.5, 0.9, 0, 0, 7); c.fill(); }
  }
  c.restore();
}

// ---------- 建築 ----------
function computeBuildings(map) {
  if (map.bld) return map.bld;
  const seen = new Set(), out = [];
  for (let y = 0; y < map.h; y++) for (let x = 0; x < map.w; x++) {
    const ch = map.rows[y][x];
    if ((ch !== 'H' && ch !== 'D') || seen.has(x + ',' + y)) continue;
    const st = [[x, y]]; seen.add(x + ',' + y);
    const b = { x0: x, y0: y, x1: x, y1: y, doors: [] };
    while (st.length) {
      const [cx, cy] = st.pop();
      b.x0 = Math.min(b.x0, cx); b.x1 = Math.max(b.x1, cx); b.y0 = Math.min(b.y0, cy); b.y1 = Math.max(b.y1, cy);
      if (map.rows[cy][cx] === 'D') b.doors.push([cx, cy]);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cx + dx, ny = cy + dy, k = nx + ',' + ny;
        if (nx < 0 || ny < 0 || nx >= map.w || ny >= map.h || seen.has(k)) continue;
        const c2 = map.rows[ny][nx];
        if (c2 === 'H' || c2 === 'D') { seen.add(k); st.push([nx, ny]); }
      }
    }
    const d = b.doors[0], info = d && map.doors[d[0] + ',' + d[1]];
    b.roof = (info && info.roof) || '#8a5a3a'; b.label = info && info.label;
    out.push(b);
  }
  return (map.bld = out);
}

function signStyle(label) {
  if (/祈光亭/.test(label)) return ['#c83a3a', '#fff4e0', '✚ '];
  if (/商店/.test(label)) return ['#2a6ab0', '#fff4e0', '◆ '];
  if (/試煉|塔/.test(label)) return ['#a07020', '#fff0b0', '★ '];
  return ['#7a5030', '#fff4e0', ''];
}

function drawBuilding(c, b, R) {
  const T = TILE, X0 = b.x0 * T, Y0 = b.y0 * T, X1 = (b.x1 + 1) * T, Y1 = (b.y1 + 1) * T, wallTop = b.y1 * T - 6;
  // 影子
  c.fillStyle = 'rgba(0,0,0,0.22)';
  c.beginPath(); c.moveTo(X1, Y0 + 10); c.lineTo(X1 + 16, Y0 + 24); c.lineTo(X1 + 16, Y1 + 8); c.lineTo(X0 + 14, Y1 + 8); c.lineTo(X0, Y1); c.lineTo(X1, Y1); c.closePath(); c.fill();
  // 牆
  const gw = c.createLinearGradient(0, wallTop, 0, Y1); gw.addColorStop(0, '#f6ead2'); gw.addColorStop(1, '#d8c6a2');
  c.fillStyle = gw; c.fillRect(X0, wallTop, X1 - X0, Y1 - wallTop);
  c.fillStyle = 'rgba(120,90,60,0.08)'; for (let i = 0; i < (X1 - X0) / 3; i++) c.fillRect(X0 + R() * (X1 - X0), wallTop + R() * (Y1 - wallTop), 2, 2);
  c.fillStyle = '#8a8478'; c.fillRect(X0, Y1 - 8, X1 - X0, 8);
  c.fillStyle = '#a8a294'; for (let x = X0; x < X1; x += 12) c.fillRect(x + 1, Y1 - 7, 10, 3);
  c.fillStyle = '#6a4428';
  for (let tx = b.x0; tx <= b.x1 + 1; tx++) c.fillRect(Math.min(X1 - 5, tx * T - 2.5), wallTop, 5, Y1 - wallTop - 8);
  c.fillRect(X0, wallTop, X1 - X0, 4);
  // 窗戶與門
  for (let tx = b.x0; tx <= b.x1; tx++) {
    const isDoor = b.doors.some(d => d[0] === tx && d[1] === b.y1), sx = tx * T;
    if (isDoor) {
      c.fillStyle = '#8a8070'; c.beginPath(); c.roundRect(sx + 7, wallTop + 5, 34, Y1 - wallTop - 5, [16, 16, 0, 0]); c.fill();
      const gd = c.createLinearGradient(sx + 10, 0, sx + 38, 0); gd.addColorStop(0, '#7a4a24'); gd.addColorStop(1, '#4a2a12');
      c.fillStyle = gd; c.beginPath(); c.roundRect(sx + 10, wallTop + 8, 28, Y1 - wallTop - 8, [13, 13, 0, 0]); c.fill();
      c.strokeStyle = 'rgba(0,0,0,0.3)'; c.lineWidth = 1; for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(sx + 10 + k * 7, wallTop + 12); c.lineTo(sx + 10 + k * 7, Y1); c.stroke(); }
      c.fillStyle = '#ffd060'; c.beginPath(); c.arc(sx + 32, wallTop + 30, 2.2, 0, 7); c.fill();
      c.fillStyle = '#b0a898'; c.beginPath(); c.roundRect(sx + 8, Y1, 32, 6, 2); c.fill();
      c.save(); c.shadowColor = '#ffc040'; c.shadowBlur = 14; c.fillStyle = '#ffe080'; c.beginPath(); c.roundRect(sx + 41, wallTop + 12, 5, 8, 2); c.fill(); c.restore();
    } else {
      const wy = wallTop + 10, ww = 24, wh = 20, wx = sx + 12;
      c.fillStyle = '#5a3a20'; c.fillRect(wx - 3, wy - 3, ww + 6, wh + 6);
      const gg = c.createLinearGradient(wx, wy, wx + ww, wy + wh); gg.addColorStop(0, '#d8f0ff'); gg.addColorStop(0.5, '#7ab0e0'); gg.addColorStop(1, '#4a7ab0');
      c.fillStyle = gg; c.fillRect(wx, wy, ww, wh);
      c.fillStyle = 'rgba(255,255,255,0.5)'; c.beginPath(); c.moveTo(wx + 2, wy + wh - 2); c.lineTo(wx + 10, wy + 2); c.lineTo(wx + 14, wy + 2); c.lineTo(wx + 6, wy + wh - 2); c.fill();
      c.fillStyle = '#5a3a20'; c.fillRect(wx + ww / 2 - 1.5, wy, 3, wh); c.fillRect(wx, wy + wh / 2 - 1, ww, 2);
      c.fillStyle = '#7a4a24'; c.fillRect(wx - 4, wy + wh + 3, ww + 8, 5);
      for (let k = 0; k < 4; k++) { c.fillStyle = ['#ff6a8a', '#ffd040', '#ffffff', '#c080ff'][(tx + k) % 4]; c.beginPath(); c.arc(wx + 2 + k * 7, wy + wh + 2, 2.4, 0, 7); c.fill(); }
    }
  }
  // 屋頂
  const rTop = Y0 - 10, rBot = wallTop + 8, ov = 10;
  const gr = c.createLinearGradient(0, rTop, 0, rBot); gr.addColorStop(0, shade(b.roof, 0.3)); gr.addColorStop(1, shade(b.roof, -0.25));
  c.fillStyle = gr;
  c.beginPath(); c.moveTo(X0 - ov, rBot); c.lineTo(X0 + 8, rTop); c.lineTo(X1 - 8, rTop); c.lineTo(X1 + ov, rBot); c.closePath(); c.fill();
  c.save(); c.clip();
  for (let y = rTop + 6, row = 0; y < rBot; y += 9, row++) {
    c.fillStyle = 'rgba(0,0,0,0.16)'; c.fillRect(X0 - ov, y, X1 - X0 + ov * 2, 2);
    for (let x = X0 - ov + (row % 2) * 7; x < X1 + ov; x += 14) { c.fillStyle = 'rgba(255,255,255,0.08)'; c.beginPath(); c.arc(x + 7, y - 2, 6, 0, Math.PI); c.fill(); }
  }
  c.restore();
  c.fillStyle = shade(b.roof, -0.45); c.fillRect(X0 - ov, rBot - 5, X1 - X0 + ov * 2, 6);
  c.fillStyle = shade(b.roof, 0.5); c.fillRect(X0 + 8, rTop - 2, X1 - X0 - 16, 4);
  if (b.x1 - b.x0 >= 3 && b.y1 - b.y0 < 4) {
    const cx = X0 + T * 0.8;
    c.fillStyle = '#8a4a3a'; c.fillRect(cx, rTop - 14, 16, 24); c.fillStyle = '#5a2a20'; c.fillRect(cx - 2, rTop - 18, 20, 5);
  }
  if (b.y1 - b.y0 >= 4) { c.save(); c.shadowColor = '#ffe080'; c.shadowBlur = 16; G.star(c, (X0 + X1) / 2, rTop - 14, 5, 10, 4.5, -Math.PI / 2, '#ffd040', '#8a6010', 1); c.restore(); }
  // 招牌（房子名稱）
  if (b.label) {
    const d = b.doors[0], cx = d ? d[0] * T + T / 2 : (X0 + X1) / 2;
    const [bg, fg, icon] = signStyle(b.label), txt = icon + b.label;
    c.font = `bold 17px ${FONT}`;
    const tw = c.measureText(txt).width + 22, bx = Math.max(X0 - 6, Math.min(X1 + 6 - tw, cx - tw / 2)), by = wallTop - 30;
    c.strokeStyle = '#3a2a1a'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(bx + 8, by - 6); c.lineTo(bx + 8, by); c.moveTo(bx + tw - 8, by - 6); c.lineTo(bx + tw - 8, by); c.stroke();
    c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.roundRect(bx + 2, by + 3, tw, 26, 6); c.fill();
    const gs = c.createLinearGradient(0, by, 0, by + 26); gs.addColorStop(0, shade(bg, 0.25)); gs.addColorStop(1, shade(bg, -0.2));
    c.fillStyle = gs; c.beginPath(); c.roundRect(bx, by, tw, 26, 6); c.fill();
    c.strokeStyle = '#f0d890'; c.lineWidth = 1.5; c.stroke();
    c.fillStyle = fg; c.textBaseline = 'middle'; c.textAlign = 'center'; c.fillText(txt, bx + tw / 2, by + 14); c.textAlign = 'left'; c.textBaseline = 'alphabetic';
  }
}

// ---------- 地圖預先繪製 ----------
const MAPCACHE = {};
const GROUND = { lava: '#5a4a44', abyss: '#1c1230' };
function isT(map, x, y, set) { if (x < 0 || y < 0 || x >= map.w || y >= map.h) return false; return set.includes(map.rows[y][x]); }

function buildMapCache(id) {
  if (MAPCACHE[id]) return MAPCACHE[id];
  const map = MAPS[id], T = TILE, th = THEME[map.theme] || THEME.green;
  const cv = document.createElement('canvas'), CW = map.w * T, CH = map.h * T; cv.width = CW * SS; cv.height = CH * SS;
  const c = cv.getContext('2d'), R = srand(strHash(id));
  c.scale(SS, SS);
  // 只保留最近用過的幾張地圖，避免佔太多記憶體
  const keys = Object.keys(MAPCACHE); if (keys.length >= 6) delete MAPCACHE[keys[0]];
  const base = GROUND[map.theme] || th.g;
  // 地面
  c.fillStyle = base; c.fillRect(0, 0, CW, CH);
  for (let i = 0; i < map.w * map.h * 1.6; i++) {
    const x = R() * CW, y = R() * CH, r = 14 + R() * 40;
    const gg = c.createRadialGradient(x, y, 0, x, y, r); const col = R() > 0.5 ? '255,255,255' : '0,0,0';
    gg.addColorStop(0, `rgba(${col},0.07)`); gg.addColorStop(1, `rgba(${col},0)`);
    c.fillStyle = gg; c.fillRect(x - r, y - r, r * 2, r * 2);
  }
  for (let i = 0; i < map.w * map.h * 22; i++) { c.fillStyle = R() > 0.5 ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)'; c.fillRect(R() * CW, R() * CH, 1 + R() * 1.6, 1 + R() * 1.6); }
  // 主題地板
  if (map.theme === 'toy') { c.strokeStyle = 'rgba(90,50,20,0.25)'; c.lineWidth = 2; for (let y = 0; y < CH; y += 16) { c.beginPath(); c.moveTo(0, y); c.lineTo(CW, y); c.stroke(); for (let x = (y / 16 % 2) * 40; x < CW; x += 80) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 16); c.stroke(); } } }
  if (map.theme === 'temple') { c.strokeStyle = 'rgba(40,30,20,0.25)'; c.lineWidth = 1.5; for (let y = 0; y < CH; y += T) for (let x = 0; x < CW; x += T) c.strokeRect(x + 1, y + 1, T - 2, T - 2); }
  if (map.theme === 'abyss') { c.strokeStyle = 'rgba(170,90,255,0.18)'; c.lineWidth = 1.2; for (let i = 0; i < map.w * 2; i++) { let x = R() * CW, y = R() * CH; c.beginPath(); c.moveTo(x, y); for (let k = 0; k < 5; k++) { x += (R() - 0.5) * 40; y += (R() - 0.5) * 40; c.lineTo(x, y); } c.stroke(); } }
  if (map.theme === 'ice' || map.theme === 'sky') for (let i = 0; i < map.w * map.h * 3; i++) { c.fillStyle = 'rgba(255,255,255,0.7)'; c.fillRect(R() * CW, R() * CH, 1.5, 1.5); }
  // 草叢底色
  for (let y = 0; y < map.h; y++) for (let x = 0; x < map.w; x++) {
    const ch = map.rows[y][x];
    if (ch === ',' || ch === ';' || ch === 'x') { c.fillStyle = ch === ',' ? 'rgba(0,40,0,0.22)' : ch === ';' ? 'rgba(60,20,0,0.25)' : 'rgba(40,0,70,0.3)'; c.beginPath(); c.roundRect(x * T + 1, y * T + 1, T - 2, T - 2, 10); c.fill(); }
    if (ch === '.' && R() > 0.55 && !['abyss', 'toy', 'temple', 'sky'].includes(map.theme) && !th.noTufts) {
      for (let k = 0; k < 3; k++) { const gx = x * T + R() * 40 + 4, gy = y * T + R() * 36 + 10; c.strokeStyle = shade(base, -0.25); c.lineWidth = 1.4; c.beginPath(); c.moveTo(gx - 3, gy); c.lineTo(gx - 1, gy - 6); c.moveTo(gx, gy); c.lineTo(gx + 1, gy - 7); c.moveTo(gx + 3, gy); c.lineTo(gx + 4, gy - 5); c.stroke(); }
    }
  }
  // 小路（圓角連接）
  const PATH = ['=', 'D'];
  const pathCol = th.path;
  for (const pass of [0, 1]) for (let y = 0; y < map.h; y++) for (let x = 0; x < map.w; x++) {
    if (map.rows[y][x] !== '=') continue;
    const cx = x * T + T / 2, cy = y * T + T / 2, r = pass ? T * 0.5 : T * 0.56;
    c.fillStyle = pass ? pathCol : shade(pathCol, -0.22);
    c.beginPath(); c.arc(cx, cy, r, 0, 7); c.fill();
    if (isT(map, x + 1, y, PATH) || (map.rows[y][x + 1] === '=')) c.fillRect(cx, cy - r, T, r * 2);
    if (isT(map, x, y + 1, ['=']) ) c.fillRect(cx - r, cy, r * 2, T);
    if (isT(map, x, y - 1, ['D'])) c.fillRect(cx - r, cy - T, r * 2, T);
  }
  for (let y = 0; y < map.h; y++) for (let x = 0; x < map.w; x++) if (map.rows[y][x] === '=') for (let k = 0; k < 4; k++) { c.fillStyle = R() > 0.5 ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)'; c.beginPath(); c.arc(x * T + R() * T, y * T + R() * T, 1 + R() * 2, 0, 7); c.fill(); }
  // 靜態物件
  for (let y = 0; y < map.h; y++) for (let x = 0; x < map.w; x++) {
    const ch = map.rows[y][x], sx = x * T, sy = y * T;
    if (ch === 'f') for (let k = 0; k < 5; k++) {
      const fx = sx + 6 + R() * 36, fy = sy + 8 + R() * 32, col = ['#ff6a8a', '#ffd040', '#ffffff', '#b080ff', '#ff9a40'][Math.floor(R() * 5)];
      c.strokeStyle = '#3a7a2a'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(fx, fy); c.lineTo(fx, fy + 6); c.stroke();
      for (let p = 0; p < 5; p++) { c.fillStyle = col; c.beginPath(); c.arc(fx + Math.cos(p * 1.26) * 2.8, fy + Math.sin(p * 1.26) * 2.8, 2.3, 0, 7); c.fill(); }
      c.fillStyle = '#ffe060'; c.beginPath(); c.arc(fx, fy, 1.6, 0, 7); c.fill();
    }
    if (ch === 'S') {
      c.fillStyle = 'rgba(0,0,0,0.25)'; c.beginPath(); c.ellipse(sx + 24, sy + 43, 16, 4, 0, 0, 7); c.fill();
      c.fillStyle = '#5a3a20'; c.fillRect(sx + 12, sy + 24, 4, 20); c.fillRect(sx + 32, sy + 24, 4, 20);
      const gs = c.createLinearGradient(0, sy + 6, 0, sy + 30); gs.addColorStop(0, '#d8a868'); gs.addColorStop(1, '#9a6a38');
      c.fillStyle = gs; c.beginPath(); c.roundRect(sx + 5, sy + 6, 38, 24, 4); c.fill(); c.strokeStyle = '#4a2a10'; c.lineWidth = 2; c.stroke();
      c.strokeStyle = 'rgba(90,50,20,0.5)'; c.lineWidth = 1; for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(sx + 10, sy + 13 + k * 6); c.lineTo(sx + 38 - k * 6, sy + 13 + k * 6); c.stroke(); }
    }
    if (ch === '#') {
      if (map.theme === 'toy') {
        const col = ['#e85a5a', '#5a9ae8', '#f0c040', '#5ac06a'][Math.floor(R() * 4)];
        const gt = c.createLinearGradient(sx, sy, sx + T, sy + T); gt.addColorStop(0, shade(col, 0.3)); gt.addColorStop(1, shade(col, -0.25));
        c.fillStyle = gt; c.beginPath(); c.roundRect(sx + 1, sy + 1, T - 2, T - 2, 6); c.fill();
        c.strokeStyle = shade(col, -0.4); c.lineWidth = 2; c.stroke();
        c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.roundRect(sx + 5, sy + 4, T - 10, 6, 3); c.fill();
        c.font = 'bold 22px sans-serif'; c.fillStyle = 'rgba(255,255,255,0.75)'; c.textAlign = 'center'; c.fillText('ABCDEFG'[Math.floor(R() * 7)], sx + T / 2, sy + 33); c.textAlign = 'left';
      } else {
        const col = map.theme === 'temple' ? '#7a6e5e' : '#5a5260';
        c.fillStyle = shade(col, -0.35); c.fillRect(sx, sy, T, T);
        for (let r = 0; r < 3; r++) for (let k = -1; k < 3; k++) {
          const bx = sx + k * 20 + (r % 2) * 10, by = sy + r * 16;
          const gb = c.createLinearGradient(bx, by, bx, by + 14); gb.addColorStop(0, shade(col, 0.2)); gb.addColorStop(1, shade(col, -0.15));
          c.save(); c.beginPath(); c.rect(sx, sy, T, T); c.clip(); c.fillStyle = gb; c.fillRect(bx + 1, by + 1, 18, 14); c.restore();
        }
      }
    }
    if (ch === 'm') {
      c.fillStyle = 'rgba(0,0,0,0.25)'; c.beginPath(); c.ellipse(sx + 25, sy + 42, 22, 6, 0, 0, 7); c.fill();
      const gm = c.createLinearGradient(sx, sy, sx + T, sy + T); gm.addColorStop(0, '#9a9484'); gm.addColorStop(1, '#4a463c');
      c.fillStyle = gm; c.beginPath(); c.moveTo(sx + 2, sy + 42); c.lineTo(sx + 6, sy + 14); c.lineTo(sx + 20, sy + 3); c.lineTo(sx + 36, sy + 6); c.lineTo(sx + 46, sy + 22); c.lineTo(sx + 46, sy + 42); c.closePath(); c.fill();
      c.strokeStyle = '#2a2820'; c.lineWidth = 1.5; c.stroke();
      c.fillStyle = 'rgba(255,255,255,0.18)'; c.beginPath(); c.moveTo(sx + 8, sy + 16); c.lineTo(sx + 20, sy + 6); c.lineTo(sx + 26, sy + 20); c.closePath(); c.fill();
      c.strokeStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.moveTo(sx + 28, sy + 12); c.lineTo(sx + 24, sy + 26); c.lineTo(sx + 30, sy + 34); c.stroke();
      if (map.theme !== 'abyss') { c.fillStyle = 'rgba(90,150,60,0.55)'; c.beginPath(); c.ellipse(sx + 22, sy + 6, 10, 3, -0.3, 0, 7); c.fill(); }
    }
    if (ch === 'C') {
      c.fillStyle = '#100820'; c.fillRect(sx, sy, T, T);
      c.save(); c.shadowColor = '#b060ff'; c.shadowBlur = 12;
      for (const [ox, w, h] of [[6, 12, 34 + R() * 8], [20, 14, 40 + R() * 6], [34, 10, 24 + R() * 10]]) {
        const gc = c.createLinearGradient(sx + ox, sy, sx + ox + w, sy + T); gc.addColorStop(0, '#e0b0ff'); gc.addColorStop(0.4, '#8040d0'); gc.addColorStop(1, '#3a1070');
        c.fillStyle = gc; c.beginPath(); c.moveTo(sx + ox, sy + T); c.lineTo(sx + ox + w / 2, sy + T - h); c.lineTo(sx + ox + w, sy + T); c.closePath(); c.fill();
      }
      c.restore();
    }
    if (ch === 'b') {
      c.fillStyle = th.d2 || (map.theme === 'ice' ? '#a8d8f0' : '#2a5a9a'); c.fillRect(sx, sy, T, T);
      const horiz = isT(map, x, y - 1, ['~']) || isT(map, x, y + 1, ['~']);
      const gw = c.createLinearGradient(sx, sy, sx + T, sy + T); gw.addColorStop(0, '#b88a54'); gw.addColorStop(1, '#7a5228');
      c.fillStyle = gw; if (horiz) c.fillRect(sx, sy + 3, T, T - 6); else c.fillRect(sx + 3, sy, T - 6, T);
      c.strokeStyle = 'rgba(60,30,10,0.55)'; c.lineWidth = 1.5;
      for (let k = 1; k < 5; k++) { c.beginPath(); if (horiz) { c.moveTo(sx + k * 10, sy + 3); c.lineTo(sx + k * 10, sy + T - 3); } else { c.moveTo(sx + 3, sy + k * 10); c.lineTo(sx + T - 3, sy + k * 10); } c.stroke(); }
      c.fillStyle = '#5a3418';
      if (horiz) { if (isT(map, x, y - 1, ['~'])) c.fillRect(sx, sy, T, 4); if (isT(map, x, y + 1, ['~'])) c.fillRect(sx, sy + T - 4, T, 4); }
      else { if (isT(map, x - 1, y, ['~'])) c.fillRect(sx, sy, 4, T); if (isT(map, x + 1, y, ['~'])) c.fillRect(sx + T - 4, sy, 4, T); }
    }
  }
  // 樹（由上往下畫，讓樹冠自然重疊）
  for (let y = 0; y < map.h; y++) for (let x = 0; x < map.w; x++) if (map.rows[y][x] === 'T') drawTree(c, map, x * T, y * T, R);
  for (const b of computeBuildings(map)) drawBuilding(c, b, R);
  return (MAPCACHE[id] = cv);
}

function drawTree(c, map, sx, sy, R) {
  const th = THEME[map.theme] || THEME.green;
  c.fillStyle = 'rgba(0,0,0,0.28)'; c.beginPath(); c.ellipse(sx + 26, sy + 42, 20, 6, 0, 0, 7); c.fill();
  if (th.obst && OBST[th.obst]) { OBST[th.obst](c, sx, sy, th, R); return; }
  if (map.theme === 'ice') {
    c.fillStyle = '#5a3a22'; c.fillRect(sx + 21, sy + 32, 6, 12);
    for (let k = 0; k < 3; k++) {
      const yy = sy + 4 + k * 10, w = 12 + k * 6;
      c.fillStyle = '#2a5a48'; c.beginPath(); c.moveTo(sx + 24, yy - 4); c.lineTo(sx + 24 - w, yy + 16); c.lineTo(sx + 24 + w, yy + 16); c.closePath(); c.fill();
      c.fillStyle = '#f4faff'; c.beginPath(); c.moveTo(sx + 24, yy - 4); c.lineTo(sx + 24 - w * 0.55, yy + 7); c.quadraticCurveTo(sx + 24, yy + 11, sx + 24 + w * 0.55, yy + 7); c.closePath(); c.fill();
    }
    return;
  }
  const gt = c.createLinearGradient(sx + 19, 0, sx + 29, 0); gt.addColorStop(0, '#7a5030'); gt.addColorStop(1, '#4a2e18');
  c.fillStyle = gt; c.beginPath(); c.roundRect(sx + 19, sy + 24, 10, 20, 3); c.fill();
  const dark = th.tree2, light = th.tree;
  const blobs = [[24, 14, 19], [12, 22, 12], [36, 22, 12], [24, 26, 13]];
  for (const [bx, by, r] of blobs) { c.fillStyle = dark; c.beginPath(); c.arc(sx + bx, sy + by, r + 1.5, 0, 7); c.fill(); }
  for (const [bx, by, r] of blobs) {
    const g = c.createRadialGradient(sx + bx - r * 0.4, sy + by - r * 0.5, r * 0.1, sx + bx, sy + by, r);
    g.addColorStop(0, shade(light, 0.35)); g.addColorStop(0.7, light); g.addColorStop(1, shade(light, -0.25));
    c.fillStyle = g; c.beginPath(); c.arc(sx + bx, sy + by, r, 0, 7); c.fill();
  }
  for (let k = 0; k < 10; k++) { c.fillStyle = R() > 0.5 ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.15)'; c.beginPath(); c.arc(sx + 8 + R() * 32, sy + 2 + R() * 30, 1.5 + R() * 2, 0, 7); c.fill(); }
  if (map.theme === 'green' && R() > 0.7) for (let k = 0; k < 3; k++) { c.fillStyle = '#e83a3a'; c.beginPath(); c.arc(sx + 12 + R() * 24, sy + 8 + R() * 20, 2.2, 0, 7); c.fill(); }
}

// ---------- 每幀的動態圖塊 ----------
function drawAnimTile(map, ch, tx, ty, sx, sy, t, clipBottom) {
  const T = TILE, th = THEME[map.theme] || THEME.green;
  if (ch === '~') {
    if (th.liq) { drawLiquid(th, tx, ty, sx, sy, t); return; }
    if (map.theme === 'sky') {
      const g = ctx.createLinearGradient(0, sy, 0, sy + T); g.addColorStop(0, '#9ac8ff'); g.addColorStop(1, '#c8e0ff');
      ctx.fillStyle = g; ctx.fillRect(sx, sy, T, T);
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(sx + 8 + i * 16 + Math.sin(t * 0.7 + tx + i) * 4, sy + 26 + ((tx + ty + i) % 2) * 10, 13, 0, 7); ctx.fill(); }
      return;
    }
    if (map.theme === 'ice') {
      const g = ctx.createLinearGradient(sx, sy, sx + T, sy + T); g.addColorStop(0, '#d8f2ff'); g.addColorStop(1, '#8ac4e8');
      ctx.fillStyle = g; ctx.fillRect(sx, sy, T, T);
      ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(sx + 6 + (tx * 7) % 20, sy + 4); ctx.lineTo(sx + 20, sy + 24); ctx.lineTo(sx + 38, sy + 30 + (ty * 5) % 10); ctx.stroke();
      const shine = ((t * 40 + tx * 30 + ty * 20) % 300) - 50;
      if (shine > 0 && shine < T) { ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(sx + shine, sy, 6, T); }
      return;
    }
    const deep = map.theme === 'swamp' ? ['#3a8a8a', '#1e5a64'] : ['#4a9ae8', '#2a5ab0'];
    const g = ctx.createLinearGradient(0, sy, 0, sy + T); g.addColorStop(0, deep[0]); g.addColorStop(1, deep[1]);
    ctx.fillStyle = g; ctx.fillRect(sx, sy, T, T);
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 2;
    for (let i = 0; i < 2; i++) { const o = (t * 14 + i * 24 + tx * 11) % (T + 16) - 8; ctx.beginPath(); ctx.moveTo(sx + o - 8, sy + 14 + i * 20); ctx.quadraticCurveTo(sx + o, sy + 9 + i * 20, sx + o + 8, sy + 14 + i * 20); ctx.stroke(); }
    if (Math.sin(t * 3 + tx * 2.3 + ty) > 0.93) { ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fillRect(sx + (tx * 13) % 40, sy + (ty * 17) % 40, 3, 3); }
    // 岸邊浪花
    ctx.strokeStyle = 'rgba(255,255,255,0.65)'; ctx.lineWidth = 3;
    const land = (x, y) => !isT(map, x, y, ['~', 'b']) && x >= 0 && y >= 0 && x < map.w && y < map.h;
    const wob = Math.sin(t * 2 + tx + ty) * 1.5;
    if (land(tx, ty - 1)) { ctx.beginPath(); ctx.moveTo(sx, sy + 2 + wob); ctx.lineTo(sx + T, sy + 2 - wob); ctx.stroke(); }
    if (land(tx, ty + 1)) { ctx.beginPath(); ctx.moveTo(sx, sy + T - 2 + wob); ctx.lineTo(sx + T, sy + T - 2 - wob); ctx.stroke(); }
    if (land(tx - 1, ty)) { ctx.beginPath(); ctx.moveTo(sx + 2 + wob, sy); ctx.lineTo(sx + 2 - wob, sy + T); ctx.stroke(); }
    if (land(tx + 1, ty)) { ctx.beginPath(); ctx.moveTo(sx + T - 2 + wob, sy); ctx.lineTo(sx + T - 2 - wob, sy + T); ctx.stroke(); }
    return;
  }
  if (ch === ',' || ch === ';' || ch === 'x') {
    const pal = ch === ',' ? [th.gc || '#2f7a2a', th.gh || '#8ad86a'] : ch === ';' ? ['#6a4a2a', '#e08a3a'] : ['#4a1a7a', '#b070f0'];
    ctx.save();
    if (clipBottom) { ctx.beginPath(); ctx.rect(sx, sy + T * 0.55, T, T * 0.45); ctx.clip(); }
    for (let i = 0; i < 7; i++) {
      const bx = sx + 3 + i * 6.5 + ((tx * 7 + i * 3) % 5), by = sy + T - 2, hgt = 24 + ((tx + ty + i) % 3) * 7;
      const swy = Math.sin(t * 2.2 + tx * 0.9 + ty * 0.7 + i * 0.5) * 3;
      const g = ctx.createLinearGradient(0, by - hgt, 0, by); g.addColorStop(0, pal[1]); g.addColorStop(1, pal[0]);
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(bx - 4, by); ctx.quadraticCurveTo(bx + swy * 0.5, by - hgt * 0.5, bx + swy, by - hgt); ctx.quadraticCurveTo(bx + 1 + swy * 0.5, by - hgt * 0.5, bx + 4, by); ctx.fill();
    }
    ctx.restore();
    return;
  }
  if (ch === 'L') {
    const g = ctx.createRadialGradient(sx + 24, sy + 24, 4, sx + 24, sy + 24, 34); g.addColorStop(0, '#ffd040'); g.addColorStop(0.5, '#ff6a10'); g.addColorStop(1, '#a02008');
    ctx.fillStyle = g; ctx.fillRect(sx, sy, T, T);
    ctx.fillStyle = 'rgba(60,20,10,0.55)';
    for (let i = 0; i < 3; i++) { const ox = (tx * 17 + i * 13 + t * 4) % 40, oy = (ty * 11 + i * 17) % 40; ctx.beginPath(); ctx.ellipse(sx + ox + 4, sy + oy + 4, 7, 4, i, 0, 7); ctx.fill(); }
    const b = 0.5 + 0.5 * Math.sin(t * 3 + tx * 1.7 + ty);
    ctx.fillStyle = `rgba(255,240,150,${0.25 + b * 0.35})`; ctx.beginPath(); ctx.arc(sx + 24 + Math.sin(tx + t) * 8, sy + 22, 6 + b * 6, 0, 7); ctx.fill();
    return;
  }
  if (ch === 'G') {
    ctx.fillStyle = '#0a0410'; ctx.fillRect(sx, sy, T, T);
    const gl = 0.5 + 0.5 * Math.sin(t * 2 + ty);
    ctx.save(); ctx.shadowColor = '#b050ff'; ctx.shadowBlur = 16;
    ctx.strokeStyle = `rgba(190,100,255,${0.5 + gl * 0.5})`; ctx.lineWidth = 2; ctx.strokeRect(sx + 4, sy + 4, T - 8, T - 8);
    ctx.beginPath(); ctx.arc(sx + 24, sy + 24, 9, t, t + 5); ctx.stroke(); ctx.restore();
  }
}
const ANIM = new Set(['~', ',', ';', 'x', 'L', 'G']);

// ---------- 光影與天氣 ----------
const LIGHT = {
  night: ['10,20,60', 0.5], abyss: ['16,0,28', 0.65], storm: ['16,22,34', 0.42], temple: ['30,22,10', 0.32], lava: ['60,14,0', 0.32],
  swamp: ['0,30,30', 0.25], toy: ['40,20,30', 0.18], ice: ['200,230,255', 0.15], sky: ['255,250,230', 0.1], green: ['0,0,0', 0.2], warm: ['40,20,0', 0.18], mountain: ['0,0,0', 0.2],
};
const parts = [];
function weather(map, t, px, py) {
  const th0 = map.theme, th = (THEME[th0] && THEME[th0].wx) || th0, Wd = W, Hd = H;
  const spawn = { ice: 3, lava: 1, abyss: 1, sky: 1, green: 0.15, storm: 6, toy: 0.3, temple: 0.4 }[th] || 0;
  for (let i = 0; i < spawn; i++) if (Math.random() < (spawn < 1 ? spawn : 1)) {
    if (th === 'ice') parts.push({ x: Math.random() * Wd, y: -5, vx: -0.3 + Math.random() * 0.6, vy: 0.8 + Math.random(), s: 1.5 + Math.random() * 2, c: '#ffffff', life: 700 });
    else if (th === 'lava') parts.push({ x: Math.random() * Wd, y: Hd + 5, vx: (Math.random() - 0.5) * 0.4, vy: -0.8 - Math.random(), s: 1.5 + Math.random() * 1.5, c: '#ffa040', life: 600, glow: 1 });
    else if (th === 'storm') parts.push({ x: Math.random() * Wd, y: -10, vx: -2, vy: 12, s: 1, c: 'rgba(180,200,255,0.5)', life: 60, rain: 1 });
    else if (th === 'green') parts.push({ x: Wd + 5, y: Math.random() * Hd * 0.6, vx: -1 - Math.random(), vy: 0.4 + Math.random() * 0.4, s: 3, c: '#7ac850', life: 900, leaf: 1 });
    else parts.push({ x: Math.random() * Wd, y: Math.random() * Hd, vx: (Math.random() - 0.5) * 0.3, vy: -0.2 - Math.random() * 0.3, s: 1 + Math.random() * 2, c: th === 'abyss' ? '#c080ff' : th === 'toy' ? '#ffb0e0' : '#fff0a0', life: 240, glow: 1, fade: 1 });
  }
  for (let i = parts.length - 1; i >= 0; i--) {
    const q = parts[i]; q.x += q.vx; q.y += q.vy; q.life--;
    if (q.life <= 0 || q.y > Hd + 20 || q.y < -30 || q.x < -20) { parts.splice(i, 1); continue; }
    ctx.globalAlpha = q.fade ? Math.min(1, q.life / 60) : 1;
    if (q.rain) { ctx.strokeStyle = q.c; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(q.x - 2, q.y + 10); ctx.stroke(); }
    else if (q.leaf) { ctx.fillStyle = q.c; ctx.beginPath(); ctx.ellipse(q.x, q.y, 4, 2, q.x * 0.05, 0, 7); ctx.fill(); }
    else { if (q.glow) { ctx.shadowColor = q.c; ctx.shadowBlur = 8; } ctx.fillStyle = q.c; ctx.beginPath(); ctx.arc(q.x, q.y, q.s, 0, 7); ctx.fill(); ctx.shadowBlur = 0; }
  }
  ctx.globalAlpha = 1;
  if (parts.length > 400) parts.splice(0, parts.length - 400);
  // 光暈 / 暗角
  const L = LIGHT[th0] || LIGHT.green;
  const g = ctx.createRadialGradient(px, py, 90, px, py, Math.max(W, H) * 0.75);
  g.addColorStop(0, `rgba(${L[0]},0)`); g.addColorStop(1, `rgba(${L[0]},${L[1]})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  if (th === 'storm' && Math.random() < 0.004) P.flash = 1;
  if (P.flash) { ctx.fillStyle = `rgba(230,240,255,${P.flash * 0.6})`; ctx.fillRect(0, 0, W, H); P.flash = Math.max(0, P.flash - 0.05); if (P.flash === 0 && th === 'storm') sfxMove('雷'); }
}

// ---------- 世界圖層（覆蓋 main.js）----------
function worldLayer() {
  return {
    isWorld: true,
    update(dt) {
      const map = MAPS[S.map];
      if (P.moving) {
        const spd = (held.run ? 8 : 4.2) * (typeof mountSpeed === "function" ? mountSpeed() : 1) * dt;
        P.prog += spd;
        if (P.prog >= 1) { P.moving = false; P.prog = 0; P.frame++; arrive(); }
        return;
      }
      if (busy || topLayer() !== this) return;
      if (take('back')) { run(mainMenu); return; }
      if (take('hint')) { run(hintPage); return; }
      if (take('ok')) { run(interact); return; }
      for (const d of ['up', 'down', 'left', 'right']) {
        if (held[d]) {
          S.dir = d;
          const [dx, dy] = DIRS[d], nx = S.x + dx, ny = S.y + dy;
          if (tileAt(map, nx, ny) === 'D' && map.doors[nx + ',' + ny]) { sfx('door'); run(map.doors[nx + ',' + ny].run); held[d] = false; return; }
          if (!blocked(map, nx, ny) || isExit(map, nx, ny)) {
            S.prevX = S.x; S.prevY = S.y; S.x = nx; S.y = ny; P.moving = true; P.prog = 0; P.from = [S.prevX, S.prevY];
          } else if (performance.now() - (P.bumpT || 0) > 300) { P.bumpT = performance.now(); sfx('bump'); }
          break;
        }
      }
    },
    draw() {
      const map = MAPS[S.map], t = performance.now() / 1000;
      let px = S.x, py = S.y;
      if (P.moving) { px = P.from[0] + (S.x - P.from[0]) * P.prog; py = P.from[1] + (S.y - P.from[1]) * P.prog; }
      const Z = VOL.zoom || 1, VWZ = W / Z, VHZ = H / Z;
      let camX = px * TILE - VWZ / 2 + TILE / 2, camY = py * TILE - VHZ / 2 + TILE / 2;
      camX = Math.max(0, Math.min(map.w * TILE - VWZ, camX)); camY = Math.max(0, Math.min(map.h * TILE - VHZ, camY));
      if (map.w * TILE < VWZ) camX = (map.w * TILE - VWZ) / 2;
      if (map.h * TILE < VHZ) camY = (map.h * TILE - VHZ) / 2;
      if (shake) { camX += (Math.random() - 0.5) * 12 * shake; camY += (Math.random() - 0.5) * 12 * shake; }
      camX = Math.round(camX); camY = Math.round(camY);
      ctx.fillStyle = map.theme === 'abyss' ? '#06030c' : map.theme === 'sky' ? '#a8d0ff' : '#14200f'; ctx.fillRect(0, 0, W, H);
      P.cam = [camX, camY, Z];
      ctx.save(); ctx.scale(Z, Z);
      ctx.drawImage(buildMapCache(S.map), -camX, -camY, map.w * TILE, map.h * TILE);
      const x0 = Math.floor(camX / TILE), y0 = Math.floor(camY / TILE);
      for (let ty = y0; ty <= y0 + VH + 1; ty++) for (let tx = x0; tx <= x0 + VW + 1; tx++) {
        if (tx < 0 || ty < 0 || tx >= map.w || ty >= map.h) continue;
        const ch = map.rows[ty][tx];
        if (ANIM.has(ch)) drawAnimTile(map, ch, tx, ty, tx * TILE - camX, ty * TILE - camY, t);
      }
      const ents = activeNpcs(map).map(n => ({ n, x: n.px == null ? n.x : n.px, y: n.py == null ? n.y : n.py }));
      ents.push({ me: true, x: px, y: py });
      ents.sort((a, b) => a.y - b.y);
      for (const e of ents) {
        const sx = e.x * TILE - camX, sy = e.y * TILE - camY - 8;
        if (e.me) {
          drawPerson(ctx, sx, sy, S.dir, PLAYER_LOOK, P.moving ? Math.floor(P.prog * 2) + P.frame * 2 : 0);
          const ch = tileAt(map, Math.round(px), Math.round(py));
          if (ch === ',' || ch === ';' || ch === 'x') drawAnimTile(map, ch, Math.round(px), Math.round(py), sx, sy + 8, t, true);
        } else if (e.n.boss) drawMon(ctx, 8, sx + TILE / 2 + 20, sy - 30, 190, t);
        else if (e.n.legend) drawMon(ctx, e.n.legend, sx + TILE / 2, sy + 4, 110, t);
        else if (e.n.pickup) {
          const b = Math.sin(t * 3 + e.x) * 3;
          ctx.save(); ctx.shadowColor = '#ffe080'; ctx.shadowBlur = 18;
          ctx.fillStyle = '#fff4d0'; ctx.translate(sx + 24, sy + 26 + b); ctx.rotate(Math.sin(t) * 0.2);
          ctx.fillRect(-9, -11, 18, 22); ctx.strokeStyle = '#c8a050'; ctx.strokeRect(-9, -11, 18, 22);
          ctx.fillStyle = '#8a6a3a'; for (let k = 0; k < 4; k++) ctx.fillRect(-6, -7 + k * 5, 12 - (k % 2) * 4, 1.5);
          ctx.restore();
          G.sparkles(ctx, t, '#ffe080', 0);
        } else drawPerson(ctx, sx, sy, e.n.dir, e.n.look, 0);
        if (e.n && P.exclaim === e.n) { panel(sx + 10, sy - 40, 28, 34); text('！', sx + 24, sy - 36, { size: 24, align: 'center', color: '#ff5a3a', bold: true }); }
        if (e.n && !e.n.pickup && !busy) {
          const q = typeof npcHasQuestMark === 'function' && npcHasQuestMark(e.n);
          if (q) { const bob = Math.sin(t * 4) * 2; ctx.save(); ctx.shadowColor = q === 'ready' ? '#80ff80' : '#ffd040'; ctx.shadowBlur = 10; text(q === 'ready' ? '？' : '！', sx + 24, sy - 26 + bob, { size: 26, align: 'center', bold: true, color: q === 'ready' ? '#80ff80' : '#ffd040' }); ctx.restore(); }
        }
      }
      ctx.restore();
      weather(map, t, (px * TILE - camX + TILE / 2) * Z, (py * TILE - camY + TILE / 2) * Z);
      if (!S.hintsOff && !busy) {
        ctx.save(); ctx.font = '16px ' + FONT;
        const g = '目標：' + goal(), gw = Math.min(W - 280, ctx.measureText(g).width + 30);
        ctx.globalAlpha = 0.9; panel(W - gw - 12, 12, gw, 36, { bg: 'rgba(14,10,22,0.82)' }); ctx.restore();
        ctx.save(); ctx.beginPath(); ctx.rect(W - gw - 2, 12, gw - 20, 36); ctx.clip();
        text(g, W - gw + 3, 21, { size: 16, color: '#ffe8a0' }); ctx.restore();
        text(`$${S.money}　H：提示　X：選單`, W - 14, 52, { size: 13, align: 'right', color: 'rgba(255,232,160,0.75)' });
      }
      if (P.mapShown && performance.now() - P.mapShown < 2200) {
        const a = Math.min(1, (2200 - (performance.now() - P.mapShown)) / 400);
        ctx.save(); ctx.globalAlpha = a; panel(20, 20, 240, 50); text(map.name, 140, 32, { size: 24, align: 'center', serif: true, bold: true, color: '#ffd77a' }); ctx.restore();
      }
    },
  };
}

// ---------- 戰鬥背景 ----------
const BBG = {
  green:    { sky: ['#6ab0f0', '#d8f0ff'], hill: ['#5aa05a', '#3a7a3a'], ground: ['#8ac868', '#5a9a40'], plat: ['#a8dc80', '#4a8a30'], tuft: '#4a9a3a' },
  warm:     { sky: ['#f0a060', '#ffe0b0'], hill: ['#c88a50', '#8a5a30'], ground: ['#e0c088', '#b08a50'], plat: ['#f0d8a0', '#a07840'], tuft: '#8aa848' },
  swamp:    { sky: ['#4a7a7a', '#a8c8b8'], hill: ['#3a6a5a', '#244a40'], ground: ['#5a8a6a', '#3a6a4a'], plat: ['#7aa88a', '#3a5a40'], tuft: '#3a7a4a' },
  lava:     { sky: ['#3a0a08', '#c84a1a'], hill: ['#4a2018', '#2a1008'], ground: ['#6a4a3a', '#3a2a20'], plat: ['#8a6a5a', '#3a2418'], tuft: null },
  mountain: { sky: ['#7aa8d8', '#e8f0f8'], hill: ['#8a8a9a', '#5a5a6a'], ground: ['#a8b088', '#7a8060'], plat: ['#c8c8a8', '#6a6a50'], tuft: '#6a8a4a' },
  night:    { sky: ['#0a0a2a', '#3a3a7a'], hill: ['#1a2a4a', '#0e1830'], ground: ['#2a4a4a', '#1a2a30'], plat: ['#4a6a6a', '#1a2a2a'], tuft: '#2a5a4a' },
  abyss:    { sky: ['#05020a', '#3a1a5a'], hill: ['#2a0e40', '#14061f'], ground: ['#2a1640', '#140a20'], plat: ['#4a2a6a', '#1a0a2a'], tuft: '#6a3aa0' },
  ice:      { sky: ['#8ac0e8', '#f0f8ff'], hill: ['#e8f4ff', '#a8c8e0'], ground: ['#e8f4fc', '#b8d4e8'], plat: ['#ffffff', '#a0c0d8'], tuft: '#a8d0e8' },
  toy:      { sky: ['#8a5a8a', '#f0c0e0'], hill: ['#e85a5a', '#5a9ae8'], ground: ['#d8b07a', '#a8804a'], plat: ['#f0d0a0', '#a07040'], tuft: null },
  storm:    { sky: ['#1a1a2a', '#5a5a7a'], hill: ['#3a4a3a', '#1a2a1a'], ground: ['#4a5a48', '#2a3a28'], plat: ['#6a7a60', '#2a3a28'], tuft: '#3a5a3a' },
  temple:   { sky: ['#2a2018', '#8a7458'], hill: ['#5a4a38', '#3a2a1a'], ground: ['#8a7a60', '#5a4a38'], plat: ['#a89878', '#5a4a30'], tuft: '#5a7a3a' },
  sky:      { sky: ['#5a9ae8', '#fff4dc'], hill: ['#ffffff', '#e0ecff'], ground: ['#fff0d0', '#e8d0a0'], plat: ['#fff8e8', '#d8b878'], tuft: '#e8c060' },
};
function drawBattleBG(theme, t) {
  const P2 = BBG[theme] || BBG.green;
  const g = ctx.createLinearGradient(0, 0, 0, 260); g.addColorStop(0, P2.sky[0]); g.addColorStop(1, P2.sky[1]);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, 260);
  if (P2.kind) BGKIND[P2.kind](t, P2);
  if (P2.kind) { /* 三界背景已畫好 */ }
  else if (['night', 'abyss', 'storm', 'lava'].includes(theme)) { for (let i = 0; i < 40; i++) { ctx.globalAlpha = 0.3 + 0.5 * Math.abs(Math.sin(t + i)); ctx.fillStyle = '#fff'; ctx.fillRect((i * 97) % W, (i * 53) % 200, 2, 2); } ctx.globalAlpha = 1; }
  else { ctx.fillStyle = 'rgba(255,255,255,0.75)'; for (let i = 0; i < 4; i++) { const x = ((i * 230 + t * 8) % (W + 200)) - 100, y = 40 + (i % 2) * 50; ctx.beginPath(); ctx.ellipse(x, y, 60, 14, 0, 0, 7); ctx.ellipse(x + 30, y - 8, 36, 14, 0, 0, 7); ctx.fill(); } }
  for (let layer = 0; layer < 2; layer++) {
    ctx.fillStyle = P2.hill[layer]; ctx.beginPath(); ctx.moveTo(0, 260);
    for (let x = 0; x <= W; x += 16) ctx.lineTo(x, 200 + layer * 22 - Math.sin(x * 0.012 + layer * 2) * 30 - Math.sin(x * 0.031 + layer) * 12);
    ctx.lineTo(W, 260); ctx.closePath(); ctx.fill();
  }
  const gg = ctx.createLinearGradient(0, 240, 0, H); gg.addColorStop(0, P2.ground[0]); gg.addColorStop(1, P2.ground[1]);
  ctx.fillStyle = gg; ctx.fillRect(0, 240, W, H - 240);
  ctx.strokeStyle = 'rgba(0,0,0,0.06)'; ctx.lineWidth = 2;
  for (let i = -8; i <= 8; i++) { ctx.beginPath(); ctx.moveTo(W / 2 + i * 40, 240); ctx.lineTo(W / 2 + i * 160, H); ctx.stroke(); }
  for (const [cx, cy, rx, ry] of [[560, 270, 150, 34], [210, 410, 175, 40]]) {
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(cx + 6, cy + 10, rx, ry, 0, 0, 7); ctx.fill();
    ctx.fillStyle = P2.plat[1]; ctx.beginPath(); ctx.ellipse(cx, cy + 6, rx, ry, 0, 0, 7); ctx.fill();
    const gp = ctx.createRadialGradient(cx - rx * 0.2, cy - ry * 0.4, 6, cx, cy, rx); gp.addColorStop(0, shade(P2.plat[0], 0.2)); gp.addColorStop(1, P2.plat[0]);
    ctx.fillStyle = gp; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, 7); ctx.fill();
    if (P2.tuft) { ctx.fillStyle = P2.tuft; for (let k = 0; k < 18; k++) { const a = k / 18 * Math.PI * 2, tx = cx + Math.cos(a) * rx * 0.96, ty = cy + Math.sin(a) * ry * 0.96; ctx.beginPath(); ctx.moveTo(tx - 4, ty); ctx.lineTo(tx + Math.sin(t * 2 + k) * 2, ty - 10); ctx.lineTo(tx + 4, ty); ctx.fill(); } }
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
  }
}
