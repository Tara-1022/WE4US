import { useState } from "react";
import PgPostForm from "./PgPostForm";
import { PostView } from "lemmy-js-client";
import { createPost } from "../../library/LemmyApi";
import { useLemmyInfo } from "../LemmyContextProvider";
import { PgPostData } from "./Types";
import Modal from "react-modal";

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
            <button onClick={() => setIsOpen(true)}>New PG</button>

            <Modal
                isOpen={isOpen}
                contentLabel="Add new PG">
                <PgPostForm
                    handleSubmit={handleCreation}
                    onClose={() => setIsOpen(false)}
                    task="Add PG"
                />
            </Modal>
        </>
    );
}