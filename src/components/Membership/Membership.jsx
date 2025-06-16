"use client";

import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAxiosPublic } from "../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import {
  Check,
  Star,
  Crown,
  Zap,
  Shield,
  Sparkles,
  Award,
  Heart,
  Cpu,
  Atom,
  Rocket,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function FuturisticMembership() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef([]);
  const trustIndicatorsRef = useRef([]);
  const threeContainerRef = useRef(null);
  const axiosPublic = useAxiosPublic();

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const res = await axiosPublic.get("/packages");
      return res.data;
    },
  });

  // Three.js Scene Setup
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

    // Create quantum membership rings
    const rings = [];
    for (let i = 0; i < 8; i++) {
      const ringGeometry = new THREE.RingGeometry(5 + i * 2, 5.5 + i * 2, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.3 + i * 0.02, 0.8, 0.4 + i * 0.05),
        transparent: true,
        opacity: 0.2 - i * 0.02,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.z = -20 - i * 3;
      ring.userData = {
        rotationSpeed: (i % 2 === 0 ? 1 : -1) * (0.005 + i * 0.002),
      };
      scene.add(ring);
      rings.push(ring);
    }

    camera.position.z = 20;

    const animate = () => {
      requestAnimationFrame(animate);
      rings.forEach((ring) => {
        ring.rotation.z += ring.userData.rotationSpeed;
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
            stagger: 0.02,
            scrollTrigger: {
              trigger: sectionRef.current,
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
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Cards quantum stagger animation
      gsap.fromTo(
        cardsRef.current,
        {
          y: 100,
          opacity: 0,
          scale: 0.8,
          rotationY: -15,
          filter: "blur(10px)",
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationY: 0,
          filter: "blur(0px)",
          duration: 1.2,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current[0],
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Trust indicators quantum animation
      gsap.fromTo(
        trustIndicatorsRef.current,
        {
          y: 30,
          opacity: 0,
          scale: 0.9,
          rotationY: -10,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: trustIndicatorsRef.current[0],
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Hover animations for cards
      cardsRef.current.forEach((card, index) => {
        if (card) {
          card.addEventListener("mouseenter", () => {
            gsap.to(card, {
              y: -20,
              scale: 1.05,
              rotationY: 5,
              boxShadow:
                "0 30px 60px rgba(34, 197, 94, 0.4), 0 0 40px rgba(34, 197, 94, 0.2)",
              duration: 0.4,
              ease: "power2.out",
            });
          });

          card.addEventListener("mouseleave", () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              rotationY: 0,
              boxShadow: "0 15px 40px rgba(0, 0, 0, 0.3)",
              duration: 0.4,
              ease: "power2.out",
            });
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [packages]);

  const planFeatures = {
    Silver: {
      icon: Shield,
      color: "from-gray-400 to-gray-600",
      bgColor: "from-gray-900/60 to-gray-800/60",
      label: "BASIC NEURAL",
      features: [
        "Basic quantum access",
        "Standard neural portions",
        "5 meals per cycle",
        "Basic AI support",
        "Mobile matrix access",
      ],
    },
    Gold: {
      icon: Star,
      color: "from-yellow-400 to-yellow-600",
      bgColor: "from-yellow-900/60 to-yellow-800/60",
      label: "PREMIUM NEURAL",
      features: [
        "Premium quantum access",
        "Enhanced neural portions",
        "10 meals per cycle",
        "Priority AI support",
        "Advanced matrix features",
        "Weekend quantum specials",
        "Neural nutrition guidance",
      ],
    },
    Diamond: {
      icon: Crown,
      color: "from-purple-400 to-purple-600",
      bgColor: "from-purple-900/60 to-purple-800/60",
      label: "QUANTUM ELITE",
      features: [
        "Unlimited quantum access",
        "Maximum neural portions",
        "Infinite meal cycles",
        "24/7 AI consciousness",
        "Elite matrix privileges",
        "All quantum specials",
        "Personal nutrition AI",
        "Custom meal algorithms",
        "Exclusive chef neural links",
      ],
    },
  };

  if (isLoading) {
    return (
      <section className="py-24 bg-gradient-to-br from-gray-900 via-green-900 to-black">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-32">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 border-4 border-green-400/30 rounded-full" />
              <div className="absolute inset-0 border-4 border-t-green-400 rounded-full animate-spin" />
              <div className="absolute inset-2 border-4 border-r-emerald-400 rounded-full animate-spin animate-reverse" />
              <div className="absolute inset-4 border-4 border-b-lime-400 rounded-full animate-spin" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Three.js Background */}
      <div
        ref={threeContainerRef}
        className="absolute inset-0 pointer-events-none opacity-0"
      />

      {/* Quantum Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-green-500/20 backdrop-blur-2xl text-green-300 px-8 py-4 rounded-full text-sm font-bold mb-8 border border-green-400/40">
            <Crown size={18} className="mr-2" />
            <span className="bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
              ACCESS PROTOCOLS
            </span>
            <Sparkles size={18} className="ml-2 animate-pulse" />
          </div>

          <h2
            ref={titleRef}
            className="text-6xl sm:text-7xl lg:text-8xl font-black mb-8 leading-tight"
          >
            <span className="bg-gradient-to-r from-green-300 via-emerald-300 to-lime-300 bg-clip-text text-transparent">
              NEURAL
            </span>
            <br />
            <span className="text-white">ACCESS</span>
            <br />
            <span className="bg-gradient-to-r from-emerald-300 via-green-300 to-lime-300 bg-clip-text text-transparent">
              MATRIX
            </span>
          </h2>

          <p
            ref={subtitleRef}
            className="text-xl sm:text-2xl text-green-200 max-w-4xl mx-auto leading-relaxed font-light"
          >
            Choose your neural access level to unlock premium dining experiences
            with our quantum-enhanced membership protocols designed for the
            future of student nutrition.
          </p>
        </div>

        {/* Quantum Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          {[
            { icon: Shield, text: "Quantum guarantee", color: "green" },
            { icon: Zap, text: "Instant neural activation", color: "blue" },
            { icon: Heart, text: "Cancel anytime", color: "red" },
            { icon: Award, text: "Premium matrix quality", color: "yellow" },
          ].map((indicator, index) => (
            <div
              key={index}
              ref={(el) => (trustIndicatorsRef.current[index] = el)}
              className="flex items-center bg-black/60 backdrop-blur-2xl px-6 py-4 rounded-2xl shadow-lg border border-green-400/40 hover:border-green-300/80 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center text-green-400 mr-4 border border-green-400/40">
                <indicator.icon size={20} />
              </div>
              <span className="font-bold text-green-300">{indicator.text}</span>
            </div>
          ))}
        </div>

        {/* Quantum Membership Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {packages.map((pkg, index) => {
            const planConfig =
              planFeatures[pkg.packageName] || planFeatures.Silver;
            const Icon = planConfig.icon;
            const isPopular = pkg.packageName === "Gold";

            return (
              <div
                key={pkg._id}
                ref={(el) => (cardsRef.current[index] = el)}
                className={`relative bg-gradient-to-br ${
                  planConfig.bgColor
                } backdrop-blur-2xl rounded-3xl overflow-hidden border-2 transition-all duration-500 group ${
                  isPopular
                    ? "border-green-400/80 scale-105"
                    : "border-green-400/40 hover:border-green-300/80"
                }`}
                style={{ perspective: "1000px" }}
              >
                {/* Quantum Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div
                      className="bg-gradient-to-r from-green-400 to-emerald-400 text-black px-8 py-3 rounded-full font-black text-sm shadow-xl border border-green-300"
                      style={{
                        boxShadow:
                          "0 0 30px rgba(34, 197, 94, 0.6), 0 0 60px rgba(34, 197, 94, 0.3)",
                      }}
                    >
                      <Star size={16} className="inline mr-2" />
                      MOST POPULAR
                    </div>
                  </div>
                )}

                {/* Quantum Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-transparent to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Card Header */}
                <div className="relative p-8 overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
                    <div className="w-full h-full bg-gradient-to-br from-green-400/30 to-transparent rounded-full transform translate-x-16 -translate-y-16" />
                  </div>

                  <div className="relative z-10">
                    <div
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${planConfig.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 border border-green-400/40`}
                    >
                      <Icon size={32} />
                    </div>

                    <h3 className="text-3xl font-black text-white mb-2">
                      {pkg.packageName}
                    </h3>
                    <p className="text-green-300 mb-6 font-bold">
                      {planConfig.label}
                    </p>

                    <div className="flex items-baseline mb-6">
                      <span className="text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        ${pkg.price}
                      </span>
                      <span className="text-green-300 ml-2 text-lg">
                        /cycle
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-8">
                  <div className="space-y-4 mb-8">
                    {planConfig.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mr-4 flex-shrink-0 border border-green-400/40">
                          <Check size={14} className="text-green-400" />
                        </div>
                        <span className="text-green-200 font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to={`/checkout/${pkg._id}`}
                    state={{ selectedPackage: pkg }}
                    className={`block w-full text-center py-4 px-6 rounded-2xl font-black text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden group/btn ${
                      isPopular
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black"
                        : "bg-gradient-to-r from-gray-800 to-gray-700 hover:from-green-500/20 hover:to-emerald-500/20 text-white border border-green-400/40"
                    }`}
                    style={{
                      boxShadow: isPopular
                        ? "0 0 30px rgba(34, 197, 94, 0.4), 0 0 60px rgba(34, 197, 94, 0.2)"
                        : "none",
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      <Rocket size={20} className="mr-2" />
                      ACCESS {pkg.packageName}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  </Link>
                </div>

                {/* Quantum Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-emerald-500/0 to-green-500/0 group-hover:from-green-500/10 group-hover:via-emerald-500/10 group-hover:to-green-500/10 transition-all duration-700 pointer-events-none rounded-3xl" />
              </div>
            );
          })}
        </div>

        {/* Quantum CTA */}
        <div className="text-center mt-20">
          <div className="bg-black/60 backdrop-blur-2xl rounded-3xl p-12 shadow-2xl border border-green-400/40 max-w-4xl mx-auto">
            <h3 className="text-3xl sm:text-4xl font-black mb-6 text-white">
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Neural queries
              </span>{" "}
              detected?
            </h3>
            <p className="text-xl text-green-200 mb-8 leading-relaxed">
              Our AI consciousness is here to help you choose the perfect neural
              access protocol for your dining matrix needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black px-8 py-4 rounded-2xl font-black text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                style={{
                  boxShadow:
                    "0 0 30px rgba(34, 197, 94, 0.4), 0 0 60px rgba(34, 197, 94, 0.2)",
                }}
              >
                <Cpu size={20} className="inline mr-2" />
                CONTACT AI SUPPORT
              </Link>
              <Link
                to="/faq"
                className="border-2 border-green-400 text-green-300 hover:bg-green-500/20 px-8 py-4 rounded-2xl font-black text-lg transition-all duration-300 transform hover:scale-105"
              >
                <Atom size={20} className="inline mr-2" />
                VIEW NEURAL FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
