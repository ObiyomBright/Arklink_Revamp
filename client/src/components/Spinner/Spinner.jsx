import React from "react";
import styles from "./Spinner.module.css";


export default function Spinner({ text }) {
return (
<div className={styles.wrapper} role="status" aria-live="polite">
<div className={styles.spinner}></div>
<p className={styles.text}>{text}</p>
</div>
);
}