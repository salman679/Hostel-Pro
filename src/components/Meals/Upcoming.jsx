import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useAuth } from "../../contexts/AuthContext";

export default function Upcoming() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const {
    data: userType = { subscription: "Bronze" },
    isLoading: userLoading,
    isError: userError,
  } = useQuery({
    queryKey: ["userType", user?.email],
    queryFn: async () => {
      if (!user?.email) throw new Error("User email is not defined");
      const res = await axiosSecure.get(`/users/${user?.email}`);
      return res.data?.userType || { subscription: "Free" };
    },
    enabled: !!user?.email,
  });

  const {
    data: upcomingMeals = [],
    refetch,
    isLoading: mealsLoading,
    isError: mealsError,
  } = useQuery({
    queryKey: ["meals"],
    queryFn: async () => {
      const res = await axiosSecure.get("/upcoming-meals");
      return res.data;
    },
  });

  const handleLike = async (mealIndex) => {
    if (["Silver", "Gold", "Platinum"].includes(userType.subscription)) {
      const updatedMeals = [...upcomingMeals];
      updatedMeals[mealIndex].likes += 1;

      // Optionally refetch or handle optimistic UI updates
      refetch();

      Swal.fire({
        icon: "success",
        title: "Liked!",
        text: `You liked ${upcomingMeals[mealIndex].title}.`,
        confirmButtonText: "OK",
      });
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
    return <div>Loading...</div>;
  }

  if (userError || mealsError) {
    return <div>Something went wrong. Please try again later.</div>;
  }

  console.log(upcomingMeals);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Upcoming </h1>
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
                <strong>Price:</strong> ৳{meal.price}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Rating:</strong> ⭐ {meal.rating}/5
              </p>
              <div className="text-sm text-gray-500">
                <strong>Distributor:</strong> {meal.distributorName}
              </div>
              <div className="card-actions justify-between mt-4">
                <button
                  onClick={() => handleLike(index)}
                  className="btn btn-primary btn-sm"
                >
                  Like ({meal.likes})
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
