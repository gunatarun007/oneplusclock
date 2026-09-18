import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.04] py-12 px-6 sm:px-8 bg-[#050505]">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs sm:text-sm text-[#8A8A8A]">
        {/* Left */}
        <div className="flex flex-col sm:flex-row items-center sm:space-x-3 text-center sm:text-left gap-1 sm:gap-0">
          <span className="font-semibold text-[#F5F5F5]">OnePlus Clock</span>
          <span className="hidden sm:inline text-neutral-600">•</span>
          <span>A tiny clock for your Windows desktop.</span>
        </div>

        {/* Right */}
        <div className="flex items-center space-x-6 sm:space-x-8">
          <a
            href="https://github.com/gunatarun007/oneplusclock"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#F5F5F5] transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://github.com/gunatarun007/oneplusclock/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#F5F5F5] transition-colors"
          >
            Releases
          </a>
          <a
            href="https://github.com/gunatarun007"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#F5F5F5] transition-colors"
          >
            Built by Tarun Teja
          </a>
        </div>
      </div>
    </footer>
  );
};
