import {ReactNode} from "react";

export interface LoginUser {
    email: string;
    password: string;
}

export interface AuthProviderProps {
    children: ReactNode;
}

export interface AuthContextProps {
    token: string | null;
    refreshToken: string | null;
    setToken: (token: string) => void;
    setRefreshToken: (token: string) => void;
    logout: () => void;
}

export const authContextDefault: AuthContextProps = {
    token: null,
    refreshToken: null,
    setToken: () => null,
    setRefreshToken: () => null,
    logout: () => null
}