// ===== 擴充圖鑑：No.21 ~ No.100 =====
// 依照原畫的風格（日常物件 + 簡單表情，可愛中帶一點詭異），用「身體形狀 + 表情 + 配件」組合出新幻靈。

// ---- 各屬性的通用招式 ----
const TYPE_MOVES = {
  火: [['fire1', '火花彈', 40, 100, {}], ['fire2', '烈焰衝', 70, 100, { burn: 0.1 }], ['fire3', '爆炎轟', 100, 85, { burn: 0.2 }], ['fire0', '灼熱氣息', 0, 85, { burn: 1 }]],
  水: [['water1', '水泡', 40, 100, {}], ['water2', '水流刃', 70, 100, {}], ['water3', '怒濤', 100, 85, {}], ['water0', '霧幕', 0, 100, { foe: { atk: -1 } }]],
  木: [['wood1', '葉片飛刀', 40, 100, {}], ['wood2', '藤蔓鞭', 70, 100, { drain: 0.2 }], ['wood3', '森之怒', 100, 85, {}], ['wood0', '花粉', 0, 70, { sleep: 1 }]],
  雷: [['elec1', '電擊', 40, 100, { par: 0.1 }], ['elec2', '雷光球', 70, 100, { par: 0.2 }], ['elec3', '落雷', 105, 80, { par: 0.3 }], ['elec0', '充電', 0, 100, { self: { atk: 1, spd: 1 } }]],
  冰: [['ice1', '冰礫', 40, 100, {}], ['ice2', '冰霜牙', 70, 100, { foeChance: 0.3, foe: { spd: -1 } }], ['ice3', '暴風雪', 105, 80, {}], ['ice0', '結霜', 0, 90, { foe: { spd: -2 } }]],
  風: [['wind1', '微風斬', 40, 100, { prio: 1 }], ['wind2', '旋風', 70, 100, {}], ['wind3', '颶風', 100, 85, { conf: 0.2 }], ['wind0', '順風', 0, 100, { self: { spd: 2 } }]],
  地: [['earth1', '擲石', 40, 100, {}], ['earth2', '地裂', 70, 100, {}], ['earth3', '大地震擊', 100, 90, {}], ['earth0', '沙塵', 0, 100, { foe: { atk: -1 } }]],
  鋼: [['steel1', '鐵頭', 40, 100, {}], ['steel2', '鋼鐵拳', 70, 100, {}], ['steel3', '重金屬砲', 100, 85, {}], ['steel0', '鐵壁', 0, 100, { self: { def: 2 } }]],
  光: [['light1', '光彈', 40, 100, {}], ['light2', '聖光束', 70, 100, {}], ['light3', '天光審判', 100, 90, {}], ['light0', '祈光', 0, 100, { heal: 0.5 }]],
  暗: [['dark1', '暗影爪', 40, 100, {}], ['dark2', '深淵咬', 70, 100, { foeChance: 0.2, foe: { def: -1 } }], ['dark3', '夜幕吞噬', 100, 85, { drain: 0.25 }], ['dark0', '詭笑', 0, 100, { foe: { def: -2 } }]],
  靈: [['ghost1', '靈火', 40, 100, {}], ['ghost2', '魂波', 70, 100, {}], ['ghost3', '幽冥衝擊', 100, 85, { conf: 0.2 }], ['ghost0', '附身', 0, 90, { conf: 1 }]],
  幻: [['fairy1', '幻光', 40, 100, {}], ['fairy2', '夢境波', 70, 100, { conf: 0.1 }], ['fairy3', '萬花鏡', 100, 85, {}], ['fairy0', '催眠曲', 0, 65, { sleep: 1 }]],
  鬥: [['fight1', '連環拳', 18, 100, { multi: [2, 5] }], ['fight2', '飛踢', 75, 95, {}], ['fight3', '爆裂拳', 115, 85, { recoil: 0.2 }], ['fight0', '集氣', 0, 100, { self: { atk: 2 } }]],
};
for (const t in TYPE_MOVES) for (const [id, n, p, a, e] of TYPE_MOVES[t]) {
  MOVES[id] = { n, t, p, a, pp: p >= 100 ? 5 : p >= 70 ? 10 : p ? 25 : 10, e: Object.keys(e).length ? e : undefined, d: p ? `${t}屬性的攻擊招式。` : `${t}屬性的變化招式。` };
}

