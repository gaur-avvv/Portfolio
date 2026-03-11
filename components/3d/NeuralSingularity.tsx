
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store';
import { Float, Text } from '@react-three/drei';

const ACHIEVEMENT_COUNT = 5;

export const NeuralSingularity: React.FC = () => {
  const scrollProgress = useStore((state) => state.scrollProgress);
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Group>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  const ringRef3 = useRef<THREE.Mesh>(null);

  const achievements = [
    "Master of Three.js",
    "React Architect",
    "Creative Visionary",
    "Full-Stack Wizard",
    "Immersive Designer"
  ];

  const particles = useMemo(() => {
    const pos = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 5 + Math.random() * 10;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!groupRef.current || !coreRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Visibility range: 0.85 to 0.92
    const visible = scrollProgress > 0.85 && scrollProgress < 0.94;
    groupRef.current.visible = visible;

    if (!visible) return;

    // Pulse core
    const pulse = 1 + Math.sin(time * 3) * 0.15;
    coreRef.current.scale.setScalar(pulse);
    coreRef.current.rotation.y = time * 0.5;
    coreRef.current.rotation.z = time * 0.3;

    // Pulse emissive intensity and lights
    coreRef.current.children.forEach((child: any) => {
      if (child.material) {
        child.material.emissiveIntensity = 2 + Math.sin(time * 5) * 1.5;
      }
      if (child.type === 'PointLight') {
        child.intensity = 40 + Math.sin(time * 4) * 20;
      }
    });

    // Rotate rings
    if (ringRef1.current) ringRef1.current.rotation.x = time * 0.8;
    if (ringRef2.current) ringRef2.current.rotation.y = time * 0.6;
    if (ringRef3.current) ringRef3.current.rotation.z = time * 0.4;

    // Floating animation for the whole group
    groupRef.current.position.y = Math.sin(time * 0.5) * 2;
  });

  return (
    <group ref={groupRef} position={[0, 0, -50]}>
      {/* Neural Core */}
      <group ref={coreRef}>
        <mesh>
          <icosahedronGeometry args={[2, 1]} />
          <meshStandardMaterial 
            color="#7e22ce" 
            emissive="#facc15" 
            emissiveIntensity={2} 
            wireframe 
          />
        </mesh>
        <mesh scale={0.8}>
          <dodecahedronGeometry args={[2, 0]} />
          <meshStandardMaterial 
            color="#facc15" 
            emissive="#7e22ce" 
            emissiveIntensity={3} 
            wireframe 
          />
        </mesh>
        <mesh scale={0.6}>
          <octahedronGeometry args={[2, 0]} />
          <meshStandardMaterial 
            color="#7e22ce" 
            emissive="#facc15" 
            emissiveIntensity={5} 
            wireframe 
          />
        </mesh>
        <pointLight intensity={50} color="#facc15" distance={30} />
        <pointLight intensity={30} color="#7e22ce" distance={50} />
      </group>

      {/* Nested Geometric Rings */}
      <mesh ref={ringRef1}>
        <torusGeometry args={[8, 0.05, 16, 100]} />
        <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={2} />
      </mesh>
      <mesh ref={ringRef2} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[10, 0.05, 16, 100]} />
        <meshStandardMaterial color="#7e22ce" emissive="#7e22ce" emissiveIntensity={2} />
      </mesh>
      <mesh ref={ringRef3} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[12, 0.05, 16, 100]} />
        <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={2} />
      </mesh>

      {/* Achievement Shards */}
      {achievements.map((text, i) => {
        const angle = (i / ACHIEVEMENT_COUNT) * Math.PI * 2;
        const radius = 15;
        return (
          <Float key={i} speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <group position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}>
              <mesh>
                <octahedronGeometry args={[1, 0]} />
                <meshStandardMaterial 
                  color="#7e22ce" 
                  emissive="#facc15" 
                  emissiveIntensity={1.5} 
                  transparent 
                  opacity={0.8} 
                />
              </mesh>
              <Text
                position={[0, -1.5, 0]}
                fontSize={0.5}
                color="#facc15"
                font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKbxmcSA.woff"
                anchorX="center"
                anchorY="middle"
              >
                {text}
              </Text>
            </group>
          </Float>
        );
      })}

      {/* Neural Particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={200} array={particles} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.1} color="#facc15" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
};
