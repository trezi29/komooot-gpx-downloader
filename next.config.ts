import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // remotePatterns: [new URL('https://tourpic-vector.maps.komoot.net/**')],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tourpic-vector.maps.komoot.net',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