// ---- 新幻靈定義 ----
// [編號, 名字, 屬性, 身體, 主色, 副色, 表情, 配件, 階段(1/2/3/L), 定位, 招牌招式, 說明, 進化(等級→編號)]
const NEW_MONS = [
  // 御三家的進化
  [21, '菇樂花靈', ['木', '光'], 'base:14', '', '', '', ['petals', 'sparks'], 2, 'bal', '花開笑浪', '菇帽開出花瓣的森林使者，笑聲能讓枯木發芽。', [34, 22]],
  [22, '菇冠森王', ['木', '光'], 'base:14', '', '', '', ['petals', 'crown', 'halo', 'sparks'], 3, 'hp', '森冠祝福', '戴著森林王冠的菇王，肚子上的笑臉能照亮整座森林。'],
  [23, '千符狐使', ['火', '風'], 'base:6', '', '', '', ['flame', 'tail'], 2, 'spd', '千符狐火', '千張符咒繞身飛舞，笑臉之下藏著狐火般的機靈。', [34, 24]],
  [24, '萬符天師', ['火', '風'], 'base:6', '', '', '', ['flame', 'halo', 'wings'], 3, 'atk', '萬符天降', '能同時操控萬張符咒的天師，一揮手便是一場火之雨。'],
  [25, '六七堡殼獸', ['水', '光'], 'base:7', '', '', '', ['spikes'], 2, 'def', '六七潮壁', '方殼長出了堡壘般的稜角，「67」紋章越來越亮。', [34, 26]],
  [26, '六七要塞獸', ['水', '光'], 'base:7', '', '', '', ['spikes', 'crown', 'halo'], 3, 'def', '六七天壘', '化身為移動要塞的方殼獸，紋章之光能守護整支隊伍。'],
  // 原畫幻靈的進化
  [27, '冠捲甜后', ['光', '幻'], 'base:1', '', '', '', ['wings', 'halo', 'sparks'], 3, 'hp', '甜后加冕', '捲捲冠冕長成皇冠的甜靈女王，笑容是最甜的奇蹟。'],
  [28, '柚輪靈主', ['靈', '幻'], 'base:2', '', '', '', ['orbs', 'halo'], 3, 'spd', '萬象牽引', '以千條觸絲連結萬物的靈核之主。'],
  [29, '星輪天儀', ['鋼', '光'], 'base:3', '', '', '', ['orbs', 'halo', 'sparks'], 3, 'def', '天儀定命', '能測量整片星空轉向的巨大天儀。'],
  [30, '青窗靈車', ['水', '木'], 'base:5', '', '', '', ['wheels', 'sparks'], 3, 'hp', '靈車巡航', '窗殼長出車輪的載靈，能載著迷路的人回家。'],
  [31, '禮章魔術匣', ['幻', '水'], 'base:12', '', '', '', ['crown', 'sparks'], 3, 'atk', '魔術大開匣', '盒子裡永遠變得出下一個驚喜的魔術師。'],
  [32, '蒼角戰神', ['鬥', '風'], 'base:13', '', '', '', ['halo', 'wings'], 3, 'atk', '神角裂空', '雙角化為新月的戰神，一轉身便切開風暴。'],
  [33, '流空天梭', ['風', '雷'], 'base:17', '', '', '', ['wings', 'sparks'], 3, 'spd', '天梭雷翔', '能在雷雲之上航行的天之飛梭。'],
  [34, '槍尾要塞獸', ['木', '鋼'], 'base:19', '', '', '', ['spikes', 'antenna'], 3, 'def', '要塞齊射', '背上的機炮增加到三門的荒野要塞。'],
  [35, '蝶結纏王', ['木', '暗'], 'base:20', '', '', '', ['crown', 'drip'], 3, 'atk', '纏王吞天', '蝶結化為王冠的巨蟲之王。'],
  // 新的幻靈家族
  [36, '小杯泡', ['水'], 'cup', '#7ad0ff', '#f4f0e8', 'cute', ['drip'], 1, 'bal', '杯中漣漪', '住在茶杯裡的小水靈，喜歡冒泡泡。', [16, 37]],
  [37, '茶杯泉靈', ['水', '幻'], 'cup', '#4aa8f0', '#f4f0e8', 'smile', ['drip', 'sparks'], 2, 'hp', '泉湧茶香', '杯中的泉水永不乾涸，喝一口就能消除疲勞。', [34, 38]],
  [38, '壺海龍杯', ['水', '幻'], 'cup', '#2a6ad8', '#e8d8a0', 'grin', ['horns', 'tail', 'drip'], 3, 'atk', '海壺倒灌', '傳說牠倒出的水能淹沒一座城。'],
  [39, '提燈小火', ['火'], 'lantern', '#ff8a3a', '#7a2a10', 'cute', ['flame'], 1, 'bal', '燈芯一閃', '在夜路上替旅人照明的小燈籠。', [17, 40]],
  [40, '燈籠燄靈', ['火', '靈'], 'lantern', '#ff5a2a', '#5a1a10', 'dot', ['flame', 'tail'], 2, 'atk', '燄靈引路', '會把迷路的人帶到……不知道哪裡去。', [36, 41]],
  [41, '千燈祭主', ['火', '靈'], 'lantern', '#e83a2a', '#3a0a0a', 'xx', ['flame', 'orbs', 'crown'], 3, 'atk', '千燈祭火', '主持千燈祭的燄靈之主，每盞燈都是一個靈魂。'],
  [42, '頁頁書靈', ['幻'], 'book', '#c08af0', '#fff4dc', 'smile', [], 1, 'bal', '翻頁術', '喜歡被翻閱的小書，裡面寫滿了笑話。', [18, 43]],
  [43, '魔典書獸', ['幻', '光'], 'book', '#7a3ad0', '#fff0c8', 'teeth', ['legs'], 2, 'atk', '魔典封印', '書頁長出利牙的魔法書，會吃掉不讀書的人的作業。', [36, 44]],
  [44, '萬卷賢者', ['幻', '光'], 'book', '#4a1aa0', '#ffe8a0', 'cyclops', ['halo', 'orbs'], 3, 'bal', '萬卷之理', '記載了世間所有知識的賢者之書。'],
  [45, '棉花雲寶', ['風'], 'cloud', '#f4f6ff', '#a0b8e0', 'cute', [], 1, 'spd', '軟綿綿衝撞', '輕飄飄的棉花雲，抱起來很舒服。', [18, 46]],
  [46, '雷雲咕咕', ['風', '雷'], 'cloud', '#9aa8c8', '#ffe040', 'angry', ['sparks'], 2, 'spd', '咕咕雷雨', '生氣時會下雷陣雨的雲。', [36, 47]],
  [47, '雷霆雲王', ['風', '雷'], 'cloud', '#5a6080', '#ffd020', 'angry', ['sparks', 'crown', 'horns'], 3, 'atk', '雷王天怒', '統治暴風雨的雲王，一聲怒吼便是萬道雷光。'],
  [48, '小鑰仔', ['鋼'], 'key', '#e8c050', '#8a6020', 'smile', [], 1, 'spd', '開鎖術', '能打開任何鎖的小鑰匙，但常常把自己弄丟。', [26, 49]],
  [49, '鎖鑰衛士', ['鋼', '幻'], 'key', '#c8a040', '#5a3a10', 'dot', ['arms', 'chains'], 2, 'def', '千鎖封印', '守護著寶庫大門的鑰匙衛士。'],
  [50, '滴答鐘靈', ['鋼'], 'clock', '#e8dcc0', '#8a5a2a', 'smile', ['legs'], 1, 'bal', '滴答滴答', '永遠準時的小時鐘，會提醒你該睡覺了。', [20, 51]],
  [51, '時針大鐘', ['鋼', '幻'], 'clock', '#c8b890', '#5a3a1a', 'dot', ['legs', 'arms'], 2, 'def', '時針斬', '雙手是時針與分針的大鐘。', [38, 52]],
  [52, '時序鐘皇', ['鋼', '幻'], 'clock', '#a08a60', '#3a2010', 'cyclops', ['crown', 'orbs', 'wings'], 3, 'def', '時序凍結', '能讓時間停止一瞬間的鐘之皇帝。'],
  [53, '雪丸子', ['冰'], 'ball', '#f4f8ff', '#9ad0ff', 'cute', ['snow'], 1, 'hp', '雪球滾滾', '雪地裡滾來滾去的小雪球。', [20, 54]],
  [54, '冰晶雪人', ['冰'], 'snowman', '#f4f8ff', '#5ab0ff', 'smile', ['snow', 'scarf'], 2, 'hp', '雪人冰拳', '戴著圍巾的雪人，夏天會躲進冰窖。', [38, 55]],
  [55, '冰封雪王', ['冰', '地'], 'snowman', '#dcecff', '#2a7ad8', 'angry', ['snow', 'crown', 'spikes'], 3, 'def', '冰封王座', '在冰原上築起冰之王座的雪王。'],
  [56, '燭芯小靈', ['火', '暗'], 'candle', '#f0e0c0', '#ff8a2a', 'sad', ['flame', 'drip'], 1, 'bal', '燭淚', '一直在哭的蠟燭，眼淚是融化的蠟。', [28, 57]],
  [57, '燭台幽火', ['火', '暗'], 'candle', '#c8b8a0', '#a040ff', 'xx', ['flame', 'drip', 'arms'], 2, 'atk', '幽火燭台', '燃燒紫色幽火的燭台，會偷走影子。'],
  [58, '葉片寶寶', ['木'], 'leaf', '#7ad050', '#3a8a2a', 'cute', [], 1, 'spd', '葉之舞', '隨風飄落的小葉子，落地前會先跳一支舞。', [16, 59]],
  [59, '楓葉舞者', ['木', '風'], 'leaf', '#e8602a', '#8a2a10', 'smile', ['arms', 'legs'], 2, 'spd', '楓紅迴旋', '秋天才會現身的舞者。', [34, 60]],
  [60, '古樹葉王', ['木', '風'], 'leaf', '#3a8a2a', '#c8a050', 'dot', ['crown', 'arms', 'legs', 'sparks'], 3, 'hp', '古樹之息', '活了千年的葉之王，一嘆息便是一陣森林的風。'],
  [61, '小石方', ['地'], 'cube', '#a89880', '#6a5a48', 'dot', [], 1, 'def', '石方落下', '方方正正的小石頭，常被當成骰子。', [20, 62]],
  [62, '岩塊方獸', ['地', '鋼'], 'cube', '#8a7a68', '#4a3a2a', 'angry', ['legs', 'arms'], 2, 'def', '方岩重壓', '用方塊身體把對手壓扁的岩獸。', [38, 63]],
  [63, '山岳方神', ['地', '鋼'], 'cube', '#6a5a4a', '#c8a050', 'cyclops', ['legs', 'arms', 'crown', 'spikes'], 3, 'def', '山岳崩落', '據說整座山都是牠的身體。'],
  [64, '彎月小靈', ['暗'], 'moon', '#f0e0a0', '#5a4a90', 'sleep', ['sparks'], 1, 'spd', '月牙斬', '總是在睡覺的月亮寶寶。', [30, 65]],
  [65, '滿月夜靈', ['暗', '幻'], 'moon', '#fff0b0', '#2a1a5a', 'grin', ['sparks', 'wings'], 2, 'atk', '滿月狂想', '滿月時會露出詭異笑容的夜之靈。'],
  [66, '小星光', ['光'], 'star', '#ffe060', '#c88a20', 'cute', ['sparks'], 1, 'spd', '星光一閃', '從天上掉下來的小星星，想要回家。', [22, 67]],
  [67, '流星使者', ['光', '風'], 'star', '#ffd040', '#5a8aff', 'smile', ['sparks', 'tail'], 2, 'spd', '流星雨', '拖著光尾飛過夜空的使者。', [40, 68]],
  [68, '星辰聖獸', ['光', '風'], 'star', '#fff0a0', '#3a5ad0', 'lines', ['sparks', 'halo', 'wings'], 3, 'spd', '星辰聖光', '守護整片星空的聖獸。'],
  [69, '叮噹鈴', ['鋼'], 'bell', '#f0c040', '#a07010', 'smile', ['bow'], 1, 'bal', '叮噹聲', '一搖就會叮噹叫的小鈴鐺。', [28, 70]],
  [70, '大鐘鳴獸', ['鋼', '光'], 'bell', '#c8a030', '#5a3a10', 'o', ['bow', 'legs'], 2, 'def', '巨鐘轟鳴', '一聲鐘鳴能震碎岩石。'],
  [71, '雜訊電視', ['雷'], 'tv', '#6a6a7a', '#80ffe0', 'dot', ['antenna', 'legs'], 1, 'spd', '雜訊干擾', '只播雜訊的舊電視，偶爾會播出未來的畫面。', [30, 72]],
  [72, '幻影螢幕', ['雷', '幻'], 'tv', '#3a3a5a', '#ff70e0', 'grin', ['antenna', 'legs', 'sparks'], 2, 'atk', '幻影直播', '會把看著牠的人吸進畫面裡。'],
  [73, '盆栽寶', ['木'], 'pot', '#c8703a', '#5ac040', 'cute', ['sprout'], 1, 'hp', '光合作用', '頭上長著小芽的花盆，每天都要曬太陽。', [26, 74]],
  [74, '食人花盆', ['木', '暗'], 'pot', '#a0502a', '#e83a6a', 'teeth', ['petals', 'tentacles'], 2, 'atk', '花口吞噬', '花朵裡藏著一張大嘴。'],
  [75, '小螺殼', ['水'], 'shell', '#f0c8b0', '#c8706a', 'cute', [], 1, 'def', '螺旋水砲', '背著螺旋殼的小寄居靈。', [20, 76]],
  [76, '珍珠貝靈', ['水', '地'], 'shell', '#e8d8f0', '#8a6ac8', 'smile', ['orbs'], 2, 'def', '珍珠光', '殼裡藏著一顆會發光的珍珠。', [38, 77]],
  [77, '深海巨貝', ['水', '地'], 'shell', '#5a4a8a', '#e8e0ff', 'teeth', ['orbs', 'spikes'], 3, 'def', '深海巨顎', '張開巨殼就能吞下一艘船的深海霸主。'],
  [78, '沙包小拳', ['鬥'], 'cyl', '#d04a3a', '#f4e0c0', 'angry', ['arms'], 1, 'atk', '沙包反擊', '被打越多下越強的沙包。', [28, 79]],
  [79, '拳擊袋獸', ['鬥', '鋼'], 'cyl', '#a02a2a', '#f4e0c0', 'grin', ['arms', 'legs', 'chains'], 2, 'atk', '百拳風暴', '用鐵鍊吊著自己的拳擊袋，會主動揍回去。'],
  [80, '甜筒冰靈', ['冰'], 'cone', '#ffc0d8', '#d89a50', 'cute', [], 1, 'bal', '甜筒冰淇', '會融化的冰淇淋，脾氣很好但很怕熱。', [30, 81]],
  [81, '聖代冰后', ['冰', '光'], 'cone', '#fff0f8', '#e86a8a', 'smile', ['crown', 'sparks'], 2, 'hp', '聖代雪崩', '頂著草莓皇冠的冰淇淋女王。'],
  [82, '小面具', ['靈'], 'mask', '#f4f0e8', '#3a2a3a', 'smile', [], 1, 'spd', '面具變臉', '戴上牠的人會一直笑。', [22, 83]],
  [83, '哭笑面具', ['靈', '暗'], 'mask', '#e8e0d8', '#5a1a3a', 'sad', ['tentacles'], 2, 'atk', '哭笑雙面', '一面在笑一面在哭的面具。', [40, 84]],
  [84, '百面鬼王', ['靈', '暗'], 'mask', '#d8d0c8', '#2a0a1a', 'grin', ['tentacles', 'orbs', 'crown'], 3, 'atk', '百面夜行', '收集了一百張面孔的鬼王。'],
  [85, '毒傘菇', ['暗', '木'], 'mush', '#a040c0', '#f0e0f8', 'dot', ['drip'], 1, 'bal', '毒孢子', '傘上斑點會噴出毒孢子的菇。', [28, 86]],
  [86, '腐森菇王', ['暗', '木'], 'mush', '#5a1a7a', '#c8f080', 'xx', ['drip', 'crown', 'arms'], 2, 'atk', '腐森之毒', '統治腐森的菇王。'],
  [87, '熔岩丸', ['火', '地'], 'ball', '#3a2a2a', '#ff6a1a', 'angry', ['flame'], 1, 'def', '熔岩滾', '身上的裂縫流著岩漿的石丸。', [30, 88]],
  [88, '火山岩獸', ['火', '地'], 'cube', '#3a2a2a', '#ff5a1a', 'teeth', ['flame', 'legs', 'spikes'], 2, 'atk', '火山噴發', '背上是一座小火山的岩獸。'],
  [89, '小風車', ['風'], 'pinwheel', '#ff7aa0', '#7ad0ff', 'smile', [], 1, 'spd', '風車轉轉', '一直轉個不停的小風車。', [28, 90]],
  [90, '風車巨人', ['風', '鋼'], 'pinwheel', '#e8e0d0', '#5a8ad0', 'dot', ['legs', 'arms'], 2, 'atk', '巨人旋風', '在草原上守護村莊的風車巨人。'],
  [91, '方方魚', ['水'], 'fish', '#ffb030', '#ff6a2a', 'dot', ['fins'], 1, 'spd', '方魚跳', '身體方方的魚，游泳很笨拙。', [24, 92]],
  [92, '牙牙鯊', ['水', '暗'], 'fish', '#4a5a8a', '#f0f0f8', 'teeth', ['fins', 'spikes'], 2, 'atk', '鯊牙裂浪', '笑起來全是牙齒的鯊魚。'],
  [93, '冰羽雛', ['冰', '風'], 'drop', '#c0e8ff', '#5ab0e0', 'cute', ['wings'], 1, 'spd', '冰羽', '剛孵化的冰鳥，羽毛是雪花做的。', [30, 94]],
  [94, '冰羽鳳', ['冰', '風'], 'drop', '#8ad0ff', '#2a6ad0', 'lines', ['wings', 'tail', 'crown', 'snow'], 2, 'spd', '冰鳳翔', '飛過的地方會下起雪的冰之鳳。'],
  [95, '電球仔', ['雷'], 'ball', '#ffe040', '#3a3a5a', 'grin', ['sparks', 'antenna'], 1, 'spd', '電球彈', '圓滾滾的電球，摸到會麻麻的。', [26, 96]],
  [96, '雷核獸', ['雷', '鋼'], 'ball', '#3a3a5a', '#ffe040', 'cyclops', ['sparks', 'legs', 'spikes'], 2, 'atk', '雷核爆發', '體內藏著雷電核心的機械獸。'],
  // 傳說幻靈
  [97, '光冕聖獸', ['光', '靈'], 'tri', '#fff4d0', '#ffd040', 'lines', ['crown', 'halo', 'wings', 'sparks'], 'L', 'bal', '光冕審判', '天空聖域的守護者。三角之光能看穿一切謊言。'],
  [98, '霜晶龍', ['冰', '幻'], 'drop', '#c8f0ff', '#6ab0ff', 'angry', ['horns', 'wings', 'tail', 'snow', 'crown'], 'L', 'atk', '絕對零度', '沉睡在冰晶湖底的冰龍，呼吸能凍結時間。'],
  [99, '雷鼓天王', ['雷', '鬥'], 'cyl', '#c83a2a', '#ffd040', 'angry', ['arms', 'legs', 'sparks', 'horns', 'halo'], 'L', 'atk', '天鼓雷鳴', '在雷鳴高原擂響天鼓的雷之王。'],
  [100, '幻紋始祖', ['幻', '光'], 'egg', '#f8f0ff', '#c890ff', 'cyclops', ['halo', 'wings', 'orbs', 'crown', 'sparks'], 'L', 'bal', '幻紋創世', '傳說中創造了幻紋大陸的始祖幻靈。'],
];

