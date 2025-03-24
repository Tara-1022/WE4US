import { editPost } from "../library/LemmyApi";
import { useState } from "react";

export default function PostEditor({ postId, initialTitle, initialBody, initialUrl }: {
    postId: number,
    initialTitle: string,
    initialBody: string,
    initialUrl?: string
}) {
    const [title, setTitle] = useState(initialTitle);
    const [body, setBody] = useState(initialBody);
    const [url, setUrl] = useState(initialUrl || "");

    let styles = {
        actionText: {
            cursor: "pointer",
            color: "#007bff",
            fontWeight: "bold",
            display: "inline-block",
            marginTop: "5px",
        }
    };

    function handleEdit() {
        const newTitle = prompt("Edit post title:", title);
        const newBody = prompt("Edit post content:", body);
        if (newTitle === null || newBody === null) return; // Cancel if user presses "Cancel"

        editPost(postId, newTitle, newBody, url)
            .then(() => {
                window.alert("Post updated successfully");
                setTitle(newTitle);
                setBody(newBody);
            })
            .catch((error) => {
                window.alert("Post could not be updated");
                console.error(error);
            });
    }

    return <b onClick={handleEdit} style={styles.actionText}>Edit Post</b>;
}
