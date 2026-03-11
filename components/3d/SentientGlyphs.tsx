
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store';

const GLYPH_COUNT = 12;

export const SentientGlyphs: React.FC = () => {
  const scrollProgress = useStore((state) => state.scrollProgress);
  const groupRef = useRef<THREE.Group>(null);

  const glyphs = useMemo(() => {
    return Array.from({ length: GLYPH_COUNT }).map((_, i) => {
      const angle = (i / GLYPH_COUNT) * Math.PI * 2;
      return {
        angle,
        radius: 4 + Math.random() * 2,
        speed: 0.2 + Math.random() * 0.5,
        rotationSpeed: 0.5 + Math.random() * 1,
        type: Math.floor(Math.random() * 3) // 0: Tetrahedron, 1: Octahedron, 2: Icosahedron
      };
    });
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    const isVisible = scrollProgress > 0.4 && scrollProgress < 0.7;
    groupRef.current.visible = isVisible;

    if (isVisible) {
      groupRef.current.children.forEach((child, i) => {
        const g = glyphs[i];
        const currentAngle = g.angle + time * g.speed;
        child.position.x = Math.cos(currentAngle) * g.radius;
        child.position.y = Math.sin(currentAngle) * g.radius;
        child.rotation.x = time * g.rotationSpeed;
        child.rotation.y = time * g.rotationSpeed * 0.5;
      });
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -15]}>
      {glyphs.map((g, i) => (
        <mesh key={i}>
          {g.type === 0 && <tetrahedronGeometry args={[0.3]} />}
          {g.type === 1 && <octahedronGeometry args={[0.3]} />}
          {g.type === 2 && <icosahedronGeometry args={[0.3]} />}
          <meshStandardMaterial 
            color="#3b82f6" 
            emissive="#3b82f6" 
            emissiveIntensity={2} 
            wireframe 
          />
        </mesh>
      ))}
    </group>
  );
};
