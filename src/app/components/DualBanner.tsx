// import Image from "next/image";

const DualBanner = () => {
    return (
      <section className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Première Bannière */}
        <div className="bg-gray-100 p-8 rounded-lg flex items-center gap-6">
          <div className="flex-1">
            <span className="text-blue-800 font-bold text-sm uppercase">
              Découvrez
            </span>
            <h2 className="text-3xl font-bold mt-2 mb-4">New Apple Homepod Mini</h2>
            <p className="text-gray-600 mb-6">
              Jam-packed with innovation, HomePod mini delivers unexpectedly.
            </p>
            <button className="bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">
              SHOP NOW →
            </button>
          </div>
          {/* <Image
            src="/images/homepod.jpg" // Remplacez par le chemin de votre image
            alt="Apple Homepod Mini"
            className="w-40 h-auto object-cover"
          /> */}
        </div>
  
        {/* Deuxième Bannière */}
        <div className="bg-gray-900 text-white p-8 rounded-lg flex items-center gap-6">
          <div className="flex-1">
            <span className="bg-yellow-500 text-gray-900 font-bold text-sm px-2 py-1 rounded-md uppercase">
              Nouvelle Sortie
            </span>
            <h2 className="text-3xl font-bold mt-2 mb-4">Le Monde numerique</h2>
            <p className="text-gray-400 mb-6">
              *Data provided by internal laboratories. Industry measurement.
            </p>
            <button className="bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">
              SHOP NOW →
            </button>
          </div>
          <div className="relative">
            {/* <Image
              src="" // Remplacez par le chemin de votre image
              alt="Xiaomi Mi 11 Ultra"
              className="w-80 h-auto object-cover"
            /> */}
            <div className="absolute top-0 right-0 bg-blue-800 text-white px-4 py-2 text-sm rounded-full">
              590
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default DualBanner;
  