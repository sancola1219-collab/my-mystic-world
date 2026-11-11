const LEVEL_CAP = 999; // 等級上限（使用者要求提高）
// ===== 遊戲資料：屬性、招式、怪物、道具 =====

const TYPES = {
  火: { c: '#ff6a2a', s: ['木', '冰', '鋼'], w: ['火', '水', '地'] },
  水: { c: '#3fa0ff', s: ['火', '地'], w: ['水', '木', '冰'] },
  木: { c: '#5fcf4a', s: ['水', '地'], w: ['火', '木', '風', '鋼'] },
  雷: { c: '#ffd23a', s: ['水', '風', '鋼'], w: ['雷', '地', '木'] },
  冰: { c: '#8fe8ff', s: ['木', '風', '地'], w: ['火', '冰', '鋼', '水'] },
  風: { c: '#7fe0c8', s: ['木', '鬥'], w: ['鋼', '雷', '冰'] },
  地: { c: '#c8963c', s: ['火', '雷', '鋼'], w: ['木', '風'] },
  鋼: { c: '#a8b4c4', s: ['冰', '地', '幻'], w: ['火', '水', '雷', '鋼'] },
  光: { c: '#ffe680', s: ['暗', '靈'], w: ['光', '鋼'] },
  暗: { c: '#8a5cd0', s: ['靈', '幻'], w: ['暗', '鬥', '光'] },
  靈: { c: '#c890ff', s: ['靈', '幻'], w: ['暗', '光'] },
  幻: { c: '#ff8fd8', s: ['鬥', '靈'], w: ['鋼', '幻', '暗'] },
  鬥: { c: '#e8a070', s: ['鋼', '冰', '暗', '地'], w: ['風', '幻', '靈'] },
};

function typeMult(atkType, defTypes) {
  let m = 1;
  for (const d of defTypes) {
    if (TYPES[atkType].s.includes(d)) m *= 2;
    if (TYPES[atkType].w.includes(d)) m *= 0.5;
  }
  return m;
}

