"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAxiosPublic } from "../../Hooks/useAxiosPublic";
import {
  ArrowLeft,
  Star,
  Clock,
  Users,
  ChefHat,
  Heart,
  Share2,
  Plus,
  Minus,
  ShoppingCart,
  Award,
  Leaf,
  Zap,
  Shield,
  Sparkles,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function ModernMealDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("Regular");
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  // Refs for animations
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const priceRef = useRef(null);
  const tabsRef = useRef(null);
  const detailsRef = useRef(null);
  const reviewsRef = useRef([]);
  const threeContainerRef = useRef(null);

  // Three.js refs
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const particlesRef = useRef([]);

  const {
    data: meal,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["meal", id],
    queryFn: async () => {
      const response = await axiosPublic.get(`/meals/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  // Three.js Scene Setup
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

    // Create floating food particles
    const particleCount = 50;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const geometry = new THREE.SphereGeometry(
        0.02 + Math.random() * 0.08,
        8,
        8
      );
      const hue = 0.1 + Math.random() * 0.3; // Orange to green spectrum for food
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(hue, 0.7, 0.5 + Math.random() * 0.3),
        transparent: true,
        opacity: 0.3 + Math.random() * 0.4,
      });

      const particle = new THREE.Mesh(geometry, material);
      particle.position.set(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50
      );

      particle.userData = {
        originalPosition: particle.position.clone(),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.005
        ),
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
          z: (Math.random() - 0.5) * 0.01,
        },
        floatAmplitude: 0.5 + Math.random() * 1,
        floatSpeed: 0.003 + Math.random() * 0.007,
        time: Math.random() * Math.PI * 2,
      };

      scene.add(particle);
      particles.push(particle);
    }
    particlesRef.current = particles;

    camera.position.set(0, 0, 20);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      particles.forEach((particle) => {
        particle.userData.time += particle.userData.floatSpeed;

        // Floating motion
        particle.position.y += Math.sin(particle.userData.time) * 0.005;
        particle.position.x += Math.cos(particle.userData.time * 0.7) * 0.003;

        // Gentle drift
        particle.position.add(particle.userData.velocity);

        // Rotation
        particle.rotation.x += particle.userData.rotationSpeed.x;
        particle.rotation.y += particle.userData.rotationSpeed.y;
        particle.rotation.z += particle.userData.rotationSpeed.z;

        // Boundary check
        if (Math.abs(particle.position.x) > 50)
          particle.userData.velocity.x *= -1;
        if (Math.abs(particle.position.y) > 25)
          particle.userData.velocity.y *= -1;
        if (Math.abs(particle.position.z) > 25)
          particle.userData.velocity.z *= -1;
      });

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
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (!meal) return;

    const ctx = gsap.context(() => {
      // Hero section animation
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );

      // Image animation with 3D effect
      gsap.fromTo(
        imageRef.current,
        {
          opacity: 0,
          scale: 0.8,
          rotationY: -15,
        },
        {
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 1.2,
          ease: "power3.out",
          delay: 0.3,
        }
      );

      // Content animation
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 1, ease: "power3.out", delay: 0.5 }
      );

      // Title animation with split text
      if (titleRef.current) {
        const split = new SplitText(titleRef.current, { type: "chars,words" });

        gsap.fromTo(
          split.chars,
          {
            opacity: 0,
            y: 50,
            rotationX: -90,
            transformOrigin: "0% 50% -50",
          },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 1,
            ease: "back.out(1.7)",
            stagger: 0.02,
            delay: 0.7,
          }
        );
      }

      // Price animation
      gsap.fromTo(
        priceRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)", delay: 1 }
      );

      // Tabs animation
      gsap.fromTo(
        tabsRef.current?.children || [],
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          delay: 1.2,
        }
      );

      // Details animation
      gsap.fromTo(
        detailsRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 1.4 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [meal]);

  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log("Added to cart:", { meal, quantity, selectedSize });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: meal?.title,
        text: meal?.description,
        url: window.location.href,
      });
    }
  };

  const sizes = [
    { name: "Regular", price: 0, description: "Standard portion" },
    { name: "Large", price: 3, description: "25% more food" },
    { name: "Extra Large", price: 6, description: "50% more food" },
  ];

  const tabs = [
    { id: "description", label: "Description", icon: ChefHat },
    { id: "nutrition", label: "Nutrition", icon: Leaf },
    { id: "reviews", label: "Reviews", icon: Star },
  ];

  const mockReviews = [
    {
      id: 1,
      name: "Alex Johnson",
      rating: 5,
      comment:
        "Absolutely delicious! The flavors are incredible and the portion size is perfect.",
      date: "2 days ago",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80",
    },
    {
      id: 2,
      name: "Sarah Chen",
      rating: 5,
      comment:
        "This has become my go-to meal. Fresh ingredients and amazing taste every time!",
      date: "1 week ago",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80",
    },
    {
      id: 3,
      name: "Mike Rodriguez",
      rating: 4,
      comment:
        "Great meal with excellent presentation. Delivery was quick and food was still hot.",
      date: "2 weeks ago",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-32 h-32 mb-8 mx-auto">
            <div className="absolute inset-0 border-4 border-green-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-t-green-500 rounded-full animate-spin" />
            <div className="absolute inset-2 border-4 border-r-emerald-500 rounded-full animate-spin animate-reverse" />
          </div>
          <p className="text-green-600 font-bold text-2xl animate-pulse">
            Loading culinary masterpiece...
          </p>
        </div>
      </div>
    );
  }

  if (error || !meal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-8">🍽️</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Meal Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The meal you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/meals")}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
          >
            Browse All Meals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 relative"
    >
      {/* Three.js Background */}
      <div
        ref={threeContainerRef}
        className="fixed inset-0 pointer-events-none z-0"
      />

      {/* Back Button */}
      <div className="relative z-10 p-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-green-600 px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl group"
        >
          <ArrowLeft
            size={20}
            className="mr-2 group-hover:-translate-x-1 transition-transform"
          />
          Back to Meals
        </button>
      </div>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative z-10 container mx-auto px-4 pb-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Image Section */}
          <div className="relative">
            <div
              ref={imageRef}
              className="relative group"
              style={{ perspective: "1000px" }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800">
                <img
                  src={
                    meal.image ||
                    `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80` ||
                    "/placeholder.svg"
                  }
                  alt={meal.title}
                  className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Floating Badges */}
                <div className="absolute top-6 right-6 space-y-3">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-xl">
                    <Award size={16} className="inline mr-2" />
                    Premium
                  </div>
                  {meal.isVegetarian && (
                    <div className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-xl">
                      <Leaf size={16} className="inline mr-2" />
                      Vegetarian
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-6 left-6 space-y-3">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                      isLiked
                        ? "bg-red-500 text-white scale-110"
                        : "bg-white/80 text-gray-600 hover:bg-white hover:scale-110"
                    }`}
                  >
                    <Heart
                      size={20}
                      className={isLiked ? "fill-current" : ""}
                    />
                  </button>

                  <button
                    onClick={handleShare}
                    className="w-14 h-14 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-green-600 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xl"
                  >
                    <Share2 size={20} />
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <Clock size={18} className="mr-2" />
                        <span className="font-bold">15-20 min</span>
                      </div>
                      <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <Users size={18} className="mr-2" />
                        <span className="font-bold">Serves 1-2</span>
                      </div>
                    </div>
                    <div className="flex items-center bg-yellow-500/90 px-4 py-2 rounded-full">
                      <Star size={18} className="mr-2 fill-current" />
                      <span className="font-bold">
                        {meal.rating?.toFixed(1) || "4.9"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 blur-2xl" />
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-20 blur-2xl" />
            </div>
          </div>

          {/* Content Section */}
          <div ref={contentRef} className="space-y-8">
            <div>
              <h1
                ref={titleRef}
                className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 bg-clip-text text-transparent leading-tight"
              >
                {meal.title}
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                {meal.description ||
                  "A carefully crafted culinary experience that combines premium ingredients with innovative cooking techniques to deliver an unforgettable dining experience."}
              </p>

              {/* Price Section */}
              <div
                ref={priceRef}
                className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-green-100 mb-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      $
                      {(
                        (typeof meal.price === "number"
                          ? meal.price
                          : Number.parseFloat(meal.price)) +
                        (sizes.find((s) => s.name === selectedSize)?.price || 0)
                      ).toFixed(2)}
                    </span>
                    <span className="text-gray-500 text-lg ml-2">
                      per serving
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield size={20} className="text-green-600" />
                    <span className="text-green-600 font-bold">
                      Quality Guaranteed
                    </span>
                  </div>
                </div>

                {/* Size Selection */}
                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-4">Choose Size:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {sizes.map((size) => (
                      <button
                        key={size.name}
                        onClick={() => setSelectedSize(size.name)}
                        className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                          selectedSize === size.name
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 hover:border-green-300 text-gray-700"
                        }`}
                      >
                        <div className="font-bold">{size.name}</div>
                        <div className="text-sm opacity-75">
                          {size.description}
                        </div>
                        {size.price > 0 && (
                          <div className="text-sm font-bold">
                            +${size.price}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity and Add to Cart */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center bg-gray-100 rounded-2xl p-2">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="w-12 h-12 rounded-xl bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600 hover:text-green-600 transition-all duration-300"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="mx-6 text-2xl font-bold text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="w-12 h-12 rounded-xl bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600 hover:text-green-600 transition-all duration-300"
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl group"
                  >
                    <ShoppingCart size={24} className="mr-3" />
                    Add to Cart
                    <Zap
                      size={24}
                      className="ml-3 group-hover:rotate-12 transition-transform"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="relative z-10 container mx-auto px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div ref={tabsRef} className="flex justify-center mb-12">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-3 shadow-xl border border-green-100">
              <div className="flex space-x-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center px-8 py-4 rounded-2xl font-bold transition-all duration-300 ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                          : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                      }`}
                    >
                      <Icon size={20} className="mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div
            ref={detailsRef}
            className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-green-100"
          >
            {activeTab === "description" && (
              <div className="space-y-8">
                <h3 className="text-3xl font-black text-gray-900 mb-6">
                  About This Meal
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  {meal.description ||
                    "This exceptional dish represents the perfect harmony of flavors, textures, and nutritional value. Our expert chefs have carefully selected premium ingredients and employed time-tested cooking techniques to create a meal that not only satisfies your hunger but also delights your senses."}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h4 className="text-2xl font-bold text-gray-900">
                      Key Features
                    </h4>
                    <ul className="space-y-4">
                      {[
                        "Premium quality ingredients",
                        "Expertly crafted by professional chefs",
                        "Balanced nutritional profile",
                        "Fresh preparation daily",
                        "Sustainable sourcing practices",
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-4">
                            <Sparkles size={14} className="text-green-600" />
                          </div>
                          <span className="text-gray-700 font-medium">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-2xl font-bold text-gray-900">
                      Preparation Details
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl">
                        <span className="font-bold text-gray-700">
                          Prep Time
                        </span>
                        <span className="text-green-600 font-bold">
                          10 minutes
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
                        <span className="font-bold text-gray-700">
                          Cook Time
                        </span>
                        <span className="text-blue-600 font-bold">
                          15 minutes
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl">
                        <span className="font-bold text-gray-700">
                          Difficulty
                        </span>
                        <span className="text-purple-600 font-bold">
                          Professional
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "nutrition" && (
              <div className="space-y-8">
                <h3 className="text-3xl font-black text-gray-900 mb-6">
                  Nutritional Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    {
                      label: "Calories",
                      value: "450",
                      unit: "kcal",
                      color: "red",
                    },
                    { label: "Protein", value: "25", unit: "g", color: "blue" },
                    { label: "Carbs", value: "35", unit: "g", color: "yellow" },
                    { label: "Fat", value: "18", unit: "g", color: "green" },
                  ].map((nutrient, index) => (
                    <div
                      key={index}
                      className={`text-center p-6 bg-${nutrient.color}-50 rounded-2xl border border-${nutrient.color}-100`}
                    >
                      <div
                        className={`text-4xl font-black text-${nutrient.color}-600 mb-2`}
                      >
                        {nutrient.value}
                        <span className="text-lg">{nutrient.unit}</span>
                      </div>
                      <div className="text-gray-700 font-bold">
                        {nutrient.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">
                    Health Benefits
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Rich in essential vitamins and minerals",
                      "High-quality protein for muscle health",
                      "Complex carbohydrates for sustained energy",
                      "Healthy fats for brain function",
                      "Antioxidants for immune support",
                      "Fiber for digestive health",
                    ].map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <Leaf size={16} className="text-green-600 mr-3" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-black text-gray-900">
                    Customer Reviews
                  </h3>
                  <div className="flex items-center bg-yellow-50 px-6 py-3 rounded-2xl">
                    <Star
                      size={24}
                      className="text-yellow-500 fill-yellow-500 mr-2"
                    />
                    <span className="text-2xl font-black text-gray-900">
                      {meal.rating?.toFixed(1) || "4.9"}
                    </span>
                    <span className="text-gray-600 ml-2">
                      ({mockReviews.length} reviews)
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  {mockReviews.map((review, index) => (
                    <div
                      key={review.id}
                      ref={(el) => (reviewsRef.current[index] = el)}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 hover:border-green-200 transition-all duration-300"
                    >
                      <div className="flex items-start space-x-4">
                        <img
                          src={review.avatar || "/placeholder.svg"}
                          alt={review.name}
                          className="w-16 h-16 rounded-full object-cover shadow-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h5 className="font-bold text-gray-900 text-lg">
                                {review.name}
                              </h5>
                              <p className="text-gray-500 text-sm">
                                {review.date}
                              </p>
                            </div>
                            <div className="flex items-center">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={18}
                                  className="text-yellow-500 fill-yellow-500"
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    Write a Review
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
