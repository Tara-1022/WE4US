import { CommentView } from 'lemmy-js-client';
import CommentCreator from './CommentCreator';
import CommentDeletor from './CommentDeletor';
import CommentSnippet from './CommentSnippet';
import { useProfileContext } from './ProfileContext';
import LikeHandler from './LikeHandler';
import CommentEditor from "./CommentEditor";
import { useState } from "react";

// TODO: Add more information to the comment
export default function Comment({ commentView, depth }: { commentView: CommentView, depth: number }) {
    let styles = {
        container: {
            backgroundColor: "rgba(255,255,255,0.3)",
            marginLeft: 10 * depth + "%",
            padding: "1%"
        }
    }
    const { profileInfo } = useProfileContext();
    const [isEditing, setIsEditing] = useState<boolean>(false);

    return (
        <div style={styles.container}>
            {isEditing ? (
                <CommentEditor commentId={commentView.comment.id} initialText={commentView.comment.content} onClose={() => setIsEditing(false)} />
            ) : (
                <>
                    <CommentSnippet commentView={commentView} />
                    <LikeHandler forPost={false} isInitiallyLiked={commentView.my_vote == 1} initialLikes={commentView.counts.score} id={commentView.comment.id} />
                    <CommentCreator commentId={commentView.comment.id} actionName={"Reply"} />

                    <b onClick={() => setIsEditing(true)} style={{ cursor: 'pointer' }}>Edit</b>
                    <br />

                    {(!commentView.comment.deleted && commentView.creator.id == profileInfo?.lemmyId) && (
                        <CommentDeletor commentId={commentView.comment.id} />
                    )}
                </>
            )}
        </div>
    );
}
