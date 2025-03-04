import React from "react";
import { 
  FaAppStore, 
  FaGooglePlay, 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn,
  // FaMapMarkerAlt,
  // FaPhone,
  FaEnvelope,
  FaClock,
  FaTiktok,
  FaYoutube
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const socialLinks = [
  { 
    Icon: FaFacebookF, 
    href: "https://www.facebook.com/profile.php?id=61551357505057",
    label: "Facebook"
  },
  { 
    Icon: FaTwitter, 
    href: "https://twitter.com/dubonservices",
    label: "Twitter"
  },
  { 
    Icon: FaInstagram, 
    href: "https://instagram.com/dubonservices",
    label: "Instagram"
  },
  // { 
  //   Icon: FaLinkedinIn, 
  //   href: "https://linkedin.com/company/dubonservices",
  //   label: "LinkedIn"
  // },
  { 
    Icon: FaYoutube, 
    href: "https://youtube.com/@dubonservices",
    label: "YouTube"
  },
  { 
    Icon: FaTiktok, 
    href: "https://www.tiktok.com/@dubonservicesevent",
    label: "TikTok"
  }
];

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-400">


      {/* Section principale du footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-4 gap-12"
        >
          {/* Section À propos */}
          <motion.div variants={itemVariants} className="space-y-6">
            <Image
              src="/logod.png"
              alt="DUBON Logo"
              width={120}
              height={100}
              className="mb-6"
            />
            <p className="text-gray-400">
              DUBON, votre partenaire de confiance pour des produits alimentaires de qualité.
            </p>
            <div className="space-y-4">
              {/* <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-blue-500" />
                <span>123 Rue du Commerce, Contonou</span>
              </div> */}
              {/* <div className="flex items-center gap-3">
                <FaPhone className="text-blue-500" />
                <span>+221 77 123 45 67</span>
              </div> */}
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-blue-500" />
                <span>contact@dubon.com</span>
              </div>
              <div className="flex items-center gap-3">
                <FaClock className="text-blue-500" />
                <span>Lun-Sam: 8h-20h</span>
              </div>
            </div>
          </motion.div>

          {/* Section Meilleures Ventes */}
          <motion.div variants={itemVariants}>
            <h4 className="text-xl font-bold text-white mb-6">Meilleures Ventes</h4>
            <ul className="space-y-4">
              {[
                "Poulets Congelés",
                "Poissons Congelés",
                "Viande de Bœuf",
                "Crevettes",
                "Fruits de Mer",
              ].map((item, index) => (
                <li key={index}>
                  <Link 
                    href={`/products/${item.toLowerCase().replace(/ /g, "-")}`}
                    className="hover:text-blue-500 transition-colors flex items-center gap-2"
                  >
                    <span className="text-blue-500">›</span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Section Liens Rapides */}
          <motion.div variants={itemVariants}>
            <h4 className="text-xl font-bold text-white mb-6">Liens Rapides</h4>
            <ul className="space-y-4">
              {[
                { name: "Documentation", link: "/docs/guide" },
                { name: "Aide & Support", link: "/help" },
                { name: "À propos", link: "/about" },
                { name: "Politique de confidentialité", link: "/privacy-policy" },
                { name: "Conditions d'utilisation", link: "/terms" },
              ].map((item, index) => (
                <li key={index}>
                  <Link 
                    href={item.link}
                    className="hover:text-blue-500 transition-colors flex items-center gap-2"
                  >
                    <span className="text-blue-500">›</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Section Application & Tags */}
          <motion.div variants={itemVariants}>
            <h4 className="text-xl font-bold text-white mb-6">Notre Application</h4>
            <div className="flex gap-4 mb-8">
              <Link 
                href="https://play.google.com/store/apps/details?id=com.ebonservice.app"
                className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors"
                target="_blank"
              >
                <FaGooglePlay className="text-2xl text-white" />
              </Link>
              <Link 
                href="https://www.apple.com/app-store"
                className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors"
                target="_blank"
              >
                <FaAppStore className="text-2xl text-white" />
              </Link>
            </div>

            <h4 className="text-xl font-bold text-white mb-4">Suivez-nous</h4>
            <div className="flex gap-1">
              {socialLinks.map(({ Icon, href, label }) => (
                <Link 
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-1 rounded-lg hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110"
                >
                  <Icon className="text-xl" />
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} DUBON eCommerce. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy-policy" className="text-sm text-gray-500 hover:text-blue-500 transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="/terms" className="text-sm text-gray-500 hover:text-blue-500 transition-colors">
                Conditions d'utilisation
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
