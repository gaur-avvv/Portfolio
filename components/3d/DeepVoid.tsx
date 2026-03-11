
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store';

const ATOMIC_COUNT = 20000;
const HEART_COUNT = 5000;   
const STAR_COUNT = 3000;
const COLORFUL_STAR_COUNT = 5000;
const GLOWING_STAR_COUNT = 3000;
const TWINKLE_STAR_COUNT = 6000;
const COSMIC_DUST_COUNT = 5000;
const STAR_MIST_COUNT = 8000;
const DARK_MATTER_COUNT = 30;
const GLOWING_PARTICLE_COUNT = 2000;

const vertexShader = `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;
  attribute float aPhase;
  attribute vec3 aColor;
  varying float vOpacity;
  varying vec3 vColor;

  void main() {
    vColor = aColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    
    // Glitter Algorithm: oscillate size based on time and phase (index-based randomness)
    float glitter = sin(uTime * 3.0 + aPhase * 10.0) * 0.5 + 0.5;
    
    // Opacity oscillation
    vOpacity = 0.3 + glitter * 0.7;
    
    float finalSize = uSize * (0.6 + glitter * 0.4);
    gl_PointSize = finalSize * uPixelRatio * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying float vOpacity;
  varying vec3 vColor;

  void main() {
    // Soft circular particles with a slight "bit" feel
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    
    // Create a "digital" grid effect inside the particle
    float grid = step(0.1, mod(gl_PointCoord.x * 10.0, 1.0)) * step(0.1, mod(gl_PointCoord.y * 10.0, 1.0));
    
    float alpha = vOpacity * (1.0 - smoothstep(0.4, 0.5, dist));
    
    // Mix in the grid for a more technical look
    alpha *= (0.8 + grid * 0.2);
    
    gl_FragColor = vec4(vColor, alpha);
  }
`;

const starVertexShader = `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;
  attribute vec3 color;
  varying vec3 vColor;
  
  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    
    // Twinkle effect
    float twinkle = sin(uTime * 2.0 + position.x * 0.1) * 0.5 + 0.5;
    
    gl_PointSize = uSize * (0.5 + twinkle * 0.5) * uPixelRatio * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const starFragmentShader = `
  varying vec3 vColor;
  
  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    
    gl_FragColor = vec4(vColor, 1.0 - smoothstep(0.4, 0.5, dist));
  }
