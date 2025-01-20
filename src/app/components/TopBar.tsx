


import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import Image from "next/image";

const TopBar = () => {
  return (
    <div className="bg-customBlue text-white px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
        {/* Texte de gauche */}
        <span className="text-lg font-bold">E-BON SERVICES</span>

        {/* Liens sociaux et "Nous contacter" */}
        <div className="flex items-center space-x-4">
          <a
            href="https://www.facebook.com/profile.php?id=61551357505057"
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
          {/* Icône TikTok depuis le fichier SVG */}
          <a
            href="https://www.tiktok.com/@dubonservicesevent"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-400"
          >
            <Image
              src="/tiktok-svgrepo-com.png" // Chemin relatif dans le dossier public
              alt="TikTok"
              className="w-5 h-5"
              width={64}
              height={64}
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
