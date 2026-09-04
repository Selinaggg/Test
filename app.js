/* ============================================================
   智能评论筛选：原型逻辑
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
  '真的一直在等这一波终于打出来了',
  '先清中路兵线再看龙吧', '侧面有人绕后了', '对面技能交得差不多了',
  '这波换资源其实不亏', '上路能不能直接 TP 过来', '打野的位置已经被看到了',
  '辅助现在没闪，下一波要小心', 'AD 的输出环境太差了', '这阵容往后拖还能打',
  '感觉还有翻盘点，别急着送', '中路这波兵线进塔了', '别追了，先拿眼前的塔',
  '龙坑入口一个视野都没有', '高地塔还在，应该能再守一波', '先等大招转好再接团',
  '下一条龙才是关键，这条可以放', '经济差到底多少了', '这波没人看住侧翼',
  '主播刚刚说的换线有道理', '这局的节奏比上一把快太多了', '高地这里不能再丢视野了',
  '打野如果能抢到龙还有得打', '辅助留个控制保后排会好很多', '现在转上路拿塔收益更高',
  '河道草丛有眼，这个绕后很难成功', '阵容更适合拉扯，不要在龙坑里硬打',
  '对面 AD 的闪现还没转好，可以找他的位置', '这波团赢了也要先把兵线送进去'
];

/* ---------- 智能评论筛选语料 ---------- */
const NOISE_COMMENTS = [
  '666666', '哈哈哈哈哈哈', '？？？？？？', '冲啊！！！', '主播看这里',
  '别送了别送了', '啊啊啊啊啊'
];

/* 只在未筛选公屏中出现，用于拉开筛选前后的信息密度差异。 */
const LOW_INFO_COMMENTS = [
  '666', '啊？', '来了来了', '笑死', '救命啊', '不是吧', '这也行', '好家伙',
  '离谱', '我靠', '啊啊啊', '哈哈哈哈', '开饭了', '谁懂啊', '不敢看了',
  '前排', '打卡', '主播加油', '兄弟们冲', '这波稳了', '完了完了',
  '我裂开', '血压上来了', '别啊', '还能打吗', '真的吗', '这是啥',
  '不看了', '又来', '有人吗', '弹幕太快了', '看不清', '哈哈哈哈哈哈哈',
  '1', '2', '+1', '？？？', '。。。', '牛的', '绝了', '上分上分', '心疼',
  '刚进来', '前面说啥了', '有回放吗', '比分多少', '画质不错', '声音有点小'
];

const HIGHLIGHT_COMMENTS = [
  '辅助刚刚扫描是不是交早了？',
  '上路其实可以直接 TP 的',
  '河道这里完全没有视野',
  '这波资源其实可以直接放',
  '对面 AD 已经三件套了',
  '打野这个位置来得太晚了',
  '感觉这波开团时机不太对',
  '蓝区入口没有提前留眼，打野绕后路线完全暴露了',
  '这波不该接团，等上路 TP 转好再争资源更稳',
  '辅助把控制交给前排后，后排就没有保护手段了',
  '河道视野断了十几秒，继续压线的风险太高',
  '对面 AD 装备领先，现在正面五打五很难处理',
  '阵容缺少先手，应该让打野从侧面先逼位置',
  '大龙可以放，换下路高地反而更赚',
  '开团目标选错了，第一时间应该限制对面 AD',
  '上路没线权，这时候进野区容易被两面夹击',
  '辅助站位太靠前，导致后排第一时间没人保护',
  '打野惩戒还在冷却，不适合现在逼大龙',
  '装备差已经拉开，最好避战等下一件成装',
  '这波河道口能提前封住，团战会好打很多',
  '阵容更适合拉扯，不应该在狭窄地形硬开',
  '对面关键控制交完了，现在才是反打窗口',
  '中路线没处理就接团，赢了也很难转资源',
  '上路 TP 落点太远，正面只能先拖时间',
  '辅助的扫描没有问题，问题是队友跟进慢了',
  '打野位置被看到了，这条龙其实已经很难争',
  'AD 还差一件装备，拖两分钟再接团收益更高',
  '辅助先占住侧面草丛，阵容的开团角度会更好',
  '打野没必要抢着进场，等辅助控制命中更稳',
  '河道这波视野差不是一个眼，是整体站位太靠后',
  '阵容中期强势期已经过了，接下来要避免正面碰撞'
];

const PERSONAL_COMMENTS = [
  '辅助刚才扫描交太早了',
  '我觉得不是辅助，是上路支援太慢',
  '这波主要还是河道没视野',
  '辅助前面把关键技能交掉了',
  '辅助这里站位导致开团太早',
  '这波开团时机确实太早',
  '@我 我也觉得辅助这波站位有问题',
  '其实辅助已经在给信号了',
  '辅助这次扫描路线没覆盖到河道草',
  '我更关注开团后的跟进，第一波伤害没有接上',
  '辅助先手没问题，但上路 TP 明显慢了一拍',
  '开团前如果先排掉河道视野会稳很多',
  '这波辅助应该留控制保护 AD',
  '开团目标一直是前排，后排完全没有受到压力',
  '辅助已经给信号了，打野还是进得太深',
  '我觉得阵容需要辅助先占住侧面草丛',
  '辅助装备偏保护，现在主动开团成功率不高',
  '这波开团角度很好，可惜 AD 距离太远',
  '@我 辅助的问题更像是视野节奏没对上',
  '开团前上路线没推进，赢团也拿不到资源',
  '辅助绕后时间太久，正面已经被迫开了',
  '打野应该等辅助控制命中后再进场',
  '河道视野刚消失就开团，风险确实太大',
  '阵容需要拉扯，但辅助连续选择强开',
  'AD 装备还没成型，辅助应该先保发育',
  '辅助留一个控制技能，后排会安全很多',
  '开团时机没错，错的是队友站位太分散',
  '我觉得这波更像沟通问题，不是辅助单点失误',
  '辅助第一时间看的是河道，开团信号来得太突然',
  '如果打野先给侧面压力，辅助的开团会更自然',
  '这波其实不用强开，等辅助把视野铺出去就行',
  '我想看辅助怎么处理下一波龙坑视野'
];

