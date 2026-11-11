// ===== 第十二波：神獸 ×10、道館依挑戰者最強夥伴強化（反彈／定身）、幻靈融合、龍坐騎 =====

// ---------- 神獸 ×10：舊存檔換算一次 ----------
function migrateV9() {
  S.v9 = 1;
  for (const m of S.party.concat(S.box)) { const r = m.maxHp ? m.hp / m.maxHp : 1; calcStats(m); m.hp = m.hp <= 0 ? 0 : Math.max(1, Math.round(m.maxHp * r)); }
}

// ---------- 道館：以挑戰者最強的夥伴為基準 ----------
const GYM_HP_X = 1.5, GYM_ATK_X = 1, GYM_REFLECT = 0, GYM_STUN = 0; // 使用者要求：取消反彈與定身
const isGymTrainer = tr => !!(tr && /試煉者/.test(tr.name || ''));
function strongestMon() {
  let best = null, bs = -1;
  for (const m of S.party.concat(S.box)) { const s = m.maxHp + m.atk + m.def + m.spd; if (s > bs) { bs = s; best = m; } }
  return best;
}
const runBattleGym = runBattle;
runBattle = function (cfg) {
  if (cfg.trainer && isGymTrainer(cfg.trainer)) {
    const top = strongestMon();
    if (top) for (const m of cfg.foeTeam) {
      // 外層還有 FOE_POWER ×1.15，這裡先除掉，最後剛好是 GYM_HP_X 倍血量、GYM_ATK_X 倍攻擊
      // 依等級降低：道館等級比你最強的夥伴低越多，強化幅度就越小（比例平方）
      const r = Math.max(0, Math.min(1, m.level / Math.max(1, top.level))), k = r * r;
      m.maxHp = m.hp = Math.max(Math.round(m.maxHp * 1.3), Math.round(top.maxHp * GYM_HP_X * k / FOE_POWER));
      m.atk = Math.max(Math.round(m.atk * 1.1), Math.round(top.atk * GYM_ATK_X * k / FOE_POWER));
      m.spd = Math.max(m.spd, Math.round(top.spd * r / FOE_POWER));
    }
    cfg.gymAb = true;
  }
  return runBattleGym(cfg);
};
const doMoveGym = doMove;
doMove = async function (side, mv) {
  if (!B || !B.gymAb) return doMoveGym(side, mv);
  if (side === 'p' && B.stunP > 0) {
    B.stunP--;
    burst(POS.p.x, POS.p.y, '#ffe080', 16, 3);
    await msg(`${monName(B.me())} 被定身術定住了，一動也不能動！`);
    return;
  }
  const foe = B.foe(), me = B.me(), fh = foe.hp, mh = me.hp;
  await doMoveGym(side, mv);
  if (side === 'p') {
    const dmg = fh - foe.hp;
    if (dmg > 0 && me.hp > 0 && Math.random() < GYM_REFLECT) {
      ringFx(POS.f.x, POS.f.y, 20, 120, '#a0e0ff', 400, 6);
      await msg(`${monName(foe)} 的護體罡氣反彈了傷害！`);
      await hurt('p', Math.max(1, Math.floor(dmg * 0.5)));
    }
  } else if (mh - me.hp > 0 && me.hp > 0 && !B.stunP && Math.random() < GYM_STUN) {
    B.stunP = 1;
    ringFx(POS.p.x, POS.p.y, 10, 90, '#ffe080', 400, 5);
    await msg(`${monName(foe)} 施展了定身術！${monName(me)} 下回合無法行動！`);
  }
};

