// 喝水提醒：到点弹 Windows 通知；点按钮记录（按杯数或按毫升），进度和计数重启也在。
// 计数统一用毫升保存，切换「按杯数 / 按毫升」不会混算。
const $ = (id) => document.getElementById(id);
const TAG = "water:" + widget.instanceId;   // 每个实例独立，免得同时放两个组件时互相取消通知
const MIN = 60 * 1000;

let ml = 0;        // 今天累计喝了多少毫升
let day = "";
let lastDrink = 0;
let timer = null;

// ── 界面文案：繁中 / 简中 / 英文 ──────────────────────────
const TPL = {
  title: { "zh-TW": "喝水提醒", "zh-CN": "喝水提醒", en: "Water Reminder" },
  due: { "zh-TW": "該喝水啦！", "zh-CN": "该喝水啦！", en: "Time to drink!" },
  inMin: { "zh-TW": "{n} 分後", "zh-CN": "{n} 分后", en: "in {n} min" },
  inHour: { "zh-TW": "{h} 時 {m} 分後", "zh-CN": "{h} 时 {m} 分后", en: "in {h} h {m} min" },
  goalCup: { "zh-TW": "/ {n} 杯", "zh-CN": "/ {n} 杯", en: "/ {n} cups" },
  goalMl: { "zh-TW": "/ {n} 毫升", "zh-CN": "/ {n} 毫升", en: "/ {n} ml" },
  drinkCup: { "zh-TW": "喝水了", "zh-CN": "喝水了", en: "I drank" },
  drinkMl: { "zh-TW": "+{n} 毫升", "zh-CN": "+{n} 毫升", en: "+{n} ml" },
  reset: { "zh-TW": "重置今日", "zh-CN": "重置今日", en: "Reset today" },
  empty: { "zh-TW": "—", "zh-CN": "—", en: "—" },
  notifTitle: { "zh-TW": "喝水提醒 ☆", "zh-CN": "喝水提醒 ☆", en: "Water Reminder ☆" },
  bodyMl: {
    "zh-TW": "今天已 {ml} / {goal} 毫升，再喝一口嘛～",
    "zh-CN": "今天已 {ml} / {goal} 毫升，再喝一口嘛～",
    en: "{ml} of {goal} ml today — one more sip?",
  },
  bodyCup: {
    "zh-TW": "今天已經 {n} 杯啦，再喝一杯嘛～",
    "zh-CN": "今天已经 {n} 杯啦，再喝一杯嘛～",
    en: "{n} cups today — one more?",
  },
  bodyDue: {
    "zh-TW": "該喝杯水啦，主人～不喝水我會擔心的哦💧",
    "zh-CN": "该喝杯水啦，主人～不喝水的话，我会担心你的哦💧",
    en: "Time for a glass of water~ I'd worry about you if you skip it💧",
  },
};

// 纯文字直接挑语言，带占位符的先挑再替换
function tr(key, vars) {
  let s = widget.t(TPL[key]);
  if (vars) for (const k in vars) s = s.split("{" + k + "}").join(String(vars[k]));
  return s;
}

function today() {
  return new Date().toDateString();
}

function toMin(t) {
  const [h, m] = String(t || "").split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  return h * 60 + m;
}

// 免打扰时段；开始和结束相同、或填得不对，就当没有免打扰
function quietRange() {
  const a = toMin(widget.settings.get("quietStart"));
  const b = toMin(widget.settings.get("quietEnd"));
  if (a === null || b === null || a === b) return null;
  return { a, b };
}

// 某个时刻是否在免打扰时段内（支持跨午夜）
function quietAt(ms) {
  const r = quietRange();
  if (!r) return false;
  const d = new Date(ms);
  const now = d.getHours() * 60 + d.getMinutes();
  return r.a <= r.b ? (now >= r.a && now < r.b) : (now >= r.a || now < r.b);
}

function quietNow() {
  return quietAt(Date.now());
}

// ms 所在的免打扰时段结束后（含）最近的那一刻
function quietEndAfter(ms) {
  const r = quietRange();
  if (!r) return ms;
  const d = new Date(ms);
  d.setHours(Math.floor(r.b / 60), r.b % 60, 0, 0);
  if (d.getTime() <= ms) d.setDate(d.getDate() + 1);
  return d.getTime();
}

function intervalMs() {
  const v = Number(widget.settings.get("interval"));
  return (v > 0 ? v : 45) * MIN;
}

const mode = () => (widget.settings.get("mode") === "ml" ? "ml" : "cup");

