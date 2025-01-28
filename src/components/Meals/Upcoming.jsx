import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useAuth } from "../../contexts/AuthContext";

export default function Upcoming() {
  const axiosSecure = useAxiosSecure();
  const { user, loading } = useAuth();

  const { data: userType = {}, isLoading: userLoading } = useQuery({
    queryKey: ["userType", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user?.email}`);
      return res.data;
    },
  });

  const {
    data: upcomingMeals = [],
    refetch,
    isLoading: mealsLoading,
  } = useQuery({
    queryKey: ["meals"],
    queryFn: async () => {
      const res = await axiosSecure.get("/upcoming-meals");
      return res.data;
    },
  });

  const handleLike = async (meal) => {
    if (["Silver", "Gold", "Platinum"].includes(userType.subscription)) {
      try {
        const response = await axiosSecure.patch(
          `/upcoming-meals/${meal._id}/like`,
          {
            likes: meal.likes + 1,
            userEmail: user.email, // Send the user's email
          }
        );

        if (response.data.modifiedCount > 0) {
          refetch();
          Swal.fire({
            icon: "success",
            title: "Liked!",
            text: `You liked ${meal.title}.`,
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        if (error.response?.status === 400) {
          Swal.fire({
            icon: "error",
            title: "Already Liked",
            text: "You have already liked this meal.",
            confirmButtonText: "OK",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Something went wrong. Please try again later.",
            confirmButtonText: "OK",
          });
        }
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "Only premium users can like meals.",
        confirmButtonText: "Upgrade Now",
      });
    }
  };

  if (userLoading || mealsLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Upcoming Meals</h1>
        <div className="container mx-auto flex items-center justify-center">
          <span className="loading loading-dots loading-md"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Upcoming Meals</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingMeals?.map((meal, index) => (
          <div key={meal._id || index} className="card shadow-lg bg-base-100">
            <figure>
              <img
                src={meal.image}
                alt={meal.title}
                className="w-full h-48 object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-lg font-bold">{meal.title}</h2>
              <p className="text-sm text-gray-500">
                <strong>Category:</strong> {meal.category}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Ingredients:</strong> {meal.ingredients}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Price:</strong> ${meal?.price}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Rating:</strong> ⭐ {meal?.ratting}/5
              </p>
              <div className="text-sm text-gray-500">
                <strong>Distributor:</strong> {meal.distributorName}
              </div>
              <div className="card-actions justify-between mt-4">
                <button
                  onClick={() => handleLike(meal)}
                  className="btn btn-primary btn-sm"
                >
                  Like ({meal.likes || 0})
                </button>
                <button className="btn btn-secondary btn-sm">
                  Reviews ({meal.reviews.length})
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
