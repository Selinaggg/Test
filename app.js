/* ============================================================
   看台 The Stand — 原型逻辑
   场景：英雄联盟职业联赛 · 季后赛 BO5 第五局 · 34 分钟
        蓝方刚被对面偷了大龙，在线 3.2 万
   ------------------------------------------------------------
   本文件顶部为常量区（全部模拟数据），下方为逻辑区。
   ============================================================ */

/* ============================================================
   常量区 · 全部模拟数据
   ============================================================ */

/* ---------- 全场（公屏）昵称池 ---------- */
const CROWD_NICKS = [
  '小满', '烤冷面', '一只鹿', '风里雨里', '阿泽', '不加糖', '南风知我意',
  '夜航船', '摆烂大师', '土豆炖牛腩', '陈皮', '路人甲乙丙', '柠檬不酸',
  '半夏', '老张', '打工人小李', '云顶之上', '三点一刻', '会飞的鱼',
  '木木', '青柠', '很困', '沉默的大多数', '橘子汽水', '子夜', '有猫饼',
  '大熊', '不吃葱', '西瓜太郎', '晚风', '老李头', '爱吃辣', '游客12138',
  '一颗西柚', '海边的卡夫卡', '阿飞', '冬天的树', '小马过河', '甜筒',
  '路过', '看看不说话', '第七天', '铁子', '咸鱼一条', '雾里看花',
  '奶茶三分糖', '钢铁直男', '阿呆', '莫得感情',
  /* 参考截图风格：文艺、中英混、带 emoji、长短参差 */
  '逆流而上', '木林森森🌲', '巴山楚水凄凉地', '米花云云', '胜仔Pan',
  '人间客', '🌈 Vc 🌈', '水滴', '晚睡🌙', '孤帆远影',
  '一半烟火一半清欢', '南巷清风', '深海旅人', '拾光记', '青柠🍋',
  'Cathy_', '小笼包子', '云边有个小卖部', '风起', '不问归期',
  '橘子🍊', '雨落江南', '半山听雨', 'Kevin', '晚风🍃', '柚子茶',
  '打野的心', '带带我啊队友', '会赢的', '不服就干'
];

/* 少量高亮昵称（模拟粉丝团/贵族，仅用于视觉层次） */
const CROWD_VIP_NICKS = ['峡谷老观众', '守塔人', '十年老粉', '蓝色信仰'];

/* ---------- 公屏里的非对话噪音：这部分才是"公屏读不了"的另一半真相 ---------- */
const GIFTS = [
  { ico: '🎟️', name: '人气票', n: 1 },
  { ico: '🎟️', name: '人气票', n: 99 },
  { ico: '🌹', name: '玫瑰',   n: 1 },
  { ico: '🍭', name: '棒棒糖', n: 10 },
  { ico: '💗', name: '小心心', n: 5 },
  { ico: '🎂', name: '生日蛋糕', n: 1 }
];

/* 官方解说在公屏的发言（带「主播」标签） */
const ANCHOR_MSGS = [
  '这波团确实开早了，视野没做',
  '接下来看高地这一波',
  '别急，还有买活',
  '大龙加成还剩两分钟'
];

/* 系统通知（带「通知」标签） */
const NOTICES = [
  { kind: 'notice', text: '欢迎来到直播间，喜欢的话点个赞支持一下吧！', btn: '点赞鼓励' },
  { kind: 'notice', text: '文明观赛，理性发言，共建良好观赛氛围' },
  { kind: 'notice', text: '本场比赛回放将在赛后生成', btn: '预约提醒' }
];

/* 公屏消息类型配比：真实大场里，真正的"对话"只占六成多一点 */
const MIX = { comment: .80, join: .11, follow: .09, notice: 0, anchor: 0 };

/* ---------- 全场语料：短、碎、重复、情绪宣泄（§6.2） ---------- */
const CROWD_MSGS = [
  '啊啊啊啊啊', '大龙没了', '完了', '这怎么打', '谁让开的团',
  '离谱', '6666', '视野呢', '打野在干嘛', '没了没了',
  '还有机会', '别急', '稳住', '我不看了', '心态崩了',
  '就这？', '辅助闪现交早了', '说了别开', '啊？', '我靠',
  '这波必输', '反了反了', '还能翻', '兄弟们冷静', '走了走了',
  '+1', '太可惜了', '差一点', '打得真好', '对面太稳了',
  '买活啊', '有人买活吗', '快回防', '高地保不住',
  '刚进来发生什么了', '前面的说下', '有回放吗', '比分多少',
  '啊这', '绝了', '好家伙', '血压上来了', '明年再来',
  '啊啊啊', '大龙啊', '真的完了', '这也能被偷', '眼呢眼呢',
  '救命', '不是吧', '我裂开了', '顶不住了', '守高地啊',
  '别送了', '回来回来', '有没有搞错', '这波稳了？', '笑不出来',
  '哈哈哈哈', '6', '啊啊啊啊啊啊啊', '认真的吗', '看不下去了',
  '还有买活', '闪现呢', '推塔啊', '下路没了', '再等等',
  '别走啊', '还没结束', '相信他们', '这局够呛', '心疼',
  '前面别刷屏', '看不清了', '刷太快了', '有人吗', '说啥呢都',
  /* 长短参差补充：短句、疑问、"哈哈"长串、两行长评 */
  '这局节奏好乱',
  '刚才发生了什么？？',
  '我也觉得',
  '队友不要了？',
  '看下一波谁先犯错了',
  '辅助刚复活，绕后面插一个',
  '哈哈哈哈哈哈哈哈对面这波完蛋了现在完全不敢硬上了',
  '打野这波蹲得太漂亮了直接一波带走',
  '这局主播状态是真的好啊感觉整场都在带节奏',
  '我觉得还是应该先拿龙再打团这样容错率高一点',
  '解说说得对这波开团确实早了视野都没做',
  '对面辅助交了闪现了现在就是抓他的好机会',
  '这个走位真的绝了兄弟们看到没有',
  '兄弟们上分了上分了这波稳了',
  '前面刷屏的能不能停一下真的看不清',
  '主播这一手操作我给满分',
  '想问下大家用的什么设备看直播啊画质好清晰',
  '这波如果能推掉高地基本就锁定胜局了',
  '真的一直在等这一波终于打出来了'
];

/* ---------- 看台：话题组 A（默认）复盘这波团该不该开（§6.3） ---------- */
const TOPIC_A = {
  id: 'A',
  zone: '12 区',
  /* 该台的话题关键词：用于「用户原话 → 选台」匹配（§ 方案 B/E 同源） */
  keywords: ['视野', '眼', '大龙', '开团', '这波', '辅助', '打野', '高地', '买活', '推塔', '塔', '守'],
  /* 冷启动背景：从公屏打捞的真评论（是背景，不是台内成员发言，见 PRD §10） */
  bg: [
    '这波根本没视野',
    '辅助闪现交早了',
    '这里真的不该进'
  ],
  members: [
    { name: '南山下雨',   color: '#4a7dff' },
    { name: '半糖不加冰', color: '#e0603c' },
    { name: '凌晨三点',   color: '#3f9e78' },
    { name: '把把上分',   color: '#8a5cf0' },
    { name: '椰子冻',     color: '#c2892f' },
    { name: '路过的猫',   color: '#3b8ea8' },
    { name: '看戏群众',   color: '#b0466f' },
    { name: '老观众了',   color: '#5b6bd0' }
  ],
  /* 20 条上下文：每一条都在接上一条 */
  context: [
    '这波团其实不该开，视野是空的',
    '但不开的话大龙也保不住啊',
    '保不住可以放，血量还够守高地',
    '放了下一波就更难打了，装备差距会拉开',
    '问题是他们进场的时候我方辅助还没到位',
    '辅助那时候在下路补线，回不来',
    '那就是节奏没对齐，不是这波打不了',
    '对，是前面分路的时候就已经错开了',
    '其实 30 分钟那波推塔就该收一收',
    '那波推得确实有点贪',
    '贪也正常，当时有人头优势',
    '优势期打得急一点没毛病，主要是视野没跟上',
    '视野是真的空，整个大龙区一个眼都没有',
    '眼位是辅助的活，但他一直在下路',
    '所以还是分工的问题',
    '现在说这些也晚了，看能不能守住高地',
    '守高地要看买活，还有两个能买',
    '买活够的话还能拖',
    '拖到后期装备成型确实有机会',
    '就看下一波谁先犯错了'
  ],
  /* 之后持续生成的新消息，沿着同一条线往下走 */
  pool: [
    '高地要是守下来，大龙那边还能反打一次',
    '反打得看对面敢不敢直接压上来',
    '他们大概率先推下路，那边塔本来就残了',
    '下路确实最脆，得留个人看着',
    '买活的两个人先别急着交',
    '交早了等于白买，得等他们真上高地',
    '关键还是别再把视野送出去',
    '现在插眼来得及吗',
    '来得及，辅助刚复活，绕后面插一个',
    '我觉得还能拖十分钟',
    '拖到装备成型就是另一回事了',
    '最怕的是心态，急着开团就真没了',
    '对面现在其实也不敢硬上',
    '他们大龙加成还有时间，肯定会用',
    '加成结束前守住就算赢一半',
    '那这几分钟一步都不能错',
    '我方还有一个闪现没交',
    '那个闪现留着挡开团正好',
    '说到底还是看下一波谁先犯错',
    '刚才那波要是不开，现在局面完全不一样',
    '也不好说，不开可能更被动',
    '反正现在只能往前看了',
    '别的不说，这局节奏是真的乱',
    '乱归乱，比分还是 2 比 2 啊'
  ]
};