const COMMENT_TOPICS = ['辅助', '开团', '上路', '河道', '视野', '打野', 'AD', '装备', '阵容'];

function inferCommentTopics(text = '') {
  return COMMENT_TOPICS.filter(topic => text.includes(topic));
}

/* ---------- 速率与时序参数（§3 / §4） ---------- */
const RATE = {
  crowdMin: 1500,    // 首页保持 1.5 秒一条
  crowdMax: 1500,
  filteredMin: 1900, // 筛选开启后单独放慢，不影响首页节奏
  filteredMax: 1900,
  crowdKeep: 120     // 保留足够历史评论，支持演示期间稳定向上翻看
};

const TIMING = {
  firstGuideMin: 800,
  firstGuideMax: 1200,
  filterSweep: 1500,
  toast: 2400
};

const ME = { name: '我', color: '#fe2c55' };
const DEMO_COMMENT_TEXT = '这波感觉辅助的问题更大';

/* ============================================================
   逻辑区
   ============================================================ */

const $ = (id) => document.getElementById(id);

const el = {
  screen:    $('screen'),
  phoneFrame:$('phoneFrame'),
  stepPointer:$('stepPointer'),
  feed:      document.querySelector('.feed'),
  mainCrowd: $('mainCrowd'),
  giftArea:  $('giftArea'),
  keyboard:  $('keyboard'),
  dockInput: $('dockInput'),
  scrim:     $('scrim'),
  moreSheet: $('moreSheet'),
  moreGrab:  $('moreGrab'),
  openMore:  $('openMore'),
  moreCancel:$('moreCancel'),
  dock:      $('dock'),
  liveInput: $('liveInput'),
  liveSend:  $('liveSend'),
  openFilter: $('openFilter'),
  filterTip: $('filterTip'),
  highlightToggle: $('highlightToggle'),
  highlightSwitch: $('highlightSwitch'),
  personalToggle: $('personalToggle'),
  personalSwitch: $('personalSwitch'),
  highlightInfo: $('highlightInfo'),
  highlightDesc: $('highlightDesc'),
  personalInfo: $('personalInfo'),
  personalDesc: $('personalDesc'),
  filterSheet: $('filterSheet'),
  filterScrim: $('filterScrim'),
  filterScroll: $('filterScroll'),
  filterTopicArea: $('filterTopicArea'),
  topicAiStatus: $('topicAiStatus'),
  topicAiStatusText: $('topicAiStatusText'),
  topicRecognized: $('topicRecognized'),
  topicList: $('topicList'),
  topicInputWrap: $('topicInputWrap'),
  topicInput: $('topicInput'),
  addTopic: $('addTopic'),
  toast:     $('toast'),
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
  guideRestart:$('guideRestart')
};

const state = {
  moreOpen: false,
  mode: 'all',
  hasSeenFilterGuide: false,
  latestUserComment: '',
  userTopics: ['辅助', '开团'],
  settingsOpen: false,
  filterTransition: false,
  guideTimer: null,
  highlightDescOpen: false,
  personalDescOpen: false,
  topicRecognition: 'idle',
  topicRecognitionTimer: null,
  topicRecognitionEndHandler: null,
  topicRevealEndHandler: null,
  topicScrollRaf: 0,
  crowdTimer: null,
  filterResultTimer: null,
  filterResultToken: 0,
  filterSweepEndHandler: null,
  filterSweepCallbacks: [],
  crowdHistoryOpening: false,
  crowdTouchY: null,
  crowdTouchMoved: false
};

const rand  = (a, b) => a + Math.random() * (b - a);
const pick  = (arr) => arr[(Math.random() * arr.length) | 0];
const recentCommentTexts = new Map();

/* 各模式独立保留一小段播放历史，避免刚出现的文案马上重复。 */
function pickFreshComment(pool, key, historySize = 10) {
  if (!pool.length) return '';
  const recent = recentCommentTexts.get(key) || [];
  const available = pool.filter(text => !recent.includes(text));
  const text = pick(available.length ? available : pool);
  const keep = Math.min(historySize, Math.max(1, pool.length - 1));
  recentCommentTexts.set(key, [...recent, text].slice(-keep));
  return text;
}

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

/* msg: { kind:'comment'|'anchor'|'notice'|'join'|'follow'|'gift', name, text, gift, mine, category } */
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
  if (msg.category) box.dataset.category = msg.category;
  const topics = Array.isArray(msg.topics) ? msg.topics : inferCommentTopics(msg.text);
  if (topics.length) box.dataset.topics = topics.join('|');
  if (msg.text && msg.text.includes('@我')) box.classList.add('is-mention');
  box.appendChild(lvBadge(msg.mine ? 27 : levelFor(msg.name)));
  if (msg.kind === 'join') {
    box.classList.add('is-join');
    box.appendChild(span('uname', msg.name + ' '));
    box.appendChild(span('body', '来了'));
  } else if (msg.kind === 'follow') {
    box.classList.add('is-follow');
    box.appendChild(span('uname', msg.name + ' '));
    box.appendChild(span('body', '关注了主播'));
  } else {
    box.appendChild(span('uname', msg.mine ? '我：' : msg.name + '：'));
    const body = span('body');
    String(msg.text || '').split(/(@我)/g).filter(Boolean).forEach(part => {
      if (part === '@我') body.appendChild(span('mention-me', part));
      else body.appendChild(document.createTextNode(part));
    });
    box.appendChild(body);
  }
  return box;
}

function isCrowdNearBottom() {
  const box = el.mainCrowd;
  return box.scrollHeight - box.clientHeight - box.scrollTop <= 10;
}

