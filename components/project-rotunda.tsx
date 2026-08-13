"use client";

import gsap from "gsap";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { Project } from "@/lib/content";
import { usePublicTransition } from "@/components/public-experience";

const colors: Record<string, string> = { cyan: "#7bd5da", amber: "#e9a04b", lime: "#c7d66e" };

function fallbackTexture(project: Project) {
  const canvas = document.createElement("canvas"); canvas.width = 1024; canvas.height = 768;
  const context = canvas.getContext("2d")!; const accent = colors[project.accent] ?? colors.cyan;
  context.fillStyle = "#151918"; context.fillRect(0, 0, 1024, 768); context.strokeStyle = accent; context.lineWidth = 2; context.strokeRect(74, 74, 876, 620);
  context.save(); context.translate(512, 384); context.rotate(Math.PI / 4); context.strokeRect(-150, -150, 300, 300); context.restore();
  context.fillStyle = accent; context.font = "500 190px Arial"; context.textAlign = "center"; context.fillText(project.index, 512, 450);
  context.fillStyle = "#f1f0eb"; context.font = "500 42px Arial"; context.fillText(project.title.toUpperCase(), 512, 660);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; return texture;
}

export default function ProjectRotunda({ projects }: { projects: Project[] }) {
  const mount = useRef<HTMLDivElement>(null); const activeRef = useRef(0); const [active, setActive] = useState(0); const navigate = usePublicTransition();
  const select = useCallback((direction: number) => { activeRef.current = (activeRef.current + direction + projects.length) % projects.length; setActive(activeRef.current); }, [projects.length]);

  useEffect(() => {
    const copyElement = document.querySelector<HTMLElement>(".rotunda-copy");
    if (!copyElement || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = Array.from(copyElement.children) as HTMLElement[];
    gsap.fromTo(items, { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .9, stagger: .13, ease: "power3.out", overwrite: true, clearProps: "transform,opacity,visibility" });
  }, [active]);

  useEffect(() => {
    const host = mount.current; if (!host) return;
    const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(38, 1, .1, 100); camera.position.set(0, .15, 9.4);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" }); renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.outputColorSpace = THREE.SRGBColorSpace; host.appendChild(renderer.domElement);
    const group = new THREE.Group(); scene.add(group); const geometry = new THREE.PlaneGeometry(4.2, 3.15); const textures = projects.map(fallbackTexture); const loadedTextures: THREE.Texture[] = [];
    const meshes = textures.map((texture, index) => { const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: .94, side: THREE.FrontSide }); const mesh = new THREE.Mesh(geometry, material); mesh.userData.index = index; group.add(mesh); return mesh; });
    const loader = new THREE.TextureLoader(); projects.forEach((project, index) => { if (!project.heroImage) return; loader.load(project.heroImage.url, (texture) => { texture.colorSpace = THREE.SRGBColorSpace; loadedTextures.push(texture); const material = meshes[index].material as THREE.MeshBasicMaterial; material.map = texture; material.needsUpdate = true; }); });
    const step = Math.PI * 2 / projects.length; const radius = Math.max(5.2, projects.length * 1.05);
    meshes.forEach((mesh, index) => { const angle = index * step; mesh.position.set(Math.sin(angle) * radius, 0, Math.cos(angle) * radius); mesh.rotation.y = angle; });
    let target = 0, current = 0, frame = 0, visible = true, dragging = false, startX = 0, startTarget = 0, wheelLocked = false; const raycaster = new THREE.Raycaster(); const pointer = new THREE.Vector2();
    const resize = () => { const width = host.clientWidth, height = host.clientHeight; renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); }; resize();
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: .05 }); observer.observe(host);
    const render = () => { frame = requestAnimationFrame(render); if (!visible || document.hidden) return; target = -activeRef.current * step; current += (target - current) * .09; group.rotation.y = current; renderer.render(scene, camera); }; render();
    const wheel = (event: WheelEvent) => { if (Math.abs(event.deltaY) < 12 || wheelLocked) return; event.preventDefault(); wheelLocked = true; select(event.deltaY > 0 ? 1 : -1); setTimeout(() => { wheelLocked = false; }, 420); };
    const down = (event: PointerEvent) => { dragging = true; startX = event.clientX; startTarget = activeRef.current; renderer.domElement.setPointerCapture(event.pointerId); };
    const move = (event: PointerEvent) => { if (!dragging) return; const next = Math.round(startTarget - (event.clientX - startX) / 170); activeRef.current = (next % projects.length + projects.length) % projects.length; setActive(activeRef.current); };
    const up = (event: PointerEvent) => { if (Math.abs(event.clientX - startX) < 6) { const bounds = renderer.domElement.getBoundingClientRect(); pointer.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -((event.clientY - bounds.top) / bounds.height) * 2 + 1); raycaster.setFromCamera(pointer, camera); const hit = raycaster.intersectObjects(meshes)[0]?.object as THREE.Mesh | undefined; const index = hit?.userData.index as number | undefined; if (index === activeRef.current) navigate(`/proyek/${projects[index].slug}`); else if (index !== undefined) { activeRef.current = index; setActive(index); } } dragging = false; };
    const key = (event: KeyboardEvent) => { if (event.key === "ArrowRight") { event.preventDefault(); select(1); } if (event.key === "ArrowLeft") { event.preventDefault(); select(-1); } if (event.key === "Enter") navigate(`/proyek/${projects[activeRef.current].slug}`); };
    renderer.domElement.addEventListener("wheel", wheel, { passive: false }); renderer.domElement.addEventListener("pointerdown", down); renderer.domElement.addEventListener("pointermove", move); renderer.domElement.addEventListener("pointerup", up); renderer.domElement.addEventListener("pointercancel", up); host.addEventListener("keydown", key); window.addEventListener("resize", resize);
    gsap.from(renderer.domElement, { autoAlpha: 0, scale: .92, duration: 1, ease: "power3.out" });
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("resize", resize); host.removeEventListener("keydown", key); renderer.domElement.removeEventListener("wheel", wheel); renderer.domElement.removeEventListener("pointerdown", down); renderer.domElement.removeEventListener("pointermove", move); renderer.domElement.removeEventListener("pointerup", up); renderer.domElement.removeEventListener("pointercancel", up); textures.forEach((texture) => texture.dispose()); loadedTextures.forEach((texture) => texture.dispose()); meshes.forEach((mesh) => (mesh.material as THREE.Material).dispose()); geometry.dispose(); renderer.dispose(); renderer.domElement.remove(); };
  }, [navigate, projects, select]);

  const project = projects[active];
  return <div className="rotunda-shell"><div ref={mount} className="rotunda-canvas" tabIndex={0} role="application" aria-label="Rotunda proyek. Gunakan panah kiri dan kanan untuk memilih proyek." /><div className="rotunda-ui"><div className="rotunda-count"><span>{String(active + 1).padStart(2, "0")}</span><i />{String(projects.length).padStart(2, "0")}</div><div className="rotunda-copy" aria-live="polite"><p className="eyebrow">{project.category} · {project.year}</p><h3>{project.title}</h3><p>{project.summary}</p><Link href={`/proyek/${project.slug}`} className="text-link">Lihat proyek <span aria-hidden="true">↗</span></Link></div><div className="rotunda-controls"><button onClick={() => select(-1)} aria-label="Proyek sebelumnya">←</button><button onClick={() => select(1)} aria-label="Proyek berikutnya">→</button></div></div></div>;
}
