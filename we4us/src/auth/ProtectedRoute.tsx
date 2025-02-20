import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function ProtectedRoute(){
    const {token} = useAuth();
    if (!token){
        window.alert("You have to log in to view that page!");
        return <Navigate to="/login" />;
    }
    return <Outlet />;
}