import React from 'react'
import styles from './Hero.module.css'

const Hero = () => {
  return (
    <section className={styles.hero}>
      
      <h1 className={styles.mainTitle}>
        Luxurious <br />
        Tiles & Sanitary Wares <br />for Every Space
      </h1>

      <ul className={styles.briefDescription}>
        <li className={styles.subtext}>
          Wide Selection
          <p className={styles.text}>
            Discover a wide variety of designs to match every style
          </p>
        </li>

        <li className={styles.subtext}>
          Fast Delivery
          <p className={styles.text}>
            Count on us for quick and dependable service
          </p>
        </li>

        <li className={styles.subtext}>
          Affordable Pricing
          <p className={styles.text}>
            Get premium products at affordable prices
          </p>
        </li>
      </ul>

    </section>
  )
}

export default Hero
