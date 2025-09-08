import { getCookie, removeCookie } from "@/utils/cookies";
import axios, { AxiosInstance } from "axios";
import { redirect } from "next/navigation";

const instance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

instance.interceptors.request.use(
  (config) => {
    const token = getCookie("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      removeCookie("authToken");
      redirect("/login");
    }
    return Promise.reject(error);
  }
);

export default instance;