const STAGE_TOTAL = { 1: 300, 2: 405, 3: 515, L: 600 };
const ROLE_W = { atk: [0.23, 0.33, 0.2, 0.24], def: [0.26, 0.2, 0.35, 0.19], spd: [0.22, 0.26, 0.17, 0.35], hp: [0.34, 0.23, 0.25, 0.18], bal: [0.26, 0.25, 0.25, 0.24] };

for (const [id, n, t, body, c1, c2, face, acc, stage, role, sig, desc, evo] of NEW_MONS) {
  const tot = STAGE_TOTAL[stage], w = ROLE_W[role];
  const b = w.map(x => Math.round(tot * x));
  const sigId = 'sig' + id;
  const sigPow = stage === 'L' ? 120 : stage === 3 ? 100 : stage === 2 ? 85 : 65;
  MOVES[sigId] = { n: sig, t: t[0], p: sigPow, a: stage === 'L' ? 90 : 95, pp: 8, d: `${n}的招牌招式。` };
  const [t1, t2] = t, M1 = TYPE_MOVES[t1], M2 = TYPE_MOVES[t2 || t1];
  const learn = [[1, 'tackle'], [1, M1[0][0]], [6, 'growl'], [10, M1[3][0]], [14, M2[0][0]], [18, M1[1][0]], [24, sigId], [30, M2[1][0]], [38, M1[2][0]], [46, M2[3][0]], [52, M2[2][0]]];
  MONS[id] = {
    n, t, b, cr: stage === 'L' ? 15 : stage === 3 ? 45 : stage === 2 ? 90 : 190,
    xp: stage === 'L' ? 280 : stage === 3 ? 220 : stage === 2 ? 140 : 60,
    h: (0.4 + (stage === 'L' ? 4 : stage) * 0.5 + (id % 5) * 0.1).toFixed(1) + ' m',
    w: (3 + (stage === 'L' ? 6 : stage) * 12 + (id % 7) * 3.3).toFixed(1) + ' kg',
    hab: '', desc, learn, gen: { body, c1, c2, face, acc, stage },
  };
  if (evo) MONS[id].evo = { lv: evo[0], to: evo[1] };
}
// 原畫幻靈的進化
Object.assign(MONS[14], { evo: { lv: 16, to: 21 } });
Object.assign(MONS[6], { evo: { lv: 16, to: 23 } });
Object.assign(MONS[7], { evo: { lv: 16, to: 25 } });
Object.assign(MONS[1], { evo: { lv: 24, to: 27 } });
Object.assign(MONS[2], { evo: { lv: 30, to: 28 } });
Object.assign(MONS[3], { evo: { lv: 36, to: 29 } });
Object.assign(MONS[5], { evo: { lv: 32, to: 30 } });
Object.assign(MONS[12], { evo: { lv: 30, to: 31 } });
Object.assign(MONS[13], { evo: { lv: 36, to: 32 } });
Object.assign(MONS[17], { evo: { lv: 36, to: 33 } });
Object.assign(MONS[19], { evo: { lv: 34, to: 34 } });
Object.assign(MONS[20], { evo: { lv: 34, to: 35 } });
// 進化型保留前一型的招牌招式
for (const [from, to] of [[14, 21], [21, 22], [6, 23], [23, 24], [7, 25], [25, 26], [1, 27], [2, 28], [3, 29], [5, 30], [12, 31], [13, 32], [17, 33], [19, 34], [20, 35]]) {
  const keep = MONS[from].learn.filter(([, mv]) => !MONS[to].learn.some(([, m2]) => m2 === mv));
  MONS[to].learn = MONS[to].learn.concat(keep.filter(([l]) => l > 1)).sort((a, b) => a[0] - b[0]);
}
// 棲息地
const HABITAT = {};
function setHab(list, place) { for (const id of list) if (MONS[id] && !MONS[id].hab) MONS[id].hab = place; }

