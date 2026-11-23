/* 天气 · 卡片
 * 实况 / 逐小时 / 高低温：open-meteo
 * 风向风力 / 空气质量：中国天气网（国内口径，带 Referer）
 */

const $ = (id) => document.getElementById(id);
const HAS_WIDGET = typeof widget !== "undefined";

/* ---------------- 多语言 ----------------
 * widget.t 按 widget.locale 在 { zh-TW, zh-CN, en } 里挑一个，都没有时退回第一个键；
 * 直接在浏览器打开 index.html 调试时没有宿主，这里退回简体。 */
const LOCALE = (HAS_WIDGET && widget.locale) || navigator.language || "zh-CN";
const t = (dict) =>
  HAS_WIDGET && typeof widget.t === "function" ? widget.t(dict) : dict["zh-CN"] || dict.en;

/* 星期按 locale 取（简：周一 / 繁：週一 / 英：Mon），Intl 拿不到时退回中文 */
const WEEKDAY = (() => {
  try {
    const f = new Intl.DateTimeFormat(LOCALE, { weekday: "short" });
    return (dt) => f.format(dt);
  } catch (e) {
    const cn = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    return (dt) => cn[dt.getDay()];
  }
})();
const IS_CJK = /[\u3400-\u9fff]/;

/* ---------------- 天气代码 → 图标与文字 ---------------- */
const CODES = {
  0:  ["clear-day", "clear-night", { "zh-TW": "晴", "zh-CN": "晴", en: "Clear" }],
  1:  ["partly-cloudy-day", "partly-cloudy-night", { "zh-TW": "晴間多雲", "zh-CN": "晴间多云", en: "Mainly clear" }],
  2:  ["partly-cloudy-day", "partly-cloudy-night", { "zh-TW": "多雲", "zh-CN": "多云", en: "Partly cloudy" }],
  3:  ["cloudy", "cloudy", { "zh-TW": "陰", "zh-CN": "阴", en: "Overcast" }],
  45: ["fog-day", "fog-night", { "zh-TW": "霧", "zh-CN": "雾", en: "Fog" }],
  48: ["fog-day", "fog-night", { "zh-TW": "霧凇", "zh-CN": "雾凇", en: "Rime fog" }],
  51: ["drizzle", "drizzle", { "zh-TW": "毛毛雨", "zh-CN": "毛毛雨", en: "Drizzle" }],
  53: ["drizzle", "drizzle", { "zh-TW": "毛毛雨", "zh-CN": "毛毛雨", en: "Drizzle" }],
  55: ["drizzle", "drizzle", { "zh-TW": "濃毛毛雨", "zh-CN": "浓毛毛雨", en: "Heavy drizzle" }],
  56: ["sleet", "sleet", { "zh-TW": "凍毛毛雨", "zh-CN": "冻毛毛雨", en: "Freezing drizzle" }],
  57: ["sleet", "sleet", { "zh-TW": "凍毛毛雨", "zh-CN": "冻毛毛雨", en: "Freezing drizzle" }],
  61: ["rain", "rain", { "zh-TW": "小雨", "zh-CN": "小雨", en: "Light rain" }],
  63: ["rain", "rain", { "zh-TW": "中雨", "zh-CN": "中雨", en: "Moderate rain" }],
  65: ["extreme-rain", "extreme-rain", { "zh-TW": "大雨", "zh-CN": "大雨", en: "Heavy rain" }],
  66: ["sleet", "sleet", { "zh-TW": "凍雨", "zh-CN": "冻雨", en: "Freezing rain" }],
  67: ["sleet", "sleet", { "zh-TW": "凍雨", "zh-CN": "冻雨", en: "Freezing rain" }],
  71: ["snow", "snow", { "zh-TW": "小雪", "zh-CN": "小雪", en: "Light snow" }],
  73: ["snow", "snow", { "zh-TW": "中雪", "zh-CN": "中雪", en: "Moderate snow" }],
  75: ["extreme-snow", "extreme-snow", { "zh-TW": "大雪", "zh-CN": "大雪", en: "Heavy snow" }],
  77: ["snow", "snow", { "zh-TW": "米雪", "zh-CN": "米雪", en: "Snow grains" }],
  80: ["partly-cloudy-day-rain", "partly-cloudy-night-rain", { "zh-TW": "陣雨", "zh-CN": "阵雨", en: "Showers" }],
  81: ["partly-cloudy-day-rain", "partly-cloudy-night-rain", { "zh-TW": "陣雨", "zh-CN": "阵雨", en: "Showers" }],
  82: ["overcast-rain", "overcast-rain", { "zh-TW": "強陣雨", "zh-CN": "强阵雨", en: "Heavy showers" }],
  85: ["partly-cloudy-day-snow", "partly-cloudy-night", { "zh-TW": "陣雪", "zh-CN": "阵雪", en: "Snow showers" }],
  86: ["partly-cloudy-day-snow", "partly-cloudy-night", { "zh-TW": "強陣雪", "zh-CN": "强阵雪", en: "Heavy snow showers" }],
  95: ["thunderstorms", "thunderstorms", { "zh-TW": "雷陣雨", "zh-CN": "雷阵雨", en: "Thunderstorm" }],
  96: ["thunderstorms-rain", "thunderstorms-rain", { "zh-TW": "雷陣雨伴冰雹", "zh-CN": "雷阵雨伴冰雹", en: "Thunderstorm, hail" }],
  99: ["thunderstorms-rain", "thunderstorms-rain", { "zh-TW": "強雷雨伴冰雹", "zh-CN": "强雷雨伴冰雹", en: "Severe storm, hail" }],
};

