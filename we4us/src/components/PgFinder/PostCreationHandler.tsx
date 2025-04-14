import { useState } from "react";
import CreatePostModal from "./PgPostCreationModal";
import { PostView } from "lemmy-js-client";
import { createPost } from "../../library/LemmyApi";
import { useLemmyInfo } from "../LemmyContextProvider";

export type PgPostData = {
    name: string,
    body: PgPostBody,
    url: string
}

export type PgPostBody = {
    location: string,
    ratings: {
        cost: number | null,
        safety: number | null,
        food: number | null,
        cleanliness: number | null
    },
    acAvailable: boolean,
    foodType: string,
    description: string
}

export default function PostCreationHandler({ handleCreatedPost }: { handleCreatedPost: (newPost: PostView) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const { lemmyInfo } = useLemmyInfo();

    function handleCreation(data: PgPostData) {
        console.log(data)

        if (!lemmyInfo) {
            window.alert("Cannot create post; Community not found!")
            console.error("Could not fetch PG Finder community!");
            return;
        }

        createPost({
            body: JSON.stringify(data.body),
            name: data.name.toString(),
            url: data.url,
            community_id: lemmyInfo.pg_finder_details.community.id
        }).then(
            (newPost) => handleCreatedPost(newPost)
        )
        setIsOpen(false);
    }

    return (
        <>
            <button onClick={() => setIsOpen(true)}>New Post</button>
            <CreatePostModal
                isOpen={isOpen}
                handleCreation={handleCreation}
                setIsOpen={setIsOpen}
            />
        </>
    );
}