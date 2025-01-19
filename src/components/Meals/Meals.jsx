import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Rating from "react-rating-stars-component";
import { useAxiosPublic } from "../../Hooks/useAxiosPublic"; // Custom axios hook

export default function MealsByCategory() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const {
    data: meals = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["meals", selectedCategory],
    queryFn: async () => {
      try {
        const response = await axiosPublic.get(
          `/meals/category/${selectedCategory}`
        );
        return response.data || [];
      } catch (error) {
        console.error("Error fetching meals:", error);
        return [];
      }
    },
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
        {meals?.slice(0, 3).map((meal) => (
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
                  value={parseInt(meal.rating) || 0}
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
}
