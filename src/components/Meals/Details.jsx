import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Rating from "react-rating-stars-component";
import { useAxiosPublic } from "../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import { useAuth } from "../../contexts/AuthContext";

export default function MealDetail() {
  const [reviewText, setReviewText] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [mealRequested, setMealRequested] = useState(false);
  const { id } = useParams();
  // const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  const {
    data: meal,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["mealDetails", id],
    queryFn: async () => {
      const response = await axiosPublic.get(`/meals/${id}`);
      return response.data;
    },
  });

  const handleLike = async () => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "You need to be logged in to like a meal.",
      });
      return;
    }
    try {
      setLikeCount(likeCount + 1);
      await axiosPublic.patch(`/meals/${id}/like`, {
        likes: likeCount + 1,
      });

      Swal.fire({
        icon: "success",
        title: "Liked",
        text: `You liked ${meal.title}!`,
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to like the meal. Please try again later.",
      });
    }
  };

  const handleRequestMeal = async () => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "You need to be logged in to request a meal.",
      });
      return;
    }
    if (!user.subscription) {
      Swal.fire({
        icon: "warning",
        title: "Subscription Required",
        text: "You need a package subscription to request a meal.",
      });
      return;
    }

    try {
      await axiosPublic.post(`/meals/${id}/request`, {
        userId: user._id,
        status: "pending",
      });
      setMealRequested(true);
      Swal.fire({
        icon: "success",
        title: "Request Sent",
        text: "Your meal request has been submitted. You will be notified once it’s processed.",
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to send your meal request. Please try again later.",
      });
    }
  };

  const handleReviewSubmit = async () => {
    if (!reviewText.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Review Required",
        text: "Please write a review before submitting.",
      });
      return;
    }
    try {
      await axiosPublic.post(`/meals/${id}/reviews`, {
        userId: user._id,
        text: reviewText,
      });
      setReviewText("");
      Swal.fire({
        icon: "success",
        title: "Review Submitted",
        text: "Thank you for your review!",
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to submit your review. Please try again later.",
      });
    }
  };

  useEffect(() => {
    if (meal) {
      setLikeCount(meal.likes || 0);
    }
  }, [meal]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  if (isError) return <div>Error loading meal details.</div>;

  return (
    <div className="p-8">
      {/* Meal Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card shadow-xl">
          <figure>
            <img src={meal.image} alt={meal.title} className="rounded-xl" />
          </figure>
        </div>

        <div>
          <h1 className="text-4xl font-bold">{meal.title}</h1>
          <p className="text-lg text-gray-700 mt-4">{meal.description}</p>
          <p className="mt-2">
            <span className="font-bold">Distributor:</span>{" "}
            {meal.distributorName}
          </p>
          <p className="mt-2">
            <span className="font-bold">Post Time:</span> {meal.postTime}
          </p>
          <p>Ingredients: {meal.ingredients}</p>

          {/* Rating */}
          <div className="flex items-center mt-4">
            <Rating
              count={5}
              size={24}
              value={meal.rating || 0}
              edit={false}
              activeColor="#ffd700"
            />
            <span className="ml-2">({meal.rating || "No Rating"})</span>
          </div>

          {/* Like Button */}
          <div className="mt-4 flex items-center">
            <button
              className="btn btn-outline btn-primary"
              onClick={handleLike}
            >
              Like ({likeCount})
            </button>
          </div>

          {/* Meal Request Button */}
          <div className="mt-4">
            <button
              className="btn btn-primary"
              onClick={handleRequestMeal}
              disabled={mealRequested}
            >
              {mealRequested ? "Request Sent" : "Request This Meal"}
            </button>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold">
          Reviews ({meal.reviews?.length || 0})
        </h2>

        {/* Reviews List */}
        <div className="mt-4">
          {meal.reviews?.map((review, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg mt-4">
              <p>{review.text}</p>
              <div className="mt-2 text-sm text-gray-500">
                - {review.userName}
              </div>
            </div>
          ))}
        </div>

        {/* Add a Review */}
        {user && (
          <div className="mt-6">
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Write a review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <button
              className="btn btn-primary mt-4"
              onClick={handleReviewSubmit}
            >
              Submit Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
