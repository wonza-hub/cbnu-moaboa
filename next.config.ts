import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**/*.cbnu.ac.kr",
      },
      {
        protocol: "https",
        hostname: "**/*.chungbuk.ac.kr",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
