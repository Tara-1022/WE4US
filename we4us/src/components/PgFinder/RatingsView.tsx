import { Ratings } from "./Types";

export default function RatingsView({ ratings }: { ratings: Ratings }) {
    const formatRating = (rating: number | null) => {
        if (rating === null) return 'N/A';
        return rating === 0 ? '0' : rating;
    }

    return (
        <>
            <p>Cost Rating: {formatRating(ratings.cost)}/5</p>
            <p>Safety Rating: {formatRating(ratings.safety)}/5</p>
            <p>Food Rating: {formatRating(ratings.food)}/5</p>
            <p>Cleanliness Rating: {formatRating(ratings.cleanliness)}/5</p>
        </>
    )
}