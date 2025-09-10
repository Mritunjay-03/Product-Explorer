import React, { useState, useEffect } from "react";

export default function SearchBar({ onSearch, initialValue}) {
  const [value, setValue] = useState(initialValue || "");

  useEffect(() => setValue(initialValue || ""), [initialValue]);

  useEffect(() => {
    const id = setTimeout(() => onSearch(value), 400);
    return () => clearTimeout(id);
  }, [value]);

  return (
    <div>
      <label className="block mb-1">Search</label>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products..."
        className="w-full p-2 border rounded"
      />
    </div>
  );
}