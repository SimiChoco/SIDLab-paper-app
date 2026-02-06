"use client";

import { useEffect, useState } from "react";
import { User } from "@/lib/types";
import { getAllUsers, updateUserStatus } from "@/lib/db";
import Link from "next/link";
import DeadlineTimer from "../components/DeadlineTimer";
import CelebrationOverlay from "../components/CelebrationOverlay";

// Status configuration for Prison Theme
const STATUS_CONFIG: Record<number, { label: string; color: string; icon: string }> = {
  0: {
    label: "未着手",
    color: "bg-[#404040] text-gray-200 border-gray-600 shadow-inner hover:bg-[#505050]",
    icon: "lock" // Lock icon
  },
  1: {
    label: "進行中 (自分)",
    color: "bg-[#8a1c1c] text-white border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:bg-[#a62222] font-bold",
    icon: "edit" 
  },
  2: {
    label: "進行中 (待ち)",
    color: "bg-[#1e3a8a] text-white border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:bg-[#2546a3] font-bold",
    icon: "hourglass_top"
  },
  3: {
    label: "完了",
    color: "bg-[#14532d] text-white border-green-500 shadow-[0_0_15px_rgba(22,163,74,0.4)] hover:bg-[#186336] font-bold",
    icon: "sensor_door" // Alternative door
  },
};

const COLUMNS = [
  { key: "statusWriting" as const, label: "論文書き上げ" },
  { key: "statusCheck" as const, label: "論文指導教員チェック" },
  { key: "statusAbstract" as const, label: "要旨作成" },
  { key: "statusSlide" as const, label: "スライド作成" },
];

