"use client";

import { Canvas } from '@react-three/fiber';
import { View, Environment, Preload } from '@react-three/drei';

export default function ViewCanvas() {
    return (
        <Canvas
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 840,
            }}

            dpr={[1, 1.5]} // Limit DPR for performance stability
            onCreated={(state) => {
                console.log("[ViewCanvas] Init. Scale:", state.viewport.dpr);
                console.log("[ViewCanvas] Event Source:", state.events.connected);
                
                state.gl.domElement.addEventListener('webglcontextlost', (event) => {
                    event.preventDefault();
                    console.error("[ViewCanvas] CRITICAL: WebGL Context LOST!");
                }, false);
                state.gl.domElement.addEventListener('webglcontextrestored', () => {
                   console.log("[ViewCanvas] WebGL Context Restored");
                }, false);
            }}
        >
            <View.Port />
            <Preload all />
        </Canvas>
    );
}
