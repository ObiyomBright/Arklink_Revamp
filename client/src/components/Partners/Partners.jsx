import React from "react";
import styles from "./Partners.module.css";
import goodwilllogo from "../../assets/goodwillceramictiles.jpeg"
import royallogo from "../../assets/ROYAL-Welcome-Logo-4.png"
import timelogo from "../../assets/time-logo-png.webp"
import bestwilllogo from "../../assets/16b22c64-103-logo-2.png"
import goldendiamond from "../../assets/golden diamond.png"
import sweethomelogo from "../../assets/sweethome-BLACK.webp"

/* replace with your real brand logos */
const partners = [
  { name: "Brand A", logo: goodwilllogo },
  { name: "Brand B", logo: royallogo },
  { name: "Brand C", logo: timelogo },
  { name: "Brand D", logo: bestwilllogo },
  { name: "Brand E", logo: sweethomelogo },
  { name: "Brand F", logo: goldendiamond },
];

export default function Partners() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Our Brands</h2>
      <div className={styles.grid}>
        {partners.map((p, i) => (
          <div className={styles.item} key={i}>
            <img loading="lazy" src={p.logo} alt={p.name} className={styles.logo} />
          </div>
        ))}
      </div>
    </section>
  );
}
