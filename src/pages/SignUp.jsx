import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function SignUp() {
  const { createUser, updateUser } = useAuth();

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;

    createUser(email, password).then(() => {
      const user = { name };

      updateUser(user)
        .then(() => {
          console.log("User updated successfully");
        })
        .catch((error) => {
          console.error("Error updating user:", error);
        });
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F3F0]">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-[#331A15] mb-6">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-[#331A15] text-sm font-medium mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D2B48C]"
            />
          </div>
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
              placeholder="Create a password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D2B48C]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#D2B48C] text-white py-2 px-4 rounded-md hover:bg-[#b89c77] transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-[#D2B48C] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
