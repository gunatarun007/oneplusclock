import React, { useState, useEffect } from 'react';

export interface LiveClockProps {
  live?: boolean;
  timeString?: string;
  variant?: 'day-clock' | 'horizontal' | 'vertical' | 'compact';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'giant';
  showSeconds?: boolean;
  showDay?: boolean;
  showDate?: boolean;
  dayText?: string;
  dateText?: string;
}

const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_FULL = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export const LiveClock: React.FC<LiveClockProps> = ({
  live = true,
  timeString = '19:48',
  variant = 'day-clock',
  className = '',
  size = 'lg',
  showSeconds = false,
  showDay = true,
  showDate = true,
  dayText,
  dateText,
}) => {
  const [hours, setHours] = useState(() => {
    const parts = timeString.includes(':') ? timeString.split(':') : ['19', '48'];
    return parts[0] || '19';
  });
  const [minutes, setMinutes] = useState(() => {
    const parts = timeString.includes(':') ? timeString.split(':') : ['19', '48'];
    return parts[1] || '48';
  });
  const [seconds, setSeconds] = useState('00');
  const [currentDay, setCurrentDay] = useState(dayText || 'Friday');
  const [currentDateWithMonth, setCurrentDateWithMonth] = useState(dateText || 'October 26');

  useEffect(() => {
    if (!live) return;

    const updateDateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');

      setHours(h);
      setMinutes(m);
      setSeconds(s);

      if (!dayText) {
        setCurrentDay(DAYS_FULL[now.getDay()]);
      }
      if (!dateText) {
        setCurrentDateWithMonth(`${MONTHS_FULL[now.getMonth()]} ${now.getDate()}`);
      }
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, showSeconds ? 1000 : 1000);
    return () => clearInterval(interval);
  }, [live, showSeconds, dayText, dateText]);

  const firstHourDigit = hours ? hours.charAt(0) : '1';
  const restHourDigits = hours ? hours.slice(1) : '9';

  // Typography size scales
  const sizeClasses = {
    sm: 'text-4xl sm:text-5xl',
    md: 'text-5xl sm:text-6xl',
    lg: 'text-6xl sm:text-7xl md:text-8xl lg:text-[92px]',
    xl: 'text-7xl sm:text-8xl md:text-9xl',
    giant: 'text-8xl sm:text-9xl md:text-[140px] lg:text-[160px]',
  };

  const labelSizeClasses = {
    sm: 'text-xs sm:text-sm',
    md: 'text-sm sm:text-base',
    lg: 'text-base sm:text-lg md:text-xl',
    xl: 'text-lg sm:text-xl md:text-2xl',
    giant: 'text-xl sm:text-2xl md:text-3xl',
  };

  const fontClass = `font-bold tracking-tighter leading-none select-none ${sizeClasses[size] || sizeClasses.lg}`;
  const labelClass = `font-medium tracking-tight select-none ${labelSizeClasses[size] || labelSizeClasses.lg}`;

  // 1. Day + Clock (Matches desktop app's VariantDayClock)
  if (variant === 'day-clock') {
    return (
      <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
        {/* Day Label on Top */}
        {showDay && (
          <div className={`${labelClass} text-white/90 mb-2 sm:mb-3`}>
            {currentDay}
          </div>
        )}

        {/* Time Display with Iconic Red Accent */}
        <div className={`flex items-baseline justify-center ${fontClass}`}>
          <span className="text-[#E92828] drop-shadow-sm">{firstHourDigit}</span>
          <span className="text-white">{restHourDigits}</span>
          <span className="text-white mx-0.5 sm:mx-1 opacity-90">:</span>
          <span className="text-white">{minutes}</span>
          {showSeconds && (
            <span className="text-white/70 text-[0.45em] ml-1.5 font-normal">
              :{seconds}
            </span>
          )}
        </div>

        {/* Date Label on Bottom */}
        {showDate && (
          <div className={`${labelClass} text-white/75 font-normal mt-2 sm:mt-3`}>
            {currentDateWithMonth}
          </div>
        )}
      </div>
    );
  }

  // 2. Vertical Stacked (Matches desktop app's VariantVertical)
  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
        {showDate && (
          <div className={`${labelClass} text-white/75 font-normal mb-2`}>
            {currentDateWithMonth}
          </div>
        )}
        <div className="flex flex-col items-center font-bold tracking-tighter leading-[0.85] text-6xl sm:text-7xl md:text-8xl">
          <div className="flex items-baseline">
            <span className="text-[#E92828]">{firstHourDigit}</span>
            <span className="text-white">{restHourDigits}</span>
          </div>
          <div className="text-white">
            {minutes}
          </div>
        </div>
      </div>
    );
  }

  // 3. Compact / Horizontal (Matches desktop app's VariantHorizontal / VariantCompact)
  return (
    <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
      <div className={`flex items-baseline justify-center ${fontClass}`}>
        <span className="text-[#E92828] drop-shadow-sm">{firstHourDigit}</span>
        <span className="text-white">{restHourDigits}</span>
        <span className="text-white mx-0.5 sm:mx-1 opacity-90">:</span>
        <span className="text-white">{minutes}</span>
      </div>
      {showDate && (
        <div className={`${labelClass} text-neutral-300 mt-2`}>
          {currentDay}, {currentDateWithMonth}
        </div>
      )}
    </div>
  );
};
