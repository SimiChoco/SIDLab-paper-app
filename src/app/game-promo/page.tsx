"use client";

import Link from "next/link";
import Image from "next/image";

export default function GamePromoPage() {
  return (
    <main className="min-h-screen bg-yellow-400 flex flex-col items-center justify-center p-4 overflow-hidden relative font-sans">
      {/* Background flashing effect */}
      <div className="absolute inset-0 bg-yellow-400 animate-pulse z-0 transition-colors duration-75"></div>
      
      {/* Floating emojis/text background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="animate-spin-slow absolute top-10 left-10 text-9xl">💰</div>
        <div className="animate-bounce absolute bottom-20 right-20 text-9xl">🎮</div>
        <div className="animate-ping absolute top-1/2 left-1/4 text-8xl">🔥</div>
        <div className="animate-pulse absolute top-1/3 right-1/3 text-6xl text-red-600 font-bold">URGENT!</div>
        
        {/* Falling Kokis */}
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute animate-fall"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 5 + 3}s`,
              animationDelay: `${Math.random() * 5}s`,
              top: '-100px'
            }}
          >
            <div className="w-16 h-16 relative rounded-full overflow-hidden border-2 border-yellow-400">
               <Image 
                  src="/koki.jpg" 
                  alt="Koki" 
                  fill
                  className="object-cover opacity-70"
                />
            </div>
          </div>
        ))}
      </div>

      <div className="z-10 max-w-4xl w-full bg-white border-8 border-red-600 p-8 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] transform rotate-1 animate-wiggle">
        <h1 className="text-4xl md:text-6xl font-black text-center text-red-600 mb-4 stroke-black drop-shadow-md animate-bounce">
          WARNING: EXTREMELY FUN!
        </h1>
        
        <div className="marquee-container bg-black text-green-400 py-2 mb-6 font-mono font-bold text-xl overflow-hidden border-y-4 border-green-600">
          <div className="marquee-content whitespace-nowrap animate-marquee">
            Play Now! Play Now! Play Now! Play Now! Play Now! Play Now! Play Now! Play Now!
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/2 relative group">
            {/* Developer Face - Floating and Rotating */}
            <div className="absolute -top-20 -left-10 z-20 animate-bounce-slow">
              <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-yellow-400 overflow-hidden shadow-2xl transform hover:scale-125 transition duration-300 animate-spin-slow-reverse">
                <Image 
                  src="/koki.jpg" 
                  alt="The Legend Koki" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 bg-black text-yellow-400 text-xs font-bold px-2 py-1 rotate-12 border border-white">
                THE CREATOR
              </div>
            </div>

            <div className="absolute -inset-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <a 
              href="https://play.unity.com/en/games/dcff83a4-22f4-4cca-b9ef-b70bbe106d79/webgl-builds"
              target="_blank"
              rel="noopener noreferrer"
              className="block relative border-4 border-black bg-white transform transition duration-500 hover:scale-110 cursor-pointer"
            >
               <Image 
                src="/koki-s-first-game.png" 
                alt="Koki's First Game" 
                width={500} 
                height={500} 
                className="w-full h-auto"
                style={{ imageRendering: "pixelated" }}
              />
            </a>
            <div className="absolute -top-6 -right-6 bg-red-600 text-white font-bold p-4 rounded-full rotate-12 animate-pulse shadow-lg border-2 border-white pointer-events-none">
              NEW!
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col items-center text-center space-y-6">
            <h2 className="text-3xl font-black text-blue-800 uppercase leading-tight bg-yellow-200 p-2 transform -rotate-2">
              なかがわこーきが<br/>初めて作ったゲーム
            </h2>
            
            <p className="text-xl font-bold text-gray-800 bg-white p-2">
              君はクリアできるか！？<br/>
              <span className="text-red-500 text-2xl">驚異の中毒性！</span>
            </p>

            <a 
              href="https://play.unity.com/en/games/dcff83a4-22f4-4cca-b9ef-b70bbe106d79/webgl-builds"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-6 bg-green-500 text-white text-3xl font-black uppercase tracking-widest hover:bg-green-400 border-b-8 border-green-700 active:border-b-0 active:mt-2 active:mb-[-2px] transition-all shadow-xl hover:shadow-2xl hover:scale-105 animate-pulse"
            >
              PLAY NOW! ➤
            </a>
            
            <p className="text-xs text-gray-400">
              ※ This is a student project. Prepare for greatness.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-1deg); }
          50% { transform: rotate(1deg); }
        }
        .animate-wiggle {
          animation: wiggle 0.3s ease-in-out infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 10s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin 12s linear infinite reverse;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); }
          100% { transform: translateY(110vh) rotate(360deg); }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
    </main>
  );
}