// 道館幻靈三階段變身：倒下後變成完全不同的模樣，血量回滿、更強
const PHASE_NAME = ['', '第一階段', '第二階段', '最終階段'];
function phaseForm(f, ph) {
  const types = MONS[f.id0].t, seed = (f.id0 * 31 + ph * 977 + (B.trainer ? strHash(B.trainer.name) : 0)) >>> 0;
  const ok = id => { const M = MONS[id]; return M && M.art && (id < 1104 || id >= 1300) && id !== f.id && id !== f.id0 && id !== WUKONG && id !== ZINING && !M.xy && M.t.some(t => types.includes(t)); };
  let pool = Object.keys(MONS).map(Number).filter(id => ok(id) && (ph === 2 ? !MONS[id].big && MONS[id].art.s >= 3 : MONS[id].big));
  if (!pool.length) pool = Object.keys(MONS).map(Number).filter(id => MONS[id].art && (ph === 3 ? MONS[id].big : MONS[id].art.s >= 3) && id !== WUKONG && id !== ZINING);
  return pool[seed % pool.length];
}
async function gymTransform(f) {
  const ph = (f.phase || 1) + 1, old = monName(f);
  if (!f.id0) { f.id0 = f.id; f.base0 = { maxHp: f.maxHp, atk: f.atk, def: f.def, spd: f.spd }; }
  const nid = phaseForm(f, ph), k = ph === 2 ? 1.25 : 1.6;
  sfx('super'); shakeFx(500, 14);
  await tween(450, p => { B.fFlash = p; B.fShake = p; });
  f.phase = ph; f.id = nid; f.nick = null; f.status = null;
  f.maxHp = f.hp = Math.round(f.base0.maxHp * k); f.atk = Math.round(f.base0.atk * k); f.def = Math.round(f.base0.def * k); f.spd = Math.round(f.base0.spd * Math.min(k, 1.3));
  f.dispHp = 0; f.moves = makeMon(nid, f.level).moves;
  B.st.f = { atk: 0, def: 0, spd: 0 }; B.conf.f = 0; B.fSink = 0; B.fAlpha = 1;
  seeMon(nid);
  flashFx(ph === 3 ? '#ffe080' : '#ffffff', 0.95, 380); ringFx(POS.f.x, POS.f.y, 20, 260, ph === 3 ? '#ffd040' : '#c080ff', 600, 12);
  await tween(600, p => { B.fFlash = 1 - p; B.fShake = 0; f.dispHp = f.hp * p; });
  f.dispHp = f.hp; B.fFlash = 0;
  await msg(`${old} 沒有倒下……進入${PHASE_NAME[ph]}變身！`);
  await msg(`變成了「${monName(f)}」！體力全滿，力量更強了！`);
}
const checkFaintsGym = checkFaints;
checkFaints = async function () {
  if (B && B.gymAb) { const f = B.foe(); if (f.hp <= 0 && f === B.foeTeam[B.foeTeam.length - 1] && (f.phase || 1) < 3) await gymTransform(f); }
  return checkFaintsGym();
};

// ---------- 融合材料 ----------
ITEMS.fuseCore = { n: '融合晶石', price: 5000, d: '幻靈融合用的材料。按 X 打開選單選「幻靈融合」，把兩隻夥伴合而為一。', use: 'key' };
ITEM_ORDER.push('fuseCore');
async function shop() {
  const list = ['potion', 'superPot', 'fullPot', 'elixir', 'cure', 'revive', 'maxRevive', 'lamp', 'ppFruit', 'candy', 'atkCharm', 'defCharm', 'spdCharm', 'smoke', 'charm', 'goldCharm', 'moonCharm', 'genesisCharm', 'fuseCore', 'splitCore'].filter(id => ITEMS[id]);
  while (true) {
    const c = await choose(list.map(id => (x, y, sel) => {
      text(ITEMS[id].n, x, y + 6, { size: 20, color: sel ? '#ffd77a' : /Core/.test(id) ? '#ff9ae0' : '#f4ead0' });
      text(`$${ITEMS[id].price}`, x + 300, y + 6, { size: 19, align: 'right', color: '#c8bca0' });
    }), { title: `商店　持有金錢：$${S.money}`, w: 400, x: 30, y: 20, rowH: 36, maxRows: 10, desc: k => ITEMS[list[k]].d + `（持有 ${S.bag[list[k]] || 0}）` });
    if (c < 0) { await say('謝謝光臨！', { name: '店員' }); return; }
    const id = list[c];
    const q = await choose(['×1', '×5', '×10'], { title: '要買幾個？', w: 200, x: 460, y: 120 });
    if (q < 0) continue;
    const n = [1, 5, 10][q], cost = n * ITEMS[id].price;
    if (S.money < cost) { await say('錢不夠喔……', { name: '店員' }); continue; }
    S.money -= cost; addItem(id, n); sfx('ok');
    await say(`買了 ${ITEMS[id].n} ×${n}！`, { name: '店員' });
  }
}

