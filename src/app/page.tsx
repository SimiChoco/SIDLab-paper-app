

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
    <main className="min-h-screen p-6 font-sans bg-gray-50 overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              進捗管理君
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Simple Thesis Progress Tracker
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/register"
              className="btn btn-primary text-sm shadow-sm"
            >
              新規登録
            </Link>
            <Link
              href="/log"
              className="btn btn-secondary text-sm shadow-sm"
            >
              進捗を記録
            </Link>
          </div>
        </header>

        {/* Main Dashboard Area */}
        <Dashboard 
            ranking={ranking.map(u => ({...u, updatedAt: u.updatedAt.getTime()}))}
            recentLogs={recentLogs.map(l => ({...l, createdAt: l.createdAt.getTime()}))}
            allLogs={allLogs.map(l => ({...l, createdAt: l.createdAt.getTime()}))}
        />
      </div>
      
      {/* Global 3D Canvas */}
      <ClientViewCanvas />
    </main>
  );
}
