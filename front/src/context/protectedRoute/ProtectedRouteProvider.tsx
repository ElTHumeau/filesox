import {Navigate, Outlet} from "react-router-dom";
import {AuthEnum, AuthState, useAuth} from "../../hooks/useAuth.ts";

export function ProtectedRouteProvider() {
    const {status, user, refreshToken} = useAuth()

    if (!user || status === AuthState.Guest || localStorage.getItem(AuthEnum.REFRESH_TOKEN) === null) {
        return <Navigate replace to="/login"/>
    }

    if (status === AuthState.Unknown) {
        refreshToken();
        return <div>Loading...</div>
    }

    return <>
        <Outlet/>
    </>
}