import { PostView } from 'lemmy-js-client';
import { Link } from 'react-router-dom';

let styles: { [key: string]: React.CSSProperties } = {
    post: {
        display: "flex",
        flexFlow: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: "2%"
    },
    details: {
        flex: 4
    }
}

export default function JobPostSnippet({ postView }: { postView: PostView }) {
    // A succint display of primary information of the job post
    let postBody = {};

    try {
        postBody = postView.post.body ? JSON.parse(postView.post.body) : {};
    } catch (error) {
        console.error("Error parsing post body:", error);
    }

    return (
        <div style={styles.post}>

            <div style={styles.details}>
                <Link to={"/job-board/" + postView.post.id}>
                    <h3>{postView.post.name}</h3>
                </Link>
                <p><strong>Posted by: </strong>{postView.creator.display_name ? postView.creator.display_name : postView.creator.name}</p>
                <p><strong>Company:</strong> {postBody.company || "N/A"}</p>
                <p><strong>Job Status:</strong> {postBody.open ? "Open" : "Closed"}</p>
                <p><strong>Type:</strong> {postBody.job_type || "Not specified"}</p>
                <p><strong>Role:</strong> {postBody.role || "Not mentioned"}</p>
            </div>

        </div>
    );
}