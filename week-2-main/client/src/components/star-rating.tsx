import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  className?: string;
}

export function StarRating({ value, onChange, className }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const getRatingText = (rating: number) => {
    const texts = {
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Very Good",
      5: "Excellent",
    };
    return texts[rating as keyof typeof texts] || "Click to rate";
  };

  return (
    <div className={cn("text-center", className)}>
      <div className="flex justify-center space-x-2 mb-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            className="text-4xl transition-colors duration-200 focus:outline-none"
            onMouseEnter={() => setHoverRating(rating)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => onChange(rating)}
          >
            <Star
              className={cn(
                "w-10 h-10",
                (hoverRating || value) >= rating
                  ? "text-warning fill-warning"
                  : "text-slate-300"
              )}
            />
          </button>
        ))}
      </div>
      <p className="text-sm text-secondary">
        {getRatingText(hoverRating || value)}
      </p>
    </div>
  );
}
