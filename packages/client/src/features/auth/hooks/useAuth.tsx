import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import { apiClient } from "../../../lib/apiClient";
import { ENDPOINTS, TOKEN_KEY, USER_KEY } from "../../../lib/constants";
import {
    type LoginInput,
    type RegisterInput,
    type AuthResponse,
    type PublicUser,
} from "@web-nebengits/shared";

// 1. Define the Context Shape (Exported for clarity)
export interface AuthContextType {
    user: PublicUser | null;
    login: (input: LoginInput) => Promise<void>;
    register: (input: RegisterInput) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

// 2. Create the Context
// We export it so it can be imported if absolutely necessary, but usually useAuth is enough
export const AuthContext = createContext<AuthContextType | null>(null);

// 3. The Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<PublicUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on load
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem(TOKEN_KEY);
            if (token) {
                try {
                    const { data } = await apiClient.get<{ data: PublicUser }>(
                        ENDPOINTS.AUTH.ME
                    );
                    setUser(data.data);
                } catch (error) {
                    console.error("Session expired", error);
                    localStorage.removeItem(TOKEN_KEY);
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = async (input: LoginInput) => {
        const { data } = await apiClient.post<{ data: AuthResponse }>(
            ENDPOINTS.AUTH.LOGIN,
            input
        );
        localStorage.setItem(TOKEN_KEY, data.data.token);
        setUser(data.data.user);
    };

    const register = async (input: RegisterInput) => {
        const { data } = await apiClient.post<{ data: AuthResponse }>(
            ENDPOINTS.AUTH.REGISTER,
            input
        );
        localStorage.setItem(TOKEN_KEY, data.data.token);
        setUser(data.data.user);
    };

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, login, register, logout, isLoading }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// 4. The Hook
// Explicitly return AuthContextType, which is the SHAPE of the context value
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
