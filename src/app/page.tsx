import HomeProducts from "./components/HomeProducts";
import CategoriesSection from "./components/CategoriesSection";

import PromotionsSection from "./components/PromotionSection";
import ProductSlider from "./components/ProductSlider";
import ServicesSection from "./components/ServicesSection";
import EventsSection from "./components/EventsSection";
import RestaurantsSection from "./components/RestaurantsSection";
import WhyChooseUsSection from "./components/WhyChooseUsSection";   
import ProductSuCategory from "./components/ProductCategories"
import TrainingsSection from "./components/TrainingsSection";
import ProductVivriere from "./components/ProductVivriere";
import ShopsSection from "./components/ShopsSection";
import ProductCongeles from "./components/ProductCongeles";


export default function Home() {
  return (
    <div>
      {/* Slider principal */}
      
        <div>
          <ProductSlider/>
        </div>
    
      {/* Section Produits */}

      <section className="py-12">
      <CategoriesSection />
      </section>
      
        <div>
           <HomeProducts />
        </div>
      



      {/* <section className="py-12">
          


      </section> */}
      {/* Section Promotions */}
      
        <div>
          <RestaurantsSection/>
        </div>
      

      {/* Section Catégories */}
      <section className="py-0">
        <div className="container mx-auto px-4">
          <ProductSuCategory/>
        </div>
      </section>

      {/* Section Services */}
      
        <div>
          <ProductCongeles/>
        </div>
      
        <div>
          <ProductVivriere/>
        </div>

      {/* Section Formations */}
      <section className="py-0">
        <div className="container mx-auto px-4">
          
            <TrainingsSection/>
        </div>
      </section>

      {/* Section Événements */}
      <section className="bg-gray-50 py-0">
        <div className="container mx-auto px-4">
        
          <ServicesSection/>
        </div>
      </section>

      {/* Section Restaurants */}
    
        <div className="container mx-auto px-4">
        
          <EventsSection/>
        </div>
      



      {/* Section Actualités
      <section className="py-12">
        <div className="container mx-auto px-4">
          <LatestNews/>
        </div>
      </section> */}

      {/* Section Témoignages et Statistiques */}
      {/* <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <TestimonialsSection />
        </div>
      </section> */}

        {/* Section Pourquoi Nous Choisir */}
        <section className="bg-gray-50">
        <div className="container mx-auto px-4">
          <WhyChooseUsSection />
        </div>
      </section>
      </div>
  );
}
