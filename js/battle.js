// ===== 戰鬥系統 =====

const stageMult = s => s >= 0 ? (2 + s) / 2 : 2 / (2 - s);
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

const BG = {
  green: ['#3a6a40', '#a8d890', '#5a9a4a'], warm: ['#5a3a20', '#e0b070', '#8a6a3a'], swamp: ['#1a3a3a', '#5a8a7a', '#2a5a4a'],
  lava: ['#3a1008', '#c8501e', '#5a2a1a'], mountain: ['#3a4a5a', '#a0b8c8', '#6a6a5a'], night: ['#0a0a2a', '#3a3a7a', '#2a2a5a'],
  abyss: ['#0a0414', '#3a1a5a', '#1a0a2a'], ice: ['#5a8ab0', '#e0f0ff', '#a8c8e0'], toy: ['#5a3a5a', '#e8b0d0', '#a07090'],
  storm: ['#1a1a2a', '#6a6a8a', '#3a4a3a'], temple: ['#2a2420', '#a8987a', '#5a5040'], sky: ['#5a9ae8', '#fff4dc', '#e8d8b0'],
};

let B = null; // 目前的戰鬥

function battleLayer() {
  return {
    full: true,
    update() {},
    draw() {
      const t = performance.now() / 1000;
      ctx.save();
      if (B.sk) ctx.translate((Math.random() - 0.5) * B.sk * 2, (Math.random() - 0.5) * B.sk * 2);
      drawBattleBG(MAPS[S.map].theme, t);

      const f = B.foe(), p = B.me();
      const shk = B.fShake ? Math.sin(t * 60) * 6 * B.fShake : 0;
      if (B.trainerShown) drawPerson(ctx, 560 - 72, 120, 'down', B.trainer.look || LOOK.cult, 0, 4.5);
      else if (f && B.fVisible) {
        const sz = f.id === 8 ? 260 : MONS[f.id].big ? 215 : 175;
        drawMon(ctx, f.id, 560 + B.fOff.x + shk, 270 - sz * 0.45 + B.fOff.y, sz, t, { alpha: B.fAlpha, flash: B.fFlash, sink: B.fSink });
      }
      if (B.charm) { // 靈符投擲
        const c = B.charm;
        ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.rot || 0);
        ctx.shadowColor = '#ffd040'; ctx.shadowBlur = 16;
        ctx.fillStyle = c.color; ctx.beginPath(); ctx.roundRect(-12, -16, 24, 32, 3); ctx.fill();
        ctx.strokeStyle = '#7a3a08'; ctx.lineWidth = 2; ctx.strokeRect(-6, -9, 12, 18);
        ctx.restore();
      }
      const pshk = B.pShake ? Math.sin(t * 60) * 6 * B.pShake : 0;
      if (p && B.pVisible) drawMon(ctx, p.id, 210 + B.pOff.x + pshk, 410 - 190 * 0.45 + B.pOff.y, 190, t, { flip: true, alpha: B.pAlpha, flash: B.pFlash, sink: B.pSink });

      // 粒子特效
      for (let i = B.fx.length - 1; i >= 0; i--) {
        const q = B.fx[i];
        q.x += q.vx; q.y += q.vy; q.vy += q.g || 0; q.life -= 1;
        if (q.life <= 0) { B.fx.splice(i, 1); continue; }
        ctx.globalAlpha = Math.min(1, q.life / 20);
        ctx.fillStyle = q.c; ctx.shadowColor = q.c; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(q.x, q.y, q.s, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      }

      drawVfx();
      ctx.restore();

      // 資訊框
      if (f && B.fVisible) infoBox(f, 24, 24, false);
      if (p && B.pVisible) infoBox(p, W - 380, 290, true);
      if (B.trainer && B.foeTeam.length > 1) {
        B.foeTeam.forEach((m, i) => { ctx.fillStyle = m.hp > 0 ? '#ffd040' : '#4a4040'; ctx.beginPath(); ctx.arc(40 + i * 18, 134, 6, 0, Math.PI * 2); ctx.fill(); });
      }
      if (B.prompt) { panel(16, H - 150, W - 32, 134); text(B.prompt, 46, H - 120, { size: 24 }); }
    },
  };
}

