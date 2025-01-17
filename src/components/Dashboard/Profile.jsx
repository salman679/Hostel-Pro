const AdminProfile = () => {
  // Sample data for admin profile (replace with actual data from state or props)
  const adminData = {
    name: "John Doe",
    email: "john.doe@example.com",
    mealsAdded: 25,
    image: "https://via.placeholder.com/150", // Sample image URL
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <div className="flex items-center space-x-4">
        {/* Admin Profile Image */}
        <img
          src={adminData.image}
          alt="Admin Profile"
          className="w-16 h-16 rounded-full border-2 border-gray-300"
        />
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {adminData.name}
          </h2>
          <p className="text-sm text-gray-500">{adminData.email}</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-700">Admin Stats</h3>
        <ul className="mt-3 text-gray-600">
          <li className="flex justify-between">
            <span className="font-semibold">Meals Added:</span>
            <span>{adminData.mealsAdded}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminProfile;