// ---- 參數化造型 ----
const BODY = {
  cup(c, s) {
    G.curve(c, [26, -6, 42, -2, 26, 18], s.c2, 6);
    c.beginPath(); c.moveTo(-30, -18); c.lineTo(30, -18); c.quadraticCurveTo(28, 30, 0, 32); c.quadraticCurveTo(-28, 30, -30, -18); G.fs(c, G.lg(c, 0, -18, 0, 32, s.c2, '#c8c0b0'), '#5a5048', 2);
    G.ell(c, 0, -18, 30, 7, G.rg(c, 0, -18, 30, '#ffffff', s.c1), '#5a5048', 1.5);
    G.ell(c, 0, 36, 24, 5, s.c2, '#5a5048', 1.5);
    return { x: 0, y: 6, s: 1 };
  },
  lantern(c, s) {
    G.line(c, [0, -46, 0, -36], '#5a3a20', 3);
    G.rr(c, -14, -40, 28, 6, 2, s.c2);
    G.glow(c, s.c1, 22);
    G.ell(c, 0, -4, 28, 34, G.rg(c, -6, -10, 34, '#fff0c0', s.c1), s.c2, 2);
    G.noGlow(c);
    for (const x of [-14, 0, 14]) G.curve(c, [x, -36, x * 1.6, -4, x, 28], 'rgba(0,0,0,0.2)', 1.5);
    G.rr(c, -14, 28, 28, 6, 2, s.c2);
    G.line(c, [0, 34, 0, 44], '#c83a2a', 3);
    return { x: 0, y: -4, s: 1 };
  },
  book(c, s, t) {
    const o = Math.sin(t * 2) * 0.1;
    G.poly(c, [-34, -26, 0, -20, 0, 30, -34, 24], s.c2, '#5a4a3a', 1.5);
    G.poly(c, [34, -26 - o * 20, 0, -20, 0, 30, 34, 24], s.c2, '#5a4a3a', 1.5);
    for (let i = 0; i < 4; i++) { G.line(c, [-28, -14 + i * 9, -6, -10 + i * 9], 'rgba(90,70,50,0.4)', 1.2); G.line(c, [28, -14 + i * 9, 6, -10 + i * 9], 'rgba(90,70,50,0.4)', 1.2); }
    G.poly(c, [-38, -28, 0, -22, 0, -18, -38, -24], s.c1); G.poly(c, [38, -28, 0, -22, 0, -18, 38, -24], s.c1);
    G.rr(c, -38, 24, 76, 8, 2, s.c1, '#2a1a3a', 1.5);
    return { x: 0, y: 2, s: 0.9 };
  },
  cloud(c, s) {
    G.glow(c, s.c2, 14);
    for (const [x, y, r] of [[-22, 6, 16], [0, -8, 22], [22, 4, 17], [-8, 14, 16], [12, 16, 15]]) G.circle(c, x, y, r, s.c1);
    G.noGlow(c);
    G.ell(c, 0, 12, 34, 14, s.c1);
    return { x: 0, y: 4, s: 1 };
  },
  key(c, s) {
    G.rr(c, -6, -4, 12, 46, 3, G.lg(c, -6, 0, 6, 0, s.c1, s.c2), '#3a2a10', 1.5);
    G.rr(c, 6, 26, 12, 6, 1, s.c1, '#3a2a10', 1.2); G.rr(c, 6, 36, 8, 6, 1, s.c1, '#3a2a10', 1.2);
    G.circle(c, 0, -22, 22, G.rg(c, -4, -26, 22, '#fff4c0', s.c1), '#3a2a10', 2);
    G.circle(c, 0, -22, 13, 'rgba(0,0,0,0.18)');
    return { x: 0, y: -22, s: 0.8 };
  },
  clock(c, s, t) {
    G.circle(c, 0, -6, 32, s.c2, '#2a1a0a', 2);
    G.circle(c, 0, -6, 26, G.rg(c, -4, -10, 26, '#fffaf0', s.c1), '#5a4a30', 1.5);
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; G.line(c, [Math.cos(a) * 22, -6 + Math.sin(a) * 22, Math.cos(a) * 25, -6 + Math.sin(a) * 25], '#5a4a30', 1.5); }
    G.line(c, [0, -6, Math.cos(t) * 18, -6 + Math.sin(t) * 18], '#8a2a1a', 1.5);
    G.circle(c, -18, -38, 7, '#c8a050', '#5a3a1a', 1.2); G.circle(c, 18, -38, 7, '#c8a050', '#5a3a1a', 1.2);
    return { x: 0, y: 0, s: 0.8 };
  },
  ball(c, s) {
    G.ell(c, 0, 4, 32, 30, G.rg(c, -8, -6, 34, '#ffffff', s.c1), s.c2, 2);
    if (s.c1 === '#3a2a2a' || s.c2 === '#ff6a1a') for (let i = 0; i < 4; i++) G.line(c, [-20 + i * 12, -14 + (i % 2) * 20, -12 + i * 12, -2 + (i % 2) * 20], s.c2, 2.5);
    return { x: 0, y: 2, s: 1 };
  },
  snowman(c, s) {
    G.circle(c, 0, 22, 22, G.rg(c, -4, 18, 22, '#ffffff', s.c1), '#8ab0d0', 1.5);
    G.circle(c, 0, -14, 18, G.rg(c, -4, -18, 18, '#ffffff', s.c1), '#8ab0d0', 1.5);
    G.dot(c, 0, 16, 2.2, s.c2); G.dot(c, 0, 26, 2.2, s.c2);
    G.poly(c, [0, -11, 10, -9, 0, -7], '#ff8a2a');
    return { x: 0, y: -16, s: 0.8 };
  },
  candle(c, s) {
    G.ell(c, 0, 40, 26, 6, '#8a6a3a', '#3a2a10', 1.5);
    G.rr(c, -18, -24, 36, 64, 6, G.lg(c, -18, 0, 18, 0, '#ffffff', s.c1), '#8a7a60', 1.5);
    G.ell(c, 0, -24, 18, 5, '#fff8e8', '#8a7a60', 1);
    G.line(c, [0, -24, 0, -32], '#2a1a0a', 2);
    return { x: 0, y: 2, s: 0.85 };
  },
  leaf(c, s, t) {
    c.save(); c.rotate(Math.sin(t * 1.5) * 0.08);
    c.beginPath(); c.moveTo(0, -42); c.quadraticCurveTo(38, -16, 0, 36); c.quadraticCurveTo(-38, -16, 0, -42); G.fs(c, G.rg(c, -6, -10, 40, '#e0ffa0', s.c1), s.c2, 2);
    G.line(c, [0, -38, 0, 34], s.c2, 2);
    for (let i = 0; i < 3; i++) { G.line(c, [0, -20 + i * 14, 14, -28 + i * 14], s.c2, 1.2); G.line(c, [0, -20 + i * 14, -14, -28 + i * 14], s.c2, 1.2); }
    G.line(c, [0, 36, 2, 44], s.c2, 3);
    c.restore();
    return { x: 0, y: -4, s: 0.9 };
  },
  cube(c, s) {
    G.poly(c, [-28, -20, -16, -32, 32, -32, 20, -20], s.c1, '#1a1410', 1.5);
    G.poly(c, [20, -20, 32, -32, 32, 22, 20, 34], s.c2, '#1a1410', 1.5);
    G.rr(c, -28, -20, 48, 54, 3, G.rg(c, -6, 0, 40, '#ffffff22', s.c1), '#1a1410', 2);
    c.globalAlpha = 0.25; G.line(c, [-20, 20, -10, 14, -4, 24], '#000', 1.5); c.globalAlpha = 1;
    return { x: -4, y: 4, s: 1 };
  },
  moon(c, s) {
    G.glow(c, s.c1, 20);
    c.beginPath(); c.arc(0, 0, 36, Math.PI * 0.35, Math.PI * 1.65); c.arc(14, -4, 28, Math.PI * 1.5, Math.PI * 0.5, true); c.closePath();
    G.fs(c, G.rg(c, -10, -6, 36, '#ffffff', s.c1), s.c2, 1.5);
    G.noGlow(c);
    return { x: -18, y: 2, s: 0.75 };
  },
  star(c, s, t) {
    G.glow(c, s.c1, 22);
    G.star(c, 0, 2, 5, 38, 17, -Math.PI / 2 + Math.sin(t) * 0.08, G.rg(c, 0, -4, 38, '#ffffff', s.c1), s.c2, 2);
    G.noGlow(c);
    return { x: 0, y: 4, s: 0.85 };
  },
  bell(c, s) {
    c.beginPath(); c.moveTo(-6, -36); c.quadraticCurveTo(-28, -30, -28, 6); c.lineTo(-36, 26); c.lineTo(36, 26); c.lineTo(28, 6); c.quadraticCurveTo(28, -30, 6, -36); c.closePath();
    G.fs(c, G.rg(c, -8, -10, 40, '#fff4c0', s.c1), s.c2, 2);
    G.circle(c, 0, -38, 5, null, s.c2, 2.5);
    G.circle(c, 0, 32, 7, s.c2, '#2a1a0a', 1.5);
    return { x: 0, y: -2, s: 1 };
  },
  tv(c, s, t) {
    G.rr(c, -36, -28, 72, 56, 8, s.c1, '#1a1a2a', 2);
    G.rr(c, -28, -21, 48, 42, 6, '#0a0a14');
    c.globalAlpha = 0.25; for (let i = 0; i < 8; i++) G.line(c, [-26, -18 + i * 5, 18, -18 + i * 5], s.c2, 1); c.globalAlpha = 1;
    G.circle(c, 28, -12, 3, '#c8c8d0'); G.circle(c, 28, 0, 3, '#c8c8d0');
    return { x: -4, y: 0, s: 1, col: s.c2 };
  },
  pot(c, s) {
    G.poly(c, [-28, -6, 28, -6, 20, 36, -20, 36], G.lg(c, 0, -6, 0, 36, s.c1, '#5a2a10'), '#3a1a08', 2);
    G.rr(c, -32, -12, 64, 10, 3, s.c1, '#3a1a08', 2);
    G.ell(c, 0, -12, 28, 5, '#4a2a10');
    return { x: 0, y: 14, s: 0.85 };
  },
  shell(c, s) {
    G.ell(c, 0, 30, 34, 10, s.c2, '#3a2a3a', 1.5);
    c.beginPath(); c.moveTo(-34, 28); c.quadraticCurveTo(-34, -36, 0, -36); c.quadraticCurveTo(34, -36, 34, 28); c.closePath();
    G.fs(c, G.rg(c, -6, -10, 44, '#ffffff', s.c1), '#3a2a3a', 2);
    for (let i = -3; i <= 3; i++) G.curve(c, [0, 28, i * 8, -10, i * 10, -32], 'rgba(0,0,0,0.15)', 1.5);
    return { x: 0, y: 6, s: 0.9 };
  },
  cyl(c, s) {
    G.line(c, [0, -44, 0, -34], '#5a5a5a', 3);
    G.rr(c, -24, -34, 48, 72, 14, G.lg(c, -24, 0, 24, 0, s.c1, '#5a1010'), '#2a0a0a', 2);
    G.rr(c, -24, -34, 48, 8, 4, s.c2); G.rr(c, -24, 30, 48, 8, 4, s.c2);
    return { x: 0, y: -6, s: 1 };
  },
  cone(c, s) {
    G.poly(c, [-22, 0, 22, 0, 0, 44], G.lg(c, 0, 0, 0, 44, '#e8b878', s.c2), '#6a4a20', 1.5);
    for (let i = 0; i < 3; i++) { G.line(c, [-18 + i * 6, 4 + i * 10, 14 - i * 4, 6 + i * 10], 'rgba(90,60,20,0.4)', 1); }
    for (const [x, y, r] of [[-12, -4, 14], [12, -4, 14], [0, -18, 18]]) G.circle(c, x, y, r, G.rg(c, x - 3, y - 4, r, '#ffffff', s.c1));
    G.circle(c, 0, -38, 5, '#e83a4a');
    return { x: 0, y: -14, s: 0.85 };
  },
  mask(c, s, t) {
    G.glow(c, '#a050ff', 16);
    c.beginPath(); c.moveTo(0, -40); c.quadraticCurveTo(34, -38, 30, 0); c.quadraticCurveTo(24, 36, 0, 40); c.quadraticCurveTo(-24, 36, -30, 0); c.quadraticCurveTo(-34, -38, 0, -40);
    G.fs(c, G.rg(c, -6, -10, 40, '#ffffff', s.c1), s.c2, 2);
    G.noGlow(c);
    G.curve(c, [-24, -26, 0, -32, 24, -26], 'rgba(0,0,0,0.15)', 2);
    return { x: 0, y: -2, s: 1.1 };
  },
  mush(c, s) {
    G.rr(c, -14, -4, 28, 40, 8, G.lg(c, 0, -4, 0, 36, '#fff8f0', '#d8c8c0'), '#5a4a48', 1.5);
    c.beginPath(); c.ellipse(0, -8, 38, 30, 0, Math.PI, 0); c.closePath(); G.fs(c, G.rg(c, -8, -24, 36, '#ffffff55', s.c1), '#2a0a2a', 2);
    for (const [x, y, r] of [[-20, -18, 5], [4, -28, 6], [22, -14, 4], [-6, -14, 3]]) G.circle(c, x, y, r, s.c2);
    return { x: 0, y: 14, s: 0.8 };
  },
  pinwheel(c, s, t) {
    G.line(c, [0, 0, 0, 44], '#8a6a4a', 4);
    c.save(); c.translate(0, -10); c.rotate(t * 3);
    for (let i = 0; i < 4; i++) { c.rotate(Math.PI / 2); G.poly(c, [0, 0, 0, -36, 22, -14], i % 2 ? s.c1 : s.c2, '#2a2a3a', 1.2); }
    c.restore();
    G.circle(c, 0, -10, 13, G.rg(c, -2, -12, 13, '#ffffff', '#e8e0d0'), '#2a2a3a', 1.5);
    return { x: 0, y: -10, s: 0.55 };
  },
  fish(c, s, t) {
    const w = Math.sin(t * 4) * 4;
    G.poly(c, [26, 0, 46, -18 + w, 46, 18 + w], s.c2, '#1a1a2a', 1.5);
    G.rr(c, -36, -24, 66, 48, 14, G.rg(c, -12, -8, 44, '#ffffff', s.c1), '#1a1a2a', 2);
    for (let i = 0; i < 3; i++) G.smile(c, 8 + i * 7, 0, 6, 'rgba(0,0,0,0.2)', 1.5, 1.7, 2.3);
    return { x: -16, y: -2, s: 0.9 };
  },
  drop(c, s) {
    c.beginPath(); c.moveTo(0, -42); c.bezierCurveTo(30, -10, 32, 34, 0, 36); c.bezierCurveTo(-32, 34, -30, -10, 0, -42);
    G.fs(c, G.rg(c, -8, 0, 40, '#ffffff', s.c1), s.c2, 2);
    return { x: 0, y: 8, s: 0.95 };
  },
  tri(c, s) {
    G.glow(c, s.c2, 24);
    G.poly(c, [0, -44, -34, 30, 34, 30], G.rg(c, 0, -4, 46, '#ffffff', s.c1), s.c2, 3);
    G.noGlow(c);
    return { x: 0, y: 6, s: 1 };
  },
  egg(c, s) {
    G.glow(c, s.c2, 26);
    G.ell(c, 0, 0, 30, 38, G.rg(c, -8, -10, 40, '#ffffff', s.c1), s.c2, 2.5);
    G.noGlow(c);
    c.save(); c.beginPath(); c.ellipse(0, 0, 30, 38, 0, 0, Math.PI * 2); c.clip();
    for (let i = 0; i < 5; i++) G.curve(c, [-34, -24 + i * 12, 0, -14 + i * 12, 34, -26 + i * 12], 'rgba(160,100,255,0.35)', 2);
    c.restore();
    return { x: 0, y: -4, s: 1 };
  },
};

