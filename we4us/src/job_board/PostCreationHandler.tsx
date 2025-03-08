import { useState } from "react";
import CreatePostModal from "./CreatePostModal";
import { createPost } from "../library/LemmyApi";
import { JOB_COMMUNITY_ID } from "../constants";
import { PostView } from "lemmy-js-client";

export type JobPostData = {
    url: string,
    name: string,
    body: JobPostBody
}

export type JobPostBody = {
    body: string,
    extra_field: string,
    yes_no: boolean,
    number_field?: number
}

export default function PostCreationHandler({ handleCreatedPost }: { handleCreatedPost: (newPost: PostView) => void }) {
    const [isOpen, setIsOpen] = useState(false);

    function handleCreation(data: JobPostData) {
        console.log(data)
        createPost({
            url: data.url,
            body: JSON.stringify(data.body),
            name: data.name.toString(),
            community_id: JOB_COMMUNITY_ID
        }).then(
            (newPost) => handleCreatedPost(newPost)
        )
        setIsOpen(false);
    }

    return (
        <>
            <button onClick={() => { setIsOpen(!isOpen) }}>New Post</button>
            <CreatePostModal isOpen={isOpen} handleCreation={handleCreation} setIsOpen={setIsOpen} />
        </>
    )
}