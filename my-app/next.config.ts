import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ...other config options
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;