import { useState } from "react";
import CreatePostModal from "./PgPostCreationModal";
import { PG_COMMUNITY_ID } from "../constants";
import { PostView } from "lemmy-js-client";
import { createPost } from "../library/LemmyApi";

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

export default function PostCreationHandler({ handleCreatedPost , noPostsView = false }: { handleCreatedPost: (newPost: PostView) => void ,  noPostsView?: boolean }) {
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
    if (!noPostsView) {
        return (
            <>
                <button onClick={() => { setIsOpen(!isOpen) }}>New Post</button>
                <CreatePostModal isOpen={isOpen} handleCreation={handleCreation} setIsOpen={setIsOpen} />
            </>
        )
    }

    return (
        <div className="empty-posts-container">
            <div className="empty-posts-message">
                <h3>No posts available</h3>
                <button 
                    onClick={() => { setIsOpen(!isOpen) }}
                    className="create-first-post-button"
                >
                    Create First Post
                </button>
            </div>
            <CreatePostModal isOpen={isOpen} handleCreation={handleCreation} setIsOpen={setIsOpen} />
        </div>
    )
}