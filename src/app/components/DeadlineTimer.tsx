"use client";

import { useEffect, useState, useRef, useCallback } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export default function DeadlineTimer() {
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 w-full">
      <TimerCard 
        title="卒業論文締切" 
        date={formatDate(undergradDate)}
        data={timeLeft.undergrad} 
        icon="🎓"
      />
      <TimerCard 
        title="修士論文締切" 
        date={formatDate(masterDate)}
        data={timeLeft.master} 
        icon="📜"
      />
    </div>
  );
}

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center justify-center min-w-[20px] sm:min-w-[48px]">
    <div 
      className="text-sm sm:text-3xl font-bold tabular-nums leading-none text-red-600 text-center"
      style={{ fontFamily: "'Cinzel', serif" }}
    >
      {value.toString().padStart(2, '0')}
    </div>
    <div 
      className="text-[6px] sm:text-[10px] font-medium text-red-400 mt-0.5 uppercase tracking-tight sm:tracking-widest"
      style={{ fontFamily: "'Cinzel', serif" }}
    >
      {label}
    </div>
  </div>
);

const Separator = () => (
  <div className="text-red-300 font-light text-[10px] sm:text-xl -mt-0.5 sm:-mt-4 font-serif mx-0">:</div>
);

const TimerCard = ({ 
  title, 
  date, 
  data, 
  icon
}: { 
  title: string; 
  date: string; 
  data: TimeLeft; 
  icon: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [showSeconds, setShowSeconds] = useState(true);
  const lastWidthRef = useRef<number>(0);

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
      className="px-2 py-1.5 sm:px-5 sm:py-3 relative group bg-[#fdfbf7] border sm:border-[3px] border-double border-amber-800 flex items-center justify-between gap-1 sm:gap-4 overflow-hidden"
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
            <h3 className="text-[8px] sm:text-sm font-bold tracking-wide sm:tracking-widest uppercase whitespace-nowrap text-gray-900">{title}</h3>
          </div>
        </div>
        <div className="flex items-center pl-1 sm:pl-4 ml-0.5 sm:ml-2 shrink-0">
          <TimeUnit value={data.days} label="Day" />
          <Separator />
          <TimeUnit value={data.hours} label="Hour" />
          <Separator />
          <TimeUnit value={data.minutes} label="Min" />
          <Separator />
          <TimeUnit value={data.seconds} label="Sec" />
        </div>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-0.5 left-0.5 w-1 h-1 sm:w-2 sm:h-2 border-t border-l border-amber-800 opacity-60" />
      <div className="absolute top-0.5 right-0.5 w-1 h-1 sm:w-2 sm:h-2 border-t border-r border-amber-800 opacity-60" />
      <div className="absolute bottom-0.5 left-0.5 w-1 h-1 sm:w-2 sm:h-2 border-b border-l border-amber-800 opacity-60" />
      <div className="absolute bottom-0.5 right-0.5 w-1 h-1 sm:w-2 sm:h-2 border-b border-r border-amber-800 opacity-60" />

      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
        {/* Icon hidden on mobile */}
        <div className="hidden sm:block text-2xl text-gray-900">
          {icon}
        </div>
        <div className="flex flex-col items-start min-w-0">
          <h3 
            className="text-[10px] sm:text-sm font-bold text-gray-900 tracking-wide sm:tracking-widest uppercase border-b border-gray-900 pb-0.5 leading-none whitespace-nowrap"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {title}
          </h3>
          <span 
            className="hidden sm:block text-[10px] font-semibold tracking-wider font-serif opacity-90 mt-0.5"
            style={{ color: 'rgb(120, 95, 35)' }}
          >
            DEADLINE: {date}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center pl-2 sm:pl-4 border-l border-gray-900 border-dashed ml-1 sm:ml-2 shrink-0">
        <TimeUnit value={data.days} label="Day" />
        <Separator />
        <TimeUnit value={data.hours} label="Hour" />
        <Separator />
        <TimeUnit value={data.minutes} label="Min" />
        {/* Seconds dynamically hidden when overflow detected */}
        {showSeconds && (
          <>
            <Separator />
            <TimeUnit value={data.seconds} label="Sec" />
          </>
        )}
      </div>
    </div>
  );
};
