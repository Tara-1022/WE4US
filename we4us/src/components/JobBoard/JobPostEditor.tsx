import { PostView } from "lemmy-js-client";
import { JobPostBody, JobPostData } from "./JobTypes";
import PostForm from "./JobPostForm";
import { editPost } from "../../library/LemmyApi";

export default function JobPostEditor({ postView, onPostUpdated, onClose }:
    { postView: PostView, onPostUpdated: (updatedPostView: PostView) => void, onClose: () => void }
) {

    function handleEdit(data: JobPostData) {
        editPost({
            post_id: postView.post.id,
            name: data.name,
            body: JSON.stringify(data.body),
            ...(data.url && { url: data.url })
        })
            .then(
                (updatedPostView: PostView) => {
                    window.alert("Post Updated!");
                    onPostUpdated(updatedPostView);
                    onClose();
                }
            )
            .catch(
                (error: Error) => {
                    window.alert("Could not update Post");
                    console.error(error);
                }
            )
    }

    const jobDetails: JobPostBody = JSON.parse(postView.post.body || "{}");
    return <PostForm
        onClose={onClose}
        handleSubmit={handleEdit}
        initialData={{
            name: postView.post.name,
            url: postView.post.url,
            body: jobDetails
        }}
        task="Edit"
    />
}