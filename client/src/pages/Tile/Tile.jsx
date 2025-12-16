import React, { useEffect, useRef, useState } from "react";
import Nav from "../../components/Nav/Nav";
import ProductCard from "../../components/ProductCard/ProductCard";
import Spinner from "../../components/Spinner/Spinner";
import FiltersBar from "../../components/FilterBar/FilterBar";
import styles from "./Tile.module.css";

const CACHE_KEY = "lofloxy_tiles_cache";
const LIMIT = 15;

export default function Tiles() {
  const [tiles, setTiles] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({ price: "desc" });
  const loaderRef = useRef(null);

  useEffect(() => {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const { tiles, page, hasMore } = JSON.parse(cached);
      setTiles(tiles);
      setPage(page);
      setHasMore(hasMore);
    } else {
      fetchTiles(1, true);
    }
  }, []);

  useEffect(() => {
    sessionStorage.removeItem(CACHE_KEY);
    setTiles([]);
    setPage(1);
    setHasMore(true);
    fetchTiles(1, true);
  }, [filters]);

  const fetchTiles = async (pageNum, reset = false) => {
    if (loading || (!reset && !hasMore)) return;

    setLoading(true);

    const params = new URLSearchParams({
      page: pageNum,
      ...filters
    });

    const API = import.meta.env.VITE_API_BASE;
    const res = await fetch(`${API}/tiles.php?${params}`);
    const result = await res.json();

    setTiles(prev => {
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
        tiles: reset
          ? result.data
          : [...tiles, ...result.data].filter(
              (v, i, a) => a.findIndex(t => t.id === v.id) === i
            ),
        page: nextPage,
        hasMore: more
      })
    );

    setLoading(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fetchTiles(page);
      }
    });

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [page, hasMore]);

  return (
    <section className={styles.wrapper}>
      <Nav />

      <FiltersBar onChange={setFilters} />

      <div className={styles.grid}>
        {tiles.map(tile => (
          <ProductCard
            key={tile.id}
            id={tile.id}
            name={tile.name}
            price={tile.price}
            image={tile.image}
            type="Tile"
            size={tile.size}
            surfaceType={tile.surface_type}
            company={tile.company}
            pieces_per_carton={tile.pieces_per_carton}
            sqm_per_carton={tile.sqm_per_carton}
          />
        ))}
      </div>

      {loading && <Spinner text="Loading products..." />}
      <div ref={loaderRef} />
    </section>
  );
}
