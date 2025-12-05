import React from 'react'
import Nav from '../components/Nav/Nav'
import Hero from '../components/Hero/Hero'
import QuickCategories from '../components/QuickCategories/QuickCategories'
import ProductCard from '../components/ProductCard/ProductCard'

import img1 from "../assets/hero.png";

const Home = () => {
  return (
    <div>
      <Nav />
      <Hero />
      <QuickCategories />
    </div>
  )
}

export default Home