import React from 'react';
import { ClockState } from '../../hooks/useClock';
import { ClockDisplay } from '../ClockDisplay';

interface VariantProps {
  clock: ClockState;
  showSeconds: boolean;
  showDate?: boolean;
}

export const VariantHorizontal: React.FC<VariantProps> = ({
  clock,
  showSeconds,
  showDate = true
}) => {
  return (
    <div className="clock-widget variant-horizontal">
      <ClockDisplay clock={clock} showSeconds={showSeconds} />
      {showDate && (
        <div
          className="secondary-text"
          style={{
            marginTop: 'calc(var(--clock-font-size) * 0.05)',
            justifyContent: 'center',
            fontSize: 'calc(var(--secondary-font-size) * 0.95)'
          }}
        >
          <span>{clock.dateShort}</span>
        </div>
      )}
    </div>
  );
};
