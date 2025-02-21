import { createComment } from "../library/LemmyApi";
import { useCommentsContext } from "./CommentsContext";
import { useState } from "react";

export default function CommentCreator({ commentId, inCommentTree }: { commentId?: number, inCommentTree: boolean }) {
    const { postId, setComments, comments } = useCommentsContext();
    const [content, setContent] = useState("");

    function handleCreate() {
        if (content == "") {
            window.alert("Cannot create empty comment");
            return;
        }
        createComment({
            content: content,
            post_id: postId,
            ...(commentId && { parent_id: commentId })
        }).then(
            (commentView) => {
                setComments([commentView, ...comments]);
            }
        );
        setContent("");   
    }

    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>){
        event.preventDefault();
        setContent(event.target.value);
    }

    return (
        <>
            <textarea name="content" value={content} onChange={handleChange}/>
            <br />
            <button onClick={handleCreate}>{inCommentTree ? "Reply" : "Comment"}</button>
            <button onClick={()=>{setContent("");}}>Cancel</button>
        </>
    )
}