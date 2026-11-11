// ===== 聲音：背景音樂（程式即時合成）、戰鬥音效、短樂句 =====
// 全部用 WebAudio 合成，不需要任何音檔。瀏覽器規定要先按一個鍵才能出聲。

let AC = null, musicGain = null, sfxGain = null, noiseBuf = null;

// 音量（0~10）獨立保存，不放進遊戲存檔；5 是原本的預設大小
const VOL_KEY = 'my_mystic_world_volume';
const VOL = { music: 5, sfx: 5, zoom: 1 };
try { Object.assign(VOL, JSON.parse(localStorage.getItem(VOL_KEY) || '{}')); } catch (e) {}
if (!VOL.viewReset) { VOL.zoom = 1; VOL.viewReset = 1; } // 使用者要求回到原本視角，舊設定只重設一次
const musicLevel = () => VOL.music / 10 * 1.1;
function applyVol() {
  try { localStorage.setItem(VOL_KEY, JSON.stringify(VOL)); } catch (e) {}
  if (AC) sfxGain.gain.value = VOL.sfx / 5;
}

function audioInit() {
  if (AC) return;
  try { AC = new AudioContext(); } catch (e) { return; }
  const limiter = AC.createDynamicsCompressor(); limiter.threshold.value = -6; limiter.ratio.value = 12; limiter.connect(AC.destination);
  const master = AC.createGain(); master.gain.value = 0.9; master.connect(limiter);
  musicGain = AC.createGain(); musicGain.gain.value = 0; musicGain.connect(master);
  sfxGain = AC.createGain(); sfxGain.gain.value = VOL.sfx / 5; sfxGain.connect(master);
  noiseBuf = AC.createBuffer(1, AC.sampleRate, AC.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  setInterval(musicTick, 25);
  if (wantSong) startSong(wantSong);
}
window.addEventListener('keydown', audioInit);
window.addEventListener('pointerdown', audioInit);
window.addEventListener('touchstart', audioInit);

const midiHz = n => 440 * Math.pow(2, (n - 69) / 12);
const sfxOn = () => AC && !(S && S.mute);
const musicOn = () => AC && !(S && S.musicOff);

// ---- 基本發聲 ----
function tone(dest, wave, f0, f1, t, dur, vol, attack = 0.005) {
  const o = AC.createOscillator(), g = AC.createGain();
  o.type = wave; o.frequency.setValueAtTime(f0, t);
  if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(dest); o.start(t); o.stop(t + dur + 0.05);
  return o;
}
function noise(dest, t, dur, vol, type = 'bandpass', f0 = 1000, f1, q = 1) {
  const s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain();
  s.buffer = noiseBuf; f.type = type; f.Q.value = q; f.frequency.setValueAtTime(f0, t);
  if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(dest); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05);
}

