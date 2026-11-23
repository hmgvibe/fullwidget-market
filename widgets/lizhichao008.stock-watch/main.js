/* ---------------------------------------------------------------- 多语言
   widget.t(三语对象) 由平台按 widget.locale 选词；控制中心表单文案在 widget.json
   里用同样的 zh-TW / zh-CN / en 结构给出。所有界面文案集中在这里，方便校对。 */
const I18N = {
  edit:          { "zh-TW": "編輯", "zh-CN": "编辑", en: "Edit" },
  done:          { "zh-TW": "完成", "zh-CN": "完成", en: "Done" },
  addStock:      { "zh-TW": "＋ 新增股票", "zh-CN": "＋ 新增股票", en: "+ Add stock" },
  hintIdle:      { "zh-TW": "按住拖動排序 · 點 − 移除", "zh-CN": "按住拖动排序 · 点 − 移除", en: "Drag to reorder · tap − to remove" },
  hintDrop:      { "zh-TW": "鬆手完成排序", "zh-CN": "松手完成排序", en: "Release to reorder" },
  remove:        { "zh-TW": "移除", "zh-CN": "移除", en: "Remove" },
  removeTitle:   { "zh-TW": "移除 {name}", "zh-CN": "移除 {name}", en: "Remove {name}" },
  mktSh:         { "zh-TW": "滬", "zh-CN": "沪", en: "SH" },
  mktSz:         { "zh-TW": "深", "zh-CN": "深", en: "SZ" },
  mktBj:         { "zh-TW": "京", "zh-CN": "京", en: "BJ" },
  mktShTitle:    { "zh-TW": "滬市 · 上證", "zh-CN": "沪市 · 上证", en: "Shanghai Stock Exchange" },
  mktSzTitle:    { "zh-TW": "深市 · 深證", "zh-CN": "深市 · 深证", en: "Shenzhen Stock Exchange" },
  mktBjTitle:    { "zh-TW": "北交所", "zh-CN": "北交所", en: "Beijing Stock Exchange" },
  mktIdx:        { "zh-TW": "指數", "zh-CN": "指数", en: "IDX" },
  mktIdxTitle:   { "zh-TW": "市場指數 · 上證 / 深證 / 北證", "zh-CN": "市场指数 · 上证 / 深证 / 北证", en: "Market index" },
  mktHk:         { "zh-TW": "港", "zh-CN": "港", en: "HK" },
  mktUs:         { "zh-TW": "美", "zh-CN": "美", en: "US" },
  mktFut:        { "zh-TW": "期", "zh-CN": "期", en: "FUT" },
  mktFx:         { "zh-TW": "匯", "zh-CN": "汇", en: "FX" },
  mktBond:       { "zh-TW": "債", "zh-CN": "债", en: "BND" },
  mktBlock:      { "zh-TW": "板", "zh-CN": "板", en: "SEC" },
  mktGlobal:     { "zh-TW": "全球", "zh-CN": "全球", en: "GLB" },
  mktFund:       { "zh-TW": "基", "zh-CN": "基", en: "FD" },
  mktOtc:        { "zh-TW": "外", "zh-CN": "外", en: "OTC" },
  mktHkTitle:    { "zh-TW": "港股", "zh-CN": "港股", en: "Hong Kong stocks" },
  mktUsTitle:    { "zh-TW": "美股", "zh-CN": "美股", en: "US stocks" },
  mktFutTitle:   { "zh-TW": "期貨", "zh-CN": "期货", en: "Futures" },
  mktFxTitle:    { "zh-TW": "外匯", "zh-CN": "外汇", en: "Foreign exchange" },
  mktBondTitle:  { "zh-TW": "債券", "zh-CN": "债券", en: "Bonds" },
  mktBlockTitle: { "zh-TW": "板塊", "zh-CN": "板块", en: "Sector" },
  mktGlobalTitle:{ "zh-TW": "全球指數", "zh-CN": "全球指数", en: "Global index" },
  mktFundTitle:  { "zh-TW": "基金", "zh-CN": "基金", en: "Fund" },
  mktOtcTitle:   { "zh-TW": "境外 / 其它市場", "zh-CN": "境外 / 其它市场", en: "Overseas / other market" },
  searchPh:      { "zh-TW": "代碼 / 簡稱 / 拼音首字母", "zh-CN": "代码 / 简称 / 拼音首字母", en: "Code / name / initials" },
  backTitle:     { "zh-TW": "返回 (Esc)", "zh-CN": "返回 (Esc)", en: "Back (Esc)" },
  noMatch:       { "zh-TW": "找不到符合的證券或品種", "zh-CN": "没有找到匹配的证券或品种", en: "No matching instruments" },
  added:         { "zh-TW": "✓ 已加入", "zh-CN": "✓ 已添加", en: "✓ Added" },
  toAdd:         { "zh-TW": "＋ 加入", "zh-CN": "＋ 添加", en: "+ Add" },
  searching:     { "zh-TW": "搜尋中…", "zh-CN": "正在搜索…", en: "Searching…" },
  localResults:  { "zh-TW": "本機快取結果", "zh-CN": "本地缓存结果", en: "Cached results" },
  resultFoot:    { "zh-TW": "共 {n} 條{scroll} · 點擊加入 / 移除 · Esc 返回", "zh-CN": "共 {n} 条{scroll} · 点击添加 / 移除 · Esc 返回", en: "{n} result(s){scroll} · click to add / remove · Esc to go back" },
  scrollHint:    { "zh-TW": " · 可捲動", "zh-CN": " · 可滚动", en: " · scroll" },
  tryAgain:      { "zh-TW": "試試代碼、簡稱或拼音首字母，例如 AAPL、騰訊", "zh-CN": "试试代码、简称或拼音首字母，例如 AAPL、腾讯", en: "Try a code, name or initials (e.g. AAPL)" },
  searchError:   { "zh-TW": "搜尋失敗，請檢查網路或權限", "zh-CN": "搜索失败，请检查网络或权限", en: "Search failed — check network or permissions" },
  offline:       { "zh-TW": "離線結果（網路不可用）", "zh-CN": "离线结果（网络不可用）", en: "Offline results" },
  emptyQuery:    { "zh-TW": "輸入代碼 / 簡稱 / 拼音首字母", "zh-CN": "输入代码 / 简称 / 拼音首字母", en: "Enter a code, name or initials" },
  example:       { "zh-TW": "例如 600519、茅台、GZMT、AAPL", "zh-CN": "例如 600519、茅台、GZMT、AAPL", en: "e.g. 600519, GZMT or AAPL" },
  limitReached:  { "zh-TW": "最多 {n} 隻，請先移除一隻", "zh-CN": "最多 {n} 只，请先移除一只", en: "Up to {n} stocks — remove one first" },
  noStocks:      { "zh-TW": "還沒有自選股", "zh-CN": "还没有自选股", en: "No stocks yet" },
  noStocksSub:   { "zh-TW": "點「編輯」→「＋ 新增股票」\n也可以在控制中心搜尋", "zh-CN": "点「编辑」→「＋ 新增股票」\n也可以在控制中心搜索", en: "Click Edit → + Add stock\nor search from Control Center" },
  quoteError:    { "zh-TW": "行情取得失敗", "zh-CN": "行情获取失败", en: "Couldn't load quotes" },
  quoteErrorSub: { "zh-TW": "檢查網路\n或允許元件存取東方財富", "zh-CN": "检查网络\n或允许组件访问东方财富", en: "Check the network\nor allow access to Eastmoney" },
  netOffline:    { "zh-TW": "離線", "zh-CN": "离线", en: "offline" },
  netOfflineTitle:{ "zh-TW": "行情刷新失敗，顯示的是上一次的數據", "zh-CN": "行情刷新失败，显示的是上一次的数据", en: "Refresh failed — showing last data" },
  notFound:      { "zh-TW": "找不到這隻股票", "zh-CN": "找不到这只股票", en: "Not found" },
  notFoundTitle: { "zh-TW": "查無行情：代碼可能輸錯，或該品種暫無數據（{code}）", "zh-CN": "查无行情：代码可能输错，或该品种暂无数据（{code}）", en: "No quotes: wrong code, or no data for this instrument ({code})" },
};
const tx = (key, vars) => {
  let s = widget.t(I18N[key]);
  if (!s) s = I18N[key]["zh-CN"] || I18N[key].en || key;
  if (vars) for (const k of Object.keys(vars)) s = s.split(`{${k}}`).join(vars[k]);
  return s;
};