function openCrowdHistory() {
  if (el.mainCrowd.classList.contains('is-history-browsing')) return;
  state.crowdHistoryOpening = true;
  el.mainCrowd.classList.add('is-history-browsing');
  el.mainCrowd.scrollTop = el.mainCrowd.scrollHeight;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    state.crowdHistoryOpening = false;
  }));
}

function closeCrowdHistory() {
  el.mainCrowd.classList.remove('is-history-browsing');
  el.mainCrowd.scrollTop = 0;
}

el.mainCrowd.addEventListener('wheel', event => {
  if (event.deltaY < 0) openCrowdHistory();
}, { passive: true });

el.mainCrowd.addEventListener('touchstart', event => {
  openCrowdHistory();
  state.crowdTouchY = event.touches[0]?.clientY ?? null;
  state.crowdTouchMoved = false;
}, { passive: true });

el.mainCrowd.addEventListener('touchmove', event => {
  const nextY = event.touches[0]?.clientY;
  if (nextY == null || state.crowdTouchY == null) return;
  if (Math.abs(nextY - state.crowdTouchY) > 2) state.crowdTouchMoved = true;
  state.crowdTouchY = nextY;
}, { passive: true });

el.mainCrowd.addEventListener('touchend', () => {
  if (!state.crowdTouchMoved && isCrowdNearBottom()) closeCrowdHistory();
  state.crowdTouchY = null;
  state.crowdTouchMoved = false;
}, { passive: true });

el.mainCrowd.addEventListener('scroll', () => {
  if (!state.crowdHistoryOpening &&
      el.mainCrowd.classList.contains('is-history-browsing') &&
      isCrowdNearBottom()) {
    closeCrowdHistory();
  }
}, { passive: true });

/* 入场：sizer 的 max-height 由 0 线性长到 100px，把上面的消息平滑顶上去 */
function enter(box, node, instant) {
  const sizer = document.createElement('div');
  sizer.className = instant ? 'sizer' : 'sizer is-live-entering';
  if (node.classList.contains('is-mine')) sizer.classList.add('is-own-row');
  sizer.appendChild(node);
  box.appendChild(sizer);

  if (instant) {
    sizer.style.transition = 'none';
    sizer.style.maxHeight  = 'none';
    return sizer;
  }

  node.addEventListener('animationend', event => {
    if (event.animationName === 'douyinCommentEnter') {
      sizer.classList.remove('is-live-entering');
    }
  }, { once: true });

  requestAnimationFrame(() => requestAnimationFrame(() => {
    sizer.style.maxHeight = '100px';
  }));
  return sizer;
}

function pushCrowd(msg, instant) {
  const box  = el.mainCrowd;
  const node = crowdNode(msg);
  enter(box, node, instant);
  while (box.querySelectorAll(':scope > .sizer').length > RATE.crowdKeep) {
    box.querySelector(':scope > .sizer')?.remove();
  }
  return node;
}

/* Demo 会反复预填同一句话；只合并重复的同文自评，不影响不同内容的正常发言。 */
function dedupeOwnComments() {
  const seen = new Set();
  Array.from(el.mainCrowd.querySelectorAll('.msg-plain.is-mine')).reverse().forEach(node => {
    const text = node.querySelector('.body')?.textContent || '';
    if (!seen.has(text)) {
      seen.add(text);
      return;
    }
    node.closest('.sizer')?.remove();
  });
}

/* 按真实配比随机生成一条公屏消息 */
const NICK_EMOJIS = ['🌲','🌈','🌙','🍊','🍋','🍃','🐟','🐱','⭐','☕','🎧','🍭','🌸','🍑','✨','🌊','🦌','🌛','🍀'];
/* 25% 概率给昵称末尾追加一个 emoji（不所有都加，保留朴素感） */
function pickNick(){
  const n = pick(CROWD_NICKS);
  return Math.random() < 0.25 ? n + pick(NICK_EMOJIS) : n;
}

function randomCrowdMsg() {
  if (state.mode === 'highlight') {
    return {
      kind: 'comment',
      name: pickNick(),
      text: pickFreshComment(HIGHLIGHT_COMMENTS, 'highlight', 12),
      category: 'highlight'
    };
  }
  if (state.mode === 'for-you') {
    const topicPool = [...PERSONAL_COMMENTS, ...HIGHLIGHT_COMMENTS, ...CROWD_MSGS]
      .filter(text => inferCommentTopics(text).some(topic => state.userTopics.includes(topic)));
    const text = pickFreshComment(
      topicPool.length ? topicPool : PERSONAL_COMMENTS,
      'for-you',
      12
    );
    return { kind: 'comment', name: pickNick(), text, category: 'personal' };
  }
  let r = Math.random();
  if ((r -= MIX.follow) < 0) return { kind: 'follow', name: pickNick() };
  if ((r -= MIX.join)   < 0) return { kind: 'join',   name: pickNick() };
  if ((r -= MIX.notice) < 0) return pick(NOTICES);
  if ((r -= MIX.anchor) < 0) return { kind: 'anchor', text: pick(ANCHOR_MSGS) };
  if (Math.random() < 0.38) {
    return {
      kind: 'comment',
      name: pickNick(),
      text: pickFreshComment(LOW_INFO_COMMENTS, 'all-low-info', 14),
      category: 'noise'
    };
  }
  return {
    kind: 'comment',
    name: pickNick(),
    text: pickFreshComment(CROWD_MSGS, 'all-comment', 14)
  };
}

function crowdTick() {
  state.crowdTimer = null;
  if (!state.filterTransition) pushCrowd(randomCrowdMsg());
  const delay = state.mode === 'all'
    ? rand(RATE.crowdMin, RATE.crowdMax)
    : rand(RATE.filteredMin, RATE.filteredMax);
  state.crowdTimer = setTimeout(crowdTick, delay);
}

