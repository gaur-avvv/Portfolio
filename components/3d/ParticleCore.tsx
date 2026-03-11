import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store';

export const ParticleCore: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const scrollProgress = useStore((state) => state.scrollProgress);
  const activeColor = useStore((state) => state.activeColor);

  const particleCount = 3000;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 2.5 + Math.random() * 6.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const jitter = 1.0 + (Math.random() - 0.5) * 0.3;
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta) * jitter;
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * jitter;
      pos[i * 3 + 2] = r * Math.cos(phi) * jitter;
    }
    return pos;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const visible = scrollProgress > 0.45 && scrollProgress < 0.85;

    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.06;
      pointsRef.current.visible = visible;
      
      pointsRef.current.position.x = 0;
      pointsRef.current.position.y = 0;
      pointsRef.current.scale.setScalar(1 + Math.sin(time * 0.8) * 0.02);
    }

    if (coreRef.current) {
      coreRef.current.visible = scrollProgress > 0.52 && scrollProgress < 0.82;
      coreRef.current.rotation.x = time * 0.5;
      coreRef.current.rotation.y = time * 0.8;
      
      // Dynamic scaling logic
      // Smooth, breathing pulse for idle state
      const breathing = 1 + Math.sin(time * 2.5) * 0.15;
      // Scale based on scroll entrance
      const entrance = THREE.MathUtils.smoothstep(scrollProgress, 0.5, 0.6);
      const scale = breathing * entrance * 1.2;
      const mat = coreRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 8 + Math.sin(time * 2) * 4;
      
      coreRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={[0, 0, -15]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute 
            attach="attributes-position" 
            count={particleCount} 
            array={positions} 
            itemSize={3} 
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.05} 
          color={activeColor} 
          transparent 
          opacity={0.6} 
          sizeAttenuation 
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      <mesh ref={coreRef}>
        <octahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial 
          color={activeColor} 
          emissive={activeColor} 
          emissiveIntensity={10} 
          wireframe 
          transparent
          opacity={0.9}
        />
        <pointLight intensity={40} color={activeColor} distance={18} decay={2} />
      </mesh>
    </group>
  );
};