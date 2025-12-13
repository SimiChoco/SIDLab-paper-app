
"use client";

import React, { useState, Suspense } from 'react';
import { User, ReadingLog } from '@/lib/types';
import { calculateAchievements, getAllAchievements } from '@/lib/achievements';
import AchievementList from './AchievementList';
import { Trophy, X } from 'lucide-react';

// Helper types for Client Component props (Dates serialized to numbers)
type SerializedUser = Omit<User, 'updatedAt'> & { updatedAt: number };
type SerializedLog = Omit<ReadingLog, 'createdAt'> & { createdAt: number };

interface RankingWithBadgesProps {
    ranking: SerializedUser[];
    allLogs: SerializedLog[];
    onModalStateChange?: (user: User | null) => void;
    selectedUserProp?: User | null; // Optional: If we want to make it fully controlled later
}

export default function RankingWithBadges({ ranking, allLogs, onModalStateChange }: RankingWithBadgesProps) {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedUserLogs, setSelectedUserLogs] = useState<ReadingLog[]>([]);
    const [selectedUnlocks, setSelectedUnlocks] = useState<string[]>([]);

    const handleUserClick = (user: SerializedUser) => {
        // Rehydrate logs for this user
        const logs = allLogs
            .filter(l => l.userId === user.id)
            .map(l => ({...l, createdAt: new Date(l.createdAt)}));
            
        const { unlockedIds } = calculateAchievements(logs, user.totalPages);
        
        // Rehydrate user for selected state
        const hydratedUser = { ...user, updatedAt: new Date(user.updatedAt) };
        setSelectedUser(hydratedUser);
        setSelectedUserLogs(logs);
        setSelectedUnlocks(unlockedIds);
        
        // Notify parent
        onModalStateChange?.(hydratedUser);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
        onModalStateChange?.(null);
    };

    // Scroll Container State (Callback Ref pattern to ensure child gets populated element)
    const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null);
    const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);

    return (
        <>
            <section className="card p-6">
                {/* ... existing ranking list ... */}
                <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                    🏆 現在のランキング
                </h2>
                <div className="space-y-0 divide-y divide-gray-100">
                    {ranking.length === 0 ? (
                        <p className="text-center text-gray-500 py-8 text-sm">データがありません。</p>
                    ) : (
                        ranking.map((user, index) => {
                             // Calculation for preview
                             const logs = allLogs
                                .filter(l => l.userId === user.id)
                                .map(l => ({...l, createdAt: new Date(l.createdAt)}));
                             
                             const { unlockedIds } = calculateAchievements(logs, user.totalPages);
                             
                             return (
                                <div 
                                    key={user.id} 
                                    className="flex items-center justify-between py-3 hover:bg-gray-50 cursor-pointer transition-colors px-2 -mx-2 rounded-lg"
                                    onClick={() => handleUserClick(user)}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${index < 3 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {index + 1}
                                        </span>
                                        <div>
                                            <span className="text-gray-900 font-medium text-sm block">{user.name}</span>
                                            {/* Mini Badge Indicators */}
                                            {unlockedIds.length > 0 && (
                                                <div className="flex gap-1 mt-1">
                                                    {unlockedIds.length >= 1 && <div className="w-2 h-2 rounded-full bg-yellow-400" title="Achievement Unlocked" />}
                                                    {unlockedIds.length >= 5 && <div className="w-2 h-2 rounded-full bg-blue-400" />}
                                                    {unlockedIds.length >= 10 && <div className="w-2 h-2 rounded-full bg-purple-400" />}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-gray-900 font-semibold text-sm">
                                            {user.totalPages} <span className="text-xs text-gray-500 font-normal">p</span>
                                        </div>
                                        {unlockedIds.length > 0 && (
                                            <div className="text-xs text-indigo-500 font-medium flex items-center justify-end gap-1">
                                                <Trophy size={10} />
                                                {unlockedIds.length} 個
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>

            {/* Achievement Details Modal - Full Height, Fixed Width */}
            {/* Achievement Details Modal - Split Layer Architecture for 3D Z-Index Sandwich */}
            {selectedUser && (
                <>
                    {/* LAYER 1 (Bottom): Backdrop + Body Container (z-830) 
                        - Sits BELOW the Global ViewCanvas (z-840)
                        - Allows 3D badges to be visible ON TOP of the white card background
                    */}
                    <div className="fixed inset-0 z-[830] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={handleCloseModal}>
                        <div className="bg-white w-full max-w-5xl h-full flex flex-col shadow-2xl animate-in fade-in slide-in-from-bottom-10 duration-300" onClick={e => e.stopPropagation()}>
                            
                            {/* Invisible Header Spacer to maintain layout flow */}
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0 opacity-0 pointer-events-none">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                        🎖 {selectedUser.name} の実績
                                    </h3>
                                    <p className="text-gray-500 mt-1">
                                        獲得済み: {selectedUnlocks.length} / {getAllAchievements().length} 個 (総ページ数: {selectedUser.totalPages}p)
                                    </p>
                                </div>
                                <button className="p-3 bg-gray-100 rounded-full">
                                    <X size={28} />
                                </button>
                            </div>
                            
                            {/* Scrollable Content */}
                            <div 
                                ref={setScrollContainer}
                                className="flex-1 overflow-y-auto p-8 bg-gray-50/50"
                            >
                                 <Suspense fallback={
                                     <div className="flex items-center justify-center h-64">
                                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                                         <span className="ml-3 text-indigo-600 font-bold">Loading Badges...</span>
                                     </div>
                                 }>
                                     <AchievementList 
                                         unlockedIds={selectedUnlocks} 
                                         scrollContainer={scrollContainer}
                                         onPopupChange={setIsDetailPopupOpen}
                                     />
                                 </Suspense>
                            </div>
                        </div>
                    </div>

                    {/* LAYER 2 (Top): Header Only (z-900)
                        - Sits ABOVE the Global ViewCanvas (z-840)
                        - Ensures Header covers the scrolling 3D badges
                        - HIDDEN when detail popup is open
                    */}
                    {!isDetailPopupOpen && (
                        <div className="fixed inset-0 z-[900] flex items-center justify-center pointer-events-none">
                            <div className="w-full max-w-5xl h-full flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-300" onClick={e => e.stopPropagation()}>
                                {/* Visible Header */}
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0 pointer-events-auto relative shadow-sm">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                            🎖 {selectedUser.name} の実績
                                        </h3>
                                        <p className="text-gray-500 mt-1">
                                            獲得済み: {selectedUnlocks.length} / {getAllAchievements().length} 個 (総ページ数: {selectedUser.totalPages}p)
                                        </p>
                                    </div>
                                    <button 
                                        onClick={handleCloseModal}
                                        className="p-3 hover:bg-gray-200 rounded-full transition-colors bg-gray-100"
                                    >
                                        <X size={28} className="text-gray-600" />
                                    </button>
                                </div>
                                {/* Rest is transparent/empty */}
                                <div className="flex-1" />
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
