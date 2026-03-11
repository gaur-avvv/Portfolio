
import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from '../../store';
import * as THREE from 'three';

// Cinematic easing functions
const easeInOutQuint = (t: number) => t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const easeInOutExpo = (t: number) => t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2;
const easeInQuint = (t: number) => t * t * t * t * t;

export const CameraRig: React.FC = () => {
  const { camera } = useThree();
  const scrollProgress = useStore((state) => state.scrollProgress);
  const activeProject3D = useStore((state) => state.activeProject3D);
  const isHacked = useStore((state) => state.isHacked);
  
  const targetPos = new THREE.Vector3();
  const targetLookAt = new THREE.Vector3();
  const currentLookAt = useRef(new THREE.Vector3(0, 0, -1));

  useFrame((state, delta) => {
    // Stage Transitions:
    // 0.00 - 0.25 : Sector 1 - Voxel Shell
    // 0.25 - 0.50 : Sector 2 - Manifestation (Monolith)
    // 0.50 - 0.75 : Sector 3 - Sentient Core
    // 0.75 - 0.85 : Sector 4 - HyperVoid Singularity
    // 0.85 - 0.95 : Sector 5 - Experience
    // 0.95 - 1.00 : Sector 6 - Deep Void Infinity

    if (scrollProgress < 0.25) {
      // Smooth orbital movement in Level 1
      const p = easeInOutSine(scrollProgress / 0.25);
      targetPos.set(
        Math.cos(p * Math.PI * 0.5) * 14, // Slightly wider
        2 + Math.sin(p * Math.PI) * 0.6,
        Math.sin(p * Math.PI * 0.5) * 14
      );
      targetLookAt.set(0, 0, 0);
    } 
    else if (scrollProgress < 0.5) {
      // DRAMATIC TRANSITION into Level 2 using easeInOutSine
      const p = easeInOutSine((scrollProgress - 0.25) / 0.25);
      const startPos = new THREE.Vector3(14, 2, 2); 
      const endPos = new THREE.Vector3(2, 0.5, -2); // Smoother, cinematic sweep focusing on Monolith
      
      targetPos.lerpVectors(startPos, endPos, p);
      // Sweeping lookAt shift
      targetLookAt.lerpVectors(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -5), p);
    } 
    else if (scrollProgress < 0.75) {
      const p = easeInOutCubic((scrollProgress - 0.5) / 0.25);
      targetPos.set(
        Math.sin(p * Math.PI * 1.2) * 6, // Smoother sweep
        Math.cos(p * Math.PI * 1.2) * 2,
        -5 - p * 25
      );
      targetLookAt.set(0, 0, -20);
    }
    else if (scrollProgress < 0.85) {
      // DRAMATIC TRANSITION into Level 4 using easeInOutQuint
      const p = easeInOutQuint((scrollProgress - 0.75) / 0.1);
      // Plunge deeper and more dramatically into HyperVoid
      targetPos.set(Math.sin(p * Math.PI * 0.6) * 4, 0.5, -40 - p * 80); 
      targetLookAt.set(0, 0, -200 - p * 300); 
      camera.rotation.z = p * Math.PI * 0.8; 
    }
    else {
      // Dramatic final plunge (0.85 - 1.0)
      const p = easeInOutQuint((scrollProgress - 0.85) / 0.15);
      
      // Dramatic spiral/plunge
      targetPos.set(
        Math.sin(p * 12.0) * (20 * p), // Smoother spiral radius
        Math.cos(p * 12.0) * (20 * p), 
        -350 - p * 1000 // Further plunge
      );
      targetLookAt.set(0, 0, -1500); // Further lookAt
      camera.rotation.z = p * Math.PI * 6.0; // Smoother spin
      
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = 45 + p * 100; // More dramatic FOV expansion
        camera.updateProjectionMatrix();
      }
    }

    // Override target if diving into a project
    if (activeProject3D) {
      targetPos.z -= 100; // Dive deep forward
      targetLookAt.z -= 100;
      camera.rotation.z += 0.05; // Add a spin effect during dive
    }

    // Add camera shake if hacked
    if (isHacked) {
      targetPos.x += (Math.random() - 0.5) * 0.3;
      targetPos.y += (Math.random() - 0.5) * 0.3;
      camera.rotation.z += (Math.random() - 0.5) * 0.02;
    }

    // Add subtle, slow camera movement
    const time = state.clock.getElapsedTime();
    targetPos.x += Math.sin(time * 0.05) * 0.2;
    targetPos.y += Math.cos(time * 0.07) * 0.2;

    const lerpFactor = activeProject3D ? 0.06 : (scrollProgress > 0.85 ? 0.008 : 0.025);
    camera.position.lerp(targetPos, lerpFactor);
    currentLookAt.current.lerp(targetLookAt, 0.03);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};