function infoBox(m, x, y, mine) {
  panel(x, y, 356, mine ? 108 : 96);
  text(monName(m), x + 20, y + 14, { size: 22, bold: true });
  text('Lv' + m.level, x + 336, y + 16, { size: 20, align: 'right', color: '#ffd77a' });
  MONS[m.id].t.forEach((t, k) => typeBadge(t, x + 20 + k * 50, y + 44, 44));
  if (m.status) { ctx.fillStyle = '#a03a3a'; ctx.beginPath(); ctx.roundRect(x + 124, y + 44, 56, 24, 6); ctx.fill(); text(STATUS_NAME[m.status], x + 152, y + 46, { size: 16, align: 'center', bold: true }); }
  text('HP', x + 188, y + 46, { size: 16, color: '#ffd77a', bold: true });
  hpBar(x + 216, y + 52, 124, m.dispHp == null ? m.hp : m.dispHp, m.maxHp);
  if (mine) {
    text(`${Math.ceil(m.dispHp == null ? m.hp : m.dispHp)} / ${m.maxHp}`, x + 340, y + 66, { size: 17, align: 'right' });
    const a = expForLevel(m.level), b = expForLevel(m.level + 1);
    ctx.fillStyle = '#2a2030'; ctx.fillRect(x + 20, y + 92, 316, 5);
    ctx.fillStyle = '#5ab0ff'; ctx.fillRect(x + 20, y + 92, 316 * Math.min(1, (m.exp - a) / (b - a)), 5);
  }
}

function burst(x, y, color, n = 24, spread = 6) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, v = Math.random() * spread;
    B.fx.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 30 + Math.random() * 20, c: color, s: 2 + Math.random() * 4 });
  }
}
function sparkleUp(x, y, color) {
  for (let i = 0; i < 20; i++) B.fx.push({ x: x + (Math.random() - 0.5) * 120, y: y + 40, vx: 0, vy: -1.5 - Math.random() * 2, life: 40, c: color, s: 2 + Math.random() * 3 });
}
const POS = { p: { x: 210, y: 330 }, f: { x: 560, y: 190 } };

const msg = s => say(s, { auto: 1100 });

// ---- 對外介面 ----
async function wildBattle(mon, opt = {}) {
  seeMon(mon.id);
  return runBattle({ wild: true, boss: !!opt.boss, foeTeam: [mon] });
}
async function trainerBattle(tr) {
  const team = tr.team.map(([id, lv]) => makeMon(id, lv));
  return runBattle({ trainer: tr, foeTeam: team });
}

async function runBattle(cfg) {
  const prevB = B;
  B = Object.assign({
    fIdx: 0, pIdx: S.party.findIndex(m => m.hp > 0),
    st: { p: { atk: 0, def: 0, spd: 0 }, f: { atk: 0, def: 0, spd: 0 } },
    conf: { p: 0, f: 0 }, sleepT: { p: 0, f: 0 },
    fOff: { x: 0, y: 0 }, pOff: { x: 0, y: 0 }, fAlpha: 1, pAlpha: 1, fFlash: 0, pFlash: 0, fSink: 0, pSink: 0, fShake: 0, pShake: 0,
    fx: [], used: new Set(), runs: 0, fVisible: false, pVisible: false,
  }, cfg);
  B.foe = () => B.foeTeam[B.fIdx];
  B.me = () => S.party[B.pIdx];
  sfx('encounter');
  const tn = cfg.trainer ? cfg.trainer.name : '';
  playMusic(cfg.boss ? 'boss' : !cfg.trainer ? 'wild' : /試煉者|主教|小嵐/.test(tn) ? 'leader' : 'trainer');
  await flashEncounter();
  const L = pushLayer(battleLayer());
  await fadeIn(300);
  let result;
  try { result = await battleMain(); }
  catch (e) { console.error(e); result = 'run'; }
  await fadeOut(300);
  popLayer(L);
  for (const m of S.party) delete m.dispHp;
  B = prevB;
  playMusic(mapSong());
  await fadeIn(300);
  // 進化（黑幕拉開之後才進行）
  for (const m of S.party) {
    const evo = MONS[m.id].evo;
    if (m.hp > 0 && evo && m.level >= evo.lv) await evolve(m, evo.to);
  }
  if (result === 'lose' && !(cfg.trainer && cfg.trainer.noWhiteout)) await whiteout();
  saveGame(true);
  return result;
}

