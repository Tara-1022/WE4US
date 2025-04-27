import Modal from "react-modal";
import { changeUserPassword } from "../library/LemmyApi";
import { useState, useEffect } from "react";
import { useAuth } from "./AuthProvider";

export function ChangePasswordModal({
    isOpen,
    handleClose,
    onPasswordChange,
}: {
    isOpen: boolean;
    handleClose: () => void;
    onPasswordChange: (success: boolean) => void;
}) {
    const { setToken } = useAuth();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Effect to reset state when modal is closed
    useEffect(() => {
        if (!isOpen) {
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setError(null);
        }
    }, [isOpen]);

    async function handleChangePassword(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (newPassword.length < 10 || newPassword.length > 60) {
            setError("Password length should be between 10 to 60 char");
            return;
        }

        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (newPassword == oldPassword) {
            setError("New password must be different than old password");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New password and confirmation do not match.");
            return;
        }

        setIsProcessing(true);
        const token = localStorage.getItem("token");
        const result = await changeUserPassword(oldPassword, newPassword, confirmPassword, token?.toString());
        if (result.success && result.jwt) {
            localStorage.setItem("token", result.jwt);
            setToken(result.jwt);
            window.alert("Password changed successfully!");
            onPasswordChange(true);
            handleClose();
        } else {
            onPasswordChange(false);
            window.alert("Password change failed");
        }
        setIsProcessing(false);
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            className="modal-content"
            overlayClassName="modal-overlay"
            contentLabel="Change Password"
            shouldCloseOnOverlayClick={true}
        >
            <div className="modal-container">
                <h2 className="modal-heading">Change Password</h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label htmlFor="old_password" className="modal-label">Current Password</label>
                        <input
                            id="old_password"
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="modal-input"
                        />
                    </div>
                    <div>
                        <label htmlFor="new_password" className="modal-label">New Password</label>
                        <input
                            id="new_password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="modal-input"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirm_password" className="modal-label">Confirm New Password</label>
                        <input
                            id="confirm_password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="modal-input"
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="btn btn-danger" disabled={isProcessing}>
                        {isProcessing ? "Saving..." : "Change Password"}
                    </button>
                </form>
            </div>
        </Modal>
    );
}