// 一杯多少毫升（两种模式共用同一个步长）
function cupMl() {
  return Math.max(1, Number(widget.settings.get("cupSize")) || 250);
}

// 今日目标，统一换算成毫升
function goalMl() {
  if (mode() === "ml") return Math.max(1, Number(widget.settings.get("goalMl")) || 2000);
  return Math.max(1, Number(widget.settings.get("goal")) || 8) * cupMl();
}

function fmt(n) {
  return n.toLocaleString(widget.locale);
}

// 毫升换算成杯数显示（可能带一位小数）
function fmtCups() {
  return (ml / cupMl()).toLocaleString(widget.locale, { maximumFractionDigits: 1 });
}

// 每日补水的好处：每次提醒随机挑一条
// 二次元风格小贴士：健康知识 + 萌系语气
const TIPS = [
  {
    "zh-TW": "喝水能促進新陳代謝，幫助身體排毒～身體輕盈得像要飄起來一樣☆",
    "zh-CN": "喝水能促进新陈代谢，帮助身体排毒～身体轻盈得像要飘起来一样☆",
    en: "Water boosts your metabolism and helps flush things out — light as a feather☆",
  },
  {
    "zh-TW": "充足的水分讓皮膚更水潤有光澤，變成發光的美少女✨",
    "zh-CN": "充足的水分让皮肤更水润有光泽，变成发光的美少女✨",
    en: "Enough water keeps your skin dewy and glowing✨",
  },
  {
    "zh-TW": "補水有助於大腦保持清醒、提升專注力，頭腦轉得像超算一樣快☆",
    "zh-CN": "补水有助于大脑保持清醒、提升专注力，头脑转得像超算一样快☆",
    en: "Hydration keeps your head clear and focused — quick as a supercomputer☆",
  },
  {
    "zh-TW": "多喝水能潤滑關節，減少久坐的僵硬感，身體軟軟的很舒服～",
    "zh-CN": "多喝水能润滑关节，减少久坐的僵硬感，身体软软的很舒服～",
    en: "Drinking more lubricates your joints and eases the stiffness of sitting all day~",
  },
  {
    "zh-TW": "水分充足可以幫助調節體溫，夏天不易中暑，元氣滿滿度過每一天☆",
    "zh-CN": "水分充足可以帮助调节体温，夏天不易中暑，元气满满度过每一天☆",
    en: "Good hydration helps regulate body temperature and keeps you going all summer☆",
  },
  {
    "zh-TW": "飯前喝點水有助於消化，也能避免正餐吃過量，身材也更好保持啦☆",
    "zh-CN": "饭前喝点水有助于消化，也能避免正餐吃过量，身材也更好保持啦☆",
    en: "A glass before meals aids digestion and keeps you from overeating☆",
  },
  {
    "zh-TW": "多喝水能預防結石，給腎臟減減負，內臟也要好好疼愛哦～",
    "zh-CN": "多喝水能预防结石，给肾脏减减负，内脏也要好好疼爱哦～",
    en: "Plenty of water helps prevent kidney stones — be kind to your kidneys~",
  },
  {
    "zh-TW": "輕度脫水就會讓人疲勞頭痛，別等渴了才喝，要像充電一樣定時補水☆",
    "zh-CN": "轻度脱水就会让人疲劳头痛，别等渴了才喝，要像充电一样定时补水☆",
    en: "Even mild dehydration brings fatigue and headaches — sip on a schedule, like recharging☆",
  },
  {
    "zh-TW": "喝水能保持呼吸道濕潤，嗓子更舒服，唱歌也更動聽啦♪",
    "zh-CN": "喝水能保持呼吸道湿润，嗓子更舒服，唱歌也更动听啦♪",
    en: "Water keeps your throat moist — and your singing sweeter♪",
  },
  {
    "zh-TW": "充足水分讓血液循環更順暢，精力更充沛，一整天都活力全開☆",
    "zh-CN": "充足水分让血液循环更顺畅，精力更充沛，一整天都活力全开☆",
    en: "Good hydration keeps circulation smooth and your energy high all day☆",
  },
];
function tip() {
  return widget.t(TIPS[Math.floor(Math.random() * TIPS.length)]);
}

