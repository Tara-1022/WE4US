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
    },
    ratings: {
        display: "flex",
        flexDirection: "row",
        gap: "10px",
        marginTop: "5px"
    },
    ratingItem: {
        marginRight: "10px"
    },
    location: {
        color: "#666",
        marginTop: "5px"
    }
}

export default function PgPostSnippet({ postView }: { postView: PostView }) {
    // A succint display of primary information of the pg post
    let pgData;
    try {
        pgData = JSON.parse(postView.post.body || "{}");
    } catch (e) {
        pgData = { location: "Unknown", ratings: null };
    }

    return (
        <div style={styles.post}>
            <div style={styles.details}>
                <Link to={"/pg-finder/" + postView.post.id}>
                    <h3>{postView.post.name}</h3>
                </Link>

                <div style={styles.location}>
                    Location: {pgData.location || "Not specified"}
                </div>
            </div>
        </div>
    );
}