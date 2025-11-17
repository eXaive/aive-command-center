"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function CausalFlowField_Optimized() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [performanceMode, setPerformanceMode] = useState<
    "High" | "Balanced" | "Eco"
  >("Balanced");

  useEffect(() => {
    const mount = mountRef.current!;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // ⚙️ Device profiling
    const cores = navigator.hardwareConcurrency || 4;
    const memory = (navigator as any).deviceMemory || 4;
    const gpu = navigator.userAgent.includes("Android") ? "mobile" : "desktop";

    let mode: "High" | "Balanced" | "Eco";
    if (cores >= 8 && memory >= 8 && gpu === "desktop") mode = "High";
    else if (cores >= 4 && memory >= 4) mode = "Balanced";
    else mode = "Eco";
    setPerformanceMode(mode);

    const CONFIG = {
      NODE_COUNT: mode === "High" ? 25 : mode === "Balanced" ? 18 : 10,
      PARTICLE_COUNT: mode === "High" ? 320 : mode === "Balanced" ? 220 : 120,
      PULSE_CAP: mode === "High" ? 25 : mode === "Balanced" ? 15 : 8,
      ORB_SIZE: mode === "High" ? 7 : mode === "Balanced" ? 6 : 5,
      CAMERA_Z: mode === "High" ? 115 : mode === "Balanced" ? 100 : 90,
    };

    // 🧩 Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: mode !== "Eco",
      alpha: false,
      powerPreference: mode === "Eco" ? "low-power" : "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio * (mode === "High" ? 1 : 0.75));
    renderer.setClearColor("#020617", 1); // deeper slate fix
    mount.appendChild(renderer.domElement);

    // 🌌 Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, CONFIG.CAMERA_Z);

    // 💡 Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const light = new THREE.PointLight("#60a5fa", 2, 300);
    light.position.set(0, 0, 80);
    scene.add(light);

    // ✨ Dust particles
    const dustGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(CONFIG.PARTICLE_COUNT * 3);
    for (let i = 0; i < positions.length; i++)
      positions[i] = (Math.random() - 0.5) * 200;
    dustGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: "#3b82f6",
      size: mode === "Eco" ? 0.4 : 0.6,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // 🔵 Core orb
    const coreGeom = new THREE.SphereGeometry(CONFIG.ORB_SIZE, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: "#3b82f6",
      emissive: "#60a5fa",
      emissiveIntensity: 1.5,
      roughness: 0.6,
      metalness: 0.3,
      transparent: true,
      opacity: 0.95,
    });
    const core = new THREE.Mesh(coreGeom, coreMat);
    scene.add(core);

    // 💹 Nodes
    const NODE_COLOR = "#38bdf8";
    const topNodes: THREE.Mesh[] = [];
    const bottomNodes: THREE.Mesh[] = [];

    const createLayer = (offset: number, group: "top" | "bottom") => {
      const list = group === "top" ? topNodes : bottomNodes;
      for (let i = 0; i < CONFIG.NODE_COUNT; i++) {
        const mat = new THREE.MeshStandardMaterial({
          color: NODE_COLOR,
          emissive: NODE_COLOR,
          emissiveIntensity: 0.4,
          transparent: true,
          opacity: 0.75,
        });
        const node = new THREE.Mesh(new THREE.SphereGeometry(1.5, 12, 12), mat);
        // Perfectly flat z-plane alignment
        node.position.set(
          (Math.random() - 0.5) * 55,
          offset + (Math.random() - 0.5) * 10,
          0 // <- lock z plane
        );
        list.push(node);
        scene.add(node);
      }
    };

    createLayer(45, "top");
    createLayer(-45, "bottom");

    // 🌐 Connections
    const lineMat = new THREE.LineBasicMaterial({
      color: NODE_COLOR,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const lines: THREE.Line[] = [];
    const makeLine = (a: THREE.Vector3, b: THREE.Vector3) => {
      const geom = new THREE.BufferGeometry().setFromPoints([a, b]);
      const line = new THREE.Line(geom, lineMat);
      scene.add(line);
      lines.push(line);
    };
    topNodes.forEach((n) => makeLine(core.position, n.position));
    bottomNodes.forEach((n) => makeLine(n.position, core.position));

    // ⚡ Pulses
    const pulseGeom = new THREE.SphereGeometry(0.4, 8, 8);
    const pulses: any[] = [];
    const spawnPulse = (start: THREE.Vector3, end: THREE.Vector3) => {
      if (pulses.length > CONFIG.PULSE_CAP) return;
      const mat = new THREE.MeshBasicMaterial({
        color: NODE_COLOR,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(pulseGeom, mat);
      scene.add(mesh);
      pulses.push({
        mesh,
        start: start.clone(),
        end: end.clone(),
        progress: 0,
        speed: 0.01 + Math.random() * 0.015,
      });
    };

    // 🔄 Animation
    let t = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      t += 0.02;
      dust.rotation.y += 0.0005;

      pulses.forEach((p, i) => {
        p.progress += p.speed;
        if (p.progress >= 1) {
          scene.remove(p.mesh);
          pulses.splice(i, 1);
          return;
        }
        const pos = new THREE.Vector3().lerpVectors(p.start, p.end, p.progress);
        p.mesh.position.copy(pos);
        (p.mesh.material as THREE.MeshBasicMaterial).opacity = 1 - p.progress;
      });

      if (Math.random() < (mode === "Eco" ? 0.002 : 0.005)) {
        const source =
          Math.random() < 0.5
            ? bottomNodes[Math.floor(Math.random() * bottomNodes.length)]
            : topNodes[Math.floor(Math.random() * topNodes.length)];
        spawnPulse(source.position, core.position);
      }

      core.scale.setScalar(1 + 0.05 * Math.sin(t * 1.2));
      renderer.render(scene, camera);
    };
    animate();

    // 🧭 Resize
    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", resize);

    // 🧹 Cleanup
    return () => {
      window.removeEventListener("resize", resize);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (obj.material) (obj.material as THREE.Material).dispose();
        }
      });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative w-full">
      <div className="text-center text-blue-400 text-sm mb-3 font-medium">
        Finance Focus
      </div>

      {/* 🔒 Edge-proof container */}
      <div className="relative w-full h-[80vh] rounded-2xl bg-slate-950 overflow-hidden border border-slate-700/40 shadow-inner shadow-slate-950">
        <div className="absolute inset-0 rounded-2xl overflow-hidden isolate">
          <div
            ref={mountRef}
            className="absolute inset-[1px] rounded-2xl overflow-hidden bg-slate-950"
          />
        </div>

        {/* 🩵 Matte mask (final anti-glow shield) */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute bottom-0 left-0 right-0 h-[8px] bg-slate-950" />
          <div className="absolute top-0 left-0 right-0 h-[8px] bg-slate-950" />
          <div className="absolute left-0 top-0 bottom-0 w-[8px] bg-slate-950" />
          <div className="absolute right-0 top-0 bottom-0 w-[8px] bg-slate-950" />
        </div>

        {/* ⚙️ Performance mode */}
        <div
          className={`absolute bottom-3 right-3 px-3 py-1 text-[11px] font-semibold rounded-full backdrop-blur-md border ${
            performanceMode === "High"
              ? "bg-blue-600/30 text-blue-300 border-blue-500/30"
              : performanceMode === "Balanced"
              ? "bg-amber-500/20 text-amber-300 border-amber-400/30"
              : "bg-emerald-600/20 text-emerald-300 border-emerald-400/30"
          }`}
        >
          ⚙️ {performanceMode} Performance Mode
        </div>
      </div>
    </div>
  );
}
