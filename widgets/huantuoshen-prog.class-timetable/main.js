const byId = id => document.getElementById(id);
const dayNames = ['一', '二', '三', '四', '五', '六', '日'];
const bellKey = 'class-timetable-bell';
const scheduleKey = 'class-timetable-import-v1';
let schedule;
let selectedDay;
let followToday = true;
let lastRenderedDay;
let lastRenderedToday;
let lastRenderedFormat;
let visibleDays = 1;
let lastTick = Date.now();
let nextRefresh = 0;
let syncing = false;
let queued = false;
let reminderSignature;
let audioContext;
let customPlayer;
let soundStatus = '';
let reminderStatus = '';

function preferences() {
  const settings = widget.settings.get();
  const lead = Number(settings.lead ?? 10);
  return { notify: settings.notify !== false, sound: settings.sound === true, lead: Number.isInteger(lead) && lead >= 0 && lead <= 120 ? lead : 10, clockFormat: settings.use24Hour === true ? '24h' : '12h' };
}

function updateStatus() {
  byId('status').textContent = [reminderStatus, soundStatus].filter(Boolean).join(' · ');
}

function columnsForWidth(width) {
  return width < 290 ? 1 : Math.max(2, Math.floor((width + 8) / 165));
}

function showDay(day, today, clockFormat) {
  const monday = day - ClassSchedule.weekday(day) + 1;
  const week = Math.floor((monday - schedule.firstDay) / 7) + 1;
  const term = week < 1 ? '学期未开始' : week > schedule.weeks ? '学期已结束' : `第 ${week} 周`;
  byId('week').textContent = `${term} · ${ClassSchedule.dateLabel(monday)}–${ClassSchedule.dateLabel(monday + 6)}`;
  byId('today').hidden = day === today;
  byId('days').replaceChildren(...dayNames.map((name, index) => {
    const date = monday + index;
    const button = document.createElement('button');
    button.setAttribute('aria-pressed', String(date === day));
    if (date === today) button.setAttribute('aria-current', 'date');
    button.setAttribute('aria-label', `${ClassSchedule.dateLabel(date)} 星期${name}${date === today ? '，今天' : ''}`);
    const label = document.createElement('span');
    label.className = 'date';
    label.textContent = ClassSchedule.dateLabel(date).split('/')[1];
    button.append(name, label);
    button.onclick = () => selectDay(date);
    return button;
  }));

  const lessons = byId('lessons');
  lessons.style.setProperty('--visible-days', visibleDays);
  lessons.replaceChildren(...Array.from({ length: visibleDays }, (_, offset) => {
    const date = day + offset;
    const column = document.createElement('section');
    column.className = 'day-column';
    const heading = document.createElement('h2');
    heading.textContent = date >= today && date <= today + 2 ? ClassSchedule.relativeDay(date, today) : ClassSchedule.weekdayLabel(date);
    const dateText = document.createElement('span');
    dateText.textContent = ClassSchedule.dateLabel(date);
    heading.append(dateText);
    const events = schedule.events.filter(event => event.dayNumber === date);
    column.append(heading);
    if (events.length) column.append(...events.map(event => makeLesson(event, clockFormat)));
    else {
      const empty = document.createElement('p');
      empty.className = 'empty';
      empty.textContent = '无课';
      column.append(empty);
    }
    return column;
  }));
  if (day !== lastRenderedDay) lessons.scrollTop = 0;
  lastRenderedDay = day;
  lastRenderedToday = today;
  lastRenderedFormat = clockFormat;
}

function makeLesson(event, clockFormat) {
  const row = document.createElement('article');
  row.className = 'lesson';
  const time = document.createElement('span');
  time.className = 'time';
  time.title = ClassSchedule.formatRange(event.startTime, event.endTime, clockFormat);
  time.textContent = visibleDays === 1 ? time.title : ClassSchedule.formatTime(event.startTime, clockFormat);
  const content = document.createElement('div');
  const name = document.createElement('div');
  name.className = 'name';
  name.textContent = event.name;
  name.title = event.name;
  const details = document.createElement('div');
  details.className = 'details';
  details.textContent = [event.position, event.teacher, event.remark].filter(Boolean).join(' · ');
  details.title = details.textContent;
  content.append(name, details);
  row.append(time, content);
  return row;
}

