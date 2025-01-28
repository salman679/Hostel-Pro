import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ServeMeals = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const axiosSecure = useAxiosSecure();

  const { data: requestedMeals = [], refetch } = useQuery({
    queryKey: ["meals", searchQuery],
    queryFn: async () => {
      const res = await axiosSecure.get("/serve-meals", {
        params: { search: searchQuery },
      });
      return res.data;
    },
  });

  const handleServeMeal = async (meal) => {
    try {
      const res = await axiosSecure.put(`/meals/${meal._id}/serve`, {
        status: "Delivered",
        userEmail: meal.requests.userEmail,
      });
      if (res.data.modifiedCount > 0) {
        refetch();
        Swal.fire("Served!", "Your meal has been served.", "success");
      } else {
        Swal.fire("Error!", "Meal could not be served.", "error");
      }
    } catch (error) {
      Swal.fire("Error!", "An error occurred while serving the meal.", "error");
      console.error("Error serving meal:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Serve Meals</h1>

      {/* Search Bar */}
      <input
        type="text"
        className="input input-bordered w-full mb-4"
        placeholder="Search by username or email"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Meals Table */}

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requestedMeals.length > 0 ? (
              requestedMeals.map((meal, index) => (
                <tr key={index}>
                  <td>{meal.title}</td>
                  <td>{meal.requests.userName}</td>
                  <td>{meal.requests.userEmail}</td>
                  <td>
                    <span
                      className={`badge ${
                        meal.requests.status === "Delivered"
                          ? "badge-success"
                          : "badge-warning"
                      } ${
                        meal.requests.status === "cancelled"
                          ? "badge-error"
                          : ""
                      }`}
                    >
                      {meal.requests.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleServeMeal(meal)}
                      disabled={
                        meal.requests.status === "Delivered" ||
                        meal.requests.status === "cancelled"
                      }
                    >
                      Serve
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No meals found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServeMeals;
