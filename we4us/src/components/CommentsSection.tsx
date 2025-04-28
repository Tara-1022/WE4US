import { CommentView } from 'lemmy-js-client';
import { getComments } from '../library/LemmyApi';
import { useEffect, useState } from 'react';
import buildCommentsTree, { CommentNodeI } from '../library/CommentUtils';
import CommentsTree from './CommentsTree';
import CommentCreator from './CommentCreator';
import { CommentsContext, commentsContextValueType } from './CommentsContext';

export default function CommentsSection({ postId }: { postId: number }) {
    const [comments, setComments] = useState<CommentView[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const styles = {
        commentsSection: {
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
            color: "#e0e0e0",
            margin: 0,
            padding: "0px",
            backgroundColor: "#1a1a1b",
        },        
        heading: {
            fontSize: "18px",
            fontWeight: "600",
            marginBottom: "16px",
            color: "#ffffff"
        },
        loadingText: {
            color: "#9da5b0",
            fontStyle: "italic"
        },
        noCommentsText: {
            color: "#9da5b0"
        }
    };
    
    let commentsTree: CommentNodeI[] = buildCommentsTree(comments);
    let commentsContextValue: commentsContextValueType = {
        comments: comments,
        setComments: setComments,
        postId: postId
    };

    useEffect(() => {
        setIsLoading(true);
        getComments({ postId: postId })
            .then(comments => {
                setComments(comments);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error fetching comments:", err);
                setIsLoading(false);
            });
            
        commentsContextValue = { ...commentsContextValue, postId: postId };
    }, [postId])

    useEffect(() => {
        commentsTree = buildCommentsTree(comments);
        commentsContextValue = { ...commentsContextValue, comments: comments }
    }, [comments])

    return (
        <CommentsContext.Provider value={commentsContextValue}>
            <div style={styles.commentsSection}>
                <h3 style={styles.heading}>Comments</h3>
                
                <CommentCreator actionName={"Comment"} />
                
                {isLoading ? (
                    <p style={styles.loadingText}>Loading comments...</p>
                ) : comments.length > 0 ? (
                    <CommentsTree commentsTree={commentsTree} />
                ) : (
                    <p style={styles.noCommentsText}>No comments yet. Be the first to comment!</p>
                )}
            </div>
        </CommentsContext.Provider>
    );
}