/* ---------- 看台：话题组 B（换一批后）选人与阵容视角（§6.3） ---------- */
const TOPIC_B = {
  id: 'B',
  zone: '7 区',
  keywords: ['阵容', '选人', 'BP', 'bp', '后期', '前期', '节奏', '下路', '闪现', '教练', '赌', '发育'],
  bg: [
    '这局 BP 就不太对',
    '对面阵容更适合打后期',
    '前期节奏没打出来'
  ],
  members: [
    { name: '一杯拿铁',   color: '#2f8f6f' },
    { name: '风吹麦浪',   color: '#c25b3a' },
    { name: '不吃香菜',   color: '#5566d8' },
    { name: '深夜食堂',   color: '#a9622c' },
    { name: '二十四桥',   color: '#7a4fc0' },
    { name: '周三见',     color: '#37879e' },
    { name: '阿桔',       color: '#b34d68' },
    { name: '蓝色信号',   color: '#3d6fa8' }
  ],
  context: [
    '其实这局从选人阶段就已经不太对了',
    '对面拿的那套更适合打后期',
    '我方是想打节奏的，但节奏没打出来',
    '前期没滚起来，中期就特别难受',
    '第三手那个选择挺冒险的',
    '冒险但合理吧，赌的就是前期',
    '赌输了就是现在这样',
    '主要是打野前期完全没往下路走',
    '下路那边确实可以早点抓一波',
    '抓不动，对面辅助一直有视野',
    '视野这事从头到尾都是问题',
    '所以还是打法和阵容没对上',
    '也可能教练组本来就想稳着来',
    '稳到 34 分钟被偷大龙，也挺讽刺的',
    '后期阵容就是这样，越拖对我方越不利',
    '我倒觉得拖到后期我方也有一战之力',
    '那得看这波高地能不能守住',
    '守住了就能拖，拖住就还有机会',
    '反正下一波团特别关键',
    '看谁先交闪现吧'
  ],
  pool: [
    '现在讨论选人也来不及了，只能按这套打',
    '按这套打就得赌对面失误',
    '职业比赛哪有全程不失误的',
    '对面后期确实强，但操作空间还在',
    '我方还有买活的优势',
    '买活在后期不太算优势吧',
    '至少能多守一波，多守一波就是多两分钟',
    '两分钟够刷一波兵线了',
    '所以还是要稳住不送',
    '别再单独走位就行',
    '刚才那个下路就是走太前了',
    '走太前是因为想清线，能理解',
    '理解归理解，代价有点大',
    '这已经是第五局了，压力都在身上',
    '决胜局手抖也正常',
    '那就更得靠阵容兜底，可惜阵容不兜',
    '所以我说选人那会儿就该考虑到',
    '事后诸葛亮谁都会说',
    '也不是，赛前就有人提过这个问题',
    '那看来是真没预判到对面这套',
    '下一局希望能调整过来',
    '没有下一局了，这就是最后一局',
    '那就更得赢这一波',
    '别急，还没结束呢'
  ]
};

/* ---------- 用户发言后的回应语料（§6.4） ---------- */

/* 通用模板池：用户原话没命中任何关键词时兜底 */
const REPLY_TEMPLATES = [
  '@{我} 同意，我也是这么看的',
  '@{我} 这个点确实关键',
  '@{我} 不过我觉得还得看当时的血量',
  '@{我} 你这么一说我又去看了眼回放',
  '@{我} 有道理，前面没人提这个'
];

/* 命中关键词时的定制回应：必须引用用户原话里的那个词，不能是通用敷衍 */
const KEYWORD_REPLIES = {
  '视野': '@{我} 你说的视野这点确实关键，那会儿大龙区一个眼都没有',
  '眼':   '@{我} 眼位这块你说到点上了，全靠辅助一个人根本铺不开',
  '大龙': '@{我} 大龙这波就是转折点，你说得对',
  '开团': '@{我} 这波团我也觉得开得太急，同意你',
  '这波': '@{我} 这波确实有问题，你这么一说我又想了一遍',
  '辅助': '@{我} 辅助那时候确实不在位，这个点前面没人提',
  '打野': '@{我} 打野的路线是有问题，你说的有道理',
  '高地': '@{我} 守高地这块我跟你想的一样，就看下一波',
  '买活': '@{我} 买活确实是最后的底牌，你提醒我了',
  '推塔': '@{我} 推塔那波是贪了，你说得没错',
  '塔':   '@{我} 塔这块确实亏了，前面就该收一收',
  '守':   '@{我} 能不能守住我跟你判断一致',
  '阵容': '@{我} 阵容这块我也这么看，从选人就有问题',
  '选人': '@{我} 选人阶段确实埋了雷，你这个角度对',
  '节奏': '@{我} 节奏没打出来是真的，你这么说我更确定了',
  '后期': '@{我} 后期这块得看装备成型，你说得在理',
  '前期': '@{我} 前期确实没滚起来，同意你',
  '下路': '@{我} 下路那边确实是突破口，你观察得挺细',
  '闪现': '@{我} 闪现这个细节我没注意，你一说确实是',
  '赌':   '@{我} 说白了就是在赌，你这个说法挺准'
};

/* 第二个人跟上，形成一小段对话（接的是第一个回应，不是各说各话） */
const SECOND_REPLIES = [
  '确实，@{我} 这个点前面一直没人提到',
  '同意楼上，说到底还是节奏没对齐',
  '我补一句，那会儿我方还有买活没交',
  '这么一串下来思路就清楚多了',
  '前面几波其实都能连起来看',
  '那按这个说法，下一波才是真的关键'
];

/* 预览条可读性过滤：这些词出现即判定为"情绪宣泄"，不作为预览句 */
const EMOTION_WORDS = ['啊啊', '6666', '离谱', '完了', '救命', '哈哈', '啊这', '绝了', '心态'];

/* ---------- 速率与时序参数（§3 / §4） ---------- */
const RATE = {
  crowdMin: 150,     // 全场：每 150–280ms 一条（约 4–6 条/秒）
  crowdMax: 280,
  standMin: 5000,    // 看台：每 5–9 秒一条
  standMax: 9000,
  crowdKeep: 45      // 公屏 DOM 最多保留条数（一屏约 10 条，留足缓冲）
};

const TIMING = {
  reply1Min: 2000,   // §4：2–4 秒后第一个人回应
  reply1Max: 4000,
  reply2Min: 3000,   // §4：再过 3–6 秒第二个人跟上
  reply2Max: 6000,
  typing:     900,   // 回应前的"正在输入"时长
  peekSwap:   6500,  // 预览条换句间隔（5–8 秒）
  toast:      3200,  // 轻提示停留
  rescue:     7000,  // 捞起提示停留（保留兼容，实际由 peekRescueDwell 控制）
  peekIdleDwell:   4500,  // （保留常量，已不再使用 idle 态自动入场）
  peekRescueDwell: 5000,  // 捞起入口停留时长（不点击 → 到时后向右滑出）
  peekLeave:        440,  // 消失过渡时长，与 CSS .is-leaving transition 对齐
  peekCooldown:    2500   // 两次 rescue banner 之间的最小间隔，防刷屏
};

const ME = { name: '我', color: '#fe2c55' };

/* ============================================================
   逻辑区
   ============================================================ */

const $ = (id) => document.getElementById(id);

const el = {
  screen:    $('screen'),
  mainCrowd: $('mainCrowd'),
  giftArea:  $('giftArea'),
  standList: $('standList'),
  sheet:     $('sheet'),
  sheetScrim:$('sheetScrim'),
  keyboard:  $('keyboard'),
  dockInput: $('dockInput'),
  standCount:$('standCount'),
  scrim:     $('scrim'),
  moreSheet: $('moreSheet'),
  moreGrab:  $('moreGrab'),
  openMore:  $('openMore'),
  moreStand: $('moreStand'),
  moreCancel:$('moreCancel'),
  composer:  $('composer'),
  send:      $('send'),
  dock:      $('dock'),
  liveInput: $('liveInput'),
  liveSend:  $('liveSend'),
  peek:      $('peek'),
  peekZone:  $('peekZone'),
  peekLine:  $('peekLine'),
  toast:     $('toast'),
  replyBar:  $('replyBar'),
  replyName: $('replyName'),
  replyCancel: $('replyCancel'),
  composeSummary: $('composeSummary'),
  /* 右侧引导层 */
  guide:       $('guide'),
  guideCur:    $('guideCur'),
  guideTotal:  $('guideTotal'),
  guideBar:    $('guideBar'),
  guideCard:   $('guideCard'),
  guideTitle:  $('guideTitle'),
  guideDesc:   $('guideDesc'),
  guideHint:   $('guideHint'),
  guideDone:   $('guideDone'),
  guideRestart:$('guideRestart'),
  shareHint:   $('shareHint')
};

