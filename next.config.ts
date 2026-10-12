import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }, { protocol: 'https', hostname: 'cdn.sanity.io' }] },
  outputFileTracingIncludes: { '/janashakthi-banks': ['./src/data/summary/*.csv'] },
  async redirects() {
    return [
      { source:'/bank', destination:'/janashakthi-banks', permanent:true },
      { source:'/what', destination:'/what-we-do', permanent:true },
    ];
  },
};
export default nextConfig;
