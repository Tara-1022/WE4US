import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function ProtectedRoute(){
    const {isLoggedIn} = useAuth();
    if (!isLoggedIn){
        window.alert("You have to log in to view that page!");
        return <Navigate to="/home" />;
    }
    return <Outlet />;
}