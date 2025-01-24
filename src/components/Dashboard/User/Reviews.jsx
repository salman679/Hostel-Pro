import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../contexts/AuthContext";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

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
            email: user?.email,
          })
          .then((res) => {
            if (res.data.deletedCount > 0) {
              refetch();
              Swal.fire("Deleted!", "Your review has been deleted.", "success");
            }
          });
      }
    });
  };

  return (
    <div className="container mx-auto p-8">
      <div className="rounded-lg p-8">
        <h2 className="text-3xl font-extrabold mb-6 text-center">My Reviews</h2>

        {isLoading ? (
          <div className="flex justify-center items-center">
            <span className="loading loading-dots loading-lg text-white"></span>
          </div>
        ) : reviewsData.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
            <table className="table w-full border-collapse">
              <thead className="bg-green-400 text-white">
                <tr>
                  <th className="p-4 text-left">Meal Title</th>
                  <th className="p-4 text-left">Likes</th>
                  <th className="p-4 text-left">Review</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviewsData.map((review) => (
                  <tr
                    key={review._id}
                    className="hover:bg-gray-100 transition-all duration-200"
                  >
                    <td className="p-4 text-black">{review.title}</td>
                    <td className="p-4 text-black">{review.likes}</td>
                    <td className="p-4">
                      {review.reviews.map((text) => (
                        <span
                          key={text.userEmail}
                          className="badge badge-outline badge-accent mx-1"
                        >
                          {text.text}
                        </span>
                      ))}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="btn btn-info btn-sm">Edit</button>
                        <button
                          className="btn btn-error btn-sm"
                          onClick={() => deleteReview(review._id)}
                        >
                          Delete
                        </button>
                        <Link to={`/meals/${review._id}`}>
                          <button className="btn btn-primary btn-sm">
                            View Meal
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex justify-center items-center h-40">
            <p className="text-center text-gray-200 text-xl">
              No reviews found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
