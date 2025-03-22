import { useLocation, useNavigate } from "react-router-dom";
import { ArrowBigLeft } from "lucide-react";

export function BackButton() {
    const location = useLocation();
    const navigate = useNavigate();
    return <button className="btn-back" onClick={() => {
        if (location.key === "default") return;
        else navigate(-1)
    }}><ArrowBigLeft /></button>;
}
