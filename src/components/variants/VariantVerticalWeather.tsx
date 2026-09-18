import React from 'react';
import { ClockState } from '../../hooks/useClock';
import { WeatherData } from '../../services/weather';
import { WeatherIcon } from '../WeatherIcon';

interface VariantProps {
  clock: ClockState;
  weather: WeatherData;
  showSeconds: boolean;
  showWeather: boolean;
  showDate: boolean;
}

export const VariantVerticalWeather: React.FC<VariantProps> = ({
  clock,
  weather,
  showSeconds,
  showWeather,
  showDate
}) => {
  return (
    <div className="clock-widget variant-vertical-weather">
      {showDate && (
        <div className="secondary-text">
          {clock.dateShort}
        </div>
      )}
      {showWeather && (
        <div className="secondary-text" style={{ gap: '0.45em' }}>
          <span>{weather.conditionText}</span>
          <WeatherIcon condition={weather.conditionCode} />
          <span>{weather.temperature}°</span>
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
