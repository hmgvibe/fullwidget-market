const TimetableImport = (() => {
  const dayMs = 86400000;
  const zoneMs = 28800000;
  const maxEvents = 5000;
  const maxWeeks = 104;
  const maxFile = 2 * 1024 * 1024;
  const formats = '.json,.wakeup_schedule,.ics,.csv,.tsv,.xlsx,.xls';
  const text = value => typeof value === 'string' || typeof value === 'number' ? String(value).trim().slice(0, 300) : '';
  const monday = day => day - ClassSchedule.weekday(day) + 1;

  function dateDay(value) {
    const parts = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/.exec(text(value));
    if (parts) {
      const date = `${parts[1]}-${parts[2].padStart(2, '0')}-${parts[3].padStart(2, '0')}`;
      const timestamp = Date.parse(`${date}T00:00:00Z`);
      if (Number.isFinite(timestamp) && new Date(timestamp).toISOString().startsWith(date)) return timestamp / dayMs;
    }
    throw new Error('日期须为有效的 yyyy-mm-dd');
  }

  function time(value) {
    if (typeof value === 'number' && value >= 0 && value < 1) {
      const minutes = Math.min(1439, Math.round(value * 1440));
      return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
    }
    const parts = /^(\d{1,2}):([0-5]\d)(?::[0-5]\d)?$/.exec(text(value));
    if (!parts || Number(parts[1]) > 23) throw new Error('时间须为 24 小时制 HH:mm');
    return `${parts[1].padStart(2, '0')}:${parts[2]}`;
  }

  function finish(events, firstDay, weeks, notice = '') {
    if (!events.length) throw new Error('没有可导入的课程');
    if (events.length > maxEvents) throw new Error(`最多导入 ${maxEvents} 个上课时段`);
    events.sort((left, right) => left.start - right.start);
    firstDay ??= monday(events[0].dayNumber);
    weeks ??= Math.floor((events.at(-1).dayNumber - firstDay) / 7) + 1;
    return { firstDay, weeks, events, notice };
  }

  function weekly(data, alignMonday = false) {
    const { courses, timeSlots, config } = data ?? {};
    if (!Array.isArray(courses) || !Array.isArray(timeSlots) || !config) throw new Error('课表缺少课程、节次或学期设置');
    const first = dateDay(config.semesterStartDate);
    const firstDay = alignMonday ? monday(first) : first;
    const weeks = config.semesterTotalWeeks;
    if (!Number.isInteger(weeks) || weeks < 1 || weeks > maxWeeks) throw new Error(`学期周数须为 1–${maxWeeks}`);
    let count = 0;
    const cleanCourses = courses.map((course, index) => {
      if (!text(course?.name) || !Array.isArray(course.weeks) || !course.weeks.length) throw new Error(`第 ${index + 1} 条课程缺少名称或周次`);
      count += new Set(course.weeks).size;
      if (count > maxEvents) throw new Error(`最多导入 ${maxEvents} 个上课时段`);
      const { day, weeks, startSection, endSection, isCustomTime, customStartTime, customEndTime } = course;
      return { name: text(course.name), position: text(course.position), teacher: text(course.teacher), remark: text(course.remark), day, weeks, startSection, endSection, isCustomTime, customStartTime, customEndTime };
    });
    const expanded = ClassSchedule.expand({ courses: cleanCourses, timeSlots, config: { ...config, semesterStartDate: new Date(firstDay * dayMs).toISOString().slice(0, 10) } });
    return finish(expanded.events, expanded.firstDay, expanded.weeks);
  }

  function wakeup(source) {
    const lines = source.trim().split(/\r?\n/);
    if (lines.length !== 5) throw new Error('须选择 WakeUp 的五行备份文件');
    const [, periods, config, names, rows] = lines.map(line => JSON.parse(line));
    if (!Array.isArray(periods) || !Array.isArray(names) || !Array.isArray(rows) || !config) throw new Error('WakeUp 备份结构无效');
    const info = new Map(names.map(course => [course.id, course]));
    const courses = rows.map(row => {
      const { startWeek, endWeek, type = 0, startNode, step } = row;
      if (!Number.isInteger(startWeek) || !Number.isInteger(endWeek) || startWeek < 1 || endWeek < startWeek || endWeek > maxWeeks || ![0, 1, 2].includes(type) || !Number.isInteger(step) || step < 1) throw new Error('WakeUp 周次或节次无效');
      const course = info.get(row.id);
      const weeks = Array.from({ length: endWeek - startWeek + 1 }, (_, index) => startWeek + index).filter(week => !type || week % 2 === type % 2);
      return { name: course?.courseName, position: row.room, teacher: row.teacher, remark: course?.note, day: row.day, weeks,
        startSection: startNode, endSection: startNode + step - 1, isCustomTime: row.ownTime,
        customStartTime: row.ownTime ? time(row.startTime) : undefined, customEndTime: row.ownTime ? time(row.endTime) : undefined };
    });
    const timeSlots = periods.map(period => ({ number: period.node, startTime: time(period.startTime), endTime: time(period.endTime) }));
    return weekly({ courses, timeSlots, config: { semesterStartDate: config.startDate, semesterTotalWeeks: config.maxWeek, firstDayOfWeek: 1 } }, true);
  }

  function timed(start, end, fields, key) {
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) throw new Error('结束时间须晚于开始时间');
    const clock = timestamp => new Date(timestamp + zoneMs).toISOString().slice(11, 16);
    return { ...fields, key, start, end, dayNumber: ClassSchedule.dayOf(start), startTime: clock(start), endTime: clock(end) };
  }

  function decode(bytes) {
    try { return new TextDecoder('utf-8', { fatal: true }).decode(bytes); }
    catch { return new TextDecoder('gb18030', { fatal: true }).decode(bytes); }
  }

  function tabular(rows, excel) {
    const first = rows.findIndex(row => row.some(value => text(value)));
    if (first < 0) throw new Error('表格为空');
    const headers = rows[first].map(value => text(value).toLowerCase());
    const column = (...labels) => headers.findIndex(header => labels.includes(header));
    const date = column('日期', '上课日期', 'date');
    const start = column('开始时间', '上课时间', 'start', 'starttime', 'start_time');
    const end = column('结束时间', '下课时间', 'end', 'endtime', 'end_time');
    const name = column('课程名', '课程名称', '课程', 'name', 'course');
    const room = column('教室', '地点', '教学地点', 'room', 'location', 'position');
    const teacher = column('老师', '教师', '任课教师', 'teacher');
    const remark = column('备注', 'remark', 'note');
    if ([date, start, end, name].includes(-1)) throw new Error('表头须含日期、开始时间、结束时间、课程名');
    const events = [];
    rows.slice(first + 1).forEach((row, index) => {
      if (!row.some(value => text(value))) return;
      try {
        const course = text(row[name]);
        if (!course) throw new Error('缺少课程名');
        let value = row[date];
        if (excel && typeof value === 'number') {
          const parts = XLSX.SSF.parse_date_code(value, excel);
          if (parts) value = `${parts.y}-${parts.m}-${parts.d}`;
        }
        const day = dateDay(value);
        const startTime = time(row[start]);
        const endTime = time(row[end]);
        const iso = new Date(day * dayMs).toISOString().slice(0, 10);
        events.push(timed(Date.parse(`${iso}T${startTime}:00+08:00`), Date.parse(`${iso}T${endTime}:00+08:00`), {
          name: course, position: text(row[room]), teacher: text(row[teacher]), remark: text(row[remark])
        }, `row-${index}`));
      } catch (error) {
        throw new Error(`表格第 ${first + index + 2} 行：${error.message}`);
      }
    });
    return finish(events);
  }

  function calendar(source, now) {
    const root = new ICAL.Component(ICAL.parse(source));
    if (root.name !== 'vcalendar') throw new Error('不是有效的 ICS 日历');
    const components = root.getAllSubcomponents('vevent');
    const zones = new Set(root.getAllSubcomponents('vtimezone').map(zone => zone.getFirstPropertyValue('tzid')));
    const related = new Map();
    const events = [];
    const today = ClassSchedule.dayOf(now);
    let scans = 0;
    let skippedAllDay = false;
    let limited = false;

    function epoch(value, item, property, fallback) {
      if (!value) throw new Error('日历缺少日期或时间');
      if (value.zone.tzid !== 'floating') return value.toUnixTime() * 1000;
      const zone = item.component.getFirstProperty(property)?.getParameter('tzid') ?? fallback;
      if (zone && !zones.has(zone) && !['Asia/Shanghai', 'Asia/Chongqing', 'Asia/Chungking', 'PRC'].includes(zone)) throw new Error(`ICS 缺少时区定义：${zone}`);
      return value.toUnixTime() * 1000 - zoneMs;
    }

    for (const component of components) {
      if (!component.hasProperty('recurrence-id')) continue;
      const uid = component.getFirstPropertyValue('uid');
      if (!related.has(uid)) related.set(uid, []);
      related.get(uid).push(new ICAL.Event(component, { strictExceptions: true }));
    }
    for (const component of components) {
      if (component.hasProperty('recurrence-id') || component.getFirstPropertyValue('status') === 'CANCELLED') continue;
      const item = new ICAL.Event(component, { exceptions: related.get(component.getFirstPropertyValue('uid')) ?? [] });
      if (!item.startDate) throw new Error('日历事件缺少开始时间');
      if (item.startDate.isDate) {
        skippedAllDay = true;
        continue;
      }
      const defaultZone = component.getFirstProperty('dtstart')?.getParameter('tzid');
      const rule = component.getFirstPropertyValue('rrule');
      const endless = rule && !rule.count && !rule.until;
      const limit = Math.max(today, ClassSchedule.dayOf(epoch(item.startDate, item, 'dtstart'))) + 365;
      const iterator = item.isRecurring() ? item.iterator() : null;
      const exclusions = component.getAllProperties('exdate').flatMap(property => property.getValues());
      for (let occurrence = iterator ? iterator.next() : item.startDate; occurrence; occurrence = iterator?.next()) {
        if (++scans > 20000 || events.length > maxEvents) throw new Error('日历重复事件过多，请缩短导出范围');
        if (endless) {
          const day = ClassSchedule.dayOf(epoch(occurrence, item, 'dtstart'));
          if (day > limit) { limited = true; break; }
          if (day < today - 31) continue;
        }
        if (exclusions.some(date => date.compare(occurrence) === 0)) continue;
        const details = iterator ? item.getOccurrenceDetails(occurrence) : { item, startDate: item.startDate, endDate: item.endDate };
        const event = details.item;
        if (event.component.getFirstPropertyValue('status') === 'CANCELLED') continue;
        if (details.startDate?.isDate) { skippedAllDay = true; continue; }
        const start = epoch(details.startDate, event, 'dtstart', defaultZone);
        const end = epoch(details.endDate, event, 'dtend', event.component.getFirstProperty('dtstart')?.getParameter('tzid') ?? defaultZone);
        const name = text(event.summary ?? item.summary);
        if (!name) throw new Error('日历事件缺少标题');
        events.push(timed(start, end, { name, position: text(event.location ?? item.location), teacher: '', remark: text(event.description ?? item.description) }, `ics-${scans}`));
      }
    }
    const notice = [limited && '无限重复事件已按一年截取', skippedAllDay && '已跳过全天事件'].filter(Boolean).join('；');
    return finish(events, undefined, undefined, notice);
  }

  function parse(filename, bytes, now = Date.now()) {
    if (!bytes.byteLength || bytes.byteLength > maxFile) throw new Error('课表文件大小须在 2 MB 以内');
    const extension = filename.split('.').pop().toLowerCase();
    if (extension === 'xlsx' || extension === 'xls') {
      const signature = new Uint8Array(bytes, 0, Math.min(bytes.byteLength, 4)).join(',');
      if (signature !== (extension === 'xlsx' ? '80,75,3,4' : '208,207,17,224')) throw new Error('Excel 文件格式无效');
      const book = XLSX.read(new Uint8Array(bytes), { type: 'array', sheets: 0, sheetRows: maxEvents + 2 });
      const sheet = book.Sheets[book.SheetNames[0]];
      if (!sheet) throw new Error('Excel 没有工作表');
      if (sheet['!fullref'] && XLSX.utils.decode_range(sheet['!fullref']).e.r > maxEvents) throw new Error(`Excel 最多读取 ${maxEvents} 行课程，请删除多余行`);
      return tabular(XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: true }), { date1904: !!book.Workbook?.WBProps?.date1904 });
    }
    if (!formats.split(',').includes(`.${extension}`)) throw new Error('不支持该文件类型');
    const source = decode(bytes);
    if (extension === 'json') return weekly(JSON.parse(source));
    if (extension === 'wakeup_schedule') return wakeup(source);
    if (extension === 'ics') return calendar(source, now);
    const result = Papa.parse(source, { delimiter: extension === 'tsv' ? '\t' : ',' });
    if (result.errors.length) throw new Error(`表格分隔符或引号有误（第 ${result.errors[0].row + 1} 行）`);
    return tabular(result.data);
  }

  return { formats, maxFile, parse };
})();
