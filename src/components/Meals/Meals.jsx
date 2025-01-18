import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Rating from "react-rating-stars-component";
import axios from "axios";

const MealsByCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  // Fetch meals using TanStack Query
  const fetchMeals = async (category) => {
    const { data } = await axios.get(`/meals?category=${category}`);
    return data;
  };

  const {
    data: meals = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["meals", selectedCategory],
    queryFn: () => fetchMeals(selectedCategory),
  });

  const handleTabChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="p-8">
      {/* Tabs */}
      <div className="tabs">
        {["All", "Breakfast", "Lunch", "Dinner"].map((category) => (
          <a
            key={category}
            className={`tab tab-lifted ${
              selectedCategory === category ? "tab-active" : ""
            }`}
            onClick={() => handleTabChange(category)}
          >
            {category}
          </a>
        ))}
      </div>

      {/* Loading/Error Handling */}
      {isLoading && <div className="text-center my-4">Loading meals...</div>}
      {isError && (
        <div className="text-center my-4 text-red-500">
          Failed to load meals!
        </div>
      )}

      {/* Meal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {meals?.map((meal) => (
          <div key={meal._id} className="card shadow-xl">
            <figure>
              <img src={meal.image} alt={meal.title} className="rounded-xl" />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{meal.title}</h2>

              {/* React Rating Stars Component */}
              <div className="flex items-center gap-2">
                <Rating
                  count={5}
                  size={24}
                  value={meal.rating || 0}
                  edit={false}
                  activeColor="#ffd700"
                />
                <span>({meal.rating || "No Rating"})</span>
              </div>

              <p className="text-lg font-bold">Price: {meal.price}</p>
              <div className="card-actions justify-end">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/meal/${meal._id}`)}
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealsByCategory;
