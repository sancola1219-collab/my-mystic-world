// ===== 三界篇：天界 6 關、星海 12 關、冥淵 12 關，共 30 個道館 =====

// ---------- 關卡資料 ----------
// [地名, 道館名, 館主, 印記, 配色(地面,小路,屋頂,草,草亮,液體,液1,液2,障礙物), 戰鬥背景(天1,天2,丘1,丘2,地1,地2,種類), 天氣, 光色, 光強, 劇情, 館主開場, 館主敗北]
const STAGE_DATA = [
  ['雲海之門', '雲門道館', '雲守 白羽', '雲羽印', ['#f4f0e0', '#ffe8a0', '#e0b050', '#e8c860', '#fff4b0', 'cloud', '#9ac8ff', '#c8e0ff', 'cloud'], ['#5a9ae8', '#fff4dc', '#ffffff', '#e0ecff', '#fff0d0', '#e8d0a0', 'heaven'], 'sky', '255,250,230', 0.1,
    ['幻紋始祖', ['靈契師，謝謝你治癒了我。', '但我在沉睡時看見了裂痕：天界、星海、冥淵，三界正在崩壞。', '有兩個存在正在吞噬世界——星海盡頭的「噬星者」，與地獄最深處的「冥淵魔王」。', '請從這裡出發，走過三十座道館，阻止牠們。']], ['歡迎來到天界第一關，凡人。', '能踏上雲海的人，千年也不過幾個。'], ['你的腳步比雲還穩。', '「雲羽印」是你的了。']],
  ['天使迴廊', '聖歌道館', '聖歌使 蘿絲', '聖歌印', ['#f0ecf8', '#e8d8b0', '#a080d0', '#c8b0e0', '#f0e0ff', 'mist', '#d0c8f0', '#a8a0d8', 'pillar'], ['#8a7ae0', '#fff0f8', '#f0e8ff', '#d0c8f0', '#f4ecf8', '#c8b8e0', 'heaven'], 'sky', '240,230,255', 0.12,
    ['小嵐', ['等等我！我也追上來了！', '聽說三界的道館主都強得離譜。', '這次我們不是對手，是同伴。一起走到最後吧！']], ['聽，這條迴廊的每根柱子都在歌唱。', '讓我聽聽你的戰鬥之歌。'], ['多麼激昂的旋律……', '「聖歌印」獻給你。']],
  ['聖歌花園', '花語道館', '園丁仙 芙蘿', '花語印', ['#b8e8a0', '#f0e0a0', '#e070a0', '#40a060', '#a0f0a0', 'water', '#70d0f0', '#40a0e0', null], ['#70c0f0', '#fff0c0', '#80d880', '#50b060', '#a8e080', '#60a040', 'heaven'], 'green', '255,240,200', 0.08,
    ['厄蘭', ['……又見面了，靈契師。', '小哭學會笑以後，我也開始想贖罪。', '花園深處的花，是用天界的眼淚澆灌的。', '我會在暗處幫你。這一次，是為了讓大家笑著。']], ['花語道館只接待懂得溫柔的人。', '來吧，讓花朵判斷你的心。'], ['你的心，開出了很美的花。', '收下「花語印」吧。']],
  ['審判之庭', '審判道館', '審判官 鐵律', '審判印', ['#d8d0c0', '#c0b090', '#806040', '#8a8060', '#d0c080', 'mist', '#c8c0b0', '#908878', 'pillar'], ['#6a5a80', '#f0d8a0', '#c0b090', '#908060', '#d0c090', '#8a7858', 'heaven'], 'temple', '60,40,10', 0.2,
    ['審判官', ['站住。凡踏入此庭者，都將被衡量罪與善。', '你曾收服無數幻靈——牠們是自願的嗎？', '答案，就在下一場戰鬥裡。']], ['天秤不會說謊。', '讓我衡量你的羈絆有多重。'], ['天秤……傾向了你。', '「審判印」，你有資格。']],
  ['天柱長階', '天柱道館', '守柱人 岳衡', '天柱印', ['#e0e8f4', '#c8d4e8', '#5080c0', '#90b0d8', '#e0f0ff', 'cloud', '#7ab0f0', '#b0d4ff', 'pillar'], ['#3a70d0', '#e8f4ff', '#c0d8f4', '#90b0e0', '#e0ecf8', '#a0b8d8', 'heaven'], 'sky', '220,235,255', 0.12,
    ['星垣博士', ['（靈符傳來聲音）你已經走到天柱了嗎！', '我查了古文獻：這些柱子撐住的不是天空，而是「三界的界線」。', '柱子上的裂痕越來越多，要快！']], ['這座天柱，我守了九百年。', '想過去，就先讓我倒下。'], ['九百年來，你是第一個。', '「天柱印」拿去。']],
  ['天穹之頂', '天穹道館', '天穹王 曜', '天穹印', ['#fff4d0', '#ffe080', '#f0a020', '#f0c040', '#fff0a0', 'cloud', '#ffd890', '#ffeec0', 'pillar'], ['#ff9a40', '#fff0c0', '#ffe0a0', '#f0c070', '#fff0c8', '#e8c880', 'heaven'], 'sky', '255,230,170', 0.14,
    ['天穹王 曜', ['這裡是天界的盡頭。', '往北的星門通往宇宙，往東的黑門通往十二層地獄。', '兩條路都要走完，才救得了世界。']], ['我是天穹之王。', '想通往三界的人，先超越天界最強的光！'], ['太陽，也有被超越的一天。', '「天穹印」。星門與黑門，都為你敞開。']],
  ['月之海', '月面基地', '月面隊長 銀月', '銀月印', ['#b8b8c0', '#8a8a98', '#6070a0', '#7a7a90', '#d0d0e0', 'void', '#0a0a20', '#14143a', 'asteroid'], ['#02020c', '#14143a', '#c8c8d8', '#808090', '#b0b0b8', '#6a6a74', 'space'], 'abyss', '0,0,20', 0.35,
    ['銀月', ['歡迎來到月球，地面人。', '這裡沒有空氣，靠幻靈的靈場呼吸。', '小心，低重力下摔倒會飛很遠。']], ['月亮的背面，藏著最冷靜的戰士。'], ['冷靜不下來了……你太強。', '「銀月印」收好。']],
  ['赤沙火星', '赤沙要塞', '指揮官 赤砂', '赤砂印', ['#c8603a', '#e09060', '#802a1a', '#8a3a20', '#ffa060', 'lava', '#c03a10', '#801808', 'rock'], ['#6a2010', '#e08850', '#a04020', '#702a18', '#c8683a', '#7a3018', 'space'], 'lava', '80,20,0', 0.3,
    ['赤砂', ['這顆星球曾經有海。', '是噬星者喝乾了它。', '你現在踩的沙，全是星球的骨灰。']], ['全軍，迎擊！', '讓赤沙記住你的名字！'], ['要塞……淪陷了。', '「赤砂印」，替火星報仇吧。']],
  ['金星硫霧', '硫霧天宮', '霧后 薇納', '硫霧印', ['#d8c060', '#e8d890', '#a08020', '#a09030', '#f0e070', 'acid', '#c0d030', '#809010', 'crystal'], ['#a08020', '#f0e080', '#c8a040', '#907020', '#d8c060', '#907820', 'space'], 'temple', '80,60,0', 0.3,
    ['薇納', ['這裡的雲是酸的，雨也是酸的。', '最美的星星，往往最危險。', '黎明之星可不是那麼好親近的喔。']], ['美麗的東西都帶毒。', '你撐得過幾回合呢？'], ['居然看穿了霧後的我。', '「硫霧印」賞你。']],
  ['水星鐵原', '鐵原工廠', '鐵匠王 墨丘', '鐵原印', ['#8a8a90', '#b0a890', '#505860', '#606870', '#c0c8d0', 'lava', '#ffa030', '#c04010', 'rock'], ['#101018', '#ffb060', '#70707a', '#4a4a54', '#90908c', '#50504c', 'space'], 'lava', '60,30,0', 0.25,
    ['墨丘', ['這顆星離太陽最近，白天四百度。', '整顆星都是我的鍛造爐。', '你的幻靈，要不要也回爐重造？']], ['錘子不會騙人！', '來，讓我敲敲你的硬度！'], ['好鋼！好鋼啊！', '「鐵原印」是你的。']],
  ['小行星帶', '碎星礦場', '礦長 石破', '碎星印', ['#6a6470', '#8a8488', '#404050', '#505060', '#b0a8c0', 'void', '#060614', '#101030', 'asteroid'], ['#04040e', '#201a3a', '#5a5460', '#3a3640', '#6a6470', '#3a3640', 'space'], 'abyss', '0,0,20', 0.32,
    ['石破', ['這裡以前是一顆完整的行星。', '被吃掉一半，剩下的就成了這片碎石。', '我們礦工在撿的，是一個世界的遺骸。']], ['挖礦的手，出拳也很重！'], ['這一鎬……挖到寶了。', '「碎星印」給你。']],
  ['木星風暴', '風暴浮城', '風暴之主 朱彼', '風暴印', ['#d8a878', '#f0d0a0', '#a05030', '#a87040', '#f0c890', 'cloud', '#c87040', '#e8a870', 'cloud'], ['#804020', '#f0c090', '#d09060', '#a06030', '#e0b080', '#a07040', 'space'], 'storm', '50,20,0', 0.28,
    ['小嵐', ['哇，這個紅斑比地球還大！', '喂，要不要比一場？看誰的夥伴比較強！', '……開玩笑的。等打完噬星者再比。']], ['風暴之中沒有地面。', '只有我，與雷！'], ['風……停了？', '「風暴印」歸你。']],
  ['土星光環', '光環神殿', '環舞者 莎頓', '光環印', ['#e8d8b0', '#f0e8c8', '#b09060', '#c0a878', '#fff0c0', 'void', '#0a0818', '#1a1430', 'crystal'], ['#0a0818', '#403050', '#e8d8b0', '#b09870', '#d8c8a0', '#907850', 'space'], 'sky', '40,30,10', 0.2,
    ['莎頓', ['你正站在光環上。', '億萬顆冰石，跳著永恆的圓舞。', '要不要，也一起跳一支？']], ['跟上我的舞步！'], ['美妙的共舞。', '「光環印」作為回禮。']],
  ['天王星冰晶', '翠冰宮', '冰晶師 烏拉', '翠冰印', ['#b8f0f0', '#d8fafa', '#40a0b0', '#70c8d0', '#e0ffff', 'ice', '#c8f8f8', '#80d0e0', 'crystal'], ['#208090', '#c0f8f8', '#a0e8f0', '#60b8c8', '#c8f4f4', '#70c0d0', 'space'], 'ice', '180,240,250', 0.16,
    ['烏拉', ['這顆星是躺著自轉的。', '傳說是被某個東西撞歪的。', '那東西，現在還在宇宙裡遊蕩。']], ['結晶是時間的藝術。', '讓我把你也變成藝術品。'], ['這份熱度……會融化我的宮殿呢。', '「翠冰印」。']],
  ['海王星深海', '星海龍宮', '海皇使 涅普', '星海印', ['#3058b0', '#6088d8', '#102878', '#2040a0', '#80b0ff', 'water', '#2050c0', '#102880', 'crystal'], ['#061040', '#2050c0', '#1a3a90', '#102870', '#2a50a0', '#102060', 'space'], 'abyss', '0,10,50', 0.34,
    ['涅普', ['歡迎來到鑽石雨的海洋。', '海皇星鯨的歌聲，已經三百年沒有響起了。', '牠在害怕……害怕正在靠近的黑暗。']], ['海之深處，不容輕慢！'], ['浪退了。', '「星海印」，請帶它前行。']],
  ['冥王星邊境', '邊境哨站', '哨兵 普魯', '邊境印', ['#b0b4c8', '#d0d4e0', '#505878', '#7078a0', '#e0e4f8', 'ice', '#a0a8d0', '#6068a0', 'asteroid'], ['#04040c', '#30304a', '#a0a4b8', '#606480', '#a8acc0', '#585c78', 'space'], 'ice', '20,20,50', 0.3,
    ['普魯', ['這裡是太陽系最後的哨站。', '我每天看著星星一顆一顆……消失。', '再往前，連光都回不來了。']], ['最後的防線，由我守住！'], ['……你比我更適合守護。', '「邊境印」交給你了。']],
  ['星雲搖籃', '星雲聖堂', '星母 奧莉安', '星雲印', ['#8060c0', '#c0a0f0', '#d040a0', '#a040c0', '#ffa0f0', 'void', '#200840', '#401080', 'crystal'], ['#200840', '#e060c0', '#8040c0', '#501090', '#7040a0', '#301060', 'space'], 'sky', '60,0,80', 0.22,
    ['奧莉安', ['每顆星星都在這裡出生。', '我接生過太陽，也埋葬過無數恆星。', '孩子，你的光，夠亮了嗎？']], ['讓我看看新星的光芒！'], ['多麼耀眼……', '「星雲印」祝福你。']],
  ['黑洞事象', '事象之塔', '時空觀測者 零', '事象印', ['#1a1030', '#3a2a60', '#5020a0', '#301860', '#a060ff', 'void', '#02000a', '#0a0420', 'crystal'], ['#000004', '#200a40', '#100820', '#08040f', '#1a1030', '#08040f', 'hole'], 'abyss', '10,0,30', 0.5,
    ['零', ['我已經在這裡觀測了十二億年。', '或者一秒。在這裡，時間沒有意義。', '噬星者就在事象地平面的另一邊。']], ['在所有的時間線裡，你都輸了。', '除了一條——證明給我看。'], ['新的時間線……成立了。', '「事象印」。去吧，塔頂就是噬星者。']],
  ['第一層・忘川渡口', '忘川道館', '擺渡人 孟', '忘川印', ['#3a4a50', '#6a7a78', '#204048', '#2a4a50', '#70b0a8', 'water', '#2a5a60', '#103038', 'tomb'], ['#0a1418', '#3a5a60', '#2a3a40', '#141e22', '#3a4a4a', '#1a2426', 'hell'], 'abyss', '0,20,20', 0.45,
    ['擺渡人 孟', ['活人？這可少見。', '過了這條河的人，都會忘記自己是誰。', '你的夥伴會替你記得嗎？']], ['喝下這碗湯前，先贏過我。'], ['……你沒有忘記。', '「忘川印」，渡你過河。']],
  ['第二層・枯骨荒原', '骸骨道館', '骨巫 白朽', '枯骨印', ['#a89880', '#c8b8a0', '#5a4a38', '#7a6a50', '#d8c8a0', 'mist', '#786858', '#584838', 'bone'], ['#201810', '#907860', '#6a5a48', '#40342a', '#8a7a60', '#40342a', 'hell'], 'temple', '30,15,0', 0.4,
    ['白朽', ['這裡的每一根骨頭，都曾經是一個英雄。', '他們都想打倒魔王。', '要不要，也留下你的骨頭？']], ['骨頭會唱歌，你聽過嗎？'], ['咯咯……好硬的骨氣。', '「枯骨印」。']],
  ['第三層・毒沼地獄', '毒蠱道館', '蠱師 青荼', '毒蠱印', ['#4a6a30', '#7a8a50', '#3a5a20', '#2a5020', '#a0f040', 'acid', '#70c020', '#407010', 'dead'], ['#0a1808', '#507020', '#2a4a18', '#142a0c', '#4a6a2a', '#1a2a10', 'hell'], 'abyss', '10,40,0', 0.4,
    ['青荼', ['呼吸慢一點，這裡的空氣有毒。', '毒和藥，只差一個劑量。', '這句話，厄蘭以前也聽我說過。']], ['萬蟲噬心的滋味，嘗嘗吧！'], ['毒對你沒用？有趣。', '「毒蠱印」。']],
  ['第四層・業火平原', '業火道館', '炎獄卒 赤焱', '業火印', ['#5a2a1a', '#8a4a2a', '#401008', '#6a2010', '#ff8030', 'lava', '#ff6010', '#a02008', 'spike'], ['#200404', '#c03010', '#601808', '#300804', '#6a2a14', '#2a0c04', 'hell'], 'lava', '80,10,0', 0.42,
    ['赤焱', ['罪人在這裡燃燒，直到罪被燒完。', '你身上，有多少能燒的？']], ['燒！全部燒光！'], ['火……被你壓住了？！', '「業火印」。']],
  ['第五層・刀山地獄', '刀山道館', '劍鬼 千仞', '刀山印', ['#505460', '#787c88', '#2a2c38', '#3a3e4a', '#c0c8d8', 'mist', '#40444e', '#20222a', 'blade'], ['#0a0a10', '#606470', '#3a3c48', '#1a1c24', '#4a4c58', '#1c1e26', 'hell'], 'storm', '10,10,20', 0.44,
    ['千仞', ['這座山的每一把刀，都是一個敗者的劍。', '走過來的人，腳底不會再完整。']], ['劍已出鞘，無話可說。'], ['……好一招。', '「刀山印」，收下。']],
  ['第六層・血池地獄', '血池道館', '血巫 絳', '血池印', ['#4a1a20', '#7a3a3a', '#300810', '#5a1018', '#ff5060', 'blood', '#a01020', '#500810', 'bone'], ['#100204', '#801018', '#401014', '#20060a', '#501018', '#200408', 'hell'], 'abyss', '60,0,0', 0.46,
    ['絳', ['血是溫的，對吧？', '這池子裡流的是所有戰死幻靈的血。', '你身邊的夥伴，有沒有怕過？']], ['血債，血償。'], ['你的血……很燙。', '「血池印」。']],
  ['第七層・寒冰地獄', '八寒道館', '寒獄官 凜', '八寒印', ['#a8c0e0', '#d0e0f0', '#304870', '#6080b0', '#e0f0ff', 'ice', '#90b8e8', '#4070b0', 'spike'], ['#081020', '#6090c8', '#7098c8', '#304870', '#a0b8d8', '#405878', 'hell'], 'ice', '10,30,70', 0.36,
    ['凜', ['地獄最深的地方不是火，是冰。', '冷到連悔恨都會結凍。']], ['八寒，開！'], ['冰……裂了。', '「八寒印」。']],
  ['第八層・修羅戰場', '修羅道館', '戰鬼 羅睺', '修羅印', ['#5a4038', '#806050', '#3a2020', '#4a3028', '#e08050', 'blood', '#801810', '#400808', 'blade'], ['#180808', '#a04020', '#5a2a20', '#2a1010', '#5a3a30', '#2a1612', 'hell'], 'lava', '50,10,0', 0.4,
    ['羅睺', ['這場仗打了八千年了。', '沒有人記得為什麼打。', '你呢？你為了什麼而戰？']], ['戰！戰！戰！'], ['哈哈哈！好久沒這麼痛快！', '「修羅印」！']],
  ['第九層・無間迷宮', '無間道館', '迷宮主 迷', '無間印', ['#2a2a38', '#4a4a60', '#14141e', '#2a2038', '#8060c0', 'void', '#050508', '#101018', 'tomb'], ['#040408', '#2a2040', '#1a1a28', '#0a0a10', '#2a2a38', '#0a0a10', 'hell'], 'abyss', '10,0,30', 0.55,
    ['迷', ['你走了多久？一天？一萬年？', '這座迷宮的出口，是你最不想面對的回憶。']], ['你能分清哪個我是真的嗎？'], ['你沒有迷路……', '「無間印」。']],
  ['第十層・鏡獄', '鏡獄道館', '鏡妖姬 魘', '鏡獄印', ['#90a0c0', '#c0d0e8', '#6040a0', '#7060b0', '#e0d0ff', 'ice', '#b0c0e8', '#6070b0', 'mirror'], ['#101030', '#a0a0e0', '#6060a0', '#303060', '#7078a8', '#303860', 'hell'], 'sky', '30,10,60', 0.34,
    ['魘', ['看看鏡子裡的你。', '如果你沒遇到夥伴，會變成什麼樣子？', '……對，會變成厄蘭那樣。']], ['打敗鏡子裡的自己吧！'], ['鏡子……碎了。', '「鏡獄印」。']],
  ['第十一層・怨靈王宮', '王宮道館', '怨靈宰相 枯', '怨靈印', ['#403048', '#685070', '#201030', '#3a2848', '#c080ff', 'blood', '#501060', '#280830', 'tomb'], ['#0a0410', '#503070', '#30204a', '#140a20', '#3a2a48', '#140a1c', 'hell'], 'abyss', '30,0,50', 0.5,
    ['厄蘭', ['我走到這裡，是來還債的。', '被我吞掉的悲傷，全都在這座王宮裡。', '小哭，我們一起，把它們放走吧。', '靈契師……下一層，魔王就交給你了。']], ['陛下的王座，不容玷污。'], ['萬怨……散了……', '「怨靈印」。']],
  ['第十二層・冥淵王座', '冥淵道館', '獄主 羅剎', '冥淵印', ['#1a0c10', '#401418', '#500810', '#300810', '#ff3020', 'lava', '#c01808', '#400804', 'spike'], ['#000000', '#600810', '#200408', '#080002', '#1a0c10', '#080204', 'hell'], 'lava', '50,0,0', 0.55,
    ['羅剎', ['你竟然走到了最底層。', '十二層地獄，一層比一層深，最深的是絕望。', '魔王就在這扇門後。']], ['想見魔王，先過我這關！'], ['……你的光，照到地獄的底了。', '「冥淵印」。門，開了。']],
];

