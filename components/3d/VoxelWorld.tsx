
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store';

const VOXEL_COUNT = 3000; 
const NUCLEUS_COUNT = 4500;

export const VoxelWorld: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const voxelMeshRef = useRef<THREE.InstancedMesh>(null);
  const nucleusRef = useRef<THREE.Points>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const { scrollProgress, activeColor } = useStore();
  const tempObject = new THREE.Object3D();

  // Generate Spherical Voxel Positions (Voxel Earth)
  const voxelPositions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < VOXEL_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3.8 + (Math.random() * 0.05); 
      pos.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    }
    return pos;
  }, []);

  // Generate Living Nucleus (Core Particles)
  const nucleusData = useMemo(() => {
    const pos = new Float32Array(NUCLEUS_COUNT * 3);
    for (let i = 0; i < NUCLEUS_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * 1.5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!groupRef.current || !voxelMeshRef.current || !nucleusRef.current || !coreRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Subtle color shift
    const hue = (Math.sin(time * 0.5) + 1) / 2;
    const color = new THREE.Color().setHSL(0.6 + hue * 0.1, 0.8, 0.5);
    
    // Apply to material and light
    const material = coreRef.current.material as THREE.MeshStandardMaterial;
    material.emissive.set(color);
    
    const pointLight = coreRef.current.getObjectByProperty('type', 'PointLight') as THREE.PointLight;
    if (pointLight) pointLight.color.set(color);

    const isVisible = scrollProgress < 0.85; // Extended visibility for the shell
    groupRef.current.visible = isVisible;
    if (!isVisible) return;

    // Voxel Shell visibility logic
    voxelMeshRef.current.visible = scrollProgress < 0.35;
    nucleusRef.current.visible = scrollProgress < 0.35;
    coreRef.current.visible = scrollProgress < 0.35;

    // Organic Pulse & Fade Animation
    const pulse = Math.pow(Math.sin(time * 1.2), 10);
    const fadeOpacity = THREE.MathUtils.smoothstep(scrollProgress, 0.25, 0.35);
    
    coreRef.current.scale.setScalar((1.0 + pulse * 0.2) * (1 - fadeOpacity));
    voxelMeshRef.current.scale.setScalar(1 - fadeOpacity);
    nucleusRef.current.scale.setScalar(1 - fadeOpacity);
    
    // Rotate Earth Shell
    groupRef.current.rotation.y = time * 0.08;

    // Update Voxel Instances
    for (let i = 0; i < VOXEL_COUNT; i++) {
      tempObject.position.set(
        voxelPositions[i * 3],
        voxelPositions[i * 3 + 1],
        voxelPositions[i * 3 + 2]
      );
      tempObject.rotation.set(time * 0.2, time * 0.3, 0);
      
      const wave = Math.sin(time * 3 + i * 0.1) * 0.01;
      const s = 0.035 + wave;
      tempObject.scale.setScalar(s);
      
      tempObject.updateMatrix();
      voxelMeshRef.current.setMatrixAt(i, tempObject.matrix);
    }
    voxelMeshRef.current.instanceMatrix.needsUpdate = true;

    // Living Nucleus Swarm Jitter
    const nucPos = nucleusRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < NUCLEUS_COUNT; i++) {
      const idx = i * 3;
      nucPos[idx] += Math.sin(time * 2 + i) * 0.006;
      nucPos[idx + 1] += Math.cos(time * 2.5 + i) * 0.006;
      nucPos[idx + 2] += Math.sin(time * 1.8 + i) * 0.006;
      
      const currentR = Math.sqrt(nucPos[idx]**2 + nucPos[idx+1]**2 + nucPos[idx+2]**2);
      if (currentR > 1.6) {
        nucPos[idx] *= 0.95;
        nucPos[idx + 1] *= 0.95;
        nucPos[idx + 2] *= 0.95;
      }
    }
    nucleusRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={voxelMeshRef} args={[null as any, null as any, VOXEL_COUNT]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={activeColor} 
          emissive={activeColor} 
          emissiveIntensity={0.6} 
          metalness={1} 
          roughness={0.1}
        />
      </instancedMesh>

      <points ref={nucleusRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={NUCLEUS_COUNT} array={nucleusData} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.025} color={activeColor} transparent opacity={0.7} blending={THREE.AdditiveBlending} />
      </points>

      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.5, 3]} />
        <meshStandardMaterial color="#000000" emissive={activeColor} emissiveIntensity={2.0} wireframe transparent opacity={0.4} />
        <pointLight intensity={80} color={activeColor} distance={20} />
      </mesh>
    </group>
  );
};
