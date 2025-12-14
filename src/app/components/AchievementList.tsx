"use client";

import React from 'react';
import { getAllAchievements, Achievement } from '@/lib/achievements';
import { View } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { BadgeScene } from './Badge3D';

interface AchievementListProps {
    unlockedIds: string[];
    scrollContainer?: HTMLElement | null;
    onPopupChange?: (isOpen: boolean) => void;
}

function AchievementListItem({ 
    ach, 
    isUnlocked, 
    icon, 
    onClick, 
    scrollContainer,
    isSelected
}: { 
    ach: Achievement; 
    isUnlocked: boolean; 
    icon: string; 
    onClick: () => void;
    scrollContainer?: HTMLElement | null;
    isSelected: boolean;
}) {
    const itemRef = React.useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = React.useState(false);

    React.useEffect(() => {
        // If no scroll container, default to visible (or use viewport?)
        // Actually, View needs explicit skipping if we want to "clip" it by not rendering.
        // If scrollContainer is provided, we use it. If not, we assume always visible (or global observer).
        
        if (!itemRef.current) return;

        // If no container passed, maybe we just default to always true or window observer?
        // For this specific issue, we know it's in a modal. 
        const root = scrollContainer || null;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Stricter visibility check:
                // If it's intersecting, but ratio is too small, we might want to hide it
                // to prevent "bleeding" over the header or bottom.
                // However, standard scrolling is fine if Z-index works.
                // Assuming Z-index fighting, we hide if < 50% visible or touching edge.
                setIsInView(entry.isIntersecting);
            },
            {
                root: root,
                // Negative margin "shrinks" the viewport box, forcing hide BEFORE it hits the edge (header/footer)
                rootMargin: "-20px 0px -20px 0px", 
                threshold: 0.1 // Trigger as soon as 10% stays? Or 0?
                // With negative margin, 0 is fine because "0" means "entering the safe zone".
            }
        );

        observer.observe(itemRef.current);
        return () => observer.disconnect();
    }, [scrollContainer]);

    // Force visible if no scrollContainer is strictly managed? 
    // Actually, for "cliiping" effect, if it's out of view, we MUST hide it.
    // So default false -> wait for observer is safer for "no leak", but might flash.
    // Let's rely on observer.
    
    // For main page (no scrollContainer passed), root=null means viewport, which is correct (hide if off screen).
    
    // Optimization: Pause if hidden or if modal open (handled by parent logic passed via paused prop if needed, 
    // but here we just check visibility).
    
    // NOTE: 'drei/View' will portal to the global canvas. If we stop rendering View, it disappears.
    // That's what we want for "clipping".
    
    return (
        <div 
            ref={itemRef}
            className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 cursor-pointer ${isUnlocked ? 'bg-white shadow-lg ring-1 ring-gray-100 hover:ring-blue-400 hover:scale-105' : 'bg-gray-100 opacity-70'}`}
            onClick={onClick}
        >
            <div className="w-32 h-32 relative z-[840]">
                {/* Only render View if in view AND modal is closed. Unmounting guarantees 3D is gone. */}
                {isInView && !isSelected && (
                    <View className="w-full h-full">
                        <BadgeScene
                            tier={ach.tier} 
                            label={""} 
                            subLabel={""} 
                            icon={icon}
                            isLocked={!isUnlocked}
                            paused={false} // Always active if mounted (unmounted when modal open)
                        />
                    </View>
                )}
                
                {/* HTML Text Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10" style={{ transform: 'translateZ(20px)' /* Force layer */ }}>
                    <span className={`font-bold text-xl drop-shadow-md ${!isUnlocked ? 'text-gray-400' : 'text-white'}`} style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                        {/* label empty */}
                    </span>
                </div>
            </div>
            <div className="text-center mt-2 flex flex-col items-center gap-1">
                <h3 className={`text-sm font-bold ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                    {ach.title}
                </h3>
                
                {/* Tier Badge */}
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider
                    ${ach.tier === 'BRONZE' ? 'bg-amber-700' : 
                      ach.tier === 'SILVER' ? 'bg-slate-400' : 
                      ach.tier === 'GOLD' ? 'bg-yellow-500' : 
                      ach.tier === 'PLATINUM' ? 'bg-slate-600' :
                      ach.tier === 'DIAMOND' ? 'bg-cyan-400' :
                      ach.tier === 'MASTER' ? 'bg-[#ff8fa3]' :
                      'bg-slate-900' /* DOCTOR */
                    } ${!isUnlocked ? 'opacity-50 grayscale' : ''}`}>
                    {ach.tier}
                </span>

                <p className="text-xs text-gray-500 mt-1 line-clamp-2 h-8 leading-tight">
                    {ach.description}
                </p>
            </div>
        </div>
    );
}

export default function AchievementList({ unlockedIds, scrollContainer, onPopupChange }: AchievementListProps) {
    const allAchievements = getAllAchievements();
    const [selectedAchId, setSelectedAchId] = React.useState<string | null>(null);

    const handleBadgeClick = (id: string) => {
        setSelectedAchId(id);
        onPopupChange?.(true);
    };

    const handleClose = () => {
        setSelectedAchId(null);
        onPopupChange?.(false);
    };

    const selectedAch = selectedAchId ? allAchievements.find(a => a.id === selectedAchId) : null;

    return (
        <div className="relative w-full">
            <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 transition-opacity duration-300 ${selectedAchId ? 'pointer-events-none opacity-30 blur-sm' : ''}`}>
                {allAchievements.map((ach) => {
                    const isUnlocked = unlockedIds.includes(ach.id);
                    let icon = ach.icon || "★";
                    if (!isUnlocked) icon = "🔒";

                    return (
                        <AchievementListItem
                            key={ach.id}
                            ach={ach}
                            isUnlocked={isUnlocked}
                            icon={icon}
                            onClick={() => handleBadgeClick(ach.id)}
                            scrollContainer={scrollContainer}
                            isSelected={selectedAchId !== null} // Pauses (hides) 3D badge if modal is open
                        />
                    );
                })}
            </div>
            
            {/* Modal Popup */}
            {selectedAch && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={handleClose}>
                    <div className="bg-white rounded-2xl w-full max-w-lg p-8 flex flex-col items-center shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                         <div className="w-96 h-96 relative mb-6">
                             {/* Large View for Detail - Use Local Canvas for Z-Index independence over the modal */}
                             <Canvas className="w-full h-full" style={{ zIndex: 2005 }}>
                                <BadgeScene
                                    tier={selectedAch.tier}
                                    label={""}
                                    subLabel={""}
                                    icon={selectedAch.icon || "★"}
                                    isLocked={!unlockedIds.includes(selectedAch.id)}
                                    enableControls={true}
                                />
                             </Canvas>
                         </div>
                         
                         <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedAch.title}</h2>
                         <div className="flex gap-2 mb-4 justify-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider
                                ${selectedAch.tier === 'BRONZE' ? 'bg-amber-700' : 
                                  selectedAch.tier === 'SILVER' ? 'bg-slate-400' : 
                                  selectedAch.tier === 'GOLD' ? 'bg-yellow-500' : 
                                  selectedAch.tier === 'PLATINUM' ? 'bg-slate-600' :
                                  selectedAch.tier === 'DIAMOND' ? 'bg-cyan-400' :
                                  selectedAch.tier === 'MASTER' ? 'bg-[#ff8fa3]' :
                                  'bg-slate-900' /* DOCTOR */
                                }`}>
                                {selectedAch.tier}
                            </span>
                            {!unlockedIds.includes(selectedAch.id) && (
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-200 text-gray-500">
                                    LOCKED
                                </span>
                            )}
                         </div>
                         
                         <p className="text-gray-600 text-center mb-6 leading-relaxed">
                            {selectedAch.description}
                         </p>
                         
                         <button 
                             className="bg-gray-900 text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors"
                             onClick={handleClose}
                         >
                            閉じる
                         </button>
                    </div>
                </div>
            )}
        </div>
    );
}