// ---------- 幻靈融合 ----------
const FUSE0 = 20001;
const ALL_TYPES = Object.keys(TYPES);
ITEMS.splitCore = { n: '分離晶石', price: 3000, d: '把融合過的幻靈分回融合前的兩隻。按 X 打開選單選「幻靈融合」→「解除融合」。', use: 'key' };
ITEM_ORDER.push('splitCore');
const FUSE_FX = ['blast', 'beam', 'orb', 'pillar', 'meteor', 'twister', 'rings', 'claw', 'slash', 'quake', 'feathers', 'chains'];
const FUSE_BACK = ['wings', 'halo', 'flames', 'spikes'], FUSE_FRONT = ['orbit', 'mark', 'sparks'];
function lookOfId(id) { let k = id, n = 0; while (MONS[k] && MONS[k].look && n++ < 20) k = MONS[k].look; return k; }
function baseOfId(id) { const M = MONS[id]; return M && M.fused ? (M.baseA || lookOfId(id)) : id; }
function registerFusion(id, def) {
  Object.defineProperty(MONS, id, { value: def, enumerable: false, writable: true, configurable: true });
  if (def.fm) MOVES[def.fm.key] = def.fm;
  if (def.art) SPRITES[id] = (c, t) => drawPlan(c, id, t);
  if (def.hue == null) def.hue = (id * 77) % 300 + 30;
  if (!def.back) { def.back = FUSE_BACK[id % FUSE_BACK.length]; def.front = FUSE_FRONT[id % FUSE_FRONT.length]; }
}
function registerFusions(st) { if (st && st.fusions) for (const id in st.fusions) registerFusion(+id, st.fusions[id]); }
const loadGameFuse = loadGame;
loadGame = function () { const d = loadGameFuse(); try { registerFusions(d); } catch (e) { console.error(e); } return d; };
if (typeof S !== 'undefined' && S) registerFusions(S);
// 只有孫悟空不能融合（番外篇的夥伴依使用者要求開放融合）
function noFuseReason(m) {
  const M = MONS[m.id];
  if (m.id === WUKONG) return '「俺老孫可不給人融合！」孫悟空一個筋斗翻走了。';
  return '';
}
function fuseName(A, Bm) {
  const a = MONS[A.id], b = MONS[Bm.id], an = [...a.n], bn = [...b.n];
  if (a.human || b.human) {
    const H = a.human ? an : bn, O = a.human ? bn : an;
    if (H.length >= 3) return H[0] + (a.human && b.human ? O[1] : O[0]) + H[H.length - 1];
    return H[0] + O[0] + (O[1] || H[1] || '');
  }
  const h1 = Math.max(1, Math.ceil(an.length / 2)), h2 = Math.floor(bn.length / 2);
  let n = an.slice(0, h1).join('') + bn.slice(h2).join('');
  if ([...n].length > 5) n = [...n].slice(0, 5).join('');
  return n;
}
function colorsOf(id) {
  const M = MONS[lookOfId(id)];
  if (M.art) return [M.art.a, M.art.b, M.art.c];
  return [TYPES[M.t[0]].c, TYPES[M.t[1] || M.t[0]].c, '#ffffff'];
}
async function fuseMenu() {
  const c = await choose([`融合（融合晶石 ${S.bag.fuseCore || 0}）`, `解除融合（分離晶石 ${S.bag.splitCore || 0}）`, '取消'], { title: '幻靈融合', w: 380, x: W / 2 - 190, y: 200 });
  if (c === 0) return doFuse();
  if (c === 1) return unFuse();
}
async function doFuse() {
  if ((S.bag.fuseCore || 0) <= 0) { await say(['需要「融合晶石」才能進行融合。', '商店有在賣，一顆 $5000。']); return; }
  if (S.party.length < 2) { await say('隊伍裡至少要有兩隻夥伴才能融合。'); return; }
  await tip('fuse2', ['幻靈融合：選一隻「主體」和一隻「素材」。', '融合後會變成全新的模樣，還會學會專屬的融合技；能力有機率變強或變弱，屬性也可能改變。', '後悔的話，用「分離晶石」就能分回原本的兩隻。', '只有孫悟空不能融合。']);
  const a = await partyMenu('item', '選擇融合的主體');
  if (a < 0 || !S.party[a]) return;
  let why = noFuseReason(S.party[a]); if (why) { await say(why); return; }
  const b = await partyMenu('item', '選擇融合的素材');
  if (b < 0 || !S.party[b]) return;
  if (b === a) { await say('不能和自己融合！'); return; }
  why = noFuseReason(S.party[b]); if (why) { await say(why); return; }
  const A = S.party[a], Bm = S.party[b], MA = MONS[A.id], MB = MONS[Bm.id], name = fuseName(A, Bm);
  const ok = await choose(['融合！', '算了'], { title: `${monName(A)} ＋ ${monName(Bm)} → ${name}？`, w: 460, x: W / 2 - 230, y: 260 });
  if (ok !== 0) return;
  addItem('fuseCore', -1);
  const roll = Math.random();
  const mult = roll < 0.45 ? 1.15 + Math.random() * 0.35 : roll < 0.8 ? 0.95 + Math.random() * 0.15 : 0.7 + Math.random() * 0.2;
  const tr = Math.random();
  let t;
  if (tr < 0.6) t = MA.t.slice();
  else if (tr < 0.85) t = [...new Set([MA.t[0], MB.t[0]])];
  else { const k = ALL_TYPES[Math.floor(Math.random() * ALL_TYPES.length)]; t = [...new Set([k, MA.t[0]])].slice(0, 2); }
  const bst = MA.b.map((v, i) => Math.round(Math.max(v, (v + MB.b[i]) / 2) * mult));
  const id = Math.max(FUSE0 - 1, ...Object.keys(S.fusions || {}).map(Number)) + 1;
  const la = lookOfId(A.id), lb = lookOfId(Bm.id), [ba, bb, bc] = colorsOf(Bm.id), [aa, ab, ac] = colorsOf(A.id);
  // 融合技
  const verbs = (EXP_TYPES[t[0]] || {}).verb || ['融合爆破'], verb = verbs[id % verbs.length];
  const fm = { key: 'fz_' + id, n: [...name].slice(0, 2).join('') + verb, t: t[0], p: 120 + Math.floor(Math.random() * 41), a: 95, pp: 10, fxk: FUSE_FX[Math.floor(Math.random() * FUSE_FX.length)], d: `${name}獨有的融合技，結合了${MA.n}與${MB.n}的力量。` };
  const def = { n: name, t, b: bst, cr: 45, xp: Math.max(MA.xp || 100, MB.xp || 100), h: MA.h, w: MA.w, hab: '幻靈融合', desc: `${MA.n}與${MB.n}融合而成的幻靈。`,
    big: !!(MA.big || MB.big), human: !!(MA.human || MB.human), fused: true, baseA: la, lookB: lb, fm,
    hue: 40 + Math.floor(Math.random() * 280), back: FUSE_BACK[Math.floor(Math.random() * FUSE_BACK.length)], front: FUSE_FRONT[Math.floor(Math.random() * FUSE_FRONT.length)],
    parents: [JSON.parse(JSON.stringify(A)), JSON.parse(JSON.stringify(Bm))], learn: [[1, fm.key], ...MA.learn, ...MB.learn].sort((x, y) => x[0] - y[0]) };
  const artA = MONS[la].art;
  if (artA) def.art = Object.assign({}, artA, { a: ba, b: ac, c: bc, s: Math.min(4, (artA.s || 2) + 1) });
  else def.look = la;
  S.fusions = S.fusions || {}; S.fusions[id] = def; registerFusion(id, def);
  const lv = Math.max(A.level, Bm.level);
  const best = m => m.moves.filter(q => q.id !== 'struggle' && MOVES[q.id]).sort((x, y) => (MOVES[y.id].p || 0) - (MOVES[x.id].p || 0));
  const mvs = [fm.key, ...best(A).slice(0, 2).map(q => q.id), ...best(Bm).slice(0, 3).map(q => q.id)].filter((m, i, arr) => arr.indexOf(m) === i).slice(0, MAX_MOVES);
  const F = { id, level: lv, exp: expForLevel(lv), status: null, moves: mvs.map(m => ({ id: m, pp: MOVES[m].pp })) };
  calcStats(F); F.hp = F.maxHp;
  jingle('evolve');
  S.party.splice(Math.max(a, b), 1); S.party.splice(Math.min(a, b), 1);
  S.party.splice(Math.min(a, b), 0, F);
  S.dex.seen[id] = true;
  await fuseShow([A.id, Bm.id], [F.id]);
  const sumA = A.maxHp + A.atk + A.def + A.spd, sumF = F.maxHp + F.atk + F.def + F.spd;
  const lines = [`融合成功！誕生了「${name}」！`, `學會了專屬融合技「${fm.n}」！`];
  lines.push(mult >= 1.15 ? '能力大幅提升了！' : mult < 0.92 ? '咦……能力好像變弱了……（用分離晶石可以分回原本的兩隻）' : '能力差不多。');
  if (t.join() !== MA.t.join()) lines.push(`屬性變成了【${t.join('／')}】！`);
  lines.push(`（體力 ${A.maxHp}→${F.maxHp}，攻擊 ${A.atk}→${F.atk}，總能力 ${sumA}→${sumF}）`);
  await say(lines);
  saveGame(true);
}
async function unFuse() {
  if ((S.bag.splitCore || 0) <= 0) { await say(['需要「分離晶石」才能解除融合。', '商店有在賣，一顆 $3000。']); return; }
  if (!S.party.some(m => MONS[m.id].fused)) { await say('隊伍裡沒有融合過的幻靈。'); return; }
  const i = await partyMenu('item', '要把哪一隻分回原本的兩隻？');
  if (i < 0) return;
  const F = S.party[i], D = MONS[F.id];
  if (!D.fused) { await say(`${monName(F)} 不是融合幻靈。`); return; }
  if (!D.parents) { await say('這隻是舊版融合的幻靈，沒有留下原本的資料，無法分離……'); return; }
  const [A, Bm] = D.parents.map(p => JSON.parse(JSON.stringify(p)));
  const ok = await choose(['分離！', '算了'], { title: `${monName(F)} → ${monName(A)} ＋ ${monName(Bm)}？`, w: 460, x: W / 2 - 230, y: 260 });
  if (ok !== 0) return;
  addItem('splitCore', -1);
  for (const m of [A, Bm]) { calcStats(m); m.hp = m.maxHp; m.status = null; for (const mv of m.moves) if (MOVES[mv.id]) mv.pp = MOVES[mv.id].pp; }
  S.party.splice(i, 1, A);
  let where = '隊伍';
  if (S.party.length < 6) S.party.splice(i + 1, 0, Bm); else { S.box.push(Bm); where = '靈匣'; }
  if (!S.party.concat(S.box).some(m => m.id === F.id)) { delete S.fusions[F.id]; }
  jingle('heal');
  await fuseShow([F.id], [A.id, Bm.id]);
  await say([`分離成功！${monName(A)} 和 ${monName(Bm)} 回來了！`, `（${monName(Bm)} 回到了${where}）`]);
  saveGame(true);
}
function fuseShow(from, to) {
  const L = pushLayer({ ui: true, update() {}, draw() {
    const now = performance.now(), t = now / 1000, p = Math.min(1, (now - L.t0) / 2200);
    ctx.fillStyle = 'rgba(8,4,20,0.92)'; ctx.fillRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2 - 10, list = p < 0.6 ? from : to, k = p < 0.6 ? p / 0.6 : 1 - (p - 0.6) / 0.4;
    const two = list.length > 1;
    list.forEach((id, i) => { const sd = i ? 1 : -1, off = !two ? 0 : p < 0.6 ? sd * 220 * (1 - k) : sd * 200 * Math.min(1, (p - 0.6) / 0.25); drawMon(ctx, id, cx + off, cy, two ? 150 : 190, t, { alpha: p < 0.6 ? 1 - k * 0.5 : 1 }); });
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(cx, cy, 10, cx, cy, 260); g.addColorStop(0, `rgba(255,220,255,${k})`); g.addColorStop(1, 'rgba(120,60,255,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283 + t, rr = 60 + (t * 120 + i * 20) % 200; ctx.fillStyle = 'rgba(255,200,255,0.7)'; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 3, 0, 7); ctx.fill(); }
    ctx.restore();
    text(to.length > 1 ? '解除融合' : '幻靈融合', W / 2, 40, { size: 34, align: 'center', bold: true, color: '#ffd0ff' });
  } });
  L.t0 = performance.now();
  return wait(2400).then(() => popLayer(L));
}
// ---------- 融合幻靈的外表：新配色＋素材的影子＋融合紋飾 ----------
const GHOST_CACHE = {};
function fuseGhost(cx, lb, x, y, size, t, col, opt) {
  const R = Math.ceil(size * 1.3), key = lb + '_' + size + '_' + (opt.flip ? 1 : 0);
  let cv = opt.still ? GHOST_CACHE[key] : null;
  if (!cv) {
    cv = document.createElement('canvas'); cv.width = cv.height = R * 2;
    const q = cv.getContext('2d'); drawMonFuse(q, lb, R, R, size, t, { flip: opt.flip, still: opt.still });
    q.globalCompositeOperation = 'source-in'; const g = q.createRadialGradient(R, R, 0, R, R, R); g.addColorStop(0, '#ffffff'); g.addColorStop(0.5, col); g.addColorStop(1, sh(col, -0.3)); q.fillStyle = g; q.fillRect(0, 0, R * 2, R * 2);
    if (opt.still) GHOST_CACHE[key] = cv;
  }
  const k = 1.22 + Math.sin(t * 2) * 0.03;
  cx.save(); cx.globalAlpha = (opt.alpha == null ? 1 : opt.alpha) * 0.5; cx.shadowColor = col; cx.shadowBlur = 16;
  cx.drawImage(cv, x - R * k, y - R * k - size * 0.06, R * 2 * k, R * 2 * k); cx.restore();
}
function fuseDeco(cx, kind, x, y, size, t, col, opt) {
  const u = size / 100, A0 = opt.alpha == null ? 1 : opt.alpha;
  cx.save(); cx.globalAlpha = A0; cx.translate(x, y); cx.scale(u, u);
  if (kind === 'wings') for (const d of [-1, 1]) { cx.save(); cx.scale(d, 1); cx.rotate(-0.2 + Math.sin(t * 2.6) * 0.12); for (let i = 0; i < 6; i++) { const L = 40 - i * 4, a = -0.9 + i * 0.28; const g = cx.createLinearGradient(14, -10, 14 + Math.cos(a) * L, -10 + Math.sin(a) * L); g.addColorStop(0, 'rgba(255,255,255,0.9)'); g.addColorStop(1, col); cx.fillStyle = g; cx.globalAlpha = A0 * 0.75; cx.beginPath(); cx.ellipse(14 + Math.cos(a) * L / 2, -10 + Math.sin(a) * L / 2, L / 2, 3.4, a, 0, 7); cx.fill(); } cx.restore(); }
  if (kind === 'halo') { cx.save(); cx.shadowColor = col; cx.shadowBlur = 12; cx.strokeStyle = col; cx.lineWidth = 2.4; cx.rotate(t * 0.5); cx.beginPath(); cx.arc(0, -8, 46, 0, 7); cx.stroke(); cx.setLineDash([3, 6]); cx.lineWidth = 1.4; cx.beginPath(); cx.arc(0, -8, 40, 0, 7); cx.stroke(); cx.restore(); }
  if (kind === 'flames') { cx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i - 4) * 0.32, f = 18 + Math.sin(t * 7 + i * 1.3) * 7; const x0 = Math.cos(a) * 30, y0 = Math.sin(a) * 30 - 4; const g = cx.createLinearGradient(x0, y0, x0 + Math.cos(a) * f * 1.6, y0 + Math.sin(a) * f * 1.6); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = g; cx.globalAlpha = A0 * 0.7; cx.beginPath(); cx.moveTo(x0 - 6 * Math.sin(a), y0 + 6 * Math.cos(a)); cx.quadraticCurveTo(x0 + Math.cos(a) * f * 2, y0 + Math.sin(a) * f * 2, x0 + 6 * Math.sin(a), y0 - 6 * Math.cos(a)); cx.fill(); } }
  if (kind === 'spikes') { cx.shadowColor = col; cx.shadowBlur = 8; for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.38, L = 52 + (i % 2) * 10 + Math.sin(t * 2 + i) * 2; const g = cx.createLinearGradient(0, 0, Math.cos(a) * L, Math.sin(a) * L); g.addColorStop(0, sh(col, -0.3)); g.addColorStop(1, '#ffffff'); cx.fillStyle = g; cx.beginPath(); cx.moveTo(Math.cos(a - 0.12) * 26, Math.sin(a - 0.12) * 26 - 4); cx.lineTo(Math.cos(a) * L, Math.sin(a) * L - 4); cx.lineTo(Math.cos(a + 0.12) * 26, Math.sin(a + 0.12) * 26 - 4); cx.closePath(); cx.fill(); } }
  if (kind === 'orbit') { for (let i = 0; i < 4; i++) { const a = t * 1.4 + i * 1.571, rx = Math.cos(a) * 46, ry = Math.sin(a) * 14 + 10; cx.save(); cx.shadowColor = col; cx.shadowBlur = 10; cx.fillStyle = '#ffffff'; cx.globalAlpha = A0 * (0.6 + Math.sin(a) * 0.4); cx.translate(rx, ry); cx.rotate(t * 2); cx.beginPath(); cx.moveTo(0, -5); cx.lineTo(3.4, 0); cx.lineTo(0, 5); cx.lineTo(-3.4, 0); cx.closePath(); cx.fill(); cx.strokeStyle = col; cx.lineWidth = 1; cx.stroke(); cx.restore(); } }
  if (kind === 'mark') { cx.save(); cx.translate(0, 44); cx.scale(1, 0.3); cx.rotate(t * 0.8); cx.shadowColor = col; cx.shadowBlur = 10; cx.strokeStyle = col; cx.lineWidth = 2.4; cx.globalAlpha = A0 * 0.8; cx.beginPath(); cx.arc(0, 0, 42, 0, 7); cx.stroke(); cx.beginPath(); for (let i = 0; i <= 6; i++) { const a = i * 2 * 2.094 / 2; const pp = [Math.cos(i * 2.513) * 40, Math.sin(i * 2.513) * 40]; i ? cx.lineTo(pp[0], pp[1]) : cx.moveTo(pp[0], pp[1]); } cx.stroke(); cx.restore(); }
  if (kind === 'sparks') { cx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 10; i++) { const p = (t * 0.5 + i / 10) % 1, a = i * 2.4; cx.globalAlpha = A0 * (1 - p); cx.fillStyle = i % 2 ? '#ffffff' : col; cx.beginPath(); cx.arc(Math.cos(a) * (20 + p * 30), 30 - p * 80, 2.2, 0, 7); cx.fill(); } }
  cx.restore();
}
const drawMonFuse = drawMon;
function fuseCompose(cx, id, x, y, size, t, opt) {
  const M = MONS[id];
  const col = (TYPES[M.t[0]] || {}).c || '#ff80ff', A0 = opt.alpha == null ? 1 : opt.alpha;
  cx.save(); cx.globalCompositeOperation = 'lighter'; cx.globalAlpha = A0 * 0.3;
  const g = cx.createRadialGradient(x, y, size * 0.1, x, y, size * 0.62); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = g; cx.beginPath(); cx.arc(x, y, size * 0.62, 0, 7); cx.fill(); cx.restore();
  if (!opt.sink) {
    if (M.lookB) {
      fuseGhost(cx, M.lookB, x, y, size, t, col, Object.assign({}, opt, { still: true }));
      const sd = opt.flip ? -1 : 1;
      cx.save(); cx.filter = 'hue-rotate(' + ((M.hue + 180) % 360) + 'deg) saturate(1.2) brightness(0.9)';
      drawMonFuse(cx, M.lookB, x - sd * size * 0.26, y - size * 0.14, Math.round(size * 0.78), t * 0.9, Object.assign({}, opt, { alpha: A0 * 0.95, still: true }));
      cx.restore();
    }
    fuseDeco(cx, M.back, x, y, size, t, col, opt);
  }
  if (M.art) drawMonFuse(cx, id, x, y, size, t, opt);
  else { cx.save(); cx.filter = `hue-rotate(${M.hue}deg) saturate(1.35) contrast(1.08)`; drawMonFuse(cx, M.look, x, y, size * 1.08, t, opt); cx.restore(); }
  if (!opt.sink) fuseDeco(cx, M.front, x, y, size, t, col, opt);
}
// 融合幻靈畫起來很重：整張合成圖先畫在快取畫布上，每秒最多更新 15 次
const FUSE_CACHE = new Map(), FUSE_FPS_MS = 66;
drawMon = function (cx, id, x, y, size, t, opt = {}) {
  const M = MONS[id];
  if (!M || !M.fused) return drawMonFuse(cx, id, x, y, size, t, opt);
  if (opt.sink) return fuseCompose(cx, id, x, y, size, t, opt);
  const key = id + '_' + size + '_' + (opt.flip ? 1 : 0) + (opt.still ? 's' : ''), now = performance.now();
  let e = FUSE_CACHE.get(key);
  if (!e || (!opt.still && now - e.t > FUSE_FPS_MS)) {
    const R = Math.ceil(size * 0.95), k = typeof SS === 'number' ? SS : 1;
    if (!e) { const cv = document.createElement('canvas'); cv.width = cv.height = Math.ceil(R * 2 * k); e = { cv, R, k, t: 0 }; }
    const q = e.cv.getContext('2d'); q.setTransform(1, 0, 0, 1, 0, 0); q.clearRect(0, 0, e.cv.width, e.cv.height); q.scale(e.k, e.k);
    fuseCompose(q, id, e.R, e.R, size, opt.still ? 1.2 : t, { flip: opt.flip, still: opt.still });
    e.t = now;
    FUSE_CACHE.delete(key); FUSE_CACHE.set(key, e);
    if (FUSE_CACHE.size > 40) FUSE_CACHE.delete(FUSE_CACHE.keys().next().value);
  }
  cx.save(); if (opt.alpha != null) cx.globalAlpha = opt.alpha;
  cx.drawImage(e.cv, x - e.R, y - e.R, e.R * 2, e.R * 2); cx.restore();
  if (opt.flash) { cx.save(); cx.globalCompositeOperation = 'lighter'; cx.globalAlpha = opt.flash; cx.fillStyle = '#fff'; cx.beginPath(); cx.ellipse(x, y, size * 0.45, size * 0.48, 0, 0, 7); cx.fill(); cx.restore(); }
};

