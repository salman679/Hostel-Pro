import { Link } from "react-router-dom";
import logo from "../../../assets/logo-removebg-preview.png";

export default function Header() {
  return (
    <header className="container mx-auto px-4 lg:px-10">
      <nav className="navbar bg-white p-0 shadow-lg">
        <div className="navbar-start">
          <div className="dropdown">
            <button
              tabIndex={0}
              className="btn btn-ghost lg:hidden"
              aria-label="Open navigation menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </button>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white rounded-box z-10 mt-3 w-52 p-2 shadow-lg"
            >
              <li>
                <Link to="/" className="text-green-600 hover:text-green-800">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/meals"
                  className="text-green-600 hover:text-green-800"
                >
                  Meals
                </Link>
              </li>
              <li>
                <Link
                  to="/upcoming-meals"
                  className="text-green-600 hover:text-green-800"
                >
                  Upcoming Meals
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-xl">
            <Link to="/">
              <img
                src={logo}
                alt="Meal Management Logo"
                className="max-w-24 lg:max-w-32"
              />
            </Link>
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/" className="text-green-600 hover:text-green-800">
                Home
              </Link>
            </li>
            <li>
              <Link to="/meals" className="text-green-600 hover:text-green-800">
                Meals
              </Link>
            </li>
            <li>
              <Link
                to="/upcoming-meals"
                className="text-green-600 hover:text-green-800"
              >
                Upcoming Meals
              </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end flex items-center">
          <button
            className="btn btn-ghost btn-circle mr-3"
            aria-label="Notifications"
          >
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button>
          <Link to="/auth/login">
            <button className="btn bg-green-600 hover:bg-green-700 text-white">
              Join Us
            </button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
