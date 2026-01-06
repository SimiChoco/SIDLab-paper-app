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
    <main className="min-h-screen p-6 font-sans bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 font-serif border-b border-gray-100 pb-2">
          ⚙️ 設定 (Settings)
        </h1>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Undergraduate Deadline */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 font-serif">
              🎓 卒業論文 締切 (Undergrad)
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={undergradDate}
                onChange={(e) => setUndergradDate(e.target.value)}
                required
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="time"
                value={undergradTime}
                onChange={(e) => setUndergradTime(e.target.value)}
                required
                className="w-24 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Master's Deadline */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 font-serif">
              📜 修士論文 締切 (Master)
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={masterDate}
                onChange={(e) => setMasterDate(e.target.value)}
                required
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="time"
                value={masterTime}
                onChange={(e) => setMasterTime(e.target.value)}
                required
                className="w-24 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {showSavedMessage && (
            <div className="p-3 bg-green-50 text-green-700 text-sm rounded border border-green-200 text-center animate-pulse">
              設定を保存しました！ (Saved!)
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Link
              href="/"
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-center rounded font-bold hover:bg-gray-200 transition-colors"
            >
              戻る (Back)
            </Link>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition-colors shadow-sm"
            >
              保存 (Save)
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
