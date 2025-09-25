import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standard Next.js configuration for Vercel deployment
  images: {
    domains: ['localhost'],
  },
  devIndicators: false,
};

export default nextConfig;
