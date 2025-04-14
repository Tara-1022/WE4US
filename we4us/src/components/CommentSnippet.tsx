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
            <Link to={"/post/" + commentView.post.id} style={{ all: "unset" }}>
                {commentView.comment.deleted ? "Comment deleted" : commentView.comment.content} <br />
            </Link>
            <p>Created: &nbsp;
                {new Date(commentView.comment.published).toLocaleString()} </p>
            <p>
                {commentView.comment.updated ?
                    "Edited: " + new Date(commentView.comment.updated).toLocaleString() :
                    ""}
            </p>
            <Link to={"/profile/" + commentView.creator.name}>{commentView.creator.display_name ? commentView.creator.display_name : commentView.creator.name}</Link>
        </p>
    )
}