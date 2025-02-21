import { createComment } from "../library/LemmyApi";

export default function CommentCreator({postId, commentId}:{postId: number, commentId?: number}){
    function handleCreate(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const {content} = Object.fromEntries(formData);
        createComment({
            content: content.toString(),
            post_id: postId,
            ...(commentId && {parent_id: commentId})
        })
    }

    return(
        <form onSubmit={handleCreate}>
            <textarea name="content" />
            <br/>
            <button type="submit">Comment</button>
            <button type="reset">Cancel</button>
        </form>
    )
}