// e: 效果。burn/poison/par/sleep/conf: 機率；self/foe: 能力變化；heal: 回復比例；drain: 吸取比例
// multi: [最少, 最多]；prio: 先制；recoil: 反傷比例；cure: 解除自身異常；crit: 高爆擊
const MOVES = {
  tackle:      { n: '衝撞', t: '鬥', p: 40, a: 100, pp: 35, d: '用身體全力撞向對手。' },
  struggle:    { n: '掙扎', t: '鬥', p: 50, a: 100, pp: 99, e: { recoil: 0.25 }, d: '招式用盡時的最後手段。' },
  growl:       { n: '嚇阻', t: '幻', p: 0, a: 100, pp: 30, e: { foe: { atk: -1 } }, d: '發出威嚇，降低對手攻擊。' },
  // 冠捲甜靈
  sweetSmile:  { n: '甜笑祝福', t: '光', p: 0, a: 100, pp: 10, e: { heal: 0.4, self: { def: 1 } }, d: '散發溫暖光芒，回復體力並提升防禦。' },
  curlHalo:    { n: '捲捲光環', t: '光', p: 55, a: 100, pp: 15, e: { heal: 0.15, cure: 1 }, d: '釋放甜光光環攻擊，並淨化自身異常。' },
  honeyWave:   { n: '蜜意甜波', t: '光', p: 75, a: 95, pp: 10, e: { foeChance: 0.4, foe: { spd: -1 } }, d: '甜蜜能量波動，可能使對手陷入甜蜜遲緩。' },
  flash:       { n: '閃光爆破', t: '光', p: 90, a: 90, pp: 5, d: '凝聚強光後一口氣爆發。' },
  lightShield: { n: '光之護盾', t: '光', p: 0, a: 100, pp: 10, e: { self: { def: 2 } }, d: '展開光盾，大幅提升防禦。' },
  // 柚輪觸心
  tendrilBind: { n: '觸絲束縛', t: '靈', p: 45, a: 100, pp: 20, e: { foe: { spd: -1 } }, d: '以觸絲纏繞敵人，降低速度。' },
  coreTug:     { n: '靈核牽引', t: '靈', p: 65, a: 100, pp: 15, e: { drain: 0.5 }, d: '連結目標，牽引並吸取能量。' },
  mindWave:    { n: '意波共振', t: '靈', p: 0, a: 100, pp: 10, e: { heal: 0.25, self: { atk: 1 } }, d: '釋放意念波，回復並提升攻擊。' },
  illusion:    { n: '幻象迷陣', t: '幻', p: 0, a: 85, pp: 10, e: { conf: 1 }, d: '佈下幻象，使對手混亂。' },
  // 星輪懸偶
  bellRing:    { n: '懸偶鐘鳴', t: '鋼', p: 60, a: 100, pp: 15, e: { foeChance: 0.5, foe: { spd: -1 } }, d: '敲響星球鐘聲，干擾敵人時間感知。' },
  orbitBind:   { n: '軌道束縛', t: '幻', p: 70, a: 95, pp: 10, e: { foe: { spd: -1 } }, d: '展開星軌法陣，拘束目標。' },
  starBeam:    { n: '星輪投射', t: '光', p: 95, a: 90, pp: 5, d: '高速旋轉輪心，投射星輪光束。' },
  predict:     { n: '預兆印記', t: '幻', p: 0, a: 100, pp: 10, e: { foe: { def: -2 } }, d: '刻下預兆，大幅降低對手防禦。' },
  // 橘鋼戰車獸
  magmaRoar:   { n: '熔火轟鳴', t: '火', p: 70, a: 100, pp: 15, e: { burn: 0.3 }, d: '積蓄烈焰後爆發，可能造成灼傷。' },
  toothCannon: { n: '烈齒砲擊', t: '火', p: 95, a: 85, pp: 8, e: { burn: 0.2 }, d: '雙側砲口噴射熔岩與鋼屑。' },
  steelCharge: { n: '鋼軀衝陣', t: '鋼', p: 110, a: 90, pp: 5, e: { recoil: 0.25 }, d: '全速撞擊，但自己也會受到反衝。' },
  // 青窗載靈
  waterSlap:   { n: '水浪拍擊', t: '水', p: 50, a: 100, pp: 25, d: '捲起水浪拍打對手。' },
  windowRam:   { n: '窗殼衝撞', t: '水', p: 80, a: 95, pp: 10, d: '化為水藍衝擊，以窗殼撞擊敵人。' },
  shadowWalk:  { n: '側影同行', t: '靈', p: 0, a: 100, pp: 10, e: { self: { spd: 2 } }, d: '紫影同伴貼附，大幅提升速度。' },
  sinkStep:    { n: '沉步護行', t: '木', p: 0, a: 100, pp: 10, e: { heal: 0.35, self: { def: 1 } }, d: '展開水木結界，回復並提升防禦。' },
  // 百符笑使
  fireCharm:   { n: '炎符飛彈', t: '火', p: 40, a: 100, pp: 25, e: { prio: 1 }, d: '迅速擲出炎符，必定先手。' },
  charmShot:   { n: '符靈拋射', t: '火', p: 65, a: 100, pp: 15, e: { burn: 0.2 }, d: '發射多枚符靈追蹤敵人。' },
  maskWard:    { n: '笑面護咒', t: '風', p: 0, a: 100, pp: 10, e: { heal: 0.35, cure: 1 }, d: '展開笑面結界，回復並驅散異常。' },
  hundredDance:{ n: '百相巡舞', t: '風', p: 22, a: 95, pp: 10, e: { multi: [2, 5], conf: 0.1 }, d: '召喚幻影共舞，造成多段傷害。' },
  // 六七方殼獸
  dropShot:    { n: '水滴彈射', t: '水', p: 40, a: 100, pp: 25, e: { prio: 1 }, d: '彈出水滴，必定先手。' },
  squareSlam:  { n: '方塊重擊', t: '鋼', p: 75, a: 95, pp: 10, d: '用堅硬的方殼重重砸下。' },
  jumpDodge:   { n: '跳躍閃避', t: '風', p: 0, a: 100, pp: 10, e: { self: { spd: 2 } }, d: '短足一蹬，大幅提升速度。' },
  digitGuard:  { n: '數字守護', t: '幻', p: 0, a: 100, pp: 10, e: { self: { atk: 1, def: 1 } }, d: '「67」紋章發光，提升攻擊與防禦。' },
  tidalBox:    { n: '方殼潮湧', t: '水', p: 90, a: 90, pp: 5, d: '殼內儲存的水能一口氣湧出。' },
  // 巨顎方門獸
  neckReach:   { n: '深淵連頸', t: '水', p: 70, a: 100, pp: 15, e: { prio: 1 }, d: '從遠處伸頸突襲，必定先手。' },
  sawFang:     { n: '鋸齒裂牙', t: '暗', p: 75, a: 100, pp: 15, e: { foeChance: 0.4, foe: { def: -1 } }, d: '倒刺牙齒撕裂骨甲。' },
  topEye:      { n: '頂眼鎖定', t: '暗', p: 0, a: 100, pp: 10, e: { self: { atk: 2 } }, d: '頂眼鎖定獵物，大幅提升攻擊。' },
  squareJaw:   { n: '方門巨顎', t: '暗', p: 120, a: 85, pp: 5, d: '超大角度張合，吞入整體獵物。' },
  // 裂口藍魔
  mouthRaid:   { n: '附口突襲', t: '暗', p: 55, a: 100, pp: 20, e: { poison: 0.3 }, d: '附肢之口噴射黏液，可能中毒。' },
  deepBite:    { n: '深喉噬咬', t: '暗', p: 85, a: 100, pp: 10, e: { foeChance: 0.3, foe: { def: -1 } }, d: '張開巨口撕裂吞噬。' },
  demonRoar:   { n: '魔藍震吼', t: '靈', p: 80, a: 100, pp: 10, e: { conf: 0.25 }, d: '發出深淵震吼，可能使對手混亂。' },
  // 噬厄哭偶
  dollBind:    { n: '哭偶束縛', t: '靈', p: 50, a: 100, pp: 15, e: { foe: { spd: -2 } }, d: '臉飾化作咒縛之線，壓制行動。' },
  curseLink:   { n: '災念連結', t: '暗', p: 40, a: 95, pp: 10, e: { poison: 1 }, d: '把痛苦分散給敵方，必定中毒。' },
  wailScreen:  { n: '悲鳴護幕', t: '靈', p: 0, a: 100, pp: 10, e: { self: { def: 2 } }, d: '展開哀怨結界，大幅提升防禦。' },
  doomMaw:     { n: '厄口吞噬', t: '暗', p: 95, a: 90, pp: 5, e: { drain: 0.3 }, d: '張開巨口吸走前方能量。' },
  // 殼笑守靈 / 碧殼心靈
  shellWall:   { n: '守殼護壁', t: '地', p: 0, a: 100, pp: 10, e: { self: { def: 2 } }, d: '展開圓弧防壁。' },
  smileCalm:   { n: '微笑安撫', t: '光', p: 0, a: 100, pp: 10, e: { heal: 0.3, cure: 1 }, d: '散發溫和氣場，消除恐懼與混亂。' },
  sproutRegen: { n: '韌芽再生', t: '木', p: 0, a: 100, pp: 8, e: { heal: 0.5 }, d: '啟動殼內生命力，大幅回復。' },
  shellRam:    { n: '殼撞反擊', t: '地', p: 80, a: 100, pp: 10, d: '以厚殼短距離衝撞。' },
  shellGuard:  { n: '靈殼守護', t: '地', p: 0, a: 100, pp: 15, e: { self: { def: 1 } }, d: '展開靈殼屏障，提升防禦。' },
  warmHeal:    { n: '暖心回復', t: '光', p: 0, a: 100, pp: 10, e: { heal: 0.4 }, d: '釋放溫暖靈光回復生命。' },
  tailBounce:  { n: '旋尾反彈', t: '靈', p: 55, a: 100, pp: 15, e: { conf: 0.2 }, d: '以靈尾旋轉反彈，可能使對手混亂。' },
  // 禮章幻靈
  surpriseBox: { n: '驚喜開匣', t: '幻', p: 60, a: 100, pp: 15, e: { conf: 0.3 }, d: '瞬間彈出靈體，可能混亂。' },
  tentacleHug: { n: '章觸纏抱', t: '幻', p: 60, a: 100, pp: 15, e: { drain: 0.5 }, d: '纏繞目標並吸收能量。' },
  fountain:    { n: '幻彩噴泉', t: '水', p: 22, a: 95, pp: 10, e: { multi: [2, 5] }, d: '從入口噴出幻彩能量，多段傷害。' },
  // 蒼角武靈
  galeStep:    { n: '疾風踏步', t: '風', p: 40, a: 100, pp: 20, e: { prio: 1, self: { spd: 1 } }, d: '踏風而行，先手攻擊並加速。' },
  hornSlash:   { n: '角弧斬', t: '風', p: 85, a: 95, pp: 10, e: { crit: 1 }, d: '以巨角劃出月牙斬，容易命中要害。' },
  bladeSpin:   { n: '雙刃旋舞', t: '鬥', p: 25, a: 95, pp: 10, e: { multi: [2, 4] }, d: '雙臂刃械高速旋轉，連續斬擊。' },
  // 菇樂小靈
  capShot:     { n: '菇帽飛彈', t: '木', p: 55, a: 100, pp: 20, d: '甩出光點孢子攻擊。' },
  sporeGuard:  { n: '孢光庇護', t: '光', p: 0, a: 100, pp: 10, e: { self: { def: 1 }, cure: 1 }, d: '釋放暖孢子光，提升防禦並淨化。' },
  smileCheer:  { n: '笑臉鼓舞', t: '光', p: 0, a: 100, pp: 10, e: { heal: 0.3, self: { atk: 1 } }, d: '腹部笑臉閃耀，回復並鼓舞士氣。' },
  joyStep:     { n: '歡樂躍步', t: '木', p: 0, a: 100, pp: 10, e: { heal: 0.2, self: { spd: 1 } }, d: '輕盈跳躍，回復並加速。' },
  forestBless: { n: '森靈加護', t: '木', p: 90, a: 100, pp: 8, e: { drain: 0.3 }, d: '借森林之力猛擊，並吸取生命。' },
  // 藍棘拳靈 / 拳衛
  glareWave:   { n: '怒目震波', t: '鬥', p: 0, a: 100, pp: 15, e: { foe: { atk: -1, spd: -1 } }, d: '怒視敵人，降低攻擊與速度。' },
  spikePunch:  { n: '棘拳連打', t: '鬥', p: 18, a: 100, pp: 15, e: { multi: [2, 5], par: 0.1 }, d: '連續出拳，可能麻痺對手。' },
  thunderStep: { n: '電步閃身', t: '雷', p: 45, a: 100, pp: 20, e: { prio: 1 }, d: '化為電光移動，先手反擊。' },
  thunderPunch:{ n: '雷光直拳', t: '雷', p: 80, a: 100, pp: 10, e: { par: 0.25 }, d: '帶電的直拳，容易麻痺。' },
  blueThrust:  { n: '藍鋒突刺', t: '鋼', p: 80, a: 100, pp: 10, e: { foeChance: 0.5, foe: { def: -1 } }, d: '全身尖棘前傾突進，附加破甲。' },
  whirlCrown:  { n: '旋風護冠', t: '風', p: 0, a: 100, pp: 10, e: { self: { def: 1, spd: 1 } }, d: '棘冠高速旋轉形成氣流。' },
  warBloom:    { n: '戰意爆芽', t: '鬥', p: 0, a: 100, pp: 10, e: { self: { atk: 2 } }, d: '進入高昂戰意，大幅提升攻擊。' },
  braveRush:   { n: '勇突亂擊', t: '鬥', p: 115, a: 90, pp: 5, e: { recoil: 0.25 }, d: '不服輸的一拳，自己也會受傷。' },
  // 流空騎梭
  windBlade:   { n: '風刃斬', t: '風', p: 55, a: 100, pp: 20, d: '以風刃切開空氣。' },
  cloudGlide:  { n: '雲翼滑行', t: '風', p: 0, a: 100, pp: 10, e: { self: { spd: 2 } }, d: '展開隱形氣翼，大幅加速。' },
  windBurst:   { n: '破風突進', t: '風', p: 90, a: 95, pp: 10, d: '凝聚氣流於前端，極速突擊。' },
  shuttleSync: { n: '騎梭共鳴', t: '風', p: 0, a: 100, pp: 10, e: { self: { atk: 1, spd: 1 }, cure: 1 }, d: '與騎手心意相通，全面提升。' },
  // 槍尾巡獵獸
  longNeck:    { n: '長頸偵索', t: '木', p: 0, a: 100, pp: 15, e: { self: { atk: 1 } }, d: '伸長頸部鎖定獵物，提升攻擊。' },
  tailSmash:   { n: '尾鞭重擊', t: '鋼', p: 70, a: 100, pp: 15, d: '以尾部橫掃重擊敵人。' },
  tailCannon:  { n: '機炮獵火', t: '木', p: 85, a: 95, pp: 10, d: '發射尖刺彈，造成穿透傷害。' },
  steadyFeet:  { n: '穩行機足', t: '鋼', p: 0, a: 100, pp: 10, e: { self: { def: 1, spd: 1 } }, d: '強化關節，提升防禦與速度。' },
  // 蝶結吞尾蟲
  vineWhip:    { n: '藤鞭纏繞', t: '木', p: 50, a: 100, pp: 20, e: { foeChance: 0.3, foe: { spd: -1 } }, d: '以藤鞭纏繞對手。' },
  bowTaunt:    { n: '蝶結示威', t: '幻', p: 0, a: 75, pp: 10, e: { sleep: 1 }, d: '雙蝶結閃爍釋放迷香，使對手睡著。' },
  poisonTail:  { n: '毒旋尾節', t: '暗', p: 60, a: 100, pp: 15, e: { poison: 0.4 }, d: '尾節噴吐毒液。' },
  squareChomp: { n: '方顎巨口', t: '暗', p: 85, a: 95, pp: 10, d: '張口即吞，咬合力驚人。' },
  groundAmbush:{ n: '地底突襲', t: '地', p: 85, a: 95, pp: 10, d: '從地底竄出突襲。' },
};