function paint() {
  const isMl = mode() === "ml";
  const g = goalMl();
  $("title").textContent = tr("title");
  $("reset").textContent = tr("reset");
  $("cups").textContent = isMl ? fmt(ml) : fmtCups();
  $("goal").textContent = isMl ? tr("goalMl", { n: fmt(g) }) : tr("goalCup", { n: fmt(g / cupMl()) });
  $("bar").style.width = Math.min(100, (ml / g) * 100) + "%";
  $("drink").textContent = isMl ? tr("drinkMl", { n: fmt(cupMl()) }) : tr("drinkCup");

  if (!lastDrink) { $("next").textContent = tr("empty"); return; }
  const left = lastDrink + intervalMs() - Date.now();
  if (left <= 0) {
    $("next").textContent = tr("due");
    // 这一轮（同一次「上次喝水」）只提醒一次：弹过或已预约过都不再弹
    if (!quietNow() && paint._remindedFor !== lastDrink) {
      paint._remindedFor = lastDrink;
      const line = isMl
        ? tr("bodyMl", { ml: fmt(ml), goal: fmt(g) })
        : tr("bodyCup", { n: fmtCups() });
      widget.notify({ title: tr("notifTitle"), body: `${line}\n💧 ${tip()}`, tag: TAG });
    }
  } else {
    const m = Math.ceil(left / MIN);
    $("next").textContent = m >= 60 ? tr("inHour", { h: Math.floor(m / 60), m: m % 60 }) : tr("inMin", { n: m });
  }
}

function schedule() {
  // 预约到点通知；FullWidget 计时，页面暂停也准时。每次喝水/改设置都会重新预约。
  let at = lastDrink + intervalMs();
  // 到点落在免打扰时段里，就顺延到免打扰结束，而不是照样弹
  if (quietAt(at)) at = quietEndAfter(at);
  paint._bookedLang = widget.locale;

  if (at > Date.now() && !quietAt(at)) {
    paint._remindedFor = lastDrink;   // 这一轮已预约，paint 不再补弹
    widget.notify({ title: tr("notifTitle"), body: `${tr("bodyDue")}\n💧 ${tip()}`, at, tag: TAG });
  } else {
    widget.notify.cancel(TAG);
    // 已经过了点：提醒要么早弹过、要么就是现在，不再事后补一条
    if (at <= Date.now() && !quietNow()) paint._remindedFor = lastDrink;
  }
}

function tick() {
  // 跨天自动清零
  if (day !== today()) { day = today(); ml = 0; widget.storage.set("intake", { day, ml }); }
  paint();
  // 语言变了就重排一次，已预约的通知换成新语言（放在 paint 之后，免得吞掉该弹的提醒）
  if (paint._bookedLang && paint._bookedLang !== widget.locale) schedule();
}

widget.storage.get("intake").then((saved) => {
  if (saved && saved.day === today()) { ml = Number(saved.ml) || 0; return; }
  // 旧版本只存了 log.cups，没记单位：一次「喝水了」至少是一杯（cupSize 最小 50ml），
  // 所以小于 50 的一定是杯数，否则就是毫升。不依赖当前模式，切换过也不会算错。
  return widget.storage.get("log").then((old) => {
    if (!old || old.day !== today()) return;
    const n = Number(old.cups) || 0;
    if (!n) return;
    ml = Math.round(n < 50 ? n * cupMl() : n);
    widget.storage.set("intake", { day: today(), ml });
    widget.storage.remove("log");
  });
}).then(() => {
  day = today();
  return widget.storage.get("last");
}).then((last) => {
  lastDrink = Number(last) || Date.now();
  widget.storage.set("last", lastDrink);
  tick();
  schedule();
  timer = setInterval(tick, 30 * 1000);   // 每 30 秒刷新一次画面（跨天清零、倒计时）
});

$("drink").addEventListener("click", () => {
  if (day !== today()) { day = today(); ml = 0; }   // 刚过零点还没刷新：先换到新的一天，别记到昨天
  ml += cupMl();
  lastDrink = Date.now();
  widget.storage.set("intake", { day, ml });
  widget.storage.set("last", lastDrink);
  widget.notify.cancel(TAG);   // 喝了就先取消这条
  paint();
  schedule();
});

// 重置今日：清零计数，倒计时重新开始
$("reset").addEventListener("click", () => {
  if (day !== today()) { day = today(); }
  ml = 0;
  lastDrink = Date.now();
  widget.storage.set("intake", { day, ml });
  widget.storage.set("last", lastDrink);
  paint();
  schedule();
});

// 用户在控制中心改了设置（计量方式/目标/间隔/免打扰），立即生效
widget.settings.onChange(() => { paint(); schedule(); });
