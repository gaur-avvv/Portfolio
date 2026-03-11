import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store';

export const Nexus: React.FC = () => {
  const scrollProgress = useStore((state) => state.scrollProgress);
  const activeColor = useStore((state) => state.activeColor);
  const groupRef = useRef<THREE.Group>(null);
  const energyRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.visible = scrollProgress > 0.95;
      groupRef.current.rotation.y = time * 0.2;
      groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.2;
    }
    if (energyRef.current) {
      const scale = 1 + Math.sin(time * 5) * 0.2;
      energyRef.current.scale.setScalar(scale);
    }
  });

  const torusGeometry = useMemo(() => new THREE.TorusGeometry(1, 0.1, 16, 100), []);
  const torusMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: activeColor, transparent: true, opacity: 0.4, wireframe: true }), [activeColor]);
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (instancedMeshRef.current) {
      const matrix = new THREE.Matrix4();
      for (let i = 0; i < 12; i++) {
        matrix.makeRotationFromEuler(new THREE.Euler(i * 0.5, i * 0.5, 0));
        const radius = 5 + i * 0.5;
        matrix.scale(new THREE.Vector3(radius, radius, radius));
        instancedMeshRef.current.setMatrixAt(i, matrix);
      }
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [torusGeometry]);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central Energy Source */}
      <mesh ref={energyRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color={activeColor} transparent opacity={0.8} />
      </mesh>
      <pointLight intensity={1000} color={activeColor} distance={50} />

      {/* Interconnected Geometry */}
      <instancedMesh ref={instancedMeshRef} args={[torusGeometry, torusMaterial, 12]} />
    </group>
  );
};
