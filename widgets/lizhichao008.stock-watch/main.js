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
  searchPh:      { "zh-TW": "代碼 / 簡稱 / 拼音首字母", "zh-CN": "代码 / 简称 / 拼音首字母", en: "Code / name / initials" },
  backTitle:     { "zh-TW": "返回 (Esc)", "zh-CN": "返回 (Esc)", en: "Back (Esc)" },
  noMatch:       { "zh-TW": "找不到符合的 A 股", "zh-CN": "没有找到匹配的 A 股", en: "No matching A-shares" },
  added:         { "zh-TW": "✓ 已加入", "zh-CN": "✓ 已添加", en: "✓ Added" },
  toAdd:         { "zh-TW": "＋ 加入", "zh-CN": "＋ 添加", en: "+ Add" },
  searching:     { "zh-TW": "搜尋中…", "zh-CN": "正在搜索…", en: "Searching…" },
  localResults:  { "zh-TW": "本機快取結果", "zh-CN": "本地缓存结果", en: "Cached results" },
  resultFoot:    { "zh-TW": "共 {n} 條{scroll} · 點擊加入 / 移除 · Esc 返回", "zh-CN": "共 {n} 条{scroll} · 点击添加 / 移除 · Esc 返回", en: "{n} result(s){scroll} · click to add / remove · Esc to go back" },
  scrollHint:    { "zh-TW": " · 可捲動", "zh-CN": " · 可滚动", en: " · scroll" },
  tryAgain:      { "zh-TW": "試試代碼、簡稱或拼音首字母", "zh-CN": "试试代码、简称或拼音首字母", en: "Try a code, name or initials" },
  searchError:   { "zh-TW": "搜尋失敗，請檢查網路或權限", "zh-CN": "搜索失败，请检查网络或权限", en: "Search failed — check network or permissions" },
  offline:       { "zh-TW": "離線結果（網路不可用）", "zh-CN": "离线结果（网络不可用）", en: "Offline results" },
  emptyQuery:    { "zh-TW": "輸入代碼 / 簡稱 / 拼音首字母", "zh-CN": "输入代码 / 简称 / 拼音首字母", en: "Enter a code, name or initials" },
  example:       { "zh-TW": "例如 600519、茅台、GZMT", "zh-CN": "例如 600519、茅台、GZMT", en: "e.g. 600519 or GZMT" },
  limitReached:  { "zh-TW": "最多 {n} 隻，請先移除一隻", "zh-CN": "最多 {n} 只，请先移除一只", en: "Up to {n} stocks — remove one first" },
  noStocks:      { "zh-TW": "還沒有自選股", "zh-CN": "还没有自选股", en: "No stocks yet" },
  noStocksSub:   { "zh-TW": "點「編輯」→「＋ 新增股票」，或在控制中心搜尋", "zh-CN": "点「编辑」→「＋ 新增股票」，或在控制中心搜索", en: "Click Edit → + Add stock, or search in Control Center" },
  quoteError:    { "zh-TW": "行情取得失敗", "zh-CN": "行情获取失败", en: "Couldn't load quotes" },
  quoteErrorSub: { "zh-TW": "檢查網路，或允許元件存取東方財富", "zh-CN": "检查网络，或允许组件访问东方财富", en: "Check the network, or allow access to Eastmoney" },
};
const tx = (key, vars) => {
  let s = widget.t(I18N[key]);
  if (!s) s = I18N[key]["zh-CN"] || I18N[key].en || key;
  if (vars) for (const k of Object.keys(vars)) s = s.split(`{${k}}`).join(vars[k]);
  return s;
};

// 自选股行情组件
// 行情 / 搜索都来自东方财富的公开接口，由 widget.fetch 代发（不受 CORS 限制）。
// 交易时段按设定的频率刷新，其余时间自动降到 5 分钟一次。
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

