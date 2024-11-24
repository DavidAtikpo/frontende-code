"use client";

import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Newsletter from './components/Newsletter';
import TopBanner from './components/TopBanner';
import TopBar from './components/TopBar';
import { usePathname } from 'next/navigation';
import { CartProvider } from './context/CartContext'; // Importation du contexte

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Utilisation de `usePathname` pour Next.js (app directory)

  // Liste des routes où le layout global ne doit pas être rendu
  const noLayoutRoutes = ['/admin', '/admin/login', '/user', '/seller/dashboard'];

  // Vérifie si la route actuelle nécessite le layout
  const shouldRenderLayout = !noLayoutRoutes.some((route) => pathname.startsWith(route));

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
        <title>Votre Application</title>
        <meta name="description" content="Découvrez Dubon Services Event : votre marketplace pour des produits frais, congelés, formations spécialisées, et services événementiels. Simplifiez votre quotidien dès aujourd'hui !"/>

      </head>
      <body>
        {/* Envelopper toute l'application avec CartProvider */}
        <CartProvider>
          {shouldRenderLayout ? (
            <>
              <TopBanner />
              <TopBar />
              <Header /> {/* Le header accèdera au contexte via `useCartContext` */}
              {children}
              <Newsletter />
              <Footer />
            </>
          ) : (
            // Pour les pages sans layout global, afficher uniquement le contenu
            children
          )}
        </CartProvider>
      </body>
    </html>
  );
}
