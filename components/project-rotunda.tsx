"use client";

import gsap from "gsap";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { Project } from "@/lib/content";
import { usePublicTransition } from "@/components/public-experience";
import type { Locale } from "@/lib/i18n";

const colors: Record<string, string> = { cyan: "#7bd5da", amber: "#e9a04b", lime: "#c7d66e" };

function coverTexture(texture: THREE.Texture, targetAspect: number) {
  const image = texture.image as { width?: number; height?: number } | undefined;
  if (!image?.width || !image.height) return;
  const imageAspect = image.width / image.height;
  if (imageAspect > targetAspect) {
    const visibleWidth = targetAspect / imageAspect;
    texture.repeat.set(visibleWidth, 1);
    texture.offset.set((1 - visibleWidth) / 2, 0);
  } else {
    const visibleHeight = imageAspect / targetAspect;
    texture.repeat.set(1, visibleHeight);
    texture.offset.set(0, (1 - visibleHeight) / 2);
  }
  texture.needsUpdate = true;
}

function fallbackTexture(project: Project, light: boolean) {
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 720;
  const context = canvas.getContext("2d")!;
  const accent = colors[project.accent] ?? colors.cyan;
  context.fillStyle = light ? "#deddd7" : "#151918";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = accent;
  context.lineWidth = 2;
  context.strokeRect(80, 64, 1120, 592);
  context.save();
  context.translate(640, 360);
  context.rotate(Math.PI / 4);
  context.strokeRect(-150, -150, 300, 300);
  context.restore();
  context.fillStyle = accent;
  context.font = "500 190px Arial";
  context.textAlign = "center";
  context.fillText(project.index, 640, 430);
  context.fillStyle = light ? "#111312" : "#f1f0eb";
  context.font = "500 42px Arial";
  context.fillText(project.title.toUpperCase(), 640, 650);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function ProjectRotunda({
  projects,
  locale = "id",
}: {
  projects: Project[];
  locale?: Locale;
}) {
  void locale;
  const mount = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const navigate = usePublicTransition();
  const select = useCallback(
    (direction: number) => {
      activeRef.current = (activeRef.current + direction + projects.length) % projects.length;
      setActive(activeRef.current);
    },
    [projects.length],
  );

  useEffect(() => {
    const copyElement = document.querySelector<HTMLElement>(".rotunda-copy");
    if (!copyElement || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = Array.from(copyElement.children) as HTMLElement[];
    gsap.fromTo(
      items,
      { y: 26, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.9,
        stagger: 0.13,
        ease: "power3.out",
        overwrite: true,
        clearProps: "transform,opacity,visibility",
      },
    );
  }, [active]);

  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 9.4);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);
    const group = new THREE.Group();
    scene.add(group);
    const frameWidth = 4.2;
    const frameHeight = frameWidth * (9 / 16);
    const frameAspect = frameWidth / frameHeight;
    const geometry = new THREE.PlaneGeometry(frameWidth, frameHeight);
    const light = document.documentElement.dataset.theme === "light";
    const textures = projects.map((project) => fallbackTexture(project, light));
    const loadedTextures: THREE.Texture[] = [];
    const meshes = textures.map((texture, index) => {
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.94,
        side: THREE.FrontSide,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData.index = index;
      group.add(mesh);
      return mesh;
    });
    const loader = new THREE.TextureLoader();
    projects.forEach((project, index) => {
      if (!project.heroImage) return;
      loader.load(project.heroImage.url, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        coverTexture(texture, frameAspect);
        loadedTextures.push(texture);
        const material = meshes[index].material as THREE.MeshBasicMaterial;
        material.map = texture;
        material.needsUpdate = true;
      });
    });
    const step = (Math.PI * 2) / projects.length;
    const radius = Math.max(5.2, projects.length * 1.05);
    meshes.forEach((mesh, index) => {
      const angle = index * step;
      mesh.position.set(Math.sin(angle) * radius, 0, Math.cos(angle) * radius);
      mesh.rotation.y = angle;
    });
    let target = 0,
      current = 0,
      frame = 0,
      visible = true,
      dragging = false,
      startX = 0,
      startTarget = 0;
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const resize = () => {
      const width = host.clientWidth,
        height = host.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      const verticalFov = THREE.MathUtils.degToRad(camera.fov);
      const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
      const fitDistance = Math.max(
        frameHeight / (2 * Math.tan(verticalFov / 2)),
        frameWidth / (2 * Math.tan(horizontalFov / 2)),
      );
      camera.position.z = radius + fitDistance * 1.01;
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    observer.observe(host);
    const render = () => {
      frame = requestAnimationFrame(render);
      if (!visible || document.hidden) return;
      target = -activeRef.current * step;
      current += (target - current) * 0.09;
      group.rotation.y = current;
      renderer.render(scene, camera);
    };
    render();
    const down = (event: PointerEvent) => {
      dragging = true;
      startX = event.clientX;
      startTarget = activeRef.current;
      renderer.domElement.setPointerCapture(event.pointerId);
    };
    const move = (event: PointerEvent) => {
      if (!dragging) return;
      const next = Math.round(startTarget - (event.clientX - startX) / 170);
      activeRef.current = ((next % projects.length) + projects.length) % projects.length;
      setActive(activeRef.current);
    };
    const up = (event: PointerEvent) => {
      if (Math.abs(event.clientX - startX) < 6) {
        const bounds = renderer.domElement.getBoundingClientRect();
        pointer.set(
          ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
          -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
        );
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(meshes)[0]?.object as THREE.Mesh | undefined;
        const index = hit?.userData.index as number | undefined;
        if (index === activeRef.current) navigate(`/proyek/${projects[index].slug}`);
        else if (index !== undefined) {
          activeRef.current = index;
          setActive(index);
        }
      }
      dragging = false;
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        select(1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        select(-1);
      }
      if (event.key === "Enter") navigate(`/proyek/${projects[activeRef.current].slug}`);
    };
    renderer.domElement.addEventListener("pointerdown", down);
    renderer.domElement.addEventListener("pointermove", move);
    renderer.domElement.addEventListener("pointerup", up);
    renderer.domElement.addEventListener("pointercancel", up);
    host.addEventListener("keydown", key);
    window.addEventListener("resize", resize);
    gsap.from(renderer.domElement, { autoAlpha: 0, scale: 0.92, duration: 1, ease: "power3.out" });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      host.removeEventListener("keydown", key);
      renderer.domElement.removeEventListener("pointerdown", down);
      renderer.domElement.removeEventListener("pointermove", move);
      renderer.domElement.removeEventListener("pointerup", up);
      renderer.domElement.removeEventListener("pointercancel", up);
      textures.forEach((texture) => texture.dispose());
      loadedTextures.forEach((texture) => texture.dispose());
      meshes.forEach((mesh) => (mesh.material as THREE.Material).dispose());
      geometry.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [navigate, projects, select]);

  const project = projects[active];
  return (
    <div className="rotunda-shell">
      <div
        ref={mount}
        className="rotunda-canvas"
        tabIndex={0}
        role="application"
        aria-label="Rotunda proyek. Gunakan panah kiri dan kanan untuk memilih proyek."
      />
      <div className="rotunda-ui">
        <div className="rotunda-count">
          <span>{String(active + 1).padStart(2, "0")}</span>
          <i />
          {String(projects.length).padStart(2, "0")}
        </div>
        <div className="rotunda-copy" aria-live="polite">
          <p className="eyebrow">
            {project.category} · {project.year}
          </p>
          <h3>{project.title}</h3>
          <p>{project.summary}</p>
          <Link href={`/proyek/${project.slug}`} className="text-link">
            Lihat proyek <span aria-hidden="true">↗︎</span>
          </Link>
        </div>
        <div className="rotunda-controls">
          <button onClick={() => select(-1)} aria-label="Proyek sebelumnya">
            ←
          </button>
          <button onClick={() => select(1)} aria-label="Proyek berikutnya">
            →
          </button>
        </div>
      </div>
    </div>
  );
}
