import axios from "axios";

export const useAxiosPublic = () =>
  axios.create({
    baseURL: "https://server-nine-pearl.vercel.app",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    withCredentials: true,
  });