const state = {
  open: false,
  moreOpen: false,
  topic: TOPIC_A,        // 当前分配到的台。预览条与分配同源，只有这一个真值
  standCursor: 0,        // 话题 pool 游标
  lastSpeaker: null,
  firstStandVisit: true, // 首次切到看台的一次性引导
  rescueUsed: false,     // （已废弃，保留字段以防外部引用；改用 lastRescueAt + peekCooldown 节流）
  lastRescueAt: 0,       // 上次触发 rescue banner 的时间戳，用于冷却
  /* 预览条形态：hidden（S0 纯观看，默认） | idle（S1 弱入口） | rescue（S3 捞起） */
  peekMode: 'hidden',
  myLastText: '',        // 自己最近说的话，用于关键词选台
  replyingTo: null,      // 看台内正在回复的对象 { name, color, text }
  composeOpen: false,    // 看台 Compose Mode（键盘输入态）
  savedStandScroll: null, // Compose 态下保存的看台滚动位置
  gotReply: false,        // 是否已收到别人的 Reply（用于引导第 5 步 + 分享气泡）
  /* 会话延续（看台只在当前观看 Session 内持续，不做长期沉淀） */
  standEntered: false,    // 是否已进入过看台（首次 vs 再次的分水岭）
  standMsgCount: 0,       // 看台累计消息条数（含台内成员 + 我 + 回复）
  standSeenCount: 0,      // 上次收起看台时已看到的消息条数
  pendingReplies: 0,      // 离开期间收到的、直接 @我 的新回复条数（外部入口用）
  standPeople: 8          // 头部「N 人正在聊」的弱化人数
};

const rand  = (a, b) => a + Math.random() * (b - a);
const pick  = (arr) => arr[(Math.random() * arr.length) | 0];

/* ------------------------------------------------------------
   直播间氛围：真实截图已含在线人数与比赛计时，无需再脚本驱动
   ------------------------------------------------------------ */

/* ------------------------------------------------------------
   全场流：每 60–120ms 一条，同时渲染到主屏公屏与面板内「全场」
   样式与入场动效对齐 live-ai-summary 参考稿
   ------------------------------------------------------------ */
function avColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return `hsl(${h} 42% 46%)`;
}

function span(cls, text) {
  const s = document.createElement('span');
  s.className = cls;
  if (text !== undefined) s.textContent = text;
  return s;
}

/* 等级标签：5 张真图（3/14/25/27/28），按昵称哈希稳定分配，同一人恒定 */
const LEVELS = [3, 14, 25, 27, 28];
function levelFor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return LEVELS[h % LEVELS.length];
}
function lvBadge(lv) {
  const b = document.createElement('span');
  b.className = 'lv-badge lv-' + lv;
  return b;
}

/* msg: { kind:'comment'|'anchor'|'notice'|'join'|'follow'|'gift', name, text, gift, mine } */
function crowdNode(msg) {

  /* 礼物 */
  if (msg.kind === 'gift') {
    const box = document.createElement('div');
    box.className = 'msg-gift';
    const av = document.createElement('div');
    av.className = 'gift-avatar';
    av.style.background = avColor(msg.name);
    av.textContent = msg.name.slice(0, 1);
    const info = document.createElement('div');
    info.className = 'gift-info';
    info.appendChild(span('gift-name', msg.name));
    info.appendChild(span('gift-item', '送' + msg.gift.name));
    box.appendChild(av);
    box.appendChild(info);
    box.appendChild(span('gift-emoji', msg.gift.ico));
    box.appendChild(span('gift-count', 'x ' + msg.gift.n));
    return box;
  }

  /* 带标签的气泡：系统通知 / 官方解说 */
  if (msg.kind === 'notice' || msg.kind === 'anchor') {
    const box = document.createElement('div');
    box.className = 'msg-bubble';
    const t = span('tag ' + (msg.kind === 'anchor' ? 'tag-anchor' : 'tag-notice'),
                   msg.kind === 'anchor' ? '主播' : '通知');
    box.appendChild(t);
    const txt = span('msg-text');
    if (msg.kind === 'anchor') txt.appendChild(span('msg-uname-inline', '官方解说：'));
    txt.appendChild(document.createTextNode(msg.text));
    if (msg.btn) txt.appendChild(span('action-btn', msg.btn));
    box.appendChild(txt);
    return box;
  }

  /* 普通评论 / 进场 / 关注：统一走 msg-plain */
  const box = document.createElement('div');
  box.className = 'msg-plain' + (msg.mine ? ' is-mine' : '');
  box.appendChild(lvBadge(msg.mine ? 27 : levelFor(msg.name)));
  if (msg.kind === 'join') {
    box.appendChild(span('uname', msg.name + ' '));
    box.appendChild(span('body', '来了'));
  } else if (msg.kind === 'follow') {
    box.classList.add('is-follow');
    box.appendChild(span('uname', msg.name + ' '));
    box.appendChild(span('body', '关注了主播'));
  } else {
    box.appendChild(span('uname', msg.name + '：'));
    box.appendChild(span('body', msg.text));
  }
  return box;
}

/* 入场：sizer 的 max-height 由 0 线性长到 100px，把上面的消息平滑顶上去 */
function enter(box, node, instant, cap) {
  const h = (cap || 100) + 'px';
  const sizer = document.createElement('div');
  sizer.className = 'sizer';
  sizer.appendChild(node);
  box.appendChild(sizer);

  if (instant) {
    sizer.style.transition = 'none';
    sizer.style.maxHeight  = 'none';
    return sizer;
  }

  requestAnimationFrame(() => requestAnimationFrame(() => { sizer.style.maxHeight = h; }));
  /* 兜底：动画不论是否跑完（低端机 / 减弱动效 / 内容超过 cap），
     到点一律解除高度限制，避免消息堆叠重叠 */
  setTimeout(() => {
    sizer.style.transition = 'none';
    sizer.style.maxHeight  = 'none';
  }, 540);
  return sizer;
}

function pushCrowd(msg, instant) {
  const box  = el.mainCrowd;
  const node = crowdNode(msg);
  enter(box, node, instant);
  while (box.childElementCount > RATE.crowdKeep) box.removeChild(box.firstElementChild);
  return node;
}

/* 盯住自己那条：它滚出可视区顶部的那一刻，就是"被冲走"的那一刻（方案 B 的触发点） */
let sweepTimer = null;
function watchSweep(node) {
  clearTimeout(sweepTimer);
  const box = el.mainCrowd;
  const tick = () => {
    if (!node.isConnected) return onSwept();
    if (node.getBoundingClientRect().bottom <= box.getBoundingClientRect().top + 2) return onSwept();
    sweepTimer = setTimeout(tick, 120);
  };
  sweepTimer = setTimeout(tick, 300);
}

/* 按真实配比随机生成一条公屏消息 */
const NICK_EMOJIS = ['🌲','🌈','🌙','🍊','🍋','🍃','🐟','🐱','⭐','☕','🎧','🍭','🌸','🍑','✨','🌊','🦌','🌛','🍀'];
/* 25% 概率给昵称末尾追加一个 emoji（不所有都加，保留朴素感） */
function pickNick(){
  const n = pick(CROWD_NICKS);
  return Math.random() < 0.25 ? n + pick(NICK_EMOJIS) : n;
}

function randomCrowdMsg() {
  let r = Math.random();
  if ((r -= MIX.follow) < 0) return { kind: 'follow', name: pickNick() };
  if ((r -= MIX.join)   < 0) return { kind: 'join',   name: pickNick() };
  if ((r -= MIX.notice) < 0) return pick(NOTICES);
  if ((r -= MIX.anchor) < 0) return { kind: 'anchor', text: pick(ANCHOR_MSGS) };
  return { kind: 'comment', name: pickNick(), text: pick(CROWD_MSGS) };
}

function crowdTick() {
  pushCrowd(randomCrowdMsg());
  setTimeout(crowdTick, rand(RATE.crowdMin, RATE.crowdMax));
}

/* 预填一屏，避免刚打开时下方是空的（预填的不走入场动效） */
function seedCrowd(n) {
  for (let i = 0; i < n; i++) pushCrowd(randomCrowdMsg(), true);
}

