import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const AllReviews = () => {
  const [sortBy, setSortBy] = useState("likes"); // Default sort by likes

  // Use TanStack Query to fetch reviews
  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", sortBy],
    queryFn: async (sortBy) => {
      try {
        const response = await axios.get(`/meals/reviews?sortBy=${sortBy}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching reviews:", error);
        return []; // Return empty array in case of error
      }
    },
  });

  // Handle sorting
  const handleSort = (field) => {
    setSortBy(field);
  };

  const handleDelete = (reviewId) => {
    // Handle review deletion
    console.log(`Delete review with ID: ${reviewId}`);
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

      {/* Reviews List with DaisyUI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.length === 0 ? (
          <div className="text-center col-span-full">No reviews available</div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="card w-full bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">{review.meal_title}</h3>
                <p className="text-lg">Likes: {review.likes}</p>
                <p className="text-lg">Reviews Count: {review.reviews_count}</p>
                <div className="card-actions justify-end">
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
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllReviews;
