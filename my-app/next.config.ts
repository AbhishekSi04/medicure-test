import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ...other config options
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;