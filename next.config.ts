import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // remotePatterns: [new URL('https://tourpic-vector.maps.komoot.net/*')],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tourpic-vector.maps.komoot.net',
        port: '',
        pathname: '',
        search: '',
      },
    ],
    domains: ['tourpic-vector.maps.komoot.net'],
  },
};

export default nextConfig;
