"use client";

import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Slider({ searchQuery, setSearchQuery }) {
  const [, setIsMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchValue, setSearchValue] = useState(searchQuery || "");
  const [isTouching, setIsTouching] = useState(false);
  const [touchStart, setTouchStart] = useState(0);

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  const banners = [
    {
      title: "Streamline Hostel Life with Ease",
      description:
        "Efficient meal management, seamless reviews, and enhanced convenience.",
      image:
        "https://i.ibb.co.com/WGS22Sf/tbbteam-philippines-siargao-sinag-hostel.webp",
    },
    {
      title: "Administer Meals Like Never Before",
      description:
        "Manage menus, reviews, and student feedback with a few clicks.",
      image: "https://i.ibb.co.com/Pjxy4gj/p0c0tpbh-jpg.webp",
    },
    {
      title: "Tailored for Hostel Students",
      description: "Enjoy delicious meals and share your reviews effortlessly.",
      image:
        "https://i.ibb.co.com/9317Kk4/group-of-young-tourists-standing-in-youth-hostel-guest-house-happy-multiracial-friends.webp",
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Banner slider automation - pause during touch interactions
  useEffect(() => {
    if (isTouching) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length, isTouching]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  }, [banners.length]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (setSearchQuery && typeof setSearchQuery === "function") {
      setSearchQuery(searchValue);
    }
  };

  // Touch event handlers for swipe functionality
  const handleTouchStart = (e) => {
    setIsTouching(true);
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isTouching) return;

    const touchEnd = e.touches[0].clientX;
    const diff = touchStart - touchEnd;

    // Swipe threshold
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left, go to next slide
        nextSlide();
      } else {
        // Swipe right, go to previous slide
        prevSlide();
      }
      setIsTouching(false);
    }
  };

  const handleTouchEnd = () => {
    setIsTouching(false);
  };

  return (
    <div className="px-0 sm:px-4">
      <section
        className="relative bg-gray-50 h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute inset-0 overflow-hidden sm:rounded-lg">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <img
                src={banner.image || "/placeholder.svg"}
                alt={banner.title}
                className="object-cover w-full h-full"
                loading={index === 0 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 sm:bg-opacity-40"></div>
            </div>
          ))}
        </div>

        {/* Slider content */}
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`w-full transition-opacity duration-500 ${
                index === currentSlide
                  ? "opacity-100"
                  : "opacity-0 absolute pointer-events-none"
              }`}
            >
              <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 px-2 sm:px-6 md:px-10 leading-tight">
                {banner.title}
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white mb-4 sm:mb-6 md:mb-8 px-4 sm:px-10 md:px-16 max-w-3xl mx-auto">
                {banner.description}
              </p>
            </div>
          ))}

          {/* Search form */}
          <form
            onSubmit={handleSearch}
            className="flex w-[80%] max-w-xs sm:max-w-md mt-2 sm:mt-4 z-10"
          >
            <input
              type="text"
              placeholder="Search for meals..."
              className="flex-grow px-3 sm:px-4 py-2 sm:py-3 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-r-md flex items-center transition-colors"
            >
              <Search size={windowWidth < 640 ? 16 : 20} />
              <span className="ml-2 hidden sm:inline">Search</span>
            </button>
          </form>

          {/* Slider navigation dots */}
          <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 flex justify-center items-center">
            <div className="flex space-x-1 sm:space-x-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-green-500 w-4 sm:w-6"
                      : "bg-white bg-opacity-60 hover:bg-opacity-80"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Slider arrows - hidden on small mobile, visible on larger screens */}
          <div className="hidden sm:block">
            <button
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-1 sm:p-2 text-white transition-all hover:scale-110"
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              <ChevronLeft size={windowWidth < 640 ? 20 : 24} />
            </button>
            <button
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-1 sm:p-2 text-white transition-all hover:scale-110"
              onClick={nextSlide}
              aria-label="Next slide"
            >
              <ChevronRight size={windowWidth < 640 ? 20 : 24} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

Slider.propTypes = {
  searchQuery: PropTypes.string,
  setSearchQuery: PropTypes.func,
};
