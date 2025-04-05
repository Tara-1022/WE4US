import Modal from "react-modal";
import { logIn } from "../library/LemmyApi";
import { useAuth } from "./AuthProvider";
import { useState } from "react";
import "../styles/LoginModal.css"; 

export default function LoginModal() {
  const { token, setToken } = useAuth();
  const [isOpen, setIsOpen] = useState(token == null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    logIn(username, password).then((jwt) => {
      if (jwt) {
        setToken(jwt);
        setIsOpen(false);
      } else {
        window.alert("Log in failed");
      }
    });
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      className="modal-content"
      overlayClassName="modal-overlay"
      contentLabel="Login"
    >
      <div className="modal-container">
        <h2 className="modal-heading">Welcome Back</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="modal-label">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="modal-input"
            />
          </div>
          <div>
            <label htmlFor="password" className="modal-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="modal-input"
            />
          </div>
          <button type="submit" className="modal-button">
            Sign In
          </button>
        </form>
      </div>
    </Modal>
  );
}
