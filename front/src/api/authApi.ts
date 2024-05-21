import {LoginUser} from "../types/api/authType.ts";
import {BASE_URL} from "../config/axios.ts";
import axios from "axios";

export const loginApi = async (user: LoginUser) => {
    return await axios.post(BASE_URL + "/auth/login", user)
}

export const logoutApi = async (refreshToken: string) => {
    return await axios.post(BASE_URL + "/auth/logout", {refresh_token: refreshToken})
}