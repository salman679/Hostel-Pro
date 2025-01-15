import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F3F0]">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-[#331A15] mb-6">
          Login
        </h1>
        <form>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-[#331A15] text-sm font-medium mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D2B48C]"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-[#331A15] text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D2B48C]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#D2B48C] text-white py-2 px-4 rounded-md hover:bg-[#b89c77] transition"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don&apos;t have an account?{" "}
          <Link to={"/auth/signup"} className="text-[#D2B48C] hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
