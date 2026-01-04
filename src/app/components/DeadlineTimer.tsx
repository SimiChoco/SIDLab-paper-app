"use client";

import { useEffect, useState, useRef, useCallback } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type TimerTheme = 'paper' | 'dark';

export default function DeadlineTimer({ theme = 'paper' }: { theme?: TimerTheme }) {
  const [timeLeft, setTimeLeft] = useState<{
    undergrad: TimeLeft;
    master: TimeLeft;
  } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      
      // Load deadlines from localStorage or use defaults
      const savedUndergrad = typeof window !== 'undefined' ? localStorage.getItem("deadline_undergrad") : null;
      const savedMaster = typeof window !== 'undefined' ? localStorage.getItem("deadline_master") : null;

      // 2026-01-30 12:00 (Default)
      const undergradDeadline = savedUndergrad ? new Date(savedUndergrad) : new Date("2026-01-30T12:00:00");
      // 2026-02-02 12:00 (Default)
      const masterDeadline = savedMaster ? new Date(savedMaster) : new Date("2026-02-02T12:00:00");

      const getDiff = (deadline: Date): TimeLeft => {
        const diff = deadline.getTime() - now.getTime();
        if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        return { days, hours, minutes, seconds };
      };

      setTimeLeft({
        undergrad: getDiff(undergradDeadline),
        master: getDiff(masterDeadline),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card h-32 animate-pulse bg-gray-100"></div>
        <div className="card h-32 animate-pulse bg-gray-100"></div>
      </div>
    );
  }

  // Format date for display: "1/30 12:00"
  const formatDate = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // Get current deadlines for display
  const savedUndergrad = typeof window !== 'undefined' ? localStorage.getItem("deadline_undergrad") : null;
  const savedMaster = typeof window !== 'undefined' ? localStorage.getItem("deadline_master") : null;
  
  const undergradDate = savedUndergrad ? new Date(savedUndergrad) : new Date("2026-01-30T12:00:00");
  const masterDate = savedMaster ? new Date(savedMaster) : new Date("2026-02-02T12:00:00");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4 w-full">
      <TimerCard 
        title="卒業論文締切" 
        date={formatDate(undergradDate)}
        data={timeLeft.undergrad} 
        icon="🎓"
        theme={theme}
      />
      <TimerCard 
        title="修士論文締切" 
        date={formatDate(masterDate)}
        data={timeLeft.master} 
        icon="📜"
        theme={theme}
      />
    </div>
  );
}

const TimeUnit = ({ value, label, theme }: { value: number; label: string; theme: TimerTheme }) => (
  <div className="flex flex-col items-center justify-center min-w-[20px] sm:min-w-[48px]">
    <div 
      className={`text-sm sm:text-3xl font-bold tabular-nums leading-none text-center ${theme === 'paper' ? 'text-red-600' : 'text-[#c5a059] drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]'}`}
      style={{ fontFamily: "'Cinzel', serif" }}
    >
      {value.toString().padStart(2, '0')}
    </div>
    <div 
      className={`text-[6px] sm:text-[10px] font-medium mt-0.5 uppercase tracking-tight sm:tracking-widest ${theme === 'paper' ? 'text-red-400' : 'text-[#8b7d6b]'}`}
      style={{ fontFamily: "'Cinzel', serif" }}
    >
      {label}
    </div>
  </div>
);

const Separator = ({ theme }: { theme: TimerTheme }) => (
  <div className={`font-light text-[10px] sm:text-xl -mt-0.5 sm:-mt-4 font-serif mx-0 ${theme === 'paper' ? 'text-red-300' : 'text-[#c5a059]/50'}`}>:</div>
);

