import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

export default function AllMeals() {
  const [sortBy, setSortBy] = useState("likes");
  const [mealToUpdate, setMealToUpdate] = useState(null);
  const [page, setPage] = useState(1); // Page state for pagination
  const axiosSecure = useAxiosSecure();

  const { data: meals = [], refetch } = useQuery({
    queryKey: ["meals", sortBy, page],
    queryFn: async () => {
      const response = await axiosSecure.get("/meals", {
        params: { sortBy, page },
      });
      return response.data;
    },
  });

  // React Hook Form setup
  const { register, handleSubmit, setValue, reset } = useForm();

  const handleUpdate = (meal) => {
    setMealToUpdate(meal);
    setValue("title", meal.title);
    setValue("category", meal.category);
    setValue("image", meal.image);
    setValue("ingredients", meal.ingredients);
    setValue("description", meal.description);
    setValue("price", meal.price);
  };

  const handleUpdateSubmit = async (data) => {
    console.log(data);

    try {
      const res = await axiosSecure.put(
        `/meals/${mealToUpdate._id}/edit`,
        data
      );
      if (res.data.modifiedCount > 0) {
        Swal.fire("Updated!", "Your meal has been updated.", "success");
        setMealToUpdate(null);
        reset();
        refetch();
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
          await axiosSecure.delete(`/meals/${mealId}`).then((res) => {
            console.log(res);

            if (res.data.deletedCount > 0) {
              Swal.fire("Deleted!", "Your meal has been deleted.", "success");
              refetch();
            } else {
              Swal.fire("Error!", "Meal could not be deleted.", "error");
            }
          });
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

  // Pagination logic
  const itemsPerPage = 10;
  const totalPages = Math.ceil(meals.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentPageMeals = meals.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    setPage(newPage);
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
          {currentPageMeals.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No meals available
              </td>
            </tr>
          ) : (
            currentPageMeals.map((meal) => (
              <tr key={meal._id}>
                <td>{meal.title}</td>
                <td>{meal.likes}</td>
                <td>{meal.reviews?.length}</td>
                <td>{meal.rating}</td>
                <td>{meal.distributorName}</td>
                <td>
                  <Link
                    to={`/meals/${meal._id}`}
                    className="btn btn-info btn-sm mr-2"
                  >
                    View
                  </Link>
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

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="btn btn-secondary mr-2"
        >
          Prev
        </button>
        <span className="text-lg">
          {page} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="btn btn-secondary ml-2"
        >
          Next
        </button>
      </div>

      {/* Update Modal (Appears when a meal is selected for updating) */}
      {mealToUpdate && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center overflow-y-auto"
          onClick={() => setMealToUpdate(null)}
        >
          <div
            className="bg-white rounded-lg p-6 w-1/2 mt-48"
            onClick={(e) => e.stopPropagation()}
          >
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
                <label className="block text-sm font-medium">Category</label>
                <input
                  {...register("category", { required: true })}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Image</label>
                <input
                  type="url"
                  {...register("image", { required: true })}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Ingredients</label>
                <textarea
                  {...register("ingredients", { required: true })}
                  className="input input-bordered w-full"
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  {...register("description", { required: true })}
                  className="input input-bordered w-full"
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Price</label>
                <input
                  type="number"
                  {...register("price", { required: true })}
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
        </div>
      )}
    </div>
  );
}
