import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

export default function AddMeal() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Handle form submission
  const onSubmit = async (data) => {
    console.log("Meal Data:", data);

    try {
      await axiosSecure
        .post("/meals", {
          ...data,
          image: imageUrl,
          likes: 0,
          retting: 0,
          reviews: [],
        })
        .then((res) => {
          if (res.data.insertedId) {
            Swal.fire("Success", "Meal added successfully", "success");
            reset();
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
    event.preventDefault();

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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Add New Meal</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Title and Category in one line */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="title" className="block text-gray-700">
              Meal Title
            </label>
            <input
              type="text"
              id="title"
              {...register("title", { required: "Title is required" })}
              className="input input-bordered w-full mt-2"
            />
            {errors.title && (
              <span className="text-red-500 text-sm">
                {errors.title.message}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-gray-700">
              Category
            </label>
            <select
              id="category"
              {...register("category", { required: "Category is required" })}
              className="select select-bordered w-full mt-2"
            >
              <option value="">Select Category</option>
              <option value="veg">Vegetarian</option>
              <option value="non-veg">Non-Vegetarian</option>
              <option value="dessert">Dessert</option>
            </select>
            {errors.category && (
              <span className="text-red-500 text-sm">
                {errors.category.message}
              </span>
            )}
          </div>
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-gray-700">Meal Image</label>
          <input
            type="file"
            accept="image/*"
            id="image"
            {...register("image", { required: "Image is required" })}
            onChange={handleImageUpload}
            className="file-input file-input-bordered w-full mt-2"
          />
          {errors.image && (
            <span className="text-red-500 text-sm">{errors.image.message}</span>
          )}
          {loading && <p>Uploading...</p>}
          {imageUrl && (
            <img src={imageUrl} alt="Meal" className="mt-4 max-w-xs" />
          )}
        </div>

        {/* Ingredients and Description in one line */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="ingredients" className="block text-gray-700">
              Ingredients
            </label>
            <textarea
              id="ingredients"
              {...register("ingredients", {
                required: "Ingredients are required",
              })}
              className="textarea textarea-bordered w-full mt-2"
              rows="4"
            />
            {errors.ingredients && (
              <span className="text-red-500 text-sm">
                {errors.ingredients.message}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              {...register("description", {
                required: "Description is required",
              })}
              className="textarea textarea-bordered w-full mt-2"
              rows="4"
            />
            {errors.description && (
              <span className="text-red-500 text-sm">
                {errors.description.message}
              </span>
            )}
          </div>
        </div>

        {/* Price and Post Time in one line */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="price" className="block text-gray-700">
              Price
            </label>
            <input
              type="number"
              id="price"
              {...register("price", { required: "Price is required" })}
              className="input input-bordered w-full mt-2"
            />
            {errors.price && (
              <span className="text-red-500 text-sm">
                {errors.price.message}
              </span>
            )}
          </div>
        </div>

        {/* Distributor Name and Email */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="distributorName" className="block text-gray-700">
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
            <label htmlFor="distributorEmail" className="block text-gray-700">
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

        {/* Submit Button */}
        <div className="mb-4">
          <button type="submit" className="btn btn-primary w-full">
            Add Meal
          </button>
        </div>
      </form>
    </div>
  );
}
