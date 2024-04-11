import * as axios from "axios";
import {useLocalStorage} from "../hooks/useLocalStorage.ts";
import {AuthEnum, useAuth} from "../context/AuthContext.tsx";
import {logoutUserfn, refreshTokenfn} from "../api/authApi.ts";

export const BASE_URL = "http://localhost:8080";

export const API = axios.default.create({
    baseURL: BASE_URL,
});

API.defaults.headers.post["Content-Type"] = "application/json";

// Add a request interceptor
API.interceptors.request.use(
    (config) => {
        const {getItem} = useLocalStorage();
        const token = getItem(AuthEnum.TOKEN);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// on catch error, if status code is 403, then refresh token
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const baseRequest = error.config

        const {setToken, setRefreshToken} = useAuth();
        const {getItem} = useLocalStorage()

        if (error.response.status === 401 && baseRequest._retry) {
            baseRequest._retry = true;

            try {
                const access_token = getItem(AuthEnum.TOKEN);

                if (access_token) {
                    const response = await refreshTokenfn(getItem(AuthEnum.RESET_TOKEN)!!);
                    setToken(response.data.token);
                    setRefreshToken(response.data.refreshToken);
                }

                return await API.request(baseRequest);
            } catch (e) {
                await logoutUserfn(getItem(AuthEnum.RESET_TOKEN)!!);
                return Promise.reject(e);
            }
        }

        await logoutUserfn(getItem(AuthEnum.RESET_TOKEN)!!);
        return Promise.reject(error);
    }
);

