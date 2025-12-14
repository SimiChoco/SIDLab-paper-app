

import { User, ReadingLog } from "@/lib/types";
import { USERS_COLLECTION, LOGS_COLLECTION, db, getAllLogs } from "@/lib/db";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import Link from "next/link";
import Dashboard from "./components/Dashboard";
import nextDynamic from "next/dynamic";
import ClientViewCanvas from "./components/ClientViewCanvas";


// Server-side data fetching helper
async function getData() {
  // 1. Get Users (Ranking)
  const usersRef = collection(db, USERS_COLLECTION);
  const usersQ = query(usersRef, orderBy("totalPages", "desc"));
  const usersSnapshot = await getDocs(usersQ);
  const ranking = usersSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      totalPages: data.totalPages,
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as User;
  });

  // 2. Get Recent Logs
  const logsRef = collection(db, LOGS_COLLECTION);
  const logsQ = query(logsRef, orderBy("createdAt", "desc"), limit(5));
  const logsSnapshot = await getDocs(logsQ);
  const recentLogs = logsSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt.toDate(),
    } as ReadingLog;
  });

  // 3. Get All Logs for Achievement Calculation
  const allLogs = await getAllLogs();

  return { ranking, recentLogs, allLogs };
}

export const dynamic = 'force-dynamic';

export default async function ThesisProgress() {
  const { ranking, recentLogs, allLogs } = await getData();

  return (
    <main className="min-h-[120vh] w-full p-2 font-sans bg-gray-50 flex flex-col overflow-x-hidden">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col">
        {/* Header Section */}
        <header className="flex flex-row justify-between items-center gap-2 border-b border-gray-200 pb-2 mb-2 shrink-0">
          <div className="flex items-baseline gap-3">
            <h1 className="text-lg font-bold text-gray-900">
              進捗管理君
            </h1>
            <p className="text-xs text-gray-500 hidden sm:block">
              Simple Thesis Progress Tracker
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/register"
              className="btn btn-primary text-xs px-3 py-1 h-8 min-h-0 shadow-sm"
            >
              新規登録
            </Link>
            <Link
              href="/log"
              className="btn btn-secondary text-xs px-3 py-1 h-8 min-h-0 shadow-sm"
            >
              進捗を記録
            </Link>
          </div>
        </header>


        {/* Main Dashboard Area - Fills remaining height */}
        <div className="flex-1 flex flex-col min-h-0">
            <Dashboard 
                ranking={ranking.map(u => ({...u, updatedAt: u.updatedAt.getTime()}))}
                recentLogs={recentLogs.map(l => ({...l, createdAt: l.createdAt.getTime()}))}
                allLogs={allLogs.map(l => ({...l, createdAt: l.createdAt.getTime()}))}
            />
        </div>
      </div>
      
      {/* Global 3D Canvas */}
      <ClientViewCanvas />
    </main>
  );
}
