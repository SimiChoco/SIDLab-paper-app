"use client";

import { useEffect, useState } from "react";
import { getRanking, getRecentLogs } from "@/lib/db";
import { User, ReadingLog } from "@/lib/types";
import Link from "next/link";

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<ReadingLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [rankingData, logsData] = await Promise.all([
          getRanking(),
          getRecentLogs(),
        ]);
        setUsers(rankingData);
        setLogs(logsData);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Paper Tracker</h1>
            <p className="text-gray-500">Track and rank paper reading progress</p>
          </div>
          <Link
            href="/record"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Add Record
          </Link>
        </header>

        <section className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Ranking</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-600 text-sm">
                    <tr>
                      <th className="px-6 py-4 font-medium">Rank</th>
                      <th className="px-6 py-4 font-medium">Name</th>
                      <th className="px-6 py-4 font-medium text-right">Total Pages</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                          Loading rankings...
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                          No data yet
                        </td>
                      </tr>
                    ) : (
                      users.map((user, index) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-gray-500">
                            {index + 1}
                            {index < 3 && <span className="ml-2 text-yellow-500">★</span>}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                          <td className="px-6 py-4 text-right font-bold text-blue-600">
                            {user.totalPages}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {loading ? (
                  <p className="text-gray-500 text-center">Loading...</p>
                ) : logs.length === 0 ? (
                  <p className="text-gray-500 text-center">No recent activity</p>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="text-sm border-l-2 border-blue-100 pl-4 py-1">
                      <p className="font-medium text-gray-900">{log.userName}</p>
                      <p className="text-gray-500">
                        read <span className="font-semibold text-blue-600">{log.pages} pages</span>
                      </p>
                      {log.paperTitle && (
                        <p className="text-gray-400 text-xs truncate mt-1">{log.paperTitle}</p>
                      )}
                      <p className="text-gray-300 text-xs mt-1">
                        {log.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