const WORLD_OF = k => k > 30 ? REALM_OF(k) : k <= 6 ? '天界' : k <= 18 ? '星海' : '冥淵';
const STAGE_NAMES = { 天界: ['見習聖徒', '白袍祭司', '天界衛士'], 星海: ['星際獵人', '太空水手', '星艦駕駛員'], 冥淵: ['亡者戰士', '地獄獄卒', '黑衣咒術師'] };
const STAGE_LOOK = {
  天界: { hair: '#f0e0a0', shirt: '#f8f4ff', pants: '#c8a050', robe: '#fff4d0' },
  星海: { hair: '#30405a', shirt: '#e0e4f0', pants: '#5a6a90', hat: '#a0b0d0' },
  冥淵: { hair: '#201018', shirt: '#402030', pants: '#1a0c14', hat: '#601020', robe: '#300a18' },
};

function stagePool(k) {
  const lo = k <= 6 ? 1 : k <= 18 ? 7 : 19, hi = k <= 6 ? 6 : k <= 18 ? 18 : 30, out = [];
  for (const d of [0, -1, 1, -2, 2]) { const q = k + d; if (q >= lo && q <= hi && FAMILY_ROSTER[q]) out.push(...FAMILY_ROSTER[q]); if (out.length >= 15) break; }
  return out;
}

