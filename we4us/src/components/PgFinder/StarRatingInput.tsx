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
      {
        (rating <= 5 && rating > 0) ?
          <input type="hidden" name={name} value={rating} required />
          : <input type="text" name={name} value={undefined} required
            style={{ position: "absolute", width: 10, height: 10, opacity: 0 }}
          />
      }
    </div>
  );
}