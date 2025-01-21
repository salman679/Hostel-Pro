import { useAuth } from "../../../contexts/AuthContext";

export default function AdminProfile() {
  const { user } = useAuth();

  //TODO: Add admin stats

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <div className="flex items-center space-x-4">
        {/* Admin Profile Image */}
        <div className="w-16 h-16">
          <img
            src={user?.photoURL || "https://i.ibb.co.com/HBx04n5/images.jpg"}
            alt="Admin Profile"
            className="w-full h-full rounded-full border-2 border-gray-300"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {user?.displayName}
          </h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-700">Admin Stats</h3>
        <ul className="mt-3 text-gray-600">
          <li className="flex justify-between">
            <span className="font-semibold">Meals Added:</span>
            {/* <span>{}</span> */}
          </li>
        </ul>
      </div>
    </div>
  );
}