// ---------- 地圖產生 ----------
function genStageRows(k, R) {
  const w = 24, h = 20, g = Array.from({ length: h }, () => new Array(w).fill('.'));
  for (let x = 0; x < w; x++) { g[0][x] = 'T'; g[h - 1][x] = 'T'; }
  for (let y = 0; y < h; y++) { g[y][0] = 'T'; g[y][w - 1] = 'T'; }
  const rect = (x0, y0, x1, y1, ch) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (g[y][x] === '.') g[y][x] = ch; };
  // 水域
  const pat = k % 3;
  if (pat === 0) rect(1, 10, 22, 11, '~');
  if (pat === 1) { rect(3, 10, 8, 12, '~'); rect(15, 10, 20, 12, '~'); }
  if (pat === 2) { rect(6, 10, 17, 12, '~'); }
  // 草叢
  rect(2, 13, 8, 15, ','); rect(15, 15, 21, 17, ','); rect(2, 16, 5, 17, ',');
  if (R() > 0.5) rect(15, 13, 20, 13, ','); else rect(6, 17, 8, 17, ',');
  rect(18, 8, 21, 9, ','); rect(2, 8, 4, 9, ',');
  // 障礙物
  for (let i = 0; i < 14; i++) { const x = 1 + Math.floor(R() * 22), y = 12 + Math.floor(R() * 6); if (g[y][x] === '.' && Math.abs(x - 11.5) > 2 && !(y === 15)) g[y][x] = 'T'; }
  for (const [x, y] of [[8, 1], [15, 1], [7, 2], [16, 1]]) if (g[y][x] === '.') g[y][x] = 'T';
  // 主幹道
  for (let y = 0; y < h; y++) for (const x of [11, 12]) g[y][x] = g[y][x] === '~' ? 'b' : '=';
  // 建築：祈光亭、道館
  const flip = k % 2 === 0;
  const cx = flip ? 18 : 3, gx = flip ? 3 : 15;
  for (let y = 3; y <= 5; y++) for (let x = cx; x < cx + 4; x++) g[y][x] = 'H';
  for (let y = 2; y <= 5; y++) for (let x = gx; x < gx + 6; x++) g[y][x] = 'H';
  const cd = cx + 1, gd = gx + 2;
  g[5][cd] = 'D'; g[5][gd] = 'D';
  for (let y = 6; y <= 7; y++) { g[y][cd] = '='; g[y][gd] = '='; }
  for (let x = Math.min(cd, gd); x <= Math.max(cd, gd); x++) g[7][x] = '=';
  return { rows: g.map(r => r.join('')), cd, gd };
}

