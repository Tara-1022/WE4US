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

    return (
        <div style={styles.post}>

            <div style={styles.details}>
                <Link to={"/job-board/" + postView.post.id}>
                    <h3>{postView.post.name}</h3>
                </Link>
                <p>{postView.creator.display_name ? postView.creator.display_name : postView.creator.name}</p>
            </div>

        </div>
    );
}