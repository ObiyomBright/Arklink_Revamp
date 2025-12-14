import React from "react";
import styles from "./QuickCategories.module.css";
import { Link } from "react-router-dom";
import img1 from "../../assets/1cdcf1f08fb20cd3a560d330a7443a33.jpg";
import img2 from "../../assets/519807673120ce43430746302482a478.jpg";
import img3 from "../../assets/d62234e5330b72555eff6f0a43f17164.jpg";

const QuickCategories = () => {
  const categories = [
    {
      name: "Wall Tiles",
      image: img2,
      link: "/tiles",
    },
    {
      name: "Floor Tiles",
      image: img3,
      link: "/tiles",
    },
    {
      name: "Sanitary Wares",
      image: img1,
      link: "/sanitary-wares",
    },
  ];

return (
  <div className={styles.wrapper}>
    <h2 className={styles.title}>Our Categories</h2>

    <div className={styles.cardsContainer}>
      {categories.map((cat, index) => (
        <Link key={index} to={cat.link} className={styles.card}>
          <img src={cat.image} alt={cat.name} className={styles.image} />
          <span className={styles.text}>{cat.name}</span>
        </Link>
      ))}
    </div>
  </div>
);


};

export default QuickCategories;