const POST_MAPS = [];
STAGE_DATA.forEach((d, i) => {
  const k = i + 1, id = 's' + k, [place, gym, leader, badge, p, b, wx, lit, litA, scene, intro, win] = d;
  // 主題
  THEME['t' + k] = { g: p[0], g2: p[0], path: p[1], tree: p[2], tree2: p[3], gc: p[3], gh: p[4], water: p[7], liq: p[5], d1: p[6], d2: p[7], obst: p[8], wx, noTufts: k !== 3 };
  LIGHT['t' + k] = [lit, litA];
  BBG['t' + k] = { sky: [b[0], b[1]], hill: [b[2], b[3]], ground: [b[4], b[5]], plat: [b[4], b[5]], tuft: null, kind: b[6] };
  const R = srand(k * 7919 + 13);
  const { rows, cd, gd } = genStageRows(k, R);
  const m = { name: place, theme: 't' + k, rows, world: WORLD_OF(k), stage: k, exits: [], doors: {}, signs: {}, triggers: [], npcs: [] };
  m.doors[cd + ',5'] = { roof: '#e0a030', label: '祈光亭・補給站', run: () => centerDoor(true) };
  m.doors[gd + ',5'] = { roof: p[2], label: gym, run: () => stageGym(k) };
  const L = stageBaseLevel(k), pool = stagePool(k), low = pool.filter(q => q[1] === 1), mid = pool.filter(q => q[1] === 2), hi = pool.filter(q => q[1] === 3);
  m.wild = [...low.slice(0, 5).map(q => [q[0], L - 2, L + 1, 24]), ...mid.slice(0, 3).map(q => [q[0], L, L + 3, 10]), ...hi.slice(0, 2).map(q => [q[0], L + 3, L + 5, 3])];
  const names = STAGE_NAMES[WORLD_OF(k)], team = n => Array.from({ length: n }, (_, j) => { const q = (mid.length ? mid : low)[(k + j) % (mid.length || low.length)]; return [q[0], L + 1 + j]; });
  m.npcs.push({ id: 'st1', x: 8, y: 9, dir: 'right', look: STAGE_LOOK[WORLD_OF(k)], name: names[k % 3], sight: 3, trainer: { team: team(3), money: L * 40, before: `要去「${gym}」？先過我這關！`, after: '你比傳聞中還強……' } });
  m.npcs.push({ id: 'st2', x: 15, y: 18, dir: 'left', look: STAGE_LOOK[WORLD_OF(k)], name: names[(k + 1) % 3], sight: 3, trainer: { team: team(4).reverse(), money: L * 50, before: `歡迎來到${place}。這裡可不是觀光的地方！`, after: '走吧……前面更危險。' } });
  const lg = FAMILY_ROSTER.L[k];
  if (k !== 18 && k !== 30) m.npcs.push({ id: 'legend', x: 21, y: 12, dir: 'down', legend: lg, name: MONS[lg].n, cond: () => !flag('legend' + lg), talk: () => legendBattle(lg, L + 8, `一股驚人的氣息……傳說神獸「${MONS[lg].n}」現身了！`) });
  else m.npcs.push({ id: 'final', x: 12, y: 1, dir: 'down', legend: lg, name: MONS[lg].n, cond: () => flag('stage' + k) && !flag('legend' + lg), talk: () => finalBoss(k, lg, L + 12) });
  // 連接
  const prev = k === 1 ? ['sky', 11, 1] : k === 7 ? ['s6', 11, 1] : k === 19 ? ['s6', 21, 8] : ['s' + (k - 1), 11, 1];
  m.exits.push({ x: 11, y: 19, w: 2, h: 1, to: prev[0], tx: prev[1], ty: prev[2] });
  if (k !== 6 && k !== 18 && k !== 30) {
    m.exits.push({ x: 11, y: 0, w: 2, h: 1, to: 's' + (k + 1), tx: 11, ty: 18 });
    m.triggers.push({ x: 11, y: 1, w: 2, h: 1, run: async () => { if (!flag('stage' + k)) { await say(`一道屏障擋住了去路。先打倒「${gym}」的館主吧！`); stepBack(); } } });
  }
  if (k === 6) {
    m.rows[8] = m.rows[8].slice(0, 22) + '==';
    m.rows[9] = m.rows[9].slice(0, 22) + '==';
    m.exits.push({ x: 11, y: 0, w: 2, h: 1, to: 's7', tx: 11, ty: 18 });
    m.exits.push({ x: 23, y: 8, w: 1, h: 2, to: 's19', tx: 11, ty: 17 });
    const gate = async () => { if (!flag('stage6')) { await say('星門與黑門都還沒打開。先打倒天穹王吧！'); stepBack(); } };
    m.triggers.push({ x: 11, y: 1, w: 2, h: 1, run: gate }, { x: 22, y: 8, w: 1, h: 2, run: gate });
    m.npcs.find(n => n.id === 'legend').y = 13;
  }
  if (k === 1) m.npcs.push({ id: 'tutor', x: 13, y: 8, dir: 'left', look: { hair: '#ffffff', shirt: '#a08040', pants: '#604020', robe: '#c8a050' }, name: '奧義老師', talk: () => teachUlt() });
  MAPS[id] = m;
  CHAPTERS[id] = [12 + k, `${WORLD_OF(k)}篇・${place}`];
  MAP_SONG[id] = k <= 6 ? 'sky' : k <= 18 ? 'space' : 'hell';
  POST_MAPS.push(id);
  // 主檔的預處理
  m.w = 24; m.h = 20; m.roofAt = {};
  for (const n of m.npcs) n._home = [n.x, n.y];
  m.scene = scene; m.gym = gym; m.leader = leader; m.badge = badge; m.intro = intro; m.win = win; m.L = L;
  setHab(pool.slice(0, 6).map(q => q[0]), place);
});
for (const id in MONS) if (!MONS[id].hab) MONS[id].hab = '由進化而來';
for (const k in FAMILY_ROSTER.L) MONS[FAMILY_ROSTER.L[k]].hab = STAGE_DATA[k - 1][0];