// "002242.SZ" / "600989.SS" / "sh600519" / "600519" → { key, secid, code, label }
// 东财的 secid：1 = 上交所，0 = 深交所 / 北交所
function parseOne(raw) {
  const s = String(raw || "").trim();
  if (!s) return null;
  const m = s.match(/^(sh|sz|bj)?(\d{6})(?:[.\-_]?(sh|sz|bj|ss))?$/i);
  if (!m) return null;

  const digits = m[2];
  const tag = (m[3] || m[1] || "").toLowerCase();

  let market;
  if (tag === "sh" || tag === "ss") market = 1;
  else if (tag === "sz" || tag === "bj") market = 0;
  else market = /^[569]/.test(digits) ? 1 : 0; // 6/9 沪市，5 沪基金

  return {
    key: `${market}.${digits}`,
    secid: `${market}.${digits}`,
    code: digits,
    label: `${digits}.${suffixFor(market, digits)}`,
  };
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

// 搜索结果里的 QuoteID（如 "0.002242"）转成我们自己的代码格式
function labelFromSecid(secid) {
  const parts = String(secid || "").split(".");
  if (parts.length !== 2 || !/^[01]$/.test(parts[0]) || !/^\d{6}$/.test(parts[1])) return null;
  return `${parts[1]}.${suffixFor(parts[0], parts[1])}`;
}

// 显示用的市场标签。后缀只留在 label 里用于写回设置和去重，画面上一律不显示。
function marketOf(label) {
  const s = String(label || "");
  if (/\.SS$/i.test(s)) return { cls: "sh", text: tx("mktSh"), title: tx("mktShTitle") };
  if (/\.BJ$/i.test(s)) return { cls: "bj", text: tx("mktBj"), title: tx("mktBjTitle") };
  return { cls: "sz", text: tx("mktSz"), title: tx("mktSzTitle") };
}

/* ---------------------------------------------------------------- 数据获取 */

// 逐只查询。东财的批量接口（ulist.np）在 .NET 的 HttpClient 下会被服务端断连，
// 单只的 stock/get 反而稳定，一只一个请求，最多 12 个并发。
async function fetchQuotes(list) {
  const map = new Map();
  await Promise.all(
    list.map(async (it) => {
      try {
        const url = `${QUOTE_API}?fltt=2&invt=2&secid=${it.secid}&fields=${QUOTE_FIELDS}`;
        const r = await widget.fetch(url);
        if (!r.ok) return;
        const json = await r.json();
        const d = json && json.data;
        if (!d || !Number.isFinite(d.f43)) return;
        map.set(it.secid, {
          name: d.f58,
          digits: Number.isFinite(d.f59) ? d.f59 : 2,
          price: d.f43,
          prevClose: d.f60,
          change: d.f169,
          percent: d.f170,
        });
      } catch (err) {
        // 单只失败不影响其他
      }
    })
  );
  return map;
}

async function fetchTrends(list) {
  const out = new Map();
  await Promise.all(
    list.map(async (it) => {
      const hit = trendCache.get(it.secid);
      if (hit && Date.now() - hit.ts < TREND_TTL) {
        out.set(it.secid, hit.points);
        return;
      }
      try {
        const url = `${TREND_API}?secid=${it.secid}&fields1=f1,f2,f3,f4,f5,f6,f7,f8&fields2=f51,f53&iscr=0&ndays=1`;
        const r = await widget.fetch(url);
        if (!r.ok) throw new Error("HTTP " + r.status);
        const json = await r.json();
        const rows = (json && json.data && json.data.trends) || [];
        const points = [];
        for (const line of rows) {
          const price = parseFloat(String(line).split(",")[1]);
          if (Number.isFinite(price)) points.push(price);
        }
        trendCache.set(it.secid, { ts: Date.now(), points });
        out.set(it.secid, points);
      } catch (err) {
        out.set(it.secid, hit ? hit.points : []);
      }
    })
  );
  return out;
}

// 东财的联想搜索：代码 / 中文简称 / 拼音首字母都能命中。
// type=14 是股票分类，结果里混着港股、美股、基金，只留 AStock。
// 返回体是 UTF-8 JSON，widget.fetch 的 r.json() 中文正常（已验证）。
async function fetchSuggest(q) {
  const url = `${SUGGEST_API}?input=${encodeURIComponent(q)}&type=14&count=50`;
  const r = await widget.fetch(url);
  if (!r.ok) throw new Error("HTTP " + r.status);
  const json = await r.json();
  const rows = (json && json.QuotationCodeTable && json.QuotationCodeTable.Data) || [];
  const out = [];
  for (const d of rows) {
    if (d.Classify !== "AStock") continue;
    const secid = String(d.QuoteID || "");
    const label = labelFromSecid(secid);
    if (!label) continue;
    out.push({
      secid,
      code: String(d.Code || secid.split(".")[1]),
      label,
      name: String(d.Name || ""),
      py: String(d.PinYin || "").toUpperCase(),
      board: String(d.SecurityTypeName || ""),
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
      const name = q && q.name ? q.name : "——";

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
      return `<div class="row" data-key="${it.key}"${editing ? " data-no-drag" : ""}>
        ${editing ? `<button class="minus" data-key="${it.key}" title="${esc(tx("removeTitle", { name }))}"
                       data-no-drag aria-label="${esc(tx("remove"))}"></button>` : ""}
        <div class="id">
          <div class="name">${esc(name)}</div>
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

function emptyHTML(title, sub, isError) {
  return `<div class="empty${isError ? " err" : ""}">${esc(title)}${
    sub ? `<div class="sub">${esc(sub)}</div>` : ""
  }</div>`;
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
    if (Array.isArray(saved)) searchIndex = saved;
  } catch (err) {
    // 没有索引也能用在线搜索
  }
}

function remember(hits) {
  if (!hits.length) return;
  const map = new Map(searchIndex.map((x) => [x.secid, x]));
  for (const h of hits) map.set(h.secid, h);
  searchIndex = [...map.values()].slice(-INDEX_LIMIT);
  Promise.resolve(widget.storage.set(INDEX_KEY, searchIndex)).catch(() => {});
}

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
    searchResults.innerHTML = `<div class="search-note${info.error ? " err" : ""}">${esc(
      info.note || tx("noMatch")
    )}</div>`;
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

async function runSearch(q) {
  const seq = ++searchSeq;

  // 先用本地索引即时出结果，在线搜索回来后再合并
  const local = searchIndex
    .map((h) => ({ h, s: score(h, q) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.h);
  renderResults(local, { note: tx("searching"), foot: local.length ? tx("localResults") : "" });

  try {
    const remote = await fetchSuggest(q);
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
      .sort((a, b) => b.s - a.s || a.h.code.localeCompare(b.h.code))
      .map((x) => x.h);
    renderResults(ranked, {
      note: tx("noMatch"),
      foot: ranked.length
        ? tx("resultFoot", { n: ranked.length, scroll: ranked.length > 5 ? tx("scrollHint") : "" })
        : tx("tryAgain"),
    });
  } catch (err) {
    if (seq !== searchSeq) return;
    widget.log("stock search failed", String(err));
    if (!local.length) {
      renderResults([], { note: tx("searchError"), error: true });
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
    renderResults([], { note: tx("emptyQuery"), foot: tx("example") });
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

// 交易时段：周一到周五 09:15–11:35、12:55–15:05
function isTradingTime(now = new Date()) {
  const day = now.getDay();
  if (day === 0 || day === 6) return false;
  const m = now.getHours() * 60 + now.getMinutes();
  return (m >= 555 && m <= 695) || (m >= 775 && m <= 905);
}

function schedule(cfg) {
  clearTimeout(timer);
  const wait = isTradingTime() ? cfg.interval : Math.max(cfg.interval, IDLE_INTERVAL);
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
    const charts = cfg.showChart ? await fetchTrends(items) : new Map();
    render(cfg, quotes, charts);
  } catch (err) {
    widget.log("quotes fetch failed", String(err));
    if (!listEl.querySelector(".row")) {
      listEl.innerHTML = emptyHTML(tx("quoteError"), tx("quoteErrorSub"), true);
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
