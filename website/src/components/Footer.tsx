import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#08090B] border-t border-white/[0.04] py-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-[13px] text-neutral-400">
        {/* Left */}
        <div className="flex items-center space-x-3">
          <span className="font-bold text-white tracking-tight">Clock</span>
          <span className="text-neutral-600">|</span>
          <span>A minimal desktop clock for Windows.</span>
        </div>

        {/* Right */}
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
