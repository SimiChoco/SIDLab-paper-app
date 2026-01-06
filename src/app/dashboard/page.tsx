"use client";

import Link from "next/link";
import DeadlineTimer from "../components/DeadlineTimer";
import MagicalQuotes from "../components/MagicalQuotes";
import { useState } from "react";

export default function Dashboard() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isPositive, setIsPositive] = useState(false);

  const styles = theme === 'dark' ? {
    bg: 'bg-[#0f0f0f]',
    headerTitle: 'text-[#c5a059]', // Unified Gold
    headerSubtitle: 'text-[#c5a059]',
    subText: 'text-[#8b7d6b]',
    link: 'text-[#5c5446] hover:text-[#c5a059]',
    radial: 'radial-gradient(circle at 50% 50%, rgba(197, 160, 89, 0.1) 1px, transparent 1px)',
    radialStop: 'from-[#1a1c2c] via-[#0f0f0f] to-black'
  } : {
    bg: 'bg-[#f8f8f8]',
    headerTitle: 'text-[#c5a059]', // Unified Gold
    headerSubtitle: 'text-[#c5a059]',
    subText: 'text-gray-500',
    link: 'text-gray-400 hover:text-[#c5a059]',
    radial: 'radial-gradient(circle at 50% 50%, rgba(197, 160, 89, 0.2) 1px, transparent 1px)',
    radialStop: 'from-white via-[#f4f4f4] to-gray-100'
  };

  return (
    <main className={`min-h-screen p-6 font-sans ${styles.bg} flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-700`}>
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
         <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] ${styles.radialStop} opacity-80 transition-colors duration-700`} />
         <div className="absolute inset-0 opacity-30" 
              style={{
                backgroundImage: styles.radial,
                backgroundSize: '40px 40px'
              }} 
         />
      </div>

      {/* Magical Quotes Layer - Behind content but above background */}
      <MagicalQuotes theme={theme === 'dark' ? 'dark' : 'light'} mode={isPositive ? 'support' : 'scream'} />

      {/* Return Link - Top Left */}
      <Link
        href="/"
        className={`absolute top-4 left-4 z-50 text-xs ${styles.link} transition-colors duration-300 font-serif tracking-titles flex items-center gap-2 group`}
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Paper View
      </Link>

      {/* Controls: Theme & Magic Wand */}
      <div className="absolute top-4 right-4 z-50 flex gap-3">
        {/* Magic Wand Toggle */}
        <button 
          onClick={() => setIsPositive(!isPositive)}
          className={`p-2 rounded-full border transition-all duration-500 group relative overflow-hidden ${isPositive ? 'bg-[#c5a059]/20 border-[#c5a059] shadow-[0_0_15px_rgba(197,160,89,0.5)]' : 'border-[#c5a059]/30 hover:bg-[#c5a059]/10'}`}
          title="Cast Positive Magic"
        >
          <span className={`text-xl block transition-transform duration-500 ${isPositive ? 'rotate-12 scale-110' : 'group-hover:rotate-12'}`}>
             🪄
          </span>
          {isPositive && (
            <span className="absolute inset-0 animate-pulse bg-[#c5a059]/10 rounded-full" />
          )}
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full border border-[#c5a059]/30 hover:bg-[#c5a059]/10 transition-colors group"
        >
          <span className="text-xl group-hover:scale-110 transition-transform block">
             {theme === 'dark' ? '☀️' : '🌙'}
          </span>
        </button>
      </div>

      <div className="max-w-5xl w-full space-y-12 relative z-10 flex flex-col items-center">
        {/* Header */}
        <header className="text-center mb-8 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-[#c5a059] opacity-10 blur-[80px] rounded-full pointer-events-none" />
          <h1 
            className={`text-2xl sm:text-5xl font-normal ${styles.headerTitle} leading-tight mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-colors duration-300`}
            style={{ fontFamily: "'Cinzel', serif", color: '#c5a059' }}
          >
            Paper Deadline
          </h1>
        </header>

        <div className="w-full transform scale-105 sm:scale-110 transition-transform duration-700">
           <DeadlineTimer theme={theme === 'dark' ? 'dark' : 'paper'} />
        </div>
      </div>

      {/* Legal Footer */}
      <footer className={`absolute bottom-2 text-[10px] ${styles.subText} opacity-40 text-center w-full z-50 pointer-events-none`}>
        ※ Comments are quoted from X. This content is for parody/entertainment purposes only.
      </footer>
    </main>
  );
}
