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
    },
    postLink: {
        fontSize: "small",
        margin: "2%"
    }
}

export default function CommentList({ commentViews }: { commentViews: CommentView[] }) {
    // Return a list of CommentSnippets, excluding comments on deleted posts
    // TODO: link to the exact comment location
    const list = commentViews
        .map(
            commentView => <li key={"comment" + commentView.comment.id} style={styles.listItem}>
                <CommentSnippet commentView={commentView} withPostLink={true}/>
            </li>
        )
    return <ul style={styles.list}>{list}</ul>;

}