// 怪物資料：b = [HP, 攻擊, 防禦, 速度]
const MONS = {
  1:  { n: '冠捲甜靈', t: ['光'], b: [60, 50, 60, 55], cr: 150, xp: 60, h: '0.45 m', w: '2.3 kg', hab: '甜光林地的糕點花叢',
        desc: '捲捲冠冕下的微甜祝福，甜蜜笑容中藏有奇蹟。',
        learn: [[1, 'tackle'], [1, 'sweetSmile'], [7, 'curlHalo'], [14, 'honeyWave'], [24, 'lightShield'], [30, 'flash']] },
  2:  { n: '柚輪觸心', t: ['靈', '幻'], b: [62, 62, 52, 68], cr: 100, xp: 75, h: '1.1 m', w: '8.2 kg', hab: '幽林深處、古核遺跡',
        desc: '以觸絲連結靈核之心，能牽引能量與意念的異色精怪。',
        learn: [[1, 'tackle'], [1, 'tendrilBind'], [8, 'coreTug'], [15, 'mindWave'], [22, 'illusion']] },
  3:  { n: '星輪懸偶', t: ['鋼', '光'], b: [72, 82, 88, 58], cr: 45, xp: 130, h: '1.8 m', w: '26.1 kg', hab: '觀星塔、時鐘古殿',
        desc: '以星輪為心核的懸浮機關靈，會在夜裡測量命運的轉向。',
        learn: [[1, 'tackle'], [1, 'bellRing'], [12, 'orbitBind'], [20, 'starBeam'], [28, 'predict']] },
  4:  { n: '橘鋼戰車獸', t: ['火', '鋼'], b: [95, 108, 100, 42], cr: 25, xp: 170, h: '3.8 m', w: '18.7 t', hab: '熔岩戰場、廢棄工堡',
        desc: '以鋼骨怒火驅動的衝鋒魔械，轟鳴中撕裂陣線。',
        learn: [[1, 'tackle'], [1, 'magmaRoar'], [15, 'toothCannon'], [25, 'steelCharge']] },
  5:  { n: '青窗載靈', t: ['水', '木'], b: [82, 70, 88, 45], cr: 90, xp: 110, h: '1.1 m', w: '186.2 kg', hab: '青霧潮澤、古道遺境',
        desc: '背負綠窗殼的漫遊精怪，與紫影同伴一體共行。',
        learn: [[1, 'tackle'], [1, 'waterSlap'], [9, 'windowRam'], [15, 'shadowWalk'], [21, 'sinkStep']] },
  6:  { n: '百符笑使', t: ['火', '風'], b: [55, 66, 50, 66], cr: 45, xp: 70, h: '1.2 m', w: '13.7 kg', hab: '符靈之森、祈祠遺域',
        desc: '總帶著笑容與咒符起舞的靈巧術士，能驅使小靈與護符應戰。',
        learn: [[1, 'tackle'], [1, 'growl'], [5, 'fireCharm'], [10, 'charmShot'], [16, 'maskWard'], [22, 'hundredDance'], [30, 'illusion']] },
  7:  { n: '六七方殼獸', t: ['水', '光'], b: [62, 58, 64, 50], cr: 45, xp: 70, h: '0.8 m', w: '22.6 kg', hab: '星夜水岸',
        desc: '盒形異獸，刻有數字紋章「67」的方形精靈。',
        learn: [[1, 'tackle'], [1, 'growl'], [5, 'dropShot'], [9, 'waterSlap'], [13, 'lightShield'], [17, 'squareSlam'], [22, 'jumpDodge'], [26, 'digitGuard'], [32, 'tidalBox']] },
  8:  { n: '巨顎方門獸', t: ['暗', '水'], b: [130, 120, 105, 75], cr: 5, xp: 300, h: '22.7 m', w: '195.3 t', hab: '深淵之門',
        desc: '深淵異形，方口裂牙的吞噬者。傳說牠醒來時會吞下整片大陸。',
        learn: [[1, 'neckReach'], [1, 'sawFang'], [1, 'topEye'], [1, 'squareJaw']] },
  9:  { n: '裂口藍魔', t: ['暗', '靈'], b: [75, 95, 70, 72], cr: 45, xp: 140, h: '2.6 m', w: '196.7 kg', hab: '深淵裂縫、扭曲夜境',
        desc: '張著深淵巨口的異界兇靈，會以附肢之口一同吞噬獵物。',
        learn: [[1, 'tackle'], [1, 'mouthRaid'], [20, 'deepBite'], [27, 'demonRoar']] },
  10: { n: '噬厄哭偶', t: ['暗', '幻'], b: [82, 92, 82, 60], cr: 30, xp: 160, h: '1.6 m', w: '38.4 kg', hab: '吞厄之門',
        desc: '巨口詛咒的悲鳴操偶、吞厄之門的看守者。',
        learn: [[1, 'dollBind'], [1, 'curseLink'], [24, 'wailScreen'], [30, 'doomMaw']] },
  11: { n: '殼笑守靈', t: ['地', '木'], b: [100, 75, 115, 32], cr: 45, xp: 150, h: '1.2 m', w: '35.7 kg', hab: '古森遺跡',
        desc: '微笑之殼，沉穩包覆萬物的守護精靈。',
        learn: [[1, 'tackle'], [1, 'shellWall'], [1, 'smileCalm'], [20, 'shellRam'], [28, 'sproutRegen']] },
  12: { n: '禮章幻靈', t: ['幻', '水'], b: [62, 74, 56, 74], cr: 80, xp: 100, h: '1.6 m', w: '18.2 kg', hab: '玩具閣樓、月夜倉庫',
        desc: '藏身於奇禮匣中的章觸精靈，總在驚喜與驚嚇之間出現。',
        learn: [[1, 'tackle'], [1, 'surpriseBox'], [11, 'tentacleHug'], [18, 'fountain'], [26, 'illusion']] },
  13: { n: '蒼角武靈', t: ['鬥', '風'], b: [66, 98, 60, 98], cr: 45, xp: 140, h: '1.5 m', w: '17.6 kg', hab: '草原祭台、風旋山谷',
        desc: '頭頂巨角、雙臂化刃的戰鬥精靈，動作輕快又充滿自信。',
        learn: [[1, 'tackle'], [1, 'galeStep'], [18, 'hornSlash'], [24, 'bladeSpin'], [30, 'warBloom']] },
  14: { n: '菇樂小靈', t: ['木', '光'], b: [60, 52, 58, 50], cr: 45, xp: 70, h: '1.1 m', w: '16.8 kg', hab: '甜光森林',
        desc: '森林微笑使者，把歡笑藏在肚肚裡的小花菇。',
        learn: [[1, 'tackle'], [1, 'growl'], [5, 'capShot'], [10, 'sporeGuard'], [15, 'smileCheer'], [20, 'joyStep'], [27, 'forestBless']] },
  15: { n: '藍棘拳靈', t: ['鬥', '雷'], b: [50, 68, 45, 72], cr: 140, xp: 65, h: '1.0 m', w: '11.8 kg', hab: '風化石原、訓練遺跡',
        desc: '看似沉默的棘髮小戰靈，出拳時卻快得像電光。',
        evo: { lv: 22, to: 16 },
        learn: [[1, 'tackle'], [1, 'glareWave'], [5, 'spikePunch'], [11, 'thunderStep'], [18, 'thunderPunch']] },
  16: { n: '藍棘拳衛', t: ['風', '鋼'], b: [75, 100, 78, 92], cr: 45, xp: 160, h: '1.25 m', w: '22.1 kg', hab: '古代戰場前線',
        desc: '以棘拳守住前線的倔強精靈，小小身軀也能爆發不服輸的一拳。',
        learn: [[1, 'spikePunch'], [1, 'blueThrust'], [1, 'whirlCrown'], [26, 'warBloom'], [32, 'braveRush']] },
  17: { n: '流空騎梭', t: ['風'], b: [66, 82, 60, 108], cr: 60, xp: 130, h: '1.4 m', w: '22.5 kg', hab: '高空氣流、崖頂航道',
        desc: '乘風破雲的飛梭靈獸，會選擇勇敢的騎手並與其共鳴。',
        learn: [[1, 'tackle'], [1, 'windBlade'], [10, 'cloudGlide'], [20, 'windBurst'], [26, 'shuttleSync']] },
  18: { n: '碧殼心靈', t: ['地', '靈'], b: [58, 42, 72, 32], cr: 160, xp: 60, h: '1.1 m', w: '14.4 kg', hab: '安眠樹洞、靜謐草原',
        desc: '以柔和靈光守護同伴的殼靈，內心住著一張永遠微笑的臉。',
        evo: { lv: 20, to: 11 },
        learn: [[1, 'tackle'], [1, 'shellGuard'], [6, 'warmHeal'], [12, 'tailBounce']] },
  19: { n: '槍尾巡獵獸', t: ['木', '鋼'], b: [76, 88, 82, 55], cr: 60, xp: 135, h: '2.1 m', w: '156.4 kg', hab: '荒野叢林、衛戍營區',
        desc: '機尾獵行，兼具追蹤與火力的荒野守備獸。',
        learn: [[1, 'tackle'], [1, 'longNeck'], [14, 'tailSmash'], [18, 'tailCannon'], [24, 'steadyFeet']] },
  20: { n: '蝶結吞尾蟲', t: ['木', '暗'], b: [72, 82, 66, 60], cr: 80, xp: 115, h: '1.8 m', w: '76.3 kg', hab: '幽暗林底',
        desc: '長體異獸，方顎巨口的纏行者。',
        learn: [[1, 'vineWhip'], [1, 'bowTaunt'], [11, 'poisonTail'], [16, 'squareChomp'], [22, 'groundAmbush']] },
};

