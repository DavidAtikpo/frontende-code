import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Active strict mode pour trouver des bugs potentiels
  images: {
    domains: ['cdn-icons-png.flaticon.com','via.placeholder.com', ], // Autorise les domaines pour `next/image`
  },
  async redirects() {
    return [
      {
        source: '/old-route',
        destination: '/new-route',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
