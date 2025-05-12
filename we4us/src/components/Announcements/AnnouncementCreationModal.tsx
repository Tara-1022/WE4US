import { useState } from "react";
import Modal from "react-modal";
import { createPost } from "../../library/LemmyApi";
import { useLemmyInfo } from "../../components/LemmyContextProvider";

export type AnnouncementData = {
    title: string,
    body: string
}

export function AnnouncementForm({ onSubmit, onClose, initialData, task }:
    {
        onSubmit: (data: AnnouncementData) => void, onClose: () => void, initialData?: AnnouncementData,
        task: string
    }) {
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
        <div className="modal-container">
            <form onSubmit={handleSubmit} >  
              <div className="">
                <label htmlFor="title" className="modal-label">Title:</label>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    required
                    defaultValue={initialData?.title || undefined}
                    className="modal-input"
                />
              </div>
              <div>
                <label htmlFor="body" className="modal-label">Body:</label>
                <textarea
                    name="body"
                    placeholder="Body"
                    required
                    defaultValue={initialData?.body || undefined}
                    className="modal-input"
                />
              </div>
                <div style={{ display: "flex", justifyContent: "flex-center", gap: "1rem" }}>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            backgroundColor: "#2563eb",
                            color: "white",
                            border: "none",
                            padding: "0.5rem 1rem",
                            borderRadius: "6px",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >
                        {loading ? "Submitting..." : task}
                    </button>
    
                    <button
                        type="reset"
                        style={{
                            backgroundColor: "#374151",
                            color: "white",
                            border: "none",
                            padding: "0.5rem 1rem",
                            borderRadius: "6px",
                            cursor: "pointer"
                        }}
                    >
                        Reset
                    </button>
    
                    <button
                        onClick={onClose}
                        type="button"
                        style={{
                          backgroundColor: "rgb(255, 69, 0)",
                            color: "white",
                            border: "none",
                            padding: "0.5rem 1rem",
                            borderRadius: "6px",
                            cursor: "pointer"
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
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
        if (!lemmyInfo) {
            console.error("Error creating post: Lemmy details not available");
            return;
        }

        createPost({
            name: data.title.toString(),
            body: data.body.toString(),
            community_id: lemmyInfo.announcements_details.community.id
        })
            .then((createdPost) => {
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
            className="ReactModal__Content"
            overlayClassName="ReactModal__Overlay"
        
         >
            <AnnouncementForm
                onSubmit={handleSubmit}
                onClose={onClose}
                task="Create"
            />
        </Modal>
    );
};

export default PostCreationModal;