async function battleMain() {
  if (B.trainer) {
    B.trainerShown = true;
    await msg(`${B.trainer.name} 向你發起了挑戰！`);
    if (B.trainer.before && B.trainer.inline) await say(B.trainer.before, { name: B.trainer.name });
    B.trainerShown = false;
    await sendFoe(true);
  } else {
    B.fVisible = true;
    await tween(400, p => B.fOff.x = (1 - p) * 300);
    await msg(B.boss ? `深淵之主 ${MONS[B.foe().id].n} 擋住了去路！` : `野生的 ${MONS[B.foe().id].n} 出現了！`);
  }
  await sendMine(true);
  if (B.trainer) await tip('trainer', ['和訓練家對戰時不能逃跑，也不能捕捉對方的幻靈。', '打贏就能拿到獎金！']);
  else if (!B.boss) await tip('wild', ['野生幻靈可以收服！', '先把牠打到體力變黃或變紅，再從「背包」丟出靈符，成功率會比較高。', '讓對手睡著或麻痺，也會更容易收服喔。']);

  while (true) {
    const act = await playerAction();
    if (act.type === 'run') {
      if (B.boss) { await msg('無法從這場戰鬥中逃跑！'); continue; }
      const me = B.me(), f = B.foe();
      B.runs++;
      if (Math.random() < 0.5 + (me.spd > f.spd ? 0.35 : 0) + B.runs * 0.15) { sfx('escape'); await msg('順利逃走了！'); return 'run'; }
      await msg('沒能逃走！');
      await foeTurnOnly();
    } else if (act.type === 'item') {
      const r = await useBattleItem(act);
      if (r === 'caught') return 'caught';
      if (r === 'fled') return 'run';
      if (r === 'cancel') continue;
      await foeTurnOnly();
    } else if (act.type === 'switch') {
      await switchMine(act.idx);
      await foeTurnOnly();
    } else {
      const me = B.me(), f = B.foe();
      const mMove = act.i < 0 ? { id: 'struggle' } : me.moves[act.i];
      const fMove = pickFoeMove();
      const mp = (MOVES[mMove.id].e || {}).prio || 0, fp = (MOVES[fMove.id].e || {}).prio || 0;
      const ms = effSpd('p'), fs = effSpd('f');
      const meFirst = mp !== fp ? mp > fp : ms !== fs ? ms > fs : Math.random() < 0.5;
      const order = meFirst ? [['p', mMove], ['f', fMove]] : [['f', fMove], ['p', mMove]];
      for (const [side, mv] of order) {
        const actor = side === 'p' ? B.me() : B.foe();
        const target = side === 'p' ? B.foe() : B.me();
        if (actor.hp <= 0 || target.hp <= 0) continue;
        await doMove(side, mv);
        if (B.foe().hp <= 0 || B.me().hp <= 0) break;
      }
    }
    await endOfTurn();
    const r = await checkFaints();
    if (r) return r;
  }
}

function effSpd(side) {
  const m = side === 'p' ? B.me() : B.foe();
  return m.spd * stageMult(B.st[side].spd) * (m.status === 'par' ? 0.5 : 1);
}

async function foeTurnOnly() {
  if (B.foe().hp > 0 && B.me().hp > 0) await doMove('f', pickFoeMove());
}

async function sendFoe(first) {
  const f = B.foe();
  seeMon(f.id);
  B.st.f = { atk: 0, def: 0, spd: 0 }; B.conf.f = 0;
  B.fVisible = true; B.fAlpha = 1; B.fSink = 0;
  sparkleUp(560, 190, '#ffd040');
  await tween(300, p => B.fOff.y = (1 - p) * -40);
  await msg(`${B.trainer.name} 派出了 ${monName(f)}！`);
}

async function sendMine(first) {
  const m = B.me();
  B.used.add(m);
  B.st.p = { atk: 0, def: 0, spd: 0 }; B.conf.p = 0;
  B.pVisible = true; B.pAlpha = 1; B.pSink = 0;
  sparkleUp(210, 330, '#80d0ff');
  await tween(300, p => B.pOff.x = (1 - p) * -250);
  await msg(`去吧！${monName(m)}！`);
}

async function switchMine(idx) {
  await msg(`回來吧，${monName(B.me())}！`);
  await tween(250, p => B.pOff.x = -p * 250);
  B.pIdx = idx;
  await sendMine();
}

