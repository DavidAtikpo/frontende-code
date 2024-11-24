import React from "react";
import Image from "next/image";

const articles = [
    {
      id: 1,
      image: "/images/AI.jpg", // Remplacez par le chemin réel de l'image
      
      author: "Jean Dupont",
      date: new Date().toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }), // Date actuelle en français
      views: "1200",
      title: "Comment l'intelligence artificielle transforme notre quotidien",
      description:
        "L'intelligence artificielle (IA) est désormais omniprésente, de la reconnaissance vocale à la médecine de précision. Découvrez comment elle influence nos vies et ce que l'avenir nous réserve.",
    },
    {
      id: 2,
      image: "/images/securite.jpeg", // Remplacez par le chemin réel de l'image
      author: "Robert Martin",
      date: new Date().toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      views: "738",
      title: "Comment améliorer son quotidien grâce à la technologie",
      description:
        "De nouvelles applications et gadgets simplifient nos vies. Découvrez comment tirer parti de la technologie pour organiser vos tâches et gagner du temps au quotidien.",
    },
    {
      id: 3,
      image: "/images/technologie.jpg", // Remplacez par le chemin réel de l'image
      author: "Arlène Dubois",
      date: new Date().toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      views: "826",
      title: "L'importance de la sécurité numérique dans notre monde connecté",
      description:
        "Dans un monde où tout est connecté, protéger ses données est essentiel. Apprenez les bases de la cybersécurité pour sécuriser vos informations personnelles.",
    },
  ];
  
const LatestNews = () => {
  return (
    <section className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Titre de la section */}
        <h2 className="text-2xl font-bold text-center mb-8">
          Dernière actualités
        </h2>

        {/* Liste des articles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white shadow-md  overflow-hidden"
            >
              {/* Image de l'article */}
              <Image
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover"
                width={10}
                height={10}
              />

              {/* Contenu de l'article */}
              <div className="p-4">
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <span className="flex items-center mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 2a6 6 0 106 6 6 6 0 00-6-6zM2 17a8 8 0 0116 0z" />
                    </svg>
                    {article.author}
                  </span>
                  <span className="flex items-center mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6z" />
                    </svg>
                    {article.date}
                  </span>
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 3a7 7 0 100 14 7 7 0 000-14z" />
                    </svg>
                    {article.views}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {article.description}
                </p>
               <strong> <a
                  href="#"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium border border-1"
                >
                  LIRE PLUS &rarr;
                </a></strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
