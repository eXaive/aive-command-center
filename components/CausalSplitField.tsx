"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const COLOR_TOP = "#38bdf8";   // upstream
const COLOR_BOTTOM = "#facc15"; // downstream

function MiniField({ direction }: { direction: "up" | "down" }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const width = mountRef.current!.clientWidth;
    const height = mountRef.current!.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#020617");

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 90);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mountRef.current!.appendChild(renderer.domElement);

    const totalNodes = 60;
    const nodes: THREE.Mesh[] = [];
    const color = direction === "up" ? COLOR_TOP : COLOR_BOTTOM;

    for (let i = 0; i < totalNodes; i++) {
      const geom = new THREE.SphereGeometry(2, 16, 16);
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.6,
      });
      const node = new THREE.Mesh(geom, mat);
      const spread = 25;
      node.position.set(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * 10
      );
      scene.add(node);
      nodes.push(node);
    }

    const ambient = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambient);

    let t = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      t += 0.02;
      nodes.forEach((node, i) => {
        const pulse = 0.5 + 0.5 * Math.sin(t + i * 0.1);
        (node.material as THREE.MeshBasicMaterial).opacity = 0.4 + pulse * 0.3;
      });
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = mountRef.current!.clientWidth;
      const h = mountRef.current!.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [direction]);

  return (
    <div
      ref={mountRef}
      className="w-full h-[60vh] overflow-y-auto rounded-2xl border border-slate-700/40 bg-slate-900/40 backdrop-blur-md"
    />
  );
}

export default function CausalSplitField() {
  return (
    <div className="relative w-full flex flex-col items-center">
      <MiniField direction="up" />
      {/* Fixed central orb */}
      <div className="absolute top-1/2 -translate-y-1/2">
        <div className="w-32 h-32 rounded-full bg-blue-400/70 blur-xl shadow-[0_0_60px_#3b82f6]" />
      </div>
      <MiniField direction="down" />
    </div>
  );
}
