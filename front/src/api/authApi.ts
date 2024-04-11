import {LoginUser} from "../types/api/authType.ts";
import {API, BASE_URL} from "../config/axios.ts";

export const loginUserfn = async (user: LoginUser) => {
    const response = await API.post(BASE_URL + "/auth/login", user)
    console.log(response)
    return response.data
}

export const logoutUserfn = async (refreshToken: string) => {
    const response = await API.post(BASE_URL + "/auth/logout", refreshToken)
    return response.data
}

export const refreshTokenfn = async (refreshToken: string) => {
    const response = await API.post(BASE_URL + "/auth/refresh", refreshToken)
    return response.data
}