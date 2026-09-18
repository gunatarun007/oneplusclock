import React from 'react';
import { ClockState } from '../../hooks/useClock';
import { ClockDisplay } from '../ClockDisplay';

interface VariantProps {
  clock: ClockState;
  showSeconds: boolean;
  showDate?: boolean;
}

export const VariantCompact: React.FC<VariantProps> = ({
  clock,
  showSeconds,
  showDate = true
}) => {
  return (
    <div className="clock-widget variant-compact">
      {showDate && (
        <div className="secondary-text" style={{ justifyContent: 'center' }}>
          <span>{clock.dateShort}</span>
        </div>
      )}
      <ClockDisplay clock={clock} showSeconds={showSeconds} />
    </div>
  );
};
