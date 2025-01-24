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
      <h2 className="text-xl font-bold mb-4">Requested Meals</h2>
      {requestedMeals.length > 0 ? (
        <table className="table w-full">
          <thead>
            <tr>
              <th>Meal Title</th>
              <th>Likes</th>
              <th>Reviews Count</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requestedMeals.map((meal) => (
              <tr key={meal._id}>
                <td>{meal.title}</td>
                <td>{meal.likes}</td>
                <td>{meal.reviews.length}</td>
                <td>{meal.requests.map((request) => request.status)}</td>
                <td>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => cancelMeal(meal._id)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No requested meals found.</p>
      )}
    </div>
  );
}
