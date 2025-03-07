import { useNavigate } from "react-router-dom";
import { House } from "lucide-react";

export default function HomeButton() {
    const navigate = useNavigate();
    return <button onClick={() => navigate("/")}><House/></button>;
}