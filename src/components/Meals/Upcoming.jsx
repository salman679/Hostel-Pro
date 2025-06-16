"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useAuth } from "../../contexts/AuthContext";
import {
  Heart,
  Star,
  Clock,
  Search,
  Calendar,
  MessageSquare,
  X,
  Loader2,
  Crown,
  Leaf,
  Zap,
  Sparkles,
  Award,
} from "lucide-react";
import { debounce } from "lodash";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger, SplitText, MorphSVGPlugin, DrawSVGPlugin);

export default function UpcomingMeals() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const sectionRef = useRef(null);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const threeContainerRef = useRef(null);
  const morphRef = useRef(null);
  const particleSystemRef = useRef(null);

  const axiosSecure = useAxiosSecure();
  const { user, loading } = useAuth();

  const { data: userType = {}, isLoading: userLoading } = useQuery({
    queryKey: ["userType", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user?.email}`);
      return res.data;
    },
  });

  const {
    data: upcomingMeals = [],
    refetch,
    isLoading: mealsLoading,
    isFetching,
  } = useQuery({
    queryKey: ["meals", activeCategory, debouncedSearchQuery],
    queryFn: async () => {
      setIsSearching(true);
      try {
        const res = await axiosSecure.get("/upcoming-meals", {
          params: {
            category: activeCategory !== "all" ? activeCategory : undefined,
            search: debouncedSearchQuery || undefined,
          },
        });
        return res.data;
      } finally {
        setIsSearching(false);
      }
    },
  });

  // Revolutionary Three.js Future Scene
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

    // Create futuristic time portal effect
    const timePortal = [];

    // Rotating green energy rings
    for (let i = 0; i < 8; i++) {
      const ringGeometry = new THREE.RingGeometry(5 + i * 2, 5.5 + i * 2, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.3 + i * 0.02, 0.9, 0.5 + i * 0.05),
        transparent: true,
        opacity: 0.3 - i * 0.03,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.z = -20 - i * 3;
      ring.userData = {
        rotationSpeed: (i % 2 === 0 ? 1 : -1) * (0.01 + i * 0.002),
        originalZ: ring.position.z,
        pulseSpeed: 0.02 + i * 0.005,
      };
      scene.add(ring);
      timePortal.push(ring);
    }

    // Floating future food holograms
    const holograms = [];
    for (let i = 0; i < 25; i++) {
      const geometry = new THREE.SphereGeometry(
        0.3 + Math.random() * 0.4,
        12,
        12
      );
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.3 + Math.random() * 0.1, 0.8, 0.6),
        transparent: true,
        opacity: 0.7,
        wireframe: true,
      });
      const hologram = new THREE.Mesh(geometry, material);
      hologram.position.set(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 40
      );
      hologram.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.03,
          y: (Math.random() - 0.5) * 0.03,
          z: (Math.random() - 0.5) * 0.03,
        },
        floatSpeed: Math.random() * 0.008 + 0.003,
        originalY: hologram.position.y,
        time: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      };
      scene.add(hologram);
      holograms.push(hologram);
    }

    // Future particle streams
    const streamGeometry = new THREE.BufferGeometry();
    const streamCount = 300;
    const streamPositions = new Float32Array(streamCount * 3);
    const streamColors = new Float32Array(streamCount * 3);
    const streamVelocities = [];

    for (let i = 0; i < streamCount; i++) {
      streamPositions[i * 3] = (Math.random() - 0.5) * 100;
      streamPositions[i * 3 + 1] = Math.random() * 60 - 30;
      streamPositions[i * 3 + 2] = (Math.random() - 0.5) * 80;

      const color = new THREE.Color().setHSL(
        0.3 + Math.random() * 0.1,
        0.9,
        0.6
      );
      streamColors[i * 3] = color.r;
      streamColors[i * 3 + 1] = color.g;
      streamColors[i * 3 + 2] = color.b;

      streamVelocities.push({
        x: (Math.random() - 0.5) * 0.05,
        y: Math.random() * 0.03 + 0.01,
        z: (Math.random() - 0.5) * 0.05,
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
      size: 0.15,
      transparent: true,
      opacity: 0.8,
      vertexColors: true,
    });
    const streams = new THREE.Points(streamGeometry, streamMaterial);
    scene.add(streams);
    particleSystemRef.current = { streams, velocities: streamVelocities };

    camera.position.set(0, 8, 25);

    const animate = () => {
      requestAnimationFrame(animate);

      // Animate time portal rings
      timePortal.forEach((ring, index) => {
        ring.rotation.z += ring.userData.rotationSpeed;

        // Pulsing effect
        const pulse = 1 + Math.sin(Date.now() * ring.userData.pulseSpeed) * 0.3;
        ring.scale.setScalar(pulse);

        // Moving through time
        ring.position.z += 0.1;
        if (ring.position.z > 10) {
          ring.position.z = ring.userData.originalZ;
        }
      });

      // Animate holograms
      holograms.forEach((hologram) => {
        hologram.userData.time += hologram.userData.floatSpeed;
        hologram.position.y =
          hologram.userData.originalY + Math.sin(hologram.userData.time) * 3;

        hologram.rotation.x += hologram.userData.rotationSpeed.x;
        hologram.rotation.y += hologram.userData.rotationSpeed.y;
        hologram.rotation.z += hologram.userData.rotationSpeed.z;

        // Pulsing opacity
        hologram.material.opacity =
          0.7 + Math.sin(Date.now() * hologram.userData.pulseSpeed) * 0.3;
      });

      // Animate particle streams
      const positions = streams.geometry.attributes.position.array;
      for (let i = 0; i < streamCount; i++) {
        positions[i * 3] += streamVelocities[i].x;
        positions[i * 3 + 1] += streamVelocities[i].y;
        positions[i * 3 + 2] += streamVelocities[i].z;

        // Reset particles
        if (positions[i * 3 + 1] > 30) {
          positions[i * 3 + 1] = -30;
          positions[i * 3] = (Math.random() - 0.5) * 100;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
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

  // Revolutionary GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Morphing SVG background
      if (morphRef.current) {
        const tl = gsap.timeline({ repeat: -1, yoyo: true });
        tl.to(morphRef.current, {
          morphSVG: "M30,70 Q70,30 90,70 Q70,110 30,70",
          duration: 5,
          ease: "power2.inOut",
        }).to(morphRef.current, {
          morphSVG: "M40,60 Q60,40 80,60 Q60,80 40,60",
          duration: 3,
          ease: "power2.inOut",
        });
      }

      // Split text with time distortion effect
      if (titleRef.current) {
        const split = new SplitText(titleRef.current, { type: "chars,words" });

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
            duration: 2,
            ease: "back.out(2)",
            stagger: {
              amount: 2,
              from: "center",
            },
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Hero parallax with time warp
      gsap.to(heroRef.current, {
        yPercent: -25,
        rotationX: 2,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Cards with quantum entrance
      gsap.fromTo(
        cardsRef.current,
        {
          opacity: 0,
          y: 200,
          scale: 0.5,
          rotationY: -45,
          rotationX: 30,
          transformOrigin: "center center",
          filter: "blur(10px)",
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationY: 0,
          rotationX: 0,
          filter: "blur(0px)",
          duration: 1.5,
          ease: "power3.out",
          stagger: {
            amount: 1,
            from: "random",
          },
          scrollTrigger: {
            trigger: ".meals-grid",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [upcomingMeals]);

  // Debounce search
  const debouncedSearch = useCallback(
    debounce((query) => {
      setDebouncedSearchQuery(query);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  // Quantum hover effect
  const handleCardHover = (index, isEntering) => {
    const card = cardsRef.current[index];
    if (!card) return;

    if (isEntering) {
      setHoveredCard(index);
      gsap.to(card, {
        scale: 1.1,
        rotationY: 10,
        rotationX: 5,
        z: 100,
        boxShadow: "0 40px 80px rgba(34, 197, 94, 0.4)",
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      setHoveredCard(null);
      gsap.to(card, {
        scale: 1,
        rotationY: 0,
        rotationX: 0,
        z: 0,
        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)",
        duration: 0.5,
        ease: "power2.out",
      });
    }
  };

  const handleLike = async (meal) => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Access Denied",
        text: "You need to be logged in to like future meals.",
        confirmButtonColor: "#22c55e",
        background: "#1f2937",
        color: "#ffffff",
      });
      return;
    }

    if (["Silver", "Gold", "Platinum"].includes(userType.subscription)) {
      try {
        const response = await axiosSecure.patch(
          `/upcoming-meals/${meal._id}/like`,
          {
            userEmail: user.email,
          }
        );

        if (response.data.modifiedCount > 0) {
          refetch();
          Swal.fire({
            icon: "success",
            title: "Future Approved!",
            text: `You liked ${meal.title} from the future.`,
            confirmButtonColor: "#22c55e",
            timer: 1500,
            showConfirmButton: false,
            background: "#1f2937",
            color: "#ffffff",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Temporal Error",
          text: "Something went wrong in the timeline. Please try again.",
          confirmButtonColor: "#22c55e",
          background: "#1f2937",
          color: "#ffffff",
        });
      }
    } else {
      Swal.fire({
        icon: "info",
        title: "Premium Time Travel",
        text: "Only Premium subscribers can influence the future menu timeline.",
        confirmButtonText: "Upgrade to Premium",
        confirmButtonColor: "#22c55e",
        showCancelButton: true,
        cancelButtonText: "Stay in Present",
        background: "#1f2937",
        color: "#ffffff",
      });
    }
  };

  const hasUserLikedMeal = (meal) => {
    return meal.likedBy?.includes(user?.email);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Timeline Unknown";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const categories = [
    "all",
    ...new Set(upcomingMeals.map((meal) => meal.category).filter(Boolean)),
  ];

  const filteredMeals = upcomingMeals.filter((meal) => {
    const matchesCategory =
      activeCategory === "all" || meal.category === activeCategory;
    const matchesSearch =
      !debouncedSearchQuery ||
      meal.title?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      meal.ingredients
        ?.toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase()) ||
      meal.distributorName
        ?.toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const clearSearch = () => {
    setSearchQuery("");
  };

  if (userLoading || mealsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-12">
            <div className="absolute inset-0 border-4 border-green-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-green-400 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-r-emerald-400 rounded-full animate-spin animate-reverse"></div>
            <div className="absolute inset-4 border-4 border-b-lime-400 rounded-full animate-spin"></div>
          </div>
          <p className="text-green-300 font-bold text-2xl animate-pulse">
            Accessing future timeline...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={sectionRef}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black relative overflow-hidden"
    >
      {/* Morphing SVG Background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-5"
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
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{ zIndex: 1 }}
      />

      {/* Hero Section */}
      <div
        ref={heroRef}
        className="relative z-10 min-h-screen flex items-center justify-center"
      >
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center bg-green-500/20 backdrop-blur-2xl text-green-300 px-8 py-4 rounded-full text-sm font-bold mb-12 border border-green-400/40">
            <Calendar size={20} className="mr-3 animate-pulse" />
            <span className="bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
              FUTURE CULINARY TIMELINE
            </span>
            <Sparkles
              size={20}
              className="ml-3 animate-spin"
              style={{ animationDuration: "3s" }}
            />
          </div>

          <h1
            ref={titleRef}
            className="text-7xl sm:text-8xl lg:text-9xl font-black leading-tight mb-12"
          >
            <span className="bg-gradient-to-r from-green-300 via-emerald-300 to-lime-300 bg-clip-text text-transparent">
              FUTURE
            </span>
            <br />
            <span className="text-white">FLAVORS</span>
          </h1>

          <p className="text-2xl text-green-200 max-w-4xl mx-auto mb-16 leading-relaxed font-light">
            Step into tomorrow's kitchen and influence the future of dining with
            your preferences
          </p>

          {/* Futuristic Search */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="relative bg-black/40 backdrop-blur-2xl rounded-2xl border border-green-500/40 overflow-hidden">
              <input
                type="text"
                placeholder="Search the future culinary database..."
                className="w-full px-10 py-8 bg-transparent text-white placeholder-green-300/60 text-xl focus:outline-none font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-3">
                {isSearching || isFetching ? (
                  <Loader2 className="text-green-400 animate-spin" size={28} />
                ) : searchQuery ? (
                  <button
                    onClick={clearSearch}
                    className="text-green-400 hover:text-white transition-colors"
                  >
                    <X size={28} />
                  </button>
                ) : (
                  <Search className="text-green-400" size={28} />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Category Navigation */}
          {/* <div className="flex justify-center mb-16">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl"></div>
              <div className="relative flex flex-wrap gap-4 bg-black/30 backdrop-blur-2xl rounded-2xl p-4 border border-green-500/30">
                {categories.map((category, index) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`group relative px-8 py-4 rounded-xl font-bold transition-all duration-500 transform hover:scale-105 ${
                      activeCategory === category
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-black shadow-2xl shadow-green-500/50"
                        : "text-green-300 hover:text-white hover:bg-green-500/20"
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="relative z-10">
                      {category.toUpperCase()}
                    </span>
                    {activeCategory === category && (
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl opacity-20 animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div> */}

          {/* Premium User Info */}
          {user &&
            !["Silver", "Gold", "Platinum"].includes(userType.subscription) && (
              <div className="max-w-3xl mx-auto bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl p-8 border border-green-400/40">
                <div className="flex items-center justify-center">
                  <Crown
                    size={28}
                    className="text-green-400 mr-4 animate-pulse"
                  />
                  <p className="text-green-200 text-center text-lg">
                    <span className="font-black text-green-400">
                      UPGRADE TO PREMIUM
                    </span>{" "}
                    to influence the future timeline and like upcoming culinary
                    creations!
                  </p>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Meals Grid */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <h2 className="text-6xl font-black text-white mb-8">
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              FUTURE MENU
            </span>{" "}
            PREVIEW
            {filteredMeals.length > 0 && (
              <span className="text-green-400 text-3xl font-normal ml-4">
                ({filteredMeals.length})
              </span>
            )}
          </h2>
          <p className="text-2xl text-green-200 max-w-3xl mx-auto">
            Experience tomorrow's culinary innovations before they arrive
          </p>
        </div>

        {isSearching && filteredMeals.length === 0 ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 size={60} className="text-green-400 animate-spin mr-6" />
            <p className="text-green-300 text-2xl font-bold">
              Scanning future timeline...
            </p>
          </div>
        ) : filteredMeals.length > 0 ? (
          <div className="meals-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredMeals.map((meal, index) => (
              <div
                key={meal._id || index}
                ref={(el) => (cardsRef.current[index] = el)}
                className="group relative bg-gradient-to-br from-black/60 to-green-900/30 backdrop-blur-xl rounded-3xl overflow-hidden border border-green-500/40 hover:border-green-400/80 transition-all duration-700"
                onMouseEnter={() => handleCardHover(index, true)}
                onMouseLeave={() => handleCardHover(index, false)}
                style={{ perspective: "1000px" }}
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

                  {/* Future Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-transparent to-transparent"></div>

                  {/* Future Badge */}
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-green-400 to-emerald-400 text-black text-sm px-4 py-2 rounded-full flex items-center font-black shadow-2xl">
                    <Calendar size={14} className="mr-2" />
                    <span>FUTURE</span>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-lime-500 text-black text-sm px-4 py-2 rounded-full font-bold shadow-2xl">
                    {meal.category || "UNKNOWN"}
                  </div>

                  {/* Time Indicator */}
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm p-3 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <Zap size={18} className="text-green-400" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-black text-white group-hover:text-green-400 transition-colors line-clamp-1">
                      {meal.title}
                    </h3>
                    {meal.rating && (
                      <div className="flex items-center bg-green-500/20 backdrop-blur-sm px-3 py-2 rounded-full ml-3">
                        <Star
                          size={18}
                          className="text-green-400 fill-green-400"
                        />
                        <span className="ml-2 text-sm font-bold text-green-300">
                          {meal.rating || meal.retting}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center text-green-300 text-sm mb-4">
                    <Clock size={16} className="mr-2" />
                    <span className="font-medium">
                      {formatDate(meal.postTime)}
                    </span>
                  </div>

                  <p className="text-green-200 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {meal.ingredients ? (
                      <span>
                        <span className="font-bold text-green-400">
                          Future Ingredients:
                        </span>{" "}
                        {meal.ingredients}
                      </span>
                    ) : (
                      "A revolutionary culinary creation from the future, designed to transcend current taste boundaries."
                    )}
                  </p>

                  <div className="flex items-center text-green-300 text-sm mb-8">
                    <span className="font-bold text-green-400">
                      Future Chef:
                    </span>
                    <span className="ml-2">
                      {meal.distributorName || "AI Master Chef"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      $
                      {typeof meal.price === "number"
                        ? meal.price.toFixed(2)
                        : meal.price}
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(meal)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-full text-sm transition-all duration-300 transform hover:scale-105 ${
                          hasUserLikedMeal(meal)
                            ? "bg-red-500/20 text-red-400 border border-red-400/40"
                            : "bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-400/40"
                        }`}
                        disabled={
                          !user ||
                          (!["Silver", "Gold", "Platinum"].includes(
                            userType.subscription
                          ) &&
                            !hasUserLikedMeal(meal))
                        }
                      >
                        <Heart
                          size={18}
                          className={
                            hasUserLikedMeal(meal) ? "fill-red-400" : ""
                          }
                        />
                        <span className="font-bold">{meal.likes || 0}</span>
                      </button>

                      <button
                        className="flex items-center gap-2 px-4 py-3 rounded-full text-sm bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all duration-300 border border-green-400/40 transform hover:scale-105"
                        onClick={() => {
                          Swal.fire({
                            title: meal.title,
                            html: `
                              <div class="text-left">
                                <p class="mb-4 text-gray-300">${
                                  meal.description ||
                                  "No description available from the future."
                                }</p>
                                <p class="text-sm text-green-400 mb-4 font-bold">Arriving from the future timeline!</p>
                                
                                <h3 class="font-bold mt-6 mb-3 text-green-400">Future Ingredients:</h3>
                                <p class="text-gray-300">${
                                  meal.ingredients ||
                                  "Ingredient data will be transmitted from the future."
                                }</p>
                                
                                <h3 class="font-bold mt-6 mb-3 text-green-400">Timeline Reviews:</h3>
                                <p class="text-gray-300">${
                                  meal.reviews?.length > 0
                                    ? `${meal.reviews.length} reviews from future diners`
                                    : "No reviews from the future yet."
                                }</p>
                              </div>
                            `,
                            imageUrl: meal.image,
                            imageHeight: 200,
                            imageAlt: meal.title,
                            confirmButtonColor: "#22c55e",
                            background: "#1f2937",
                            color: "#ffffff",
                          });
                        }}
                      >
                        <MessageSquare size={18} />
                        <span className="font-bold">
                          {meal.reviews?.length || 0}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quantum Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-emerald-500/0 to-green-500/0 group-hover:from-green-500/10 group-hover:via-emerald-500/10 group-hover:to-green-500/10 transition-all duration-700 pointer-events-none rounded-3xl"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-black/40 backdrop-blur-xl rounded-3xl border border-green-500/30">
            <Calendar size={80} className="mx-auto text-green-400/40 mb-8" />
            <h3 className="text-3xl font-black text-white mb-6">
              NO FUTURE MEALS DETECTED
            </h3>
            <p className="text-green-300 mb-12 text-xl">
              {debouncedSearchQuery
                ? `The future timeline doesn't contain "${debouncedSearchQuery}".`
                : "The future culinary database is currently empty. Check back for temporal updates!"}
            </p>
            {(debouncedSearchQuery || activeCategory !== "all") && (
              <button
                onClick={() => {
                  clearSearch();
                  setActiveCategory("all");
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black px-12 py-6 rounded-xl font-black text-xl transition-all duration-300 transform hover:scale-105"
              >
                RESET TIMELINE
              </button>
            )}
          </div>
        )}

        {/* Future Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 pt-16 border-t border-green-500/30">
          {[
            { number: "∞", label: "Future Possibilities", icon: Zap },
            { number: "2025+", label: "Timeline Year", icon: Calendar },
            { number: "100%", label: "Future Fresh", icon: Leaf },
            { number: "24/7", label: "Time Travel Kitchen", icon: Award },
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                <stat.icon size={28} className="text-green-400" />
              </div>
              <div className="text-5xl font-black text-green-400 mb-3 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-green-300 font-bold text-lg">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .animate-reverse {
          animation-direction: reverse;
        }
      `}</style>
    </div>
  );
}
