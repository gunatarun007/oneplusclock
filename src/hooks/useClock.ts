import { useState, useEffect } from 'react';

export interface ClockState {
  firstHourDigit: string;
  restHourDigits: string;
  minutes: string;
  seconds: string;
  ampm: string;
  dayName: string; // e.g. "Friday"
  dayShort: string; // e.g. "Fri"
  monthName: string; // e.g. "October"
  monthShort: string; // e.g. "Oct"
  dayNum: string; // e.g. "26"
  dateShort: string; // e.g. "Oct 26, Fri"
  dateWithMonth: string; // e.g. "October 26"
  dateWeatherFormat: string; // e.g. "Oct 26"
}

const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const DAYS_FULL = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatClockState(now: Date, use24Hour: boolean): ClockState {
  let hours = now.getHours();
  let ampm = '';

  if (!use24Hour) {
    ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) hours = 12;
  }

  const hourStr = use24Hour ? hours.toString().padStart(2, '0') : hours.toString();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  const firstHourDigit = hourStr.charAt(0);
  const restHourDigits = hourStr.slice(1);

  const dayOfWeek = now.getDay();
  const monthIdx = now.getMonth();
  const dayOfMonth = now.getDate();

  const dayName = DAYS_FULL[dayOfWeek];
  const dayShort = DAYS_SHORT[dayOfWeek];
  const monthName = MONTHS_FULL[monthIdx];
  const monthShort = MONTHS_SHORT[monthIdx];
  const dayNum = dayOfMonth.toString();

  // Reference formats: "Oct 26, Fri", "October 26", "Oct 26"
  const dateShort = `${monthShort} ${dayNum}, ${dayShort}`;
  const dateWithMonth = `${monthName} ${dayNum}`;
  const dateWeatherFormat = `${monthShort} ${dayNum}`;

  return {
    firstHourDigit,
    restHourDigits,
    minutes,
    seconds,
    ampm,
    dayName,
    dayShort,
    monthName,
    monthShort,
    dayNum,
    dateShort,
    dateWithMonth,
    dateWeatherFormat
  };
}

export function useClock(use24Hour = true, showSeconds = false): ClockState {
  const [clockState, setClockState] = useState<ClockState>(() =>
    formatClockState(new Date(), use24Hour)
  );

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;

    const scheduleNextTick = () => {
      const now = new Date();
      setClockState(formatClockState(now, use24Hour));

      if (showSeconds) {
        // Next exact second
        const msUntilNextSecond = 1000 - now.getMilliseconds();
        timerId = setTimeout(scheduleNextTick, Math.max(10, msUntilNextSecond));
      } else {
        // Next exact minute: calculate milliseconds until s=00 and ms=000
        const msUntilNextMinute =
          (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
        timerId = setTimeout(
          scheduleNextTick,
          Math.max(100, msUntilNextMinute)
        );
      }
    };

    scheduleNextTick();

    return () => {
      clearTimeout(timerId);
    };
  }, [use24Hour, showSeconds]);

  return clockState;
}
