import { deletePost, hidePost } from "../library/LemmyApi";
import { deleteImage, ImageDetailsType } from "../library/ImageHandling";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

export default function PostDeletor({ postId, imageData }: { postId: number, imageData?: ImageDetailsType }) {
    const navigate = useNavigate();
   
    let styles = {
        actionText: {
            cursor: 'pointer',
            color: '#FF4500',
            display: 'flex',
            alignItems: 'center',
            fontSize: '12px',
            padding: '8px',
            background: 'none',
            border: 'none'
        },
        icon: {
            marginRight: '6px'
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
    
    return (
        <button onClick={handleDelete} style={styles.actionText}>
            <Trash2 size={16} style={styles.icon} />
            Delete
        </button>
    );
}