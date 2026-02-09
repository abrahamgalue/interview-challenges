import type {Item} from "./types";

import {useEffect, useState} from "react";

import styles from "./App.module.scss";
import api from "./api";

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    api
      .list()
      .then(setItems)
      .finally(() => setIsLoading(false));
  }, []);

  function handleDelete(id: Item["id"]) {
    const newItems = items.filter((item) => item.id !== id);

    setItems(newItems);
  }

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  if (items.length === 0) {
    return <p>No hay elementos en la lista</p>;
  }

  return (
    <main className={styles.main}>
      <h1>Supermarket list</h1>
      <form>
        <input autoFocus name="text" type="text" />
        <button>Add</button>
      </form>
      <ul>
        {items.map((item) => (
          <li key={item.id} className={item.completed ? styles.completed : ""}>
            {item.text} <button onClick={() => handleDelete(item.id)}>[X]</button>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
