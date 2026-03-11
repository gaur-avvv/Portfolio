import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store';

export const CosmicParticles: React.FC = () => {
  const scrollProgress = useStore((state) => state.scrollProgress);
  const groupRef = useRef<THREE.Group>(null);
  const count = 1000;

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100
        ),
        speed: Math.random() * 0.02 + 0.005,
        size: Math.random() * 0.5 + 0.1,
        color: new THREE.Color(Math.random() > 0.5 ? '#22d3ee' : '#a855f7')
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const visible = scrollProgress > 0.85 && scrollProgress < 0.95;
    groupRef.current.visible = visible;
    
    groupRef.current.children.forEach((child, i) => {
      child.position.y += particles[i].speed;
      if (child.position.y > 50) child.position.y = -50;
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, -200]}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position}>
          <sphereGeometry args={[p.size, 8, 8]} />
          <meshBasicMaterial color={p.color} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
};
