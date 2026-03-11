import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store';

export const GridField: React.FC = () => {
  const gridRef = useRef<THREE.GridHelper>(null);
  const activeColor = useStore((state) => state.activeColor);
  
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.getElapsedTime() * 2) % 10;
    }
  });

  return (
    <group rotation={[Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      <gridHelper ref={gridRef} args={[100, 20, activeColor, "#0a192f"]} />
    </group>
  );
};