/* ------------------------------------------------------------
   进场横幅：右侧平入 → 礼物区上方停留 → 左侧加速冲出，循环触发
   ------------------------------------------------------------ */
function startJoinBanner() {
  const b = $('joinBanner');
  if (!b) return;
  const play = () => {
    b.classList.remove('is-play');
    void b.offsetWidth;              // 强制回流，允许重播
    b.classList.add('is-play');
  };
  setTimeout(function loop() {
    play();
    setTimeout(loop, rand(3000, 5000));    // 每 3–5 秒一个进场，循环不间断
  }, 1500);
}

/* ------------------------------------------------------------
   活动图倒计时：两个角标各自倒数，归零后循环
   ------------------------------------------------------------ */
function startPromoCountdown() {
  const fmt = (s) => String((s / 60) | 0).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  const timers = [
    { el: $('promoTime1'), s: 57,  max: 90 },   // 价值1999钻
    { el: $('promoTime2'), s: 7,   max: 30 }    // 圆形活动
  ];
  setInterval(() => {
    timers.forEach(t => {
      if (!t.el) return;
      t.s = t.s > 0 ? t.s - 1 : t.max;          // 归零后回到 max，循环
      t.el.textContent = fmt(t.s);
    });
  }, 1000);
}

/* ------------------------------------------------------------
   送礼区（动效与样式严格对齐 live-ai-summary 参考稿）
   礼物从左滑入：wrapper 先展开高度腾位，内容再从左滑入；
   堆叠若干秒后渐隐、再高度收缩消失，循环。
   ------------------------------------------------------------ */
const GIFT_EASE = 'cubic-bezier(0.22,0.61,0.36,1)';
let giftTimers = [];

function buildGiftCard(gift) {
  /* 礼物区专用：整条 PNG 图片版（不影响公屏 crowdNode 的礼物渲染） */
  const box = document.createElement('div');
  box.className = 'gift-img ' + (gift && gift.img === 'b' ? 'gift-img--b' : 'gift-img--a');
  return box;
}

/* 从左滑入 */
function giftEnter(gift) {
  const probe = buildGiftCard(gift);
  Object.assign(probe.style, { position: 'fixed', visibility: 'hidden', pointerEvents: 'none' });
  document.body.appendChild(probe);
  const h = probe.offsetHeight;
  document.body.removeChild(probe);

  const wrapper = document.createElement('div');
  Object.assign(wrapper.style, { overflow: 'hidden', maxHeight: '0px', transition: 'none' });
  const inner = buildGiftCard(gift);
  Object.assign(inner.style, { opacity: '0', transform: 'translateX(-120%)', transition: 'none' });
  wrapper.appendChild(inner);
  el.giftArea.appendChild(wrapper);

  requestAnimationFrame(() => requestAnimationFrame(() => {
    wrapper.style.transition = `max-height 0.35s ${GIFT_EASE}`;
    wrapper.style.maxHeight  = h + 'px';
    const t = setTimeout(() => {
      inner.style.transition = `opacity 0.35s ${GIFT_EASE}, transform 0.4s ${GIFT_EASE}`;
      inner.style.opacity    = '1';
      inner.style.transform  = 'translateX(0)';
    }, 200);
    giftTimers.push(t);
  }));
  return wrapper;
}

/* 渐隐 → 高度收缩 */
function giftLeave(wrapper, onDone) {
  const inner = wrapper.firstElementChild;
  if (inner) { inner.style.transition = 'opacity 0.4s ease'; inner.style.opacity = '0'; }
  const t1 = setTimeout(() => {
    wrapper.style.transition = `max-height 0.35s ${GIFT_EASE}`;
    wrapper.style.maxHeight  = '0px';
    const t2 = setTimeout(() => {
      if (wrapper.parentNode) wrapper.remove();
      if (onDone) onDone();
    }, 370);
    giftTimers.push(t2);
  }, 400);
  giftTimers.push(t1);
}

function startGiftLoop() {
  giftTimers.forEach(clearTimeout);
  giftTimers = [];
  el.giftArea.innerHTML = '';

  const LOOP_GAP = 2000;

  function runCycle() {
    const g0 = { img: 'a' }, g1 = { img: 'b' };
    const el0 = giftEnter(g0);
    /* 1.0s 后第二份礼物插入，把第一份往上推 */
    const t1 = setTimeout(() => {
      const el1 = giftEnter(g1);
      /* 再 2s 后第一份先渐隐 */
      const t2 = setTimeout(() => {
        giftLeave(el0, () => {
          /* 400ms 后第二份渐隐 */
          const t4 = setTimeout(() => {
            giftLeave(el1, () => {
              const t5 = setTimeout(runCycle, LOOP_GAP);
              giftTimers.push(t5);
            });
          }, 400);
          giftTimers.push(t4);
        });
      }, 2000);
      giftTimers.push(t2);
    }, 1000);
    giftTimers.push(t1);
  }

  const first = setTimeout(runCycle, 1200);
  giftTimers.push(first);
}

/* ------------------------------------------------------------
   看台流：每 5–9 秒一条，气泡样式，内容在接上一句
   ------------------------------------------------------------ */
function nextSpeaker() {
  const list = state.topic.members;
  let s;
  do { s = pick(list); } while (list.length > 1 && s === state.lastSpeaker);
  state.lastSpeaker = s;
  return s;
}

/* 把「@我」渲染成高亮，其余走 textContent，避免注入 */
function fillBubble(bub, text) {
  const at = '@' + ME.name;
  const i = text.indexOf(at);
  if (i < 0) { bub.textContent = text; return; }
  if (i > 0) bub.appendChild(document.createTextNode(text.slice(0, i)));
  const tag = document.createElement('span');
  tag.className = 'at';
  tag.textContent = at;
  bub.appendChild(tag);
  bub.appendChild(document.createTextNode(text.slice(i + at.length)));
}

function standNode(user, text, opts = {}) {
  const row = document.createElement('div');
  row.className = 'smsg' + (opts.mine ? ' is-mine' : '');
  if (opts.instant) row.style.animation = 'none';

  const av = document.createElement('div');
  av.className = 'sav';
  av.style.background = user.color;
  av.textContent = user.name.slice(0, 1);

  const body = document.createElement('div');
  body.className = 'sbody';

  const nm = document.createElement('div');
  nm.className = 'sname';
  nm.textContent = user.name;

  const bub = document.createElement('div');
  bub.className = 'sbub';
  let quote = null;
  if (opts.typing) {
    bub.classList.add('is-typing');
    bub.innerHTML = '<i></i><i></i><i></i>';
  } else {
    const textNode = document.createElement('span');
    textNode.className = 'sbub-text';
    fillBubble(textNode, text);
    bub.appendChild(textNode);

    /* reply_to 引用：微信风独立小标签，气泡下方、与气泡分离 */
    if (opts.replyTo) {
      quote = document.createElement('div');
      quote.className = 'sbub-quote';
      const qn = document.createElement('span');
      qn.className = 'sbq-name';
      qn.textContent = opts.replyTo.name + '：';
      const qt = document.createElement('span');
      qt.className = 'sbq-text';
      qt.textContent = opts.replyTo.text;
      quote.appendChild(qn);
      quote.appendChild(qt);
    }
  }

  body.appendChild(nm);
  body.appendChild(bub);
  if (quote) body.appendChild(quote);       // 微信风：引用小标签在气泡下方

  /* 非我 & 非 typing：整条可点唤起回复；举报/拉黑保留原有兜底路径，不冲突 */
  if (!opts.mine && !opts.typing) {
    row.classList.add('is-replyable');
    row.addEventListener('click', () => beginReply(user, text));
  }

  row.appendChild(av);
  row.appendChild(body);
  return row;
}

function atBottom() {
  const l = el.standList;
  return l.scrollHeight - l.scrollTop - l.clientHeight < 80;
}

