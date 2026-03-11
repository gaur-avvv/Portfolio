
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const STAR_COUNT = 5000;

export const StarryBackground: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const starData = useMemo(() => {
    const positions = new Float32Array(STAR_COUNT * 3);
    const sizes = new Float32Array(STAR_COUNT);
    const opacities = new Float32Array(STAR_COUNT);

    for (let i = 0; i < STAR_COUNT; i++) {
      // Create a large sphere of stars
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 800 + Math.random() * 1200;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      sizes[i] = Math.random() * 1.5 + 0.5;
      opacities[i] = Math.random() * 0.5 + 0.2;
    }

    return { positions, sizes, opacities };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0001;
      pointsRef.current.rotation.x += 0.00005;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={STAR_COUNT}
          array={starData.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.7}
        color="#ffffff"
        transparent
        opacity={0.4}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
