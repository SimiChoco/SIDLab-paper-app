"use client";

import React, { useState } from 'react';
import { User, ReadingLog } from "@/lib/types";
import RankingWithBadges from "./RankingWithBadges";
import RecentAchievements from "./RecentAchievements";
import DeleteUserSection from "./DeleteUserSection";

// Helper types for Client Component props
type SerializedUser = Omit<User, 'updatedAt'> & { updatedAt: number };
type SerializedLog = Omit<ReadingLog, 'createdAt'> & { createdAt: number };

interface DashboardProps {
  ranking: SerializedUser[];
  recentLogs: SerializedLog[];
  allLogs: SerializedLog[];
}

export default function Dashboard({ ranking, recentLogs, allLogs }: DashboardProps) {
  const [selectedUserForModal, setSelectedUserForModal] = useState<User | null>(null);

  // Derived state: Is the modal open?
  const isModalOpen = !!selectedUserForModal;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ranking Card */}
        <RankingWithBadges 
          ranking={ranking} 
          allLogs={allLogs}
          onModalStateChange={(user) => setSelectedUserForModal(user)}
          selectedUserProp={selectedUserForModal} 
        />

        {/* Recent Activity Card - Keeping this static markup here or could componentize it */}
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
                    <span className="text-xs text-gray-400">{new Date(log.createdAt).toLocaleDateString('ja-JP')}</span>
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
      
      {/* Recent Achievements Feed - HIDES when modal is open */}
      <RecentAchievements 
        users={ranking} 
        allLogs={allLogs} 
        isHidden={isModalOpen} 
      />

      {/* Delete Section */}
      <DeleteUserSection users={ranking.map(u => ({ ...u, updatedAt: new Date(u.updatedAt) }))} />
    </div>
  );
}
