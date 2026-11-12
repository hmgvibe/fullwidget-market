/* 逐时天气：一条每小时的气温曲线，曲线下面是逐时的降水概率。
   数据来自 Open-Meteo；位置用 SDK 自带的 places.js（和内置天气组件同一套）。 */

const $ = (id) => document.getElementById(id);
const t = widget.t;

let opts = widget.settings.get();
let data = null;     // { at, place, current, hourly, daily, unit }
let failed = false;
let points = [];     // 屏幕上这段时间里的每一小时
let selected = 0;

const REFRESH = 15 * 60e3;

// Open-Meteo 用的 WMO 天气代码 → 文字和一张简笔图
const CODES = {
  0: [{ "zh-TW": "晴", "zh-CN": "晴", en: "Clear" }, "sun"],
  1: [{ "zh-TW": "晴時多雲", "zh-CN": "晴间多云", en: "Mainly clear" }, "partly"],
  2: [{ "zh-TW": "多雲", "zh-CN": "多云", en: "Partly cloudy" }, "partly"],
  3: [{ "zh-TW": "陰", "zh-CN": "阴", en: "Overcast" }, "cloud"],
  45: [{ "zh-TW": "霧", "zh-CN": "雾", en: "Fog" }, "fog"],
  48: [{ "zh-TW": "霧凇", "zh-CN": "雾凇", en: "Rime fog" }, "fog"],
  51: [{ "zh-TW": "毛毛雨", "zh-CN": "毛毛雨", en: "Drizzle" }, "drizzle"],
  53: [{ "zh-TW": "毛毛雨", "zh-CN": "毛毛雨", en: "Drizzle" }, "drizzle"],
  55: [{ "zh-TW": "濃毛毛雨", "zh-CN": "浓毛毛雨", en: "Dense drizzle" }, "drizzle"],
  56: [{ "zh-TW": "凍毛毛雨", "zh-CN": "冻毛毛雨", en: "Freezing drizzle" }, "drizzle"],
  57: [{ "zh-TW": "凍毛毛雨", "zh-CN": "冻毛毛雨", en: "Freezing drizzle" }, "drizzle"],
  61: [{ "zh-TW": "小雨", "zh-CN": "小雨", en: "Light rain" }, "rain"],
  63: [{ "zh-TW": "中雨", "zh-CN": "中雨", en: "Rain" }, "rain"],
  65: [{ "zh-TW": "大雨", "zh-CN": "大雨", en: "Heavy rain" }, "rain"],
  66: [{ "zh-TW": "凍雨", "zh-CN": "冻雨", en: "Freezing rain" }, "rain"],
  67: [{ "zh-TW": "凍雨", "zh-CN": "冻雨", en: "Freezing rain" }, "rain"],
  71: [{ "zh-TW": "小雪", "zh-CN": "小雪", en: "Light snow" }, "snow"],
  73: [{ "zh-TW": "中雪", "zh-CN": "中雪", en: "Snow" }, "snow"],
  75: [{ "zh-TW": "大雪", "zh-CN": "大雪", en: "Heavy snow" }, "snow"],
  77: [{ "zh-TW": "霰", "zh-CN": "霰", en: "Snow grains" }, "snow"],
  80: [{ "zh-TW": "陣雨", "zh-CN": "阵雨", en: "Showers" }, "rain"],
  81: [{ "zh-TW": "陣雨", "zh-CN": "阵雨", en: "Showers" }, "rain"],
  82: [{ "zh-TW": "強陣雨", "zh-CN": "强阵雨", en: "Heavy showers" }, "rain"],
  85: [{ "zh-TW": "陣雪", "zh-CN": "阵雪", en: "Snow showers" }, "snow"],
  86: [{ "zh-TW": "陣雪", "zh-CN": "阵雪", en: "Snow showers" }, "snow"],
  95: [{ "zh-TW": "雷雨", "zh-CN": "雷雨", en: "Thunderstorm" }, "storm"],
  96: [{ "zh-TW": "雷雨伴冰雹", "zh-CN": "雷雨伴冰雹", en: "Thunderstorm, hail" }, "storm"],
  99: [{ "zh-TW": "雷雨伴冰雹", "zh-CN": "雷雨伴冰雹", en: "Thunderstorm, hail" }, "storm"],
};
const FALLBACK = [{ "zh-TW": "—", "zh-CN": "—", en: "—" }, "cloud"];
const entry = (code) => CODES[code] || FALLBACK;
const words = (code) => t(entry(code)[0]);

