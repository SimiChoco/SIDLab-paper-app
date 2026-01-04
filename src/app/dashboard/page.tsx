"use client";

import Link from "next/link";
import DeadlineTimer from "../components/DeadlineTimer";
import { useState } from "react";

export default function Dashboard() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

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

      {/* Theme Toggle */}
      <button 
        onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
        className="absolute top-4 right-4 z-50 p-2 rounded-full border border-[#c5a059]/30 hover:bg-[#c5a059]/10 transition-colors group"
      >
        <span className="text-xl group-hover:scale-110 transition-transform block">
           {theme === 'dark' ? '☀️' : '🌙'}
        </span>
      </button>

      <div className="max-w-5xl w-full space-y-12 relative z-10flex flex-col items-center">
        {/* Header */}
        <header className="text-center mb-8 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-[#c5a059] opacity-10 blur-[80px] rounded-full pointer-events-none" />
          <h1 
            className={`text-2xl sm:text-5xl font-bold ${styles.headerTitle} leading-tight mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-colors duration-300`}
            style={{ fontFamily: "'Cinzel', serif", color: theme === 'dark' ? '#c5a059' : undefined }}
          >
            Sidlab
            <span className={`block text-xl sm:text-3xl font-normal ${styles.headerSubtitle} mt-2 tracking-widest`}>Paper Tracker</span>
          </h1>
        </header>

        <div className="w-full transform scale-105 sm:scale-110 transition-transform duration-700">
           <DeadlineTimer theme={theme === 'dark' ? 'dark' : 'paper'} />
        </div>

        <div className="text-center mt-16 space-y-2">
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#c5a059]/40 to-transparent mx-auto mb-6" />
          <p className={`${styles.subText} text-sm font-serif italic tracking-wide transition-colors duration-300`}>
             Research is magic turned into words.
          </p>
          <Link
            href="/"
            className={`inline-block mt-4 text-xs ${styles.link} transition-colors duration-300 font-serif tracking-titles`}
          >
            ← Return to Paper View
          </Link>
        </div>
      </div>
    </main>
  );
}
