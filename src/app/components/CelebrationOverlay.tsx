"use client";

import { useEffect, useState } from "react";

export default function CelebrationOverlay({ onClose }: { onClose: () => void }) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; size: number; rotation: number; speed: number }[]>([]);

  useEffect(() => {
    // Generate particles
    const colors = ["#FFD700", "#FF0000", "#00FF00", "#0000FF", "#FF00FF", "#00FFFF", "#FFFFFF"];
    const newParticles = Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -20 - Math.random() * 100, // Start above screen
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 10 + 5,
      rotation: Math.random() * 360,
      speed: Math.random() * 2 + 1,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in-slow">
      {/* Confetti */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm animate-fall"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg)`,
            animationDuration: `${p.speed * 3}s`,
            animationDelay: `${Math.random() * 2}s`,
            animationIterationCount: 'infinite',
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 text-center animate-zoom-in">
        <h1 className="text-6xl sm:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-500 to-yellow-300 drop-shadow-[0_0_25px_rgba(255,215,0,0.5)]"
            style={{ fontFamily: "'Cinzel', serif" }}>
          CONGRATULATIONS
        </h1>
        <p className="mt-8 text-xl sm:text-3xl text-white font-serif tracking-widest opacity-90">
          ALL TASKS COMPLETED
        </p>
        <p className="mt-2 text-sm sm:text-base text-amber-200/70 font-serif tracking-widest">
          THE PRISONERS ARE FREE
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
        aria-label="Close"
      >
        <span className="material-symbols-outlined text-5xl">close</span>
      </button>

      {/* Styles for animations */}
      <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(-20vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(120vh) rotate(720deg); opacity: 0; }
        }
        .animate-fall {
          animation-name: fall;
          animation-timing-function: linear;
        }
        @keyframes zoom-in {
            0% { transform: scale(0.5); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
        .animate-zoom-in {
            animation: zoom-in 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes fade-in-slow {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }
        .animate-fade-in-slow {
             animation: fade-in-slow 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