async function playerAction() {
  while (true) {
    const me = B.me();
    B.prompt = `${monName(me)} 要怎麼做？`;
    const c = await choose(['戰鬥', '背包', '夥伴', '逃跑'], { x: W - 340, y: H - 146, w: 320, cols: 2, rowH: 52, cancel: false });
    B.prompt = null;
    if (me.hp < me.maxHp / 4) await tip('lowhp', ['夥伴的體力快沒了！', '可以從「背包」使用甜光露回復，或從「夥伴」換其他幻靈上場。']);
    if (c === 0) {
      await tip('types', ['選招式時，下方說明會顯示「▲效果絕佳」或「▼效果不好」。', '善用屬性相剋，傷害會變成 2 倍！例如：火剋木、木剋水、水剋火、光剋暗。']);
      if (me.moves.every(m => m.pp <= 0)) { await msg(`${monName(me)} 已經沒有能用的招式了！`); return { type: 'move', i: -1 }; }
      const i = await chooseMove(me);
      if (i < 0) continue;
      if (me.moves[i].pp <= 0) { await msg('這個招式的 PP 用完了！'); continue; }
      return { type: 'move', i };
    }
    if (c === 1) {
      const it = await bagMenu('battle');
      if (!it) continue;
      return { type: 'item', ...it };
    }
    if (c === 2) {
      const idx = await partyMenu('switch');
      if (idx < 0) continue;
      if (idx === B.pIdx) { await msg(`${monName(me)} 已經在場上了！`); continue; }
      if (S.party[idx].hp <= 0) { await msg('牠已經沒有力氣戰鬥了！'); continue; }
      return { type: 'switch', idx };
    }
    if (c === 3) return { type: 'run' };
  }
}

function chooseMove(m) {
  const items = m.moves.map(mv => (x, y, sel) => {
    const M = MOVES[mv.id];
    ctx.fillStyle = TYPES[M.t].c; ctx.fillRect(x - 4, y + 8, 5, 24);
    text(M.n, x + 8, y + 7, { size: 21, color: mv.pp > 0 ? (sel ? '#ffd77a' : '#f4ead0') : '#776e66' });
    text(`${mv.pp}/${M.pp}`, x + 300, y + 10, { size: 17, align: 'right', color: '#c8bca0' });
  });
  return choose(items, {
    x: 16, y: H - 230, w: W - 32, cols: 2, rowH: 46, title: '選擇招式　（X 返回）',
    desc: k => {
      const M = MOVES[m.moves[k].id], eff = typeMult(M.t, MONS[B.foe().id].t);
      const effTxt = M.p ? (eff > 1 ? '　▲效果絕佳' : eff < 1 ? '　▼效果不好' : '') : '';
      return `【${M.t}】威力 ${M.p || '—'}　命中 ${M.a}${effTxt}\n${M.d}`;
    },
  });
}

function pickFoeMove() {
  const f = B.foe(), me = B.me();
  const usable = f.moves.filter(m => m.pp > 0);
  if (!usable.length) return { id: 'tackle', pp: 99 };
  if (!B.trainer && !B.boss) return usable[Math.floor(Math.random() * usable.length)];
  let best = null, bs = -1;
  for (const mv of usable) {
    const M = MOVES[mv.id], e = M.e || {};
    let s;
    if (M.p) s = M.p * typeMult(M.t, MONS[me.id].t) * (MONS[f.id].t.includes(M.t) ? 1.5 : 1) * (e.multi ? 2.5 : 1) * M.a / 100;
    else if (e.heal) s = f.hp < f.maxHp * 0.45 ? 160 : 10;
    else if (e.self) s = B.st.f.atk < 2 && f.hp > f.maxHp * 0.6 ? 70 : 15;
    else s = 45;
    s *= 0.75 + Math.random() * 0.5;
    if (s > bs) { bs = s; best = mv; }
  }
  return best;
}