// ---------- 坐騎：隊伍第一隻是龍就能騎 ----------
function isDragonMon(id) {
  const k = lookOfId(id), M = MONS[k];
  if (!M) return false;
  return (M.art && (M.art.plan === 'dragon' || M.art.plan === 'long')) || /龍|蛟/.test(M.n) || /龍|蛟/.test(MONS[id].n);
}
function mountId() {
  if (!S || S.ride === false) return 0;
  const m = S.party[0];
  return m && m.hp > 0 && isDragonMon(m.id) ? m.id : 0;
}
function mountSpeed() { return mountId() ? 1.6 : 1; }
const drawPersonRide = drawPerson;
drawPerson = function (c, x, y, dir, look, frame, scale) {
  const id = look === PLAYER_LOOK && scale == null ? mountId() : 0;
  if (!id) return drawPersonRide(c, x, y, dir, look, frame, scale);
  const t = performance.now() / 1000, bob = Math.sin(t * 6) * 1.5, T = TILE;
  c.save(); c.fillStyle = 'rgba(0,0,0,0.25)'; c.beginPath(); c.ellipse(x + T / 2, y + T * 0.92, T * 0.62, T * 0.16, 0, 0, 7); c.fill(); c.restore();
  const flip = dir === 'right';
  drawMon(c, id, x + T / 2, y + T * 0.45 + bob, T * 1.5, t * 1.5, { flip });
  drawPersonRide(c, x, y - T * 0.5 + bob, dir, look, 0, scale);
};

