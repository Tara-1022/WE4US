import { createComment } from "../library/LemmyApi";
import { useCommentsContext } from "./CommentsContext";
import { useState } from "react";
import Collapsible from "./Collapsible";

export default function CommentCreator({ commentId, actionName = "Comment" }: { commentId?: number, actionName?: string }) {
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

    function CollapsedIcon(){
        return (
            <b>
            Cancel
            </b>
        )
    }
    function OpenIcon(){
        return (
            <b>
            {actionName}
            </b>
        )
    }

    return (
        <Collapsible CollapsedIcon={CollapsedIcon} OpenIcon={OpenIcon} initiallyExpanded={false}>
            <textarea name="content" value={content} onChange={handleChange}/>
            <br />
            <button onClick={handleCreate}>{actionName}</button>
            <button onClick={()=>{setContent("");}}>Clear</button>
        </Collapsible>
    )
}