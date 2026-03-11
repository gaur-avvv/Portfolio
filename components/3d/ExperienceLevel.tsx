import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store';

export const ExperienceLevel: React.FC = () => {
  const scrollProgress = useStore((state) => state.scrollProgress);
  const groupRef = useRef<THREE.Group>(null);
  const activeColor = useStore((state) => state.activeColor);

  useFrame((state) => {
    if (!groupRef.current) return;
    const visible = scrollProgress > 0.85 && scrollProgress < 0.95;
    groupRef.current.visible = visible;
    groupRef.current.rotation.y += 0.01;
    groupRef.current.rotation.x += 0.005;
  });

  return (
    <group ref={groupRef} position={[0, 0, -250]}>
      <mesh>
        <octahedronGeometry args={[5, 0]} />
        <meshStandardMaterial color={activeColor} emissive={activeColor} emissiveIntensity={2} wireframe />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={1} />
      </mesh>
    </group>
  );
};
