import { PostView, CommentView } from 'lemmy-js-client';
import { useEffect, useState } from 'react';
import { getPostById, getComments } from '../library/LemmyApi';
import { Loader } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import PostDeletor from '../components/PostDeletor';
import PgPostEditor from '../components/PgFinder/PgPostEditor';
import { useProfileContext } from '../components/ProfileContext';
<<<<<<< HEAD
import { PgPostBody } from '../components/PgFinder/PostCreationHandler';
import ReactMarkdown from "react-markdown"
import '../styles/PgPostPage.css';
=======
import { PgPostBody, Ratings, Average, getReviewContent } from '../components/PgFinder/Types';
import ReactMarkdown from "react-markdown";
import { CommentsContext, commentsContextValueType } from '../components/CommentsContext';
import RatingsView from '../components/PgFinder/RatingsView';
import Review from '../components/PgFinder/Review';
import { ReviewCreator } from '../components/PgFinder/ReviewLibrary';

function FullPostView({ postView }: { postView: PostView }) {
    let pgDetails: PgPostBody = JSON.parse(postView.post.body || "{}");

    return <div><h3>{postView.post.name}</h3>
        <p>Location : {pgDetails.location || 'N/A'}</p>
        {postView.post.url && (
            <p>
                <strong>Map URL:</strong>{" "}
                <a href={postView.post.url} target="_blank" rel="noopener noreferrer">
                    {postView.post.url}
                </a>
            </p>
        )}
        <p>AC Available: {pgDetails.acAvailable ? 'Yes' : 'No'}</p>
        <p>Food Type: {pgDetails.foodType || 'N/A'}</p>
        <h5>Description (Extra Information:) </h5>
        <ReactMarkdown>{pgDetails.description || 'No description provided'}</ReactMarkdown>
        <Link to={"/profile/" + postView.creator.name}>
            <p>{postView.creator.display_name ? postView.creator.display_name : postView.creator.name}</p>
        </Link>
    </div>
}
>>>>>>> 75971a361576cc5b99ac097356e10df3edf329aa

export default function PgPostPage() {
    const postId = Number(useParams().pgId);
    const [postView, setPostView] = useState<PostView | null>(null);
    const [reviews, setReviews] = useState<CommentView[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const usersWithReviews = reviews
        .filter(review => !review.comment.deleted)
        .map((reviewView) => reviewView.creator.id)
    const { profileInfo } = useProfileContext();

    const filteredReviews = reviews.filter((review) => !review.comment.deleted)
    const avgRatings: Ratings | null =
        filteredReviews.length == 0 ?
            null :
            Average(filteredReviews
                .map((review) => getReviewContent(review).ratings))

    let commentsContextValue: commentsContextValueType = {
        comments: reviews,
        setComments: setReviews,
        postId: postId
    };

    useEffect(
        () => {
            getPostById(postId).then(
                response => setPostView(response ? response.post_view : null)
            );
            getComments({ postId: postId }).then(
                comments => setReviews(comments)
            );
            commentsContextValue = { ...commentsContextValue, postId: postId };
        },
        [postId]
    )

    useEffect(() => { commentsContextValue = { ...commentsContextValue, comments: reviews } }
        , [reviews])


    if (!postView) return <Loader />;

    let list = filteredReviews.map(
        (review) => <li key={review.comment.id} >
            <Review review={review} />
        </li>
    )
    return (
<<<<<<< HEAD
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
                 <p><span className="label">AC Available:</span> {pgDetails.acAvailable ? 'Yes' : 'No'}</p>
                <p><span className="label">Food Type:</span> {pgDetails.foodType || 'N/A'}</p>
            </div>

            <div className="pg-rating">
                <p><span className="label">Cost Rating:</span> {formatRating(pgDetails.ratings?.cost)}/5</p>
                <p><span className="label">Safety Rating:</span> {formatRating(pgDetails.ratings?.safety)}/5</p>
                <p><span className="label">Food Rating:</span> {formatRating(pgDetails.ratings?.food)}/5</p>
                <p><span className="label">Cleanliness Rating:</span> {formatRating(pgDetails.ratings?.cleanliness)}/5</p>
                </div>

            <div className="pg-description">
                <h5>Additional Information: </h5>
                <ReactMarkdown>{pgDetails.description || 'No description provided'}</ReactMarkdown>
            </div>

            <div className="pg-profile">Added by @
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

=======
        <CommentsContext.Provider value={commentsContextValue}>
            {isEditing ?
                <PgPostEditor
                    postView={postView}
                    onClose={() => setIsEditing(false)}
                    onPostUpdated={setPostView} />
                :
                <>
                    <FullPostView postView={postView} />
                    <RatingsView ratings={avgRatings} />

                    {postView.creator.id == profileInfo?.lemmyId &&
                        <>
                            <PostDeletor postId={postView.post.id} />
                            &nbsp;
                            {!isEditing &&
                                <b
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit
                                </b>}
                        </>
                    }
                </>
            }
            {/* Reviews */}
            {profileInfo &&
                !usersWithReviews.some((value) => value == profileInfo.lemmyId)
                &&
                <ReviewCreator postId={postView.post.id} />
            }
            <ul style={{
                listStyleType: "none",
                margin: 0,
                padding: 0
            }}>{list}</ul>
        </CommentsContext.Provider>
>>>>>>> 75971a361576cc5b99ac097356e10df3edf329aa
    );
}