import {Navigate, Outlet} from "react-router-dom";
import {AuthState, useAuth} from "../../hooks/useAuth.ts";

export function ProtectedRouteProvider() {
    const {status, user} = useAuth()

    if (!user || status === AuthState.Guest || status === AuthState.Unknown) {
        return <Navigate replace to="/login"/>
    }

    return <>
        <Outlet/>
    </>
}