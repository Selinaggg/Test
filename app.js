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
  '真的一直在等这一波终于打出来了'
];

/* ---------- 智能评论筛选语料 ---------- */
const NOISE_COMMENTS = [
  '666666', '哈哈哈哈哈哈', '？？？？？？', '冲啊！！！', '主播看这里',
  '别送了别送了', '啊啊啊啊啊'
];

const HIGHLIGHT_COMMENTS = [
  '辅助刚刚扫描是不是交早了？',
  '上路其实可以直接 TP 的',
  '河道这里完全没有视野',
  '这波资源其实可以直接放',
  '对面 AD 已经三件套了',
  '打野这个位置来得太晚了',
  '感觉这波开团时机不太对'
];

const PERSONAL_COMMENTS = [
  '辅助刚才扫描交太早了',
  '我觉得不是辅助，是上路支援太慢',
  '这波主要还是河道没视野',
  '辅助前面把关键技能交掉了',
  '@我 我也觉得辅助这波站位有问题',
  '其实辅助已经在给信号了'
];

/* ---------- 速率与时序参数（§3 / §4） ---------- */
const RATE = {
  crowdMin: 1500,    // 首页与筛选结果统一放慢到 1.5 秒一条
  crowdMax: 1500,
  filteredMin: 1500,
  filteredMax: 1500,
  crowdKeep: 45      // 公屏 DOM 最多保留条数（一屏约 10 条，留足缓冲）
};

const TIMING = {
  firstGuideMin: 800,
  firstGuideMax: 1200,
  filterSweep: 1350,
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
  topicList: $('topicList'),
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
  topicScrollRaf: 0,
  crowdTimer: null,
  filterResultTimer: null,
  filterResultToken: 0,
  filterSweepEndHandler: null,
  filterSweepCallbacks: []
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
  if (msg.text && msg.text.includes('@我')) box.classList.add('is-mention');
  box.appendChild(lvBadge(msg.mine ? 27 : levelFor(msg.name)));
  if (msg.kind === 'join') {
    box.appendChild(span('uname', msg.name + ' '));
    box.appendChild(span('body', '来了'));
  } else if (msg.kind === 'follow') {
    box.classList.add('is-follow');
    box.appendChild(span('uname', msg.name + ' '));
    box.appendChild(span('body', '关注了主播'));
  } else {
    box.appendChild(span('uname', msg.mine ? '我：' : msg.name + '：'));
    box.appendChild(span('body', msg.text));
  }
  return box;
}

/* 入场：sizer 的 max-height 由 0 线性长到 100px，把上面的消息平滑顶上去 */
function enter(box, node, instant) {
  const sizer = document.createElement('div');
  sizer.className = instant ? 'sizer' : 'sizer is-live-entering';
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
  while (box.childElementCount > RATE.crowdKeep) box.removeChild(box.firstElementChild);
  return node;
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
    return { kind: 'comment', name: pickNick(), text: pick(HIGHLIGHT_COMMENTS), category: 'highlight' };
  }
  if (state.mode === 'for-you') {
    return { kind: 'comment', name: pickNick(), text: pick(PERSONAL_COMMENTS), category: 'personal' };
  }
  let r = Math.random();
  if ((r -= MIX.follow) < 0) return { kind: 'follow', name: pickNick() };
  if ((r -= MIX.join)   < 0) return { kind: 'join',   name: pickNick() };
  if ((r -= MIX.notice) < 0) return pick(NOTICES);
  if ((r -= MIX.anchor) < 0) return { kind: 'anchor', text: pick(ANCHOR_MSGS) };
  return { kind: 'comment', name: pickNick(), text: pick(CROWD_MSGS) };
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
  if (el.screen.classList.contains('filter-settings-open')) {
    if (el.screen.classList.contains('topic-kb-open')) {
      if (el.keyboard.contains(e.target)) return;
      if (el.topicInput.contains(e.target)) return;
      if (el.addTopic.contains(e.target)) return;
      closeTopicKeyboard();
      return;
    }
    if (el.filterSheet.contains(e.target)) return;
    closeFilterSettings();
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
  el.highlightToggle.classList.toggle('is-active', highlightOn);
  el.highlightSwitch.classList.toggle('is-on', highlightOn);
  el.personalToggle.classList.toggle('is-active', personalOn);
  el.personalSwitch.classList.toggle('is-on', personalOn);
  el.highlightToggle.setAttribute('aria-pressed', String(highlightOn));
  el.highlightSwitch.setAttribute('aria-pressed', String(highlightOn));
  el.personalToggle.setAttribute('aria-pressed', String(personalOn));
  el.personalSwitch.setAttribute('aria-pressed', String(personalOn));
  el.screen.classList.toggle('filter-active', state.mode !== 'all');
  el.filterTopicArea.classList.toggle('is-disabled', !personalOn);
  el.topicInput.disabled = !personalOn;
  el.addTopic.disabled = !personalOn;
  el.topicList.querySelectorAll('button').forEach(button => {
    button.disabled = !personalOn;
  });
  if (!personalOn) {
    closeTopicKeyboard();
  }
}

function setFilterMode(nextMode, { animate = true } = {}) {
  const previousMode = state.mode;
  if (previousMode === nextMode) nextMode = 'all';
  state.mode = nextMode;
  updateFilterControl();
  renderTopics();
  if (nextMode === 'highlight') Guide.reach('filter');
  if (nextMode === 'for-you') Guide.reach('personalize');
  if (nextMode === 'all') Guide.reach('exit');
  if (nextMode !== 'all' && animate && previousMode !== nextMode) {
    runFilterAnimation(updateFilterControl, nextMode);
  }
}

