// ===== 主角性別、造型店、音量設定 =====

// ---------- 造型資料 ----------
const OUTFITS = [
  { id: 'start', n: '冒險紅衣', price: 0, shirt: '#d03a3a', pants: '#2a3a6a' },
  { id: 'white', n: '研究員白袍', price: 800, shirt: '#f4f4f0', pants: '#4a5a70', robe: '#e8e8e4' },
  { id: 'hunter', n: '森林獵裝', price: 1200, shirt: '#4a8a3a', pants: '#5a4028' },
  { id: 'sailor', n: '水手服', price: 1500, shirt: '#f0f4ff', pants: '#2a4a9a' },
  { id: 'suit', n: '靈契師正裝', price: 2000, shirt: '#2a2a3a', pants: '#1a1a26' },
  { id: 'sakura', n: '粉櫻洋裝', price: 2000, shirt: '#ffa0c0', pants: '#ff78a8', skirt: true },
  { id: 'ninja', n: '夜行忍者服', price: 3000, shirt: '#28283a', pants: '#14141e' },
  { id: 'miko', n: '古殿巫女服', price: 4000, shirt: '#f8f8f4', pants: '#d02a2a', skirt: true },
  { id: 'space', n: '星際太空衣', price: 8000, shirt: '#d8e0ee', pants: '#7a8aa8' },
  { id: 'angel', n: '天使白裙', price: 8000, shirt: '#fffbea', pants: '#f4e4b0', skirt: true },
  { id: 'dark', n: '煉獄黑甲', price: 12000, shirt: '#3a1a22', pants: '#1a0a10', robe: '#5a0a14' },
  { id: 'demon', n: '魔王斗篷', price: 15000, shirt: '#2a1038', pants: '#14081e', robe: '#4a1868' },
  { id: 'gold', n: '黃金戰甲', price: 20000, shirt: '#f0c040', pants: '#a87818' },
  { id: 'wukong', n: '齊天戰袍', price: 30000, shirt: '#e8b030', pants: '#b02020', robe: '#d02828' },
];
const HAIRSTYLES = [
  { id: 'short', n: '短髮' }, { id: 'spiky', n: '刺蝟頭' }, { id: 'long', n: '長髮' }, { id: 'pony', n: '馬尾' }, { id: 'twin', n: '雙馬尾' }, { id: 'bun', n: '丸子頭' },
];
const HAIRCOLORS = [
  ['黑色', '#201820'], ['深棕', '#3a2414'], ['栗色', '#6a3a1a'], ['金色', '#e8c050'], ['銀白', '#e0e4ec'], ['火紅', '#d03020'],
  ['粉紅', '#f090b8'], ['天藍', '#50a0f0'], ['翠綠', '#40b070'], ['紫色', '#8050c0'],
];
const HATS = [
  { id: 'none', n: '不戴帽子', price: 0 }, { id: 'red', n: '紅色鴨舌帽', price: 0, cap: '#e84a3a' }, { id: 'blue', n: '藍色鴨舌帽', price: 300, cap: '#3a70e0' },
  { id: 'black', n: '黑色鴨舌帽', price: 300, cap: '#2a2a34' }, { id: 'bow', n: '蝴蝶結', price: 500 }, { id: 'straw', n: '草帽', price: 800 },
  { id: 'cat', n: '貓耳', price: 1500 }, { id: 'witch', n: '巫師帽', price: 3000 }, { id: 'crown', n: '黃金王冠', price: 10000 },
];

function defaultLook(g) {
  return g === 'f' ? { hair: '#6a3a1a', style: 'long', hat: 'none', outfit: 'start' } : { hair: '#3a2414', style: 'short', hat: 'red', outfit: 'start' };
}
// 把造型設定轉成可以畫的樣子
function lookOf(gender, L) {
  const o = OUTFITS.find(q => q.id === L.outfit) || OUTFITS[0], h = HATS.find(q => q.id === L.hat) || HATS[0];
  return {
    hair: L.hair, shirt: o.shirt, pants: o.pants, robe: o.robe, hat: h.cap, skin: '#f6d2ae',
    style: L.style, extra: h.id, female: gender === 'f', skirt: !!o.skirt || (gender === 'f' && !o.robe), skirtCol: o.pants, styled: true,
  };
}
function applyLook() {
  if (!S) return;
  if (!S.look) S.look = defaultLook(S.gender || 'm');
  S.wardrobe = S.wardrobe || { start: true, none: true, red: true };
  for (const k of ['hat', 'robe']) delete PLAYER_LOOK[k];
  Object.assign(PLAYER_LOOK, lookOf(S.gender, S.look));
}

