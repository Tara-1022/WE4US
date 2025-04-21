import { CommentView } from 'lemmy-js-client';
import CommentCreator from './CommentCreator';
import CommentDeletor from './CommentDeletor';
import CommentEditor from "./CommentEditor";
import CommentSnippet from './CommentSnippet';
import { useProfileContext } from './ProfileContext';
import LikeHandler from './LikeHandler';

export default function Comment({ commentView, depth }: { commentView: CommentView, depth: number }) {
    const { profileInfo } = useProfileContext();
    
    const styles = {
        container: {
            backgroundColor: "#1a1d21",
            borderRadius: "8px",
            marginBottom: "16px",
            padding: "16px", 
            boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
            transition: "background-color 0.2s ease",
            borderLeft: depth > 0 ? `3px solid hsl(${(depth * 30) % 360}, 60%, 40%)` : "none",
            marginLeft: depth * 16 + "px"
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
            <CommentSnippet commentView={commentView} />
            
            <div style={styles.actionsContainer}>
                <LikeHandler 
                    forPost={false} 
                    isInitiallyLiked={commentView.my_vote == 1} 
                    initialLikes={commentView.counts.score} 
                    id={commentView.comment.id} 
                />
                
                <CommentCreator parentId={commentView.comment.id} actionName={"Reply"} />
                
                <CommentEditor 
                    commentId={commentView.comment.id} 
                    initialText={commentView.comment.content} 
                />
                
                {(!commentView.comment.deleted && commentView.creator.id == profileInfo?.lemmyId) &&
                    <CommentDeletor commentId={commentView.comment.id} />
                }
            </div>
        </div>
    );
}