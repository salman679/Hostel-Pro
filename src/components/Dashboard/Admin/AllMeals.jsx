import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

export default function AllMeals() {
  const [sortBy, setSortBy] = useState("likes");
  const [mealToUpdate, setMealToUpdate] = useState(null);
  const axiosSecure = useAxiosSecure();
  // const navigate = useNavigate();

  const { data: meals = [], refetch } = useQuery({
    queryKey: ["meals", sortBy],
    queryFn: async () => {
      const response = await axiosSecure.get("/meals", { params: { sortBy } });
      return response.data;
    },
  });

  // React Hook Form setup
  const { register, handleSubmit, setValue, reset } = useForm();

  const handleUpdate = (meal) => {
    setMealToUpdate(meal);
    setValue("title", meal.title);
    setValue("likes", meal.likes);
    setValue("rating", meal.rating);
    setValue("distributorName", meal.distributorName);
  };

  const handleUpdateSubmit = async (data) => {
    try {
      const res = await axiosSecure.put(`/meals/${mealToUpdate._id}`, data);
      if (res.data.updatedMeal) {
        Swal.fire("Updated!", "Your meal has been updated.", "success");
        setMealToUpdate(null);
        reset(); // Reset the form after successful update
        refetch(); // Re-fetch meals after update
      } else {
        Swal.fire("Error!", "Meal could not be updated.", "error");
      }
    } catch (error) {
      Swal.fire(
        "Error!",
        "An error occurred while updating the meal.",
        "error"
      );
      console.error("Error updating meal:", error);
    }
  };

  const handleDelete = async (mealId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/meals/${mealId}`);
          if (res.data.deletedCount > 0) {
            Swal.fire("Deleted!", "Your meal has been deleted.", "success");
            refetch(); // Re-fetch meals after deletion
          } else {
            Swal.fire("Error!", "Meal could not be deleted.", "error");
          }
        } catch (error) {
          Swal.fire(
            "Error!",
            "An error occurred while deleting the meal.",
            "error"
          );
          console.error("Error deleting meal:", error);
        }
      }
    });
  };

  const handleView = (mealId) => {
    // Navigate to the view page or open a modal to view the meal details
    console.log(`View meal with ID: ${mealId}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">All Meals</h2>

      {/* Sorting Controls */}
      <div className="mb-4">
        <button
          onClick={() => setSortBy("likes")}
          className={`btn ${
            sortBy === "likes" ? "btn-primary" : "btn-secondary"
          } mr-4`}
        >
          Sort by Likes
        </button>
        <button
          onClick={() => setSortBy("reviews_count")}
          className={`btn ${
            sortBy === "reviews_count" ? "btn-primary" : "btn-secondary"
          }`}
        >
          Sort by Reviews Count
        </button>
      </div>

      {/* Meals Table */}
      <table className="table w-full">
        <thead>
          <tr>
            <th>Meal Title</th>
            <th>Likes</th>
            <th>Reviews Count</th>
            <th>Rating</th>
            <th>Distributor Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {meals.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No meals available
              </td>
            </tr>
          ) : (
            meals.map((meal) => (
              <tr key={meal._id}>
                <td>{meal.title}</td>
                <td>{meal.likes}</td>
                <td>{meal.reviews?.length}</td>
                <td>{meal.rating}</td>
                <td>{meal.distributorName}</td>
                <td>
                  <button
                    onClick={() => handleView(meal._id)}
                    className="btn btn-info btn-sm mr-2"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleUpdate(meal)}
                    className="btn btn-warning btn-sm mr-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(meal._id)}
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

      {/* Update Form (Appears when a meal is selected for updating) */}
      {mealToUpdate && (
        <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Update Meal</h3>
          <form onSubmit={handleSubmit(handleUpdateSubmit)}>
            <div className="mb-4">
              <label className="block text-sm font-medium">Meal Title</label>
              <input
                {...register("title", { required: true })}
                className="input input-bordered w-full"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Likes</label>
              <input
                type="number"
                {...register("likes", { required: true })}
                className="input input-bordered w-full"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Rating</label>
              <input
                type="number"
                {...register("rating", { required: true })}
                className="input input-bordered w-full"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">
                Distributor Name
              </label>
              <input
                {...register("distributorName", { required: true })}
                className="input input-bordered w-full"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Update Meal
            </button>
            <button
              type="button"
              onClick={() => setMealToUpdate(null)}
              className="btn btn-secondary w-full mt-2"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
