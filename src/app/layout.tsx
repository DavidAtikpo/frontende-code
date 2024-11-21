"use client";

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
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState([]); // État global du panier
  const pathname = usePathname(); // Utilisation de `usePathname` pour Next.js (app directory)
  
  // Liste des routes où le layout global ne doit pas être rendu
  const noLayoutRoutes = ['/admin', '/admin/login', '/user'];

  // Vérifie si la route actuelle nécessite le layout
  const shouldRenderLayout = !noLayoutRoutes.some((route) => pathname.startsWith(route));

  return (
    <html lang="en">
      <body>
        {shouldRenderLayout ? (
          <>
            <TopBanner />
            <TopBar />
            <Header cart={cart} />
            <NavigationBar />
            {children}
            <Newsletter />
            <Footer />
          </>
        ) : (
          // Pour les pages sans layout global, afficher uniquement le contenu
          children
        )}
      </body>
    </html>
  );
}
