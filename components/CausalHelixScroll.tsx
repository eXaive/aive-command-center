"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const CATEGORY_COLORS = {
  Finance: "#38bdf8",
  Health: "#34d399",
  Geopolitics: "#facc15",
  Weather: "#60a5fa",
  Technology: "#a78bfa",
  General: "#94a3b8",
};

export default function CausalScrollField() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const width = mountRef.current!.clientWidth;
    const height = mountRef.current!.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#020617");

    // 🎥 Wider camera view but pulled back to see entire column
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.set(0, 0, 220);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mountRef.current!.appendChild(renderer.domElement);

    const categories = Object.keys(CATEGORY_COLORS);
    const nodes: THREE.Mesh[] = [];

    const totalNodes = 180;
    const heightSpread = 200;
    const radius = 25;
    const depthAmplitude = 30; // adds true z-depth

    for (let i = 0; i < totalNodes; i++) {
      const group = categories[i % categories.length];
      const geom = new THREE.SphereGeometry(1.3, 16, 16);
      const mat = new THREE.MeshBasicMaterial({
        color: CATEGORY_COLORS[group],
        transparent: true,
        opacity: 0.65,
      });
      const node = new THREE.Mesh(geom, mat);

      const angle = i * 0.28;
      const y = (i / totalNodes - 0.5) * heightSpread;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * depthAmplitude;
      node.position.set(x, y, z);
      node.userData = { group };
      scene.add(node);
      nodes.push(node);
    }

    // 🌐 Central orb (focus)
    const focusGeom = new THREE.SphereGeometry(5, 32, 32);
    const focusMat = new THREE.MeshBasicMaterial({
      color: "#3b82f6",
      transparent: true,
      opacity: 0.9,
    });
    const focusOrb = new THREE.Mesh(focusGeom, focusMat);
    focusOrb.position.set(0, 0, 0);
    scene.add(focusOrb);

    // 💡 Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.25);
    const point = new THREE.PointLight("#60a5fa", 2.5, 400);
    scene.add(ambient, point);

    // 🌈 Dynamic root-link shimmer
    const strandMat = new THREE.LineBasicMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    const strands: THREE.Line[] = [];

    const updateStrands = (time: number) => {
      strands.forEach((s) => scene.remove(s));
      strands.length = 0;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          if (a.userData.group !== b.userData.group) continue;
          const dist = a.position.distanceTo(b.position);
          if (dist < 10) {
            const color = new THREE.Color(CATEGORY_COLORS[a.userData.group]);
            const pulse = 0.3 + 0.3 * Math.sin(time + dist);
            const mat = strandMat.clone();
            mat.color = color;
            mat.opacity = pulse * 0.25;
            const geom = new THREE.BufferGeometry().setFromPoints([
              a.position,
              b.position,
            ]);
            const line = new THREE.Line(geom, mat);
            scene.add(line);
            strands.push(line);
          }
        }
      }
    };

    // 📜 Scroll-linked camera Y-movement
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const ratio = scrollY / (document.body.scrollHeight - window.innerHeight);
      camera.position.y = (ratio - 0.5) * heightSpread;
      point.position.y = camera.position.y + 15;
    };
    window.addEventListener("scroll", handleScroll);

    // 🌀 Animate
    let t = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      t += 0.02;

      nodes.forEach((node, i) => {
        const mat = node.material as THREE.MeshBasicMaterial;
        const pulse = 0.5 + 0.5 * Math.sin(t + i * 0.2);
        mat.opacity = 0.4 + pulse * 0.3;
        node.scale.setScalar(1 + pulse * 0.08);
      });

      focusOrb.scale.setScalar(1 + 0.05 * Math.sin(t * 1.5));
      focusMat.opacity = 0.8 + 0.15 * Math.sin(t * 1.8);

      updateStrands(t);
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
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        height: "280vh",
        width: "100%",
        position: "relative",
        overflowY: "scroll",
        overflowX: "hidden",
        scrollbarWidth: "thin",
        scrollbarColor: "#334155 #0f172a",
      }}
    >
      {/* top gradient fade */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-slate-950 via-slate-950/80 to-transparent z-10" />
      {/* bottom gradient fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-10" />
    </div>
  );
}
