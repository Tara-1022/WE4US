import { CommentView } from "lemmy-js-client";
import { editComment } from "../library/LemmyApi";
import { useCommentsContext } from "./CommentsContext";
import { useState } from "react";

export default function CommentEditor({
    commentId,
    initialText,
    onClose
}: {
    commentId: number,
    initialText: string,
    onClose: () => void
}) {
    const { setComments, comments } = useCommentsContext();
    const [text, setText] = useState(initialText);

    function handleSave() {
        editComment(commentId, text)
            .then((updatedCommentView: CommentView) => {
                setComments(comments.map(
                    (element: CommentView) =>
                        element.comment.id === commentId ? updatedCommentView : element
                ));
                onClose();
            })
            .catch(() => {
                window.alert("Comment could not be updated");
            });
    }

    function handleCancel() {
        onClose();
    }

    return (
        <div>
            <textarea value={text} onChange={(e) => setText(e.target.value)} />
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
        </div>
    );
}
