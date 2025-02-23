import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "upload.wikimedia.org",
      "randomuser.me",
      "images.unsplash.com",
      "avatar.iran.liara.run",
    ], // Add external image domains here
  },
};

export default nextConfig;
