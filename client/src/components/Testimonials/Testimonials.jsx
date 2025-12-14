import React from "react";
import styles from "./Testimonials.module.css";

/* Replace with real testimonials or fetch from API */
const reviews = [
 { 
  name: "Aisha", 
  city: "Imo", 
  text: "The prices are fair and my order arrived earlier than I expected. I’ll definitely buy again." 
},
{ 
  name: "Chinedu", 
  city: "Abia", 
  text: "What I got was exactly what was on the site. Quality was good and delivery was smooth." 
},
{ 
  name: "Kemi", 
  city: "Abuja", 
  text: "Everything was properly packaged and delivered without issues. The whole process was stress-free." 
}

];

export default function Testimonials(){
  return (
    <section className={styles.section} aria-label="Testimonials">
      <h2 className={styles.title}>What Our Customers Say</h2>
      <div className={styles.slider}>
        {reviews.map((r,i) => (
          <blockquote key={i} className={styles.card} style={{animationDelay:`${i*120}ms`}}>
            <p className={styles.text}>"{r.text}"</p>
            <footer className={styles.name}>— {r.name}, {r.city} </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
