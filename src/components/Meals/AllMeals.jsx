"use client";

import { useState, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAxiosPublic } from "../../Hooks/useAxiosPublic";
import InfiniteScroll from "react-infinite-scroller";
import {
  Search,
  Star,
  ArrowRight,
  Clock,
  Heart,
  ChefHat,
  Leaf,
  Zap,
  Award,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger, SplitText, MorphSVGPlugin);

const MealsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const searchRef = useRef(null);
  const gridRef = useRef(null);
  const threeContainerRef = useRef(null);
  const cursorRef = useRef(null);
  const morphRef = useRef(null);
  const axiosPublic = useAxiosPublic();

  // Revolutionary Three.js Scene
  useEffect(() => {
    if (!threeContainerRef.current) return;

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
    threeContainerRef.current.appendChild(renderer.domElement);

    // Create dynamic green matrix
    const matrix = [];

    // Floating green crystals
    for (let i = 0; i < 30; i++) {
      const geometry = new THREE.OctahedronGeometry(0.5 + Math.random() * 0.5);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(
          0.3 + Math.random() * 0.1,
          0.9,
          0.5 + Math.random() * 0.3
        ),
        transparent: true,
        opacity: 0.8,
        wireframe: Math.random() > 0.5,
      });
      const crystal = new THREE.Mesh(geometry, material);
      crystal.position.set(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50
      );
      crystal.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02,
        },
        floatSpeed: Math.random() * 0.005 + 0.002,
        originalY: crystal.position.y,
        time: Math.random() * Math.PI * 2,
      };
      scene.add(crystal);
      matrix.push(crystal);
    }

    // Green energy grid
    const gridGeometry = new THREE.PlaneGeometry(200, 200, 20, 20);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = -30;
    scene.add(grid);

    // Particle streams
    const streamGeometry = new THREE.BufferGeometry();
    const streamCount = 200;
    const streamPositions = new Float32Array(streamCount * 3);
    const streamVelocities = [];

    for (let i = 0; i < streamCount; i++) {
      streamPositions[i * 3] = (Math.random() - 0.5) * 200;
      streamPositions[i * 3 + 1] = Math.random() * 100 - 50;
      streamPositions[i * 3 + 2] = (Math.random() - 0.5) * 100;

      streamVelocities.push({
        x: (Math.random() - 0.5) * 0.1,
        y: Math.random() * 0.05 + 0.02,
        z: (Math.random() - 0.5) * 0.1,
      });
    }

    streamGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(streamPositions, 3)
    );
    const streamMaterial = new THREE.PointsMaterial({
      color: 0x84cc16,
      size: 0.2,
      transparent: true,
      opacity: 0.9,
    });
    const streams = new THREE.Points(streamGeometry, streamMaterial);
    scene.add(streams);

    camera.position.set(0, 10, 40);

    const animate = () => {
      requestAnimationFrame(animate);

      // Animate crystals
      matrix.forEach((crystal) => {
        crystal.userData.time += crystal.userData.floatSpeed;
        crystal.position.y =
          crystal.userData.originalY + Math.sin(crystal.userData.time) * 5;

        crystal.rotation.x += crystal.userData.rotationSpeed.x;
        crystal.rotation.y += crystal.userData.rotationSpeed.y;
        crystal.rotation.z += crystal.userData.rotationSpeed.z;
      });

      // Animate grid
      grid.rotation.z += 0.002;

      // Animate particle streams
      const positions = streams.geometry.attributes.position.array;
      for (let i = 0; i < streamCount; i++) {
        positions[i * 3] += streamVelocities[i].x;
        positions[i * 3 + 1] += streamVelocities[i].y;
        positions[i * 3 + 2] += streamVelocities[i].z;

        // Reset particles
        if (positions[i * 3 + 1] > 50) {
          positions[i * 3 + 1] = -50;
          positions[i * 3] = (Math.random() - 0.5) * 200;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
        }
      }
      streams.geometry.attributes.position.needsUpdate = true;

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
      if (threeContainerRef.current && renderer.domElement) {
        threeContainerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Custom Cursor with Magnetic Effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX - 15,
          y: e.clientY - 15,
          duration: 0.1,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Revolutionary GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Morphing background
      if (morphRef.current) {
        gsap.to(morphRef.current, {
          morphSVG: "M20,80 Q50,20 80,80 Q50,120 20,80",
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
        });
      }

      // Split text with spectacular entrance
      if (titleRef.current) {
        const split = new SplitText(titleRef.current, {
          type: "chars,words,lines",
        });

        gsap.fromTo(
          split.chars,
          {
            opacity: 0,
            y: 200,
            rotationX: -90,
            rotationY: 45,
            transformOrigin: "0% 50% -50",
            scale: 0.3,
          },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            duration: 2,
            ease: "back.out(2)",
            stagger: {
              amount: 1.5,
              from: "random",
            },
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Search bar with magnetic field
      if (searchRef.current) {
        const searchElement = searchRef.current;

        searchElement.addEventListener("mouseenter", () => {
          gsap.to(searchElement, {
            scale: 1.05,
            rotationY: 5,
            boxShadow: "0 30px 60px rgba(34, 197, 94, 0.4)",
            duration: 0.4,
            ease: "power2.out",
          });
        });

        searchElement.addEventListener("mouseleave", () => {
          gsap.to(searchElement, {
            scale: 1,
            rotationY: 0,
            boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)",
            duration: 0.4,
            ease: "power2.out",
          });
        });
      }

      // Hero parallax with depth
      gsap.to(heroRef.current, {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const { data, fetchNextPage, hasNextPage, isLoading, isError, refetch } =
    useInfiniteQuery({
      queryKey: ["meals", searchQuery, category, priceRange],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await axiosPublic("/all-meals", {
          params: {
            search: searchQuery,
            category: category,
            minPrice: priceRange.min,
            maxPrice: priceRange.max,
            page: pageParam,
            limit: 6,
          },
        });
        return response.data;
      },
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 6 ? allPages.length + 1 : undefined;
      },
    });

  const meals = data?.pages.flat() || [];
  const categories = ["Breakfast", "Lunch", "Dinner", "Dessert"];

  const handleSearch = (e) => {
    e.preventDefault();
    refetch();
  };

  const handleCategoryChange = (selectedCategory) => {
    gsap.to(gridRef.current, {
      opacity: 0,
      scale: 0.9,
      rotationY: 45,
      duration: 0.4,
      onComplete: () => {
        setCategory(selectedCategory === category ? "" : selectedCategory);
        setTimeout(() => refetch(), 100);
        gsap.to(gridRef.current, {
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
        });
      },
    });
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-green-900 to-black min-h-screen relative overflow-hidden">
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="fixed w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full pointer-events-none z-50 mix-blend-screen opacity-80"
        style={{ transform: "translate(-50%, -50%)" }}
      />

      {/* Morphing SVG Background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-5"
        viewBox="0 0 100 100"
      >
        <path
          ref={morphRef}
          d="M20,50 Q50,20 80,50 Q50,80 20,50"
          fill="none"
          stroke="url(#greenGradient)"
          strokeWidth="0.3"
        />
        <defs>
          <linearGradient
            id="greenGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#84cc16" />
          </linearGradient>
        </defs>
      </svg>

      {/* Three.js Background */}
      <div
        ref={threeContainerRef}
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{ zIndex: 1 }}
      />

      {/* Hero Section */}
      <div
        ref={heroRef}
        className="relative z-10 min-h-screen flex items-center justify-center"
      >
        <div className="container mx-auto px-4 text-center">
          {/* Animated Badge */}
          <div className="inline-flex items-center bg-green-500/20 backdrop-blur-2xl text-green-300 px-8 py-4 rounded-full text-sm font-bold mb-12 border border-green-400/40 animate-pulse">
            <Leaf
              size={20}
              className="mr-3 animate-spin"
              style={{ animationDuration: "4s" }}
            />
            <span className="bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
              PREMIUM CULINARY UNIVERSE
            </span>
            <Zap size={20} className="ml-3 animate-bounce" />
          </div>

          {/* Revolutionary Title */}
          <h1
            ref={titleRef}
            className="text-7xl sm:text-8xl lg:text-9xl font-black leading-tight mb-12"
          >
            <span className="bg-gradient-to-r from-green-300 via-emerald-300 to-lime-300 bg-clip-text text-transparent">
              TASTE
            </span>
            <br />
            <span className="text-white">THE FUTURE</span>
          </h1>

          <p className="text-2xl text-green-200 max-w-4xl mx-auto mb-16 leading-relaxed font-light">
            Embark on an extraordinary culinary journey through our universe of
            flavors, where each dish is a masterpiece
          </p>

          {/* Futuristic Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-16">
            <div
              ref={searchRef}
              className="relative bg-black/40 backdrop-blur-2xl rounded-2xl border border-green-500/40 overflow-hidden"
              style={{ perspective: "1000px" }}
            >
              <input
                type="text"
                placeholder="Search the culinary universe..."
                className="w-full px-10 py-8 bg-transparent text-white placeholder-green-300/60 text-xl focus:outline-none font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-black p-4 rounded-xl hover:from-green-400 hover:to-emerald-400 transition-all duration-300 shadow-2xl"
              >
                <Search size={28} />
              </button>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </form>

          {/* Category Pills with Holographic Effect */}
          {/* <div className="flex flex-wrap justify-center gap-6 mb-20">
            <button
              onClick={() => handleCategoryChange("")}
              className={`group relative px-10 py-5 rounded-full font-black text-lg transition-all duration-500 transform hover:scale-110 ${
                category === ""
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-black shadow-2xl shadow-green-500/50"
                  : "bg-black/40 backdrop-blur-xl text-green-300 hover:text-white hover:bg-green-500/20 border border-green-500/30"
              }`}
            >
              <span className="relative z-10">ALL UNIVERSES</span>
              {category === "" && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-20 animate-pulse"></div>
              )}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`group relative px-10 py-5 rounded-full font-black text-lg transition-all duration-500 transform hover:scale-110 ${
                  category === cat
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-black shadow-2xl shadow-green-500/50"
                    : "bg-black/40 backdrop-blur-xl text-green-300 hover:text-white hover:bg-green-500/20 border border-green-500/30"
                }`}
              >
                <span className="relative z-10">{cat.toUpperCase()}</span>
                {category === cat && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-20 animate-pulse"></div>
                )}
              </button>
            ))}
          </div> */}
        </div>
      </div>

      {/* Meals Grid Section */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <h2 className="text-6xl font-black text-white mb-8">
            {category ? (
              <>
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {category.toUpperCase()}
                </span>{" "}
                COLLECTION
              </>
            ) : (
              <>
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  SIGNATURE
                </span>{" "}
                MASTERPIECES
              </>
            )}
          </h2>
          <p className="text-2xl text-green-200 max-w-3xl mx-auto">
            Each creation is a symphony of flavors designed to transcend your
            expectations
          </p>
        </div>

        {isLoading && meals.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-32">
            <div className="relative w-32 h-32 mb-12">
              <div className="absolute inset-0 border-4 border-green-500/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-green-400 rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-r-emerald-400 rounded-full animate-spin animate-reverse"></div>
              <div className="absolute inset-4 border-4 border-b-lime-400 rounded-full animate-spin"></div>
            </div>
            <p className="text-green-300 font-bold text-2xl animate-pulse">
              Materializing culinary wonders...
            </p>
          </div>
        ) : isError ? (
          <div className="text-center py-32 bg-black/40 backdrop-blur-xl rounded-3xl border border-red-500/30">
            <div className="text-red-400 mb-8">
              <Zap size={80} className="mx-auto animate-pulse" />
            </div>
            <h3 className="text-3xl font-black text-white mb-6">
              SYSTEM MALFUNCTION
            </h3>
            <p className="text-red-300 mb-12 text-xl">
              The culinary matrix is temporarily offline
            </p>
            <button
              onClick={() => refetch()}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white px-12 py-6 rounded-xl font-black text-xl transition-all duration-300 transform hover:scale-105"
            >
              REBOOT SYSTEM
            </button>
          </div>
        ) : (
          <div ref={gridRef}>
            <InfiniteScroll
              pageStart={0}
              loadMore={fetchNextPage}
              hasMore={hasNextPage}
              loader={
                <div className="text-center my-16">
                  <div className="inline-flex items-center bg-green-500/20 backdrop-blur-xl text-green-300 px-8 py-4 rounded-full border border-green-400/40">
                    <div className="w-8 h-8 border-2 border-green-300/30 border-t-green-400 rounded-full animate-spin mr-4"></div>
                    <span className="font-bold">
                      Loading more culinary universes...
                    </span>
                  </div>
                </div>
              }
            >
              {meals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {meals.map((meal, index) => (
                    <div
                      key={meal._id}
                      className="group relative bg-gradient-to-br from-black/60 to-green-900/30 backdrop-blur-xl rounded-3xl overflow-hidden border border-green-500/40 hover:border-green-400/80 transition-all duration-700 transform hover:scale-105"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        animation: "fadeInUp 1s ease-out forwards",
                      }}
                    >
                      {/* Holographic Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-transparent to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Image Container */}
                      <div className="relative h-72 overflow-hidden">
                        <img
                          src={
                            meal.image ||
                            `https://images.unsplash.com/photo-${
                              1565299624946 + index || "/placeholder.svg"
                            }-d3c442d3e04c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80`
                          }
                          alt={meal.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-transparent to-transparent"></div>

                        {/* Premium Badge */}
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-green-400 to-emerald-400 text-black px-4 py-2 rounded-full text-sm font-black shadow-2xl">
                          <Award size={16} className="inline mr-2" />
                          PREMIUM
                        </div>

                        {/* Heart Button */}
                        <button className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm p-3 rounded-full text-green-400 hover:text-red-400 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                          <Heart size={20} />
                        </button>

                        {/* Stats */}
                        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center bg-black/60 backdrop-blur-sm px-3 py-2 rounded-full">
                              <Clock
                                size={16}
                                className="mr-2 text-green-400"
                              />
                              <span className="text-sm font-bold text-white">
                                20 min
                              </span>
                            </div>
                            <div className="flex items-center bg-black/60 backdrop-blur-sm px-3 py-2 rounded-full">
                              <ChefHat
                                size={16}
                                className="mr-2 text-green-400"
                              />
                              <span className="text-sm font-bold text-white">
                                Master Chef
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                          <h3 className="text-2xl font-black text-white group-hover:text-green-400 transition-colors line-clamp-1">
                            {meal.title}
                          </h3>
                          <div className="flex items-center bg-green-500/20 backdrop-blur-sm px-3 py-2 rounded-full ml-3">
                            <Star
                              size={18}
                              className="text-green-400 fill-green-400"
                            />
                            <span className="ml-2 text-sm font-bold text-green-300">
                              {meal.rating?.toFixed(1) || "4.9"}
                            </span>
                          </div>
                        </div>

                        <p className="text-green-200 mb-8 line-clamp-2 leading-relaxed">
                          {meal.description ||
                            "A revolutionary culinary experience that transcends traditional boundaries and redefines taste."}
                        </p>

                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                              $
                              {typeof meal.price === "number"
                                ? meal.price.toFixed(2)
                                : meal.price}
                            </span>
                            <span className="text-green-300 text-sm ml-2 font-medium">
                              per serving
                            </span>
                          </div>
                          <Link
                            to={`/meals/${meal._id}`}
                            className="group/btn bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black px-8 py-4 rounded-xl font-black flex items-center transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-green-500/50"
                          >
                            <span>EXPERIENCE</span>
                            <ArrowRight
                              size={20}
                              className="ml-3 group-hover/btn:translate-x-1 transition-transform"
                            />
                          </Link>
                        </div>
                      </div>

                      {/* Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-emerald-500/0 to-green-500/0 group-hover:from-green-500/10 group-hover:via-emerald-500/10 group-hover:to-green-500/10 transition-all duration-700 pointer-events-none rounded-3xl"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-32 bg-black/40 backdrop-blur-xl rounded-3xl border border-green-500/30">
                  <Search
                    size={80}
                    className="mx-auto text-green-400/40 mb-8"
                  />
                  <h3 className="text-3xl font-black text-white mb-6">
                    NO MATCHES FOUND
                  </h3>
                  <p className="text-green-300 mb-12 text-xl">
                    The culinary universe doesn't contain your search
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setCategory("");
                      setPriceRange({ min: 0, max: 1000 });
                      setTimeout(() => refetch(), 100);
                    }}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black px-12 py-6 rounded-xl font-black text-xl transition-all duration-300 transform hover:scale-105"
                  >
                    RESET UNIVERSE
                  </button>
                </div>
              )}
            </InfiniteScroll>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(50px) rotateY(-15deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) rotateY(0deg);
          }
        }

        .animate-reverse {
          animation-direction: reverse;
        }
      `}</style>
    </div>
  );
};

export default MealsPage;