// 自选股行情组件
// 行情主要走腾讯（批量报价一次拿回整批，分时按市场分流），东财只做兜底；
// 搜索仍用东财联想接口。都由 widget.fetch 代发（不受 CORS 限制）。
// 交易时段按自选股所属市场分别判断，开盘用设定频率刷新，全部休市才降到 5 分钟一次。
// 搜索支持代码、中文简称、拼音首字母，结果点一下即可写回「自选股」设置。

const $ = (id) => document.getElementById(id);
const listEl = $("list");
const editBtn = $("editBtn");
const addBtn = $("addBtn");
const adder = $("adder");
const sortHint = adder.querySelector(".adder-hint");
const hintIdle = tx("hintIdle"); // 拖拽时临时换成「松手完成排序」的对应语言
const searchView = $("searchView");
const searchInput = $("searchInput");
const searchResults = $("searchResults");
const searchFoot = $("searchFoot");
const searchCloseBtn = $("searchClose");
const netBadge = $("netBadge");

// 离线角标：刷新失败、但画面上还留着上一次的行情时挂出来，
// 免得旧价看起来像实时价。正常拉到数据就收回。
function setOffline(on) {
  if (netBadge) {
    netBadge.textContent = tx("netOffline");
    netBadge.title = tx("netOfflineTitle");
    netBadge.hidden = !on;
  }
  document.body.classList.toggle("offline", on);
}

/* 腾讯：批量报价 + 分时。批量是它相对东财最大的优势——一轮 12 只只要 1 个请求。 */
// /utf8/ 前缀必须带：不带的话返回的是 GBK，r.text() 会解成乱码。
const TX_QUOTE_API = "https://sqt.gtimg.cn/utf8/q=";
const TX_MINUTE_API = "https://web.ifzq.gtimg.cn/appstock/app/minute/query";
const TX_US_MINUTE_API = "https://web.ifzq.gtimg.cn/appstock/app/usMinute/query";
const TX_BATCH = 60; // 单批最多塞多少只：URL 别太长，远超 MAX_ROWS 也没意义

/* 东财：只做兜底（腾讯不支持的品种 / 腾讯整体失手时），以及搜索联想。 */
const QUOTE_API = "https://push2his.eastmoney.com/api/qt/stock/get";
const TREND_API = "https://push2his.eastmoney.com/api/qt/stock/trends2/get";
const SUGGEST_API = "https://searchapi.eastmoney.com/api/suggest/get";
const QUOTE_FIELDS = "f43,f57,f58,f59,f60,f169,f170";
const TREND_TTL = 60 * 1000; // 分时线的缓存时间
const MAX_ROWS = 12;
const IDLE_INTERVAL = 5 * 60 * 1000;
const INDEX_KEY = "searchIndex";
const INDEX_LIMIT = 800; // 搜索过的股票留一份本地索引，断网也能查
const SEARCH_DEBOUNCE = 260;

const trendCache = new Map(); // secid -> { ts, points }
let items = [];
let timer = 0;
let busy = false;
let dirty = false; // 刷新途中又改了设置，这一轮结束后立刻再来一次
let failStreak = 0; // 连续整轮失败的次数：用来退避，别一直撞东财的限流

let searchIndex = []; // [{ secid, code, label, name, py, board }]
let searchSeq = 0; // 丢弃过期的搜索结果
let searchTimer = 0;
let searching = false;
let editing = false; // 顶部编辑条展开：逐行删除 / 新增
let lastHits = [];
let lastInfo = { note: "", foot: "" };
let lastExternalQuery = ""; // 控制中心最后一次输入的关键词
let suppressChange = false; // 自己写设置时跳过 onChange

/* ---------------------------------------------------------------- 代码解析 */

function suffixFor(market, digits) {
  if (Number(market) === 1) return "SS";
  return /^[48]/.test(digits) ? "BJ" : "SZ";
}

// "002242.SZ" / "600989.SS" / "sh600519" / "600519" → A 股
// "116.00700"（港股）/ "105.AAPL"（美股）/ "90.BK0475"（板块）→ 直接写东财 secid
// 东财的 secid：1 = 上交所，0 = 深交所 / 北交所，其余是港美期汇等市场的编号
function aShareItem(market, digits) {
  return {
    key: `${market}.${digits}`,
    secid: `${market}.${digits}`,
    code: digits,
    label: `${digits}.${suffixFor(market, digits)}`,
    market,
  };
}

function parseOne(raw) {
  const s = String(raw || "").trim();
  if (!s) return null;

  // A 股：6 位代码，可带 sh/sz/bj/ss 前后缀
  const m = s.match(/^(sh|sz|bj)?(\d{6})(?:[.\-_]?(sh|sz|bj|ss))?$/i);
  if (m) {
    const digits = m[2];
    const tag = (m[3] || m[1] || "").toLowerCase();
    let market;
    if (tag === "sh" || tag === "ss") market = 1;
    else if (tag === "sz" || tag === "bj") market = 0;
    else market = /^[569]/.test(digits) ? 1 : 0; // 6/9 沪市，5 沪基金
    return aShareItem(market, digits);
  }

  // 其它市场：直接给 secid（market.code），code 可以是字母，如 105.AAPL
  const g = s.match(/^(\d{1,3})\.([A-Za-z0-9._-]{1,20})$/);
  if (g) {
    const market = Number(g[1]);
    const code = g[2];
    if ((market === 0 || market === 1) && /^\d{6}$/.test(code)) return aShareItem(market, code);
    return { key: `${market}.${code}`, secid: `${market}.${code}`, code, label: `${market}.${code}`, market };
  }
  return null;
}

function parseStocks(text) {
  const out = [];
  const seen = new Set();
  for (const part of String(text || "").split(/[\s,;，；、]+/)) {
    const item = parseOne(part);
    if (!item || seen.has(item.key)) continue;
    seen.add(item.key);
    out.push(item);
    if (out.length >= MAX_ROWS) break;
  }
  return out;
}

// 搜索结果里的 QuoteID（如 "0.002242" / "116.00700"）转成我们自己的代码格式：
// A 股继续用 600519.SS 这种可读写法，其它市场原样用 secid。
function labelFromSecid(secid) {
  const m = String(secid || "").match(/^(\d{1,3})\.([A-Za-z0-9._-]{1,20})$/);
  if (!m) return null;
  const market = Number(m[1]);
  const code = m[2];
  if ((market === 0 || market === 1) && /^\d{6}$/.test(code)) return `${code}.${suffixFor(market, code)}`;
  return `${market}.${code}`;
}

