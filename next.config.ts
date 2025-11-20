import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/app/layout.tsx', 
        // destination: '/pages/index.tsx', 
      },
    ]
  },
};

export default nextConfig;