function render(now) {
  const loaded = Boolean(schedule);
  byId('empty-schedule').hidden = loaded;
  byId('upcoming').hidden = !loaded;
  document.querySelector('.calendar').hidden = !loaded;
  byId('lessons').hidden = !loaded;
  byId('status').parentElement.hidden = !loaded;
  if (!loaded) return;
  const today = ClassSchedule.dayOf(now);
  const { clockFormat } = preferences();
  if (followToday) selectedDay = today;
  if (selectedDay !== lastRenderedDay || today !== lastRenderedToday || clockFormat !== lastRenderedFormat) showDay(selectedDay, today, clockFormat);
  const active = schedule.events.find(event => event.start <= now && now < event.end);
  const next = schedule.events.find(event => event.start > now);
  const browsing = selectedDay !== today;
  const minutes = next ? Math.ceil((next.start - now) / 60000) : 0;
  const countdown = minutes < 60 ? `${minutes} 分钟后` : minutes < 1440 ? `${Math.floor(minutes / 60)} 小时 ${minutes % 60} 分钟后` : '';
  const when = next ? `${ClassSchedule.relativeDay(next.dayNumber, today)} ${ClassSchedule.formatTime(next.startTime, clockFormat)}` : '';
  const activeText = active ? `上课中 · ${active.name} · 还剩 ${Math.ceil((active.end - now) / 60000)} 分钟` : '';
  const upcoming = byId('upcoming');
  upcoming.hidden = false;
  upcoming.classList.toggle('compact', browsing);
  byId('next-name').textContent = next?.name ?? '本学期没有后续课程';
  byId('next-name').title = next?.name ?? '';
  byId('next-time').textContent = [when, countdown].filter(Boolean).join(' · ');
  byId('next-time').hidden = !next;
  byId('next-room').textContent = next?.position ?? '';
  byId('next-room').hidden = !next?.position;
  byId('active-class').textContent = activeText;
  byId('active-class').hidden = !active;
  const summary = byId('live-summary');
  summary.hidden = !browsing;
  summary.textContent = activeText || (next ? `下节课 · ${when} · ${next.name}` : '本学期没有后续课程');
  summary.title = summary.textContent;
}

function selectDay(day) {
  selectedDay = day;
  followToday = day === ClassSchedule.dayOf(Date.now());
  render(Date.now());
}

async function syncReminders() {
  queued = true;
  if (syncing) return;
  syncing = true;
  try {
    while (queued) {
      queued = false;
      const { notify, lead, clockFormat } = preferences();
      const alerts = notify && schedule ? ClassSchedule.upcomingAlerts(schedule.events, Date.now(), lead) : [];
      const signature = JSON.stringify([notify, lead, clockFormat, alerts.map(({ event, at }) => [event.key, event.name, event.position, event.start, event.end, at])]);
      if (signature === reminderSignature) continue;
      if (notify && !widget.permissions.includes('notify')) {
        reminderStatus = '等待通知授权';
      } else if (widget.permissions.includes('notify')) {
        await widget.notify.cancel();
        for (const { event, at } of alerts) {
          if (at <= Date.now()) continue;
          await widget.notify({
            title: `上课提醒：${event.name}`,
            body: `${ClassSchedule.formatRange(event.startTime, event.endTime, clockFormat)}${event.position ? ` · ${event.position}` : ''}`,
            at,
            tag: `class-${event.key}`
          });
        }
        reminderStatus = notify ? `提醒 ${lead} 分钟前 · ${alerts.length} 条` : '通知已关闭';
        reminderSignature = signature;
      } else {
        reminderStatus = '通知已关闭';
      }
      updateStatus();
    }
  } catch (error) {
    reminderStatus = '通知预约失败';
    updateStatus();
    widget.log(String(error));
  } finally {
    syncing = false;
  }
}

async function playBell() {
  try {
    const saved = await widget.storage.get(bellKey);
    if (saved) {
      customPlayer ??= new Audio();
      if (customPlayer.src !== saved) customPlayer.src = saved;
      customPlayer.currentTime = 0;
      await customPlayer.play();
    } else {
      audioContext ??= new AudioContext();
      await audioContext.resume();
      const start = audioContext.currentTime;
      [659, 784, 988].forEach((frequency, index) => {
        const at = start + index * .18;
        const tone = audioContext.createOscillator();
        const volume = audioContext.createGain();
        tone.frequency.value = frequency;
        volume.gain.setValueAtTime(.12, at);
        volume.gain.exponentialRampToValueAtTime(.001, at + .25);
        tone.connect(volume).connect(audioContext.destination);
        tone.start(at);
        tone.stop(at + .25);
      });
    }
    soundStatus = '';
  } catch {
    soundStatus = '铃声播放失败';
  }
  updateStatus();
}

