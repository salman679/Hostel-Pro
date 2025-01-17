import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { useAxiosPublic } from "../../Hooks/useAxiosPublic";

const ManageUsers = () => {
  const axiosPublic = useAxiosPublic();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch users using TanStack Query v5
  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users", searchTerm], // Query key, includes search term
    queryFn: async () => {
      const response = await axiosPublic.get(`/users`, {
        params: { search: searchTerm }, // Send search term as query param
      });
      return response.data; // Return users data
    },
    keepPreviousData: true, // Retain previous data while fetching new data
  });

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    refetch(); // Refetch data on search term change
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
        <p>Loading users...</p>
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
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${
                          user.role === "admin" ? "btn-disabled" : "btn-primary"
                        }`}
                        disabled={user.role === "admin"}
                      >
                        {user.role === "admin" ? "Admin" : "Make Admin"}
                      </button>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          user.role ? "badge-success" : "badge-error"
                        }`}
                      >
                        {user.role ? "Subscribed" : "Not Subscribed"}
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
};

export default ManageUsers;
