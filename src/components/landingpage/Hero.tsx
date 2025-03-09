"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import * as THREE from "three";

export default function Hero() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleBrowseJobs = () => {
    router.push("/jobs");
    gsap.to(containerRef.current, {
      opacity: 0.5,
      duration: 0.3,
      onComplete: () => {
        router.push("/jobs");
      },
    });
  };

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    // const containerBounds = containerRef.current.getBoundingClientRect();
    // const width = containerBounds.width;
    // const height = containerBounds.height;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.z = 1000;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create realistic star texture
    const createStarTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      // Create radial gradient for star core
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.1, "rgba(255, 255, 255, 0.9)");
      gradient.addColorStop(0.15, "rgba(255, 255, 255, 0.6)");
      gradient.addColorStop(0.25, "rgba(255, 255, 255, 0.3)");
      gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.1)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);

      return new THREE.CanvasTexture(canvas);
    };

    const starTexture = createStarTexture();
    if (!starTexture) return;

    // Create star field with different layers
    const createStars = (
      count: number,
      spread: number,
      size: number,
      speed: number
    ) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const velocities = new Float32Array(count);
      const opacities = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * spread;
        positions[i3 + 1] = (Math.random() - 0.5) * spread;
        positions[i3 + 2] = (Math.random() - 0.5) * spread;

        velocities[i] = Math.random() * speed;
        opacities[i] = Math.random();
      }

      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      const material = new THREE.PointsMaterial({
        size: size,
        map: starTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.8,
      });

      const stars = new THREE.Points(geometry, material);
      return { stars, positions, velocities, opacities };
    };

    // Create multiple star layers
    const starLayers = [
      createStars(1500, 2000, 2, 0.2), // Distant stars
      createStars(1000, 1500, 3, 0.3), // Mid-range stars
      createStars(500, 1000, 4, 0.4), // Close stars
      createStars(100, 800, 5, 0.5), // Very bright, close stars
      createStars(200, 600, 6, 0.6), // Extra bright forground stars
    ];

    starLayers.forEach((layer) => scene.add(layer.stars));

    // Animate stars
    const animateStars = () => {
      starLayers.forEach((layer) => {
        const positions = layer.stars.geometry.attributes.position
          .array as Float32Array;

        for (let i = 0; i < positions.length; i += 3) {
          // Twinkle effect
          const opacity = layer.opacities[i / 3];
          const time = Date.now() * 0.0001;
          layer.stars.material.opacity =
            0.5 + Math.sin(time + opacity * 10) * 0.2;

          // Movement
          positions[i + 2] += layer.velocities[i / 3];

          // Reset position when star moves too far
          if (positions[i + 2] > 1000) {
            positions[i + 2] = -1000;
          }
        }

        layer.stars.geometry.attributes.position.needsUpdate = true;
      });
    };

    // Mouse movement effect
    const handleMouseMove = (event: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

      gsap.to(camera.position, {
        x: x * 50,
        y: -y * 50,
        duration: 1,
        ease: "power2.out",
      });
    };

    containerRef.current.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      animateStars();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      renderer.dispose();
      scene.clear();

      // Additional cleanup
      if (canvasRef.current) {
        canvasRef.current.remove();
      }
    };
  }, []);

  return (
    <div className="h-[100vh] bg-black relative">
      <div ref={containerRef} className="h-full w-full relative">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
          style={{ position: "absolute", zIndex: 1 }}
        />

        {/* Very subtle vignette effect */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/40 pointer-events-none" />

        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="max-w-4xl text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
              <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                Ignite Your{" "}
              </span>
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text drop-shadow-[0_0_10px_rgba(96,165,250,0.2)]">
                Career Launch
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
              Kickstart your journey into the professional universe with
              AI-powered job matching, resume optimization, and personalized
              learning paths— crafted to help freshers shoot for the stars.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
              <button className="group px-8 py-4 bg-blue-600/80 text-white text-lg font-semibold rounded-full hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                <span className="flex items-center justify-center gap-2">
                  Upload Resume
                  <svg
                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </span>
              </button>
              <button
                onClick={handleBrowseJobs}
                className="group px-8 py-4 bg-transparent border border-white/20 text-white text-lg font-semibold rounded-full hover:border-white/40 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              >
                <span className="flex items-center justify-center gap-2">
                  Browse Jobs
                  <svg
                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
