import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useAxiosPublic } from "../Hooks/useAxiosPublic";
import Swal from "sweetalert2";

export default function SignUp() {
  const { createUser, updateUser, signInWithGoogle } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!name || !email || !password) {
      Swal.fire("Error", "All fields are required", "error");
      return;
    }

    createUser(email, password)
      .then(() => {
        const user = { name };
        // Update on Firebase
        updateUser(user)
          .then(() => {
            console.log("User updated successfully");

            // Update on backend
            const newUser = {
              name,
              email,
              role: "Bronze",
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            axiosPublic
              .post("/users", newUser)
              .then((res) => {
                if (res.data.insertedId) {
                  Swal.fire("Success", "User added successfully", "success");
                  form.reset();
                  navigate("/");
                }
              })
              .catch((error) => {
                console.error("Error adding user:", error);
              });
          })
          .catch((error) => {
            console.error("Error updating user:", error);
          });
      })
      .catch((error) => {
        Swal.fire("Error", error.message, "error");
      });
  }

  async function handleGoogleLogin() {
    try {
      signInWithGoogle()
        .then((result) => {
          const user = {
            name: result.user.displayName,
            email: result.user.email,
            role: "Bronze",
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          axiosPublic
            .post("/users", user)
            .then((res) => {
              if (res.data.insertedId) {
                Swal.fire("Success", "User added successfully", "success");
              }
            })
            .catch((error) => {
              console.error("Error adding user:", error);
            });

          Swal.fire("Success", "Login Successful", "success");
          navigate("/");
        })
        .catch((error) => {
          Swal.fire("Error", error.message, "error");
        });
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
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
              name="name"
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
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
              name="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
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
              name="password"
              placeholder="Create a password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
          >
            Sign Up
          </button>
        </form>

        <div className="flex items-center justify-center mt-4">
          <span className="border-t border-gray-300 flex-grow"></span>
          <span className="mx-4 text-gray-600">or</span>
          <span className="border-t border-gray-300 flex-grow"></span>
        </div>
        <button
          className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          onClick={handleGoogleLogin}
        >
          Google
        </button>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-green-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
