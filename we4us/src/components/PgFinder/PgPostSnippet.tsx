import { PostView } from 'lemmy-js-client';
import { Link } from 'react-router-dom';
import "../../styles/PgFinderPage.css";

export default function PgPostSnippet({ postView }: { postView: PostView }) {
    // A succint display of primary information of the pg post
    let pgData;
    try {
        pgData = JSON.parse(postView.post.body || "{}");
    } catch (e) {
        pgData = { location: "Unknown", ratings: null };
    }

    return (
        <div className="pg-post">
            <div className="pg-post-details">
                <Link to={"/pg-finder/" + postView.post.id}>
                    <h3>{"🏠︎   " + postView.post.name}</h3>
                </Link>

                <div className="pg-post-location">
                    ⚲ Location: {pgData.location || "Not specified"}
                </div>
        </div>
       </div> 
    );
}