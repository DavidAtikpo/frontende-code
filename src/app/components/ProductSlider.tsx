// "use client";

// import React, { useState, useEffect } from "react";
// import Image from "next/image";

// const ProductSlider = () => {
//   // Tableau d'images pour le slider
//   const images = [
//     "https://camo.envatousercontent.com/347a5f3a543ddf7373e833ae8daff6d7c14b9564/68747470733a2f2f69322e77702e636f6d2f746869736b6f2e66696c65732e776f726470726573732e636f6d2f323031372f30332f73656374696f6e5f325f64656d6f312e676966g",
//     "/images/product2.jpg",
//     "/images/product3.jpg",
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Défilement automatique
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, 10000); // Change d'image toutes les 10 secondes

//     return () => clearInterval(interval); // Nettoyer l'intervalle
//   }, [images.length]);

//   return (
//     <section className="w-7xl  px-6 py-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
//       {/* Section principale avec Slider */}
//       <div className="col-span-2 bg-gray-100 p-6 rounded-lg relative flex items-center">
//         <div className="flex-1">
//           <h3 className="text-blue-700 font-semibold uppercase mb-2">
//             L&apos;endroit pour tout avoir
//           </h3>
//           <h2 className="text-3xl font-bold mb-4">Poissons congelés</h2>
//           <p className="text-sm text-gray-700 mb-6">
//             Save up to 50% on select Xbox games. Get 3 months of PC Game Pass
//             for $2 USD.
//           </p>
//           <button className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-500 transition">
//             ACHETER MAINTENANT →
//           </button>
//         </div>

//         {/* Slider d'images */}
//         <div className="relative w-1/2">
//           <Image
//             src={images[currentIndex]}
//             alt={`Image ${currentIndex + 1}`}
//             width={400}
//             height={300}
//             className="w-full h-full object-cover rounded"
//           />
//         </div>

//         {/* Prix affiché */}
//         <div className="absolute top-6 right-6 bg-blue-700 text-white py-1 px-3 rounded-full text-sm">
//           1500 FCFA
//         </div>

//         {/* Indicateurs de pagination */}
//         <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
//           {images.map((_, index) => (
//             <div
//               key={index}
//               className={`w-2 h-2 rounded-full ${
//                 index === currentIndex ? "bg-blue-700" : "bg-gray-400"
//               }`}
//             ></div>
//           ))}
//         </div>
//       </div>

//       {/* Offres secondaires */}
//       <div className="space-y-4">
//         {/* Carte 1 */}
//         <div className="bg-black text-white p-4 rounded-lg relative">
//           <div className="absolute top-4 right-4 bg-yellow-400 text-black text-xs px-2 py-1 rounded">
//             -29%
//           </div>
//           <h3 className="text-yellow-400 uppercase">Grosses Offres</h3>
//           <h4 className="font-bold text-lg mt-2">Pour les produits frais</h4>
//           <Image
//             src="https://i.pinimg.com/originals/c4/9a/20/c49a207e0f89c9290d98fd43a87a8cb0.gif"
//             alt="Google Pixel 6 Pro"
//             width={30}
//             height={10}
//             className="rounded-lg object-cover w-full"
//             style={{ height: "40px" }} // Réduction de la hauteur à 40px
//           />
//           <button className="bg-yellow-400 text-black px-4 py-2 rounded mt-4 hover:bg-yellow-500 transition">
            
//           </button>
//         </div>

//         {/* Carte 2 */}
//         <div className="bg-white text-black p-4 rounded-lg shadow">
//           <h4 className="font-bold text-lg mb-2">Contactez-nous</h4>
//           <Image
//             src="https://i.pinimg.com/originals/e5/2e/c2/e52ec24f8b7c18ae8eafc24a4b9bbba6.gif"
//             alt="Viandes"
//             width={60}
//             height={50}
//             className="rounded-lg object-cover w-full"
//             style={{ height: "200px" }} // Réduction de la hauteur à 40px
//           />
//           {/* <p className="text-gray-600 mt-4">1500 FCFA</p> */}
//           <button className="bg-blue-700 text-white px-4 py-2 rounded mt-4 hover:bg-blue-500 transition">
            
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ProductSlider;