async function doMove(side, mv) {
  const atk = side === 'p' ? B.me() : B.foe();
  const def = side === 'p' ? B.foe() : B.me();
  const other = side === 'p' ? 'f' : 'p';
  const M = MOVES[mv.id], e = M.e || {};
  const who = (side === 'f' ? (B.trainer ? '對手的 ' : '野生的 ') : '') + monName(atk);

  // 狀態判定
  if (atk.status === 'sleep') {
    if (--B.sleepT[side] <= 0) { atk.status = null; await msg(`${who} 醒過來了！`); }
    else { await msg(`${who} 正在呼呼大睡……`); return; }
  }
  if (atk.status === 'par' && Math.random() < 0.25) { await msg(`${who} 全身麻痺，無法行動！`); return; }
  if (B.conf[side] > 0) {
    B.conf[side]--;
    if (B.conf[side] === 0) await msg(`${who} 不再混亂了！`);
    else {
      await msg(`${who} 陷入混亂了！`);
      if (Math.random() < 0.33) {
        const d = Math.max(1, Math.floor(((2 * atk.level / 5 + 2) * 40 * atk.atk / atk.def) / 50 + 2));
        await hurt(side, d); await msg('牠在混亂中攻擊了自己！'); return;
      }
    }
  }
  if (mv.pp !== undefined && mv.pp > 0) mv.pp--;
  await msg(`${who} 使出了「${M.n}」！`);

  // 出招動畫
  const dir = side === 'p' ? 1 : -1, off = side === 'p' ? B.pOff : B.fOff;
  sfxMove(M.t);
  await tween(140, p => { off.x = dir * 40 * p; off.y = -dir * 20 * p; });
  await tween(140, p => { off.x = dir * 40 * (1 - p); off.y = -dir * 20 * (1 - p); });

  if (Math.random() * 100 >= M.a) { await msg('但是沒有命中！'); return; }
  await playMoveFx(M, side);

  if (M.p > 0) {
    const tm = typeMult(M.t, MONS[def.id].t);
    const hits = e.multi ? rnd(e.multi[0], e.multi[1]) : 1;
    let total = 0, crit = false;
    for (let h = 0; h < hits && def.hp > 0; h++) {
      const c = Math.random() < (e.crit ? 1 / 6 : 1 / 16);
      crit = crit || c;
      const A = atk.atk * stageMult(B.st[side].atk) * (atk.status === 'burn' ? 0.5 : 1);
      const D = def.def * stageMult(B.st[other].def);
      let d = ((2 * atk.level / 5 + 2) * M.p * A / D) / 50 + 2;
      d *= (MONS[atk.id].t.includes(M.t) ? 1.5 : 1) * tm * (0.85 + Math.random() * 0.15) * (c ? 1.5 : 1);
      d = Math.max(1, Math.floor(d));
      const pos = POS[other];
      burst(pos.x, pos.y, TYPES[M.t].c, 26, 7);
      sfx(tm > 1 ? 'super' : tm < 1 ? 'weak' : 'hit');
      await hurt(other, d);
      total += d;
    }
    if (tm === 0) { await msg('好像沒有效果……'); return; }
    if (crit) { sfx('crit'); await msg('命中要害！'); }
    if (tm > 1) await msg('效果絕佳！');
    else if (tm < 1) await msg('效果不太好……');
    if (hits > 1) await msg(`擊中了 ${hits} 次！`);
    if (e.drain && atk.hp > 0) await heal(side, Math.max(1, Math.floor(total * e.drain)), `${who} 吸取了對手的體力！`);
    if (e.recoil && atk.hp > 0) { await hurt(side, Math.max(1, Math.floor(total * e.recoil))); await msg(`${who} 受到了反作用力的傷害！`); }
    if (def.hp > 0) {
      for (const s of ['burn', 'poison', 'par', 'sleep']) {
        if (e[s] && !def.status && Math.random() < e[s] && !(e[s] && MONS[def.id].t.includes(s === 'burn' ? '火' : s === 'par' ? '雷' : '_'))) await inflict(other, s);
      }
      if (e.conf && !B.conf[other] && Math.random() < e.conf) { B.conf[other] = rnd(2, 4); await msg(`${monName(def)} 陷入混亂了！`); }
      if (e.foe && Math.random() < (e.foeChance || 1)) await changeStats(other, e.foe);
    }
    if (e.self && atk.hp > 0) await changeStats(side, e.self);
  } else {
    // 變化招式
    const pos = POS[side];
    sparkleUp(pos.x, pos.y, TYPES[M.t].c);
    let did = false;
    if (e.heal) { did = true; if (atk.hp >= atk.maxHp) await msg(`${who} 的體力已經是滿的！`); else await heal(side, Math.floor(atk.maxHp * e.heal), `${who} 回復了體力！`); }
    if (e.cure && (atk.status || B.conf[side])) { did = true; atk.status = null; B.conf[side] = 0; await msg(`${who} 的異常狀態消失了！`); }
    if (e.self) { did = true; await changeStats(side, e.self); }
    if (e.foe) { did = true; await changeStats(other, e.foe); }
    if (e.conf) { did = true; if (B.conf[other]) await msg('但是沒有效果……'); else { B.conf[other] = rnd(2, 4); await msg(`${monName(def)} 陷入混亂了！`); } }
    for (const s of ['sleep', 'poison', 'par', 'burn']) if (e[s]) { did = true; if (def.status) await msg('但是沒有效果……'); else await inflict(other, s); }
    if (!did) await msg('但是什麼事也沒發生。');
  }
}

