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
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noLayoutRoutes = ['/admin', '/admin/login', '/user', '/seller/dashboard'];
  const shouldRenderLayout = !noLayoutRoutes.some((route) => pathname.startsWith(route));

  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.png" />
        <title>DUBON SERVICE</title>
        <meta name="description" content="Découvrez Dubon Services Event : votre marketplace pour des produits frais, congelés, formations spécialisées, et services événementiels. Simplifiez votre quotidien dès aujourd'hui !"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <CartProvider>
          <SubscriptionProvider>
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
          </SubscriptionProvider>
        </CartProvider>
        <CookieConsent />
      </body>
    </html>
  );
}