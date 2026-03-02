import type {Product} from "./types";

import {useEffect, useMemo, useState} from "react";

import api from "./api";

enum SortOption {
  NAME = "NAME",
  PRICE = "PRICE",
}

const initialQuery = localStorage.getItem("query") || "";
const initialSortBy = localStorage.getItem("sort") || "";

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<SortOption>(initialSortBy as SortOption);

  useEffect(() => {
    api.search(query).then(setProducts);
  }, [query]);

  useEffect(() => {
    localStorage.setItem("query", query);
  }, [query]);

  useEffect(() => {
    localStorage.setItem("sort", sortBy);
  }, [sortBy]);

  const filteredProducts = useMemo(() => {
    if (sortBy === SortOption.NAME) {
      return [...products].sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sortBy === SortOption.PRICE) {
      return [...products].sort((a, b) => a.price - b.price);
    }

    return products;
  }, [products, sortBy]);

  return (
    <main>
      <h1>Tienda digitaloncy</h1>
      <input
        name="text"
        placeholder="tv"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <select
        defaultValue={sortBy || ""}
        name="sort"
        onChange={(e) => setSortBy(e.target.value as SortOption)}
      >
        <option disabled value="">
          Select a filter
        </option>
        <option value={SortOption.NAME}>Nombre</option>
        <option value={SortOption.PRICE}>Price</option>
      </select>
      <ul>
        {filteredProducts.map((product) => (
          <li key={product.id}>
            <h4>{product.title}</h4>
            <p>{product.description}</p>
            <span>
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
              }).format(product.price)}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
