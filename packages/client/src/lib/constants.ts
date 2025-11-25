export const TOKEN_KEY = "token";
export const USER_KEY = "user";

export const ENDPOINTS = {
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        ME: "/users/me",
    },
    RIDES: {
        LIST: "/rides",
        CREATE: "/rides",
        DETAIL: (id: string) => `/rides/${id}`,
        BOOK: (id: string) => `/rides/${id}/book`,
        VERIFY: (id: string) => `/rides/${id}/verify`,
    },
};
