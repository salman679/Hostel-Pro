"use client";

import { useEffect, useRef } from "react";
import {
  ArrowRight,
  Clock,
  Calendar,
  DollarSign,
  Users,
  Sparkles,
  Star,
  Award,
  Zap,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function FuturisticSpecialOffers() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const featuresRef = useRef(null);
  const buttonRef = useRef(null);
  const statsRef = useRef([]);
  const floatingElementsRef = useRef([]);
  const threeContainerRef = useRef(null);

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

    // Create quantum particles
    const particleCount = 100;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const geometry = new THREE.SphereGeometry(
        0.02 + Math.random() * 0.05,
        8,
        8
      );
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(
          0.3 + Math.random() * 0.1,
          0.8,
          0.5 + Math.random() * 0.3
        ),
        transparent: true,
        opacity: 0.6 + Math.random() * 0.4,
      });

      const particle = new THREE.Mesh(geometry, material);
      particle.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30
      );

      particle.userData = {
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        ),
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02,
        },
      };

      scene.add(particle);
      particles.push(particle);
    }

    camera.position.z = 20;

    const animate = () => {
      requestAnimationFrame(animate);

      particles.forEach((particle) => {
        particle.position.add(particle.userData.velocity);
        particle.rotation.x += particle.userData.rotationSpeed.x;
        particle.rotation.y += particle.userData.rotationSpeed.y;
        particle.rotation.z += particle.userData.rotationSpeed.z;

        // Boundary check
        if (Math.abs(particle.position.x) > 25)
          particle.userData.velocity.x *= -1;
        if (Math.abs(particle.position.y) > 15)
          particle.userData.velocity.y *= -1;
        if (Math.abs(particle.position.z) > 15)
          particle.userData.velocity.z *= -1;
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

      // Image animation with quantum materialization
      gsap.fromTo(
        imageRef.current,
        {
          x: -100,
          opacity: 0,
          rotationY: -15,
          scale: 0.8,
          filter: "blur(10px)",
        },
        {
          x: 0,
          opacity: 1,
          rotationY: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Content animation
      gsap.fromTo(
        contentRef.current,
        {
          x: 100,
          opacity: 0,
          filter: "blur(5px)",
        },
        {
          x: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.2,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Features quantum stagger animation
      gsap.fromTo(
        featuresRef.current?.children || [],
        {
          y: 30,
          opacity: 0,
          scale: 0.9,
          rotationY: -15,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Button quantum materialization
      gsap.fromTo(
        buttonRef.current,
        {
          y: 20,
          opacity: 0,
          scale: 0.9,
          filter: "blur(5px)",
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.8,
          delay: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Stats quantum animation
      gsap.fromTo(
        statsRef.current,
        {
          y: 30,
          opacity: 0,
          scale: 0.8,
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
            trigger: statsRef.current[0],
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Floating elements quantum animation
      floatingElementsRef.current.forEach((el, index) => {
        if (el) {
          gsap.to(el, {
            y: -30,
            duration: 3 + index * 0.5,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
            delay: index * 0.3,
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Three.js Background */}
      <div
        ref={threeContainerRef}
        className="absolute inset-0 pointer-events-none opacity-0"
      />

      {/* Quantum Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          ref={(el) => (floatingElementsRef.current[0] = el)}
          className="absolute top-20 left-10 w-32 h-32 bg-green-400/20 rounded-full blur-xl"
        />
        <div
          ref={(el) => (floatingElementsRef.current[1] = el)}
          className="absolute top-40 right-20 w-24 h-24 bg-emerald-400/30 rounded-full blur-xl"
        />
        <div
          ref={(el) => (floatingElementsRef.current[2] = el)}
          className="absolute bottom-32 left-1/4 w-20 h-20 bg-green-500/25 rounded-full blur-xl"
        />
        <div
          ref={(el) => (floatingElementsRef.current[3] = el)}
          className="absolute bottom-20 right-1/3 w-40 h-40 bg-emerald-400/15 rounded-full blur-xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-green-500/20 backdrop-blur-2xl text-green-300 px-8 py-4 rounded-full text-sm font-bold mb-8 border border-green-400/40">
            <DollarSign size={18} className="mr-2" />
            <span className="bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
              QUANTUM OFFER PROTOCOL
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
            <span className="text-white">FEAST</span>
            <br />
            <span className="bg-gradient-to-r from-emerald-300 via-green-300 to-lime-300 bg-clip-text text-transparent">
              MATRIX
            </span>
          </h2>

          <p
            ref={subtitleRef}
            className="text-xl sm:text-2xl text-green-200 max-w-4xl mx-auto leading-relaxed font-light"
          >
            Experience our revolutionary weekend quantum brunch protocol
            featuring AI-optimized nutrition, molecular gastronomy, and neural
            flavor enhancement technology.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-center max-w-7xl mx-auto">
          {/* Quantum Image Section */}
          <div className="w-full lg:w-1/2">
            <div
              ref={imageRef}
              className="relative group cursor-pointer"
              style={{ perspective: "1000px" }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900 to-green-900 border border-green-400/40">
                <img
                  src="https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Quantum Brunch Experience"
                  className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-transparent to-transparent" />

                {/* Quantum Badge */}
                <div className="absolute top-6 right-6 bg-gradient-to-r from-green-400 to-emerald-400 text-black px-6 py-3 rounded-full font-black text-lg shadow-xl border border-green-300">
                  <Award size={20} className="inline mr-2" />
                  SAVE 35%
                </div>

                {/* Neural Info */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-green-400/40">
                        <Users size={18} className="mr-2 text-green-400" />
                        <span className="font-bold">2-4 Neural Units</span>
                      </div>
                      <div className="flex items-center bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-green-400/40">
                        <Clock size={18} className="mr-2 text-green-400" />
                        <span className="font-bold">2 Hour Matrix</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantum Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-30 blur-2xl" />
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-gradient-to-br from-emerald-400 to-lime-500 rounded-full opacity-20 blur-2xl" />
            </div>
          </div>

          {/* Quantum Content Section */}
          <div className="w-full lg:w-1/2">
            <div ref={contentRef} className="space-y-10">
              {/* Main Content */}
              <div className="bg-black/60 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-green-400/40 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-400/20 to-transparent rounded-full -translate-y-20 translate-x-20" />

                <div className="relative z-10">
                  <h3 className="text-3xl sm:text-4xl font-black mb-6 text-white">
                    <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      Quantum Brunch
                    </span>{" "}
                    Protocol
                  </h3>

                  <p className="text-green-200 mb-10 text-lg leading-relaxed">
                    Immerse yourself in our revolutionary weekend neural feast
                    featuring molecular gastronomy, AI-optimized nutrition
                    matrices, and quantum flavor enhancement in a cyberpunk
                    dining atmosphere.
                  </p>

                  {/* Quantum Features Grid */}
                  <div
                    ref={featuresRef}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10"
                  >
                    {[
                      {
                        icon: Calendar,
                        title: "Weekend Protocol",
                        subtitle: "Sat & Sun Matrix",
                        color: "green",
                      },
                      {
                        icon: Clock,
                        title: "Neural Timing",
                        subtitle: "9 AM - 1 PM",
                        color: "blue",
                      },
                      {
                        icon: DollarSign,
                        title: "Quantum Price",
                        subtitle: "$19.99/unit",
                        color: "yellow",
                      },
                      {
                        icon: Users,
                        title: "Group Neural",
                        subtitle: "2-8 entities",
                        color: "purple",
                      },
                    ].map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center p-6 bg-gradient-to-r from-black/40 to-green-900/20 rounded-2xl hover:from-green-900/30 hover:to-emerald-900/20 transition-all duration-300 group border border-green-400/40"
                      >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center text-green-400 mr-4 group-hover:scale-110 transition-transform border border-green-400/40">
                          <feature.icon size={24} />
                        </div>
                        <div>
                          <div className="font-bold text-white text-lg">
                            {feature.title}
                          </div>
                          <div className="text-green-300">
                            {feature.subtitle}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quantum CTA Button */}
                  <button
                    ref={buttonRef}
                    className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black px-12 py-6 rounded-2xl text-xl font-black flex items-center justify-center sm:justify-start transition-all duration-300 shadow-xl group relative overflow-hidden"
                    style={{
                      boxShadow:
                        "0 0 40px rgba(34, 197, 94, 0.6), 0 0 80px rgba(34, 197, 94, 0.3)",
                    }}
                  >
                    <Zap size={24} className="mr-3" />
                    <span className="relative z-10">ACTIVATE PROTOCOL</span>
                    <ArrowRight
                      size={24}
                      className="ml-3 group-hover:translate-x-2 transition-transform relative z-10"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  </button>
                </div>
              </div>

              {/* Quantum Stats Cards */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  {
                    number: "500+",
                    label: "Neural Entities",
                    icon: Users,
                    color: "green",
                  },
                  {
                    number: "4.9",
                    label: "Quantum Rating",
                    icon: Star,
                    color: "yellow",
                  },
                  {
                    number: "25+",
                    label: "Matrix Items",
                    icon: Award,
                    color: "purple",
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    ref={(el) => (statsRef.current[index] = el)}
                    className="bg-black/60 backdrop-blur-2xl rounded-2xl p-6 text-center shadow-xl border border-green-400/40 hover:border-green-300/80 transition-all duration-300 hover:shadow-2xl group cursor-pointer"
                  >
                    <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform border border-green-400/40">
                      <stat.icon size={20} />
                    </div>
                    <div className="text-3xl font-black text-white mb-2 group-hover:scale-110 transition-transform">
                      {stat.number}
                    </div>
                    <div className="text-green-300 text-sm font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
