"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAxiosPublic } from "../../Hooks/useAxiosPublic";
import { ArrowRight, Star, ChevronRight } from "lucide-react";

export default function MealsByCategory() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const axiosPublic = useAxiosPublic();
  const [, setIsMobileMenuOpen] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const navigate = useNavigate();

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

  const handleTabChange = (category) => {
    setSelectedCategory(category);
    // Auto-scroll to meals section on mobile when changing category
    if (windowWidth < 768) {
      setTimeout(() => {
        document
          .getElementById("meals-grid")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  // All available categories
  const categories = ["All", "Breakfast", "Lunch", "Dinner"];

  // Categories to show initially on mobile (first 3)
  const visibleCategories =
    windowWidth < 640
      ? showAllCategories
        ? categories
        : categories.slice(0, 3)
      : categories;

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8" id="meals-grid">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
        Explore Our Meals
      </h2>
      <p className="text-gray-600 text-center mb-6 max-w-2xl mx-auto text-sm sm:text-base">
        Discover a variety of delicious meals prepared fresh daily
      </p>

      {/* Tabs - Responsive Design */}
      <div className="relative mb-8">
        {/* Desktop & Tablet Tabs */}
        <div className="hidden sm:flex justify-center items-center flex-wrap gap-2 mt-4">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 sm:px-6 py-2 rounded-full text-sm font-semibold transition-all ease-in-out duration-300 ${
                selectedCategory === category
                  ? "bg-green-500 text-white shadow-md scale-105 hover:bg-green-600"
                  : "bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600"
              }`}
              onClick={() => handleTabChange(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Mobile Tabs - Scrollable */}
        <div className="sm:hidden">
          <div className="flex overflow-x-auto pb-2 hide-scrollbar gap-2 justify-center">
            {visibleCategories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all ease-in-out duration-300 ${
                  selectedCategory === category
                    ? "bg-green-500 text-white shadow-md scale-105"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => handleTabChange(category)}
              >
                {category}
              </button>
            ))}

            {/* Show more button on mobile - not needed since we only have 4 categories */}
            {windowWidth < 640 &&
              categories.length > 3 &&
              !showAllCategories && (
                <button
                  className="px-3 py-2 rounded-full text-sm font-medium bg-gray-50 text-gray-600 flex items-center whitespace-nowrap flex-shrink-0"
                  onClick={() => setShowAllCategories(true)}
                >
                  More <ChevronRight size={14} className="ml-1" />
                </button>
              )}
          </div>
        </div>
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        ) : (
          <>
            {meals?.length > 0 ? (
              meals.slice(0, 6).map((meal) => (
                <div
                  key={meal._id}
                  className="card shadow-sm hover:shadow-md transition-all ease-in-out duration-300 bg-white rounded-lg border border-gray-100 hover:border-gray-200 overflow-hidden h-full flex flex-col"
                >
                  <div className="relative w-full h-40 sm:h-48 lg:h-56">
                    <img
                      src={meal.image || "/placeholder.svg"}
                      alt={meal.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      {meal.category || selectedCategory !== "All"
                        ? selectedCategory
                        : "Featured"}
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-base sm:text-lg font-medium line-clamp-1">
                        {meal.title}
                      </h3>
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded ml-2 flex-shrink-0">
                        <Star
                          size={windowWidth < 640 ? 14 : 16}
                          className="text-yellow-500 fill-yellow-500"
                        />
                        <span className="ml-1 text-xs sm:text-sm font-medium">
                          {meal.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2 text-xs sm:text-sm flex-grow">
                      {meal.description}
                    </p>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-sm sm:text-base font-bold text-green-500">
                        $
                        {typeof meal.price === "number"
                          ? meal.price.toFixed(2)
                          : meal.price}
                      </span>
                      <button
                        onClick={() => navigate(`/meals/${meal._id}`)}
                        className="bg-green-500 hover:bg-green-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs flex items-center"
                        aria-label={`Order ${meal.title}`}
                      >
                        Order Now
                        <ArrowRight
                          size={windowWidth < 640 ? 12 : 14}
                          className="ml-1"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-1">
                  No meals found
                </h3>
                <p className="text-gray-500 text-sm">
                  No meals found for &quot;{selectedCategory}&quot;.
                </p>
                <button
                  onClick={() => handleTabChange("All")}
                  className="mt-4 text-green-500 hover:text-green-600 font-medium text-sm"
                >
                  View all meals
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* View All Button */}
      {meals?.length > 0 && (
        <div className="text-center mt-6 sm:mt-10">
          <Link
            to="/meals"
            className="inline-block bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md text-sm"
          >
            View All Meals
          </Link>
        </div>
      )}
    </section>
  );
}
