import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../contexts/AuthContext";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useState } from "react";

export default function Reviews() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: reviewsData = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/meals/${user.email}/reviews`);
      return data;
    },
  });

  const [editMode, setEditMode] = useState(null); // Tracks the currently edited review ID
  const [editedText, setEditedText] = useState(""); // Tracks the edited text for the review

  const handleEdit = (review) => {
    setEditMode(review._id); // Enable edit mode for the clicked review
    setEditedText(review.reviews[0]?.text || ""); // Populate with existing text
  };

  const saveEdit = (id) => {
    axiosSecure
      .put(`/meals/${id}/reviews`, { email: user?.email, text: editedText })
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          refetch();
          setEditMode(null);
          Swal.fire("Updated!", "Your review has been updated.", "success");
        }
      });
  };

  const cancelEdit = () => {
    setEditMode(null); // Exit edit mode without saving
    setEditedText("");
  };

  const deleteReview = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/meals/${id}/reviews`, {
            params: {
              email: user?.email,
            },
          })
          .then((res) => {
            if (res.data.modifiedCount > 0) {
              refetch();
              Swal.fire("Deleted!", "Your review has been deleted.", "success");
            }
          });
      }
    });
  };

  return (
    <div className="card bg-white shadow-lg p-4 md:p-6 mb-6">
      <h2 className="text-xl md:text-3xl font-extrabold text-center mb-4 md:mb-6">
        My Reviews
      </h2>

      <div className="overflow-x-auto rounded-lg">
        <table className="table w-full border-collapse">
          <thead className="bg-gray-200 text-gray-800 text-center">
            <tr>
              <th className="p-2 md:p-4 text-sm md:text-base">Meal Title</th>
              <th className="p-2 md:p-4 text-sm md:text-base">Likes</th>
              <th className="p-2 md:p-4 text-sm md:text-base">Review</th>
              <th className="p-2 md:p-4 text-sm md:text-base">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : reviewsData.length > 0 ? (
              reviewsData.map((review) => (
                <tr
                  key={review._id}
                  className="hover:bg-gray-100 transition-all duration-200 text-center"
                >
                  <td className="p-2 md:p-4 text-sm md:text-base">
                    {review.title}
                  </td>
                  <td className="p-2 md:p-4 text-sm md:text-base">
                    {review.likes}
                  </td>
                  <td className="p-2 md:p-4 text-sm md:text-base">
                    {editMode === review._id ? (
                      <textarea
                        className="textarea textarea-bordered w-full"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                      />
                    ) : (
                      review.reviews.map((text) => (
                        <span
                          key={text.userEmail}
                          className="badge badge-outline badge-accent mx-1"
                        >
                          {text.text}
                        </span>
                      ))
                    )}
                  </td>
                  <td className="p-2 md:p-4 text-sm md:text-base">
                    <div className="flex flex-wrap justify-center gap-2">
                      {editMode === review._id ? (
                        <>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => saveEdit(review._id)}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={cancelEdit}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => handleEdit(review)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-error btn-sm"
                            onClick={() => deleteReview(review._id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                      <Link to={`/meals/${review._id}`}>
                        <button className="btn btn-primary btn-sm">
                          View Meal
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