// ---- 一般音效 ----
function sfx(kind) {
  if (!sfxOn()) return;
  const t = AC.currentTime, D = sfxGain;
  switch (kind) {
    case 'cursor': tone(D, 'square', 880, 880, t, 0.03, 0.04); break;
    case 'ok': case 'select': tone(D, 'square', 660, 990, t, 0.07, 0.06); break;
    case 'hit': noise(D, t, 0.12, 0.5, 'lowpass', 2000, 300); tone(D, 'square', 180, 60, t, 0.12, 0.15); break;
    case 'super': noise(D, t, 0.25, 0.7, 'lowpass', 4000, 200); tone(D, 'sawtooth', 260, 40, t, 0.25, 0.2); tone(D, 'square', 520, 100, t + 0.05, 0.15, 0.1); break;
    case 'weak': noise(D, t, 0.08, 0.3, 'lowpass', 900, 300); tone(D, 'triangle', 140, 100, t, 0.1, 0.12); break;
    case 'crit': [880, 1320].forEach((f, i) => tone(D, 'square', f, f, t + i * 0.05, 0.08, 0.07)); break;
    case 'heal': [72, 76, 79, 84].forEach((n, i) => tone(D, 'sine', midiHz(n), midiHz(n), t + i * 0.07, 0.25, 0.12)); break;
    case 'up': [64, 67, 71, 76].forEach((n, i) => tone(D, 'triangle', midiHz(n), midiHz(n), t + i * 0.05, 0.12, 0.12)); break;
    case 'down': [76, 71, 67, 62].forEach((n, i) => tone(D, 'triangle', midiHz(n), midiHz(n), t + i * 0.05, 0.12, 0.12)); break;
    case 'faint': tone(D, 'sawtooth', 400, 50, t, 0.6, 0.15); tone(D, 'square', 300, 40, t + 0.05, 0.55, 0.08); break;
    case 'throw': noise(D, t, 0.3, 0.3, 'bandpass', 600, 3000, 2); tone(D, 'sine', 300, 900, t, 0.25, 0.08); break;
    case 'catch': tone(D, 'square', 520, 380, t, 0.08, 0.08); noise(D, t, 0.06, 0.3, 'highpass', 3000); break;
    case 'escape': [72, 67, 60].forEach((n, i) => tone(D, 'square', midiHz(n), midiHz(n), t + i * 0.06, 0.08, 0.07)); break;
    case 'run': [60, 64, 67].forEach((n, i) => tone(D, 'square', midiHz(n), midiHz(n), t + i * 0.05, 0.06, 0.06)); break;
    case 'encounter': for (let i = 0; i < 8; i++) tone(D, 'square', midiHz(60 + i * 3), midiHz(60 + i * 3), t + i * 0.04, 0.06, 0.06); break;
    case 'bump': tone(D, 'triangle', 90, 60, t, 0.07, 0.15); break;
    case 'door': noise(D, t, 0.15, 0.25, 'lowpass', 800, 200); tone(D, 'triangle', 200, 120, t, 0.12, 0.1); break;
    case 'exclaim': tone(D, 'square', 990, 1480, t, 0.12, 0.08); tone(D, 'square', 1480, 1480, t + 0.12, 0.1, 0.06); break;
    case 'text': tone(D, 'square', 1200, 1200, t, 0.015, 0.012); break;
    case 'level': jingle('level'); break;
    default: tone(D, 'sine', 440, 440, t, 0.1, 0.08);
  }
}

// ---- 屬性招式音效 ----
function sfxMove(type) {
  if (!sfxOn()) return;
  const t = AC.currentTime, D = sfxGain;
  switch (type) {
    case '火': noise(D, t, 0.45, 0.6, 'lowpass', 300, 3000); noise(D, t + 0.1, 0.35, 0.4, 'bandpass', 1500, 400, 0.7); break;
    case '水': for (let i = 0; i < 6; i++) tone(D, 'sine', 300 + Math.random() * 400, 900 + Math.random() * 600, t + i * 0.05, 0.08, 0.1); noise(D, t, 0.3, 0.2, 'lowpass', 1200, 400); break;
    case '木': noise(D, t, 0.25, 0.35, 'highpass', 2000, 6000); tone(D, 'triangle', 400, 700, t, 0.15, 0.08); tone(D, 'triangle', 500, 900, t + 0.1, 0.15, 0.08); break;
    case '雷': for (let i = 0; i < 10; i++) tone(D, 'square', 200 + Math.random() * 1600, 100 + Math.random() * 800, t + i * 0.025, 0.04, 0.08); noise(D, t, 0.3, 0.4, 'highpass', 3000); break;
    case '冰': [88, 91, 95, 100].forEach((n, i) => tone(D, 'sine', midiHz(n), midiHz(n), t + i * 0.05, 0.3, 0.07)); noise(D, t, 0.2, 0.15, 'highpass', 6000); break;
    case '風': noise(D, t, 0.5, 0.5, 'bandpass', 400, 2500, 3); noise(D, t + 0.15, 0.4, 0.3, 'bandpass', 2500, 600, 3); break;
    case '地': tone(D, 'sine', 120, 35, t, 0.5, 0.35); noise(D, t, 0.4, 0.5, 'lowpass', 500, 80); break;
    case '鋼': tone(D, 'square', 1200, 1150, t, 0.35, 0.06); tone(D, 'square', 1790, 1760, t, 0.3, 0.04); noise(D, t, 0.05, 0.4, 'highpass', 4000); break;
    case '光': [72, 79, 84, 88, 91].forEach((n, i) => tone(D, 'triangle', midiHz(n), midiHz(n), t + i * 0.04, 0.35, 0.07)); break;
    case '暗': tone(D, 'sawtooth', 220, 55, t, 0.5, 0.12); tone(D, 'sawtooth', 233, 58, t, 0.5, 0.08); break;
    case '靈': { const o = tone(D, 'sine', 500, 300, t, 0.6, 0.12); const l = AC.createOscillator(), lg = AC.createGain(); l.frequency.value = 12; lg.gain.value = 40; l.connect(lg); lg.connect(o.frequency); l.start(t); l.stop(t + 0.6); break; }
    case '幻': for (let i = 0; i < 7; i++) tone(D, 'sine', midiHz(84 + [0, 4, 7, 11, 14, 11, 7][i]), 0, t + i * 0.04, 0.2, 0.06); break;
    case '鬥': tone(D, 'sine', 160, 50, t, 0.15, 0.4); noise(D, t, 0.08, 0.6, 'lowpass', 1500, 300); break;
    default: sfx('hit');
  }
}

