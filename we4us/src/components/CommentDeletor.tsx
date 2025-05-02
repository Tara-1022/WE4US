import { CommentView } from "lemmy-js-client";
import { deleteComment } from "../library/LemmyApi";
import { useCommentsContext } from "./CommentsContext";

export default function CommentDeletor({ commentId }: { commentId: number }) {
    const { setComments, comments } = useCommentsContext();
    
    const styles = {
        actionText: {
            cursor: 'pointer',
            color: '#dc3545',
            fontWeight: '500' as const,
            fontSize: '13px',
            background: 'none',
            border: 'none',
            padding: 0,
            display: 'inline-flex',
            alignItems: 'center'
        }
    }
    
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

    return <b onClick={handleDelete} style={styles.actionText}>Delete</b>
}