import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAxiosPublic } from "../../Hooks/useAxiosPublic"; // Custom axios hook
import Rating from "react-rating-stars-component";

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
        throw new Error("Failed to fetch meals");
      }
    },
  });

  const handleTabChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="p-8">
      {/* Tabs */}
      <div className="flex justify-center items-center space-x-4 mt-4">
        {["All", "Breakfast", "Lunch", "Dinner"].map((category) => (
          <button
            key={category}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              selectedCategory === category
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-600"
            }`}
            onClick={() => handleTabChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Loading/Error Handling */}
      {isLoading && <div className="text-center my-4">Loading meals...</div>}
      {isError && (
        <div className="text-center my-4 text-red-500">
          Failed to load meals. Please try again later.
        </div>
      )}

      {/* Meal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {meals.length > 0 ? (
          meals.slice(0, 3).map((meal) => (
            <div key={meal._id} className="card shadow-xl">
              <figure>
                <img src={meal.image} alt={meal.title} className="rounded-xl" />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{meal.title}</h2>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <Rating
                    count={5}
                    size={24}
                    value={Number(meal.rating) || 0}
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
          ))
        ) : (
          <div className="col-span-full text-center my-4 text-gray-500">
            No meals found for &quot;{selectedCategory}&quot;.
          </div>
        )}
      </div>
    </div>
  );
}
