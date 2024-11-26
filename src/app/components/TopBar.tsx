// import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
// const TikTokIcon = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 24 24"
//     fill="currentColor"
//     className="w-5 h-5"
//   >
//     <path d="M10 0h4v7h2V0h4v8a8 8 0 0 1-8-8h-2v13.34a2.66 2.66 0 1 1-2-2.58V0z" />
//   </svg>
// );
// const TopBar = () => {
//   return (
//     <div className="bg-customBlue text-white py-2 px-6">
//       <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
//         {/* Texte de gauche */}
//         <span className="text-lg font-bold">DUBON</span>
//         {/* Liens sociaux et "Nous contacter" */}
//         <div className="flex items-center space-x-4">
//           <a
//             href="https://facebook.com"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="hover:text-yellow-400"
//           >
//             <FaFacebookF />
//           </a>
//           <a
//             href="https://twitter.com"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="hover:text-yellow-400"
//           >
//             <FaTwitter />
//           </a>
//           <a
//             href="https://instagram.com"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="hover:text-yellow-400"
//           >
//             <FaInstagram />
//           </a>
//           <a
//             href="https://youtube.com"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="hover:text-yellow-400"
//           >
//             <FaYoutube />
//           </a>
//           <a
//             href="https://tiktok.com"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="hover:text-yellow-400"
//           >
//             <TikTokIcon />
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TopBar;


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
          {/* Icône TikTok depuis le fichier SVG */}
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-400"
          >
            <img
              src="/tiktok-svgrepo-com.png" // Chemin relatif dans le dossier public
              alt="TikTok"
              className="w-5 h-5"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