export default function StatusPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isB4First, setIsB4First] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationDismissed, setCelebrationDismissed] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();

  }, []);

  // Check completion status
  const allComplete = users.length > 0 && users.every(u => 
    COLUMNS.every(col => (u[col.key] as number) === 3)
  );

  useEffect(() => {
    if (allComplete) {
      if (!celebrationDismissed) {
        setShowCelebration(true);
      }
    } else {
      // Reset dismissal if status goes back to incomplete so it can trigger again
      setCelebrationDismissed(false);
      setShowCelebration(false);
    }
  }, [allComplete, celebrationDismissed]);

  const b4Users = users.filter((u) => u.grade === "B4");
  const m2Users = users.filter((u) => u.grade === "M2");

  const groups = isB4First
    ? [
        { label: "BACHELOR (B4)", users: b4Users, color: "text-blue-400" },
        { label: "MASTER (M2)", users: m2Users, color: "text-purple-400" },
      ]
    : [
        { label: "MASTER (M2)", users: m2Users, color: "text-purple-400" },
        { label: "BACHELOR (B4)", users: b4Users, color: "text-blue-400" },
      ];
  
  const handleStatusClick = async (user: User, field: keyof User) => {
    const currentValue = user[field] as number;
    const newValue = (currentValue + 1) % 4;

    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, [field]: newValue } : u))
    );

    try {
      await updateUserStatus(user.id, field, newValue);
    } catch (e) {
      console.error(e);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, [field]: currentValue } : u))
      );
    }
  };

  return (
    <main className="h-screen w-screen font-sans bg-[#050505] text-gray-300 relative overflow-hidden flex flex-col">
        {/* Background ambience */}
        <div className="absolute inset-0 pointer-events-none opacity-20"
             style={{
                 backgroundImage: "linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)",
                 backgroundSize: "40px 40px"
             }}
        ></div>
        

      <div className="flex-1 w-full max-w-[1920px] mx-auto relative z-10 flex flex-col h-full px-4 py-2 sm:px-6">
        <header className="flex flex-shrink-0 items-center justify-between border-b border-gray-800/50 pb-2 mb-2 gap-4 relative z-50">
          <div className="flex flex-col">
              <h1
                className="text-xl sm:text-3xl font-bold !text-white leading-none tracking-[0.2em] drop-shadow-md"
                style={{ fontFamily: "'Cinzel', serif", color: "#ffffff" }}
              >
                卒論・修論 進捗状況
              </h1>
              <p className="text-[10px] text-[#f0e6d2] font-serif tracking-widest opacity-90 mt-1">
                THE FINAL JUDGMENT AWAITS
              </p>
          </div>
            
          {/* Deadline Timer - Compact */}
          <div className="flex-1 max-w-4xl mx-4">
            <DeadlineTimer theme="dark" />
          </div>

          <div>
              <Link
                href="/game-promo"
                className="mr-2 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded hover:scale-105 transition-transform text-xs font-serif tracking-wide inline-flex items-center gap-1 font-bold shadow-sm"
              >
                論文書き終わった！
              </Link>
              <Link
                href="/settings"
                className="mr-2 px-3 py-1.5 bg-gray-900/80 border border-gray-700 text-gray-400 rounded hover:bg-gray-800 hover:text-white transition-all text-xs font-serif tracking-wide inline-flex items-center gap-1 group"
              >
                <span className="material-symbols-outlined text-sm">settings</span>
              </Link>
             <Link
                href="/"
                className="px-3 py-1.5 bg-gray-900/80 border border-gray-700 text-gray-400 rounded hover:bg-red-950/30 hover:text-white hover:border-red-900 transition-all text-xs font-serif tracking-wide inline-flex items-center gap-1 group"
              >
                <span className="material-symbols-outlined text-sm group-hover:text-red-500 transition-colors">logout</span>
                <span className="hidden sm:inline">ESCAPE</span>
              </Link>
          </div>
        </header>

        {loading ? (
          <div className="flex-1 flex items-center justify-center text-[#c5a059] animate-pulse font-serif tracking-widest">
            LOADING PRISON RECORDS...
          </div>
        ) : (
            <div className="flex-1 bg-[#0a0a0a]/80 backdrop-blur-sm shadow-[ inset_0_0_50px_rgba(0,0,0,0.8) ] overflow-hidden border border-gray-800 relative flex flex-col rounded-sm">
             {/* Iron Bars effect top */}
             <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#c5a059]/50 to-transparent z-20"></div>

            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Header Row */}
              <div className="flex-shrink-0 bg-[#0a0a0a] shadow-lg border-b border-gray-800 flex pr-2">
                  {/* Spacer for Vertical Label */}
                  <div className="w-8 sm:w-10 bg-[#050505] border-r border-gray-800 flex-shrink-0"></div>

                  <div 
                    onClick={() => setIsB4First(!isB4First)}
                    className="px-4 py-2 font-bold whitespace-nowrap min-w-[200px] flex-[1.2] tracking-wider font-serif text-white text-2xl flex items-center gap-2 cursor-pointer hover:text-[#c5a059] transition-colors select-none group"
                    title="Toggle Sort Order (B4/M2)"
                  >
                    PRISONER
                    <span className="material-symbols-outlined text-sm opacity-50 group-hover:opacity-100 transition-opacity">
                      {isB4First ? "expand_more" : "expand_less"}
                    </span>
                  </div>
                  {COLUMNS.map((col) => (
                    <div key={col.key} className="px-2 py-2 font-normal whitespace-nowrap text-center flex-1 min-w-[140px] tracking-wider font-serif text-gray-200 text-2xl flex items-center justify-center">
                      {col.label}
                    </div>
                  ))}
              </div>

              {/* Body Rows - Flex column to distribute height */}
              <div className="flex-1 flex flex-col overflow-auto bg-[#050505]">
                  {groups.map((group) => (
                    <div key={group.label} className="flex border-b border-gray-800/50 last:border-0 relative">
                      {/* Vertical Group Label */}
                      <div className={`
                          w-8 sm:w-10 flex-shrink-0 flex items-center justify-center
                          ${group.color} bg-[#080808] border-r border-gray-800
                          font-serif font-bold tracking-widest text-[10px] sm:text-xs select-none
                          hover:bg-[#111] transition-colors
                      `}>
                          <div style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }} className="rotate-180 py-4 flex items-center justify-center gap-2">
                              {group.label}
                              <span className="text-[9px] opacity-60 font-sans tracking-normal">
                                  {group.users.length > 0 ? `${group.users.length}` : ''}
                              </span>
                          </div>
                      </div>
                      
                      {/* Users Column */}
                      <div className="flex-1 flex flex-col min-w-0">
                          {group.users.length === 0 && (
                              <div className="px-4 py-8 text-center text-gray-600 font-serif text-sm italic">
                                  NO PRISONERS ASSIGNED
                              </div>
                          )}

                          {group.users.map((user) => (
                            <div
                              key={user.id}
                              className="flex flex-1 min-h-[50px] transition-colors duration-200 hover:bg-[#111] border-b border-gray-800/30 last:border-0"
                            >
                              <div className="px-4 py-1 font-medium text-white border-r border-gray-800/30 flex-[1.2] flex items-center min-w-[200px]">
                                <div className="flex items-center gap-2 px-2 py-1.5 w-full text-left rounded text-gray-200 group">
                                  <span className="material-symbols-outlined text-[18px] group-hover:rotate-12 transition-transform">
                                      person
                                  </span>
                                  <span className="font-serif tracking-wide text-sm truncate">{user.name}</span>
                                </div>
                              </div>
                              {COLUMNS.map((col) => {
                                const status = user[col.key] as number;
                                const config = STATUS_CONFIG[status] || STATUS_CONFIG[0];

                                return (
                                  <div key={col.key} className="px-1 py-1 text-center border-r border-gray-800/30 last:border-0 flex-1 min-w-[140px] flex items-center justify-center">
                                    <button
                                      onClick={() => handleStatusClick(user, col.key)}
                                      className={`
                                        w-full h-[90%] rounded-sm flex items-center justify-center gap-2
                                        transition-all duration-200 border
                                        cursor-pointer active:scale-95 hover:brightness-110
                                        ${config.color}
                                      `}
                                    >
                                      <span className="material-symbols-outlined text-[18px]">
                                        {config.icon}
                                      </span>
                                      <span className="text-[9px] sm:text-[10px] font-bold hidden xl:inline-block font-serif tracking-tight truncate text-white drop-shadow-md">
                                         {config.label}
                                      </span>
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}

                  {/* Empty rows filler */}
                  <div className="flex-1 bg-[#050505]">
                      {Array.from({ length: Math.max(0, 5 - users.length) }).map((_, i) => (
                          <div key={`empty-${i}`} className="flex min-h-[50px] pointer-events-none opacity-10">
                              <div className="w-8 sm:w-10 border-r border-gray-800"></div>
                              <div className="px-4 py-2 border-r border-gray-800/30 text-gray-400 font-serif text-xs flex-[1.2] min-w-[200px] flex items-center">EMPTY CELL</div>
                              {COLUMNS.map(col => <div key={col.key} className="px-1 py-1 border-r border-gray-800/30 flex-1 min-w-[140px]"></div>)}
                          </div>
                      ))}
                  </div>
              </div>
            </div>

            <div className="flex-shrink-0 p-2 bg-[#0a0a0a] border-t border-gray-800 grid grid-cols-4 gap-2 text-[10px] font-serif z-30">
              {Object.values(STATUS_CONFIG).map((conf) => (
                <div key={conf.label} className={`flex items-center justify-center gap-2 p-2 rounded border ${conf.color.split(" ")[0]} ${conf.color.includes('text-white') ? 'text-white' : 'text-gray-200'} border-opacity-50`}>
                  <span className="material-symbols-outlined text-sm">
                    {conf.icon}
                  </span>
                  <span className="uppercase tracking-wider hidden sm:inline font-bold">{conf.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      
      {showCelebration && (
        <CelebrationOverlay onClose={() => {
          setShowCelebration(false);
          setCelebrationDismissed(true);
        }} />
      )}
    </main>
  );
}