// ---- 短樂句（勝利、升級、捕捉…）----
const JINGLES = {
  victory: { bpm: 150, w: 'square', notes: [[67, 1], [67, 1], [67, 1], [67, 3], [63, 3], [65, 3], [67, 2], [65, 1], [67, 6]] },
  win:     { bpm: 170, w: 'square', notes: [[72, 1], [76, 1], [79, 1], [84, 4]] },
  level:   { bpm: 200, w: 'square', notes: [[72, 1], [76, 1], [79, 1], [84, 1], [79, 1], [84, 3]] },
  caught:  { bpm: 160, w: 'square', notes: [[72, 1], [72, 1], [79, 1], [76, 2], [79, 1], [84, 4]] },
  badge:   { bpm: 140, w: 'square', notes: [[60, 1], [64, 1], [67, 1], [72, 2], [67, 1], [72, 1], [76, 1], [79, 4], [84, 6]] },
  heal:    { bpm: 180, w: 'triangle', notes: [[72, 1], [76, 1], [79, 1], [76, 1], [79, 1], [84, 4]] },
  evolve:  { bpm: 130, w: 'triangle', notes: [[60, 1], [64, 1], [67, 1], [71, 1], [72, 1], [76, 1], [79, 1], [83, 1], [84, 6]] },
  item:    { bpm: 190, w: 'square', notes: [[76, 1], [79, 1], [84, 3]] },
};
function jingle(name) {
  if (!sfxOn()) return Promise.resolve();
  const J = JINGLES[name], st = 60 / J.bpm / 2;
  let t = AC.currentTime + 0.02;
  for (const [n, len] of J.notes) {
    tone(sfxGain, J.w, midiHz(n), 0, t, len * st * 0.95, 0.09);
    tone(sfxGain, 'triangle', midiHz(n - 12), 0, t, len * st * 0.95, 0.07);
    t += len * st;
  }
  const total = t - AC.currentTime;
  duck(total);
  return new Promise(r => setTimeout(r, total * 1000));
}
let duckUntil = 0;
function duck(sec) { duckUntil = Math.max(duckUntil, AC.currentTime + sec); }

