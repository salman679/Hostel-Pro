import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/hostel-pro-high-resolution-logo-transparent.png";
import { useAuth } from "../../../contexts/AuthContext";
import Swal from "sweetalert2";
import { Bell, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logOut().then(() => {
        navigate("/");
        Swal.fire("Success", "Logout Successful", "success");
      });
    } catch {
      Swal.fire("Error", "Logout Failed", "error");
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center ">
            <Link to="/">
              <img
                src={logo}
                alt="Meal Management Logo"
                className="max-w-24 lg:max-w-32"
              />
            </Link>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex  space-x-6 ml-10">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary font-medium"
            >
              Home
            </Link>
            <Link
              to="/meals"
              className="text-gray-700 hover:text-primary font-medium"
            >
              Meals
            </Link>
            <Link
              to="/meals/upcoming-meals"
              className="text-gray-700 hover:text-primary font-medium"
            >
              Upcoming Meals
            </Link>
          </div>
          {/* Right side navigation */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-primary">
              <Bell size={20} />
            </button>

            {user ? (
              <div className="relative">
                <button
                  className="flex items-center space-x-2"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                    <span className="text-sm">
                      {user?.displayName.charAt(0)}
                    </span>
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      {user?.displayName}
                    </div>

                    <Link
                      to={`/dashboard`}
                      state={{ email: user?.email }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        handleLogout();
                        // setIsLoggedIn(false);
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to={"/auth/login"}>
                <button className="bg-primary hover:bg-green-600 text-white px-4 py-2 rounded-md hidden sm:block">
                  Join Us
                </button>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-700 hover:text-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white py-4 px-2 absolute top-full left-0 right-0 shadow-md z-50">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary font-medium px-4 py-2 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/meals"
                className="text-gray-700 hover:text-primary font-medium px-4 py-2 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Meals
              </Link>
              <Link
                to="/meals/upcoming-meals"
                className="text-gray-700 hover:text-primary font-medium px-4 py-2 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Upcoming Meals
              </Link>
              {!user && (
                <Link to={"/auth/login"}>
                  <button
                    className="bg-primary hover:bg-green-400 text-white px-4 py-2 rounded-md text-left mx-4 mt-2"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Join Us
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
