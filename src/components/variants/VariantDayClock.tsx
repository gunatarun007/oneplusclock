import React from 'react';
import { ClockState } from '../../hooks/useClock';
import { ClockDisplay } from '../ClockDisplay';
import { WeatherData } from '../../services/weather';
import { WeatherIcon } from '../WeatherIcon';

interface VariantProps {
  clock: ClockState;
  weather?: WeatherData;
  showSeconds: boolean;
  showWeather?: boolean;
  showDate?: boolean;
}

export const VariantDayClock: React.FC<VariantProps> = ({
  clock,
  weather,
  showSeconds,
  showWeather,
  showDate
}) => {
  return (
    <div className="clock-widget variant-day-clock">
      <div className="day-label">{clock.dayName}</div>
      <ClockDisplay clock={clock} showSeconds={showSeconds} />
      {(showDate || (showWeather && weather)) && (
        <div
          className="date-label"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.55em',
            fontSize: 'var(--secondary-font-size)'
          }}
        >
          {showDate && <span>{clock.dateWithMonth}</span>}
          {showDate && showWeather && weather && <span style={{ opacity: 0.4 }}>•</span>}
          {showWeather && weather && (
            <span className="weather-badge">
              <WeatherIcon condition={weather.conditionCode} />
              <span>{weather.temperature}°</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
