import type { NextConfig } from "next";

const getAllowedOrigins = () => {
  if (process.env.NODE_ENV === "development") {
    const envOrigins = process.env.ALLOWED_DEV_ORIGINS;
    if (envOrigins) return envOrigins.split(",").map((origin) => origin.trim());
    return ["localhost", "127.0.0.1", "192.168.1.*"];
  }

  return (
    process.env.ALLOWED_ORIGINS?.split(",").map((origin) => origin.trim()) ?? []
  );
};

const nextConfig: NextConfig = {
  allowedDevOrigins: getAllowedOrigins(),
  images: {
    qualities: [25, 50, 75, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
