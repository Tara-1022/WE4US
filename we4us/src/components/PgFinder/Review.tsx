import { CommentView } from 'lemmy-js-client';
import { useProfileContext } from '../ProfileContext';
import LikeHandler from '../LikeHandler';
import { Link } from "react-router-dom";
import CommentDeletor from '../CommentDeletor';
import RatingsView from './RatingsView';
import { getReviewContent } from './Types';

// A more restrictive comment

let styles = {
    container: {
        marginLeft: "1%",
        padding: "1%"
    }
}

export function ReviewSnippet({ review }: { review: CommentView }) {

    return (
        <p style={styles.container}>
            {review.comment.deleted ?
                "Review deleted" :
                <>
                    <RatingsView ratings={getReviewContent(review).ratings} />
                    <p>review.comment.content</p>
                </>} <br />
            <Link to={"/profile/" + review.creator.name}>{review.creator.display_name ? review.creator.display_name : review.creator.name}</Link>
        </p>
    )
}

export default function Review({ review }: { review: CommentView }) {
    let styles = {
        container: {
            backgroundColor: "rgba(255,255,255,0.3)",
            marginLeft: "10%",
            padding: "1%"
        }
    }
    const { profileInfo } = useProfileContext();

    return (
        <div style={styles.container}>
            <ReviewSnippet review={review} />
            <LikeHandler forPost={false} isInitiallyLiked={review.my_vote == 1} initialLikes={review.counts.score} id={review.comment.id} />

            {(!review.comment.deleted && review.creator.id == profileInfo?.lemmyId) &&
                <CommentDeletor commentId={review.comment.id} />}

        </div>
    );
}