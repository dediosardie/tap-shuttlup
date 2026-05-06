import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/auth/sign-in",
        destination: "/login",
        permanent: false,
      },
      {
        source: "/auth/login",
        destination: "/login",
        permanent: false,
      },
      {
        source: "/login/demo",
        destination: "/login",
        permanent: false,
      },
      {
        source: "/demo",
        destination: "/ardie",
        permanent: false,
      },
      {
        source: "/tap/demo",
        destination: "/ardie",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "api.qrserver.com" },
    ],
  },
};

export default nextConfig;