/* 展开动画期间持续贴底，保证新消息完整露出 */
function stickBottom(ms) {
  const list = el.standList;
  const t0 = performance.now();
  const step = () => {
    list.scrollTop = list.scrollHeight;
    if (performance.now() - t0 < ms) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function pushStand(user, text, opts = {}) {
  const stick = opts.force || atBottom();
  const node = standNode(user, text, opts);
  /* 与公屏同一套入场动效：sizer 顶开上方内容 */
  const sizer = enter(el.standList, node, !!opts.instant, 200);
  if (stick) {
    if (opts.instant) el.standList.scrollTop = el.standList.scrollHeight;
    else stickBottom(560);
  }
  /* 统计真实消息数（typing 占位不计）。用于「N 条新消息」分隔与外部入口提示 */
  if (!opts.typing) {
    state.standMsgCount += 1;
    /* 面板关闭期间，别人 @我 的回复计为「新回复」（外部入口用） */
    if (!state.open && !opts.mine && typeof text === 'string' && text.includes('@' + ME.name)) {
      state.pendingReplies += 1;
      refreshPeekForReply();
    }
  }
  return sizer;
}

/* 渲染看台初始内容（仅首次进入时调用）：
   顶部「刚刚公屏在聊」背景块（来自公屏，非台内成员发言）
   + 一段已在进行的实时讨论（台内成员）
   注：再次进入不再调用此函数，也就不会重复出现「刚刚公屏在聊」。 */
function renderContext(topic) {
  el.standList.innerHTML = '';
  state.lastSpeaker = null;
  state.standCursor = 0;
  state.standMsgCount = 0;

  /* ① 冷启动背景块：公屏刚流过的几句真话，明确标注来源（只在首次建立上下文用） */
  const bgBlock = document.createElement('div');
  bgBlock.className = 'bg-block';
  bgBlock.innerHTML =
    '<div class="bg-title"><span class="bg-tag">刚刚公屏在聊</span></div>' +
    '<div class="bg-lines">' +
    topic.bg.map(t => `<span class="bg-line">${t}</span>`).join('') +
    '</div>' +
    '<div class="bg-ask">大家怎么看？</div>';
  el.standList.appendChild(bgBlock);

  /* ② 台内实时讨论：成员的真实发言（比背景更靠后、更"当下"） */
  topic.context.forEach(t => pushStand(nextSpeaker(), t, { instant: true, force: true }));
  el.standList.scrollTop = el.standList.scrollHeight;
}

let standTimer = null;
function standTick() {
  const topic = state.topic;
  const text = topic.pool[state.standCursor % topic.pool.length];
  state.standCursor++;
  pushStand(nextSpeaker(), text);
  standTimer = setTimeout(standTick, rand(RATE.standMin, RATE.standMax));
}
function startStand() {
  clearTimeout(standTimer);
  standTimer = setTimeout(standTick, rand(RATE.standMin, RATE.standMax));
}

/* ------------------------------------------------------------
   面板：升起 / 收起
   ------------------------------------------------------------ */
/*
 * 面板外壳的唯一清理入口。
 * 不依赖 state 布尔值判断，直接同时校正 DOM class、ARIA 与内存状态。
 * 这样即使动画、延迟回调或快速点击曾让两者短暂不同步，下一次打开
 * 任一面板时也只会留下目标面板，不会把看台、键盘、分享层叠在一起。
 */
function resetPanelChrome() {
  el.screen.classList.remove('sheet-open', 'compose-open', 'kb-open', 'more-open');
  el.dock.classList.remove('is-typing');
  el.sheet.setAttribute('aria-hidden', 'true');
  el.moreSheet.setAttribute('aria-hidden', 'true');
  el.keyboard.setAttribute('aria-hidden', 'true');
  state.open = false;
  state.moreOpen = false;
  state.composeOpen = false;
  el.liveInput.blur();
  el.composer.blur();
}

/* 手机屏幕只负责裁切，不应该保存任何滚动位置。
   某些浏览器会在聚焦底部按钮或 scrollIntoView 时仍修改 overflow:hidden
   元素的 scrollTop；这个残留会让下次打开的绝对定位面板整体上移。 */
function resetScreenScroll() {
  el.screen.scrollTop = 0;
  el.screen.scrollLeft = 0;
  requestAnimationFrame(() => {
    el.screen.scrollTop = 0;
    el.screen.scrollLeft = 0;
  });
}

function openSheet() {
  /* 强制清理其他所有面板/键盘/挂起的延迟打开，杜绝三面板叠加 */
  clearTimeout(moreToStandTimer);
  closeCompose();            // 保存并还原可能存在的看台滚动位置
  resetPanelChrome();        // 不相信残留布尔值，直接把视觉状态归零
  resetScreenScroll();       // 清掉上一次交互可能遗留的手机内部滚动
  state.open = true;
  el.screen.classList.add('sheet-open');
  el.sheet.setAttribute('aria-hidden', 'false');
  Guide.reach('enter');

  if (!state.standEntered) {
    /* —— 首次进入：建立上下文（刚刚公屏在聊 + 一段进行中的讨论），并开始跑 —— */
    state.standEntered = true;
    renderContext(state.topic);
    startStand();
    updateStandCount();
    el.standList.scrollTop = el.standList.scrollHeight;
    /* §5 首次进看台：一次性轻提示，不做多步教程 */
    if (state.firstStandVisit) {
      state.firstStandVisit = false;
      setTimeout(() => toast(
        `已为你分配到当前看台 · 这里评论慢下来了`, 3600), 300);
    }
  } else {
    /* —— 再次进入：回到之前的讨论，展示离开期间的新消息 —— */
    const newCount = state.standMsgCount - state.standSeenCount;
    insertNewDivider(newCount);   // >0 才插分隔线
    updateStandCount();
    /* 滚到分隔线（若有），否则贴底 */
    scrollToNewDivider();
  }
  /* 进入后：清掉外部入口的「新回复」计数 */
  state.pendingReplies = 0;
}

/* 头部「N 人正在聊」弱化显示：进入时轻微波动，营造真实在场感 */
function updateStandCount() {
  if (!el.standCount) return;
  /* 人数在 7–11 之间轻微游走 */
  const delta = (Math.random() * 3 | 0) - 1;      // -1 / 0 / +1
  state.standPeople = Math.min(11, Math.max(7, state.standPeople + delta));
  el.standCount.innerHTML = `<i class="st-dot"></i>${state.standPeople} 人正在聊`;
}

/* 再次进入时，在旧消息与新消息之间插一条「N 条新消息」分隔线 */
function insertNewDivider(n) {
  /* 移除上一次遗留的分隔线 */
  const old = el.standList.querySelector('.new-divider');
  if (old) old.remove();
  if (!n || n <= 0) return;
  const div = document.createElement('div');
  div.className = 'new-divider';
  div.innerHTML = `<span>${n} 条新消息</span>`;
  /* 插到「离开时已看到的第 standSeenCount 条消息」之后。
     用消息节点计数定位：找到第 standSeenCount 条 .smsg 之后的位置。 */
  const msgs = el.standList.querySelectorAll('.smsg');
  const anchor = msgs[state.standSeenCount - 1];   // 最后一条已看消息
  if (anchor && anchor.parentElement === el.standList) {
    anchor.after(div);
  } else if (anchor) {
    /* smsg 可能被包在 sizer 容器里；退化为插在其容器后 */
    let node = anchor;
    while (node.parentElement && node.parentElement !== el.standList) node = node.parentElement;
    node.after(div);
  } else {
    el.standList.appendChild(div);
  }
}

function scrollToNewDivider() {
  const div = el.standList.querySelector('.new-divider');
  if (div) {
    /* 只滚动消息列表本身。scrollIntoView 会继续滚动外层 .screen，
       导致整个看台面板在下次打开时被推到屏幕顶部。 */
    const target = div.offsetTop - (el.standList.clientHeight - div.offsetHeight) / 2;
    el.standList.scrollTop = Math.max(0, target);
  } else {
    el.standList.scrollTop = el.standList.scrollHeight;
  }
}

function closeSheet() {
  state.open = false;
  el.screen.classList.remove('sheet-open');
  el.sheet.setAttribute('aria-hidden', 'true');
  /* 关闭面板同时退出 compose 态和键盘 */
  closeCompose();
  el.composer.blur();
  resetScreenScroll();
  /* 收起时清掉半途的回复态，避免下次打开还挂着 */
  if (state.replyingTo) {
    state.replyingTo = null;
    el.replyBar.classList.remove('is-on');
    el.replyBar.setAttribute('aria-hidden', 'true');
    el.composer.setAttribute('placeholder', '在看台说点什么…');
  }
  /* 记录本次已看到的消息数：再次进入时据此算「N 条新消息」 */
  if (state.standEntered) {
    state.standSeenCount = state.standMsgCount;
    /* 首次收起后移除「刚刚公屏在聊」块——它只用于第一次建立上下文 */
    const bg = el.standList.querySelector('.bg-block');
    if (bg) bg.remove();
    /* 保留台内讨论消息与后台消息流（看台在当前 Session 内继续存在） */
  }
  /* 引导第 5 步：收到过别人 Reply 后退出 → 气泡提示看台入口收进了分享里 */
  if (state.gotReply) {
    setTimeout(showShareHint, 380);      // 等面板收起动画后再冒气泡
    Guide.reach('exit');
  }
}

/* ------------------------------------------------------------
   分享 / 更多面板：看台的保守入口
   主路径是预览条（内容驱动）；这里是"想找的时候找得到"的兜底位
   ------------------------------------------------------------ */
function openMore() {
  clearTimeout(moreToStandTimer);
  closeCompose();
  closeTyping();
  /* 分享面板与看台面板互斥：打开分享前先收起看台，避免两个面板叠在一起 */
  if (state.open || el.screen.classList.contains('sheet-open')) closeSheet();
  resetPanelChrome();
  state.moreOpen = true;
  el.screen.classList.add('more-open');
  el.moreSheet.setAttribute('aria-hidden', 'false');
}
function closeMore() {
  state.moreOpen = false;
  el.screen.classList.remove('more-open');
  el.moreSheet.setAttribute('aria-hidden', 'true');
}
el.openMore.addEventListener('click', openMore);
if (el.moreCancel) el.moreCancel.addEventListener('click', closeMore);
el.scrim.addEventListener('click', closeMore);
el.moreGrab.addEventListener('click', closeMore);
/* 分享面板里点「看台」：先让分享面板收起，收完再升起看台面板，
   避免两个面板同时出现在屏上（看台直接顶上去、并短暂多层遮蔽直播画面） */
let moreToStandTimer = null;
el.moreStand.addEventListener('click', () => {
  closeMore();
  clearTimeout(moreToStandTimer);
  moreToStandTimer = setTimeout(openSheet, 360);   // 略大于 more-sheet 收起动画（.34s）
});

/* ------------------------------------------------------------
   直播间原生输入态：在直播间里直接发公屏，不打开面板
   ------------------------------------------------------------ */
function openTyping() {
  /* 直播间输入是独占态：取消分享→看台的延迟，并强制收起其他面板。 */
  clearTimeout(moreToStandTimer);
  if (state.open || el.screen.classList.contains('sheet-open')) closeSheet();
  resetPanelChrome();
  el.dock.classList.add('is-typing');
  el.screen.classList.add('kb-open');
  el.keyboard.setAttribute('aria-hidden', 'false');
  el.liveInput.focus();
  /* 不再在打字前触发 peek；只有真的发送评论后由 onSwept 唤起 rescue banner */
}
function closeTyping() {
  el.dock.classList.remove('is-typing');
  el.screen.classList.remove('kb-open');
  el.keyboard.setAttribute('aria-hidden', 'true');
  el.liveInput.blur();
}
el.dockInput.addEventListener('click', openTyping);
el.liveInput.addEventListener('input', () => {
  el.liveSend.classList.toggle('is-ready', el.liveInput.value.trim().length > 0);
});
el.liveInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') liveSubmit();
  if (e.key === 'Escape') closeTyping();
});
el.liveSend.addEventListener('click', liveSubmit);