const TimerCard = ({ 
  title, 
  date, 
  data, 
  icon,
  theme
}: { 
  title: string; 
  date: string; 
  data: TimeLeft; 
  icon: string;
  theme: TimerTheme;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [showSeconds, setShowSeconds] = useState(true);
  const lastWidthRef = useRef<number>(0);

  // Theme configuration
  const styles = theme === 'paper' ? {
    container: "bg-[#fdfbf7] border sm:border-[3px] border-double border-amber-800",
    text: "text-gray-900",
    dateText: "text-[rgb(120,95,35)]",
    icon: "text-gray-900",
    accent: "border-amber-800",
    borderLeft: "border-dashed border-gray-900"
  } : {
    container: "bg-[#1a1a1a] border sm:border-[2px] border-[#c5a059] shadow-[0_0_30px_rgba(0,0,0,0.8)]",
    text: "text-[#c5a059] drop-shadow-[0_0_2px_rgba(197,160,89,0.5)]",
    dateText: "text-[#e2d0a9]",
    icon: "text-[#c5a059] drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]",
    accent: "border-[#c5a059]",
    borderLeft: "border-solid border-[#c5a059]/30"
  };

  useEffect(() => {
    const checkOverflow = () => {
      // Use the hidden measurement div to check if seconds would fit
      if (measureRef.current && containerRef.current) {
        const measureWidth = measureRef.current.scrollWidth;
        const containerWidth = containerRef.current.clientWidth;
        setShowSeconds(measureWidth <= containerWidth);
      }
    };

    // Initial check
    checkOverflow();
    
    // Only re-check on actual window resize
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      if (currentWidth !== lastWidthRef.current) {
        lastWidthRef.current = currentWidth;
        checkOverflow();
      }
    };

    window.addEventListener('resize', handleResize);
    lastWidthRef.current = window.innerWidth;

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`w-full max-w-[600px] mx-auto px-2 py-1.5 sm:px-5 sm:py-3 relative group ${styles.container} flex items-center justify-between gap-1 sm:gap-4 overflow-hidden transition-all duration-500`}
    >
      {/* Hidden measurement div - always contains seconds for width calculation */}
      <div 
        ref={measureRef}
        className="absolute opacity-0 pointer-events-none flex items-center gap-1 sm:gap-4"
        aria-hidden="true"
      >
        <div className="flex items-center gap-1 sm:gap-4 shrink-0">
          <div className={`hidden sm:block text-2xl`}>🎓</div>
          <div className="flex flex-col items-start">
            <h3 
              className={`text-[8px] sm:text-sm font-bold tracking-wide sm:tracking-widest uppercase whitespace-nowrap ${styles.text}`}
              style={{ color: theme === 'dark' ? '#c5a059' : undefined }}
            >
              {title}
            </h3>
          </div>
        </div>
        <div className="flex items-center pl-1 sm:pl-4 ml-0.5 sm:ml-2 shrink-0">
          <TimeUnit value={data.days} label="Day" theme={theme} />
          <Separator theme={theme} />
          <TimeUnit value={data.hours} label="Hour" theme={theme} />
          <Separator theme={theme} />
          <TimeUnit value={data.minutes} label="Min" theme={theme} />
          <Separator theme={theme} />
          <TimeUnit value={data.seconds} label="Sec" theme={theme} />
        </div>
      </div>

      {/* Corner Accents */}
      <div className={`absolute top-0.5 left-0.5 w-1 h-1 sm:w-2 sm:h-2 border-t border-l ${styles.accent} ${theme === 'dark' ? 'opacity-100 drop-shadow-[0_0_2px_rgba(197,160,89,0.8)]' : 'opacity-60'}`} />
      <div className={`absolute top-0.5 right-0.5 w-1 h-1 sm:w-2 sm:h-2 border-t border-r ${styles.accent} ${theme === 'dark' ? 'opacity-100 drop-shadow-[0_0_2px_rgba(197,160,89,0.8)]' : 'opacity-60'}`} />
      <div className={`absolute bottom-0.5 left-0.5 w-1 h-1 sm:w-2 sm:h-2 border-b border-l ${styles.accent} ${theme === 'dark' ? 'opacity-100 drop-shadow-[0_0_2px_rgba(197,160,89,0.8)]' : 'opacity-60'}`} />
      <div className={`absolute bottom-0.5 right-0.5 w-1 h-1 sm:w-2 sm:h-2 border-b border-r ${styles.accent} ${theme === 'dark' ? 'opacity-100 drop-shadow-[0_0_2px_rgba(197,160,89,0.8)]' : 'opacity-60'}`} />

      {/* Fantasy specific decorations */}
      {theme === 'dark' && (
        <>
           <div className="absolute inset-px border border-[#c5a059] opacity-30 m-0.5 pointer-events-none" />
           <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-[#c5a059]/10 to-transparent opacity-20 blur-sm pointer-events-none" />
           {/* Decorative flourish lines */}
           <div className="absolute top-1/2 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-[#c5a059]/30 to-transparent pointer-events-none" />
        </>
      )}

      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1 z-10">
        {/* Icon hidden on mobile */}
        <div className={`hidden sm:block text-2xl ${styles.icon}`}>
          {icon}
        </div>
        <div className="flex flex-col items-start min-w-0">
          <h3 
            className={`text-[10px] sm:text-sm font-bold ${styles.text} tracking-wide sm:tracking-widest uppercase border-b ${theme === 'paper' ? 'border-gray-900' : 'border-[#c5a059]'} pb-0.5 leading-none whitespace-nowrap`}
            style={{ fontFamily: "'Cinzel', serif", color: theme === 'dark' ? '#c5a059' : undefined }}
          >
            {title}
          </h3>
          <span 
            className={`hidden sm:block text-[10px] font-semibold tracking-wider font-serif opacity-90 mt-0.5 ${styles.dateText}`}
            style={{ color: theme === 'dark' ? '#e2d0a9' : undefined }}
          >
            DEADLINE: {date}
          </span>
        </div>
      </div>

      <div className={`flex items-center justify-center pl-2 sm:pl-4 border-l ${styles.borderLeft} ml-1 sm:ml-2 shrink-0 z-10`}>
        <TimeUnit value={data.days} label="Day" theme={theme} />
        <Separator theme={theme} />
        <TimeUnit value={data.hours} label="Hour" theme={theme} />
        <Separator theme={theme} />
        <TimeUnit value={data.minutes} label="Min" theme={theme} />
        {/* Seconds dynamically hidden when overflow detected */}
        {showSeconds && (
          <>
            <Separator theme={theme} />
            <TimeUnit value={data.seconds} label="Sec" theme={theme} />
          </>
        )}
      </div>
    </div>
  );
};
