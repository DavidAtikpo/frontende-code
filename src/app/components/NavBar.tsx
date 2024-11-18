"use client";

import React, { useState, useEffect } from "react";
import { FaPhoneAlt } from "react-icons/fa"; // Importer l'icône de téléphone

const NavigationBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/categories"); // Remplacez par l'URL réelle de votre API backend
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data.categories); // Assurez-vous que l'API renvoie un tableau `categories`
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <nav className="bg-white shadow-md py-2">
      <ul className="max-w-7xl mx-auto flex justify-between items-center text-sm space-x-4 px-6">
        {/* Dropdown for Catégories */}
        <li
          className="relative"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <button
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none"
          >
            <span>Catégories</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute left-0 top-full bg-white shadow-lg rounded mt-2 w-64 z-10">
              {isLoading ? (
                <p className="text-center py-2">Chargement...</p>
              ) : error ? (
                <p className="text-center py-2 text-red-500">Erreur : {error}</p>
              ) : (
                <ul className="text-gray-700">
                  {categories.map((category, index) => (
                    <li
                      key={index}
                      className="hover:bg-gray-100 px-4 py-2 cursor-pointer flex items-center justify-between"
                    >
                      <span>{category}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </li>

        {/* Other navigation links */}
        <li>
          <a href="#" className="hover:underline text-gray-800">
            Événements
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline text-gray-800">
            Formations
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline text-gray-800">
            E-restaurant
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline text-gray-800">
            Services
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline text-gray-800">
            Autres
          </a>
        </li>

        {/* Téléphone */}
        <li className="flex items-center space-x-2 text-gray-800">
          <FaPhoneAlt className="text-blue-600" /> {/* Icône de téléphone */}
          <span>+229 00 00 00 00</span> {/* Numéro de téléphone */}
        </li>
      </ul>
    </nav>
  );
};

export default NavigationBar;