const desc = (code, isDay) => {
  const row = CODES[code] || ["cloudy", "cloudy", { "zh-TW": "多雲", "zh-CN": "多云", en: "Cloudy" }];
  return { icon: isDay ? row[0] : row[1], text: t(row[2]) };
};

/* ---------------- 小工具 ---------------- */
const round = (v) => (v == null || Number.isNaN(v) ? "—" : Math.round(v));
const pad2 = (n) => String(n).padStart(2, "0");
const hhmm = (ts) => {
  const t = new Date(ts);
  return pad2(t.getHours()) + ":" + pad2(t.getMinutes());
};

/* 大图标外圈的柔光颜色（r,g,b），按天气取色，写进 .heroWrap 的 --glow */
const GLOWS = [
  [/^clear-day$/, "255, 193, 94"],
  [/^clear-night$/, "150, 160, 255"],
  [/thunder/, "162, 142, 255"],
  [/snow|sleet/, "186, 224, 255"],
  [/rain|drizzle/, "96, 168, 255"],
  [/^fog/, "170, 186, 205"],
  [/partly-cloudy-day/, "255, 214, 156"],
  [/night/, "138, 152, 240"],
  [/cloudy|overcast/, "176, 192, 212"],
];
const glowFor = (icon) => (GLOWS.find(([re]) => re.test(icon)) || [null, "120, 175, 255"])[1];

/* 空气质量：徽章上只放短词（优/良/中/差），完整等级名放 title */
const AIR_SHORT = {
  good: { "zh-TW": "優", "zh-CN": "优", en: "Good" },
  ok: { "zh-TW": "良", "zh-CN": "良", en: "Fair" },
  mid: { "zh-TW": "中", "zh-CN": "中", en: "Poor" },
  bad: { "zh-TW": "差", "zh-CN": "差", en: "Bad" },
};
const AIR_FULL = {
  good: { "zh-TW": "優", "zh-CN": "优", en: "Excellent" },
  ok: { "zh-TW": "良", "zh-CN": "良", en: "Good" },
  light: { "zh-TW": "輕度污染", "zh-CN": "轻度污染", en: "Lightly polluted" },
  moderate: { "zh-TW": "中度污染", "zh-CN": "中度污染", en: "Moderately polluted" },
  heavy: { "zh-TW": "重度污染", "zh-CN": "重度污染", en: "Heavily polluted" },
  severe: { "zh-TW": "嚴重污染", "zh-CN": "严重污染", en: "Severely polluted" },
};
/* 阈值 → [样式, 徽章短词, 完整等级] */
const AIR_TABLE = [
  [300, "lv-bad", "bad", "severe"],
  [200, "lv-bad", "bad", "heavy"],
  [150, "lv-bad", "bad", "moderate"],
  [100, "lv-mid", "mid", "light"],
  [50, "lv-ok", "ok", "ok"],
];