SONGS.space = { bpm: 88, root: 57, mode: 'min', prog: [0, 5, 3, 6], energy: 'calm', lead: 'sine', drums: 1, seed: 83 };
SONGS.hell = { bpm: 96, root: 50, mode: 'min', prog: [0, 1, 0, 6], energy: 'lively', lead: 'sawtooth', drums: 2, seed: 97 };

// 天空聖域往北開路
MAPS.sky.rows[0] = MAPS.sky.rows[0].slice(0, 11) + '=' + MAPS.sky.rows[0].slice(12);
MAPS.sky.exits.push({ x: 11, y: 0, w: 1, h: 1, to: 's1', tx: 11, ty: 18 });
MAPS.sky.triggers.push({ x: 11, y: 1, w: 1, h: 1, run: async () => { if (!flag('finalEnd')) { await say('雲層深處有一道門，現在還打不開。'); stepBack(); } } });

// 新靈符
ITEMS.genesisCharm = { n: '創世靈符', price: 8000, d: '蘊含創世之力，對付傳說神獸的最佳靈符。', use: 'ball', v: 8 };
ITEM_ORDER.push('genesisCharm');

// ---------- 道館與 Boss ----------
function stageTeam(k) {
  const L = stageBaseLevel(k), pool = stagePool(k), size = k === 18 || k === 30 ? 6 : k <= 6 ? 4 : 5;
  const best = pool.filter(q => q[1] >= 2).sort((a, b) => b[1] - a[1]).slice(0, size + 2);
  const list = best.length >= size ? best : pool;
  return Array.from({ length: size }, (_, j) => [list[(j + k) % list.length][0], L + 3 + j]).sort((a, b) => a[1] - b[1]);
}