// ---- 背景音樂 ----
// 每首曲子用「和弦進行 + 種子」即時譜出旋律、琶音、低音與鼓。
const SONGS = {
  title:    { bpm: 84,  root: 60, mode: 'maj', prog: [0, 4, 5, 3], energy: 'calm', lead: 'triangle', drums: 0, seed: 11 },
  town:     { bpm: 108, root: 65, mode: 'maj', prog: [0, 5, 3, 4], energy: 'lively', lead: 'square', drums: 1, seed: 7 },
  route:    { bpm: 128, root: 67, mode: 'maj', prog: [0, 3, 4, 0, 5, 3, 1, 4], energy: 'lively', lead: 'square', drums: 2, seed: 23 },
  mountain: { bpm: 120, root: 62, mode: 'maj', prog: [0, 4, 3, 4], energy: 'lively', lead: 'triangle', drums: 2, seed: 5 },
  mystery:  { bpm: 92,  root: 57, mode: 'min', prog: [0, 5, 6, 4], energy: 'calm', lead: 'triangle', drums: 1, seed: 31 },
  dark:     { bpm: 78,  root: 50, mode: 'min', prog: [0, 0, 5, 4], energy: 'calm', lead: 'sawtooth', drums: 1, seed: 13 },
  volcano:  { bpm: 140, root: 52, mode: 'min', prog: [0, 5, 6, 0], energy: 'battle', lead: 'sawtooth', drums: 2, seed: 17 },
  ice:      { bpm: 96,  root: 64, mode: 'maj', prog: [0, 3, 5, 4], energy: 'calm', lead: 'sine', drums: 1, seed: 41 },
  toy:      { bpm: 138, root: 60, mode: 'maj', prog: [0, 5, 1, 4], energy: 'lively', lead: 'square', drums: 1, seed: 3 },
  night:    { bpm: 96,  root: 57, mode: 'maj', prog: [0, 2, 3, 4], energy: 'calm', lead: 'triangle', drums: 1, seed: 19 },
  sky:      { bpm: 100, root: 63, mode: 'maj', prog: [0, 3, 4, 5, 3, 0, 1, 4], energy: 'calm', lead: 'triangle', drums: 1, seed: 29 },
  wild:     { bpm: 160, root: 57, mode: 'min', prog: [0, 5, 6, 4], energy: 'battle', lead: 'square', drums: 3, seed: 47 },
  trainer:  { bpm: 168, root: 64, mode: 'min', prog: [0, 3, 5, 4, 0, 3, 6, 4], energy: 'battle', lead: 'square', drums: 3, seed: 53 },
  leader:   { bpm: 172, root: 60, mode: 'min', prog: [0, 5, 3, 4, 0, 5, 6, 6], energy: 'battle', lead: 'sawtooth', drums: 3, seed: 61 },
  boss:     { bpm: 150, root: 50, mode: 'min', prog: [0, 1, 5, 4, 0, 1, 6, 4], energy: 'battle', lead: 'sawtooth', drums: 3, seed: 71 },
};
const THEME_SONG = { green: 'route', warm: 'town', swamp: 'mystery', lava: 'volcano', mountain: 'mountain', night: 'night', abyss: 'dark', ice: 'ice', toy: 'toy', storm: 'volcano', temple: 'mystery', sky: 'sky' };
const MAP_SONG = { village: 'town', town2: 'town', startown: 'night' };
function mapSong() { return MAP_SONG[S.map] || THEME_SONG[MAPS[S.map].theme] || 'route'; }

const SCALE = { maj: [0, 2, 4, 5, 7, 9, 11], min: [0, 2, 3, 5, 7, 8, 10] };
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

function compose(song) {
  if (song.mel) return song.mel;
  const R = mulberry(song.seed), L = song.prog.length, mel = new Array(L * 16).fill(null);
  const onP = song.energy === 'calm' ? { 0: 1, 4: 0.6, 6: 0.3, 8: 0.9, 12: 0.6, 14: 0.3 }
    : song.energy === 'lively' ? { 0: 1, 2: 0.5, 4: 0.8, 6: 0.5, 8: 0.9, 10: 0.5, 12: 0.8, 14: 0.4 }
    : { 0: 1, 2: 0.8, 3: 0.2, 4: 0.8, 6: 0.8, 8: 1, 10: 0.8, 11: 0.2, 12: 0.8, 14: 0.7 };
  let deg = 4;
  const half = Math.floor(L / 2);
  for (let b = 0; b < L; b++) {
    const ch = song.prog[b], tones = [ch, ch + 2, ch + 4];
    for (let s = 0; s < 16; s++) {
      const i = b * 16 + s;
      if (b >= half && b < L - 1 && R() < 0.7 && mel[i - half * 16] !== undefined) { mel[i] = mel[i - half * 16]; continue; }
      if (!(onP[s] && R() < onP[s])) continue;
      if (s % 8 === 0) {
        // 強拍：靠近的和弦音
        let best = deg, bd = 99;
        for (const tt of tones) for (const o of [-7, 0, 7]) { const c = tt + o; const dd = Math.abs(c - deg) + R() * 1.5; if (dd < bd && c >= 0 && c <= 11) { bd = dd; best = c; } }
        deg = best;
      } else {
        deg += [-2, -1, -1, 1, 1, 2, 0][Math.floor(R() * 7)];
        deg = Math.max(0, Math.min(11, deg));
      }
      mel[i] = deg;
    }
  }
  mel[(L - 1) * 16] = 7; mel[(L - 1) * 16 + 8] = null;
  song.mel = mel;
  return mel;
}
function degMidi(song, d, oct) { const sc = SCALE[song.mode]; return song.root + oct * 12 + 12 * Math.floor(d / 7) + sc[((d % 7) + 7) % 7]; }

