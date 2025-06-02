import axios from "axios";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Track pending requests to prevent duplicates
const pendingRequests = new Map();

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Create a request identifier
    const requestId = `${config.method}-${config.url}`;

    // Check if this exact request is already pending
    if (pendingRequests.has(requestId)) {
      const timestamp = pendingRequests.get(requestId);
      const now = Date.now();

      // If the same request was made less than 500ms ago, cancel this one
      if (now - timestamp < 500) {
        console.log(`Cancelling duplicate request: ${requestId}`);
        const controller = new AbortController();
        config.signal = controller.signal;
        controller.abort("Duplicate request cancelled");
        return config;
      }
    }

    // Mark this request as pending
    pendingRequests.set(requestId, Date.now());

    // Try to get the user data from localStorage
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        const token = user.accessToken;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error("Error setting auth token:", error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Remove from pending requests on completion
    const requestId = `${response.config.method}-${response.config.url}`;
    pendingRequests.delete(requestId);
    return response;
  },
  (error) => {
    // Remove from pending requests on error
    if (error.config) {
      const requestId = `${error.config.method}-${error.config.url}`;
      pendingRequests.delete(requestId);
    }

    // Handle common errors here
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response error:", error.response.data);

      // Handle 401 Unauthorized - could redirect to login
      if (error.response.status === 401) {
        console.log("Unauthorized, redirecting to login...");
        // You could add redirection logic here
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Request error:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