const FACE = {
  smile(c, f, col) { G.dot(c, f.x - 8 * f.s, f.y - 4 * f.s, 2.4 * f.s, col); G.dot(c, f.x + 8 * f.s, f.y - 4 * f.s, 2.4 * f.s, col); G.smile(c, f.x, f.y, 7 * f.s, col, 2 * f.s); },
  dot(c, f, col) { G.dot(c, f.x - 8 * f.s, f.y - 3 * f.s, 2.4 * f.s, col); G.dot(c, f.x + 8 * f.s, f.y - 3 * f.s, 2.4 * f.s, col); G.line(c, [f.x - 4 * f.s, f.y + 6 * f.s, f.x + 4 * f.s, f.y + 6 * f.s], col, 1.8 * f.s); },
  cute(c, f, col) {
    for (const k of [-1, 1]) { G.ell(c, f.x + k * 9 * f.s, f.y - 3 * f.s, 3.4 * f.s, 4.6 * f.s, '#1a1410'); G.dot(c, f.x + k * 9 * f.s + 1, f.y - 5 * f.s, 1.3 * f.s, '#fff'); G.ell(c, f.x + k * 14 * f.s, f.y + 4 * f.s, 3 * f.s, 2 * f.s, 'rgba(255,110,120,0.55)'); }
    c.beginPath(); c.arc(f.x, f.y + 4 * f.s, 4.5 * f.s, 0, Math.PI); c.closePath(); G.fs(c, '#d04a40');
  },
  xx(c, f, col) {
    for (const k of [-1, 1]) { const x = f.x + k * 8 * f.s, y = f.y - 4 * f.s, r = 3 * f.s; G.line(c, [x - r, y - r, x + r, y + r], col, 2 * f.s); G.line(c, [x + r, y - r, x - r, y + r], col, 2 * f.s); }
    G.frown(c, f.x, f.y + 7 * f.s, 5 * f.s, col, 2 * f.s);
  },
  angry(c, f, col) {
    G.line(c, [f.x - 13 * f.s, f.y - 11 * f.s, f.x - 4 * f.s, f.y - 7 * f.s], col, 2.2 * f.s); G.line(c, [f.x + 13 * f.s, f.y - 11 * f.s, f.x + 4 * f.s, f.y - 7 * f.s], col, 2.2 * f.s);
    G.dot(c, f.x - 8 * f.s, f.y - 3 * f.s, 2.4 * f.s, col); G.dot(c, f.x + 8 * f.s, f.y - 3 * f.s, 2.4 * f.s, col);
    G.frown(c, f.x, f.y + 7 * f.s, 5 * f.s, col, 2 * f.s);
  },
  sad(c, f, col) {
    G.dot(c, f.x - 8 * f.s, f.y - 3 * f.s, 2.4 * f.s, col); G.dot(c, f.x + 8 * f.s, f.y - 3 * f.s, 2.4 * f.s, col);
    G.frown(c, f.x, f.y + 7 * f.s, 5 * f.s, col, 2 * f.s);
    G.ell(c, f.x - 9 * f.s, f.y + 4 * f.s, 1.6 * f.s, 3 * f.s, '#7ac0ff');
  },
  grin(c, f, col) {
    G.dot(c, f.x - 9 * f.s, f.y - 6 * f.s, 2.4 * f.s, col); G.dot(c, f.x + 9 * f.s, f.y - 6 * f.s, 2.4 * f.s, col);
    c.beginPath(); c.arc(f.x, f.y, 11 * f.s, 0.1 * Math.PI, 0.9 * Math.PI); c.closePath(); G.fs(c, '#fff', col, 1.5 * f.s);
    for (let i = -2; i <= 2; i++) G.line(c, [f.x + i * 4 * f.s, f.y + 1 * f.s, f.x + i * 4 * f.s, f.y + 9 * f.s], col, 0.8 * f.s);
  },
  teeth(c, f, col) {
    G.dot(c, f.x - 10 * f.s, f.y - 10 * f.s, 2.4 * f.s, col); G.dot(c, f.x + 10 * f.s, f.y - 10 * f.s, 2.4 * f.s, col);
    G.rr(c, f.x - 16 * f.s, f.y - 4 * f.s, 32 * f.s, 18 * f.s, 4 * f.s, '#1a0a10');
    G.teeth(c, f.x - 16 * f.s, f.x + 16 * f.s, f.y - 4 * f.s, 7 * f.s, 5, '#f4ecd8', 1);
    G.teeth(c, f.x - 14 * f.s, f.x + 14 * f.s, f.y + 14 * f.s, 6 * f.s, 4, '#f4ecd8', -1);
  },
  sleep(c, f, col) { G.smile(c, f.x - 8 * f.s, f.y - 5 * f.s, 3 * f.s, col, 1.8 * f.s); G.smile(c, f.x + 8 * f.s, f.y - 5 * f.s, 3 * f.s, col, 1.8 * f.s); G.circle(c, f.x, f.y + 6 * f.s, 2 * f.s, null, col, 1.5 * f.s); },
  cyclops(c, f, col, t) {
    G.circle(c, f.x, f.y - 4 * f.s, 9 * f.s, '#fff', col, 1.5 * f.s);
    G.circle(c, f.x + Math.sin(t) * 2 * f.s, f.y - 4 * f.s, 4.5 * f.s, '#8a2ad0'); G.dot(c, f.x + Math.sin(t) * 2 * f.s, f.y - 4 * f.s, 2 * f.s, '#0a0a10');
    G.smile(c, f.x, f.y + 6 * f.s, 5 * f.s, col, 1.8 * f.s);
  },
  o(c, f, col) { G.dot(c, f.x - 8 * f.s, f.y - 4 * f.s, 2.4 * f.s, col); G.dot(c, f.x + 8 * f.s, f.y - 4 * f.s, 2.4 * f.s, col); G.ell(c, f.x, f.y + 6 * f.s, 3.5 * f.s, 4.5 * f.s, col); },
  lines(c, f, col) { G.line(c, [f.x - 6 * f.s, f.y - 9 * f.s, f.x - 6 * f.s, f.y - 1 * f.s], '#e0b020', 2.5 * f.s); G.line(c, [f.x + 6 * f.s, f.y - 9 * f.s, f.x + 6 * f.s, f.y - 1 * f.s], '#e0b020', 2.5 * f.s); G.smile(c, f.x, f.y + 1 * f.s, 7 * f.s, '#e0b020', 2.5 * f.s); },
};

