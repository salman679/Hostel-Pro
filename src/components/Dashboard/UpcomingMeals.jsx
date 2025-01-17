import { useEffect, useState, useCallback } from "react";
import axios from "axios"; // Assuming you're using axios to make API calls

const UpcomingMeals = () => {
  const [upcomingMeals, setUpcomingMeals] = useState([]);
  const [sortBy, setSortBy] = useState("likes");
  const [showModal, setShowModal] = useState(false);
  const [newMeal, setNewMeal] = useState({
    title: "",
    category: "",
    image: "",
    ingredients: "",
    description: "",
    price: "",
  });

  // Fetch upcoming meals from the server
  const fetchUpcomingMeals = useCallback(async () => {
    try {
      const response = await axios.get(`/api/upcomingMeals?sortBy=${sortBy}`);
      setUpcomingMeals(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching upcoming meals:", error);
      setUpcomingMeals([]); // Set to empty array in case of error
    }
  }, [sortBy]);

  useEffect(() => {
    fetchUpcomingMeals();
  }, [fetchUpcomingMeals]);

  // Handle sorting
  const handleSort = (field) => {
    setSortBy(field);
  };

  // Handle Publish
  const handlePublish = async (mealId) => {
    try {
      await axios.post(`/api/meals/publish/${mealId}`);
      fetchUpcomingMeals(); // Re-fetch upcoming meals after publishing
    } catch (error) {
      console.error("Error publishing meal:", error);
    }
  };

  // Handle modal visibility
  const handleAddMealModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Handle new upcoming meal form submission
  const handleNewMealChange = (e) => {
    const { name, value } = e.target;
    setNewMeal((prevMeal) => ({
      ...prevMeal,
      [name]: value,
    }));
  };

  const handleAddUpcomingMeal = async () => {
    try {
      await axios.post("/api/upcomingMeals", newMeal);
      setNewMeal({
        title: "",
        category: "",
        image: "",
        ingredients: "",
        description: "",
        price: "",
      });
      setShowModal(false);
      fetchUpcomingMeals(); // Re-fetch upcoming meals after adding
    } catch (error) {
      console.error("Error adding upcoming meal:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Upcoming Meals</h2>

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
      </div>

      {/* Upcoming Meals Table */}
      <table className="table w-full">
        <thead>
          <tr>
            <th>Meal Title</th>
            <th>Likes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {upcomingMeals.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">
                No upcoming meals available
              </td>
            </tr>
          ) : (
            upcomingMeals.map((meal) => (
              <tr key={meal.id}>
                <td>{meal.title}</td>
                <td>{meal.likes}</td>
                <td>
                  <button
                    onClick={() => handlePublish(meal.id)}
                    className="btn btn-success btn-sm"
                  >
                    Publish
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Add Upcoming Meal Button */}
      <button onClick={handleAddMealModal} className="btn btn-primary mt-4">
        Add Upcoming Meal
      </button>

      {/* Add Upcoming Meal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h3 className="text-xl font-semibold mb-4">Add Upcoming Meal</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={newMeal.title}
                  onChange={handleNewMealChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  id="category"
                  value={newMeal.category}
                  onChange={handleNewMealChange}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="image" className="block text-sm font-medium">
                  Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  id="image"
                  value={newMeal.image}
                  onChange={handleNewMealChange}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="ingredients"
                  className="block text-sm font-medium"
                >
                  Ingredients
                </label>
                <textarea
                  name="ingredients"
                  id="ingredients"
                  value={newMeal.ingredients}
                  onChange={handleNewMealChange}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium"
                >
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={newMeal.description}
                  onChange={handleNewMealChange}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  value={newMeal.price}
                  onChange={handleNewMealChange}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleCloseModal}
                  className="btn btn-secondary mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUpcomingMeal}
                  className="btn btn-primary"
                >
                  Add Meal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingMeals;
