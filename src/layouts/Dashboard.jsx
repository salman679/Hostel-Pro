import {
  FaHome,
  FaUsers,
  FaUtensils,
  FaComment,
  FaCog,
  FaPlus,
} from "react-icons/fa";
import { Link, Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex ">
      {/* Sidebar */}
      <div className={`bg-gray-800 text-white w-64`}>
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
        </div>
        <nav className="mt-8">
          <ul>
            <li>
              <Link
                to="/dashboard"
                className="flex items-center p-4 hover:bg-gray-700 rounded-md"
              >
                <FaHome className="mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/manage-users"
                className="flex items-center p-4 hover:bg-gray-700 rounded-md"
              >
                <FaUsers className="mr-3" />
                Manage Users
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/all-meals"
                className="flex items-center p-4 hover:bg-gray-700 rounded-md"
              >
                <FaUtensils className="mr-3" />
                All Meals
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/add-meal"
                className="flex items-center p-4 hover:bg-gray-700 rounded-md"
              >
                <FaPlus className="mr-3" />
                Add Meal
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/all-reviews"
                className="flex items-center p-4 hover:bg-gray-700 rounded-md"
              >
                <FaComment className="mr-3" />
                All Reviews
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/upcoming-meals"
                className="flex items-center p-4 hover:bg-gray-700 rounded-md"
              >
                <FaCog className="mr-3" />
                Upcoming Meals
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-100 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
