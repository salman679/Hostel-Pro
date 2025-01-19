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
import ErrorPage from "../pages/ErrorPage";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import MealDetail from "../components/Meals/Details";
import MealsPage from "../components/Meals/AllMeals";
import Payment from "../components/payment/Payment";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "meals",
        children: [
          {
            path: "",
            element: <MealsPage />,
          },
          {
            path: ":id",
            element: <MealDetail />,
          },
        ],
      },
      {
        path: "checkout/:id",
        element: <Payment />,
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
        element: (
          <PrivateRoute>
            <AdminRoute>
              <DashboardLayout />
            </AdminRoute>
          </PrivateRoute>
        ),
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
