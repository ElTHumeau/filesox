import {Navigate, Outlet} from "react-router-dom";
import {useAuthStore} from "../../stores/useAuthStore.ts";

export function ProtectedRouteProvider() {
    const {user} = useAuthStore()

    if (!user) {
        return <Navigate to="/login"/>
    }

    return <>
        <Outlet/>
    </>
}