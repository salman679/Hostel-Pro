import {
  FaHome,
  FaUsers,
  FaUtensils,
  // FaComment,
  // FaCog,
  FaPlus,
  FaComment,
  FaHistory,
} from "react-icons/fa";
import { Link, Outlet } from "react-router-dom";
import useRole from "../Hooks/useRole";

export default function DashboardLayout() {
  const [role] = useRole();

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="bg-gray-800 text-white h-screen w-[264px] fixed">
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-bold text-center mt-5">Hostel Pro</h2>
        </div>
        <nav className="mt-8">
          <ul>
            <li>
              <a className="flex items-center p-4 hover:bg-gray-700 rounded-md">
                <FaHome className="mr-3" />
                Dashboard
              </a>
            </li>
            {role === "admin" ? (
              <>
                <li>
                  <Link
                    to={"/dashboard/admin-profile"}
                    className="flex items-center p-4 hover:bg-gray-700 rounded-md"
                  >
                    <FaHome className="mr-3" />
                    Admin Profile
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
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/dashboard/user-profile"
                    className="flex items-center p-4 hover:bg-gray-700 rounded-md"
                  >
                    <FaUsers className="mr-3" />
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/requested-meals"
                    className="flex items-center p-4 hover:bg-gray-700 rounded-md"
                  >
                    <FaUtensils className="mr-3" />
                    Requested Meals
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/reviews"
                    className="flex items-center p-4 hover:bg-gray-700 rounded-md"
                  >
                    <FaComment className="mr-3" />
                    My Reviews
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/payment-history"
                    className="flex items-center p-4 hover:bg-gray-700 rounded-md"
                  >
                    <FaHistory className="mr-3" />
                    Payment History
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-100 p-8 ml-[264px] h-screen overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
