import { PostView, CommentView } from 'lemmy-js-client';
import { useEffect, useState } from 'react';
import { getPostById, getComments } from '../library/LemmyApi';
import { Loader } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import PostDeletor from '../components/PostDeletor';
import { useProfileContext } from '../components/ProfileContext';
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

export default function PgPostPage() {
    const postId = Number(useParams().pgId);
    const [postView, setPostView] = useState<PostView | null>(null);
    const [reviews, setReviews] = useState<CommentView[]>([]);
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

    let list = reviews.map(
        (review) => <li key={review.comment.id} >
            <Review review={review} />
        </li>
    )
    console.log("All filtered: ", filteredReviews.map(review => review.comment.content))
    console.log("Avergae rating: ", avgRatings)
    return (
        <CommentsContext.Provider value={commentsContextValue}>
            <FullPostView postView={postView} />
            <RatingsView ratings={avgRatings} />

            {postView.creator.id == profileInfo?.lemmyId &&
                <PostDeletor postId={postView.post.id} />}

            {/* Reviews */}
            <ReviewCreator postId={postView.post.id} />
            <ul style={{
                listStyleType: "none",
                margin: 0,
                padding: 0
            }}>{list}</ul>
        </CommentsContext.Provider>
    );
}