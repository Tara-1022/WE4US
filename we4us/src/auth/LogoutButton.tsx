import { logOut } from "../library/LemmyApi";
import { useAuth } from "./AuthProvider";

export default function LogoutButton() {
    const { logout } = useAuth();
    function handleLogout(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        logOut().then(
            (success) => {
                if (success) {
                    logout();
                }
                else {
                    window.alert("There was an issue logging out. Please try again after a bit.")
                }
            }
        );
    }

    return (
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
    )
}