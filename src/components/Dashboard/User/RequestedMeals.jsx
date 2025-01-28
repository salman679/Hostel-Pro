import Swal from "sweetalert2";
import { useAuth } from "../../../contexts/AuthContext";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

export default function RequestedMeals() {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: requestedMeals = [], refetch } = useQuery({
    queryKey: ["requests"],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const response = await axiosSecure.get(`/user/${user?.email}/requests`, {
        params: { email: user?.email },
      });
      return response.data;
    },
  });

  const cancelMeal = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosSecure.put(`/meals/${id}`, {
            status: "cancelled",
            email: user?.email,
          });
          if (response.data.modifiedCount > 0) {
            refetch();
            Swal.fire(
              "Cancelled!",
              "Your request has been cancelled.",
              "success"
            );
          } else {
            Swal.fire("Error!", "Request could not be deleted.", "error");
          }
        } catch (error) {
          console.error("Error deleting request:", error);
          Swal.fire("Error!", "An error occurred.", "error");
        }
      }
    });
  };

  return (
    <div className="card bg-white shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-center mb-6">Requested Meals</h2>

      {/* Table Wrapper for Responsiveness */}
      <div className="overflow-x-auto hidden md:block">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-2 text-sm sm:text-base">Meal Title</th>
              <th className="p-2 text-sm sm:text-base">Likes</th>
              <th className="p-2 text-sm sm:text-base">Reviews Count</th>
              <th className="p-2 text-sm sm:text-base">Status</th>
              <th className="p-2 text-sm sm:text-base">Action</th>
            </tr>
          </thead>
          <tbody>
            {requestedMeals.length > 0 ? (
              requestedMeals.map((meal) => (
                <tr key={meal._id} className="border-b text-center">
                  <td className="p-2 text-xs sm:text-sm">{meal.title}</td>
                  <td className="p-2 text-xs sm:text-sm">{meal.likes}</td>
                  <td className="p-2 text-xs sm:text-sm">
                    {meal.reviews.length}
                  </td>
                  <td className="p-2 text-xs sm:text-sm">
                    {meal.requests.map((request) => request.status)}
                  </td>
                  <td className="p-2">
                    <button
                      className="btn btn-error btn-sm text-xs sm:text-sm text-white"
                      onClick={() => cancelMeal(meal._id)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 p-4">
                  No requested meals found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile-Friendly Cards for Small Screens */}
      <div className="md:hidden mt-4">
        {requestedMeals.length > 0 ? (
          requestedMeals.map((meal) => (
            <div
              key={meal._id}
              className="border rounded-lg p-4 mb-4 bg-gray-50 shadow-sm"
            >
              <h3 className="font-semibold text-sm mb-2">{meal.title}</h3>
              <p className="text-xs">
                <span className="font-medium">Likes:</span> {meal.likes}
              </p>
              <p className="text-xs">
                <span className="font-medium">Reviews:</span>{" "}
                {meal.reviews.length}
              </p>
              <p className="text-xs">
                <span className="font-medium">Status:</span>{" "}
                {meal.requests.map((request) => request.status)}
              </p>
              <button
                className="btn btn-error btn-sm text-white text-xs mt-2"
                onClick={() => cancelMeal(meal._id)}
              >
                Cancel
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-sm">No meals found.</p>
        )}
      </div>
    </div>
  );
}
