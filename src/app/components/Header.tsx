import { FaShoppingCart, FaHeart, FaUser } from "react-icons/fa";

const Header = () => {
  return (
    <header className="bg-customBlue text-white py-2 px-4"> {/* Réduction des paddings */}
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <img src="/favicon.png" alt="Dubon Services" className="w-16" /> {/* Réduction de la taille du logo */}

        {/* Barre de recherche */}
        <div className="flex-1 mx-4 px-40"> {/* Réduction des marges */}
          <input
            type="text"
            placeholder="Rechercher"
            className="w-full px-3 py-1.5  border border-gray-500 text-sm" 
            // Réduction des paddings et de la taille de texte
          />
        </div>

        {/* Icônes et numéro de téléphone */}
        <div className="flex items-center space-x-3"> {/* Réduction de l'espacement */}
          <FaShoppingCart size={18} /> {/* Réduction de la taille des icônes */}
          <FaHeart size={18} />
          <FaUser size={18} />
        </div>
      </div>
    </header>
  );
};

export default Header;
