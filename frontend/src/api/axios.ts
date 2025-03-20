import axios from "axios";
import { config } from "../config/environment";

const api = axios.create({
  baseURL: `${config.apiUrl}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // We just reject the error and let components handle the error message display
    return Promise.reject(error);
  }
);

export default api;
