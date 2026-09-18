import React from 'react';
import { ShieldCheck, Cpu, Layout, Eye, Move, Sparkles } from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'Iconic OnePlus Aesthetic',
      description: 'The signature red "1" numeral, clean OxygenOS typography, and refined Never Settle proportions, natively rendered on Windows.',
    },
    {
      icon: Layout,
      title: 'Frameless & Floating',
      description: 'Zero window borders, zero title bars, and no taskbar clutter. A translucent floating desktop widget that blends seamlessly with any wallpaper.',
    },
    {
      icon: ShieldCheck,
      title: '100% Offline & Private',
      description: 'No telemetry, no location tracking, and zero background network calls. It only reads your local system time, keeping your machine secure.',
    },
    {
      icon: Cpu,
      title: 'Ultra-Lightweight Rust Core',
      description: 'Powered by Tauri and Rust. Consumes less than 15 MB of memory and 0% CPU, running silky smooth in the background all day.',
    },
    {
      icon: Eye,
      title: 'Click-Through & Always-On-Top',
      description: 'Keep the clock floating above fullscreen apps and IDEs, or enable click-through to interact with whatever is directly behind it.',
    },
    {
      icon: Move,
      title: 'Multi-Monitor Position Memory',
      description: 'Drag it anywhere across your desktop setup. Your chosen coordinates and display positions are instantly remembered on every launch.',
    },
  ];

  return (
    <section id="features" className="relative z-10 py-24 px-6 sm:px-12 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs font-semibold text-neutral-300 uppercase tracking-widest mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E92828]" />
          <span>Built For Desktop</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Engineered for Windows.<br />
          Inspired by OnePlus.
        </h2>
        <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
          Everything you love about the iconic OnePlus clock, crafted specifically as a high-performance native desktop companion.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className="relative group p-7 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.04] transition-all duration-300"
            >
              {/* Subtle hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#E92828]/0 to-[#E92828]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="relative z-10">
                <div className="w-11 h-11 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-[#E92828] mb-5 group-hover:scale-110 group-hover:bg-[#E92828]/10 transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white tracking-tight mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {f.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
