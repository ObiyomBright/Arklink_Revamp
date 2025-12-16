import React, { useEffect, useState } from "react";
import styles from "./FilterBar.module.css";

export default function FiltersBar({ onChange }) {
  const [options, setOptions] = useState({});

  useEffect(() => {
    const API = import.meta.env.VITE_API_BASE;
    fetch(`${API}/tiles-filters.php`)
      .then(res => res.json())
      .then(setOptions);
  }, []);

  return (
    <div className={styles.filters}>
      <select onChange={e => onChange(p => ({ ...p, size: e.target.value }))}>
        <option value="">All Sizes</option>
        {options.sizes?.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select onChange={e => onChange(p => ({ ...p, surface_type: e.target.value }))}>
        <option value="">Surface Type</option>
        {options.surface_types?.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select onChange={e => onChange(p => ({ ...p, company: e.target.value }))}>
        <option value="">Company</option>
        {options.companies?.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select onChange={e => onChange(p => ({ ...p, price: e.target.value }))}>
        <option value="desc">Price: High → Low</option>
        <option value="asc">Price: Low → High</option>
      </select>
    </div>
  );
}
