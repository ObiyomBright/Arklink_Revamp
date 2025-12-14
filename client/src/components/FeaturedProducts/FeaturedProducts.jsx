import React from "react";
import styles from "./FeaturedProducts.module.css";

/* Example data - replace or fetch from API */
const demo = [
  { id: 1, name: "600x600 Matt Tile", price: 3500, img: "/assets/tiles/sample1.webp" },
  { id: 2, name: "Super Polished 800x800", price: 6500, img: "/assets/tiles/sample2.webp" },
  { id: 3, name: "Glazed Wall Tile 300x600", price: 2200, img: "/assets/tiles/sample3.webp" },
  { id: 4, name: "Porcelain Floor Tile", price: 4800, img: "/assets/tiles/sample4.webp" },
];

export default function FeaturedProducts(){
  return (
    <section className={styles.section} aria-label="Featured products">
      <h2 className={styles.title}>Featured products</h2>
      <div className={styles.grid}>
        {demo.map(p => (
          <article key={p.id} className={styles.card}>
            <div className={styles.imgWrap}>
              <img loading="lazy" src={p.img} alt={p.name} className={styles.img} />
            </div>
            <div className={styles.info}>
              <div className={styles.name}>{p.name}</div>
              <div className={styles.price}>₦{p.price.toLocaleString()}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
