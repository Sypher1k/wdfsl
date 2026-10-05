import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone', // 👈 Add this line here to optimize for your light server
  
  images: { 
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' }, 
      { protocol: 'https', hostname: 'cdn.sanity.io' }
    ] 
  },
  
  async redirects() {
    return [
      { source: '/bank', destination: '/janashakthi-banks', permanent: true },
      { source: '/what', destination: '/what-we-do', permanent: true },
    ];
  },
};

export default nextConfig;
