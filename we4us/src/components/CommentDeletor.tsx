import { CommentView } from "lemmy-js-client";
import { deleteComment } from "../library/LemmyApi";
import { useCommentsContext } from "./CommentsContext";
// import "../styles/DeleteButton.css"

export default function CommentDeletor({ commentId }: { commentId: number }) {
    const { setComments, comments } = useCommentsContext();
    const styles = {      
        cancelButton: {
            padding: "6px 16px",
            backgroundColor: "#FF4500",
            color: "#FFFFFF",
            border: "1px solid #444",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "background-color 0.2s"
        },
    };
     
    function handleDelete() {
        if (confirm("Do you want to delete this comment?")) {
            deleteComment(commentId)
            .then(
                (newCommentView: CommentView) => {
                        setComments(comments.map(
                            (element: CommentView) => {
                                if (element.comment.id == commentId) return newCommentView
                                else return element;
                            }
                        ))
                }
            )
        }
        else {
            window.alert("Comment could not be deleted");
        }
    }

    return (
        <button onClick={handleDelete} style={styles.cancelButton} className="DeleteButton">
            Delete
        </button>
    );
}