async function hurt(side, d) {
  const m = side === 'p' ? B.me() : B.foe();
  const from = m.hp;
  m.hp = Math.max(0, m.hp - d);
  const k = side === 'p' ? 'p' : 'f';
  B[k + 'Shake'] = 1;
  await tween(Math.min(600, 200 + d * 8), p => { m.dispHp = from + (m.hp - from) * p; B[k + 'Flash'] = (1 - p) * 0.6 * (Math.floor(p * 8) % 2); B[k + 'Shake'] = 1 - p; });
  m.dispHp = m.hp; B[k + 'Flash'] = 0; B[k + 'Shake'] = 0;
}
async function heal(side, amt, txt) {
  const m = side === 'p' ? B.me() : B.foe();
  const from = m.hp;
  m.hp = Math.min(m.maxHp, m.hp + amt);
  sfx('heal');
  sparkleUp(POS[side].x, POS[side].y, '#80ff90');
  await tween(400, p => m.dispHp = from + (m.hp - from) * p);
  if (txt) await msg(txt);
}
async function inflict(side, s) {
  const m = side === 'p' ? B.me() : B.foe();
  if (m.status) return;
  m.status = s;
  if (s === 'sleep') B.sleepT[side] = rnd(2, 3);
  burst(POS[side].x, POS[side].y, { burn: '#ff6020', poison: '#b050e0', par: '#ffe040', sleep: '#a0b0ff' }[s], 18, 4);
  await msg(`${monName(m)} ${{ burn: '被灼傷了！', poison: '中毒了！', par: '麻痺了！行動可能會受阻。', sleep: '睡著了！' }[s]}`);
  if (side === 'p') await tip('status', ['異常狀態：灼傷、中毒每回合會扣體力；麻痺可能無法行動；睡著時不能行動。', '用「淨化花」或到祈光亭就能治好。']);
}
async function changeStats(side, ch) {
  const m = side === 'p' ? B.me() : B.foe();
  for (const k in ch) {
    const v = ch[k], cur = B.st[side][k];
    const nv = Math.max(-6, Math.min(6, cur + v));
    if (nv === cur) { await msg(`${monName(m)} 的${STAT_NAME[k]}已經無法再${v > 0 ? '提升' : '降低'}了！`); continue; }
    B.st[side][k] = nv;
    sfx(v > 0 ? 'up' : 'down');
    await msg(`${monName(m)} 的${STAT_NAME[k]}${v > 0 ? (v > 1 ? '大幅提升了！' : '提升了！') : (v < -1 ? '大幅降低了！' : '降低了！')}`);
  }
}

async function endOfTurn() {
  for (const side of ['p', 'f']) {
    const m = side === 'p' ? B.me() : B.foe();
    if (m.hp <= 0) continue;
    if (m.status === 'burn' || m.status === 'poison') {
      await hurt(side, Math.max(1, Math.floor(m.maxHp / (m.status === 'burn' ? 16 : 10))));
      await msg(`${monName(m)} 受到了${m.status === 'burn' ? '灼傷' : '毒素'}的傷害！`);
    }
  }
}

