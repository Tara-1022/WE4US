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

    function handleCreation(data: MeetUpPostData) {
        console.log(data);
        createPost({
            body: JSON.stringify(data),
            name: `Meet-Up at ${data.location}`,
            community_id: MEETUP_COMMUNITY_ID
        }).then((newPost) => handleCreatedPost(newPost));

        setIsOpen(false);
    }

    return (
        <>
            <button onClick={() => setIsOpen(!isOpen)}>New Post</button>
            <CreatePostModal isOpen={isOpen} handleCreation={handleCreation} setIsOpen={setIsOpen} />
        </>
    );
}
