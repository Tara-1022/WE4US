import { CommentView } from "lemmy-js-client";
import { editComment } from "../library/LemmyApi";
import { useCommentsContext } from "./CommentsContext";
import { useState } from "react";
import Collapsible from "./Collapsible";

function CollapsedIcon() {
    const style = {
        actionButton: {
            background: "none",
            border: "none",
            color: "#a0a8b0",
            cursor: "pointer",
            fontWeight: "500" as const,
            padding: 0,
            fontSize: "13px",
            display: "flex",
            alignItems: "center"
        }
    };
    
    return (
        <b style={style.actionButton}>
            Edit
        </b>
    )
}

function OpenIcon() {
    const style = {
        actionButton: {
            background: "none",
            border: "none",
            color: "#a0a8b0",
            cursor: "pointer",
            fontWeight: "500" as const,
            padding: 0,
            fontSize: "13px",
            display: "flex",
            alignItems: "center"
        }
    };
    
    return (
        <b style={style.actionButton}>
            Cancel
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
    const [isExpanded, setIsExpanded] = useState(false);
    
    const styles = {
        form: {
            marginBottom: "16px"
        },
        textarea: {
            width: "100%",
            minHeight: "60px",
            padding: "12px",
            border: "1px solid #444",
            borderRadius: "4px",
            resize: "vertical" as const,
            fontFamily: "inherit",
            fontSize: "14px",
            marginBottom: "8px",
            transition: "border-color 0.2s",
            backgroundColor: "#252830",
            color: "#e0e0e0"
        },
        buttonGroup: {
            display: "flex",
            gap: "8px"
        },
        saveButton: {
            padding: "6px 16px",
            backgroundColor: "#ff7b00", 
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "500" as const,
            transition: "background-color 0.2s"
        },
        resetButton: {
            padding: "6px 16px",
            backgroundColor: "#32343a",
            color: "#a0a8b0",
            border: "1px solid #444",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "500" as const,
            transition: "background-color 0.2s"
        }
    };

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
                setIsExpanded(false);
            })
            .catch(() => {
                window.alert("Comment could not be updated");
            });
    }

    function handleReset(){
        setContent(initialText);
    }

    function handleToggle() {
        setIsExpanded(!isExpanded);
    }

    return (
        <Collapsible 
            CollapsedIcon={CollapsedIcon} 
            OpenIcon={OpenIcon} 
            initiallyExpanded={false}
            onToggle={handleToggle}
        >
            <div style={styles.form}>
                <textarea 
                    style={styles.textarea}
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                />
                <div style={styles.buttonGroup}>
                    <button 
                        onClick={handleSave} 
                        disabled={content == initialText}
                        style={styles.saveButton}
                    >
                        Save
                    </button>
                    <button 
                        onClick={handleReset}
                        style={styles.resetButton}
                    >
                        Reset
                    </button>
                </div>
            </div>
        </Collapsible>
    );
}