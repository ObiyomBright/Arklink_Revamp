import React from "react";
import styles from "./QualityBadges.module.css";

const badges = [
  { label: "100% Original", icon: "✔️" },
  { label: "Safe Packaging", icon: "📦" },
  { label: "Warranty Available", icon: "🛠️" },
  { label: "Secure Payments", icon: "🔒" },
];

export default function QualityBadges(){
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {badges.map((b, i) => (
          <div key={i} className={styles.badge} style={{animationDelay: `${i*60}ms`}}>
            <div className={styles.icon}>{b.icon}</div>
            <div className={styles.label}>{b.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