/* 键盘打开时，点键盘/dock 外的画面区域就收起（模拟点空白关键盘） */
el.screen.addEventListener('click', (e) => {
  if (!el.screen.classList.contains('kb-open')) return;
  /* 看台 Compose Mode 下的键盘由 closeCompose 管理，跳过这条兜底 */
  if (state.composeOpen) return;
  if (el.sheet.contains(e.target)) return;
  if (el.dock.contains(e.target)) return;
  const kb = document.getElementById('keyboard');
  if (kb && kb.contains(e.target)) return;
  closeTyping();
}, true);

function liveSubmit() {
  const text = el.liveInput.value.trim();
  if (!text) { closeTyping(); return; }
  el.liveInput.value = '';
  el.liveSend.classList.remove('is-ready');
  closeTyping();
  state.myLastText = text;
  watchSweep(pushCrowd({ kind: 'comment', name: ME.name, text, mine: true }));
  /* 没有任何人回应。它只会被冲出屏幕，然后预览条变成捞起提示 */
  Guide.reach('comment');
}

/* 点面板以外区域：compose 态下先退回阅读态，非 compose 才关整个面板 */
el.sheetScrim.addEventListener('click', () => {
  if (state.composeOpen) { closeCompose(); return; }
  closeSheet();
});
/* 收起看台：点面板以外的直播间区域即可（sheetScrim 覆盖 sheet 上方），无独立按钮 */

/* ------------------------------------------------------------
   轻提示 toast（首次分配 / 换一批 / 有人回应了你）
   ------------------------------------------------------------ */
let toastTimer = null;
function toast(html, ms = TIMING.toast) {
  el.toast.innerHTML = html;
  el.toast.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.toast.classList.remove('is-on'), ms);
}

/* ------------------------------------------------------------
   用户原话 → 关键词 → 选台
   这条链路是「分配」和「预览条预告」共用的唯一真值，
   预告的台必须就是点进去会到的台，否则是欺骗。
   ------------------------------------------------------------ */
function matchTopic(text) {
  const hit = (t) => t.keywords.find(k => text.includes(k));
  const a = hit(TOPIC_A);
  const b = hit(TOPIC_B);
  /* 两边都命中时，取更长的词（更具体） */
  if (a && b) return (b.length > a.length) ? { topic: TOPIC_B, word: b }
                                           : { topic: TOPIC_A, word: a };
  if (a) return { topic: TOPIC_A, word: a };
  if (b) return { topic: TOPIC_B, word: b };
  return null;
}

/* ------------------------------------------------------------
   预览条（peek）三档：
     hidden —— S0 纯观看：完全不显示，不打扰
     idle   —— S1 产生表达意愿：淡入弱入口「看台 · 看看大家在聊什么 ›」
     rescue —— S3 捞起：自己那条被冲走时，同一根横条升级成一句关联提示
   常态不再做轮播换句，避免变成"强推"。
   ------------------------------------------------------------ */
let rescueTimer = null;
let peekAutoHideTimer = null;
let peekLeaveTimer = null;

function readable(t) {
  return t.length >= 10
      && !t.startsWith('@')
      && !EMOTION_WORDS.some(w => t.includes(w));
}

/* rescue 态下，展示的关键词优先从当前评论里取；未命中话题时从池里轮流选一个 */
const RESCUE_FALLBACK_POOL = [
  '这波团', '视野', '打野节奏', '走位', '阵容', '装备', '这局',
  '主播操作', '这波运营', '兵线', '选人'
];
let rescueFallbackIdx = 0;
function pickRescueKeyword() {
  if (state.myLastText) {
    const m = matchTopic(state.myLastText);
    if (m) return m.word;
  }
  /* 未命中话题：从池里轮流取，保证多次触发的 banner 内容不重复 */
  const w = RESCUE_FALLBACK_POOL[rescueFallbackIdx % RESCUE_FALLBACK_POOL.length];
  rescueFallbackIdx += 1;
  return w;
}

/* S0 → S1 弱入口态 */
function peekIdle() {
  state.peekMode = 'idle';
  clearTimeout(rescueTimer);
  clearTimeout(peekAutoHideTimer);
  clearTimeout(peekLeaveTimer);
  el.peek.classList.remove('is-rescue', 'is-leaving');
  el.peek.classList.add('is-idle');
  el.screen.classList.add('peek-on');
  el.peekLine.classList.remove('is-fading');
  el.peekLine.textContent = '看看大家在聊什么';
  /* 停留 4-5s 后向左滑出并淡出 */
  peekAutoHideTimer = setTimeout(peekHide, TIMING.peekIdleDwell);
}

/* S3 rescue 态：一句关联提示，从左侧 banner 滑入
   customHTML 传入时用于「新回复」等特殊文案，否则走关键词捞起 */
function peekRescue(customHTML) {
  const word = pickRescueKeyword();
  clearTimeout(rescueTimer);
  clearTimeout(peekAutoHideTimer);
  clearTimeout(peekLeaveTimer);

  /* 如果上一次 banner 还挂在屏幕上（rescue 或 idle 态），
     需要先把它"复位"到起点位置（屏幕左外），才能重新播入场动画。
     手法：瞬时移除入位类 → 强制回流一帧 → 再加回入位类 */
  const wasOn = el.peek.classList.contains('is-rescue')
             || el.peek.classList.contains('is-idle');
  el.peek.classList.remove('is-idle', 'is-rescue', 'is-leaving');
  /* 复位这一帧禁用过渡，让 transform 瞬间回到 -100%，避免 banner 反向"倒回"左边 */
  if (wasOn) {
    el.peek.style.transition = 'none';
    /* 触发一次回流 */
    void el.peek.offsetWidth;
    el.peek.style.transition = '';
  }

  state.peekMode = 'rescue';
  /* 文案在滑入前直接就位（banner 全程内容一致，无淡出淡入） */
  el.peekLine.classList.remove('is-fading');
  el.peekLine.innerHTML = customHTML || `看台有人在聊<em>「${word}」</em>`;
  /* 下一帧再加入位类，确保浏览器读到"起点在屏外"这一帧 */
  requestAnimationFrame(() => {
    el.peek.classList.add('is-rescue');
    el.screen.classList.add('peek-on');
  });
  /* 停留结束后向右滑出 */
  peekAutoHideTimer = setTimeout(peekHide, TIMING.peekRescueDwell);
}

/* 离开看台期间收到「@我」的直接回复 → 外部入口升级为「看台 · N 条新回复 ›」
   仅在用户已进入过看台、且面板当前关闭时生效 */
function refreshPeekForReply() {
  if (!state.standEntered || state.open) return;
  const n = state.pendingReplies;
  if (n <= 0) return;
  peekRescue(`看台 · <em>${n} 条新回复</em>`);
}

