import React from "react";
import styles from "./Showroom.module.css";

/* Simple static slider - replace with a proper lightbox/carousel if desired */
const images = [
  "../../assets/IMG_20251223_105639.jpg",
  "../../assets/IMG_20251223_105659.jpg",
  "/assets/show3.webp"
];

export default function Showroom(){
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Our Showroom</h2>
      <div className={styles.row}>
        {images.map((src,i) => (
          <div className={styles.card} key={i}>
            <img loading="lazy" src={src} alt={`showroom-${i}`} className={styles.image} />
          </div>
        ))}
      </div>
    </section>
  );
}