async function checkFaints() {
  const f = B.foe(), me = B.me();
  if (f.hp <= 0) {
    sfx('faint');
    await tween(500, p => { B.fSink = p; B.fAlpha = 1 - p; });
    await msg(`${B.trainer ? '對手的 ' : '野生的 '}${monName(f)} 倒下了！`);
    await giveExp(f);
    if (B.trainer && B.foeTeam.some(m => m.hp > 0)) {
      B.fIdx = B.foeTeam.findIndex(m => m.hp > 0);
      B.fVisible = false;
      if (me.hp > 0 && S.party.filter(m => m.hp > 0).length > 1) {
        const c = await choose(['換人', '不換'], { title: `${B.trainer.name} 即將派出 ${monName(B.foe())}。要換人嗎？`, w: 520, x: W / 2 - 260, y: 120 });
        if (c === 0) { const idx = await partyMenu('switch'); if (idx >= 0 && idx !== B.pIdx && S.party[idx].hp > 0) { await sendFoe(); await switchMine(idx); return null; } }
      }
      await sendFoe();
    } else if (!B.trainer || !B.foeTeam.some(m => m.hp > 0)) {
      jingle(B.trainer ? 'victory' : 'win');
      if (B.trainer) {
        B.fVisible = false; B.trainerShown = true;
        const money = B.trainer.money || 100;
        S.money += money;
        await msg(`你打敗了 ${B.trainer.name}！`);
        if (B.trainer.after) await say(B.trainer.after, { name: B.trainer.name });
        await msg(`獲得了 ${money} 元獎金！`);
      }
      return 'win';
    }
  }
  if (me.hp <= 0) {
    sfx('faint');
    await tween(500, p => { B.pSink = p; B.pAlpha = 1 - p; });
    await msg(`${monName(me)} 倒下了！`);
    await tip('faint', ['夥伴倒下了也別擔心，到祈光亭（橘色屋頂）就能完全恢復。']);
    if (!S.party.some(m => m.hp > 0)) { await msg('你已經沒有能戰鬥的夥伴了……'); return 'lose'; }
    let idx = -1;
    while (idx < 0 || S.party[idx].hp <= 0) idx = await partyMenu('force');
    B.pIdx = idx;
    await sendMine();
  }
  return null;
}

async function giveExp(f) {
  const base = Math.floor(MONS[f.id].xp * f.level / 6 * (B.trainer ? 1.5 : 1));
  for (const m of S.party) {
    if (m.hp <= 0 || m.level >= LEVEL_CAP) continue;
    const g = B.used.has(m) ? base : Math.floor(base / 2);
    if (g <= 0) continue;
    m.exp += g;
    if (m === B.me()) await msg(`${monName(m)} 獲得了 ${g} 點經驗值！`);
    while (m.level < LEVEL_CAP && m.exp >= expForLevel(m.level + 1)) {
      const oldMax = m.maxHp;
      m.level++;
      calcStats(m);
      m.hp += m.maxHp - oldMax;
      sfx('level');
      await msg(`${monName(m)} 升到了 Lv${m.level}！`);
      for (const [lv, mid] of MONS[m.id].learn) if (lv === m.level) await learnMove(m, mid);
    }
  }
}

async function learnMove(m, mid) {
  if (m.moves.some(x => x.id === mid)) return;
  if (m.moves.length < 4) { m.moves.push({ id: mid, pp: MOVES[mid].pp }); await say(`${monName(m)} 學會了「${MOVES[mid].n}」！`); return; }
  await say([`${monName(m)} 想學習「${MOVES[mid].n}」，`, '但是已經學會 4 個招式了。要忘記哪一個招式呢？']);
  const opts = m.moves.map(x => MOVES[x.id].n).concat(['放棄學習「' + MOVES[mid].n + '」']);
  const c = await choose(opts, { title: '要忘記哪個招式？', w: 380, x: W / 2 - 190, y: 60, cancel: false, desc: k => k < 4 ? MOVES[m.moves[k].id].d : MOVES[mid].d });
  if (c < 4) { const old = MOVES[m.moves[c].id].n; m.moves[c] = { id: mid, pp: MOVES[mid].pp }; await say(`${monName(m)} 忘記了「${old}」，學會了「${MOVES[mid].n}」！`); }
  else await say(`${monName(m)} 沒有學習「${MOVES[mid].n}」。`);
}

async function useBattleItem(act) {
  const I = ITEMS[act.id];
  if (I.use === 'ball') {
    if (B.trainer) { await msg('不能捕捉別人的幻靈！'); return 'cancel'; }
    addItem(act.id, -1);
    return await throwCharm(act.id);
  }
  const target = S.party[act.target];
  addItem(act.id, -1);
  if (I.use === 'heal') { const from = target.hp; target.hp = Math.min(target.maxHp, target.hp + I.v); sfx('heal'); await msg(`${monName(target)} 回復了 ${target.hp - from} 點體力！`); }
  if (I.use === 'cure') { target.status = null; if (target === B.me()) B.conf.p = 0; sfx('heal'); await msg(`${monName(target)} 的異常狀態消失了！`); }
  if (I.use === 'revive') { target.hp = Math.floor(target.maxHp / 2); sfx('heal'); await msg(`${monName(target)} 恢復了精神！`); }
  return 'ok';
}

