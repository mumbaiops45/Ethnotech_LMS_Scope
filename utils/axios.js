import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:8080/",
  baseURL: "https://ethnotechbackend-1.onrender.com",
  // baseURL:"https://ethnotechbackend-1.onrender.com"
});

// ✅ attach token automatically
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;