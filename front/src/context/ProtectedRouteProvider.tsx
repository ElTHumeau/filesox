import {useAuth} from "./AuthContext.tsx";
import {Outlet, useNavigate} from "react-router-dom";
import {useEffect} from "react";

export function ProtectedRouteProvider() {
    const {token} = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            navigate('/login')
        }
    }, [token])

    return <>
        <Outlet/>
    </>
}