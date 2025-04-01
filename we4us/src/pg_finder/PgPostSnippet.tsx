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
    
    // Parse the body from JSON string to access our custom fields
    let pgData;
    try {
        pgData = JSON.parse(postView.post.body || "{}");
    } catch (e) {
        pgData = { location: "Unknown", ratings: { cost: 0, safety: 0, food: 0, cleanliness: 0 } };
    }

    return (
        <div style={styles.post}>
            <div style={styles.details}>
                <Link to={"/pg-finder/" + postView.post.id}>
                    <h3>{postView.post.name}</h3>
                </Link>
                <p>{postView.creator.display_name ? postView.creator.display_name : postView.creator.name}</p>
                
                <div style={styles.location}>
                    Location: {pgData.location || "Not specified"}
                </div>
                
                <div style={styles.ratings}>
                    <span style={styles.ratingItem}>Cost: {pgData.ratings?.cost || "N/A"}</span>
                    <span style={styles.ratingItem}>Safety: {pgData.ratings?.safety || "N/A"}</span>
                    <span style={styles.ratingItem}>Food: {pgData.ratings?.food || "N/A"}</span>
                    <span style={styles.ratingItem}>Cleanliness: {pgData.ratings?.cleanliness || "N/A"}</span>
                </div>
            </div>
        </div>
    );
}