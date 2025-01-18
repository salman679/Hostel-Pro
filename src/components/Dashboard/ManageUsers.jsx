import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { useAxiosPublic } from "../../Hooks/useAxiosPublic";
import useAxiosSecure from "../../Hooks/useAxiosSecure.jsx";
import Swal from "sweetalert2";

export default function ManageUsers() {
  const axiosPublic = useAxiosPublic();
  const [searchTerm, setSearchTerm] = useState("");
  const axiosSecure = useAxiosSecure();

  // Fetch users using TanStack Query v5
  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users", searchTerm],
    queryFn: async () => {
      const response = await axiosSecure.get("/users", {
        params: { search: searchTerm }, // Send search term as query param
      });
      return response.data;
    },
  });

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    refetch(); // Refetch data on search term change
  };

  // Handle making a user an admin
  const handleMakeAdmin = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to make this user an admin?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, make admin!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await axiosPublic.patch(`/users/admin/${userId}`);
        if (response.data.modifiedCount > 0) {
          Swal.fire("Success", "User made admin successfully", "success");

          refetch(); // Refetch data after making user an admin
        }
      }
    });
  };

  return (
    <div className="p-6">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            className="input input-bordered w-full pl-10"
            placeholder="Search by username or email"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading ? (
        <div className="flex justify-center items-center">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>name</th>
                <th>Email</th>
                <th>Make Admin</th>
                <th>Subscription Status</th>
              </tr>
            </thead>
            <tbody>
              {users?.length > 0 ? (
                users?.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${
                          user.role === "admin" ? "btn-disabled" : "btn-primary"
                        }`}
                        disabled={user.role === "admin"}
                        onClick={() => handleMakeAdmin(user._id)}
                      >
                        {user.role === "admin" ? "Admin" : "Make Admin"}
                      </button>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          user.subscription === "Bronze"
                            ? "badge-warning text-black"
                            : user.subscription === "Silver"
                            ? "badge-info"
                            : user.subscription === "Gold"
                            ? "badge-primary"
                            : user.subscription === "Platinum"
                            ? "badge-success"
                            : "badge-error"
                        }`}
                      >
                        {user.subscription || "Not Subscribed"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