/* 预填一屏，避免刚打开时下方是空的（预填的不走入场动效） */
function seedCrowd(n) {
  for (let i = 0; i < n; i++) {
    let msg;
    if (i % 5 === 2) {
      msg = { kind: 'join', name: pickNick() };
    } else if (i % 4 === 0) {
      msg = {
        kind: 'comment',
        name: pickNick(),
        text: pickFreshComment(LOW_INFO_COMMENTS, 'all-low-info', 14),
        category: 'noise'
      };
    } else if (i % 10 === 6) {
      msg = {
        kind: 'comment',
        name: pickNick(),
        text: pickFreshComment(PERSONAL_COMMENTS, 'seed-personal', 8),
        category: 'personal'
      };
    } else if (i % 8 === 6) {
      msg = {
        kind: 'comment',
        name: pickNick(),
        text: pickFreshComment(HIGHLIGHT_COMMENTS, 'seed-highlight', 8),
        category: 'highlight'
      };
    } else {
      msg = randomCrowdMsg();
    }
    pushCrowd(msg, true);
  }
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

/* 从左滑入固定的上 / 下槽位，两条礼物互不推挤。 */
function giftEnter(gift, slot = 'bottom') {
  const probe = buildGiftCard(gift);
  Object.assign(probe.style, { position: 'fixed', visibility: 'hidden', pointerEvents: 'none' });
  document.body.appendChild(probe);
  const h = probe.offsetHeight;
  document.body.removeChild(probe);

  const wrapper = document.createElement('div');
  Object.assign(wrapper.style, {
    position: 'absolute',
    left: '12px',
    right: '54px',
    bottom: slot === 'top' ? '52px' : '4px',
    overflow: 'hidden',
    maxHeight: '0px',
    transition: 'none'
  });
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
    /* 先在下方槽位滑入，随后上方礼物独立滑入。 */
    const el0 = giftEnter(g0, 'bottom');
    const t1 = setTimeout(() => {
      const el1 = giftEnter(g1, 'top');
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

/* 面板外壳的唯一清理入口，保证更多、键盘与筛选设置互斥。 */
function resetPanelChrome() {
  el.screen.classList.remove('kb-open', 'more-open', 'filter-settings-open', 'topic-kb-open');
  el.dock.classList.remove('is-typing');
  el.moreSheet.setAttribute('aria-hidden', 'true');
  el.filterSheet.setAttribute('aria-hidden', 'true');
  el.keyboard.setAttribute('aria-hidden', 'true');
  state.moreOpen = false;
  state.settingsOpen = false;
  el.liveInput.blur();
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

/* 分享 / 更多面板保持原有能力。 */
function openMore() {
  closeTyping();
  closeFilterSettings();
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

/* ------------------------------------------------------------
   直播间原生输入态：在直播间里直接发公屏，不打开面板
   ------------------------------------------------------------ */
function openTyping() {
  closeFilterSettings();
  resetPanelChrome();
  el.dock.classList.add('is-typing');
  el.screen.classList.add('kb-open');
  el.keyboard.setAttribute('aria-hidden', 'false');
  el.liveInput.value = DEMO_COMMENT_TEXT;
  el.liveSend.classList.add('is-ready');
  el.liveInput.focus();
  el.liveInput.setSelectionRange(el.liveInput.value.length, el.liveInput.value.length);
  Guide.refreshPointer(360);
}
function closeTyping() {
  el.dock.classList.remove('is-typing');
  el.screen.classList.remove('kb-open');
  el.keyboard.setAttribute('aria-hidden', 'true');
  el.liveInput.blur();
  Guide.refreshPointer(300);
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
  if (el.screen.classList.contains('filter-settings-open')) {
    if (el.screen.classList.contains('topic-kb-open')) {
      if (el.keyboard.contains(e.target)) return;
      if (el.topicInput.contains(e.target)) return;
      if (el.addTopic.contains(e.target)) return;
      closeTopicKeyboard();
      return;
    }
    if (el.filterSheet.contains(e.target)) return;
    closeFilterSettings(true);
    return;
  }
  if (!el.screen.classList.contains('kb-open')) return;
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
  state.latestUserComment = text;
  state.userTopics = ['辅助', '开团'];
  pushCrowd({ kind: 'comment', name: ME.name, text, mine: true, category: 'mine' });
  dedupeOwnComments();
  Guide.reach('comment');
  scheduleFilterGuide();
}

/* 轻提示 */
let toastTimer = null;
function toast(html, ms = TIMING.toast) {
  el.toast.innerHTML = html;
  el.toast.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.toast.classList.remove('is-on'), ms);
}

/* ------------------------------------------------------------
   智能评论筛选状态机
   ------------------------------------------------------------ */
function showFilterGuide() {
  if (state.hasSeenFilterGuide || state.settingsOpen) return;
  el.filterTip.classList.add('is-on');
  el.filterTip.setAttribute('aria-hidden', 'false');
}

function hideFilterGuide() {
  clearTimeout(state.guideTimer);
  state.guideTimer = null;
  el.filterTip.classList.remove('is-on');
  el.filterTip.setAttribute('aria-hidden', 'true');
}

function scheduleFilterGuide() {
  if (state.hasSeenFilterGuide) return;
  clearTimeout(state.guideTimer);
  state.guideTimer = setTimeout(showFilterGuide, rand(TIMING.firstGuideMin, TIMING.firstGuideMax));
}

function updateFilterControl() {
  const highlightOn = state.mode === 'highlight';
  const personalOn = state.mode === 'for-you';
  const topicsReady = personalOn && state.topicRecognition === 'ready';
  el.highlightToggle.classList.toggle('is-active', highlightOn);
  el.highlightSwitch.classList.toggle('is-on', highlightOn);
  el.personalToggle.classList.toggle('is-active', personalOn);
  el.personalSwitch.classList.toggle('is-on', personalOn);
  el.highlightToggle.setAttribute('aria-pressed', String(highlightOn));
  el.highlightSwitch.setAttribute('aria-pressed', String(highlightOn));
  el.personalToggle.setAttribute('aria-pressed', String(personalOn));
  el.personalSwitch.setAttribute('aria-pressed', String(personalOn));
  el.screen.classList.toggle('filter-active', state.mode !== 'all');
  el.openFilter.classList.toggle('is-active', state.mode !== 'all');
  el.filterTopicArea.classList.toggle('is-disabled', !topicsReady);
  el.topicInput.disabled = !topicsReady;
  el.addTopic.disabled = !topicsReady;
  el.topicList.querySelectorAll('button').forEach(button => {
    button.disabled = !topicsReady;
  });
  if (!personalOn) {
    closeTopicKeyboard();
  }
  renderTopicPresentation();
}

function setFilterMode(nextMode, { animate = true } = {}) {
  const previousMode = state.mode;
  if (previousMode === nextMode) nextMode = 'all';
  clearTimeout(state.topicRecognitionTimer);
  state.topicRecognitionTimer = null;
  if (state.topicRecognitionEndHandler) {
    el.topicAiStatusText.removeEventListener('animationend', state.topicRecognitionEndHandler);
    state.topicRecognitionEndHandler = null;
  }
  state.mode = nextMode;
  state.topicRecognition = nextMode === 'for-you' ? 'recognizing' : 'idle';
  if (nextMode === 'all') clearFilterReflowOffsets();
  updateFilterControl();
  renderTopics();
  if (nextMode === 'highlight') Guide.reach('highlight');
  if (nextMode === 'for-you') {
    const finishRecognition = () => {
      if (state.mode !== 'for-you') return;
      state.topicRecognitionTimer = null;
      state.topicRecognition = 'ready';
      renderTopics();
      renderTopicPresentation(() => {
        if (state.mode !== 'for-you') return;
        if (animate && previousMode !== nextMode) {
          runFilterAnimation(updateFilterControl, nextMode);
        }
      });
      Guide.reach('personalize');
      Guide.refreshPointer(260);
    };

    if (animate && previousMode !== nextMode) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        requestAnimationFrame(finishRecognition);
      } else {
        const finishRecognitionSweep = event => {
          if (event.target !== el.topicAiStatusText || event.animationName !== 'topicAiTextSweep') return;
          el.topicAiStatusText.removeEventListener('animationend', finishRecognitionSweep);
          state.topicRecognitionEndHandler = null;
          finishRecognition();
        };
        state.topicRecognitionEndHandler = finishRecognitionSweep;
        el.topicAiStatusText.addEventListener('animationend', finishRecognitionSweep);
      }
    } else {
      finishRecognition();
    }
    return;
  }
  if (nextMode !== 'all' && animate && previousMode !== nextMode) {
    runFilterAnimation(updateFilterControl, nextMode);
  }
}

function isHighInformation(node) {
  if (!node || node.classList.contains('is-mine')) return false;
  if (node.dataset.category === 'noise') return false;
  if (node.dataset.category === 'highlight' || node.dataset.category === 'personal') return true;
  const text = node.querySelector('.body')?.textContent || '';
  return text.length >= 11 && !NOISE_COMMENTS.some(noise => text.includes(noise.slice(0, 3)));
}

function matchesCurrentFilter(node, mode = state.mode) {
  if (!node || node.classList.contains('is-mine')) return false;
  if (mode === 'highlight') return isHighInformation(node);
  if (mode === 'for-you') {
    const topics = (node.dataset.topics || '').split('|').filter(Boolean);
    return topics.some(topic => state.userTopics.includes(topic));
  }
  return true;
}

function clearFilterReflowOffsets() {
  el.mainCrowd.querySelectorAll(':scope > .sizer').forEach(holder => {
    holder.style.removeProperty('transition');
    holder.style.removeProperty('transform');
  });
}

function removeNonMatchingComments(mode, onComplete = () => {}) {
  const holders = Array.from(el.mainCrowd.querySelectorAll('.sizer:not(.is-filter-removing)')).filter(holder => {
    const node = holder.querySelector('.msg-plain');
    return node && !matchesCurrentFilter(node, mode);
  });

  if (!holders.length) {
    onComplete();
    return;
  }

  let remaining = holders.length;
  const finishFade = () => {
    remaining -= 1;
    if (remaining !== 0) return;
    /* 保留筛除项的占位，不让下方评论在筛选完成时瞬间补位。
       后续新评论仍通过原有 sizer 入场，自然推动整条评论流向上。 */
    onComplete();
  };

  holders.forEach(holder => {
    const node = holder.querySelector('.msg-plain');
    holder.classList.add('is-filter-removing');

    const finish = event => {
      if (event.target !== node || event.propertyName !== 'opacity') return;
      node.removeEventListener('transitionend', finish);
      finishFade();
    };

    node.addEventListener('transitionend', finish);
    requestAnimationFrame(() => {
      node.classList.add('is-filtering-out');
    });
  });
}

function playFilterSweep(onComplete) {
  if (!el.feed) {
    onComplete();
    return;
  }

  if (typeof onComplete === 'function') state.filterSweepCallbacks.push(onComplete);
  const feed = el.feed;
  if (state.filterSweepEndHandler) {
    feed.removeEventListener('animationend', state.filterSweepEndHandler);
  }
  feed.classList.remove('filter-scan-active');
  feed.style.setProperty('--filter-scan-duration', `${TIMING.filterSweep}ms`);
  feed.style.setProperty('--filter-scan-total-duration', `${TIMING.filterSweep * 2}ms`);
  void feed.offsetWidth;

  const finish = event => {
    if (event.target !== feed || event.animationName !== 'filterGlareScan') return;
    feed.removeEventListener('animationend', finish);
    feed.classList.remove('filter-scan-active');
    state.filterSweepEndHandler = null;
    const callbacks = state.filterSweepCallbacks.splice(0);
    callbacks.forEach(callback => callback());
  };

  state.filterSweepEndHandler = finish;
  feed.addEventListener('animationend', finish);
  feed.classList.add('filter-scan-active');
}

function runFilterAnimation(onDone, expectedMode) {
  dedupeOwnComments();
  const resultToken = ++state.filterResultToken;
  clearTimeout(state.crowdTimer);
  clearTimeout(state.filterResultTimer);
  state.crowdTimer = null;
  state.filterResultTimer = null;
  state.filterTransition = true;
  playFilterSweep(() => {
    if (resultToken !== state.filterResultToken) return;
    if (state.mode !== expectedMode) {
      state.filterTransition = false;
      const nextDelay = state.mode === 'all' ? RATE.crowdMin : RATE.filteredMin;
      state.crowdTimer = setTimeout(crowdTick, nextDelay);
      return;
    }
    removeNonMatchingComments(expectedMode, () => {
      if (resultToken !== state.filterResultToken) return;
      if (state.mode !== expectedMode) {
        state.filterTransition = false;
        const nextDelay = state.mode === 'all' ? RATE.crowdMin : RATE.filteredMin;
        state.crowdTimer = setTimeout(crowdTick, nextDelay);
        return;
      }
      state.filterTransition = false;
      state.filterResultTimer = null;
      onDone();
      state.crowdTimer = setTimeout(crowdTick, RATE.filteredMin);
    });
  });
}

function updateTopicFilterInPlace() {
  if (state.mode !== 'for-you' || state.filterTransition) return;
  removeNonMatchingComments('for-you');
}

function renderTopics() {
  el.topicList.innerHTML = '';
  const disabled = state.mode !== 'for-you';
  state.userTopics.forEach(topic => {
    const chip = document.createElement('span');
    chip.className = 'topic-chip';
    chip.appendChild(document.createTextNode(topic));
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = '×';
    remove.disabled = disabled;
    remove.setAttribute('aria-label', `删除关注内容 ${topic}`);
    remove.addEventListener('click', () => {
      state.userTopics = state.userTopics.filter(item => item !== topic);
      renderTopics();
      renderTopicPresentation();
      Guide.reach('topics');
      updateTopicFilterInPlace();
    });
    chip.appendChild(remove);
    el.topicList.appendChild(chip);
  });
}

function renderTopicPresentation(onRevealComplete) {
  if (!el.topicAiStatus || !el.topicAiStatusText || !el.topicRecognized) return;
  const personalOn = state.mode === 'for-you';
  const ready = personalOn && state.topicRecognition === 'ready';
  const recognizing = personalOn && state.topicRecognition === 'recognizing';
  const hasTopics = state.userTopics.length > 0;
  const shouldReveal = ready && hasTopics && el.topicRecognized.hidden;
  const inputTopBeforeReveal = shouldReveal && el.topicInputWrap
    ? el.topicInputWrap.getBoundingClientRect().top
    : 0;

  el.filterTopicArea.classList.toggle('is-disabled', !ready);
  el.topicInput.disabled = !ready;
  el.addTopic.disabled = !ready;
  el.topicList.querySelectorAll('button').forEach(button => {
    button.disabled = !ready;
  });
  el.topicAiStatusText.textContent = recognizing
    ? '正在根据你最近的发言和互动识别关注内容'
    : ready
      ? hasTopics
        ? '根据你最近的发言和互动识别'
        : '暂无关注内容，可手动添加或根据后续互动自动更新'
      : '暂无关注内容，开启后 AI 自动识别';
  el.topicAiStatus.hidden = false;
  el.topicAiStatus.classList.toggle('is-idle', !personalOn);
  el.topicAiStatus.classList.toggle('is-recognizing', recognizing);
  el.topicRecognized.hidden = !ready || !hasTopics;
  if (!ready) {
    if (state.topicRevealEndHandler) {
      el.topicRecognized.removeEventListener('animationend', state.topicRevealEndHandler);
      state.topicRevealEndHandler = null;
    }
    el.topicRecognized.classList.remove('is-revealing');
    if (el.topicInputWrap) el.topicInputWrap.classList.remove('is-topic-shifting');
    return;
  }

  if (!shouldReveal) {
    if (typeof onRevealComplete === 'function') requestAnimationFrame(onRevealComplete);
    return;
  }

  el.topicRecognized.classList.remove('is-revealing');
  void el.topicRecognized.offsetWidth;
  if (el.topicInputWrap) {
    const inputTopAfterReveal = el.topicInputWrap.getBoundingClientRect().top;
    el.topicInputWrap.style.setProperty('--topic-input-shift', `${inputTopBeforeReveal - inputTopAfterReveal}px`);
    el.topicInputWrap.classList.remove('is-topic-shifting');
    void el.topicInputWrap.offsetWidth;
    el.topicInputWrap.classList.add('is-topic-shifting');
  }
  if (typeof onRevealComplete === 'function') {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      requestAnimationFrame(onRevealComplete);
    } else {
      const finishReveal = event => {
        const topicList = el.topicRecognized.querySelector('.topic-list');
        if (event.target !== topicList || event.animationName !== 'topicRecognizedItemIn') return;
        el.topicRecognized.removeEventListener('animationend', finishReveal);
        state.topicRevealEndHandler = null;
        onRevealComplete();
      };
      if (state.topicRevealEndHandler) {
        el.topicRecognized.removeEventListener('animationend', state.topicRevealEndHandler);
      }
      state.topicRevealEndHandler = finishReveal;
      el.topicRecognized.addEventListener('animationend', finishReveal);
    }
  }
  el.topicRecognized.classList.add('is-revealing');
}
function openFilterSettings() {
  closeTyping();
  closeMore();
  renderTopics();
  hideFilterGuide();
  state.hasSeenFilterGuide = true;
  state.settingsOpen = true;
  el.screen.classList.add('filter-settings-open');
  el.filterSheet.setAttribute('aria-hidden', 'false');
  updateFilterControl();
  Guide.reach('open-filter');
}

function closeFilterSettings(returnToLive = false) {
  const wasOpen = state.settingsOpen;
  state.settingsOpen = false;
  state.highlightDescOpen = false;
  state.personalDescOpen = false;
  el.highlightDesc.hidden = true;
  el.personalDesc.hidden = true;
  el.highlightInfo.setAttribute('aria-expanded', 'false');
  el.personalInfo.setAttribute('aria-expanded', 'false');
  el.screen.classList.remove('filter-settings-open', 'topic-kb-open');
  el.filterSheet.setAttribute('aria-hidden', 'true');
  el.keyboard.setAttribute('aria-hidden', 'true');
  el.topicInput.value = '';
  el.topicInput.blur();
  if (wasOpen && returnToLive) Guide.reach('return-live');
}

function toggleHighlightDesc() {
  state.highlightDescOpen = !state.highlightDescOpen;
  el.highlightDesc.hidden = !state.highlightDescOpen;
  el.highlightInfo.setAttribute('aria-expanded', String(state.highlightDescOpen));
}

function togglePersonalDesc() {
  state.personalDescOpen = !state.personalDescOpen;
  el.personalDesc.hidden = !state.personalDescOpen;
  el.personalInfo.setAttribute('aria-expanded', String(state.personalDescOpen));
}

function addTopic() {
  openTopicKeyboard();
  const topic = el.topicInput.value.trim();
  if (!topic) return;
  const added = !state.userTopics.includes(topic);
  if (added) state.userTopics.push(topic);
  el.topicInput.value = '';
  renderTopics();
  renderTopicPresentation();
  if (added) {
    Guide.reach('topics');
    updateTopicFilterInPlace();
  }
}

function scrollFilterToBottomSoft(duration = 300) {
  if (!el.filterScroll) return;
  if (state.topicScrollRaf) cancelAnimationFrame(state.topicScrollRaf);

  const scroller = el.filterScroll;
  const start = scroller.scrollTop;
  const reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const getTarget = () => Math.max(0, scroller.scrollHeight - scroller.clientHeight);

  if (reduceMotion) {
    scroller.scrollTop = getTarget();
    state.topicScrollRaf = 0;
    return;
  }

  const startedAt = performance.now();
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const step = (now) => {
    const progress = Math.min(1, (now - startedAt) / duration);
    const target = getTarget();
    scroller.scrollTop = start + (target - start) * easeOutCubic(progress);

    if (progress < 1) {
      state.topicScrollRaf = requestAnimationFrame(step);
      return;
    }

    scroller.scrollTop = getTarget();
    state.topicScrollRaf = 0;
  };

  state.topicScrollRaf = requestAnimationFrame(step);
}

function openTopicKeyboard() {
  if (state.mode !== 'for-you') return;
  el.screen.classList.add('topic-kb-open');
  el.keyboard.setAttribute('aria-hidden', 'false');
  try {
    el.topicInput.focus({ preventScroll: true });
  } catch (err) {
    el.topicInput.focus();
  }
  scrollFilterToBottomSoft();
  Guide.refreshPointer(340);
}

function closeTopicKeyboard() {
  el.screen.classList.remove('topic-kb-open');
  el.keyboard.setAttribute('aria-hidden', 'true');
  if (state.topicScrollRaf) cancelAnimationFrame(state.topicScrollRaf);
  state.topicScrollRaf = 0;
  el.topicInput.blur();
  Guide.refreshPointer(300);
}

el.openFilter.addEventListener('click', openFilterSettings);
el.filterTip.addEventListener('click', openFilterSettings);
el.highlightToggle.addEventListener('click', () => setFilterMode('highlight'));
el.highlightSwitch.addEventListener('click', () => setFilterMode('highlight'));
el.personalToggle.addEventListener('click', () => setFilterMode('for-you'));
el.personalSwitch.addEventListener('click', () => setFilterMode('for-you'));
el.highlightInfo.addEventListener('click', toggleHighlightDesc);
el.personalInfo.addEventListener('click', togglePersonalDesc);
el.filterScrim.addEventListener('click', () => closeFilterSettings(true));
el.addTopic.addEventListener('click', addTopic);
el.topicInput.addEventListener('click', openTopicKeyboard);
el.topicInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') addTopic();
  if (event.key === 'Escape') {
    closeTopicKeyboard();
  }
});

