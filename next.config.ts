import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.109", "192.168.0.119"],
  async redirects() {
    return [
      {
        source: "/ater-socio",
        destination: "/ater-sociobio",
        permanent: false,
      },
      {
        source: "/ater-socio/:path*",
        destination: "/ater-sociobio/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
