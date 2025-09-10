import React from "react";

function StarRating({ value = 0 }) {
  const stars = Math.round(Math.max(0, Math.min(5, value)));
  return (
    <div className="flex text-yellow-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < stars ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

export default function ProductItem({ product, onToggleFavorite, isFavorited }) {
  return (
    <article className="border p-4 rounded card transition-all duration-200 ease-in hover:shadow-2xl hover:scale-105">
      <img src={product.thumbnail || product.images?.[0]} alt={product.title} className="w-full h-40 object-cover mb-2" />
      <h3 className="font-semibold truncate">{product.title}</h3>
      <p>${product.price}</p>
      <StarRating value={product.rating} />
      <button onClick={onToggleFavorite} className="mt-2 px-3 py-1 border rounded">
        {isFavorited ? "♥ Favorited" : "♡ Favorite"}
      </button>
    </article>
  );
}