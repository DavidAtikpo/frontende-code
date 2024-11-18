const ProductSlider = () => {
    return (
      <section className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Produit principal */}
        <div className="col-span-2 bg-gray-100 p-6 rounded-lg relative flex items-center">
          <div>
            <h3 className="text-blue-700 font-semibold uppercase">L'endroit pour tout avoir</h3>
            <h2 className="text-3xl font-bold my-2">Poissons congelées</h2>
            <p className="text-sm text-gray-700 mb-4">
              Save up to 50% on select Xbox games. Get 3 months of PC Game Pass for $2 USD.
            </p>
            <button className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-500 transition">
              ACHETER MAINTENANT →
            </button>
          </div>
          <img
            src="/images/poisson congele.jpg"
            alt="Poissons congelées"
            className="absolute right-6 top-6 w-1/2 h-auto rounded-lg object-cover"
          />
          <div className="absolute top-6 right-6 bg-blue-700 text-white py-1 px-3 rounded-full">
            1500 FCFA
          </div>
        </div>
  
        {/* Offres secondaires */}
        <div className="space-y-6">
          {/* Carte 1 */}
          <div className="bg-black text-white p-6 rounded-lg relative">
            <div className="absolute top-4 right-4 bg-yellow-400 text-black text-xs px-2 py-1 rounded">
              29% -
            </div>
            <h3 className="text-yellow-400 uppercase">Grosses Offres</h3>
            <h4 className="font-bold text-xl mt-2">Nouveaux Produits</h4>
            <img
              src="/images/produit.jpg"
              alt="Nouvel Produit"
              className="mt-4 rounded-lg object-cover w-full"
            />
            <button className="bg-yellow-400 text-black px-4 py-2 rounded mt-4 hover:bg-yellow-500 transition">
              ACHETER →
            </button>
          </div>
          {/* Carte 2 */}
          <div className="bg-white text-black p-6 rounded-lg">
            <h4 className="font-bold text-lg mb-2">Viandes</h4>
            <img
              src="/images/viande.jpg"
              alt="Viandes"
              className="rounded-lg object-cover w-full"
            />
            <p className="text-gray-600 mt-4">$299 USD</p>
            <button className="bg-blue-700 text-white px-4 py-2 rounded mt-4 hover:bg-blue-500 transition">
              ACHETER →
            </button>
          </div>
        </div>
      </section>
    );
  };
  
  export default ProductSlider;
  