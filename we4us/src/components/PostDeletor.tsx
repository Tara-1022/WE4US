import { deletePost, hidePost } from "../library/LemmyApi";
import { useNavigate } from "react-router-dom";

export default function PostDeletor({ postId }: { postId: number }) {
    const navigator = useNavigate();

    function handleDelete() {
        if (confirm("Do you want to delete this post?")) {
            deletePost(postId)
                .then(
                    () => {
                        hidePost(postId).then(
                            (success) => {
                                if (success) {
                                    window.alert("Post deleted successfully");
                                    navigator("/reaching-out");
                                }
                                else{
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

    return <button onClick={handleDelete}>Delete Post</button>
}