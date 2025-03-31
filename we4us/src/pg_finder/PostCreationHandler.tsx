import { useState } from "react";
import CreatePostModal from "./PgPostCreationModal";
import { createPost } from "../library/LemmyApi";
import { PG_COMMUNITY_ID } from "../constants";
import { PostView } from "lemmy-js-client";

export type PgPostData = {
    name: string,
    body: PgPostBody
}

export type PgPostBody = {
    location: string,
    mapUrl: string,
    ratings: {
        cost: number,
        safety: number,
        food: number,
        cleanliness: number
    },
    acAvailable: boolean,
    foodType: string,
    description: string
}

export default function PostCreationHandler({ handleCreatedPost }: { handleCreatedPost: (newPost: PostView) => void }) {
    const [isOpen, setIsOpen] = useState(false);

    function handleCreation(data: PgPostData) {
        console.log(data)
        createPost({
            body: JSON.stringify(data.body),
            name: data.name.toString(),
            community_id: PG_COMMUNITY_ID,
            url: data.body.mapUrl
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
