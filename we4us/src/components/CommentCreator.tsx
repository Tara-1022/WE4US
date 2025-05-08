import { createComment } from "../library/LemmyApi";
import { useCommentsContext } from "./CommentsContext";
import { useState } from "react";
import Collapsible from "./Collapsible";

export default function CommentCreator({ parentId, actionName = "Comment" }: { parentId?: number, actionName?: string }) {
    const { postId, setComments, comments } = useCommentsContext();
    const [content, setContent] = useState("");

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
        formActions: {
            display: "flex",
            gap: "8px"
        },
        submitButton: {
            padding: "6px 16px",
            backgroundColor: "#ff7b00",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "500",
            transition: "background-color 0.2s"
        },
        cancelButton: {
            padding: "6px 16px",
            backgroundColor: "#32343a",
            color: "#a0a8b0",
            border: "1px solid #444",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "500",
            transition: "background-color 0.2s"
        },
        actionButton: {
            backgroundColor: "#ff7b00",
            border: "none",
            color: "white",  // Light text color for dark theme
            cursor: "pointer",
            fontWeight: "600",
            padding: "6px 16px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            borderRadius: "6px",
            transition: "background-color 0.2s"
        }
    };

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
                window.alert("Comment created!")
                setContent("");
            }
        );
    }

    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        event.preventDefault();
        setContent(event.target.value);
    }

    function CollapsedIcon() {
        return (
            <b style={styles.actionButton}>
                {actionName}
            </b>
        )
    }

    function OpenIcon() {
        return (
            <b style={styles.actionButton}>
                Cancel
            </b>
        )
    }


    return (
        <Collapsible
            CollapsedIcon={CollapsedIcon}
            OpenIcon={OpenIcon}
            initiallyExpanded={false}
            onToggle={() => { }}
        >
            <div style={styles.form}>
                <textarea
                    style={styles.textarea}
                    name="content"
                    value={content}
                    onChange={handleChange}
                    placeholder={`Write your ${actionName.toLowerCase()}...`}
                />
                <div style={styles.formActions}>
                    <button
                        onClick={handleCreate}
                        style={styles.submitButton}
                    >
                        {actionName}
                    </button>
                    <button
                        onClick={() => { setContent(""); }}
                        style={styles.cancelButton}
                    >
                        Clear
                    </button>
                </div>
            </div>
        </Collapsible>
    );
}