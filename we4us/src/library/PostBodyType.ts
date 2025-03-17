import { PostView } from "lemmy-js-client"
import { ImageDetailsType } from "./LemmyImageHandling"

export type PostBodyType = {
    body: string,
    imageData?: ImageDetailsType
}

export function getPostBody(postView: PostView) {
    // Ensures the whole thing doesn't break when we have a JSON parse issue.
    // TODO: remove if redundant
    let postBody: PostBodyType;
    try {
        postBody = JSON.parse(postView.post.body || "");
    }
    catch (error) {
        postBody = {
            body: postView.post.body || ""
        }
    }
    return postBody;
}