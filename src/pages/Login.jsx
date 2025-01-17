import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Swal from "sweetalert2";
import { useAxiosPublic } from "../Hooks/useAxiosPublic";

export default function Login() {
  const { login, signInWithGoogle } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const axiosPublic = useAxiosPublic();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const user = { email, password };

    if (!email) {
      setErrorMessage("Email is required");
      return;
    } else if (!password) {
      setErrorMessage("Password is required");
      return;
    }

    login(user)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          showConfirmButton: false,
          timer: 1500,
        });

        navigate("/");
        e.target.reset();
      })
      .catch((error) => {
        return Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      });
  };

  const handleGoogleLogin = () => {
    try {
      signInWithGoogle().then((res) => {
        Swal.fire("Success", "Login Successful", "success");

        //update on database
        axiosPublic
          .post("/users", {
            name: res.user.displayName,
            email: res.user.email,
            role: "Bronze",
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .then((res) => {
            console.log(res.data);
          });
      });
      navigate("/");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-[#331A15] mb-6">
          Login
        </h1>
        <form onSubmit={handleSubmit}>
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <p className="text-red-500 ">{errorMessage}</p>
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <p className="text-red-500 ">{errorMessage}</p>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 ring-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>

        <div className="flex items-center my-4">
          <div className="w-full border-t border-gray-300"></div>
          <span className="mx-2 text-gray-600">or</span>
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <button
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          onClick={handleGoogleLogin}
        >
          Google
        </button>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don&apos;t have an account?{" "}
          <Link to={"/auth/signup"} className="text-green-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
