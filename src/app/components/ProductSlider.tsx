"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaArrowRight, 
  FaShoppingCart, 
  FaGraduationCap, 
  FaUtensils, 
  FaCalendar, 
  FaTools,
  FaShieldAlt,
  FaRegClock,
  FaTruck
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";

interface SlideContent {
  id: string;
  type: 'product' | 'service' | 'training' | 'restaurant' | 'event';
  title: string;
  subtitle: string;
  description: string;
  image: string;
  price: number;
  badge?: string;
  buttonText: string;
  link: string;
  bgColor: string;
}

interface WishlistItem {
  _id: string;
  title: string;
  images: string[] | string;
  finalPrice: number;
}

const ProductSlider = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides, setSlides] = useState<SlideContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllContent = async () => {
      try {
        const [products, services, trainings, restaurants, events] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products/featured`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/services/featured`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/trainings/featured`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/featured`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/events/featured`)
        ]);

        const formattedSlides: SlideContent[] = [
          // Formater les produits
          ...products.data.data.map((p: any) => ({
            id: p.id,
            type: 'product',
            title: p.name,
            subtitle: "Produit Populaire",
            description: p.description,
            image: p.image,
            price: p.price,
            badge: p.isNew ? "Nouveau" : undefined,
            buttonText: "Acheter",
            link: `/products/${p.id}`,
            bgColor: "from-blue-600 to-blue-800"
          })),
          // Formater les services
          ...services.data.data.map((s: any) => ({
            id: s.id,
            type: 'service',
            title: s.title,
            subtitle: "Service Premium",
            description: s.description,
            image: s.image,
            price: s.price,
            buttonText: "Réserver",
            link: `/services/${s.id}`,
            bgColor: "from-purple-600 to-purple-800"
          })),
          // Formater les formations
          ...trainings.data.data.map((t: any) => ({
            id: t.id,
            type: 'training',
            title: t.title,
            subtitle: "Formation",
            description: t.description,
            image: t.image,
            price: t.price,
            buttonText: "S'inscrire",
            link: `/trainings/${t.id}`,
            bgColor: "from-green-600 to-green-800"
          })),
          // Formater les restaurants
          ...restaurants.data.data.map((r: any) => ({
            id: r.id,
            type: 'restaurant',
            title: r.name,
            subtitle: "Restaurant Partenaire",
            description: r.description,
            image: r.image,
            price: 0,
            buttonText: "Voir le menu",
            link: `/restaurants/${r.id}`,
            bgColor: "from-red-600 to-red-800"
          })),
          // Formater les événements
          ...events.data.data.map((e: any) => ({
            id: e.id,
            type: 'event',
            title: e.title,
            subtitle: "Événement",
            description: e.description,
            image: e.image,
            price: e.price,
            buttonText: "Participer",
            link: `/events/${e.id}`,
            bgColor: "from-yellow-600 to-yellow-800"
          }))
        ];

        setSlides(formattedSlides);
      } catch (error) {
        console.error('Erreur lors du chargement des contenus:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllContent();
  }, []);

  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [slides.length]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'product': return <FaShoppingCart />;
      case 'service': return <FaTools />;
      case 'training': return <FaGraduationCap />;
      case 'restaurant': return <FaUtensils />;
      case 'event': return <FaCalendar />;
      default: return <FaShoppingCart />;
    }
  };

  return (
    <section className="relative overflow-hidden bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Slider Principal */}
          <div className="lg:col-span-2 relative rounded-3xl overflow-hidden shadow-2xl min-h-[400px] lg:min-h-[500px]">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4" />
                  <p>Chargement...</p>
                </div>
              </div>
            ) : slides.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800">
                <div className="text-white text-center p-8">
                  <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
                  <p className="text-white/80">
                    De nouveaux produits et services seront bientôt disponibles !
                  </p>
                </div>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`relative h-[400px] lg:h-[500px] bg-gradient-to-r ${slides[currentIndex].bgColor} 
                    p-6 sm:p-8 lg:p-12 flex flex-col lg:flex-row items-center`}
                >
                  <div className="w-full lg:w-1/2 text-white space-y-4 sm:space-y-6 z-10">
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="inline-flex items-center space-x-2 bg-white/20 px-4 py-1 rounded-full text-sm backdrop-blur-sm"
                    >
                      {getIcon(slides[currentIndex].type)}
                      <span>{slides[currentIndex].subtitle}</span>
                    </motion.span>

                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-3xl lg:text-4xl font-bold"
                    >
                      {slides[currentIndex].title}
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-white/80"
                    >
                      {slides[currentIndex].description}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center space-x-4"
                    >
                      <button
                        onClick={() => router.push(slides[currentIndex].link)}
                        className="bg-white text-blue-600 px-8 py-3 rounded-full font-medium 
                          hover:bg-blue-50 transition-all flex items-center space-x-2"
                      >
                        <span>{slides[currentIndex].buttonText}</span>
                        <FaArrowRight />
                      </button>
                      {slides[currentIndex].price > 0 && (
                        <span className="text-2xl font-bold">
                          {slides[currentIndex].price} CFA
                        </span>
                      )}
                    </motion.div>
                  </div>

                  <div className="absolute right-0 bottom-0 lg:relative lg:w-1/2 h-1/2 lg:h-full relative">
                    <Image
                      src={slides[currentIndex].image}
                      alt={slides[currentIndex].title}
                      width={800}
                      height={600}
                      className="object-cover absolute inset-0 w-full h-full"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {/* Indicateurs (seulement si il y a des slides) */}
            {slides.length > 0 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex ? "w-8 bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Cartes Avantages */}
          <div className="space-y-4">
            {/* Carte Promotions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-6 text-white relative overflow-hidden"
            >
              <div className="relative z-10">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto mb-2" />
                    <p className="text-sm">Chargement...</p>
                  </div>
                ) : slides.length === 0 ? (
                  <>
                    <h3 className="text-xl font-bold mb-3">Coming Soon</h3>
                    <p className="mb-4 text-white/80">
                      De nouvelles offres spéciales seront bientôt disponibles !
                    </p>
                  </>
                ) : (
                  <>
                    <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm mb-3">
                      -30% cette semaine
                    </span>
                    <h3 className="text-xl font-bold mb-3">Offres Spéciales</h3>
                    <p className="mb-4 text-white/80">
                      Profitez de nos meilleures offres sur une sélection de produits
                    </p>
                    <button
                      onClick={() => router.push('/products?filter=promotions')}
                      className="bg-white text-purple-600 px-6 py-2 rounded-full font-medium 
                        hover:bg-purple-50 transition-all transform hover:scale-105 w-full text-center"
                    >
                      Voir les offres
                    </button>
                  </>
                )}
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            </motion.div>

            {/* Carte Avantages */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-bold mb-4 text-gray-900">Nos Avantages</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaTruck className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Livraison Rapide</h4>
                    <p className="text-sm text-gray-500">En 24h chez vous</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <FaShieldAlt className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Qualité Garantie</h4>
                    <p className="text-sm text-gray-500">Produits certifiés</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <FaRegClock className="text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Service 24/7</h4>
                    <p className="text-sm text-gray-500">Support disponible</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSlider;
