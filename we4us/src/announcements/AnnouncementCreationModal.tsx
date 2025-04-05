import { useState } from "react";
import Modal from "react-modal";
import { createPost } from "../library/LemmyApi";
import { ANNOUNCEMENTS_COMMUNITY_ID } from "../constants";

interface PostCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPostCreated: (newPost: any) => void;
}

const PostCreationModal: React.FC<PostCreationModalProps> = ({ isOpen, onClose, onPostCreated }) => {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const { title, body } = Object.fromEntries(formData);

        createPost({
            name: title.toString(),
            body: body.toString(),
            community_id: ANNOUNCEMENTS_COMMUNITY_ID
        })
            .then(
                (createdPost) => {
                    onPostCreated(createdPost);
                    onClose();
                })
            .catch((error) =>
                console.error("Error creating post:", error))
            .finally(() =>
                setLoading(false))
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => onClose()}
            contentLabel="Create Announcement"
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
                    color: "black"
                    // TODO: Update color from theme, not hardcoded
                },
            }}
        >
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title: </label>
                <input type="text" name="title" placeholder="Title" required />
                <br />
                <label htmlFor="body">Body: </label>
                <textarea name="body" placeholder="Body" required />
                <div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Create"}
                    </button>
                    <button type="reset" onClick={() => onClose()}>
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default PostCreationModal;
