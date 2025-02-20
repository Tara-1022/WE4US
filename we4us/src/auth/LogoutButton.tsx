import { logOut } from "../library/LemmyApi";
import { useAuth } from "./AuthProvider";

export default function LogoutButton() {
    const { setToken } = useAuth();

    function handleLogout(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        logOut().then(
            (success) => {
                if (success) {
                    setToken(null);
                    window.alert("Logout successful");
                }
                else {
                    window.alert("There was an issue logging out. Please try again after a bit.")
                }
            }
        );
    }

    return (
        <button onClick={handleLogout}>Log out</button>
    )
}