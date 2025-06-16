"use client";

import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAxiosPublic } from "../../Hooks/useAxiosPublic";
import {
  ArrowRight,
  Star,
  Heart,
  Clock,
  ChefHat,
  Sparkles,
  Leaf,
  Zap,
  Filter,
  Cpu,
  Atom,
  Rocket,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function FuturisticMealsByCategory() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [likedMeals, setLikedMeals] = useState(new Set());
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const categoriesRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const filterIconRef = useRef(null);
  const threeContainerRef = useRef(null);

  const { data: meals = [], isLoading } = useQuery({
    queryKey: ["meals", selectedCategory],
    queryFn: async () => {
      try {
        const response = await axiosPublic.get(
          `/meals/category/${selectedCategory}`
        );
        return response.data || [];
      } catch (error) {
        console.error("Error fetching meals:", error);
        throw new Error("Failed to fetch meals");
      }
    },
  });

  const categories = [
    {
      name: "All",
      icon: Atom,
      color: "from-green-500 to-emerald-500",
      label: "QUANTUM MATRIX",
    },
    {
      name: "Breakfast",
      icon: Sparkles,
      color: "from-yellow-500 to-orange-500",
      label: "DAWN PROTOCOL",
    },
    {
      name: "Lunch",
      icon: ChefHat,
      color: "from-blue-500 to-cyan-500",
      label: "MIDDAY NEXUS",
    },
    {
      name: "Dinner",
      icon: Zap,
      color: "from-purple-500 to-pink-500",
      label: "NIGHT FUSION",
    },
  ];

  // Three.js Scene for Background
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

    // Create floating geometric elements
    const geometries = [];
    for (let i = 0; i < 20; i++) {
      const geometry = new THREE.OctahedronGeometry(0.5 + Math.random() * 0.5);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.3 + Math.random() * 0.1, 0.8, 0.5),
        transparent: true,
        opacity: 0.3,
        wireframe: true,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30
      );
      mesh.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
          z: (Math.random() - 0.5) * 0.01,
        },
      };
      scene.add(mesh);
      geometries.push(mesh);
    }

    camera.position.z = 20;

    const animate = () => {
      requestAnimationFrame(animate);
      geometries.forEach((mesh) => {
        mesh.rotation.x += mesh.userData.rotationSpeed.x;
        mesh.rotation.y += mesh.userData.rotationSpeed.y;
        mesh.rotation.z += mesh.userData.rotationSpeed.z;
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
      if (threeContainerRef.current && renderer.domElement) {
        threeContainerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation with quantum effect
      if (titleRef.current) {
        const split = new SplitText(titleRef.current, { type: "chars,words" });

        gsap.fromTo(
          split.chars,
          {
            opacity: 0,
            y: 100,
            rotationX: -90,
            transformOrigin: "0% 50% -50",
            filter: "blur(10px)",
          },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            filter: "blur(0px)",
            duration: 1.5,
            ease: "back.out(1.7)",
            stagger: 0.03,
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Subtitle animation
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 50, filter: "blur(5px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: subtitleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Categories animation
      gsap.fromTo(
        categoriesRef.current?.children || [],
        {
          opacity: 0,
          y: 30,
          scale: 0.8,
          rotationY: -15,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationY: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: categoriesRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Filter icon quantum rotation
      gsap.to(filterIconRef.current, {
        rotation: 360,
        duration: 4,
        repeat: -1,
        ease: "none",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Cards animation when meals change
  useEffect(() => {
    if (cardsContainerRef.current?.children.length > 0) {
      gsap.fromTo(
        cardsContainerRef.current.children,
        {
          opacity: 0,
          y: 100,
          scale: 0.8,
          rotationY: -15,
          filter: "blur(10px)",
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationY: 0,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
        }
      );
    }
  }, [meals]);

  const handleCategoryChange = (category) => {
    const tl = gsap.timeline();

    tl.to(cardsContainerRef.current, {
      opacity: 0,
      scale: 0.9,
      filter: "blur(5px)",
      duration: 0.3,
      ease: "power2.in",
    })
      .call(() => setSelectedCategory(category))
      .to(cardsContainerRef.current, {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.5,
        ease: "back.out(1.7)",
        delay: 0.1,
      });
  };

  const handleCardHover = (index, isEntering) => {
    const card = cardsContainerRef.current?.children[index];
    if (!card) return;

    if (isEntering) {
      setHoveredCard(index);
      gsap.to(card, {
        y: -20,
        scale: 1.05,
        rotationY: 5,
        boxShadow:
          "0 30px 60px rgba(34, 197, 94, 0.4), 0 0 40px rgba(34, 197, 94, 0.2)",
        duration: 0.4,
        ease: "power2.out",
      });
    } else {
      setHoveredCard(null);
      gsap.to(card, {
        y: 0,
        scale: 1,
        rotationY: 0,
        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.3)",
        duration: 0.4,
        ease: "power2.out",
      });
    }
  };

  const toggleLike = (mealId) => {
    const newLikedMeals = new Set(likedMeals);
    if (newLikedMeals.has(mealId)) {
      newLikedMeals.delete(mealId);
    } else {
      newLikedMeals.add(mealId);
    }
    setLikedMeals(newLikedMeals);
  };

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-gradient-to-br from-gray-900 via-green-900 to-black relative overflow-hidden"
    >
      {/* Three.js Background */}
      <div
        ref={threeContainerRef}
        className="absolute inset-0 pointer-events-none opacity-0"
      />

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-green-500/20 backdrop-blur-2xl text-green-300 px-8 py-4 rounded-full text-sm font-bold mb-8 border border-green-400/40">
            <Filter ref={filterIconRef} size={18} className="mr-2" />
            <span className="bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
              QUANTUM CUISINE MATRIX
            </span>
            <Sparkles size={18} className="ml-2" />
          </div>

          <h2
            ref={titleRef}
            className="text-6xl sm:text-7xl lg:text-8xl font-black mb-8 leading-tight"
          >
            <span className="bg-gradient-to-r from-green-300 via-emerald-300 to-lime-300 bg-clip-text text-transparent">
              NEURAL
            </span>
            <br />
            <span className="text-white">FLAVORS</span>
          </h2>

          <p
            ref={subtitleRef}
            className="text-xl sm:text-2xl text-green-200 max-w-4xl mx-auto leading-relaxed font-light"
          >
            Experience AI-curated culinary masterpieces engineered for optimal
            nutrition and quantum taste enhancement in our futuristic dining
            ecosystem.
          </p>
        </div>

        {/* Quantum Category Navigation */}
        <div className="flex justify-center mb-16">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl" />
            <div
              ref={categoriesRef}
              className="relative flex flex-wrap gap-4 bg-black/60 backdrop-blur-2xl rounded-3xl p-6 border border-green-400/40"
            >
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.name}
                    onClick={() => handleCategoryChange(category.name)}
                    className={`group relative px-8 py-4 rounded-2xl font-bold transition-all duration-500 transform hover:scale-105 ${
                      selectedCategory === category.name
                        ? `bg-gradient-to-r ${category.color} text-black shadow-xl`
                        : "text-green-300 hover:text-white hover:bg-green-500/20 border border-green-400/40"
                    }`}
                    style={{
                      boxShadow:
                        selectedCategory === category.name
                          ? "0 0 30px rgba(34, 197, 94, 0.6), 0 0 60px rgba(34, 197, 94, 0.3)"
                          : "none",
                    }}
                  >
                    <Icon size={20} className="inline mr-2" />
                    <span className="relative z-10 hidden sm:inline">
                      {category.label}
                    </span>
                    <span className="relative z-10 sm:hidden">
                      {category.name}
                    </span>
                    {selectedCategory === category.name && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quantum Meals Display */}
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-32">
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 border-4 border-green-400/30 rounded-full" />
              <div className="absolute inset-0 border-4 border-t-green-400 rounded-full animate-spin" />
              <div className="absolute inset-2 border-4 border-r-emerald-400 rounded-full animate-spin animate-reverse" />
              <div className="absolute inset-4 border-4 border-b-lime-400 rounded-full animate-spin" />
            </div>
            <p className="text-green-300 font-bold text-2xl animate-pulse">
              Quantum processing culinary data matrix...
            </p>
          </div>
        ) : (
          <div
            ref={cardsContainerRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {meals.slice(0, 6).map((meal, index) => (
              <div
                key={meal._id}
                className="group relative bg-gradient-to-br from-black/80 to-green-900/40 backdrop-blur-xl rounded-3xl overflow-hidden border border-green-400/40 hover:border-green-300/80 transition-all duration-500"
                onMouseEnter={() => handleCardHover(index, true)}
                onMouseLeave={() => handleCardHover(index, false)}
                style={{ perspective: "1000px" }}
              >
                {/* Quantum Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-transparent to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={
                      meal.image ||
                      `https://images.unsplash.com/photo-${
                        1546069901 + index || "/placeholder.svg"
                      }-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80`
                    }
                    alt={meal.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Quantum Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-transparent to-transparent" />

                  {/* Quantum Badge */}
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-green-400 to-emerald-400 text-black text-sm px-4 py-2 rounded-full flex items-center font-black shadow-2xl">
                    <Cpu size={14} className="mr-2" />
                    <span>QUANTUM</span>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-lime-500 text-black text-sm px-4 py-2 rounded-full font-bold shadow-2xl">
                    {meal.category || "NEURAL"}
                  </div>

                  {/* Neural Indicator */}
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm p-3 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <Atom size={18} className="text-green-400" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-black text-white group-hover:text-green-400 transition-colors line-clamp-1">
                      {meal.title}
                    </h3>
                    {meal.rating && (
                      <div className="flex items-center bg-green-500/20 backdrop-blur-sm px-3 py-2 rounded-full ml-3 border border-green-400/40">
                        <Star
                          size={18}
                          className="text-green-400 fill-green-400"
                        />
                        <span className="ml-2 text-sm font-bold text-green-300">
                          {meal.rating || "4.9"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center text-green-300 text-sm mb-4">
                    <Clock size={16} className="mr-2" />
                    <span className="font-medium">
                      Neural Processing: 15-20 min
                    </span>
                  </div>

                  <p className="text-green-200 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {meal.ingredients ? (
                      <span>
                        <span className="font-bold text-green-400">
                          Quantum Ingredients:
                        </span>{" "}
                        {meal.ingredients}
                      </span>
                    ) : (
                      "A revolutionary culinary creation engineered with quantum flavor enhancement and neural nutrition optimization."
                    )}
                  </p>

                  <div className="flex items-center text-green-300 text-sm mb-8">
                    <span className="font-bold text-green-400">
                      Neural Chef:
                    </span>
                    <span className="ml-2">
                      {meal.distributorName || "AI Quantum Master"}
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
                        onClick={() => toggleLike(meal._id)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-full text-sm transition-all duration-300 transform hover:scale-105 ${
                          likedMeals.has(meal._id)
                            ? "bg-red-500/20 text-red-400 border border-red-400/40"
                            : "bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-400/40"
                        }`}
                      >
                        <Heart
                          size={18}
                          className={
                            likedMeals.has(meal._id) ? "fill-red-400" : ""
                          }
                        />
                        <span className="font-bold">{meal.likes || 0}</span>
                      </button>

                      <button
                        onClick={() => navigate(`/meals/${meal._id}`)}
                        className="flex items-center gap-2 px-4 py-3 rounded-full text-sm bg-gradient-to-r from-green-500 to-emerald-500 text-black hover:from-green-400 hover:to-emerald-400 transition-all duration-300 border border-green-400/40 transform hover:scale-105 font-bold"
                      >
                        <Rocket size={18} />
                        <span>ACCESS</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quantum Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-emerald-500/0 to-green-500/0 group-hover:from-green-500/20 group-hover:via-emerald-500/20 group-hover:to-green-500/20 transition-all duration-700 pointer-events-none rounded-3xl" />
              </div>
            ))}
          </div>
        )}

        {/* Quantum CTA Section */}
        <div className="text-center mt-20">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-2xl opacity-40 animate-pulse" />
            <Link
              to="/meals"
              className="relative inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black px-12 py-6 rounded-2xl text-xl font-black transition-all duration-300 transform hover:scale-105 group"
              style={{
                boxShadow:
                  "0 0 40px rgba(34, 197, 94, 0.6), 0 0 80px rgba(34, 197, 94, 0.3)",
              }}
            >
              <ChefHat size={28} className="mr-4" />
              EXPLORE QUANTUM MATRIX
              <ArrowRight
                size={28}
                className="ml-4 group-hover:translate-x-2 transition-transform"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
