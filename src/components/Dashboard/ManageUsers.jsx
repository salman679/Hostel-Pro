import { useState } from "react";
import { FaSearch } from "react-icons/fa"; // React Icons for search icon

const ManageUsers = () => {
  // Sample user data (replace with actual data fetched from your server)
  const users = [
    {
      id: 1,
      username: "john_doe",
      email: "john@example.com",
      isAdmin: false,
      isSubscribed: true,
    },
    {
      id: 2,
      username: "jane_doe",
      email: "jane@example.com",
      isAdmin: false,
      isSubscribed: false,
    },
    {
      id: 3,
      username: "alex_smith",
      email: "alex@example.com",
      isAdmin: true,
      isSubscribed: true,
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  // Function to handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter users based on searchTerm
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Make Admin</th>
              <th>Subscription Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className={`btn btn-sm ${
                      user.isAdmin ? "btn-disabled" : "btn-primary"
                    }`}
                    disabled={user.isAdmin}
                  >
                    {user.isAdmin ? "Admin" : "Make Admin"}
                  </button>
                </td>
                <td>
                  <span
                    className={`badge ${
                      user.isSubscribed ? "badge-success" : "badge-error"
                    }`}
                  >
                    {user.isSubscribed ? "Subscribed" : "Not Subscribed"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
