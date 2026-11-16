/* FullWidget 宿主负责权限和系统操作；本文件只管理当前实例。 */
(() => {
  const $ = id => document.getElementById(id), M = LauncherModel;
  const defaults = { title: "分组启动台", showTitle: true, showAll: true, multiRow: false, compactTabs: false, showIcons: true, defaultGrid: true };
  // SDK 在捕获阶段处理右键，通过其官方属性限制菜单区域。
  document.querySelectorAll(".tabbar, .workspace, .statusbar, #editor, .notice, .error").forEach(node => node.setAttribute("data-no-menu", ""));
  window.addEventListener("contextmenu", event => {
    // 只使用 SDK 的菜单开关，不截断宿主事件，也不修改宿主注入的缩放手柄。
    document.body.toggleAttribute("data-no-menu", !event.target.closest?.("header.header"));
  }, true);
  let settings = { ...defaults, ...widget.settings.get() };
  let board, ready = false, editing = false, selected = null, dragging = null, undoRecord = null, undoTimer;
  let revision = 0, saveQueue = Promise.resolve(), loadPending = false;
  const infoCache = new Map(), loadingPaths = new Set();
  const element = (tag, className, content) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  };
  const error = reason => { $("error-message").textContent = reason?.message || String(reason); $("error").hidden = false; };
  const guard = action => async event => { try { await action(event); } catch (reason) { error(reason); } };
  const clone = value => JSON.parse(JSON.stringify(value));
  function moveItem(item, group) {
    if (M.hasDuplicate(board, item, group, item.id)) { error("目标分组已存在相同入口。"); return false; }
    item.group = group; selected = null; changed(); return true;
  }
  const showAllTab = () => settings.showAll || !board.groups.length || board.items.some(item => !item.group);
  function fixActive() {
    if (!board.groups.length) board.active = "all";
    else if (!showAllTab() && board.active === "all") board.active = board.groups[0].id;
    else if (!["all", ...board.groups.map(g => g.id)].includes(board.active)) board.active = showAllTab() ? "all" : board.groups[0].id;
  }
  function save() {
    if (!ready) return;
    const snapshot = clone(board), current = ++revision;
    $("status").textContent = "保存中…"; $("retry-save").hidden = true;
    saveQueue = saveQueue.then(() => widget.storage.set("board", snapshot)).then(() => {
      if (current === revision) { $("status").textContent = "已保存"; $("retry-save").hidden = true; }
    }).catch(reason => {
      if (current === revision) { $("status").textContent = "保存失败"; $("retry-save").hidden = false; error(reason); }
    });
  }
  function changed() { fixActive(); save(); render(); }
  function groupOptions(select, value, includeNew = false) {
    select.replaceChildren();
    const option = (key, name) => { const node = element("option", "", name); node.value = key; select.append(node); };
    option("", includeNew ? "＋ 新建分组" : "仅放在全部页");
    board.groups.forEach(group => option(group.id, group.name));
    select.value = value || "";
  }
  function renderTabs() {
    const tabs = $("tabs"), previousScroll = { left: tabs.scrollLeft, top: tabs.scrollTop };
    tabs.hidden = false;
    tabs.classList.toggle("multi", !!settings.multiRow);
    tabs.classList.toggle("compact", !!settings.compactTabs);
    tabs.replaceChildren();
    const groups = [...(showAllTab() ? [{ id: "all", name: "全部" }] : []), ...board.groups];
    groups.forEach(group => {
      const button = element("button", "tab"); button.dataset.group = group.id;
      button.setAttribute("aria-current", String(board.active === group.id));
      button.id = `group-tab-${group.id}`;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(board.active === group.id));
      button.setAttribute("aria-controls", "group-page");
      button.tabIndex = board.active === group.id ? 0 : -1;
      if (board.active === group.id) $("group-page").setAttribute("aria-labelledby", button.id);
      button.title = editing && group.id !== "all" ? `${group.name} · 点击编辑分组` : group.name;
      button.append(element("span", "tab-name", group.name), element("span", "tab-count", group.id === "all" ? board.items.length : board.items.filter(item => item.group === (group.id === "none" ? null : group.id)).length));
      if (editing && group.id !== "all") {
        const mark = element("span", "tab-edit", "编辑"); mark.setAttribute("aria-hidden", "true"); button.append(mark);
      }
      button.addEventListener("click", () => {
        if (board.active !== group.id) {
          board.active = group.id; selected = null; changed();
          document.getElementById(`group-tab-${group.id}`)?.focus({ preventScroll: true });
        }
        if (editing && group.id !== "all") {
          $("group-form").hidden = false; $("manage").setAttribute("aria-expanded", "true");
          resetGroupForm(group.id); $("group-name").focus(); $("group-name").select();
        }
      });
      button.addEventListener("keydown", event => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const index = groups.findIndex(g => g.id === group.id);
        const next = event.key === "Home" ? 0 : event.key === "End" ? groups.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + groups.length) % groups.length;
        board.active = groups[next].id; selected = null; changed();
        document.getElementById(`group-tab-${board.active}`)?.focus();
      });
      if (group.id !== "all") {
        button.addEventListener("dragover", event => { if (dragging) { event.preventDefault(); event.dataTransfer.dropEffect = "move"; button.classList.add("drop-target"); } });
        button.addEventListener("dragleave", () => button.classList.remove("drop-target"));
        button.addEventListener("drop", event => {
          if (!dragging) return;
          event.preventDefault(); event.stopPropagation();
          button.classList.remove("drop-target");
          const item = board.items.find(item => item.id === dragging);
          if (item) moveItem(item, group.id);
          dragging = null;
        });
      }
      tabs.append(button);
    });
    tabs.scrollLeft = previousScroll.left; tabs.scrollTop = previousScroll.top;
  }
  function fallbackIcon(isUrl) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("fill", "none"); svg.setAttribute("stroke", "currentColor"); svg.setAttribute("stroke-width", "1.6"); svg.setAttribute("aria-hidden", "true");
    const path = document.createElementNS(svg.namespaceURI, "path");
    path.setAttribute("d", isUrl ? "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3c4 5 4 13 0 18-4-5-4-13 0-18Z" : "M3 7V5h6l2 2h10v12H3V7Z");
    svg.append(path); return svg;
  }
  function displayName(item) {
    return item.name || infoCache.get(item.path)?.name || (item.path ? item.path.split(/[\\/]/).filter(Boolean).pop() : new URL(item.url).hostname) || "快捷方式";
  }
  function updateItem(node, item) {
    const info = item.path && infoCache.get(item.path), icon = node.querySelector(".item-icon");
    node.querySelector(".item-name").textContent = displayName(item);
    node.classList.toggle("missing", info?.exists === false);
    node.title = `${displayName(item)}\n${item.path || item.url}${info?.exists === false ? "\n文件不存在或暂时无法访问" : ""}`;
    icon.hidden = !settings.showIcons;
    icon.replaceChildren();
    if (info?.icon && /^data:image\//i.test(info.icon)) { const image = element("img"); image.src = info.icon; image.alt = ""; image.draggable = false; icon.append(image); }
    else icon.append(fallbackIcon(!!item.url));
  }
  function selectItem(id) {
    selected = id;
    $("items").querySelectorAll(".item").forEach(node => node.setAttribute("aria-selected", String(node.dataset.id === id)));
    const index = M.visible(board).findIndex(item => item.id === id);
    if (index >= 0) $("items").setAttribute("aria-activedescendant", `shortcut-${id}`);
    else $("items").removeAttribute("aria-activedescendant");
  }
  async function launch(item) {
    if (!ready || editing || !item) return;
    try { await (item.path ? widget.shell.launch(item.path) : widget.shell.open(item.url)); }
    catch (reason) { error(reason); }
  }
  function renderItems() {
    const list = $("items"), scroll = list.scrollTop, hadFocus = list.contains(document.activeElement);
    const items = M.visible(board), group = board.groups.find(g => g.id === board.active);
    list.classList.toggle("grid", (group?.mode || (settings.defaultGrid ? "grid" : "list")) === "grid");
    list.replaceChildren();
    items.forEach(item => {
      const row = element("div", "item"); row.dataset.id = item.id; row.id = `shortcut-${item.id}`;
      row.setAttribute("role", "option"); row.setAttribute("aria-selected", String(selected === item.id)); row.draggable = true;
      row.append(element("span", "item-icon"), element("span", "item-name")); updateItem(row, item);
      row.addEventListener("click", event => { if (!event.target.closest("button,select")) { selectItem(item.id); list.focus({ preventScroll: true }); } });
      row.addEventListener("dblclick", event => { if (!event.target.closest("button,select")) { event.preventDefault(); launch(item); } });
      row.addEventListener("dragstart", event => { if (event.target.closest("button,select")) { event.preventDefault(); return; } dragging = item.id; event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("application/x-fullwidget-shortcut", item.id); });
      row.addEventListener("dragend", () => { dragging = null; document.querySelectorAll(".drop-target").forEach(node => node.classList.remove("drop-target")); });
      row.addEventListener("dragover", event => { if (dragging && dragging !== item.id) { event.preventDefault(); event.dataTransfer.dropEffect = "move"; row.classList.add("drop-target"); } });
      row.addEventListener("dragleave", () => row.classList.remove("drop-target"));
      row.addEventListener("drop", event => { if (dragging) { event.preventDefault(); event.stopPropagation(); M.reorder(board, dragging, item.id); dragging = null; changed(); } });
      if (editing) {
        const remove = element("button", "remove", "×"); remove.setAttribute("aria-label", `移除 ${displayName(item)}`);
        remove.addEventListener("click", () => removeItem(item.id)); row.append(remove);
      }
      list.append(row);
    });
    $("view-name").textContent = group?.name || "全部快捷方式";
    $("item-count").textContent = `${items.length} 个`;
    $("empty").hidden = items.length !== 0;
    if (!items.some(item => item.id === selected)) selected = null;
    selectItem(selected); list.scrollTop = scroll;
    if (hadFocus) list.focus({ preventScroll: true });
  }
  function render() {
    $("title").textContent = settings.title || defaults.title; $("title").hidden = !settings.showTitle;
    $("editor").hidden = !editing;
    document.body.classList.toggle("editing", editing);
    $("edit").textContent = editing ? "完成" : "编辑";
    $("new-group").hidden = !editing;
    $("edit").setAttribute("aria-label", editing ? "完成编辑" : "编辑启动台");
    $("edit").title = editing ? "完成编辑" : "编辑启动台";
    $("edit").setAttribute("aria-pressed", String(editing));
    $("hint").textContent = editing ? "拖动排序 · 可移到其他分组" : "双击打开 · 拖入添加";
    $("new-group").disabled = !ready;
    const activeGroup = board?.groups.find(group => group.id === board.active);
    $("current-mode-label").hidden = !activeGroup;
    if (activeGroup) $("current-mode").value = activeGroup.mode;
    if (board) { renderTabs(); renderItems(); }
  }
  async function loadInfo() {
    const pending = [...new Set(board.items.filter(item => item.path && !infoCache.has(item.path) && !loadingPaths.has(item.path)).map(item => item.path))];
    pending.forEach(path => loadingPaths.add(path));
    async function worker() {
      while (pending.length) {
        const path = pending.shift();
        try {
          const info = await widget.shell.info(path, { size: 48 }); infoCache.set(path, info);
          board.items.filter(item => item.path === path).forEach(item => { const node = document.getElementById(`shortcut-${item.id}`); if (node) updateItem(node, item); });
        } catch (reason) { error(reason); }
        finally { loadingPaths.delete(path); }
      }
    }
    await Promise.all(Array.from({ length: Math.min(4, pending.length) }, worker));
  }
  function removeItem(id) {
    if (!ready) return;
    const index = board.items.findIndex(item => item.id === id); if (index < 0) return;
    undoRecord = { item: clone(board.items[index]), index };
    board.items.splice(index, 1); selected = null;
    clearTimeout(undoTimer); $("undo").hidden = false;
    undoTimer = setTimeout(() => { undoRecord = null; $("undo").hidden = true; }, 6000);
    changed();
  }
  function addMany(targets, group) {
    let added = 0, duplicates = 0, failure;
    for (const target of targets) {
      try { if (M.add(board, target, group)) added++; else duplicates++; }
      catch (reason) { failure = reason; break; }
    }
    if (added) { changed(); loadInfo(); }
    if (failure) error(failure);
    else if (duplicates) error(`已跳过 ${duplicates} 个同分类内的重复入口。`);
  }
  async function pick(type, filter) {
    if (!ready) return;
    const group = M.targetGroup(board);
    const path = await widget.shell.pick({ type, filter, title: type === "folder" ? "添加文件夹" : "添加快捷方式" });
    if (path) addMany([{ path }], group);
  }
  function resetGroupForm(groupId = "") {
    groupOptions($("group-select"), groupId, true);
    const group = board.groups.find(g => g.id === groupId);
    $("group-name").value = group?.name || ""; $("group-mode").value = group?.mode || "grid";
    $("group-delete").disabled = !group;
    const index = board.groups.indexOf(group);
    $("group-prev").disabled = !group || index === 0;
    $("group-next").disabled = !group || index === board.groups.length - 1;
    $("confirm-delete").hidden = true;
  }
  async function load() {
    if (loadPending) return; loadPending = true;
    $("retry-load").hidden = true; $("status").textContent = "正在读取…";
    try {
      const stored = await widget.storage.get("board"), first = stored == null;
      board = first ? { version: 1, groups: [], items: [
        { id: M.id(), path: "C:\\Windows\\explorer.exe", name: "文件资源管理器", group: null }
      ], active: "all" } : M.normalize(stored);
      const priorActive = board.active; fixActive(); ready = true; $("edit").disabled = false;
      $("status").textContent = "已读取"; $("error").hidden = true; render();
      if (first || priorActive !== board.active || JSON.stringify(stored) !== JSON.stringify(board)) save();
      loadInfo();
    } catch (reason) { ready = false; $("edit").disabled = true; $("status").textContent = "读取失败"; $("retry-load").hidden = false; error(reason); }
    finally { loadPending = false; }
  }
  $("edit").addEventListener("click", () => {
    if (!ready) return;
    editing = !editing;
    if (!editing) { $("url-form").hidden = true; $("group-form").hidden = true; $("manage").setAttribute("aria-expanded", "false"); }
    render();
  });
  $("current-mode").addEventListener("change", () => {
    if (!ready || !editing) return;
    const group = board.groups.find(group => group.id === board.active);
    if (!group) return;
    group.mode = $("current-mode").value === "list" ? "list" : "grid";
    if ($("group-select").value === group.id) $("group-mode").value = group.mode;
    changed();
  });
  $("new-group").addEventListener("click", () => {
    if (!ready) return;
    editing = true; render(); $("group-form").hidden = false;
    $("manage").setAttribute("aria-expanded", "true"); resetGroupForm(); $("group-name").focus();
  });
  $("retry-save").addEventListener("click", save);
  $("retry-load").addEventListener("click", load);
  $("dismiss-error").addEventListener("click", () => { $("error").hidden = true; });
  $("undo-button").addEventListener("click", () => {
    if (!undoRecord) return;
    if (board.items.length >= 200) { error("入口已达 200 个上限，请先移除一个入口再撤销。"); return; }
    const { item, index } = undoRecord;
    if (!board.groups.some(g => g.id === item.group)) item.group = null;
    if (!M.hasDuplicate(board, item, item.group)) board.items.splice(Math.min(index, board.items.length), 0, item);
    undoRecord = null; clearTimeout(undoTimer); $("undo").hidden = true; changed();
  });
  $("add-program").addEventListener("click", guard(() => pick("file", "programs")));
  $("add-file").addEventListener("click", guard(() => pick("file", "all")));
  $("add-folder").addEventListener("click", guard(() => pick("folder", "all")));
  $("toggle-url").addEventListener("click", () => { $("url-form").hidden = !$("url-form").hidden; if (!$("url-form").hidden) $("url").focus(); });
  $("url-form").addEventListener("submit", guard(event => {
    event.preventDefault(); const address = M.url($("url").value);
    const added = M.add(board, { url: address, name: $("url-name").value }, M.targetGroup(board));
    if (!added) throw new Error("这个分类内已存在相同网址。");
    $("url-form").reset(); changed();
  }));
  $("manage").addEventListener("click", () => {
    const form = $("group-form"); form.hidden = !form.hidden;
    $("manage").setAttribute("aria-expanded", String(!form.hidden));
    if (!form.hidden) resetGroupForm(board.groups.some(g => g.id === board.active) ? board.active : "");
  });
  $("group-select").addEventListener("change", () => resetGroupForm($("group-select").value));
  $("group-form").addEventListener("submit", guard(event => {
    event.preventDefault();
    const group = M.saveGroup(board, $("group-select").value, $("group-name").value, $("group-mode").value);
    board.active = group.id; selected = null; changed(); resetGroupForm(group.id);
  }));
  for (const [button, offset] of [["group-prev", -1], ["group-next", 1]]) $(button).addEventListener("click", () => {
    const groupId = $("group-select").value, index = board.groups.findIndex(g => g.id === groupId), destination = index + offset;
    if (index < 0 || destination < 0 || destination >= board.groups.length) return;
    board.groups.splice(destination, 0, board.groups.splice(index, 1)[0]); changed(); resetGroupForm(groupId);
  });
  $("group-delete").addEventListener("click", () => { $("confirm-delete").hidden = false; });
  $("confirm-no").addEventListener("click", () => { $("confirm-delete").hidden = true; });
  $("confirm-yes").addEventListener("click", () => { M.deleteGroup(board, $("group-select").value); selected = null; changed(); resetGroupForm(); });
  $("items").addEventListener("keydown", event => {
    if (!ready || event.target.closest("input,select,button,textarea")) return;
    const items = M.visible(board), index = items.findIndex(item => item.id === selected);
    if (["ArrowDown", "ArrowUp"].includes(event.key)) {
      event.preventDefault(); const next = index < 0 ? (event.key === "ArrowDown" ? 0 : items.length - 1) : Math.max(0, Math.min(items.length - 1, index + (event.key === "ArrowDown" ? 1 : -1)));
      if (items[next]) { selectItem(items[next].id); document.getElementById(`shortcut-${items[next].id}`).scrollIntoView({ block: "nearest" }); }
    } else if (event.key === "Enter" && selected) { event.preventDefault(); launch(items[index]); }
    else if (["Delete", "Backspace"].includes(event.key) && selected) { event.preventDefault(); removeItem(selected); }
  });
  $("tabs").addEventListener("wheel", event => {
    if (!settings.multiRow && $("tabs").scrollWidth > $("tabs").clientWidth && Math.abs(event.deltaY) > Math.abs(event.deltaX)) { event.preventDefault(); $("tabs").scrollLeft += event.deltaY; }
  }, { passive: false });
  document.addEventListener("dragover", event => {
    if (!ready || dragging) return;
    event.preventDefault(); document.body.classList.add("drag-over");
  });
  document.addEventListener("dragleave", event => { if (!event.relatedTarget) document.body.classList.remove("drag-over"); });
  document.addEventListener("drop", guard(async event => {
    event.preventDefault(); document.body.classList.remove("drag-over");
    if (!ready || dragging) return;
    const group = M.targetGroup(board), transfer = event.dataTransfer;
    if (transfer.files.length) {
      const paths = await widget.shell.paths(transfer.files); addMany(paths.map(path => ({ path })), group);
    } else {
      const raw = transfer.getData("text/uri-list") || transfer.getData("text/plain");
      const links = raw.split(/\r?\n/).map(value => value.trim()).filter(value => /^https?:\/\//i.test(value));
      if (!links.length) throw new Error("请拖入文件、文件夹或 HTTP/HTTPS 网址。");
      addMany(links.map(address => ({ url: address })), group);
    }
  }));
  widget.settings.onChange(next => {
    settings = { ...defaults, ...next };
    if (!ready) { render(); return; }
    const previous = board.active; fixActive(); if (board.active !== previous) { selected = null; save(); }
    render();
  });
  render(); load();
})();
