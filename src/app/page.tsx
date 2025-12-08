

import { User, ReadingLog } from "@/lib/types";
import { USERS_COLLECTION, LOGS_COLLECTION, db } from "@/lib/db";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import Link from "next/link";
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
      createdAt: data.createdAt.toDate(),
    } as ReadingLog;
  });

  return { ranking, recentLogs };
}

export const dynamic = 'force-dynamic';

export default async function ThesisProgress() {
  const { ranking, recentLogs } = await getData();

  return (
    <main className="min-h-screen p-6 font-sans bg-gray-50">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ranking Card */}
          <section className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
              🏆 現在のランキング
            </h2>
            <div className="space-y-0 divide-y divide-gray-100">
              {ranking.length === 0 ? (
                <p className="text-center text-gray-500 py-8 text-sm">データがありません。</p>
              ) : (
                ranking.map((user, index) => (
                  <div key={user.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${index < 3 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                        {index + 1}
                      </span>
                      <span className="text-gray-900 font-medium text-sm">{user.name}</span>
                    </div>
                    <div className="text-gray-900 font-semibold text-sm">
                      {user.totalPages} <span className="text-xs text-gray-500 font-normal">p</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Recent Activity Card */}
          <section className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
              📝 最新の更新
            </h2>
            <div className="space-y-0 divide-y divide-gray-100">
              {recentLogs.length === 0 ? (
                <p className="text-center text-gray-500 py-8 text-sm">更新履歴がありません。</p>
              ) : (
                recentLogs.map((log) => (
                  <div key={log.id} className="flex flex-col gap-1 py-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900 text-sm">{log.userName}</span>
                      <span className="text-xs text-gray-400">{log.createdAt.toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-blue-600">{log.pages}ページ</span> に到達しました。
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Delete Section */}
        <DeleteUserSection users={ranking} />
      </div>
    </main>
  );
}
