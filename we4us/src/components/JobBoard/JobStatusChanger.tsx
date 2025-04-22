import { PostView } from "lemmy-js-client";
import { editPost } from "../../library/LemmyApi";
import { JobPostBody } from "./JobTypes";

export default function JobStatusChanger({ postId, initialView, onUpdate }:
    { postId: number, initialView: PostView, onUpdate: (updatedPost: PostView) => void }) {
    console.log("Parsing", initialView.post.body)
    const jobBody = JSON.parse(initialView.post.body || "{}") as JobPostBody

    function changeStatus(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        const newJobBody = {
            ...jobBody,
            open: !jobBody.open
        }
        console.log("Switching to, ", {
            post_id: postId,
            body: JSON.stringify(newJobBody)
        })
        editPost(
            {
                post_id: postId,
                body: JSON.stringify(newJobBody)
            }
        )
            .then(
                (updatedPost) => {
                    window.alert("Job status changed!");
                    onUpdate(updatedPost);
                }
            )
            .catch(
                (error) => window.alert("Could not update! " + error)
            )
    }

    return <>
        <button onClick={changeStatus}>Mark Job {jobBody.open ? "Closed" : "Open"}</button>
    </>

}