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
import '../styles/PgPostPage.css';

export default function PgPostPage() {
    const postId = Number(useParams().pgId);
    const [postView, setPostView] = useState<PostView | null>(null);
    const [reviews, setReviews] = useState<CommentView[]>([]);
    const [isEditing, setIsEditing] = useState(false);

    const usersWithReviews = reviews.filter(review => !review.comment.deleted).map((reviewView) => reviewView.creator.id)
    const filteredReviews = reviews.filter((review) => !review.comment.deleted)
    const { profileInfo } = useProfileContext();
    
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
        commentsContextValue = { ...commentsContextValue, postId: postId };
    }, [postId]);

    useEffect(() => {
        commentsContextValue =
            { ...commentsContextValue, comments: reviews }
    }
        , [reviews]);

    if (!postView) return <Loader />;

    const reviewList = filteredReviews.map((review) => (
        <li key={review.comment.id}>
            <Review review={review} />
        </li>
    ));

    return (
        <CommentsContext.Provider value={commentsContextValue}>
            {isEditing
                ?
                <PgPostEditor
                    postView={postView}
                    onClose={() => setIsEditing(false)}
                    onPostUpdated={setPostView}
                />
                : (
                    <div className="pg-post-page">
                        <FullPostView
                            postView={postView}
                            avgRatings={avgRatings}
                        />

                        {postView.creator.id === profileInfo?.lemmyId && (
                            <div className="pg-delete-edit-box">
                                <PostDeletor postId={postView.post.id} />
                                <button className="pg-edit-box" onClick={() => setIsEditing(true)}>
                                    Edit
                                </button>
                            </div>
                        )}

                        <div className="pg-comments-section">
                            {profileInfo && !usersWithReviews.includes(profileInfo.lemmyId) && (
                                <ReviewCreator postId={postView.post.id} />
                            )}

                            <ul style={{ listStyleType: "none", margin: 0, padding: 0 }}>
                                {reviewList}
                            </ul>
                        </div>
                    </div>
                )}
        </CommentsContext.Provider>
    );
}

function FullPostView({ postView, avgRatings }:
    { postView: PostView, avgRatings: Ratings | null }) {

    const pgDetails: PgPostBody = JSON.parse(postView.post.body || "{}");

    return (
        <>
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

            <h3 className="pg-section-heading">Additional Information: </h3>
            <div className="pg-description">
                <ReactMarkdown>{pgDetails.description || 'No description provided'}</ReactMarkdown>
            </div>

            <div className="pg-profile">
                Added by:&nbsp;
                <Link to={`/profile/${postView.creator.display_name}`}>
                    {postView.creator.display_name}
                </Link>
            </div>
        </>
    );
}
