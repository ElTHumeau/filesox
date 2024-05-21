import * as axios from "axios";
import {useAuth} from "../context/modules/AuthContext.tsx";
import {refreshTokenApi} from "../api/authApi.ts";
import {jwtDecode} from "jwt-decode";
import {UserType} from "../types/api/userType.ts";
import {useUserStore} from "../stores/useUserStore.ts";

export enum AuthEnum {
    TOKEN = 'token',
    REFRESH_TOKEN = 'refresh_token'
}

export const BASE_URL = "http://localhost:8080";

export const useAxios = () => {
    const {token, refreshToken, setToken, setRefreshToken, logout} = useAuth()
    const {setUser} = useUserStore()

    const axiosInstance = axios.default.create({
        baseURL: BASE_URL,
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    axiosInstance.defaults.headers.post["Content-Type"] = "application/json";

    axiosInstance.interceptors.request.use(
        (config) => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        },
        (error) => Promise.reject(error)
    )

    axiosInstance.interceptors.response.use(
        (res) => res,
        async (error) => {
            const baseReq = error.config

            if (error.response && error.response.status === 401 && !baseReq._retry) {
                baseReq._retry = true

                try {
                    const response = await fetch(BASE_URL + "/auth/refresh", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({refresh_token: refreshToken})
                    })

                    let json = await response.json()

                    if (token == null) {
                        await logout()
                        return Promise.reject(error)
                    }

                    localStorage.setItem(AuthEnum.TOKEN, json.token)
                    localStorage.setItem(AuthEnum.REFRESH_TOKEN, json.refresh_token)

                    setToken(json.token)
                    setRefreshToken(json.refresh_token)

                    let user = jwtDecode<UserType>(json.token)
                    setUser(user)

                    baseReq.headers.Authorization = `Bearer ${token}`

                    return axiosInstance(baseReq)
                } catch (e) {
                    await logout()
                    return Promise.reject(error)
                }
            }

            await logout()
            return Promise.reject(error)
        }
    )

    return axiosInstance
}