// ---------- 選單 ----------
async function mainMenu() {
  while (true) {
    const inSide = S.map === 'mickey', inXY = S.map === 'xiyou' || S.map === 'tiangong', inNJ = S.map === 'ninja', mid = S.party[0] && isDragonMon(S.party[0].id);
    const items = [
      ['夥伴', async () => { if (!S.party.length) { await say('你還沒有夥伴！'); return; } await partyMenu('view'); }],
      ['背包', () => bagMenu('field')],
      ['圖鑑', () => dexMenu()],
      ['世界地圖（傳送）', async () => { if (!flag('gotStarter')) { await say('先去研究所領取夥伴吧！'); return; } return (await worldMap()) ? 'close' : 0; }],
      [inXY ? '離開西遊記篇' : '西遊記篇（序章／取經之路）', async () => { if (inXY) { if (S.map === 'xiyou') await leaveXiyou(); else await sagaLeave(); return 'close'; } const k = await choose(['序章：大鬧天宮', '取經之路'], { title: '西遊記篇', w: 300, x: W / 2 - 150, y: 220 }); if (k < 0) return; if (k === 0) return (await sagaEnter('tiangong')) ? 'close' : 0; return (await enterXiyou()) ? 'close' : 0; }],
      [inNJ ? '離開忍者番外篇' : '忍者番外篇：影之里', async () => { if (inNJ) { await sagaLeave(); return 'close'; } return (await sagaEnter('ninja')) ? 'close' : 0; }],
      [inSide ? '離開番外篇' : '番外篇：米老鼠班道館', async () => { if (inSide) { await leaveSide(); return 'close'; } return (await enterSide()) ? 'close' : 0; }],
      [`幻靈融合／分離（晶石 ${(S.bag.fuseCore || 0)}／${(S.bag.splitCore || 0)}）`, () => fuseMenu()],
      [`坐騎：${S.ride === false ? '關' : '開'}${mid ? '' : '（第一隻要是龍）'}`, async () => { S.ride = S.ride === false; if (S.ride && !mid) await say(['把一隻「龍」排在隊伍第一位，就能騎著牠移動，速度也會變快！', '（夥伴 → 選一隻龍 → 移到第一位）']); }],
      ['任務', () => questMenu()],
      ['提示', async () => { await hintPage(); return 'close'; }],
      ['存檔', async () => { saveGame(); await wait(300); }],
      ['聲音設定', () => soundPanel()],
      [zoomLabel(), () => cycleZoom()],
      [S.hintsOff ? '提示框：關' : '提示框：開', () => { S.hintsOff = !S.hintsOff; }],
      ['關閉', () => 'close'],
    ];
    const seals = Object.keys(S.flags).filter(f => /^stage\d+$/.test(f)).length + (S.badges || 0);
    const c = await choose(items.map(q => q[0]), { title: `${S.name}　$${S.money}　道館 ${seals}/100`, w: 360, x: W - 380, y: 8, rowH: 33, maxRows: 15 });
    if (c < 0) return;
    if ((await items[c][1]()) === 'close') return;
  }
}