// 指数没有自己的后缀，用代码段判断：沪市 000xxx、深市 399xxx、北交所 899xxx 是指数，
// 而沪市股票是 6xxxxx、深市股票是 000/002/003/30xxxx，两段互不重叠，不会误判。
function isIndexCode(digits, market) {
  const d = String(digits || "");
  if (Number(market) === 1) return d.startsWith("000");
  if (d.startsWith("899")) return true;
  return d.startsWith("399");
}

// 品种 → 标签。搜索时把东财的 Classify 记进缓存，重启后靠持久化的 searchIndex 恢复；
// 缓存里没有就按市场编号兜底，所以手写 116.00700 也能显示「港」。
const CLASS_TAG = {
  HongKong: "hk",
  HK: "hk",
  HKDerivative: "hk",
  HKSTOCKF: "hk",
  UsStock: "us",
  OTCBB: "us",
  LSE: "otc",
  XETR: "otc",
  SGE: "otc",
  Futures: "fut",
  UniversalFutures: "fut",
  SHFESP: "fut",
  SHFEOPTION: "fut",
  FOREX: "fx",
  FORPM: "fx",
  Bond: "bond",
  BK: "block",
  QQZS: "global",
  NDI: "global",
  UniversalIndex: "global",
  OTCFUND: "fund",
};
const MARKET_TAG = {
  90: "block",
  100: "global",
  105: "us",
  106: "us",
  107: "us",
  113: "fut",
  116: "hk",
  118: "otc",
  119: "fx",
  122: "fx",
  124: "global",
  128: "hk",
  130: "hk",
  139: "hk",
  150: "fund",
  153: "us",
  155: "otc",
  185: "otc",
  251: "global",
};

const classCache = new Map(); // secid -> Classify（来自搜索）

function cachedHit(secid) {
  return classCache.get(secid) || searchIndex.find((x) => x.secid === secid) || null;
}

function marketOf(label) {
  const s = String(label || "");

  // A 股 6 位代码：沿用 沪 / 深 / 京 / 指数
  const m = s.match(/^(\d{6})\.(SS|SZ|BJ)$/i);
  if (m) {
    const market = /^SS$/i.test(m[2]) ? 1 : 0;
    if (isIndexCode(m[1], market)) return TAG.idx;
    return /^SS$/i.test(m[2]) ? TAG.sh : /^BJ$/i.test(m[2]) ? TAG.bj : TAG.sz;
  }

  // 其它市场：先看搜索缓存里的 Classify，再按市场编号兜底
  const g = s.match(/^(\d{1,3})\./);
  const market = g ? Number(g[1]) : NaN;
  const hit = cachedHit(s);
  let kind = (hit && hit.cls && CLASS_TAG[hit.cls]) || MARKET_TAG[market] || "";
  if (!kind && (market === 0 || market === 1)) kind = "stock"; // 手写的 1.600519 之类
  if (kind === "stock") return TAG.sz;
  return TAG[kind] || TAG.otc;
}

const TAG = {
  sh: { cls: "sh", text: tx("mktSh"), title: tx("mktShTitle") },
  sz: { cls: "sz", text: tx("mktSz"), title: tx("mktSzTitle") },
  bj: { cls: "bj", text: tx("mktBj"), title: tx("mktBjTitle") },
  idx: { cls: "idx", text: tx("mktIdx"), title: tx("mktIdxTitle") },
  hk: { cls: "hk", text: tx("mktHk"), title: tx("mktHkTitle") },
  us: { cls: "us", text: tx("mktUs"), title: tx("mktUsTitle") },
  fut: { cls: "fut", text: tx("mktFut"), title: tx("mktFutTitle") },
  fx: { cls: "fx", text: tx("mktFx"), title: tx("mktFxTitle") },
  bond: { cls: "bond", text: tx("mktBond"), title: tx("mktBondTitle") },
  block: { cls: "block", text: tx("mktBlock"), title: tx("mktBlockTitle") },
  global: { cls: "global", text: tx("mktGlobal"), title: tx("mktGlobalTitle") },
  fund: { cls: "fund", text: tx("mktFund"), title: tx("mktFundTitle") },
  otc: { cls: "otc", text: tx("mktOtc"), title: tx("mktOtcTitle") },
};

/* ---------------------------------------------------------------- 数据获取 */

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// 东财对同一个 IP 有短时频率限制：个股多了以后，一轮里同时甩出十几个请求，
// 服务器会直接把连接掐掉（没有 HTTP 状态码，就是“拿不到数据”），冷却半分钟才恢复。
// 现在报价已经换成腾讯批量（一轮 1 个请求），只剩分时和东财兜底还需要限并发。
const CONCURRENCY = 3;

// 小并发池：按顺序取任务，同时最多 limit 个在飞。
async function mapLimit(list, limit, fn) {
  const out = new Array(list.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, list.length) }, async () => {
    while (next < list.length) {
      const i = next++;
      out[i] = await fn(list[i], i);
    }
  });
  await Promise.all(workers);
  return out;
}

// 单只请求失败再补一次：限流边缘的断连大多是瞬时的，退避几百毫秒重试往往就通了。
// 4xx（除 429）不重试——参数错了重试也没用。
const RETRY_DELAY = 650;

async function request(url, tries = 2) {
  let lastErr = new Error("fetch failed");
  for (let i = 0; i < tries; i++) {
    try {
      const r = await widget.fetch(url);
      if (r.ok) return r;
      const status = Number(r.status) || 0;
      lastErr = new Error("HTTP " + status);
      if (status && status < 500 && status !== 429) break;
    } catch (err) {
      lastErr = err;
    }
    if (i < tries - 1) await sleep(RETRY_DELAY + Math.round(Math.random() * 300));
  }
  throw lastErr;
}

const fetchJson = async (url, tries) => (await request(url, tries)).json();
const fetchText = async (url, tries) => (await request(url, tries)).text();

/* ---- 腾讯：代码映射 ---- */

// secid -> 腾讯代码。腾讯只认 sh / sz / bj / hk / us 这套前缀，
// 期货、外汇、板块、债券、场外这些它一律不管，返回 null 表示「这批留在东财」。
// 注意北交所：东财把它归在 0（深）里、代码 4 / 8 开头，腾讯要 bj 前缀。
function tencentCode(it) {
  const market = Number(it.market);
  const code = String(it.code || "");
  if (market === 0 || market === 1) {
    if (!/^\d{6}$/.test(code)) return null;
    if (market === 0 && /^[48]/.test(code)) return "bj" + code;
    return (market === 1 ? "sh" : "sz") + code;
  }
  const tag = MARKET_TAG[market];
  if (tag === "hk") return /^\d{1,5}$/.test(code) ? "hk" + code.padStart(5, "0") : null;
  if (tag === "us") return /^[A-Za-z][A-Za-z.\-]{0,11}$/.test(code) ? "us" + code.toUpperCase() : null;
  return null;
}

const isUSMarket = (it) => MARKET_TAG[Number(it.market)] === "us";

/* ---- 腾讯：批量报价 ---- */

// 腾讯的报价是一行一只的文本：「v_sh600519="1~贵州茅台~600519~现价~昨收~今开~…~涨跌~涨跌幅~…"」。
// 字段位置四个市场完全一致：[1] 名称 [2] 代码 [3] 现价 [4] 昨收 [30] 时间 [31] 涨跌 [32] 涨跌幅。
// 无效代码腾讯直接不返回那一行，所以「没出现在返回里」就等于没数据，比东财返回空 data 更好判断。
const num = (v) => {
  const n = Number(String(v).trim());
  return Number.isFinite(n) ? n : null;
};

