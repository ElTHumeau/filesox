import * as axios from "axios";
import {useLocalStorage} from "../hooks/useLocalStorage.ts";
import {AuthEnum, useAuth} from "../hooks/useAuth.ts";

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

// on catch error, if status code is 401, then refresh token
API.interceptors.response.use(
    (res) => res,
    async (error) => {
        const baseReq = error.config
        const {logout, refreshToken} = useAuth()

        if (error.response && error.response.status === 401 && !baseReq._retry) {
            baseReq._retry = true

            try {
                const accessToken = await refreshToken()
                if (accessToken == null) {
                    await logout()
                    return Promise.reject(error)
                }

                baseReq.headers.Authorization = `Bearer ${accessToken}`

                return API(baseReq)
            } catch (e) {
                await logout()
                return Promise.reject(error)
            }
        }

        await logout()
        return Promise.reject(error)
    }
)


