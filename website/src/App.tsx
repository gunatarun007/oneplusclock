import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VideoSection } from './components/VideoSection';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex flex-col font-sans antialiased selection:bg-[#E92828] selection:text-white">
      {/* 1. Minimal Navbar */}
      <Navbar />

      {/* Main Content: Hero -> VideoSection */}
      <main className="flex-grow flex flex-col">
        {/* 2. Hero Section */}
        <Hero />

        {/* 3. Video Demonstration Section */}
        <VideoSection />
      </main>

      {/* 4. Minimal Footer */}
      <Footer />
    </div>
  );
};

export default App;