function aqiLevel(aqi) {
  if (aqi == null) {
    return { short: "—", full: t({ "zh-TW": "空氣品質", "zh-CN": "空气质量", en: "Air quality" }), value: "—", cls: "" };
  }
  const a = Number(aqi);
  const row = AIR_TABLE.find(([min]) => a > min) || [0, "lv-good", "good", "good"];
  return { short: t(AIR_SHORT[row[2]]), full: t(AIR_FULL[row[3]]), value: String(Math.round(a)), cls: row[1] };
}

/* 风向：接口给的是中文（「东北风」），按 8 向换成当前语言 */
const WIND8 = [
  { "zh-TW": "北風", "zh-CN": "北风", en: "N" },
  { "zh-TW": "東北風", "zh-CN": "东北风", en: "NE" },
  { "zh-TW": "東風", "zh-CN": "东风", en: "E" },
  { "zh-TW": "東南風", "zh-CN": "东南风", en: "SE" },
  { "zh-TW": "南風", "zh-CN": "南风", en: "S" },
  { "zh-TW": "西南風", "zh-CN": "西南风", en: "SW" },
  { "zh-TW": "西風", "zh-CN": "西风", en: "W" },
  { "zh-TW": "西北風", "zh-CN": "西北风", en: "NW" },
];
const WIND8_ZH = WIND8.map((d) => d["zh-CN"]);
const windFromDeg = (deg) => (deg == null ? "" : t(WIND8[Math.round((deg % 360) / 45) % 8]));
const windDirText = (wd) => {
  const s = String(wd || "").trim();
  const i = WIND8_ZH.indexOf(s);
  return i >= 0 ? t(WIND8[i]) : s;   // 「微风」之类少见的写法保持原样
};

/* 风力：接口给「2级」/「<3级」，没给就按 km/h 折成蒲福风级 */
const LV_UNIT = { "zh-TW": "級", "zh-CN": "级", en: " Bft" };
const LV_CALM = { "zh-TW": "微風", "zh-CN": "微风", en: "Light air" };
function beaufort(kmh) {
  if (kmh == null) return "";
  const step = [1, 5, 11, 19, 28, 38, 49, 61, 74, 88, 102, 117];
  let i = 0;
  while (i < step.length && kmh >= step[i]) i++;
  return i + t(LV_UNIT);
}
function windLevelText(ws, kmh) {
  const s = String(ws || "").trim();
  if (s) {
    const m = s.match(/^([<≤]?)\s*(\d+)\s*级?$/);
    if (m) return (m[1] ? "≤" : "") + m[2] + t(LV_UNIT);
    return /微风/.test(s) ? t(LV_CALM) : s;
  }
  return beaufort(kmh);
}

/* ---------------- 界面文字 ----------------
 * index.html 里写的是简体（方便直接打开看效果），运行时按语言覆盖一遍。 */
const K_MAX = { "zh-TW": "最高", "zh-CN": "最高", en: "H" };
const K_MIN = { "zh-TW": "最低", "zh-CN": "最低", en: "L" };
const K_POP = { "zh-TW": "降雨機率", "zh-CN": "降水概率", en: "Rain" };
const K_FEELS = { "zh-TW": "體感", "zh-CN": "体感", en: "Feels" };
const K_HUM = { "zh-TW": "濕度", "zh-CN": "湿度", en: "Humidity" };
const K_AIR = { "zh-TW": "空氣品質", "zh-CN": "空气质量", en: "Air quality" };
const PH_CITY = { "zh-TW": "輸入城市名，如 濱州", "zh-CN": "输入城市名，如 滨州", en: "City name, e.g. Binzhou" };
const ARIA_CLOSE = { "zh-TW": "關閉", "zh-CN": "关闭", en: "Close" };
const PICK_EMPTY = { "zh-TW": "沒有符合的城市，換個寫法試試", "zh-CN": "没有匹配的城市，换个写法试试", en: "No match — try another spelling" };
const HERE = { "zh-TW": "當前位置", "zh-CN": "当前位置", en: "Current location" };
const POP_TITLE = { "zh-TW": "今日降雨機率", "zh-CN": "今日降水概率", en: "Chance of rain today" };

