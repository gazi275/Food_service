import axios from "axios";

const API_END_POINT = "https://food-service-server-alpi.vercel.app/api/v1/user";

// Create an Axios instance
const api = axios.create({
  baseURL: API_END_POINT,
  withCredentials: true, // Allow cookies
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
