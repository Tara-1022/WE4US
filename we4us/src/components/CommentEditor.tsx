import { CommentView } from "lemmy-js-client";
import { editComment } from "../library/LemmyApi";
import { useCommentsContext } from "./CommentsContext";
import { useState } from "react";

export default function CommentEditor({
    commentId,
    initialText,
    onClose
}: {
    commentId: number,
    initialText: string,
    onClose: () => void
}) {
    const { setComments, comments } = useCommentsContext();
    const [content, setContent] = useState(initialText);

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
            })
            .catch(() => {
                window.alert("Comment could not be updated");
            });
        onClose();
    }

    function handleReset() {
        setContent(initialText);
    }

    return (
        <>
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
                    </button><button
                        onClick={onClose}
                        style={styles.resetButton}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </>
    );
}