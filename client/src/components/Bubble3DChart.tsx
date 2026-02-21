'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface Company {
  id: string;
  name: string;
  industry: string;
  overallScore: number;
  workLifeBalance: number;
  turnoverRate: number;
}

interface Bubble3DChartProps {
  companies: Company[];
  onHover?: (company: Company | null) => void;
  onClick?: (company: Company) => void;
  focusCompanyId?: string;
}

export function Bubble3DChart({ companies, onHover, onClick, focusCompanyId }: Bubble3DChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const bubblesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const hoveredBubbleRef = useRef<THREE.Mesh | null>(null);
  const pinnedBubbleRef = useRef<THREE.Mesh | null>(null);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 12;
    camera.position.y = 1;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.9);
    pointLight.position.set(50, 50, 50);
    scene.add(pointLight);

    // Create bubbles
    const bubbles = new Map<string, THREE.Mesh>();
    const colorMap = new Map<string, number>();
    const industries = Array.from(new Set(companies.map(c => c.industry)));
    
    industries.forEach((industry, index) => {
      const hue = (index / industries.length) * 360;
      colorMap.set(industry, hue);
    });

    // Calculate ranges - ZOOM IN on metrics for better spread
    const scores = companies.map(c => c.overallScore);
    const balances = companies.map(c => c.workLifeBalance);
    const turnoverRates = companies.map(c => c.turnoverRate);

    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const scoreRange = maxScore - minScore || 1;

    const minBalance = Math.min(...balances);
    const maxBalance = Math.max(...balances);
    const balanceRange = maxBalance - minBalance || 1;

    const minTurnover = Math.min(...turnoverRates);
    const maxTurnover = Math.max(...turnoverRates);
    const turnoverRange = maxTurnover - minTurnover || 1;

    companies.forEach((company) => {
      // Size based on overall score (larger range)
      const normalizedScore = (company.overallScore - minScore) / scoreRange;
      const size = 0.6 + normalizedScore * 3.0;
      
      const geometry = new THREE.SphereGeometry(size, 32, 32);
      
      const hue = colorMap.get(company.industry) || 0;
      const color = new THREE.Color();
      color.setHSL(hue / 360, 0.7, 0.5);
      
      const material = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.3,
        shininess: 100,
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      
      // ZOOM IN on work-life balance (use smaller scale range)
      const normalizedBalance = (company.workLifeBalance - minBalance) / balanceRange;
      const posX = (normalizedBalance * 120) - 60;
      
      // ZOOM IN on turnover rate (use smaller scale range)
      const normalizedTurnover = (company.turnoverRate - minTurnover) / turnoverRange;
      const posY = 8 - (normalizedTurnover * 16);
      
      const posZ = (Math.random() - 0.5) * 10;
      
      mesh.position.set(posX, posY, posZ);
      mesh.userData = { company };
      scene.add(mesh);
      bubbles.set(company.id, mesh);
    });
    
    bubblesRef.current = bubbles;

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(Array.from(bubbles.values()));

      // Reset previous hover
      if (hoveredBubbleRef.current && hoveredBubbleRef.current !== pinnedBubbleRef.current) {
        const material = hoveredBubbleRef.current.material as THREE.MeshPhongMaterial;
        material.emissiveIntensity = 0.3;
        hoveredBubbleRef.current.scale.set(1, 1, 1);
      }

      if (intersects.length > 0) {
        const hovered = intersects[0].object as THREE.Mesh;
        const company = hovered.userData.company;
        
        if (hovered !== pinnedBubbleRef.current) {
          const material = hovered.material as THREE.MeshPhongMaterial;
          material.emissiveIntensity = 0.8;
          hovered.scale.set(1.3, 1.3, 1.3);
          hoveredBubbleRef.current = hovered;
          console.log('Hover:', company.name);
          onHover?.(company);
        }
      } else {
        onHover?.(null);
        hoveredBubbleRef.current = null;
      }
    };

    const onMouseClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(Array.from(bubbles.values()));

      if (intersects.length > 0) {
        const clicked = intersects[0].object as THREE.Mesh;
        const company = clicked.userData.company;
        
        if (pinnedBubbleRef.current?.userData?.company?.id === company.id) {
          // Unpin
          pinnedBubbleRef.current = null;
          const material = clicked.material as THREE.MeshPhongMaterial;
          material.emissiveIntensity = 0.3;
          clicked.scale.set(1, 1, 1);
        } else {
          // Pin new
          if (pinnedBubbleRef.current) {
            const prevMaterial = pinnedBubbleRef.current.material as THREE.MeshPhongMaterial;
            prevMaterial.emissiveIntensity = 0.3;
            pinnedBubbleRef.current.scale.set(1, 1, 1);
          }
          
          pinnedBubbleRef.current = clicked;
          const material = clicked.material as THREE.MeshPhongMaterial;
          material.emissiveIntensity = 1.0;
          clicked.scale.set(1.4, 1.4, 1.4);
        }
        
        console.log('Click:', company.name);
        onClick?.(company);
      }
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onMouseClick);

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      scene.rotation.x += 0.0001;
      scene.rotation.y += 0.0002;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('click', onMouseClick);
      cancelAnimationFrame(animationId);
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      bubbles.forEach((bubble) => {
        (bubble.geometry as THREE.BufferGeometry).dispose();
        (bubble.material as THREE.Material).dispose();
      });
      renderer.dispose();
    };
  }, [companies, onHover, onClick]);

  // Handle focus
  useEffect(() => {
    if (!focusCompanyId || !bubblesRef.current || !cameraRef.current) return;

    const focusedBubble = bubblesRef.current.get(focusCompanyId);
    if (!focusedBubble) return;

    const bubblePos = focusedBubble.position.clone();
    const startPos = cameraRef.current.position.clone();
    const endPos = bubblePos.clone();
    endPos.z += 8;
    endPos.y += 1;

    const startTime = Date.now();
    const duration = 1000;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animateCamera = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      if (cameraRef.current) {
        cameraRef.current.position.lerpVectors(startPos, endPos, eased);
        cameraRef.current.lookAt(bubblePos);
      }

      if (progress < 1) {
        requestAnimationFrame(animateCamera);
      }
    };

    animateCamera();
  }, [focusCompanyId]);

  return (
    <div className="w-full h-full relative bg-slate-950">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute bottom-4 left-4 text-slate-400 text-xs pointer-events-none">
        <p>Hover to preview • Click to pin</p>
      </div>
    </div>
  );
}
