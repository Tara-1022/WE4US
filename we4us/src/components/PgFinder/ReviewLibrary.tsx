import { CommentView } from "lemmy-js-client";
import { ReviewContent, Ratings } from "./Types";
import { createComment, editComment } from "../../library/LemmyApi";
import { getReviewContent } from "./Types";
import { useCommentsContext } from "../CommentsContext";
import StarRatingInput from "./StarRatingInput";
import { useState } from "react";

function isReviewContentValid(content: string) {
    const reviewRegex = /^(.*\S.*)$/;
    console.log(content, reviewRegex.test(content))
    return reviewRegex.test(content);
};

export function ReviewFormHandler({ task, handleTask, onClose, defaultContent }:
    {
        task: string, handleTask: (newContent: ReviewContent) => void,
        onClose: () => void, defaultContent?: ReviewContent
    }) {

    const [isValid, setIsValid] = useState(false);

    async function handleContentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        if (!isReviewContentValid(e.currentTarget.value)) setIsValid(false);
        else setIsValid(true);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const entries = Object.fromEntries(formData);

        const ratings: Ratings = {
            cost: Number(entries.costRating),
            safety: Number(entries.safetyRating),
            food: Number(entries.foodRating),
            cleanliness: Number(entries.cleanlinessRating)
        }
        handleTask({ ratings, content: entries.content.toString() });
    }

    return (
        <form onSubmit={handleSubmit} className="pg_review-form">
            <label className="large-label">Ratings (1-5):</label>

            <div className="star-input-container">
                <label htmlFor="costRating">Cost : </label>
                <StarRatingInput
                    name="costRating"
                    defaultValue={defaultContent?.ratings.cost}
                />
            </div>

            <div className="star-input-container">
                <label htmlFor="safetyRating">Safety : </label>
                <StarRatingInput
                    name="safetyRating"
                    defaultValue={defaultContent?.ratings.safety}
                />
            </div>

            <div className="star-input-container">
                <label htmlFor="foodRating">Food : </label>
                <StarRatingInput
                    name="foodRating"
                    defaultValue={defaultContent?.ratings.food}
                />
            </div>

            <div className="star-input-container">
                <label htmlFor="cleanlinessRating">Cleanliness : </label>
                <StarRatingInput
                    name="cleanlinessRating"
                    defaultValue={defaultContent?.ratings.cleanliness}
                />
            </div>

            <label htmlFor="content" className="large-label">Review: </label>
            <textarea name="content"
                defaultValue={defaultContent?.content || undefined}
                onChange={handleContentChange}
                required />
            <br />
            <button type="submit" disabled={!isValid}>{task}</button>
            <button type="reset">Reset</button>
            <button onClick={onClose} className="cancel-button">Cancel</button>
        </form>
    )
}

export function ReviewCreator({ postId }: { postId: number }) {
    const { setComments } = useCommentsContext();

    const [isOpen, setIsOpen] = useState(false);

    function handleCreate(newContent: ReviewContent) {
        createComment({
            content: JSON.stringify(newContent),
            post_id: postId
        })
            .then(
                (newReview: CommentView) => setComments(prevReviews => [newReview, ...prevReviews])
            )
            .catch((error: Error) => {
                window.alert("Error creating review!");
                console.error(error);
            })
    }

    return isOpen ?
        <ReviewFormHandler task="Add Review"
            handleTask={handleCreate} onClose={() => { setIsOpen(false) }} />
        : <b onClick={() => { setIsOpen(true) }}>Add Review</b>

}

export function ReviewEditor({ initialReview, onClose }:
    { initialReview: CommentView, onClose: () => void }) {
    const { setComments } = useCommentsContext();
    const initialContent = getReviewContent(initialReview);

    async function handleEdit(newContent: ReviewContent) {
        console.log("Trying to edit", newContent)
        editComment(
            initialReview.comment.id,
            JSON.stringify(newContent)
        )
            .then(
                (updatedReview) => {
                    setComments(prevReviews => prevReviews.map(
                        (element: CommentView) =>
                            element.comment.id === updatedReview.comment.id ? updatedReview : element
                    ));
                    onClose();
                }
            )
            .catch(
                (error: Error) => {
                    window.alert("Error editing review!");
                    console.error(error);
                }
            )
    }

    return <ReviewFormHandler task="Edit" handleTask={handleEdit}
        onClose={onClose} defaultContent={initialContent} />
}