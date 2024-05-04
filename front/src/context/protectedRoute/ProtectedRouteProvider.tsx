import {Navigate, Outlet} from "react-router-dom";
import {AuthState, useAuth} from "../../hooks/useAuth.ts";

export function ProtectedRouteProvider() {
    const {status, user, refreshToken} = useAuth()

    if (status === AuthState.Unknown) {
        refreshToken();
        return <div>Loading...</div>
    }

    if (!user || status === AuthState.Guest) {
        return <Navigate replace to="/login"/>
    }

    return <>
        <Outlet/>
    </>
}