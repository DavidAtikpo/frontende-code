"use client";

import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import NavigationBar from './components/NavBar';
import Newsletter from './components/Newsletter';
import TopBanner from './components/TopBanner';
import TopBar from './components/TopBar';
import { usePathname } from 'next/navigation';
import { CartProvider } from './context/CartContext';
import { CookieConsent } from '../components/CookieConsent';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noLayoutRoutes = ['/admin', '/admin/login', '/user', '/seller/dashboard'];
  const shouldRenderLayout = !noLayoutRoutes.some((route) => pathname.startsWith(route));

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
        <title>DUBON SERVICE</title>
        <meta name="description" content="Découvrez Dubon Services Event : votre marketplace pour des produits frais, congelés, formations spécialisées, et services événementiels. Simplifiez votre quotidien dès aujourd'hui !"/>
      </head>
      <body>
        <CartProvider>
          {shouldRenderLayout ? (
            <>
              <TopBanner />
              <TopBar />
              <Header />
              <NavigationBar/>
              {children}
              <Newsletter />
              <Footer />
            </>
          ) : (
            children
          )}
        </CartProvider>
        <CookieConsent />
      </body>
    </html>
  );
}