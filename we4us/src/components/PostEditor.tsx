import { PostView } from "lemmy-js-client";
import { editPost } from "../library/LemmyApi";
import { getPostBody, PostBodyType } from "../library/PostBodyType";
import "../styles/FullImageView.css"

export default function PostEditor({ postView, onPostUpdated, onClose }:
    { postView: PostView, onPostUpdated: (updatedPostView: PostView) => void, onClose: () => void }) {

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const { title, body, url } = Object.fromEntries(formData);

        editPost({
            post_id: postView.post.id,
            name: title.toString(),
            body: JSON.stringify(
                {
                    body: body
                } as PostBodyType
            ),
            ...(url && { url: url.toString() })
        }).then(
            (updatedPostView) => {
                window.alert("Post Updated!");
                onPostUpdated(updatedPostView);
                onClose();
            }
        )
            .catch(
                (error) => {
                    window.alert("Could not update post");
                    console.error(error);
                }
            )
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                defaultValue={postView.post.name}
                style={{ width: "100%", fontSize: "1.5em" }}
                name="title"
            />
            <input type="url" defaultValue={postView.post.url} name="url" />
            <textarea
                defaultValue={getPostBody(postView).body}
                style={{ width: "100%", minHeight: "100px" }}
                name="body"
            />
            <button type="submit">Save</button>
            <button type="reset">Reset</button>
            <button onClick={onClose}>Cancel</button>
        </form>
    )

}