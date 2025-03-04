import { useState } from "react";
import { createCommunity } from "../library/LemmyApi";
import Modal from "react-modal";

export default function CreateCommunityModal({ onCreate, isOpen, onClose }) {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name = formData.get("name")?.trim();
        const title = formData.get("title")?.trim();

        if (!name || !title) {
            setError("Community name and title are required");
            return;
        }

        setError("");
        setLoading(true);


        try {
            const data = await createCommunity(name, title);
            onCreate(data);
            event.target.reset();
        } catch {
            setError("Failed to create community.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Create Community">
            <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
                <h3>Create Community</h3>
                {error && <p style={{ color: "red" }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <label>
                        Community Name:
                        <input type="text" name="title" required style={{ width: "100%", padding: "8px", marginTop: "5px" }} />
                    </label>

                    <label>
                        Give a description for the community:
                        <input type="text" name="name" required style={{ width: "100%", padding: "8px", marginTop: "5px" }} />
                    </label>

                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <button type="submit" disabled={loading} style={{ marginTop: "10px", padding: "10px 15px", cursor: "pointer" }}>
                            {loading ? "Creating..." : "Create"}
                        </button>

                        <button onClick={onClose} style={{ marginTop: "10px", padding: "10px 15px", cursor: "pointer", background: "#ccc", color: "black" }}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

