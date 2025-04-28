import { CommentView } from "lemmy-js-client";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function CommentSnippet({ commentView, withPostLink = false }: 
    { commentView: CommentView, withPostLink?: boolean }) {
    
    const styles = {
        content: {
            fontSize: "14px",
            lineHeight: 1.5,
            marginBottom: "8px",
            wordBreak: "break-word" as const,
            color: "#e0e0e0",
            paddingLeft: "12px" 
        },
        deleted: {
            color: "#888888",
            fontStyle: "italic"
        },
        meta: {
            display: "flex",
            alignItems: "center",
            fontSize: "12px",
            color: "#9da5b0", 
            marginBottom: "8px"
        },
        metaItem: {
            margin: 0,
            marginRight: "12px"
        },
        userLink: {
            color: "#ff9a40",
            textDecoration: "none"
        },
        postLink: {
            fontSize: "small",
            margin: "2%",
            color: "#ff9a40",
            textDecoration: "none"
        }
    };

    return (
        <>
            <div style={styles.content}>
                {commentView.comment.deleted ? (
                    <span style={styles.deleted}>Comment deleted</span>
                ) : (
                    <ReactMarkdown>
                        {commentView.comment.content}
                    </ReactMarkdown>
                )}
            </div>
            
            <div style={styles.meta}>
                <p style={styles.metaItem}>Created: {new Date(commentView.comment.published).toLocaleString()}</p>
                
                {commentView.comment.updated && (
                    <p style={styles.metaItem}>Edited: {new Date(commentView.comment.updated).toLocaleString()}</p>
                )}
                
                <Link to={"/profile/" + commentView.creator.name} style={styles.userLink}>
                    {commentView.creator.display_name || commentView.creator.name}
                </Link>
            </div>
            
            {withPostLink && (
                <Link to={"/post/" + commentView.post.id} style={styles.postLink}>
                    Go to Post
                </Link>
            )}
        </>
    );
}