async function throwCharm(id) {
  const I = ITEMS[id], f = B.foe();
  await msg(`你丟出了 ${I.n}！`);
  sfx('throw');
  B.charm = { x: 200, y: 330, color: id === 'starCharm' ? '#a0e0ff' : id === 'goldCharm' ? '#ffd040' : '#f0a030', rot: 0 };
  await tween(500, p => { B.charm.x = 200 + 360 * p; B.charm.y = 330 - 220 * p + 260 * p * p - 40 * p; B.charm.rot = p * 12; });
  burst(560, 190, '#ffe080', 30, 6);
  await tween(250, p => { B.fAlpha = 1 - p; B.fSink = p * 0.8; });
  B.charm.y = 240; B.charm.rot = 0;
  let p;
  if (id === 'starCharm' && f.hp <= f.maxHp / 2) p = 1;
  else {
    const st = { sleep: 2, par: 1.5, poison: 1.5, burn: 1.5 }[f.status] || 1;
    const a = ((3 * f.maxHp - 2 * f.hp) * MONS[f.id].cr * I.v * st) / (3 * f.maxHp);
    p = Math.min(1, a / 255);
  }
  const shakeP = Math.pow(p, 0.25);
  for (let i = 0; i < 3; i++) {
    await wait(350);
    if (Math.random() > shakeP) {
      B.charm = null;
      burst(560, 190, '#ffffff', 24, 5);
      await tween(250, q => { B.fAlpha = q; B.fSink = 0.8 * (1 - q); });
      await msg(['可惜！差一點就收服了！', '牠從靈符裡掙脫了！', '唉呀！只差一點點！'][i]);
      if (id === 'starCharm' && f.hp > f.maxHp / 2) await msg('（星紋靈符在目標體力一半以下時必定成功。）');
      return 'fail';
    }
    sfx('catch');
    await tween(300, q => B.charm.rot = Math.sin(q * Math.PI * 2) * 0.5);
  }
  sparkleUp(560, 240, '#ffe080');
  jingle('caught');
  await msg(`成功了！收服了 ${MONS[f.id].n}！`);
  B.charm = null;
  f.dispHp = undefined;
  f.status = null;
  const where = addMon(f);
  S.dex.caught[f.id] = true;
  if (where === 'box') await tip('box', ['隊伍最多 6 隻，之後收服的幻靈會送到「靈匣」。', '在祈光亭可以存取靈匣，交換隊伍成員。']);
  if (where === 'box') await msg(`隊伍滿了，${MONS[f.id].n} 被送到了靈匣。`);
  const nick = await choose(['好啊', '不用了'], { title: `要幫 ${MONS[f.id].n} 取名字嗎？`, w: 340, x: W / 2 - 170, y: 150 });
  if (nick === 0) { const n = prompt('幫牠取個名字（最多 6 個字）', MONS[f.id].n); if (n && n.trim()) f.nick = n.trim().slice(0, 6); }
  return 'caught';
}

async function evolve(m, to) {
  await say(`咦？${monName(m)} 的樣子……`);
  const from = m.id, t0 = performance.now();
  let cur = from;
  const L = pushLayer({
    update() {},
    draw() {
      const t = (performance.now() - t0) / 1000;
      ctx.fillStyle = '#05030a'; ctx.fillRect(0, 0, W, H);
      const ph = Math.min(1, t / 3.5);
      const id = Math.sin(t * (4 + ph * 18)) > 0 ? from : to;
      drawMon(ctx, ph >= 1 ? cur : id, W / 2, H / 2 - 40, 220, t, { flash: ph < 1 ? 0.5 : 0 });
      text('進化中……', W / 2, 60, { size: 28, align: 'center', color: '#ffd77a' });
    },
  });
  await wait(3600);
  cur = to;
  jingle('evolve');
  const old = MONS[from].n, named = !!m.nick;
  m.id = to;
  const oldMax = m.maxHp; calcStats(m); m.hp += m.maxHp - oldMax;
  sfx('level');
  S.dex.seen[to] = true; S.dex.caught[to] = true;
  await say(`恭喜！${named ? m.nick : old} 進化成了 ${MONS[to].n}！`);
  for (const [lv, mid] of MONS[to].learn) if (lv <= m.level && lv === 1) await learnMove(m, mid);
  popLayer(L);
}

async function whiteout() {
  await say(['眼前一片漆黑……', '你慌忙帶著夥伴回到了祈光亭。']);
  S.money = Math.floor(S.money / 2);
  const r = S.respawn || { map: 'village', x: 3, y: 12 };
  S.map = r.map; S.x = r.x; S.y = r.y; S.dir = 'down';
  healParty();
}
