import {
  FaHome,
  FaUsers,
  FaUtensils,
  FaPlus,
  FaComment,
  FaHistory,
  FaCalendarAlt,
  FaClipboardList,
} from "react-icons/fa";
import { Link, Outlet } from "react-router-dom";
import useRole from "../Hooks/useRole";
import { useState } from "react";
// import { useDisclosure } from "@chakra-ui/react"; // Import Chakra UI's useDisclosure hook

export default function DashboardLayout() {
  const [role] = useRole();
  const [showSidebar, setShowSidebar] = useState(false);
  // const { isOpen, onOpen, onClose } = useDisclosure(); // useDisclosure for toggling sidebar

  // Function to handle menu click, close sidebar on mobile
  const handleMenuClick = () => {
    if (window.innerWidth < 768) {
      setShowSidebar(false); // Close sidebar on mobile
    }
  };

  return (
    <div className="flex">
      {/* Hamburger Icon for Mobile */}
      <button
        className="md:hidden p-4 text-white bg-gray-800 rounded-md absolute top-4 left-4 z-10"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        {showSidebar ? (
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6.293 4.293a1 1 0 011.414 0L10 6.586l2.293-2.293a1 1 0 111.414 1.414L11.414 8l2.293 2.293a1 1 0 01-1.414 1.414L10 9.414l-2.293 2.293a1 1 0 11-1.414-1.414L8.586 8 6.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white h-screen w-[264px] fixed md:block ${
          showSidebar ? "block z-10" : "hidden"
        } md:w-[264px]`}
      >
        <div className="flex justify-between items-center p-4">
          <Link to="/">
            <h2 className="text-xl font-bold text-center mt-5">Hostel Pro</h2>
          </Link>
        </div>
        <nav className="mt-8">
          <ul>
            <li>
              <Link
                to="/dashboard"
                className="flex items-center p-4 hover:bg-gray-700 rounded-md"
                onClick={handleMenuClick}
              >
                <FaHome className="mr-3" />
                Dashboard
              </Link>
            </li>
            {role === "admin" ? (
              <>
                <li>
                  <Link
                    to="/dashboard/admin-profile"
                    className="flex items-center p-4 hover:bg-gray-700 rounded-md"
                    onClick={handleMenuClick}
                  >
                    <FaHome className="mr-3" />
                    Admin Profile
                  </Link>
                </li>

                <li>
                  <Link
                    to="/dashboard/manage-users"
                    className="flex items-center p-4 hover:bg-gray-700 rounded-md"
                    onClick={handleMenuClick}
                  >
                    <FaUsers className="mr-3" />
                    Manage Users
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/all-meals"
                    className="flex items-center p-4 hover:bg-gray-700 rounded-md"
                    onClick={handleMenuClick}
                  >
                    <FaUtensils className="mr-3" />
                    All Meals
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/add-meal"
                    className="flex items-center p-4 hover:bg-gray-700 rounded-md"
                    onClick={handleMenuClick}
                  >
                    <FaPlus className="mr-3" />
                    Add Meal
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/serve-meals"
                    className="flex items-center p-4 hover:bg-gray-700 rounded-md"
                    onClick={handleMenuClick}
                  >
                    <FaClipboardList className="mr-3" />
                    Serve Meals
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/upcoming-meals"
                    className="flex items-center p-4 hover:bg-gray-700 rounded-md"
                    onClick={handleMenuClick}
                  >
                    <FaCalendarAlt className="mr-3" />
                    Upcoming Meals
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/dashboard/user-profile"
                    className="flex items-center p-4 hover:bg-gray-700 rounded-md"
                    onClick={handleMenuClick}
                  >
                    <FaUsers className="mr-3" />
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/requested-meals"
                    className="flex items-center p-4 hover:bg-gray-700 rounded-md"
                    onClick={handleMenuClick}
                  >
                    <FaUtensils className="mr-3" />
                    Requested Meals
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/reviews"
                    className="flex items-center p-4 hover:bg-gray-700 rounded-md"
                    onClick={handleMenuClick}
                  >
                    <FaComment className="mr-3" />
                    My Reviews
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/payment-history"
                    className="flex items-center p-4 hover:bg-gray-700 rounded-md"
                    onClick={handleMenuClick}
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
      <div className="flex-1 bg-gray-100 p-8 md:ml-[264px] h-screen overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
