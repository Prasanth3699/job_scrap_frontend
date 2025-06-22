import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "upload.wikimedia.org",
      },
      {
        hostname: "randomuser.me",
      },
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "avatar.iran.liara.run",
      },
    ], // Add external image domains here
  },
  webpack: (config) => {
    config.optimization.minimize = true;
    return config;
  },
};

export default nextConfig;
