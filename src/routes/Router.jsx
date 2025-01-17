import { createBrowserRouter } from "react-router-dom";
import Main from "../layouts/Main";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Home from "../pages/Home";
import AdminProfile from "../components/Dashboard/Profile";
import ManageUsers from "../components/Dashboard/ManageUsers";
import AddMeal from "../components/Dashboard/AddMeal";
import AllMeals from "../components/Dashboard/AllMeals";
import AllReviews from "../components/Dashboard/AllReviews";
import UpcomingMeals from "../components/Dashboard/UpcomingMeals";
import DashboardLayout from "../layouts/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "auth",
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "signup",
            element: <SignUp />,
          },
        ],
      },
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <AdminProfile />,
          },
          {
            path: "manage-users",
            element: <ManageUsers />,
          },
          {
            path: "add-meal",
            element: <AddMeal />,
          },
          {
            path: "all-meals",
            element: <AllMeals />,
          },
          {
            path: "all-reviews",
            element: <AllReviews />,
          },
          {
            path: "upcoming-meals",
            element: <UpcomingMeals />,
          },
        ],
      },
    ],
  },
]);
