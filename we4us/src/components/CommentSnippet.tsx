import { CommentView } from "lemmy-js-client";
import { Link } from "react-router-dom";

let styles = {
    container: {
        marginLeft: "1%",
        padding: "1%"
    }
}

export default function CommentSnippet({ commentView }: { commentView: CommentView }) {
    return (
        <p style={styles.container}>
            {commentView.comment.deleted ? "Comment deleted" : commentView.comment.content} <br />
            <Link to={"/profile/" + commentView.creator.name}>{commentView.creator.display_name ? commentView.creator.display_name : commentView.creator.name}</Link>
        </p>
    )
}