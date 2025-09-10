import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import ProductList from "./ProductList";

export default function ProductExplorer() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [limit] = useState(12);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(null);

  const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem("pe:darkMode")) || false);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("pe:favorites")) || {});

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("pe:darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [selectedCategory, skip]);

  async function fetchCategories() {
    try {
      const res = await axios.get("https://dummyjson.com/products/categories");
      setCategories(["all", ...res.data]);
    } catch {
      setCategories(["all"]);
    }
  }

  async function fetchProducts() {
    setLoading(true);
    setError(null);
    try {
      let url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
      if (selectedCategory !== "all") {
        url = `https://dummyjson.com/products/category/${selectedCategory}?limit=${limit}&skip=${skip}`;
      }
      const res = await axios.get(url);
      setProducts(res.data.products || []);
      setTotal(res.data.total ?? null);
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(q) {
    setQuery(q);
    setLoading(true);
    setError(null);
    try {
      if (!q){
        fetchProducts();
        return;
      }
      const res = await axios.get(`https://dummyjson.com/products/search?q=${encodeURIComponent(q)}`);
      setProducts(res.data.products || []);
      setTotal(res.data.total ?? null);
      setSkip(0);
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  function toggleFavorite(product) {
    setFavorites((prev) => {
      const next = { ...prev };
      if (next[product.id]) delete next[product.id];
      else next[product.id] = product;
      localStorage.setItem("pe:favorites", JSON.stringify(next));
      return next;
    });
  }

  const favoriteList = useMemo(() => Object.values(favorites), [favorites]);

  const canPrev = skip > 0;
  const canNext = total == null ? true : skip + limit < total;
  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = total ? Math.ceil(total / limit) : 1;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-bold">Product Explorer</h1>
          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode((d) => !d)} className="px-3 py-1 rounded-md border">
              {darkMode ? "Light" : "Dark"}
            </button>
            <span>Favorites: {favoriteList.length}</span>
          </div>
        </header>

        {/* Search and Category Filter - horizontal above the main section */}
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-8">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} initialValue={query} />
          </div>
          <div className="w-full md:w-64">
            <CategoryFilter categories={categories} value={selectedCategory} onChange={setSelectedCategory} />
          </div>
        </div>

        <main>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <ProductList products={products} onToggleFavorite={toggleFavorite} favoritesMap={favorites} />
          )}

          <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => setSkip((s) => Math.max(0, s - limit))}
                disabled={!canPrev}
              >
                Prev
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setSkip((s) => s + limit)}
                disabled={!canNext}
              >
                Next
              </button>
          </div>
        </main>
      </div>
    </div>
  );
}