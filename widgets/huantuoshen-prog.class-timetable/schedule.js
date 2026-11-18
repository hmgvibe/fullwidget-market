const ClassSchedule = (() => {
  const dayMs = 86400000;
  const zoneMs = 8 * 3600000;
  const dayOf = epoch => Math.floor((epoch + zoneMs) / dayMs);
  const weekday = day => ((day + 3) % 7 + 7) % 7 + 1;
  const dateLabel = day => new Date(day * dayMs).toISOString().slice(5, 10).replace('-', '/');
  const weekdayLabel = day => `周${'一二三四五六日'[weekday(day) - 1]}`;

  function relativeDay(day, today) {
    const distance = day - today;
    if (distance === 0) return '今天';
    if (distance === 1) return '明天';
    if (distance === 2) return '后天';
    if (distance > 2 && distance <= 7) return `${weekday(today) + distance > 7 ? '下' : '本'}${weekdayLabel(day)}`;
    return `${dateLabel(day)} ${weekdayLabel(day)}`;
  }

  function timeParts(time) {
    const [hour, minute] = time.split(':');
    return { period: Number(hour) < 12 ? '上午' : '下午', clock: `${Number(hour) % 12 || 12}:${minute}` };
  }

  function formatTime(time, format) {
    if (format === '24h') return time;
    const { period, clock } = timeParts(time);
    return `${period} ${clock}`;
  }

  function formatRange(start, end, format) {
    if (format === '24h') return `${start}–${end}`;
    const first = timeParts(start);
    const last = timeParts(end);
    return `${first.period} ${first.clock}–${last.period === first.period ? '' : `${last.period} `}${last.clock}`;
  }

  function parseTime(value) {
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) throw new Error(`无效的节次时间：${value}`);
    const [hour, minute] = value.split(':').map(Number);
    return (hour * 60 + minute) * 60000;
  }

  function expand({ courses, timeSlots, config }) {
    const first = Date.parse(`${config.semesterStartDate}T00:00:00+08:00`);
    if (!Number.isFinite(first) || weekday(dayOf(first)) !== 1 || config.firstDayOfWeek !== 1) {
      throw new Error('课表需从周一开始');
    }
    const slots = new Map(timeSlots.map(slot => [slot.number, slot]));
    const events = courses.flatMap((course, index) => {
      const startTime = course.isCustomTime ? course.customStartTime : slots.get(course.startSection)?.startTime;
      const endTime = course.isCustomTime ? course.customEndTime : slots.get(course.endSection)?.endTime;
      const startOffset = parseTime(startTime);
      const endOffset = parseTime(endTime);
      if (endOffset <= startOffset || !Number.isInteger(course.day) || course.day < 1 || course.day > 7) {
        throw new Error(`课程日期或时间无效：${course.name}`);
      }
      return [...new Set(course.weeks)].map(week => {
        if (!Number.isInteger(week) || week < 1 || week > config.semesterTotalWeeks) throw new Error(`无效教学周：${week}`);
        const midnight = first + ((week - 1) * 7 + course.day - 1) * dayMs;
        return { ...course, key: `${week}-${index}`, dayNumber: dayOf(midnight), start: midnight + startOffset, end: midnight + endOffset, startTime, endTime };
      });
    }).sort((left, right) => left.start - right.start);
    return { firstDay: dayOf(first), weeks: config.semesterTotalWeeks, events };
  }

  function upcomingAlerts(events, now, lead) {
    return events.map(event => ({ event, at: event.start - lead * 60000 }))
      .filter(({ at }) => at > now && at <= now + 7 * dayMs - 60000)
      .slice(0, 20);
  }

  return { dayOf, weekday, dateLabel, weekdayLabel, relativeDay, formatTime, formatRange, expand, upcomingAlerts };
})();
