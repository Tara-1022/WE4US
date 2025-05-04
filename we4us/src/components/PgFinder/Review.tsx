import { CommentView } from 'lemmy-js-client';
import { useProfileContext } from '../ProfileContext';
import LikeHandler from '../LikeHandler';
import { Link } from "react-router-dom";
import CommentDeletor from '../CommentDeletor';
import { ReviewEditor } from './ReviewLibrary';
import RatingsView from './RatingsView';
import { getReviewContent } from './Types';
import ReactMarkdown from "react-markdown";

// A more restrictive comment

let styles = {
    container: {
        marginLeft: "1%",
        padding: "1%"
    }
}

export function ReviewSnippet({ review }: { review: CommentView }) {

    return (
        <div style={styles.container}>
            {review.comment.deleted ?
                "Review deleted" :
                <>
                    <RatingsView ratings={getReviewContent(review).ratings} />
                    <ReactMarkdown>{getReviewContent(review).content}</ReactMarkdown>
                </>} <br />
            <Link to={"/profile/" + review.creator.name}>{review.creator.display_name ? review.creator.display_name : review.creator.name}</Link>
        </div>
    )
}

export default function Review({ review }: { review: CommentView }) {
    const { profileInfo } = useProfileContext();

    return (
        <div style={styles.container}>
            <ReviewSnippet review={review} />
            <LikeHandler forPost={false} isInitiallyLiked={review.my_vote == 1} initialLikes={review.counts.score} id={review.comment.id} />

            {(!review.comment.deleted && review.creator.id == profileInfo?.lemmyId) &&
                <>
                    <ReviewEditor initialReview={review} />
                    <CommentDeletor commentId={review.comment.id} />
                </>}

        </div>
    );
}