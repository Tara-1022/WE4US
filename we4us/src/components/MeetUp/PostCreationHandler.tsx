import { useState } from "react";
import PostForm from "./PostForm";
import { createPost } from "../../library/LemmyApi";
import { useLemmyInfo } from "../LemmyContextProvider";
import { PostView } from "lemmy-js-client";
import { MeetUpPostType } from "./MeetUpPostTypes";
import Modal from "react-modal";

export default function PostCreationHandler({
    handleCreatedPost,
}: {
    handleCreatedPost: (newPost: PostView) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { lemmyInfo } = useLemmyInfo();

    async function handleCreation(data: MeetUpPostType): Promise<void> {
        console.log(data);
        setErrorMessage(null);

        if (!lemmyInfo) {
            setErrorMessage("Could not fetch Meet-Up community!");
            return;
        }

        try {
            const newPost = await createPost({
                body: JSON.stringify(data.body),
                name: data.title,
                community_id: lemmyInfo.meet_up_details.community.id,
                ...(data.url && { url: data.url.toString() })
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
            <button onClick={() => setIsOpen(true)}>New Post</button>
            <Modal isOpen={isOpen} contentLabel="Create Meet Up Post">
                <PostForm
                    handleSubmit={handleCreation}
                    errorMessage={errorMessage}
                    onClose={() => setIsOpen(false)}
                    task="Create Meet Up Post"
                />
            </Modal>
        </>
    );
}
