"use client"

import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Newsletter from './components/Newsletter';
import TopBanner from './components/TopBanner';
import BenefitsSection from './components/BenefitsSection';
import ProductSlider from './components/ProductSlider';
import TopBar from './components/TopBar';
import NavigationBar from './components/NavBar';
import { useState } from "react";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState([]); // État global du panier
  return (
    <html lang="en">
      <body>
        <TopBanner/>
        <TopBar/>
        <Header cart={cart} />
        <NavigationBar/>
        {children}
        <Newsletter/>
        <Footer />
      </body>
    </html>
  );
}
