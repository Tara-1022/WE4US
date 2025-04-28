import { CommentView } from "lemmy-js-client";
import { ReviewContent, Ratings } from "./Types";
import Collapsible from "../Collapsible";
import { createComment, editComment } from "../../library/LemmyApi";
import { getReviewContent } from "./Types";
import { useCommentsContext } from "../CommentsContext";
import StarRatingInput from "./StarRatingInput";

export function ReviewFormHandler({ task, handleTask, defaultContent }:
    { task: string, handleTask: (newContent: ReviewContent) => void, defaultContent?: ReviewContent }) {

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
        <Collapsible CollapsedIcon={() => <b>Add Review</b>} OpenIcon={() => <b>{task}</b>} initiallyExpanded={false}>
            <form onSubmit={handleSubmit}>
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
            </form>
        </Collapsible>
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

    return <ReviewFormHandler task="Add Review" handleTask={handleCreate} />
}

export function ReviewEditor({ initialReview }: { initialReview: CommentView }) {
    const { setComments } = useCommentsContext();
    const initialContent = getReviewContent(initialReview);

    async function handleEdit(newContent: ReviewContent) {
        editComment(
            initialReview.comment.id,
            JSON.stringify(newContent)
        )
            .then(
                (updatedReview) => setComments(prevReviews => prevReviews.map(
                    (element: CommentView) =>
                        element.comment.id === updatedReview.comment.id ? updatedReview : element
                ))
            )
            .catch(
                (error: Error) => {
                    window.alert("Error editing review!");
                    console.error(error);
                }
            )
    }

    return <ReviewFormHandler task="Edit" handleTask={handleEdit} defaultContent={initialContent} />
}