const ITEMS = {
  potion:   { n: '甜光露', price: 100, d: '回復 30 點體力。', use: 'heal', v: 30 },
  superPot: { n: '蜜光露', price: 300, d: '回復 80 點體力。', use: 'heal', v: 80 },
  fullPot:  { n: '全愈露', price: 900, d: '完全回復體力。', use: 'heal', v: 9999 },
  cure:     { n: '淨化花', price: 150, d: '解除所有異常狀態。', use: 'cure' },
  revive:   { n: '復甦羽', price: 1200, d: '使昏厥的夥伴復活並回復一半體力。', use: 'revive' },
  charm:    { n: '靈符', price: 200, d: '捕捉野生怪物用的符咒。', use: 'ball', v: 1 },
  goldCharm:{ n: '金紋靈符', price: 600, d: '捕捉率較高的靈符。', use: 'ball', v: 1.8 },
  starCharm:{ n: '星紋靈符', price: 0, d: '璃夜贈送的傳說靈符，捕捉率極高。', use: 'ball', v: 4 },
};

const STATUS_NAME = { burn: '灼傷', poison: '中毒', par: '麻痺', sleep: '睡眠' };
const STAT_NAME = { atk: '攻擊', def: '防禦', spd: '速度' };

// ===== 怪物實例 =====
function expForLevel(l) { return Math.floor(0.8 * l * l * l); }

function calcStats(m) {
  const b = MONS[m.id].b, L = m.level;
  m.maxHp = Math.floor((Math.floor(b[0] * 2 * L / 100) + L + 10) * 3 * 1.4);
  m.atk = Math.floor((Math.floor(b[1] * 2 * L / 100) + 5) * 1.5);
  m.def = Math.floor((Math.floor(b[2] * 2 * L / 100) + 5) * 1.25);
  m.spd = Math.floor((Math.floor(b[3] * 2 * L / 100) + 5) * 1.3);
}

function makeMon(id, level) {
  const m = { id, level, exp: expForLevel(level), status: null, moves: [] };
  calcStats(m);
  m.hp = m.maxHp;
  const learnable = MONS[id].learn.filter(([l]) => l <= level).map(([, mv]) => mv);
  const uniq = [...new Set(learnable)].slice(-4);
  m.moves = uniq.map(mv => ({ id: mv, pp: MOVES[mv].pp }));
  return m;
}

function monName(m) { return m.nick || MONS[m.id].n; }
