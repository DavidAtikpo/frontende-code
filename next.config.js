/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      '127.0.0.1',
      'api.dubonservice.com',
      'dubonservice.com'
    ],
    remotePatterns: [
      {
        protocol: process.env.NODE_ENV === 'production' ? 'https' : 'http',
        hostname: process.env.NODE_ENV === 'production' ? 'api.dubonservice.com' : 'localhost',
        port: process.env.NODE_ENV === 'production' ? '' : '5000',
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