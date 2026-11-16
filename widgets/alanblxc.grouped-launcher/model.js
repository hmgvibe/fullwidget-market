/* 纯数据操作；无 DOM、宿主接口或存储依赖。 */
(() => {
  const MAX_GROUPS = 50, MAX_ITEMS = 200;
  const id = () => globalThis.crypto?.randomUUID?.() || `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  const text = value => typeof value === "string" ? value.trim() : "";
  function url(value) {
    const raw = text(value);
    if (!raw) throw new Error("请输入网址。");
    const address = new URL(/^[a-z][\w+.-]*:/i.test(raw) ? raw : `https://${raw}`);
    if (!["http:", "https:"].includes(address.protocol) || !address.hostname) throw new Error("只支持 HTTP 或 HTTPS 网址。");
    return address.href;
  }
  function normalize(raw) {
    if (!raw || typeof raw !== "object" || raw.version !== 1 || !Array.isArray(raw.groups) || !Array.isArray(raw.items)) throw new Error("存档格式无法识别，已保留原存档。");
    const used = new Set(["all", "none"]), names = new Set();
    function fixedId(value) { const next = text(value); const result = next && !used.has(next) ? next : id(); used.add(result); return result; }
    const groups = [];
    for (const g of raw.groups) {
      if (!g || !text(g.name) || names.has(text(g.name)) || groups.length >= MAX_GROUPS) continue;
      names.add(text(g.name)); groups.push({ id: fixedId(g.id), name: text(g.name).slice(0, 40), mode: g.mode === "grid" ? "grid" : "list" });
    }
    const items = [];
    for (const item of raw.items) {
      if (!item || items.length >= MAX_ITEMS) continue;
      let target;
      try { target = text(item.path) ? { path: text(item.path) } : { url: url(item.url) }; } catch { continue; }
      items.push({ id: fixedId(item.id), ...target, name: text(item.name).slice(0, 120), group: groups.some(g => g.id === item.group) ? item.group : null });
    }
    return { version: 1, groups, items, active: ["all", "none", ...groups.map(g => g.id)].includes(raw.active) ? raw.active : "all" };
  }
  const targetGroup = board => board.groups.some(g => g.id === board.active) ? board.active : null;
  const visible = board => board.items.filter(item => board.active === "all" || item.group === (board.active === "none" ? null : board.active));
  const targetKey = item => item.path ? `p:${item.path.toLowerCase()}` : `u:${item.url}`;
  const hasDuplicate = (board, entry, group, exceptId) => board.items.some(item => item.id !== exceptId && item.group === group && targetKey(item) === targetKey(entry));
  function add(board, target, group) {
    const entry = target.path ? { path: text(target.path) } : { url: url(target.url) };
    if (entry.path === "") throw new Error("文件路径不能为空。");
    group = board.groups.some(g => g.id === group) ? group : null;
    if (hasDuplicate(board, entry, group)) return null;
    if (board.items.length >= MAX_ITEMS) throw new Error("最多添加 200 个快捷方式。");
    const item = { id: id(), ...entry, name: text(target.name), group: board.groups.some(g => g.id === group) ? group : null };
    board.items.push(item); return item;
  }
  function saveGroup(board, groupId, name, mode) {
    name = text(name);
    if (!name) throw new Error("请输入分类名称。");
    if (name.length > 40) throw new Error("分类名称最多 40 字。");
    if (board.groups.some(g => g.id !== groupId && g.name === name)) throw new Error("已有同名分类，请换个名称。");
    let group = board.groups.find(g => g.id === groupId);
    if (!group) {
      if (board.groups.length >= MAX_GROUPS) throw new Error("最多创建 50 个分类。");
      group = { id: id(), name, mode }; board.groups.push(group);
    } else Object.assign(group, { name, mode });
    return group;
  }
  function deleteGroup(board, groupId) {
    board.groups = board.groups.filter(g => g.id !== groupId);
    board.items.forEach(item => { if (item.group === groupId) item.group = null; });
    if (board.active === groupId) board.active = board.groups[0]?.id || "all";
  }
  function reorder(board, from, to) {
    const source = board.items.findIndex(i => i.id === from), destination = board.items.findIndex(i => i.id === to);
    if (source < 0 || destination < 0 || source === destination) return;
    board.items.splice(destination, 0, board.items.splice(source, 1)[0]);
  }
  globalThis.LauncherModel = { id, url, normalize, targetGroup, visible, hasDuplicate, add, saveGroup, deleteGroup, reorder };
})();
