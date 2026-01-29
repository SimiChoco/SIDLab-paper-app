"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Settings() {
  const router = useRouter();
  const [undergradDate, setUndergradDate] = useState("");
  const [undergradTime, setUndergradTime] = useState("");
  const [masterDate, setMasterDate] = useState("");
  const [masterTime, setMasterTime] = useState("");
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  useEffect(() => {
    // Load saved settings or defaults
    const savedUndergrad = localStorage.getItem("deadline_undergrad");
    const savedMaster = localStorage.getItem("deadline_master");

    if (savedUndergrad) {
      const date = new Date(savedUndergrad);
      setUndergradDate(date.toISOString().split("T")[0]);
      setUndergradTime(date.toTimeString().slice(0, 5));
    } else {
      // Default: 2026-01-30 12:00
      setUndergradDate("2026-01-30");
      setUndergradTime("12:00");
    }

    if (savedMaster) {
      const date = new Date(savedMaster);
      setMasterDate(date.toISOString().split("T")[0]);
      setMasterTime(date.toTimeString().slice(0, 5));
    } else {
      // Default: 2026-02-02 12:00
      setMasterDate("2026-02-02");
      setMasterTime("12:00");
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine date and time
    const newUndergrad = new Date(`${undergradDate}T${undergradTime}`);
    const newMaster = new Date(`${masterDate}T${masterTime}`);

    localStorage.setItem("deadline_undergrad", newUndergrad.toISOString());
    localStorage.setItem("deadline_master", newMaster.toISOString());

    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  return (
    <main className="min-h-screen font-sans bg-gray-50 flex flex-col">
       {/* Header */}
       <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: "Cinzel, serif" }}>
              <span className="material-symbols-outlined text-gray-700">settings_suggest</span>
              SETTINGS
            </h1>
            <Link
                href="/"
                className="btn btn-secondary text-xs sm:text-sm gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Back to Dashboard
            </Link>
          </div>
       </header>

       <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
          
          {/* Deadline Configuration Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
               <span className="material-symbols-outlined text-blue-600">timer</span>
               <h2 className="font-bold text-gray-800 text-lg">Deadline Configuration</h2>
            </div>
            
            <div className="p-6">
                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Undergraduate */}
                  <div className="p-4 bg-blue-50/30 rounded-lg border border-blue-100/50 hover:bg-blue-50/50 transition-colors">
                    <label className="flex items-center gap-2 font-bold text-gray-800 mb-4 font-serif text-lg">
                      <span className="text-xl">🎓</span> Bachelor (B4)
                    </label>
                    <div className="space-y-3">
                      <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Date</label>
                          <input
                            type="date"
                            value={undergradDate}
                            onChange={(e) => setUndergradDate(e.target.value)}
                            required
                            className="input-field shadow-sm"
                          />
                      </div>
                      <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Time</label>
                          <input
                            type="time"
                            value={undergradTime}
                            onChange={(e) => setUndergradTime(e.target.value)}
                            required
                            className="input-field shadow-sm"
                          />
                      </div>
                    </div>
                  </div>

                  {/* Master */}
                  <div className="p-4 bg-purple-50/30 rounded-lg border border-purple-100/50 hover:bg-purple-50/50 transition-colors">
                    <label className="flex items-center gap-2 font-bold text-gray-800 mb-4 font-serif text-lg">
                      <span className="text-xl">📜</span> Master (M2)
                    </label>
                     <div className="space-y-3">
                      <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Date</label>
                          <input
                            type="date"
                            value={masterDate}
                            onChange={(e) => setMasterDate(e.target.value)}
                            required
                            className="input-field shadow-sm"
                          />
                      </div>
                      <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Time</label>
                          <input
                            type="time"
                            value={masterTime}
                            onChange={(e) => setMasterTime(e.target.value)}
                            required
                            className="input-field shadow-sm"
                          />
                      </div>
                    </div>
                  </div>

                   <div className="md:col-span-2 flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
                       {showSavedMessage ? (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-sm font-medium animate-pulse">
                          <span className="material-symbols-outlined text-[18px]">check_circle</span>
                          Settings Saved!
                        </div>
                      ) : <span></span>}

                      <button
                        type="submit"
                        className="btn btn-primary px-8 gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
                      >
                         <span className="material-symbols-outlined text-[18px]">save</span>
                         Save Deadlines
                      </button>
                   </div>
                </form>
            </div>
          </section>

          {/* User Management Section */}
          <UserEditSection />
       </div>
    </main>
  );
}

