"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowDown,
  Sparkles,
  Zap,
  Star,
  Users,
  Award,
  Cpu,
  Rocket,
  Shield,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import * as THREE from "three";
import FuturisticMealsByCategory from "../components/Meals/MealsByCategory";
import FuturisticSpecialOffers from "../components/SpecialOffers/SpecialOffers";
import FuturisticMembership from "../components/Membership/Membership";

// Import futuristic components

gsap.registerPlugin(ScrollTrigger, SplitText, MorphSVGPlugin, DrawSVGPlugin);

export default function FuturisticHome() {
  const [currentSection, setCurrentSection] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Refs for Three.js and animations
  const containerRef = useRef(null);
  const threeContainerRef = useRef(null);
  const heroRef = useRef(null);
  const mealsRef = useRef(null);
  const offersRef = useRef(null);
  const membershipRef = useRef(null);
  const testimonialsRef = useRef(null);
  const progressBarRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubtitleRef = useRef(null);
  const heroStatsRef = useRef([]);
  const morphRef = useRef(null);

  // Three.js scene refs
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const timePortalRef = useRef([]);
  const hologramsRef = useRef([]);
  const particleSystemRef = useRef(null);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Initialize Futuristic Three.js Scene
  useEffect(() => {
    if (!threeContainerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    threeContainerRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Create futuristic time portal effect
    const timePortal = [];
    for (let i = 0; i < 12; i++) {
      const ringGeometry = new THREE.RingGeometry(8 + i * 3, 8.5 + i * 3, 64);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.3 + i * 0.02, 0.9, 0.4 + i * 0.03),
        transparent: true,
        opacity: 0.15 - i * 0.01,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.z = -30 - i * 5;
      ring.userData = {
        rotationSpeed: (i % 2 === 0 ? 1 : -1) * (0.005 + i * 0.002),
        originalZ: ring.position.z,
        pulseSpeed: 0.01 + i * 0.003,
        time: Math.random() * Math.PI * 2,
      };
      scene.add(ring);
      timePortal.push(ring);
    }
    timePortalRef.current = timePortal;

    // Floating future food holograms
    const holograms = [];
    const hologramShapes = [
      () => new THREE.SphereGeometry(0.5, 12, 12),
      () => new THREE.BoxGeometry(0.8, 0.8, 0.8),
      () => new THREE.OctahedronGeometry(0.6),
      () => new THREE.TetrahedronGeometry(0.7),
      () => new THREE.ConeGeometry(0.5, 1, 8),
    ];

    for (let i = 0; i < 40; i++) {
      const geometry = hologramShapes[i % hologramShapes.length]();
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(
          0.3 + Math.random() * 0.1,
          0.8,
          0.5 + Math.random() * 0.3
        ),
        transparent: true,
        opacity: 0.4 + Math.random() * 0.4,
        wireframe: Math.random() > 0.5,
      });
      const hologram = new THREE.Mesh(geometry, material);
      hologram.position.set(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 60
      );
      hologram.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02,
        },
        floatSpeed: Math.random() * 0.01 + 0.005,
        originalY: hologram.position.y,
        time: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        mouseInfluence: 0.5 + Math.random() * 2,
      };
      scene.add(hologram);
      holograms.push(hologram);
    }
    hologramsRef.current = holograms;

    // Future particle streams
    const streamGeometry = new THREE.BufferGeometry();
    const streamCount = 500;
    const streamPositions = new Float32Array(streamCount * 3);
    const streamColors = new Float32Array(streamCount * 3);
    const streamVelocities = [];

    for (let i = 0; i < streamCount; i++) {
      streamPositions[i * 3] = (Math.random() - 0.5) * 150;
      streamPositions[i * 3 + 1] = Math.random() * 80 - 40;
      streamPositions[i * 3 + 2] = (Math.random() - 0.5) * 100;

      const color = new THREE.Color().setHSL(
        0.3 + Math.random() * 0.1,
        0.9,
        0.5 + Math.random() * 0.3
      );
      streamColors[i * 3] = color.r;
      streamColors[i * 3 + 1] = color.g;
      streamColors[i * 3 + 2] = color.b;

      streamVelocities.push({
        x: (Math.random() - 0.5) * 0.08,
        y: Math.random() * 0.05 + 0.02,
        z: (Math.random() - 0.5) * 0.08,
      });
    }

    streamGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(streamPositions, 3)
    );
    streamGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(streamColors, 3)
    );
    const streamMaterial = new THREE.PointsMaterial({
      size: 0.2,
      transparent: true,
      opacity: 0.8,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
    });
    const streams = new THREE.Points(streamGeometry, streamMaterial);
    scene.add(streams);
    particleSystemRef.current = { streams, velocities: streamVelocities };

    camera.position.set(0, 10, 30);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Animate time portal rings
      timePortal.forEach((ring) => {
        ring.rotation.z += ring.userData.rotationSpeed;
        ring.userData.time += ring.userData.pulseSpeed;
        const pulse = 1 + Math.sin(ring.userData.time) * 0.2;
        ring.scale.setScalar(pulse);

        // Moving through time
        ring.position.z += 0.15;
        if (ring.position.z > 20) {
          ring.position.z = ring.userData.originalZ;
        }
      });

      // Animate holograms with mouse interaction
      holograms.forEach((hologram) => {
        hologram.userData.time += hologram.userData.floatSpeed;

        // Mouse influence
        const mouseInfluence = new THREE.Vector3(
          mousePosition.x * 8,
          mousePosition.y * 8,
          0
        );
        hologram.position.lerp(
          hologram.position
            .clone()
            .add(
              mouseInfluence.multiplyScalar(
                hologram.userData.mouseInfluence * 0.1
              )
            ),
          0.02
        );

        // Floating motion
        hologram.position.y =
          hologram.userData.originalY + Math.sin(hologram.userData.time) * 4;

        hologram.rotation.x += hologram.userData.rotationSpeed.x;
        hologram.rotation.y += hologram.userData.rotationSpeed.y;
        hologram.rotation.z += hologram.userData.rotationSpeed.z;

        // Pulsing opacity
        hologram.material.opacity =
          0.4 + Math.sin(Date.now() * hologram.userData.pulseSpeed) * 0.3;
      });

      // Animate particle streams
      const positions = streams.geometry.attributes.position.array;
      for (let i = 0; i < streamCount; i++) {
        positions[i * 3] += streamVelocities[i].x;
        positions[i * 3 + 1] += streamVelocities[i].y;
        positions[i * 3 + 2] += streamVelocities[i].z;

        // Reset particles
        if (positions[i * 3 + 1] > 40) {
          positions[i * 3 + 1] = -40;
          positions[i * 3] = (Math.random() - 0.5) * 150;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
        }
      }
      streams.geometry.attributes.position.needsUpdate = true;

      // Camera movement with mouse
      camera.position.x += (mousePosition.x * 3 - camera.position.x) * 0.02;
      camera.position.y += (mousePosition.y * 2 - camera.position.y) * 0.02;

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
      if (threeContainerRef.current && renderer.domElement) {
        threeContainerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [mousePosition]);

  // Advanced GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Morphing SVG background
      if (morphRef.current) {
        const tl = gsap.timeline({ repeat: -1, yoyo: true });
        tl.to(morphRef.current, {
          morphSVG: "M30,70 Q70,30 90,70 Q70,110 30,70",
          duration: 8,
          ease: "power2.inOut",
        }).to(morphRef.current, {
          morphSVG: "M40,60 Q60,40 80,60 Q60,80 40,60",
          duration: 6,
          ease: "power2.inOut",
        });
      }

      // Hero title animation with time distortion effect
      if (heroTitleRef.current) {
        const split = new SplitText(heroTitleRef.current, {
          type: "chars,words",
        });

        gsap.fromTo(
          split.chars,
          {
            opacity: 0,
            y: 200,
            rotationX: -90,
            rotationY: 180,
            transformOrigin: "0% 50% -50",
            scale: 0.2,
            filter: "blur(20px)",
          },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 2.5,
            ease: "back.out(2)",
            stagger: {
              amount: 3,
              from: "center",
            },
            delay: 0.5,
          }
        );
      }

      // Hero subtitle with quantum entrance
      if (heroSubtitleRef.current) {
        gsap.fromTo(
          heroSubtitleRef.current,
          {
            opacity: 0,
            y: 100,
            scale: 0.8,
            filter: "blur(10px)",
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.5,
            ease: "power3.out",
            delay: 2,
          }
        );
      }

      // Hero stats with quantum materialization
      gsap.fromTo(
        heroStatsRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.5,
          rotationY: -45,
          filter: "blur(15px)",
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationY: 0,
          filter: "blur(0px)",
          duration: 1.2,
          stagger: 0.15,
          ease: "back.out(1.7)",
          delay: 2.5,
        }
      );

      // Scroll progress bar with quantum glow
      gsap.to(progressBarRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      // Section animations with quantum entrance
      const sections = [mealsRef, offersRef, membershipRef, testimonialsRef];

      sections.forEach((sectionRef, index) => {
        if (sectionRef.current) {
          gsap.fromTo(
            sectionRef.current,
            {
              opacity: 0,
              y: 150,
              scale: 0.9,
              rotationX: 15,
              filter: "blur(10px)",
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotationX: 0,
              filter: "blur(0px)",
              duration: 1.5,
              ease: "power3.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse",
                onEnter: () => setCurrentSection(index + 1),
                onLeaveBack: () => setCurrentSection(index),
              },
            }
          );
        }
      });

      // Parallax effect for Three.js camera with time warp
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          if (cameraRef.current) {
            cameraRef.current.position.z = 30 + progress * 15;
            cameraRef.current.position.y = 10 - progress * 5;
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Smooth scroll to sections
  const scrollToSection = (sectionRef) => {
    sectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black overflow-hidden"
    >
      {/* Morphing SVG Background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10"
        viewBox="0 0 100 100"
      >
        <path
          ref={morphRef}
          d="M30,50 Q50,30 70,50 Q50,70 30,50"
          fill="none"
          stroke="url(#futureGradient)"
          strokeWidth="0.5"
        />
        <defs>
          <linearGradient
            id="futureGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#84cc16" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
        </defs>
      </svg>

      {/* Three.js Future Scene */}
      <div
        ref={threeContainerRef}
        className="fixed inset-0 pointer-events-none z-0"
      />

      {/* Quantum Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-green-900/50 z-50">
        <div
          ref={progressBarRef}
          className="h-full bg-gradient-to-r from-green-400 via-emerald-400 to-lime-400 origin-left scale-x-0 shadow-lg shadow-green-400/50"
          style={{
            boxShadow:
              "0 0 20px rgba(34, 197, 94, 0.8), 0 0 40px rgba(34, 197, 94, 0.4)",
          }}
        />
      </div>

      {/* Quantum Navigation Dots */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 hidden lg:flex flex-col space-y-6">
        {["NEXUS", "CUISINE", "OFFERS", "MATRIX", "VOICES"].map(
          (label, index) => (
            <button
              key={label}
              onClick={() => {
                const refs = [
                  heroRef,
                  mealsRef,
                  offersRef,
                  membershipRef,
                  testimonialsRef,
                ];
                scrollToSection(refs[index]);
              }}
              className={`group relative w-6 h-6 rounded-full transition-all duration-500 transform hover:scale-125 ${
                currentSection === index
                  ? "bg-gradient-to-r from-green-400 to-emerald-400 shadow-lg shadow-green-400/50"
                  : "bg-green-600/40 hover:bg-green-500/60 border border-green-400/40"
              }`}
              style={{
                boxShadow:
                  currentSection === index
                    ? "0 0 20px rgba(34, 197, 94, 0.8), 0 0 40px rgba(34, 197, 94, 0.4)"
                    : "none",
              }}
            >
              <span className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-gray-900/90 backdrop-blur-sm text-green-300 px-4 py-2 rounded-xl text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-xl border border-green-400/40 font-bold">
                {label}
              </span>
            </button>
          )
        )}
      </div>

      {/* Hero Nexus Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center z-10"
      >
        <div className="container mx-auto px-4">
          {/* Quantum Badge */}
          <div className="text-center mt-4 mb-12">
            <div className="inline-flex items-center bg-green-500/20 backdrop-blur-2xl text-green-300 px-8 py-4 rounded-full text-sm font-bold mb-8 border border-green-400/40">
              <Cpu size={20} className="mr-3 animate-pulse" />
              <span className="bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
                NEXT-GEN DINING MATRIX
              </span>
              <Sparkles
                size={20}
                className="ml-3 animate-spin"
                style={{ animationDuration: "3s" }}
              />
            </div>
          </div>

          {/* Main Hero Content */}
          <div className="text-center max-w-6xl mx-auto">
            <h1
              // ref={heroTitleRef}
              className="text-6xl sm:text-7xl lg:text-9xl font-black leading-tight mb-12"
            >
              <p className="bg-gradient-to-r from-green-300 via-emerald-300 to-lime-300 bg-clip-text text-transparent">
                FUTURE
              </p>
              <p className="text-white">DINING</p>
              <p className="bg-gradient-to-r from-emerald-300 via-green-300 to-lime-300 bg-clip-text text-transparent">
                NEXUS
              </p>
            </h1>

            <p
              ref={heroSubtitleRef}
              className="text-2xl sm:text-3xl text-green-200 max-w-5xl mx-auto mb-16 leading-relaxed font-light"
            >
              Step into tomorrow's culinary dimension where AI-powered nutrition
              meets quantum flavor engineering for the ultimate student dining
              experience.
            </p>

            {/* Quantum CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
              <button
                onClick={() => scrollToSection(mealsRef)}
                className="group relative bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black px-12 py-6 rounded-2xl font-black text-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                style={{
                  boxShadow:
                    "0 0 30px rgba(34, 197, 94, 0.6), 0 0 60px rgba(34, 197, 94, 0.3)",
                }}
              >
                <span className="relative z-10 flex items-center">
                  <Rocket size={24} className="mr-3" />
                  ENTER FOOD MATRIX
                  <Zap
                    size={24}
                    className="ml-3 group-hover:rotate-12 transition-transform"
                  />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </button>

              <button
                onClick={() => scrollToSection(membershipRef)}
                className="group relative border-2 border-green-400 text-green-300 hover:bg-green-500/20 px-12 py-6 rounded-2xl font-black text-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
              >
                <span className="flex items-center">
                  <Shield size={24} className="mr-3" />
                  ACCESS PROTOCOLS
                  <ArrowDown
                    size={24}
                    className="ml-3 group-hover:translate-y-1 transition-transform"
                  />
                </span>
              </button>
            </div>

            {/* Quantum Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                { number: "∞", label: "Quantum Flavors", icon: Zap },
                { number: "15k+", label: "Neural Networks", icon: Users },
                { number: "99.9%", label: "Satisfaction Matrix", icon: Star },
                { number: "24/7", label: "Temporal Service", icon: Award },
              ].map((stat, index) => (
                <div
                  key={index}
                  ref={(el) => (heroStatsRef.current[index] = el)}
                  className="group text-center cursor-pointer bg-black/40 backdrop-blur-2xl rounded-2xl p-8 border border-green-400/40 hover:border-green-300/80 transition-all duration-300 hover:shadow-xl"
                  style={{
                    boxShadow: "0 0 20px rgba(34, 197, 94, 0.2)",
                  }}
                >
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform duration-300 border border-green-400/40">
                    <stat.icon size={28} />
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-green-400 mb-3 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-green-300 font-bold text-lg">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quantum Scroll Indicator */}
        <button
          onClick={() => scrollToSection(mealsRef)}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-green-500/20 backdrop-blur-2xl hover:bg-green-500/30 text-green-300 rounded-full p-6 transition-all duration-300 animate-bounce shadow-xl border border-green-400/40 group"
          style={{
            boxShadow: "0 0 30px rgba(34, 197, 94, 0.4)",
          }}
          aria-label="Enter the matrix"
        >
          <ArrowDown
            size={32}
            className="group-hover:translate-y-1 transition-transform"
          />
        </button>
      </section>

      {/* Futuristic Meals Section */}
      <section ref={mealsRef} className="relative z-10">
        <FuturisticMealsByCategory />
      </section>

      {/* Quantum Offers Section */}
      <section ref={offersRef} className="relative z-10">
        <FuturisticSpecialOffers />
      </section>

      {/* Matrix Membership Section */}
      <section ref={membershipRef} className="relative z-10" id="meals-plans">
        <FuturisticMembership />
      </section>

      {/* Neural Testimonials Section */}
      {/* <section ref={testimonialsRef} className="relative z-10">
        <FuturisticTestimonials />
      </section> */}

      {/* Quantum Navigation Button */}
      <button
        onClick={() => scrollToSection(heroRef)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black p-6 rounded-full transition-all duration-300 transform hover:scale-110 z-40 group"
        style={{
          boxShadow:
            "0 0 30px rgba(34, 197, 94, 0.6), 0 0 60px rgba(34, 197, 94, 0.3)",
        }}
        aria-label="Return to nexus"
      >
        <ArrowDown
          size={32}
          className="rotate-180 group-hover:-translate-y-1 transition-transform"
        />
      </button>
    </div>
  );
}
