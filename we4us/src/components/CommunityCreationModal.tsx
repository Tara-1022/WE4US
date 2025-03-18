import React, { useState } from "react";
import Modal from "react-modal";
import { createCommunity } from "../library/LemmyApi";
import { CommunityView } from "lemmy-js-client";

interface CommunityCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCommunityCreated: (newCommunity: CommunityView) => void;
}

function isTitleValid(title: string) {
    const titleRegex = /^[A-Za-z0-9_ !\*&#\.,\?<>;:'"\[\]\{}\|\-_\=\+\\]{3,100}$/;
    return titleRegex.test(title);
};

function isNameValid(name: string) {
    // While the official UI disallows uppercase characters, the backend handles it fine.
    // Still, let's disallow uppercase just in case
    const nameRegex = /^[a-z0-9_]{3,500}$/;
    return nameRegex.test(name);
};

const CommunityCreationModal: React.FC<CommunityCreationModalProps> = ({ isOpen, onClose, onCommunityCreated }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function isContentValid(name: string, title: string) {
        // As per https://github.com/LemmyNet/lemmy-js-client/blob/4eda61b6fd2b62d83e22616c14f540e4f57427c2/src/types/CreateCommunity.ts#L8
        // And specifically https://github.com/LemmyNet/lemmy-ui/blob/release/v0.19/src/shared/components/community/community-form.tsx
        if (!isNameValid(name)) {
            setError("Community name must be 3-100 characters long, contain underscore, lowercase letters and numbers");
            return false;
        }
        if (!isTitleValid(title)) {
            setError("Title must be a single line 3-500 characters long. Regular punctuation allowed.");
            return false;
        }
        setError("");
        return true;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        let { name, title } = Object.fromEntries(formData);
        console.log(formData)
        name = name.toString().trim();
        title = title.toString().trim();

        if (!isContentValid(name, title)) {
            setLoading(false);
            return;
        }

        createCommunity({
            name: name.toString(), title: title.toString()
        })
            .then(
                (newCommunity) => {
                    window.alert("Community created");
                    onCommunityCreated(newCommunity);
                    onClose();
                }
            )
            .catch((error) => {
                setError("Error creating community: " + error);
            })
        setLoading(false);
    };


    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Create Community"
            style={{
                overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
                content: {
                    top: "50%",
                    left: "50%",
                    right: "auto",
                    bottom: "auto",
                    marginRight: "-50%",
                    transform: "translate(-50%, -50%)",
                    padding: "20px",
                    background: "white",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    color: 'black'
                },
            }}
        >
            <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
                <h3>Create Community</h3>
                {error && <p style={{ color: "red" }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Community Name (must be unique): </label>
                    <input type="text" name="name" required />
                    <br />
                    <label htmlFor="title">Community Title (treat as description):  </label>
                    <textarea name="title" required />
                    <br />
                    <button type="submit" disabled={loading} style={{ marginTop: "10px", padding: "10px 15px", cursor: "pointer" }}>
                        {loading ? "Creating..." : "Create"}
                    </button>

                    <button onClick={onClose} style={{ marginTop: "10px", padding: "10px 15px", cursor: "pointer", background: "#ccc", color: "black" }}>
                        Cancel
                    </button>
                </form>
            </div>
        </Modal>
    );
};

export default CommunityCreationModal;