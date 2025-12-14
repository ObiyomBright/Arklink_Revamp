import React from "react";
import styles from "./WhyUs.module.css";
import { FaTruck, FaPhoneAlt, FaShieldAlt, FaMoneyBillAlt} from "react-icons/fa";

const items = [
  { title: "Fast Delivery", text: "Prompt delivery across major Nigerian cities.", icon: <FaTruck /> },
  { title: "Verified Quality", text: "Products inspected and sourced from trusted manufacturers.", icon: <FaShieldAlt /> },
  { title: "Competitive Prices", text: "Transparent pricing and great value for money.", icon: <FaMoneyBillAlt />},
  { title: "Responsive Support", text: "Quick answers and order help via WhatsApp & phone.", icon: <FaPhoneAlt /> },
];

export default function WhyUs(){
  return (
    <section className={styles.container} aria-labelledby="whyus">
      <h2 id="whyus" className={styles.title}>Why shop with Us?</h2>
      <div className={styles.grid}>
        {items.map((it, i) => (
          <div key={i} className={styles.card} style={{animationDelay: `${i*70}ms`}}>
            <div className={styles.icon}>{it.icon}</div>
            <h3 className={styles.cardTitle}>{it.title}</h3>
            <p className={styles.cardText}>{it.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
