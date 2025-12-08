import Link from "next/link";
import { User, ReadingLog } from "@/lib/types";
import { USERS_COLLECTION, LOGS_COLLECTION, db } from "@/lib/db";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import DeleteUserSection from "./components/DeleteUserSection";

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
      // Convert Timestamp to Date for serialization if needed, or handled by component
      createdAt: data.createdAt.toDate(),
    } as ReadingLog;
  });

  return { ranking, recentLogs };
}

// Revalidate every 0 seconds (dynamic) or use dynamic functions
export const dynamic = 'force-dynamic';

export default async function ThesisProgress() {
  const { ranking, recentLogs } = await getData();

  return (
    <main className="min-h-screen p-6 md:p-12 font-sans bg-[#fff1f2]">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header Section */}
        <header className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-black text-[#db2777] drop-shadow-sm tracking-tight transform">
            論文進捗管理君
          </h1>
          <p className="text-xl md:text-2xl text-[#be185d] font-bold">
            Let's finish that paper! 🎓
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="px-8 py-3 bg-[#f472b6] hover:bg-[#ec4899] text-white font-bold rounded-full shadow-lg transition transform hover:scale-105 active:scale-95 text-lg"
            >
              1. Member Registration
            </Link>
            <Link
              href="/log"
              className="px-8 py-3 bg-[#22d3ee] hover:bg-[#06b6d4] text-white font-bold rounded-full shadow-lg transition transform hover:scale-105 active:scale-95 text-lg"
            >
              2. Log Progress
            </Link>
          </div>
        </header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Ranking Card */}
          <section className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-4 border-[#fbcfe8] transform hover:-rotate-1 transition-transform duration-300">
            <h2 className="text-2xl font-black text-[#db2777] mb-6 flex items-center gap-2">
              <span>🏆</span> Ranking
            </h2>
            <div className="space-y-4">
              {ranking.length === 0 ? (
                <p className="text-center text-gray-400 py-8 font-medium">No members yet. Join us!</p>
              ) : (
                ranking.map((user, index) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-[#fff1f2] rounded-2xl border-2 border-[#fce7f3]">
                    <div className="flex items-center gap-4">
                      {index === 0 && <span className="text-2xl">🥇</span>}
                      {index === 1 && <span className="text-2xl">🥈</span>}
                      {index === 2 && <span className="text-2xl">🥉</span>}
                      {index > 2 && <span className="font-bold text-[#db2777] w-8 text-center">#{index + 1}</span>}
                      <span className="font-bold text-gray-700 text-lg">{user.name}</span>
                    </div>
                    <div className="text-[#db2777] font-black text-xl">
                      {user.totalPages} <span className="text-sm font-medium text-[#be185d]">pages</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Recent Activity Card */}
          <section className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-4 border-[#bae6fd] transform hover:rotate-1 transition-transform duration-300">
            <h2 className="text-2xl font-black text-[#0284c7] mb-6 flex items-center gap-2">
              <span>📝</span> Recent Logs
            </h2>
            <div className="space-y-4">
              {recentLogs.length === 0 ? (
                <p className="text-center text-gray-400 py-8 font-medium">No updates yet.</p>
              ) : (
                recentLogs.map((log) => (
                  <div key={log.id} className="flex items-center gap-4 p-4 bg-[#f0f9ff] rounded-2xl border-2 border-[#e0f2fe]">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-[#0284c7]">{log.userName}</span>
                        <span className="text-xs text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-100">{log.createdAt.toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Reached <span className="font-bold text-[#0ea5e9]">Page {log.pages}</span>!
                      </p>
                    </div>
                    <div className="text-2xl">✍️</div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Delete Section (Client Component) */}
        <DeleteUserSection users={ranking} />
      </div>
    </main>
  );
}