`;

export const DeepVoid: React.FC = () => {
  const scrollProgress = useStore((state) => state.scrollProgress);
  const atomicRef = useRef<THREE.Points>(null);
  const heartRef = useRef<THREE.Points>(null);
  const starsRef = useRef<THREE.Points>(null);
  const colorfulStarsRef = useRef<THREE.Points>(null);
  const glowingStarsRef = useRef<THREE.Points>(null);
  const twinkleStarsRef = useRef<THREE.Points>(null);
  const cosmicDustRef = useRef<THREE.Points>(null);
  const starMistRef = useRef<THREE.Points>(null);
  const glowingParticlesRef = useRef<THREE.Points>(null);
  const darkMatterRef = useRef<THREE.InstancedMesh>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  const starShaderRef = useRef<THREE.ShaderMaterial>(null);
  const glowingStarShaderRef = useRef<THREE.ShaderMaterial>(null);
  const glowingParticlesShaderRef = useRef<THREE.ShaderMaterial>(null);

  // Generate the "Alpha & Omega" Atomic Swarm
  const atomicData = useMemo(() => {
    const pos = new Float32Array(ATOMIC_COUNT * 3);
    const colors = new Float32Array(ATOMIC_COUNT * 3);
    const phases = new Float32Array(ATOMIC_COUNT);
    
    const palette = [
      new THREE.Color('#ffffff'), // Alpha (White)
      new THREE.Color('#a855f7'), // Deep Violet
      new THREE.Color('#22d3ee'), // Omega (Ethereal Cyan)
    ];

    for (let i = 0; i < ATOMIC_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 40 + Math.random() * 300;
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = -150 - (Math.random() * 500);

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      phases[i] = Math.random();
    }
    return { pos, colors, phases };
  }, []);

  // Generate the Singularity Heart
  const heartData = useMemo(() => {
    const pos = new Float32Array(HEART_COUNT * 3);
    for (let i = 0; i < HEART_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * 15; 
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  const starData = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 600 + Math.random() * 600;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi) - 400;
    }
    return pos;
  }, []);

  const colorfulStarData = useMemo(() => {
    const pos = new Float32Array(COLORFUL_STAR_COUNT * 3);
    const colors = new Float32Array(COLORFUL_STAR_COUNT * 3);
    const palette = [
      new THREE.Color('#ffffff'), // White
      new THREE.Color('#a855f7'), // Deep Violet
      new THREE.Color('#22d3ee'), // Ethereal Cyan
    ];
    for (let i = 0; i < COLORFUL_STAR_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 1000;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1000;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1000 - 500;
      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { pos, colors };
  }, []);

  const glowingStarData = useMemo(() => {
    const pos = new Float32Array(GLOWING_STAR_COUNT * 3);
    const colors = new Float32Array(GLOWING_STAR_COUNT * 3);
    const palette = [
      new THREE.Color('#ff00ff'), // Magenta
      new THREE.Color('#00ffff'), // Cyan
      new THREE.Color('#ffff00'), // Yellow
      new THREE.Color('#ffffff'), // White
    ];
    for (let i = 0; i < GLOWING_STAR_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 1200;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1200;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1200 - 600;
      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { pos, colors };
  }, []);

  const twinkleStarData = useMemo(() => {
    const pos = new Float32Array(TWINKLE_STAR_COUNT * 3);
    const colors = new Float32Array(TWINKLE_STAR_COUNT * 3);
    const palette = [
      new THREE.Color('#ffffff'), // White
      new THREE.Color('#a855f7'), // Deep Violet
      new THREE.Color('#22d3ee'), // Ethereal Cyan
    ];
    for (let i = 0; i < TWINKLE_STAR_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 2000;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2000 - 1000;
      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { pos, colors };
  }, []);

  const starMistData = useMemo(() => {
    const pos = new Float32Array(STAR_MIST_COUNT * 3);
    for (let i = 0; i < STAR_MIST_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 300 + Math.random() * 400;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi) - 100;
    }
    return pos;
  }, []);

  const glowingParticleData = useMemo(() => {
    const pos = new Float32Array(GLOWING_PARTICLE_COUNT * 3);
    const colors = new Float32Array(GLOWING_PARTICLE_COUNT * 3);
    const sizes = new Float32Array(GLOWING_PARTICLE_COUNT);
    const palette = [
      new THREE.Color('#ff00ff'), // Magenta
      new THREE.Color('#00ffff'), // Cyan
      new THREE.Color('#ffff00'), // Yellow
    ];
    for (let i = 0; i < GLOWING_PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 1500;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1500;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1500 - 750;
      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      sizes[i] = Math.random() * 2 + 1;
    }
    return { pos, colors, sizes };
  }, []);

  const cosmicDustData = useMemo(() => {
    const pos = new Float32Array(COSMIC_DUST_COUNT * 3);
    const colors = new Float32Array(COSMIC_DUST_COUNT * 3);
    const palette = [
      new THREE.Color('#442266'), // Deep Purple
      new THREE.Color('#224466'), // Deep Blue
      new THREE.Color('#111122'), // Near Black
    ];
    for (let i = 0; i < COSMIC_DUST_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 400 + Math.random() * 800;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi) - 200;
      
      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { pos, colors };
  }, []);

  const darkMatterData = useMemo(() => {
    const data = [];
    for (let i = 0; i < DARK_MATTER_COUNT; i++) {
      data.push({
        position: new THREE.Vector3((Math.random() - 0.5) * 800, (Math.random() - 0.5) * 800, (Math.random() - 0.5) * 800 - 500),
        size: Math.random() * 20 + 10,
        speed: Math.random() * 0.001 + 0.0005
      });
    }
    return data;
  }, []);

  const darkMatterPositions = useRef(darkMatterData.map(d => d.position.clone()));
  const tempObject = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const isLevel5 = scrollProgress > 0.8;
    const expansion = THREE.MathUtils.smoothstep(scrollProgress, 0.9, 1.0);

    // Animate Main Atomic Swarm
    if (atomicRef.current && shaderRef.current) {
      atomicRef.current.visible = isLevel5;
      atomicRef.current.rotation.z = time * 0.03;
      atomicRef.current.rotation.y = time * 0.01;
      
      shaderRef.current.uniforms.uTime.value = time;
      
      // At the very end, make them explode outwards
      atomicRef.current.scale.setScalar(1 + expansion * 20);
    }

    // Animate the Singularity Heart
    if (heartRef.current) {
      heartRef.current.visible = scrollProgress > 0.92;
      heartRef.current.rotation.y = -time * 0.4;
      heartRef.current.rotation.x = time * 0.15;
      
      const pulse = 1 + Math.sin(time * 8) * 0.15;
      heartRef.current.scale.setScalar(pulse * (1 + expansion * 25));
    }

    if (starsRef.current) {
      starsRef.current.visible = scrollProgress > 0.5;
      starsRef.current.rotation.y = time * 0.003;
    }

    // Animate colorful stars
    if (colorfulStarsRef.current && starShaderRef.current) {
      colorfulStarsRef.current.visible = scrollProgress > 0.95;
      colorfulStarsRef.current.rotation.y = time * 0.05;
      starShaderRef.current.uniforms.uTime.value = time;
    }

    // Animate glowing stars
    if (glowingStarsRef.current && glowingStarShaderRef.current) {
      glowingStarsRef.current.visible = scrollProgress > 0.95;
      glowingStarsRef.current.rotation.y = time * 0.02;
      glowingStarShaderRef.current.uniforms.uTime.value = time * 0.5;
    }

    // Animate twinkle stars
    if (twinkleStarsRef.current) {
      twinkleStarsRef.current.rotation.y = time * 0.01;
      twinkleStarsRef.current.rotation.x = time * 0.005;
    }

    // Animate cosmic dust
    if (cosmicDustRef.current) {
      cosmicDustRef.current.visible = scrollProgress > 0.7;
      cosmicDustRef.current.rotation.y = -time * 0.005;
    }

    // Animate star mist
    if (starMistRef.current) {
      starMistRef.current.visible = scrollProgress > 0.85;
      starMistRef.current.rotation.y = time * 0.002;
    }

    // Animate glowing particles
    if (glowingParticlesRef.current) {
      glowingParticlesRef.current.visible = scrollProgress > 0.8;
      glowingParticlesRef.current.rotation.y = time * 0.01;
      glowingParticlesRef.current.rotation.x = time * 0.005;
    }

    // Animate dark matter spheres
    if (darkMatterRef.current) {
      darkMatterRef.current.visible = scrollProgress > 0.95;
      darkMatterData.forEach((d, i) => {
        const pos = darkMatterPositions.current[i];
        pos.y += Math.sin(time * 0.2 + i) * d.speed * 50;
        pos.x += Math.cos(time * 0.2 + i) * d.speed * 50;
        pos.z += Math.sin(time * 0.1 + i) * d.speed * 20;
        
        tempObject.position.copy(pos);
        tempObject.scale.setScalar(d.size);
        tempObject.updateMatrix();
        darkMatterRef.current.setMatrixAt(i, tempObject.matrix);
      });
      darkMatterRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uSize: { value: 4.0 }
  }), []);

  const starUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uSize: { value: 2.0 }
  }), []);

  const glowingStarUniforms = useMemo(() => ({
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 3.0 }
  }), []);

  return (
    <group>
      {/* Background Star Field */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={STAR_COUNT} array={starData} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.3} color="#ffffff" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </points>

      {/* Colorful Starry Particles */}
      <points ref={colorfulStarsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={COLORFUL_STAR_COUNT} array={colorfulStarData.pos} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={COLORFUL_STAR_COUNT} array={colorfulStarData.colors} itemSize={3} />
        </bufferGeometry>
        <shaderMaterial
          ref={starShaderRef}
          vertexShader={starVertexShader}
          fragmentShader={starFragmentShader}
          uniforms={starUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Glowing Starry Particles */}
      <points ref={glowingStarsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={GLOWING_STAR_COUNT} array={glowingStarData.pos} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={GLOWING_STAR_COUNT} array={glowingStarData.colors} itemSize={3} />
        </bufferGeometry>
        <shaderMaterial
          ref={glowingStarShaderRef}
          vertexShader={starVertexShader}
          fragmentShader={starFragmentShader}
          uniforms={glowingStarUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Twinkling Starry Particles */}
      <points ref={twinkleStarsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={TWINKLE_STAR_COUNT} array={twinkleStarData.pos} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={TWINKLE_STAR_COUNT} array={twinkleStarData.colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.5} vertexColors transparent opacity={0.6} blending={THREE.AdditiveBlending} />
      </points>

      {/* Cosmic Dust Layer */}
      <points ref={cosmicDustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={COSMIC_DUST_COUNT} array={cosmicDustData.pos} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={COSMIC_DUST_COUNT} array={cosmicDustData.colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={2.5} vertexColors transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>

      {/* Star Mist Layer */}
      <points ref={starMistRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={STAR_MIST_COUNT} array={starMistData} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.8} color="#ffffff" transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>

      {/* Glowing Particles Layer */}
      <points ref={glowingParticlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={GLOWING_PARTICLE_COUNT} array={glowingParticleData.pos} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={GLOWING_PARTICLE_COUNT} array={glowingParticleData.colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={1.5} vertexColors transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>

      {/* Dark Matter Spheres */}
      <instancedMesh ref={darkMatterRef} args={[undefined, undefined, darkMatterData.length]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#222" transparent opacity={0.3} />
      </instancedMesh>

      {/* The Universal Atomic Swarm (Glittering Particles) */}
      <points ref={atomicRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={ATOMIC_COUNT} array={atomicData.pos} itemSize={3} />
          <bufferAttribute attach="attributes-aColor" count={ATOMIC_COUNT} array={atomicData.colors} itemSize={3} />
          <bufferAttribute attach="attributes-aPhase" count={ATOMIC_COUNT} array={atomicData.phases} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial
          ref={shaderRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* The Singularity of Everything */}
      <group position={[0, 0, -300]}>
        <points ref={heartRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={HEART_COUNT} array={heartData} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial 
            size={0.12} 
            color="#ffffff" 
            transparent 
            opacity={0.9} 
            sizeAttenuation 
            blending={THREE.AdditiveBlending} 
          />
        </points>
        
        <pointLight intensity={600} color="#ffffff" distance={1200} decay={1.2} />
        <pointLight intensity={400} color="#a855f7" distance={900} decay={1.8} />
      </group>

      {/* Infinite Void Barrier */}
      <mesh position={[0, 0, -1200]}>
        <planeGeometry args={[20000, 20000]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
};
