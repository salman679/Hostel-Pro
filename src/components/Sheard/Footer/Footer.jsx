import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import logo from "../../../assets/logo-removebg-preview.png";

export default function Footer() {
  return (
    <footer className="bg-green-700 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Brand Information */}
          <div className="text-center md:text-left">
            <div className="text-xl">
              <Link
                to="/"
                className="flex items-center justify-center md:justify-start"
              >
                <img src={logo} alt="Logo" className="w-24 h-24 mr-2" />
              </Link>
            </div>
            <p className="ml-2 text-sm text-gray-200">
              Providing healthy, delicious, and nutritious meals to meet your
              needs.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="hover:text-yellow-400 transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/meals"
                  className="hover:text-yellow-400 transition-colors duration-300"
                >
                  Meals
                </Link>
              </li>
              <li>
                <Link
                  to="/upcoming-meals"
                  className="hover:text-yellow-400 transition-colors duration-300"
                >
                  Upcoming Meals
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-yellow-400 transition-colors duration-300"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-6">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook className="w-6 h-6 text-gray-400 hover:text-yellow-400 transition-colors duration-300" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter className="w-6 h-6 text-gray-400 hover:text-yellow-400 transition-colors duration-300" />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="w-6 h-6 text-gray-400 hover:text-yellow-400 transition-colors duration-300" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} Meal Management. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