// 24×24 的线条图，颜色跟着文字走
const CLOUD_LINE = "M7.6 18h9.1a3.6 3.6 0 0 0 .4-7.2 5.2 5.2 0 0 0-9.9-1.1A3.7 3.7 0 0 0 7.6 18z";
const RAYS = "M12 3.2v2M12 18.8v2M3.2 12h2M18.8 12h2M5.8 5.8l1.4 1.4M16.8 16.8l1.4 1.4M5.8 18.2l1.4-1.4M16.8 7.2l1.4-1.4";
const DRAW = {
  sun: `<circle cx="12" cy="12" r="3.7"/><path d="${RAYS}"/>`,
  partly: `<circle cx="8.3" cy="8.3" r="2.7"/><path d="M8.3 3.2v1.2M3.2 8.3h1.2M4.7 4.7l.85.85M11.9 4.7l-.85.85M4.7 11.9l.85-.85"/><path transform="translate(2.2 1.6)" d="${CLOUD_LINE}"/>`,
  cloud: `<path d="${CLOUD_LINE}"/>`,
  fog: `<path d="M4 9h13M7 13h13M4 17h11"/>`,
  drizzle: `<path transform="translate(0 -3)" d="${CLOUD_LINE}"/><path d="M8.5 18.5v.5M12 19.5v.5M15.5 18.5v.5"/>`,
  rain: `<path transform="translate(0 -3)" d="${CLOUD_LINE}"/><path d="M8.6 17.6l-1 2.6M12.1 17.6l-1 2.6M15.6 17.6l-1 2.6"/>`,
  snow: `<path transform="translate(0 -3)" d="${CLOUD_LINE}"/><path d="M8.5 18.2v2M7.6 19.2h1.8M12 18.8v2M11.1 19.8h1.8M15.5 18.2v2M14.6 19.2h1.8"/>`,
  storm: `<path transform="translate(0 -3)" d="${CLOUD_LINE}"/><path d="M12.6 15.4l-2 3.3h2.6l-1.8 3"/>`,
};
const icon = (code) => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${DRAW[entry(code)[1]] || DRAW.cloud}</svg>`;

const nowText = () => t({ "zh-TW": "現在", "zh-CN": "现在", en: "Now" });
const hourText = (h) => t({ "zh-TW": `${h}時`, "zh-CN": `${h}时`, en: `${String(h).padStart(2, "0")}:00` });
/** 「多久前刷新的」：自动刷新和手动刷新都算，看的是上一次成功拿到数据的时间 */
function agoText(ms) {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 60) return t({ "zh-TW": "剛剛更新", "zh-CN": "刚刚更新", en: "just now" });
  const m = Math.min(999, Math.round(s / 60));
  if (m < 60) return t({ "zh-TW": `${m} 分鐘前`, "zh-CN": `${m} 分钟前`, en: `${m} min ago` });
  const h = Math.round(m / 60);
  if (h < 24) return t({ "zh-TW": `${h} 小時前`, "zh-CN": `${h} 小时前`, en: `${h} h ago` });
  return t({ "zh-TW": `${Math.round(h / 24)} 天前`, "zh-CN": `${Math.round(h / 24)} 天前`, en: `${Math.round(h / 24)} d ago` });
}

function updateAgo() {
  const el = $("ago");
  if (el) el.textContent = data ? agoText(Date.now() - data.at) : "";
}

let xs = [];
let ys = [];
let geo = { padX: 0, step: 0 };
let dots = [];
let bars = [];
let selEl = null;

async function json(url) {
  const r = await widget.fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

async function refresh() {
  try {
    const place = await places.locate(opts.city);
    const unit = opts.unit === "fahrenheit" ? "&temperature_unit=fahrenheit" : "";
    const f = await json(
      `https://api.open-meteo.com/v1/forecast?latitude=${place.lat}&longitude=${place.lon}` +
      "&current=temperature_2m,apparent_temperature,weather_code" +
      "&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,weather_code" +
      "&daily=temperature_2m_max,temperature_2m_min" +
      `&forecast_days=2&timezone=auto${unit}`);
    data = { at: Date.now(), place, current: f.current, hourly: f.hourly, daily: f.daily, unit: opts.unit };
    failed = false;
    await widget.storage.set("last", data);
  } catch (e) {
    // 城市找不到：直接说出来，不要继续显示上一个地方
    if (e instanceof places.NotFound) { data = null; showMessage(e.message, true); return; }
    failed = true;
    widget.log(`hourly-weather: ${e.message}`);
    if (!data) {
      showMessage(e.message.startsWith("permission")
        ? e.message
        : t({ "zh-TW": "暫時取不到天氣", "zh-CN": "暂时取不到天气", en: "Weather unavailable" }), true);
      return;
    }
  }
  if (data) render();
}

