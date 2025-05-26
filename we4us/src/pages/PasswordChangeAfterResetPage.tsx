import { useNavigate, useParams } from "react-router-dom";
import { changePasswordAfterReset } from "../library/LemmyApi";
import { useState } from "react";
import '../styles/PasswordChangeAfterResetPage.css'

export default function PasswordChangeAfterResetPage() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const reset_token = useParams().reset_token;
    const navigate = useNavigate();

    async function handleChangePassword(e: React.FormEvent) {
        e.preventDefault();

        if (!reset_token) {
            window.alert("The link does not have token. Redirecting.");
            navigate("/");
            return;
        }

        setError(null);

        if (newPassword.length < 10 || newPassword.length > 60) {
            setError("Password length should be between 10 to 60 char");
            return;
        }

        if (!newPassword || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New password and confirmation do not match.");
            return;
        }

        setIsProcessing(true);
        const result = await changePasswordAfterReset({
            token: reset_token,
            password: newPassword,
            password_verify: confirmPassword
        });
        if (result.success) {
            window.alert("Password updated successfully!");
            navigate("/");
        } else {
            window.alert("Password change failed. Check browser logs for details. Contact admins if the issue persists.");
        }
        setIsProcessing(false);
    }

    return <div className="password-change-reset-page">
        <h2>Password Reset</h2>
        <form onSubmit={handleChangePassword} >
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
            <button type="submit" className="reset-password" disabled={isProcessing}>
                {isProcessing ? "Saving..." : "Reset Password"}
            </button>
        </form>
    </div>
}