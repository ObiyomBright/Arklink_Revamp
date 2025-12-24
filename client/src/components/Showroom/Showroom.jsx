import React from "react";
import styles from "./Showroom.module.css";
import img1 from "../../assets/IMG_20251223_105639.jpg"
import img2 from   "../../assets/IMG_20251223_105659.jpg"
import img3 from "../../assets/IMG_20251223_105719_1.jpg"

export default function Showroom(){
  const images = [img1, img2, img3];

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
