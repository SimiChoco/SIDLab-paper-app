"use client";

import { useEffect, useState } from "react";
import { User } from "@/lib/types";
import { getAllUsers, updateUserStatus } from "@/lib/db";
import Link from "next/link";
import DeadlineTimer from "../components/DeadlineTimer";

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
    icon: "key" // Key to freedom
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
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

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

  const handleStatusClick = async (user: User, field: keyof User) => {
    if (editingUserId !== user.id) return;

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
                href="/"
                className="px-3 py-1.5 bg-gray-900/80 border border-gray-700 text-gray-400 rounded hover:bg-red-950/30 hover:text-white hover:border-red-900 transition-all text-xs font-serif tracking-wide flex items-center gap-1 group"
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
                  <div className="px-4 py-2 font-bold whitespace-nowrap min-w-[200px] flex-[1.2] tracking-wider font-serif text-white text-2xl flex items-center">
                    PRISONER
                  </div>
                  {COLUMNS.map((col) => (
                    <div key={col.key} className="px-2 py-2 font-normal whitespace-nowrap text-center flex-1 min-w-[140px] tracking-wider font-serif text-gray-200 text-2xl flex items-center justify-center">
                      {col.label}
                    </div>
                  ))}
              </div>

              {/* Body Rows - Flex column to distribute height */}
              <div className="flex-1 flex flex-col divide-y divide-gray-900 overflow-auto">
                  {users.map((user) => {
                    const isEditing = editingUserId === user.id;
                    return (
                      <div
                        key={user.id}
                        className={`flex flex-1 min-h-[50px] transition-colors duration-200 ${
                            isEditing ? "bg-[#1a1a2e]" : "hover:bg-[#111]"
                        }`}
                      >
                        <div className="px-4 py-1 font-medium text-white border-r border-gray-800/30 flex-[1.2] flex items-center min-w-[200px]">
                          <button
                            onClick={() => setEditingUserId(isEditing ? null : user.id)}
                            className={`flex items-center gap-2 px-2 py-1.5 w-full text-left rounded transition-all duration-300 group ${
                              isEditing
                                ? "text-white shadow-[0_0_10px_rgba(197,160,89,0.2)] bg-[#c5a059]/10 ring-1 ring-[#c5a059]/30"
                                : "text-gray-200 hover:text-white"
                            }`}
                          >
                            <span className={`material-symbols-outlined text-[18px] transition-transform ${isEditing ? "rotate-90" : "group-hover:rotate-12"}`}>
                                {isEditing ? "settings" : "person"}
                            </span>
                            <span className="font-serif tracking-wide text-sm truncate">{user.name}</span>
                          </button>
                        </div>
                        {COLUMNS.map((col) => {
                          const status = user[col.key] as number;
                          const config = STATUS_CONFIG[status] || STATUS_CONFIG[0];

                          return (
                            <div key={col.key} className="px-1 py-1 text-center border-r border-gray-800/30 last:border-0 flex-1 min-w-[140px] flex items-center justify-center">
                              <button
                                disabled={!isEditing}
                                onClick={() => handleStatusClick(user, col.key)}
                                className={`
                                  w-full h-[90%] rounded-sm flex items-center justify-center gap-2
                                  transition-all duration-200 border
                                  ${isEditing
                                    ? "cursor-pointer active:scale-95 hover:brightness-110"
                                    : "cursor-default opacity-80"
                                  }
                                  ${config.color}
                                `}
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  {config.icon}
                                </span>
                                <span className="text-[10px] sm:text-xs font-bold hidden xl:inline-block font-serif tracking-tight truncate text-white drop-shadow-md">
                                   {config.label.split("(")[0]}
                                </span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                  {/* Empty rows filler to keep grid look if few users (Flex spacer) */}
                  {Array.from({ length: Math.max(0, 10 - users.length) }).map((_, i) => (
                      <div key={`empty-${i}`} className="flex flex-1 min-h-[50px] pointer-events-none opacity-20">
                          <div className="px-4 py-2 border-r border-gray-800/30 text-gray-400 font-serif text-xs flex-[1.2] min-w-[200px] flex items-center">EMPTY CELL</div>
                          {COLUMNS.map(col => <div key={col.key} className="px-1 py-1 border-r border-gray-800/30 flex-1 min-w-[140px]"></div>)}
                      </div>
                  ))}
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
    </main>
  );
}
