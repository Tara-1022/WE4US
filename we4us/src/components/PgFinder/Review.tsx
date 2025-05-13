import { CommentView } from 'lemmy-js-client';
import { useProfileContext } from '../ProfileContext';
import LikeHandler from '../LikeHandler';
import { Link } from "react-router-dom";
import CommentDeletor from '../CommentDeletor';
import { ReviewEditor } from './ReviewLibrary';
import RatingsView from './RatingsView';
import { getReviewContent } from './Types';
import ReactMarkdown from "react-markdown";
import "../../styles/PgReviews.css";

export function ReviewSnippet({ review, withPostLink = false }:
    { review: CommentView, withPostLink?: boolean }) {

    return (
        <div className="pg_review-container">
            {review.comment.deleted ?
                "Review deleted" :
                <>
                    <RatingsView ratings={getReviewContent(review).ratings} />
                    <ReactMarkdown>{getReviewContent(review).content}</ReactMarkdown>
                </>} <br />
            <Link to={"/profile/" + review.creator.name}>{review.creator.display_name ? review.creator.display_name : review.creator.name}</Link>
            {
                withPostLink &&
                <Link to={"/pg-finder/" + review.post.id}>
                    Go to Post
                </Link>
            }
        </div>
    )
}

export default function Review({ review }: { review: CommentView }) {
    const { profileInfo } = useProfileContext();

    return (
        <div className="pg_review-container">
            <ReviewSnippet review={review} />
            <LikeHandler forPost={false} isInitiallyLiked={review.my_vote == 1} initialLikes={review.counts.score} id={review.comment.id} />

            {(!review.comment.deleted && review.creator.id == profileInfo?.lemmyId) &&
                <>
                    <ReviewEditor initialReview={review} onClose={() => {}}/>
                    <CommentDeletor commentId={review.comment.id} />
                </>}

        </div>
    );
}