/* ------------------------------------------------------------
   右侧动态体验引导 Try the demo
   - 按顺序推进；每一步只展示当前信息，不剧透后续
   - 通过 Guide.reach(id) 由各交互钩子驱动，不改核心逻辑
   ------------------------------------------------------------ */
const Guide = (() => {
  const STEPS = [
    {
      id: 'comment',
      title: '先发一条观点',
      desc: '发送后该评论持续高亮，感知到自己是否成功发言',
      hint: '',
      target: '#dockInput',
      side: 'bottom'
    },
    {
      id: 'open-filter',
      title: '打开筛选评论',
      desc: '底部筛选入口会出现轻提示。',
      hint: '',
      target: '#openFilter',
      side: 'left'
    },
    {
      id: 'highlight',
      title: '只看精彩评论',
      desc: 'AI 扫描结束后，公屏会优先呈现更有信息价值的评论。',
      hint: '',
      target: '#highlightSwitch',
      side: 'right'
    },
    {
      id: 'personalize',
      title: '试试为你精选',
      desc: '公屏会结合你的发言和互动重新筛选评论。',
      hint: '',
      target: '#personalSwitch',
      side: 'right'
    },
    {
      id: 'topics',
      title: '调整关注内容',
      desc: '可以添加或移除关注词，观察公屏如何再次更新。',
      hint: '',
      target: '#topicInput',
      side: 'right'
    },
    {
      id: 'return-live',
      title: '返回直播间，查看筛选结果',
      desc: '收起面板回到公屏。无关干扰已经淡出，评论区只保留与你当前关注更相关的讨论。',
      hint: '› 点击面板外的直播画面',
      target: '#screen',
      targetY: .27,
      side: 'right'
    }
  ];

  let idx = 0;            // 当前步索引
  let finished = false;
  let pointerReminderTimer = null;
  let pointerSettleTimer = null;
  el.guideTotal.textContent = String(STEPS.length).padStart(2, '0');

  function positionPointer(step = STEPS[idx]) {
    if (!el.stepPointer || !el.phoneFrame || !step || finished) return;
    let target = document.querySelector(step.target);
    const pointsToKeyboardSend = step.id === 'comment' && el.screen.classList.contains('kb-open');
    if (pointsToKeyboardSend) target = el.liveSend;
    if (!target) return;

    const frameRect = el.phoneFrame.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const targetX = targetRect.left + targetRect.width * .5 - frameRect.left;
    const targetY = targetRect.top + targetRect.height * (step.targetY ?? .5) - frameRect.top;
    const pointerSide = pointsToKeyboardSend ? 'right' : step.side;
    const isBottom = pointerSide === 'bottom';
    const x = pointsToKeyboardSend
      ? frameRect.width + 20
      : isBottom
      ? Math.max(18, Math.min(frameRect.width - 18, targetX))
      : pointerSide === 'left' ? -15 : frameRect.width + 15;
    const y = isBottom
      ? frameRect.height + 15
      : Math.max(18, Math.min(frameRect.height - 18, targetY));

    el.stepPointer.style.setProperty('--pointer-x', `${x}px`);
    el.stepPointer.style.setProperty('--pointer-y', `${y}px`);
    el.stepPointer.classList.toggle('is-left', pointerSide === 'left');
    el.stepPointer.classList.toggle('is-right', pointerSide === 'right');
    el.stepPointer.classList.toggle('is-bottom', isBottom);
  }

  function replayPointer(className) {
    if (!el.stepPointer) return;
    el.stepPointer.classList.remove('is-cue', 'is-reminder');
    void el.stepPointer.offsetWidth;
    el.stepPointer.classList.add(className);
  }

  function cuePointer(step) {
    if (!el.stepPointer) return;
    clearTimeout(pointerReminderTimer);
    clearTimeout(pointerSettleTimer);
    const isFirstPosition = !el.stepPointer.classList.contains('is-positioned');
    if (isFirstPosition) el.stepPointer.classList.remove('is-visible');
    positionPointer(step);
    if (isFirstPosition) {
      /* 首帧先静默落位，再允许后续步骤移动，避免刷新时箭头从侧边掉下来。 */
      void el.stepPointer.offsetWidth;
      el.stepPointer.classList.add('is-positioned');
    }
    el.stepPointer.classList.add('is-visible');
    replayPointer('is-cue');

    /* 面板与键盘仍在移动时，结束后再校准一次，不让尖头停在旧位置。 */
    pointerSettleTimer = setTimeout(() => positionPointer(step), 420);
    pointerReminderTimer = setTimeout(() => {
      if (!finished && STEPS[idx] === step) replayPointer('is-reminder');
    }, 10600);
  }

  function refreshPointer(settleDelay = 0) {
    if (finished) return;
    const step = STEPS[idx];
    requestAnimationFrame(() => positionPointer(step));
    clearTimeout(pointerSettleTimer);
    if (settleDelay) pointerSettleTimer = setTimeout(() => positionPointer(step), settleDelay);
  }

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
    cuePointer(step);
  }

  function complete() {
    finished = true;
    clearTimeout(pointerReminderTimer);
    clearTimeout(pointerSettleTimer);
    if (el.stepPointer) el.stepPointer.classList.remove('is-visible', 'is-cue', 'is-reminder');
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
  return { reach, restart, refreshPointer };
})();

