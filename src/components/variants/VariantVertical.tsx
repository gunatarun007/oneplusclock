import React from 'react';
import { ClockState } from '../../hooks/useClock';

interface VariantProps {
  clock: ClockState;
  showSeconds: boolean;
  showDate?: boolean;
}

export const VariantVertical: React.FC<VariantProps> = ({
  clock,
  showSeconds,
  showDate = true
}) => {
  return (
    <div className="clock-widget variant-vertical">
      {showDate && (
        <div
          className="secondary-text"
          style={{
            marginBottom: 'calc(var(--clock-font-size) * 0.05)',
            fontSize: 'calc(var(--secondary-font-size) * 0.95)',
            justifyContent: 'center'
          }}
        >
          <span>{clock.dateShort}</span>
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
