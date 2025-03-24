import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Slider() {
  const [, setIsMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  // Banner slider automation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  }, [banners.length]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  return (
    <section className="relative bg-gray-50 h-[350px] sm:h-[400px] md:h-[500px]">
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
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
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
        ))}
      </div>

      {/* Slider content */}
      <div className="relative container  mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`w-full transition-opacity duration-500 ${
              index === currentSlide
                ? "opacity-100"
                : "opacity-0 absolute pointer-events-none"
            }`}
          >
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2 sm:mb-4">
              {banner.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white mb-4 sm:mb-8  px-2">
              {banner.description}
            </p>
          </div>
        ))}

        <div className="flex w-full max-w-xs sm:max-w-md mt-4">
          <input
            type="text"
            placeholder="Search for meals..."
            className="flex-grow px-3 sm:px-4 py-2 sm:py-3 rounded-l-md focus:outline-none text-sm sm:text-base"
          />
          <button className="bg-primary hover:bg-green-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-r-md flex items-center">
            <Search size={windowWidth < 640 ? 16 : 20} />
            <span className="ml-2 hidden sm:inline">Search</span>
          </button>
        </div>

        {/* Slider navigation */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center">
          <div className="flex space-x-1">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`slider-dot ${
                  index === currentSlide ? "active" : ""
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Slider arrows */}
        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 text-white"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 text-white"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
}

Slider.propTypes = {
  searchQuery: PropTypes.string,
  setSearchQuery: PropTypes.func,
};
