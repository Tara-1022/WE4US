import { PostView } from 'lemmy-js-client';
import { Link } from 'react-router-dom';
import "./PgFinderPage.css";

export default function PgPostSnippet({ postView }: { postView: PostView }) {
    // A succint display of primary information of the pg post
    let pgData;
    try {
        pgData = JSON.parse(postView.post.body || "{}");
    } catch (e) {
        pgData = { location: "Unknown", ratings: { cost: null, safety: null, food: null, cleanliness: null } };
    }

    return (
        <div className="pg-post">
            <div className="pg-post-details">
                <Link to={"/pg-finder/" + postView.post.id}>
                    <h3>{postView.post.name}</h3>
                </Link>

                <div className="pg-post-location">
                    Location: {pgData.location || "Not specified"}
                </div>
                    <span className="pg-post-rating-item">Cost: {pgData.ratings?.cost || "N/A"}</span>
                    <span className="pg-post-rating-item">Safety: {pgData.ratings?.safety || "N/A"}</span>
                    <span className="pg-post-rating-item">Food: {pgData.ratings?.food || "N/A"}</span>
                    <span className="pg-post-rating-item">Cleanliness: {pgData.ratings?.cleanliness || "N/A"}</span>
            </div>
        </div>
    );
}