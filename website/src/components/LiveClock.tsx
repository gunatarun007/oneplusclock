import React, { useState, useEffect } from 'react';
import { WeatherIcon } from './WeatherIcon';

export interface LiveClockProps {
  live?: boolean;
  timeString?: string;
  variant?: 'side-weather' | 'large-info' | 'compact' | 'vertical' | 'horizontal' | 'minimal';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'giant';
  showWeather?: boolean;
  showDay?: boolean;
  showDate?: boolean;
  weatherTemp?: number | string;
  weatherCondition?: string;
  dayText?: string;
  dateText?: string;
}

export const LiveClock: React.FC<LiveClockProps> = ({
  live = false,
  timeString = '19:48',
  variant = 'side-weather',
  className = '',
  size = 'lg',
  showWeather = true,
  showDay = true,
  showDate = true,
  weatherTemp = 26,
  weatherCondition = 'cloudy',
  dayText,
  dateText,
}) => {
  const [time, setTime] = useState(timeString);
  const [currentDay, setCurrentDay] = useState(dayText || 'Friday');
  const [currentDate, setCurrentDate] = useState(dateText || 'Oct 26');
  const [currentDateShort, setCurrentDateShort] = useState('Oct 26, Fri');

  useEffect(() => {
    if (!live) return;

    const updateDateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${minutes}`);

      if (!dayText) {
        setCurrentDay(now.toLocaleDateString('en-US', { weekday: 'long' }));
      }
      if (!dateText) {
        setCurrentDate(now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        const shortDay = now.toLocaleDateString('en-US', { weekday: 'short' });
        const shortMonth = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        setCurrentDateShort(`${shortMonth}, ${shortDay}`);
      }
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, [live, dayText, dateText]);

  const [hours, minutes] = time.includes(':') ? time.split(':') : [time.slice(0, 2), time.slice(2, 4)];
  const firstHourDigit = hours ? hours[0] : '1';
  const secondHourDigit = hours ? hours.slice(1) : '9';

  // Typography size classes
  const sizeClasses = {
    sm: 'text-3xl sm:text-4xl',
    md: 'text-5xl sm:text-6xl',
    lg: 'text-6xl sm:text-7xl md:text-8xl lg:text-[88px]',
    xl: 'text-7xl sm:text-8xl md:text-9xl',
    giant: 'text-8xl sm:text-9xl md:text-[140px] lg:text-[170px]',
  };

  const fontClass = `font-bold tracking-tighter leading-none select-none ${sizeClasses[size] || sizeClasses.lg}`;

  // 1. OxygenOS 5x2 Side-by-Side: Time on left, Weather + Date on right
  if (variant === 'side-weather') {
    return (
      <div className={`flex items-center space-x-5 select-none ${className}`}>
        {/* Big Time with Red Accent */}
        <div className={`flex items-baseline ${fontClass}`}>
          <span className="text-[#E92828] drop-shadow-sm">{firstHourDigit}</span>
          <span className="text-white">{secondHourDigit}:{minutes}</span>
        </div>

        {/* Side Info: Weather & Date */}
        {(showWeather || showDate) && (
          <div className="flex flex-col items-start justify-center space-y-1 pl-1 border-l border-white/10">
            {showWeather && (
              <div className="flex items-center space-x-1.5 text-white text-base sm:text-lg font-semibold tracking-tight">
                <WeatherIcon condition={weatherCondition} className="w-5 h-5 text-white/90" />
                <span>{weatherTemp}°</span>
              </div>
            )}
            {showDate && (
              <div className="text-neutral-400 text-xs sm:text-sm font-medium tracking-tight whitespace-nowrap">
                {currentDateShort}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // 2. Large Information: Day on top, Time in middle, Date + Weather on bottom
  if (variant === 'large-info') {
    return (
      <div className={`flex flex-col items-start select-none ${className}`}>
        {showDay && (
          <span className="text-sm sm:text-base font-semibold text-neutral-400 tracking-tight mb-2">
            {currentDay}
          </span>
        )}
        <div className={`flex items-baseline ${fontClass}`}>
          <span className="text-[#E92828] drop-shadow-sm">{firstHourDigit}</span>
          <span className="text-white">{secondHourDigit}:{minutes}</span>
        </div>
        {(showDate || showWeather) && (
          <div className="flex items-center space-x-2.5 mt-3 text-sm sm:text-base font-medium text-neutral-300">
            {showDate && <span>{currentDate}</span>}
            {showDate && showWeather && <span className="text-neutral-500">•</span>}
            {showWeather && (
              <div className="flex items-center space-x-1.5">
                <WeatherIcon condition={weatherCondition} className="w-4 h-4 text-white/90" />
                <span className="font-semibold text-white">{weatherTemp}°</span>
                <span className="text-neutral-400 capitalize">{weatherCondition}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // 3. Compact: Time on top, Date and Weather side-by-side on bottom
  if (variant === 'compact') {
    return (
      <div className={`flex flex-col items-start select-none ${className}`}>
        <div className={`flex items-baseline ${fontClass}`}>
          <span className="text-[#E92828] drop-shadow-sm">{firstHourDigit}</span>
          <span className="text-white">{secondHourDigit}:{minutes}</span>
        </div>
        <div className="flex items-center space-x-3 mt-2 text-xs sm:text-sm font-medium text-neutral-300">
          {showDate && <span>{currentDateShort}</span>}
          {showWeather && (
            <div className="flex items-center space-x-1">
              <WeatherIcon condition={weatherCondition} className="w-4 h-4 text-white/90" />
              <span className="font-semibold">{weatherTemp}°</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 4. Vertical Stacked: 19 over 48 with weather
  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center justify-center select-none ${className}`}>
        {showDate && (
          <span className="text-xs sm:text-sm font-medium text-neutral-400 mb-1.5">{currentDateShort}</span>
        )}
        {showWeather && (
          <div className="flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-white mb-2">
            <span className="capitalize text-neutral-400">{weatherCondition}</span>
            <WeatherIcon condition={weatherCondition} className="w-4 h-4 text-white/90" />
            <span>{weatherTemp}°</span>
          </div>
        )}
        <div className="flex flex-col items-center font-bold tracking-tighter leading-[0.82]">
          <div className="flex items-baseline">
            <span className="text-[#E92828]">{firstHourDigit}</span>
            <span className="text-white">{secondHourDigit}</span>
          </div>
          <div className="text-white">
            {minutes}
          </div>
        </div>
      </div>
    );
  }

  // Default: Horizontal with clean day + weather underneath
  return (
    <div className={`flex flex-col items-start select-none ${className}`}>
      <div className={`flex items-baseline ${fontClass}`}>
        <span className="text-[#E92828] drop-shadow-sm">{firstHourDigit}</span>
        <span className="text-white">{secondHourDigit}:{minutes}</span>
      </div>
      {(showDay || showDate || showWeather) && (
        <div className="flex items-center space-x-2.5 mt-2.5 text-xs sm:text-sm font-medium text-neutral-300">
          <span>{currentDay}, {currentDate}</span>
          {showWeather && (
            <>
              <span className="text-neutral-500">•</span>
              <div className="flex items-center space-x-1 text-white font-semibold">
                <WeatherIcon condition={weatherCondition} className="w-4 h-4 text-white/90" />
                <span>{weatherTemp}°</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
