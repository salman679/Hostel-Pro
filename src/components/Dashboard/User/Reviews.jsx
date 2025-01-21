import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchUserReviews();
  }, []);

  const fetchUserReviews = () => {
    setReviews([
      {
        id: 1,
        mealTitle: "Pizza",
        likes: 20,
        review: "Delicious!",
        mealId: 101,
      },
      {
        id: 2,
        mealTitle: "Burger",
        likes: 10,
        review: "Good, but too salty.",
        mealId: 102,
      },
    ]);
  };

  const deleteReview = (id) => {
    setReviews((prev) => prev.filter((review) => review.id !== id));
  };
  return (
    <div className="card bg-white shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">My Reviews</h2>
      {reviews.length > 0 ? (
        <table className="table w-full">
          <thead>
            <tr>
              <th>Meal Title</th>
              <th>Likes</th>
              <th>Review</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id}>
                <td>{review.mealTitle}</td>
                <td>{review.likes}</td>
                <td>{review.review}</td>
                <td className="flex gap-2">
                  <button className="btn btn-info btn-sm">Edit</button>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => deleteReview(review.id)}
                  >
                    Delete
                  </button>
                  <Link to={`/meal/${review.mealId}`}>
                    <button className="btn btn-primary btn-sm">
                      View Meal
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No reviews found.</p>
      )}
    </div>
  );
}
