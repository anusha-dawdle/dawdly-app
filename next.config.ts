import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // local PNGs with spaces in filenames
  },
};

export default nextConfig;
