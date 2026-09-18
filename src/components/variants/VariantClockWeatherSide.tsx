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

export const VariantClockWeatherSide: React.FC<VariantProps> = ({
  clock,
  weather,
  showSeconds,
  showWeather,
  showDate
}) => {
  return (
    <div className="clock-widget variant-clock-weather-side">
      <ClockDisplay clock={clock} showSeconds={showSeconds} />
      {(showWeather || showDate) && (
        <div className="side-info">
          {showWeather && (
            <div className="weather-badge">
              <WeatherIcon condition={weather.conditionCode} />
              <span>{weather.temperature}°</span>
            </div>
          )}
          {showDate && (
            <div className="secondary-text" style={{ fontSize: 'calc(var(--secondary-font-size) * 0.95)' }}>
              {clock.dateShort}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
