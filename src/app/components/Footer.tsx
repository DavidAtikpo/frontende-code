import React from "react";
import {FaAppStore} from "react-icons/fa";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Section 1: Logo et contact */}
        <div>
          <Image
            src="/logo blanc.png"
            alt="Logo"
            width={81}
            height={68}
            className="w-16 h-auto mb-4"
          />
          <p>Customer Supports:</p>
          <p className="font-semibold text-gray-100">(+229)52 42 31 28</p>
          <p>N DE PARCELLE Carre sans Bornes</p>
          <p>MAISON EUSTACHE GBEHOU</p>
          <p>Agonvezon, Bohicon 2</p>
          <p>Bohicon,Zou</p>
          <p>BENIN</p>
          <p className="mt-2 text-gray-100">info@dubonservice.com</p>
        </div>

        {/* Section 2: Meilleures Ventes */}
        <div>
          <h4 className="font-semibold text-gray-100 mb-4">Meilleures Ventes</h4>
          <ul className="space-y-2">
            {[
              { name: "Poulets Congelés", link: "/products/poulets-congeles" },
              { name: "Poissons Congelés", link: "/products/poissons-congeles" },
              { name: "Viande de Bœuf", link: "/products/viande-boeuf" },
              { name: "Crevettes", link: "/products/crevettes" },
              { name: "Fruits de Mer", link: "/products/fruits-de-mer" },
            ].map((item, index) => (
              <li key={index}>
                <a
                  href={item.link}
                  className="hover:text-yellow-500 transition duration-300"
                >
                  {item.name}
                </a>
              </li>
            ))}
            <li>
              <a
                href="/products"
                className="text-yellow-500 hover:underline"
              >
                Voir tout les produits →
              </a>
            </li>
          </ul>
        </div>

        {/* Section 3: Liens Rapides */}
        <div>
          <h4 className="font-semibold text-gray-100 mb-4">Liens Rapides</h4>
          <ul className="space-y-2">
            {[
              { name: "Formations", link: "/formations" },
              { name: "Shopping Cart", link: "/cart" },
              { name: "Wishlist", link: "/wishlist" },
              { name: "Compare", link: "/compare" },
              { name: "Track Order", link: "/track-order" },
              { name: "Customer Help", link: "/help" },
              { name: "About Us", link: "/about" },
            ].map((item, index) => (
              <li key={index}>
                <a
                  href={item.link}
                  className="hover:text-yellow-500 transition duration-300"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 4: Téléchargement et Tags Populaires */}
        <div>
          <h4 className="font-semibold text-gray-100 mb-4">
            Télécharger l&apos;App
          </h4>
          <div className="flex space-x-4 mb-6">
          <a href="https://play.google.com" target="_blank" rel="noopener noreferrer">
            <Image
              src="https://cdn-icons-png.flaticon.com/512/300/300218.png" // Exemple d'URL d'une icône
              alt="Google Play"
              className="w-10"
              width={10}
              height={10}
            />
          </a>
            <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
               <FaAppStore className="text-gray-400 hover:text-blue-500 text-3xl" />
           </a>

          </div>

          <h4 className="font-semibold text-gray-100 mb-4">Tags Populaires</h4>
          <div className="flex flex-wrap gap-2">
            {[
              "Poulet",
              "Poisson",
              "Crevettes",
              "Calamars",
              "Fruits de Mer",
              "Viande",
              "Légumes Congelés",
              "Pizza Surgelée",
              "Glaces",
              "Brochettes",
              "Saumon",
            ].map((tag, index) => (
              <a
                href={`/tags/${tag.toLowerCase().replace(/ /g, "-")}`}
                key={index}
                className="bg-gray-800 text-gray-200 px-3 py-1 rounded-md text-sm hover:bg-yellow-500 hover:text-gray-900 transition duration-300"
              >
                {tag}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} DUBON eCommerce. Tous droits réservés.
      </div>

    </footer>
  );
};

export default Footer;
