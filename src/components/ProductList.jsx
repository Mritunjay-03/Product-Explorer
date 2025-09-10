import React from "react";
import ProductItem from "./ProductItem";

export default function ProductList({ products = [], onToggleFavorite, favoritesMap }) {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((p) => (
        <ProductItem
          key={p.id}
          product={p}
          onToggleFavorite={() => onToggleFavorite(p)}
          isFavorited={Boolean(favoritesMap[p.id])}
        />
      ))}
    </div>
  );
}