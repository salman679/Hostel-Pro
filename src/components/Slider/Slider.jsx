import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
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

  // Clear search
  const clearSearch = () => {
    setSearchValue("");
    if (setSearchQuery && typeof setSearchQuery === "function") {
      setSearchQuery("");
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
    <section
      className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Slides */}
      <div className="absolute inset-0 overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <img
              src={banner.image || "/placeholder.svg"}
              alt={banner.title}
              className="object-cover w-full h-full transform scale-105 transition-transform duration-10000 ease-out"
              style={{
                transform: index === currentSlide ? "scale(1.05)" : "scale(1)",
                transition: "transform 6s ease-out",
              }}
              loading={index === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`w-full transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-8 absolute pointer-events-none"
            }`}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 px-2 sm:px-6 md:px-10 leading-tight">
              {banner.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-10 px-4 sm:px-10 md:px-16 max-w-4xl mx-auto">
              {banner.description}
            </p>
          </div>
        ))}

        {/* Search form */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-md mt-2 sm:mt-4 z-10 relative"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search for meals..."
              className="w-full px-5 py-3 pl-12 pr-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70"
              size={20}
            />

            {searchValue && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-14 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            )}

            <button
              type="submit"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors"
            >
              <Search size={20} />
            </button>
          </div>
        </form>

        {/* Slider navigation dots */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center">
          <div className="flex space-x-2 sm:space-x-3">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide
                    ? "w-10 h-2 bg-green-500"
                    : "w-2 h-2 bg-white/60 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Slider arrows */}
        <button
          className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full p-2 sm:p-3 text-white transition-all hover:scale-110"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <ChevronLeft size={windowWidth < 640 ? 20 : 24} />
        </button>
        <button
          className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full p-2 sm:p-3 text-white transition-all hover:scale-110"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <ChevronRight size={windowWidth < 640 ? 20 : 24} />
        </button>
      </div>
    </section>
  );
}

Slider.propTypes = {
  searchQuery: PropTypes.string,
  setSearchQuery: PropTypes.func,
};
