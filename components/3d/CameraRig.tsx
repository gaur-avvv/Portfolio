
import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from '../../store';
import * as THREE from 'three';

// Cinematic easing functions
const easeInOutQuint = (t: number) => t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
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
        Math.cos(p * Math.PI * 0.5) * 12,
        2 + Math.sin(p * Math.PI) * 0.5,
        Math.sin(p * Math.PI * 0.5) * 12
      );
      targetLookAt.set(0, 0, 0);
    } 
    else if (scrollProgress < 0.5) {
      // DRAMATIC TRANSITION into Level 2 using easeInOutSine
      const p = easeInOutSine((scrollProgress - 0.25) / 0.25);
      const startPos = new THREE.Vector3(0, 2.5, 12); 
      const endPos = new THREE.Vector3(0, 0.2, -2.0); // Zoom closer to Monolith
      
      targetPos.lerpVectors(startPos, endPos, p);
      // Sweeping lookAt shift
      targetLookAt.lerpVectors(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0.1, -8), p);
    } 
    else if (scrollProgress < 0.75) {
      const p = easeInOutCubic((scrollProgress - 0.5) / 0.25);
      targetPos.set(
        Math.sin(p * Math.PI * 1.5) * 5,
        Math.cos(p * Math.PI * 1.5) * 2.5,
        -5 - p * 28
      );
      targetLookAt.set(0, 0, -22);
    }
    else if (scrollProgress < 0.85) {
      // DRAMATIC TRANSITION into Level 4 using easeInOutQuint
      const p = easeInOutQuint((scrollProgress - 0.75) / 0.1);
      targetPos.set(Math.sin(p * Math.PI) * 5, 0, -35 - p * 40); // More dramatic sweep
      targetLookAt.set(0, 0, -80);
      camera.rotation.z = p * Math.PI * 0.5; // Increased rotation
    }
    else {
      // Dramatic final plunge (0.85 - 1.0)
      const p = easeInQuint((scrollProgress - 0.85) / 0.15); 
      
      // Dramatic spiral/plunge
      targetPos.set(
        Math.sin(p * 10.0) * (20 * p),
        Math.cos(p * 10.0) * (20 * p),
        -150 - p * 500
      );
      targetLookAt.set(0, 0, -600);
      camera.rotation.z = p * Math.PI * 4.0; // Faster spin
      
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

    const lerpFactor = activeProject3D ? 0.08 : (scrollProgress > 0.75 ? 0.015 : 0.035);
    camera.position.lerp(targetPos, lerpFactor);
    currentLookAt.current.lerp(targetLookAt, 0.03);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};
