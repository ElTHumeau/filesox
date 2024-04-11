import {createContext, FC, useContext, useEffect, useState} from "react";
import {authContextDefault, AuthContextProps, AuthProviderProps} from "../types/api/authType.ts";
import {useLocalStorage} from "../hooks/useLocalStorage.ts";
import {API} from "../config/axios.ts";


export enum AuthEnum {
    TOKEN = 'token',
    RESET_TOKEN = 'reset-token'
}

export const AuthContext = createContext<AuthContextProps>(authContextDefault)

export const AuthProvider: FC<AuthProviderProps>  = ({children}) => {
    const {setItem, getItem, removeItem} = useLocalStorage()
    const [token, setToken_] = useState<string | null>(getItem(AuthEnum.TOKEN) || null)
    const [refreshToken, setRefreshToken_] = useState<string | null>(getItem(AuthEnum.RESET_TOKEN) || null)


    const setToken = (token: string | null) => {
        setToken_(token)
    }

    const setRefreshToken = (refreshToken: string | null) => {
        setRefreshToken_(refreshToken)
    }

    const logout = () => {
        removeItem(AuthEnum.TOKEN)
        removeItem(AuthEnum.RESET_TOKEN)
        API.defaults.headers.common['Authorization'] = null
    }

    useEffect(() => {
        if (token) {
            API.defaults.headers.common['Authorization'] = `Bearer ${token}`
            setItem(AuthEnum.TOKEN, token)
            setItem(AuthEnum.RESET_TOKEN, refreshToken!!)
        } else {
            logout()
        }
    }, [token])

    return <AuthContext.Provider value={{ token, refreshToken, setToken, setRefreshToken, logout}}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => {
    const {setRefreshToken, setToken, logout, token, refreshToken} = useContext(AuthContext);
    return  {setRefreshToken, setToken, logout, token, refreshToken}
}
