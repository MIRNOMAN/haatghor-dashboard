import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://haatghor-server.vercel.app/api/v1/:path*",
      },
    ];
  },
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
};

export default nextConfig;
