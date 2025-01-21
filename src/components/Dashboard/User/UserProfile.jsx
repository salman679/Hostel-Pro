import { useQuery } from "@tanstack/react-query";
import { useAxiosPublic } from "../../../Hooks/useAxiosPublic";
import { useAuth } from "../../../contexts/AuthContext";

export default function UserProfile() {
  const axiosPublic = useAxiosPublic();
  const { user, loading } = useAuth();

  const { data: userData = {} } = useQuery({
    queryKey: ["user"],
    enabled: !loading && !!user.email,
    queryFn: async () => {
      const res = await axiosPublic.get(`/users/${user.email}`);
      return res.data;
    },
  });

  // Dynamic subscription styles
  const subscriptionStyles = {
    Gold: "badge badge-warning text-black border-yellow-500 shadow-lg",
    Bronze: "badge bg-amber-600 text-white border-none shadow-md",
    Platinum: "badge badge-info text-black border-blue-400 shadow-lg",
    Silver: "badge bg-gray-300 text-gray-800 border-none shadow-md",
  };

  return (
    <div className="card bg-gradient-to-r from-blue-50 to-white shadow-xl p-8 rounded-lg mb-6">
      <div className="flex flex-col md:flex-row items-center">
        <div className="avatar">
          <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
            <img
              src={userData.image || "https://via.placeholder.com/150"}
              alt="User"
              className="object-cover"
            />
          </div>
        </div>
        <div className="mt-6 md:mt-0 md:ml-8 text-center md:text-left">
          <h2 className="text-3xl font-extrabold text-gray-800">
            {userData.name || "Loading..."}
          </h2>
          <p className="text-lg text-gray-500">
            {userData.email || "Loading..."}
          </p>
          <div className="mt-4">
            <span
              className={`py-2 px-4 text-sm font-semibold rounded-lg ${
                subscriptionStyles[userData.subscription] ||
                "badge bg-gray-200 text-gray-500"
              }`}
            >
              {userData.subscription || "No Subscription"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
