import { useState } from "react";
import { PostView } from "lemmy-js-client";
import { editPost } from "../../library/LemmyApi";
import { MeetUpPostBody, MeetUpPostType } from "./MeetUpPostTypes";
import PostForm from "./PostForm";

export default function PostEditor({ postView, onPostUpdated, onClose }:
    { postView: PostView, onPostUpdated: (updatedPostView: PostView) => void, onClose: () => void }) {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    function handleEdit(data: MeetUpPostType) {
        editPost({
            post_id: postView.post.id,
            name: data.title,
            body: JSON.stringify(
                data.body as MeetUpPostBody
            ),
            ...(data.url && { url: data.url.toString() })
        }).then(
            (updatedPostView) => {
                window.alert("Post Updated!");
                onPostUpdated(updatedPostView);
                onClose();
            }
        )
            .catch(
                (error) => {
                    setErrorMessage("Could not update post");
                    console.error(error);
                }
            )
    }

    return <PostForm
        handleSubmit={handleEdit}
        errorMessage={errorMessage}
        initialData={{
            title: postView.post.name,
            url: postView.post.url,
            body: JSON.parse(postView.post.body || "{}") as MeetUpPostBody
        }}
        task="Edit Post"
        onClose={onClose}
    />

}