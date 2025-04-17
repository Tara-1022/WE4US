import { deletePost, hidePost } from "../library/LemmyApi";
import { deleteImage, ImageDetailsType } from "../library/ImageHandling";
import { useNavigate } from "react-router-dom";

export default function PostDeletor({ postId, imageData }: { postId: number, imageData?: ImageDetailsType }) {
    const navigate = useNavigate();
    
    let styles = {
        actionText: {
            cursor: 'pointer'
        }
    }

    function handleDelete() {
        if (confirm("Do you want to delete this post?")) {
            if (imageData) deleteImage(imageData)
                .catch((error) => {
                    window.alert("Image could not be deleted");
                    console.error(error);
                    return;
                })
            deletePost(postId)
                .then(
                    () => {
                        hidePost(postId).then(
                            (success) => {
                                if (success) {
                                    window.alert("Post deleted successfully");
                                    navigate(-1);
                                }
                                else {
                                    throw new Error("Post could not be hidden");
                                }
                            }

                        )
                    }
                )
                .catch(
                    (error) => {
                        window.alert("Post could not be deleted");
                        console.error(error);
                    }
                )
        }

    }

    return <b onClick={handleDelete} style={styles.actionText}>Delete</b>
}