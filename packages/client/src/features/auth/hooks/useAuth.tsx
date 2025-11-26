import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { apiClient } from "../../../lib/apiClient";
import {
    type PublicUser,
    type AuthResponse,
    type LoginInput,
} from "@web-nebengits/shared";

interface AuthContextType {
    user: PublicUser | null;
    token: string | null;
    isLoading: boolean;
    login: (data: LoginInput) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>; // New function
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<PublicUser | null>(null);
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    );
    const [isLoading, setIsLoading] = useState(true);

    // Function to fetch current user data
    const fetchUser = async () => {
        try {
            const { data } = await apiClient.get<{ data: PublicUser }>(
                "/users/me"
            );
            setUser(data.data);
        } catch (error) {
            console.error("Failed to fetch user", error);
            logout();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            apiClient.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${token}`;
            fetchUser();
        } else {
            setIsLoading(false);
        }
    }, [token]);

    const login = async (input: LoginInput) => {
        const { data } = await apiClient.post<AuthResponse>(
            "/auth/login",
            input
        );
        localStorage.setItem("token", data.data.token);
        setToken(data.data.token);
        setUser(data.data.user);
        apiClient.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${data.data.token}`;
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        delete apiClient.defaults.headers.common["Authorization"];
    };

    // Expose fetchUser as refreshUser
    const refreshUser = async () => {
        if (token) await fetchUser();
    };

    return (
        <AuthContext.Provider
            value={{ user, token, isLoading, login, logout, refreshUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
