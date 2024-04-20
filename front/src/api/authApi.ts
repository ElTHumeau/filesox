import {LoginUser} from "../types/api/authType.ts";
import {API, BASE_URL} from "../config/axios.ts";

export const loginApi = async (user: LoginUser) => {
    return await API.post(BASE_URL + "/auth/login", user)
}

export const logoutApi = async (refreshToken: string) => {
    return await API.post(BASE_URL + "/auth/logout", {refresh_token: refreshToken})
}

export const refreshTokenApi = async (refreshToken: string) => {
    return await API.post(BASE_URL + "/auth/refresh", {refresh_token: refreshToken})
}