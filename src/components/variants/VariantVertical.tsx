import React from 'react';
import { ClockState } from '../../hooks/useClock';
import { WeatherData } from '../../services/weather';
import { WeatherIcon } from '../WeatherIcon';

interface VariantProps {
  clock: ClockState;
  weather?: WeatherData;
  showSeconds: boolean;
  showWeather?: boolean;
  showDate?: boolean;
}

export const VariantVertical: React.FC<VariantProps> = ({
  clock,
  weather,
  showSeconds,
  showWeather,
  showDate
}) => {
  return (
    <div className="clock-widget variant-vertical">
      {(showDate || (showWeather && weather)) && (
        <div
          className="secondary-text"
          style={{
            marginBottom: 'calc(var(--clock-font-size) * 0.05)',
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
      <div className="vertical-stack">
        <div className="hour-row">
          <span className="digit accent-red">{clock.firstHourDigit}</span>
          <span className="digit">{clock.restHourDigits}</span>
        </div>
        <div className="minute-row">
          <span className="digit">{clock.minutes}</span>
          {showSeconds && <span className="seconds-display">:{clock.seconds}</span>}
        </div>
      </div>
      {clock.ampm && <span className="am-pm" style={{ marginTop: '0.2em' }}>{clock.ampm}</span>}
    </div>
  );
};
