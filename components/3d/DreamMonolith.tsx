
import React, { useRef, Suspense, useMemo } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store';

const MonolithMaterial: React.FC<{ projectImageUrl: string | null }> = ({ projectImageUrl }) => {
  const projectTexture = projectImageUrl ? useLoader(THREE.TextureLoader, projectImageUrl) : null;
  const { camera } = useThree();

  const activeTexture = projectTexture;

  if (activeTexture) {
    activeTexture.wrapS = activeTexture.wrapT = THREE.RepeatWrapping;
  }

  useFrame(() => {
    if (activeTexture) {
      const parallaxStrength = 0.065;
      const lerpFactor = 0.05;
      activeTexture.offset.x = THREE.MathUtils.lerp(activeTexture.offset.x, -camera.position.x * parallaxStrength, lerpFactor);
      activeTexture.offset.y = THREE.MathUtils.lerp(activeTexture.offset.y, -camera.position.y * parallaxStrength, lerpFactor);
    }
  });

  return (
    <meshStandardMaterial 
      map={activeTexture || undefined} 
      color={activeTexture ? "#cccccc" : "#020202"}
      metalness={0.9}
      roughness={0.1}
      emissive={activeTexture ? "#333333" : "#0a0a0a"}
      emissiveIntensity={activeTexture ? 0.5 : 0.1}
      transparent={true}
      opacity={0.5}
    />
  );
};

export const DreamMonolith: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const { scrollProgress, projects, activeColor } = useStore();

  // Determine which project to show based on scroll progress
  const projectIndex = useMemo(() => {
    if (projects.length === 0) return -1;
    const idx = Math.min(
      Math.floor(((scrollProgress - 0.4) / 0.2) * projects.length),
      projects.length - 1
    );
    return idx >= 0 ? idx : 0;
  }, [scrollProgress, projects]);

  const activeProject = projectIndex >= 0 ? projects[projectIndex] : null;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const visible = scrollProgress >= 0.22 && scrollProgress <= 0.65;

    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(time * 0.4) * 0.15;
      meshRef.current.rotation.y = time * 0.08 + (scrollProgress * 2);
      meshRef.current.visible = visible;
      
      const s = THREE.MathUtils.smoothstep(scrollProgress, 0.22, 0.4) * 1.5;
      meshRef.current.scale.set(s, s * 2, s);
    }

    if (ring1Ref.current && ring2Ref.current) {
      ring1Ref.current.visible = visible;
      ring2Ref.current.visible = visible;
      ring1Ref.current.rotation.x = time * 0.5;
      ring1Ref.current.rotation.y = time * 0.25;
      ring2Ref.current.rotation.z = time * -0.4;
      
      const rs = THREE.MathUtils.smoothstep(scrollProgress, 0.25, 0.4) * 4.5;
      ring1Ref.current.scale.set(rs, rs, rs);
      ring2Ref.current.scale.set(rs * 1.15, rs * 1.15, rs * 1.15);
    }
  });

  return (
    <group position={[0, 0, -5]}>
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 2, 0.1]} />
        <Suspense fallback={<meshStandardMaterial color="#050505" metalness={1} roughness={0} emissive="#1e3a8a" emissiveIntensity={0.2} />}>
          <MonolithMaterial projectImageUrl={activeProject?.imageUrl || null} />
        </Suspense>
      </mesh>
      <pointLight intensity={5} color="#ffffff" distance={15} />

      <mesh ref={ring1Ref}>
        <torusGeometry args={[1, 0.012, 8, 60]} />
        <meshStandardMaterial color={activeColor} emissive={activeColor} emissiveIntensity={12} transparent opacity={0.6} />
      </mesh>

      <mesh ref={ring2Ref}>
        <torusGeometry args={[1, 0.004, 8, 60]} />
        <meshStandardMaterial color={activeColor} emissive={activeColor} emissiveIntensity={8} transparent opacity={0.4} />
      </mesh>
    </group>
  );
};
