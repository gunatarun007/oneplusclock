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

export const VariantHorizontal: React.FC<VariantProps> = ({
  clock,
  weather,
  showSeconds,
  showWeather,
  showDate
}) => {
  return (
    <div className="clock-widget variant-horizontal">
      <ClockDisplay clock={clock} showSeconds={showSeconds} />
      {(showDate || (showWeather && weather)) && (
        <div
          className="secondary-text"
          style={{
            marginTop: 'calc(var(--clock-font-size) * 0.05)',
            justifyContent: 'center',
            fontSize: 'calc(var(--secondary-font-size) * 0.95)',
            gap: '0.55em'
          }}
        >
          {showDate && <span>{clock.dateShort}</span>}
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
