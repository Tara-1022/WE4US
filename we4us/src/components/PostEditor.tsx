import { PostView } from "lemmy-js-client";
import { editPost } from "../library/LemmyApi";
import { getPostBody, PostBodyType } from "../library/PostBodyType";
import ImageUploader, { handleStateChange } from "./ImageUploader";
import { useState } from "react";
import { ImageDetailsType, deleteImage } from "../library/ImageHandling";
import "../styles/PostImageUploader.css"

export default function PostEditor({ postView, onPostUpdated, onClose }:
    { postView: PostView, onPostUpdated: (updatedPostView: PostView) => void, onClose: () => void }) {

    const postBody = getPostBody(postView);
    const originalImage = postBody.imageData;

    const [loading, setLoading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<ImageDetailsType | undefined>(undefined);
    const [deleteOldImage, setDeleteOldImage] = useState(false);

    const handleImageChange = (newImageDetails: ImageDetailsType[] | undefined) => {
        handleStateChange({
            newImageDetails,
            setDeleteOldImage,
            setUploadedImage
        })
    };

    const handleCancel = () => {
        if (!uploadedImage) return;
        // Remove pending image
        deleteImage(uploadedImage)
        setUploadedImage(undefined);
        onClose();
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const { title, body, url } = Object.fromEntries(formData);

        if (deleteOldImage && originalImage) {
            // Delete the original image after the new one is confirmed
            await deleteImage(originalImage).catch(err => {
                console.error("Error deleting original profile image:", err);
                throw err;
            }
            );
        }

        editPost({
            post_id: postView.post.id,
            name: title.toString(),
            body: JSON.stringify(
                {
                    body: body,
                    imageData: uploadedImage || (deleteOldImage ? undefined : originalImage)
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
            <ImageUploader
                onUploadChange={handleImageChange}
                originalImage={originalImage}
                purpose="post"
                loading={loading}
                setLoading={setLoading}
            />
            <input type="url" defaultValue={postView.post.url} name="url" />
            <textarea
                defaultValue={postBody.body}
                style={{ width: "100%", minHeight: "100px" }}
                name="body"
            />
            <button type="submit" disabled={loading}>Save</button>
            <button type="reset" disabled={loading}>Reset</button>
            <button onClick={handleCancel} disabled={loading}>Cancel</button>
        </form>
    )

}