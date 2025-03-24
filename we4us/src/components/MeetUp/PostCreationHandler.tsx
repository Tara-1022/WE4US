import { useState } from "react";
import CreatePostModal from "./CreatePostModal";
import { createPost } from "../../library/LemmyApi";
import { MEETUP_COMMUNITY_ID } from "../../constants";
import { PostView } from "lemmy-js-client";

export type MeetUpPostData = {
    location: string;
    datetime: string;
    access: string;
};

export default function PostCreationHandler({ handleCreatedPost }: { handleCreatedPost: (newPost: PostView) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function handleCreation(data: MeetUpPostData) {
        console.log(data);
        setErrorMessage(null);

        try {
            const newPost = await createPost({
                body: JSON.stringify(data),
                name: `Meet-Up at ${data.location}`,
                community_id: MEETUP_COMMUNITY_ID
            });

            handleCreatedPost(newPost);
            setIsOpen(false);
        } catch (error) {
            console.error("Post creation failed:", error);
            setErrorMessage("Failed to create the post.");
        }
    }

    return (
        <>
            <button onClick={() => setIsOpen(!isOpen)}>New Post</button>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>} 
            <CreatePostModal isOpen={isOpen} handleCreation={handleCreation} setIsOpen={setIsOpen} />
        </>
    );
}
