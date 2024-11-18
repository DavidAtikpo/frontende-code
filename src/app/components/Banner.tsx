const Banner = () => {
    return (
      <section className="bg-peach-100 p-10 rounded-lg flex justify-between items-center max-w-7xl mx-auto">
        {/* Texte de la bannière */}
        <div className="flex-1">
          <div className="bg-blue-800 text-white px-4 py-1 rounded-full inline-block mb-4 text-sm">
            SAVE UP TO $200.00
          </div>
          <h2 className="text-4xl font-bold mb-2">PUBLICITÉ</h2>
          <p className="text-gray-600 mb-6">Description</p>
          <button className="bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">
            PAYER MAINTENANT →
          </button>
        </div>
  
        {/* Image du produit */}
        <div className="relative flex-1 flex justify-center">
          <img
            src="/images/banna2.jpg" // Assurez-vous que l'image existe dans public/images
            alt="Publicité"
            className="w-[400px] max-h-[350px]  object-contain rounded-lg"
          />
          {/* Cercle pour le prix */}
          <div className="absolute top-0 left-20 bg-Primary border-2 border-white text-gray-800 font-bold text-sm px-4 py-6 rounded-full radius-1000">
            $1900
          </div>
        </div>
      </section>
    );
  };
  
  export default Banner;
  