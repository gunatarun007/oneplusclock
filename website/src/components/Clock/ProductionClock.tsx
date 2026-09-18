import React from 'react';
import { useClock } from './useClock';

interface ProductionClockProps {
  className?: string;
}

export const ProductionClock: React.FC<ProductionClockProps> = ({ className = '' }) => {
  const clock = useClock(true, false);

  const isFirstDigitRed = clock.firstHourDigit === '1';

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      {/* Live Time Display */}
      <div
        className="flex items-baseline justify-center font-medium tracking-tight text-7xl sm:text-8xl md:text-9xl lg:text-[132px] leading-none"
        style={{
          fontFeatureSettings: '"tnum" on, "lnum" on',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Plus Jakarta Sans", sans-serif',
        }}
      >
        <span className={isFirstDigitRed ? 'text-[#E92828]' : 'text-[#F5F5F5]'}>
          {clock.firstHourDigit}
        </span>
        <span className="text-[#F5F5F5]">
          {clock.restHourDigits}
        </span>
        <span className="text-[#F5F5F5] mx-[0.04em] relative -top-[0.03em] font-normal">
          :
        </span>
        <span className="text-[#F5F5F5]">
          {clock.minutes}
        </span>
      </div>

      {/* Live Date underneath: e.g. "Sep 18, Fri" */}
      <div className="text-base sm:text-lg md:text-xl font-medium text-[#8A8A8A] mt-4 sm:mt-5 tracking-tight">
        {clock.dateShort}
      </div>
    </div>
  );
};
