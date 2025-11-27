'use client';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeDComponent = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Basic setup for Three.js scene, camera, and renderer
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // Create a luxurious-looking object (Octahedron for complexity and elegance)
    const geometry = new THREE.OctahedronGeometry(1.5, 0);
    
    // Gold metallic material
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffd700, // Gold color
      metalness: 1.0,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    
    const octahedron = new THREE.Mesh(geometry, material);
    scene.add(octahedron);

    // Lighting (Essential for metallic materials)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight1 = new THREE.PointLight(0xffffff, 50, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);
    const pointLight2 = new THREE.PointLight(0x00ffcc, 30, 100);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    camera.position.z = 4;

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      octahedron.rotation.x += 0.005;
      octahedron.rotation.y += 0.008;
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (currentMount) {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[400px] rounded-xl relative"
    >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-white/50 text-xs font-mono">
            3D INTERACTIVE PRODUCT VISUAL
        </div>
    </div>
  );
};

export default ThreeDComponent;