function paintChrome() {
  document.documentElement.lang = LOCALE;
  const put = (id, dict) => { const el = $(id); if (el) el.textContent = t(dict); };
  put("kMax", K_MAX);
  put("kMin", K_MIN);
  put("kPop", K_POP);
  put("kFeels", K_FEELS);
  put("kHum", K_HUM);
  put("airLabel", K_AIR);
  const q = $("pq");
  if (q) q.placeholder = t(PH_CITY);
  const c = $("pclose");
  if (c) c.setAttribute("aria-label", t(ARIA_CLOSE));
}

/* ---------------- 数据 ---------------- */
/* 地名容错：open-meteo 的中文库并不统一（有「济南」却没有「济南市」，有「滨州市」却没有「滨州」），
   所以同一个地方要试几种写法，再把命中结果按城市等级/人口排个序。 */
const stripSuffix = (s) => String(s || "").trim().replace(/(市|縣|县|區|区)$/, "");

function cityVariants(city) {
  const raw = String(city || "").trim();
  const bare = stripSuffix(raw);
  const list = [raw, bare, bare + "市", raw + "市"];
  return [...new Set(list)].filter(Boolean);
}

function scoreHit(h, want) {
  const name = h.name || "";
  const bare = stripSuffix(want);
  let s = 0;
  if (name === want) s += 100;
  else if (name === bare || name === bare + "市") s += 90;
  else if (name.startsWith(bare)) s += 60;
  else if (name.includes(bare)) s += 25;
  if (h.country_code === "CN") s += 30;
  if (/^PPLA[1-5]?$/.test(h.feature_code || "")) s += 14;   // 省会 / 地级市
  if (h.admin1) s += 3;
  if (h.population) s += Math.min(18, Math.log10(h.population) * 2.5);
  return s;
}

async function searchPlaces(q, count) {
  const r = await widget.fetch(
    "https://geocoding-api.open-meteo.com/v1/search?name=" + encodeURIComponent(q) +
      "&count=" + (count || 8) + "&language=zh&format=json"
  );
  const data = await r.json();
  return data.results || [];
}

async function geocode(city) {
  const key = "geo:" + stripSuffix(city);
  const cached = await widget.storage.get(key);
  if (cached && cached.at && Date.now() - cached.at < 7 * 86400000) return cached.value;

  let best = null;
  let bestScore = -1;
  let lastErr = null;
  for (const q of cityVariants(city)) {
    let hits = [];
    try {
      hits = await searchPlaces(q, 10);
    } catch (e) {
      lastErr = e;
      continue;
    }
    for (const h of hits) {
      const s = scoreHit(h, city);
      if (s > bestScore) { bestScore = s; best = h; }
    }
    if (bestScore >= 100) break;   // 名字完全一致就不用再试别的写法
  }
  if (!best) throw lastErr || new Error("找不到城市：" + city);

  const value = { lat: best.latitude, lon: best.longitude, name: best.name, admin1: best.admin1 || "" };
  await widget.storage.set(key, { at: Date.now(), value });
  return value;
}

async function fetchForecast(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    "&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,is_day" +
    "&hourly=temperature_2m,weather_code,precipitation_probability" +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
    "&timezone=auto&forecast_days=7";
  const r = await widget.fetch(url);
  if (!r.ok) throw new Error("天气接口 " + r.status);
  return r.json();
}


