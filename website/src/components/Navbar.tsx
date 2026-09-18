import React, { useState, useEffect } from 'react';
import { OnePlusLogo } from './OnePlusLogo';
import { WindowsIcon } from './WindowsIcon';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#08090B]/85 backdrop-blur-md py-4 border-b border-white/[0.06] shadow-lg shadow-black/20'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between">
        {/* Left: Brand with OnePlus Emblem */}
        <a
          href="#"
          className="flex items-center space-x-3 group hover:opacity-90 transition-opacity"
        >
          <OnePlusLogo size={28} className="transition-transform duration-200 group-hover:scale-105" />
          <div className="flex items-center space-x-2.5">
            <span className="text-white text-lg sm:text-xl font-bold tracking-tight">
              OnePlus Clock
            </span>
            <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.08] text-neutral-300 border border-white/[0.06]">
              Windows
            </span>
          </div>
        </a>

        {/* Right: Navigation & Actions */}
        <nav className="flex items-center space-x-6 sm:space-x-8 text-sm font-medium text-neutral-300">
          <a
            href="#features"
            className="hover:text-white transition-colors text-[13px] sm:text-sm hidden md:inline-block"
          >
            Features
          </a>
          <a
            href="https://github.com/taruntejaguna/Oneplusclock"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors text-[13px] sm:text-sm"
          >
            GitHub
          </a>
          <a
            href="https://github.com/taruntejaguna/Oneplusclock/releases/latest"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-white hover:bg-neutral-100 text-black px-4 py-2 rounded-full font-semibold text-xs sm:text-sm transition-all duration-200 hover:shadow-md hover:shadow-white/10"
          >
            <WindowsIcon className="w-3.5 h-3.5 text-black" />
            <span>Download</span>
          </a>
        </nav>
      </div>
    </header>
  );
};
