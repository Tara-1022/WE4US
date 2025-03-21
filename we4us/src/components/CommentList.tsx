import { CommentView } from "lemmy-js-client";
import CommentSnippet from "./CommentSnippet";
import { Link } from "react-router-dom";

let styles = {
    list: {
        listStyleType: "none",
        margin: 0,
        padding: 0
    },
    listItem: {
        cursor: 'pointer',
        border: "1px solid #ccc",
        borderRadius: "8px",
        margin: "1%"
    }
}

export default function CommentList({ commentViews }: { commentViews: CommentView[] }) {
    // Return a list of CommentSnippets, excluding comments on deleted posts
    // TODO: link to the exact comment location
    const list = commentViews
        .map(
            commentView => <li key={commentView.comment.id} style={styles.listItem}>
                <Link to={"/post/" + commentView.post.id} style={{ all: "unset" }}>
                    <CommentSnippet commentView={commentView} />
                </Link>
            </li>
        )
    return <ul style={styles.list}>{list}</ul>;

}