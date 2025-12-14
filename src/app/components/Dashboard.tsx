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
    <div className="h-full flex flex-col gap-2 pb-0">
      {/* Top Half: Ranking & Latest Updates (Fixed Height ~51%) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-auto md:h-[51vh] shrink-0">
        {/* Ranking Card - Takes 2 Columns */}
        <div className="h-full overflow-hidden md:col-span-2">
             <RankingWithBadges 
               ranking={ranking} 
               allLogs={allLogs}
               onModalStateChange={(user) => setSelectedUserForModal(user)}
               selectedUserProp={selectedUserForModal} 
             />
        </div>

        {/* Recent Activity Card - Takes 1 Column */}
        <section className="card flex flex-col h-full overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-4 pb-2 shrink-0 border-b border-gray-50">
             <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                📝 最新の更新
             </h2>
          </div>
          <div className="p-2 overflow-y-auto flex-1 custom-scrollbar">
              <div className="space-y-0 divide-y divide-gray-50">
                {recentLogs.length === 0 ? (
                  <p className="text-center text-gray-500 py-8 text-sm">更新履歴がありません。</p>
                ) : (
                  recentLogs.map((log) => (
                    <div key={log.id} className="flex flex-col gap-0.5 py-1.5 px-2 border-b border-gray-50 last:border-0 last:pb-0 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900 text-xs">{log.userName}</span>
                        <span className="text-[10px] text-gray-400">{new Date(log.createdAt).toLocaleDateString('ja-JP')}</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        <span className="font-bold text-blue-600 text-sm">{log.pages}p</span> 到達
                      </p>
                    </div>
                  ))
                )}
              </div>
          </div>
        </section>
      </div>
      
      {/* Bottom Half: Recent Achievements Feed (Fills remaining space) */}
      <div className="flex-1 flex flex-col min-h-[400px]">
          {/* We pass a class to allow internal scrolling of the list if needed, 
              but RecentAchievements might need similar 'flex h-full' treatment. 
              Let's Wrap it. 
          */}
          <RecentAchievements 
            users={ranking} 
            allLogs={allLogs} 
            isHidden={isModalOpen} 
          />
      </div>


    </div>
  );
}
