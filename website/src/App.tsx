import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#08090B] text-white flex flex-col font-sans antialiased selection:bg-[#E92828] selection:text-white">
      {/* Editorial Top Navigation */}
      <Navbar />

      {/* Hero & Desktop Showcase */}
      <main className="flex-grow flex flex-col">
        <Hero />
        <Features />
      </main>

      {/* Minimal Footer */}
      <Footer />
    </div>
  );
};

export default App;
