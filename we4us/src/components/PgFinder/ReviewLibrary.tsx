import { CommentView } from "lemmy-js-client";
import { ReviewContent, Ratings } from "./Types";
import Collapsible from "../Collapsible";
import { createComment, editComment } from "../../library/LemmyApi";
import { getReviewContent } from "./Types";
import { useCommentsContext } from "../CommentsContext";
import StarRatingInput from "./StarRatingInput";

export function ReviewFormHandler({ task, handleTask, onClose, defaultContent }:
    {
        task: string, handleTask: (newContent: ReviewContent) => void,
        onClose: () => void, defaultContent?: ReviewContent
    }) {

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
                <label>Ratings (1-5):</label>
                <br />
                <label htmlFor="costRating">Cost : </label>
                <StarRatingInput 
                  name="costRating" 
                  defaultValue={defaultContent?.ratings.cost} 
                />
                <br />
                <label htmlFor="safetyRating">Safety : </label>
                <StarRatingInput 
                  name="safetyRating" 
                  defaultValue={defaultContent?.ratings.safety} 
                />
                <br />
                <label htmlFor="foodRating">Food : </label>
                <StarRatingInput 
                  name="foodRating" 
                  defaultValue={defaultContent?.ratings.food} 
                />
                <br />
                <label htmlFor="cleanlinessRating">Cleanliness : </label>
                <StarRatingInput 
                  name="cleanlinessRating" 
                  defaultValue={defaultContent?.ratings.cleanliness} 
                />
                <br />
                <label htmlFor="content">Review: </label>
                <textarea name="content" defaultValue={defaultContent?.content || undefined} />
                <br />
                <button type="submit">{task}</button>
                <button type="reset">Reset</button>
                <button onClick={onClose}>Cancel</button>
            </form>
    )
}

export function ReviewCreator({ postId }: { postId: number }) {
    const { setComments } = useCommentsContext();

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

    return <Collapsible
        CollapsedIcon={() => <b>Add Review</b>}
        OpenIcon={() => <b>Cancel</b>}
        initiallyExpanded={false}>
        <ReviewFormHandler task="Add Review" handleTask={handleCreate} onClose={() => { }} />
    </Collapsible>
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