// 小数位从价格字符串里数（港股 336.400 是 3 位，A 股 1434.15 是 2 位），
// 比东财的 f59 更省事，也不用额外维护一张市场对照表。
function decimalsOf(s) {
  const m = String(s || "").match(/\.(\d+)$/);
  return m ? Math.min(m[1].length, 4) : 0;
}

function parseTencentQuote(f) {
  if (!f || f.length < 33) return null;
  const name = f[1] || "";
  const price = num(f[3]);
  const prevClose = num(f[4]);
  if (!name && !prevClose) return null;
  return {
    name,
    digits: decimalsOf(f[3]) || 2,
    // 停牌 / 集合竞价前现价是 0，别当成真价格：价格留空显示 —，名称和昨收照留。
    price: price > 0 ? price : null,
    prevClose: prevClose > 0 ? prevClose : null,
    change: num(f[31]),
    percent: num(f[32]),
  };
}

// 一次请求拿回一整批。12 只 → 1 个请求，这是相对东财逐只查询的根本差别。
async function fetchTencentQuotes(list) {
  const out = new Map();
  const byCode = new Map();
  for (const it of list) {
    const code = tencentCode(it);
    if (code) byCode.set(code, it);
  }
  const codes = [...byCode.keys()];
  for (let i = 0; i < codes.length; i += TX_BATCH) {
    const chunk = codes.slice(i, i + TX_BATCH);
    const text = await fetchText(TX_QUOTE_API + chunk.join(","));
    for (const m of text.matchAll(/v_([A-Za-z0-9_.]+)="([^"]*)"/g)) {
      const it = byCode.get(m[1]);
      if (!it) continue;
      const q = parseTencentQuote(m[2].split("~"));
      if (q) out.set(it.secid, q);
    }
  }
  return out;
}

/* ---- 东财：逐只兜底 ---- */

// 东财的批量接口（ulist.np）在 .NET 的 HttpClient 下会被服务端断连，所以只能逐只查；
// 并发交给 mapLimit 压到 3 个。现在这条路只在腾讯不支持的品种或腾讯整体失手时才走。
async function fetchEastmoneyQuotes(list) {
  const map = new Map();
  await mapLimit(list, CONCURRENCY, async (it) => {
    try {
      const url = `${QUOTE_API}?fltt=2&invt=2&secid=${it.secid}&fields=${QUOTE_FIELDS}`;
      const json = await fetchJson(url);
      const d = json && json.data;
      // 盘前 / 休市时现价 f43 是字符串 "-"，但名称 f58 和昨收 f60 还在：
      // 保留它们，价格显示 —，别把整行变成「光秃秃的代码」。
      // 完全没有 data（无效代码）才算失败。
      if (!d || (!d.f58 && !Number.isFinite(d.f60))) return;
      map.set(it.secid, {
        name: d.f58 || "",
        digits: Number.isFinite(d.f59) ? d.f59 : 2,
        price: Number.isFinite(d.f43) ? d.f43 : null,
        prevClose: Number.isFinite(d.f60) ? d.f60 : null,
        change: Number.isFinite(d.f169) ? d.f169 : null,
        percent: Number.isFinite(d.f170) ? d.f170 : null,
      });
    } catch (err) {
      // 单只失败不影响其他
    }
  });
  return map;
}

/* ---- 报价总入口：腾讯批量 → 缺口补东财 ---- */

async function fetchQuotes(list) {
  const map = new Map();
  const txList = list.filter((it) => tencentCode(it));

  if (txList.length) {
    try {
      for (const [k, v] of await fetchTencentQuotes(txList)) map.set(k, v);
    } catch (err) {
      // 腾讯整批失败（断网 / 被掐）就先记一笔，下面会用东财把整张表补齐。
      widget.log("tencent quotes failed", String(err));
    }
  }

  // 腾讯不管的品种（期货 / 外汇 / 板块 / 债券…），加上腾讯这轮没给到的缺口。
  // 正常一轮这里应该是空的，一个请求都不会发。
  const missing = list.filter((it) => !map.has(it.secid));
  if (missing.length) {
    for (const [k, v] of await fetchEastmoneyQuotes(missing)) map.set(k, v);
  }
  return map;
}

/* ---- 分时 ---- */

// 分时行格式：A 股 / 港股 / 指数 / ETF 是「时间 价格 成交量 成交额」，
// 美股是「时间 价格 成交量」——只有第 1 段（价格）各市场通用，所以只取它。
function trendPoints(rows) {
  const out = [];
  for (const line of rows) {
    const p = Number(String(line).trim().split(/\s+/)[1]);
    if (p > 0) out.push(p);
  }
  return out;
}

async function fetchEastmoneyTrend(it) {
  const url = `${TREND_API}?secid=${it.secid}&fields1=f1,f2,f3,f4,f5,f6,f7,f8&fields2=f51,f53&iscr=0&ndays=1`;
  const json = await fetchJson(url);
  const rows = (json && json.data && json.data.trends) || [];
  const points = [];
  for (const line of rows) {
    const price = parseFloat(String(line).split(",")[1]);
    if (Number.isFinite(price)) points.push(price);
  }
  return points;
}

// 腾讯的分时按市场分两个端点：A 股 / 港股 / 指数走 minute，
// 美股必须走 usMinute——常规 minute 对美股休市时只回 1 个点，分时图会退化成一个小圆点。
async function fetchTrendOne(it) {
  const code = tencentCode(it);
  if (code) {
    try {
      const url = `${isUSMarket(it) ? TX_US_MINUTE_API : TX_MINUTE_API}?code=${code}`;
      const json = await fetchJson(url);
      const node = json && json.data && json.data[code];
      const points = trendPoints((node && node.data && node.data.data) || []);
      if (points.length) return points;
    } catch (err) {
      // 落到东财
    }
  }
  return fetchEastmoneyTrend(it);
}

async function fetchTrends(list) {
  const out = new Map();
  await mapLimit(list, CONCURRENCY, async (it) => {
    const hit = trendCache.get(it.secid);
    if (hit && Date.now() - hit.ts < TREND_TTL) {
      out.set(it.secid, hit.points);
      return;
    }
    try {
      const points = await fetchTrendOne(it);
      if (points.length) trendCache.set(it.secid, { ts: Date.now(), points });
      out.set(it.secid, points.length ? points : hit ? hit.points : []);
    } catch (err) {
      out.set(it.secid, hit ? hit.points : []);
    }
  });
  return out;
}

// 搜索框里可能粘的是完整代码："000001.SH" / "sh000001" / "1.000001"，
// 东财联想接口只认 6 位数字（带后缀直接返回 0 条），所以先归一化再查。
// 同时把用户写的市场（SH/SS → 沪，SZ/BJ → 深/北）记下来，用来把结果收窄到他想要的那个。
function parseQuery(q) {
  const s = String(q || "").trim();
  const m =
    s.match(/^(sh|ss|sz|bj)?[\s:]?(\d{6})(?:[.\-_]?(sh|ss|sz|bj))?$/i) ||
    s.match(/^(\d{1,3})\.([A-Za-z0-9._-]{1,20})$/);
  if (!m) return { text: s, market: null };
  const head = m[1];
  if (head === "0" || head === "1") return { text: m[2], market: Number(head) }; // 1.000001 这类 secid
  if (/^\d{1,3}$/.test(head)) return { text: m[2], market: Number(head) }; // 116.00700 港股
  const tag = (m[3] || head || "").toLowerCase();
  const market = tag ? (tag === "sh" || tag === "ss" ? 1 : 0) : null;
  return { text: m[2], market };
}

