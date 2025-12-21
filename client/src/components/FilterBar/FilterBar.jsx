import React, { useEffect, useState } from "react";
import styles from "./FilterBar.module.css";

export default function FiltersBar({ onChange, productType = "tile" }) {
  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API = import.meta.env.VITE_API_BASE;
    const endpoint =
      productType === "sanitary"
        ? "sanitary-filter.php"
        : "tiles-filters.php";

    setLoading(true);

    fetch(`${API}/${endpoint}`)
      .then(res => res.json())
      .then(data => {
        setOptions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productType]);

  if (loading) {
    return (
      <div className={styles.filters}>
        <div className={styles.skeleton} />
        <div className={styles.skeleton} />
        <div className={styles.skeleton} />
      </div>
    );
  }

  return (
    <div className={styles.filters}>

      {/* TILE ONLY */}
      {productType === "tile" && (
        <select
          onChange={e =>
            onChange(prev => ({ ...prev, size: e.target.value }))
          }
        >
          <option value="">All Sizes</option>
          {options.sizes?.map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      )}

      {/* TILE ONLY */}
      {productType === "tile" && (
        <select
          onChange={e =>
            onChange(prev => ({ ...prev, surface_type: e.target.value }))
          }
        >
          <option value="">Surface Type</option>
          {options.surface_types?.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      )}

      {/* BOTH */}
      <select
        onChange={e =>
          onChange(prev => ({ ...prev, company: e.target.value }))
        }
      >
        <option value="">Company</option>
        {options.companies?.map(company => (
          <option key={company} value={company}>
            {company}
          </option>
        ))}
      </select>

      {/* BOTH */}
      <select
        onChange={e =>
          onChange(prev => ({ ...prev, price: e.target.value }))
        }
      >
        <option value="desc">Price: High → Low</option>
        <option value="asc">Price: Low → High</option>
      </select>
    </div>
  );
}
