
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer, Noise, ChromaticAberration, Vignette, Scanline } from '@react-three/postprocessing';
import { VoxelWorld } from './VoxelWorld';
import { DreamMonolith } from './DreamMonolith';
import { ParticleCore } from './ParticleCore';
import { HyperVoid } from './HyperVoid';
import { DeepVoid } from './DeepVoid';
import { Nexus } from './Nexus';
import { ExperienceLevel } from './ExperienceLevel';
import { CosmicParticles } from './CosmicParticles';
import { StarryBackground } from './StarryBackground';
import { CameraRig } from './CameraRig';
import { useStore } from '../../store';

export const Scene: React.FC = () => {
  const scrollProgress = useStore((state) => state.scrollProgress);
  const isHacked = useStore((state) => state.isHacked);
  const activeColor = useStore((state) => state.activeColor);

  // Atmospheric Fog Adjustments for "Pantheon" Contrast
  let fogColor = '#000105';
  if (scrollProgress > 0.65) fogColor = '#020006';
  if (scrollProgress > 0.85) fogColor = '#000000'; // Absolute black for the Singularity
  
  if (isHacked) {
    fogColor = '#050000'; // Deep red/black for hacked state
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-black">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ antialias: false, stencil: false, depth: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={[fogColor]} />
        <fogExp2 attach="fog" args={[fogColor, isHacked ? 0.04 : 0.02]} />
        
        <ambientLight intensity={isHacked ? 0.5 : 0.1} color={isHacked ? "#ff0000" : activeColor} />
        
        <Suspense fallback={null}>
          <StarryBackground />
          <VoxelWorld />
          <DreamMonolith />
          <ParticleCore />
          <HyperVoid />
          <ExperienceLevel />
          <CosmicParticles />
          <DeepVoid />
          <Nexus />
          
          <EffectComposer>
            <Bloom 
              intensity={isHacked ? 2.0 : (scrollProgress > 0.9 ? 1.5 : 0.8)} 
              luminanceThreshold={isHacked ? 0.2 : 0.5} 
              luminanceSmoothing={0.9} 
            />
            <Noise opacity={isHacked ? 0.15 : 0.05} />
            <Vignette darkness={isHacked ? 1.5 : 1.2} offset={0.1} />
            <Scanline opacity={isHacked ? 0.08 : 0.02} />
            {(scrollProgress > 0.9 || isHacked) && (
              <ChromaticAberration offset={isHacked ? [0.015, 0.015] as any : [0.005, 0.005] as any} />
            )}
          </EffectComposer>
        </Suspense>
        
        <CameraRig />
      </Canvas>
    </div>
  );
};