/* 到时/主动收起 → 向右滑出屏幕，回到 hidden 态 */
function peekHide() {
  if (state.peekMode === 'hidden') return;
  clearTimeout(peekAutoHideTimer);
  clearTimeout(peekLeaveTimer);
  el.peek.classList.add('is-leaving');       // 向右滑出
  el.peek.classList.remove('is-idle', 'is-rescue');
  /* 注意：不在这里移除 peek-on。若立刻移除，评论区会在 banner 还没滑完时
     就往下补位，两者在底部重叠。等 banner 完全出屏后再让评论区补回。 */
  peekLeaveTimer = setTimeout(() => {
    el.peek.style.transition = 'none';        // 禁用过渡
    el.peek.classList.remove('is-leaving');   // transform 回到基础 -100%（左屏外），瞬时完成
    void el.peek.offsetWidth;                 // 强制回流，落定这一帧
    el.peek.style.transition = '';            // 恢复过渡，供下次入场使用
    el.screen.classList.remove('peek-on');    // banner 已出屏，评论区此时才从下方补回
    state.peekMode = 'hidden';
  }, TIMING.peekLeave + 20);
}

/* 点预览条：直接进看台（S1 或 S3 都合法入口） */
el.peek.addEventListener('click', () => {
  if (state.open) return;          // 看台已打开则忽略重复点击
  clearTimeout(rescueTimer);
  clearTimeout(peekAutoHideTimer);
  clearTimeout(peekLeaveTimer);
  openSheet();
});

/* ------------------------------------------------------------
   方案 B：自己那条被冲走的那一秒，就地捞起
   直播间态 → 提示落在预览条上（入口即提示）
   面板内全场 tab → 提示落在面板顶部（预览条被面板挡住了）
   ------------------------------------------------------------ */
function onSwept() {
  /* 频控：两次 banner 至少间隔 peekCooldown，防止连续快速评论时刷屏 */
  const now = Date.now();
  if (state.lastRescueAt && now - state.lastRescueAt < TIMING.peekCooldown) return;
  state.lastRescueAt = now;

  /* 分配到匹配的话题（仅用于保证 rescue 文案与看台内容一致） */
  const m = matchTopic(state.myLastText);
  if (m) switchTopic(m.topic, { silent: true });

  peekRescue();
}

/* ------------------------------------------------------------
   §4 看台发言后：被接住
   ------------------------------------------------------------ */
let replyTimers = [];
function clearReplies() { replyTimers.forEach(clearTimeout); replyTimers = []; }

function respondTo(text) {
  clearReplies();
  clearTimeout(standTimer);              // 对话进行中，暂停普通消息，别打断节奏

  const m = matchTopic(text);
  const first  = m && KEYWORD_REPLIES[m.word] ? KEYWORD_REPLIES[m.word] : pick(REPLY_TEMPLATES);
  const second = pick(SECOND_REPLIES);
  const p1 = nextSpeaker();
  const p2 = nextSpeaker();

  /* 1) 2–4 秒后，第一个人接话 */
  const t1 = rand(TIMING.reply1Min, TIMING.reply1Max);
  replyTimers.push(setTimeout(() => {
    const typing = pushStand(p1, '', { typing: true });
    replyTimers.push(setTimeout(() => {
      typing.remove();
      pushStand(p1, first.replace('{我}', ME.name));
      state.gotReply = true;             // 收到别人的 Reply → 解锁引导第 5 步
    }, TIMING.typing));
  }, t1));

  /* 2) 再过 3–6 秒，第二个人跟上，形成一小段对话 */
  const t2 = t1 + TIMING.typing + rand(TIMING.reply2Min, TIMING.reply2Max);
  replyTimers.push(setTimeout(() => {
    const typing = pushStand(p2, '', { typing: true });
    replyTimers.push(setTimeout(() => {
      typing.remove();
      pushStand(p2, second.replace('{我}', ME.name));
      startStand();                      // 对话收尾，恢复常规流
    }, TIMING.typing));
  }, t2));

  /* 3) 更晚（9–13s）再补一条直接 @我 的回复。
     它大概率发生在用户已收起看台之后，用来驱动外部入口的
     「看台 · N 条新回复 ›」，还原"离开期间收到新回复"的核心体验。 */
  const p3 = nextSpeaker();
  const late = pick(REPLY_TEMPLATES).replace('{我}', ME.name);
  const t3 = t2 + TIMING.typing + rand(6000, 9000);
  replyTimers.push(setTimeout(() => {
    const typing = pushStand(p3, '', { typing: true });
    replyTimers.push(setTimeout(() => {
      typing.remove();
      pushStand(p3, late);               // 若此时面板已关，pushStand 会累加 pendingReplies 并刷新入口
    }, TIMING.typing));
  }, t3));
}

/* ------------------------------------------------------------
   §5 换台（内部）
   注：「换一批」UI 已下线，本轮固定一条故事线。这个函数只在 rescue
   分配到匹配 topic 时被内部调用，保证预告文案与看台内容一致。
   ------------------------------------------------------------ */
function switchTopic(topic, opts = {}) {
  if (topic === state.topic) return;
  /* 用户已进入过看台后，锁定当前会话内容，不再切台清空
     （看台只在当前 Session 内持续，回到看台要能看到之前的讨论） */
  if (state.standEntered) { state.topic = topic; return; }
  state.topic = topic;
  clearReplies();
  clearTimeout(standTimer);
  renderContext(topic);
  startStand();
}

/* 「换一批」入口已下线（做减法）——不再绑定 reshuffle 事件 */

/* ------------------------------------------------------------
   看台内的「回复某条」轻量交互（S6-B）
   - 只点消息下方的「回复」按钮才触发，避免误触
   - 输入框上方升起「回复 @xxx ×」
   - 发送后新消息内嵌一条引用块（reply_to），不建 thread
   ------------------------------------------------------------ */
function beginReply(user, text) {
  state.replyingTo = { name: user.name, color: user.color, text };
  el.replyName.textContent = '@' + user.name;
  el.replyBar.classList.add('is-on');
  el.replyBar.setAttribute('aria-hidden', 'false');
  el.composer.setAttribute('placeholder', '回复 @' + user.name + '…');
  openCompose();                            // 回复直接进 Compose Mode
  updateComposeSummary();                   // 若已在 compose 态则刷新摘要为引用
  el.composer.focus();
}
function cancelReply() {
  state.replyingTo = null;
  el.replyBar.classList.remove('is-on');
  el.replyBar.setAttribute('aria-hidden', 'true');
  el.composer.setAttribute('placeholder', '在看台说点什么…');
  updateComposeSummary();
  /* 取消回复也退出 compose，回到阅读态（按 PRD 要求） */
  closeCompose();
}
el.replyCancel.addEventListener('click', cancelReply);

/* ------------------------------------------------------------
   S6b Compose Mode：点看台输入框 → 面板收缩到键盘顶部
   ------------------------------------------------------------ */
function truncate(s, n) {
  if (!s) return '';
  return s.length > n ? s.slice(0, n) + '…' : s;
}

/* 生成 compose 态的摘要：
   - 有 replyingTo：显示引用摘要（回复对象 + 原文）
   - 无 replyingTo：抓看台最新一条非我消息作为"最近讨论"上下文 */
function updateComposeSummary() {
  const item = el.composeSummary && el.composeSummary.querySelector('.cs-item');
  if (!item) return;
  item.innerHTML = '';
  if (state.replyingTo) {
    /* 回复态：replyBar 已经显示 @xxx，这里只补一行原文摘要 */
    const tag = document.createElement('span');
    tag.className = 'cs-tag'; tag.textContent = '引用';
    const t = document.createElement('span');
    t.className = 'cs-text';
    t.textContent = '“' + truncate(state.replyingTo.text, 30) + '”';
    item.appendChild(tag);
    item.appendChild(t);
    return;
  }
  /* 非回复：取看台里最近一条别人的消息作为上下文 */
  const nodes = el.standList.querySelectorAll('.smsg:not(.is-mine)');
  const last = nodes[nodes.length - 1];
  if (!last) { el.composeSummary.style.display = 'none'; return; }
  el.composeSummary.style.display = '';
  const name = last.querySelector('.sname')?.textContent || '';
  const text = last.querySelector('.sbub-text')?.textContent
            || last.querySelector('.sbub')?.textContent || '';
  const tag = document.createElement('span');
  tag.className = 'cs-tag'; tag.textContent = '刚刚';
  const nm = document.createElement('span');
  nm.className = 'cs-name'; nm.textContent = name;
  const tx = document.createElement('span');
  tx.className = 'cs-text'; tx.textContent = truncate(text, 40);
  item.appendChild(tag);
  item.appendChild(nm);
  item.appendChild(tx);
}

