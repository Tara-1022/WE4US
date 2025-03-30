import { useState } from "react";
import CreatePostModal from "./JobPostCreationModal";
import { createPost } from "../library/LemmyApi";
import { JOB_COMMUNITY_ID } from "../constants";
import { PostView } from "lemmy-js-client";

export type JobPostData = {
    url: string,
    name: string,
    body: JobPostBody
}

export type JobPostBody = {
    company: string,
    role: string,
    location: string,
    open: boolean,
    deadline?: string,
    job_type: "Internship" | "Job" | "Research" | "Other"; 
    description: string
}

export default function PostCreationHandler({ handleCreatedPost }: { handleCreatedPost: (newPost: PostView) => void }) {
    const [isOpen, setIsOpen] = useState(false);

    function handleCreation(data: JobPostData) {
        console.log(data);
        createPost({
            ...(data.url && {url: data.url}),
            body: JSON.stringify(data.body),
            name: data.name.toString(),
            community_id: JOB_COMMUNITY_ID
        }).then(
            (newPost) => handleCreatedPost(newPost)
        );
        setIsOpen(false);
    }


    return (
        <>
            <button onClick={() => setIsOpen(!isOpen)}>New Post</button>
            <CreatePostModal isOpen={isOpen} handleCreation={handleCreation} setIsOpen={setIsOpen} />
        </>
    );
}
