import { PostView } from "lemmy-js-client";
import { editPost } from "../../library/LemmyApi";
import { PgPostBody, PgPostData } from "./Types";
import PgPostForm from "./PgPostForm";
import "../../styles/PgFinderPage.css";

export default function PgPostEditor({ postView, onPostUpdated, onClose }:
    { postView: PostView, onPostUpdated: (updatedPostView: PostView) => void, onClose: () => void }) {

    function handleEdit(data: PgPostData) {
        editPost({
            post_id: postView.post.id,
            name: data.name,
            body: JSON.stringify(data.body),
            ...(data.url && { url: data.url })
        }).then(
            (updatedPostView: PostView) => {
                window.alert("PG Updated!");
                onPostUpdated(updatedPostView);
                onClose();
            }
        )
            .catch(
                (error: Error) => {
                    window.alert("Could not update PG");
                    console.error(error);
                }
            )
    }

    return <PgPostForm
        initialData={{
            name: postView.post.name,
            url: postView.post.url,
            body: JSON.parse(postView.post.body || "{}") as PgPostBody
        } as PgPostData}
        handleSubmit={handleEdit}
        onClose={onClose}
        task="Edit"
    />

}