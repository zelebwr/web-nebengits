import axios from "axios";

// Use relative path because Vite proxy handles the /api -> localhost:5000 mapping
export const API_BASE_URL = "/api";

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor: Attach Token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 (Unauthorized)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // If token is invalid, force logout
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            if (
                window.location.pathname !== "/login" &&
                window.location.pathname !== "/register"
            ) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);
