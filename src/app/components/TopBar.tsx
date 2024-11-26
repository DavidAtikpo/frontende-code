import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const TopBar = () => {
  return (
    <div className="bg-customBlue text-white py-2 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
        {/* Texte de gauche */}
        <span className="text-lg font-bold">DUBON</span>
        {/* Liens sociaux et "Nous contacter" */}
        <div className="flex items-center space-x-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-400"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-400"
          >
            <FaTwitter />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-400"
          >
            <FaInstagram />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-400"
          >
            <FaYoutube />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
