import { CommentView } from "lemmy-js-client";
import { editComment } from "../library/LemmyApi";
import { useCommentsContext } from "./CommentsContext";
import { useState } from "react";
import Collapsible from "./Collapsible";

function CollapsedIcon() {
    return (
        <b>
            Cancel
        </b>
    )
}
function OpenIcon() {
    return (
        <b>
            Edit
        </b>
    )
}

export default function CommentEditor({
    commentId,
    initialText
}: {
    commentId: number,
    initialText: string
}) {
    const { setComments, comments } = useCommentsContext();
    const [content, setContent] = useState(initialText);

    function handleSave() {
        if (content == "") {
            window.alert("Comment cannot be empty");
            return;
        }
        editComment(commentId, content)
            .then((updatedCommentView: CommentView) => {
                setComments(comments.map(
                    (element: CommentView) =>
                        element.comment.id === commentId ? updatedCommentView : element
                ));
            })
            .catch(() => {
                window.alert("Comment could not be updated");
            });
    }

    function handleReset(){
        setContent(initialText);
    }

    return (
        <Collapsible CollapsedIcon={CollapsedIcon} OpenIcon={OpenIcon} initiallyExpanded={false}>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} />
            <button onClick={handleSave} disabled={content == initialText}>Save</button>
            <button onClick={handleReset}>Reset</button>
        </Collapsible>
    );
}