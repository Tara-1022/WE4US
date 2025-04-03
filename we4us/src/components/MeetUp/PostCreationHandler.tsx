import { useState } from "react";
import CreatePostModal from "./CreatePostModal";
import { createPost } from "../../library/LemmyApi";
import { MEETUP_COMMUNITY_ID } from "../../constants";
import { PostView } from "lemmy-js-client";
import { MeetUpPostBody } from "./MeetUpPostTypes"; 

export default function PostCreationHandler({ handleCreatedPost }: { handleCreatedPost: (newPost: PostView) => void }) {
    const [isOpen, setIsOpen] = useState(false);

    async function handleCreation(data: MeetUpPostBody): Promise<string | null> {
        console.log(data);
        try {
            const newPost = await createPost({
                body: JSON.stringify(data),
                name: data.title,  
                community_id: MEETUP_COMMUNITY_ID
            });

            handleCreatedPost(newPost);
            setIsOpen(false);
            return null; 
        } catch (error) {
            console.error("Post creation failed:", error);
            return "Failed to create the post. Please try again."; 
        }
    }    

    return (
        <>
            <button onClick={() => setIsOpen(true)}>New Post</button>
            <CreatePostModal isOpen={isOpen} handleCreation={handleCreation} setIsOpen={setIsOpen} />
        </>
    );
}