// 东财的联想搜索：代码 / 中文简称 / 拼音首字母都能命中。
// type=14 是证券分类，结果涵盖 A 股、指数、基金、港股、美股、期货、外汇、债券、板块……
// 这里**不再按品种过滤**，能搜到就能加；标签按 Classify 显示，取不到行情的品种显示 —。
// 返回体是 UTF-8 JSON，widget.fetch 的 r.json() 中文正常（已验证）。
async function fetchSuggest(q) {
  const url = `${SUGGEST_API}?input=${encodeURIComponent(q)}&type=14&count=50`;
  const r = await widget.fetch(url);
  if (!r.ok) throw new Error("HTTP " + r.status);
  const json = await r.json();
  const rows = (json && json.QuotationCodeTable && json.QuotationCodeTable.Data) || [];
  const out = [];
  for (const d of rows) {
    const cls = String(d.Classify || "");
    if (!cls || cls === "OTCFUND_HK") continue;
    const secid = String(d.QuoteID || "");
    const label = labelFromSecid(secid);
    if (!label) continue;
    out.push({
      secid,
      code: String(d.Code || secid.split(".")[1] || ""),
      label,
      name: String(d.Name || ""),
      py: String(d.PinYin || "").toUpperCase(),
      board: String(d.SecurityTypeName || ""),
      cls,
    });
  }
  return out;
}

/* ---------------------------------------------------------------- 行情画面 */

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function signed(value, digits, suffix = "") {
  if (!Number.isFinite(value)) return "—";
  return (value > 0 ? "+" : "") + value.toFixed(digits) + suffix;
}

// 分时线：一条折线 + 渐变填充 + 昨收虚线
// viewBox 固定 100×100、preserveAspectRatio="none"，让它铺满整个格子；
// 线宽用 non-scaling-stroke，不会被横向拉伸。
function sparkSvg(points, prevClose, uid) {
  const n = points.length;
  if (n < 2) return "";

  let lo = Math.min(prevClose, ...points);
  let hi = Math.max(prevClose, ...points);
  if (!(hi > lo)) {
    hi = prevClose + Math.max(prevClose * 0.002, 0.01);
    lo = prevClose - Math.max(prevClose * 0.002, 0.01);
  }
  const pad = (hi - lo) * 0.15;
  lo -= pad;
  hi += pad;

  const W = 100;
  const H = 100;
  const x = (i) => (i / (n - 1)) * W;
  const y = (v) => ((hi - v) / (hi - lo)) * H;

  let d = "";
  for (let i = 0; i < n; i++) {
    d += (i === 0 ? "M" : "L") + x(i).toFixed(2) + "," + y(points[i]).toFixed(2);
  }
  const area = d + `L${W},${H}L0,${H}Z`;
  const refTop = Math.min(99, Math.max(1, (y(prevClose) / H) * 100));

  return `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="g${uid}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="currentColor" stop-opacity="0.34"/>
          <stop offset="1" stop-color="currentColor" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="${area}" fill="url(#g${uid})"/>
      <path d="${d}" fill="none" stroke="currentColor" stroke-width="1.5"
            stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
    </svg>
    <i class="ref" style="top:${refTop.toFixed(1)}%"></i>`;
}

let lastRender = null; // 编辑态切换时用最近一次的数据重绘，不必重新联网

function render(cfg, quotes, charts) {
  lastRender = { cfg, quotes, charts };
  let uid = 0;

  listEl.innerHTML = items
    .map((it) => {
      const q = quotes.get(it.secid);
      const digits = q ? q.digits : 2;
      const price = q ? q.price : null;
      const change = q ? q.change : null;
      const percent = q ? q.percent : null;
      const prevClose = q ? q.prevClose : null;
      // 取不到行情时（停牌 / 期货未开盘 / 海外延迟等）用搜索缓存里的名字兜底，
      // 至少不会显示成一个空行；连缓存都没有（多半是输错代码，如 999999）就明确提示找不到
      const cached = cachedHit(it.secid);
      const missing = !q && !cached;
      const name = (q && q.name) || (cached && cached.name) || (missing ? tx("notFound") : "——");

      const dir = !Number.isFinite(change) || change === 0 ? "flat" : change > 0 ? "up" : "down";
      const priceText = Number.isFinite(price) ? price.toFixed(digits) : "—";
      const chgText =
        cfg.rightValue === "percent" ? signed(percent, 2, "%") : signed(change, digits);

      const points = charts.get(it.secid) || [];
      const spark =
        points.length > 1 && Number.isFinite(prevClose) ? sparkSvg(points, prevClose, uid++) : "";

      const mkt = marketOf(it.label);

      // 组合样式：中文简称是主标题，下面一行是市场标签 + 6 位代码（不带 .SS/.SZ）
      // 编辑态的线性减号放在最前面，也就是股票名称之前
      return `<div class="row${missing ? " is-missing" : ""}" data-key="${it.key}"${editing ? " data-no-drag" : ""}>
        ${editing ? `<button class="minus" data-key="${it.key}" title="${esc(tx("removeTitle", { name }))}"
                       data-no-drag aria-label="${esc(tx("remove"))}"></button>` : ""}
        <div class="id">
          <div class="name"${missing ? ` title="${esc(tx("notFoundTitle", { code: it.code }))}"` : ""}>${esc(name)}</div>
          <div class="meta">
            <span class="mkt mkt-${mkt.cls}" title="${mkt.title}">${mkt.text}</span>
            <span class="code">${esc(it.code)}</span>
          </div>
        </div>
        <div class="spark ${dir}">${spark}</div>
        <div class="px">
          <div class="price">${priceText}</div>
          <div class="chg ${dir}">${chgText}</div>
        </div>
      </div>`;
    })
    .join("");

  applyDensity();
  alignColumns();
}

// 空状态的线性小图标：全部用 currentColor 描边，跟着 --w-fg / --w-danger 走，
// 三套主题（含无卡片的 type）都不用单独配色；尺寸交给 CSS，方便小卡片里缩小或隐藏。
const EMPTY_ICONS = {
  // 空自选股：一张空列表 + 「＋」
  list: `<svg class="e-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="3.2" y="4.5" width="17.6" height="15" rx="3"/>
    <path d="M7 9.5h6M7 14.5h3.5" opacity=".7"/>
    <path d="M16.5 13v4M14.5 15h4"/>
  </svg>`,
  // 出错：圆圈感叹号
  alert: `<svg class="e-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="8.2"/>
    <path d="M12 7.9v4.6M12 15.9v.1"/>
  </svg>`,
  // 搜索：放大镜
  search: `<svg class="e-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="10.8" cy="10.8" r="6"/>
    <path d="M15.4 15.4 20 20"/>
  </svg>`,
};

function emptyHTML(title, sub, isError) {
  return `<div class="empty${isError ? " err" : ""}">${EMPTY_ICONS[isError ? "alert" : "list"]}<div class="e-title">${esc(
    title
  )}</div>${sub ? `<div class="sub">${esc(sub)}</div>` : ""}</div>`;
}

// 行高不够时逐级收敛：先收起名称，再缩小字号，最后连分时图也不要。
// 用每行的实际高度判断，所以股票很多或者卡片被压扁时都成立。
function applyDensity() {
  const rows = listEl.querySelectorAll(".row").length;
  if (!rows || searching) {
    document.body.dataset.density = "";
    return;
  }
  const cs = getComputedStyle(listEl);
  const usable = listEl.clientHeight - (parseFloat(cs.paddingTop) || 0) - (parseFloat(cs.paddingBottom) || 0);
  const h = usable / rows;
  document.body.dataset.density = h >= 36 ? "" : h >= 26 ? "compact" : h >= 18 ? "tiny" : "micro";
}

