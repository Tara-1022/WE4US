import { useState } from "react";
import "../../styles/Ratings.css";

interface StarRatingInputProps {
  name: string;
  defaultValue?: number;
}

export default function StarRatingInput({ 
  name, 
  defaultValue = 0
}: StarRatingInputProps) {
  const [rating, setRating] = useState<number>(defaultValue);
  const [hover, setHover] = useState<number>(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hover || rating) ? "full-star" : "empty-star"}`}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          {star <= (hover || rating) ? "★" : "☆"}
        </span>
      ))}
      <input type="hidden" name={name} value={rating} required />
    </div>
  );
}