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
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

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
    camera.position.z = 40;
    camera.position.y = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
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

    companies.forEach((company) => {
      const size = Math.max(2, company.overallScore * 2);
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
      
      // Distribute bubbles in 3D space (more compact for better visibility)
      const angle = Math.random() * Math.PI * 2;
      const elevation = (Math.random() - 0.5) * Math.PI * 0.6;
      const distance = 15 + Math.random() * 20;
      
      mesh.position.x = Math.cos(angle) * Math.cos(elevation) * distance;
      mesh.position.y = Math.sin(elevation) * distance;
      mesh.position.z = Math.sin(angle) * Math.cos(elevation) * distance;
      
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

      // Reset all bubbles
      bubbles.forEach((bubble) => {
        (bubble.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.3;
        bubble.scale.set(1, 1, 1);
      });

      // Highlight hovered bubble
      if (intersects.length > 0) {
        const hovered = intersects[0].object as THREE.Mesh;
        (hovered.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.8;
        hovered.scale.set(1.2, 1.2, 1.2);
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
        setSelectedCompany(company);
        onBubbleClick?.(company);
      }
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotate scene
      scene.rotation.x += 0.0002;
      scene.rotation.y += 0.0003;

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
      containerRef.current?.removeChild(renderer.domElement);
      bubbles.forEach((bubble) => {
        (bubble.geometry as THREE.BufferGeometry).dispose();
        (bubble.material as THREE.Material).dispose();
      });
      renderer.dispose();
    };
  }, [companies, onBubbleClick, focusCompanyId]);

  // Handle focus on specific company
  useEffect(() => {
    if (!focusCompanyId || !bubblesRef.current || !cameraRef.current) return;

    const focusedBubble = bubblesRef.current.get(focusCompanyId);
    if (!focusedBubble) return;

    // Get bubble position
    const bubblePos = focusedBubble.position.clone();

    // Animate camera to focus on bubble
    const startPos = cameraRef.current.position.clone();
    const endPos = bubblePos.clone();
    endPos.z += 15; // Position camera 15 units away from bubble
    endPos.y += 5;

    const duration = 1000; // 1 second animation
    const startTime = Date.now();

    const animateCamera = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out cubic)
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      if (cameraRef.current) {
        cameraRef.current.position.lerpVectors(startPos, endPos, easeProgress);
        cameraRef.current.lookAt(bubblePos);
      }

      if (progress < 1) {
        requestAnimationFrame(animateCamera);
      }
    };

    animateCamera();

    // Highlight the focused bubble with glow effect
    if (focusedBubble.material instanceof THREE.MeshPhongMaterial) {
      focusedBubble.material.emissiveIntensity = 1.0;
    }
    focusedBubble.scale.set(1.5, 1.5, 1.5);
    setSelectedCompany(focusedBubble.userData.company);
  }, [focusCompanyId]);

  return (
    <div className="w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      {selectedCompany && (
        <div className="absolute top-4 right-4 bg-slate-900/90 border border-cyan-500/50 rounded-lg p-4 max-w-xs">
          <h3 className="text-cyan-400 font-bold text-lg mb-2">{selectedCompany.name}</h3>
          <div className="text-slate-300 text-sm space-y-1">
            <p><span className="text-cyan-400">Industry:</span> {selectedCompany.industry}</p>
            <p><span className="text-cyan-400">Overall Score:</span> {selectedCompany.overallScore.toFixed(2)}</p>
            <p><span className="text-cyan-400">Work-Life Balance:</span> {selectedCompany.workLifeBalance.toFixed(2)}</p>
            <p><span className="text-cyan-400">Turnover Rate:</span> {parseFloat(String(selectedCompany.turnoverRate)).toFixed(1)}%</p>
          </div>
        </div>
      )}
    </div>
  );
}
