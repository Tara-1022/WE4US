import { useState } from "react";
import CreatePostModal from "./CreatePostModal";
import { createPost } from "../../library/LemmyApi";
import { useLemmyInfo } from "../LemmyContextProvider";
import { PostView } from "lemmy-js-client";
import { MeetUpPostBody } from "./MeetUpPostTypes";

export default function PostCreationHandler({
    handleCreatedPost,
}: {
    handleCreatedPost: (newPost: PostView) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { lemmyInfo } = useLemmyInfo();

    async function handleCreation(data: MeetUpPostBody): Promise<void> {
        console.log(data);
        setErrorMessage(null);

        if (!lemmyInfo) {
            setErrorMessage("Could not fetch Meet-Up community!");
            return;
        }

        try {
            const newPost = await createPost({
                body: JSON.stringify(data),
                name: data.title,
                community_id: lemmyInfo.meet_up_details.community.id || -1,
            });

            handleCreatedPost(newPost);
            setIsOpen(false);
        } catch (error) {
            console.error("Post creation failed:", error);
            setErrorMessage("Failed to create the post. Please try again.");
        }
    }

    return (
        <>
            <button onClick={() => setIsOpen(true)} style={buttonStyle}>
                + New Meet-Up
            </button>
            <CreatePostModal
                isOpen={isOpen}
                handleCreation={handleCreation}
                setIsOpen={setIsOpen}
                errorMessage={errorMessage}
            />
        </>
    );
}

const buttonStyle: React.CSSProperties = {
    padding: "10px 16px",
    backgroundColor: "#f4f4f4",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "1em",
    cursor: "pointer",
    color: "#333",
    fontWeight: 500,
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    transition: "background-color 0.2s ease",
    marginBottom: "10px",
};