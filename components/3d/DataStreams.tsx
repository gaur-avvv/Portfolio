
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store';

const STREAM_COUNT = 40;

export const DataStreams: React.FC = () => {
  const scrollProgress = useStore((state) => state.scrollProgress);
  const groupRef = useRef<THREE.Group>(null);

  const streams = useMemo(() => {
    return Array.from({ length: STREAM_COUNT }).map(() => ({
      x: (Math.random() - 0.5) * 60,
      y: (Math.random() - 0.5) * 60,
      z: -Math.random() * 150,
      speed: 0.8 + Math.random() * 3,
      length: 2 + Math.random() * 10,
      color: Math.random() > 0.3 ? '#3b82f6' : '#10b981' // Blue and Emerald
    }));
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    const isVisible = scrollProgress > 0.6 && scrollProgress < 0.9;
    groupRef.current.visible = isVisible;

    if (isVisible) {
      groupRef.current.children.forEach((child, i) => {
        const s = streams[i];
        child.position.z = ((s.z + time * s.speed * 20) % 100) - 50;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {streams.map((s, i) => (
        <mesh key={i} position={[s.x, s.y, s.z]}>
          <boxGeometry args={[0.02, 0.02, s.length]} />
          <meshStandardMaterial 
            color={s.color} 
            emissive={s.color} 
            emissiveIntensity={4} 
            transparent 
            opacity={0.4} 
          />
        </mesh>
      ))}
    </group>
  );
};
