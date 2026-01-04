import {
  validateAndConvertUser,
  validateAndConvertReadingLog,
} from "@/lib/types";
import { USERS_COLLECTION, LOGS_COLLECTION, db } from "@/lib/db";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import Link from "next/link";
import DeleteUserSection from "./components/DeleteUserSection";
import SpeechBubble from "./components/SpeechBubble";
import DeadlineTimer from "./components/DeadlineTimer";

// Server-side data fetching helper
async function getData() {
  // 1. Get Users (Ranking)
  const usersRef = collection(db, USERS_COLLECTION);
  const usersQ = query(usersRef, orderBy("totalPages", "desc"));
  const usersSnapshot = await getDocs(usersQ);
  const ranking = usersSnapshot.docs.map((doc) => {
    const data = validateAndConvertUser(doc);
    return data;
  });

  // 2. Get Recent Logs
  const logsRef = collection(db, LOGS_COLLECTION);
  const logsQ = query(logsRef, orderBy("createdAt", "desc"), limit(5));
  const logsSnapshot = await getDocs(logsQ);
  const recentLogs = logsSnapshot.docs.map((doc) => {
    const data = validateAndConvertReadingLog(doc);
    return data;
  });

  return { ranking, recentLogs };
}

export const dynamic = "force-dynamic";

export default async function ThesisProgress() {
  const { ranking, recentLogs } = await getData();
  return (
    <main className="min-h-screen p-3 sm:p-6 font-sans bg-gray-50">
      <div className="max-w-5xl mx-auto space-y-3 sm:space-y-6">
        {/* Header Section */}
        <header className="flex flex-row justify-between items-center gap-2 border-b border-gray-200 pb-2 sm:pb-4">
          <div>
            <h1 
              className="text-lg sm:text-2xl font-bold text-gray-900 leading-tight"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              進捗管理君
            </h1>
            <p className="text-[10px] sm:text-xs text-gray-500 font-serif">
              Simple Thesis Tracker
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/register"
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded text-xs sm:text-sm font-bold font-serif shadow-sm active:bg-blue-700"
            >
              新規登録
            </Link>
            <Link 
              href="/log" 
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white border border-gray-200 text-gray-700 rounded text-xs sm:text-sm font-bold font-serif shadow-sm active:bg-gray-50"
            >
              進捗記録
            </Link>
          </div>
        </header>

        <DeadlineTimer />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ranking Card */}
          <section className="card p-6 border-t-4 border-blue-500">
            <h2 
              className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2 font-serif"
            >
              🏆 現在のランキング
            </h2>
            <div className="space-y-0 divide-y divide-gray-100">
              {ranking.length === 0 ? (
                <p className="text-center text-gray-500 py-8 text-sm">
                  データがありません。
                </p>
              ) : (
                ranking.map((user, index) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          index < 3
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="text-gray-900 font-bold text-sm tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
                        {user.name}
                      </span>
                    </div>
                    <div className="text-gray-900 font-semibold text-sm">
                      {user.totalPages}{" "}
                      <span className="text-xs text-gray-500 font-normal">
                        p
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Recent Activity Card */}
          <section className="card p-6 border-t-4 border-pink-500">
            <h2 
              className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2 font-serif"
            >
              📝 最新の更新
            </h2>
            <div className="space-y-0 divide-y divide-gray-100">
              {recentLogs.length === 0 ? (
                <p className="text-center text-gray-500 py-8 text-sm">
                  更新履歴がありません。
                </p>
              ) : (
                recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex flex-col gap-1 py-3 border-b border-gray-50 last:border-0 last:pb-0"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
                          {log.userName}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 font-serif">
                        {log.createdAt.toLocaleDateString("ja-JP", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-700 font-serif">
                        <span className="font-bold text-blue-600 text-base" style={{ fontFamily: "'Cinzel', serif" }}>
                          {log.pages}
                        </span>{" "}
                        ページに到達しました。
                      </p>
                      {log.comment && (
                        <SpeechBubble
                          comment={log.comment}
                          likedNum={log.likedNum}
                          id={log.id}
                        />
                      )}
                    </div>
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
