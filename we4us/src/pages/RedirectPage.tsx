import { useNavigate } from "react-router-dom"

let pageStyle: React.CSSProperties = {
        textAlign: "center",
        verticalAlign: "middle",
        marginTop: "30vh",
        height: "100%",
        width: "100%"
}

function RedirectPage() {
    const navigate = useNavigate()
    return (
        <div className="p-6" style={pageStyle}>
            <b>Nothing to see here!</b>
            <br />
            <button
                onClick={() => navigate("/home")}
            >
                Go home
            </button>
        </div>
    )
}

export default RedirectPage