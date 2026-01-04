"use client";

import { useEffect, useState, useRef, memo } from "react";

type Quote = {
  id: number;
  text: string;
  x: number;
  y: number;
  scale: number;
  duration: number;
  delay: number;
  hue: number;
  particles: { id: number; x: number; y: number; scale: number; delay: number; duration: number }[];
};

// Memoized Item Component to prevent re-renders of existing quotes
// This solves the "text flickering/redrawing" issue by isolating the quote's render cycle
const MagicalQuoteItem = memo(({ quote, theme, mode }: { quote: Quote; theme: 'dark' | 'light'; mode: 'scream' | 'support' }) => {
  return (
    <div
      className="absolute"
      style={{
        left: `${quote.x}%`,
        top: `${quote.y}%`,
        // Center the container so x/y are the center points
        transform: `translate(-50%, -50%) scale(${quote.scale})`,
        zIndex: 0
      }}
    >
      {/* Enhanced Smoke Particles - Rendering BEHIND text */}
      {quote.particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-smoke-cloud"
          style={{
            left: `${p.x}%`, // Percentage based
            top: `${p.y}px`,
            width: '80px', // Increased size for visibility
            height: '80px',
            // Stronger gradient for "Actual Smoke" feel
            background: mode === 'support' 
              ? (theme === 'dark'
                  ? `radial-gradient(circle, hsla(${50 + (p.id * 10) % 20}, 80%, 70%, 0.6) 0%, hsla(${40 + (p.id * 10) % 20}, 70%, 80%, 0.2) 40%, transparent 70%)` // Light Gold for Dark BG
                  : `radial-gradient(circle, hsla(${45 + (p.id * 10) % 20}, 90%, 60%, 0.4) 0%, hsla(${35 + (p.id * 10) % 20}, 80%, 70%, 0.1) 40%, transparent 70%)`) // Darker/Richer Gold for Light BG
              : (theme === 'dark' 
                  ? 'radial-gradient(circle, rgba(140,140,140,0.4) 0%, rgba(80,80,80,0.1) 40%, transparent 70%)' 
                  : `radial-gradient(circle, hsla(${quote.hue}, 70%, 75%, 0.5) 0%, hsla(${quote.hue}, 60%, 85%, 0.2) 40%, transparent 70%)`),
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: 0,
            filter: 'blur(12px)', // Softer, more diffuse smoke
            zIndex: -1
          }}
        />
      ))}

      {/* Text Rendering */}
      <div 
        className={`font-serif whitespace-nowrap relative z-10 ${mode === 'support' ? (theme === 'dark' ? 'text-[#fcd34d]' : 'text-[#d97706]') : (theme === 'dark' ? 'text-[#e2d0a9]' : 'text-[#4b5563]')}`}
        style={{
           fontSize: '14px',
           maxWidth: '300px',
           whiteSpace: 'normal',
           lineHeight: '1.5',
           fontWeight: mode === 'support' ? 'bold' : 'normal', // Make positive text slightly bolder
           // Note: Removed animationDuration here as it's per-character now
        }}
      >
        {quote.text.split("").map((char, index) => {
          // Deterministic animation variant based on index (1, 2, or 3)
          const animVariant = (index % 3) + 1; 
          
          // Cascading delay for "printing" effect + smoke rising
          const delay = index * 0.05 + 0.5; 
          
          return (
            <span
              key={index}
              className={`inline-block animate-smoke-${animVariant}`}
              style={{
                animationDelay: `${delay}s`,
                animationDuration: `${quote.duration}s`,
                textShadow: mode === 'support' 
                  ? (theme === 'dark' ? '0 0 15px rgba(252, 211, 77, 0.6)' : '0 0 10px rgba(217, 119, 6, 0.2)') 
                  : (theme === 'dark' ? '0 0 10px rgba(197, 160, 89, 0.4)' : '0 0 2px rgba(0,0,0,0.1)'),
                opacity: 0, // Start invisible, handled by keyframe
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </div>
    </div>
  );
});

MagicalQuoteItem.displayName = "MagicalQuoteItem";

// Linear Congruential Generator for time-seeded randomness
class LCG {
  private seed: number;
  constructor(seed: number) {
    this.seed = seed;
  }
  next() {
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }
}

export default function MagicalQuotes({ theme, mode = 'scream' }: { theme: 'dark' | 'light'; mode?: 'scream' | 'support' }) {
  const [quotes, setQuotes] = useState<string[]>([]);
  const [activeQuotes, setActiveQuotes] = useState<Quote[]>([]);
  
  // Use a Ref to check collisions against *latest* state without adding it to dependency array
  const activeQuotesRef = useRef<Quote[]>([]);
  
  const nextId = useRef(0);
  const quoteBag = useRef<string[]>([]);

  // Initialize PRNG with current time as seed
  const rng = useRef(new LCG(Date.now()));

  // Parse CSV
  useEffect(() => {
    // Clear existing quotes when mode changes
    setActiveQuotes([]);
    activeQuotesRef.current = [];
    quoteBag.current = [];

    const fileName = mode === 'support' ? "/応援.csv" : "/卒論・修論の叫び.csv";

    fetch(fileName)
      .then((res) => res.text())
      .then((text) => {
        const lines = text.split("\n").slice(1);
        const parsedQuotes = lines
          .map((line) => {
            const parts = line.split(",");
            return parts.slice(1).join(",").trim();
          })
          .filter((q) => q && q.length > 0);
        setQuotes(parsedQuotes);
      })
      .catch((err) => console.error("Failed to load quotes:", err));
  }, [mode]);

  // Main Animation Loop
  useEffect(() => {
    if (quotes.length === 0) return;

    const interval = setInterval(() => {
      // Shuffle Bag: Refill if empty
      if (quoteBag.current.length === 0) {
        quoteBag.current = [...quotes];
      }
      
      // Pick One using seeded RNG
      const randomIndex = Math.floor(rng.current.next() * quoteBag.current.length);
      const quoteText = quoteBag.current[randomIndex];
      quoteBag.current.splice(randomIndex, 1);
      
      // Positioning Logic
      let bestX = 50, bestY = 10;
      let maxMinDist = -1;

      for (let i = 0; i < 10; i++) {
        let x = rng.current.next() * 80 + 10; 
        let y = rng.current.next() * 80 + 10; 

        // Strict Center Exclusion (Keep Timer Clear)
        if (x > 15 && x < 85 && y > 25 && y < 80) {
          continue; 
        }

        // Collision Check vs Active Quotes (via Ref)
        let minDist = 1000;
        if (activeQuotesRef.current.length > 0) {
          for (const q of activeQuotesRef.current) {
            const dist = Math.sqrt(Math.pow(q.x - x, 2) + Math.pow(q.y - y, 2));
            if (dist < minDist) minDist = dist;
          }
        } else {
          minDist = 100;
        }

        if (minDist > maxMinDist) {
          maxMinDist = minDist;
          bestX = x;
          bestY = y;
        }
        if (minDist > 20) break;
      }

      // Generate Particles
      const particleCount = Math.max(6, Math.floor(quoteText.length / 2));
      const hue = Math.floor(rng.current.next() * 360); // Random Hue for this quote
      
      const particles = Array.from({ length: particleCount }).map((_, i) => ({
        id: i,
        // Distribute across the entire width of the container (approx -10% to 110%)
        x: rng.current.next() * 120 - 10, 
        // Vertical variance
        y: (rng.current.next() - 0.5) * 50,
        // Varied sizes
        scale: 0.8 + rng.current.next() * 1.5,
        delay: rng.current.next() * 1.0, // Staggered start
        duration: 4 + rng.current.next() * 3
      }));

      const newQuote: Quote = {
        id: nextId.current++,
        text: quoteText,
        x: bestX,
        y: bestY,
        scale: 0.7 + rng.current.next() * 0.3,
        duration: 8 + rng.current.next() * 5,
        delay: 0,
        hue, // Pass Hue
        particles
      };

      // Update State & Ref
      activeQuotesRef.current.push(newQuote);
      setActiveQuotes((prev) => [...prev, newQuote]);

      // Schedule Removal
      setTimeout(() => {
        activeQuotesRef.current = activeQuotesRef.current.filter((q) => q.id !== newQuote.id);
        setActiveQuotes((prev) => prev.filter((q) => q.id !== newQuote.id));
      }, newQuote.duration * 1000);

    }, 2500); 

    return () => clearInterval(interval);
  }, [quotes]); // Stable dependency

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* 
        Using purely the quote.id as key.
        MagicalQuoteItem is memoized to allow stable animations.
      */}
      {activeQuotes.map((q) => (
        <MagicalQuoteItem key={q.id} quote={q} theme={theme} mode={mode} />
      ))}
      
      {/* Global Styles for Animations */}
      <style jsx global>{`
        @keyframes smoke-cloud {
          0% { opacity: 0; transform: scale(0.5) translateY(10px); }
          20% { opacity: 0.5; transform: scale(1.5) translateY(-20px); }
          100% { opacity: 0; transform: scale(3.0) translateY(-100px); }
        }
        .animate-smoke-cloud { animation: smoke-cloud ease-out forwards; }

        @keyframes smoke-1 {
          0% { opacity: 0; transform: translate(0, 10px) scale(0.8) blur(4px); }
          10% { opacity: 0.9; transform: translate(0, 0) scale(1) blur(0px); }
          60% { opacity: 0.7; transform: translate(-5px, -15px) scale(1.05) blur(1px) rotate(-1deg); }
          100% { opacity: 0; transform: translate(-15px, -50px) scale(1.5) blur(12px) rotate(-5deg); filter: hue-rotate(90deg); }
        }
        @keyframes smoke-2 {
          0% { opacity: 0; transform: translate(0, 10px) scale(0.8) blur(4px); }
          12% { opacity: 0.9; transform: translate(0, 0) scale(1) blur(0px); }
          60% { opacity: 0.7; transform: translate(5px, -20px) scale(1.05) blur(1px) rotate(1deg); }
          100% { opacity: 0; transform: translate(15px, -60px) scale(1.5) blur(12px) rotate(5deg); }
        }
        @keyframes smoke-3 {
          0% { opacity: 0; transform: translate(0, 15px) scale(0.8) blur(4px); }
          15% { opacity: 0.9; transform: translate(0, 0) scale(1) blur(0px); }
          60% { opacity: 0.7; transform: translate(0px, -18px) scale(1.1) blur(1px); }
          100% { opacity: 0; transform: translate(0px, -55px) scale(1.6) blur(15px); }
        }
        .animate-smoke-1 { animation: smoke-1 ease-out forwards; }
        .animate-smoke-2 { animation: smoke-2 ease-out forwards; }
        .animate-smoke-3 { animation: smoke-3 ease-out forwards; }
      `}</style>
    </div>
  );
}
