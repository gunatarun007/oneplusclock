import React, { useState, useEffect } from 'react';

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
          ? 'bg-[#08090B]/80 backdrop-blur-md py-4 border-b border-white/[0.06]'
          : 'bg-transparent py-7'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between">
        {/* Left: Brand */}
        <a
          href="#"
          className="text-white text-lg sm:text-xl font-bold tracking-tight hover:opacity-80 transition-opacity flex items-center space-x-2"
        >
          <span>Clock</span>
        </a>

        {/* Right: Minimal Navigation */}
        <nav className="flex items-center space-x-6 sm:space-x-8 text-sm font-medium text-neutral-300">
          <a
            href="https://github.com/taruntejaguna/Oneplusclock/releases/latest"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors text-[13px] sm:text-sm font-semibold"
          >
            Download
          </a>
          <a
            href="https://github.com/taruntejaguna/Oneplusclock"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors text-[13px] sm:text-sm"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
};
