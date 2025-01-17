import { useEffect, useState, useCallback } from "react";
import axios from "axios"; // Assuming you are using axios to make API calls

const AllReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [sortBy, setSortBy] = useState("likes"); // Default sort by likes

  // Fetch reviews from server
  const fetchReviews = useCallback(async () => {
    try {
      const response = await axios.get(`/api/reviews?sortBy=${sortBy}`);
      setReviews(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]); // Set to empty array in case of error
    }
  }, [sortBy]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Handle sorting
  const handleSort = (field) => {
    setSortBy(field);
  };

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`/api/reviews/${reviewId}`);
      fetchReviews(); // Re-fetch reviews after deletion
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleView = (reviewId) => {
    // Navigate to the view page or open a modal to view the review details
    console.log(`View review with ID: ${reviewId}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">All Reviews</h2>

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

      {/* Reviews Table */}
      <table className="table w-full">
        <thead>
          <tr>
            <th>Meal Title</th>
            <th>Likes</th>
            <th>Reviews Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No reviews available
              </td>
            </tr>
          ) : (
            reviews.map((review) => (
              <tr key={review.id}>
                <td>{review.meal_title}</td>
                <td>{review.likes}</td>
                <td>{review.reviews_count}</td>
                <td>
                  <button
                    onClick={() => handleView(review.id)}
                    className="btn btn-info btn-sm mr-2"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
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

export default AllReviews;
