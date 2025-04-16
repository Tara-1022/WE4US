import { PostView } from 'lemmy-js-client';
import { useEffect, useState } from 'react';
import { getPostById } from '../library/LemmyApi';
import { Loader } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import CommentsSection from '../components/CommentsSection';
import PostDeletor from '../components/PostDeletor';
import { useProfileContext } from '../components/ProfileContext';
import { PgPostBody } from '../components/PgFinder/PostCreationHandler';
import ReactMarkdown from "react-markdown"
import '../styles/PgPostPage.css';

export default function PgPostPage() {
    const pgId = Number(useParams().pgId);
    const [postView, setPostView] = useState<PostView | null>(null);
    const { profileInfo } = useProfileContext();

    useEffect(
        () => {
            getPostById(pgId).then(
                response =>
                    setPostView(response ? response.post_view : null)
            )
        },
        [pgId]
    )
    if (!postView) return <Loader />;
    let pgDetails: PgPostBody = JSON.parse(postView.post.body || "{}");
    const formatRating = (rating: number | null) => {
        if (rating === null) return 'N/A';
        return rating === 0 ? '0' : rating;
    }

    return (
        <div className="pg-post-page">
            <div className="pg-post-header">
                <h3>{postView.post.name}</h3>
                <p><span className="label">Location: </span>{pgDetails.location || 'N/A'}</p>
                {postView.post.url && (
                    <p>
                        <strong>Map URL:</strong>{" "}
                        <a href={postView.post.url} target="_blank" rel="noopener noreferrer">
                            {postView.post.url}
                        </a>
                    </p>
                )}
            </div>

            <div className="pg-rating">
                <p><span className="label">Cost Rating:</span> {formatRating(pgDetails.ratings?.cost)}/5</p>
                <p><span className="label">Safety Rating:</span> {formatRating(pgDetails.ratings?.safety)}/5</p>
                <p><span className="label">Food Rating:</span> {formatRating(pgDetails.ratings?.food)}/5</p>
                <p><span className="label">Cleanliness Rating:</span> {formatRating(pgDetails.ratings?.cleanliness)}/5</p>
                <p><span className="label">AC Available:</span> {pgDetails.acAvailable ? 'Yes' : 'No'}</p>
                <p><span className="label">Food Type:</span> {pgDetails.foodType || 'N/A'}</p>
            </div>

            <div className="pg-description">
                <h5>Additional Information: </h5>
                <ReactMarkdown>{pgDetails.description || 'No description provided'}</ReactMarkdown>
            </div>

            <div className="pg-profile">@
                <Link to={`/profile/${postView.creator.name}`}>
                    <p>{postView.creator.display_name || postView.creator.name}</p>
                </Link>
            </div>
            <div className="pg-comments-section">
                <CommentsSection postId={postView.post.id} />

            {postView.creator.id == profileInfo?.lemmyId && (
                <div className="pg-delete-box">
                <PostDeletor postId={postView.post.id} />
                </div>
            )}
            </div>
        </div>

    );
}