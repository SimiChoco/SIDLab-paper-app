"use client";

import { useEffect, useState } from "react";
import { getRanking, getRecentLogs, deleteUser } from "@/lib/db";
import { User, ReadingLog } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ThesisProgress() {
  const router = useRouter();
  const [ranking, setRanking] = useState<User[]>([]);
  const [recentLogs, setRecentLogs] = useState<ReadingLog[]>([]);
  const [loading, setLoading] = useState(true);

  // For Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [usersToDelete, setUsersToDelete] = useState<User[]>([]);
  const [selectedDeleteUserId, setSelectedDeleteUserId] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [rankingData, logsData] = await Promise.all([
        getRanking(),
        getRecentLogs(),
      ]);
      setRanking(rankingData);
      setRecentLogs(logsData);
      setUsersToDelete(rankingData); // Use ranking data for delete dropdown
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!selectedDeleteUserId) return;
    if (!confirm("Are you sure? This will delete the user and all their logs forever.")) return;

    setIsDeleting(true);
    try {
      await deleteUser(selectedDeleteUserId);
      alert("User deleted!");
      setSelectedDeleteUserId("");
      setShowDeleteModal(false);
      loadData(); // Refresh data
    } catch (e) {
      console.error(e);
      alert("Failed to delete.");
    } finally {
      setIsDeleting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#fff1f2]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#f472b6]"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 md:p-12 font-sans bg-[#fff1f2]">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* Header Section */}
        <header className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-black text-[#db2777] drop-shadow-sm tracking-tight transform -rotate-1">
            Thesis Progress
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            Share your writing journey and cheer each other on! 🎓✨
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-[#db2777] font-bold rounded-full shadow-[0_4px_14px_0_rgba(219,39,119,0.2)] hover:shadow-[0_6px_20px_rgba(219,39,119,0.23)] hover:bg-[#fdf2f8] transition transform hover:-translate-y-1 border-2 border-[#fbcfe8]"
            >
              1. Member Registration
            </Link>
            <Link
              href="/log"
              className="px-8 py-4 bg-[#f472b6] text-white font-bold rounded-full shadow-[0_4px_14px_0_rgba(244,114,182,0.39)] hover:shadow-[0_6px_20px_rgba(244,114,182,0.23)] hover:bg-[#ec4899] transition transform hover:-translate-y-1"
            >
              2. Log Progress
            </Link>
          </div>
        </header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Ranking Card */}
          <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border-4 border-[#fbcfe8]">
            <div className="bg-[#fbcfe8] p-4 text-center">
              <h2 className="text-2xl font-bold text-[#831843]">
                🏆 Ranking
              </h2>
            </div>
            <div className="p-4 max-h-[500px] overflow-y-auto custom-scrollbar">
              {ranking.length === 0 ? (
                <div className="p-8 text-center text-gray-400">No members yet.</div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-[#fce7f3] text-gray-500 text-sm">
                      <th className="px-4 py-3 rounded-tl-xl">Rank</th>
                      <th className="px-4 py-3">Member</th>
                      <th className="px-4 py-3 text-right rounded-tr-xl">Total Pages</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#fce7f3]">
                    {ranking.map((user, index) => (
                      <tr key={user.id} className="hover:bg-[#fff1f2] transition-colors">
                        <td className="px-4 py-4 font-bold text-[#db2777]">
                          {index + 1}
                        </td>
                        <td className="px-4 py-4 font-bold text-gray-700">{user.name}</td>
                        <td className="px-4 py-4 text-right font-black text-[#db2777] text-lg">{user.totalPages}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border-4 border-[#bae6fd]">
            <div className="bg-[#bae6fd] p-4 text-center">
              <h2 className="text-2xl font-bold text-[#0c4a6e]">
                📝 Recent Logs
              </h2>
            </div>
            <div className="p-6 flex-1 overflow-y-auto max-h-[500px] space-y-4 custom-scrollbar">
              {recentLogs.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No logs yet.</p>
              ) : (
                recentLogs.map((log) => (
                  <div key={log.id} className="bg-[#f0f9ff] border-2 border-[#e0f2fe] p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
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
          </div>

        </div>

        {/* Delete Section */}
        <div className="text-center pt-12 border-t-2 border-[#fbcfe8] mt-12 pb-8">
          <button
            onClick={() => setShowDeleteModal(!showDeleteModal)}
            className="text-gray-400 hover:text-red-400 text-sm font-medium transition underline"
          >
            {showDeleteModal ? "Cancel Deletion" : "Delete User"}
          </button>

          {showDeleteModal && (
            <div className="mt-6 bg-white p-6 rounded-2xl border-2 border-gray-200 max-w-md mx-auto shadow-sm">
              <h3 className="text-red-500 font-bold mb-4">Danger Zone</h3>
              <div className="flex gap-2">
                <select
                  className="flex-1 border p-2 rounded-lg bg-gray-50"
                  value={selectedDeleteUserId}
                  onChange={(e) => setSelectedDeleteUserId(e.target.value)}
                >
                  <option value="">Select user to delete...</option>
                  {usersToDelete.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting || !selectedDeleteUserId}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 disabled:opacity-50"
                >
                  {isDeleting ? "..." : "Delete"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
