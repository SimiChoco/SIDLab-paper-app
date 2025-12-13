"use client";

import React from 'react';
import { User, ReadingLog } from '@/lib/types';
import { calculateAchievements, getAchievementById } from '@/lib/achievements';
import { View } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { BadgeScene } from './Badge3D';

// Helper types for Client Component props
type SerializedUser = Omit<User, 'updatedAt'> & { updatedAt: number };
type SerializedLog = Omit<ReadingLog, 'createdAt'> & { createdAt: number };

interface RecentAchievementsProps {
    users: SerializedUser[];
    allLogs: SerializedLog[]; 
    isHidden?: boolean;
}

// Helper to get logs for a specific user (handling serialized logs)
const getLogsForUser = (userId: string, allLogs: SerializedLog[]) => {
    return allLogs
        .filter(log => log.userId === userId)
        .map(l => ({...l, createdAt: new Date(l.createdAt)}));
};

export default function RecentAchievements({ users, allLogs, isHidden = false }: RecentAchievementsProps) {
    // This is expensive if we do it for EVERY user on every render.
    // In a real app we'd store "unlockedAchievements" in the User document.
    // For this prototype, we calculate it on the fly but limit the scope if possible.
    
    // We want to find "Recent Unlocks". 
    // Format: [{ userName, achievement, date }]
    
    const decentUnlocksRaw = React.useMemo(() => {
        const results: { userName: string, title: string, description: string, tier: string, date: Date, icon?: string }[] = [];

        users.forEach(user => {
            const userLogs = getLogsForUser(user.id, allLogs);
            if (userLogs.length === 0) return;

            // Calculate current achievements
            const { unlockedIds } = calculateAchievements(userLogs, user.totalPages);

            const lastLog = userLogs.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
            if (!lastLog) return;

            // Arbitrary "Recent" window: 7 days
            const now = new Date();
            const diffDays = (now.getTime() - lastLog.createdAt.getTime()) / (1000 * 3600 * 24);
            
            if (diffDays <= 7 && unlockedIds.length > 0) {
                // Pick the "best" achievement
                const latestId = unlockedIds[unlockedIds.length - 1];
                const achievement = getAchievementById(latestId);
                if (achievement) {
                    results.push({
                        userName: user.name,
                        title: achievement.title,
                        description: achievement.description,
                        tier: achievement.tier,
                        icon: achievement.icon,
                        date: lastLog.createdAt
                    });
                }
            }
        });

        // Sort by date desc
        results.sort((a, b) => b.date.getTime() - a.date.getTime());
        return results.slice(0, 10);
    }, [users, allLogs]);

    const [scrollContainer, setScrollContainer] = React.useState<HTMLDivElement | null>(null);
    const [selectedItem, setSelectedItem] = React.useState<{ userName: string, title: string, description: string, tier: string, date: Date, icon?: string } | null>(null);

    const handleItemClick = (item: typeof selectedItem) => {
        setSelectedItem(item);
    };

    const handleCloseModal = () => {
        setSelectedItem(null);
    };

    const displayItems = decentUnlocksRaw;

    if (displayItems.length === 0) return null;

    return (
        <section className="card p-6 mt-6 bg-gradient-to-r from-indigo-50 to-white">
            <h2 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                🎉 最近の実績解除
            </h2>
            {/* Mask Container - Extended to fully cover side margins */}
            {/* Optimized: Single container with conditional masks */}
            
            <div className="relative mx-[-24px] px-[24px]"> 
                {(!isHidden && !selectedItem) && (
                    <div className="absolute right-[100%] top-[-100px] bottom-[-100px] w-[200vw] bg-gray-50 z-[860] pointer-events-none" />
                )}

                <div 
                    ref={setScrollContainer}
                    className="flex overflow-x-auto pb-4 gap-4 snap-x px-4 scrollbar-hide py-2" 
                >
                    {displayItems.map((item, idx) => (
                        <RecentAchievementItem 
                            key={idx}
                            item={item}
                            idx={idx}
                            isHidden={isHidden || selectedItem !== null}
                            scrollContainer={scrollContainer}
                            onClick={() => handleItemClick(item)}
                        />
                    ))}
                </div>

                {(!isHidden && !selectedItem) && (
                    <div className="absolute left-[100%] top-[-100px] bottom-[-100px] w-[200vw] bg-gray-50 z-[860] pointer-events-none" />
                )}
            </div>

            {/* Modal Popup */}
            {selectedItem && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={handleCloseModal}>
                    <div className="bg-white rounded-2xl w-full max-w-lg p-8 flex flex-col items-center shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                         <div className="w-96 h-96 relative mb-6">
                             {/* Large View for Detail - Local Canvas for Z-Index */}
                             <Canvas className="w-full h-full" style={{ zIndex: 2005 }}>
                                <BadgeScene
                                    tier={selectedItem.tier as any}
                                    label={""}
                                    subLabel={""}
                                    icon={selectedItem.icon || "★"}
                                    isLocked={false}
                                    enableControls={true}
                                />
                             </Canvas>
                         </div>
                         
                         <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedItem.title}</h2>
                         
                         <div className="mb-2 text-center">
                            <span className="text-sm font-bold text-indigo-600 block">{selectedItem.userName}</span>
                            <span className="text-xs text-gray-400">
                                {selectedItem.date.toLocaleString('ja-JP', { 
                                    year: 'numeric', 
                                    month: 'numeric', 
                                    day: 'numeric', 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                })}
                            </span>
                         </div>

                         <div className="flex gap-2 mb-4 justify-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider
                                ${selectedItem.tier === 'BRONZE' ? 'bg-amber-700' : 
                                  selectedItem.tier === 'SILVER' ? 'bg-slate-400' : 
                                  selectedItem.tier === 'GOLD' ? 'bg-yellow-500' : 
                                  selectedItem.tier === 'PLATINUM' ? 'bg-slate-600' :
                                  'bg-cyan-400' /* DIAMOND */
                                }`}>
                                {selectedItem.tier}
                            </span>
                         </div>
                         
                         <p className="text-gray-600 text-center mb-6 leading-relaxed">
                            {selectedItem.description}
                         </p>
                         
                         <button 
                            className="bg-gray-900 text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors"
                            onClick={handleCloseModal}
                         >
                            閉じる
                         </button>
                    </div>
                </div>
            )}
        </section>
    );
}

// Sub-component to handle individual intersection logic
function RecentAchievementItem({ 
    item, 
    idx, 
    isHidden, 
    scrollContainer,
    onClick 
}: { 
    item: { userName: string, title: string, description: string, tier: string, date: Date, icon?: string }, 
    idx: number, 
    isHidden: boolean,
    scrollContainer: HTMLDivElement | null,
    onClick: () => void
}) {
    const [isInView, setIsInView] = React.useState(false);
    const itemRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!itemRef.current || !scrollContainer) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Use isIntersecting directly
                // We use a high threshold to ensure it disappears before it fully exits? 
                // Or just standard intersection. 
                // Standard intersection matches "at least 1px visible".
                // We probably want it to disappear if it's mostly gone to avoid "floating on edge".
                // But View automatically tracks position. The issue is clipping.
                // If we set distinct root, isIntersecting becomes false when it leaves the root.
                setIsInView(entry.isIntersecting);
            },
            {
                root: scrollContainer,
                // Negative margin on left/right to "clip" the 3D view before it half-exits the container
                rootMargin: "0px -20px 0px -20px", 
                threshold: 0.1 // 10% visible to set "in view". 
            }
        );

        observer.observe(itemRef.current);

        return () => observer.disconnect();
    }, [scrollContainer]);

    // determine styling properties based on tier
    let label = "";
    
    // We didn't pass "icon" in item yet. We need to update decentUnlocksRaw.
    // Actually, decentUnlocksRaw constructs { ... tier: achievement.tier ... }.
    // We should add icon to that construction first.
    
    if (item.title.includes("ページ")) {
            label = item.title.replace(/[^0-9]/g, '');
    } else if (item.title.includes("記録")) {
            label = item.title.replace(/[^0-9]/g, '');
    } else {
        label = "★";
    }

    // Combine checks: Global Hidden (modal) OR local hidden (scroll)
    // If scrollContainer is null (initial), we default to hidden or visible? 
    // Visible is safer to avoid pop-in, but might cause flash of overflow. 
    // Default false (hidden) causes pop-in but prevents overflow. 
    const effectivePaused = isHidden || !isInView;

    return (
        <div 
            ref={itemRef} 
            className="snap-start flex-shrink-0 w-64 bg-white p-4 rounded-xl shadow-sm border border-indigo-100 flex flex-col items-center text-center cursor-pointer transition-transform hover:scale-105"
            onClick={onClick}
        >
            <div className="w-24 h-24 relative mb-2">
                {!effectivePaused && (
                    <View className="w-full h-full">
                        <BadgeScene
                            tier={item.tier as any}
                            label={""}
                            subLabel={""}
                            icon={item.icon || "★"}
                            isLocked={false}
                            paused={false}
                        />
                    </View>
                )}
                
                {/* HTML Text Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                    <span 
                        className={`font-bold text-lg drop-shadow-md transition-opacity duration-300 ${effectivePaused ? 'opacity-0' : 'text-white'}`} 
                        style={{ textShadow: effectivePaused ? 'none' : '0 1px 2px rgba(0,0,0,0.3)' }}
                    >
                        {label}
                    </span>
                </div>
            </div>

            <div className="w-full mt-2 flex flex-col items-center gap-1">
                {/* 1. Title */}
                <p className="text-sm font-bold text-gray-900 truncate w-full">
                    {item.title}
                </p>

                {/* 2. Tier */}
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider
                    ${item.tier === 'BRONZE' ? 'bg-amber-700' : 
                      item.tier === 'SILVER' ? 'bg-slate-400' : 
                      item.tier === 'GOLD' ? 'bg-yellow-500' : 
                      item.tier === 'PLATINUM' ? 'bg-slate-600' :
                      'bg-cyan-400' /* DIAMOND */
                    }`}>
                    {item.tier}
                </span>

                {/* 3. Description */}
                <p className="text-xs text-gray-600 line-clamp-2 h-8 leading-tight w-full">
                    {item.description}
                </p>
                
                {/* Meta info (User & Date) */}
                <div className="flex flex-col items-center w-full pt-2 mt-1 border-t border-gray-100">
                    <p className="text-xs text-indigo-600 font-bold truncate w-full">
                        {item.userName}
                    </p>
                    <p className="text-[10px] text-gray-400">
                        {item.date.toLocaleString('ja-JP', { 
                            month: 'numeric', 
                            day: 'numeric', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        })}
                    </p>
                </div>
            </div>
        </div>
    );
}
