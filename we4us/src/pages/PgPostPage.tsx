import { PostView, CommentView } from 'lemmy-js-client';
import { useEffect, useState } from 'react';
import { getPostById, getComments } from '../library/LemmyApi';
import { Loader } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import PostDeletor from '../components/PostDeletor';
import PgPostEditor from '../components/PgFinder/PgPostEditor';
import { useProfileContext } from '../components/ProfileContext';
import '../styles/PgPostPage.css';
import { PgPostBody, Ratings, Average, getReviewContent } from '../components/PgFinder/Types';
import ReactMarkdown from "react-markdown";
import { CommentsContext, commentsContextValueType } from '../components/CommentsContext';
import RatingsView from '../components/PgFinder/RatingsView';
import Review from '../components/PgFinder/Review';
import { ReviewCreator } from '../components/PgFinder/ReviewLibrary';

export default function PgPostPage() {
    const postId = Number(useParams().pgId);
    const [postView, setPostView] = useState<PostView | null>(null);
    const [reviews, setReviews] = useState<CommentView[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const { profileInfo } = useProfileContext();

    const filteredReviews = reviews.filter((review) => !review.comment.deleted);
    const usersWithReviews = filteredReviews.map((reviewView) => reviewView.creator.id);
    
    const avgRatings: Ratings | null =
        filteredReviews.length === 0 ? null :
        Average(filteredReviews.map((review) => getReviewContent(review).ratings));

    let commentsContextValue: commentsContextValueType = {
        comments: reviews,
        setComments: setReviews,
        postId: postId
    };

    useEffect(() => {
        getPostById(postId).then(
            response => setPostView(response ? response.post_view : null)
        );
        getComments({ postId: postId }).then(
            comments => setReviews(comments)
        );
    }, [postId]);

    if (!postView) return <Loader />;

    const pgDetails: PgPostBody = JSON.parse(postView.post.body || "{}");

    const reviewList = filteredReviews.map((review) => (
        <li key={review.comment.id}>
            <Review review={review} />
        </li>
    ));

    return (
        <CommentsContext.Provider value={commentsContextValue}>
            {isEditing ? (
                <PgPostEditor
                    postView={postView}
                    onClose={() => setIsEditing(false)}
                    onPostUpdated={setPostView}
                />
            ) : (
                <div className="pg-post-page">
                    <div className="pg-post-header">
                        <h3>{postView.post.name}</h3>
                        <p><span className="label">Location: </span>{pgDetails.location || 'Not Specified'}</p>
                        {postView.post.url && (
                            <p>
                                <span className="label">Map URL: </span>
                                <a href={postView.post.url} target="_blank" rel="noopener noreferrer">
                                    {postView.post.url}
                                </a>
                            </p>
                        )}
                        <p><span className="label">AC Available: </span>{pgDetails.acAvailable ? 'Yes' : 'No'}</p>
                        <p><span className="label">Food Type: </span>{pgDetails.foodType || 'N/A'}</p>
                    </div>

                    <RatingsView ratings={avgRatings} />

                    <div className="pg-description">
                        <h5>Additional Information: </h5>
                        <ReactMarkdown>{pgDetails.description || 'No description provided'}</ReactMarkdown>
                    </div>

                    <div className="pg-profile">
                        Added by @
                        <Link to={`/profile/${postView.creator.name}`}>
                            {postView.creator.display_name || postView.creator.name}
                        </Link>
                    </div>

                    {postView.creator.id === profileInfo?.lemmyId && (
                        <div className="pg-delete-box">
                            <PostDeletor postId={postView.post.id} />
                            <b style={{ cursor: "pointer", marginLeft: "10px" }}
                                onClick={() => setIsEditing(true)}
                            >
                                Edit
                            </b>
                        </div>
                    )}

                    {/* Reviews */}
                    {profileInfo && !usersWithReviews.includes(profileInfo.lemmyId) && (
                        <ReviewCreator postId={postView.post.id} />
                    )}

                    <ul style={{ listStyleType: "none", margin: 0, padding: 0 }}>
                        {reviewList}
                    </ul>
                </div>
            )}
        </CommentsContext.Provider>
    );
}
