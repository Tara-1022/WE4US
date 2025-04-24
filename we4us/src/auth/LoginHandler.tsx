import Modal from "react-modal";
import { logIn, requestPasswordReset } from "../library/LemmyApi";
import { useAuth } from "./AuthProvider";
import { useState } from "react";
import "../styles/LoginModal.css";
import { Link } from "react-router-dom";

export function LoginButton() {
  const [showModal, setShowModal] = useState(false);
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) return <button className="landing-btn"
    onClick={() => window.alert("Already logged in!")}>
    Log in
  </button>

  return (
    <>
      <button className="landing-btn" onClick={() => setShowModal(!showModal)}>
        Log in
      </button>
      <LoginModal
        isOpen={showModal}
        handleClose={() => setShowModal(false)}
      />
    </>
  );
}
export function LoginModal({ isOpen, handleClose }: { isOpen: boolean, handleClose: () => void }) {
  const { setToken } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(""); 
  const [isForgotPassword, setIsForgotPassword] = useState(false); 

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    logIn(username, password).then((jwt) => {
      if (jwt) {
        setToken(jwt);
      } else {
        window.alert("Log in failed");
      }
    });
  }
  
  function handlePasswordReset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    requestPasswordReset(email).then((success) => {
      if (success) {
        setStatus("If this email exists, a reset link has been sent.");
      } else {
        setStatus("Password reset failed. Please try again.");
      }
    });
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className="modal-content"
      overlayClassName="modal-overlay"
      contentLabel="Login"
      shouldCloseOnOverlayClick={true}
    >
      <div className="modal-container">
        <h2 className="modal-heading">{isForgotPassword ? "Forgot Password" : "Welcome Back"}</h2>

        {!isForgotPassword ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="modal-label">Username</label>
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
              <label htmlFor="password" className="modal-label">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="modal-input"
              />
              <div className="text-right">
                <button
                  type="button"
                  className="forgot-password-link"
                  onClick={() => setIsForgotPassword(true)}
                >
                  Forgot password?
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-danger">Log In</button>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <label htmlFor="email" className="modal-label">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="modal-input"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Send Reset Link</button>
            {status && <p className="status-message">{status}</p>}
          </form>
        )}
      </div>
    </Modal>
  );
}