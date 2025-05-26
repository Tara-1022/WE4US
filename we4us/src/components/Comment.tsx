import { CommentView } from 'lemmy-js-client';
import CommentCreator from './CommentCreator';
import CommentDeletor from './CommentDeletor';
import CommentEditor from "./CommentEditor";
import CommentSnippet from './CommentSnippet';
import { useProfileContext } from './ProfileContext';
import LikeHandler from './LikeHandler';
import { useState } from 'react';

export default function Comment({ commentView, depth }: { commentView: CommentView, depth: number }) {
    const { profileInfo } = useProfileContext();
    const [isEditing, setIsEditing] = useState(false);

    const styles = {
        container: {
            backgroundColor: "#1a1a1b",
            borderRadius: "0px",
            marginBottom: "16px",
            padding: "12px 16px 12px 24px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            border: "1px solid #343536",
            borderLeft: depth > 0 ? `3px solid hsl(${(depth * 30) % 360}, 60%, 40%)` : "1px solid #343536",
            marginLeft: depth * 18 + "px"
        },

        actionsContainer: {
            display: "flex",
            gap: "16px",
            marginTop: "12px",
            fontSize: "13px",
            alignItems: "center"
        },
        actionButton: {
            background: "none",
            border: "none",
            color: "#a0a8b0",
            cursor: "pointer",
            fontWeight: "500",
            padding: "4px 8px",
            borderRadius: "4px",
            transition: "background-color 0.2s",
            "&:hover": {
                backgroundColor: "#252830"
            }
        }
    };

    return (
        <div style={styles.container}>
            {isEditing ?
                <CommentEditor
                    commentId={commentView.comment.id}
                    initialText={commentView.comment.content}
                    onClose={() => setIsEditing(false)}
                />
                :
                <>
                    <CommentSnippet commentView={commentView} />

                    <div style={styles.actionsContainer}>
                        <LikeHandler
                            forPost={false}
                            isInitiallyLiked={commentView.my_vote == 1}
                            initialLikes={commentView.counts.score}
                            id={commentView.comment.id}
                        />

                        <CommentCreator parentId={commentView.comment.id} actionName={"Reply"} />

                        {(!commentView.comment.deleted && commentView.creator.id == profileInfo?.lemmyId) &&

                            <>
                                <CommentDeletor commentId={commentView.comment.id} />
                                <b style={{
                                    background: "none",
                                    border: "none",
                                    color: "#a0a8b0",
                                    cursor: "pointer",
                                    fontWeight: "500" as const,
                                    padding: 0,
                                    fontSize: "13px",
                                    display: "flex",
                                    alignItems: "center"
                                }}
                                onClick={() => setIsEditing(true)}>
                                    Edit
                                </b>
                            </>

                        }
                    </div>
                </>
            }
        </div>
    );
}