import {useUserStore} from "../stores/useStore.ts";
import {useLocalStorage} from "./useLocalStorage.ts";
import {loginApi, logoutApi, refreshTokenApi} from "../api/authApi.ts";
import {jwtDecode} from "jwt-decode";

export enum AuthEnum {
    TOKEN = 'token',
    REFRESH_TOKEN = 'refresh_token'
}

export function useAuth() {
    const {setUser} = useUserStore();
    const {getItem, setItem, removeItem} = useLocalStorage();

    const authenticate = async (email: string, password: string) => {
        const response = await loginApi({email, password});
        setItem(AuthEnum.TOKEN, response.data.token);
        setItem(AuthEnum.REFRESH_TOKEN, response.data.refresh_token);

        setUser(jwtDecode(response.data.token));

        return response.data.token;
    }

    const logout = async () => {
        const refreshToken = getItem(AuthEnum.REFRESH_TOKEN);

        if (!refreshToken) return;

        removeItem(AuthEnum.TOKEN);
        removeItem(AuthEnum.REFRESH_TOKEN);
        setUser(undefined);

        try {
            await logoutApi(refreshToken);
        } catch (e) {
            console.log(e);
        }
    }

    const refreshToken = async () => {
        const refreshToken = getItem(AuthEnum.REFRESH_TOKEN);

        if (!refreshToken) return;

        try {
            const response = await refreshTokenApi(refreshToken);
            setItem(AuthEnum.TOKEN, response.data.token);
            setItem(AuthEnum.REFRESH_TOKEN, response.data.refreshToken);

            return response.data.token;
        } catch (e) {
            console.debug(e)
            return null
        }
    }

    return {
        authenticate,
        logout,
        refreshToken,
    }
}