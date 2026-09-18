import React from 'react';
import { ClockState } from '../../hooks/useClock';
import { ClockDisplay } from '../ClockDisplay';

interface VariantProps {
  clock: ClockState;
  showSeconds: boolean;
  showDate?: boolean;
}

export const VariantDayClock: React.FC<VariantProps> = ({
  clock,
  showSeconds,
  showDate = true
}) => {
  return (
    <div className="clock-widget variant-day-clock">
      <div className="day-label">{clock.dayName}</div>
      <ClockDisplay clock={clock} showSeconds={showSeconds} />
      {showDate && (
        <div className="date-label">
          <span>{clock.dateWithMonth}</span>
        </div>
      )}
    </div>
  );
};
