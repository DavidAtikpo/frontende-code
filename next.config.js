/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['dubon-server.onrender.com', 'dubon-server.vercel.app', 'localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dubon-server.onrender.com',
      },
      {
        protocol: 'https',
        hostname: 'dubon-server.vercel.app',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
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
  },
};

module.exports = nextConfig; 