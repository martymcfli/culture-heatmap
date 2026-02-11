'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Company {
  id: string;
  name: string;
  industry: string;
  overallScore: number;
  workLifeBalance: number;
  turnoverRate: number;
}

interface Bubble3DChartProps {
  companies: Company[];
  onBubbleClick?: (company: Company) => void;
  focusCompanyId?: string;
}

export function Bubble3DChart({ companies, onBubbleClick, focusCompanyId }: Bubble3DChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const bubblesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const [hoveredCompany, setHoveredCompany] = useState<Company | null>(null);
  const [pinnedCompany, setPinnedCompany] = useState<Company | null>(null);
  const hoveredBubbleRef = useRef<THREE.Mesh | null>(null);
  const pinnedBubbleRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    // Zoom in much closer for better bubble visibility
    camera.position.z = 15;
    camera.position.y = 2;
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

    // Create bubbles with metric-based positioning
    const bubbles = new Map<string, THREE.Mesh>();
    const colorMap = new Map<string, number>();
    const industries = Array.from(new Set(companies.map(c => c.industry)));
    
    industries.forEach((industry, index) => {
      const hue = (index / industries.length) * 360;
      colorMap.set(industry, hue);
    });

    // Calculate ranges for normalization
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
      // Size based on overall score (larger range for visibility)
      const normalizedScore = (company.overallScore - minScore) / scoreRange;
      const size = 0.8 + normalizedScore * 2.5;
      
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
      
      // Position based on metrics for better spread
      // X-axis: Work-Life Balance (normalized to -8 to 8)
      const normalizedBalance = (company.workLifeBalance - minBalance) / balanceRange;
      const posX = (normalizedBalance * 16) - 8;
      
      // Y-axis: Turnover Rate (inverted, normalized to -6 to 6)
      const normalizedTurnover = (company.turnoverRate - minTurnover) / turnoverRange;
      const posY = 6 - (normalizedTurnover * 12);
      
      // Z-axis: Random spread with some variation
      const posZ = (Math.random() - 0.5) * 8;
      
      mesh.position.set(posX, posY, posZ);
      
      mesh.userData = { company, originalEmissiveIntensity: 0.3 };
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

      // Reset previously hovered bubble (but keep pinned bubble highlighted)
      if (hoveredBubbleRef.current && hoveredBubbleRef.current !== pinnedBubbleRef.current) {
        const material = hoveredBubbleRef.current.material as THREE.MeshPhongMaterial;
        material.emissiveIntensity = 0.3;
        hoveredBubbleRef.current.scale.set(1, 1, 1);
      }

      // Highlight hovered bubble
      if (intersects.length > 0) {
        const hovered = intersects[0].object as THREE.Mesh;
        const hoveredCompany = hovered.userData.company;
        
        // Don't override pinned bubble styling
        if (hovered !== pinnedBubbleRef.current) {
          const material = hovered.material as THREE.MeshPhongMaterial;
          material.emissiveIntensity = 0.8;
          hovered.scale.set(1.3, 1.3, 1.3);
          hoveredBubbleRef.current = hovered;
          setHoveredCompany(hoveredCompany);
        }
      } else {
        setHoveredCompany(null);
        hoveredBubbleRef.current = null;
      }
    };

    const onClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(Array.from(bubbles.values()));

      if (intersects.length > 0) {
        const clicked = intersects[0].object as THREE.Mesh;
        const company = clicked.userData.company;
        
        // If clicking the same pinned bubble, unpin it
        if (pinnedCompany?.id === company.id) {
          setPinnedCompany(null);
          pinnedBubbleRef.current = null;
          const material = clicked.material as THREE.MeshPhongMaterial;
          material.emissiveIntensity = 0.3;
          clicked.scale.set(1, 1, 1);
        } else {
          // Pin new bubble
          // Reset previously pinned bubble
          if (pinnedBubbleRef.current) {
            const prevMaterial = pinnedBubbleRef.current.material as THREE.MeshPhongMaterial;
            prevMaterial.emissiveIntensity = 0.3;
            pinnedBubbleRef.current.scale.set(1, 1, 1);
          }
          
          setPinnedCompany(company);
          pinnedBubbleRef.current = clicked;
          const material = clicked.material as THREE.MeshPhongMaterial;
          material.emissiveIntensity = 1.0;
          clicked.scale.set(1.4, 1.4, 1.4);
        }
        
        onBubbleClick?.(company);
      }
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Slow rotation for visual interest
      scene.rotation.x += 0.0001;
      scene.rotation.y += 0.0002;

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('click', onClick);
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
  }, [companies, onBubbleClick]);

  // Handle focus on specific company (from search)
  useEffect(() => {
    if (!focusCompanyId || !bubblesRef.current || !cameraRef.current) return;

    const focusedBubble = bubblesRef.current.get(focusCompanyId);
    if (!focusedBubble) return;

    // Get bubble position
    const bubblePos = focusedBubble.position.clone();

    // Animate camera to focus on bubble
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

    // Highlight focused bubble
    bubblesRef.current.forEach((bubble) => {
      if (bubble.userData.company.id === focusCompanyId) {
        const material = bubble.material as THREE.MeshPhongMaterial;
        material.emissiveIntensity = 1.0;
        bubble.scale.set(1.4, 1.4, 1.4);
      } else {
        const material = bubble.material as THREE.MeshPhongMaterial;
        material.emissiveIntensity = 0.3;
        bubble.scale.set(1, 1, 1);
      }
    });
  }, [focusCompanyId]);

  // Determine which company info to show
  const displayedCompany = pinnedCompany || hoveredCompany;
  const isPinned = pinnedCompany !== null;

  return (
    <div className="w-full h-full relative">
      <div ref={containerRef} className="w-full h-full" />
      
      {displayedCompany && (
        <div className={`absolute top-4 right-4 bg-slate-900/95 border rounded-lg p-5 max-w-sm shadow-lg z-50 transition-all ${
          isPinned ? 'border-cyan-400' : 'border-cyan-500/30'
        }`}>
          {isPinned && (
            <button
              onClick={() => {
                setPinnedCompany(null);
                if (pinnedBubbleRef.current) {
                  const material = pinnedBubbleRef.current.material as THREE.MeshPhongMaterial;
                  material.emissiveIntensity = 0.3;
                  pinnedBubbleRef.current.scale.set(1, 1, 1);
                }
                pinnedBubbleRef.current = null;
              }}
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-200 text-lg font-bold"
            >
              ✕
            </button>
          )}
          
          <h3 className="text-cyan-400 font-bold text-lg mb-3 pr-6">{displayedCompany.name}</h3>
          
          <div className="text-slate-300 text-sm space-y-2">
            <p><span className="text-cyan-400 font-semibold">Industry:</span> {displayedCompany.industry}</p>
            <p><span className="text-cyan-400 font-semibold">Overall Score:</span> {displayedCompany.overallScore.toFixed(2)}/5.0</p>
            <p><span className="text-cyan-400 font-semibold">Work-Life Balance:</span> {displayedCompany.workLifeBalance.toFixed(2)}/5.0</p>
            <p><span className="text-cyan-400 font-semibold">Turnover Rate:</span> {parseFloat(String(displayedCompany.turnoverRate)).toFixed(1)}%</p>
          </div>
          
          <button className="mt-4 w-full bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-semibold py-2 px-3 rounded transition-colors">
            See More Details
          </button>
          
          {!isPinned && (
            <p className="text-xs text-slate-400 mt-3 italic">Click to pin this info</p>
          )}
        </div>
      )}
      
      <div className="absolute bottom-4 left-4 text-slate-400 text-xs pointer-events-none">
        <p>Hover to preview • Click to pin</p>
      </div>
    </div>
  );
}
