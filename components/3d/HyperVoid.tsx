import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store';

const SCATTER_COUNT = 1000; // Increased for richer look

export const HyperVoid: React.FC = () => {
  const scrollProgress = useStore((state) => state.scrollProgress);
  const projects = useStore((state) => state.projects);
  const gateRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Group>(null);
  const scatterRef = useRef<THREE.Points>(null);
  const ambientLightRef = useRef<THREE.PointLight>(null);
  
  const scatterParticles = useMemo(() => {
    const pos = new Float32Array(SCATTER_COUNT * 3);
    for (let i = 0; i < SCATTER_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 2] = -10 - Math.random() * 100;
    }
    return pos;
  }, []);

  const shards = useMemo(() => {
    const arr = [];
    const shardCount = 100;
    for (let i = 0; i < shardCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 25;
      arr.push({
        angle, radius,
        speed: 0.18 + Math.random() * 0.35,
        z: -10 - Math.random() * 80,
        size: 0.1 + Math.random() * 0.6,
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const visible = scrollProgress > 0.55 && scrollProgress < 0.75;

    if (gateRef.current) {
      gateRef.current.visible = visible;
      gateRef.current.rotation.z = time * 0.04;
      gateRef.current.position.z = -30;
    }

    if (scatterRef.current) {
      scatterRef.current.visible = visible;
      scatterRef.current.rotation.z = -time * 0.03;
    }

    if (ambientLightRef.current) {
      ambientLightRef.current.visible = visible;
      ambientLightRef.current.intensity = 40 + Math.sin(time * 3.5) * 15;
    }

    if (coreRef.current) {
      coreRef.current.visible = visible;
      coreRef.current.rotation.y = time * 0.6;
      const s = 1.0 + Math.sin(time * 2.5) * 0.1;
      coreRef.current.scale.setScalar(s);
      
      coreRef.current.children.forEach((child, i) => {
        child.rotation.z += 0.02;
        child.rotation.x -= 0.01;
      });
    }
  });

  return (
    <group>
      {/* Ambient Neon Scene Glow - Enhanced */}
      <pointLight ref={ambientLightRef} position={[0, 20, -45]} color="#facc15" intensity={50} distance={120} decay={1.5} />
      <pointLight position={[15, -15, -45]} color="#facc15" intensity={30} distance={90} decay={1.5} />
      <pointLight position={[-15, -15, -45]} color="#facc15" intensity={30} distance={90} decay={1.5} />

      {/* Scattering Neon Glow Particles */}
      <points ref={scatterRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={SCATTER_COUNT} array={scatterParticles} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial 
          size={0.14} 
          color="#facc15" 
          transparent 
          opacity={0.35} 
          sizeAttenuation 
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Level 4 Architecture Gate */}
      <group ref={gateRef}>
        <mesh>
          <torusGeometry args={[18, 0.03, 16, 120]} />
          <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={1.0} wireframe opacity={0.12} transparent />
        </mesh>
      </group>

      {/* Level 4 Neural Singularity Core */}
      <group ref={coreRef} position={[0, 0, -40]}>
        <mesh>
          <sphereGeometry args={[0.9, 32, 32]} />
          <meshPhysicalMaterial color="#000000" emissive="#facc15" emissiveIntensity={8} metalness={1} roughness={0} />
        </mesh>
        
        <mesh rotation={[Math.PI/4, 0, 0]}>
          <torusKnotGeometry args={[1.8, 0.08, 128, 16]} />
          <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={5} wireframe transparent opacity={0.6} />
        </mesh>

        <mesh>
          <dodecahedronGeometry args={[3.2, 1]} />
          <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={1.5} wireframe transparent opacity={0.15} />
        </mesh>

        <pointLight intensity={45} color="#facc15" distance={70} decay={2} />
      </group>

      {/* Project Shards */}
      <group position={[0, 0, -20]}>
        {projects.map((project, i) => (
          <ProjectShard key={project.id} project={project} index={i} total={projects.length} />
        ))}
      </group>

      {/* Fast Traveling Data Shards */}
      <group position={[0, 0, -30]}>
        {shards.map((shard, i) => (
          <Shard key={i} {...shard} />
        ))}
      </group>
    </group>
  );
};

const ProjectShard: React.FC<{ project: any, index: number, total: number }> = ({ project, index, total }) => {
  const meshRef = useRef<THREE.Group>(null);
  const scrollProgress = useStore((state) => state.scrollProgress);
  const themeColor = useStore((state) => state.themeColor);
  const setActiveProject3D = useStore((state) => state.setActiveProject3D);
  const isHacked = useStore((state) => state.isHacked);
  
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (project.imageUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(
        project.imageUrl,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          setTexture(tex);
        },
        undefined,
        (err) => console.error("Error loading texture", err)
      );
    }
  }, [project.imageUrl]);

  // Base position
  const angle = (index / total) * Math.PI * 2;
  const radius = 12;
  const zOffset = -10 - (index * 15);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    
    const visible = scrollProgress > 0.55 && scrollProgress < 0.75;
    meshRef.current.visible = visible;

    if (!visible) return;

    // The shards travel along the Z axis towards the camera as scroll progresses
    const progressInZone = Math.max(0, Math.min(1, (scrollProgress - 0.55) / 0.2));
    
    // Base Z position moves forward based on scroll
    const targetZ = zOffset + (progressInZone * 50) + Math.sin(time * 0.5 + index) * 2;
    
    // Orbiting motion
    const currentAngle = angle + time * 0.1 + (progressInZone * Math.PI * 0.5);
    const currentRadius = radius - (progressInZone * 3) + Math.sin(time * 1.5 + index) * 1.5;

    meshRef.current.position.x = Math.cos(currentAngle) * currentRadius;
    meshRef.current.position.y = Math.sin(currentAngle) * currentRadius;
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.1);

    // Rotation
    meshRef.current.rotation.y = time * 0.2 + index;
    meshRef.current.rotation.x = Math.sin(time * 0.3 + index) * 0.2;
    meshRef.current.rotation.z = Math.cos(time * 0.2 + index) * 0.1;
    
    // Hover scale
    const targetScale = hovered ? 1.2 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <group 
      ref={meshRef} 
      position={[Math.cos(angle) * radius, Math.sin(angle) * radius, zOffset]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { setHovered(false); document.body.style.cursor = 'none'; }}
      onClick={(e) => { e.stopPropagation(); setActiveProject3D(project.id); }}
    >
      <mesh>
        <boxGeometry args={[4, 6, 0.2]} />
        <meshStandardMaterial 
          map={texture || null}
          color={texture ? '#ffffff' : themeColor} 
          emissive={isHacked ? '#ff0000' : themeColor} 
          emissiveIntensity={hovered ? 1.0 : (texture ? 0.2 : 0.8)}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(4, 6, 0.2)]} />
        <lineBasicMaterial color={isHacked ? '#ff0000' : themeColor} transparent opacity={hovered ? 1.0 : 0.5} />
      </lineSegments>
    </group>
  );
};

const Shard: React.FC<any> = ({ angle, radius, speed, z, size }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const scrollProgress = useStore((state) => state.scrollProgress);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.position.z = ((z + time * speed * 55) % 80) - 50;
    meshRef.current.visible = scrollProgress > 0.55 && scrollProgress < 0.75;
    meshRef.current.rotation.x += 0.025;
  });

  return (
    <mesh ref={meshRef} position={[Math.cos(angle) * radius, Math.sin(angle) * radius, z]}>
      <octahedronGeometry args={[size, 0]} />
      <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={3.0} transparent opacity={0.6} />
    </mesh>
  );
};