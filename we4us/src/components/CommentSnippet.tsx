import { CommentView } from "lemmy-js-client";
import { Link } from "react-router-dom";
import { getCommunityPath } from "../constants";

let styles = {
    container: {
        marginLeft: "1%",
        padding: "1%"
    },
    postLink: {
        fontSize: "small",
        margin: "2%"
    }
}

export default function CommentSnippet({ commentView, withPostLink = false }:
    { commentView: CommentView, withPostLink?: boolean }) {

    return (
        <>
            <p style={styles.container}>
                {commentView.comment.deleted ? "Comment deleted" : commentView.comment.content} <br />
                <p>Created: &nbsp;
                    {new Date(commentView.comment.published).toLocaleString()} </p>
                <p>
                    {commentView.comment.updated ?
                        "Edited: " + new Date(commentView.comment.updated).toLocaleString() :
                        ""}
                </p>
                <Link to={"/profile/" + commentView.creator.name}>{commentView.creator.display_name ? commentView.creator.display_name : commentView.creator.name}</Link>
            </p>
            {
                withPostLink &&
                <Link to={
                    `/${getCommunityPath(commentView.community.name) || "post"}/`
                    + commentView.post.id
                } style={styles.postLink}>
                    Go to Post
                </Link>
            }
        </>
    )
}