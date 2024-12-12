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
        hostname: 'allegiance-educare.in',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.asp.events',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.alikuyedirect.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.maspatule.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'camo.envatousercontent.com',
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
        hostname: 'autoecolebertili.com',
        pathname: '/**',
      },

      {
        protocol: 'https',
        hostname: 'www.step-services.be',
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
      {
        protocol: 'https',
        hostname: 'dubon-server.vercel.app', 
        pathname: '/**', 
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://dubon-server.onrender.com*', // Proxy vers votre API
      },
    ];
  },
};

module.exports = nextConfig;
