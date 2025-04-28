import { Ratings } from "./Types";
import "../../styles/Ratings.css"; 

export default function RatingsView({ ratings }: { ratings: Ratings | null }) {
    const formatRating = (rating: number | null) => {
        if (rating === null) return 'N/A';
        return Math.round(rating * 100) / 100;
    }

    const renderStars = (rating: number | null) => {
        if (rating === null) return 'N/A';
        
        const fullStars = Math.floor(rating);
        const halfStars = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStars ? 1 : 0);
        
        return (
            <div className="star-rating">
                {[...Array(fullStars)].map((_, i) => (
                    <span key={`full-${i}`} className="star full-star">★</span>
                ))}
                {halfStars && <span className="star half-star">★</span>}
                {[...Array(emptyStars)].map((_, i) => (
                    <span key={`empty-${i}`} className="star empty-star">☆</span>
                ))}
                <span className="rating-number">{formatRating(rating)}/5</span>
            </div>
        );
    };

    if (!ratings) return <h4>No ratings yet!</h4>
    
    return (
        <div className="ratings-container">
            <div className="rating-item">
                <span className="rating-label">Cost: </span>
                {renderStars(ratings.cost)}
            </div>
            <div className="rating-item">
                <span className="rating-label">Safety: </span>
                {renderStars(ratings.safety)}
            </div>
            <div className="rating-item">
                <span className="rating-label">Food: </span>
                {renderStars(ratings.food)}
            </div>
            <div className="rating-item">
                <span className="rating-label">Cleanliness: </span>
                {renderStars(ratings.cleanliness)}
            </div>
        </div>
    );
}