function tick() {
  const now = Date.now();
  if (now - lastTick > 45000 || now >= nextRefresh) {
    nextRefresh = now + 60000;
    void syncReminders();
  }
  const { sound, lead } = preferences();
  if (sound && schedule?.events.some(({ start, end }) => {
    const at = start - lead * 60000;
    return lastTick < at && at <= now && now - at < 20000 && now < end;
  })) void playBell();
  lastTick = now;
  render(now);
}

function setImportStatus(message) {
  byId('import-status').textContent = message;
  byId('empty-import-status').textContent = message;
}

function importLabel(data) {
  return [`已导入 ${data.events.length} 个上课时段`, data.notice].filter(Boolean).join(' · ');
}

async function loadSchedule() {
  try {
    const stored = await widget.storage.get(scheduleKey);
    if (stored?.events?.length && Number.isInteger(stored.firstDay) && Number.isInteger(stored.weeks)) {
      schedule = stored;
      setImportStatus(importLabel(stored));
      return;
    }
  } catch (error) {
    widget.log(String(error));
  }
}

function bindImport() {
  const picker = byId('schedule-file');
  const buttons = [byId('import-first'), byId('import-schedule')];
  picker.accept = TimetableImport.formats;
  buttons.forEach(button => { button.onclick = () => picker.click(); });
  picker.onchange = async () => {
    const [file] = picker.files;
    picker.value = '';
    if (!file) return;
    buttons.forEach(button => { button.disabled = true; });
    setImportStatus('正在读取课表…');
    try {
      if (file.size > TimetableImport.maxFile) throw new Error('课表文件大小须在 2 MB 以内');
      const replacement = TimetableImport.parse(file.name, await file.arrayBuffer());
      await widget.storage.set(scheduleKey, replacement);
      const firstImport = !schedule;
      schedule = replacement;
      followToday = true;
      selectedDay = ClassSchedule.dayOf(Date.now());
      lastRenderedDay = undefined;
      lastTick = Date.now();
      setImportStatus(importLabel(replacement));
      render(lastTick);
      if (firstImport) byId('sound-tools').showPopover();
      void syncReminders();
    } catch (error) {
      setImportStatus(`导入失败：${error instanceof SyntaxError ? '文件结构无效' : error.message}`);
    } finally {
      buttons.forEach(button => { button.disabled = false; });
    }
  };
}

async function init() {
  await loadSchedule();
  bindImport();
  byId('prev').onclick = () => selectDay(selectedDay - 7);
  byId('next').onclick = () => selectDay(selectedDay + 7);
  byId('today').onclick = () => selectDay(ClassSchedule.dayOf(Date.now()));
  byId('test').onclick = playBell;
  byId('choose').onclick = () => byId('file').click();
  byId('reset').hidden = !(await widget.storage.get(bellKey));
  byId('reset').onclick = async () => {
    customPlayer?.pause();
    await widget.storage.remove(bellKey);
    byId('reset').hidden = true;
    void playBell();
  };
  byId('file').onchange = () => {
    const [file] = byId('file').files;
    byId('file').value = '';
    if (!file) return;
    if (!/\.(mp3|wav|ogg)$/i.test(file.name) || file.size > 1048576) {
      soundStatus = '铃声须为 MP3、WAV 或 OGG，最多 1 MB';
      updateStatus();
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const format = { mp3: 'mpeg', wav: 'wav', ogg: 'ogg' }[file.name.split('.').pop().toLowerCase()];
        await widget.storage.set(bellKey, reader.result.replace(/^data:[^;]*/, `data:audio/${format}`));
        byId('reset').hidden = false;
        void playBell();
      } catch {
        soundStatus = '铃声保存失败';
        updateStatus();
      }
    };
    reader.onerror = () => {
      soundStatus = '铃声读取失败';
      updateStatus();
    };
    reader.readAsDataURL(file);
  };
  widget.settings.onChange(() => {
    render(Date.now());
    void syncReminders();
  });
  const card = byId('card');
  visibleDays = columnsForWidth(card.clientWidth);
  tick();
  new ResizeObserver(([entry]) => {
    const count = columnsForWidth(entry.contentRect.width);
    if (count === visibleDays) return;
    visibleDays = count;
    if (schedule) showDay(selectedDay, ClassSchedule.dayOf(Date.now()), preferences().clockFormat);
  }).observe(card);
  setInterval(tick, 5000);
}

void init().catch(error => {
  byId('status').textContent = String(error.message || error);
  widget.log(String(error));
});
