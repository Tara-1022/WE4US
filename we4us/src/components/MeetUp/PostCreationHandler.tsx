import { useState } from "react";
import CreatePostModal from "./CreatePostModal";
import { createPost } from "../../library/LemmyApi";
import { MEETUP_COMMUNITY_ID } from "../../constants";
import { PostView } from "lemmy-js-client";
import { MeetUpPostBody } from "./MeetUpPostTypes"; 

export default function PostCreationHandler({ handleCreatedPost }: { handleCreatedPost: (newPost: PostView) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null); 

    async function handleCreation(data: MeetUpPostBody): Promise<void> {
        console.log(data);
        setErrorMessage(null); 
        try {
            const newPost = await createPost({
                body: JSON.stringify(data),
                name: data.title,  
                community_id: MEETUP_COMMUNITY_ID
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
            <CreatePostModal
                isOpen={isOpen}
                handleCreation={handleCreation}
                setIsOpen={setIsOpen}
                errorMessage={errorMessage} 
            />
        </>
    );
}
