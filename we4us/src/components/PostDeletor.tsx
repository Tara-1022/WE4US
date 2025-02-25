import { deletePost } from "../library/LemmyApi";
import { useNavigate } from "react-router-dom";

export default function PostDeletor({ postId }: { postId: number }) {
    const navigator = useNavigate();

    function handleDelete() {
        if (confirm("Do you want to delete this post?")) {
            deletePost(postId)
                .then(
                    () => {
                        window.alert("Post deleted successfully");
                        navigator("/reaching-out");
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