// 让分时图撑满左右两列之间的空间：列宽按「所有行里最长的一段文本」算，
// 而不是固定百分比；配合 .row 的 8px gap，图形既等宽又尽可能宽。
function alignColumns() {
  if (editing || searching) return; // 编辑态 / 搜索态没有分时图
  const rows = listEl.querySelectorAll(".row");
  if (!rows.length) return;

  listEl.classList.add("measuring"); // 临时让两列按内容自适应（CSS 里用 !important 压过覆盖规则）
  let idW = 0;
  let pxW = 0;
  for (const row of rows) {
    const id = row.querySelector(".id");
    const px = row.querySelector(".px");
    if (id) idW = Math.max(idW, id.getBoundingClientRect().width);
    if (px) pxW = Math.max(pxW, px.getBoundingClientRect().width);
  }
  listEl.classList.remove("measuring");

  if (!idW || !pxW) return;
  setCol("--col-id", Math.ceil(idW) + "px");
  setCol("--col-px", Math.ceil(pxW) + "px");
}

function setCol(name, value) {
  if (listEl.style.getPropertyValue(name) !== value) listEl.style.setProperty(name, value);
}

/* ---------------------------------------------------------------- 编辑 */

// 和内置「快捷启动」一致：同一个按钮切换「编辑 / 完成」，编辑态底部出现添加行。
function setEditing(on) {
  if (drag) {
    drag = null; // 切换编辑态时不要把拖拽状态带过去
    document.body.classList.remove("dragging");
    if (sortHint) sortHint.textContent = hintIdle;
  }
  editing = on;
  document.body.classList.toggle("editing", on);
  editBtn.textContent = tx(on ? "done" : "edit");
  editBtn.classList.toggle("is-primary", on);
  adder.hidden = !on;
  if (lastRender) render(lastRender.cfg, lastRender.quotes, lastRender.charts);
  applyDensity();
}

// 删除和排序都走这里：写回控制中心 → 重解析 → 刷新界面
async function writeStocks(next) {
  const text = next.map((x) => x.label).join("\n");
  suppressChange = true;
  try {
    await widget.settings.set("stocks", text);
  } finally {
    suppressChange = false;
  }
  items = parseStocks(text);
  if (busy) dirty = true;
  else refresh();
}

async function removeStock(key) {
  const cur = parseStocks(widget.settings.get("stocks"));
  await writeStocks(cur.filter((x) => x.key !== key));
}

// 拖拽结束后按 DOM 里的实际顺序写回设置
async function saveOrder(keys) {
  const cur = parseStocks(widget.settings.get("stocks"));
  const rest = new Map(cur.map((x) => [x.key, x]));
  const next = [];
  for (const k of keys) {
    const x = rest.get(k);
    if (x) {
      next.push(x);
      rest.delete(k);
    }
  }
  for (const x of rest.values()) next.push(x); // 兜底：一只都不能丢
  if (next.length === cur.length && next.every((x, i) => x === cur[i])) return;
  await writeStocks(next);
}

/* ---------------------------------------------------------------- 搜索 */

async function loadIndex() {
  try {
    const saved = await widget.storage.get(INDEX_KEY);
    if (Array.isArray(saved)) {
      searchIndex = saved;
      for (const x of saved) if (x && x.secid && x.cls) classCache.set(x.secid, x.cls);
    }
  } catch (err) {
    // 没有索引也能用在线搜索
  }
}

function remember(hits) {
  if (!hits.length) return;
  for (const h of hits) if (h.cls) classCache.set(h.secid, h.cls);
  const map = new Map(searchIndex.map((x) => [x.secid, x]));
  for (const h of hits) map.set(h.secid, h);
  searchIndex = [...map.values()].slice(-INDEX_LIMIT);
  Promise.resolve(widget.storage.set(INDEX_KEY, searchIndex)).catch(() => {});
}

// 品种优先级：常见品种排在前面，衍生品 / 场外之类靠后，避免搜索被刷屏
const CLASS_RANK = {
  AStock: 0,
  Index: 1,
  Fund: 2,
  HK: 3,
  UsStock: 4,
  Bond: 5,
  BK: 6,
  UniversalIndex: 7,
  QQZS: 7,
  NDI: 7,
  FOREX: 8,
  FORPM: 8,
  OTCFUND: 8,
  Futures: 9,
  UniversalFutures: 9,
  SHFESP: 9,
  SHFEOPTION: 9,
  OTCBB: 9,
  LSE: 9,
  XETR: 9,
  SGE: 9,
  HKDerivative: 10,
  HKSTOCKF: 10,
};
const rankOf = (h) => (h && h.cls && CLASS_RANK[h.cls] !== undefined ? CLASS_RANK[h.cls] : 6);

// 匹配度：精确 > 前缀 > 包含；代码 > 简称 > 拼音
function score(hit, q) {
  const Q = q.toUpperCase();
  const code = hit.code;
  const name = hit.name || "";
  const py = (hit.py || "").toUpperCase();
  if (code === q) return 100;
  if (name === q) return 96;
  if (py === Q) return 92;
  if (code.startsWith(q)) return 84;
  if (name.startsWith(q)) return 80;
  if (py.startsWith(Q)) return 76;
  if (q && name.includes(q)) return 64;
  if (Q && py.includes(Q)) return 60;
  if (q && code.includes(q)) return 52;
  if (Q && hit.label.toUpperCase().includes(Q)) return 48;
  return 0;
}

function selectedSecids() {
  return new Set(parseStocks(widget.settings.get("stocks")).map((i) => i.secid));
}

function renderResults(hits, info = {}) {
  lastHits = hits;
  lastInfo = info;
  const sel = selectedSecids();
  const shown = hits.slice(0, 20);

  if (!shown.length) {
    // 空结果也带一个小图标：放大镜（没搜到）或感叹号（请求失败）
    const icon = EMPTY_ICONS[info.icon] || "";
    searchResults.innerHTML = `<div class="search-note${info.error ? " err" : ""}">${icon}<span>${esc(
      info.note || tx("noMatch")
    )}</span></div>`;
  } else {
    searchResults.innerHTML = shown
      .map((h) => {
        const added = sel.has(h.secid);
        const sub = [h.py, h.board].filter(Boolean).join(" · ");
        const mkt = marketOf(h.label);
        return `<div class="hit${added ? " is-added" : ""}" data-secid="${h.secid}">
          <span class="mkt mkt-${mkt.cls}" title="${mkt.title}">${mkt.text}</span>
          <span class="h-code">${esc(h.code)}</span>
          <span class="h-name">${esc(h.name || "——")}</span>
          <span class="h-sub">${esc(sub)}</span>
          <span class="h-add">${added ? tx("added") : tx("toAdd")}</span>
        </div>`;
      })
      .join("");
  }
  searchFoot.textContent = info.foot || "";
}

