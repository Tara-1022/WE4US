import Modal from "react-modal";
import { logIn } from "../library/LemmyApi";
import { useAuth } from "./AuthProvider";
import { useState } from "react";

let styles = {
    modal: {
        overlay: {
        },
        content: {
            color: "black",
            height: "50%",
            aspectRatio: "1",
            alignContent: "center",
            margin: "auto"
        }
    },
    form: {

    }
}

// TODO: replace this with Oauth
// reference: https://github.com/LemmyNet/lemmy-ui/blob/93d6901abb1cf7a4cb365496dd556904d8334231/src/shared/components/home/login.tsx#L42
export default function LoginModal() {
    const {token, setToken} = useAuth();
    const [isOpen, setIsOpen] = useState(token == null);
    
    function handleLogin(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const {username, password} = Object.fromEntries(formData);
        logIn(username.toString(), password.toString()).then(
            jwt => {
                if(jwt){
                    setToken(jwt);
                    setIsOpen(false);
                }
                else{
                    window.alert("Log in failed");
                }
            }
        );
    }

    return (
        <Modal
            isOpen={isOpen}
            style={styles.modal}
            contentLabel="Login">
            <form onSubmit={handleLogin} style={styles.form}>
                <label htmlFor="username">UserName </label>
                <input name="username" />
                <br />
                <label htmlFor="password">Password </label>
                <input name="password" type="password" />
                <br />
                <button type="submit">Login</button>
            </form>
        </Modal>
    )
}