// ---------- 存檔升級 ----------
// ---------- 一次性：把存檔裡所有融合幻靈還原成融合前的兩隻 ----------
function speciesByName(n) {
  for (const k of Object.keys(MONS)) if (MONS[k].n === n) return +k;
  for (const k in (S.fusions || {})) if (S.fusions[k].n === n) return +k;
  return 0;
}
function splitOne(m) {
  const D = MONS[m.id];
  if (D.parents) return D.parents.map(p => JSON.parse(JSON.stringify(p)));
  // 舊版融合沒有留下原本資料：依名字與等級重建
  const a = D.look || D.baseA, mm = /^(.+)與(.+)融合而成的幻靈。$/.exec(D.desc || '');
  const nameA = a && MONS[a] ? MONS[a].n : '';
  let bId = 0;
  if (mm) { const rest = nameA && D.desc.startsWith(nameA + '與') ? D.desc.slice(nameA.length + 1).replace(/融合而成的幻靈。$/, '') : mm[2]; bId = speciesByName(rest); }
  const out = [];
  if (a && MONS[a]) out.push(makeMon(a, m.level));
  if (bId && MONS[bId]) out.push(makeMon(bId, m.level));
  return out.length ? out : [m];
}
function undoAllFusions() {
  let count = 0;
  for (let round = 0; round < 10; round++) {
    let changed = false;
    for (const listName of ['party', 'box']) {
      const L = S[listName], out = [];
      for (const m of L) {
        if (MONS[m.id] && MONS[m.id].fused) { const r = splitOne(m); if (r[0] !== m) { out.push(...r); count++; changed = true; continue; } }
        out.push(m);
      }
      S[listName] = out;
    }
    if (!changed) break;
  }
  while (S.party.length > 6) S.box.push(S.party.pop());
  for (const m of S.party.concat(S.box)) { calcStats(m); m.hp = m.maxHp; m.status = null; for (const mv of m.moves) if (MOVES[mv.id]) mv.pp = MOVES[mv.id].pp; }
  const left = S.party.concat(S.box).filter(m => MONS[m.id] && MONS[m.id].fused).length;
  if (!left) S.fusions = {};
  if (count) addItem('fuseCore', count);
  return count;
}
const worldLayerV9 = worldLayer;
worldLayer = function () {
  if (S) {
    registerFusions(S); if (!S.v9) migrateV9();
    if (!S.unfuse1) { S.unfuse1 = 1; const n = undoAllFusions(); if (n) { saveGame(true); setTimeout(() => showToast(`已把 ${n} 隻融合幻靈還原成融合前的樣子，並退還融合晶石 ×${n}`), 800); } }
  }
  return worldLayerV9();
};
TIPS.push('隊伍第一隻是「龍」的話，在地圖上會騎著牠走，速度更快！');
TIPS.push('融合後後悔了？商店的「分離晶石」可以分回原本的兩隻。');
TIPS.push('道館的幻靈有三階段變身，倒下兩次之後才會真的倒下！');
TIPS.push('商店的「融合晶石」可以把兩隻夥伴融合成一隻全新的幻靈。');
TIPS.push("道館的幻靈會依照你最強的夥伴變強！");

// ---------- 彭子甯：體力 +10000（舊存檔換算一次）----------
const ZINING_HP_BONUS = 10000;
const calcStatsZn = calcStats;
calcStats = function (m) { calcStatsZn(m); if (m.id === ZINING) m.maxHp += ZINING_HP_BONUS; };
const worldLayerV10 = worldLayer;
worldLayer = function () {
  if (S && !S.v10) { S.v10 = 1; for (const m of S.party.concat(S.box)) if (m.id === ZINING) { const r = m.maxHp ? m.hp / m.maxHp : 1; calcStats(m); m.hp = m.hp <= 0 ? 0 : Math.max(1, Math.round(m.maxHp * r)); } }
  return worldLayerV10();
};
