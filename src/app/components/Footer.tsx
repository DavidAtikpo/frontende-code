import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Section 1: Logo et contact */}
        <div>
          <img
            src="/path/to/logo.png"
            alt="Logo"
            className="w-16 h-auto mb-4"
          />
          <p>Customer Supports:</p>
          <p className="font-semibold text-gray-100">(+229)52 42 31 28</p>
          <p>4517 Washington Ave.</p>
          <p>Manchester, Kentucky 39495</p>
          <p className="mt-2 text-gray-100">info@kinbo.com</p>
        </div>

        {/* Section 2: Meilleures Ventes */}
        <div>
          <h4 className="font-semibold text-gray-100 mb-4">Meilleures Ventes</h4>
          <ul className="space-y-2">
            <li>Produits</li>
            <li>Produits</li>
            <li>Produits</li>
            <li className="ml-4">— Produits</li>
            <li>Produits</li>
            <li>
              <a href="#" className="text-yellow-500 hover:underline">
                Voir tout les produits →
              </a>
            </li>
          </ul>
        </div>

        {/* Section 3: Liens Rapides */}
        <div>
          <h4 className="font-semibold text-gray-100 mb-4">Liens Rapides</h4>
          <ul className="space-y-2">
            <li>Formations</li>
            <li>Shopping Cart</li>
            <li>Wishlist</li>
            <li>Compare</li>
            <li>Track Order</li>
            <li>Customer Help</li>
            <li>About Us</li>
          </ul>
        </div>

        {/* Section 4: Téléchargement et Tags Populaires */}
        <div>
          <h4 className="font-semibold text-gray-100 mb-4">
            Télécharger l'App
          </h4>
          <div className="flex space-x-4 mb-6">
            <a href="#">
              <img
                src="/path/to/google-play.png"
                alt="Google Play"
                className="w-32"
              />
            </a>
            <a href="#">
              <img
                src="/path/to/app-store.png"
                alt="App Store"
                className="w-32"
              />
            </a>
          </div>

          <h4 className="font-semibold text-gray-100 mb-4">Tags Populaires</h4>
          <div className="flex flex-wrap gap-2">
            {[
              "Game",
              "iPhone",
              "TV",
              "Asus Laptops",
              "Macbook",
              "SSD",
              "Graphics Card",
              "Power Bank",
              "Smart TV",
              "Speaker",
              "Tablet",
              "Microwave",
              "Samsung",
            ].map((tag, index) => (
              <span
                key={index}
                className="bg-gray-800 text-gray-200 px-3 py-1 rounded-md text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        Design by Faust Oswald - DUBON eCommerce Website
      </div>
    </footer>
  );
};

export default Footer;
