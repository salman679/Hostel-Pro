import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../contexts/AuthContext";
import axios from "axios";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";

const UpcomingMeals = () => {
  const [sortBy, setSortBy] = useState("likes");
  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { data: upcomingMeals = [], refetch } = useQuery({
    queryKey: ["upcomingMeals", sortBy],
    queryFn: async () => {
      const response = await axiosSecure.get(
        `/upcoming-meals?sortBy=${sortBy}`
      );
      return response.data;
    },
  });

  async function handlePublishMeal(meal) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, publish it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.post("/meals", meal).then((res) => {
          if (res.data.insertedId) {
            Swal.fire("Published!", "Your meal has been published.", "success");

            axiosSecure.delete(`/upcoming-meals/${meal._id}`).then((res) => {
              if (res.data.deletedCount > 0) {
                refetch();
              }
            });
          }
        });
      }
    });
  }

  // Handle form submission
  const onSubmit = async (data) => {
    const price = Number(data.price);
    try {
      await axiosSecure
        .post("/upcoming-meals", {
          ...data,
          price,
          image: imageUrl,
          likes: 0,
          ratting: 0,
          reviews: [],
        })
        .then((res) => {
          if (res.data.insertedId) {
            refetch();
            Swal.fire("Success", "Meal added successfully", "success");
            reset();
            setImageUrl("");
            document.getElementById("image").value = "";
            setShowModal(false); // Close the modal after successful submission
          }
        })
        .catch((error) => {
          console.error("Error adding meal:", error);
        });
    } catch (error) {
      console.error("Error adding meal:", error);
    }
  };

  // Handle image upload to ImageBB
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.imgbb.com/1/upload?key=6e8387872b8e8827b2a1b18c44181ca6",
        formData
      );
      setImageUrl(response.data.data.url);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMeals = upcomingMeals.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(upcomingMeals.length / itemsPerPage);

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Upcoming Meals</h2>

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
      </div>

      {/* Upcoming Meals Table */}
      <table className="table w-full">
        <thead>
          <tr>
            <th>Meal Title</th>
            <th>Likes</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentMeals.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">
                No upcoming meals available
              </td>
            </tr>
          ) : (
            currentMeals.map((meal) => (
              <tr key={meal.id}>
                <td>{meal.title}</td>
                <td>{meal.likes}</td>
                <td>{meal.category}</td>
                <td>{meal.price}</td>
                <td>
                  <button
                    onClick={() => handlePublishMeal(meal)}
                    className="btn btn-success btn-sm text-white"
                  >
                    Publish
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
          className="btn btn-primary btn-sm mr-2"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`btn btn-sm ${
              currentPage === index + 1 ? "btn-active" : ""
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          className="btn btn-primary btn-sm ml-2"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Add Upcoming Meal Button */}
      <button
        onClick={() => setShowModal(true)}
        className="btn btn-primary mt-4"
      >
        Add Upcoming Meal
      </button>

      {/* Add Upcoming Meal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-md w-96 mt-40">
            <h3 className="text-xl font-semibold mb-4">Add Upcoming Meal</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium mb-2"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  {...register("title", { required: "Title is required" })}
                  className="input input-bordered w-full"
                />
                {errors.title && (
                  <p className="text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium mb-2"
                >
                  Category
                </label>
                <select
                  id="category"
                  {...register("category", {
                    required: "Category is required",
                  })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select Category</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="veg">Vegetarian</option>
                  <option value="non-veg">Non-Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="special">Special Meals</option>
                  <option value="dessert">Dessert</option>
                </select>
                {errors.category && (
                  <p className="text-red-500">{errors.category.message}</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="ingredients"
                  className="block text-sm font-medium mb-2"
                >
                  Ingredients
                </label>
                <textarea
                  id="ingredients"
                  {...register("ingredients", {
                    required: "Ingredients are required",
                  })}
                  className="input input-bordered w-full py-2"
                />
                {errors.ingredients && (
                  <p className="text-red-500">{errors.ingredients.message}</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  {...register("description", {
                    required: "Description is required",
                  })}
                  className="input input-bordered w-full py-2"
                />
                {errors.description && (
                  <p className="text-red-500">{errors.description.message}</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium mb-2"
                >
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  {...register("price", { valueAsNumber: true })}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium mb-2"
                >
                  Image
                </label>
                <input
                  type="file"
                  id="image"
                  onChange={handleImageUpload}
                  className="file-input file-input-bordered w-full"
                />
                {loading && (
                  <p className="text-sm text-gray-500">Uploading...</p>
                )}
                {imageUrl && (
                  <p className="text-sm text-green-500">
                    Image uploaded successfully!
                  </p>
                )}
              </div>

              {/* Distributor Name and Email */}
              <div className=" grid-cols-2 gap-4 mb-4 hidden">
                <div>
                  <label
                    htmlFor="distributorName"
                    className="block text-gray-700"
                  >
                    Distributor Name
                  </label>
                  <input
                    type="text"
                    id="distributorName"
                    {...register("distributorName")}
                    value={user?.displayName || user?.name}
                    readOnly
                    className="input input-bordered w-full mt-2"
                  />
                </div>

                <div>
                  <label
                    htmlFor="distributorEmail"
                    className="block text-gray-700"
                  >
                    Distributor Email
                  </label>
                  <input
                    type="email"
                    {...register("distributorEmail")}
                    id="distributorEmail"
                    value={user?.email}
                    readOnly
                    className="input input-bordered w-full mt-2"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary mr-2"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Meal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingMeals;
