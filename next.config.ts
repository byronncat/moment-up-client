import type { NextConfig } from "next";

// Dynamic origins configuration
const getAllowedOrigins = (): string[] => {
  // In development, allow any local IP in 192.168.1.x range
  if (process.env.NODE_ENV === "development") {
    // You can set specific IPs via environment variable: ALLOWED_DEV_ORIGINS="192.168.1.12,192.168.1.10"
    const envOrigins = process.env.ALLOWED_DEV_ORIGINS;
    if (envOrigins) {
      return envOrigins.split(",").map(origin => origin.trim());
    }
    
    // Default: allow common development origins
    return [
      "localhost",
      "127.0.0.1",
      "192.168.1.*", // You'll need to handle this pattern in your origin validation logic
    ];
  }
  
  // In production, use environment variable or empty array
  return process.env.ALLOWED_ORIGINS?.split(",").map(origin => origin.trim()) || [];
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
      test: /\.(mp3)$/,
      type: "asset/resource",
      generator: {
        filename: "static/media/[name][ext]",
      },
    });

    return config;
  },
};

export default nextConfig;
