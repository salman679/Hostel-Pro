import { useEffect, useState, useCallback } from "react";
import axios from "axios"; // Assuming you are using axios to make API calls

const AllMeals = () => {
  const [meals, setMeals] = useState([]); // Initialize meals as an empty array
  const [sortBy, setSortBy] = useState("likes"); // Default sort by likes

  // Fetch meals from server using useCallback to avoid unnecessary re-creations
  const fetchMeals = useCallback(async () => {
    try {
      const response = await axios.get(`/api/meals?sortBy=${sortBy}`);
      // Ensure that the response is an array
      setMeals(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching meals:", error);
      setMeals([]); // Set to empty array in case of error
    }
  }, [sortBy]); // Re-fetch when `sortBy` changes

  // Fetch meals initially or when sortBy changes
  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]); // Run fetchMeals whenever it changes

  // Handle sorting
  const handleSort = (field) => {
    setSortBy(field);
  };

  const handleUpdate = (mealId) => {
    // Navigate to the update page or open a modal to update the meal
    console.log(`Update meal with ID: ${mealId}`);
  };

  const handleDelete = async (mealId) => {
    try {
      await axios.delete(`/api/meals/${mealId}`);
      fetchMeals(); // Re-fetch meals after deletion
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
          onClick={() => handleSort("likes")}
          className={`btn ${
            sortBy === "likes" ? "btn-primary" : "btn-secondary"
          } mr-4`}
        >
          Sort by Likes
        </button>
        <button
          onClick={() => handleSort("reviews_count")}
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
              <tr key={meal.id}>
                <td>{meal.title}</td>
                <td>{meal.likes}</td>
                <td>{meal.reviews_count}</td>
                <td>{meal.rating}</td>
                <td>{meal.distributor_name}</td>
                <td>
                  <button
                    onClick={() => handleView(meal.id)}
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
};

export default AllMeals;