/* 中国天气网：风力等级与空气质量 */
async function chinaStation(city) {
  const codeKey = "code:" + city;
  let code = await widget.storage.get(codeKey);
  const headers = { Referer: "http://www.weather.com.cn/", "User-Agent": "Mozilla/5.0" };

  if (!code) {
    const table = window.CITY_CODES || {};
    const plain = city.replace(/市$/, "");
    if (table[plain]) code = table[plain];
  }

  if (!code) {
    const candidates = [city, city.replace(/市$/, ""), city + "市"];
    for (const name of candidates) {
      let list = [];
      try {
        const res = await widget.fetch(
          "https://toy1.weather.com.cn/search?cityname=" + encodeURIComponent(name),
          { headers }
        );
        const raw = (await res.text()).replace(/^[^(]*\(/, "").replace(/\)\s*$/, "").trim();
        if (!raw) continue;
        list = JSON.parse(raw) || [];
      } catch (e) {
        continue;
      }
      const hit = list.find((x) => /^101\d{6}$/.test((x.ref || "").split("~")[0]));
      if (hit) {
        code = hit.ref.split("~")[0];
        break;
      }
    }
    code = code || "";
    await widget.storage.set(codeKey, code);
    if (!code) return null;
  }

  const r = await widget.fetch(`https://d1.weather.com.cn/sk_2d/${code}.html`, { headers });
  const m = (await r.text()).match(/\{[\s\S]*\}/);
  if (!m) return null;
  const d = JSON.parse(m[0]);
  const aqi = Number(d.aqi);
  return {
    wd: d.WD || "",
    ws: d.WS || "",
    sd: d.SD ? parseInt(d.SD, 10) : null,
    // 接口空值时 aqi 可能是 "--" / 空串，Number 得到 NaN，直接显示会变 NaN
    aqi: d.aqi && Number.isFinite(aqi) && aqi >= 0 ? aqi : null,
  };
}

/* ---------------- 渲染 ---------------- */
const TODAY = { "zh-TW": "今天", "zh-CN": "今天", en: "Today" };
const TODAY_S = { "zh-TW": "今", "zh-CN": "今", en: "Today" };

/* 一天的名字：长（周一 / Mon）给正常宽度，短（一 / Mon）给极窄卡片 */
function dayName(dt, i) {
  if (i === 0) return { long: t(TODAY), short: t(TODAY_S) };
  const long = WEEKDAY(dt);
  return { long, short: IS_CJK.test(long) ? long.slice(-1) : long };
}

function renderWeek(fc) {
  const wrap = $("week");
  const d = fc.daily || {};
  const days = d.time || [];
  const maxs = d.temperature_2m_max || [];
  const mins = d.temperature_2m_min || [];
  const codes = d.weather_code || [];
  if (!days.length) { wrap.innerHTML = ""; return; }

  const lo = Math.min(...mins);
  const hi = Math.max(...maxs);
  const span = Math.max(1, hi - lo);

  wrap.innerHTML = "";
  for (let i = 0; i < days.length && i < 7; i++) {
    const dt = new Date(days[i] + "T12:00:00");
    const nm = dayName(dt, i);
    const ic = desc(codes[i], 1);
    const a = Math.round(((mins[i] - lo) / span) * 100);
    const b = Math.max(a + 14, Math.round(((maxs[i] - lo) / span) * 100));
    const el = document.createElement("div");
    el.className = "day" + (i === 0 ? " is-today" : "");
    el.title = `${ic.text} ${round(mins[i])}° ~ ${round(maxs[i])}°`;
    el.innerHTML =
      `<span class="dn"><i class="lg">${nm.long}</i><i class="sm">${nm.short}</i></span>` +
      `<img src="assets/${ic.icon}.svg" alt="${ic.text}">` +
      `<span class="dh">${round(maxs[i])}<i>°</i></span>` +
      `<span class="bar"><i style="--a:${a}%;--b:${b}%"></i></span>` +
      `<span class="dl">${round(mins[i])}<i>°</i></span>`;
    wrap.appendChild(el);
  }
}

function render(state, settings) {
  const { geo, fc, sk } = state;
  const cur = fc.current;
  const isDay = cur.is_day == null ? 1 : cur.is_day;
  const info = desc(cur.weather_code, isDay);

  const custom = ((settings && settings.place) || "").trim();
  const gname = (geo.name || "").trim();
  const disp = !gname ? "" : /(市|縣|县|区|區|州|盟)$/.test(gname) ? gname : gname + "市";
  $("place").textContent = custom || disp || t(HERE);
  const tm = hhmm(state.at || Date.now());
  $("updated").textContent = t({ "zh-TW": tm + " 更新", "zh-CN": tm + " 更新", en: "Updated " + tm });

  $("cond").textContent = info.text;
  const icon = $("icon");
  icon.src = "assets/" + info.icon + ".svg";
  icon.alt = info.text;
  const wrap = $("iconWrap");
  if (wrap) wrap.style.setProperty("--glow", glowFor(info.icon));
  $("temp").textContent = round(cur.temperature_2m);

  const d = fc.daily || {};
  $("tmax").textContent = d.temperature_2m_max ? round(d.temperature_2m_max[0]) : "—";
  $("tmin").textContent = d.temperature_2m_min ? round(d.temperature_2m_min[0]) : "—";

  /* 降水概率：优先取日级最大值，缺字段时用今天逐小时的最大值兜底 */
  const popEl = $("pop");
  let pop = d.precipitation_probability_max ? d.precipitation_probability_max[0] : null;
  if (pop == null) {
    const hourly = fc.hourly || {};
    const today = (d.time && d.time[0]) || "";
    const probs = (hourly.time || [])
      .map((t, i) => (t.slice(0, 10) === today ? hourly.precipitation_probability[i] : null))
      .filter((v) => v != null);
    pop = probs.length ? Math.max(...probs) : null;
  }
  if (pop == null) {
    popEl.classList.add("is-off");
  } else {
    popEl.classList.remove("is-off");
    $("popValue").textContent = Math.round(pop) + "%";
  }
  popEl.title = pop == null ? "" : t(POP_TITLE);

  $("feels").textContent = round(cur.apparent_temperature) + "°C";
  const hum = sk && sk.sd != null ? sk.sd : round(cur.relative_humidity_2m);
  $("hum").textContent = hum + "%";
  $("windDir").textContent = windDirText(sk && sk.wd) || windFromDeg(cur.wind_direction_10m) || "—";
  $("windLevel").textContent = windLevelText(sk && sk.ws, cur.wind_speed_10m) || "—";

  /* 空气质量：数值 + 优良中差 */
  const airV = $("airValue");
  const airL = $("airLevel");
  const air = aqiLevel(sk && sk.aqi != null ? sk.aqi : null);
  airV.className = "v " + air.cls;
  airV.textContent = air.value;
  airV.title = air.full;
  airL.className = "lv " + air.cls;
  airL.textContent = air.short;
  airL.title = air.full;

  renderWeek(fc);
}

/* ---------------- 切换城市面板 ---------------- */
const CITY_NAMES = Object.keys(window.CITY_CODES || {});
const QUICK = ["北京", "上海", "广州", "深圳", "成都", "杭州", "武汉", "西安"];
const pickerEl = $("picker");
const pqEl = $("pq");
const plistEl = $("plist");

let pickRows = [];
let pickIdx = -1;
let remoteSeq = 0;
let remoteTimer = null;

function nameScore(name, q) {
  if (!q) return 0;
  if (name === q) return 100;
  if (name.startsWith(q)) return 80 - Math.min(20, name.length - q.length);
  const i = name.indexOf(q);
  return i >= 0 ? 40 - i : -1;
}

function localHits(q) {
  const bare = stripSuffix(q);
  const scored = [];
  for (const n of CITY_NAMES) {
    const s = Math.max(nameScore(n, q), nameScore(n, bare));
    if (s > 0) scored.push([n, s]);
  }
  scored.sort((a, b) => b[1] - a[1] || a[0].length - b[0].length || a[0].localeCompare(b[0], "zh"));
  return scored.slice(0, 8).map(([n]) => ({ name: n + "市", admin1: "" }));
}

function drawPick(rows) {
  pickRows = rows;
  pickIdx = rows.length ? 0 : -1;
  plistEl.innerHTML = "";
  if (!rows.length) {
    const d = document.createElement("div");
    d.className = "pempty";
    d.textContent = t(PICK_EMPTY);
    plistEl.appendChild(d);
    return;
  }
  rows.forEach((r, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "prow" + (i === pickIdx ? " on" : "");
    const nm = document.createElement("span");
    nm.className = "nm";
    nm.textContent = r.name;
    b.appendChild(nm);
    if (r.admin1) {
      const ad = document.createElement("span");
      ad.className = "ad";
      ad.textContent = r.admin1;
      b.appendChild(ad);
    }
    b.addEventListener("click", () => applyPick(r.place || r.name));
    plistEl.appendChild(b);
  });
}

function markPick() {
  [...plistEl.querySelectorAll(".prow")].forEach((el, i) => {
    el.classList.toggle("on", i === pickIdx);
    if (i === pickIdx) el.scrollIntoView({ block: "nearest" });
  });
}

function openPicker() {
  if (!HAS_WIDGET) return;
  pickerEl.hidden = false;
  pqEl.value = "";
  drawPick(QUICK.filter((n) => CITY_NAMES.includes(n)).map((n) => ({ name: n + "市" })));
  pqEl.focus();
}

function closePicker() {
  pickerEl.hidden = true;
  clearTimeout(remoteTimer);
  remoteSeq++;
}

async function applyPick(name) {
  const bare = stripSuffix(name);
  closePicker();
  quiet = true;                       // 下面可能要写两三个设置，先别让 onChange 连环刷新
  try {
    if (CITY_NAMES.includes(bare)) {
      await widget.settings.set("city", bare);
      if ((widget.settings.get("cityText") || "").trim()) await widget.settings.set("cityText", "");
    } else {
      // 不在 375 城的下拉里（县级市、乡镇等），走「自定义城市」，否则控制中心的下拉会变成空值
      await widget.settings.set("cityText", bare);
    }
    if ((widget.settings.get("place") || "").trim()) await widget.settings.set("place", "");
  } finally {
    quiet = false;                    // 写入失败也要恢复，否则以后设置变化全被吞掉
  }
  refresh();
  schedule();
}

if (HAS_WIDGET) {
  pqEl.addEventListener("input", () => {
    const q = pqEl.value.trim();
    drawPick(q ? localHits(q) : QUICK.filter((n) => CITY_NAMES.includes(n)).map((n) => ({ name: n + "市" })));
    clearTimeout(remoteTimer);
    remoteSeq++;
    if (!q) return;
    const seq = remoteSeq;
    remoteTimer = setTimeout(async () => {
      try {
        const hits = await searchPlaces(stripSuffix(q) || q, 8);
        if (seq !== remoteSeq) return;
        const seen = new Set(pickRows.map((r) => stripSuffix(r.name)));
        const extra = [];
        for (const h of hits) {
          const nm = h.name || "";
          if (!nm || seen.has(stripSuffix(nm))) continue;
          if (h.country_code && h.country_code !== "CN") continue;
          seen.add(stripSuffix(nm));
          extra.push({ name: nm, admin1: h.admin1 || "", place: nm });
        }
        if (extra.length) drawPick(pickRows.concat(extra).slice(0, 12));
      } catch (e) {
        /* 联网失败就只用本地城市表的结果 */
      }
    }, 280);
  });

  pqEl.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closePicker(); return; }
    if (e.key === "Enter") {
      e.preventDefault();
      const r = pickRows[pickIdx];
      if (r) applyPick(r.place || r.name);
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!pickRows.length) return;
      pickIdx = (pickIdx + (e.key === "ArrowDown" ? 1 : -1) + pickRows.length) % pickRows.length;
      markPick();
    }
  });

  $("pclose").addEventListener("click", (e) => { e.stopPropagation(); closePicker(); });
}