function openCompose() {
  if (state.composeOpen
      && el.screen.classList.contains('compose-open')
      && el.screen.classList.contains('kb-open')) return;
  /* 只有在真实可见的看台阅读态才允许进入 compose，不能只相信 state.open。 */
  if (!state.open || !el.screen.classList.contains('sheet-open')) return;
  clearTimeout(moreToStandTimer);
  closeMore();
  closeTyping();
  state.composeOpen = true;
  /* 保存阅读态滚动位置，防止 sheet-body 隐藏后 scrollTop 归零 */
  state.savedStandScroll = el.standList.scrollTop;
  updateComposeSummary();
  el.screen.classList.add('compose-open');
  /* 复用直播间的模拟键盘外壳升起（键盘按键不参与看台发送，只做视觉模拟） */
  el.screen.classList.add('kb-open');
  el.keyboard.setAttribute('aria-hidden', 'false');
}
function closeCompose() {
  const wasOpen = state.composeOpen || el.screen.classList.contains('compose-open');
  state.composeOpen = false;
  el.screen.classList.remove('compose-open');
  el.screen.classList.remove('kb-open');
  el.keyboard.setAttribute('aria-hidden', 'true');
  el.composer.blur();
  /* 还原滚动位置 */
  if (wasOpen && state.savedStandScroll != null) {
    /* 等 sheet-body 重新可见后再设置 */
    requestAnimationFrame(() => {
      el.standList.scrollTop = state.savedStandScroll;
    });
  }
}

/* composer focus / 点击 → 进入 compose 态 */
el.composer.addEventListener('focus', openCompose);
el.composer.addEventListener('click', openCompose);
/* 键盘 Esc 关键盘（保留可用性） */
el.composer.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeCompose(); }
});

/* 模拟键盘的「发送」键：compose 态下也提交看台消息（否则装饰按钮无反应会诡异） */
const kbReturn = document.querySelector('.kb-return');
if (kbReturn) {
  kbReturn.addEventListener('click', () => {
    if (state.composeOpen) { submit(); }
    /* 非 compose 态时它仍归属直播间键盘的原语义（这里未额外处理） */
  });
}

/* ------------------------------------------------------------
   发送
   ------------------------------------------------------------ */
function updateSendState() {
  el.send.classList.toggle('is-ready', el.composer.value.trim().length > 0);
}
el.composer.addEventListener('input', updateSendState);

function submit() {
  const text = el.composer.value.trim();
  if (!text) return;
  el.composer.value = '';
  updateSendState();
  state.myLastText = text;
  const replyTo = state.replyingTo;
  pushStand(ME, text, { mine: true, force: true, replyTo });
  /* 清回复态但不重复调 closeCompose，随后统一退出 compose */
  state.replyingTo = null;
  el.replyBar.classList.remove('is-on');
  el.replyBar.setAttribute('aria-hidden', 'true');
  el.composer.setAttribute('placeholder', '在看台说点什么…');
  closeCompose();                        // 发送后退出 compose，回到阅读态
  respondTo(text);                       // §4：被接住
  Guide.reach('speak');
}

el.send.addEventListener('click', submit);
el.composer.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });

/* ------------------------------------------------------------
   右侧动态体验引导 Try the demo
   - 按顺序推进；每一步只展示当前信息，不剧透后续
   - 通过 Guide.reach(id) 由各交互钩子驱动，不改核心逻辑
   ------------------------------------------------------------ */
const Guide = (() => {
  const STEPS = [
    {
      id: 'comment',
      title: '先在公屏发一条评论',
      desc: '点击底部「说点什么…」，输入一句话发送到直播间公屏。',
      hint: '在底部输入框输入并发送'
    },
    {
      id: 'enter',
      title: '有人也在聊这个',
      desc: '你的评论很快被高速公屏刷走，评论区下方会滑出看台入口。看台把有讨论意愿的人放进更慢的小房间，彼此更容易接上话。',
      hint: '点击评论区下方的看台入口进入'
    },
    {
      id: 'speak',
      title: '和大家聊起来',
      desc: '在看台里发一句你的观点，或点一条别人的评论对它 Reply。',
      hint: '发一句观点，或 Reply 一条评论'
    },
    {
      id: 'exit',
      title: '收到其他用户的 Reply',
      desc: '节奏慢下来后，有人接住了你。退出看台时，入口会收进「分享」里，随时可再进来。',
      hint: '退出看台，留意「分享」处的提示'
    }
  ];

  let idx = 0;            // 当前步索引
  let finished = false;
  el.guideTotal.textContent = String(STEPS.length).padStart(2, '0');

  function render() {
    const step = STEPS[idx];
    el.guideCur.textContent = String(idx + 1).padStart(2, '0');
    el.guideBar.style.width = ((idx + 1) / STEPS.length * 100) + '%';
    el.guideTitle.textContent = step.title;
    el.guideDesc.textContent = step.desc;
    el.guideHint.textContent = step.hint || '';
    /* 重放切换动画 */
    el.guideCard.classList.remove('is-swap');
    void el.guideCard.offsetWidth;
    el.guideCard.classList.add('is-swap');
    el.guideDone.hidden = true;
    el.guideCard.style.display = '';
  }

  function complete() {
    finished = true;
    el.guideCur.textContent = String(STEPS.length).padStart(2, '0');
    el.guideBar.style.width = '100%';
    el.guideCard.style.display = 'none';
    el.guideDone.hidden = false;
    el.guideDone.classList.remove('is-swap');
    void el.guideDone.offsetWidth;
    el.guideDone.classList.add('is-swap');
  }

  /* 只在"到达当前应完成的步"时前进；乱序触发不倒退、不跳步 */
  function reach(id) {
    if (finished) return;
    if (STEPS[idx] && STEPS[idx].id === id) {
      if (idx < STEPS.length - 1) {
        idx += 1;
        render();
      } else {
        complete();
      }
    }
  }

  function restart() {
    finished = false;
    idx = 0;
    render();
  }

  render();
  return { reach, restart };
})();

el.guideRestart.addEventListener('click', () => {
  /* 整页刷新：最彻底地重置直播间与看台的所有状态与挂起的定时器，
     杜绝面板残留 / 延迟回调 / peek 残留等竞态问题 */
  location.reload();
});

/* 轻量重置：让 Demo 交互回到初始态，配合 Restart demo 按钮
   只复位与引导流程相关的可见状态，不重建全场氛围 */
function restartDemo() {
  /* 先清 gotReply，避免下面 closeSheet 触发延迟的分享气泡 */
  state.gotReply = false;
  /* 清掉可能在队列里的「分享→看台」延迟升起，防止 restart 后看台又被打开 */
  clearTimeout(moreToStandTimer);
  /* 关面板 / compose / 键盘 */
  closeSheet();
  closeTyping();
  closeMore && closeMore();
  /* 收起 peek 入口 */
  clearTimeout(peekAutoHideTimer);
  clearTimeout(peekLeaveTimer);
  el.peek.style.transition = 'none';
  el.peek.classList.remove('is-idle', 'is-rescue', 'is-leaving');
  void el.peek.offsetWidth;
  el.peek.style.transition = '';
  el.screen.classList.remove('peek-on');
  state.peekMode = 'hidden';
  /* 收起分享气泡 */
  hideShareHint();
  /* 复位关键 state */
  state.lastRescueAt = 0;
  state.myLastText = '';
  state.replyingTo = null;
  state.firstStandVisit = true;
  state.gotReply = false;
  el.liveInput.value = '';
  el.composer.value = '';
  /* 复位看台会话延续状态：清空历史、停后台流、回到"未进入过"，
     Restart 后看台重新是一张白纸，首次进入会重新出现「刚刚公屏在聊」 */
  clearTimeout(standTimer);
  clearReplies();
  el.standList.innerHTML = '';
  state.standEntered = false;
  state.standMsgCount = 0;
  state.standSeenCount = 0;
  state.pendingReplies = 0;
  state.standPeople = 8;
  state.standCursor = 0;
  state.lastSpeaker = null;
  if (el.standCount) el.standCount.innerHTML = '<i class="st-dot"></i>8 人正在聊';
}

/* 分享气泡显示/隐藏 */
let shareHintTimer = null;
function showShareHint() {
  el.shareHint.setAttribute('aria-hidden', 'false');
  el.shareHint.classList.add('is-on');
  clearTimeout(shareHintTimer);
  shareHintTimer = setTimeout(hideShareHint, 5000);
}
function hideShareHint() {
  el.shareHint.classList.remove('is-on');
  el.shareHint.setAttribute('aria-hidden', 'true');
  clearTimeout(shareHintTimer);
}

/* ------------------------------------------------------------
   启动
   ------------------------------------------------------------ */
seedCrowd(40);
crowdTick();
startGiftLoop();
startPromoCountdown();
startJoinBanner();
/* 看台内容不在启动时预渲染：首次进入看台（openSheet）才建立上下文并开始跑，
   之后在当前 Session 内持续存在、不清空。 */
/* S0：不启动 peek，纯观看零打扰。用户点输入框才淡入弱入口。 */