async function runSearch(raw) {
  const seq = ++searchSeq;
  const parsed = parseQuery(raw);
  const q = parsed.text; // 归一化后的关键词：接口用、打分也用
  const inMarket = (h) => parsed.market === null || String(h.secid).startsWith(parsed.market + ".");

  // 先用本地索引即时出结果，在线搜索回来后再合并
  const local = searchIndex
    .filter(inMarket)
    .map((h) => ({ h, s: score(h, q) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.h);
  renderResults(local, { note: tx("searching"), foot: local.length ? tx("localResults") : "" });

  try {
    let remote = await fetchSuggest(q);
    // 用户写了市场（如 000001.SH）就只留那个市场的；万一没有结果再放开
    if (parsed.market !== null) {
      const narrowed = remote.filter(inMarket);
      if (narrowed.length) remote = narrowed;
    }
    if (seq !== searchSeq) return;
    remember(remote);

    const merged = new Map();
    for (const h of [...remote, ...local]) {
      const s = score(h, q);
      if (s <= 0) continue;
      const old = merged.get(h.secid);
      if (!old || old.s < s) merged.set(h.secid, { h, s });
    }
    const ranked = [...merged.values()]
      .sort((a, b) => b.s - a.s || rankOf(a.h) - rankOf(b.h) || a.h.code.localeCompare(b.h.code))
      .map((x) => x.h);
    renderResults(ranked, {
      note: tx("noMatch"),
      icon: "search",
      foot: ranked.length
        ? tx("resultFoot", { n: ranked.length, scroll: ranked.length > 5 ? tx("scrollHint") : "" })
        : tx("tryAgain"),
    });
  } catch (err) {
    if (seq !== searchSeq) return;
    widget.log("stock search failed", String(err));
    if (!local.length) {
      renderResults([], { note: tx("searchError"), error: true, icon: "alert" });
    } else {
      renderResults(local, { note: "", foot: tx("offline") });
    }
  }
}

function queueSearch(q, delay = SEARCH_DEBOUNCE) {
  clearTimeout(searchTimer);
  const cleaned = String(q || "").trim();
  if (!cleaned) {
    searchSeq++;
    renderResults([], { note: tx("emptyQuery"), icon: "search", foot: tx("example") });
    return;
  }
  searchTimer = setTimeout(() => runSearch(cleaned), delay);
}

function openSearch(initial, focus = false) {
  searching = true;
  document.body.classList.add("is-searching");
  listEl.hidden = true;
  searchView.hidden = false;
  applyDensity();
  if (initial !== undefined) searchInput.value = initial;
  if (focus) {
    searchInput.focus();
    searchInput.select();
  }
  queueSearch(searchInput.value, focus ? 0 : 400);
}

function closeSearch() {
  if (!searching) return;
  searching = false;
  searchSeq++;
  clearTimeout(searchTimer);
  document.body.classList.remove("is-searching");
  searchView.hidden = true;
  listEl.hidden = false;
  applyDensity();

  // 顺手把控制中心那个搜索框清空，下次可以再输入同样的关键词
  lastExternalQuery = "";
  if (widget.settings.get("search")) {
    suppressChange = true;
    Promise.resolve(widget.settings.set("search", "")).finally(() => {
      suppressChange = false;
    });
  }
}

async function toggleHit(secid) {
  const hit = lastHits.find((x) => x.secid === secid) || searchIndex.find((x) => x.secid === secid);
  if (!hit) return;

  const cur = parseStocks(widget.settings.get("stocks"));
  const exists = cur.some((x) => x.secid === secid);
  if (!exists && cur.length >= MAX_ROWS) {
    searchFoot.textContent = tx("limitReached", { n: MAX_ROWS });
    return;
  }
  const next = exists
    ? cur.filter((x) => x.secid !== secid)
    : [...cur, { key: secid, secid, code: hit.code, label: hit.label }];
  const text = next.map((x) => x.label).join("\n");

  suppressChange = true;
  try {
    await widget.settings.set("stocks", text);
  } finally {
    suppressChange = false;
  }
  items = parseStocks(text);
  renderResults(lastHits, lastInfo); // 刷新 ✓ / ＋ 状态
  if (busy) dirty = true; // 正好在拉行情，等这一轮结束再刷新
  else refresh(); // 立刻把新加的股票行情拉回来
}

/* ---------------------------------------------------------------- 刷新循环 */

function readSettings() {
  const s = widget.settings.get() || {};
  return {
    items: parseStocks(s.stocks),
    interval: Math.max(5, Number(s.refresh) || 30) * 1000,
    showChart: s.showChart !== false,
    rightValue: s.rightValue === "percent" ? "percent" : "amount",
    clickOpen: s.clickOpen !== false,
  };
}

/* -------------------------------------------------- 交易时段（按品种所属市场）
   组件已经不限制品种，A 股 / 港股 / 美股 / 外汇 / 全球指数的开盘时间各不相同：
   只看 A 股时段的话，美股开盘时（北京时间晚上）会被误判成休市、降到 5 分钟刷新一次。
   所以按当前自选股里出现的市场分别判断，任一市场开盘就按设定频率刷新。
   每个市场都用当地时区取星期和分钟数，海用户的电脑时区不影响判断；
   美股用 America/New_York 还能自动跟随夏令时，不用硬编码时差。 */
const WEEKDAYS = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5 };
const ZONE_FORMATTERS = new Map();

function clockIn(timeZone, now) {
  let fmt = ZONE_FORMATTERS.get(timeZone);
  if (fmt === undefined) {
    try {
      fmt = new Intl.DateTimeFormat("en-US", {
        timeZone, weekday: "short", hour: "numeric", minute: "numeric", hour12: false,
      });
    } catch (err) { fmt = null; }
    ZONE_FORMATTERS.set(timeZone, fmt);
  }
  if (!fmt) return null;
  const parts = {};
  for (const p of fmt.formatToParts(now)) parts[p.type] = p.value;
  const hour = Number(parts.hour) === 24 ? 0 : Number(parts.hour); // en-US 的 24:00 写法
  return { weekday: WEEKDAYS[parts.weekday] || 0, minute: hour * 60 + Number(parts.minute) };
}

// 窗口都是**当地时间**的分钟数，开盘前 / 收盘后留几分钟余量，保证最后一根价能刷到。
const SESSIONS = {
  cn:     { tz: "Asia/Shanghai",    windows: [[555, 695], [775, 905]] }, // 09:15–11:35 / 12:55–15:05
  hk:     { tz: "Asia/Hong_Kong",   windows: [[540, 730], [775, 980]] }, // 09:00–12:10 / 12:55–16:20
  us:     { tz: "America/New_York", windows: [[540, 1020]] },             // 09:00–17:00（含盘前 / 盘后）
  allDay: { tz: "Asia/Shanghai",    windows: [[0, 1440]] },               // 外汇 / 全球指数：工作日全天
};

// 市场编号 → 用哪个交易时段。直接复用搜索标签那张编号表，避免两处维护。
const SESSION_BY_TAG = { hk: "hk", us: "us", global: "allDay", fx: "allDay", otc: "allDay" };
function sessionOf(market) {
  return SESSION_BY_TAG[MARKET_TAG[Number(market)]] || "cn";
}

function isMarketOpen(items, now = new Date()) {
  const sessions = new Set((items || []).map((it) => sessionOf(it.market)));
  if (!sessions.size) sessions.add("cn"); // 空列表按 A 股时段走，保持原来的行为
  let anyClock = false;
  for (const key of sessions) {
    const conf = SESSIONS[key] || SESSIONS.cn;
    const c = clockIn(conf.tz, now);
    if (!c) continue;
    anyClock = true;
    if (!c.weekday) continue; // 周末一律休市
    if (conf.windows.some(([from, to]) => c.minute >= from && c.minute <= to)) return true;
  }
  // 环境完全没有时区表时退回本地时间，至少 A 股时段还能正常刷新（错误的方向总比崩溃好）
  if (!anyClock) {
    const weekday = now.getDay();
    const minute = now.getHours() * 60 + now.getMinutes();
    return weekday >= 1 && weekday <= 5 &&
      SESSIONS.cn.windows.some(([from, to]) => minute >= from && minute <= to);
  }
  return false;
}

function schedule(cfg) {
  clearTimeout(timer);
  const base = isMarketOpen(items) ? cfg.interval : Math.max(cfg.interval, IDLE_INTERVAL);
  // 连续两轮以上整轮失败，多半是碰上东财的短时限流了：把间隔拉长到 3 倍等它冷却。
  // 成功一轮就归零，所以恢复后马上回到用户设定的频率。
  const wait = failStreak >= 2 ? Math.min(base * 3, 5 * 60 * 1000) : base;
  timer = setTimeout(refresh, wait);
}

async function refresh() {
  if (busy) return;
  const cfg = readSettings();
  items = cfg.items;

  if (!items.length) {
    document.body.classList.add("empty");
    document.body.dataset.density = "";
    lastRender = null;
    listEl.innerHTML = emptyHTML(tx("noStocks"), tx("noStocksSub"), false);
    schedule(cfg);
    return;
  }
  document.body.classList.remove("empty");

  busy = true;
  try {
    const quotes = await fetchQuotes(items);
    if (!quotes.size) throw new Error("No quotes returned");
    failStreak = 0;
    setOffline(false); // 拉到了数据就撤掉离线角标
    const charts = cfg.showChart ? await fetchTrends(items) : new Map();
    render(cfg, quotes, charts);
  } catch (err) {
    failStreak++;
    widget.log("quotes fetch failed", String(err));
    if (!listEl.querySelector(".row")) {
      listEl.innerHTML = emptyHTML(tx("quoteError"), tx("quoteErrorSub"), true);
    } else {
      // 之前已经渲染出行情：保留旧数据，但挂上离线角标，让用户知道这不是实时价
      setOffline(true);
    }
  } finally {
    busy = false;
    if (dirty) {
      dirty = false;
      refresh();
    } else {
      schedule(cfg);
    }
  }
}

/* ---------------------------------------------------------------- 交互与初始化 */

// 单击一行打开行情页；拖动卡片时位移较大，不算点击。
let pressed = null;
let drag = null; // 编辑态按住排序：{ row, startY, active }

listEl.addEventListener("pointerdown", (e) => {
  const row = e.target.closest(".row");
  if (!row) return;
  pressed = { x: e.clientX, y: e.clientY, key: row.dataset.key };
  // 编辑态：按住行（减号除外）就能拖动排序。行带 data-no-drag，不会同时拖动整个组件窗口。
  if (editing && e.button === 0 && !e.target.closest(".minus")) {
    drag = { row, startY: e.clientY, active: false };
  }
});

document.addEventListener("pointermove", (e) => {
  if (!drag) return;
  if (!drag.active) {
    if (Math.abs(e.clientY - drag.startY) < 5) return;
    drag.active = true;
    document.body.classList.add("dragging");
    drag.row.classList.add("is-dragging");
    if (sortHint) sortHint.textContent = tx("hintDrop");
  }
  e.preventDefault();
  // 按指针位置把被拖行插到其它行之间，所见即所得
  const others = [...listEl.querySelectorAll(".row")].filter((r) => r !== drag.row);
  let at = others.findIndex((r) => {
    const b = r.getBoundingClientRect();
    return e.clientY < b.top + b.height / 2;
  });
  if (at < 0) at = others.length;
  const ref = others[at] || null;
  if (drag.row.nextElementSibling !== ref) listEl.insertBefore(drag.row, ref);

  // 插入位置画一条高亮线，明确「会落在这里」
  listEl.querySelectorAll(".drop-before, .drop-after")
    .forEach((r) => r.classList.remove("drop-before", "drop-after"));
  if (ref) ref.classList.add("drop-before");
  else if (others.length) others[others.length - 1].classList.add("drop-after");
});

function finishDrag() {
  if (!drag) return;
  const d = drag;
  drag = null;
  document.body.classList.remove("dragging");
  d.row.classList.remove("is-dragging");
  listEl.querySelectorAll(".drop-before, .drop-after")
    .forEach((r) => r.classList.remove("drop-before", "drop-after"));
  if (sortHint) sortHint.textContent = hintIdle;
  pressed = null;
  if (!d.active) return;
  saveOrder([...listEl.querySelectorAll(".row")].map((r) => r.dataset.key));
}
document.addEventListener("pointerup", finishDrag);
document.addEventListener("pointercancel", finishDrag);

listEl.addEventListener("pointerup", (e) => {
  if (!pressed) return;
  const { x, y, key } = pressed;
  pressed = null;
  if (Math.abs(e.clientX - x) > 4 || Math.abs(e.clientY - y) > 4) return;
  if (editing || e.target.closest(".minus")) return; // 编辑态只处理删除，不跳浏览器
  if (!readSettings().clickOpen) return;

  const it = items.find((i) => i.key === key);
  if (!it) return;
  try {
    widget.shell.open(`https://quote.eastmoney.com/unify/r/${it.secid}`);
  } catch (err) {
    widget.log("shell.open failed", String(err));
  }
});

// 编辑：右上角「编辑 / 完成」、逐行红色减号、底部「＋ 新增股票」
editBtn.addEventListener("click", () => setEditing(!editing));
addBtn.addEventListener("click", () => openSearch("", true));
listEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".minus");
  if (btn && editing) removeStock(btn.dataset.key);
});

