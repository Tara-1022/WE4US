import { CommentView } from 'lemmy-js-client';
import { useProfileContext } from '../ProfileContext';
import LikeHandler from '../LikeHandler';
import { Link } from "react-router-dom";
import CommentDeletor from '../CommentDeletor';
import { ReviewEditor } from './ReviewLibrary';
import RatingsView from './RatingsView';
import { getReviewContent } from './Types';
import ReactMarkdown from "react-markdown";
import { useState } from 'react';

// A more restrictive comment

let styles = {
    container: {
        marginLeft: "1%",
        padding: "1%"
    },
    postLink: {
        fontSize: "small",
        margin: "2%"
    }
}

export function ReviewSnippet({ review, withPostLink = false }:
    { review: CommentView, withPostLink?: boolean }) {

    return (
        <div style={styles.container}>
            {review.comment.deleted ?
                "Review deleted" :
                <>
                    <RatingsView ratings={getReviewContent(review).ratings} />
                    <ReactMarkdown>{getReviewContent(review).content}</ReactMarkdown>
                </>} <br />
            <Link to={"/profile/" + review.creator.name}>{review.creator.display_name ? review.creator.display_name : review.creator.name}</Link>
            {
                withPostLink &&
                <Link to={"/pg-finder/" + review.post.id} style={styles.postLink}>
                    Go to Post
                </Link>
            }
        </div>
    )
}

export default function Review({ review }: { review: CommentView }) {
    const { profileInfo } = useProfileContext();
    const [isEditing, setIsEditing] = useState(false)

    return (
        <div style={styles.container}>
            {
                isEditing ?
                    <ReviewEditor initialReview={review} onClose={() => setIsEditing(false)} />
                    :
                    <>
                        <ReviewSnippet review={review} />
                        <LikeHandler forPost={false} isInitiallyLiked={review.my_vote == 1} initialLikes={review.counts.score} id={review.comment.id} />

                        {(!review.comment.deleted && review.creator.id == profileInfo?.lemmyId) &&
                            <>
                                <CommentDeletor commentId={review.comment.id} />
                                <b style={{
                                    background: "none",
                                    border: "none",
                                    color: "#a0a8b0",
                                    cursor: "pointer",
                                    fontWeight: "500" as const,
                                    padding: 0,
                                    fontSize: "13px",
                                    display: "flex",
                                    alignItems: "center"
                                }}
                                    onClick={() => setIsEditing(true)}>
                                    Edit
                                </b>
                            </>}
                    </>
            }
        </div>
    );
}