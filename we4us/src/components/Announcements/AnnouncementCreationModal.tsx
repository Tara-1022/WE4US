import { useState } from "react";
import Modal from "react-modal";
import { createPost } from "../../library/LemmyApi";
import { useLemmyInfo } from "../../components/LemmyContextProvider";

export type AnnouncementData = {
    title: string,
    body: string
}

export function AnnouncementForm({ onSubmit, onClose, initialData }:
    { onSubmit: (data: AnnouncementData) => void, onClose: () => void, initialData?: AnnouncementData }) {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const { title, body } = Object.fromEntries(formData);

        onSubmit({ title, body } as AnnouncementData);
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="title">Title: </label>
            <input type="text" name="title" placeholder="Title" required
                defaultValue={initialData?.title || undefined} />
            <br />
            <label htmlFor="body">Body: </label>
            <textarea name="body" placeholder="Body" required
                defaultValue={initialData?.body || undefined} />
            <div>
                <button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create"}
                </button>
                <button type="reset">
                    Reset
                </button>
                <button onClick={onClose}>
                    Cancel
                </button>
            </div>
        </form>
    )
}

interface PostCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPostCreated: (newPost: any) => void;
}

const PostCreationModal: React.FC<PostCreationModalProps> = ({ isOpen, onClose, onPostCreated }) => {
    const { lemmyInfo } = useLemmyInfo();

    if (!lemmyInfo) return <h3>Could not fetch Announcements community!</h3>

    async function handleSubmit(data: AnnouncementData) {
        // Adding a check to please TypeScript. Because of other checks,
        // Lemmy info will always be defined here
        if (!lemmyInfo) {
            console.error("Error creating post: Lemmy details not available");
            return
        }

        createPost({
            name: data.title.toString(),
            body: data.body.toString(),
            community_id: lemmyInfo.announcements_details.community.id
        })
            .then(
                (createdPost) => {
                    onPostCreated(createdPost);
                    onClose();
                })
            .catch((error) =>
                console.error("Error creating post:", error))
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
            <AnnouncementForm
                onSubmit={handleSubmit}
                onClose={onClose}
            />
        </Modal>
    );
};

export default PostCreationModal;
