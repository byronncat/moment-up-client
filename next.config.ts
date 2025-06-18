import type { NextConfig } from "next";

const getAllowedOrigins = (): string[] => {
  if (process.env.NODE_ENV === "development") {
    const envOrigins = process.env.ALLOWED_DEV_ORIGINS;
    if (envOrigins) return envOrigins.split(",").map((origin) => origin.trim());
    return ["localhost", "127.0.0.1", "192.168.1.*"];
  }

  return (
    process.env.ALLOWED_ORIGINS?.split(",").map((origin) => origin.trim()) || []
  );
};

const nextConfig: NextConfig = {
  allowedDevOrigins: getAllowedOrigins(),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp3|mp4)$/,
      type: "asset/resource",
      generator: {
        filename: "static/media/[name][ext]",
      },
    });

    return config;
  },
};

export default nextConfig;