function showMessage(text, retry) {
  $("hw").hidden = true;
  $("msg").hidden = false;
  $("msg-text").textContent = text;
  $("retry").hidden = !retry;
}

/** 从当前这一小时开始，取出要画在曲线上的每个小时。 */
function nextHours(d) {
  const h = d.hourly;
  const nowKey = d.current.time.slice(0, 13);   // "2026-11-06T14"
  let start = h.time.findIndex((x) => x.slice(0, 13) === nowKey);
  if (start < 0) start = 0;
  const n = Math.min(24, Math.max(6, Number(opts.hours) || 24));
  const end = Math.min(h.time.length, start + n);
  const out = [];
  for (let i = start; i < end; i++) {
    out.push({
      hour: Number(h.time[i].slice(11, 13)),
      temp: h.temperature_2m[i],
      rain: h.precipitation_probability[i] ?? 0,
      mm: h.precipitation[i] ?? 0,
      code: h.weather_code[i],
    });
  }
  return out;
}

/** 一条平滑的线（Catmull-Rom 转三次贝塞尔），控制点限制在画图区里，不会甩出去。 */
function smoothD(px, py, top, bottom) {
  if (px.length < 2) return "";
  const k = 0.9 / 6;
  let d = `M${px[0].toFixed(1)} ${py[0].toFixed(1)}`;
  for (let i = 0; i < px.length - 1; i++) {
    const x0 = px[i - 1] ?? px[i], y0 = py[i - 1] ?? py[i];
    const x1 = px[i], y1 = py[i];
    const x2 = px[i + 1], y2 = py[i + 1];
    const x3 = px[i + 2] ?? x2, y3 = py[i + 2] ?? y2;
    const c1y = Math.min(bottom, Math.max(top, y1 + (y2 - y0) * k));
    const c2y = Math.min(bottom, Math.max(top, y2 - (y3 - y1) * k));
    d += ` C${(x1 + (x2 - x0) * k).toFixed(1)} ${c1y.toFixed(1)}` +
         ` ${(x2 - (x3 - x1) * k).toFixed(1)} ${c2y.toFixed(1)}` +
         ` ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }
  return d;
}

function draw() {
  const chart = $("chart");
  const svg = $("curve");
  const W = Math.round(chart.clientWidth);
  const H = Math.round(chart.clientHeight);
  if (!W || !H || points.length < 2) return;

  svg.setAttribute("width", String(W));
  svg.setAttribute("height", String(H));
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

  const n = points.length;
  const compact = H < 96;
  const maxRain = Math.max(0, ...points.map((p) => p.rain));
  const rainOn = opts.rain !== false && maxRain >= 5 && !compact;
  const hourH = compact ? 0 : 15;
  const rainH = rainOn ? Math.max(12, Math.min(26, H * 0.17)) : 0;
  const gap = rainH ? 6 : 0;
  const padX = W >= 300 ? 13 : W >= 230 ? 10 : 7;
  const topPad = compact ? 8 : 16;
  const bottom = hourH + rainH + gap;
  const yTop = topPad;
  const yBottom = Math.max(yTop + 10, H - bottom);
  const step = (W - padX * 2) / (n - 1);
  geo = { padX, step };

  const temps = points.map((p) => p.temp);
  let lo = Math.min(...temps);
  let hi = Math.max(...temps);
  if (hi - lo < 3) { const mid = (hi + lo) / 2; lo = mid - 1.5; hi = mid + 1.5; }
  const span = Math.max(1, hi - lo);
  const loV = lo - span * 0.16;
  const hiV = hi + span * 0.16;

  xs = points.map((_, i) => padX + i * step);
  ys = points.map((p) => yTop + (1 - (p.temp - loV) / (hiV - loV)) * (yBottom - yTop));

  const grid = [0.34, 0.68].map((f) => {
    const y = yTop + (yBottom - yTop) * f;
    return `<line class="grid-line" x1="${padX}" y1="${y.toFixed(1)}" x2="${W - padX}" y2="${y.toFixed(1)}"/>`;
  }).join("");

  // 过了午夜的地方画一条竖虚线
  const marks = points.map((p, i) => (i > 0 && p.hour === 0
    ? `<line class="midnight" x1="${xs[i].toFixed(1)}" y1="${yTop}" x2="${xs[i].toFixed(1)}" y2="${H - hourH - 2}"/>`
    : "")).join("");

  const line = smoothD(xs, ys, yTop, yBottom);

  // 降水概率的小柱子
  const barW = Math.min(7, Math.max(2, step * 0.46));
  const rainBase = H - hourH - 4;
  const rainBars = rainOn ? points.map((p, i) => {
    const hgt = Math.max(p.rain > 0 ? 1 : 0, (rainH * Math.min(100, p.rain)) / 100);
    if (!hgt) return "";
    return `<rect class="rain-bar${i === selected ? " on" : ""}" data-i="${i}"` +
      ` x="${(xs[i] - barW / 2).toFixed(1)}" y="${(rainBase - hgt).toFixed(1)}"` +
      ` width="${barW.toFixed(1)}" height="${hgt.toFixed(1)}" rx="${Math.min(2, barW / 2).toFixed(1)}"/>`;
  }).join("") : "";

  // 气温数字：窄的时候隔几个画一个
  const labelStep = step < 15 ? 3 : step < 24 ? 2 : 1;
  const tempLabels = points.map((p, i) => {
    if (i % labelStep && i !== n - 1) return "";
    let y = ys[i] - 7;
    if (y < yTop + 8) y = ys[i] + 15;
    return `<text class="temp-label" x="${xs[i].toFixed(1)}" y="${y.toFixed(1)}">${Math.round(p.temp)}°</text>`;
  }).join("");

  // 底下的小时：0 点、末尾和按步长的刻度都算候选，但每两个标签之间必须留出空隙，
  // 放不下的那个直接跳过（否则夜里「23时」和「0时」会叠在一起）
  const hourStep = step < 15 ? 3 : step < 22 ? 2 : 1;
  const hourAnchor = (i) => (i === 0 ? "start" : i === n - 1 ? "end" : "middle");
  const hourLabelBounds = (i) => {
    const txt = i === 0 ? nowText() : hourText(points[i].hour);
    const w = txt.length * 5.6 + 2;
    const a = hourAnchor(i);
    const left = a === "middle" ? xs[i] - w / 2 : a === "start" ? xs[i] : xs[i] - w;
    return [left, left + w];
  };
  const hourBoxes = [];
  const hourLabels = compact ? "" : points.map((p, i) => {
    if (i % hourStep && i !== n - 1 && i !== 0 && p.hour !== 0) return "";
    const box = hourLabelBounds(i);
    const clash = hourBoxes.some((b) => box[0] < b[1] + 5 && b[0] < box[1] + 5);
    if (clash) return "";
    hourBoxes.push(box);
    const anchor = hourAnchor(i);
    return `<text class="hour-label${i === 0 ? " now" : ""}" x="${xs[i].toFixed(1)}"` +
      ` y="${(H - 3).toFixed(1)}" text-anchor="${anchor}">${i === 0 ? nowText() : hourText(p.hour)}</text>`;
  }).join("");

  const pointsMarkup = points.map((p, i) =>
    `<circle class="pt${i === selected ? " on" : ""}" data-i="${i}"` +
    ` cx="${xs[i].toFixed(1)}" cy="${ys[i].toFixed(1)}" r="${i === selected ? 4.2 : 2.6}"/>`).join("");

  svg.innerHTML = `
    ${grid}
    ${marks}
    <path class="line" d="${line}"/>
    ${rainBars}
    ${tempLabels}
    <line class="sel-line" x1="${xs[selected].toFixed(1)}" y1="${yTop}"` +
      ` x2="${xs[selected].toFixed(1)}" y2="${(H - 2).toFixed(1)}"/>
    ${pointsMarkup}
    ${hourLabels}`;

  dots = Array.from(svg.querySelectorAll(".pt"));
  bars = Array.from(svg.querySelectorAll(".rain-bar"));
  selEl = svg.querySelector(".sel-line");
}

/** 把「选中哪一小时」画到曲线和下面那一行字上。 */
function paint() {
  dots.forEach((el, i) => {
    el.classList.toggle("on", i === selected);
    el.setAttribute("r", i === selected ? 4.2 : 2.6);
  });
  bars.forEach((el) => el.classList.toggle("on", Number(el.dataset.i) === selected));
  if (selEl && xs[selected] != null) {
    selEl.setAttribute("x1", xs[selected].toFixed(1));
    selEl.setAttribute("x2", xs[selected].toFixed(1));
  }
  const p = points[selected];
  if (!p) return;
  $("r-time").textContent = selected === 0 ? nowText() : hourText(p.hour);
  $("r-cond").innerHTML = icon(p.code) + `<span>${words(p.code)}</span>`;
  $("r-temp").textContent = `${Math.round(p.temp)}°`;
  $("r-rain").textContent = p.rain >= 1
    ? t({ "zh-TW": `降雨 ${p.rain}%`, "zh-CN": `降水 ${p.rain}%`, en: `Rain ${p.rain}%` }) +
      (p.mm >= 0.1 ? ` · ${p.mm.toFixed(1)} mm` : "")
    : t({ "zh-TW": "沒有雨", "zh-CN": "无降水", en: "Dry" });
}

function select(i) {
  selected = Math.max(0, Math.min(points.length - 1, i));
  paint();
}

function render() {
  if (!data) return;
  points = nextHours(data);
  selected = Math.min(selected, Math.max(0, points.length - 1));
  $("msg").hidden = true;
  $("hw").hidden = false;

  const c = data.current;
  $("city").textContent = data.place.name || "";
  $("head-ic").innerHTML = icon(c.weather_code);
  $("cond").textContent = words(c.weather_code);
  $("temp").textContent = `${Math.round(c.temperature_2m)}°`;

  const hi = Math.round(data.daily.temperature_2m_max[0]);
  const lo = Math.round(data.daily.temperature_2m_min[0]);
  $("hi").textContent = t({ "zh-TW": `最高 ${hi}°`, "zh-CN": `最高 ${hi}°`, en: `High ${hi}°` });
  $("lo").textContent = t({ "zh-TW": `最低 ${lo}°`, "zh-CN": `最低 ${lo}°`, en: `Low ${lo}°` });

  const feels = Math.round(c.apparent_temperature);
  $("feels").textContent = t({ "zh-TW": `體感 ${feels}°`, "zh-CN": `体感 ${feels}°`, en: `Feels ${feels}°` });

  const maxRain = Math.max(0, ...points.map((p) => p.rain));
  $("rainmax").textContent = maxRain >= 10
    ? t({ "zh-TW": `降雨 ${maxRain}%`, "zh-CN": `降水 ${maxRain}%`, en: `Rain ${maxRain}%` })
    : t({ "zh-TW": "沒有雨", "zh-CN": "无降水", en: "Dry" });

  $("stale").textContent = failed ? t({ "zh-TW": "離線", "zh-CN": "离线", en: "offline" }) : "";
  updateAgo();

  requestAnimationFrame(() => { draw(); paint(); });
}

$("retry").textContent = t({ "zh-TW": "重試", "zh-CN": "重试", en: "Retry" });
$("retry").onclick = () => {
  showMessage(t({ "zh-TW": "正在取得天氣…", "zh-CN": "正在获取天气…", en: "Loading…" }), false);
  refresh();
};

let busy = false;
$("rf").title = t({ "zh-TW": "立即更新", "zh-CN": "立即刷新", en: "Refresh now" });
$("rf").onclick = async () => {
  if (busy) return;
  busy = true;
  const b = $("rf");
  b.classList.add("busy");
  await refresh();
  b.classList.remove("busy");
  busy = false;
  updateAgo();
};

const chart = $("chart");
chart.addEventListener("pointermove", (e) => {
  if (!points.length || !geo.step) return;
  const box = chart.getBoundingClientRect();
  const i = Math.round((e.clientX - box.left - geo.padX) / geo.step);
  if (i !== selected) select(i);
});
chart.addEventListener("pointerleave", () => select(0));

new ResizeObserver(() => {
  if (points.length) { draw(); paint(); }
}).observe(chart);

widget.settings.onChange((s) => { opts = s; refresh(); });
widget.appearance.onChange(() => { if (data) render(); });

(async () => {
  data = await widget.storage.get("last");
  if (data && data.unit !== opts.unit) data = null;
  if (data) render();
  else showMessage(t({ "zh-TW": "正在取得天氣…", "zh-CN": "正在获取天气…", en: "Loading…" }), false);
  if (!data || Date.now() - data.at > REFRESH) await refresh();
  setInterval(refresh, REFRESH);
  setInterval(updateAgo, 20e3);
})();
