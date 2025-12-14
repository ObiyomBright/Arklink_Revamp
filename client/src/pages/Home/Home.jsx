import React from 'react'
import styles from './Home.module.css'
import Nav from '../../components/Nav/Nav'
import Hero from '../../components/Hero/Hero'
import QuickCategories from '../../components/QuickCategories/QuickCategories'

import WhyUs from "../../components/WhyUs/WhyUs";
import Testimonials from "../../components/Testimonials/Testimonials";
import FeaturedProducts from "../../components/FeaturedProducts/FeaturedProducts";
import QualityBadges from "../../components/QualityBadges/QualityBadges";
import AboutUs from "../../components/AboutUs/AboutUs";
import Showroom from "../../components/Showroom/Showroom";
import Partners from "../../components/Partners/Partners";
import DeliveryPayment from "../../components/DeliveryPayment/DeliveryPayment";
import FAQ from "../../components/FAQ/FAQ.jsx";
import Footer from "../../components/Footer/Footer";

const Home = () => {
  return (
    <div>
      <Nav />
      <Hero />
      <QuickCategories />
      <WhyUs />
      {/* <FeaturedProducts /> */}
      {/* <QualityBadges /> */}
      <Testimonials />
      <AboutUs />
      <Showroom />
      <Partners />
      <DeliveryPayment />
      <FAQ />
      <Footer />
    </div>
  )
}

export default Home