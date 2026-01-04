import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  /* config options here */
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

// export default pwaConfig(nextConfig);
export default nextConfig;
