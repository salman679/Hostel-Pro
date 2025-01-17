import axios from "axios";

export const useAxiosPublic = () =>
  axios.create({
    baseURL: "http://localhost:5000",
  });