function isHighInformation(node) {
  if (!node || node.classList.contains('is-mine')) return true;
  if (node.dataset.category === 'highlight' || node.dataset.category === 'personal') return true;
  const text = node.querySelector('.body')?.textContent || '';
  return text.length >= 11 && !NOISE_COMMENTS.some(noise => text.includes(noise.slice(0, 3)));
}

function playFilterSweep(onComplete, { hideCommentsAtEnd = false } = {}) {
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
    if (hideCommentsAtEnd) el.mainCrowd.classList.add('is-filter-source-hidden');
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
  const resultToken = ++state.filterResultToken;
  clearTimeout(state.crowdTimer);
  clearTimeout(state.filterResultTimer);
  state.crowdTimer = null;
  state.filterResultTimer = null;
  state.filterTransition = true;
  playFilterSweep(() => {
    if (resultToken !== state.filterResultToken) return;
    if (state.mode !== expectedMode) {
      el.mainCrowd.classList.remove('is-filter-source-hidden');
      state.filterTransition = false;
      state.crowdTimer = setTimeout(crowdTick, RATE.filteredMin);
      return;
    }
    const nodes = Array.from(el.mainCrowd.querySelectorAll('.msg-plain'));
    nodes.forEach(node => {
      if (node.classList.contains('is-mine')) return;
      const holder = node.closest('.sizer');
      if (holder) holder.remove();
    });

    el.mainCrowd.classList.remove('is-filter-source-hidden');

    let resultCount = 0;
    const targetResultCount = 9;
    const addNextResult = () => {
      if (resultToken !== state.filterResultToken) return;
      if (state.mode !== expectedMode) {
        state.filterTransition = false;
        state.crowdTimer = setTimeout(crowdTick, RATE.filteredMin);
        return;
      }

      pushCrowd(randomCrowdMsg());
      resultCount += 1;
      if (resultCount >= targetResultCount) {
        state.filterTransition = false;
        state.filterResultTimer = null;
        onDone();
        state.crowdTimer = setTimeout(crowdTick, RATE.filteredMin);
        return;
      }
      state.filterResultTimer = setTimeout(addNextResult, RATE.filteredMin);
    };

    addNextResult();
  }, { hideCommentsAtEnd: true });
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
      runFilterAnimation(updateFilterControl, state.mode);
    });
    chip.appendChild(remove);
    el.topicList.appendChild(chip);
  });
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
  Guide.reach('settings');
}

function closeFilterSettings() {
  state.settingsOpen = false;
  el.screen.classList.remove('filter-settings-open', 'topic-kb-open');
  el.filterSheet.setAttribute('aria-hidden', 'true');
  el.keyboard.setAttribute('aria-hidden', 'true');
  el.topicInput.value = '';
  el.topicInput.blur();
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
  if (added) runFilterAnimation(updateFilterControl, state.mode);
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
}

function closeTopicKeyboard() {
  el.screen.classList.remove('topic-kb-open');
  el.keyboard.setAttribute('aria-hidden', 'true');
  if (state.topicScrollRaf) cancelAnimationFrame(state.topicScrollRaf);
  state.topicScrollRaf = 0;
  el.topicInput.blur();
}

el.openFilter.addEventListener('click', openFilterSettings);
el.filterTip.addEventListener('click', openFilterSettings);
el.highlightToggle.addEventListener('click', () => setFilterMode('highlight'));
el.highlightSwitch.addEventListener('click', () => setFilterMode('highlight'));
el.personalToggle.addEventListener('click', () => setFilterMode('for-you'));
el.personalSwitch.addEventListener('click', () => setFilterMode('for-you'));
el.highlightInfo.addEventListener('click', toggleHighlightDesc);
el.personalInfo.addEventListener('click', togglePersonalDesc);
el.filterScrim.addEventListener('click', closeFilterSettings);
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
      title: '先在公屏发一条评论',
      desc: '点击底部「说点什么…」，输入一句话发送到直播间公屏。',
      hint: '在底部输入框输入并发送'
    },
    {
      id: 'filter',
      title: '只看精彩评论',
      desc: '发送后，自己的评论会持续高亮。约一秒后，底部筛选按钮上方会出现轻提示。',
      hint: '点击底部筛选 icon 或「点击筛选评论」气泡'
    },
    {
      id: 'personalize',
      title: '切换为你精选',
      desc: '筛选面板内可以切换精彩评论或为你精选，为你精选会根据刚刚的发言优先展示相关观点。',
      hint: '打开筛选评论面板并切换开关'
    },
    {
      id: 'settings',
      title: '调整关注内容',
      desc: '在筛选评论面板里，可以删除当前话题或添加新的关注内容。',
      hint: '编辑「当前关注」'
    },
    {
      id: 'exit',
      title: '恢复全部评论',
      desc: '关闭当前开关后，后续公屏恢复全部评论。',
      hint: '再次点击已开启的筛选开关'
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
  /* 整页刷新会复位全部 Demo 状态和挂起的定时器。 */
  location.reload();
});

/* ------------------------------------------------------------
   启动
   ------------------------------------------------------------ */
seedCrowd(40);
crowdTick();
startGiftLoop();
startPromoCountdown();
startJoinBanner();
setFilterEntryState('hidden');
