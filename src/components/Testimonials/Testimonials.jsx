"use client";

import { useEffect, useRef, useState } from "react";
import {
  Star,
  Quote,
  ArrowLeft,
  ArrowRight,
  Users,
  Award,
  Heart,
  Sparkles,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function ModernTestimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const slidesRef = useRef([]);
  const dotsRef = useRef([]);
  const statsRef = useRef([]);
  const autoPlayRef = useRef(null);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Computer Science Student",
      university: "MIT",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "Hostel Pro has completely transformed my dining experience! The food quality is exceptional, and the convenience of having meals delivered right to my dorm is incredible. I've saved so much time and money.",
      highlight: "Exceptional food quality and convenience",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Engineering Student",
      university: "Stanford",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "As an international student, finding good food was always a challenge. Hostel Pro not only provides delicious meals but also offers dishes from my home country. It feels like home away from home!",
      highlight: "Feels like home away from home",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Medical Student",
      university: "Harvard",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "The nutritional balance and variety in Hostel Pro's meals have been perfect for my busy medical school schedule. The app makes ordering so easy, and the delivery is always on time.",
      highlight: "Perfect nutritional balance for busy schedules",
    },
    {
      id: 4,
      name: "David Kim",
      role: "Business Student",
      university: "Wharton",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "The Gold membership has been worth every penny! The portion sizes are generous, and the weekend specials are amazing. Plus, the customer service team is incredibly responsive and helpful.",
      highlight: "Gold membership worth every penny",
    },
    {
      id: 5,
      name: "Lisa Thompson",
      role: "Art Student",
      university: "RISD",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "I love how Hostel Pro caters to different dietary preferences. As a vegetarian, I always have plenty of delicious options. The presentation of the food is also Instagram-worthy!",
      highlight: "Great vegetarian options with beautiful presentation",
    },
  ];

  const stats = [
    { number: "15,000+", label: "Happy Students", icon: Users, color: "green" },
    { number: "4.9/5", label: "Average Rating", icon: Star, color: "yellow" },
    { number: "98%", label: "Satisfaction Rate", icon: Heart, color: "red" },
    { number: "50+", label: "Universities", icon: Award, color: "blue" },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, testimonials.length]);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation with split text
      if (titleRef.current) {
        const split = new SplitText(titleRef.current, { type: "chars,words" });

        gsap.fromTo(
          split.chars,
          {
            opacity: 0,
            y: 100,
            rotationX: -90,
            transformOrigin: "0% 50% -50",
          },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 1.2,
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
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Stats animation
      gsap.fromTo(
        statsRef.current,
        {
          y: 30,
          opacity: 0,
          scale: 0.8,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Slide transition animation
  useEffect(() => {
    if (slidesRef.current[currentSlide]) {
      gsap.fromTo(
        slidesRef.current[currentSlide],
        {
          opacity: 0,
          scale: 0.9,
          y: 50,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        }
      );
    }

    // Animate dots
    dotsRef.current.forEach((dot, index) => {
      if (dot) {
        gsap.to(dot, {
          scale: index === currentSlide ? 1.2 : 1,
          backgroundColor: index === currentSlide ? "#22c55e" : "#d1d5db",
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-6 py-3 rounded-full text-sm font-bold mb-8 shadow-lg">
            <Quote size={18} className="mr-2" />
            Student Testimonials
            <Sparkles size={18} className="ml-2 animate-pulse" />
          </div>

          <h2
            ref={titleRef}
            className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8 bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 bg-clip-text text-transparent leading-tight"
          >
            What Students Say
          </h2>

          <p
            ref={subtitleRef}
            className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Discover why thousands of students across top universities trust
            Hostel Pro for their daily dining needs.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              ref={(el) => (statsRef.current[index] = el)}
              className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-xl group cursor-pointer"
            >
              <div
                className={`w-16 h-16 mx-auto mb-4 bg-${stat.color}-100 rounded-2xl flex items-center justify-center text-${stat.color}-600 group-hover:scale-110 transition-transform`}
              >
                <stat.icon size={24} />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-gray-900 mb-2 group-hover:scale-110 transition-transform">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Slider */}
        <div className="relative max-w-6xl mx-auto">
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-green-100 overflow-hidden">
            {/* Current Testimonial */}
            <div className="p-12 lg:p-16">
              <div
                key={currentSlide}
                ref={(el) => (slidesRef.current[currentSlide] = el)}
                className="flex flex-col lg:flex-row items-center gap-12"
              >
                {/* User Image and Info */}
                <div className="flex-shrink-0 text-center lg:text-left">
                  <div className="relative inline-block mb-6">
                    <img
                      src={
                        testimonials[currentSlide].image || "/placeholder.svg"
                      }
                      alt={testimonials[currentSlide].name}
                      className="w-32 h-32 rounded-full object-cover shadow-xl border-4 border-white"
                    />
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <Quote size={20} className="text-white" />
                    </div>
                  </div>

                  <h4 className="text-2xl font-black text-gray-900 mb-2">
                    {testimonials[currentSlide].name}
                  </h4>
                  <p className="text-green-600 font-bold mb-1">
                    {testimonials[currentSlide].role}
                  </p>
                  <p className="text-gray-500 font-medium">
                    {testimonials[currentSlide].university}
                  </p>

                  {/* Rating */}
                  <div className="flex justify-center lg:justify-start mt-4">
                    {[...Array(testimonials[currentSlide].rating)].map(
                      (_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className="text-yellow-500 fill-yellow-500"
                        />
                      )
                    )}
                  </div>
                </div>

                {/* Testimonial Content */}
                <div className="flex-1">
                  <div className="relative">
                    <Quote
                      size={48}
                      className="text-green-200 absolute -top-4 -left-4"
                    />
                    <blockquote className="text-xl lg:text-2xl text-gray-700 leading-relaxed mb-6 relative z-10">
                      {testimonials[currentSlide].text}
                    </blockquote>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                    <p className="text-green-700 font-bold text-lg">
                      "{testimonials[currentSlide].highlight}"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/90 hover:bg-white rounded-full shadow-xl flex items-center justify-center text-gray-600 hover:text-green-600 transition-all duration-300 hover:scale-110 group"
            >
              <ArrowLeft
                size={24}
                className="group-hover:-translate-x-1 transition-transform"
              />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/90 hover:bg-white rounded-full shadow-xl flex items-center justify-center text-gray-600 hover:text-green-600 transition-all duration-300 hover:scale-110 group"
            >
              <ArrowRight
                size={24}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center mt-8 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                ref={(el) => (dotsRef.current[index] = el)}
                onClick={() => goToSlide(index)}
                className="w-4 h-4 rounded-full bg-gray-300 hover:bg-green-400 transition-all duration-300 transform hover:scale-125"
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentSlide + 1) / testimonials.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-green-100 max-w-4xl mx-auto">
            <h3 className="text-3xl sm:text-4xl font-black mb-6 text-gray-900">
              Ready to join thousands of satisfied students?
            </h3>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Start your premium dining experience today and discover why
              students love Hostel Pro.
            </p>
            <button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-12 py-6 rounded-2xl text-xl font-black transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl group">
              <Users size={24} className="inline mr-3" />
              Join the Community
              <Sparkles
                size={24}
                className="inline ml-3 group-hover:rotate-12 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