/* ---------------- 刷新 ---------------- */
function showHint(text) {
  $("cond").textContent = text;
  ["temp", "tmax", "tmin", "feels", "hum", "windLevel", "airValue", "airLevel", "popValue"].forEach((id) => {
    const el = $(id);
    if (el) el.textContent = "—";
  });
  $("week").innerHTML = "";
}

let permTries = 0;
let quiet = false;      // 面板里连续写设置时压住 onChange 的自动刷新
let lastSettings = null;

async function refresh() {
  const settings = widget.settings.get();
  let city = (settings.cityText || "").trim() || (settings.city || "").trim();
  if (!city) {
    // 没设城市时沿用上次缓存里的城市，不要莫名其妙跳回默认值
    const cached = await widget.storage.get("cache");
    city = (cached && cached.geo && cached.geo.name) || "深圳";
  }
  try {
    const geo = await geocode(city);
    const fc = await fetchForecast(geo.lat, geo.lon);
    let sk = null;
    try {
      sk = await chinaStation(geo.name || city);
    } catch (e) {
      widget.log("中国天气网失败", { message: String(e) });
    }
    permTries = 0;
    render({ geo, fc, sk }, settings);
    await widget.storage.set("cache", { at: Date.now(), geo, fc, sk });
  } catch (err) {
    widget.log("天气刷新失败", { message: String(err) });
    const cached = await widget.storage.get("cache");
    if (cached && cached.fc) { render(cached, settings); return; }
    if (/permission/i.test(String(err))) {
      showHint(t({ "zh-TW": "需在控制中心允許連網", "zh-CN": "需在控制中心允许联网", en: "Allow network access" }));
      // 允许之后不必等下一次定时刷新
      if (permTries++ < 8) setTimeout(refresh, 30000);
    } else if (/找不到城市/.test(String(err))) {
      showHint(t({ "zh-TW": "找不到這個城市", "zh-CN": "找不到这个城市", en: "City not found" }));
    } else {
      showHint(t({ "zh-TW": "暫時取不到天氣資料", "zh-CN": "暂时取不到天气数据", en: "Weather unavailable" }));
    }
  }
}