// 配件：back = 畫在身體後面
const ACC_BACK = new Set(['wings', 'halo', 'tail', 'tentacles', 'legs', 'arms', 'orbs', 'chains', 'fins', 'wheels']);
function drawAcc(c, a, s, t, f) {
  const hl = s.c2 || '#c8a050';
  switch (a) {
    case 'crown': G.glow(c, '#ffd040', 10); G.poly(c, [-12, -44, -15, -56, -6, -50, 0, -60, 6, -50, 15, -56, 12, -44], '#f0c030', '#7a5010', 1.2); G.noGlow(c); G.circle(c, 0, -50, 2.2, '#ff4a6a'); break;
    case 'horns': G.poly(c, [-16, -30, -26, -56, -8, -36], hl, '#1a1a1a', 1.2); G.poly(c, [16, -30, 26, -56, 8, -36], hl, '#1a1a1a', 1.2); break;
    case 'spikes': for (let i = 0; i < 7; i++) { const ag = Math.PI * (1.1 + i * 0.13); G.poly(c, [Math.cos(ag - 0.1) * 30, -2 + Math.sin(ag - 0.1) * 30, Math.cos(ag) * 44, -2 + Math.sin(ag) * 44, Math.cos(ag + 0.1) * 30, -2 + Math.sin(ag + 0.1) * 30], hl, '#1a1a2a', 1); } break;
    case 'bow': G.poly(c, [0, -38, -12, -46, -12, -30], '#e85a90', '#8a1a40', 1); G.poly(c, [0, -38, 12, -46, 12, -30], '#e85a90', '#8a1a40', 1); G.circle(c, 0, -38, 3, '#ff80b0'); break;
    case 'antenna': G.line(c, [-8, -30, -18, -48], '#3a3a4a', 2); G.line(c, [8, -30, 18, -48], '#3a3a4a', 2); G.glow(c, hl, 10); G.circle(c, -18, -48, 3.5, hl); G.circle(c, 18, -48, 3.5, hl); G.noGlow(c); break;
    case 'tentacles': for (let i = 0; i < 4; i++) G.curve(c, [-15 + i * 10, 24, -30 + i * 20 + Math.sin(t * 2 + i) * 8, 36, -24 + i * 16, 46], hl, 4); break;
    case 'legs': G.line(c, [-12, 26, -16, 44], '#3a3030', 4); G.line(c, [12, 26, 16, 44], '#3a3030', 4); G.ell(c, -17, 45, 6, 3, '#3a3030'); G.ell(c, 17, 45, 6, 3, '#3a3030'); break;
    case 'arms': { const w = Math.sin(t * 2) * 4; G.curve(c, [-26, 0, -40, -4, -42, -16 + w], '#3a3030', 4); G.curve(c, [26, 0, 40, -4, 42, -16 - w], '#3a3030', 4); G.circle(c, -42, -18 + w, 4, hl); G.circle(c, 42, -18 - w, 4, hl); break; }
    case 'wings': { const w = Math.sin(t * 4) * 6; G.glow(c, hl, 12); G.poly(c, [-20, -6, -56, -30 + w, -48, 4, -54, 16 + w, -22, 10], 'rgba(255,255,255,0.75)', hl, 1.5); G.poly(c, [20, -6, 56, -30 + w, 48, 4, 54, 16 + w, 22, 10], 'rgba(255,255,255,0.75)', hl, 1.5); G.noGlow(c); break; }
    case 'tail': G.curve(c, [20, 20, 46, 24, 44, 0], hl, 5); G.circle(c, 44, -2, 4, hl); break;
    case 'flame': { const fl = Math.sin(t * 8) * 3; G.glow(c, '#ff8020', 18); c.beginPath(); c.moveTo(-9, -36); c.quadraticCurveTo(-12, -48, 0, -62 - fl); c.quadraticCurveTo(12, -48, 9, -36); c.closePath(); G.fs(c, '#ffb030'); c.beginPath(); c.moveTo(-4, -38); c.quadraticCurveTo(0, -46, 0, -52 - fl); c.quadraticCurveTo(4, -46, 4, -38); c.closePath(); G.fs(c, '#fff4a0'); G.noGlow(c); break; }
    case 'halo': G.glow(c, '#ffe080', 16); G.ell(c, 0, -52, 18, 5, null, '#ffe080', 2.5); G.noGlow(c); break;
    case 'orbs': for (let i = 0; i < 3; i++) { const ag = t * 1.2 + i * 2.1; G.glow(c, hl, 12); G.circle(c, Math.cos(ag) * 46, -4 + Math.sin(ag) * 16, 5, hl); G.noGlow(c); } break;
    case 'chains': G.line(c, [-22, -30, -30, -48], '#8a8a90', 2); G.line(c, [22, -30, 30, -48], '#8a8a90', 2); for (const x of [-26, 26]) for (let k = 0; k < 3; k++) G.circle(c, x + Math.sign(x) * k * 2, -34 - k * 5, 2.2, null, '#a0a0a8', 1.4); break;
    case 'fins': G.poly(c, [-10, -24, 4, -40, 10, -22], s.c2, '#1a1a2a', 1); G.poly(c, [-8, 22, 2, 34, 8, 22], s.c2, '#1a1a2a', 1); break;
    case 'wheels': for (const x of [-26, 26]) { G.circle(c, x, 40, 9, '#2a2a3a', '#c8a050', 2); G.circle(c, x, 40, 3, '#c8a050'); } break;
    case 'petals': for (let i = 0; i < 6; i++) { const ag = i * Math.PI / 3 + t * 0.3; G.ell(c, Math.cos(ag) * 30, -30 + Math.sin(ag) * 10, 7, 4, '#ff9ac0', '#c8507a', 1, ag); } break;
    case 'sprout': G.line(c, [0, -12, 0, -30], '#3a8a2a', 3); G.ell(c, -7, -30, 8, 4, '#5ac040', null, 0, -0.5); G.ell(c, 7, -32, 8, 4, '#5ac040', null, 0, 0.5); break;
    case 'drip': c.globalAlpha = 0.8; for (let i = 0; i < 3; i++) { const k = (t * 0.7 + i * 0.33) % 1; G.ell(c, -16 + i * 16, 30 + k * 14, 2.4, 3.4, hl); } c.globalAlpha = 1; break;
    case 'sparks': G.sparkles(c, t, '#fff4b0', 7, 50); break;
    case 'snow': c.globalAlpha = 0.9; for (let i = 0; i < 8; i++) { const k = (t * 0.25 + i * 0.13) % 1; G.star(c, -44 + i * 12, -46 + k * 92, 6, 2.6, 1, 0, '#ffffff'); } c.globalAlpha = 1; break;
    case 'scarf': G.rr(c, -18, -2, 36, 7, 3, '#e83a3a'); G.rr(c, 8, 2, 7, 16, 2, '#e83a3a'); break;
  }
}

function drawGen(c, id, t) {
  const g = MONS[id].gen;
  const sc = g.body.startsWith('base:') ? (g.stage === 2 ? 1.04 : 1.1) : { 1: 0.72, 2: 0.88, 3: 1, L: 1.05 }[g.stage];
  c.scale(sc, sc);
  c.translate(0, (1 - sc) * 45 / sc);
  for (const a of g.acc) if (ACC_BACK.has(a)) drawAcc(c, a, g, t);
  if (g.body.startsWith('base:')) {
    const bid = +g.body.slice(5);
    c.save(); SPRITES[bid](c, t); c.restore();
  } else {
    const f = BODY[g.body](c, g, t);
    (FACE[g.face] || FACE.smile)(c, f, f.col || '#1a1410', t);
  }
  for (const a of g.acc) if (!ACC_BACK.has(a)) drawAcc(c, a, g, t);
}
for (const id in MONS) if (MONS[id].gen) SPRITES[id] = (c, t) => drawGen(c, +id, t);
