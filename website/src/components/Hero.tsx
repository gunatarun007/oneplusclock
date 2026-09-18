import React from 'react';
import { WindowsIcon } from './WindowsIcon';
import { LiveClock } from './LiveClock';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-28 pb-16">
      {/* Cinematic Background Mountain Landscape */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-mountains.jpg"
          alt="Cinematic mountain landscape at dusk"
          className="w-full h-full object-cover object-center scale-100 transform motion-safe:transition-transform motion-safe:duration-[10000ms] hover:scale-105"
        />
        {/* Subtle dark gradient overlay so typography and clock pop crisp and clear */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#08090B]/85 via-[#08090B]/45 to-[#08090B]/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090B]/90 via-[#08090B]/30 to-transparent" />
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
        {/* Left Column: Typography, Badges, and Download CTA */}
        <div className="lg:col-span-7 flex flex-col items-start">
          {/* Aligned Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.07] border border-white/[0.1] text-xs font-medium text-neutral-200 mb-6 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#E92828] animate-pulse" />
            <span className="tracking-wide">Iconic OnePlus Design · Native for Windows</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-[74px] font-bold tracking-tighter text-white leading-[1.05] mb-6">
            The iconic OnePlus clock, on Windows.
          </h1>

          <p className="text-lg sm:text-xl text-neutral-300 font-normal tracking-tight mb-8 max-w-lg leading-relaxed">
            Bring the signature red '1' and timeless Never Settle aesthetic directly to your desktop. Minimal, frameless, 100% offline, and always within reach.
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col items-start space-y-3.5">
            <a
              href="https://github.com/taruntejaguna/Oneplusclock/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 bg-white hover:bg-neutral-100 text-black px-8 py-4 rounded-full font-semibold text-base transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-white/15 active:translate-y-0 cursor-pointer"
            >
              <WindowsIcon className="w-4 h-4 text-black" />
              <span>Download for Windows</span>
            </a>

            {/* Aligned Feature Highlights */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-3.5 text-xs sm:text-[13px] text-neutral-400 font-medium pl-1">
              <span>Free · Windows 11 & 10</span>
              <span className="text-neutral-600">•</span>
              <span>100% Offline</span>
              <span className="text-neutral-600">•</span>
              <span>Zero Network Calls</span>
              <span className="text-neutral-600">•</span>
              <span>&lt; 15 MB RAM</span>
            </div>
          </div>
        </div>

        {/* Right Column: Floating Desktop Clock Showcase (Day + Clock) */}
        <div className="lg:col-span-5 flex items-center justify-start lg:justify-end">
          <div className="relative group cursor-default w-full max-w-md">
            {/* Ambient Red & Atmospheric Glow */}
            <div className="absolute -inset-10 bg-gradient-to-r from-[#E92828]/25 via-transparent to-white/5 rounded-full blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Desktop Floating Clock Card */}
            <div className="relative p-7 sm:p-9 rounded-3xl backdrop-blur-md bg-black/35 border border-white/[0.1] shadow-2xl transition-all duration-300 hover:border-white/20 hover:bg-black/45">
              {/* Desktop Widget Header Pill */}
              <div className="flex items-center justify-between text-[11px] font-medium text-neutral-400 mb-6 border-b border-white/[0.08] pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#E92828] animate-pulse" />
                  <span className="tracking-wider uppercase text-[10px] text-neutral-300 font-semibold">
                    Desktop Widget Preview
                  </span>
                </div>
                <span className="text-neutral-400 font-mono text-[10px] uppercase tracking-wider">
                  Day + Clock
                </span>
              </div>

              {/* Authentic Day + Clock from desktop app (Day on top, time in middle, date on bottom) */}
              <LiveClock
                size="lg"
                live={true}
                variant="day-clock"
                showDay={true}
                showDate={true}
              />

              {/* Desktop Widget Bottom Hints */}
              <div className="mt-7 pt-3.5 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-neutral-400">
                <span className="flex items-center space-x-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Live System Time</span>
                </span>
                <span>Frameless · Transparent</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
