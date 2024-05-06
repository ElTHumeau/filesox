import {loginApi, logoutApi, refreshTokenApi} from "../api/authApi.ts";
import {jwtDecode} from "jwt-decode";
import {API} from "../config/axios.ts";
import {useUserStore} from "../stores/useUserStore.ts";
import {FilePaths} from "./useLocalStorage.ts";
import {UserType} from "../types/api/userType.ts";

export enum AuthEnum {
    TOKEN = 'token',
    REFRESH_TOKEN = 'refresh_token'
}

export enum AuthState {
    Unknown = 0,
    Authenticated = 1,
    Guest = 2,
}

export function useAuth() {
    const {user, setUser} = useUserStore();
    let status;

    switch (user) {
        case null :
            status = AuthState.Guest
            break
        case undefined :
            status = AuthState.Unknown
            break
        default :
            status = AuthState.Authenticated
            break
    }

    const authenticate = async (email: string, password: string) => {
        const response = await loginApi({email, password});
        localStorage.setItem(AuthEnum.TOKEN, response.data.token);
        localStorage.setItem(AuthEnum.REFRESH_TOKEN, response.data.refresh_token);

        let user: UserType = jwtDecode(response.data.token);
        setUser(user);
        localStorage.setItem(FilePaths.path, user.file_path);

        return response.data.token;
    }

    const logout = async () => {
        const refreshToken = localStorage.getItem(AuthEnum.REFRESH_TOKEN);

        if (!refreshToken) return;

        localStorage.removeItem(AuthEnum.TOKEN);
        localStorage.removeItem(AuthEnum.REFRESH_TOKEN);
        setUser(null);

        try {
            await logoutApi(refreshToken);
        } catch (e) {
            console.log(e);
        }
    }

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(AuthEnum.REFRESH_TOKEN);

        if (!refreshToken) return;

        try {
            const response = await refreshTokenApi(refreshToken);
            localStorage.setItem(AuthEnum.TOKEN, response.data.token);
            localStorage.setItem(AuthEnum.REFRESH_TOKEN, response.data.refresh_token);

            // update user
            setUser(jwtDecode(response.data.token));
            return response.data.token;
        } catch (e) {
            console.debug(e)
            return null
        }
    }

    // intercept requests to add access token authorization
    API.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem(AuthEnum.TOKEN)

            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        },
        (error) => Promise.reject(error)
    )

    // intercept responses to handle token expiration
    API.interceptors.response.use(
        (res) => res,
        async (error) => {
            const baseReq = error.config

            if (error.response && error.response.status === 401 && !baseReq._retry) {
                baseReq._retry = true

                try {
                    const token = await refreshToken()

                    if (token == null) {
                        await logout()
                        return Promise.reject(error)
                    }

                    baseReq.headers.Authorization = `Bearer ${token}`

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


    return {
        user,
        status,
        setUser,
        authenticate,
        logout,
        refreshToken,
    }
}