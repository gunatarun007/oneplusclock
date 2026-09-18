import React from 'react';
import { ClockState } from '../../hooks/useClock';
import { ClockDisplay } from '../ClockDisplay';
import { WeatherData } from '../../services/weather';
import { WeatherIcon } from '../WeatherIcon';

interface VariantProps {
  clock: ClockState;
  weather: WeatherData;
  showSeconds: boolean;
  showWeather: boolean;
  showDate: boolean;
}

export const VariantCompact: React.FC<VariantProps> = ({
  clock,
  weather,
  showSeconds,
  showWeather,
  showDate
}) => {
  return (
    <div className="clock-widget variant-compact">
      {(showDate || showWeather) && (
        <div className="secondary-text">
          {showDate && <span>{clock.dateShort}</span>}
          {showWeather && (
            <span className="weather-badge" style={{ marginLeft: showDate ? '0.6em' : 0 }}>
              <WeatherIcon condition={weather.conditionCode} />
              <span>{weather.temperature}°</span>
            </span>
          )}
        </div>
      )}
      <ClockDisplay clock={clock} showSeconds={showSeconds} />
    </div>
  );
};
