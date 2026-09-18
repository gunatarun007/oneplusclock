import React, { useState } from 'react';
import { WindowsIcon } from './WindowsIcon';
import { LiveClock } from './LiveClock';

type ClockStyleVariant = 'side-weather' | 'large-info' | 'compact' | 'vertical' | 'horizontal';

export const Hero: React.FC = () => {
  const [variant, setVariant] = useState<ClockStyleVariant>('side-weather');
  const [isLive, setIsLive] = useState(true);

  const styleOptions: { id: ClockStyleVariant; label: string }[] = [
    { id: 'side-weather', label: 'Side by Side' },
    { id: 'large-info', label: 'Day + Date' },
    { id: 'compact', label: 'Compact' },
    { id: 'vertical', label: 'Vertical' },
    { id: 'horizontal', label: 'Horizontal' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-16">
      {/* Cinematic Background Mountain Landscape */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-mountains.jpg"
          alt="Cinematic mountain landscape at dusk"
          className="w-full h-full object-cover object-center scale-100 transform motion-safe:transition-transform motion-safe:duration-[10000ms] hover:scale-105"
        />
        {/* Subtle dark gradient overlay so typography pops crisp and clear */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#08090B]/85 via-[#08090B]/40 to-[#08090B]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090B]/90 via-[#08090B]/30 to-transparent" />
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
        {/* Left Column: Typography, Download CTA, and Style Switcher */}
        <div className="lg:col-span-7 flex flex-col items-start">
          <h1 className="text-4xl sm:text-6xl lg:text-[76px] font-bold tracking-tighter text-white leading-[1.05] mb-6">
            A better clock<br />
            for Windows.
          </h1>

          <p className="text-lg sm:text-xl text-neutral-300 font-normal tracking-tight mb-8 max-w-md">
            Minimal. Floating. Always within reach.
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col items-start space-y-3 mb-10">
            <a
              href="https://github.com/taruntejaguna/Oneplusclock/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 bg-white hover:bg-neutral-100 text-black px-8 py-4 rounded-full font-semibold text-base transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-white/10 active:translate-y-0 cursor-pointer"
            >
              <WindowsIcon className="w-4 h-4 text-black" />
              <span>Download for Windows</span>
            </a>

            <span className="text-xs sm:text-[13px] text-neutral-400 font-medium pl-1">
              Free · Windows 11
            </span>
          </div>

          {/* Style Selector Chips */}
          <div className="flex flex-col space-y-2.5 pt-2">
            <span className="text-xs font-semibold text-neutral-400 tracking-wider uppercase">
              Clock Styles:
            </span>
            <div className="flex flex-wrap gap-2">
              {styleOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setVariant(opt.id)}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all duration-200 ${
                    variant === opt.id
                      ? 'bg-white text-black font-semibold shadow-sm'
                      : 'bg-white/10 hover:bg-white/15 text-neutral-300 border border-white/[0.06]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
              <button
                onClick={() => setIsLive(!isLive)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200 border ${
                  isLive
                    ? 'bg-[#E92828]/20 text-[#E92828] border-[#E92828]/40'
                    : 'bg-white/5 text-neutral-400 border-white/[0.06]'
                }`}
                title="Toggle between live system time and showcase mock time"
              >
                {isLive ? '● Live Time' : '○ Static Time'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Floating Desktop Clock with Day & Weather */}
        <div className="lg:col-span-5 flex items-center justify-start lg:justify-end">
          <div className="relative group cursor-default">
            {/* Ambient Red & Atmospheric Glow */}
            <div className="absolute -inset-10 bg-gradient-to-r from-[#E92828]/15 via-transparent to-white/5 rounded-full blur-3xl opacity-60 group-hover:opacity-90 transition-opacity duration-700" />

            {/* Desktop Floating Clock Card */}
            <div className="relative p-6 sm:p-8 rounded-3xl backdrop-blur-sm bg-black/20 border border-white/[0.08] shadow-2xl transition-all duration-300 hover:border-white/15 hover:bg-black/25">
              <LiveClock
                size="lg"
                live={isLive}
                timeString="19:48"
                variant={variant}
                showWeather={true}
                showDay={true}
                showDate={true}
                weatherTemp={26}
                weatherCondition="cloudy"
                dayText="Friday"
                dateText="Oct 26"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
