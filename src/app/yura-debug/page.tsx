
"use client";

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { BadgeScene } from '../components/Badge3D';
import { BadgeTier } from '@/lib/achievements';

const TIERS: BadgeTier[] = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'MASTER', 'DOCTOR'];

export default function DebugBadgesPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">🎖 3D Badge Debug Room</h1>
            <p className="mb-8 text-gray-600">
                Visual inspection for all badge tiers and states. 
                Background Environment: <strong>Sunset</strong>
            </p>

            {/* Grid of Tiers */}
            <section className="mb-12">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Unlocked Tiers</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-8">
                    {TIERS.map(tier => (
                        <div key={tier} className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
                            <div className="w-48 h-48 relative border rounded-lg bg-gray-100 mb-4">
                                <Canvas className="w-full h-full">
                                    <BadgeScene 
                                        tier={tier}
                                        label=""
                                        subLabel=""
                                        icon="★"
                                        isLocked={false}
                                        enableControls={true} // Allow manual spin to inspect angles
                                    />
                                </Canvas>
                            </div>
                            <span className="font-bold text-indigo-900">{tier}</span>
                            <span className="text-xs text-gray-400 mt-1">Interactivity: Enabled - Drag to rotate</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Locked State */}
            <section className="mb-12">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Locked State</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
                        <div className="w-48 h-48 relative border rounded-lg bg-gray-100 mb-4">
                            <Canvas className="w-full h-full">
                                <BadgeScene 
                                    tier="BRONZE" // Tier shouldn't matter for locked color, but testing
                                    label=""
                                    subLabel=""
                                    icon="🔒"
                                    isLocked={true}
                                    enableControls={true}
                                />
                            </Canvas>
                        </div>
                        <span className="font-bold text-gray-500">LOCKED (Bronze base)</span>
                    </div>
                </div>
            </section>

             {/* Icons Check */}
             <section className="mb-12">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Icon Rendering Check</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                     {[
                         { icon: "🔥", label: "Streak" }, 
                         { icon: "🎓", label: "Graduation" }, 
                         { icon: "👻", label: "Ghost" }, 
                         { icon: "🚀", label: "Rocket" }
                    ].map(item => (
                        <div key={item.label} className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
                            <div className="w-32 h-32 relative mb-2">
                                <Canvas className="w-full h-full">
                                    <BadgeScene 
                                        tier="GOLD"
                                        label=""
                                        subLabel=""
                                        icon={item.icon}
                                        isLocked={false}
                                        enableControls={false}
                                        paused={false} // Force continuous render for wobble effect
                                    />
                                </Canvas>
                            </div>
                            <span className="text-sm font-medium">{item.label} {item.icon}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