async function stageGym(k) {
  const m = MAPS['s' + k];
  if (flag('stage' + k)) { healParty(); await say('你的夥伴已經恢復了。繼續前進吧！', { name: m.leader }); return; }
  await say(m.intro, { name: m.leader });
  const r = await trainerBattle({ name: '試煉者 ' + m.leader, look: STAGE_LOOK[WORLD_OF(k)], team: stageTeam(k), money: m.L * 150 });
  if (r !== 'win') return;
  setFlag('stage' + k);
  S.seals = (S.seals || 0) + 1;
  await say(m.win, { name: m.leader });
  addItem('elixir', 2); addItem('ppFruit', 2);
  await jingle('badge');
  showToast(`獲得了「${m.badge}」！（${S.seals}/94）`);
  await say(`（獲得了 ${m.badge}、萬靈藥 ×2、靈力果 ×2）`);
  saveGame(true);
}

async function finalBoss(k, id, lv) {
  await say(k === 18 ? ['宇宙的光，一顆一顆被吸進那隻巨大的眼睛裡。', '噬星者注視著你。'] : ['王座上的黑影緩緩站起。', '「千年了……終於有人走到這裡。」'], { name: k === 18 ? '' : '冥淵魔王' });
  const c = await choose(['挑戰！', '先準備一下'], { title: `要挑戰 ${MONS[id].n} 嗎？`, w: 320, x: W / 2 - 160, y: 300 });
  if (c !== 0) return;
  const r = await wildBattle(makeMon(id, lv), { boss: true });
  if (r !== 'win' && r !== 'caught') return;
  if (r === 'caught') setFlag('legend' + id);
  const key = k === 18 ? 'endSpace' : 'endHell', first = !flag(key);
  setFlag(key);
  if (first) {
    S.money += 50000;
    await say(k === 18 ? ['噬星者的眼睛緩緩閉上，被吞噬的星光重新回到夜空。', '星海得救了！（獲得 $50000）'] : ['魔王的身影化成灰燼，十二層地獄響起了萬千亡魂的嘆息。', '冥淵得救了！（獲得 $50000）']);
    if (flag('endSpace') && flag('endHell')) await trueEnding();
    else await say(`還有${k === 18 ? '冥淵' : '星海'}等著你。用世界地圖回到天穹之頂吧！`);
  }
}

async function trueEnding() {
  setFlag('trueEnd');
  await fadeOut(600); fade = 0;
  await chapterCard('三界終章', '天界、星海、冥淵，全部得救了。');
  await fadeIn(300);
  await say(['幻紋始祖的聲音在天地間響起：', '「謝謝你，靈契師。」', '天使們在雲上歌唱，星星重新亮起，地獄的火也溫柔了下來。', '小嵐笑著拍了拍你的肩膀，厄蘭懷裡的小哭也在笑。', '你的傳說，將被三界永遠傳頌。', '（圖鑑還沒收集完的話，繼續冒險吧！）']);
  S.money += 100000;
  await chapterCard('全破恭喜', `冒險者 ${S.name}　圖鑑 ${Object.keys(S.dex.caught).length} / ${Object.keys(MONS).length}`);
  saveGame(true);
}

async function postgameIntro() {
  setFlag('pgIntro');
  await say(['（星垣博士透過靈符傳來聲音）', `${S.name}！你看見了嗎？天空聖域的雲層裂開了一道門！`, '門的另一邊，是天界、星海與冥淵——三十座道館，還有 200 種從沒見過的幻靈！', '也有好多傳說中的神獸等著你。', '從天空聖域往北走，就能進入三界篇。按 X 用世界地圖可以直接飛過去！'], { name: '星垣博士' });
  addItem('genesisCharm', 3); addItem('lamp', 2); addItem('candy', 5);
  await say('（獲得了 創世靈符 ×3、祈光燈 ×2、經驗糖 ×5）');
  saveGame(true);
}

async function teachUlt() {
  await say(['我能教幻靈「屬性奧義」，那是最華麗的招式。', '50 級以上的幻靈才學得會，一次 $5000。'], { name: '奧義老師' });
  const i = await partyMenu('pick', '要教哪一隻？');
  if (i < 0) return;
  const m = S.party[i], u = ULT[MONS[m.id].t[0]];
  if (m.level < 50) { await say('等牠到 50 級再來吧。', { name: '奧義老師' }); return; }
  if (m.moves.some(x => x.id === u[0])) { await say('牠已經學會了。', { name: '奧義老師' }); return; }
  if (S.money < 5000) { await say('錢不夠喔。', { name: '奧義老師' }); return; }
  S.money -= 5000;
  await learnMove(m, u[0]);
}

// 目標提示接上三界篇
const goalBase = goal;
goal = function () {
  if (!flag('finalEnd')) return goalBase();
  for (let k = 1; k <= 6; k++) if (!flag('stage' + k)) return `第 ${k} 關：${STAGE_DATA[k - 1][1]}${k === 1 && S.map !== 's1' ? '（從天空聖域往北）' : ''}`;
  for (const [lo, hi, g] of [[7, 18, '星海'], [19, 30, '冥淵']]) for (let k = lo; k <= hi; k++) if (!flag('stage' + k)) return `第 ${k} 關：${g}・${STAGE_DATA[k - 1][1]}`;
  if (!flag('endSpace')) return '打倒事象之塔頂端的噬星者';
  if (!flag('endHell')) return '打倒冥淵王座的冥淵魔王';
  return `收集全部 300 種幻靈！（目前 ${Object.keys(S.dex.caught).length} / 300）`;
};

