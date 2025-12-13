
"use client";

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useCursor, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';
import { BadgeTier } from '@/lib/achievements';

interface Badge3DProps {
    tier: BadgeTier;
    label: string; // e.g., "50"
    subLabel?: string; // e.g., "Pages"
    icon?: string; // New: Emoji icon
    isLocked?: boolean;
    paused?: boolean; // Control animation/rendering effort
    interactive?: boolean; // New: Mouse interaction mode (parallax)
}

const TIER_COLORS: Record<BadgeTier, string> = {
    BRONZE: "#cd7f32",
    SILVER: "#c0c0c0",
    GOLD: "#ffd700",
    PLATINUM: "#e5e4e2",
    DIAMOND: "#b9f2ff"
};

function Model({ tier, label, subLabel, icon, isLocked, paused = false, interactive = false }: Badge3DProps) {
    const meshRef = useRef<THREE.Group>(null);
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);
    useCursor(hovered);

    // Rotation logic
    useFrame((state, delta) => {
        if (!meshRef.current) return;
        if (paused) return; 

        // Optimization: If NOT active and NOT hovered and NOT interactive and rotation effectively zero, skip math
        if (!active && !hovered && !interactive && Math.abs(meshRef.current.rotation.y) < 0.01 && Math.abs(meshRef.current.rotation.x) < 0.01) {
            return;
        }
        
        if (active) {
             // Spin logic (Click to spin)
             meshRef.current.rotation.y += delta * 12; // Faster spin
             if (meshRef.current.rotation.y > Math.PI * 6) {
                 setActive(false);
                 meshRef.current.rotation.y = 0; 
             }
        } else if (interactive) {
            // Parallax Tilt Logic (Follow Mouse) for Popup
            // state.pointer is normalized (-1 to 1) for the viewport
            const targetY = state.pointer.x * 0.3; // Max rotation ~17 deg (Subtle)
            const targetX = -state.pointer.y * 0.3; 
            
            meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetY, delta * 5);
            meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetX, delta * 5);
        } else if (hovered) {
            // "Eugoo" logic: Gentle wobble for small cards
            const time = state.clock.getElapsedTime();
            meshRef.current.rotation.y = Math.sin(time * 3) * 0.2; // Side to side
            meshRef.current.rotation.x = Math.cos(time * 4) * 0.1; // Tilt approx 0
        } else {
            // Return to rest position
            meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, delta * 4);
            meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, delta * 4);
        }
    });

    const color = isLocked ? "#555" : TIER_COLORS[tier] || "#fff";
    const metalness = isLocked ? 0.2 : 0.9;
    const roughness = isLocked ? 0.8 : 0.1;

    // Display Logic
    // If icon is provided, use it. Otherwise use generic star or lock.
    const displayText = icon || (isLocked ? "🔒" : "★");

    return (
        <group ref={meshRef} 
            visible={!paused} // Hide if paused (optimization + prevents overlay issues)
            onPointerOver={() => !paused && !isLocked && setHover(true)} 
            onPointerOut={() => !paused && setHover(false)}
            onClick={() => !paused && !isLocked && setActive(!active)} // Toggle spin
            scale={1}
        >
            {/* Main Medal Body */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[2, 2, 0.3, 24]} />
                <meshStandardMaterial 
                    color={color} 
                    metalness={metalness} 
                    roughness={roughness} 
                />
            </mesh>
            
            {/* Engraved Icon (Text) */}
            {/* Using Text from drei which renders as a plane with texture */}
            {/* Position slightly above surface (0.16) */}
            <Text
                position={[0, 0, 0.18]} // Centered
                fontSize={2.2} // Much bigger
                fontWeight="800" // Thicker (if font supports it)
                color={isLocked ? "#222" : "#ffffff"} 
                anchorX="center"
                anchorY="middle"
                renderOrder={2} 
                maxWidth={2.0}
                characters="★🔒📄📝🔥🏆" 
            >
                {displayText}
            </Text>
        </group>
    );
}

export { Model as BadgeModel };

// Helper to use OrbitControls conditionally
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

export function BadgeScene(props: Badge3DProps & { enableControls?: boolean }) {
    const controlsRef = useRef<OrbitControlsImpl>(null);
    const [isInteracting, setIsInteracting] = useState(false);

    React.useEffect(() => {
        // console.log(`[Badge3D] Mount: ${props.label}`); // Reduced logging
        return () => {
            // Instant reset on unmount (e.g. closing modal)
            if (controlsRef.current) {
                controlsRef.current.reset();
            }
        }; 
    }, [props.label]);

    // Auto-reset logic logic is largely redundant if we rely on "interactive" prop for movement, 
    // BUT OrbitControls allows manual drag override. We keep it as backup.
    useFrame((state, delta) => {
        if (props.enableControls && controlsRef.current && !isInteracting) {
            // If controls are enabled but not interacting, we reset? 
            // Wait, if we use Mouse Follow (Model-level rotation) AND OrbitControls (Camera-level rotation), 
            // they compound. 
            // If the user drags OrbitControls, the camera moves. 
            // If the user moves mouse, the Model rotates.
            // This is actually a nice "Inspection" feel.
            // But auto-resetting the CAMERA while the user hovers might be annoying?
            // "Hover only" request implies they don't want to drag.
            // So we might as well keep OrbitControls for emergency manual spin, but rely on Model rotation.
            
            const controls = controlsRef.current;
            
            // Damping back to center for camera
            const step = delta * 3.0;
            controls.setAzimuthalAngle(THREE.MathUtils.lerp(controls.getAzimuthalAngle(), 0, step));
            controls.setPolarAngle(THREE.MathUtils.lerp(controls.getPolarAngle(), Math.PI / 2, step));
            controls.update();
        }
    });

    return (
        <>
            {/* Isolated Camera for this View */}
            <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
            
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            <Model {...props} interactive={!!props.enableControls} /> {/* Pass interactive prop */}
            {/* Environment is required for metalness materials to not look black */}
            <Environment preset="park" />
            {props.enableControls && (
                <OrbitControls 
                    ref={controlsRef}
                    enableZoom={false} 
                    enablePan={false} 
                    minPolarAngle={0} 
                    maxPolarAngle={Math.PI}
                    autoRotate={false} // Disable auto-spin, user prefers "return"
                    onStart={() => setIsInteracting(true)}
                    onEnd={() => setIsInteracting(false)}
                />
            )}
        </>
    );
}

// REMOVED default export to prevent accidental new Canvas creation
// export default function Badge3D...
