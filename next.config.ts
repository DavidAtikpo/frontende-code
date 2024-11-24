// /**
//  * @type {import('next').NextConfig}
//  */
// const nextConfig = {
//   reactStrictMode: true,
//   // images: {
//   //   domains: ['cdn-icons-png.flaticon.com', 'via.placeholder.com','localhost'], // Ajoutez vos domaines ici
//   // },

//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'localhost',
//         port: '5000',
//         pathname: '/api/product/promotions/**',
//       },
//     ],
//     domains: ['cdn-icons-png.flaticon.com', 'via.placeholder.com',],
//   },
 
//   async redirects() {
//     return [
//       {
//         source: '/uploads/:path*',
//         destination: 'http://localhost:5000/uploads/:path*',
//         permanent: true,
//       },
//     ];
//   },
// };

// module.exports = nextConfig;


/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.alikuyedirect.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'barf-naturel.fr',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.alikuyedirect.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.maspatule.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
        pathname: '/**',
      },

      {
        protocol: 'https',
        hostname: 'fitracom.com',
        pathname: '/**',
      },

      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
        pathname: '/**',
      },

      {
        protocol: 'https',
        hostname: 'p.globalsources.com',
        pathname: '/**',
      },

      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
        pathname: '/**',
      },

      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
        pathname: '/**',
      },

      {
        protocol: 'https',
        hostname: 'www.alikuyedirect',
        pathname: '/**',
      },
      
      {
        protocol: 'https',
        hostname: 'agrishopniger.com',
        pathname: '/**',
      },
      {
        protocol: 'http', // Votre backend utilise HTTP
        hostname: 'localhost', // Nom d'hôte
        port: '5000', // Port de votre serveur backend
        pathname: '/uploads/**', // Chemin d'accès aux images
      },
    ],
  },
};

module.exports = nextConfig;
