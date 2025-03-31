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
    const { setTokenA, setTokenB, setLastUpdateTimestamp, setProfileContext, setLemmyContext } = useAuth();
    const [isOpen, setIsOpen] = useState(true);

    function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const { username, password } = Object.fromEntries(formData);

        loginWithTokens(username.toString(), password.toString());

    }

    async function loginWithTokens(username: string, password: string) {
        const tokenA = logIn(username, password);
        const tokenB = tokenA.then(() => new Promise(resolve => setTimeout(resolve, 2000)))
            .then(() => logIn(username, password));

        const [resolvedTokenA, resolvedTokenB] = await Promise.all([tokenA, tokenB]);

        if (resolvedTokenA && resolvedTokenB) {
            setTokenA(resolvedTokenA);
            setTokenB(resolvedTokenB);
            setLastUpdateTimestamp(Date.now());
            setIsOpen(false);

            localStorage.setItem("tokenA", resolvedTokenA);
            localStorage.setItem("tokenB", resolvedTokenB);
            localStorage.setItem("tokenTimestamp", Date.now().toString());

            setProfileContext();
            setLemmyContext();
        }
        else {
            window.alert("Log in failed");
        }
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
