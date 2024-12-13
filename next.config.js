/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'dubon-server.onrender.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dubon-server.onrender.com',
        pathname: '/**',
      }
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
    return config;
  },
};

module.exports = nextConfig; 