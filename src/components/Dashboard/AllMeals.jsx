import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

export default function AllMeals() {
  const [sortBy, setSortBy] = useState("likes");
  const axiosSecure = useAxiosSecure();

  const { data: meals = [] } = useQuery({
    queryKey: ["meals", sortBy],
    queryFn: async () => {
      const response = await axiosSecure.get("/meals", { params: { sortBy } });
      return response.data;
    },
  });

  const handleUpdate = (mealId) => {
    // Navigate to the update page or open a modal to update the meal
    console.log(`Update meal with ID: ${mealId}`);
  };

  const handleDelete = async (mealId) => {
    try {
      await axios.delete(`/api/meals/${mealId}`);
    } catch (error) {
      console.error("Error deleting meal:", error);
    }
  };

  const handleView = (mealId) => {
    // Navigate to the view page or open a modal to view the meal details
    console.log(`View meal with ID: ${mealId}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">All Meals</h2>

      {/* Sorting Controls */}
      <div className="mb-4">
        <button
          onClick={() => setSortBy("likes")}
          className={`btn ${
            sortBy === "likes" ? "btn-primary" : "btn-secondary"
          } mr-4`}
        >
          Sort by Likes
        </button>
        <button
          onClick={() => setSortBy("reviews_count")}
          className={`btn ${
            sortBy === "reviews_count" ? "btn-primary" : "btn-secondary"
          }`}
        >
          Sort by Reviews Count
        </button>
      </div>

      {/* Meals Table */}
      <table className="table w-full">
        <thead>
          <tr>
            <th>Meal Title</th>
            <th>Likes</th>
            <th>Reviews Count</th>
            <th>Rating</th>
            <th>Distributor Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {meals.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No meals available
              </td>
            </tr>
          ) : (
            meals.map((meal) => (
              <tr key={meal._id}>
                <td>{meal.title}</td>
                <td>{meal.likes}</td>
                <td>{meal.reviews?.length}</td>
                <td>{meal.retting}</td>
                <td>{meal.distributorName}</td>
                <td>
                  <button
                    onClick={() => handleView(meal._id)}
                    className="btn btn-info btn-sm mr-2"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleUpdate(meal.id)}
                    className="btn btn-warning btn-sm mr-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(meal.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
