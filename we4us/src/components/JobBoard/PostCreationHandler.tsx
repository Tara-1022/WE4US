import { useState } from "react";
import PostForm from "./PostForm";
import { createPost } from "../../library/LemmyApi";
import { PostView } from "lemmy-js-client";
import { useLemmyInfo } from "../LemmyContextProvider"
import { JobPostData } from "./JobTypes";
import Modal from "react-modal";

export default function PostCreationHandler({ handleCreatedPost }: { handleCreatedPost: (newPost: PostView) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const { lemmyInfo } = useLemmyInfo();

    if (!lemmyInfo) return <h3>Could not fetch Job Board community!</h3>

    function handleCreation(data: JobPostData) {
        console.log(data);

        if (!lemmyInfo) {
            console.error("Error creating post: Lemmy details not available");
            return
        }

        createPost({
            ...(data.url && { url: data.url }),
            body: JSON.stringify(data.body),
            name: data.name.toString(),
            community_id: lemmyInfo.job_board_details.community.id
        }).then(
            (newPost) => handleCreatedPost(newPost)
        );
        setIsOpen(false);
    }


    return (
        <>
            <button onClick={() => setIsOpen(!isOpen)}>New Post</button>
            <Modal isOpen={isOpen} contentLabel="Create Job Post">
                <PostForm 
                handleSubmit={handleCreation} 
                onClose={() => setIsOpen(false)}
                task="Create Job Post" />
            </Modal>
        </>
    );
}
