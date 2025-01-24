/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['dubon-server.onrender.com', 'dubonservice.com', 'www.dubonservice.com', 'localhost', 'res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'dubon-server.onrender.com',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dubonservice.com',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'dubonservice.com',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.dubonservice.com',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/dubonservice/**',
      }
    ]
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://dubon-server.onrender.com',
    NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY: process.env.NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY,
    NEXT_PUBLIC_FEDAPAY_SANDBOX: process.env.NEXT_PUBLIC_FEDAPAY_SANDBOX,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    config.module.rules.push({
      test: /\.(pdf)$/i,
      type: 'asset/resource'
    });
    return config;
  }
};

module.exports = nextConfig; 