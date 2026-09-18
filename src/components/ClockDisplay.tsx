import React from 'react';
import { ClockState } from '../hooks/useClock';

interface ClockDisplayProps {
  clock: ClockState;
  showSeconds?: boolean;
  className?: string;
}

export const ClockDisplay: React.FC<ClockDisplayProps> = ({
  clock,
  showSeconds = false,
  className = ''
}) => {
  return (
    <div className={`clock-time-row ${className}`}>
      <span className="digit accent-red">{clock.firstHourDigit}</span>
      {clock.restHourDigits && <span className="digit">{clock.restHourDigits}</span>}
      <span className="colon-separator">:</span>
      <span className="digit">{clock.minutes}</span>
      {showSeconds && <span className="seconds-display">:{clock.seconds}</span>}
      {clock.ampm && <span className="am-pm">{clock.ampm}</span>}
    </div>
  );
};
