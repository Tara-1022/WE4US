import { CommentView } from "lemmy-js-client";
import { deleteComment } from "../library/LemmyApi";
import { useCommentsContext } from "./CommentsContext";

export default function CommentDeletor({ commentId }: { commentId: number }) {
    const { setComments, comments } = useCommentsContext();
    
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

    return <button onClick={handleDelete}>Delete</button>
}