const TopBanner = () => {
    return (
      <div className="bg-black text-white flex justify-between items-center px-6 py-2">
        <span className="text-yellow-400 font-bold">Black Friday</span>
        <span className="text-sm">Up to <span className="font-bold text-blue-400">59% OFF</span></span>
        <button className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-500 transition">
          Acheter Maintenant →
        </button>
      </div>
    );
  };
  
  export default TopBanner;
  