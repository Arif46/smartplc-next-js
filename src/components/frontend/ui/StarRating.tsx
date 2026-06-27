import { Star } from "lucide-react";

export default function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < Math.round(rating)
              ? "fill-warning text-warning"
              : "fill-muted text-muted"
          }`}
        />
      ))}
      {count !== undefined && (
        <span className="text-xs text-muted-foreground ml-1">({count})</span>
      )}
    </div>
  );
}
