"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ArrowRight, Play, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import * as THREE from "three";

export default function SimpleHero({ searchQuery, setSearchQuery }) {
  const [searchValue, setSearchValue] = useState(searchQuery || "");
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const searchRef = useRef(null);
  const imageRef = useRef(null);
  const threeRef = useRef(null);
  const sceneRef = useRef(null);

  // Simple Three.js floating elements
  useEffect(() => {
    if (!threeRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    threeRef.current.appendChild(renderer.domElement);

    // Create simple floating food icons
    const geometry = new THREE.SphereGeometry(0.1, 8, 8);
    const materials = [
      new THREE.MeshBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.6,
      }),
      new THREE.MeshBasicMaterial({
        color: 0x06d6a0,
        transparent: true,
        opacity: 0.6,
      }),
      new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.6,
      }),
    ];

    const particles = [];
    for (let i = 0; i < 20; i++) {
      const particle = new THREE.Mesh(
        geometry,
        materials[i % materials.length]
      );
      particle.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10
      );
      particle.userData = {
        originalY: particle.position.y,
        speed: Math.random() * 0.01 + 0.005,
        amplitude: Math.random() * 1 + 0.5,
      };
      scene.add(particle);
      particles.push(particle);
    }

    camera.position.z = 10;

    const animate = () => {
      requestAnimationFrame(animate);

      particles.forEach((particle) => {
        particle.position.y =
          particle.userData.originalY +
          Math.sin(Date.now() * particle.userData.speed) *
            particle.userData.amplitude;
        particle.rotation.x += 0.01;
        particle.rotation.y += 0.01;
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (threeRef.current && renderer.domElement) {
        threeRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Simple entrance animations
  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    )
      .fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        searchRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        imageRef.current,
        { x: 50, opacity: 0, scale: 0.9 },
        { x: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" },
        "-=0.6"
      );
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (setSearchQuery) {
      setSearchQuery(searchValue);
    }
  };

  return (
    <div
      ref={heroRef}
      className="relative min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden"
    >
      {/* Three.js Background */}
      <div
        ref={threeRef}
        className="absolute inset-0 pointer-events-none opacity-30"
      />

      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-emerald-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 min-h-[80vh]">
          {/* Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-green-200 mb-6">
              <Sparkles size={16} className="mr-2 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                Fresh • Healthy • Delicious
              </span>
            </div>

            {/* Title */}
            <h1
              ref={titleRef}
              className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Delicious Meals
              <span className="block text-green-600">Made Simple</span>
            </h1>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="text-xl text-gray-600 mb-8 max-w-lg"
            >
              Fresh, nutritious meals delivered to your hostel. No fuss, no
              stress, just great food when you need it.
            </p>

            {/* Search */}
            <form ref={searchRef} onSubmit={handleSearch} className="mb-8">
              <div className="relative max-w-md mx-auto lg:mx-0">
                <input
                  type="text"
                  placeholder="What are you craving today?"
                  className="w-full px-6 py-4 pl-12 rounded-2xl bg-white border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-200"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-2 rounded-xl hover:bg-green-700 transition-colors"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/meals"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                Browse Meals
                <ArrowRight size={20} className="ml-2" />
              </Link>
              <button className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center">
                <Play size={18} className="mr-2" />
                Watch Demo
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="w-full lg:w-1/2">
            <div ref={imageRef} className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Delicious meal"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl p-4 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">4.9★</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">15min</div>
                  <div className="text-sm text-gray-600">Delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
