import React from 'react';
import { ProductionClock } from './Clock/ProductionClock';
import { WindowsIcon } from './WindowsIcon';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 max-w-4xl mx-auto">
      {/* Prominent Live Production Clock */}
      <div className="mb-12 sm:mb-16">
        <ProductionClock />
      </div>

      {/* Headings */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold tracking-tight text-[#F5F5F5] leading-tight mb-4">
        The iconic OnePlus clock.<br />
        On Windows.
      </h1>

      {/* Short Supporting Copy */}
      <p className="text-base sm:text-lg text-[#8A8A8A] font-normal max-w-md mx-auto mb-10 tracking-tight">
        A minimal floating clock for your desktop.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
        <a
          href="https://github.com/gunatarun007/oneplusclock/releases/download/v1.0.0/onepluswidget_1.0.0_x64-setup.exe"
          className="inline-flex items-center space-x-2.5 bg-[#F5F5F5] hover:bg-white text-[#050505] px-7 py-3.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-white/10 active:translate-y-0 cursor-pointer"
        >
          <WindowsIcon className="w-4 h-4 text-black" />
          <span>Download for Windows (.exe)</span>
        </a>

        <a
          href="https://github.com/gunatarun007/oneplusclock"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1 text-sm sm:text-base text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors py-2 px-3 font-medium"
        >
          <span>View on GitHub</span>
          <span className="text-xs">↗</span>
        </a>
      </div>
    </section>
  );
};
