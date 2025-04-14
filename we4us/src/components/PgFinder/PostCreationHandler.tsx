import { useState } from "react";
import CreatePostModal from "./PgPostCreationModal";
import { PostView } from "lemmy-js-client";
import { createPost } from "../../library/LemmyApi";
import { useLemmyInfo } from "../LemmyContextProvider";

export type PgPostData = {
    name: string,
    body: PgPostBody
}

export type PgPostBody = {
    location: string,
    mapUrl: string,
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
        const { mapUrl, ...cleanedBody } = data.body;

        if (!lemmyInfo) {
            window.alert("Cannot create post; Community not found!")
            console.error("Could not fetch PG Finder community!");
            return;
        }

        createPost({
            body: JSON.stringify(cleanedBody),
            name: data.name.toString(),
            community_id: lemmyInfo.pg_finder_details.community.id,
            url: mapUrl
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