import React, { useState } from "react";
import styles from "./FAQ.module.css";
import faqData from "./FaqData.js";

export default function FAQ(){
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className={styles.section} aria-label="FAQ">
      <h2 className={styles.title}>Frequently asked questions</h2>
      <div className={styles.list}>
        {faqData.map((f, i) => (
          <div key={i} className={styles.item}>
            <button className={styles.q} onClick={() => toggle(i)} aria-expanded={openIndex === i}>
              <span>{f.q}</span>
              <span className={styles.chev}>{openIndex === i ? "−" : "+"}</span>
            </button>
            <div className={`${styles.a} ${openIndex === i ? styles.open : ""}`}>
              <p className={styles.answer}>{f.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
