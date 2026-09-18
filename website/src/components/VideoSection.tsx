import React, { useRef, useEffect } from 'react';
import { WindowsIcon } from './WindowsIcon';

export const VideoSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may be restricted by some browser policies; muted is handled
      });
    }
  }, []);

  return (
    <section className="relative py-20 sm:py-28 px-6 sm:px-8 max-w-5xl mx-auto flex flex-col items-center">
      {/* Above the video */}
      <p className="text-sm sm:text-base text-[#8A8A8A] font-medium tracking-wide text-center mb-6 sm:mb-8">
        Remember this? 👀
      </p>

      {/* Cinematic Product Demo Video */}
      <div className="w-full relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/80 bg-black/60">
        <video
          ref={videoRef}
          src="./oneplus-clock-demo.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-auto block object-cover"
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Below the video */}
      <div className="text-center mt-10 sm:mt-12 flex flex-col items-center max-w-lg">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#F5F5F5] tracking-tight mb-2.5">
          The iconic clock, now on Windows.
        </h2>

        <p className="text-sm sm:text-base text-[#8A8A8A] mb-8 font-normal">
          Right-click the clock to open settings.
        </p>

        <a
          href="https://github.com/gunatarun007/oneplusclock/releases/download/v1.0.0/onepluswidget_1.0.0_x64-setup.exe"
          className="inline-flex items-center space-x-2.5 bg-[#F5F5F5] hover:bg-white text-[#050505] px-8 py-3.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-white/10 active:translate-y-0 cursor-pointer"
        >
          <WindowsIcon className="w-4 h-4 text-black" />
          <span>Download Free (.exe)</span>
        </a>
      </div>
    </section>
  );
};
