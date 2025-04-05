import { useState } from "react";
import CreatePostModal from "./JobPostCreationModal";
import { createPost } from "../library/LemmyApi";
import { PostView } from "lemmy-js-client";
import { useLemmyInfo } from "../components/LemmyContextProvider"

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

    const {lemmyInfo} = useLemmyInfo();

    if (!lemmyInfo) return <h3>Could not fetch Job Board community!</h3>


    function handleCreation(data: JobPostData) {
        console.log(data);

        if (!lemmyInfo) {
            console.error("Error creating post: Lemmy details not available");
            return 
        }
        
        createPost({
            ...(data.url && {url: data.url}),
            body: JSON.stringify(data.body),
            name: data.name.toString(),
            community_id: lemmyInfo.announcements_details.community.id
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
