import { useNavigate } from "react-router-dom";
import { ArrowBigLeft } from "lucide-react";

export default function BackButton() {
    const navigate = useNavigate();
    return <button onClick={() => navigate(-1)}><ArrowBigLeft/></button>;
}