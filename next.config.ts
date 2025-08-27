import type { NextConfig } from "next";

// Configure basePath/assetPrefix for GitHub Pages when env PUBLIC_BASE_PATH is set
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  // Static export for GH Pages
  output: "export",
};

export default nextConfig;
