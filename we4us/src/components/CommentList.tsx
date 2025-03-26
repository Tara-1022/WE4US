import { CommentView } from "lemmy-js-client";
import CommentSnippet from "./CommentSnippet";

let styles = {
    list: {
        listStyleType: "none",
        margin: 0,
        padding: 0
    },
    listItem: {
        cursor: 'pointer'
    }
}

export default function CommentList({ commentViews }: { commentViews: CommentView[] }) {
    // Return a list of CommentSnippets, excluding comments on deleted posts
    // TODO: link to the exact comment location
    const list = commentViews
        .map(
            commentView => <li key={commentView.comment.id} style={styles.listItem}>
                <CommentSnippet commentView={commentView} />
            </li>
        )
    return <ul style={styles.list}>{list}</ul>;

}