// 搜索面板
searchCloseBtn.addEventListener("click", closeSearch);
// 中文输入法组合期间不要发请求，也不要把「选字」的回车当成添加
let composing = false;
searchInput.addEventListener("compositionstart", () => { composing = true; });
searchInput.addEventListener("compositionend", (e) => {
  composing = false;
  lastExternalQuery = "";
  queueSearch(e.target.value);
});
searchInput.addEventListener("input", (e) => {
  if (composing) return;
  lastExternalQuery = "";
  queueSearch(e.target.value);
});
searchResults.addEventListener("click", (e) => {
  const hit = e.target.closest(".hit");
  if (hit) toggleHit(hit.dataset.secid);
});
document.addEventListener("keydown", (e) => {
  if (e.isComposing) return;
  if (searching) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeSearch();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const first = searchResults.querySelector(".hit");
      if (first) toggleHit(first.dataset.secid);
    }
  } else if (editing && e.key === "Escape") {
    e.preventDefault();
    setEditing(false);
  }
});

// 控制中心改了设置：search 是非空关键词就打开搜索面板，其它设置照常刷新
widget.settings.onChange((all) => {
  if (suppressChange) return;
  const q = String((all && all.search) || "").trim();
  if (q && q !== lastExternalQuery) {
    lastExternalQuery = q;
    if (searching) {
      searchInput.value = q;
      queueSearch(q, 400); // 用户在控制中心逐字输入，防抖后再请求
    } else {
      openSearch(q, false); // 不抢焦点，免得打断输入
    }
  }
  trendCache.clear();
  if (busy) dirty = true;
  else refresh();
});

// 从全屏游戏、锁屏回来时补一次
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) refresh();
});

// 卡片被缩放时重新判断疏密，并重算列宽（卡片变宽后图形也要跟着撑满）
if (typeof ResizeObserver === "function") {
  new ResizeObserver(() => {
    applyDensity();
    alignColumns();
  }).observe(document.body);
}

// index.html 里留的是简中兜底文案，这里按当前语言覆盖一次
addBtn.textContent = tx("addStock");
if (sortHint) sortHint.textContent = hintIdle;
searchInput.placeholder = tx("searchPh");
searchCloseBtn.title = tx("backTitle");

loadIndex();
setEditing(false); // 设定「编辑」按钮的初始文字
const initialQuery = String(widget.settings.get("search") || "").trim();
if (initialQuery) {
  lastExternalQuery = initialQuery;
  openSearch(initialQuery, false);
}
refresh();