// 進入關卡時播放劇情；破關後的引導
const maybeChapterBase = maybeChapter;
maybeChapter = async function () {
  const m = MAPS[S.map], first = m.scene && !flag('scene' + S.map);
  await maybeChapterBase();
  if (first) { setFlag('scene' + S.map); await say(m.scene[1], { name: m.scene[0] }); }
};
const worldLayerBase = worldLayer;
worldLayer = function () {
  const L = worldLayerBase(), u = L.update;
  L.update = function (dt) {
    if (S.flags.finalEnd && !S.flags.pgIntro && !busy && topLayer() === L && !P.moving) { run(postgameIntro); return; }
    return u.call(this, dt);
  };
  return L;
};

// ---------- 世界地圖：四頁 ----------
const WORLD_PAGES = [
  { name: '幻紋大陸', ids: Object.keys(WORLD) },
  { name: '天界', ids: POST_MAPS.slice(0, 6) },
  { name: '星海', ids: POST_MAPS.slice(6, 18) },
  { name: '冥淵', ids: POST_MAPS.slice(18, 30) },
];
POST_MAPS.forEach((id, i) => {
  const k = i + 1, q = k <= 6 ? k - 1 : k <= 18 ? k - 7 : k - 19, col = q % 4, row = Math.floor(q / 4), snake = row % 2 ? 3 - col : col;
  WORLD[id] = { p: [130 + snake * 170, 130 + row * 150], spawn: [11, 18] };
});
const PAGE_BG = [['#e8d4a8', '#c8a878', '#3a1a08'], ['#fff4d8', '#d8c8f0', '#4a3a70'], ['#0a0a30', '#301050', '#e0e0ff'], ['#300808', '#100204', '#ffc0a0']];

async function worldMap() {
  let page = WORLD_PAGES.findIndex(p => p.ids.includes(S.map)); if (page < 0) page = 0;
  const openOf = p => WORLD_PAGES[p].ids.filter(id => S.visited[id]);
  const pages = WORLD_PAGES.map((_, i) => i).filter(i => openOf(i).length);
  let sel = Math.max(0, openOf(page).indexOf(S.map));
  const pick = await new Promise(res => {
    const L = pushLayer({
      full: true,
      update() {
        const open = openOf(page);
        if (take('up')) { sel = (sel - 1 + open.length) % open.length; sfx('cursor'); }
        if (take('down')) { sel = (sel + 1) % open.length; sfx('cursor'); }
        const pi = pages.indexOf(page);
        if (take('left') && pages.length > 1) { page = pages[(pi - 1 + pages.length) % pages.length]; sel = 0; sfx('cursor'); }
        if (take('right') && pages.length > 1) { page = pages[(pi + 1) % pages.length]; sel = 0; sfx('cursor'); }
        if (take('ok')) { sfx('select'); popLayer(L); res(openOf(page)[sel]); }
        if (take('back')) { popLayer(L); res(null); }
      },
      draw() {
        const t = performance.now() / 1000, open = openOf(page), P0 = WORLD_PAGES[page], bg = PAGE_BG[page], ink = bg[2];
        const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, bg[0]); g.addColorStop(1, bg[1]);
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        if (page >= 2) for (let i = 0; i < 70; i++) { ctx.fillStyle = page === 2 ? '#fff' : '#ff8040'; ctx.globalAlpha = 0.3 + 0.6 * Math.abs(Math.sin(t + i)); ctx.fillRect((i * 137) % W, (i * 89) % H, 2, 2); } ctx.globalAlpha = 1;
        ctx.strokeStyle = ink; ctx.lineWidth = 4; ctx.strokeRect(10, 10, W - 20, H - 20);
        text(P0.name, 36, 24, { size: 34, serif: true, bold: true, color: ink, shadow: false });
        text('← → 換頁　↑ ↓ 選地點　Z 傳送　X 返回', W - 30, 34, { size: 15, align: 'right', color: ink, shadow: false });
        const links = page === 0 ? WORLD_LINKS : P0.ids.slice(1).map((id, i) => [P0.ids[i], id]);
        ctx.setLineDash([6, 6]); ctx.lineWidth = 3;
        for (const [a, b] of links) { const A0 = WORLD[a].p, B0 = WORLD[b].p; ctx.strokeStyle = ink; ctx.globalAlpha = S.visited[a] && S.visited[b] ? 0.8 : 0.25; ctx.beginPath(); ctx.moveTo(A0[0], A0[1]); ctx.lineTo(B0[0], B0[1]); ctx.stroke(); }
        ctx.setLineDash([]); ctx.globalAlpha = 1;
        for (const id of P0.ids) {
          const [x, y] = WORLD[id].p, ok = S.visited[id], isSel = open[sel] === id, done = MAPS[id].stage && flag('stage' + MAPS[id].stage);
          ctx.save(); if (isSel) { ctx.shadowColor = '#ffd040'; ctx.shadowBlur = 20; }
          ctx.fillStyle = ok ? (THEME[MAPS[id].theme] || THEME.green).g : '#6a6a70'; ctx.strokeStyle = isSel ? '#ffd040' : ink; ctx.lineWidth = isSel ? 4 : 2;
          ctx.beginPath(); ctx.arc(x, y, isSel ? 20 : 16, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
          if (done) text('★', x, y - 10, { size: 18, align: 'center', color: '#ffb020' });
          if (S.map === id) drawPerson(ctx, x - 16, y - 46 + Math.sin(t * 4) * 2, 'down', PLAYER_LOOK, 0, 1);
          const nm = ok ? MAPS[id].name.replace(/^第.+層・/, '') : '？？？';
          text(nm, x, y + 22, { size: 14, align: 'center', bold: isSel, color: ink, shadow: false });
        }
        panel(W / 2 - 150, H - 74, 300, 52);
        text(`▶ ${MAPS[open[sel]].name}`, W / 2, H - 60, { size: 20, align: 'center', color: '#ffd77a', bold: true });
      },
    });
  });
  if (!pick) return false;
  if (pick === S.map) { await say('你已經在這裡了。'); return false; }
  await say(`使用星垣博士的傳送靈符，飛往「${MAPS[pick].name}」！`);
  const [x, y] = WORLD[pick].spawn;
  S.dir = 'down';
  await warp(pick, x, y);
  return true;
}

