import React from "react";
import styles from "./Showroom.module.css";

/* Simple static slider - replace with a proper lightbox/carousel if desired */
const images = [
  "/assets/show1.webp",
  "/assets/show2.webp",
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
