import { useLocation, useNavigate } from "react-router-dom";
import { ArrowBigLeft, House } from "lucide-react";

export function BackButton() {
    const location = useLocation();
    const navigate = useNavigate();
    return <button className="btn-back" onClick={() => {
        if (location.key === "default") return;
        else navigate(-1)
    }}><ArrowBigLeft /></button>;
}

export function HomeButton() {
    const navigate = useNavigate();
    return <button onClick={() => navigate("/")}><House /></button>;
}