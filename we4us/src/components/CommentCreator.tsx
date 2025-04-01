import { createComment } from "../library/LemmyApi";
import { useCommentsContext } from "./CommentsContext";
import { useState } from "react";
import Collapsible from "../library/Collapsible";

export default function CommentCreator({ parentId, actionName = "Comment" }: { parentId?: number, actionName?: string }) {
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
            ...(parentId && { parent_id: parentId })
        }).then(
            (commentView) => {
                let newComments = comments;
                if (parentId) {
                    const parentIndex = comments.findIndex((commentView) => commentView.comment.id == parentId)
                    const updatedParent = comments[parentIndex]
                    updatedParent.counts.child_count += 1;
                    newComments = [...comments.slice(0, parentIndex), updatedParent, ...comments.slice(parentIndex + 1)]
                }
                setComments([commentView, ...newComments]);
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
            <>
            {actionName}
            </>
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