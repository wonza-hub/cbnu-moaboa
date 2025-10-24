import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.cbnu.ac.kr",
      },
      {
        protocol: "https",
        hostname: "www.cieat.chungbuk.ac.kr",
      },
    ],
  },
};

export default nextConfig;