/* ---------------- 启动 ---------------- */
let timer = null;

function schedule() {
  clearTimeout(timer);
  const minutes = Number(widget.settings.get("refresh")) || 10;
  timer = setTimeout(async () => {
    await refresh();
    schedule();
  }, minutes * 60000);
}

async function boot() {
  paintChrome();
  const settings = widget.settings.get();
  const cached = await widget.storage.get("cache");
  if (cached && cached.fc) {
    try { render(cached, settings); } catch (e) { /* 旧缓存格式忽略 */ }
  }
  refresh();
  schedule();

  lastSettings = widget.settings.get();
  widget.settings.onChange((s) => {
    if (quiet) return;
    // 设置里换了下拉城市，就清掉「自定义城市」，否则它会一直盖住下拉的选择
    if (lastSettings && s.city !== lastSettings.city && (s.cityText || "").trim()) {
      widget.settings.set("cityText", "");
      return;
    }
    lastSettings = s;
    refresh();
    schedule();
  });
  document.querySelector(".top").addEventListener("click", openPicker);
  $("updated").addEventListener("click", (e) => { e.stopPropagation(); refresh(); });
}

if (HAS_WIDGET) {
  boot();
} else {
  /* 直接在浏览器打开 index.html 时的预览数据（不参与组件运行） */
  const mock = () => {
    const times = [], temps = [], codes = [];
    const t0 = new Date();
    t0.setHours(0, 0, 0, 0);
    for (let i = 0; i < 48; i++) {
      const d = new Date(t0.getTime() + i * 3600000);
      const h = d.getHours();
      times.push(`${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(h)}:00`);
      temps.push(+(26 + 5 * Math.sin(((h - 9) / 24) * Math.PI * 2)).toFixed(1));
      codes.push(h >= 6 && h < 19 ? (h > 15 ? 1 : 2) : 2);
    }
    const dtime = [], dmax = [], dmin = [], dcode = [], dpop = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(t0.getTime() + i * 86400000);
      dtime.push(d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate()));
      dmax.push(31 - i);
      dmin.push(24 - i);
      dcode.push([2, 3, 61, 1, 2, 0, 80][i]);
      dpop.push([20, 10, 85, 60, 30, 5, 70][i]);
    }
    return {
      geo: { name: "深圳", lat: 22.54, lon: 114.06 },
      fc: {
        current: {
          temperature_2m: 26.4, apparent_temperature: 28.1, relative_humidity_2m: 68,
          weather_code: 2, wind_speed_10m: 9, wind_direction_10m: 135, is_day: 1,
        },
        hourly: { time: times, temperature_2m: temps, weather_code: codes },
        daily: {
          time: dtime, temperature_2m_max: dmax, temperature_2m_min: dmin,
          weather_code: dcode, precipitation_probability_max: dpop,
        },
      },
      sk: { wd: "东南风", ws: "2级", sd: 68, aqi: 32 },
    };
  };
  paintChrome();
  render(window.__CACHE__ || mock(), { place: "" });
}