/* "use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const ProductSlider = () => {
  // Tableau d'images pour le slider
  const images = [
    "https://i.pinimg.com/originals/37/52/0f/37520f15974a0100d7debbbd64f2bdef.gif",
    "https://cdn.asp.events/CLIENT_CloserSt_D86EA381_5056_B739_5482D50A1A831DDD/productImages/19994BDE-E827-59E3-624529B01A411CEC_cover.png",
    "https://images.pexels.com/photos/50675/banquet-wedding-society-deco-50675.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8bVoc02Pa4hVKbVxjaaNS38zE5YfI7hFr8w&s",
    "https://www.step-services.be/wp-content/uploads/aide-menagere-titres-services.webp",
    "https://i.pinimg.com/736x/3c/26/71/3c26718387b034666d6a7839007e88b8.jpg",
    "https://i.pinimg.com/originals/79/8d/20/798d20da62546f1d732b5302732ade82.gif",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Défilement automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change d'image toutes les 10 secondes

    return () => clearInterval(interval); // Nettoyer l'intervalle
  }, [images.length]);

  return (
    <section className="w-7xl px-6 py-5 grid grid-cols-1 lg:grid-cols-3 gap-10">

      {<div className="col-span-2 gb-gray-500 p-6 rounded-lg relative flex items-center">
        <div className="flex-1">
          <h3 className="text-blue-700 font-semibold uppercase mb-2 text-sm md:text-base lg:text-lg">
            L&apos;endroit pour tout avoir
          </h3>
          <h2 className="text-3xl font-bold mb-4 text-lg md:text-xl lg:text-3xl">
            Poissons congelés
          </h2>
          
          
        </div>

   
        <div
  className="relative w-1/2  rounded"
>
  <Image
    src={images[currentIndex]}
    alt={`Image ${currentIndex + 1}`}
    width={400}
    height={300}
    className="w-full h-full object-cover rounded"
  />
</div>


  
      

  
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? "bg-blue-700" : "bg-gray-400"
              }`}
            ></div>
          ))}
        </div>
      </div>

      <div className="space-y-4">

        <div className="bg-black text-white p-4 rounded-lg relative">
          <div className="absolute top-4 right-4 bg-yellow-400 text-black text-xs px-2 py-1 rounded">
            -100%
          </div>
          <h3 className="text-yellow-400 uppercase text-xs md:text-sm lg:text-lg">Offres reduction gratuite </h3>
          <h4 className="font-bold text-lg mt-2 text-sm md:text-base lg:text-lg">Pour tous vos commandes</h4>
          <Image
            src="https://i.pinimg.com/originals/c4/9a/20/c49a207e0f89c9290d98fd43a87a8cb0.gif"
            alt="Google Pixel 6 Pro"
            width={30}
            height={10}
            className="rounded-lg object-cover w-full"
            style={{ height: "70px" }} // Réduction de la hauteur à 40px
          />
          <button className="bg-yellow-400 text-black px-4 py-2 rounded mt-4 hover:bg-yellow-500 transition">
            
          </button>
        </div>

        <div className="bg-white text-black p-4 rounded-lg shadow">
          <h4 className="font-bold text-lg mb-2 text-sm md:text-base lg:text-lg">Contactez-nous</h4>
          <Image
            src="https://i.pinimg.com/originals/e5/2e/c2/e52ec24f8b7c18ae8eafc24a4b9bbba6.gif"
            alt="Viandes"
            width={60}
            height={50}
            className="rounded-lg object-cover w-full"
            style={{ height: "200px" }} // Réduction de la hauteur à 40px
          />
         
          <button className="bg-blue-700 text-white px-4 py-2 rounded mt-4 hover:bg-blue-500 transition">
            
          </button>
        </div>
      </div>
    </section>
  );
}}

export default ProductSlider; */


"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaShoppingCart, FaRegClock, FaShieldAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

const ProductSlider = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      title: "Produits Frais",
      subtitle: "Qualité Premium",
      description: "Découvrez notre sélection de produits frais, soigneusement choisis pour votre satisfaction",
      image: "",
      price: "À partir de 1500 FCFA",
      badge: "Nouveau",
      buttonText: "Découvrir",
      bgColor: "from-blue-600 to-blue-800"
    },
    {
      title: "Fruits de Mer",
      subtitle: "Fraîcheur Garantie",
      description: "Les meilleurs fruits de mer, directement de l'océan à votre table",
      image: "",
      price: "À partir de 2500 FCFA",
      badge: "Populaire",
      buttonText: "Commander",
      bgColor: "from-teal-600 to-teal-800"
    },
    // ... autres slides
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Slider Principal */}
          <motion.div 
            className="lg:col-span-2 relative rounded-3xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`relative h-[300px] sm:h-[400px] lg:h-[500px] bg-gradient-to-r ${slides[currentIndex].bgColor} 
                  p-6 sm:p-8 lg:p-12 flex flex-col lg:flex-row items-center`}
              >
                <div className="w-full lg:w-1/2 text-white space-y-4 sm:space-y-6 z-10 text-center lg:text-left">
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block bg-white/20 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm backdrop-blur-sm"
                  >
                    {slides[currentIndex].subtitle}
                  </motion.span>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                  >
                    {slides[currentIndex].title}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-white/80 text-sm sm:text-base hidden sm:block"
                  >
                    {slides[currentIndex].description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                  >
                    <button
                      onClick={() => router.push('/products')}
                      className="bg-white text-blue-600 px-6 sm:px-8 py-2 sm:py-3 rounded-full font-medium 
                        hover:bg-blue-50 transition-all transform hover:scale-105 flex items-center gap-2 
                        text-sm sm:text-base w-full sm:w-auto justify-center"
                    >
                      {slides[currentIndex].buttonText}
                      <FaArrowRight />
                    </button>
                    <span className="text-xl sm:text-2xl font-bold">{slides[currentIndex].price}</span>
                  </motion.div>
                </div>

                <div className="absolute right-0 bottom-0 lg:top-0 w-full lg:w-1/2 h-1/2 lg:h-full">
                  <Image
                    src={slides[currentIndex].image}
                    alt={slides[currentIndex].title}
                    fill
                    className="object-cover object-center"
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Indicateurs */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? "w-6 sm:w-8 bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Cartes latérales */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Carte Promotions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden"
            >
              <div className="relative z-10">
                <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs sm:text-sm mb-3 sm:mb-4">
                  -30% cette semaine
                </span>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Offres Spéciales</h3>
                <p className="mb-4 sm:mb-6 text-white/80 text-sm sm:text-base">
                  Profitez de nos meilleures offres sur une sélection de produits
                </p>
                <button
                  onClick={() => router.push('/products?filter=promotions')}
                  className="bg-white text-purple-600 px-4 sm:px-6 py-2 rounded-full font-medium 
                    hover:bg-purple-50 transition-all transform hover:scale-105 text-sm sm:text-base
                    w-full sm:w-auto text-center"
                >
                  Voir les offres
                </button>
              </div>
              <div className="absolute -right-8 -bottom-8 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-full blur-2xl" />
            </motion.div>

            {/* Carte Avantages */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg"
            >
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-900">Nos Avantages</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaShoppingCart className="text-blue-600" />
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
