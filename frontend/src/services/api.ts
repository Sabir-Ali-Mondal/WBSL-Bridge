import axios from "axios";
import { ApiError } from "@/lib/types";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: ApiError = {
      detail:
        error.response?.data?.detail ||
        error.message ||
        "An unexpected error occurred.",
      code: error.response?.data?.code,
    };
    return Promise.reject(apiError);
  }
);

export default apiClient;
