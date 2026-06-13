import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "@napi-rs/canvas", "pdf2json"],
  allowedDevOrigins: ['192.168.1.14']
};

export default nextConfig;
