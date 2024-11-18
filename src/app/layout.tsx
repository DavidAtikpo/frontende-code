import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Newsletter from './components/Newsletter';
import TopBanner from './components/TopBanner';
import BenefitsSection from './components/BenefitsSection';
import ProductSlider from './components/ProductSlider';
import TopBar from './components/TopBar';
import NavigationBar from './components/NavBar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TopBanner/>
        <TopBar/>
        <Header />
        <NavigationBar/>
        <ProductSlider/>
        <BenefitsSection/>
        {children}
        <Newsletter/>
        <Footer />
      </body>
    </html>
  );
}
