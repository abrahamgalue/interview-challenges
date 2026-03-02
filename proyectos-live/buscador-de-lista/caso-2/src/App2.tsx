import type {Product} from "./types";

import {useEffect, useState, memo} from "react";

import api from "./api";

const Recommended = memo(function Recommended() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.search().then(setProducts);
  }, []);

  return (
    <main>
      <h1>Productos recomendados</h1>
      <ul>
        {[...products]
          .sort(() => (Math.random() > 0.5 ? 1 : -1))
          .slice(0, 2)
          .map((product) => (
            <li key={product.id}>
              <h4>{product.title}</h4>
              <p>{product.description}</p>
              <span>$ {product.price}</span>
            </li>
          ))}
      </ul>
    </main>
  );
});

const useDebounce = (value: string, delay: number) => {
  const [debounceValue, setDebounceValue] = useState<string>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debounceValue;
};

const initialProductsValue = () => {
  const isProductsInLocal = localStorage.getItem("products");

  if (isProductsInLocal) {
    return JSON.parse(isProductsInLocal);
  }

  return [];
};

function App() {
  const [products, setProducts] = useState<Product[]>(initialProductsValue);
  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    api.search(debouncedQuery).then((products) => {
      const newProducts = products.map((product) => ({
        ...product,
        favorite: product?.favorite ?? false,
      }));

      setProducts(newProducts);
    });
  }, [debouncedQuery]);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  function handleFavorites(id: Product["id"]) {
    const newProducts = products.map((product) => {
      if (product.id === id) {
        return {
          ...product,
          favorite: !product.favorite,
        };
      }

      return product;
    });

    setProducts(newProducts);
  }

  return (
    <main>
      <h1>Tienda digitaloncy</h1>
      <input name="text" placeholder="tv" type="text" onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {products.map((product) => (
          <li
            key={product.id}
            className={product?.favorite ? "fav" : ""}
            onClick={() => handleFavorites(product.id)}
          >
            <h4>{product.title}</h4>
            <p>{product.description}</p>
            <span>$ {product.price}</span>
          </li>
        ))}
      </ul>
      <hr />
      <Recommended />
    </main>
  );
}

export default App;