// ---------- 主角繪製：在原本的人物上加髮型、裙子、帽飾 ----------
const drawPersonPlain = drawPerson;
drawPerson = function (c, x, y, dir, look, frame, scale) {
  if (!look.styled) return drawPersonPlain(c, x, y, dir, look, frame, scale);
  const s = scale || TILE / 32, ol = 'rgba(30,18,12,0.85)', hair = look.hair, sw = Math.sin(performance.now() / 260) * 0.5;
  const unit = fn => { c.save(); c.translate(x, y); c.scale(s, s); c.lineWidth = 0.8; c.strokeStyle = ol; fn(); c.restore(); };
  const hairFill = () => { const g = c.createLinearGradient(6, 2, 26, 26); g.addColorStop(0, shade(hair, 0.28)); g.addColorStop(1, shade(hair, -0.28)); return g; };
  const longBack = () => { c.fillStyle = hairFill(); c.beginPath(); c.moveTo(7.5, 8); c.quadraticCurveTo(5.4, 18, 7 + sw, 25); c.quadraticCurveTo(16, 28.5, 25 + sw, 25); c.quadraticCurveTo(26.6, 18, 24.5, 8); c.closePath(); c.fill(); c.stroke(); };
  const tail = (x0, y0, x1, y1) => { c.fillStyle = hairFill(); c.beginPath(); c.moveTo(x0 - 2, y0); c.quadraticCurveTo(x1 - 4, (y0 + y1) / 2, x1 + sw, y1); c.quadraticCurveTo(x1 + 4, (y0 + y1) / 2, x0 + 2, y0); c.closePath(); c.fill(); c.stroke(); };
  // 身體後面的頭髮
  if (dir !== 'up') unit(() => {
    if (look.style === 'long') longBack();
    if (look.style === 'pony') { if (dir === 'down') tail(16, 3, 16, 20); else tail(dir === 'left' ? 23 : 9, 8, dir === 'left' ? 27 : 5, 22); }
    if (look.style === 'twin') { tail(8, 8, 3.5, 22); tail(24, 8, 28.5, 22); }
  });
  drawPersonPlain(c, x, y, dir, look.skirt ? Object.assign({}, look, { pants: look.skin }) : look, frame, scale);
  unit(() => {
    // 裙子
    if (look.skirt) {
      const g = c.createLinearGradient(7, 0, 25, 0); g.addColorStop(0, shade(look.skirtCol, 0.25)); g.addColorStop(1, shade(look.skirtCol, -0.25));
      c.fillStyle = g; c.beginPath(); c.moveTo(9.4, 19); c.lineTo(22.6, 19); c.quadraticCurveTo(25, 23, 25.6, 26.4); for (let i = 3; i >= 0; i--) c.quadraticCurveTo(7 + i * 4.6 + 2.3, 28, 6.4 + i * 4.8, 26.4); c.quadraticCurveTo(7, 23, 9.4, 19); c.closePath(); c.fill(); c.stroke();
    }
    // 女生：睫毛與嘴唇
    if (look.female && dir !== 'up') {
      c.strokeStyle = '#1a1010'; c.lineWidth = 0.55;
      for (const ex of dir === 'down' ? [12.6, 19.4] : dir === 'left' ? [11.4] : [20.6]) { c.beginPath(); c.moveTo(ex - 1.9, 9.7); c.quadraticCurveTo(ex, 8.3, ex + 1.9, 9.7); c.stroke(); }
      if (dir === 'down') { c.fillStyle = '#e8506c'; c.beginPath(); c.ellipse(16, 14, 1.1, 0.6, 0, 0, 7); c.fill(); }
    }
    c.strokeStyle = ol; c.lineWidth = 0.8;
    // 前面的頭髮
    if (dir === 'up') {
      if (look.style === 'long') { c.fillStyle = hairFill(); c.beginPath(); c.moveTo(8.4, 9); c.quadraticCurveTo(8, 15, 9.6 + sw, 20.4); c.quadraticCurveTo(12, 19.2, 13.2, 21); c.quadraticCurveTo(16, 19.6, 18.8, 21); c.quadraticCurveTo(20, 19.2, 22.4 + sw, 20.4); c.quadraticCurveTo(24, 15, 23.6, 9); c.closePath(); c.fill(); c.stroke(); c.strokeStyle = 'rgba(255,255,255,0.22)'; c.lineWidth = 0.6; for (const lx of [12, 16, 20]) { c.beginPath(); c.moveTo(lx, 5); c.quadraticCurveTo(lx + 0.8, 12, lx, 18.6); c.stroke(); } c.strokeStyle = ol; c.lineWidth = 0.8; }
      if (look.style === 'pony') tail(16, 6, 16, 22);
      if (look.style === 'twin') { tail(8, 8, 4, 22); tail(24, 8, 28, 22); }
    }
    if (look.style === 'spiky') { c.fillStyle = hairFill(); c.beginPath(); c.moveTo(7, 7); for (let i = 0; i < 6; i++) { c.lineTo(8 + i * 3.4, 0.5 - (i % 2) * 2 + (i === 0 || i === 5 ? 2.6 : 0)); c.lineTo(9.8 + i * 3.4, 5); } c.lineTo(25, 7); c.closePath(); c.fill(); c.stroke(); }
    if (look.style === 'bun') { c.fillStyle = hairFill(); c.beginPath(); c.arc(16, 0.4, 3.8, 0, 7); c.fill(); c.stroke(); }
    if (look.style === 'long' && dir === 'down') { c.fillStyle = hairFill(); for (const d of [8.2, 23.8]) { c.beginPath(); c.moveTo(d - 1.6, 8); c.quadraticCurveTo(d + (d < 16 ? -1.4 : 1.4), 14, d, 19); c.quadraticCurveTo(d + (d < 16 ? 2.4 : -2.4), 13, d + 1.6, 8); c.closePath(); c.fill(); } }
    // 帽飾
    const ex = look.extra;
    if (ex === 'bow') { c.fillStyle = '#ff5a8a'; const bx = dir === 'right' ? 12 : 21, by = 2.5; c.beginPath(); c.moveTo(bx, by); c.lineTo(bx - 4.4, by - 2.6); c.lineTo(bx - 4.4, by + 2.6); c.closePath(); c.moveTo(bx, by); c.lineTo(bx + 4.4, by - 2.6); c.lineTo(bx + 4.4, by + 2.6); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#ffb0c8'; c.beginPath(); c.arc(bx, by, 1.2, 0, 7); c.fill(); }
    if (ex === 'straw') { c.fillStyle = '#e8c870'; c.beginPath(); c.ellipse(16, 4.6, 13, 3, 0, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.arc(16, 4.2, 7.6, Math.PI, 0); c.fill(); c.stroke(); c.fillStyle = '#d04030'; c.fillRect(8.4, 2.4, 15.2, 1.9); }
    if (ex === 'cat') { c.fillStyle = hair; for (const d of [-1, 1]) { c.beginPath(); c.moveTo(16 + d * 3, 2.6); c.lineTo(16 + d * 8.2, -4.4); c.lineTo(16 + d * 8.2, 4.4); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#ffb0c0'; c.beginPath(); c.moveTo(16 + d * 5, 2.2); c.lineTo(16 + d * 7.6, -1.8); c.lineTo(16 + d * 7.6, 2.6); c.closePath(); c.fill(); c.fillStyle = hair; } }
    if (ex === 'witch') { c.fillStyle = '#3a2058'; c.beginPath(); c.ellipse(16, 4.6, 12, 2.6, 0, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.moveTo(9, 4); c.quadraticCurveTo(14, -3, 21, -9); c.quadraticCurveTo(22, -1, 23, 4); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#f0c040'; c.fillRect(9.4, 2.4, 13.4, 1.5); }
    if (ex === 'crown') { c.save(); c.shadowColor = '#ffd040'; c.shadowBlur = 6; c.fillStyle = '#f4cc58'; c.beginPath(); c.moveTo(9.6, 3.6); c.lineTo(9, -2.4); c.lineTo(12.6, 0.6); c.lineTo(16, -3.6); c.lineTo(19.4, 0.6); c.lineTo(23, -2.4); c.lineTo(22.4, 3.6); c.closePath(); c.fill(); c.restore(); c.stroke(); c.fillStyle = '#e83050'; c.beginPath(); c.arc(16, 1.6, 1.2, 0, 7); c.fill(); }
  });
};

// ---------- 開局選性別 ----------
function previewLayer(draw) { return pushLayer({ ui: true, update() {}, draw }); }
async function chooseGender(oldSave) {
  let sel = 0;
  const m = lookOf('m', defaultLook('m')), f = lookOf('f', defaultLook('f'));
  const L = previewLayer(() => {
    ctx.fillStyle = 'rgba(8,5,14,0.93)'; ctx.fillRect(0, 0, W, H);
    text(oldSave ? '請選擇你的主角' : '你的主角是？', W / 2, 40, { size: 34, serif: true, bold: true, align: 'center', color: '#ffd77a' });
    [[m, W / 2 - 280], [f, W / 2 + 40]].forEach(([k, x], i) => {
      ctx.save(); if (sel === i) { ctx.shadowColor = '#ffd040'; ctx.shadowBlur = 26; } panel(x, 100, 240, 300, { border: sel === i ? '#ffd77a' : '#5a4a3a' }); ctx.restore();
      drawPerson(ctx, x + 24, 120, 'down', k, 0, 6);
      text(i ? '女生' : '男生', x + 120, 348, { size: 24, bold: true, align: 'center', color: sel === i ? '#ffd77a' : '#c8bca0' });
    });
  });
  const c = await choose(['男生', '女生'], { w: 260, x: W / 2 - 130, y: 420, cancel: false, onMove: i => sel = i });
  popLayer(L);
  S.gender = c === 1 ? 'f' : 'm';
  S.look = defaultLook(S.gender);
  applyLook();
}

// ---------- 造型店 ----------
function owned(id) { return !!S.wardrobe[id]; }
async function pickStyle(title, list, cur, rowInfo, apply) {
  const items = list.map(q => (x, y, sel) => {
    text(q.n, x, y + 6, { size: 20, color: sel ? '#ffd77a' : '#f4ead0' });
    text(rowInfo(q), x + 318, y + 8, { size: 16, align: 'right', color: '#c8bca0' });
  });
  return choose(items, { title, w: 410, x: W - 430, y: 20, rowH: 38, maxRows: 10, start: Math.max(0, list.findIndex(cur)), onMove: i => apply(list[i]) });
}
async function buyIfNeeded(id, name, price) {
  if (!price || owned(id)) return true;
  const c = await choose([`購買（$${price}）`, '算了'], { title: `要買「${name}」嗎？`, w: 320, x: W - 340, y: 200 });
  if (c !== 0) return false;
  if (S.money < price) { await say('錢不夠喔，多接幾個任務再來吧！', { name: '造型師 美美' }); return false; }
  S.money -= price; S.wardrobe[id] = true; jingle('item');
  return true;
}
async function outfitShop() {
  await say(flag('metStylist') ? '歡迎回來！今天想換什麼造型？' : ['歡迎光臨美美造型店！', '衣服、髮型、髮色、帽子都能換喔，換好的造型會馬上生效。'], { name: '造型師 美美' });
  setFlag('metStylist');
  let draft = Object.assign({}, S.look), gender = S.gender || 'm';
  const L = previewLayer(() => {
    const t = performance.now(), dir = ['down', 'down', 'left', 'down', 'down', 'right', 'down', 'up'][Math.floor(t / 900) % 8];
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#3a2438'); g.addColorStop(1, '#1a1020'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 26; i++) { ctx.globalAlpha = 0.2 + 0.4 * Math.abs(Math.sin(t / 900 + i)); G.star(ctx, (i * 131) % W, (i * 89) % H, 4, 5, 1.4, 0, '#ffd77a'); } ctx.globalAlpha = 1;
    text('美美造型店', 34, 22, { size: 30, serif: true, bold: true, color: '#ffd77a' });
    text(`持有金錢：$${S.money}`, 34, 62, { size: 18, color: '#e8dcc0' });
    panel(30, 100, 280, 400);
        drawPerson(ctx, 170 - 112, 160, dir, lookOf(gender, draft), Math.floor(t / 300), 7);
  });
  const back = () => { draft = Object.assign({}, S.look); gender = S.gender || 'm'; };
  while (true) {
    const c = await choose(['服裝', '髮型', '髮色', '帽子與頭飾', '性別', '離開'], { title: '要換什麼？', w: 300, x: W - 330, y: 100, rowH: 44 });
    if (c < 0 || c === 5) break;
    if (c === 0) {
      const i = await pickStyle('服裝', OUTFITS, q => q.id === S.look.outfit, q => q.id === S.look.outfit ? '穿著中' : !q.price || owned(q.id) ? '已擁有' : `$${q.price}`, q => draft.outfit = q.id);
      if (i >= 0 && await buyIfNeeded(OUTFITS[i].id, OUTFITS[i].n, OUTFITS[i].price)) S.look.outfit = OUTFITS[i].id;
    } else if (c === 1) {
      const i = await pickStyle('髮型（免費）', HAIRSTYLES, q => q.id === S.look.style, q => q.id === S.look.style ? '使用中' : '', q => draft.style = q.id);
      if (i >= 0) S.look.style = HAIRSTYLES[i].id;
    } else if (c === 2) {
      const list = HAIRCOLORS.map(([n, col]) => ({ n, col }));
      const i = await pickStyle('髮色（免費）', list, q => q.col === S.look.hair, q => q.col === S.look.hair ? '使用中' : '', q => draft.hair = q.col);
      if (i >= 0) S.look.hair = list[i].col;
    } else if (c === 3) {
      const i = await pickStyle('帽子與頭飾', HATS, q => q.id === S.look.hat, q => q.id === S.look.hat ? '配戴中' : !q.price || owned(q.id) ? '已擁有' : `$${q.price}`, q => draft.hat = q.id);
      if (i >= 0 && await buyIfNeeded(HATS[i].id, HATS[i].n, HATS[i].price)) S.look.hat = HATS[i].id;
    } else if (c === 4) {
      const i = await choose(['男生', '女生'], { title: '主角性別', w: 240, x: W - 300, y: 160, start: S.gender === 'f' ? 1 : 0, onMove: k => gender = k ? 'f' : 'm' });
      if (i >= 0) S.gender = i ? 'f' : 'm';
    }
    back(); applyLook();
  }
  popLayer(L);
  applyLook(); saveGame(true);
  await say('很好看喔！下次再來！', { name: '造型師 美美' });
}

// 符燈鎮的民宅改成造型店；晨曦村也有造型師
Object.assign(MAPS.town2.doors['3,4'], { roof: '#e070a8', label: '美美造型店', run: () => outfitShop() });
MAPS.village.npcs.push({ id: 'stylist', x: 7, y: 8, dir: 'down', look: { hair: '#f090b8', shirt: '#ffb0d0', pants: '#a04878' }, name: '造型師 美美', talk: () => outfitShop(), _home: [7, 8] });

async function centerDoor(withShop) {
  const opts = ['治療夥伴', '靈匣（存取幻靈）', '任務板（賺錢）', '造型店'].concat(withShop ? ['購物'] : []).concat(['離開']);
  const c = await choose(opts, { title: '祈光亭', w: 300, x: W / 2 - 150, y: 110 });
  const pick = opts[c];
  if (pick === '治療夥伴') {
    healParty(); jingle('heal');
    S.respawn = { map: S.map, x: S.x, y: S.y };
    await say(['歡迎來到祈光亭。', '你的夥伴們沐浴在溫暖的光芒中……', '已經完全恢復了！祝你旅途平安。'], { name: '祈光使' });
    saveGame(true);
  } else if (pick === '靈匣（存取幻靈）') await boxMenu();
  else if (pick === '任務板（賺錢）') await bountyBoard();
  else if (pick === '造型店') await outfitShop();
  else if (pick === '購物') await shop();
}

// ---------- 音量設定 ----------
let soundOpen = false;
function soundPanel() {
  if (soundOpen) return Promise.resolve();
  soundOpen = true;
  return new Promise(res => {
    let row = 0, lastTest = 0;
    const rows = [['背景音樂', 'music'], ['戰鬥音效', 'sfx']];
    const L = pushLayer({
      ui: true,
      update() {
        if (take('up') || take('down')) { row = 1 - row; sfx('cursor'); }
        const d = (take('right') ? 1 : 0) - (take('left') ? 1 : 0);
        if (d) { const k = rows[row][1]; VOL[k] = Math.max(0, Math.min(10, VOL[k] + d)); applyVol(); if (k === 'sfx') sfxMove('雷'); else sfx('cursor'); }
        if (take('ok') || take('back')) { popLayer(L); soundOpen = false; res(); }
      },
      draw() {
        const x = W / 2 - 240, y = 150;
        ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0, 0, W, H);
        panel(x, y, 480, 250);
        text('聲音設定', W / 2, y + 18, { size: 26, serif: true, bold: true, align: 'center', color: '#ffd77a' });
        rows.forEach(([n, k], i) => {
          const yy = y + 76 + i * 66, sel = row === i;
          text((sel ? '▶ ' : '　') + n, x + 28, yy, { size: 21, color: sel ? '#ffd77a' : '#f4ead0' });
          for (let b = 0; b < 10; b++) { ctx.fillStyle = b < VOL[k] ? (sel ? '#ffd77a' : '#b8a070') : '#3a3040'; ctx.beginPath(); ctx.roundRect(x + 176 + b * 22, yy + 14 - b * 1.4, 17, 12 + b * 1.4, 2); ctx.fill(); }
          text(VOL[k] ? String(VOL[k]) : '靜音', x + 450, yy + 3, { size: 18, align: 'right', color: '#e8dcc0' });
        });
        text('↑ ↓ 選擇　← → 調整　Z 完成　（M 鍵隨時可開）', W / 2, y + 212, { size: 15, align: 'center', color: '#c8bca0' });
      },
    });
  });
}
window.addEventListener('keydown', e => { if (e.key === 'm' || e.key === 'M') soundPanel(); });

// ---------- 主選單 ----------
async function mainMenu() {
  while (true) {
    const items = ['夥伴', '背包', '圖鑑', '世界地圖（傳送）', '任務', '提示', '存檔', '聲音設定', S.hintsOff ? '提示框：關' : '提示框：開', '關閉'];
    const c = await choose(items, { title: `${S.name}　$${S.money}　印記 ${S.badges || 0}/6`, w: 320, x: W - 340, y: 14, rowH: 40 });
    if (c === 0) { if (!S.party.length) { await say('你還沒有夥伴！'); continue; } await partyMenu('view'); }
    else if (c === 1) await bagMenu('field');
    else if (c === 2) await dexMenu();
    else if (c === 3) { if (!flag('gotStarter')) { await say('先去研究所領取夥伴吧！'); continue; } if (await worldMap()) return; }
    else if (c === 4) await questMenu();
    else if (c === 5) { await hintPage(); return; }
    else if (c === 6) { saveGame(); await wait(300); }
    else if (c === 7) await soundPanel();
    else if (c === 8) S.hintsOff = !S.hintsOff;
    else return;
  }
}

// ---------- 舊存檔銜接 ----------
TIPS.push('按 M 可以隨時調整背景音樂和音效的大小聲。', '符燈鎮的美美造型店和每間祈光亭都能更換主角造型。');
const worldLayerV5 = worldLayer;
worldLayer = function () {
  applyLook();
  if (!S.v6) { // 舊的音樂、音效開關轉成音量
    S.v6 = 1;
    if (S.musicOff) { VOL.music = 0; S.musicOff = false; }
    if (S.mute) { VOL.sfx = 0; S.mute = false; }
    applyVol();
  }
  return worldLayerV5();
};