// ---------- 怪物清單改成橫式 ----------
function partyCard(m, x, y, w, h, sel) {
  ctx.save();
  ctx.fillStyle = sel ? 'rgba(90,64,20,0.95)' : 'rgba(24,18,34,0.95)'; ctx.strokeStyle = sel ? '#ffd77a' : '#6a5a40'; ctx.lineWidth = sel ? 3 : 1.5;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, 10); ctx.fill(); ctx.stroke(); ctx.restore();
  drawMon(ctx, m.id, x + w / 2, y + 62, 96, performance.now() / 1000, { still: !sel, alpha: m.hp > 0 ? 1 : 0.4 });
  const nm = monName(m);
  text(nm, x + w / 2, y + 116, { size: nm.length > 5 ? 13 : 15, align: 'center', bold: true, color: sel ? '#ffd77a' : '#f4ead0' });
  text('Lv' + m.level, x + w / 2, y + 136, { size: 14, align: 'center', color: '#c8bca0' });
  hpBar(x + 10, y + 158, w - 20, m.hp, m.maxHp);
  text(`${m.hp}/${m.maxHp}`, x + w / 2, y + 172, { size: 13, align: 'center', color: '#c8bca0' });
  const st = m.hp <= 0 ? '昏厥' : m.status ? STATUS_NAME[m.status] : '';
  if (st) text(st, x + w / 2, y + 192, { size: 13, align: 'center', bold: true, color: '#ff8a7a' });
}

function partyPick(mode, title) {
  return new Promise(res => {
    const n = S.party.length, cw = 120, gap = 5, x0 = (W - (n * cw + (n - 1) * gap)) / 2;
    let sel = mode === 'force' ? Math.max(0, S.party.findIndex(m => m.hp > 0)) : 0;
    const L = pushLayer({
      ui: true,
      update() {
        if (take('left') || take('up')) { sel = (sel - 1 + n) % n; sfx('cursor'); }
        if (take('right') || take('down')) { sel = (sel + 1) % n; sfx('cursor'); }
        if (take('ok')) { sfx('select'); popLayer(L); res(sel); }
        else if (take('back') && mode !== 'force') { sfx('cursor'); popLayer(L); res(-1); }
      },
      draw() {
        ctx.fillStyle = 'rgba(8,5,14,0.93)'; ctx.fillRect(0, 0, W, H);
        text(title, 26, 14, { size: 22, bold: true, serif: true, color: '#ffd77a' });
        text('← → 選擇　Z 確定　X 返回', W - 24, 20, { size: 15, align: 'right', color: '#c8bca0' });
        S.party.forEach((m, i) => partyCard(m, x0 + i * (cw + gap), 52, cw, 206, i === sel));
        const m = S.party[sel];
        panel(16, 268, W - 32, H - 284);
        text(monName(m), 40, 282, { size: 22, bold: true, color: '#ffd77a' });
        MONS[m.id].t.forEach((ty, k) => typeBadge(ty, 40 + k * 52, 316, 46));
        [['攻擊', m.atk], ['防禦', m.def], ['速度', m.spd]].forEach(([k, v], i) => text(`${k}　${v}`, 40, 352 + i * 30, { size: 18 }));
        text(`下一級還需 ${Math.max(0, expForLevel(m.level + 1) - m.exp)}`, 40, 448, { size: 15, color: '#c8bca0' });
        m.moves.forEach((mv, i) => {
          const M = MOVES[mv.id], y = 284 + i * 50;
          typeBadge(M.t, 250, y, 44);
          text(M.n, 304, y + 1, { size: 18 });
          text(`威力 ${M.p || '—'}　PP ${mv.pp}/${M.pp}`, W - 40, y + 3, { size: 14, align: 'right', color: '#c8bca0' });
          text(M.d.slice(0, 26), 250, y + 26, { size: 13, color: '#b0a690' });
        });
      },
    });
  });
}

async function partyMenu(mode, title) {
  const ttl = title || (mode === 'force' ? '請選擇下一隻上場的夥伴' : mode === 'switch' ? '要換哪一隻上場？' : mode === 'item' ? '要對誰使用？' : '夥伴');
  while (true) {
    const i = await partyPick(mode, ttl);
    if (mode !== 'view' || i < 0) return i;
    const c = await choose(['查看能力', '移到第一位', '取消'], { w: 220, x: W / 2 - 110, y: 190 });
    if (c === 0) await summary(S.party[i]);
    if (c === 1) { const [m] = S.party.splice(i, 1); S.party.unshift(m); }
  }
}

// 靈匣也改成橫向排列
function chooseBoxMon(title) {
  return choose(S.box.map(m => (x, y, sel) => {
    drawMon(ctx, m.id, x + 30, y + 46, 84, performance.now() / 1000, { still: !sel });
    text(monName(m), x + 30, y + 92, { size: 13, align: 'center', color: sel ? '#ffd77a' : '#f4ead0' });
    text('Lv' + m.level, x + 30, y + 110, { size: 12, align: 'center', color: '#c8bca0' });
  }), { title, w: W - 20, x: 10, y: 10, cols: 6, rowH: 134, maxRows: 4 });
}
async function boxMenu() {
  while (true) {
    const c = await choose(['存入幻靈', '領出幻靈', '離開'], { title: `靈匣（${S.box.length} 隻）`, w: 280, x: W / 2 - 140, y: 140 });
    if (c === 0) {
      if (S.party.length <= 1) { await say('隊伍至少要留一隻幻靈！'); continue; }
      const i = await partyMenu('pick', '要存入哪一隻？');
      if (i < 0) continue;
      if (S.party.filter((m, k) => k !== i && m.hp > 0).length === 0) { await say('至少要留一隻還能戰鬥的幻靈！'); continue; }
      const [m] = S.party.splice(i, 1); S.box.push(m);
      await say(`${monName(m)} 被存入靈匣了。`);
    } else if (c === 1) {
      if (!S.box.length) { await say('靈匣是空的。'); continue; }
      if (S.party.length >= 6) { await say('隊伍已經滿了！'); continue; }
      const i = await chooseBoxMon('要領出哪一隻？（方向鍵選擇）');
      if (i < 0) continue;
      const [m] = S.box.splice(i, 1); m.hp = m.maxHp; m.status = null; S.party.push(m);
      await say(`${monName(m)} 加入了隊伍！`);
    } else return;
  }
}
