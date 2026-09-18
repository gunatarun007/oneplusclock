import React from 'react';

export const Navbar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/[0.04]">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-5 flex items-center justify-between">
        {/* Left: Brand & Secondary Label */}
        <a href="#" className="flex items-center space-x-2.5 group">
          <span className="text-[#F5F5F5] font-semibold text-base sm:text-lg tracking-tight group-hover:text-white transition-colors">
            OnePlus Clock
          </span>
          <span className="text-[11px] font-medium text-[#8A8A8A] border border-white/[0.1] px-1.5 py-0.5 rounded leading-none">
            Windows
          </span>
        </a>

        {/* Right: Minimal Actions */}
        <nav className="flex items-center space-x-6 sm:space-x-8 text-sm font-medium">
          <a
            href="https://github.com/gunatarun007/oneplusclock"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://github.com/gunatarun007/oneplusclock/releases/download/v1.0.0/onepluswidget_1.0.0_x64-setup.exe"
            className="text-[#F5F5F5] hover:text-white transition-colors font-medium"
          >
            Download (.exe)
          </a>
        </nav>
      </div>
    </header>
  );
};
