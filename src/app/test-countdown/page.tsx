"use client";

import React, { useState, useEffect } from "react";
import DeadlineTimer from "../components/DeadlineTimer";
import CelebrationOverlay from "../components/CelebrationOverlay";

export default function TestCountdownPage() {
  const [testDate, setTestDate] = useState<Date | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Set deadline 10 seconds from now
    const date = new Date();
    date.setSeconds(date.getSeconds() + 10);
    setTestDate(date);
  }, []);

  if (!testDate) return <div className="p-8">Initializing test...</div>;

  return (
    <main className="min-h-screen p-8 bg-gray-50 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Countdown Test Page</h1>
      <p className="mb-8 text-gray-600">The deadline is set to 10 seconds from page load. Wait for it to reach 0.</p>
      
      <div className="w-full max-w-5xl">
        <DeadlineTimer customDeadline={testDate} />
      </div>

      <button 
        onClick={() => window.location.reload()}
        className="mt-12 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Reload to Reset Timer
      </button>

      <button 
        onClick={() => setShowCelebration(true)}
        className="mt-4 px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-600 text-white font-bold rounded shadow-lg hover:scale-105 transition-transform"
      >
        Test Celebration
      </button>

      {showCelebration && (
        <CelebrationOverlay onClose={() => setShowCelebration(false)} />
      )}
    </main>
  );
}