let cur = null, wantSong = null, step = 0, nextT = 0;
function playMusic(name) {
  wantSong = name;
  if (!AC) return;
  if (cur && cur.name === name) return;
  startSong(name);
}
function startSong(name) {
  const t = AC.currentTime;
  musicGain.gain.cancelScheduledValues(t);
  musicGain.gain.setValueAtTime(musicGain.gain.value, t);
  musicGain.gain.linearRampToValueAtTime(0, t + 0.25);
  cur = { name, song: SONGS[name], fadeIn: t + 0.3 };
  compose(cur.song);
  step = 0; nextT = t + 0.3;
}
function musicTick() {
  if (!AC || !cur) return;
  const target = musicOn() && AC.currentTime > duckUntil ? musicLevel() : 0;
  if (AC.currentTime > cur.fadeIn && Math.abs(musicGain.gain.value - target) > 0.01) {
    musicGain.gain.setTargetAtTime(target, AC.currentTime, target ? 0.4 : 0.05);
  }
  const song = cur.song, st = 60 / song.bpm / 4;
  while (nextT < AC.currentTime + 0.15) {
    playStep(song, step, nextT, st);
    nextT += st; step++;
  }
}
function playStep(song, i, t, st) {
  const M = musicGain, L = song.prog.length, s = i % 16, b = Math.floor(i / 16) % L, idx = i % (L * 16);
  const mel = song.mel, ch = song.prog[b];
  // 旋律
  if (mel[idx] != null) {
    let len = 1; while (len < 6 && mel[(idx + len) % mel.length] == null) len++;
    const dur = song.energy === 'calm' ? len * st * 0.95 : Math.min(len, 2) * st * 0.8;
    const vol = song.lead === 'sawtooth' ? 0.045 : song.lead === 'square' ? 0.05 : 0.09;
    tone(M, song.lead, midiHz(degMidi(song, mel[idx], 1)), 0, t, dur, vol, 0.01);
    if (song.lead === 'sine') tone(M, 'sine', midiHz(degMidi(song, mel[idx], 2)), 0, t, dur * 0.6, 0.025);
  }
  // 琶音
  const arpEvery = song.energy === 'battle' ? 1 : 2;
  if (s % arpEvery === 0) {
    const k = (s / arpEvery) % 4, d = [ch, ch + 2, ch + 4, ch + 2][k];
    tone(M, song.energy === 'battle' ? 'square' : 'triangle', midiHz(degMidi(song, d, 0)), 0, t, st * arpEvery * 0.8, song.energy === 'battle' ? 0.018 : 0.035);
  }
  // 低音
  const bassHit = song.energy === 'battle' ? s % 2 === 0 : song.energy === 'lively' ? s % 4 === 0 : s % 8 === 0;
  if (bassHit) {
    const d = song.energy === 'battle' && s % 4 === 2 ? ch + 4 : ch;
    tone(M, 'triangle', midiHz(degMidi(song, d, -1)), 0, t, st * (song.energy === 'calm' ? 7 : song.energy === 'battle' ? 1.8 : 3.5), 0.12);
  }
  // 鼓
  const dr = song.drums;
  if (dr >= 1 && s % 4 === 2) noise(M, t, 0.03, 0.06, 'highpass', 7000);
  if (dr >= 2 && (s === 0 || s === 8 || (dr >= 3 && (s === 6 || s === 10)))) tone(M, 'sine', 140, 40, t, 0.14, 0.35);
  if (dr >= 2 && (s === 4 || s === 12)) noise(M, t, 0.12, dr >= 3 ? 0.3 : 0.18, 'bandpass', 1800, 900, 0.8);
  if (dr >= 3 && s % 2 === 1) noise(M, t, 0.02, 0.05, 'highpass', 8000);
}
