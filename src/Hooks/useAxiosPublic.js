import axios from "axios";

export const useAxiosPublic = () =>
  axios.create({
    baseURL: "http://localhost:5000",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    withCredentials: true,
    validateStatus: function (status) {
      return status < 500;
    },
  });