import { User } from "@/lib/types";
import { getAllUsers, updateUserProfile } from "@/lib/db";

function UserEditSection() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch(e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  }

  return (
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
           <div className="flex items-center gap-2">
               <span className="material-symbols-outlined text-gray-600">group</span>
               <h2 className="font-bold text-gray-800 text-lg">Member Management</h2>
           </div>
           <span className="text-xs font-medium px-2 py-1 bg-gray-200 text-gray-600 rounded-full">{users.length} Users</span>
        </div>

        <div className="p-0">
          {loading ? (
             <div className="flex justify-center p-8">
                 <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
             </div>
          ) : (
              <div className="divide-y divide-gray-100">
                  {users.map(user => (
                      <UserEditRow key={user.id} user={user} />
                  ))}
                  {users.length === 0 && (
                      <p className="text-center py-8 text-gray-500">No users found.</p>
                  )}
              </div>
          )}
        </div>
      </section>
  )
}

function UserEditRow({ user }: { user: User }) {
    const [name, setName] = useState(user.name);
    const [grade, setGrade] = useState<"B4"|"M2">(user.grade);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState("");

    const handleUpdate = async () => {
        setIsSaving(true);
        setMessage("");
        try {
            await updateUserProfile(user.id, name, grade);
            setMessage("Saved");
            setTimeout(() => setMessage(""), 2000);
        } catch(e) {
            console.error(e);
            setMessage("Error");
        } finally {
            setIsSaving(false);
        }
    }

    const hasChanges = name !== user.name || grade !== user.grade;

    return (
        <div className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
            {/* User Icon & Info */}
            <div className="flex items-center gap-4 flex-[2] min-w-[200px]">
                <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm
                    ${grade === 'B4' ? 'bg-blue-500' : 'bg-purple-500'}
                `}>
                    {grade}
                </div>
                <div className="flex-1 w-full">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Name</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-transparent border-b border-transparent border-dashed hover:border-gray-300 focus:border-blue-500 focus:outline-none focus:bg-white transition-all px-1 py-0.5 text-gray-900 font-medium"
                        placeholder="Enter name"
                    />
                </div>
            </div>

            {/* Grade Selection */}
            <div className="flex-1 min-w-[120px]">
                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Grade</label>
                 <div className="relative">
                     <select 
                        value={grade} 
                        onChange={(e) => setGrade(e.target.value as "B4" | "M2")}
                        className="w-full appearance-none bg-white border border-gray-200 text-gray-700 py-1.5 px-3 pr-8 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium"
                    >
                        <option value="B4">Bachelor (B4)</option>
                        <option value="M2">Master (M2)</option>
                     </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <span className="material-symbols-outlined text-sm">expand_more</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 min-w-[100px] sm:border-l sm:border-gray-100 sm:pl-4">
                {message && (
                    <span className={`text-xs font-bold animate-fade-in ${message === 'Error' ? 'text-red-500' : 'text-green-600'}`}>
                        {message}
                    </span>
                )}
                
                <button 
                  onClick={handleUpdate}
                  disabled={!hasChanges || isSaving}
                  className={`
                      btn btn-sm text-xs px-3 py-1.5 h-8 gap-1
                      ${hasChanges 
                          ? 'bg-gray-900 text-white hover:bg-black shadow-md' 
                          : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                      }
                  `}
                >
                    {isSaving ? (
                        <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                        <span className="material-symbols-outlined text-[16px]">save</span>
                    )}
                    <span className="hidden sm:inline">Update</span>
                </button>
            </div>
        </div>
    )
}
