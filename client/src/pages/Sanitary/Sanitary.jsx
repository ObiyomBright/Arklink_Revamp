import React, { useEffect, useRef, useState } from "react";
import Nav from "../../components/Nav/Nav";
import ProductCard from "../../components/ProductCard/ProductCard";
import Spinner from "../../components/Spinner/Spinner";
import FiltersBar from "../../components/FilterBar/FilterBar";
import styles from "./Sanitary.module.css";

const CACHE_KEY = "lofloxy_sanitary_cache";
const LIMIT = 15;

export default function Sanitary() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({ price: "desc" });
  const loaderRef = useRef(null);

  useEffect(() => {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const { items, page, hasMore } = JSON.parse(cached);
      setItems(items);
      setPage(page);
      setHasMore(hasMore);
    } else {
      fetchItems(1, true);
    }
  }, []);

  useEffect(() => {
    sessionStorage.removeItem(CACHE_KEY);
    setItems([]);
    setPage(1);
    setHasMore(true);
    fetchItems(1, true);
  }, [filters]);

  const fetchItems = async (pageNum, reset = false) => {
    if (loading || (!reset && !hasMore)) return;

    setLoading(true);

    const params = new URLSearchParams({
      page: pageNum,
      ...filters
    });

    const API = import.meta.env.VITE_API_BASE;
    const res = await fetch(`${API}/sanitary.php?${params}`);
    const result = await res.json();

    setItems(prev => {
      const map = new Map();
      const combined = reset ? result.data : [...prev, ...result.data];
      combined.forEach(item => map.set(item.id, item));
      return Array.from(map.values());
    });

    const nextPage = pageNum + 1;
    const more = result.data.length === LIMIT;

    setPage(nextPage);
    setHasMore(more);

    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        items: reset ? result.data : [...items, ...result.data],
        page: nextPage,
        hasMore: more
      })
    );

    setLoading(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) fetchItems(page);
    });

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [page, hasMore]);

  return (
    <section className={styles.wrapper}>
      <Nav />
<div className={styles.header}>
  <h1>Sanitary Catalogue</h1>
  <p>Quality sanitary wares for modern spaces</p>
</div>

      <FiltersBar type="sanitary" onChange={setFilters} productType="sanitary" />

      <div className={styles.grid}>
        {items.map(item => (
          <ProductCard
            key={item.id}
            id={item.id}
            name={item.name}
            price={item.price}
            image={item.image}
            type="Sanitary"
            company={item.company}
          />
        ))}
      </div>

      {loading && <Spinner text="Loading products..." />}
      <div ref={loaderRef} />
    </section>
  );
}
