import React from "react";


export default function StarRating({ value = 0 }) {
const stars = Math.round(Math.max(0, Math.min(5, value)));
return (
<div className="flex text-yellow-500">
{Array.from({ length: 5 }).map((_, i) => (
<span key={i}>{i < stars ? "★" : "☆"}</span>
))}
</div>
);
}