window.addEventListener('resize', () => Guide.refreshPointer());

el.guideRestart.addEventListener('click', () => {
  /* 整页刷新会复位全部 Demo 状态和挂起的定时器。 */
  location.reload();
});

/* Demo 外部说明：独立于手机与 Try the demo 状态。 */
const logicExplainer = $('logicExplainer');
const projectTab = $('projectTab');
const logicTab = $('logicTab');
const metricsTab = $('metricsTab');
const projectPanel = $('projectPanel');
const logicPanel = $('logicPanel');
const metricsPanel = $('metricsPanel');

function setIntroPanel(panelName) {
  const tabs = [projectTab, logicTab, metricsTab];
  const panels = [projectPanel, logicPanel, metricsPanel];
  if (!logicExplainer || tabs.some(tab => !tab) || panels.some(panel => !panel)) return;

  const activeIndex = panelName === 'logic' ? 1 : panelName === 'metrics' ? 2 : 0;
  logicExplainer.classList.toggle('is-logic', activeIndex === 1);
  logicExplainer.classList.toggle('is-metrics', activeIndex === 2);

  tabs.forEach((tab, index) => {
    const active = index === activeIndex;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    panels[index].setAttribute('aria-hidden', String(!active));
  });
}

if (projectTab && logicTab && metricsTab) {
  const introTabs = [projectTab, logicTab, metricsTab];
  const panelNames = ['project', 'logic', 'metrics'];
  introTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => setIntroPanel(panelNames[index]));
    tab.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const nextIndex = (index + direction + introTabs.length) % introTabs.length;
      setIntroPanel(panelNames[nextIndex]);
      introTabs[nextIndex].focus();
    });
  });
}

/* ------------------------------------------------------------
   启动
   ------------------------------------------------------------ */
seedCrowd(40);
crowdTick();
startGiftLoop();
startPromoCountdown();
startJoinBanner();
setFilterEntryState('hidden');
