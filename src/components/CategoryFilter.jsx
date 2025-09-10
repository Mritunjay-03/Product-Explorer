import React from "react";

export default function CategoryFilter({ categories = [], value, onChange }) {
  return (
    <div>
      <label className="block mb-1">Category</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full p-2 border rounded">
        {categories.map((c) => (
          <option key={typeof c === "string" ? c : c.name || c.id} value={typeof c === "string" ? c : c.name || c.id}>
            {typeof c === "string" ? c : c.name || c.id}
           </option>
        ))}
      </select>
    </div>
  );
}