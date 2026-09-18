import React from 'react';
import { OnePlusLogo } from './OnePlusLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#08090B] border-t border-white/[0.06] py-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs sm:text-[13px] text-neutral-400">
        {/* Left: Brand Identity */}
        <div className="flex items-center space-x-3">
          <OnePlusLogo size={20} />
          <span className="font-bold text-white tracking-tight">OnePlus Clock</span>
          <span className="text-neutral-600">•</span>
          <span>Minimal desktop clock for Windows.</span>
        </div>

        {/* Right: Links */}
        <div className="flex items-center space-x-6 sm:space-x-8">
          <a
            href="https://github.com/taruntejaguna/Oneplusclock"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://github.com/taruntejaguna/Oneplusclock/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Releases
          </a>
          <a
            href="https://www.linkedin.com/in/taruntejaguna"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            Built with ❤️ by <span className="underline decoration-neutral-600 underline-offset-2">taruntejaguna</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
